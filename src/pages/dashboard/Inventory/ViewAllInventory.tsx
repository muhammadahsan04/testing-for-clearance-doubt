import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import InventoryTable from "../../../components/InventoryTable";
import { StatCard } from "../userManagementSections/OverAll";
import { toast } from "react-toastify";
import axios from "axios";
import { hasPermission } from "../sections/CoreSettings";


// Helper function to get auth token
const getAuthToken = () => {
  let token = localStorage.getItem("token");
  if (!token) {
    token = sessionStorage.getItem("token");
  }
  return token;
};

interface Column {
  header: string;
  accessor: string;
  type?: "text" | "image" | "status" | "actions";
}

// getUserRole function
const getUserRole = () => {
  let role = localStorage.getItem("role");
  if (!role) {
    role = sessionStorage.getItem("role");
  }
  return role;
};

const ViewAllInventory: React.FC = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [inventoryData, setInventoryData] = useState<any[]>([]);
  const [totals, setTotals] = useState({
    totalInventory: 0,
    totalHeadOffice: 0,
    totalStore: 0,
  });
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const columns: Column[] = [
    { header: "S.No", accessor: "sno" },
    { header: "Image", accessor: "image", type: "image" },
    { header: "Barcode", accessor: "barcode" },
    { header: "Product For", accessor: "productFor" },
    { header: "Category", accessor: "category" },
    { header: "Sub Category", accessor: "subCategory" },
    { header: "Stock", accessor: "stock" },
    { header: "Location", accessor: "location" },
    { header: "Actions", accessor: "actions", type: "actions" },
  ];

  // Permission variables add
  const userRole = getUserRole();
  const isAdmin = userRole === "Admin" || userRole === "SuperAdmin";
  const canDelete = isAdmin || hasPermission("Inventory", "delete");


  // Fetch inventory data
  const fetchInventoryData = async () => {
    setLoading(true);
    try {
      const API_URL = import.meta.env.VITE_BASE_URL || "http://localhost:9000";
      const token = getAuthToken();

      if (!token) {
        toast.error("Authentication token not found. Please login again.");
        return;
      }

      const response = await axios.get(
        `${API_URL}/api/abid-jewelry-ms/inventory`,
        {
          headers: {
            "x-access-token": token,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        console.log("response.data.success", response.data.data);

        // Transform API data to match table format
        const transformedData = response.data.data.map(
          (item: any, index: number) => ({
            id: item?._id,
            sno: String(index + 1).padStart(2, "0"),
            userImage: item?.itemId?.itemImage
              ? `${API_URL}${item?.itemId?.itemImage}`
              : null,
            barcode: item?.itemId?.barcode,
            productFor: item?.itemId?.productFor.join(", "),
            category: item?.itemId?.category.name,
            subCategory: item?.itemId?.subCategory.name,
            stock: item?.stock?.toString(),
            location:
              item?.headOffice > 0 && item?.store > 0
                ? "Both"
                : item.headOffice > 0
                  ? "Head Office"
                  : "Store",
            // Store original data for modal
            originalData: item,
          })
        );

        setInventoryData(transformedData);
        setTotals(response.data.totals);
      } else {
        toast.error("Failed to fetch inventory data");
      }
    } catch (error) {
      console.error("Error fetching inventory:", error);
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message || "Failed to fetch inventory data"
        );
      } else {
        toast.error("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchInventoryData();
  }, []);

  return (
    <div className="mx-auto px-3 py-6 sm:px-4 md:px-6 xl:px-8 xl:py-6 w-full">


      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <InventoryTable
          columns={columns}
          data={inventoryData}
          eye={true}
          tableDataAlignment="zone"
          loading={loading}
          onEdit={(row) => setSelectedUser(row)}
          onDelete={(row) => {
            setSelectedUser(row);
            setShowDeleteModal(true);
          }}
          onDeleteConfirm={handleDeleteInventory}
          canDelete={canDelete}
        />
      )}
    </div>
  );
};

export default ViewAllInventory;
