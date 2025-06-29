import React, { useState, useEffect } from "react";
import Input from "../../../components/Input";
import Button from "../../../components/Button";
import Dropdown from "../../../components/Dropdown";
import { DropImage } from "../../../components/UploadPicture";
import { useNavigate } from "react-router-dom";
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

interface Role {
  _id: string;
  name: string;
  description: string;
  roleImage: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  nameNormalized?: string;
}

interface AddUserProps {
  uploadedFile: File | null;
  setUploadedFile: (file: File | null) => void;
}

const AddUser: React.FC<AddUserProps> = ({ uploadedFile, setUploadedFile }) => {
  const [password, setPassword] = useState<string>("");
  const [roles, setRoles] = useState<Role[]>([]);
  const [selectedRoleName, setSelectedRoleName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "",
    status: "active",
  });

  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_BASE_URL || "http://localhost:9000";

  // Check permissions
  const userRole = getUserRole()
  const isAdmin = userRole === "Admin" || userRole === "SuperAdmin"

  // Fetch roles when component mounts
  useEffect(() => {
    // Check permissions on component mount
    if (!isAdmin && !hasPermission("User Management", "create")) {
      toast.error("You don't have permission to add users")
      // navigate("/dashboard/user-management/overall", { replace: true })
      return
    }

    fetchRoles();
  }, [navigate, isAdmin]);

  const getAuthToken = () => {
    let token = localStorage.getItem("token");
    if (!token) {
      token = sessionStorage.getItem("token");
    }
    return token;
  };

  const fetchRoles = async () => {
    try {
      const token = getAuthToken();
      if (!token) {
        toast.error("Authentication token not found. Please login again.");
        return;
      }
      const response = await axios.get(`${API_URL}/api/abid-jewelry-ms/roles`, {
        headers: {
          "x-access-token": token,
          "Content-Type": "application/json",
        },
      });
      if (response.data.success) {
        setRoles(response.data.roles);
        console.log("Roles fetched successfully:", response.data.roles);
      }
    } catch (error) {
      console.error("Error fetching roles:", error);
      toast.error("Failed to fetch roles");
    }
  };

  // Function to handle role selection
  const handleRoleSelect = async (name: string) => {
    // Find the role object by name
    const selectedRole = roles.find((role) => role.name === name);
    if (selectedRole) {
      const roleId = selectedRole._id;
      setSelectedRoleName(name);
      try {
        const token = getAuthToken();
        if (!token) {
          toast.error("Authentication token not found. Please login again.");
          return;
        }
        const response = await axios.get(
          `${API_URL}/api/abid-jewelry-ms/role/${roleId}`,
          {
            headers: {
              "x-access-token": token,
              "Content-Type": "application/json",
            },
          }
        );
        if (response.data.success) {
          console.log("Role details fetched:", response.data.role);
          // Update form data with the role ID
          setFormData((prev) => ({
            ...prev,
            role: roleId,
          }));
        }
      } catch (error) {
        console.error("Error fetching role details:", error);
        toast.error("Failed to fetch role details");
      }
    }
  };

  // Function to generate a random password
  const generatePassword = () => {
    const length = 12; // Define password length
    const charset =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";
    let generatedPassword = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      generatedPassword += charset[randomIndex];
    }
    setPassword(generatedPassword);
    setFormData((prev) => ({
      ...prev,
      password: generatedPassword,
      confirmPassword: generatedPassword,
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      status: e.target.value,
    }));
  };

  const validateForm = () => {
    if (!formData.firstName.trim()) {
      toast.error("First name is required");
      return false;
    }
    if (!formData.lastName.trim()) {
      toast.error("Last name is required");
      return false;
    }
    if (!formData.email.trim()) {
      toast.error("Email is required");
      return false;
    }
    if (!formData.phone.trim()) {
      toast.error("Phone number is required");
      return false;
    }
    if (!formData.password.trim()) {
      toast.error("Password is required");
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return false;
    }
    if (!formData.role) {
      toast.error("Please select a role");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check permissions before submitting
    if (!isAdmin && !hasPermission("User Management", "create")) {
      toast.error("You don't have permission to add users");
      return;
    }

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      const token = getAuthToken();
      if (!token) {
        toast.error("Authentication token not found. Please login again.");
        return;
      }

      // Create FormData object to handle file upload
      const formDataToSend = new FormData();

      // Add all form fields to FormData INCLUDING confirmPassword
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value);
      });

      // Add profile image if it exists
      if (uploadedFile) {
        formDataToSend.append("profileImage", uploadedFile);
      }

      console.log("Sending form data:", Object.fromEntries(formDataToSend));

      const response = await axios.post(
        `${API_URL}/api/abid-jewelry-ms/addUser`,
        formDataToSend,
        {
          headers: {
            "x-access-token": token,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        console.log("User added successfully:", response.data);
        toast.success("User added successfully!");
        // Reset form and uploaded file
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          password: "",
          confirmPassword: "",
          role: "",
          status: "active",
        });
        setPassword("");
        setSelectedRoleName("");
        setUploadedFile(null);
        // Navigate back to user management
        navigate("/dashboard/user-management/overall", { replace: true });
      } else {
        toast.error(response.data.message || "Failed to add user");
      }
    } catch (error: any) {
      console.error("Error adding user:", error);
      const errorMessage =
        error.response?.data?.message ||
        "An error occurred while adding the user";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full mx-auto px-3 py-6 sm:px-4 md:px-6 xl:px-8 xl:py-6">
      <h2 className="Source-Sans-Pro-font font-semibold text-[#5D6679] text-[20px] mb-2">
        <span
          onClick={() =>
            navigate("/dashboard/user-management/overall", { replace: true })
          }
          className="cursor-pointer"
        >
          User Management
        </span>{" "}
        / <span className="text-black">Add Users</span>
      </h2>
      <div className="bg-white rounded-lg shadow-md px-4 md:px-10 py-6">
        <p className="Source-Sans-Pro-font text-[#056BB7] font-semibold text-[24px] m-0">
          Add Users
        </p>
      </div>
    </div>
  );
};

export default AddUser;

