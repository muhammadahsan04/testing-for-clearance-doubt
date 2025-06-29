import React, { useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { RiEditLine } from "react-icons/ri";
import { GoChevronLeft, GoChevronRight } from "react-icons/go";
import { LuEye } from "react-icons/lu";

import Input from "./Input";
import Dropdown from "./Dropdown";
import Button from "./Button";
import { Navigate, useNavigate } from "react-router-dom";
import { IoIosPrint } from "react-icons/io";
import HorizontalLinearAlternativeLabelStepper from "./HorizontalLinearAlternativeLabelStepper";
import { FaDownload } from "react-icons/fa";

type ColumnType =
  | "text"
  | "image"
  | "status"
  | "actions"
  | "button"
  | "custom"
  | "input";

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

interface CreatePurchaseReturnTableProps {
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
  onItemUpdate?: (index: number, field: string, value: any) => void;
  onDeleteItem?: (index: number) => void;
}

const CreatePurchaseReturnTable: React.FC<CreatePurchaseReturnTableProps> = ({
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
  onItemUpdate,
  onDeleteItem,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [showPurchaseOrderDetailModal, setShowPurchaseOrderDetailModal] =
    useState<any>(null);
  const [deleteUser, setDeleteUser] = useState<any>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [search, setSearch] = useState("");

  const handleChangePage = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const handleInputChange = (index: number, field: string, value: any) => {
    if (onItemUpdate) {
      // For numeric fields, only convert to number if value is not empty
      const processedValue =
        field === "qty" ? (value === "" ? "" : parseFloat(value) || "") : value;
      onItemUpdate(index, field, processedValue);
    }
  };

  const handleDeleteRow = (index: number) => {
    if (onDeleteItem) {
      onDeleteItem(index);
    }
    setShowDeleteModal(false);
    setDeleteUser(null);
  };

  return (
    <>
      <div className="bg-white rounded-xl border border-gray-300 overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-700">
          <thead className="bg-[#F9FAFB] text-black">
            <tr className="font-semibold text-[16px] whitespace-nowrap w-full">
              {columns.map((col, index) => {
                const isFirst = index === 0;
                const isLast = index === columns.length - 1;

                return (
                  <th
                    key={col.accessor}
                    className="px-3 py-3"
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
                      {col.header}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="border-gray-400">
            {currentData.map((row, idx) => (
              <tr
                key={idx}
                className="hover:bg-gray-50 whitespace-nowrap"
                onClick={() => {
                  if (onRowClick) {
                    onRowClick(row);
                  } else if (enableRowModal) {
                    // setSelectedUser(row);
                  }
                }}
              >
                {columns.map((col, index) => {
                  const isFirst = index === 0;
                  const isLast = index === columns.length - 1;

                  return (
                    <td
                      key={col.accessor}
                      className="px-3 py-2"
                      style={{ width: "max-content" }}
                    >
                      <div
                        className={`flex flex-row items-center ${
                          isFirst
                            ? "justify-start"
                            : isLast
                            ? "justify-center"
                            : tableDataAlignment === "zone"
                            ? "justify-center"
                            : "justify-start"
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
                                        alt="Product"
                                        className="w-8 h-8 rounded-full object-cover"
                                      />
                                      {row.productName}
                                    </>
                                  ) : (
                                    <>{row.productName}</>
                                  )}
                                </div>
                              );
                            case "status":
                              return (
                                <span
                                  className={`inline-block px-2 py-1 text-xs rounded-full font-semibold ${
                                    row.status === "Pending"
                                      ? "text-orange-600 bg-orange-100"
                                      : row.status === "Completed"
                                      ? "text-green-700 bg-green-100"
                                      : row.status === "Paid"
                                      ? "text-green-700 bg-green-100"
                                      : row.status === "Partially Paid"
                                      ? "text-orange-400 bg-orange-100"
                                      : "text-black bg-gray-100"
                                  }`}
                                >
                                  {row.status}
                                </span>
                              );
                            case "input":
                              return (
                                <input
                                  type="number"
                                  value={
                                    row[col.accessor] === 0
                                      ? ""
                                      : row[col.accessor]
                                  }
                                  onChange={(e) =>
                                    handleInputChange(
                                      idx,
                                      col.accessor,
                                      e.target.value
                                    )
                                  }
                                  className="w-20 px-2 py-1 border border-gray-300 rounded text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  min="0"
                                  max={row.maxQuantity || undefined}
                                  step="1"
                                  placeholder="0"
                                  onWheel={(e: any) => e.target.blur()}
                                />
                              );
                            case "actions":
                              return (
                                <div className="flex justify-end gap-2">
                                  {eye && (
                                    <LuEye
                                      className="cursor-pointer text-blue-600 hover:text-blue-800"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setShowPurchaseOrderDetailModal(row);
                                      }}
                                    />
                                  )}
                                  <AiOutlineDelete
                                    className="cursor-pointer text-red-600 hover:text-red-800"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      setShowDeleteModal(true);
                                      setDeleteUser({ ...row, index: idx });
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
                  No items added yet. Use the "Add Item" button to add products
                  for return.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Purchase Order Detail Modal */}
      {showPurchaseOrderDetailModal && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black/20 z-50"
          onClick={() => setShowPurchaseOrderDetailModal(null)}
        >
          <div
            className="animate-scaleIn bg-white rounded-xl shadow-md p-6 md:p-10 w-4xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl md:text-2xl font-semibold text-[#0873CD] Source-Sans-Pro-font">
                Purchase Return Item Detail
              </h2>

              <Button
                className="select-none bg-gray-700 hover:bg-gray-600"
                variant="border"
                fontFamily="Inter-font"
                text="Print Info"
                icon={<IoIosPrint color="white" />}
                onClick={() => window.print()}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:gap-28 lg:gap-16 text-[14px] gap-8 md:gap-20 Poppins-font xl:text-[15px] lg:text-[14px]">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <p className="font-medium">Product Name:</p>
                  <p className="text-[#5D6679] text-right">
                    {showPurchaseOrderDetailModal?.productName}
                  </p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="font-medium">Barcode:</p>
                  <p className="text-[#5D6679]">
                    {showPurchaseOrderDetailModal?.barcode}
                  </p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="font-medium">Purchase Invoice:</p>
                  <p className="text-[#5D6679]">
                    {showPurchaseOrderDetailModal?.pInvoice}
                  </p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="font-medium">Supplier:</p>
                  <p className="text-[#5D6679]">
                    {showPurchaseOrderDetailModal?.supplierName || "N/A"}
                  </p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="font-medium">Sub Category:</p>
                  <p className="text-[#5D6679]">
                    {showPurchaseOrderDetailModal?.subCategory || "N/A"}
                  </p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="font-medium">Unit Type:</p>
                  <p className="text-[#5D6679]">
                    {showPurchaseOrderDetailModal?.unitType || "N/A"}
                  </p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="font-medium">Size:</p>
                  <p className="text-[#5D6679]">
                    {showPurchaseOrderDetailModal?.size || "N/A"}
                  </p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="font-medium">Length:</p>
                  <p className="text-[#5D6679]">
                    {showPurchaseOrderDetailModal?.length || "N/A"}
                  </p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="font-medium">MM:</p>
                  <p className="text-[#5D6679]">
                    {showPurchaseOrderDetailModal?.mm || "N/A"}
                  </p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <p className="font-medium">Total Quantity:</p>
                  <p className="text-[#5D6679]">
                    {showPurchaseOrderDetailModal?.totalqty || "N/A"}
                  </p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="font-medium">Return Quantity:</p>
                  <p className="text-[#5D6679]">
                    {showPurchaseOrderDetailModal?.qty}
                  </p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="font-medium">Max Available Quantity:</p>
                  <p className="text-[#5D6679]">
                    {showPurchaseOrderDetailModal?.maxQuantity || "N/A"}
                  </p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="font-medium">Cost Price:</p>
                  <p className="text-right">
                    ${showPurchaseOrderDetailModal?.costPrice}
                  </p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="font-medium">Sell Price:</p>
                  <p className="text-right">
                    ${showPurchaseOrderDetailModal?.sellPrice || "N/A"}
                  </p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="font-medium">Gold Weight:</p>
                  <p className="text-[#5D6679]">
                    {showPurchaseOrderDetailModal?.goldWeight || "N/A"}
                  </p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="font-medium">Diamond Weight:</p>
                  <p className="text-[#5D6679]">
                    {showPurchaseOrderDetailModal?.diamondWeight || "N/A"}
                  </p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="font-medium">Search Tags:</p>
                  <p className="text-[#5D6679] text-right">
                    {showPurchaseOrderDetailModal?.searchTag || "N/A"}
                  </p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="font-medium">Status:</p>
                  <p
                    className={`${
                      showPurchaseOrderDetailModal?.status === "Pending"
                        ? "text-orange-600"
                        : "text-green-600"
                    }`}
                  >
                    {showPurchaseOrderDetailModal?.status}
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-end items-center">
              <button
                className="bg-gray-100 hover:bg-gray-200 text-sm px-4 py-2 rounded-md"
                onClick={() => setShowPurchaseOrderDetailModal(null)}
              >
                Close
              </button>
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
              <h2 className="text-xl font-medium">
                Delete {deleteUser?.productName}
              </h2>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="text-xl font-bold text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
            <div className="mt-8 text-start pb-8 px-6 shadow-[0_2px_2px_0_#00000026]">
              <h3 className="text-lg font-semibold mb-1">Delete Item?</h3>
              <p className="text-sm text-gray-700">
                Are you sure you want to delete this item from the purchase
                return?
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
                  handleDeleteRow(deleteUser?.index);
                  setDeleteModal(true);
                }}
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
              <h2 className="text-xl font-medium">Item Deleted</h2>
              <button
                onClick={() => setDeleteModal(false)}
                className="text-xl font-bold text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
            <div className="mt-8 text-start pb-8 px-6 shadow-[0_2px_2px_0_#00000026]">
              <h3 className="text-lg font-semibold mb-1">
                Item Removed Successfully
              </h3>
              <p className="text-sm text-gray-700">
                The item has been removed from the purchase return.
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

export default CreatePurchaseReturnTable;
