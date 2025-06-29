//ye jab generic table banaunga to ye code use krunga
// import React, { useEffect, useState } from "react";
// import { useNavigate, Outlet } from "react-router-dom";
// import Button from "../../../components/Button";
// import GenericTable from "../../../components/UserTable";
// import crown from "../../../assets/crown.svg";
// import briefcase from "../../../assets/briefcase.svg";
// import deliveryPerson from "../../../assets/deliveryPerson.svg";
// import entryPerson from "../../../assets/entryPerson.svg";
// import UploadPicture from "../../../components/UploadPicture";
// import user from "../../../assets/tableuser.png";
// import second from "../../../assets/seconduser.png";
// import third from "../../../assets/thirduser.png";
// import fourth from "../../../assets/fourthuser.png";
// import fifth from "../../../assets/fifth.png";
// import axios from "axios";
// import { toast } from "react-toastify";

// interface Column {
//   header: string;
//   accessor: string;
//   type?: "text" | "image" | "status" | "actions";
// }
// const OverAll: React.FC = () => {
//   const [showModal, setShowModal] = useState(false);
//   const [roleName, setRoleName] = useState("");
//   const [isEditing, setIsEditing] = useState(false); // To track if it's Edit mode
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [deleteModal, setDeleteModal] = useState(false);
//   const [uploadedFile, setUploadedFile] = useState<File | null>(null);

//   // Add a new state for role counts
//   const [roleCounts, setRoleCounts] = useState({
//     Admin: "0",
//     "Sale Person": "0",
//     "Delivery Person": "0",
//     "Data Entry": "0",
//   });

//   const navigate = useNavigate();

//   // Add a useEffect to fetch the role counts when the component mounts
//   useEffect(() => {
//     fetchRoleCounts();
//   }, []);

//   // Helper function to get auth token
//   const getAuthToken = () => {
//     let token = localStorage.getItem("token");
//     if (!token) {
//       token = sessionStorage.getItem("token");
//     }
//     return token;
//   };

//   // Function to fetch role counts
//   const fetchRoleCounts = async () => {
//     try {
//       // setLoading(true);
//       const API_URL = import.meta.env.VITE_BASE_URL || "http://localhost:9000";
//       const token = getAuthToken();

//       if (!token) {
//         toast.error("Authentication token not found. Please login again.");
//         return;
//       }
//       const response = await axios.get(
//         `${API_URL}/api/abid-jewelry-ms/getUserCountsByRole`,
//         // "http://192.168.100.18:9000/api/abid-jewelry-ms/getUserCountsByRole",
//         {
//           headers: {
//             "x-access-token": token,
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       if (response.data.success) {
//         const counts = response.data.data;

//         // Update the role counts state with the fetched data
//         // Use default value of "0" for any roles not returned by the API
//         setRoleCounts({
//           Admin: counts["Admin"] ? counts["Admin"].toString() : "0",
//           "Sale Person": counts["Sale Person"]
//             ? counts["Sale Person"].toString()
//             : "0",
//           "Delivery Person": counts["Delivery Person"]
//             ? counts["Delivery Person"].toString()
//             : "0",
//           "Data Entry": counts["Data Entry"]
//             ? counts["Data Entry"].toString()
//             : "0",
//         });
//       } else {
//         console.error("Failed to fetch role counts:", response.data.message);
//       }
//     } catch (error) {
//       console.error("Error fetching role counts:", error);
//     }
//   };

//   const handleViewAllClick = (role: string) => {
//     if (role === "Admin") {
//       navigate("/dashboard/user-management/admin"); // Navigates to /overall/admin
//     }
//     if (role === "SalePerson") {
//       navigate("/dashboard/user-management/sales-person"); // Navigates to /overall/admin
//     }
//     if (role === "DeliveryPerson") {
//       navigate("/dashboard/user-management/delivery-person"); // Navigates to /overall/admin
//     }
//     if (role === "EntryPerson") {
//       navigate("/dashboard/user-management/entry-person"); // Navigates to /overall/admin
//     }
//     // else {
//     //   navigate(`/roles/${role.toLowerCase().replace(" ", "-")}`);
//     // }
//   };

//   const handleAddUser = () => {
//     navigate("/dashboard/user-management/add-users");
//   };
//   const columns: Column[] = [
//     { header: "User ID", accessor: "id" },
//     { header: "Name", accessor: "name", type: "image" },
//     { header: "Role", accessor: "role" },
//     { header: "Status", accessor: "status", type: "status" },
//     { header: "Last Login", accessor: "date" },
//     { header: "Actions", accessor: "actions", type: "actions" },
//   ];

//   const userData = [
//     {
//       id: "Manag-23",
//       name: "Matthew Wilson",
//       userImage: user,
//       role: "Manager",
//       status: "Active",
//       date: "11-06-2025",
//     },
//     {
//       id: "Admin-43",
//       name: "Emily Thompson",
//       userImage: second,
//       role: "Admin",
//       status: "Inactive",
//       date: "19-03-2025",
//     }
//   ];
//   return (
//     <div className="mx-auto px-3 py-6 sm:px-4 md:px-6 xl:px-8 xl:py-6 space-y-6 lg:w-[100%] xl:w-full w-full overflow-x-hidden">
//       <h2 className="Inter-font font-semibold text-[20px] mb-2">
//         Users Management
//       </h2>

//       {/* Stat Cards */}
//       <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 bg-white shadow rounded-xl p-4">
//         <StatCard
//           label="Total Users"
//           value="2500"
//           textColor="text-orange-400"
//         />
//         <StatCard
//           label="Active Users"
//           value="1800"
//           textColor="text-green-400"
//         />
//         <StatCard
//           label="Inactive Users"
//           value="150"
//           textColor="text-purple-500"
//         />
//         <StatCard label="Admins" value="5" textColor="text-red-400" />
//       </div>

//       {/* Role Group Header */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-center">
//         <h2 className="Inter-font font-bold text-[17px] text-[#48505E]">
//           Role Groups
//         </h2>
//         <div className="flex flex-wrap justify-start lg:justify-end gap-3 Source-Sans-Pro-font font-semibold text-white">
//           <button
//             className="bg-[#D03F3F] text-whit w-32 rounded "
//             onClick={() => {
//               setShowModal(true);
//               // setIsEditing(true);
//             }}
//           >
//             + Add Role
//           </button>

//           <Button
//             text="Add Users"
//             variant="border"
//             className="!bg-[#4E4FEB] border-blue-600 w-32"
//             onClick={handleAddUser}
//           />
//         </div>
//       </div>

//       {/* Role Cards */}
//       {/* <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-4 gap-4">
//         <RoleCard
//           role="Admin"
//           count="3"
//           color="bg-[#F24F7C]"
//           bg="purple"
//           icon={crown}
//           onViewAllClick={() => handleViewAllClick("Admin")}
//         />
//         <RoleCard
//           role="Salesperson"
//           count="238"
//           color="bg-[#EDC755]"
//           bg="purple"
//           icon={briefcase}
//           onViewAllClick={() => handleViewAllClick("SalesPerson")}
//         />
//         <RoleCard
//           role="Delivery Person"
//           count="12"
//           color="bg-[#33B0E0]"
//           bg="purple"
//           icon={deliveryPerson}
//           onViewAllClick={() => handleViewAllClick("DeliveryPerson")}
//         />
//         <RoleCard
//           role="Data Entry"
//           count="5"
//           color="bg-[#D67D53]"
//           bg="purple"
//           icon={entryPerson}
//           onViewAllClick={() => handleViewAllClick("EntryPerson")}
//         />
//       </div> */}

//       {/* Role Cards - Updated to use the fetched counts */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-4 gap-4">
//         <RoleCard
//           role="Admin"
//           count={roleCounts["Admin"]}
//           color="bg-[#F24F7C]"
//           bg="purple"
//           icon={crown}
//           onViewAllClick={() => handleViewAllClick("Admin")}
//         />
//         <RoleCard
//           role="Sales Person"
//           count={roleCounts["Sale Person"]}
//           color="bg-[#EDC755]"
//           bg="purple"
//           icon={briefcase}
//           onViewAllClick={() => handleViewAllClick("SalePerson")}
//         />
//         <RoleCard
//           role="Delivery Person"
//           count={roleCounts["Delivery Person"]}
//           color="bg-[#33B0E0]"
//           bg="purple"
//           icon={deliveryPerson}
//           onViewAllClick={() => handleViewAllClick("DeliveryPerson")}
//         />
//         <RoleCard
//           role="Data Entry"
//           count={roleCounts["Data Entry"]}
//           color="bg-[#D67D53]"
//           bg="purple"
//           icon={entryPerson}
//           onViewAllClick={() => handleViewAllClick("EntryPerson")}
//         />
//       </div>

//       {/* <GenericTable
//         columns={columns}
//         data={userData}
//         tableTitle="Users"
//         onEdit={(row) => setSelectedUser(row)} // ✅ This opens the modal
//         onDelete={(row) => {
//           setSelectedUser(row); // ✅ Use the selected user
//           setShowDeleteModal(true); // ✅ Open the delete modal
//         }}
//       /> */}

//       <GenericTable
//         columns={columns}
//         data={userData}
//         tableTitle="Users"
//         onEdit={(row) => setSelectedUser(row)}
//         onDelete={(row) => {
//           setSelectedUser(row);
//           setShowDeleteModal(true);
//         }}
//         uploadedFile={uploadedFile} // Add this line
//         setUploadedFile={setUploadedFile} // Add this line
//       />

//       <Outlet />

//       {/* Modal */}
//       {showModal && (
//         <UploadPicture
//           showModal={showModal}
//           setShowModal={setShowModal}
//           isEditing={isEditing}
//           setIsEditing={setIsEditing}
//           roleName={roleName}
//           setRoleName={setRoleName}
//           uploadedFile={uploadedFile}
//           setUploadedFile={setUploadedFile}
//         />
//       )}
//     </div>
//   );
// };

// export default OverAll;

// // StatCard Component
// export const StatCard = ({
//   label,
//   value,
//   textColor,
// }: {
//   label: string;
//   value: string;
//   textColor: string;
// }) => (
//   <div className="rounded-xl p-4 text-center Inter-font w-full flex flex-col gap-3 md:gap-2">
//     <p className={`text-gray-500 font-semibold text-[14px] ${textColor}`}>
//       {label}
//     </p>
//     <p className="text-[14px] font-medium text-gray-900">{value}</p>
//   </div>
// );

// // RoleCard Component
// export const RoleCard = ({
//   role,
//   count,
//   color,
//   bg,
//   icon,
//   onViewAllClick,
// }: {
//   role: string;
//   count: string;
//   color: string;
//   bg: string;
//   icon: string;
//   onViewAllClick?: () => void;
// }) => (
//   <div className="rounded-xl p-4 text-gray-700 bg-white shadow w-full">
//     <div className="flex items-center gap-3">
//       <div className="bg-[#7c7d8179] rounded-full flex items-center justify-center p-3 shrink-0">
//         <img src={icon} alt={`${role} icon`} className="w-6 h-6" />
//       </div>
//       <div className="font-medium">
//         <h4 className="text-sm text-[#535969] font-semibold">{role}</h4>
//         <p className="text-lg text-[#2B2E36]">{count}</p>
//       </div>
//     </div>
//     <Button
//       text="View all"
//       variant="border"
//       onClick={onViewAllClick}
//       className={`mt-2 text-white text-sm ${color} border-none w-full Roboto-font`}
//     />
//   </div>
// );

//ye jab generic table banaunga to ye code use krunga
import React, { useEffect, useState } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import Button from "../../../components/Button";
import GenericTable from "../../../components/UserTable";
import crown from "../../../assets/crown.svg";
import briefcase from "../../../assets/briefcase.svg";
import deliveryPerson from "../../../assets/deliveryPerson.svg";
import entryPerson from "../../../assets/entryPerson.svg";
import UploadPicture from "../../../components/UploadPicture";
import axios from "axios";
import { toast } from "react-toastify";

// Helper function to check permissions
const hasPermission = (module: string, action: string) => {
  try {
    let permissionsStr = localStorage.getItem("permissions");
    if (!permissionsStr) {
      permissionsStr = sessionStorage.getItem("permissions");
    }

    if (!permissionsStr) return false;

    const permissions = JSON.parse(permissionsStr);

    // Check if user has all permissions
    if (permissions.allPermissions || permissions.allPagesAccess) return true;

    const page = permissions.pages?.find((p: any) => p.name === module);
    if (!page) return false;

    switch (action.toLowerCase()) {
      case "create":
        return page.create;
      case "read":
        return page.read;
      case "update":
        return page.update;
      case "delete":
        return page.delete;
      default:
        return false;
    }
  } catch (error) {
    console.error("Error checking permissions:", error);
    return false;
  }
};

// Helper function to get user role
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

interface User {
  _id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  status: string;
  role: {
    _id: string;
    name: string;
  };
  profileImage?: string;
}

const OverAll: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [roleName, setRoleName] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  // User data states
  const [users, setUsers] = useState<User[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [activeUsers, setActiveUsers] = useState(0);
  const [inactiveUsers, setInactiveUsers] = useState(0);
  const [adminUsers, setAdminUsers] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Add a new state for role counts
  const [roleCounts, setRoleCounts] = useState({
    Admin: "0",
    "Sale Person": "0",
    "Delivery Person": "0",
    "Data Entry": "0",
  });

  const navigate = useNavigate();

  // Check permissions
  const userRole = getUserRole();
  const isAdmin = userRole === "Admin" || userRole === "SuperAdmin";

  // Add a useEffect to fetch the role counts and users when the component mounts
  useEffect(() => {
    // Check permissions on component mount
    if (!isAdmin && !hasPermission("User Management", "read")) {
      toast.error("You don't have permission to view users");
      navigate("/dashboard");
      return;
    }

    fetchRoleCounts();
    fetchUsers();
  }, [navigate, isAdmin]);

  // Helper function to get auth token
  const getAuthToken = () => {
    let token = localStorage.getItem("token");
    if (!token) {
      token = sessionStorage.getItem("token");
    }
    return token;
  };

  // Function to fetch users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const API_URL = import.meta.env.VITE_BASE_URL || "http://localhost:9000";
      const token = getAuthToken();

      if (!token) {
        toast.error("Authentication token not found. Please login again.");
        return;
      }

      const response = await axios.get(
        `${API_URL}/api/abid-jewelry-ms/getAllUsers`,
        {
          headers: {
            "x-access-token": token,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        // console.log("Users data:", response.data.data);
        const usersData = response.data.data || [];
        setUsers(usersData);

        // Calculate counts from the users data
        const total = usersData.length;
        const active = usersData.filter(
          (user: User) => user.status === "active"
        ).length;
        const inactive = usersData.filter(
          (user: User) => user.status === "inactive"
        ).length;

        setTotalUsers(total);
        setActiveUsers(active);
        setInactiveUsers(inactive);
      } else {
        setError("Failed to fetch users");
        toast.error(response.data.message || "Failed to fetch users");
      }
    } catch (err) {
      setError("Error fetching users data");
      console.error("Error fetching users:", err);
      toast.error("An error occurred while fetching users");
    } finally {
      setLoading(false);
    }
  };

  // Function to fetch role counts
  // const fetchRoleCounts = async () => {
  //   try {
  //     const API_URL = import.meta.env.VITE_BASE_URL || "http://localhost:9000";
  //     const token = getAuthToken();

  //     if (!token) {
  //       toast.error("Authentication token not found. Please login again.");
  //       return;
  //     }
  //     const response = await axios.get(
  //       `${API_URL}/api/abid-jewelry-ms/getUserCountsByRole`,
  //       {
  //         headers: {
  //           "x-access-token": token,
  //           "Content-Type": "application/json",
  //         },
  //       }
  //     );

  //     if (response.data.success) {
  //       const counts = response.data.data;

  //       // Update the role counts state with the fetched data
  //       setRoleCounts({
  //         Admin: counts["Admin"] ? counts["Admin"].toString() : "0",
  //         "Sale Person": counts["Sale Person"]
  //           ? counts["Sale Person"].toString()
  //           : "0",
  //         "Delivery Person": counts["Delivery Person"]
  //           ? counts["Delivery Person"].toString()
  //           : "0",
  //         "Data Entry": counts["Data Entry"]
  //           ? counts["Data Entry"].toString()
  //           : "0",
  //       });

  //       // Set admin count for stat card
  //       setAdminUsers(counts["Admin"] || 0);
  //     } else {
  //       console.error("Failed to fetch role counts:", response.data.message);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching role counts:", error);
  //   }
  // };

  // Helper function with case-insensitive and flexible matching
  const getRoleCategory = (roleName: string) => {
    const role = roleName.toLowerCase().replace(/\s+/g, ""); // Remove spaces and convert to lowercase

    if (role.includes("admin")) return "Admin";
    if (role.includes("sale") || role.includes("sales")) return "Sale Person";
    if (role.includes("delivery")) return "Delivery Person";
    if (role.includes("data") && role.includes("entry")) return "Data Entry";

    return null; // Unknown role
  };

  // Updated fetchRoleCounts function with flexible matching
  const fetchRoleCounts = async () => {
    try {
      const API_URL = import.meta.env.VITE_BASE_URL || "http://localhost:9000";
      const token = getAuthToken();

      if (!token) {
        toast.error("Authentication token not found. Please login again.");
        return;
      }

      const response = await axios.get(
        `${API_URL}/api/abid-jewelry-ms/getUserCountsByRole`,
        {
          headers: {
            "x-access-token": token,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        const counts = response.data.data;

        // Initialize counters
        const roleCounts = {
          Admin: 0,
          "Sale Person": 0,
          "Delivery Person": 0,
          "Data Entry": 0,
        };

        // Aggregate counts for all role variations
        Object.keys(counts).forEach((roleName) => {
          const category = getRoleCategory(roleName);
          if (category && roleCounts[category] !== undefined) {
            roleCounts[category] += counts[roleName];
          }
        });

        // Update the role counts state
        setRoleCounts({
          Admin: roleCounts.Admin.toString(),
          "Sale Person": roleCounts["Sale Person"].toString(),
          "Delivery Person": roleCounts["Delivery Person"].toString(),
          "Data Entry": roleCounts["Data Entry"].toString(),
        });

        // Set admin count for stat card
        setAdminUsers(roleCounts.Admin);
      } else {
        console.error("Failed to fetch role counts:", response.data.message);
      }
    } catch (error) {
      console.error("Error fetching role counts:", error);
    }
  };

  const handleViewAllClick = (role: string) => {
    if (role === "Admin") {
      navigate("/dashboard/user-management/admin");
    }
    if (role === "SalePerson") {
      navigate("/dashboard/user-management/sales-person");
    }
    if (role === "DeliveryPerson") {
      navigate("/dashboard/user-management/delivery-person");
    }
    if (role === "EntryPerson") {
      navigate("/dashboard/user-management/entry-person");
    }
  };

  const handleAddUser = () => {
    navigate("/dashboard/user-management/add-users");
  };

  // Handle user update
  const handleUpdateUser = async () => {
    // Refresh the users list to get the updated data
    await fetchUsers();
    await fetchRoleCounts();
  };

  // Handle user deletion
  const handleDeleteUser = async () => {
    // Refresh the users list to get the updated data
    await fetchUsers();
    await fetchRoleCounts();
  };

  // Check if user can add users
  const canAddUsers = () => {
    return isAdmin || hasPermission("User Management", "create");
  };

  const columns: Column[] = [
    { header: "User ID", accessor: "userId" },
    { header: "Name", accessor: "name", type: "image" },
    { header: "Role", accessor: "role" },
    { header: "Status", accessor: "status", type: "status" },
    { header: "Actions", accessor: "actions", type: "actions" },
  ];

  // Transform API data to match the format expected by UserTable
  const formattedUsers = users.map((user) => ({
    id: user._id,
    userId: user.userId,
    name: `${user.firstName} ${user.lastName}`,
    userImage: user.profileImage,
    role: user.role?.name || "No Role",
    status: user.status === "active" ? "Active" : "Inactive",
    email: user.email,
    phone: user.phone,
    firstName: user.firstName,
    lastName: user.lastName,
    originalData: user,
  }));

  return (
    <div className="mx-auto px-3 py-6 sm:px-4 md:px-6 xl:px-8 xl:py-6 space-y-6 lg:w-[100%] xl:w-full w-full overflow-x-hidden">
      <h2 className="Inter-font font-semibold text-[20px] mb-2">
        Users Management
      </h2>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 bg-white shadow rounded-xl p-4">
        <StatCard
          label="Total Users"
          value={totalUsers.toString()}
          textColor="text-orange-400"
        />
        <StatCard
          label="Active Users"
          value={activeUsers.toString()}
          textColor="text-green-400"
        />
        <StatCard
          label="Inactive Users"
          value={inactiveUsers.toString()}
          textColor="text-purple-500"
        />
        <StatCard
          label="Admins"
          value={adminUsers.toString()}
          textColor="text-red-400"
        />
      </div>

      {/* Role Group Header */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-center">
        <h2 className="Inter-font font-bold text-[17px] text-[#48505E]">
          Role Groups
        </h2>
        {/* <div className="flex flex-wrap justify-start lg:justify-end gap-3 Source-Sans-Pro-font font-semibold text-white">
          <button
            className="bg-[#D03F3F] text-whit w-32 rounded "
            onClick={() => {
              setShowModal(true);
            }}
          >
            + Add Role
          </button>

          {canAddUsers() && (
            <Button
              text="Add Users"
              variant="border"
              className="!bg-[#4E4FEB] border-blue-600 w-32"
              onClick={handleAddUser}
            />
          )}
        </div> */}
      </div>

      {/* Role Cards - Updated to use the fetched counts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-4 gap-4">
        <RoleCard
          role="Admin"
          count={roleCounts["Admin"]}
          color="bg-[#F24F7C]"
          bg="purple"
          icon={crown}
          onViewAllClick={() => handleViewAllClick("Admin")}
        />
        <RoleCard
          role="Sales Person"
          count={roleCounts["Sale Person"]}
          color="bg-[#EDC755]"
          bg="purple"
          icon={briefcase}
          onViewAllClick={() => handleViewAllClick("SalePerson")}
        />
        <RoleCard
          role="Delivery Person"
          count={roleCounts["Delivery Person"]}
          color="bg-[#33B0E0]"
          bg="purple"
          icon={deliveryPerson}
          onViewAllClick={() => handleViewAllClick("DeliveryPerson")}
        />
        <RoleCard
          role="Data Entry"
          count={roleCounts["Data Entry"]}
          color="bg-[#D67D53]"
          bg="purple"
          icon={entryPerson}
          onViewAllClick={() => handleViewAllClick("EntryPerson")}
        />
      </div>

      {/* Users Table with Loading and Error States */}
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="flex justify-center items-center h-40 text-red-500">
          <p>{error}</p>
        </div>
      ) : (
        <GenericTable
          columns={columns}
          data={formattedUsers}
          tableTitle="Users"
          onEdit={handleUpdateUser}
          onDelete={handleDeleteUser}
          canAdd={canAddUsers()}
          uploadedFile={uploadedFile}
          setUploadedFile={setUploadedFile}
        />
      )}

      <Outlet />

      {/* Modal */}
      {showModal && (
        <UploadPicture
          showModal={showModal}
          setShowModal={setShowModal}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          roleName={roleName}
          setRoleName={setRoleName}
          uploadedFile={uploadedFile}
          setUploadedFile={setUploadedFile}
        />
      )}
    </div>
  );
};

export default OverAll;

// StatCard Component
export const StatCard = ({
  label,
  value,
  textColor,
}: {
  label: string;
  value: string;
  textColor: string;
}) => (
  <div className="rounded-xl p-4 text-center Inter-font w-full flex flex-col gap-3 md:gap-2">
    <p className={`text-gray-500 font-semibold text-[14px] ${textColor}`}>
      {label}
    </p>
    <p className="text-[14px] font-medium text-gray-900">{value}</p>
  </div>
);

// RoleCard Component
export const RoleCard = ({
  role,
  count,
  color,
  bg,
  icon,
  onViewAllClick,
}: {
  role: string;
  count: string;
  color: string;
  bg: string;
  icon: string;
  onViewAllClick?: () => void;
}) => (
  <div className="rounded-xl p-4 text-gray-700 bg-white shadow w-full">
    <div className="flex items-center gap-3">
      <div className="bg-[#7c7d8179] rounded-full flex items-center justify-center p-3 shrink-0">
        <img src={icon} alt={`${role} icon`} className="w-6 h-6" />
      </div>
      <div className="font-medium">
        <h4 className="text-sm text-[#535969] font-semibold">{role}</h4>
        <p className="text-lg text-[#2B2E36]">{count}</p>
      </div>
    </div>
    <Button
      text="View all"
      variant="border"
      onClick={onViewAllClick}
      className={`mt-2 text-white text-sm ${color} border-none w-full Roboto-font`}
    />
  </div>
);
