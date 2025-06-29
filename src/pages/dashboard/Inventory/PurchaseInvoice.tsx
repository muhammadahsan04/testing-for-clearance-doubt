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

  // useEffect(() => {
  //   if (!canCreate) {
  //     toast.error("You don't have permission to create product Purchase Invoice");
  //   }
  // }, [canCreate]);

  const columns = [
    { header: "S No", accessor: "sno" },
    { header: "Invoice", accessor: "invoice" },
    { header: "Invoice Date", accessor: "invoiceDate" },
    { header: "Supplier", accessor: "supplier" },
    { header: "Debit ($)", accessor: "debit" },
    { header: "Credit ($)", accessor: "credit" },
    { header: "Balance ($)", accessor: "balance" },
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
