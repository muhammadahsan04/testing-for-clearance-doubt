import { useEffect, useState } from "react";
import axios from "axios";
import GenericTable from "../../../components/UserTable";
import { toast } from "react-toastify";
import { StatCard } from "./OverAll";
import { useNavigate } from "react-router-dom";

interface Column {
  header: string;
  accessor: string;
  type?: "text" | "image" | "status" | "actions";
}

// Helper function to get user role
const getUserToken = () => {
  let token = localStorage.getItem("token");
  if (!token) {
    token = sessionStorage.getItem("token");
  }
  return token;
};
const Admin: React.FC = () => {
  // Add these state variables
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const columns: Column[] = [
    { header: "User ID", accessor: "id" },
    { header: "Name", accessor: "name", type: "image" },
    { header: "Role", accessor: "role" },
    { header: "Status", accessor: "status", type: "status" },
    { header: "Last Login", accessor: "date" },
    { header: "Actions", accessor: "actions", type: "actions" },
  ];

  // Add this function to fetch admin users
  const fetchAdminUsers = async () => {
    try {
      setLoading(true);
      const API_URL =
        import.meta.env.VITE_BASE_URL || "http://192.168.100.18:9000";
      const token = getUserToken();

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
        const usersData = response.data.data || [];
        console.log("response.data.data", response.data.data);
        // Filter only admin users
        // Filter only admin users
        const validAdminRoles = ["admin", "Admin"];

        const adminUsers = usersData.filter((user: any) =>
          validAdminRoles.includes(user.role?.name?.toLowerCase())
        );
        setUsers(adminUsers);
        console.log("Sales users:", adminUsers);
      } else {
        setError("Failed to fetch admins");
        toast.error("Failed to fetch admin users");
      }
    } catch (err) {
      setError("Error fetching admins data");
      console.error("Error fetching admin users:", err);
      toast.error("An error occurred while fetching admin users");
    } finally {
      setLoading(false);
    }
  };

  // Add useEffect to fetch data
  useEffect(() => {
    fetchAdminUsers();
  }, []);
  const navigate = useNavigate();
  // Transform the real data instead of using static adminData
  const formattedAdminUsers = users.map((user, index) => ({
    id: user._id,
    userId: user.userId,
    name: `${user.firstName} ${user.lastName}`,
    userImage: user.profileImage,
    role: user.role?.name || "No Role",
    status: user.status === "active" ? "Active" : "Inactive",
    date: new Date(user.createdAt).toLocaleDateString("en-GB") || "N/A",
  }));

  return (
    <div className="mx-auto px-3 py-6 sm:px-4 md:px-6 xl:px-8 xl:py-6 w-full">
      <h2 className="Source-Sans-Pro-font font-semibold text-[#5D6679] text-[20px] mb-2">
        <span
          onClick={() =>
            navigate("/dashboard/user-management/overall", { replace: true })
          }
          className="cursor-pointer"
        >
          User Management
        </span>{" "}
        / <span className="text-black">Admin</span>
      </h2>
      {/* Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 bg-white shadow rounded-xl p-4 mt-2 mb-10">
        <StatCard
          label="Total Users"
          value="2500"
          textColor="text-orange-400"
        />
        <StatCard
          label="Active Users"
          value="1800"
          textColor="text-green-400"
        />
        <StatCard
          label="Inactive Users"
          value="150"
          textColor="text-purple-500"
        />
        <StatCard label="Admins" value="5" textColor="text-red-400" />
      </div>
      {/* // Replace the GenericTable data prop */}

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
          data={formattedAdminUsers} // Use filtered admin data instead of adminData
          tableTitle="Admin"
          onEdit={(row) => setSelectedUser(row)}
          onDelete={(row) => {
            setSelectedUser(row);
            setShowDeleteModal(true);
          }}
          uploadedFile={uploadedFile}
          setUploadedFile={setUploadedFile}
        />
      )}
    </div>
  );
};
export default Admin;
