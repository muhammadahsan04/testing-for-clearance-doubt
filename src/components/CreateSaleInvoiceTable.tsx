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

interface CreateSaleInvoiceTableProps {
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
  bottomBtn?: boolean;
}

const CreateSaleInvoiceTable: React.FC<CreateSaleInvoiceTableProps> = ({
  bottomBtn,
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

  return (
    <>
      <div
        className={`my-4 bg-white rounded-xl flex flex-col gap-5 overflow-hidden shadow-md ${className}`}
      >
        {/* Search + Filter */}
        {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center justify-between"> */}

        {/* Table */}
        {/* <div className="bg-white rounded-xl border border-gray-300 overflow-x-auto"> */}
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
                const isSecond = index === 1;
                const isLast = index === columns.length - 1;

                return (
                  <th
                    key={col.accessor}
                    className="px-4 py-3"
                    style={{ width: "max-content" }}
                  >
                    <div
                      className={`flex flex-row items-center ${
                        isFirst
                          ? "justify-center"
                          : isSecond
                          ? "justify-start"
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
          <tbody className="border-gray-400">
            {currentData.map((row, idx) => (
              <tr
                key={idx}
                className="hover:bg-gray-50 whitespace-nowrap cursor-pointer"
                // onClick={() => {
                //   // Custom behavior per table usage OLD
                //   if (onRowClick) {
                //     onRowClick(row);
                //   } else {
                //     setSelectedUser(row);
                //   }
                // }}
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
                  const isSecond = index === 1;
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
                            ? "justify-center"
                            : isSecond
                            ? "justify-start"
                            : isLast
                            ? "justify-center"
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
                                <div className="flex justify-end gap-2">
                                  {eye && (
                                    <LuEye
                                      className="cursor-pointer"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        console.log("row", row);

                                        setShowPurchaseOrderDetailModal(row);
                                        //   console.log(showPurchaseOrderDetailModal.category , 'showPurchaseOrderDetailModal');

                                        // navigate("purchase-order-detail");
                                      }}
                                    />
                                  )}
                                  {/* <RiEditLine
                                      className="cursor-pointer"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setIsEditing(true); // Set isEditing to true
                                        setEditingRow(row); // Store the row data in editingRow
                                      }}
                                    /> */}

                                  <RiEditLine
                                    className="cursor-pointer"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setIsEditing(true);
                                      setEditingRow(row);
                                      setFormData({ ...row }); // Initialize form data with the row data
                                    }}
                                  />

                                  <AiOutlineDelete
                                    className="cursor-pointer hover:text-red-500"
                                    onClick={(e) => {
                                      e.stopPropagation();
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
        {/* </div> */}
      </div>
      {bottomBtn && (
        <div className="flex justify-end gap-4  Poppins-font font-medium mt-3">
          <Button text="Back" className="px-6 !bg-[#F4F4F5] !border-none " />
          <Button
            text="Sale Invoice"
            className="px-6 !bg-[#056BB7] border-none text-white"
          />
        </div>
      )}
      {showPurchaseOrderDetailModal && (
        <>
          <div
            // className="fixed inset-0 flex items-center justify-center bg-transparent backdrop-blur-[1px] bg-opacity-40 z-50"
            className="fixed inset-0 flex items-center justify-center bg-black/20 z-50"
            // className="fixed inset-0 flex items-center justify-center bg-black/30 z-50"
            onClick={() => setShowPurchaseOrderDetailModal(null)}
          >
            <div
              className="animate-scaleIn bg-white rounded-xl shadow-md p-4 w-[320px]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mx-auto">
                {/* Head Office Badge */}
                {/* <div className="flex justify-end border"></div> */}

                {/* Image */}
                <div className="flex justify-center my-2">
                  <div className="relative">
                    <span className="bg-blue-600 absolute top-2 left-0 text-white text-xs font-semibold px-2 py-1 rounded">
                      HEADOFFICE
                    </span>
                    <img
                      src={chainforModalImage} // Replace with your actual image path or prop
                      alt="Gold Chain"
                      className="w-full object-contain"
                    />
                  </div>
                </div>

                {/* SKU and Barcode */}
                <div className="flex flex-wrap justify-between items-center pb-2 mb-2 px-1 text-[12px]">
                  <span>
                    <strong>SKU:</strong> RC9748
                  </span>
                  <span>
                    <strong>BARCODE:</strong> RC9748
                  </span>
                </div>

                {/* Details Section */}
                <div className="flex justify-between gap-4 text-[12px] px-1 w-full">
                  <div className="space-y-1">
                    <h3 className="font-bold text-gray-900">DETAIL:</h3>
                    <div className="flex justify-between gap-4">
                      <p>Category:</p>
                      <p>Chain</p>
                    </div>
                    <div className="flex justify-between gap-4">
                      <p>Sub Category:</p>
                      <p>Eternal Glow</p>
                    </div>
                    <div className="flex justify-between gap-4">
                      <p>Style:</p>
                      <p>Cuban</p>
                    </div>
                    <div className="flex justify-between gap-4">
                      <p>Gold Category:</p>
                      <p>10K</p>
                    </div>
                    <div className="flex justify-between gap-4">
                      <p>Diamond Weight:</p>
                      <p>4.5 CWT</p>
                    </div>
                    <div className="flex justify-between gap-4">
                      <p>Gold Weight:</p>
                      <p>150 gms</p>
                    </div>
                    <div className="flex justify-between gap-4">
                      <p>Length:</p>
                      <p>18"</p>
                    </div>
                    <div className="flex justify-between gap-4">
                      <p>MM:</p>
                      <p>8mm</p>
                    </div>
                    <div className="flex justify-between gap-4">
                      <p>Size:</p>
                      <p>7</p>
                    </div>
                  </div>

                  {/* <div className="space-y-1">
                   
                  </div> */}

                  {/* Cost Price */}
                  <div className="text-left">
                    <h3 className="font-bold text-gray-900">COST PRICE:</h3>
                    <p className="text-red-600 text-lg font-bold">$15.50</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {showDeleteModal && (
        <div
          // className="fixed inset-0 z-50 flex items-center justify-center bg-transparent backdrop-blur-xs bg-opacity-40 transition-opacity duration-300"
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
                Delete {deleteUser.category}
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
                Delete Inventory
                {/* {tableTitle?.endsWith("s")
                  ? tableTitle?.slice(0, -1)
                  : tableTitle}
                ? */}
              </h3>
              <p className="text-sm text-gray-700">
                Are you sure you want to delete this{" "}
                {/* {tableTitle?.endsWith("s")
                  ? tableTitle?.slice(0, -1)
                  : tableTitle}
                ? */}
                Inventory
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
          // className="fixed inset-0 z-50 flex items-center justify-center bg-transparent backdrop-blur-xs bg-opacity-40 transition-opacity duration-300"
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
                Delete {deleteUser.category}
              </h2>
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
                Delete Inventory
                {/* {tableTitle?.endsWith("s")
                  ? tableTitle?.slice(0, -1)
                  : tableTitle}
                ? */}
              </h3>
              <p className="text-sm text-gray-700">
                The Inventory{" "}
                {/* {tableTitle?.endsWith("s")
                  ? tableTitle?.slice(0, -1)
                  : tableTitle}{" "} */}
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

export default CreateSaleInvoiceTable;
