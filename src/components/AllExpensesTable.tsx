import React, { useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { RiEditLine, RiFileList2Line } from "react-icons/ri";
import { GoChevronLeft, GoChevronRight } from "react-icons/go";
import { LuEye } from "react-icons/lu";
import Input from "./Input";
import Dropdown from "./Dropdown";
import Button from "./Button";
import { useNavigate } from "react-router-dom";
import { DatePicker as AntDatePicker } from "antd";
import { toast } from "react-toastify";

type ColumnType =
  | "text"
  | "image"
  | "status"
  | "actions"
  | "button"
  | "custom"
  | "attachReceipt";

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

interface AllExpensesTableProps {
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
  canUpdate?: boolean;
  canDelete?: boolean;
}

const AllExpensesTable: React.FC<AllExpensesTableProps> = ({
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
  canUpdate = true,
  canDelete = true,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteUser, setDeleteUser] = useState<any>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [receiptDetail, setReceiptDetail] = useState<any>(null);

  const navigate = useNavigate();

  const { RangePicker } = AntDatePicker;

  const filteredData = data.filter((item) => {
    const matchesSearch = Object.values(item)
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


  return (
    <>
      <div
        className={`bg-white rounded-xl p-4 flex flex-col gap-2 overflow-hidden shadow-md ${className}`}
      >
        {/* Search + Filter */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 items-center justify-between">
          <Input
            placeholder="Search by Name, Category"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full !rounded-3xl"
          />
          <Dropdown
            className="w-full md:auto"
            options={["All", "Active", "Inactive"]}
            DropDownName="Category"
            onSelect={(val) => {
              setStatusFilter(val);
              setCurrentPage(1);
            }}
          />
          <RangePicker className="h-10 !text-gray-400 !border-gray-300" />
          <div className="flex justify-start xl:justify-end md:col-span-4 lg:col-span-1 w-full">
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
                  const selected = Number.parseInt(val.split(" ")[0]);
                  setRowsPerPage(selected);
                  setCurrentPage(1);
                }}
                className="bg-black text-white rounded px-2 py-1 min-w-[90px]"
              />
            </div>
          </div>
        </div>
      </div>

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
                Delete {deleteUser?.expenseName || "Expense"}
              </h2>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="text-xl font-bold text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
            <div className="mt-8 text-start pb-8 px-6 shadow-[0_2px_2px_0_#00000026]">
              <h3 className="text-lg font-semibold mb-1">Delete Expense?</h3>
              <p className="text-sm text-gray-700">
                Are you sure you want to delete this expense?
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
                  if (onDelete && deleteUser) {
                    onDelete(deleteUser);
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
                Delete {deleteUser?.expenseName || "Expense"}
              </h2>
              <button
                onClick={() => setDeleteModal(false)}
                className="text-xl font-bold text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
            <div className="mt-8 text-start pb-8 px-6 shadow-[0_2px_2px_0_#00000026]">
              <h3 className="text-lg font-semibold mb-1">Delete Expense?</h3>
              <p className="text-sm text-gray-700">
                The expense has been removed
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

      {/* Receipt Detail Modal */}
      {receiptDetail && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black/20 z-50"
          onClick={() => setReceiptDetail(false)}
        >
          <div
            className="animate-scaleIn bg-white overflow-hidden w-[60vw] h-auto overflow-y-auto rounded-[7px] shadow-lg px-4 py-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-xl font-semibold text-[#056BB7]">Receipt</h2>
              <Button
                text="Print"
                className="bg-[#056BB7] text-white font-medium h-8 px-6 border-none"
              />
            </div>
            <div className="flex items-center w-full mb-7 mt-4">
              <div className="w-1/2">
                <div className="flex text-[15px] Poppins-font font-medium">
                  <label htmlFor="" className="mb-1">
                    Reference Number:{" "}
                    <span className="font-light">
                      {receiptDetail.referenceNumber || "N/A"}
                    </span>
                  </label>
                </div>
                <div className="flex text-[15px] Poppins-font font-medium">
                  <label htmlFor="" className="mb-1">
                    Payment Mode:{" "}
                    <span className="font-light">
                      {receiptDetail.paymentMode?.name || "N/A"}
                    </span>
                  </label>
                </div>
              </div>
              <div className="w-1/2">
                <div className="flex text-[15px] Poppins-font font-medium">
                  <label htmlFor="" className="mb-1">
                    Payment Date:{" "}
                    <span className="font-light">
                      {new Date(receiptDetail.date).toLocaleDateString()}
                    </span>
                  </label>
                </div>
                <div className="flex text-[15px] Poppins-font font-medium">
                  <label htmlFor="" className="mb-1">
                    Amount:{" "}
                    <span className="font-light">${receiptDetail.amount}</span>
                  </label>
                </div>
              </div>
            </div>

            {receiptDetail.expenseImage && (
              <div className="mt-4">
                <img
                  src={receiptDetail.expenseImage || "/placeholder.svg"}
                  alt="Receipt"
                  className="max-w-full h-auto rounded-md"
                />
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default AllExpensesTable;
