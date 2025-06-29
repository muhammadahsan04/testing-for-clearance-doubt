import React, { useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { RiEditLine } from "react-icons/ri";
import { GoChevronLeft, GoChevronRight } from "react-icons/go";
import { LuEye } from "react-icons/lu";

import chainforModalImage from "../assets/chainforModalImage.png";
import Input from "./Input";
import Dropdown from "./Dropdown";
import Button from "./Button";
import { Navigate, useNavigate } from "react-router-dom";
import { IoIosPrint } from "react-icons/io";
import HorizontalLinearAlternativeLabelStepper from "./HorizontalLinearAlternativeLabelStepper";
import { FaDownload } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";

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

interface InventoryTableProps {
  columns: Column[];
  data: any[];
  tableTitle?: string;
  rowsPerPageOptions?: number[];
  defaultRowsPerPage?: number;
  searchable?: boolean;
  filterByStatus?: boolean;
  onEdit?: (row: any) => void;
  onDelete?: (row: any) => void;
  onDeleteConfirm?: (id: string) => void; // Add this new prop
  tableDataAlignment?: "zone" | "user" | "center";
  className?: string;
  onRowClick?: (row: any) => void;
  dealBy?: boolean;
  enableRowModal?: boolean;
  eye?: boolean;
  loading?: boolean; // Add loading prop
  canDelete?: boolean; // Add loading prop
}

// Add these helper functions at the top
const getAuthToken = () => {
  let token = localStorage.getItem("token");
  if (!token) {
    token = sessionStorage.getItem("token");
  }
  return token;
};

const InventoryTable: React.FC<InventoryTableProps> = ({
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
  onDeleteConfirm,
  tableDataAlignment = "start",
  dealBy,
  loading = false,
  canDelete = false,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedUser, setSelectedUser] = useState<any>(null); // for modal
  const [deleteUser, setDeleteUser] = useState<any>(null); // for modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [search, setSearch] = useState(""); // ✅ Local search state
  const [statusFilter, setStatusFilter] = useState("All"); // ✅ Status filter state
  // To these two state variables edit user
  const [isEditing, setIsEditing] = useState(false);
  const [editingRow, setEditingRow] = useState<any>(null);
  const [formData, setFormData] = useState<any>(null);
  const [showPurchaseOrderDetailModal, setShowPurchaseOrderDetailModal] =
    useState<any>(null); // for modal
  const [inventoryDetails, setInventoryDetails] = useState<any>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

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
  // console.log("DATA", isEditing);

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
        {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center justify-between"> */}
        <div
          className={`grid gap-4 items-center justify-between md:grid-cols-2 ${data.some((item) => item.hasOwnProperty("status"))
            ? ""
            : "grid-cols-2"
            }`}
        >
          <div className="flex gap-3">
            {searchable && (
              <Input
                placeholder="Search Barcode, Category"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-auto !rounded-3xl outline-none "
              />
            )}

            {/* {filterByStatus &&
              data.some((item) => item.hasOwnProperty("status")) && ( */}
            <Dropdown
              options={["All", "Active", "Inactive"]}
              DropDownName="Status"
              defaultValue="All"
              onSelect={(val) => {
                setStatusFilter(val);
                setCurrentPage(1);
              }}
            />
            {/* )} */}
          </div>
          <div
            className={`flex md:justify-end ${data.some((item) => item.hasOwnProperty("status"))
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
              {/* <tr className="font-semibold text-[16px] whitespace-nowrap border-2">
                {columns.map((col) => (
                  <th key={col.accessor} className="px-6 py-3">
                    {col.header}
                  </th>
                ))}
              </tr> */}

              <tr className="font-semibold text-[16px] whitespace-nowrap w-full">
                {columns.map((col, index) => {
                  const isFirst = index === 0;
                  const isLast = index === columns.length - 1;

                  return (
                    <th
                      key={col.accessor}
                      className="px-4 py-3"
                      style={{ width: "max-content" }}
                    >
                      <div
                        className={`flex flex-row items-center ${isFirst
                          ? "justify-center"
                          : isLast
                            ? "justify-end"
                            : tableDataAlignment === "zone"
                              ? "justify-center"
                              : "justify-start"
                          // : "justify-center" for zone
                          // "justify-start"
                          }`}
                      >
                        {col.header}
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className="border-b border-gray-400">
              {currentData.map((row, idx) => (
                <tr
                  key={idx}
                  className="hover:bg-gray-50 whitespace-nowrap cursor-pointer"
                  onClick={() => {
                    //NEW
                    if (onRowClick) {
                      onRowClick(row);
                    } else if (enableRowModal) {
                      //   setSelectedUser(row);
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
                          className={`flex flex-row items-center ${isFirst
                            ? "justify-center"
                            : isLast
                              ? "justify-end"
                              : tableDataAlignment === "zone"
                                ? "justify-center"
                                : "justify-start"
                            // : "justify-center" for zone
                            // "justify-start"
                            }`}
                        >
                          {(() => {
                            switch (col.type) {
                              case "image":
                                return (
                                  <div className="flex gap-2 items-center">
                                    {row.userImage ? (
                                      <>
                                        <img
                                          src={row.userImage}
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
                                    className={`inline-block px-2 py-1 text-xs rounded-full ${row.status === "Active"
                                      ? "bg-green-100 text-green-600"
                                      : "bg-red-100 text-red-600"
                                      }`}
                                  >
                                    {row.status}
                                  </span>
                                );
                              case "actions":
                                return (
                                  <div className="flex justify-end gap-2">
                                    {eye && (
                                      <LuEye
                                        className="cursor-pointer"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          console.log("row", row);
                                          // Fetch detailed inventory data
                                          fetchInventoryDetails(row.id);
                                          setShowPurchaseOrderDetailModal(row);
                                        }}
                                      />
                                    )}
                                    <AiOutlineDelete
                                      className="cursor-pointer hover:text-red-500"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        if (!canDelete) {
                                          toast.error(
                                            "You don't have permission to delete Inventory"
                                          );
                                          return;
                                        }

                                        setShowDeleteModal(true);
                                        setDeleteUser(row);
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
            className={`flex flex-col ${dealBy ? "md:flex-col gap-3" : "md:flex-row"
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
                className={`w-8 h-8 rounded-full text-sm flex items-center justify-center transition ${currentPage === 1
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
                    className={`w-8 h-8 rounded-full text-sm flex items-center justify-center transition ${currentPage === num
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
                  className={`w-8 h-8 rounded-full text-sm flex items-center justify-center transition ${currentPage === totalPages
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

      {showPurchaseOrderDetailModal && (
        <>
          <div
            className="fixed inset-0 flex items-center justify-center bg-black/20 z-50"
            onClick={() => {
              setShowPurchaseOrderDetailModal(null);
              setInventoryDetails(null);
            }}
          >
            <div
              className="animate-scaleIn bg-white rounded-xl shadow-md p-4 w-[360px]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mx-auto">
                {loadingDetails ? (
                  <div className="flex justify-center items-center h-40">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                  </div>
                ) : inventoryDetails ? (
                  <>
                    {/* Image */}
                    <div className="flex mb-2 w-full">
                      <div className="relative w-full">
                        <span className="bg-blue-600 absolute top-2 left-0 text-white text-xs font-semibold px-2 py-1 rounded">
                          {inventoryDetails.headOffice > 0 &&
                            inventoryDetails.store > 0
                            ? "BOTH"
                            : inventoryDetails.headOffice > 0
                              ? "HEADOFFICE"
                              : "STORE"}
                        </span>
                        <img
                          src={
                            inventoryDetails.itemId?.itemImage
                              ? `${import.meta.env.VITE_BASE_URL ||
                              "http://localhost:9000"
                              }${inventoryDetails.itemId.itemImage}`
                              : chainforModalImage
                          }
                          alt="Inventory Item"
                          className="w-full h-[220px] object-cover"
                        />
                      </div>
                    </div>

                    {/* SKU and Barcode */}
                    <div className="flex flex-wrap justify-between items-center pb-2 text-[12px]">
                      <span className="underline">
                        <strong>SKU:</strong>{" "}
                        {inventoryDetails.itemId?.prefixId?.prefixName}-
                        {inventoryDetails.itemId?.autoGenerated}
                      </span>
                      <span className="underline">
                        <strong>BARCODE:</strong>{" "}
                        {inventoryDetails.itemId?.barcode}
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
                              {inventoryDetails.itemId?.category?.name}
                            </p>
                          </div>
                          <div className="flex justify-between">
                            <p className="text-gray-600">Sub Category:</p>
                            <p className="font-medium">
                              {inventoryDetails.itemId?.subCategory?.name}
                            </p>
                          </div>
                          <div className="flex justify-between">
                            <p className="text-gray-600">Product For:</p>
                            <p className="font-medium">
                              {inventoryDetails.itemId?.productFor?.join(", ")}
                            </p>
                          </div>
                          <div className="flex justify-between">
                            <p className="text-gray-600">Diamond Weight:</p>
                            <p className="font-medium">
                              {inventoryDetails.itemId?.diamondWeight}
                            </p>
                          </div>
                          <div className="flex justify-between">
                            <p className="text-gray-600">Gold Weight:</p>
                            <p className="font-medium">
                              {inventoryDetails.itemId?.goldWeight}
                            </p>
                          </div>
                          <div className="flex justify-between">
                            <p className="text-gray-600">Length:</p>
                            <p className="font-medium">
                              {inventoryDetails.itemId?.length}
                            </p>
                          </div>
                          <div className="flex justify-between">
                            <p className="text-gray-600">MM:</p>
                            <p className="font-medium">
                              {inventoryDetails.itemId?.mm}
                            </p>
                          </div>
                          <div className="flex justify-between">
                            <p className="text-gray-600">Size:</p>
                            <p className="font-medium">
                              {inventoryDetails.itemId?.size}
                            </p>
                          </div>
                          <div className="flex justify-between">
                            <p className="text-gray-600">Stock:</p>
                            <p className="font-medium">
                              {inventoryDetails.stock}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Stock Information */}
                      <div className="w-2/5 pl-4 mt-8 text-right">
                        <h3 className="font-bold text-sm text-gray-900 mb-2">
                          STOCK INFO:
                        </h3>
                        <div className="space-y-1 text-sm">
                          <p className="text-blue-600 font-bold">
                            Total: {inventoryDetails.stock}
                          </p>
                          <p className="text-green-600 font-medium">
                            Head Office: {inventoryDetails.headOffice}
                          </p>
                          <p className="text-purple-600 font-medium">
                            Store: {inventoryDetails.store}
                          </p>
                          {inventoryDetails.headOfficeAging && (
                            <p className="text-gray-600 text-xs">
                              HO Aging: {inventoryDetails.headOfficeAging}
                            </p>
                          )}
                          {inventoryDetails.storeAging && (
                            <p className="text-gray-600 text-xs">
                              Store Aging: {inventoryDetails.storeAging}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex justify-center items-center h-40">
                    <div className="text-gray-500">No details available</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}

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
              <h2 className="text-xl font-medium">
                Delete {deleteUser?.category || "Inventory"}
              </h2>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="text-xl font-bold text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
            <div className="mt-8 text-start pb-8 px-6 shadow-[0_2px_2px_0_#00000026]">
              <h3 className="text-lg font-semibold mb-1">
                Delete Inventory Item
              </h3>
              <p className="text-sm text-gray-700">
                Are you sure you want to delete this inventory item?
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
                onClick={() => {
                  if (onDeleteConfirm && deleteUser?.id) {
                    onDeleteConfirm(deleteUser.id);
                  }
                  setShowDeleteModal(false);
                  setDeleteModal(true);
                }}
                className="!border-none px-5 py-1 bg-[#DC2626] hover:bg-red-700 text-white rounded-md flex items-center gap-1"
              />
            </div>
          </div>
        </div>
      )}

      {isEditing && (
        <div
          // className="fixed inset-0 flex items-center justify-center bg-transparent backdrop-blur-xs bg-opacity-40 z-50"
          className="fixed inset-0 flex items-center justify-center bg-black/20 z-50"
          onClick={() => setIsEditing(false)}
        >
          <div
            className="animate-scaleIn bg-white w-[370px] h-auto rounded-[7px] p-6 shadow-lg relative"
            onClick={(e) => e.stopPropagation()}
          >
            <form
              onSubmit={(e) => {
                e.preventDefault();
                // Now this will log the updated data
                console.log("Form Submitted", formData);
                setIsEditing(false);
              }}
              className="flex flex-col gap-4"
            >
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Edit User
              </h2>

              {/* Name Input - now controlled */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData?.name || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Enter name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Role Input - now controlled */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Role
                </label>
                <input
                  type="text"
                  name="role"
                  value={formData?.role || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value })
                  }
                  placeholder="Enter role"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Status Dropdown - now controlled */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Status
                </label>
                <select
                  name="status"
                  value={formData?.status || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select status</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <button
                type="submit"
                className="mt-4 w-full bg-blue-600 text-white font-semibold py-2 rounded-md hover:bg-blue-700 transition"
              >
                Save Changes
              </button>
            </form>
          </div>
        </div>
      )}

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
              <h2 className="text-xl font-medium">
                Delete {deleteUser?.category || "Inventory"}
              </h2>
              <button
                onClick={() => setDeleteModal(false)}
                className="text-xl font-bold text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
            <div className="mt-8 text-start pb-8 px-6 shadow-[0_2px_2px_0_#00000026]">
              <h3 className="text-lg font-semibold mb-1">Inventory Deleted</h3>
              <p className="text-sm text-gray-700">
                The inventory item has been successfully removed.
              </p>
            </div>
            <div className="flex justify-center gap-2 pb-3 py-4 px-6 shadow-[0_2px_2px_0_#00000026]">
              <Button
                text="OK"
                onClick={() => setDeleteModal(false)}
                className="px-5 py-1 rounded-md hover:bg-gray-100 border-none shadow-[inset_0_0_4px_#00000026]"
              />
            </div>
          </div>
        </div>
      )}

      {/* Add loading state to the table */}
      {loading && (
        <div className="flex justify-center items-center py-8">
          <div className="text-gray-500">Loading inventory data...</div>
        </div>
      )}
    </>
  );
};

export default InventoryTable;
