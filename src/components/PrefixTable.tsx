import React, { useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { RiEditLine } from "react-icons/ri";
import { GoChevronLeft, GoChevronRight } from "react-icons/go";
import { LuEye } from "react-icons/lu";

import Input from "./Input";
import Dropdown from "./Dropdown";
import Button from "./Button";
import { toast } from "react-toastify";
type ColumnType = "text" | "image" | "status" | "actions" | "button" | "custom";

interface Column {
  header: string;
  accessor: string;
  type?: ColumnType;
}
interface PrefixTableProps {
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

const PrefixTable: React.FC<PrefixTableProps> = ({
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
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedUser, setSelectedUser] = useState<any>(null); // for modal
  const [deleteZone, setDeleteZone] = useState<any>(null); // for modal
  // const [showZoneDetail, setShowZoneDetail] = useState(null); // for modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [search, setSearch] = useState(""); // ✅ Local search state
  const [statusFilter, setStatusFilter] = useState("All"); // ✅ Status filter state

  // To these two state variables edit user
  const [isEditing, setIsEditing] = useState(false);
  const [editingRow, setEditingRow] = useState<any>(null);
  const [formData, setFormData] = useState<any>(null);

  // const filteredData = data.filter((item) => {
  //   const matchesSearch = Object.values(item)
  //     .join(" ")
  //     .toLowerCase()
  //     .includes(search.toLowerCase());
  //   const matchesStatus =
  //     statusFilter === "All" || item.status === statusFilter;
  //   return matchesSearch && matchesStatus;
  // });

  const filteredData = data.filter((item) => {
    // Only search in name and id fields
    const nameMatch =
      item.name?.toLowerCase().includes(search.toLowerCase()) || false;
    const idMatch =
      item.id?.toLowerCase().includes(search.toLowerCase()) || false;

    const matchesSearch = nameMatch || idMatch;
    const matchesStatus =
      statusFilter === "All" ||
      item.status?.toLowerCase() === statusFilter.toLowerCase();

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
  // console.log("DATA", data);

  return (
    <>
      <div
        className={`bg-white rounded-xl p-4 flex flex-col gap-5 overflow-hidden shadow-md ${className}`}
      >
        {/* Search + Filter */}
        {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center justify-between"> */}
        <div
          className={`grid gap-4 items-center justify-between md:grid-cols-2 ${
            data.some((item) => item.hasOwnProperty("status"))
              ? ""
              : "grid-cols-2"
          }`}
        >
          <div className="flex gap-3">
            {searchable && (
              // <Input
              //   placeholder="Search name, ID"
              //   value={search}
              //   onChange={(e) => setSearch(e.target.value)}
              //   className="w-sm !rounded-3xl outline-none "
              // />
              <Input
                placeholder="Search name, ID"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="max-w-full sm:max-w-2xl !rounded-3xl outline-none "
              />
            )}
            {/* {filterByStatus && (
              <Dropdown
                options={["All", "Active", "Inactive"]}
                DropDownName="Status"
                defaultValue="All"
                onSelect={(val) => {
                  setStatusFilter(val);
                  setCurrentPage(1);
                }}
              />
            )} */}

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
                      //   ...(isFirst && { width: "45%", whiteSpace: "nowrap" }),
                      //   ...(isLast && { width: "9%", whiteSpace: "nowrap" }),
                      // }}
                      style={{
                        ...(isFirst && { width: "45%", whiteSpace: "nowrap" }),
                        ...(isLast && { width: "9%", whiteSpace: "nowrap" }),
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
                  className="hover:bg-gray-50 whitespace-nowrap cursor-pointer"
                  onClick={() => {
                    //NEW
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
                        <div className={`flex flex-row items-center `}>
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
                                    className={`inline-block px-2 py-1 text-xs rounded-full ${
                                      row.status === "active"
                                        ? "bg-green-100 text-green-600"
                                        : "bg-red-100 text-red-600"
                                    }`}
                                  >
                                    {row.status}
                                  </span>
                                );
                              // In the PrefixTable component, modify the actions case in the switch statement:

                              case "actions":
                                return (
                                  <div className="flex justify-end gap-2">
                                    {eye && (
                                      <LuEye
                                        className="cursor-pointer"
                                        onClick={(e) => e.stopPropagation()}
                                      />
                                    )}

                                    <RiEditLine
                                      className="cursor-pointer"
                                      onClick={(e) => {
                                        e.stopPropagation();

                                        if (!canUpdate) {
                                          toast.error(
                                            "You don't have permission to edit prefix"
                                          );
                                          return;
                                        }

                                        setIsEditing(true);
                                        setEditingRow(row);
                                        setFormData({ ...row }); // Initialize form data with the row data
                                      }}
                                    />

                                    <AiOutlineDelete
                                      className="cursor-pointer hover:text-red-500"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        if (!canDelete) {
                                          toast.error(
                                            "You don't have permission to delete prefix"
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

      {/* Modal */}
      {/* {isEditing && (
        <>
          <div
            className="fixed inset-0 flex items-center justify-center bg-black/20 z-50"
            onClick={() => setIsEditing(false)}
          >
            <div
              className="animate-scaleIn bg-white w-[90vw] overflow-hidden md:h-auto sm:w-lg md:w-[80vw] lg:w-3xl h-[70vh] overflow-y-auto rounded-[7px] shadow-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <p className="Source-Sans-Pro-font p-4 text-[#056BB7] font-semibold text-[20px] sm:text-[24px] m-0 sticky top-0 bg-white shadow-sm z-40">
                Edit Zone
              </p>

              <form
                className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 md:gap-12 lg:gap-16 xl:gap-16 text-[15px] Poppins-font font-medium w-full p-4"
              >
                <div className="flex flex-col space-y-4 w-full">
                  <div className="flex flex-col w-full">
                    <label className="mb-1 text-black">Zone</label>
                    <Input
                      placeholder="Zone name"
                      className="outline-none focus:outline-none w-full"
                    />
                  </div>

                  <div className="flex flex-col w-full">
                    <label className="mb-1 text-black">Address</label>
                    <Input
                      placeholder="Street, City, State, Zip Code, Country"
                      className="outline-none focus:outline-none w-full"
                    />
                  </div>

                  <div className="flex flex-col w-full">
                    <label className="mb-1 text-black">
                      Zone Representative
                    </label>
                    <Input
                      placeholder="John"
                      className="outline-none focus:outline-none w-full"
                    />
                  </div>
                </div>

                <div className="flex flex-col space-y-4 w-full">
                  <div className="flex flex-col w-full">
                    <label className="mb-1 text-black">Location</label>
                    <Input
                      placeholder="New York Office"
                      className="outline-none focus:outline-none w-full"
                    />
                  </div>

                  <div className="flex flex-col w-full">
                    <label className="mb-1 text-black">Phone No</label>
                    <Input
                      placeholder="+56 362738233"
                      className="outline-none focus:outline-none w-full"
                    />
                  </div>

                  <div className="flex flex-col w-full">
                    <label className="mb-1 text-black">Store</label>
                    <Dropdown
                      options={["Store A", "Store B", "Store C"]}
                      className="outline-none focus:outline-none"
                      defaultValue="Store name"
                    />
                  </div>

                  <div className="flex justify-end font-medium pt-2">
                    <Button
                      text="Save"
                      className="px-6 !bg-[#056BB7] text-white !border-none"
                    />
                  </div>
                </div>
              </form>
            </div>
          </div>
        </>
      )} */}

      {/* {isEditing && (
        <>
          <div
            className="fixed inset-0 flex items-center justify-center bg-black/20 z-50"
            onClick={() => setIsEditing(false)}
          >
            <div
              className="animate-scaleIn bg-white w-[90vw] overflow-hidden !md:h-[30vh] sm:w-lg md:w-[80vw] lg:w-3xl h-[57vh] overflow-y-auto rounded-[7px] shadow-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <p className="Source-Sans-Pro-font p-4 text-[#056BB7] font-semibold text-[20px] sm:text-[24px] m-0 sticky top-0 bg-white shadow-sm z-40">
                Edit Zone
              </p>

              <form
                className="mt-2 text-[15px] Poppins-font font-medium w-full p-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  // Handle your save logic here
                }}
              >
                <div className="flex flex-col w-full mb-2">
                  <label className="mb-1 text-black">Prefix Name</label>
                  <Input
                    placeholder="Prefix Name"
                    // value={location}
                    // onChange={(e) => setLocation(e.target.value)}
                    className="outline-none focus:outline-none w-full"
                  />
                </div>

                <div className="flex flex-col w-full mb-6">
                  <label className="mb-1 text-black">Store</label>
                  <Dropdown
                    options={["Select Status", "Active", "Inactive"]}
                    className="outline-none focus:outline-none"
                    defaultValue="Status"
                  />
                </div>

                <div className="flex justify-end font-medium pt-2 absolute bottom-4 right-4">
                  <Button
                    // type="submit"
                    text="Save"
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
              className="animate-scaleIn bg-white w-[90vw] overflow-hidden !md:h-[30vh] sm:w-lg md:w-[80vw] lg:w-3xl h-auto overflow-y-auto rounded-[7px] shadow-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <p className="Source-Sans-Pro-font p-4 text-[#056BB7] font-semibold text-[20px] sm:text-[24px] m-0 sticky top-0 bg-white shadow-sm z-40">
                Edit Prefix
              </p>

              <form
                className="mt-2 text-[15px] Poppins-font font-medium w-full p-4 pb-8"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (onEdit && editingRow) {
                    // Pass the updated form data to the parent component
                    onEdit({ ...editingRow, ...formData });
                    setIsEditing(false);
                  }
                }}
              >
                <div className="flex flex-col w-full mb-2">
                  <label className="mb-1 text-black">Prefix Name</label>
                  <Input
                    placeholder="Prefix Name"
                    value={formData?.name || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="outline-none focus:outline-none w-full"
                  />
                </div>

                <div className="flex flex-col w-full mb-6">
                  <label className="mb-1 text-black">Status</label>
                  <Dropdown
                    options={["active", "inactive"]}
                    className="outline-none focus:outline-none"
                    defaultValue={formData?.status || "active"}
                    onSelect={(val) =>
                      setFormData({ ...formData, status: val })
                    }
                  />
                </div>

                <div className="flex justify-end font-medium pt-2">
                  <Button
                    type="submit"
                    text="Save"
                    className="px-6 !bg-[#056BB7] text-white !border-none"
                  />
                </div>
              </form>
            </div>
          </div>
        </>
      )}

      {showDeleteModal && canDelete && (
        <div
          // className="fixed inset-0 z-50 flex items-center justify-center bg-transparent backdrop-blur-xs bg-opacity-40 transition-opacity duration-300"
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
              <h2 className="text-xl font-medium">Delete {deleteZone.name}</h2>
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
              </h3>
              <p className="text-sm text-gray-700">
                Are you sure you want to delete this{" "}
                {tableTitle?.endsWith("s")
                  ? tableTitle?.slice(0, -1)
                  : tableTitle}
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
                  if (onDelete && deleteZone) {
                    onDelete(deleteZone);
                  }
                  setShowDeleteModal(false);
                  setDeleteModal(true); // Show the success modal
                }}
                className="!border-none px-5 py-1 bg-[#DC2626] hover:bg-red-700 text-white rounded-md flex items-center gap-1"
              />
            </div>
          </div>
        </div>
      )}
      {deleteModal && (
        <div
          // className="fixed inset-0 z-50 flex items-center justify-center bg-transparent backdrop-blur-xs bg-opacity-40 transition-opacity duration-300"
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
              <h2 className="text-xl font-medium">Delete {deleteZone.name}</h2>
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
              </h3>
              <p className="text-sm text-gray-700">
                The{" "}
                {tableTitle?.endsWith("s")
                  ? tableTitle?.slice(0, -1)
                  : tableTitle}
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
      {selectedUser && (
        <div
          // className="fixed inset-0 z-50 bg-transparent bg-opacity-40 flex justify-center backdrop-blur-xs items-center"
          className="fixed inset-0 flex items-center justify-center bg-black/20 z-50"
          onClick={() => setSelectedUser(null)}
        >
          <div
            className="animate-scaleIn bg-white w-full max-w-md rounded-2xl shadow-xl p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="grid grid-cols-1 gap-x-4 gap-y-2 text-sm text-gray-700 mb-6">
              <h3 className="col-span-2 text-blue-600 font-semibold text-lg">
                {selectedUser?.name}
              </h3>

              <span className="font-medium">Location</span>
              <span className="text-gray-500 text-right">New York Office</span>

              <span className="font-medium">Address</span>
              <span className="text-gray-500 text-right">
                123 Maplewood Lane Springfield,
                <br />
                IL 62704 United States
              </span>

              <span className="font-medium">Phone No</span>
              <span className="text-gray-500 text-right">+56 362738233</span>

              <span className="font-medium">Zone Representative</span>
              <span className="text-gray-500 text-right">John</span>

              <span className="font-medium">Store</span>
              <span className="text-gray-500 space-y-1 flex flex-col text-right">
                <span>Downtown Branch</span>
                <span>Celestial Diamonds</span>
                <span>Branch Heirloom &amp; Co.</span>
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PrefixTable;
