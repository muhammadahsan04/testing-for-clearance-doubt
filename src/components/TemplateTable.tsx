import React, { useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { RiEditLine } from "react-icons/ri";
import { GoChevronLeft, GoChevronRight } from "react-icons/go";
import { LuEye } from "react-icons/lu";
import { toast } from "react-toastify";

import Input from "./Input";
import Dropdown from "./Dropdown";
import Button from "./Button";

// Helper function to check permissions
const hasPermission = (module: string, action: string) => {
  try {
    let permissionsStr = localStorage.getItem("permissions")
    if (!permissionsStr) {
      permissionsStr = sessionStorage.getItem("permissions")
    }

    if (!permissionsStr) return false

    const permissions = JSON.parse(permissionsStr)

    // Check if user has all permissions
    if (permissions.allPermissions || permissions.allPagesAccess) return true

    const page = permissions.pages?.find((p: any) => p.name === module)
    if (!page) return false

    switch (action.toLowerCase()) {
      case 'create':
        return page.create
      case 'read':
        return page.read
      case 'update':
        return page.update
      case 'delete':
        return page.delete
      default:
        return false
    }
  } catch (error) {
    console.error("Error checking permissions:", error)
    return false
  }
}

// Helper function to get user role
const getUserRole = () => {
  let role = localStorage.getItem("role")
  if (!role) {
    role = sessionStorage.getItem("role")
  }
  return role
}

type ColumnType = "text" | "image" | "status" | "actions" | "button" | "custom";

interface Column {
  header: string;
  accessor: string;
  type?: ColumnType;
}

export interface TemplateData {
  id: string;
  name: string;
  content: string;
  status: string;
  [key: string]: any;
}

interface TemplateTableProps {
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
}

const TemplateTable: React.FC<TemplateTableProps> = ({
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
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [deleteTemplate, setDeleteTemplate] = useState<any>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [isEditing, setIsEditing] = useState(false);
  const [editingRow, setEditingRow] = useState<any>(null);
  const [editFormData, setEditFormData] = useState({
    name: "",
    content: "",
    status: "Active"
  });

  // Check permissions
  const userRole = getUserRole()
  const isAdmin = userRole === "Admin" || userRole === "SuperAdmin"
  const canEdit = isAdmin || hasPermission("Suppliers", "update")
  const canDelete = isAdmin || hasPermission("Suppliers", "delete")

  const filteredData = data.filter((item) => {
    const nameMatch = item.name?.toLowerCase().includes(search.toLowerCase()) || false;
    const idMatch = item.id?.toLowerCase().includes(search.toLowerCase()) || false;
    const templateIdMatch = item.templateId?.toLowerCase().includes(search.toLowerCase()) || false;

    const matchesSearch = nameMatch || idMatch || templateIdMatch;
    const matchesStatus = statusFilter === "All" || item.status === statusFilter;

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

  const handleEditClick = (row: any) => {
    if (!canEdit) {
      toast.error("You don't have permission to edit templates");
      return;
    }

    setIsEditing(true);
    setEditingRow(row);
    setEditFormData({
      name: row.name,
      content: row.content,
      status: row.status
    });
  };

  const handleDeleteClick = (row: any) => {
    if (!canDelete) {
      toast.error("You don't have permission to delete templates");
      return;
    }

    setShowDeleteModal(true);
    setDeleteTemplate(row);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!canEdit) {
      toast.error("You don't have permission to edit templates");
      return;
    }

    const updatedRow = {
      ...editingRow,
      name: editFormData.name,
      content: editFormData.content,
      status: editFormData.status
    };

    if (onEdit) {
      onEdit(updatedRow);
    }

    setIsEditing(false);
    setEditingRow(null);
  };

  const handleDeleteConfirm = () => {
    if (!canDelete) {
      toast.error("You don't have permission to delete templates");
      return;
    }

    if (onDelete && deleteTemplate) {
      onDelete(deleteTemplate);
    }

    setShowDeleteModal(false);
    setDeleteModal(true);
  };

  return (
    <>
      <div className={`bg-white rounded-xl p-4 flex flex-col gap-5 overflow-hidden shadow-md ${className}`}>
        {/* Search + Filter */}
        <div className="grid gap-4 items-center justify-between md:grid-cols-2">
          <div className="flex gap-3">
            {searchable && (
              <Input
                placeholder="Search Template name, ID"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="max-w-full sm:max-w-sm !rounded-3xl outline-none"
              />
            )}

            {filterByStatus && data.some((item) => item.hasOwnProperty("status")) && (
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
          <div className="flex md:justify-end gap-4 justify-start">
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
          <table className="w-full text-sm text-left text-gray-700">
            <thead className="bg-[#F9FAFB] text-black">
              <tr className="font-semibold text-[16px] whitespace-nowrap w-full">
                {columns.map((col, index) => {
                  const isFirst = index === 0;
                  const isLast = index === columns.length - 1;

                  return (
                    <th
                      key={col.accessor}
                      className="px-4 py-3 whitespace-nowrap text-left"
                      style={{
                        ...(isFirst && { width: "20%", whiteSpace: "nowrap" }),
                        ...(isLast && { width: "8%", whiteSpace: "nowrap" }),
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
                    if (onRowClick) {
                      onRowClick(row);
                    } else if (enableRowModal) {
                      setSelectedTemplate(row);
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
                              ? "justify-start"
                              : isLast
                                ? "justify-end"
                                : tableDataAlignment === "zone"
                                  ? "justify-start"
                                  : "justify-start"
                            }`}
                        >
                          {(() => {
                            switch (col.type) {
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
                                  <div className="flex justify-start gap-2 w-full">
                                    {eye && (
                                      <LuEye
                                        className="cursor-pointer"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                        }}
                                      />
                                    )}
                                    <RiEditLine
                                      className="cursor-pointer"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleEditClick(row);
                                      }}
                                    />
                                    <AiOutlineDelete
                                      className="cursor-pointer hover:text-red-500"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteClick(row);
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
          <div className="flex flex-col md:flex-row items-center justify-between px-4 py-4">
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
                    className={`w-8 h-8 rounded-full text-sm flex items-center justify-center transition ${currentPage === num
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

      {/* Template Details Modal */}
      {selectedTemplate && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black/20 z-50"
          onClick={() => setSelectedTemplate(null)}
        >
          <div
            className="animate-scaleIn bg-white rounded-xl p-6 w-full max-w-md mx-auto relative shadow-md transition-opacity duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Template Details</h2>
              <button
                onClick={() => setSelectedTemplate(null)}
                className="text-xl font-bold text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
            <div className="text-center">
              <div className="mt-3 w-full flex">
                <span
                  className={`text-sm px-3 py-1 rounded-md ml-auto ${selectedTemplate.status === "Active"
                      ? "text-[#10A760] bg-[#34C75933]"
                      : "text-red-600 bg-red-100"
                    }`}
                >
                  {selectedTemplate.status}
                </span>
              </div>
              <div className="my-5"></div>
              <h3 className="text-xl font-bold mt-1">
                {selectedTemplate.name} ({selectedTemplate.templateId})
              </h3>
              <div className="mt-4 text-left">
                <h4 className="font-semibold text-gray-700 mb-2">Content:</h4>
                <div className="bg-gray-50 p-3 rounded-md max-h-40 overflow-y-auto">
                  <p className="text-sm text-gray-600 whitespace-pre-wrap">
                    {selectedTemplate.content}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Template Modal */}
      {isEditing && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black/20 z-50"
          onClick={() => setIsEditing(false)}
        >
          <div
            className="animate-scaleIn bg-white rounded-xl p-6 w-full max-w-lg mx-auto relative shadow-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-[#056BB7]">
                Edit Template
              </h2>
              <button
                onClick={() => setIsEditing(false)}
                className="text-xl font-bold text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleEditSubmit}>
              <div className="space-y-4">
                <div className="flex flex-col">
                  <label htmlFor="name" className="mb-1">
                    Template Name
                  </label>
                  <Input
                    name="name"
                    placeholder="Template Name"
                    className="outline-none focus:outline-none w-full"
                    value={editFormData.name}
                    onChange={(e) => setEditFormData({
                      ...editFormData,
                      name: e.target.value
                    })}
                  />
                </div>

                <div className="flex flex-col">
                  <label htmlFor="content" className="mb-1">
                    Template Content
                  </label>
                  <textarea
                    name="content"
                    placeholder="Template Content"
                    rows={5}
                    value={editFormData.content}
                    onChange={(e) => setEditFormData({
                      ...editFormData,
                      content: e.target.value
                    })}
                    className="Poppins-font font-medium w-full px-4 py-2 border border-gray-300 rounded-md text-sm !focus:outline-none outline-none resize-none"
                  />
                </div>

                <div className="flex flex-col">
                  <label className="mb-1">Status</label>
                  <div className="flex gap-4 mt-1">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="status"
                        value="Active"
                        checked={editFormData.status === "Active"}
                        onChange={(e) => setEditFormData({
                          ...editFormData,
                          status: e.target.value
                        })}
                        className="form-radio h-4 w-4 text-blue-600"
                      />
                      <span>Active</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="status"
                        value="Inactive"
                        checked={editFormData.status === "Inactive"}
                        onChange={(e) => setEditFormData({
                          ...editFormData,
                          status: e.target.value
                        })}
                        className="form-radio h-4 w-4 text-blue-600"
                      />
                      <span>Inactive</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-4 mt-6">
                <Button
                  text="Cancel"
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-6 !bg-[#F4F4F5] !border-none"
                />
                <Button
                  text="Update"
                  type="submit"
                  className="px-6 !bg-[#056BB7] border-none text-white"
                />
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black/20 z-50"
          onClick={() => {
            setShowDeleteModal(false);
            setDeleteTemplate(null);
          }}
        >
          <div
            className="animate-scaleIn bg-white rounded-xl w-full max-w-md relative shadow-lg border-3 border-gray-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center py-4 px-6 shadow-[0_2px_2px_0_#00000026]">
              <h2 className="text-xl font-medium">
                Delete {deleteTemplate?.name}
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
                Delete Template?
              </h3>
              <p className="text-sm text-gray-700">
                Are you sure you want to delete this template?
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
                onClick={handleDeleteConfirm}
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
            setDeleteTemplate(null);
          }}
        >
          <div
            className="animate-scaleIn bg-white rounded-xl w-full max-w-md relative shadow-lg border-3 border-gray-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center py-4 px-6 shadow-[0_2px_2px_0_#00000026]">
              <h2 className="text-xl font-medium">
                Delete {deleteTemplate?.name}
              </h2>
              <button
                onClick={() => setDeleteModal(false)}
                className="text-xl font-bold text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
            <div className="mt-8 text-start pb-8 px-6 shadow-[0_2px_2px_0_#00000026]">
              <h3 className="text-lg font-semibold mb-1">
                Delete Template
              </h3>
              <p className="text-sm text-gray-700">
                The template has been removed successfully.
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
    </>
  );
};

export default TemplateTable;

