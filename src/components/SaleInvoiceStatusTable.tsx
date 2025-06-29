import type React from "react";
import { useState, useEffect, useMemo } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { RiEditLine } from "react-icons/ri";
import { GoChevronLeft, GoChevronRight } from "react-icons/go";
import { LuEye } from "react-icons/lu";
import { toast } from "react-toastify";
import Input from "./Input";
import Dropdown from "./Dropdown";
import Button from "./Button";
import { DatePicker } from "antd";
import dayjs, { type Dayjs } from "dayjs";
import SaleInvoiceDetailModal from "../pages/dashboard/Inventory/SaleInvoiceDetailModal";

type ColumnType = "text" | "image" | "status" | "actions" | "button" | "custom";

interface Column {
  header: string;
  accessor: string;
  type?: ColumnType;
}

interface SummaryData {
  debit: number;
  credit: number;
  balance: number;
}

interface Zone {
  _id: string;
  name: string;
}

interface Store {
  _id: string;
  storeName: string;
}

interface SaleInvoiceStatusTableProps {
  columns: Column[];
  data: any[];
  tableTitle?: string;
  summaryData?: SummaryData;
  eye?: boolean;
  tableDataAlignment?: "zone" | "user" | "center";
  onEdit?: (row: any) => void;
  onDelete?: (row: any) => void;
  onRefresh?: () => void;
  selectedUser?: any;
  onCloseEdit?: () => void;
  canUpdate?: boolean;
  canDelete?: boolean
}

const SaleInvoiceStatusTable: React.FC<SaleInvoiceStatusTableProps> = ({
  columns,
  data,
  tableTitle,
  summaryData,
  eye,
  tableDataAlignment = "start",
  onEdit,
  onDelete,
  onRefresh,
  selectedUser,
  onCloseEdit,
  canUpdate = true,
  canDelete = true,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [deleteUser, setDeleteUser] = useState<any>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateRange, setDateRange] = useState<
    [Dayjs | null, Dayjs | null] | null
  >(null);

  const fetchZones = async () => {
    try {
      const token = getAuthToken();
      if (!token) return;

      const response = await fetch(
        `${API_URL}/api/abid-jewelry-ms/getAllZones`,
        {
          headers: {
            "x-access-token": token,
            "Content-Type": "application/json",
          },
        }
      );

      const result = await response.json();
      if (result.success) {
        setZones(result.data);
      }
    } catch (error) {
      console.error("Error fetching zones:", error);
    }
  };

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const currentData = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handleChangePage = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const handleDeleteConfirm = async () => {
    if (deleteUser && onDelete) {
      try {
        setLoading(true);
        await onDelete(deleteUser);
        setShowDeleteModal(false);
        setDeleteUser(null);
        if (onRefresh) {
          onRefresh();
        }
      } catch (error) {
        console.error("Error deleting invoice:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleEditSubmit = async () => {
    try {
      setLoading(true);
      const token = getAuthToken();
      if (!token) {
        toast.error("Authentication token not found. Please login again.");
        return;
      }


      const response = await fetch(
        `${API_URL}/api/abid-jewelry-ms/updateSaleInvoice/${selectedUser._id}`,
        {
          method: "PUT",
          headers: {
            "x-access-token": token,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );


    } catch (error) {
      console.error("Error updating invoice:", error);
      toast.error("Failed to update sale invoice");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setEditFormData((prev: any) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleItemUpdate = (index: number, field: string, value: any) => {
    const updatedItems = [...editingItems];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    setEditingItems(updatedItems);
  };

  // Add this function inside the SaleInvoiceStatusTable component
  const handleDeleteEditingItem = async (itemId: string) => {
    try {
      const token = getAuthToken();
      if (!token) {
        toast.error("Authentication token not found. Please login again.");
        return;
      }

      const response = await fetch(
        `${API_URL}/api/abid-jewelry-ms/deleteSaleInvoiceItem/${selectedUser._id}/${itemId}`,
        {
          method: "DELETE",
          headers: {
            "x-access-token": token,
            "Content-Type": "application/json",
          },
        }
      );

      const result = await response.json();
      if (result.success) {
        toast.success("Invoice item deleted successfully");
        // Remove the item from editingItems array
        const updatedItems = editingItems.filter((item) => item._id !== itemId);
        setEditingItems(updatedItems);
      } else {
        toast.error(result.message || "Failed to delete invoice item");
      }
    } catch (error) {
      console.error("Error deleting invoice item:", error);
      toast.error("Failed to delete invoice item");
    }
  };

  return (
    <>
      <div className="bg-white rounded-xl p-4 flex flex-col gap-4 overflow-hidden shadow-md">
        {/* <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-[#056BB7]">Sale Invoice</h2>
        </div> */}

        {/* Filters */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 items-center justify-between">
          <Input
            placeholder="Search by Name, Invoice"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full !rounded-3xl"
          />

          <RangePicker
            className="h-10 !text-gray-400 !border-gray-300"
            value={dateRange}
            onChange={(dates) => setDateRange(dates)}
          />

          <Dropdown
            className="w-full md:auto"
            options={["all", "pending", "received"]}
            DropDownName="Status"
            defaultValue="all"
            onSelect={(val) => {
              setStatusFilter(val);
              setCurrentPage(1);
            }}
          />

          <div className="flex justify-start xl:justify-end md:col-span-4 lg:col-span-1 w-full">
            <Button
              onClick={() => {
                setSearchTerm("");
                setStatusFilter("all");
                setDateRange(null);
              }}
              text="Reset Filters"
              className="bg-[#056BB7] text-white border-none font-medium w-auto"
            />
          </div>
        </div>

        <p className="text-[#056BB7] font-semibold text-[24px]">
          {tableTitle}
        </p>

        <div className="bg-white rounded-xl border border-gray-300 overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-700">
            <thead className="bg-[#F9FAFB] text-black">
              <tr className="font-semibold text-[16px] whitespace-nowrap w-full">
                {columns.map((col, index) => (
                  <th
                    key={col.accessor}
                    className="px-8 py-3"
                    style={{ width: "max-content" }}
                  >
                    <div className="flex flex-row items-center justify-center">
                      {col.header}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="border-b border-gray-400">
              {currentData.map((row, idx) => (
                <tr
                  key={row._id || idx}
                  className="hover:bg-gray-50 whitespace-nowrap cursor-pointer"
                >
                  {columns.map((col, index) => {
                    const isFirst = index === 0;
                    const isLast = index === columns.length - 1;
                    return (
                      <td
                        key={col.accessor}
                        className="px-8 py-2"
                        style={{ width: "max-content" }}
                      >
                        <div
                          className={`flex flex-row items-center ${isFirst
                            ? "justify-center"
                            : isLast
                              ? "justify-center"
                              : "justify-center"
                            }`}
                        >
                          {col.accessor === "actions" ? (
                            <div className="flex gap-2">
                              {eye && (
                                <LuEye
                                  size={20}
                                  className="cursor-pointer text-blue-600 hover:text-blue-800"
                                  onClick={() => handleViewDetails(row)}
                                  title="View Details"
                                />
                              )}
                              {onEdit && (
                                <RiEditLine
                                  size={20}
                                  className="cursor-pointer text-green-600 hover:text-green-800"
                                  onClick={() => {
                                    if (!canUpdate) {
                                      toast.error("You don't have permission to edit sale invoice status");
                                      return
                                    };
                                    onEdit(row)
                                  }}
                                  title="Edit"
                                />
                              )}
                              {onDelete && (
                                <AiOutlineDelete
                                  size={20}
                                  className="cursor-pointer text-red-600 hover:text-red-800"
                                  onClick={() => {
                                    if (!canDelete) {
                                      toast.error("You don't have permission to delete  sale invoice status");
                                      return
                                    };

                                    setDeleteUser(row);
                                    setShowDeleteModal(true);
                                  }}
                                  title="Delete"
                                />
                              )}
                            </div>
                          ) : col.accessor === "debit" ||
                            col.accessor === "credit" ? (
                            `${row[col.accessor]?.toLocaleString() || "0"}`
                          ) : col.accessor === "status" ? (
                            <span className="inline-block px-2 py-1 text-xs rounded-full font-semibold text-gray-500">
                              {row[col.accessor] || "N/A"}
                            </span>
                          ) : (
                            row[col.accessor] || "N/A"
                          )}
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
                    {loading ? "Loading..." : "No data found."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex flex-col md:flex-row items-center justify-between px-4 py-4">
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
                className={`w-8 h-8 rounded-full text-sm flex items-center justify-center transition ${currentPage === 1
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
                    className={`w-8 h-8 rounded-full text-sm flex items-center justify-center transition ${currentPage === num
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

      {/* Edit Modal */}
      {showEditModal && selectedUser && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black/20 z-50"
          onClick={() => {
            setShowEditModal(false);
            if (onCloseEdit) onCloseEdit();
          }}
        >
          <div
            className="animate-scaleIn bg-white w-[90vw] max-w-4xl max-h-[90vh] overflow-y-auto rounded-lg shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center py-4 px-6 shadow-[0_2px_2px_0_#00000026] sticky top-0 bg-white z-20">
              <h2 className="text-xl font-medium">Edit Sale Invoice</h2>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  if (onCloseEdit) onCloseEdit();
                }}
                className="text-xl font-bold text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label className="mb-1">
                    Zone <span className="text-red-500">*</span>
                  </label>
                  <Dropdown
                    options={zones.map((zone) => zone.name)}
                    defaultValue={
                      zones.find((z) => z._id === editFormData.zone)?.name ||
                      "Select Zone"
                    }
                    className="w-full"
                    onSelect={(value) => {
                      const selectedZone = zones.find((z) => z.name === value);
                      handleInputChange("zone", selectedZone?._id || "");
                    }}
                  />
                </div>

                <div className="flex flex-col">
                  <label className="mb-1">
                    Store <span className="text-red-500">*</span>
                  </label>
                  <Dropdown
                    options={stores.map((store) => store.storeName)}
                    defaultValue={
                      stores.find((s) => s._id === editFormData.store)
                        ?.storeName || "Select Store"
                    }
                    className="w-full"
                    onSelect={(value) => {
                      const selectedStore = stores.find(
                        (s) => s.storeName === value
                      );
                      handleInputChange("store", selectedStore?._id || "");
                    }}
                  />
                </div>

                <div className="flex flex-col">
                  <label className="mb-1">
                    Store Manager Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    value={editFormData.storeManagerName}
                    onChange={(e) =>
                      handleInputChange("storeManagerName", e.target.value)
                    }
                  />
                </div>

                <div className="flex flex-col">
                  <label className="mb-1">
                    Due Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    value={editFormData.dueDate}
                    onChange={(e) =>
                      handleInputChange("dueDate", e.target.value)
                    }
                  />
                </div>
              </div>

              <div className="flex flex-col">
                <label className="mb-1">Description</label>
                <textarea
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md resize-none"
                  value={editFormData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                />
              </div>

              {/* Items Table */}
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-3">Invoice Items</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border border-gray-300">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left">Item</th>
                        <th className="px-4 py-2 text-left">Stock</th>
                        <th className="px-4 py-2 text-left">Quantity</th>
                        <th className="px-4 py-2 text-left">Cost Price</th>
                        <th className="px-4 py-2 text-left">Sell Price</th>
                        <th className="px-4 py-2 text-left">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {editingItems.map((item, index) => (
                        <tr key={index} className="border-t">
                          <td className="px-4 py-2">
                            {item.item?.category?.name || "Unknown Item"}
                          </td>
                          <td className="px-4 py-2">
                            {item.item?.category?.name || "Unknown Item"}
                          </td>
                          <td className="px-4 py-2">
                            <input
                              type="number"
                              className="w-20 px-2 py-1 border border-gray-300 rounded"
                              value={item.quantity}
                              onChange={(e) =>
                                handleItemUpdate(
                                  index,
                                  "quantity",
                                  Number.parseInt(e.target.value) || 0
                                )
                              }
                            />
                          </td>
                          <td className="px-4 py-2">
                            <input
                              type="number"
                              className="w-24 px-2 py-1 border border-gray-300 rounded"
                              value={item.costPrice}
                              onChange={(e) =>
                                handleItemUpdate(
                                  index,
                                  "costPrice",
                                  Number.parseFloat(e.target.value) || 0
                                )
                              }
                            />
                          </td>
                          <td className="px-4 py-2">
                            <input
                              type="number"
                              className="w-24 px-2 py-1 border border-gray-300 rounded"
                              value={item.sellPrice}
                              onChange={(e) =>
                                handleItemUpdate(
                                  index,
                                  "sellPrice",
                                  Number.parseFloat(e.target.value) || 0
                                )
                              }
                            />
                          </td>
                          <td className="px-4 py-2">
                            <AiOutlineDelete
                              className="cursor-pointer text-red-600 hover:text-red-800"
                              onClick={() => handleDeleteEditingItem(item._id)} // Change this line
                              title="Delete Item"
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="flex justify-center gap-2 pb-3 py-4 px-6 shadow-[0_2px_2px_0_#00000026] sticky bottom-0 bg-white">
              <button
                onClick={() => {
                  setShowEditModal(false);
                  if (onCloseEdit) onCloseEdit();
                }}
                className="px-5 py-2 rounded-md hover:bg-gray-100 border border-gray-300"
                disabled={loading}
              >
                Cancel
              </button>
              <Button
                text={loading ? "Updating..." : "Update"}
                onClick={handleEditSubmit}
                disabled={loading}
                className="px-5 py-2 bg-[#056BB7] text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              />
            </div>
          </div>
        </div>
      )}

      {/* Invoice Detail Modal */}
      {invoiceDetail && (
        <SaleInvoiceDetailModal
          isOpen={true}
          onClose={() => {
            setInvoiceDetail(null);
            setIsOpen(false);
          }}
          columns={SaleInvoiceDetail}
          data={invoiceDetail.transformedItems || []}
          invoiceData={invoiceDetail}
        // onDeleteItem={handleDeleteInvoiceItem}
        />
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
              <h2 className="text-xl font-medium">Delete Sale Invoice</h2>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="text-xl font-bold text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
            <div className="mt-8 text-start pb-8 px-6 shadow-[0_2px_2px_0_#00000026]">
              <h3 className="text-lg font-semibold mb-1">
                Delete Sale Invoice?
              </h3>
              <p className="text-sm text-gray-700">
                Are you sure you want to delete invoice "{deleteUser?.invoice}"?
              </p>
              <p className="text-sm text-red-600 font-medium mt-1">
                This action cannot be undone.
              </p>
            </div>

            <div className="flex justify-center gap-2 pb-3 py-4 px-6 shadow-[0_2px_2px_0_#00000026]">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-5 py-1 rounded-md hover:bg-gray-100 border-none shadow-[inset_0_0_4px_#00000026]"
                disabled={loading}
              >
                Cancel
              </button>
              <Button
                text={loading ? "Deleting..." : "Delete"}
                icon={!loading && <AiOutlineDelete />}
                onClick={handleDeleteConfirm}
                disabled={loading}
                className="!border-none px-5 py-1 bg-[#DC2626] hover:bg-red-700 text-white rounded-md flex items-center gap-1 disabled:opacity-50"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SaleInvoiceStatusTable;
