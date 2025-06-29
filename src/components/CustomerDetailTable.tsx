import React, { useState, useEffect } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { RiEditLine } from "react-icons/ri";
import { GoChevronLeft, GoChevronRight } from "react-icons/go";
import { LuEye } from "react-icons/lu";
import axios from "axios";
import { toast } from "react-toastify";

import chainforModalImage from "../assets/chainforModalImage.png";
import Input from "./Input";
import Dropdown from "./Dropdown";
import Button from "./Button";
import DatePicker from "./DatePicker";
import { Navigate, useNavigate } from "react-router-dom";
import { IoIosPrint } from "react-icons/io";
import HorizontalLinearAlternativeLabelStepper from "./HorizontalLinearAlternativeLabelStepper";
import { FaDownload } from "react-icons/fa";

// Helper function to get auth token
const getAuthToken = () => {
  let token = localStorage.getItem("token");
  if (!token) {
    token = sessionStorage.getItem("token");
  }
  return token;
};

// Add export to the type definition
export type ColumnType =
  | "text"
  | "image"
  | "status"
  | "actions"
  | "button"
  | "custom";

export interface Column {
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

interface ViewAllCustomerTableProps {
  columns: Column[];
  data: any[];
  tableTitle?: string;
  rowsPerPageOptions?: number[];
  defaultRowsPerPage?: number;
  searchable?: boolean;
  filterByStatus?: boolean;
  onEdit?: (row: any) => void;
  onDelete?: (row: any) => void;
  tableDataAlignment?: "zone" | "user" | "center"; // Add more if needed
  className?: string;
  onRowClick?: (row: any) => void;
  dealBy?: boolean;
  enableRowModal?: boolean;
  eye?: boolean;
  canUpdate?: boolean;
  canDelete?: boolean;
}

const ViewAllCustomerTable: React.FC<ViewAllCustomerTableProps> = ({
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
  canUpdate = true,
  canDelete = true,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedUser, setSelectedUser] = useState<any>(null); // for modal
  const [deleteUser, setDeleteUser] = useState<any>(null); // for modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [search, setSearch] = useState(""); // Local search state
  const [statusFilter, setStatusFilter] = useState("All"); // Status filter state
  const [isEditing, setIsEditing] = useState(false);
  const [editingRow, setEditingRow] = useState<any>(null);
  const [formData, setFormData] = useState<any>(null);
  const [showPurchaseOrderDetailModal, setShowPurchaseOrderDetailModal] =
    useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [fetchingCustomerDetails, setFetchingCustomerDetails] =
    useState<boolean>(false);

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
  // Update the handleDeleteCustomer function:
  const handleDeleteCustomer = async () => {
    if (!deleteUser) return;

    setIsDeleting(true);
    try {
      const API_URL =
        import.meta.env.VITE_BASE_URL || "http://192.168.100.18:9000";
      const token = getAuthToken();

      if (!token) {
        toast.error("Authentication token not found. Please login again.");
        return;
      }

      const response = await axios.delete(
        `${API_URL}/api/abid-jewelry-ms/deleteCustomer/${deleteUser.id}`,
        {
          headers: {
            "x-access-token": token,
          },
        }
      );

      if (response.data.success) {
        toast.success("Customer deleted successfully!");
        setShowDeleteModal(false);
        setDeleteModal(true);

        // Set a timeout to close the success modal and refresh data
        setTimeout(() => {
          setDeleteModal(false);
          setDeleteUser(null);

          // Call the parent callback to refresh data instead of page reload
          if (onDelete) {
            onDelete(null);
          }
        }, 1500);
      } else {
        toast.error(response.data.message || "Failed to delete customer");
      }
    } catch (error) {
      console.error("Error deleting customer:", error);
      if (axios.isAxiosError(error) && error.response) {
        toast.error(error.response.data.message || "Failed to delete customer");
      } else {
        toast.error("An error occurred while deleting the customer");
      }
    } finally {
      setIsDeleting(false);
    }
  };

  const productDetails = {
    sku: "Chain",
    barcode: "Eternal Glow",
    category: "Chain",
    subCategory: "Eternal Glow",
    style: "Cuban",
    goldCategory: "10K",
    diamondWeight: "4.5 CWT",
    goldWeight: "150 gms",
    length: '18"',
    mm: "8mm",
    size: "7",
    costPrice: "15.50",
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
                placeholder="Search name, ID"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-auto !rounded-3xl outline-none "
              />
            )}

            <Dropdown
              options={["All", "Active", "Inactive"]}
              DropDownName="Status"
              defaultValue="All"
              onSelect={(val) => {
                setStatusFilter(val);
                setCurrentPage(1);
              }}
            />
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

      {/* Edit Customer Modal */}
      {isEditing && formData && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black/20 z-50"
          onClick={() => setIsEditing(false)}
        >
          <div
            className="animate-scaleIn bg-white md:w-2xl lg:w-3xl sm:w-xl w-md md:h-auto h-[70vh] overflow-y-auto rounded-[7px] p-6 shadow-lg relative"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="Source-Sans-Pro-font text-[#056BB7] font-semibold text-[24px] m-0">
              Edit Customer
            </p>
            {fetchingCustomerDetails ? (
              <div className="flex justify-center items-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <form
                className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 lg:gap-4 xl:gap-4 text-[15px] Poppins-font font-medium"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleUpdateCustomer();
                }}
              >
                {/* Left Side */}
                <div className="space-y-4">
                  <div className="flex flex-col">
                    <label htmlFor="firstName" className="mb-1">
                      First Name
                    </label>
                    <Input
                      name="firstName"
                      placeholder="First Name"
                      className="outline-none focus:outline-none w-full"
                      value={formData.firstName}
                      onChange={handleFormChange}
                    />
                  </div>

                  <div className="flex flex-col">
                    <label htmlFor="email" className="mb-1">
                      Email
                    </label>
                    <Input
                      name="email"
                      placeholder="john@example.com"
                      className="outline-none focus:outline-none w-full"
                      value={formData.email}
                      onChange={handleFormChange}
                    />
                  </div>

                  <div className="flex flex-col w-full">
                    <label className="mb-1">Date of Birth</label>
                    <DatePicker
                      onChange={handleDateChange}
                      type={"calendar" === "calendar" ? "date" : "text"}
                      className="w-full"
                      value={formData.dob}
                    />
                  </div>

                  <div className="flex flex-col">
                    <label htmlFor="address" className="mb-1">
                      Address
                    </label>
                    <textarea
                      name="address"
                      placeholder="200 Peachtree St NW, Atlanta, GA 30303"
                      rows={3}
                      className="Poppins-font font-medium w-full px-4 py-2 border border-gray-300 rounded-md text-sm !focus:outline-none outline-none resize-none"
                      value={formData.address}
                      onChange={handleFormChange}
                    ></textarea>
                  </div>
                </div>

                {/* Right Side */}
                <div className="space-y-4">
                  <div className="flex flex-col">
                    <label htmlFor="lastName" className="mb-1">
                      Last Name
                    </label>
                    <Input
                      name="lastName"
                      placeholder="Last Name"
                      className="outline-none focus:outline-none w-full"
                      value={formData.lastName}
                      onChange={handleFormChange}
                    />
                  </div>
                  {/* <div className="flex flex-col">
                  <label htmlFor="phoneNo" className="mb-1">
                    Phone No
                  </label>
                  <Input
                    name="phoneNo"
                    placeholder="+65 362783233"
                    className="outline-none focus:outline-none w-full"
                    value={formData.phone}
                    onChange={handleFormChange}
                  />
                </div> */}

                  <div className="flex flex-col">
                    <label htmlFor="phone" className="mb-1">
                      Phone No
                    </label>
                    <Input
                      name="phone" // Fix: change from "phoneNo" to "phone"
                      placeholder="+65 362783233"
                      className="outline-none focus:outline-none w-full"
                      value={formData.phone}
                      onChange={handleFormChange}
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
                          onChange={() =>
                            handleSegmentationChange("frequentBuyers")
                          }
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
            )}
            <div className="flex justify-end gap-4 mt-6">
              <Button
                text="Cancel"
                className="px-6 !bg-[#F4F4F5] !border-none"
                onClick={() => setIsEditing(false)}
              />
              <Button
                text={isSubmitting ? "Updating..." : "Update"}
                className="px-6 !bg-[#056BB7] border-none text-white"
                onClick={handleUpdateCustomer}
                disabled={isSubmitting}
              />
            </div>
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
              <h3 className="text-lg font-semibold mb-1">Delete Customer</h3>
              <p className="text-sm text-gray-700">
                Are you sure you want to delete this Customer?
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
                text={isDeleting ? "Deleting..." : "Delete"}
                icon={<AiOutlineDelete />}
                onClick={handleDeleteCustomer}
                disabled={isDeleting}
                className="!border-none px-5 py-1 bg-[#DC2626] hover:bg-red-700 text-white rounded-md flex items-center gap-1"
              />
            </div>
          </div>
        </div>
      )}

      {/* Update the delete success modal close handler: */}
      {deleteModal && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black/20 z-50"
          onClick={() => {
            setDeleteModal(false);
            setDeleteUser(null);
            if (onDelete) {
              onDelete(null);
            }
          }}
        >
          <div
            className="animate-scaleIn bg-white rounded-xl w-full max-w-md relative shadow-lg border-3 border-gray-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center py-4 px-6 shadow-[0_2px_2px_0_#00000026]">
              <h2 className="text-xl font-medium">Delete {deleteUser?.name}</h2>
              <button
                onClick={() => {
                  setDeleteModal(false);
                  setDeleteUser(null);
                  if (onDelete) {
                    onDelete(null);
                  }
                }}
                className="text-xl font-bold text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
            <div className="mt-8 text-start pb-8 px-6 shadow-[0_2px_2px_0_#00000026]">
              <h3 className="text-lg font-semibold mb-1">Delete Customer</h3>
              <p className="text-sm text-gray-700">
                The Customer has been removed successfully.
              </p>
            </div>
            <div className="flex justify-center gap-2 pb-3 py-4 px-6 shadow-[0_2px_2px_0_#00000026]">
              <Button
                text="OK"
                onClick={() => {
                  setDeleteModal(false);
                  setDeleteUser(null);
                  if (onDelete) {
                    onDelete(null);
                  }
                }}
                className="px-5 py-1 rounded-md bg-[#056BB7] text-white hover:bg-blue-700 border-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* Product Detail Modal */}
      {showPurchaseOrderDetailModal && (
        <>
          <div
            className="fixed inset-0 flex items-center justify-center bg-black/20 z-50"
            onClick={() => setShowPurchaseOrderDetailModal(null)}
          >
            <div
              className="animate-scaleIn bg-white rounded-xl shadow-md p-4 w-[360px]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mx-auto">
                {/* Head Office Badge */}
                <div className="flex mb-2 w-full">
                  <div className="relative w-full">
                    <span className="bg-blue-600 absolute top-2 left-0 text-white text-xs font-semibold px-2 py-1 rounded">
                      HEADOFFICE
                    </span>
                    <img
                      src={chainforModalImage}
                      alt="Gold Chain"
                      className="w-full h-[220px]"
                    />
                  </div>
                </div>

                {/* SKU and Barcode */}
                <div className="flex flex-wrap justify-between items-center pb-2 text-[12px]">
                  <span className="underline">
                    <strong>SKU:</strong> RC9748
                  </span>
                  <span className="underline">
                    <strong>BARCODE:</strong> RC9748
                  </span>
                </div>

                {/* Details Section */}
                <div className="flex justify-between">
                  <div className="w-3/5">
                    <h3 className="font-bold text-gray-900 mb-2 text-sm">
                      DETAIL:
                    </h3>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <p className="text-gray-600">Category:</p>
                        <p className="font-medium">
                          {productDetails?.category}
                        </p>
                      </div>
                      <div className="flex justify-between">
                        <p className="text-gray-600">Sub Category:</p>
                        <p className="font-medium">
                          {productDetails?.subCategory}
                        </p>
                      </div>
                      <div className="flex justify-between">
                        <p className="text-gray-600">Style:</p>
                        <p className="font-medium">{productDetails?.style}</p>
                      </div>
                      <div className="flex justify-between">
                        <p className="text-gray-600">Gold Category:</p>
                        <p className="font-medium">
                          {productDetails?.goldCategory}
                        </p>
                      </div>
                      <div className="flex justify-between">
                        <p className="text-gray-600">Diamond Weight:</p>
                        <p className="font-medium">
                          {productDetails?.diamondWeight}
                        </p>
                      </div>
                      <div className="flex justify-between">
                        <p className="text-gray-600">Gold Weight:</p>
                        <p className="font-medium">
                          {productDetails?.goldWeight}
                        </p>
                      </div>
                      <div className="flex justify-between">
                        <p className="text-gray-600">Length:</p>
                        <p className="font-medium">{productDetails?.length}</p>
                      </div>
                      <div className="flex justify-between">
                        <p className="text-gray-600">MM:</p>
                        <p className="font-medium">{productDetails?.mm}</p>
                      </div>
                      <div className="flex justify-between">
                        <p className="text-gray-600">Size:</p>
                        <p className="font-medium">{productDetails?.size}</p>
                      </div>
                    </div>
                  </div>

                  {/* Cost Price */}
                  <div className="w-2/5 pl-4 mt-8 text-right">
                    <h3 className="font-bold text-sm text-gray-900 mb-2">
                      COST PRICE:
                    </h3>
                    <p className="text-red-600 text-lg font-bold">
                      ${productDetails?.costPrice}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default ViewAllCustomerTable;
