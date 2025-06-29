import React, { useState, useEffect } from "react";
import { GoChevronLeft, GoChevronRight } from "react-icons/go";
import { LuEye } from "react-icons/lu";
import Dropdown from "../../../components/Dropdown";
import PurchaseInvoiceTable from "../../../components/PurchaseInvoiceTable";
import { toast } from "react-toastify";
import { purchaseInvoiceApi } from "./PurchaseInvoiceApi";
import { hasPermission } from "../sections/CoreSettings";


interface Invoice {
  _id: string;
  sno: number;
  piId: string;
  dateReceiving: string;
  supplierCompanyName: {
    companyName: string;
    _id: string;
  };
  totals: {
    debit: number;
    balance: number;
  };
  status: string;
}

const getUserRole = () => {
  let role = localStorage.getItem("role");
  if (!role) {
    role = sessionStorage.getItem("role");
  }
  return role;
};

const PurchaseInvoice = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [purchaseInvoiceData, setPurchaseInvoiceData] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [summaryData, setSummaryData] = useState({
    debit: 0,
    credit: 0,
    balance: 0,
  });


  // Permission variables add
  const userRole = getUserRole();
  const isAdmin = userRole === "Admin" || userRole === "SuperAdmin";
  const canCreate = isAdmin || hasPermission("Inventory", "create");
  const canUpdate = isAdmin || hasPermission("Inventory", "update");
  const canDelete = isAdmin || hasPermission("Inventory", "delete");

  // Fetch purchase invoices on component mount
  useEffect(() => {
    fetchPurchaseInvoices();
  }, []);

  // useEffect(() => {
  //   if (!canCreate) {
  //     toast.error("You don't have permission to create product Purchase Invoice");
  //   }
  // }, [canCreate]);

  const fetchPurchaseInvoices = async () => {
    try {
      setLoading(true);
      const response = await purchaseInvoiceApi.getAllPurchaseInvoices();

      if (response.success) {
        console.log('DAAATAAA', response.data);

        // Transform API data to match table format
        const transformedData = response.data.map(
          (invoice: any, index: number) => ({
            _id: invoice._id,
            sno: index + 1,
            invoice: invoice.piId,
            invoiceDate: new Date(invoice.dateReceiving).toLocaleDateString(
              "en-GB",
              {
                day: "2-digit",
                month: "short",
                year: "numeric",
              }
            ),
            supplier: invoice.supplierCompanyName?.companyName || "N/A",
            debit: invoice.totals?.debit || 0,
            credit: invoice.totals?.credit || 0,
            balance: invoice.totals?.balance || 0,
            status: invoice.status,
            returnStatus: invoice.returnStatus,
            originalData: invoice, // Keep original data for detailed operations
          })
        );

        setPurchaseInvoiceData(transformedData);

        // Set summary data
        setSummaryData({
          debit: response.allPurchaseInvoiceDebit || 0,
          credit: response.allPurchaseInvoiceCredit || 0,
          balance: response.allPurchaseInvoiceBalance || 0,
        });
      }
    } catch (error) {
      console.error("Error fetching purchase invoices:", error);
      toast.error("Failed to load purchase invoices");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (row: any) => {
    try {
      // Fetch detailed invoice data
      const detailResponse = await purchaseInvoiceApi.getPurchaseInvoiceById(
        row._id
      );
      setSelectedUser(detailResponse.data);
      // You can open edit modal here
    } catch (error) {
      console.error("Error fetching invoice details:", error);
    }
  };

  const handleDelete = async (row: any) => {
    try {
      await purchaseInvoiceApi.deletePurchaseInvoice(row._id);
      // Refresh the data after successful deletion
      await fetchPurchaseInvoices();
    } catch (error) {
      console.error("Error deleting invoice:", error);
    }
  };

  const columns = [
    { header: "S No", accessor: "sno" },
    { header: "Invoice", accessor: "invoice" },
    { header: "Invoice Date", accessor: "invoiceDate" },
    { header: "Supplier", accessor: "supplier" },
    { header: "Debit ($)", accessor: "debit" },
    { header: "Credit ($)", accessor: "credit" },
    { header: "Balance ($)", accessor: "balance" },
    { header: "Status", accessor: "status" },
    { header: "Return Status", accessor: "returnStatus" },
    { header: "Actions", accessor: "actions" },
  ];

  if (loading) {
    return (
      <div className="mx-auto px-3 py-6 sm:px-4 md:px-6 xl:px-8 xl:py-6 w-full">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto px-3 py-6 sm:px-4 md:px-6 xl:px-8 xl:py-6 w-full">
      <PurchaseInvoiceTable
        columns={columns}
        data={purchaseInvoiceData}
        tableTitle="January"
        summaryData={summaryData}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onRefresh={fetchPurchaseInvoices}
        canUpdate={canUpdate}
        canDelete={canDelete}
        canCreate={canCreate}
      />
    </div>
  );
};

export default PurchaseInvoice;
