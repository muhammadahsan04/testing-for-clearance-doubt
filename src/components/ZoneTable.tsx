import React, { useState, useEffect } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { RiEditLine } from "react-icons/ri";
import { GoChevronLeft, GoChevronRight } from "react-icons/go";
import { LuEye } from "react-icons/lu";

import Input from "./Input";
import Dropdown from "./Dropdown";
import Button from "./Button";
import UserDropDown from "./UserDropDown";
import StoreDropDown from "./StoreDropDown";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

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

interface ZoneData {
  id: string;
  name: string;
  status: string;
  _id: string;
  zoneId?: string;
}

interface Column {
  header: string;
  accessor: string;
  type?: ColumnType;
}

interface ZoneRepresentative {
  _id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  status: string;
}

interface Store {
  _id: string;
  storeName: string;
  location: string;
  email: string;
  phoneNumber: string;
  status: string;
}

interface ZoneTableProps {
  columns: Column[];
  data: any[];
  tableTitle?: string;
  rowsPerPageOptions?: number[];
  defaultRowsPerPage?: number;
  searchable?: boolean;
  filterByStatus?: boolean;
  onEdit?: (row: any) => void;
  onDelete?: (row: any) => void;
  tableDataAlignment?: "zone" | "user" | "center" | "onlyZone"; // Add more if needed
  className?: string;
  onRowClick?: (row: any) => void;
  dealBy?: boolean;
  enableRowModal?: boolean;
  eye?: boolean;
  onUpdate?: (updatedZone: any) => void; // Add this line
}

// Helper function to get auth token
const getAuthToken = () => {
  let token = localStorage.getItem("token");
  if (!token) {
    token = sessionStorage.getItem("token");
  }
  return token;
};

const ZoneTable: React.FC<ZoneTableProps> = ({
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
  tableDataAlignment = "start", // default
  dealBy,
  onUpdate, // Add this line
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedUser, setSelectedUser] = useState<any>(null); // for modal
  const [deleteZone, setDeleteZone] = useState<any>(null); // for modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [search, setSearch] = useState(""); // ✅ Local search state
  const [statusFilter, setStatusFilter] = useState("All"); // ✅ Status filter state
  // Selected names for display purposes
  const [selectedRepNames, setSelectedRepNames] = useState<string[]>([]);
  const [selectedStoreNames, setSelectedStoreNames] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [zoneData, setZoneData] = useState<ZoneData[]>([]);

  // To these two state variables edit user
  const [isEditing, setIsEditing] = useState(false);
  const [editingRow, setEditingRow] = useState<any>(null);
  const [loadingZoneDetails, setLoadingZoneDetails] = useState<boolean>(false);

  // Check permissions
  const userRole = getUserRole();
  const isAdmin = userRole === "Admin" || userRole === "SuperAdmin";
  const canEdit = isAdmin || hasPermission("Zone Management", "update");
  const canDelete = isAdmin || hasPermission("Zone Management", "delete");

  // Form state
  const [formData, setFormData] = useState({
    _id: "",
    zoneId: "",
    name: "",
    location: "",
    address: "",
    phoneNumber: "",
    zoneRepresentative: [] as string[],
    stores: [] as string[],
    status: "active",
  });

  const navigate = useNavigate();

  const filteredData = data.filter((item) => {
    // Create a version of the item without the status field for searching
    const searchableItem = { ...item };
    delete searchableItem.status;

    const matchesSearch = Object.values(searchableItem)
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase());

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

  // Fetch zone details when edit button is clicked
  const fetchZoneDetails = async (zoneId: string) => {
    setLoadingZoneDetails(true);
    try {
      const API_URL = import.meta.env.VITE_BASE_URL || "http://localhost:9000";
      const token = getAuthToken();

      if (!token) {
        toast.error("Authentication token not found. Please login again.");
        return;
      }

      const response = await axios.get(
        `${API_URL}/api/abid-jewelry-ms/getOneZone/${zoneId}`,
        {
          headers: {
            "x-access-token": token,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        const zoneDetails = response.data.data;

        // Extract representative IDs and names for display
        const repIds = zoneDetails.zoneRepresentative.map(
          (rep: any) => rep._id
        );
        const repNames = zoneDetails.zoneRepresentative.map(
          (rep: any) => `${rep.firstName} ${rep.lastName}`
        );

        // Extract store IDs and names for display
        const storeIds = zoneDetails.stores.map((store: any) => store._id);
        const storeNames = zoneDetails.stores.map(
          (store: any) => store.storeName
        );

        // Update form data with zone details
        setFormData({
          _id: zoneDetails._id,
          zoneId: zoneDetails.zoneId,
          name: zoneDetails.name,
          location: zoneDetails.location,
          address: zoneDetails.address,
          phoneNumber: zoneDetails.phoneNumber,
          zoneRepresentative: repIds,
          stores: storeIds,
          status: zoneDetails.status,
        });

        // Update selected names for display
        setSelectedRepNames(repNames);
        setSelectedStoreNames(storeNames);
      } else {
        toast.error(response.data.message || "Failed to fetch zone details");
      }
    } catch (error) {
      console.error("Error fetching zone details:", error);
      if (axios.isAxiosError(error)) {
        if (!error.response) {
          toast.error("Network error. Please check your internet connection.");
        } else {
          toast.error(
            error.response.data.message || "Failed to fetch zone details"
          );
        }
      } else {
        toast.error("An unexpected error occurred while fetching zone details");
      }
    } finally {
      setLoadingZoneDetails(false);
    }
  };

  // Handle store selection
  const handleStoreSelect = (storeId: string, storeName: string) => {
    // Check if the store is already selected
    if (!formData.stores.includes(storeId)) {
      setFormData((prev: any) => ({
        ...prev,
        stores: [...prev.stores, storeId],
      }));
      setSelectedStoreNames((prev) => [...prev, storeName]);
    } else {
      toast.info("This store is already selected");
    }
  };

  // Handle user selection for zone representative
  const handleUserSelect = (userId: string, userName: string) => {
    // Check if the user is already selected
    if (!formData.zoneRepresentative.includes(userId)) {
      setFormData((prev) => ({
        ...prev,
        zoneRepresentative: [...prev.zoneRepresentative, userId],
      }));
      setSelectedRepNames((prev) => [...prev, userName]);
    } else {
      toast.info("This representative is already selected");
    }
  };

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };


  // Remove a selected representative
  const removeRepresentative = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      zoneRepresentative: prev.zoneRepresentative.filter((_, i) => i !== index),
    }));
    setSelectedRepNames((prev) => prev.filter((_, i) => i !== index));
  };

  // Remove a selected store
  const removeStore = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      stores: prev.stores.filter((_, i) => i !== index),
    }));
    setSelectedStoreNames((prev) => prev.filter((_, i) => i !== index));
  };

  // Handle zone deletion - Remove the API call from here
  const handleDeleteZone = () => {
    if (!canDelete) {
      toast.error("You don't have permission to delete zones");
      return;
    }

    // Just call the parent's onDelete function like in the original code
    if (onDelete && deleteZone) {
      onDelete(deleteZone);
    }
    setShowDeleteModal(false);
    setDeleteModal(true); // Show success modal
  };

  const API_URL = import.meta.env.VITE_BASE_URL || "http://localhost:9000";
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
                placeholder="Search Zone name, ID"
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
                      // style={{
                      //   ...(isFirst && { width: "25%", whiteSpace: "nowrap" }),
                      //   ...(isLast && { width: "25%", whiteSpace: "nowrap", textAlign: "end" }),
                      // }}

                      style={{
                        ...(tableDataAlignment === "onlyZone"
                          ? {
                              ...(isFirst && {
                                width: "15%",
                                whiteSpace: "nowrap",
                              }),
                              ...(isLast && {
                                width: "15%",
                                whiteSpace: "nowrap",
                                textAlign: "end",
                              }),
                            }
                          : {
                              ...(isFirst && {
                                width: "25%",
                                whiteSpace: "nowrap",
                              }),
                              ...(isLast && {
                                width: "25%",
                                whiteSpace: "nowrap",
                                textAlign: "end",
                              }),
                            }),
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
                                  <div className="flex justify-start gap-2">
                                    {eye && (
                                      <LuEye
                                        className="cursor-pointer"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          navigate("purchase-order-detail");
                                        }}
                                      />
                                    )}
                                    <RiEditLine
                                      className={`cursor-pointer ${
                                        canEdit
                                          ? "hover:text-blue-500"
                                          : "text-gray-400 cursor-not-allowed"
                                      }`}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        if (!canEdit) {
                                          toast.error(
                                            "You don't have permission to edit zones"
                                          );
                                          return;
                                        }
                                        setIsEditing(true);
                                        setEditingRow(row);
                                        fetchZoneDetails(row._id);
                                      }}
                                    />
                                    <AiOutlineDelete
                                      className={`cursor-pointer ${
                                        canDelete
                                          ? "hover:text-red-500"
                                          : "text-gray-400 cursor-not-allowed"
                                      }`}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        if (!canDelete) {
                                          toast.error(
                                            "You don't have permission to delete zones"
                                          );
                                          return;
                                        }
                                        setShowDeleteModal(true);
                                        setDeleteZone(row);
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
      {/* Zone Details Modal */}
      {selectedUser && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black/20 z-50"
          onClick={() => setSelectedUser(null)}
        >
          <div
            className="animate-scaleIn bg-white w-full max-w-2xl rounded-2xl shadow-xl p-6"
            onClick={(e) => e.stopPropagation()}
          >
            {loadingZoneDetails ? (
              <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-gray-700 mb-6">
                <h3 className="col-span-2 text-blue-600 font-semibold text-lg mb-2">
                  {selectedUser.name}
                </h3>

                <span className="font-medium">Location</span>
                <span className="text-gray-500 text-right">
                  {selectedUser.location}
                </span>

                <span className="font-medium">Address</span>
                <span className="text-gray-500 text-right">
                  {selectedUser.address}
                </span>

                <span className="font-medium">Phone No</span>
                <span className="text-gray-500 text-right">
                  {selectedUser.phoneNumber}
                </span>

                <span className="font-medium">Zone Representative</span>
                <div className="text-gray-500 text-right">
                  {selectedUser.zoneRepresentative &&
                  selectedUser.zoneRepresentative.length > 0 ? (
                    <div className="flex flex-col space-y-1">
                      {selectedUser.zoneRepresentative.map(
                        (rep: any, index: any) => (
                          <span key={index}>
                            {rep.firstName} {rep.lastName}
                          </span>
                        )
                      )}
                    </div>
                  ) : (
                    <span>No representatives assigned</span>
                  )}
                </div>

                <span className="font-medium">Stores</span>
                <div className="text-gray-500 space-y-1 flex flex-col text-right">
                  {selectedUser.stores && selectedUser.stores.length > 0 ? (
                    selectedUser.stores.map((store: any, index: any) => (
                      <span key={index}>{store.storeName}</span>
                    ))
                  ) : (
                    <span>No stores assigned</span>
                  )}
                </div>

                <span className="font-medium">Status</span>
                <span className="text-gray-500 text-right">
                  <span
                    className={`inline-block px-2 py-1 text-xs rounded-full ${
                      selectedUser.status === "active"
                        ? "bg-green-100 text-green-600"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {selectedUser.status.charAt(0).toUpperCase() +
                      selectedUser.status.slice(1)}
                  </span>
                </span>
              </div>
            )}
            <div className="flex justify-end mt-6">
              <Button
                text="Close"
                onClick={() => setSelectedUser(null)}
                className="px-4 py-1 !bg-gray-200 text-gray-800 !border-none"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ZoneTable;
