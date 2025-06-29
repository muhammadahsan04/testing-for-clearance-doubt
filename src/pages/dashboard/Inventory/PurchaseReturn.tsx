import React, { useEffect, useState } from "react";
import { GoChevronLeft, GoChevronRight } from "react-icons/go";
import { LuEye } from "react-icons/lu";
import Dropdown from "../../../components/Dropdown"; // apni custom dropdown ka import path correct kr lena
import PurchaseReturnTable from "../../../components/PurchaseReturnTable";
import { purchaseInvoiceApi } from "./PurchaseInvoiceApi";
import { toast } from "react-toastify";
import { hasPermission } from "../sections/CoreSettings";

interface Invoice {
  sno: number;
  invoice: string;
  invoiceDate: string;
  supplier: string;
  debit: number;
  balance: number;
}

// getUserRole function
const getUserRole = () => {
  let role = localStorage.getItem("role");
  if (!role) {
    role = sessionStorage.getItem("role");
  }
  return role;
};


const PurchaseReturn = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [summaryData, setSummaryData] = useState({
    debit: 0,
    credit: 0,
    balance: 0,
  });
  const [loading, setLoading] = useState(true);
  const [purchaseInvoiceData, setPurchaseInvoiceData] = useState<Invoice[]>([]);

  // Permission variables add
  const userRole = getUserRole();
  const isAdmin = userRole === "Admin" || userRole === "SuperAdmin";
  const canCreate = isAdmin || hasPermission("Inventory", "create");
  const canUpdate = isAdmin || hasPermission("Inventory", "update");
  const canDelete = isAdmin || hasPermission("Inventory", "delete");


  const PurchaseReturnData: Invoice[] = [
    {
      sno: 1,
      invoice: "PI-1234",
      invoiceDate: "10-Mar-2025",
      supplier: "Samaria",
      debit: 1100,
      balance: 3100,
    },
    {
      sno: 2,
      invoice: "PI-3523",
      invoiceDate: "05-Mar-2025",
      supplier: "XYZ Suppliers",
      debit: 100,
      balance: 500,
    },
    {
      sno: 3,
      invoice: "PI-4324",
      invoiceDate: "15-Mar-2025",
      supplier: "Royal Gems",
      debit: 700,
      balance: 800,
    },
    // Aur bhi rows add kar sakte ho agar chaho
  ];

  useEffect(() => {
    fetchPurchaseInvoices();
  }, []);

  const fetchPurchaseInvoices = async () => {
    try {
      setLoading(true);
      const response = await purchaseInvoiceApi.getAllPurchaseInvoices();

      if (response.success) {
        console.log("DAAATAAA", response.data);

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

  const columns = [
    { header: "S No", accessor: "sno" },
    { header: "Invoice", accessor: "invoice" },
    { header: "Invoice Date", accessor: "invoiceDate" },
    { header: "Supplier", accessor: "supplier" },
    { header: "Debit ($)", accessor: "debit" },
    { header: "Balance ($)", accessor: "balance" },
    { header: "Status", accessor: "status" },
    { header: "Return Status", accessor: "returnStatus" },
    { header: "Actions", accessor: "actions" },
  ];
  return (
    <div className="mx-auto px-3 py-6 sm:px-4 md:px-6 xl:px-8 xl:py-6 w-full">
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <PurchaseReturnTable
          columns={columns}
          data={purchaseInvoiceData}
          summaryData={summaryData}
          tableTitle="January"
          onEdit={(row) => setSelectedUser(row)} // ✅ This opens the modal
          onDelete={(row) => {
            setSelectedUser(row); // ✅ Use the selected user
            setShowDeleteModal(true); // ✅ Open the delete modal
          }}
          canUpdate={canUpdate}
          canDelete={canDelete}
          canCreate={canCreate}
        />
      )}
    </div>
  );
};

export default PurchaseReturn;
