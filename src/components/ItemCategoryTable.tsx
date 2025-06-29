import React, { useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { RiEditLine } from "react-icons/ri";
import { GoChevronLeft, GoChevronRight } from "react-icons/go";
import { LuEye } from "react-icons/lu";
import plusIcon from "../assets/plus.svg";

import Input from "./Input";
import Dropdown from "./Dropdown";
import Button from "./Button";
import { useNavigate } from "react-router-dom";
import MultiSelectDropdown from "./MultiSelectDropdown";
import { RxCross2 } from "react-icons/rx";
import type { UploadFile, UploadProps } from "antd";
import { message, Upload, Image } from "antd";
import {
  CameraOutlined,
  DeleteOutlined,
  InboxOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { toast } from "react-toastify";


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

interface ItemCategoryTableProps {
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
  allItem?: boolean;
  canUpdate?: boolean;
  canDelete?: boolean;
}

const ItemCategoryTable: React.FC<ItemCategoryTableProps> = ({
  allItem,
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
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedUser, setSelectedUser] = useState<any>(null); // for modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [search, setSearch] = useState(""); // ✅ Local search state
  const [statusFilter, setStatusFilter] = useState("All"); // ✅ Status filter state
  // To these two state variables edit user
  const [isEditing, setIsEditing] = useState(false);
  const [editingRow, setEditingRow] = useState<any>(null);
  const [formData, setFormData] = useState<any>(null);
  const [selectedZones, setSelectedZones] = useState<string[]>([]);
  const [password, setPassword] = useState<string>("");
  const [image, setImage] = useState<UploadFile | null>(null);
  const [status, setStatus] = useState<"success" | "error" | null>(null);

  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_BASE_URL || "http://192.168.100.18:9000";


  // Function to generate a random password
  const generatePassword = () => {
    const length = 12; // Define password length
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
    action: "https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload", // replace with real API
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

  const { Dragger } = Upload;
  const props: UploadProps = {
    name: "file",
    multiple: true,
    action: "https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload",
    onChange(info) {
      const { status } = info.file;
      if (status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (status === "done") {
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },
  };

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
        className={`bg-white rounded-xl p-4 flex flex-col gap-5 overflow-hidden shadow-md ${className}`}
      >
        <div className="flex justify-between w-full">
          <p className="text-[#056BB7] font-semibold text-[24px]">
            {tableTitle}
          </p>
          {allItem && (
            <Button
              text="Add Item (Category)"
              variant="border"
              className="bg-[#28A745] text-white px-4 border-none"
              onClick={() =>
                navigate("/dashboard/core-settings/add-item-category")
              }
            />
          )}
        </div>

        {/* Search + Filter */}
        {allItem && (
          <>
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
                    placeholder="Search by Name, Category"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="max-w-full sm:max-w-2xl !rounded-3xl outline-none !border text-[12px] sm:text-[13px] w-full md:w-60 sm:w-52"
                  />
                )}

                <Dropdown
                  options={["All", "Active", "Inactive"]}
                  DropDownName="Category"
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
          </>
        )}

        {/* Table */}
        <div className="bg-white rounded-xl border border-gray-300 ">
          <div className="overflow-x-auto">
          </div>

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
          onClick={() => setShowDeleteModal(false)}
        >
          <div
            className="animate-scaleIn bg-white rounded-xl w-full max-w-md relative shadow-lg border-3 border-gray-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center py-4 px-6 shadow-[0_2px_2px_0_#00000026]">
              <h2 className="text-xl font-medium">Delete Item</h2>
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
                Are you sure you want to delete this item?
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
                  if (onDelete && selectedUser) {
                    onDelete(selectedUser); // ✅ This line was commented out
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

      {isEditing && (
        <>
          <div
            className="fixed inset-0 flex items-center justify-center bg-black/20 z-50"
            onClick={() => setIsEditing(false)}
          >
            <div
              className="animate-scaleIn bg-white w-[90vw] overflow-hidden sm:w-lg md:w-[80vw] lg:w-4xl h-[70vh] overflow-y-auto rounded-[7px] shadow-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <p className="Source-Sans-Pro-font p-4 text-[#056BB7] font-semibold text-[20px] sm:text-[24px] m-0 sticky top-0 bg-white shadow-sm z-40">
                Edit Item
              </p>

              <form
                className="mt-2 text-[15px] Poppins-font font-medium w-full p-4"
                onSubmit={(e) => {
                  e.preventDefault(); // ✅ Prevents reload
                  console.log("Form submitted"); // Add your save logic here
                }}
              >
                <div className="">
                  {/* Top Side */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-16 xl:gap-16 text-[15px] Poppins-font font-medium">
                    <div className="flex flex-col">
                      <label htmlFor="" className="mb-1">
                        Deal By
                      </label>
                      <Dropdown
                        defaultValue="By Piece"
                        options={["By Piece", "By Weight"]}
                        className="w-full"
                      />
                    </div>
                    <div className="flex flex-col">
                      <label htmlFor="" className="mb-1">
                        Material
                      </label>
                      <Dropdown
                        defaultValue="Diamond"
                        options={["Diamond", "Gold"]}
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>

                <div className="">
                  {/* Top Side */}
                  <p className="mt-8 Source-Sans-Pro-font text-[#056BB7] font-semibold text-[24px] m-0">
                    Add Item
                  </p>
                  <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-16 xl:gap-16 text-[15px] Poppins-font font-medium">
                    {/* Left Side */}
                    <div className="space-y-4">
                      <div className="flex flex-col">
                        <label htmlFor="" className="mb-1">
                          SKU
                        </label>
                        <div className="flex items-center gap-3 w-full">
                          <Dropdown
                            defaultValue="Prefix"
                            options={["Admin", "Manager", "User"]}
                            className="w-full"
                          />
                          <span>-</span>
                          <input
                            type="text"
                            id="sku"
                            placeholder="Auto Generate"
                            className="w-full px-4 py-2 text-sm text-gray-700 placeholder-gray-400 border border-gray-300 outline-none rounded-md"
                          />
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <label htmlFor="" className="mb-1">
                          Supplier Company Name
                        </label>
                        <Dropdown
                          defaultValue="Royal"
                          options={[
                            "Golden Aura",
                            "Pure Aurum",
                            "Gilded Touch",
                            "Carat & Co.",
                            "Whitefire Diamonds",
                            "Luxe Adamas",
                          ]}
                          className="w-full"
                        />
                      </div>

                      <div className="flex flex-col">
                        <div className="flex gap-2">
                          <label htmlFor="" className="mb-1">
                            Category
                          </label>
                          <img
                            src={plusIcon}
                            alt=""
                            width={16}
                            className="mb-1"
                          />
                        </div>
                        <Dropdown
                          defaultValue="Chain"
                          options={["Admin", "Manager", "User"]}
                          className="w-full"
                        />
                      </div>
                      <div className="flex flex-col">
                        <div className="flex gap-2">
                          <label htmlFor="" className="mb-1">
                            Style
                          </label>
                          <img
                            src={plusIcon}
                            alt=""
                            width={16}
                            className="mb-1"
                          />
                        </div>
                        <Dropdown
                          defaultValue="Cuban"
                          options={["Admin", "Manager", "User"]}
                          className="w-full"
                        />
                      </div>

                      <div className="flex flex-col">
                        <label htmlFor="" className="mb-1">
                          Diamond Weight
                        </label>
                        <Dropdown
                          defaultValue="4.5 CWT"
                          options={["Admin", "Manager", "User"]}
                          className="w-full"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label htmlFor="" className="mb-1">
                          Length
                        </label>
                        <Input
                          placeholder="eg: 18"
                          className="outline-none focus:outline-none w-full"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label htmlFor="" className="mb-1">
                          Size
                        </label>
                        <Input
                          placeholder="eg: 7"
                          className="outline-none focus:outline-none w-full"
                        />
                      </div>

                      <div className="flex flex-col">
                        <div className="flex gap-2">
                          <label htmlFor="" className="mb-1">
                            Search Tag
                          </label>
                          <img
                            src={plusIcon}
                            alt=""
                            width={16}
                            className="mb-1"
                          />
                        </div>

                        <MultiSelectDropdown
                          options={["Cuban", "Chain"]}
                          defaultValues={selectedZones}
                          onSelect={(selected) => setSelectedZones(selected)}
                        />
                      </div>

                      {selectedZones.length > 0 && (
                        <div className="flex gap-2 flex-wrap">
                          {selectedZones.map((role, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-2 px-4 py-1 rounded-full bg-[#76767633] text-sm text-[#626262]"
                            >
                              <span>{role}</span>
                              <button
                                onClick={() =>
                                  setSelectedZones(
                                    selectedZones.filter((r) => r !== role)
                                  )
                                }
                                className="flex items-center justify-center w-4 h-4 rounded-full bg-[#626262]"
                              >
                                <RxCross2 size={11} color="white" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Right Side */}
                    <div className="space-y-4">
                      <div className="flex flex-col w-full">
                        <label
                          htmlFor="password"
                          className="mb-1 font-semibold text-sm"
                        >
                          Barcode
                        </label>
                        <div className="flex w-full items-center border border-gray-300 rounded-md overflow-hidden p-1">
                          <input
                            type="text"
                            id="Barcode"
                            placeholder="ag: 23923"
                            value={password}
                            className="w-full px-4 py-2 text-sm text-gray-700 placeholder-gray-400 border-none outline-none"
                          />
                          <Button
                            onClick={generatePassword}
                            className="bg-[#28A745] text-white text-sm font-semibold px-4 py-2 hover:bg-green-600 transition-colors !border-none"
                            text="Generate"
                          />
                        </div>
                      </div>

                      <div className="flex flex-col">
                        <label htmlFor="" className="mb-1">
                          Product Name
                        </label>
                        <Input
                          placeholder="Enchanted Locket"
                          className="outline-none focus:outline-none w-full"
                        />
                      </div>

                      <div className="flex flex-col">
                        <label htmlFor="" className="mb-1">
                          Sub Category
                        </label>
                        <Dropdown
                          defaultValue="Men"
                          options={["Men", "Women", "Child"]}
                          className="w-full"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label htmlFor="" className="mb-1">
                          Gold Category
                        </label>
                        <Dropdown
                          defaultValue="10k"
                          options={["Men", "Women", "Child"]}
                          className="w-full"
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
                          placeholder="eg: 150gms"
                          className="outline-none focus:outline-none w-full"
                        />
                      </div>

                      <div className="flex flex-col">
                        <label htmlFor="" className="mb-1">
                          MM
                        </label>
                        <Dropdown
                          defaultValue="eg: 8mm"
                          options={["Men", "Women", "Child"]}
                          className="w-full"
                        />
                      </div>

                      <div className="w-full max-w-md">
                        <label className="block mb-2 font-medium text-gray-700 w-full">
                          Featured image
                        </label>

                        <Dragger
                          {...featuredProps}
                          className="w-full"
                          height={40}
                        >
                          <div className="rounded-lg flex items-center justify-between cursor-pointe transition !w-full -mt-2">
                            <span className="text-gray-500">
                              {image ? image.name : "No file chosen"}
                            </span>
                            <CameraOutlined className="text-xl text-gray-400" />
                          </div>
                        </Dragger>

                        {image && (
                          <div className="mt-4 flex items-start justify-between gap-4">
                            <Image
                              width={100}
                              height={100}
                              className=" border border-gray-300"
                              src={
                                image.thumbUrl ||
                                image.url ||
                                (image.originFileObj
                                  ? URL.createObjectURL(image.originFileObj)
                                  : "")
                              }
                              alt={image.name}
                              style={{
                                objectFit: "cover",
                                borderRadius: "8px",
                              }}
                            />
                            <div className="flex items-center gap-2">
                              <p
                                className={`font-medium ${
                                  status === "success"
                                    ? "text-green-600"
                                    : status === "error"
                                    ? "text-red-600"
                                    : "text-gray-500"
                                }`}
                              >
                                Status: {status}
                              </p>
                              <DeleteOutlined
                                onClick={handleRemove}
                                className="text-red-500 text-lg cursor-pointer hover:text-red-700"
                              />
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col">
                        <label htmlFor="" className="mb-1">
                          Upload Multiple Gallery Image
                        </label>
                        <Dragger
                          {...props}
                          className="mb-1 w-[320px]"
                          height={170}
                        >
                          <p className="ant-upload-drag-icon ">
                            <InboxOutlined />
                          </p>
                          <p className="ant-upload-text ">
                            Drag and Drop a file here
                          </p>
                          <p className="ant-upload-hint !text-[#1A8CE0]">
                            or Browse a Images
                          </p>
                        </Dragger>
                      </div>

                      <div className="flex justify-end gap-4  Poppins-font font-medium mt-3">
                        <Button
                          text="Back"
                          className="px-6 !bg-[#F4F4F5] !border-none "
                        />
                        <Button
                          text="Save"
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
      )}

      {deleteModal && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black/20 z-50"
          onClick={() => setDeleteModal(false)}
        >
          <div
            className="animate-scaleIn bg-white rounded-xl w-full max-w-md relative shadow-lg border-3 border-gray-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center py-4 px-6 shadow-[0_2px_2px_0_#00000026]">
              <h2 className="text-xl font-medium">Delete Item</h2>
              <button
                onClick={() => setDeleteModal(false)}
                className="text-xl font-bold text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
            {/* Body */}
            <div className="mt-8 text-start pb-8 px-6 shadow-[0_2px_2px_0_#00000026]">
              <h3 className="text-lg font-semibold mb-1">Delete Item?</h3>
              <p className="text-sm text-gray-700">The item has been removed</p>
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

export default ItemCategoryTable;
