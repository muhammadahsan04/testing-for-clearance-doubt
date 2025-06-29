import type React from "react";
import { useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { RiEditLine } from "react-icons/ri";
import { GoChevronLeft, GoChevronRight } from "react-icons/go";
import { LuEye } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import { DatePicker } from "antd";

import chainforModalImage from "../assets/chainforModalImage.png";
import Input from "./Input";
import Dropdown from "./Dropdown";
import Button from "./Button";

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

interface ProductAgingTableProps {
  // eye: boolean;
  enableRowModal?: boolean;
  onRowClick?: (row: any) => void;
  className?: string;
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
  dealBy?: boolean;
}

const ProductAgingTable: React.FC<ProductAgingTableProps> = ({
  // eye,
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
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [deleteUser, setDeleteUser] = useState<any>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  

  return (
    <>
      <div
        className={`bg-white rounded-xl p-4 flex flex-col gap-5 overflow-hidden shadow-md ${className}`}
      >
        <div className={`flex justify-between items-start gap-5`}>
          <div className="flex gap-3 flex-wrap">
            {searchable && (
              <Input
                placeholder="Search Barcode, Location"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="!rounded-3xl outline-none !w-[250px]"
              />
            )}
            <RangePicker className="h-10 !text-gray-400 !border-gray-300 !w-[270px]" />
            <Dropdown
              options={["All", "31 - 60 M", "61 - 90 M", "90+ M"]}
              defaultValue="31 - 60 M"
              onSelect={(val) => {
                // Handle aging filter
                setCurrentPage(1);
              }}
            />
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
          <div className="flex md:justify-end justify-end">
            <Button
              text="Export"
              variant="border"
              className="bg-[#5D6679] text-white w-24"
            />
          </div>
        </div>

        <p className="text-[#056BB7] font-semibold text-[24px]">{tableTitle}</p>

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
                disabled={currentPage === 1}
              >
                <GoChevronLeft size={18} />
              </button>

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

              {currentPage > 3 && (
                <div>
                  <span className="text-gray-500 px-0.5">•</span>
                  <span className="text-gray-500 px-0.5">•</span>
                  <span className="text-gray-500 px-0.5">•</span>
                </div>
              )}

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

              {currentPage < totalPages - 2 && totalPages > 1 && (
                <div>
                  <span className="text-gray-500 px-0.5">•</span>
                  <span className="text-gray-500 px-0.5">•</span>
                  <span className="text-gray-500 px-0.5">•</span>
                </div>
              )}

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

      {/* Modals remain the same */}
      {showPurchaseOrderDetailModal && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black/20 z-50"
          onClick={() => setShowPurchaseOrderDetailModal(null)}
        >
          <div
            className="animate-scaleIn bg-white rounded-xl shadow-md p-4 w-[320px]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mx-auto">
              <div className="flex justify-center my-2">
                <div className="relative">
                  <span className="bg-blue-600 absolute top-2 left-0 text-white text-xs font-semibold px-2 py-1 rounded">
                    {showPurchaseOrderDetailModal.location?.toUpperCase() ||
                      "HEADOFFICE"}
                  </span>
                  <img
                    src={
                      showPurchaseOrderDetailModal.userImage ||
                      chainforModalImage
                    }
                    alt="Product"
                    className="w-full object-contain"
                    onError={(e) => {
                      e.currentTarget.src = chainforModalImage;
                    }}
                  />
                </div>
              </div>

              <div className="flex flex-wrap justify-between items-center pb-2 mb-2 px-1 text-[12px]">
                <span>
                  <strong>SKU:</strong>{" "}
                  {showPurchaseOrderDetailModal.sno || "N/A"}
                </span>
                <span>
                  <strong>BARCODE:</strong>{" "}
                  {showPurchaseOrderDetailModal.barcode || "N/A"}
                </span>
              </div>

              <div className="flex justify-between gap-4 text-[12px] px-1 w-full">
                <div className="space-y-1">
                  <h3 className="font-bold text-gray-900">DETAIL:</h3>
                  <div className="flex justify-between gap-4">
                    <p>Category:</p>
                    <p>
                      {showPurchaseOrderDetailModal.productName?.split(
                        " - "
                      )[0] || "N/A"}
                    </p>
                  </div>
                  <div className="flex justify-between gap-4">
                    <p>Sub Category:</p>
                    <p>
                      {showPurchaseOrderDetailModal.productName?.split(
                        " - "
                      )[1] || "N/A"}
                    </p>
                  </div>
                  <div className="flex justify-between gap-4">
                    <p>Stock:</p>
                    <p>{showPurchaseOrderDetailModal.stock || "0"}</p>
                  </div>
                  <div className="flex justify-between gap-4">
                    <p>Location:</p>
                    <p>{showPurchaseOrderDetailModal.location || "N/A"}</p>
                  </div>
                  <div className="flex justify-between gap-4">
                    <p>Date Added:</p>
                    <p>{showPurchaseOrderDetailModal.dateAdded || "N/A"}</p>
                  </div>
                  <div className="flex justify-between gap-4">
                    <p>Head Office Aging:</p>
                    <p>
                      {showPurchaseOrderDetailModal.headOfficeAging || "N/A"}
                    </p>
                  </div>
                  <div className="flex justify-between gap-4">
                    <p>Store Aging:</p>
                    <p>{showPurchaseOrderDetailModal.storeAging || "N/A"}</p>
                  </div>
                </div>

                <div className="text-left">
                  <h3 className="font-bold text-gray-900">COST PRICE:</h3>
                  <p className="text-red-600 text-lg font-bold">$15.50</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
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
                Delete {deleteUser?.productName?.split(" - ")[0] || "Item"}
              </h2>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="text-xl font-bold text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
            <div className="mt-8 text-start pb-8 px-6 shadow-[0_2px_2px_0_#00000026]">
              <h3 className="text-lg font-semibold mb-1">Delete Inventory</h3>
              <p className="text-sm text-gray-700">
                Are you sure you want to delete this Inventory?
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
                  setShowDeleteModal(false);
                  setDeleteModal(true);
                }}
                className="!border-none px-5 py-1 bg-[#DC2626] hover:bg-red-700 text-white rounded-md flex items-center gap-1"
              />
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditing && (
        <div
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
                console.log("Form Submitted", formData);
                setIsEditing(false);
              }}
              className="flex flex-col gap-4"
            >
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Edit Product
              </h2>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Product Name
                </label>
                <input
                  type="text"
                  name="productName"
                  value={formData?.productName || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, productName: e.target.value })
                  }
                  placeholder="Enter product name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Stock
                </label>
                <input
                  type="number"
                  name="stock"
                  value={formData?.stock || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, stock: e.target.value })
                  }
                  placeholder="Enter stock"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Location
                </label>
                <select
                  name="location"
                  value={formData?.location || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select location</option>
                  <option value="Head Office">Head Office</option>
                  <option value="Store">Store</option>
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

      {/* Success Delete Modal */}
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
                Delete {deleteUser?.productName?.split(" - ")[0] || "Item"}
              </h2>
              <button
                onClick={() => setDeleteModal(false)}
                className="text-xl font-bold text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
            <div className="mt-8 text-start pb-8 px-6 shadow-[0_2px_2px_0_#00000026]">
              <h3 className="text-lg font-semibold mb-1">Delete Inventory</h3>
              <p className="text-sm text-gray-700">
                The Inventory has been removed
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
    </>
  );
};

export default ProductAgingTable;
