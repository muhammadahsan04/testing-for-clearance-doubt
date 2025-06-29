import type React from "react";
import { useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { RiEditLine } from "react-icons/ri";
import { GoChevronLeft, GoChevronRight } from "react-icons/go";
import { LuEye } from "react-icons/lu";

import Input from "./Input";
import Dropdown from "./Dropdown";
import DatePicker from "./DatePicker";
import Button from "./Button";
import { useNavigate } from "react-router-dom";
import type { UploadFile, UploadProps } from "antd";
import { message, Upload } from "antd";
import HorizontalLinearAlternativeLabelStepper from "./HorizontalLinearAlternativeLabelStepper";
import { IoIosPrint } from "react-icons/io";

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

interface PurchaseOrderTableProps {
  columns: Column[];
  data: any[];
  tableTitle?: string;
  rowsPerPageOptions?: number[];
  defaultRowsPerPage?: number;
  searchable?: boolean;
  filterByStatus?: boolean;
  onEdit?: (row: any) => void;
  onView?: (row: any) => void;
  onDelete?: (row: any) => void;
  tableDataAlignment?: "zone" | "user" | "center";
  className?: string;
  onRowClick?: (row: any) => void;
  dealBy?: boolean;
  enableRowModal?: boolean;
  eye?: boolean;
  // New props for modal management
  isEditing?: boolean;
  setIsEditing?: (value: boolean) => void;
  editingRow?: any;
  formData?: any;
  setFormData?: (data: any) => void;
  handleInputChange?: (field: string, value: any) => void;
  suppliers?: any[];
  categories?: any[];
  subCategories?: any[];
  // goldCategories?: string[];
  currentPurchaseOrderData?: any;
  showPurchaseOrderDetailModal?: any;
  setShowPurchaseOrderDetailModal?: (data: any) => void;
  modalLoading?: boolean;
  updatePurchaseOrder?: (id: string, data: any) => void;
  loading?: boolean;
  goldCategories?: string[];
  goldCategoryData?: any[]; // Add this line
  // goldCategoryData?: any[];
  canUpdate?: boolean;
  canDelete?: boolean;

}

const PurchaseOrderTable: React.FC<PurchaseOrderTableProps> = ({
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
  onView,
  onDelete,
  tableDataAlignment = "start",
  dealBy,
  // New props
  isEditing = false,
  setIsEditing,
  editingRow,
  formData,
  setFormData,
  handleInputChange,
  suppliers = [],
  categories = [],
  subCategories = [],
  goldCategories = [],
  currentPurchaseOrderData,
  showPurchaseOrderDetailModal,
  setShowPurchaseOrderDetailModal,
  modalLoading = false,
  updatePurchaseOrder,
  loading = false,
  goldCategoryData = [], // Add this line
  canUpdate = true,
  canDelete = true,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedZones, setSelectedZones] = useState<string[]>([]);
  const [password, setPassword] = useState<string>("");
  const [image, setImage] = useState<UploadFile | null>(null);
  const [status, setStatus] = useState<"success" | "error" | null>(null);

  const generatePassword = () => {
    const length = 12;
    const charset =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";
    let generatedPassword = "";

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      generatedPassword += charset[randomIndex];
    }

    setPassword(generatedPassword);
  };

  const featuredProps: UploadProps = {
    name: "file",
    action: "https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload",
    showUploadList: false,
    maxCount: 1,
    onChange(info) {
      const file = info.file;
      console.log("file", file);

      if (file.status === "done") {
        message.success(`${file.name} uploaded successfully`);
        setImage(file);
        setStatus("success");
      } else if (file.status === "error") {
        message.error(`${file.name} upload failed`);
        setImage(file);
        setStatus("error");
      }
    },
  };

  const handleRemove = () => {
    setImage(null);
    setStatus(null);
  };

  const navigate = useNavigate();
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
  return (
    <>
      <div
        className={`bg-white rounded-xl p-4 flex flex-col gap-4 overflow-hidden shadow-md ${className}`}
      >
        <p className="text-[#056BB7] font-semibold text-[24px]">{tableTitle}</p>

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
                      className="px-4 py-3"
                      style={{ width: "max-content" }}
                    >
                      <div
                        className={`flex flex-row items-center ${isFirst
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
            <tbody className="border-b border-gray-400">
              {currentData.map((row, idx) => (
                <tr
                  key={idx}
                  className="hover:bg-gray-50 whitespace-nowrap cursor-pointer"
                  onClick={() => {
                    if (onRowClick) {
                      onRowClick(row);
                    } else if (enableRowModal) {
                      // Handle row click if needed
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
                                          src={
                                            row.userImage || "/placeholder.svg"
                                          }
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
                                          if (onView) {
                                            onView(row);
                                          }
                                        }}
                                      />
                                    )}
                                    <RiEditLine
                                      className="cursor-pointer"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        if (!canUpdate) {
                                          toast.error("You don't have permission to edit purchase Order");
                                          return;
                                        }
                                        if (onEdit) {
                                          onEdit(row);
                                        }
                                      }}
                                    />
                                    <AiOutlineDelete
                                      className="cursor-pointer hover:text-red-500"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        if (!canDelete) {
                                          toast.error("You don't have permission to delete purchase Order");
                                          return;
                                        }
                                        setSelectedUser(row);
                                        setShowDeleteModal(true);
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
    </div >

      {/* Delete Modal */ }
  {
    showDeleteModal && (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 bg-opacity-40 transition-opacity duration-300"
        onClick={() => setShowDeleteModal(false)}
      >
        <div
          className="animate-scaleIn bg-white rounded-xl w-full max-w-md relative shadow-lg border-3 border-gray-300"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center py-4 px-6 shadow-[0_2px_2px_0_#00000026]">
            <h2 className="text-xl font-medium">Delete Purchase Order</h2>
            <button
              onClick={() => setShowDeleteModal(false)}
              className="text-xl font-bold text-gray-500 hover:text-gray-700"
            >
              ×
            </button>
          </div>
          <div className="mt-8 text-start pb-8 px-6 shadow-[0_2px_2px_0_#00000026]">
            <h3 className="text-lg font-semibold mb-1">
              Delete Purchase Order?
            </h3>
            <p className="text-sm text-gray-700">
              Are you sure you want to delete this purchase order?
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
                if (onDelete && selectedUser) {
                  onDelete(selectedUser);
                }
              }}
              className="!border-none px-5 py-1 bg-[#DC2626] hover:bg-red-700 text-white rounded-md flex items-center gap-1"
            />
          </div>
        </div>
      </div>
    )
  }

  {/* Edit Modal */ }
  {
    isEditing && formData && (
      <>
        <div
          className="fixed inset-0 flex items-center justify-center bg-black/20 z-50"
          onClick={() => setIsEditing && setIsEditing(false)}
        >
          <div
            className="animate-scaleIn bg-white w-[90vw] overflow-hidden sm:w-lg md:w-[80vw] lg:w-3xl h-[70vh] overflow-y-auto rounded-[7px] shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="Source-Sans-Pro-font p-4 text-[#056BB7] font-semibold text-[20px] sm:text-[24px] m-0 sticky top-0 bg-white shadow-sm z-40">
              Edit Purchase Order
              {modalLoading && (
                <span className="ml-2 text-sm text-gray-500">Loading...</span>
              )}
            </p>

            <form
              className="text-[15px] Poppins-font font-medium w-full px-4"
              onSubmit={handleEditSubmit}
            >
              <div className="">
                <div className="mt-6 mb-4 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-16 xl:gap-32 text-[15px] Poppins-font font-medium">
                  <div className="space-y-4">
                    <div className="flex flex-col">
                      <label htmlFor="" className="mb-1">
                        Supplier Company Name
                      </label>
                      <Dropdown
                        defaultValue={
                          formData.supplierCompanyName || "Select Supplier"
                        }
                        options={suppliers.map(
                          (supplier) => supplier.companyName
                        )}
                        onSelect={(value) =>
                          handleInputChange &&
                          handleInputChange("supplierCompanyName", value)
                        }
                        className="w-full"
                      />
                    </div>
                    <div className="flex flex-col">
                      <label htmlFor="" className="mb-1">
                        Product Details
                      </label>
                      <Input
                        placeholder="Diamond Chains"
                        value={formData.productDetails || ""}
                        onChange={(e) =>
                          handleInputChange &&
                          handleInputChange("productDetails", e.target.value)
                        }
                        className="outline-none focus:outline-none w-full"
                      />
                    </div>

                    <div className="flex flex-col">
                      <label htmlFor="" className="mb-1">
                        Category
                      </label>
                      <Dropdown
                        defaultValue={
                          currentPurchaseOrderData?.category?.name ||
                          "Select Category"
                        }
                        options={categories.map((category) => category.name)}
                        onSelect={(value) => {
                          const selectedCategory = categories.find(
                            (cat) => cat.name === value
                          );
                          if (selectedCategory && handleInputChange) {
                            handleInputChange(
                              "category",
                              selectedCategory._id
                            ); // Send ID
                          }
                        }}
                        className="w-full"
                      />
                    </div>

                    <div className="flex flex-col">
                      <label htmlFor="" className="mb-1">
                        Sub Category
                      </label>
                      <Dropdown
                        defaultValue={
                          currentPurchaseOrderData?.subCategory?.name ||
                          "Select Sub Category"
                        }
                        options={subCategories.map(
                          (subCategory) => subCategory.name
                        )}
                        onSelect={(value) => {
                          const selectedSubCategory = subCategories.find(
                            (subCat) => subCat.name === value
                          );
                          if (selectedSubCategory && handleInputChange) {
                            handleInputChange(
                              "subCategory",
                              selectedSubCategory._id
                            ); // Send ID
                          }
                        }}
                        className="w-full"
                      />
                    </div>

                    <div className="flex flex-col">
                      <label htmlFor="" className="mb-1">
                        Gold Category
                      </label>
                      {/* <Dropdown
                          defaultValue={
                            formData.goldCategory || "Select Gold Category"
                          }
                          options={goldCategories}
                          onSelect={(value) =>
                            handleInputChange &&
                            handleInputChange("goldCategory", value)
                          }
                          className="w-full"
                        /> */}

                      <Dropdown
                        defaultValue={
                          currentPurchaseOrderData?.goldCategory?.name ||
                          "Select Gold Category"
                        }
                        options={goldCategories}
                        onSelect={(value) => {
                          // You'll need goldCategoryData passed as prop
                          const selectedGoldCategory = goldCategoryData?.find(
                            (goldCat) => goldCat.name === value
                          );
                          if (selectedGoldCategory && handleInputChange) {
                            handleInputChange(
                              "goldCategory",
                              selectedGoldCategory._id
                            ); // Send ID
                          }
                        }}
                        className="w-full"
                      />
                    </div>
                    <div className="flex flex-col">
                      <label htmlFor="" className="mb-1">
                        Diamond Weight
                      </label>
                      <Input
                        placeholder="4.5"
                        value={formData.diamondWeight || ""}
                        onChange={(e) =>
                          handleInputChange &&
                          handleInputChange("diamondWeight", e.target.value)
                        }
                        className="outline-none focus:outline-none w-full"
                      />
                    </div>

                    <div className="flex flex-col">
                      <label htmlFor="" className="mb-1">
                        Diamond Price/PC
                      </label>
                      <Input
                        placeholder="150"
                        type="number"
                        value={formData.diamondPricePerPc || ""}
                        onChange={(e) =>
                          handleInputChange &&
                          handleInputChange(
                            "diamondPricePerPc",
                            e.target.value
                          )
                        }
                        className="outline-none focus:outline-none w-full"
                      />
                    </div>
                    <div className="flex flex-col">
                      <label htmlFor="" className="mb-1">
                        Diamond Value
                      </label>
                      <Input
                        placeholder="Auto-generate"
                        type="number"
                        value={formData.diamondValue || ""}
                        className="outline-none focus:outline-none w-full bg-gray-100"
                      // readOnly
                      />
                    </div>
                    <div className="flex flex-col">
                      <label htmlFor="" className="mb-1">
                        Gold Weight{" "}
                        <span className="text-[12px] text-gray-500">
                          (grams)
                        </span>
                      </label>
                      <Input
                        placeholder="eg: 50gms"
                        value={formData.goldWeight || ""}
                        onChange={(e) =>
                          handleInputChange &&
                          handleInputChange("goldWeight", e.target.value)
                        }
                        className="outline-none focus:outline-none w-full"
                      />
                    </div>
                    <div className="flex flex-col">
                      <label htmlFor="" className="mb-1">
                        Gold Price/PC
                      </label>
                      <Input
                        placeholder="150"
                        type="number"
                        value={formData.goldPricePerPc || ""}
                        onChange={(e) =>
                          handleInputChange &&
                          handleInputChange("goldPricePerPc", e.target.value)
                        }
                        className="outline-none focus:outline-none w-full"
                      />
                    </div>
                    <div className="flex flex-col">
                      <label htmlFor="" className="mb-1">
                        Gold Value
                      </label>
                      <Input
                        placeholder="Auto-generate"
                        type="number"
                        value={formData.goldValue || ""}
                        className="outline-none focus:outline-none w-full bg-gray-100"
                      // readOnly
                      />
                    </div>
                    <div className="flex flex-col">
                      <label htmlFor="" className="mb-1">
                        Length
                      </label>
                      <Input
                        placeholder='eg: 18"'
                        value={formData.length || ""}
                        onChange={(e) =>
                          handleInputChange &&
                          handleInputChange("length", e.target.value)
                        }
                        className="outline-none focus:outline-none w-full"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex flex-col">
                      <label htmlFor="" className="mb-1">
                        MM
                      </label>
                      <Input
                        placeholder="eg: 8mm"
                        value={formData.mm || ""}
                        onChange={(e) =>
                          handleInputChange &&
                          handleInputChange("mm", e.target.value)
                        }
                        className="outline-none focus:outline-none w-full"
                      />
                    </div>
                    <div className="flex flex-col">
                      <label htmlFor="" className="mb-1">
                        Size
                      </label>
                      <Input
                        placeholder="eg: 7"
                        value={formData.size || ""}
                        onChange={(e) =>
                          handleInputChange &&
                          handleInputChange("size", e.target.value)
                        }
                        className="outline-none focus:outline-none w-full"
                      />
                    </div>

                    <div className="flex flex-col w-full">
                      <label className="mb-1">Date of Delivery</label>
                      <DatePicker
                        value={formData.dateOfDelivery || ""}
                        onChange={(e) =>
                          handleInputChange &&
                          handleInputChange("dateOfDelivery", e.target.value)
                        }
                        type="date"
                        className="w-full"
                      />
                    </div>

                    <div className="flex flex-col">
                      <label htmlFor="" className="mb-1">
                        Quantity
                      </label>
                      <Input
                        placeholder="eg: 5"
                        type="number"
                        value={formData.quantity || ""}
                        onChange={(e) =>
                          handleInputChange &&
                          handleInputChange("quantity", e.target.value)
                        }
                        className="outline-none focus:outline-none w-full"
                      />
                    </div>
                    <div className="flex flex-col">
                      <label htmlFor="" className="mb-1">
                        Cost Price
                      </label>
                      <Input
                        placeholder="1000"
                        type="number"
                        value={formData.costPrice || ""}
                        onChange={(e) =>
                          handleInputChange &&
                          handleInputChange("costPrice", e.target.value)
                        }
                        className="outline-none focus:outline-none w-full"
                      />
                    </div>
                    <div className="flex flex-col">
                      <label htmlFor="" className="mb-1">
                        Service Charge
                      </label>
                      <Input
                        placeholder="eg: 150"
                        type="number"
                        value={formData.serviceCharge || ""}
                        onChange={(e) =>
                          handleInputChange &&
                          handleInputChange("serviceCharge", e.target.value)
                        }
                        className="outline-none focus:outline-none w-full"
                      />
                    </div>

                    <div className="flex flex-col">
                      <label htmlFor="" className="mb-1">
                        Gross Price
                      </label>
                      <Input
                        placeholder="Auto-generate"
                        type="number"
                        value={formData.grossPrice || ""}
                        className="outline-none focus:outline-none w-full bg-gray-100"
                      // readOnly
                      />
                    </div>
                    <div className="flex flex-col">
                      <label htmlFor="" className="mb-1">
                        Remarks
                      </label>
                      <textarea
                        placeholder="Add any additional comments.."
                        rows={4}
                        value={formData.remarks || ""}
                        onChange={(e) =>
                          handleInputChange &&
                          handleInputChange("remarks", e.target.value)
                        }
                        className="Poppins-font font-medium w-full px-4 py-2 border border-gray-300 rounded-md text-sm !focus:outline-none outline-none resize-none"
                      ></textarea>
                    </div>

                    <div className="flex justify-end gap-4 Poppins-font font-medium !mt-12">
                      <Button
                        onClick={() => setIsEditing && setIsEditing(false)}
                        text="Cancel"
                        className="px-6 bg-gray-500 border-none text-white"
                      />
                      <Button
                        type="submit"
                        text={loading ? "Updating..." : "Update"}
                        disabled={loading}
                        className="px-6 !bg-[#056BB7] border-none text-white"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </>
    )
  }

  {/* Purchase Order Detail Modal */ }
  {
    showPurchaseOrderDetailModal && currentPurchaseOrderData && (
      <>
        <div
          className="fixed inset-0 flex items-center justify-center bg-black/20 z-50"
          onClick={() =>
            setShowPurchaseOrderDetailModal &&
            setShowPurchaseOrderDetailModal(null)
          }
        >
          <div
            className="animate-scaleIn bg-white rounded-xl shadow-md p-6 md:p-10 w-4xl max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl md:text-2xl font-semibold text-[#0873CD] Source-Sans-Pro-font">
                Purchase Order Detail
                {modalLoading && (
                  <span className="ml-2 text-sm text-gray-500">
                    Loading...
                  </span>
                )}
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
                  <p className="font-medium">Purchase Order ID:</p>
                  <p className="text-[#5D6679] text-right">
                    {currentPurchaseOrderData?.purchaseOrderId}
                  </p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="font-medium">Supplier Company Name:</p>
                  <p className="text-[#5D6679] text-right">
                    {
                      currentPurchaseOrderData?.supplierCompanyName
                        ?.companyName
                    }
                  </p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="font-medium">Category:</p>
                  <p className="text-[#5D6679]">
                    {currentPurchaseOrderData?.category?.name}
                  </p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="font-medium">Sub Category:</p>
                  <p className="text-[#5D6679]">
                    {currentPurchaseOrderData?.subCategory?.name}
                  </p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="font-medium">Product Details:</p>
                  <p className="text-[#5D6679]">
                    {currentPurchaseOrderData?.productDetails}
                  </p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="font-medium">Gold Category:</p>
                  <p className="text-[#5D6679]">
                    {currentPurchaseOrderData?.goldCategory?.name}
                  </p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="font-medium">Diamond Weight:</p>
                  <p className="text-[#5D6679]">
                    {currentPurchaseOrderData?.diamondWeight}
                  </p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="font-medium">Gold Weight:</p>
                  <p className="text-[#5D6679]">
                    {currentPurchaseOrderData?.goldWeight}
                  </p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="font-medium">Length:</p>
                  <p className="text-[#5D6679]">
                    {currentPurchaseOrderData?.length}
                  </p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="font-medium">MM:</p>
                  <p className="text-[#5D6679]">
                    {currentPurchaseOrderData?.mm}
                  </p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="font-medium">Size:</p>
                  <p className="text-[#5D6679]">
                    {currentPurchaseOrderData?.size}
                  </p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <p className="font-medium">Date of Delivery:</p>
                  <p className="text-right">
                    {currentPurchaseOrderData?.dateOfDelivery
                      ? new Date(
                        currentPurchaseOrderData?.dateOfDelivery
                      ).toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="font-medium">Quantity:</p>
                  <p>{currentPurchaseOrderData?.quantity}</p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="font-medium">Diamond Price Per PC:</p>
                  <p>${currentPurchaseOrderData?.diamondPricePerPc}</p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="font-medium">Diamond Value:</p>
                  <p>${currentPurchaseOrderData?.diamondValue}</p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="font-medium">Gold Price Per PC:</p>
                  <p>${currentPurchaseOrderData?.goldPricePerPc}</p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="font-medium">Gold Value:</p>
                  <p>${currentPurchaseOrderData?.goldValue}</p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="font-medium">Cost Price:</p>
                  <p>${currentPurchaseOrderData?.costPrice}</p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="font-medium">Service Charge:</p>
                  <p>${currentPurchaseOrderData?.serviceCharge}</p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="font-medium">Gross Price:</p>
                  <p>${currentPurchaseOrderData?.grossPrice}</p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="font-medium">Total Price:</p>
                  <p className="font-bold text-lg">
                    ${currentPurchaseOrderData?.totalPrice}
                  </p>
                </div>

                {currentPurchaseOrderData?.remarks && (
                  <div className="mt-4">
                    <p className="font-medium">Remarks:</p>
                    <p className="text-[#5D6679] text-sm bg-gray-50 py-3 px-1 rounded">
                      {currentPurchaseOrderData?.remarks}
                    </p>
                  </div>
                )}

                <HorizontalLinearAlternativeLabelStepper />

                <div className="mt-6 flex justify-end items-center">
                  <button
                    className="bg-gray-100 hover:bg-gray-200 text-sm px-4 py-2 rounded-md"
                    onClick={() =>
                      setShowPurchaseOrderDetailModal &&
                      setShowPurchaseOrderDetailModal(null)
                    }
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }

  {
    deleteModal && (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 bg-opacity-40 transition-opacity duration-300"
        onClick={() => setDeleteModal(false)}
      >
        <div
          className="animate-scaleIn bg-white rounded-xl w-full max-w-md relative shadow-lg border-3 border-gray-300"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center py-4 px-6 shadow-[0_2px_2px_0_#00000026]">
            <h2 className="text-xl font-medium">Delete Purchase Order</h2>
            <button
              onClick={() => setDeleteModal(false)}
              className="text-xl font-bold text-gray-500 hover:text-gray-700"
            >
              ×
            </button>
          </div>
          <div className="mt-8 text-start pb-8 px-6 shadow-[0_2px_2px_0_#00000026]">
            <h3 className="text-lg font-semibold mb-1">
              Purchase Order Deleted
            </h3>
            <p className="text-sm text-gray-700">
              The purchase order has been successfully removed
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
    )
  }
    </>
  );
};

export default PurchaseOrderTable;
