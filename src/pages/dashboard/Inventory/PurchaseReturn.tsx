import React, { useState } from "react";
import { GoChevronLeft, GoChevronRight } from "react-icons/go";
import { LuEye } from "react-icons/lu";
import Dropdown from "../../../components/Dropdown"; // apni custom dropdown ka import path correct kr lena
import PurchaseReturnTable from "../../../components/PurchaseReturnTable";
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

  const columns = [
    { header: "S No", accessor: "sno" },
    { header: "Invoice", accessor: "invoice" },
    { header: "Invoice Date", accessor: "invoiceDate" },
    { header: "Supplier", accessor: "supplier" },
    { header: "Debit ($)", accessor: "debit" },
    { header: "Balance ($)", accessor: "balance" },
    { header: "Actions", accessor: "actions" },
  ];
  return (
    <div className="mx-auto px-3 py-6 sm:px-4 md:px-6 xl:px-8 xl:py-6 w-full">
      <PurchaseReturnTable
        columns={columns}
        data={PurchaseReturnData}
        tableTitle="January"
        onEdit={(row) => setSelectedUser(row)} // ✅ This opens the modal
        onDelete={(row) => {
          setSelectedUser(row); // ✅ Use the selected user
          setShowDeleteModal(true); // ✅ Open the delete modal
          canUpdate = { canUpdate }
          canDelete = { canDelete }
          canCreate = { canCreate }

        }}
      />
    </div>
  );
};

export default PurchaseReturn;
