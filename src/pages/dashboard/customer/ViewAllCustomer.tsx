// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import ViewAllCustomerTable from "../../../components/ViewAllCustomerTable";
// import axios from "axios";
// import { toast } from "react-toastify";
// import { StatCard } from "../userManagementSections/OverAll";
// // Import Column type from ViewAllCustomerTable
// import type { Column } from "../../../components/ViewAllCustomerTable";

// // Helper function to get auth token
// const getAuthToken = () => {
//   let token = localStorage.getItem("token");
//   if (!token) {
//     token = sessionStorage.getItem("token");
//   }
//   return token;
// };

// // type Column = {
// //   header: string;
// //   accessor: string;
// //   type?: string;
// // };

// const ViewAllCustomer: React.FC = () => {
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [deleteModal, setDeleteModal] = useState(false);
//   const [customers, setCustomers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [stats, setStats] = useState({
//     totalUsers: 0,
//     frequentBuyers: 0,
//     vip: 0,
//   });

//   const navigate = useNavigate();

//   const columns: Column[] = [
//     { header: "Id", accessor: "customerId" },
//     { header: "Name", accessor: "name", type: "image" },
//     { header: "Phone No", accessor: "phone" },
//     { header: "Email", accessor: "email" },
//     { header: "Segmentation", accessor: "segmentation" },
//     { header: "Date of birth", accessor: "dob" },
//     { header: "Actions", accessor: "actions", type: "actions" },
//   ];

//   useEffect(() => {
//     fetchCustomers();
//   }, []);

//   const fetchCustomers = async () => {
//     setLoading(true);
//     try {
//       const API_URL =
//         import.meta.env.VITE_BASE_URL || "http://192.168.100.18:9000";
//       const token = getAuthToken();

//       if (!token) {
//         toast.error("Authentication token not found. Please login again.");
//         return;
//       }

//       const response = await axios.get(
//         `${API_URL}/api/abid-jewelry-ms/getAllCustomers`,
//         {
//           headers: {
//             "x-access-token": token,
//           },
//         }
//       );

//       if (response.data.success) {
//         // Transform the data to match the expected format
//         // const transformedData = response.data.data.map((customer: any) => ({
//         //   customerId: customer.customerId,
//         //   id: customer._id,
//         //   name: `${customer.firstName} ${customer.lastName}`,
//         //   userImage: customer.profilePicture || null,
//         //   phone: customer.phone,
//         //   email: customer.email,
//         //   segmentation: customer.segmentation,
//         //   dob: new Date(customer.dob).toLocaleDateString(),
//         //   // Include original data for editing
//         //   originalData: customer,
//         // }));

//         // In the fetchCustomers function, update the date formatting:
//         // Update the transformedData mapping in fetchCustomers function:
//         const transformedData = response.data.data.map((customer: any) => ({
//           customerId: customer.customerId,
//           id: customer._id,
//           name: `${customer.firstName} ${customer.lastName}`,
//           userImage: customer.profilePicture || null,
//           phone: customer.phone,
//           email: customer.email,
//           // Transform segmentation for display
//           segmentation:
//             customer.segmentation === "vip"
//               ? "VIP"
//               : customer.segmentation === "frequentBuyers"
//               ? "Frequent Buyers"
//               : customer.segmentation,
//           dob: customer.dateOfBirth
//             ? new Date(customer.dateOfBirth).toLocaleDateString()
//             : "N/A",
//           // Include original data for editing
//           originalData: customer,
//         }));

//         setCustomers(transformedData);

//         // Calculate stats
//         const totalUsers = transformedData.length;
//         const frequentBuyers = transformedData.filter(
//           (c: any) => c.segmentation === "frequentlyBuyers"
//         ).length;
//         const vip = transformedData.filter(
//           (c: any) => c.segmentation === "vip"
//         ).length;

//         setStats({
//           totalUsers,
//           frequentBuyers,
//           vip,
//         });
//       } else {
//         toast.error(response.data.message || "Failed to fetch customers");
//       }
//     } catch (error) {
//       console.error("Error fetching customers:", error);
//       toast.error("An error occurred while fetching customers");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="mx-auto px-3 py-6 sm:px-4 md:px-6 xl:px-8 xl:py-6 w-full">
//       {/* Stat Cards */}
//       <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 bg-white shadow rounded-xl p-4 mt-2 mb-10">
//         <StatCard
//           label="Total Users"
//           value={stats.totalUsers.toString()}
//           textColor="text-orange-400"
//         />
//         <StatCard
//           label="Frequent Buyers"
//           value={stats.frequentBuyers.toString()}
//           textColor="text-green-400"
//         />
//         <StatCard
//           label="VIP"
//           value={stats.vip.toString()}
//           textColor="text-purple-500"
//         />
//       </div>

//       {loading ? (
//         <div className="flex justify-center items-center h-64">
//           <p className="text-lg">Loading customers...</p>
//         </div>
//       ) : (
//         <ViewAllCustomerTable
//           columns={columns}
//           data={customers}
//           eye={true}
//           tableTitle="View All Customer"
//           onEdit={(row) => setSelectedUser(row)}
//           onDelete={(row) => {
//             setSelectedUser(row);
//             setShowDeleteModal(true);
//           }}
//         />
//       )}
//     </div>
//   );
// };

// export default ViewAllCustomer;
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ViewAllCustomerTable from "../../../components/ViewAllCustomerTable";
import axios from "axios";
import { toast } from "react-toastify";
import { StatCard } from "../userManagementSections/OverAll";
// Import Column type from ViewAllCustomerTable
import type { Column } from "../../../components/ViewAllCustomerTable";

// Helper function to get auth token
const getAuthToken = () => {
  let token = localStorage.getItem("token");
  if (!token) {
    token = sessionStorage.getItem("token");
  }
  return token;
};

// type Column = {
//   header: string;
//   accessor: string;
//   type?: string;
// };

const ViewAllCustomer: React.FC = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    frequentBuyers: 0,
    vip: 0,
  });

  const navigate = useNavigate();

  const columns: Column[] = [
    { header: "Id", accessor: "customerId" },
    { header: "Name", accessor: "name", type: "image" },
    { header: "Phone No", accessor: "phone" },
    { header: "Email", accessor: "email" },
    { header: "Segmentation", accessor: "segmentation" },
    { header: "Date of birth", accessor: "dob" },
    { header: "Actions", accessor: "actions", type: "actions" },
  ];

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const API_URL =
        import.meta.env.VITE_BASE_URL || "http://192.168.100.18:9000";
      const token = getAuthToken();

      if (!token) {
        toast.error("Authentication token not found. Please login again.");
        return;
      }

      const response = await axios.get(
        `${API_URL}/api/abid-jewelry-ms/getAllCustomers`,
        {
          headers: {
            "x-access-token": token,
          },
        }
      );

      if (response.data.success) {
        const transformedData = response.data.data.map((customer: any) => ({
          customerId: customer.customerId,
          id: customer._id,
          name: `${customer.firstName} ${customer.lastName}`,
          userImage: customer.profilePicture || null,
          phone: customer.phone,
          email: customer.email,
          segmentation:
            customer.segmentation === "vip"
              ? "VIP"
              : customer.segmentation === "frequentBuyers"
              ? "Frequent Buyers"
              : customer.segmentation,
          dob: customer.dateOfBirth
            ? new Date(customer.dateOfBirth).toLocaleDateString()
            : "N/A",
          originalData: customer,
        }));

        setCustomers(transformedData);

        // Calculate stats
        const totalUsers = transformedData.length;
        const frequentBuyers = response.data.data.filter(
          (c: any) => c.segmentation === "frequentBuyers"
        ).length;
        const vip = response.data.data.filter(
          (c: any) => c.segmentation === "vip"
        ).length;

        setStats({
          totalUsers,
          frequentBuyers,
          vip,
        });
      } else {
        toast.error(response.data.message || "Failed to fetch customers");
      }
    } catch (error) {
      console.error("Error fetching customers:", error);
      toast.error("An error occurred while fetching customers");
    } finally {
      setLoading(false);
    }
  };

  // Add callback handlers for edit and delete
  const handleEdit = (row: any) => {
    if (row === null) {
      // This is a callback after edit is complete - refresh data
      fetchCustomers();
    } else {
      setSelectedUser(row);
    }
  };

  const handleDelete = (row: any) => {
    if (row === null) {
      // This is a callback after delete is complete - refresh data
      fetchCustomers();
    } else {
      setSelectedUser(row);
      setShowDeleteModal(true);
    }
  };

  return (
    <div className="mx-auto px-3 py-6 sm:px-4 md:px-6 xl:px-8 xl:py-6 w-full">
      {/* Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 bg-white shadow rounded-xl p-4 mt-2 mb-10">
        <StatCard
          label="Total Users"
          value={stats.totalUsers.toString()}
          textColor="text-orange-400"
        />
        <StatCard
          label="Frequent Buyers"
          value={stats.frequentBuyers.toString()}
          textColor="text-green-400"
        />
        <StatCard
          label="VIP"
          value={stats.vip.toString()}
          textColor="text-purple-500"
        />
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-lg">Loading customers...</p>
        </div>
      ) : (
        <ViewAllCustomerTable
          columns={columns}
          data={customers}
          eye={true}
          tableTitle="View All Customer"
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};
export default ViewAllCustomer;
