import React, { useEffect, useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { RiEditLine } from "react-icons/ri";
import { GoChevronLeft, GoChevronRight } from "react-icons/go";
import { LuEye } from "react-icons/lu";

import Input from "./Input";
import Dropdown from "./Dropdown";
import Button from "./Button";
import { useNavigate } from "react-router-dom";
// import * as React from "react";
import dayjs, { Dayjs } from "dayjs";
import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateRange } from "@mui/x-date-pickers-pro/models";
import { DateRangePicker } from "@mui/x-date-pickers-pro/DateRangePicker";
import { DatePicker } from "antd";
import InvoiceDetailModal from "../../src/pages/dashboard/Inventory/InvoiceDetailModal";
// At the top of the file, export these types
export type ColumnType =
  | "text"
  | "image"
  | "status"
  | "actions"
  | "button"
  | "custom"
  | "subject-with-image";

export interface Column {
  header: string;
  accessor: string;
  type?: ColumnType;
}

interface CommunicationTableProps {
  // isOpen: boolean;
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
}

const CommunicationTable: React.FC<CommunicationTableProps> = ({
  // isOpen,
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
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [invoiceDetail, setInvoiceDetail] = useState<any>(null); // for modal
  const [deleteUser, setDeleteUser] = useState<any>(null); // for modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [search, setSearch] = useState(""); // ✅ Local search state
  const [statusFilter, setStatusFilter] = useState("All"); // ✅ Status filter state
  // To these two state variables edit user
  const [isEditing, setIsEditing] = useState(false);
  const [editingRow, setEditingRow] = useState<any>(null);
  const [formData, setFormData] = useState<any>(null);
  //   const [search, setSearch] = useState("");
  const [dateRange, setDateRange] = useState("");
  const [supplier, setSupplier] = useState("");
  const [isOpen, setIsOpen] = React.useState(false);

  const navigate = useNavigate();
  const filteredData = data.filter((item) => {
    // Only search in group and subject fields
    const matchesSearch =
      (item.group?.toLowerCase() || "").includes(search.toLowerCase()) ||
      (item.subject?.toLowerCase() || "").includes(search.toLowerCase());

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

  const { RangePicker } = DatePicker;
  const onClose = () => setIsOpen(false);
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  return (
    <>
      <div
        className={`bg-white rounded-xl p-4 flex flex-col gap-4 overflow-hidden shadow-md mt-8 ${className}`}
      >
        <div
          className={`grid gap-4 items-center justify-between md:grid-cols-2 ${
            data.some((item) => item.hasOwnProperty("status")) ? "" : ""
          }`}
        >
          <div className="flex gap-3">
            {searchable && (
              <Input
                placeholder="Search by Group, Subject" // Updated placeholder
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="!rounded-3xl !w-[300px] outline-none"
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
        <div className="bg-white rounded-xl border border-gray-300 overflow-hidden">
          <div className="overflow-x-auto" style={{ scrollbarWidth: "thin" }}>
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
              <tbody className="">
                {currentData.map((row, idx) => (
                  <tr
                    key={idx}
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
                            className={`flex flex-row items-center ${
                              isFirst
                                ? "justify-center"
                                : isLast
                                ? "justify-center"
                                : "justify-center"
                            }`}
                          >
                            {col.accessor === "actions" ? (
                              <Button
                                text="Resend"
                                className="text-white bg-blue-400 border-none !rounded-full px-3 !py-1"
                              />
                            ) : col.type === "subject-with-image" ? (
                              <div className="flex items-center gap-1">
                                <img
                                  src={row.userImage}
                                  alt={row[col.accessor]}
                                  className="w-7 h-7 object-cover rounded-md"
                                />
                                <span>{row[col.accessor]}</span>
                              </div>
                            ) : (
                              // @ts-ignore
                              row[col.accessor]
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
                      No data found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

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
              <h2 className="text-xl font-medium">Delete {deleteUser?.role}</h2>
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
              <h2 className="text-xl font-medium">Delete {deleteUser?.role}</h2>
              <button
                onClick={() => setDeleteModal(false)}
                className="text-xl font-bold text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
            {/* Body */}
            <div className="mt-8 text-start pb-8 px-6 shadow-[0_2px_2px_0_#00000026]">
              <h3 className="text-lg font-semibold mb-1">
                Delete{" "}
                {tableTitle?.endsWith("s")
                  ? tableTitle?.slice(0, -1)
                  : tableTitle}
                ?
              </h3>
              <p className="text-sm text-gray-700">
                The{" "}
                {tableTitle?.endsWith("s")
                  ? tableTitle?.slice(0, -1)
                  : tableTitle}{" "}
                has been remove
              </p>
            </div>
            <div className="flex justify-center gap-2 pb-3 py-4 px-6 shadow-[0_2px_2px_0_#00000026]">
              <Button
                text="Cancel"
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

export default CommunicationTable;
