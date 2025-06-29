// import React, { useState } from "react";
// import chain from "../../../assets/tops.png";
// import braclet from "../../../assets/bracelet.png";
// import noseRing from "../../../assets/noseRing.png";
// import earing from "../../../assets/earing.png";
// import ring from "../../../assets/ring.png";
// import locket from "../../../assets/locket.png";
// import { useNavigate } from "react-router-dom";
// import InventoryTable from "../../../components/InventoryTable";
// import { StatCard } from "../userManagementSections/OverAll";

// interface Column {
//   header: string;
//   accessor: string;
//   type?: "text" | "image" | "status" | "actions";
// }
// const ViewAllInventory: React.FC = () => {
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [deleteModal, setDeleteModal] = useState(false);

//   const navigate = useNavigate();

//   const columns: Column[] = [
//     { header: "S.No", accessor: "sno" },
//     { header: "Image", accessor: "image", type: "image" },
//     { header: "Barcode", accessor: "barcode" },
//     { header: "Product For", accessor: "productFor" },
//     { header: "Category", accessor: "category" },
//     { header: "Sub Category", accessor: "subCategory" },
//     { header: "Stock", accessor: "stock" },
//     { header: "Location", accessor: "location" },
//     { header: "Actions", accessor: "actions", type: "actions" },
//   ];

//   const userData = [
//     {
//       sno: "01",
//       //   name: "Matthew Wilson",
//       userImage: chain,
//       barcode: "67643875",
//       productFor: "Male",
//       category: "Necklace",
//       subCategory: "Eternal Glow",
//       stock: "05",
//       location: "Store",
//     },
//     {
//       sno: "01",
//       //   name: "Emily Thompson",
//       userImage: braclet,
//       barcode: "67643875",
//       productFor: "Female",
//       category: "Ring",
//       subCategory: "Aurora Spark",
//       stock: "100",
//       location: "Head Office",
//     },
//     {
//       sno: "01",
//       //   name: "Nicholas Young",
//       userImage: noseRing,
//       barcode: "67643875",
//       productFor: "Unisex",
//       category: "Bracelet",
//       subCategory: "Caleste Curve",
//       stock: "49",
//       location: "Store",
//     },
//     {
//       sno: "01",
//       //   name: "Sarah Martinez",
//       userImage: earing,
//       barcode: "67643875",
//       productFor: "Kids",
//       category: "Earings",
//       subCategory: "Velvet Halo",
//       stock: "53",
//       location: "Head Office",
//     },
//     {
//       sno: "01",
//       //   name: "Olivia Bennett",
//       userImage: ring,
//       barcode: "67643875",
//       productFor: "Male",
//       category: "Pendant",
//       subCategory: "Twilight Bloom",
//       stock: "64",
//       location: "Store",
//     },
//     {
//       sno: "01",
//       //   name: "Jason Brown",
//       userImage: locket,
//       barcode: "67643875",
//       productFor: "Unisexs",
//       category: "Bangle",
//       subCategory: "Ivy twist",
//       stock: "53",
//       location: "Store",
//     },
//   ];
//   return (
//     <div className="mx-auto px-3 py-6 sm:px-4 md:px-6 xl:px-8 xl:py-6 w-full">
//       {/* Stat Cards */}
//       <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 bg-white shadow rounded-xl p-4 mt-2 mb-10">
//         <StatCard
//           label="Total Inventory"
//           value="600"
//           textColor="text-orange-400"
//         />
//         <StatCard label="Headoffice" value="100" textColor="text-green-400" />
//         <StatCard label="Stores" value="500" textColor="text-purple-500" />
//         {/* <StatCard label="Admins" value="5" textColor="text-red-400" /> */}
//       </div>

//       <InventoryTable
//         columns={columns}
//         data={userData}
//         eye={true}
//         tableDataAlignment="zone"
//         // tableTitle="Users"
//         onEdit={(row) => setSelectedUser(row)} // ✅ This opens the modal
//         onDelete={(row) => {
//           setSelectedUser(row); // ✅ Use the selected user
//           setShowDeleteModal(true); // ✅ Open the delete modal
//         }}
//       />
//     </div>
//   );
// };

// export default ViewAllInventory;

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
        // console.log("response.data.success", response.data.data);

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

  // Delete inventory item
  const handleDeleteInventory = async (inventoryId: string) => {
    try {
      const API_URL = import.meta.env.VITE_BASE_URL || "http://localhost:9000";
      const token = getAuthToken();

      if (!token) {
        toast.error("Authentication token not found. Please login again.");
        return;
      }

      const response = await axios.delete(
        `${API_URL}/api/abid-jewelry-ms/deleteOneInventory/${inventoryId}`,
        {
          headers: {
            "x-access-token": token,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        toast.success("Inventory item deleted successfully!");
        // Refresh data
        fetchInventoryData();
      } else {
        toast.error(response.data.message || "Failed to delete inventory item");
      }
    } catch (error) {
      console.error("Error deleting inventory:", error);
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message || "Failed to delete inventory item"
        );
      } else {
        toast.error("An unexpected error occurred");
      }
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchInventoryData();
  }, []);

  return (
    <div className="mx-auto px-3 py-6 sm:px-4 md:px-6 xl:px-8 xl:py-6 w-full">
      {/* Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 bg-white shadow rounded-xl p-4 mt-2 mb-10">
        <StatCard
          label="Total Inventory"
          value={totals.totalInventory.toString()}
          textColor="text-orange-400"
        />
        <StatCard
          label="Headoffice"
          value={totals.totalHeadOffice.toString()}
          textColor="text-green-400"
        />
        <StatCard
          label="Stores"
          value={totals.totalStore.toString()}
          textColor="text-purple-500"
        />
      </div>

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
