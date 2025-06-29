import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import UserTable from "../../../components/UserTable";
import { StatCard } from "./OverAll";
import axios from "axios";
import { toast } from "react-toastify";

// Helper function to check permissions
const hasPermission = (module: string, action: string) => {
  try {
    let permissionsStr = localStorage.getItem("permissions")
    if (!permissionsStr) {
      permissionsStr = sessionStorage.getItem("permissions")
    }

    if (!permissionsStr) return false

    const permissions = JSON.parse(permissionsStr)

    // Check if user has all permissions
    if (permissions.allPermissions || permissions.allPagesAccess) return true

    const page = permissions.pages?.find((p: any) => p.name === module)
    if (!page) return false

    switch (action.toLowerCase()) {
      case 'create':
        return page.create
      case 'read':
        return page.read
      case 'update':
        return page.update
      case 'delete':
        return page.delete
      default:
        return false
    }
  } catch (error) {
    console.error("Error checking permissions:", error)
    return false
  }
}

// Helper function to get user role
const getUserRole = () => {
  let role = localStorage.getItem("role")
  if (!role) {
    role = sessionStorage.getItem("role")
  }
  return role
}

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

interface UserResponse {
  success: boolean;
  message: string;
  data: User[];
}

interface UserCountResponse {
  success: boolean;
  message: string;
  data: {
    [key: string]: number; // Role names as keys with counts as values
  };
}

const ViewUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [activeUsers, setActiveUsers] = useState(0);
  const [inactiveUsers, setInactiveUsers] = useState(0);
  const [adminUsers, setAdminUsers] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const navigate = useNavigate();

  // Check permissions
  const userRole = getUserRole()
  const isAdmin = userRole === "Admin" || userRole === "SuperAdmin"

  useEffect(() => {
    // Check permissions on component mount
    if (!isAdmin && !hasPermission("User Management", "read")) {
      toast.error("You don't have permission to view users")
      navigate("/dashboard")
      return
    }

    fetchUsers();
    fetchUserCounts();
  }, [navigate, isAdmin]);

  // Helper function to get auth token
  const getAuthToken = () => {
    let token = localStorage.getItem("token");
    if (!token) {
      token = sessionStorage.getItem("token");
    }
    return token;
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const API_URL =
        import.meta.env.VITE_BASE_URL || "http://192.168.100.18:9000";
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
        // console.log('Users data:', response.data.data);
        const usersData = response.data.data || [];
        setUsers(usersData);

        // Calculate counts from the users data
        const total = usersData.length;
        const active = usersData.filter((user: User) => user.status === "active").length;
        const inactive = usersData.filter((user: User) => user.status === "inactive").length;

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

  const fetchUserCounts = async () => {
    try {
      const API_URL =
        import.meta.env.VITE_BASE_URL || "http://192.168.100.18:9000";
      const token = getAuthToken();

      if (!token) {
        return;
      }

      // Assuming there's an endpoint for user counts by role
      const response = await axios.get(
        `${API_URL}/api/abid-jewelry-ms/getUserCountsByRole`, // Update this endpoint as needed
        {
          headers: {
            "x-access-token": token,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        // console.log('User counts data:', response.data.data);
        const countsData = response.data.data;

        // Extract admin count from the role counts
        const adminCount = countsData["Admin"] || 0;
        setAdminUsers(adminCount);
      }
    } catch (err) {
      console.error("Error fetching user counts:", err);
      // Don't show error toast for this as it's supplementary data
    }
  };

  const columns: Column[] = [
    { header: "User Id", accessor: "userId" },
    { header: "User Name", accessor: "name", type: "image" },
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

  // Handle user update
  const handleUpdateUser = async () => {
    // Refresh the users list to get the updated data
    await fetchUsers();
    await fetchUserCounts();
  };

  // Handle user deletion
  const handleDeleteUser = async () => {
    // Refresh the users list to get the updated data
    await fetchUsers();
    await fetchUserCounts();
  };

  // Check if user can add users
  const canAddUsers = () => {
    return isAdmin || hasPermission("User Management", "create")
  }

  return (
    <div className="mx-auto px-3 py-6 sm:px-4 md:px-6 xl:px-8 xl:py-6 space-y-6 lg:w-[100%] xl:w-full w-full overflow-x-hidden">
      <h2 className="Inter-font font-semibold text-[20px] mb-2">User Management</h2>

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

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="flex justify-center items-center h-40 text-red-500">
          <p>{error}</p>
        </div>
      ) : (
        <UserTable
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
    </div>
  );
};

export default ViewUsers;
