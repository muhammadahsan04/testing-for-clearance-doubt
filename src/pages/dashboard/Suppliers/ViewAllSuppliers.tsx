import React, { useState, useEffect } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import Button from "../../../components/Button";
import SupplierTable from "../../../components/SupplierTable";
import { StatCard } from "../userManagementSections/OverAll";
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

interface Supplier {
  _id: string;
  supplierId: string;
  representativeName: string;
  status: string;
  companyName: string;
  email: string;
  phone: string;
  profilePicture?: string;
  businessAddress: string;
  paymentTerms: any;
}

interface SupplierResponse {
  success: boolean;
  total: number;
  activeCount: number;
  inactiveCount: number;
  data: Supplier[];
}

const ViewAllSuppliers: React.FC = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [totalSuppliers, setTotalSuppliers] = useState(0);
  const [activeSuppliers, setActiveSuppliers] = useState(0);
  const [inactiveSuppliers, setInactiveSuppliers] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<Supplier | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    // Check permissions on component mount
    const userRole = getUserRole()
    const isAdmin = userRole === "Admin" || userRole === "SuperAdmin"

    if (!isAdmin && !hasPermission("Suppliers", "read")) {
      toast.error("You don't have permission to view suppliers")
      navigate("/dashboard")
      return
    }

    fetchSuppliers();
  }, [navigate]);

  // Helper function to get auth token
  const getAuthToken = () => {
    let token = localStorage.getItem("token");
    if (!token) {
      token = sessionStorage.getItem("token");
    }
    return token;
  };

  const fetchSuppliers = async () => {
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
        `${API_URL}/api/abid-jewelry-ms/getAllSupplier`,
        {
          headers: {
            "x-access-token": token,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        console.log('response.data.data', response.data.data);
        setSuppliers(response.data.data);
        setTotalSuppliers(response.data.total);
        setActiveSuppliers(response.data.activeCount);
        setInactiveSuppliers(response.data.inactiveCount);
      } else {
        setError("Failed to fetch suppliers");
      }
    } catch (err) {
      setError("Error fetching suppliers data");
      console.error("Error fetching suppliers:", err);
    } finally {
      setLoading(false);
    }
  };

  const columns: Column[] = [
    { header: "Supplier Id", accessor: "supplierId" },
    { header: "Supplier Name", accessor: "representativeName", type: "image" },
    { header: "Status", accessor: "status", type: "status" },
    { header: "Actions", accessor: "actions", type: "actions" },
  ];

  // Transform API data to match the format expected by SupplierTable
  const formattedSuppliers = suppliers.map((supplier) => ({
    id: supplier._id,
    supplierId: supplier.supplierId,
    name: supplier.representativeName,
    userImage: supplier.profilePicture, // Default image could be added here
    status: supplier.status === "active" ? "Active" : "Inactive",
    email: supplier.email,
    phone: supplier.phone,
    companyName: supplier.companyName,
    businessAddress: supplier.businessAddress,
    paymentTerms: supplier?.paymentTerms,
    originalData: supplier, // Store the original data for reference
  }));

  // Handle supplier update
  const handleUpdateSupplier = async () => {
    // Refresh the suppliers list to get the updated data
    await fetchSuppliers();
  };

  // Handle supplier deletion
  const handleDeleteSupplier = async () => {
    // Refresh the suppliers list to get the updated data
    await fetchSuppliers();
  };

  // Check if user can add suppliers
  const canAddSuppliers = () => {
    const userRole = getUserRole()
    const isAdmin = userRole === "Admin" || userRole === "SuperAdmin"
    return isAdmin || hasPermission("Suppliers", "create")
  }

  return (
    <div className="mx-auto px-3 py-6 sm:px-4 md:px-6 xl:px-8 xl:py-6 space-y-6 lg:w-[100%] xl:w-full w-full overflow-x-hidden">
      <h2 className="Inter-font font-semibold text-[20px] mb-2">Suppliers</h2>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 bg-white shadow rounded-xl p-4">
        <StatCard
          label="Total Suppliers"
          value={totalSuppliers.toString()}
          textColor="text-orange-400"
        />
        <StatCard
          label="Active Suppliers"
          value={activeSuppliers.toString()}
          textColor="text-green-400"
        />
        <StatCard
          label="Inactive Suppliers"
          value={inactiveSuppliers.toString()}
          textColor="text-purple-500"
        />
        <StatCard
          label="Pending Approvals"
          value="0"
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
        <SupplierTable
          columns={columns}
          data={formattedSuppliers}
          tableTitle="Suppliers"
          onEdit={handleUpdateSupplier}
          onDelete={handleDeleteSupplier}
          canAdd={canAddSuppliers()}
        />
      )}
    </div>
  );
};

export default ViewAllSuppliers;
