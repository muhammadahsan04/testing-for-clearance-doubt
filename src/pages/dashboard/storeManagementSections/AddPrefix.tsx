import React, { useState, useEffect } from "react";
import Input from "../../../components/Input";
import Button from "../../../components/Button";
import PrefixTable from "../../../components/PrefixTable";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { hasPermission } from "../sections/CoreSettings";


interface Column {
  header: string;
  accessor: string;
  type?: "text" | "image" | "status" | "actions";
}

interface PrefixData {
  id: string;
  name: string;
  status: string;
  _id?: string;
}

// getUserRole function add
const getUserRole = () => {
  let role = localStorage.getItem("role");
  if (!role) {
    role = sessionStorage.getItem("role");
  }
  return role;
};

// Helper function to get auth token
const getAuthToken = () => {
  let token = localStorage.getItem("token");
  if (!token) {
    token = sessionStorage.getItem("token");
  }
  return token;
};
const AddPrefix: React.FC = () => {
  const [prefix, setPrefix] = useState("");
  const [prefixData, setPrefixData] = useState<PrefixData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const navigate = useNavigate();

  // Permission variables add
  const userRole = getUserRole();
  const isAdmin = userRole === "Admin" || userRole === "SuperAdmin";
  const canCreate = isAdmin || hasPermission("Store Management", "create");
  const canUpdate = isAdmin || hasPermission("Store Management", "update");
  const canDelete = isAdmin || hasPermission("Store Management", "delete");

  useEffect(() => {
    if (!canCreate) {
      toast.error("You don't have permission to add prefix");
    }
  }, [canCreate]);

  // Function to fetch all prefixes
  const fetchPrefixes = async () => {
    setIsLoadingData(true);
    try {
      const API_URL = import.meta.env.VITE_BASE_URL || "http://localhost:9000";
      const token = getAuthToken();

      if (!token) {
        toast.error("Authentication token not found. Please login again.");
        return;
      }

      const response = await axios.get(
        `${API_URL}/api/abid-jewelry-ms/getAllStorePrefix`,
        {
          headers: {
            "x-access-token": token,
            "Content-Type": "application/json",
          },
        }
      );

      const data = response.data;

      if (data.success && Array.isArray(data.data)) {
        // Map the API response to our table format
        const mappedData = data.data.map((prefix: any) => ({
          id: prefix._id,
          name: prefix.prefixName,
          status: prefix.status || "active",
          _id: prefix._id,
        }));

        setPrefixData(mappedData);
        // toast.success("Prefixes loaded successfully");
      } else {
        toast.warning("No prefixes found or invalid response format");
      }
    } catch (error) {
      console.error("Error fetching prefixes:", error);

      if (axios.isAxiosError(error)) {
        if (!error.response) {
          toast.error("Network error. Please check your internet connection.");
        } else {
          toast.error(
            error.response.data.message || "Failed to fetch prefixes"
          );
        }
      } else {
        toast.error("An unexpected error occurred while fetching prefixes");
      }
    } finally {
      setIsLoadingData(false);
    }
  };

  // Function to handle delete action from ZoneTable
  const handleDeletePrefix = async (row: any) => {
    try {
      const API_URL = import.meta.env.VITE_BASE_URL || "http://localhost:9000";
      const token = getAuthToken();

      if (!token) {
        toast.error("Authentication token not found. Please login again.");
        return;
      }

      const response = await axios.delete(
        `${API_URL}/api/abid-jewelry-ms/deleteStorePrefix/${row.id}`,
        {
          headers: {
            "x-access-token": token,
            "Content-Type": "application/json",
          },
        }
      );

      const data = response.data;

      if (data.success) {
        toast.success("Prefix deleted successfully");
        fetchPrefixes(); // Refresh the list
      } else {
        toast.error(data.message || "Failed to delete prefix");
      }
    } catch (error) {
      console.error("Error deleting prefix:", error);

      if (axios.isAxiosError(error)) {
        if (!error.response) {
          toast.error("Network error. Please check your internet connection.");
        } else {
          toast.error(error.response.data.message || "Failed to delete prefix");
        }
      } else {
        toast.error("An unexpected error occurred while deleting the prefix");
      }
    }
  };

  // Fetch prefixes when component mounts
  useEffect(() => {
    fetchPrefixes();
  }, []);

  const columns: Column[] = [
    // { header: "Prefix ID", accessor: "id" },
    { header: "Store Prefix Name", accessor: "name", type: "text" },
    { header: "Status", accessor: "status", type: "status" },
    { header: "Actions", accessor: "actions", type: "actions" },
  ];

  return (
    <div className="w-full mx-auto px-3 py-6 sm:px-4 md:px-6 xl:px-8 xl:py-6">
      <div className="bg-white rounded-xl shadow-md px-4 sm:px-6 md:px-8 py-6 mb-10">
        <p className="Source-Sans-Pro-font text-[#056BB7] font-semibold text-[22px] m-0">
          Add Store Prefix
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-6 grid gap-8 text-[15px] Poppins-font font-medium w-full"
        >
          <div className="flex flex-col w-full">
            <label className="mb-1 text-black">Prefix</label>
            <Input
              placeholder="eg: Rose"
              value={prefix}
              onChange={(e) => setPrefix(e.target.value)}
              className="outline-none focus:outline-none w-full"
            />
          </div>
          <div className="flex justify-end font-medium gap-4">
            <Button
              text="Back"
              className="px-6 !bg-[#F4F4F5] !border-none"
              onClick={() => navigate(-1)}
            />
            {canCreate && (
              <Button
                text="Save"
                className={`px-6 !bg-[#056BB7] border-none text-white ${isLoading ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                type="submit"
                disabled={isLoading}
              />
            )}
          </div>
        </form>
      </div>

      {isLoadingData ? (
        <div className="flex justify-center items-center h-40">
          <p className="text-gray-500">Loading prefixes...</p>
        </div>
      ) : (
        <PrefixTable
          tableDataAlignment="zone"
          columns={columns}
          data={prefixData}
          enableRowModal={false}
          tableTitle="Prefix"
          onEdit={handleEditPrefix}
          onDelete={handleDeletePrefix}
          canUpdate={canUpdate}
          canDelete={canDelete}
        />
      )}
    </div>
  );
};

export default AddPrefix;
