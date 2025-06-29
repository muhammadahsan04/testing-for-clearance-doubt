import SalesInvoiceTable from "../../../components/SalesInvoiceTable";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify"; // Make sure you have react-toastify installed
import { hasPermission } from "../sections/CoreSettings";


interface Column {
  header: string;
  accessor: string;
  type?: "select" | "text" | "image" | "status" | "actions";
}

// getUserRole function
const getUserRole = () => {
  let role = localStorage.getItem("role");
  if (!role) {
    role = sessionStorage.getItem("role");
  }
  return role;
};

const SaleInvoice: React.FC = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userData, setUserData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItemsForInvoice, setSelectedItemsForInvoice] = useState<any[]>(
    []
  );

  // Add state to track selected rows
  const [selectedRows, setSelectedRows] = useState<{ [key: string]: boolean }>(
    {}
  );


  const userRole = getUserRole();
  const isAdmin = userRole === "Admin" || userRole === "SuperAdmin";
  const canCreate = isAdmin || hasPermission("Inventory", "create");
  const canUpdate = isAdmin || hasPermission("Inventory", "update");
  const canDelete = isAdmin || hasPermission("Inventory", "delete");

  // API functions
  const getAuthToken = () => {
    let token = localStorage.getItem("token");
    if (!token) {
      token = sessionStorage.getItem("token");
    }
    return token;
  };

  const API_URL = import.meta.env.VITE_BASE_URL || "http://localhost:9000";


  // Fetch data on component mount
  useEffect(() => {
    fetchAvailableItems();
  }, []);

  const handleClearSelections = () => {
    setSelectedRows({});
    setSelectedItemsForInvoice([]);
  };

  const handleRowSelect = (rowId: string) => {
    setSelectedRows((prev) => {
      const newSelectedRows = { ...prev };
      newSelectedRows[rowId] = !newSelectedRows[rowId];

      // Update selected items for invoice
      const allSelectedRowIds = Object.keys(newSelectedRows).filter(
        (id) => newSelectedRows[id]
      );


      const selectedItemsData = userData
        .filter((row) =>
          allSelectedRowIds.includes(row.originalData?.items?.itemBarcode?._id)
        )
        .map((row, index) => ({
          no: (index + 1).toString().padStart(2, "0"),
          productName: row.productName,
          userImage: row.userImage,
          stock: row.stock,
          qty: "", // Empty for user input
          costPrice: row.originalData?.items?.costPrice?.toString() || "0",
          salePrice: "", // Empty for user input
          // Use unique ID for each item
          _id:
            row.originalData?.items?.itemBarcode?._id || `${row._id}-${index}`,
          originalData: row.originalData,
          barcode: row.barcode,
        }));

      setSelectedItemsForInvoice(selectedItemsData);

      console.log("All Selected Items for Invoice:", selectedItemsData);

      return newSelectedRows;
    });
  };

  const columns: Column[] = [
    { header: "Select", accessor: "select", type: "select" },
    { header: "Barcode", accessor: "barcode" },
    { header: "PID", accessor: "pid" },
    { header: "Product Name", accessor: "productName", type: "image" },
    { header: "Stock", accessor: "stock", type: "text" },
    { header: "Status", accessor: "status", type: "status" },
  ];

  if (loading) {
    return (
      <div className="mx-auto px-3 py-6 sm:px-4 md:px-6 xl:px-8 xl:py-6 space-y-6 lg:w-[100%] xl:w-full w-full overflow-x-hidden">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto px-3 py-6 sm:px-4 md:px-6 xl:px-8 xl:py-6 space-y-6 lg:w-[100%] xl:w-full w-full overflow-x-hidden">
      <SalesInvoiceTable
        columns={columns}
        data={userData}
        tableTitle="Issue Inventory:"
        enableRowModal={false}
        selectedRows={selectedRows}
        onRowSelect={handleRowSelect}
        selectedItemsForInvoice={selectedItemsForInvoice} // Pass selected items
        onClearSelections={handleClearSelections} // Add this prop
        onEdit={(row) => setSelectedUser(row)}
        onDelete={(row) => {
          setSelectedUser(row);
          setShowDeleteModal(true);
        }}
        canCreate={canCreate}
      />
    </div>
  );
};

export default SaleInvoice;
