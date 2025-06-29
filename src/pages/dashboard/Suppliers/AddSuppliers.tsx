import type React from "react";
import { useState, useEffect } from "react";
import Input from "../../../components/Input";
import Button from "../../../components/Button";
import Dropdown from "../../../components/Dropdown";
import { DropImage } from "../../../components/UploadPicture";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

// Helper function to get auth token
const getAuthToken = () => {
  let token = localStorage.getItem("token");
  if (!token) {
    token = sessionStorage.getItem("token");
  }
  return token;
};


interface AddUserProps {
  uploadedFile: File | null;
  setUploadedFile: (file: File | null) => void;
}

const AddSuppliers: React.FC<AddUserProps> = ({
  uploadedFile,
  setUploadedFile,
}) => {
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [paymentTerms, setPaymentTerms] = useState<
    { _id: string; name: string }[]
  >([]);
  const [productCategories, setProductCategories] = useState<
    { _id: string; name: string }[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    companyName: "",
    representativeName: "",
    phone: "",
    email: "",
    businessAddress: "",
    bankAccount: "",
    paymentTerms: "",
    status: "active",
    supplierPriority: "primary",
    productsSupplied: [] as string[],
  });

  const navigate = useNavigate();

  // Check permissions and fetch data only once
  useEffect(() => {
    if (hasInitialized) return;

    const userRole = getUserRole();
    const isAdmin = userRole === "Admin" || userRole === "SuperAdmin";

    if (!isAdmin && !hasPermission("Suppliers", "create")) {
      toast.error("You don't have permission to add suppliers");
      return;
    }

    // Set flag to prevent re-initialization
    setHasInitialized(true);

    // Fetch data
    fetchPaymentTerms();
    fetchProductCategories();
  }, [hasInitialized]); // Only depend on hasInitialized

  // Fetch payment terms with error handling and loading state
  const fetchPaymentTerms = async () => {
    if (paymentTerms.length > 0) return; // Don't fetch if already loaded

    try {
      setIsLoading(true);
      const API_URL =
        import.meta.env.VITE_BASE_URL || "http://192.168.100.18:9000";
      const token = getAuthToken();

      if (!token) {
        toast.error("Authentication token not found. Please login again.");
        return;
      }

      const response = await axios.get(
        `${API_URL}/api/abid-jewelry-ms/allTemplates`,
        {
          headers: {
            "x-access-token": token,
            "Content-Type": "application/json",
          },
          timeout: 10000, // 10 second timeout
        }
      );

      if (response.data.success) {
        console.log("Payment terms fetched:", response.data.data);
        setPaymentTerms(response.data.data);
      } else {
        toast.error(response.data.message || "Failed to fetch payment terms");
      }
    } catch (error) {
      console.error("Error fetching payment terms:", error);
      if (axios.isAxiosError(error)) {
        if (error.code === "ECONNABORTED") {
          toast.error("Request timeout. Please check your connection.");
        } else if (error.response) {
          toast.error(`Server error: ${error.response.status}`);
        } else {
          toast.error("Network error. Please check your connection.");
        }
      } else {
        toast.error("An error occurred while fetching payment terms");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch product categories with error handling and loading state
  const fetchProductCategories = async () => {
    if (productCategories.length > 0) return; // Don't fetch if already loaded

    try {
      setIsLoading(true);
      const API_URL =
        import.meta.env.VITE_BASE_URL || "http://192.168.100.18:9000";
      const token = getAuthToken();

      if (!token) {
        toast.error("Authentication token not found. Please login again.");
        return;
      }

      const response = await axios.get(
        `${API_URL}/api/abid-jewelry-ms/getAllCategory`,
        {
          headers: {
            "x-access-token": token,
            "Content-Type": "application/json",
          },
          timeout: 10000, // 10 second timeout
        }
      );

      if (response.data.success) {
        console.log("Product categories fetched:", response.data.data);
        setProductCategories(response.data.data);
      } else {
        toast.error(
          response.data.message || "Failed to fetch product categories"
        );
      }
    } catch (error) {
      console.error("Error fetching product categories:", error);
      if (axios.isAxiosError(error)) {
        if (error.code === "ECONNABORTED") {
          toast.error("Request timeout. Please check your connection.");
        } else if (error.response) {
          toast.error(`Server error: ${error.response.status}`);
        } else {
          toast.error("Network error. Please check your connection.");
        }
      } else {
        toast.error("An error occurred while fetching product categories");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle radio button change
  const handleRadioChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle payment term selection
  const handlePaymentTermSelect = (value: string) => {
    const term = paymentTerms.find((t) => t.name === value);
    if (term) {
      setFormData((prev) => ({
        ...prev,
        paymentTerms: term._id,
      }));
    }
  };

  // Handle product selection
  const handleProductSelect = (value: string) => {
    const product = productCategories.find((p) => p.name === value);
    if (product) {
      if (!formData.productsSupplied.includes(product._id)) {
        setFormData((prev) => ({
          ...prev,
          productsSupplied: [...prev.productsSupplied, product._id],
        }));
        setSelectedProducts((prev) => [...prev, product.name]);
      } else {
        toast.info("This product is already selected");
      }
    }
  };

  const userRole = getUserRole();
  const isAdmin = userRole === "Admin" || userRole === "SuperAdmin";

  return (
    <div className="w-full mx-auto px-3 py-6 sm:px-4 md:px-6 xl:px-8 xl:py-6">
      <h2 className="Source-Sans-Pro-font font-semibold text-[#5D6679] text-[20px] mb-2">
        <Link
          to="/dashboard/suppliers/view-all-suppliers"
          className="cursor-pointer"
        >
          Suppliers
        </Link>{" "}
        / <span className="text-black">Add Suppliers</span>
      </h2>

      <div className="bg-white rounded-lg shadow-md px-4 md:px-10 py-6">
        {isLoading && (
          <div className="flex justify-center items-center py-4">
            <div className="text-blue-600">Loading...</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddSuppliers;
