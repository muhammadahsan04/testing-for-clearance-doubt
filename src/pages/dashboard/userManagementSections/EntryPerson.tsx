import React, { useEffect, useState } from "react";
import { StatCard } from "./OverAll";
import { useNavigate } from "react-router-dom";
import GenericTable from "../../../components/UserTable";
import axios from "axios";
import { toast } from "react-toastify";

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

const EntryPerson: React.FC = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
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
  const fetchEntryUsers = async () => {
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

        // Filter only admin users
        const adminUsers = usersData.filter(
          (user: any) => user.role?.name === "Data Entry"
        );

        setUsers(adminUsers);
        console.log("data entry users:", adminUsers);
      } else {
        setError("Failed to fetch data entry");
        toast.error("Failed to fetch data entry users");
      }
    } catch (err) {
      setError("Error fetching data entry data");
      console.error("Error fetching data entry users:", err);
      toast.error("An error occurred while fetching data entry users");
    } finally {
      setLoading(false);
    }
  };

  // Add useEffect to fetch data
  useEffect(() => {
    fetchEntryUsers();
  }, []);
  // Transform the real data instead of using static adminData
  const formattedDataEntryUsers = users.map((user, index) => ({
    id: user._id,
    userId: user.userId,
    name: `${user.firstName} ${user.lastName}`,
    userImage: user.profileImage,
    role: user.role?.name || "No Role",
    status: user.status === "active" ? "Active" : "Inactive",
    date: new Date(user.createdAt).toLocaleDateString("en-GB") || "N/A",
  }));

  const navigate = useNavigate();
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
        / <span className="text-black">Entryperson</span>
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
          data={formattedDataEntryUsers}
          tableTitle="Delivery Person"
          onEdit={(row) => setSelectedUser(row)} // ✅ This opens the modal
          onDelete={(row) => {
            setSelectedUser(row); // ✅ Use the selected user
            setShowDeleteModal(true); // ✅ Open the delete modal
          }}
          uploadedFile={uploadedFile}
          setUploadedFile={setUploadedFile}
        />
      )}
    </div>
  );
};

export default EntryPerson;
