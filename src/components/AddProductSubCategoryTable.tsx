import React, { useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { RiEditLine } from "react-icons/ri";
import { GoChevronLeft, GoChevronRight } from "react-icons/go";
import { LuEye } from "react-icons/lu";
import axios from "axios";
import { toast } from "react-toastify";

import Input from "./Input";
import Dropdown from "./Dropdown";
import Button from "./Button";

type ColumnType = "text" | "image" | "status" | "actions" | "button" | "custom";

interface Column {
  header: string;
  accessor: string;
  type?: ColumnType;
}

interface SubCategoryData {
  _id: string;
  name: string;
  category: {
    _id: string;
    name: string;
  };
  sno?: string;
  subCategory?: string;
  categoryId?: string;
}

interface CategoryData {
  _id: string;
  name: string;
}

interface AddProductSubCategoryTableProps {
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
  categoryOptions?: string[];
  categoryData?: CategoryData[];
  canUpdate?: boolean;
  canDelete?: boolean;
}

// Helper function to get auth token
const getAuthToken = () => {
  let token = localStorage.getItem("token");
  if (!token) {
    token = sessionStorage.getItem("token");
  }
  return token;
};

const AddProductSubCategoryTable: React.FC<AddProductSubCategoryTableProps> = ({
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
  categoryOptions = [],
  categoryData = [],
  canUpdate = true,
  canDelete = true,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedUser, setSelectedUser] = useState<any>(null); // for modal
  const [deleteZone, setDeleteZone] = useState<any>(null); // for modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [search, setSearch] = useState(""); // ✅ Local search state
  const [statusFilter, setStatusFilter] = useState("All"); // ✅ Status filter state

  // To these two state variables edit user
  const [isEditing, setIsEditing] = useState(false);
  const [editingRow, setEditingRow] = useState<any>(null);
  const [loadingSubCategoryDetails, setLoadingSubCategoryDetails] =
    useState<boolean>(false);

  const [subCategoryName, setSubCategoryName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch subcategory details when edit button is clicked
  const fetchSubCategoryDetails = async (subCategoryId: string) => {
    setLoadingSubCategoryDetails(true);
    try {
      if (!canUpdate) {
        toast.error("You don't have permission to edit product sub-category");
        return;
      }
      const API_URL = import.meta.env.VITE_BASE_URL || "http://localhost:9000";
      const token = getAuthToken();

      if (!token) {
        toast.error("Authentication token not found. Please login again.");
        return;
      }

      const response = await axios.get(
        `${API_URL}/api/abid-jewelry-ms/getOneSubCategory/${subCategoryId}`,
        {
          headers: {
            "x-access-token": token,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        const subCategoryDetails = response.data.data;

        // Update form data with subcategory details
        setSubCategoryName(subCategoryDetails.name);

        // Find the category name based on the category ID
        // const category = categoryData.find(
        //   (cat) => cat._id === subCategoryDetails.category
        // );
        // if (category) {
        setSelectedCategory(subCategoryDetails?.category.name);
        // }
      } else {
        toast.error(
          response.data.message || "Failed to fetch subcategory details"
        );
      }
    } catch (error) {
      console.error("Error fetching subcategory details:", error);
      if (axios.isAxiosError(error)) {
        if (!error.response) {
          toast.error("Network error. Please check your internet connection.");
        } else {
          toast.error(
            error.response.data.message || "Failed to fetch subcategory details"
          );
        }
      } else {
        toast.error(
          "An unexpected error occurred while fetching subcategory details"
        );
      }
    } finally {
      setLoadingSubCategoryDetails(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!subCategoryName.trim()) {
      toast.error("Sub-category name is required");
      return;
    }

    if (!selectedCategory) {
      toast.error("Please select a category");
      return;
    }

    setIsSubmitting(true);

    try {
      const API_URL = import.meta.env.VITE_BASE_URL || "http://localhost:9000";
      const token = getAuthToken();

      if (!token) {
        toast.error("Authentication token not found. Please login again.");
        return;
      }

      // Find the category ID based on the selected category name
      const selectedCategoryObj = categoryData.find(
        (cat) => cat.name === selectedCategory
      );

      if (!selectedCategoryObj) {
        toast.error("Selected category not found");
        return;
      }

      const payload = {
        name: subCategoryName,
        category: selectedCategoryObj._id,
      };

      const response = await axios.put(
        `${API_URL}/api/abid-jewelry-ms/updateSubCategory/${editingRow._id}`,
        payload,
        {
          headers: {
            "x-access-token": token,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("response.data", response);

      if (response.data.success) {
        toast.success("Sub-category updated successfully!");

        // Close the edit modal
        setIsEditing(false);

        // Create the updated subcategory object
        const updatedSubCategory = {
          ...editingRow,
          name: subCategoryName,
          subCategory: subCategoryName,
          category: selectedCategory,
          categoryId: selectedCategoryObj._id,
        };

        // Notify parent component about the update
        if (onEdit) {
          onEdit(updatedSubCategory);
        }

        // Reset form
        setSubCategoryName("");
        setSelectedCategory("");
      } else {
        toast.error(response.data.message || "Failed to update sub-category");
      }
    } catch (error) {
      console.error("Error updating sub-category:", error);
      if (axios.isAxiosError(error)) {
        if (!error.response) {
          toast.error("Network error. Please check your internet connection.");
        } else {
          toast.error(
            error.response.data.message || "Failed to update sub-category"
          );
        }
      } else {
        toast.error("An unexpected error occurred while updating sub-category");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

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
                placeholder="Search Sub-Category"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="max-w-full sm:max-w-2xl !rounded-3xl outline-none "
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
                  const isSecond = index === 1;
                  const isSecondLast = index === columns.length - 2;
                  const isLast = index === columns.length - 1;

                  return (
                    <th
                      key={col.accessor}
                      className="md:px-12 px-6 py-3 whitespace-nowrap"
                      style={{
                        ...(isFirst && { width: "15%", whiteSpace: "nowrap" }),
                        ...(isSecond && { textAlign: "center" }),
                        ...(isSecondLast && { textAlign: "center" }),
                        ...(isLast && {
                          width: "20%",
                          whiteSpace: "nowrap",
                          textAlign: "end",
                        }),
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
                      setSelectedUser(row);
                    }
                  }}
                >
                  {columns.map((col, index) => {
                    const isFirst = index === 0;
                    const isSecond = index === 1;
                    const isSecondLast = index === columns.length - 2;
                    const isLast = index === columns.length - 1;

                    return (
                      <td
                        key={col.accessor}
                        className="md:px-12 px-6 py-2"
                        style={{
                          ...(isFirst && {
                            width: "15%",
                            whiteSpace: "nowrap",
                          }),
                          ...(isSecond && {
                            display: "flex",
                            justifyContent: "center",
                          }),
                          ...(isSecondLast && { textAlign: "center" }),
                          ...(isLast && {
                            width: "20%",
                            whiteSpace: "nowrap",
                            textAlign: "end",
                          }),
                        }}
                      >
                        <div className={` `}>
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
                                        setIsEditing(true);
                                        setEditingRow(row);
                                        // Fetch subcategory details when edit button is clicked
                                        fetchSubCategoryDetails(row._id);
                                      }}
                                    />

                                    <AiOutlineDelete
                                      className="cursor-pointer hover:text-red-500"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        if (!canDelete) {
                                          toast.error(
                                            "You don't have permission to delete product sub-category"
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

      {/* Edit Sub-Category Modal */}
      {isEditing && canUpdate && (
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
                Edit Sub-Category
              </p>

              {loadingSubCategoryDetails ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : (
                <form
                  className="mt-2 text-[15px] Poppins-font font-medium w-full p-4"
                  onSubmit={handleSubmit}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col w-full mb-2">
                      <label className="mb-1 text-black">
                        Sub-Category Name
                      </label>
                      <Input
                        placeholder="Sub-Category Name"
                        value={subCategoryName}
                        onChange={(e) => setSubCategoryName(e.target.value)}
                        className="outline-none focus:outline-none w-full"
                      />
                    </div>

                    <div className="flex flex-col w-full mb-6">
                      <label className="mb-1 text-black">Category</label>
                      <Dropdown
                        options={categoryOptions}
                        defaultValue={selectedCategory}
                        onSelect={(val) => setSelectedCategory(val)}
                        noResultsMessage="No category found"
                        searchable={true} // Add this prop
                      />
                    </div>
                  </div>

                  <div className="flex justify-end font-medium pt-2">
                    <Button
                      type="button"
                      text="Cancel"
                      onClick={() => setIsEditing(false)}
                      className="px-6 !bg-[#F4F4F5] !border-none mr-2"
                    />
                    <Button
                      type="submit"
                      text={isSubmitting ? "Updating..." : "Update"}
                      disabled={isSubmitting}
                      className="px-6 !bg-[#056BB7] text-white !border-none"
                    />
                  </div>
                </form>
              )}
            </div>
          </div>
        </>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && canDelete && (
        <div
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
              <h2 className="text-xl font-medium">
                Delete {deleteZone?.subCategory}
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

      {/* Delete Success Modal */}
      {deleteModal && (
        <div
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
              <h2 className="text-xl font-medium">
                Delete {deleteZone?.subCategory}
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
                Delete{" "}
                {tableTitle?.endsWith("s")
                  ? tableTitle?.slice(0, -1)
                  : tableTitle}
              </h3>
              <p className="text-sm text-gray-700">
                The{" "}
                {tableTitle?.endsWith("s")
                  ? tableTitle?.slice(0, -1)
                  : tableTitle}{" "}
                has been removed successfully.
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

      {/* Sub-Category Details Modal */}
      {selectedUser && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black/20 z-50"
          onClick={() => setSelectedUser(null)}
        >
          <div
            className="animate-scaleIn bg-white w-full max-w-md rounded-2xl shadow-xl p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-gray-700 mb-6">
              <h3 className="col-span-2 text-blue-600 font-semibold text-lg mb-2">
                {selectedUser?.subCategory}
              </h3>

              <span className="font-medium">Sub-Category ID</span>
              <span className="text-gray-500 text-right">
                {selectedUser?._id?.substring(0, 8)}...
              </span>

              <span className="font-medium">Category</span>
              <span className="text-gray-500 text-right">
                {selectedUser?.category}
              </span>
            </div>
            <div className="flex justify-end">
              <Button
                text="Close"
                onClick={() => setSelectedUser(null)}
                className="px-4 py-1 !bg-gray-200 text-gray-800 !border-none"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AddProductSubCategoryTable;
