import { useState, useEffect } from "react";
import ItemCategoryTable from "../../../components/ItemCategoryTable";
import axios from "axios";
import { toast } from "react-toastify";
import { hasPermission } from "../sections/CoreSettings";

// Helper function to get auth token
const getAuthToken = () => {
  let token = localStorage.getItem("token");
  if (!token) {
    token = sessionStorage.getItem("token");
  }
  return token;
};

// getUserRole function add
const getUserRole = () => {
  let role = localStorage.getItem("role");
  if (!role) {
    role = sessionStorage.getItem("role");
  }
  return role;
};

interface Column {
  header: string;
  accessor: string;
  type?: "text" | "image" | "status" | "actions";
}

export default function AllItemCategory() {
  const [itemsData, setItemsData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);

  const API_URL = import.meta.env.VITE_BASE_URL || "http://192.168.100.18:9000";

  // Permission variables add
  const userRole = getUserRole();
  const isAdmin = userRole === "Admin" || userRole === "SuperAdmin";
  const canDelete = isAdmin || hasPermission("Core Setting", "delete");
  const canUpdate = isAdmin || hasPermission("Core Setting", "update");
  // Fetch all items
  const fetchAllItems = async () => {
    try {
      setLoading(true);
 

  useEffect(() => {
    fetchAllItems();
  }, []);

  const columns: Column[] = [
    { header: "S.No", accessor: "sno", type: "text" },
    { header: "SKU", accessor: "sku", type: "text" },
    { header: "Barcode", accessor: "Barcode", type: "text" },
    { header: "Unit Type", accessor: "unitType", type: "text" },
    { header: "Image", accessor: "categoryImage", type: "image" },
    { header: "Product For", accessor: "productFor", type: "text" },
    { header: "Category", accessor: "category", type: "text" },
    { header: "Sub Category", accessor: "subCategory", type: "text" },
    { header: "Style", accessor: "style", type: "text" },
    // { header: "Gold Ctg", accessor: "goldCTG", type: "text" },
    // { header: "Diamond Weight", accessor: "diamondWeight", type: "text" },
    // { header: "Gold Weight", accessor: "goldWeight", type: "text" },
    // { header: "Length", accessor: "length", type: "text" },
    // { header: "MM", accessor: "mm", type: "text" },
    // { header: "Size", accessor: "size", type: "text" },
    { header: "Search Tag", accessor: "searchTag", type: "text" },
    { header: "Actions", accessor: "actions", type: "actions" },
  ];

  return (
    <div className="w-full mx-auto px-3 py-6 sm:px-4 md:px-6 xl:px-8 xl:py-6">
      {loading ? (
        <div className="text-center flex justify-center min-h-screen items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          <h1 className="text-2xl font-semibold text-gray-800 mb-6">
            All Item Categories
          </h1>

          <ItemCategoryTable
            allItem={true}
            className=""
            tableDataAlignment="zone"
            columns={columns}
            data={itemsData}
            tableTitle="All Item Categories"
            searchable={true}
            filterByStatus={true}
            canUpdate={canUpdate}
            canDelete={canDelete}
            onEdit={(row: any) => setSelectedUser(row)}
            onDelete={handleDeleteItem} // ✅ Now properly connected to the delete function
          />
        </>
      )}
    </div>
  );
}
