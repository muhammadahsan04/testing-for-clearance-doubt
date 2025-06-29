import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../../components/Button";
import Input from "../../../components/Input";
import AddSkuPrefixTable from "../../../components/AddSkuPrefixTable";
import axios from "axios";
import { toast } from "react-toastify";
import { hasPermission } from "../sections/CoreSettings";

interface Column {
  header: string;
  accessor: string;
  type?: "text" | "image" | "status" | "actions";
}

interface SkuPrefixData {
  _id: string;
  prefixName: string;
  status: string;
  id?: string;
  name?: string;
}

// Helper function to get auth token
const getAuthToken = () => {
  let token = localStorage.getItem("token");
  if (!token) {
    token = sessionStorage.getItem("token");
  }
  return token;
};

// getUserRole function add کریں
const getUserRole = () => {
  let role = localStorage.getItem("role");
  if (!role) {
    role = sessionStorage.getItem("role");
  }
  return role;
};

const AddSKUPrefix: React.FC = () => {
  const [prefixName, setPrefixName] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [skuPrefixData, setSkuPrefixData] = useState<SkuPrefixData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  const columns: Column[] = [
    { header: "S.no", accessor: "id" },
    { header: "Purchase Prefix Name", accessor: "name", type: "image" },
    { header: "Status", accessor: "status", type: "status" },
    { header: "Actions", accessor: "actions", type: "actions" },
  ];

  // Fetch all SKU prefixes on component mount
  useEffect(() => {
    fetchSkuPrefixes();
  }, []);

  useEffect(() => {
    if (!canCreate) {
      toast.error("You don't have permission to add sku prefix");
    }
  }, [canCreate]);

  // Fetch all SKU prefixes
  const fetchSkuPrefixes = async () => {
    setLoading(true);
    try {
      const API_URL = import.meta.env.VITE_BASE_URL || "http://localhost:9000";
      const token = getAuthToken();

      if (!token) {
        toast.error("Authentication token not found. Please login again.");
        return;
      }

      const response = await axios.get(
        `${API_URL}/api/abid-jewelry-ms/getAllSkuPrefix`,
        {
          headers: {
            "x-access-token": token,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        // Transform the data to match the expected format
        const formattedData = response.data.data.map(
          (prefix: any, index: number) => ({
            _id: prefix._id,
            id: (index + 1).toString().padStart(2, "0"),
            name: prefix.prefixName,
            prefixName: prefix.prefixName,
            status:
              prefix.status.charAt(0).toUpperCase() + prefix.status.slice(1),
          })
        );

        setSkuPrefixData(formattedData);
      } else {
        toast.error(response.data.message || "Failed to fetch SKU prefixes");
      }
    } catch (error) {
      console.error("Error fetching SKU prefixes:", error);
      if (axios.isAxiosError(error)) {
        if (!error.response) {
          toast.error("Network error. Please check your internet connection.");
        } else {
          toast.error(
            error.response.data.message || "Failed to fetch SKU prefixes"
          );
        }
      } else {
        toast.error("An unexpected error occurred while fetching SKU prefixes");
      }
    } finally {
      setLoading(false);
    }
  };


  // Handle SKU prefix update
  const handleUpdateSkuPrefix = async (updatedPrefix: SkuPrefixData) => {
    // e.stopPropagation();
    if (!canUpdate) {
      toast.error("You don't have permission to edit sku prefix");
      return;
    }

    // Update the skuPrefixData state with the updated prefix
    // setSkuPrefixData((prevData) =>
    //   prevData.map((prefix) =>
    //     prefix._id === updatedPrefix._id ? updatedPrefix : prefix
    //   )
    // );

    // Update the skuPrefixData state with the updated prefix
    setSkuPrefixData((prevData) =>
      prevData.map((prefix) =>
        prefix._id === updatedPrefix._id
          ? {
              ...prefix,
              name: updatedPrefix.name || updatedPrefix.prefixName,
              prefixName: updatedPrefix.prefixName,
              status: updatedPrefix.status,
            }
          : prefix
      )
    );
  };

  return (
    <div className="w-full mx-auto px-3 py-6 sm:px-4 md:px-6 xl:px-8 xl:py-6">
      <div className="bg-white rounded-xl shadow-md px-4 sm:px-6 md:px-8 py-6 mb-10">
        <p className="Source-Sans-Pro-font text-[#056BB7] font-semibold text-[22px] m-0">
          Add SKU Purchase Prefix
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-6 grid gap-8 text-[15px] Poppins-font font-medium w-full"
        >
          <div className="flex flex-col w-full">
            <label className="mb-1 text-black">Prefix</label>
            <Input
              placeholder="eg: TBHC"
              value={prefixName}
              onChange={(e) => setPrefixName(e.target.value)}
              className="outline-none focus:outline-none w-full"
            />
          </div>
          <div className="flex justify-end font-medium gap-4">
            {canCreate && (
              <Button
                text={isSubmitting ? "Saving..." : "Save"}
                type="submit"
                disabled={isSubmitting}
                className="px-6 !bg-[#056BB7] border-none text-white"
              />
            )}
          </div>
        </form>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <AddSkuPrefixTable
          tableDataAlignment="zone"
          columns={columns}
          data={skuPrefixData}
          enableRowModal={false}
          tableTitle="SKU Prefix"
        />
      )}
    </div>
  );
};

export default AddSKUPrefix;
