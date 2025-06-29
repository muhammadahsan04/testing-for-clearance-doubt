import React, { useState, useEffect } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { RiEditLine } from "react-icons/ri";
import { GoChevronLeft, GoChevronRight } from "react-icons/go";
import { LuEye } from "react-icons/lu";
import axios from "axios";
import { toast } from "react-toastify";

import Input from "./Input";
import Dropdown from "./Dropdown";
import Button from "./Button";
import { useNavigate } from "react-router-dom";
import { DropImage } from "./UploadPicture";
import PhoneInput from "react-phone-number-input";
import { isValidPhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";

// Helper function to check permissions
const hasPermission = (module: string, action: string) => {
  try {
    let permissionsStr = localStorage.getItem("permissions");
    if (!permissionsStr) {
      permissionsStr = sessionStorage.getItem("permissions");
    }

    if (!permissionsStr) return false;

    const permissions = JSON.parse(permissionsStr);

    // Check if user has all permissions
    if (permissions.allPermissions || permissions.allPagesAccess) return true;

    const page = permissions.pages?.find((p: any) => p.name === module);
    if (!page) return false;

    switch (action.toLowerCase()) {
      case "create":
        return page.create;
      case "read":
        return page.read;
      case "update":
        return page.update;
      case "delete":
        return page.delete;
      default:
        return false;
    }
  } catch (error) {
    console.error("Error checking permissions:", error);
    return false;
  }
};

// Helper function to get user role
const getUserRole = () => {
  let role = localStorage.getItem("role");
  if (!role) {
    role = sessionStorage.getItem("role");
  }
  return role;
};

type ColumnType = "text" | "image" | "status" | "actions" | "button" | "custom";

interface Column {
  header: string;
  accessor: string;
  type?: ColumnType;
}

export interface User {
  id: string;
  name: string;
  role: string;
  status: string;
  userImage?: string;
  [key: string]: any;
}

interface UserTableProps {
  columns: Column[];
  data: any[];
  tableTitle?: string;
  rowsPerPageOptions?: number[];
  defaultRowsPerPage?: number;
  searchable?: boolean;
  filterByStatus?: boolean;
  onEdit?: (row: any) => void;
  onDelete?: (row: any) => void;
  tableDataAlignment?: "zone" | "user" | "center";
  className?: string;
  onRowClick?: (row: any) => void;
  dealBy?: boolean;
  enableRowModal?: boolean;
  eye?: boolean;
  canAdd?: boolean;
  uploadedFile: File | null;
  setUploadedFile: (file: File | null) => void;
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

interface UserDetails {
  _id: string;
  userId: string;
  firstName: string;
  lastName: string;
  role: {
    _id: string;
    name: string;
  };
  email: string;
  phone: string;
  profileImage: string | null;
  status: string;
  lastLogin: string | null;
  createdAt: string;
  updatedAt: string;
}

// Helper function to get auth token
const getAuthToken = () => {
  let token = localStorage.getItem("token");
  if (!token) {
    token = sessionStorage.getItem("token");
  }
  return token;
};

const UserTable: React.FC<UserTableProps> = ({
  eye,
  enableRowModal = true,
  onRowClick,
  className,
  columns,
  data,
  tableTitle,
  rowsPerPageOptions = [5, 10, 15],
  defaultRowsPerPage = 5,
  searchable = true,
  filterByStatus = true,
  onEdit,
  onDelete,
  tableDataAlignment = "start",
  dealBy,
  canAdd = true,
  uploadedFile,
  setUploadedFile,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [deleteUser, setDeleteUser] = useState<any>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [phoneError, setPhoneError] = useState<string>("");
  const [phoneValue, setPhoneValue] = useState<string | undefined>(undefined);

  // Edit user states
  const [isEditing, setIsEditing] = useState(false);
  const [editingRow, setEditingRow] = useState<any>(null);
  const [roles, setRoles] = useState<Role[]>([]);
  const [password, setPassword] = useState<string>("");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "",
    status: "active",
    _id: "",
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedRoleName, setSelectedRoleName] = useState<string>("");
  const [fetchingUserDetails, setFetchingUserDetails] =
    useState<boolean>(false);
  const [userImagePreview, setUserImagePreview] = useState<string | null>(null);
  const [selectedImagePreview, setSelectedImagePreview] = useState<
    string | null
  >(null);

  const navigate = useNavigate();

  // Check permissions
  const userRole = getUserRole();
  const isAdmin = userRole === "Admin" || userRole === "SuperAdmin";

  useEffect(() => {
    fetchRoles();
  }, []);

  // Preview uploaded file
  useEffect(() => {
    if (uploadedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImagePreview(reader.result as string);
      };
      reader.readAsDataURL(uploadedFile);
    } else {
      setSelectedImagePreview(null);
    }
  }, [uploadedFile]);

  // Handle phone number change
  const handlePhoneChange = (value: string | undefined) => {
    setPhoneValue(value);
    setPhoneError("");

    if (value) {
      // Validate phone number
      if (!isValidPhoneNumber(value)) {
        setPhoneError("Please enter a valid phone number");
      }

      // Update form data
      setFormData((prev) => ({
        ...prev,
        phone: value,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        phone: "",
      }));
    }
  };

  const API_URL = import.meta.env.VITE_BASE_URL || "http://localhost:9000";

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
      }
    } catch (error) {
      console.error("Error fetching roles:", error);
      toast.error("Failed to fetch roles");
    }
  };

  const fetchUserDetails = async (userId: string) => {
    try {
      setFetchingUserDetails(true);
      const token = getAuthToken();

      if (!token) {
        toast.error("Authentication token not found. Please login again.");
        return;
      }

      const response = await axios.get(
        `${API_URL}/api/abid-jewelry-ms/getOneUser/${userId}`,
        {
          headers: {
            "x-access-token": token,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        const userData: UserDetails = response.data.data;
        console.log("User details fetched:", userData);

        // Set form data with user details
        setFormData({
          firstName: userData?.firstName,
          lastName: userData?.lastName,
          email: userData?.email,
          phone: userData?.phone,
          password: "",
          confirmPassword: "",
          role: userData?.role?._id,
          status: userData?.status,
          _id: userData?._id,
        });

        // Set selected role name for dropdown
        setSelectedRoleName(userData?.role?.name);

        // Set image preview if available
        if (userData.profileImage) {
          setUserImagePreview(`${API_URL}${userData.profileImage}`);
        } else {
          setUserImagePreview(null);
        }

        return userData;
      } else {
        toast.error(response.data.message || "Failed to fetch user details");
        return null;
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
      toast.error("An error occurred while fetching user details");
      return null;
    } finally {
      setFetchingUserDetails(false);
    }
  };

  // Function to handle role selection
  const handleRoleSelect = async (name: string) => {
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
    if (!formData._id && !formData.password.trim()) {
      toast.error("Password is required for new users");
      return false;
    }
    if (!formData._id && formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return false;
    }
    if (!formData.role) {
      toast.error("Please select a role");
      return false;
    }
    return true;
  };
  // console.log("selectedUser", selectedUser);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "password") {
      setPassword(value);
    }
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      status: e.target.value,
    }));
  };

  // Function to generate a random password
  const generatePassword = () => {
    const length = 12;
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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

      // Add all form fields to FormData except confirmPassword
      Object.entries(formData).forEach(([key, value]) => {
        if (key === "confirmPassword") {
          return;
        }
        if (key === "password" && !value && formData._id) {
          return;
        }
        formDataToSend.append(key, value);
      });

      // Add profile image if it exists
      if (uploadedFile) {
        formDataToSend.append("profileImage", uploadedFile);
      }

      console.log("Sending form data:", Object.fromEntries(formDataToSend));

      const endpoint = `${API_URL}/api/abid-jewelry-ms/updateUser/${formData._id}`;

      const response = await axios.put(endpoint, formDataToSend, {
        headers: {
          "x-access-token": token,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        toast.success("User updated successfully!");

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
          _id: "",
        });
        setPassword("");
        setUploadedFile(null);
        setUserImagePreview(null);
        setSelectedImagePreview(null);
        setIsEditing(false);

        // Call fetchUsers from parent component instead of refreshing
        if (onEdit) {
          onEdit(null);
        }
      } else {
        toast.error(response.data.message || "Failed to update user");
      }
    } catch (error: any) {
      console.error("Error updating user:", error);
      const errorMessage =
        error.response?.data?.message ||
        "An error occurred while updating the user";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    if (
      !deleteUser ||
      !deleteUser.originalData ||
      !deleteUser.originalData._id
    ) {
      toast.error("Invalid user selected for deletion");
      return;
    }

    try {
      setLoading(true);
      const token = getAuthToken();

      if (!token) {
        toast.error("Authentication token not found. Please login again.");
        return;
      }

      const userId = deleteUser.originalData._id;
      const response = await axios.delete(
        `${API_URL}/api/abid-jewelry-ms/deleteUser/${userId}`,
        {
          headers: {
            "x-access-token": token,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        toast.success("User deleted successfully!");
        setShowDeleteModal(false);
        setDeleteModal(true);

        // Call onDelete callback to refresh data
        if (onDelete) {
          onDelete(null);
        }
      } else {
        toast.error(response.data.message || "Failed to delete user");
      }
    } catch (error: any) {
      console.error("Error deleting user:", error);
      const errorMessage =
        error.response?.data?.message ||
        "An error occurred while deleting the user";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Handle edit click
  const handleEditClick = (row: any) => {
    const canEdit = isAdmin || hasPermission("User Management", "update");

    if (!canEdit) {
      toast.error("You don't have permission to edit user");
      return;
    }

    setIsEditing(true);
    setEditingRow(row);

    // Fetch user details when edit button is clicked
    if (row.originalData && row.originalData._id) {
      fetchUserDetails(row.originalData._id);
    } else if (row._id) {
      fetchUserDetails(row._id);
    } else if (row.id) {
      fetchUserDetails(row.id);
    }
  };

  // Handle delete click
  const handleDeleteClick = (row: any) => {
    const canDelete = isAdmin || hasPermission("User Management", "delete");

    if (!canDelete) {
      toast.error("You don't have permission to delete user");
      return;
    }

    setShowDeleteModal(true);
    setDeleteUser(row);
  };

  const filteredData = data.filter((item) => {
    const nameMatch =
      item.name?.toLowerCase().includes(search.toLowerCase()) || false;
    const idMatch =
      item.id?.toLowerCase().includes(search.toLowerCase()) || false;
    const userIdMatch =
      item.userId?.toLowerCase().includes(search.toLowerCase()) || false;

    const matchesSearch = nameMatch || idMatch || userIdMatch;
    const matchesStatus =
      statusFilter === "All" || item.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const currentData = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handleChangePage = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  return (
    <>
      <div
        className={`bg-white rounded-xl p-4 flex flex-col gap-5 overflow-hidden shadow-md ${className}`}
      >
        {/* Search + Filter */}
        <div
          className={`grid gap-4 items-center justify-between md:grid-cols-2 ${
            data.some((item) => item.hasOwnProperty("status"))
              ? ""
              : "grid-cols-2"
          }`}
        >
          <div className="flex gap-3">
            {searchable && (
              <Input
                placeholder="Search User name, ID"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="max-w-full sm:max-w-sm !rounded-3xl outline-none "
              />
            )}

            {filterByStatus &&
              data.some((item) => item.hasOwnProperty("status")) && (
                <Dropdown
                  options={["All", "Active", "Inactive"]}
                  DropDownName="Status"
                  defaultValue="All"
                  onSelect={(val) => {
                    setStatusFilter(val);
                    setCurrentPage(1);
                  }}
                />
              )}
          </div>
          <div
            className={`flex md:justify-end gap-4 ${
              data.some((item) => item.hasOwnProperty("status"))
                ? "justify-start"
                : "justify-end"
            }`}
          >
            <Button
              text="Export"
              variant="border"
              className="bg-[#5D6679] text-white w-24"
            />
            {canAdd && (
              <Button
                text="Add Users"
                variant="border"
                onClick={() => navigate("/dashboard/user-management/add-users")}
                className="!bg-[#4E4FEB] text-white w-32 border-none"
              />
            )}
          </div>
        </div>

        <p className="text-[#056BB7] font-semibold text-[24px]">{tableTitle}</p>

        {/* Table */}
        <div className="bg-white rounded-xl border border-gray-300 overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-700 ">
            <thead className="bg-[#F9FAFB] text-black">
              <tr className="font-semibold text-[16px] whitespace-nowrap w-full">
                {columns.map((col, index) => {
                  const isFirst = index === 0;
                  const isLast = index === columns.length - 1;

                  return (
                    <th
                      key={col.accessor}
                      className="px-4 py-3 whitespace-nowrap text-left"
                      style={{
                        ...(isFirst && { width: "20%", whiteSpace: "nowrap" }),
                        ...(isLast && { width: "8%", whiteSpace: "nowrap" }),
                      }}
                    >
                      {col.header}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className="border-b border-gray-400">
              {currentData.map((row, idx) => (
                <tr
                  key={idx}
                  className="hover:bg-gray-50 whitespace-nowrap cursor-pointer "
                  onClick={() => {
                    if (onRowClick) {
                      onRowClick(row);
                    } else if (enableRowModal) {
                      setSelectedUser(row);
                    }
                  }}
                >
                  {columns.map((col, index) => {
                    const isFirst = index === 0;
                    const isLast = index === columns.length - 1;

                    return (
                      <td
                        key={col.accessor}
                        className="px-4 py-2"
                        style={{ width: "max-content" }}
                      >
                        <div
                          className={`flex flex-row items-center ${
                            isFirst
                              ? "justify-start"
                              : isLast
                              ? "justify-end"
                              : tableDataAlignment === "zone"
                              ? "justify-center"
                              : "justify-start"
                          }`}
                        >
                          {(() => {
                            switch (col.type) {
                              case "image":
                                return (
                                  <div className="flex gap-2 items-center pr-5 md:pr-0">
                                    {row.userImage ? (
                                      <>
                                        <img
                                          src={
                                            `${API_URL || "/placeholder.svg"}${
                                              row.userImage
                                            }` || "/placeholder.svg"
                                          }
                                          alt="User"
                                          className="w-8 h-8 rounded-full"
                                        />
                                        {row.name}
                                      </>
                                    ) : (
                                      <>{row.name}</>
                                    )}
                                  </div>
                                );
                              case "status":
                                return (
                                  <span
                                    className={`inline-block px-2 py-1 text-xs rounded-full ${
                                      row.status === "Active"
                                        ? "bg-green-100 text-green-600"
                                        : "bg-red-100 text-red-600"
                                    }`}
                                  >
                                    {row.status}
                                  </span>
                                );
                              case "actions":
                                return (
                                  <div className="flex justify-start gap-2 w-full">
                                    {eye && (
                                      <LuEye
                                        className="cursor-pointer"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          navigate("user-detail");
                                        }}
                                      />
                                    )}
                                    <RiEditLine
                                      className="cursor-pointer"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleEditClick(row);
                                      }}
                                    />
                                    <AiOutlineDelete
                                      className="cursor-pointer hover:text-red-500"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteClick(row);
                                      }}
                                    />
                                  </div>
                                );
                              default:
                                return <>{row[col.accessor]}</>;
                            }
                          })()}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
              {currentData.length === 0 && (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="text-center py-6 text-gray-500"
                  >
                    No data found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pagination */}
          <div
            className={`flex flex-col ${
              dealBy ? "md:flex-col gap-3" : "md:flex-row"
            } items-center justify-between px-4 py-4`}
          >
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => handleChangePage(currentPage - 1)}
                className="w-10 h-10 rounded-full border border-gray-300 hover:bg-gray-200 flex items-center justify-center"
                disabled={currentPage === 1}
              >
                <GoChevronLeft size={18} />
              </button>

              {/* Always show page 1 */}
              <button
                onClick={() => handleChangePage(1)}
                className={`w-8 h-8 rounded-full text-sm flex items-center justify-center transition ${
                  currentPage === 1
                    ? "bg-[#407BFF] text-white"
                    : "bg-[#E5E7EB] text-black hover:bg-[#407BFF] hover:text-white"
                }`}
              >
                1
              </button>

              {/* Show dots if current page is far from start */}
              {currentPage > 3 && (
                <div>
                  <span className="text-gray-500 px-0.5">•</span>
                  <span className="text-gray-500 px-0.5">•</span>
                  <span className="text-gray-500 px-0.5">•</span>
                </div>
              )}

              {/* Show current page and surrounding pages (but not 1 or last page) */}
              {[currentPage - 1, currentPage, currentPage + 1]
                .filter((page) => page > 1 && page < totalPages && page >= 1)
                .map((num) => (
                  <button
                    key={num}
                    onClick={() => handleChangePage(num)}
                    className={`w-8 h-8 rounded-full text-sm flex items-center justify-center transition ${
                      currentPage === num
                        ? "bg-[#407BFF] text-white"
                        : "bg-[#E5E7EB] text-black hover:bg-[#407BFF] hover:text-white"
                    }`}
                  >
                    {num}
                  </button>
                ))}

              {/* Show dots if current page is far from end */}
              {currentPage < totalPages - 2 && totalPages > 1 && (
                <div>
                  <span className="text-gray-500 px-0.5">•</span>
                  <span className="text-gray-500 px-0.5">•</span>
                  <span className="text-gray-500 px-0.5">•</span>
                </div>
              )}

              {/* Always show last page (if more than 1 page) */}
              {totalPages > 1 && (
                <button
                  onClick={() => handleChangePage(totalPages)}
                  className={`w-8 h-8 rounded-full text-sm flex items-center justify-center transition ${
                    currentPage === totalPages
                      ? "bg-[#407BFF] text-white"
                      : "bg-[#E5E7EB] text-black hover:bg-[#407BFF] hover:text-white"
                  }`}
                >
                  {totalPages}
                </button>
              )}

              <button
                onClick={() => handleChangePage(currentPage + 1)}
                className="w-10 h-10 rounded-full border border-gray-300 hover:bg-gray-200 flex items-center justify-center"
                disabled={currentPage === totalPages}
              >
                <GoChevronRight size={18} />
              </button>
            </div>

            <div className="flex items-center gap-2 mt-2 md:mt-0">
              <span className="text-sm">Show:</span>
              <Dropdown
                options={["10 Row", "15 Row", "20 Row", "25 Row", "All"]}
                defaultValue="10 Row"
                onSelect={(val) => {
                  if (val === "All") {
                    setRowsPerPage(filteredData.length || data.length);
                  } else {
                    const selected = Number.parseInt(val.split(" ")[0]);
                    setRowsPerPage(selected);
                  }
                  setCurrentPage(1);
                }}
                className="bg-black text-white rounded px-2 py-1 min-w-[90px]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* User Details Modal */}
      {selectedUser && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black/20 z-50"
          onClick={() => setSelectedUser(null)}
        >
          <div
            className="animate-scaleIn bg-white rounded-xl p-6 w-full max-w-sm mx-auto relative shadow-md transition-opacity duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Detail Data</h2>
              <button
                onClick={() => setSelectedUser(null)}
                className="text-xl font-bold text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
            <div className="text-center">
              <div className="mt-3 w-full flex">
                <span
                  className={`text-sm px-3 py-1 rounded-md ml-auto ${
                    selectedUser.status === "Active"
                      ? "text-[#10A760] bg-[#34C75933]"
                      : "text-red-600 bg-red-100"
                  }`}
                >
                  {selectedUser.status}
                </span>
              </div>
              <img
                src={
                  selectedUser.userImage
                    ? `${API_URL}${selectedUser.userImage}`
                    : "/placeholder.svg"
                }
                alt={selectedUser.name}
                className="w-36 h-36 mx-auto rounded-full object-cover"
              />
              <div className="my-5">
                <span className="text-sm text-black bg-[#12121226] px-3 py-2 rounded-full">
                  {selectedUser.role}
                </span>
              </div>
              {/* <h3 className="text-xl font-bold mt-1">
                {selectedUser.name} ({selectedUser.id})
              </h3> */}
              <h3 className="text-xl font-bold mt-1">
                {selectedUser.name}
              </h3>
              {/* <div className="mt-2 text-black text-sm font-bold">
                290/UKM_IK/XXVII/2025
              </div> */}
              <div className="flex justify-center gap-6 text-[#71717A] mt-2">
                <p>{selectedUser.email}</p>
                <p>{selectedUser.phone} </p>
              </div>
              {/* <p className="text-[#71717A] italic">{selectedUser.address}</p> */}

              <div className="flex justify-center gap-6 mt-6 Poppins-font font-medium">
                <p className="text-[#4E4FEB]">
                  Zone: <span className="text-black">Zone 1</span>
                </p>
                <p className="text-[#4E4FEB]">
                  Shop: <span className="text-black">Soho S parkle</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {isEditing && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black/20 z-50"
          onClick={() => setIsEditing(false)}
        >
          <div
            className="animate-scaleIn md:mx-12 xl:mx-0 bg-white w-md sm:w-[80vw] md:w-[90vw] lg:w-4xl xl:w-5xl h-[90vh] rounded-[7px] p-6 shadow-lg relative overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-[#056BB7]">
                Edit User
              </h2>
              <button
                onClick={() => setIsEditing(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {fetchingUserDetails ? (
              <div className="flex justify-center items-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left Column */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        First Name <span className="text-red-500">*</span>
                      </label>
                      <Input
                        name="firstName"
                        placeholder="First Name"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="w-full"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Last Name <span className="text-red-500">*</span>
                      </label>
                      <Input
                        name="lastName"
                        placeholder="Last Name"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="w-full"
                      />
                    </div>

                    <div className="flex flex-col w-full">
                      <label
                        htmlFor="password"
                        className="mb-1 font-semibold text-sm"
                      >
                        Password{" "}
                        {!formData._id && (
                          <span className="text-red-500">*</span>
                        )}
                      </label>
                      <div className="flex w-full items-center border border-gray-300 rounded-md overflow-hidden p-1">
                        <input
                          type="text"
                          id="password"
                          name="password"
                          placeholder={
                            formData._id
                              ? "Leave blank to keep current password"
                              : "Enter Password"
                          }
                          value={formData.password}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 text-sm text-gray-700 placeholder-gray-400 border-none outline-none"
                          required={!formData._id}
                        />
                        <Button
                          onClick={generatePassword}
                          className="bg-[#28A745] text-white text-sm font-semibold px-4 py-2 hover:bg-green-600 transition-colors !border-none"
                          text="Generate"
                          type="button"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col">
                      <label htmlFor="role" className="mb-1">
                        Role <span className="text-red-500">*</span>
                      </label>
                      {/* <Dropdown
                        options={roles.map((role) => role.name)}
                        className="w-full"
                        onSelect={handleRoleSelect}
                        defaultValue={selectedRoleName || "Select Role"}
                      /> */}
                      <Dropdown
                        options={roles.map((role) => role.name)}
                        className="w-full"
                        onSelect={handleRoleSelect}
                        noResultsMessage="No roles found"
                        defaultValue={selectedRoleName || "Select Role"}
                        searchable={true} // Add this prop
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <Input
                        name="email"
                        type="email"
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full"
                      />
                    </div>

                    {/* <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone No <span className="text-red-500">*</span>
                      </label>
                      <Input
                        name="phone"
                        placeholder="+65 362783233"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full"
                      />
                    </div> */}

                    {/* Phone Number Input with react-phone-number-input */}
                    <div className="flex flex-col text-sm font-medium text-gray-700 mb-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone No <span className="text-red-500">*</span>
                      </label>
                      <PhoneInput
                        placeholder="Enter phone number"
                        value={formData.phone}
                        onChange={handlePhoneChange}
                        defaultCountry="GB"
                        international
                        countryCallingCodeEditable={false}
                        className={`phone-input-container ${
                          phoneError ? "border-red-500" : ""
                        }`}
                        style={{
                          "--PhoneInputCountryFlag-height": "1em",
                          "--PhoneInputCountrySelectArrow-color": "#6b7280",
                        }}
                      />
                      {phoneError && (
                        <span className="text-red-500 text-xs mt-1">
                          {phoneError}
                        </span>
                      )}
                      <span className="text-gray-500 text-xs mt-1">
                        Phone number with country code (UK selected by default)
                      </span>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Status
                      </label>
                      <div className="flex gap-4">
                        <label className="flex items-center gap-2 text-sm border px-3 py-2 border-gray-200 rounded-md">
                          <input
                            type="radio"
                            name="status"
                            value="active"
                            checked={formData.status === "active"}
                            onChange={handleStatusChange}
                            className="accent-blue-600"
                          />
                          Active
                        </label>
                        <label className="flex items-center gap-2 text-sm border px-2 py-2 border-gray-200 rounded-md">
                          <input
                            type="radio"
                            name="status"
                            value="inactive"
                            checked={formData.status === "inactive"}
                            onChange={handleStatusChange}
                            className="accent-blue-600"
                          />
                          Inactive
                        </label>
                      </div>
                    </div>

                    {/* Confirm Password field - only show for new users */}
                    {!formData._id && (
                      <div className="flex flex-col">
                        <label htmlFor="confirmPassword" className="mb-1">
                          Confirm Password{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <Input
                          name="confirmPassword"
                          type="password"
                          placeholder="Confirm Password"
                          className="outline-none focus:outline-none w-full"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          // required
                        />
                      </div>
                    )}
                  </div>

                  {/* Right Column */}
                  <div className="space-y-4 relative">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Upload Image
                      </label>
                      <DropImage
                        uploadedFile={uploadedFile}
                        setUploadedFile={setUploadedFile}
                        className="w-full"
                      />

                      {/* Show current image if available */}
                      {userImagePreview && !selectedImagePreview && (
                        <div className="mt-4">
                          <p className="text-sm font-medium mb-2">
                            Current Image:
                          </p>
                          <img
                            src={userImagePreview}
                            alt="Current profile"
                            className="w-32 h-32 object-cover rounded-md border border-gray-300"
                          />
                        </div>
                      )}

                      {/* Show selected image preview if available */}
                      {selectedImagePreview && (
                        <div className="mt-4">
                          <p className="text-sm font-medium mb-2">
                            New Image Selected:
                          </p>
                          <img
                            src={selectedImagePreview}
                            alt="New profile"
                            className="w-32 h-32 object-cover rounded-md border border-gray-300"
                          />
                          <p className="text-sm text-green-600 mt-2">
                            {uploadedFile?.name}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="flex justify-end gap-4 pt-4 absolute bottom-0 w-full">
                      <Button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        text="Cancel"
                        className="px-6 py-2 bg-gray-200 text-gray-700 hover:bg-gray-300 !border-none"
                      />
                      <Button
                        type="submit"
                        disabled={loading}
                        text={loading ? "Updating..." : "Update User"}
                        className="px-6 py-2 bg-[#056BB7] text-white hover:bg-blue-700 !border-none"
                      />
                    </div>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black/20 z-50"
          onClick={() => {
            setShowDeleteModal(false);
            setDeleteUser(null);
          }}
        >
          <div
            className="animate-scaleIn bg-white rounded-xl w-full max-w-md relative shadow-lg border-3 border-gray-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center py-4 px-6 shadow-[0_2px_2px_0_#00000026]">
              <h2 className="text-xl font-medium">Delete {deleteUser?.name}</h2>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="text-xl font-bold text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
            <div className="mt-8 text-start pb-8 px-6 shadow-[0_2px_2px_0_#00000026]">
              <h3 className="text-lg font-semibold mb-1">
                Delete{" "}
                {tableTitle?.endsWith("s")
                  ? tableTitle?.slice(0, -1)
                  : tableTitle}
                ?
              </h3>
              <p className="text-sm text-gray-700">
                Are you sure you want to delete this{" "}
                {tableTitle?.endsWith("s")
                  ? tableTitle?.slice(0, -1)
                  : tableTitle}
                ?
              </p>
              <p className="text-sm text-red-600 font-medium mt-1">
                This action cannot be undone.
              </p>
            </div>

            <div className="flex justify-center gap-2 pb-3 py-4 px-6 shadow-[0_2px_2px_0_#00000026]">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-5 py-1 rounded-md hover:bg-gray-100 border-none shadow-[inset_0_0_4px_#00000026]"
              >
                Cancel
              </button>
              <Button
                text="Delete"
                icon={<AiOutlineDelete />}
                onClick={handleDeleteUser}
                className="!border-none px-5 py-1 bg-[#DC2626] hover:bg-red-700 text-white rounded-md flex items-center gap-1"
              />
            </div>
          </div>
        </div>
      )}

      {/* Delete Success Modal */}
      {deleteModal && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black/20 z-50"
          onClick={() => {
            setDeleteModal(false);
            setDeleteUser(null);
          }}
        >
          <div
            className="animate-scaleIn bg-white rounded-xl w-full max-w-md relative shadow-lg border-3 border-gray-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center py-4 px-6 shadow-[0_2px_2px_0_#00000026]">
              <h2 className="text-xl font-medium">Delete {deleteUser?.name}</h2>
              <button
                onClick={() => setDeleteModal(false)}
                className="text-xl font-bold text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
            <div className="mt-8 text-start pb-8 px-6 shadow-[0_2px_2px_0_#00000026]">
              <h3 className="text-lg font-semibold mb-1">
                Delete{" "}
                {tableTitle?.endsWith("s")
                  ? tableTitle?.slice(0, -1)
                  : tableTitle}
              </h3>
              <p className="text-sm text-gray-700">
                The{" "}
                {tableTitle?.endsWith("s")
                  ? tableTitle?.slice(0, -1)
                  : tableTitle}{" "}
                has been removed successfully.
              </p>
            </div>
            <div className="flex justify-center gap-2 pb-3 py-4 px-6 shadow-[0_2px_2px_0_#00000026]">
              <Button
                text="Close"
                onClick={() => setDeleteModal(false)}
                className="px-5 py-1 rounded-md hover:bg-gray-100 border-none shadow-[inset_0_0_4px_#00000026]"
              />
            </div>
          </div>
        </div>
      )}

      <style>{`
  .PhoneInput {
    display: flex;
    align-items: center;
    border: 1px solid #e5e7eb;
    border-radius: 0.5rem;
    padding: 0.75rem 1rem;
    background-color: white;
    font-size: 0.875rem;
    transition: all 0.2s ease-in-out;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  }
  
  .PhoneInput:hover {
    border-color: #d1d5db;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  }
  
  .PhoneInputCountrySelect {
    margin-right: 1rem;
    border: none;
    background: transparent;
    font-size: 0.875rem;
    cursor: pointer;
    padding: 0.25rem 0.5rem;
    border-radius: 0.375rem;
    transition: background-color 0.2s ease-in-out;
  }
  
  .PhoneInputCountrySelect:hover {
    background-color: #f9fafb;
  }
  
  .PhoneInputCountrySelect:focus {
    outline: none;
    background-color: #f3f4f6;
  }
  
  .PhoneInputInput {
    border: none;
    outline: none;
    flex: 1;
    font-size: 0.875rem;
    background: transparent;
    color: #374151;
    font-weight: 400;
  }
  
  .PhoneInputInput::placeholder {
    color: #9ca3af;
    font-weight: 400;
  }
  
  .phone-input-container.border-red-500 .PhoneInput {
    border-color: #ef4444;
    box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
  }
`}</style>
    </>
  );
};

export default UserTable;
