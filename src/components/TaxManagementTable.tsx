import React, { useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { RiEditLine } from "react-icons/ri";
import { GoChevronLeft, GoChevronRight } from "react-icons/go";
import { LuEye } from "react-icons/lu";
import { DatePicker } from "antd";
import axios from "axios";
import { toast } from "react-toastify";
import moment from "moment";
import dayjs from "dayjs";

import Input from "./Input";
import Dropdown from "./Dropdown";
import Button from "./Button";

type ColumnType = "text" | "image" | "status" | "actions" | "button" | "custom";

interface Column {
  header: string;
  accessor: string;
  type?: ColumnType;
}

interface TaxManagementTableProps {
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
  onUpdate?: () => void; // Add this for refreshing data
  canUpdate?: boolean;
  canDelete?: boolean;
}

// Helper function to get auth token
const getAuthToken = () => {
  let token = localStorage.getItem("token");
  if (!token) {
    token = sessionStorage.getItem("token");
  }
  return token;
};

// Helper function to format date in DD-MMM-YYYY format
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, "0");
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

const TaxManagementTable: React.FC<TaxManagementTableProps> = ({
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
  onUpdate,
  canUpdate = true,
  canDelete = true,
}) => {
  const { RangePicker } = DatePicker;

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [deleteZone, setDeleteZone] = useState<any>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // Edit state variables
  const [isEditing, setIsEditing] = useState(false);
  const [editingRow, setEditingRow] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Form data for editing
  const [formData, setFormData] = useState({
    _id: "",
    taxAmount: "",
    description: "", // Keep as description, not taxDescription
    taxDateRange: null as any,
  });

  // Add loading state for fetching tax details
  const [loadingTaxDetails, setLoadingTaxDetails] = useState<boolean>(false);

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

  // Handle input changes for edit form
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };


  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.taxAmount) {
      toast.error("Please enter a tax amount");
      return;
    }

    if (!formData.description.trim()) {
      toast.error("Please enter a tax description");
      return;
    }

    if (
      !formData.taxDateRange ||
      !formData.taxDateRange[0] ||
      !formData.taxDateRange[1]
    ) {
      toast.error("Please select a date range for tax");
      return;
    }

    // Handle different date object types (moment/dayjs)
    let startDate, endDate;

    if (formData.taxDateRange[0].$d) {
      // If it's a dayjs object
      startDate = formData.taxDateRange[0].$d;
      endDate = formData.taxDateRange[1].$d;
    } else if (formData.taxDateRange[0]._d) {
      // If it's a moment object
      startDate = formData.taxDateRange[0]._d;
      endDate = formData.taxDateRange[1]._d;
    } else if (formData.taxDateRange[0].toDate) {
      // If it has toDate method (moment)
      startDate = formData.taxDateRange[0].toDate();
      endDate = formData.taxDateRange[1].toDate();
    } else {
      // If it's already a Date object
      startDate = new Date(formData.taxDateRange[0]);
      endDate = new Date(formData.taxDateRange[1]);
    }

    // Format dates as strings in YYYY-MM-DD format for API
    const formattedStartDate =
      startDate.getFullYear() +
      "-" +
      String(startDate.getMonth() + 1).padStart(2, "0") +
      "-" +
      String(startDate.getDate()).padStart(2, "0");

    const formattedEndDate =
      endDate.getFullYear() +
      "-" +
      String(endDate.getMonth() + 1).padStart(2, "0") +
      "-" +
      String(endDate.getDate()).padStart(2, "0");

    // Check if start date is before end date
    if (formattedStartDate >= formattedEndDate) {
      toast.error("End date must be after the start date");
      return;
    }

    setIsSubmitting(true);

    try {
      const API_URL = import.meta.env.VITE_BASE_URL || "http://localhost:9000";
      const token = getAuthToken();

      if (!token) {
        toast.error("Authentication token not found. Please login again.");
        return;
      }

      const payload = {
        taxAmount: formData.taxAmount,
        description: formData.description.trim(),
        startDate: formattedStartDate,
        endDate: formattedEndDate,
      };

      const response = await axios.put(
        `${API_URL}/api/abid-jewelry-ms/updateTax/${formData._id}`,
        payload,
        {
          headers: {
            "x-access-token": token,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        toast.success("Tax updated successfully!");
        setIsEditing(false);

        // Reset form
        setFormData({
          _id: "",
          taxAmount: "",
          description: "",
          taxDateRange: null,
        });

        // Refresh data
        if (onUpdate) {
          onUpdate();
        }
      } else {
        toast.error(response.data.message || "Failed to update tax");
      }
    } catch (error) {
      console.error("Error updating tax:", error);
      if (axios.isAxiosError(error)) {
        if (!error.response) {
          toast.error("Network error. Please check your internet connection.");
        } else {
          toast.error(error.response.data.message || "Failed to update tax");
        }
      } else {
        toast.error("An unexpected error occurred while updating tax");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle delete tax
  const handleDeleteTax = async () => {
    try {
      const API_URL = import.meta.env.VITE_BASE_URL || "http://localhost:9000";
      const token = getAuthToken();

      if (!token) {
        toast.error("Authentication token not found. Please login again.");
        return;
      }

      const response = await axios.delete(
        `${API_URL}/api/abid-jewelry-ms/deleteTax/${deleteZone._id}`,
        {
          headers: {
            "x-access-token": token,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        toast.success("Tax deleted successfully!");
        setShowDeleteModal(false);
        setDeleteModal(true);

        // Refresh data
        if (onUpdate) {
          onUpdate();
        }
      } else {
        toast.error(response.data.message || "Failed to delete tax");
      }
    } catch (error) {
      console.error("Error deleting tax:", error);
      if (axios.isAxiosError(error)) {
        if (!error.response) {
          toast.error("Network error. Please check your internet connection.");
        } else {
          toast.error(error.response.data.message || "Failed to delete tax");
        }
      } else {
        toast.error("An unexpected error occurred while deleting tax");
      }
    }
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
                placeholder="Search Date, Amount, Description"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="max-w-full sm:max-w-2xl !rounded-3xl outline-none "
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
            className={`flex md:justify-end ${
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
              >
                <GoChevronLeft size={18} />
              </button>

              {[1, 2, 3, 10].map((num, idx) => (
                <React.Fragment key={num}>
                  {idx === 3 && (
                    <div>
                      <span className="text-gray-500 px-0.5">•</span>
                      <span className="text-gray-500 px-0.5">•</span>
                      <span className="text-gray-500 px-0.5">•</span>
                    </div>
                  )}
                  <button
                    onClick={() => handleChangePage(num)}
                    className={`w-8 h-8 rounded-full text-sm flex items-center justify-center transition ${
                      currentPage === num
                        ? "bg-[#407BFF] text-white"
                        : "bg-[#E5E7EB] text-black hover:bg-[#407BFF] hover:text-white"
                    }`}
                  >
                    {num}
                  </button>
                </React.Fragment>
              ))}

              <button
                onClick={() => handleChangePage(currentPage + 1)}
                className="w-10 h-10 rounded-full border border-gray-300 hover:bg-gray-200 flex items-center justify-center"
              >
                <GoChevronRight size={18} />
              </button>
            </div>

            <div className="flex items-center gap-2 mt-2 md:mt-0">
              <span className="text-sm">Show:</span>
              <Dropdown
                options={["5 Row", "10 Row", "15 Row", "20 Row"]}
                onSelect={(val) => {
                  const selected = parseInt(val.split(" ")[0]);
                  setRowsPerPage(selected);
                  setCurrentPage(1);
                }}
                className="bg-black text-white rounded px-2 py-1 min-w-[90px]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Edit Tax Modal */}
      {/* {isEditing && (
                <>
                    <div
                        className="fixed inset-0 flex items-center justify-center bg-black/20 z-50"
                        onClick={() => setIsEditing(false)}
                    >
                        <div
                            className="animate-scaleIn bg-white w-[90vw] overflow-hidden sm:w-lg md:w-[80vw] lg:w-3xl h-auto max-h-[80vh] overflow-y-auto rounded-[7px] shadow-lg"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <p className="Source-Sans-Pro-font p-4 text-[#056BB7] font-semibold text-[20px] sm:text-[24px] m-0 sticky top-0 bg-white shadow-sm z-40">
                                Edit Tax
                            </p>

                            <form
                                className="mt-2 text-[15px] Poppins-font font-medium w-full p-4"
                                onSubmit={handleEditSubmit}
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                                    <div className="flex flex-col">
                                        <label className="mb-1 text-black">Tax Date Range</label>
                                        <RangePicker
                                            className="h-10 !text-gray-400 !border-[#D1D5DC]"
                                            value={formData.taxDateRange}
                                            onChange={(dates) => {
                                                setFormData(prev => ({
                                                    ...prev,
                                                    taxDateRange: dates
                                                }));
                                            }}
                                            format="DD-MMM-YYYY"
                                            allowClear={true}
                                        />
                                    </div>

                                    <div className="flex flex-col">
                                        <label className="mb-1 text-black">Tax Amount</label>
                                        <Input
                                            name="taxAmount"
                                            type="number"
                                            placeholder="Tax Amount"
                                            value={formData.taxAmount}
                                            onChange={handleInputChange}
                                            className="outline-none focus:outline-none w-full"
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-col w-full mb-6">
                                    <label className="mb-1 text-black">Tax Description</label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        placeholder="Tax Description"
                                        rows={4}
                                        className="Poppins-font font-medium w-full px-4 py-2 border border-gray-300 rounded-md text-sm !focus:outline-none outline-none resize-none"
                                    />
                                </div>

                                <div className="flex justify-end gap-4 font-medium pt-2">
                                    <Button
                                        type="button"
                                        text="Cancel"
                                        onClick={() => setIsEditing(false)}
                                        className="px-6 !bg-gray-200 text-gray-800 !border-none"
                                    />
                                    <Button
                                        type="submit"
                                        text={isSubmitting ? "Updating..." : "Update"}
                                        disabled={isSubmitting}
                                        className="px-6 !bg-[#056BB7] text-white !border-none"
                                    />
                                </div>
                            </form>
                        </div>
                    </div>
                </>
            )} */}

      {isEditing && canUpdate && (
        <>
          <div
            className="fixed inset-0 flex items-center justify-center bg-black/20 z-50"
            onClick={() => setIsEditing(false)}
          >
            <div
              className="animate-scaleIn bg-white w-[90vw] overflow-hidden sm:w-lg md:w-[80vw] lg:w-3xl h-auto max-h-[80vh] overflow-y-auto rounded-[7px] shadow-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <p className="Source-Sans-Pro-font p-4 text-[#056BB7] font-semibold text-[20px] sm:text-[24px] m-0 sticky top-0 bg-white shadow-sm z-40">
                Edit Tax
              </p>

              {loadingTaxDetails ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : (
                <form
                  className="mt-2 text-[15px] Poppins-font font-medium w-full p-4"
                  onSubmit={handleEditSubmit}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                    <div className="flex flex-col">
                      <label className="mb-1 text-black">Tax Date Range</label>
                      <RangePicker
                        className="h-10 !text-gray-400 !border-[#D1D5DC]"
                        value={formData.taxDateRange}
                        onChange={(dates) => {
                          setFormData((prev) => ({
                            ...prev,
                            taxDateRange: dates,
                          }));
                        }}
                        format="DD-MMM-YYYY"
                        allowClear={true}
                      />
                    </div>

                    <div className="flex flex-col">
                      <label className="mb-1 text-black">Tax Amount</label>
                      <Input
                        name="taxAmount"
                        type="number"
                        placeholder="Tax Amount"
                        value={formData.taxAmount}
                        onChange={handleInputChange}
                        className="outline-none focus:outline-none w-full"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col w-full mb-6">
                    <label className="mb-1 text-black">Tax Description</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Tax Description"
                      rows={4}
                      className="Poppins-font font-medium w-full px-4 py-2 border border-gray-300 rounded-md text-sm !focus:outline-none outline-none resize-none"
                    />
                  </div>

                  <div className="flex justify-end gap-4 font-medium pt-2">
                    <Button
                      type="button"
                      text="Cancel"
                      onClick={() => setIsEditing(false)}
                      className="px-6 !bg-gray-200 text-gray-800 !border-none"
                    />
                    <Button
                      type="submit"
                      text={isSubmitting ? "Updating..." : "Update"}
                      disabled={isSubmitting}
                      className="px-6 !bg-[#056BB7] text-white !border-none"
                    />
                  </div>
                </form>
              )}
            </div>
          </div>
        </>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && canDelete && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black/20 z-50 border"
          onClick={() => {
            setShowDeleteModal(false);
            setDeleteZone(null);
          }}
        >
          <div
            className="animate-scaleIn bg-white rounded-xl w-full max-w-md relative shadow-lg border-3 border-gray-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center py-4 px-6 shadow-[0_2px_2px_0_#00000026]">
              <h2 className="text-xl font-medium">Delete Tax Record</h2>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="text-xl font-bold text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
            <div className="mt-8 text-start pb-8 px-6 shadow-[0_2px_2px_0_#00000026]">
              <h3 className="text-lg font-semibold mb-1">Delete Tax Record</h3>
              <p className="text-sm text-gray-700">
                Are you sure you want to delete this tax record?
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
                onClick={handleDeleteTax}
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
            setDeleteZone(null);
          }}
        >
          <div
            className="animate-scaleIn bg-white rounded-xl w-full max-w-md relative shadow-lg border-3 border-gray-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center py-4 px-6 shadow-[0_2px_2px_0_#00000026]">
              <h2 className="text-xl font-medium">Tax Deleted</h2>
              <button
                onClick={() => setDeleteModal(false)}
                className="text-xl font-bold text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
            <div className="mt-8 text-start pb-8 px-6 shadow-[0_2px_2px_0_#00000026]">
              <h3 className="text-lg font-semibold mb-1">Tax Record Deleted</h3>
              <p className="text-sm text-gray-700">
                The tax record has been successfully removed.
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

      {/* Tax Details Modal */}
      {selectedUser && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black/20 z-50"
          onClick={() => setSelectedUser(null)}
        >
          <div
            className="animate-scaleIn bg-white w-full max-w-md rounded-2xl shadow-xl p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="grid grid-cols-1 gap-x-4 gap-y-2 text-sm text-gray-700 mb-6">
              <h3 className="col-span-2 text-blue-600 font-semibold text-lg">
                Tax Details
              </h3>

              <span className="font-medium">Date Range</span>
              <span className="text-gray-500 text-right">
                {selectedUser?.date}
              </span>

              <span className="font-medium">Tax Amount</span>
              <span className="text-gray-500 text-right">
                {selectedUser?.taxAmount}
              </span>

              <span className="font-medium">Tax Description</span>
              <span className="text-gray-500 text-right">
                {selectedUser?.description}
              </span>
            </div>

            <div className="flex justify-end">
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

export default TaxManagementTable;
