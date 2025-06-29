import React, { useState, useRef, useEffect } from "react";
import Input from "../../../components/Input";
import Button from "../../../components/Button";
import { useNavigate } from "react-router-dom";
import DatePicker from "../../../components/DatePicker";
import axios from "axios";
import { toast } from "react-toastify";
import { hasPermission } from "../sections/Customer";

interface AddCustomerProps {
  uploadedFile: File | null;
  setUploadedFile: (file: File | null) => void;
}

// Helper function to get auth token
const getAuthToken = () => {
  let token = localStorage.getItem("token");
  if (!token) {
    token = sessionStorage.getItem("token");
  }
  return token;
};

// getUserRole function add
const getUserRole = () => {
  let role = localStorage.getItem("role");
  if (!role) {
    role = sessionStorage.getItem("role");
  }
  return role;
};

const AddCustomer: React.FC<AddCustomerProps> = ({
  uploadedFile,
  setUploadedFile,
}) => {
  const formRef = useRef<HTMLFormElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    address: "",
    segmentation: "frequentBuyers", // Default value
  });

  const navigate = useNavigate();

  // Permission variables add
  const userRole = getUserRole();
  const isAdmin = userRole === "Admin" || userRole === "SuperAdmin";
  const canCreate = isAdmin || hasPermission("Customer", "create");
  const canUpdate = isAdmin || hasPermission("Customer", "update");
  const canDelete = isAdmin || hasPermission("Customer", "delete");

  useEffect(() => {
    if (!canCreate) {
      toast.error("You don't have permission to add customer");
    }
  }, [canCreate]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSegmentationChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      segmentation: value,
    }));
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      dateOfBirth: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation checks
    if (!formData.firstName) {
      toast.error("First name is required");
      return;
    }
    if (!formData.lastName) {
      toast.error("Last name is required");
      return;
    }
    if (!formData.phone) {
      toast.error("Phone number is required");
      return;
    }
    if (!formData.email) {
      toast.error("Email is required");
      return;
    }
    if (!formData.address) {
      toast.error("Address is required");
      return;
    }

    setIsSubmitting(true);
    try {
      const API_URL =
        import.meta.env.VITE_BASE_URL || "http://192.168.100.18:9000";
      const token = getAuthToken();
      if (!token) {
        toast.error("Authentication token not found. Please login again.");
        return;
      }

      // Create FormData object to handle file upload
      const formDataToSend = new FormData();

      // Add all form fields to FormData
      formDataToSend.append("firstName", formData.firstName);
      formDataToSend.append("lastName", formData.lastName);
      formDataToSend.append("phone", formData.phone);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("address", formData.address);
      formDataToSend.append("dateOfBirth", formData.dateOfBirth);
      formDataToSend.append("segmentation", formData.segmentation);

      // Add profile image if it exists
      if (uploadedFile) {
        formDataToSend.append("profilePicture", uploadedFile);
      }

      const response = await axios.post(
        `${API_URL}/api/abid-jewelry-ms/createCustomer`,
        formDataToSend,
        {
          headers: {
            "x-access-token": token,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        toast.success("Customer added successfully!");
        navigate("/dashboard/customer/view-all-customer");
      } else {
        console.log("first else", response.data.message);

        toast.error(response.data.message || "Failed to add customer");
      }
    } catch (error) {
      console.error("Error adding customer:", error);
      if (axios.isAxiosError(error) && error.response) {
        toast.error(error.response.data.message || "Failed to add customer");
        console.error("Server error details:", error.response.data);
      } else {
        toast.error("An error occurred while adding the customer");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveClick = () => {
    if (formRef.current) {
      formRef.current.dispatchEvent(
        new Event("submit", { cancelable: true, bubbles: true })
      );
    }
  };

  return (
    <div className="w-full mx-auto px-3 py-6 sm:px-4 md:px-6 xl:px-8 xl:py-6">
      <h2 className="Source-Sans-Pro-font font-semibold text-[20px] mb-2 text-black">
        Add Customer
      </h2>
      <div className="bg-white rounded-lg shadow-md px-4 md:px-10 py-6">
        <p className="Source-Sans-Pro-font text-[#056BB7] font-semibold text-[24px] m-0">
          Add Customer
        </p>

        <form
          ref={formRef}
          className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-16 xl:gap-32 text-[15px] Poppins-font font-medium"
          onSubmit={handleSubmit}
        >
          {/* Left Side */}
          <div className="space-y-4">
            <div className="flex flex-col">
              <label htmlFor="firstName" className="mb-1">
                First Name <span className="text-red-500">*</span>
              </label>
              <Input
                name="firstName"
                placeholder="First Name"
                className="outline-none focus:outline-none w-full"
                value={formData.firstName}
                onChange={handleChange}
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="email" className="mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <Input
                name="email"
                placeholder="john@example.com"
                className="outline-none focus:outline-none w-full"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="flex flex-col w-full">
              <label className="mb-1">
                Date of Birth <span className="text-red-500">*</span>
              </label>
              <DatePicker
                onChange={handleDateChange}
                type={"calendar" === "calendar" ? "date" : "text"}
                className="w-full"
                value={formData.dateOfBirth}
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="address" className="mb-1">
                Address <span className="text-red-500">*</span>
              </label>
              <textarea
                name="address"
                placeholder="200 Peachtree St NW, Atlanta, GA 30303"
                rows={3}
                className="Poppins-font font-medium w-full px-4 py-2 border border-gray-300 rounded-md text-sm !focus:outline-none outline-none resize-none"
                value={formData.address}
                onChange={handleChange}
              ></textarea>
            </div>
          </div>

          {/* Right Side */}
          <div className="space-y-4">
            <div className="flex flex-col">
              <label htmlFor="lastName" className="mb-1">
                Last Name <span className="text-red-500">*</span>
              </label>
              <Input
                name="lastName"
                placeholder="Last Name"
                className="outline-none focus:outline-none w-full"
                value={formData.lastName}
                onChange={handleChange}
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="phone" className="mb-1">
                Phone No <span className="text-red-500">*</span>
              </label>
              <Input
                name="phone"
                placeholder="+65 362783233"
                className="outline-none focus:outline-none w-full"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            <div className="flex gap-2 flex-col">
              <div>
                <span className="text-sm font-medium">
                  Customer Segmentation
                </span>
              </div>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-sm border px-3 py-2 border-gray-200 rounded-md">
                  <input
                    type="radio"
                    name="segmentation"
                    value="frequentBuyers"
                    className="accent-blue-600"
                    checked={formData.segmentation === "frequentBuyers"}
                    onChange={() => handleSegmentationChange("frequentBuyers")}
                  />
                  Frequent buyers
                </label>
                <label className="flex items-center gap-2 text-sm border px-2 py-2 pr-8 border-gray-200 rounded-md">
                  <input
                    type="radio"
                    name="segmentation"
                    value="vip"
                    className="accent-blue-600"
                    checked={formData.segmentation === "vip"}
                    onChange={() => handleSegmentationChange("vip")}
                  />
                  VIP
                </label>
              </div>
            </div>
          </div>
        </form>
        <div className="flex justify-end gap-4 mt-6 Poppins-font font-medium">
          {canCreate && (
            <Button
              text={isSubmitting ? "Saving..." : "Save"}
              className="px-6 !bg-[#056BB7] border-none text-white"
              onClick={handleSaveClick}
              disabled={isSubmitting}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default AddCustomer;
