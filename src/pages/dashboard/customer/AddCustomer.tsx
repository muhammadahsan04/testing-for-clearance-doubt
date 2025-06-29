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
  return (
    <div className="w-full mx-auto px-3 py-6 sm:px-4 md:px-6 xl:px-8 xl:py-6">
      <h2 className="Source-Sans-Pro-font font-semibold text-[20px] mb-2 text-black">
        Add Customer
      </h2>
      <div className="bg-white rounded-lg shadow-md px-4 md:px-10 py-6">
        <p className="Source-Sans-Pro-font text-[#056BB7] font-semibold text-[24px] m-0">
          Add Customer
        </p>
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
