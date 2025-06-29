// import React, { useState } from "react";
// import { AiOutlineDelete } from "react-icons/ai";
// import { RiEditLine } from "react-icons/ri";
// import { GoChevronLeft, GoChevronRight } from "react-icons/go";
// import { LuEye } from "react-icons/lu";
// import plusIcon from "../assets/plus.svg";

// import Input from "./Input";
// import Dropdown from "./Dropdown";
// import Button from "./Button";
// import { useNavigate } from "react-router-dom";
// import MultiSelectDropdown from "./MultiSelectDropdown";
// import { RxCross2 } from "react-icons/rx";
// import type { UploadFile, UploadProps } from "antd";
// import { message, Upload, Image } from "antd";
// import {
//   CameraOutlined,
//   DeleteOutlined,
//   InboxOutlined,
// } from "@ant-design/icons";
// import axios from "axios";
// import { toast } from "react-toastify";

// // Helper function to get auth token
// const getAuthToken = () => {
//   let token = localStorage.getItem("token");
//   if (!token) {
//     token = sessionStorage.getItem("token");
//   }
//   return token;
// };

// type ColumnType = "text" | "image" | "status" | "actions" | "button" | "custom";

// interface Column {
//   header: string;
//   accessor: string;
//   type?: ColumnType;
// }

// export interface User {
//   id: string;
//   name: string;
//   role: string;
//   status: string;
//   userImage?: string;
//   [key: string]: any;
// }

// interface ItemCategoryTableProps {
//   columns: Column[];
//   data: any[];
//   tableTitle?: string;
//   rowsPerPageOptions?: number[];
//   defaultRowsPerPage?: number;
//   searchable?: boolean;
//   filterByStatus?: boolean;
//   onEdit?: (row: any) => void;
//   onDelete?: (row: any) => void;
//   tableDataAlignment?: "zone" | "user" | "center"; // Add more if needed
//   className?: string;
//   onRowClick?: (row: any) => void;
//   dealBy?: boolean;
//   enableRowModal?: boolean;
//   eye?: boolean;
//   allItem?: boolean;
//   canUpdate?: boolean;
//   canDelete?: boolean;
// }

// const ItemCategoryTable: React.FC<ItemCategoryTableProps> = ({
//   allItem,
//   eye,
//   enableRowModal = true,
//   onRowClick,
//   className,
//   columns,
//   data,
//   tableTitle,
//   rowsPerPageOptions = [5, 10, 15],
//   defaultRowsPerPage = 5,
//   searchable = true,
//   filterByStatus = true,
//   onEdit,
//   onDelete,
//   tableDataAlignment = "start", // default
//   dealBy,
//   canUpdate = true,
//   canDelete = true,
// }) => {
//   const [currentPage, setCurrentPage] = useState(1);
//   const [rowsPerPage, setRowsPerPage] = useState(10);
//   const [selectedUser, setSelectedUser] = useState<any>(null); // for modal
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [deleteModal, setDeleteModal] = useState(false);
//   const [search, setSearch] = useState(""); // ✅ Local search state
//   const [statusFilter, setStatusFilter] = useState("All"); // ✅ Status filter state
//   // To these two state variables edit user
//   const [isEditing, setIsEditing] = useState(false);
//   const [editingRow, setEditingRow] = useState<any>(null);
//   const [formData, setFormData] = useState<any>(null);
//   const [selectedZones, setSelectedZones] = useState<string[]>([]);
//   const [password, setPassword] = useState<string>("");
//   const [image, setImage] = useState<UploadFile | null>(null);
//   const [status, setStatus] = useState<"success" | "error" | null>(null);

//   const navigate = useNavigate();
//   const API_URL = import.meta.env.VITE_BASE_URL || "http://192.168.100.18:9000";

//   // Function to navigate to edit page with item ID
//   const handleEditClick = (row: any) => {
//     if (row._id) {
//       navigate(`/dashboard/core-settings/update-item-category/${row._id}`);
//     } else {
//       toast.error("Item ID not found");
//     }
//   };

//   // Function to generate a random password
//   const generatePassword = () => {
//     const length = 12; // Define password length
//     const charset =
//       "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";
//     let generatedPassword = "";

//     for (let i = 0; i < length; i++) {
//       const randomIndex = Math.floor(Math.random() * charset.length);
//       generatedPassword += charset[randomIndex];
//     }

//     setPassword(generatedPassword);
//   };

//   const featuredProps: UploadProps = {
//     name: "file",
//     action: "https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload", // replace with real API
//     showUploadList: false,
//     maxCount: 1,
//     onChange(info) {
//       const file = info.file;
//       console.log("file", file);

//       if (file.status === "done") {
//         message.success(`${file.name} uploaded successfully`);
//         setImage(file);
//         setStatus("success");
//       } else if (file.status === "error") {
//         message.error(`${file.name} upload failed`);
//         setImage(file);
//         setStatus("error");
//       }
//     },
//   };

//   const handleRemove = () => {
//     setImage(null);
//     setStatus(null);
//   };

//   const { Dragger } = Upload;
//   const props: UploadProps = {
//     name: "file",
//     multiple: true,
//     action: "https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload",
//     onChange(info) {
//       const { status } = info.file;
//       if (status !== "uploading") {
//         console.log(info.file, info.fileList);
//       }
//       if (status === "done") {
//         message.success(`${info.file.name} file uploaded successfully.`);
//       } else if (status === "error") {
//         message.error(`${info.file.name} file upload failed.`);
//       }
//     },
//     onDrop(e) {
//       console.log("Dropped files", e.dataTransfer.files);
//     },
//   };

//   const filteredData = data.filter((item) => {
//     const matchesSearch = Object.values(item)
//       .join(" ")
//       .toLowerCase()
//       .includes(search.toLowerCase());
//     const matchesStatus =
//       statusFilter === "All" || item.status === statusFilter;
//     return matchesSearch && matchesStatus;
//   });

//   const totalPages = Math.ceil(filteredData.length / rowsPerPage);
//   const currentData = filteredData.slice(
//     (currentPage - 1) * rowsPerPage,
//     currentPage * rowsPerPage
//   );

//   const handleChangePage = (page: number) => {
//     if (page >= 1 && page <= totalPages) setCurrentPage(page);
//   };

//   return (
//     <>
//       <div
//         className={`bg-white rounded-xl p-4 flex flex-col gap-5 shadow-md ${className}`}
//       >
//         <div className="flex justify-between w-full">
//           <p className="text-[#056BB7] font-semibold text-[24px]">
//             {tableTitle}
//           </p>
//           {allItem && (
//             <Button
//               text="Add Item (Category)"
//               variant="border"
//               className="bg-[#28A745] text-white px-4 border-none"
//               onClick={() =>
//                 navigate("/dashboard/core-settings/add-item-category")
//               }
//             />
//           )}
//         </div>

//         {/* Search + Filter */}
//         {allItem && (
//           <>
//             <div
//               className={`grid gap-4 items-center justify-between md:grid-cols-2 ${
//                 data.some((item) => item.hasOwnProperty("status"))
//                   ? ""
//                   : "grid-cols-2"
//               }`}
//             >
//               <div className="flex gap-3">
//                 {searchable && (
//                   <Input
//                     placeholder="Search by Name, Category"
//                     value={search}
//                     onChange={(e) => setSearch(e.target.value)}
//                     className="max-w-full sm:max-w-2xl !rounded-3xl outline-none !border text-[12px] sm:text-[13px] w-full md:w-60 sm:w-52"
//                   />
//                 )}

//                 <Dropdown
//                   options={["All", "Active", "Inactive"]}
//                   DropDownName="Category"
//                   defaultValue="All"
//                   onSelect={(val) => {
//                     setStatusFilter(val);
//                     setCurrentPage(1);
//                   }}
//                 />
//               </div>
//               <div
//                 className={`flex md:justify-end ${
//                   data.some((item) => item.hasOwnProperty("status"))
//                     ? "justify-start"
//                     : "justify-end"
//                 }`}
//               >
//                 <Button
//                   text="Export"
//                   variant="border"
//                   className="bg-[#5D6679] text-white w-24"
//                 />
//               </div>
//             </div>
//           </>
//         )}

//         {/* Table */}
//         <div className="bg-white rounded-xl border border-gray-300 ">
//           <div className="overflow-x-auto">
//             <table className="w-full text-sm text-left text-gray-700 ">
//               <thead className="bg-[#F9FAFB] text-black">
//                 <tr className="font-semibold text-[16px] whitespace-nowrap w-full">
//                   {columns.map((col, index) => {
//                     const isFirst = index === 0;
//                     const isLast = index === columns.length - 1;

//                     return (
//                       <th
//                         key={col.accessor}
//                         className="px-6 py-3"
//                         style={{ width: "max-content" }}
//                       >
//                         <div
//                           className={`flex flex-row items-center ${
//                             isFirst
//                               ? "justify-start"
//                               : isLast
//                               ? "justify-end"
//                               : tableDataAlignment === "zone"
//                               ? "justify-center"
//                               : "justify-start"
//                           }`}
//                         >
//                           {col.header}
//                         </div>
//                       </th>
//                     );
//                   })}
//                 </tr>
//               </thead>
//               <tbody className="border-b border-gray-400">
//                 {currentData.map((row: any, idx: any) => (
//                   <tr
//                     key={idx}
//                     className="hover:bg-gray-50 whitespace-nowrap cursor-pointer"
//                   >
//                     {columns.map((col, index) => {
//                       const isFirst = index === 0;
//                       const isLast = index === columns.length - 1;

//                       return (
//                         <td
//                           key={col.accessor}
//                           className="px-6 py-2"
//                           style={{ width: "max-content" }}
//                         >
//                           <div
//                             className={`flex flex-row items-center ${
//                               isFirst
//                                 ? "justify-start"
//                                 : isLast
//                                 ? "justify-end"
//                                 : tableDataAlignment === "zone"
//                                 ? "justify-center"
//                                 : "justify-start"
//                             }`}
//                           >
//                             {(() => {
//                               switch (col.type) {
//                                 case "image":
//                                   return (
//                                     <div className="flex gap-2 items-center">
//                                       {row.categoryImage ? (
//                                         <>
//                                           <img
//                                             src={`${row.categoryImage}`}
//                                             alt="Item"
//                                             className="w-8 h-8 rounded-full"
//                                           />
//                                           {row.name}
//                                         </>
//                                       ) : (
//                                         <>{row.name}</>
//                                       )}
//                                     </div>
//                                   );
//                                 case "status":
//                                   return (
//                                     <span
//                                       className={`inline-block px-2 py-1 text-xs rounded-full ${
//                                         row.status === "Active"
//                                           ? "bg-green-100 text-green-600"
//                                           : "bg-red-100 text-red-600"
//                                       }`}
//                                     >
//                                       {row.status}
//                                     </span>
//                                   );
//                                 case "actions":
//                                   return (
//                                     <div className="flex justify-end gap-2">
//                                       {eye && (
//                                         <LuEye
//                                           className="cursor-pointer"
//                                           onClick={(e) => {
//                                             e.stopPropagation();
//                                             navigate("purchase-order-detail");
//                                           }}
//                                         />
//                                       )}

//                                       <RiEditLine
//                                         className="cursor-pointer"
//                                         onClick={(e) => {
//                                           if (!canUpdate) {
//                                             toast.error(
//                                               "You don't have permission to edit item"
//                                             );
//                                             return;
//                                           }
//                                           e.stopPropagation();
//                                           handleEditClick(row);
//                                         }}
//                                       />

//                                       <AiOutlineDelete
//                                         className="cursor-pointer hover:text-red-500"
//                                         onClick={(e) => {
//                                           e.stopPropagation();
//                                           if (!canDelete) {
//                                             toast.error(
//                                               "You don't have permission to delete item"
//                                             );
//                                             return;
//                                           }
//                                           setSelectedUser(row); // ✅ Make sure this sets the correct row data
//                                           setShowDeleteModal(true);
//                                         }}
//                                       />
//                                     </div>
//                                   );
//                                 default:
//                                   return <>{row[col.accessor]}</>;
//                               }
//                             })()}
//                           </div>
//                         </td>
//                       );
//                     })}
//                   </tr>
//                 ))}
//                 {currentData.length === 0 && (
//                   <tr>
//                     <td
//                       colSpan={columns.length}
//                       className="text-center py-6 text-gray-500"
//                     >
//                       No data found.
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>

//           {/* Pagination */}
//           <div
//             className={`flex flex-col ${
//               dealBy ? "md:flex-col gap-3" : "md:flex-row"
//             } items-center justify-between px-4 py-4`}
//           >
//             <div className="flex items-center justify-center gap-2">
//               <button
//                 onClick={() => handleChangePage(currentPage - 1)}
//                 className="w-10 h-10 rounded-full border border-gray-300 hover:bg-gray-200 flex items-center justify-center"
//                 disabled={currentPage === 1}
//               >
//                 <GoChevronLeft size={18} />
//               </button>

//               {/* Always show page 1 */}
//               <button
//                 onClick={() => handleChangePage(1)}
//                 className={`w-8 h-8 rounded-full text-sm flex items-center justify-center transition ${
//                   currentPage === 1
//                     ? "bg-[#407BFF] text-white"
//                     : "bg-[#E5E7EB] text-black hover:bg-[#407BFF] hover:text-white"
//                 }`}
//               >
//                 1
//               </button>

//               {/* Show dots if current page is far from start */}
//               {currentPage > 3 && (
//                 <div>
//                   <span className="text-gray-500 px-0.5">•</span>
//                   <span className="text-gray-500 px-0.5">•</span>
//                   <span className="text-gray-500 px-0.5">•</span>
//                 </div>
//               )}

//               {/* Show current page and surrounding pages (but not 1 or last page) */}
//               {[currentPage - 1, currentPage, currentPage + 1]
//                 .filter((page) => page > 1 && page < totalPages && page >= 1)
//                 .map((num) => (
//                   <button
//                     key={num}
//                     onClick={() => handleChangePage(num)}
//                     className={`w-8 h-8 rounded-full text-sm flex items-center justify-center transition ${
//                       currentPage === num
//                         ? "bg-[#407BFF] text-white"
//                         : "bg-[#E5E7EB] text-black hover:bg-[#407BFF] hover:text-white"
//                     }`}
//                   >
//                     {num}
//                   </button>
//                 ))}

//               {/* Show dots if current page is far from end */}
//               {currentPage < totalPages - 2 && totalPages > 1 && (
//                 <div>
//                   <span className="text-gray-500 px-0.5">•</span>
//                   <span className="text-gray-500 px-0.5">•</span>
//                   <span className="text-gray-500 px-0.5">•</span>
//                 </div>
//               )}

//               {/* Always show last page (if more than 1 page) */}
//               {totalPages > 1 && (
//                 <button
//                   onClick={() => handleChangePage(totalPages)}
//                   className={`w-8 h-8 rounded-full text-sm flex items-center justify-center transition ${
//                     currentPage === totalPages
//                       ? "bg-[#407BFF] text-white"
//                       : "bg-[#E5E7EB] text-black hover:bg-[#407BFF] hover:text-white"
//                   }`}
//                 >
//                   {totalPages}
//                 </button>
//               )}

//               <button
//                 onClick={() => handleChangePage(currentPage + 1)}
//                 className="w-10 h-10 rounded-full border border-gray-300 hover:bg-gray-200 flex items-center justify-center"
//                 disabled={currentPage === totalPages}
//               >
//                 <GoChevronRight size={18} />
//               </button>
//             </div>

//             <div className="flex items-center gap-2 mt-2 md:mt-0">
//               <span className="text-sm">Show:</span>
//               <Dropdown
//                 options={["10 Row", "15 Row", "20 Row", "25 Row", "All"]}
//                 defaultValue="10 Row"
//                 onSelect={(val) => {
//                   if (val === "All") {
//                     setRowsPerPage(filteredData.length || data.length);
//                   } else {
//                     const selected = Number.parseInt(val.split(" ")[0]);
//                     setRowsPerPage(selected);
//                   }
//                   setCurrentPage(1);
//                 }}
//                 className="bg-black text-white rounded px-2 py-1 min-w-[90px]"
//               />
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Modal */}
//       {/* {selectedUser && (
//         <div
//           className="fixed inset-0 z-50 flex items-center justify-center bg-transparent backdrop-blur-xs bg-opacity-40 transition-opacity duration-300"
//           onClick={() => setSelectedUser(null)}
//         >
//           <div
//             className="animate-scaleIn bg-white rounded-xl p-6 w-full max-w-sm mx-auto relative shadow-md transition-opacity duration-300"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <div className="flex justify-between items-center">
//               <h2 className="text-lg font-semibold">Detail Data</h2>
//               <button
//                 onClick={() => setSelectedUser(null)}
//                 className="text-xl font-bold text-gray-500 hover:text-gray-700"
//               >
//                 ×
//               </button>
//             </div>
//             <div className="text-center">
//               <div className="mt-3 w-full flex">
//                 <span
//                   className={`text-sm px-3 py-1 rounded-md ml-auto ${
//                     selectedUser.status === "Active"
//                       ? "text-[#10A760] bg-[#34C75933]"
//                       : "text-red-600 bg-red-100"
//                   }`}
//                 >
//                   {selectedUser.status}
//                 </span>
//               </div>
//               <img
//                 src={selectedUser.userImage}
//                 alt={selectedUser.name}
//                 className="w-36 h-36 mx-auto rounded-full object-cover"
//               />
//               <div className="my-5">
//                 <span className="text-sm text-black bg-[#12121226] px-3 py-2 rounded-full">
//                   {selectedUser.role}
//                 </span>
//               </div>
//               <h3 className="text-xl font-bold mt-1">
//                 {selectedUser.name} ({selectedUser.id})
//               </h3>
//               <div className="mt-2 text-black text-sm font-bold">
//                 290/UKM_IK/XXVII/2025
//               </div>
//               <div className="flex justify-center gap-6 text-[#71717A] mt-2">
//                 <p>John Doe@gmail.com</p>
//                 <p>081312144546 </p>
//               </div>
//               <p className="text-[#71717A] italic">
//                 1234 Maple Street Springfield, IL 62704
//               </p>

//               <div className="flex justify-center gap-6 mt-6 Poppins-font font-medium">
//                 <p className="text-[#4E4FEB]">
//                   Zone: <span className="text-black">Zone 1</span>
//                 </p>
//                 <p className="text-[#4E4FEB]">
//                   Shop: <span className="text-black">Soho S parkle</span>
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>
//       )} */}

//       {showDeleteModal && canDelete && (
//         <div
//           className="fixed inset-0 flex items-center justify-center bg-black/20 z-50"
//           onClick={() => setShowDeleteModal(false)}
//         >
//           <div
//             className="animate-scaleIn bg-white rounded-xl w-full max-w-md relative shadow-lg border-3 border-gray-300"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <div className="flex justify-between items-center py-4 px-6 shadow-[0_2px_2px_0_#00000026]">
//               <h2 className="text-xl font-medium">Delete Item</h2>
//               <button
//                 onClick={() => setShowDeleteModal(false)}
//                 className="text-xl font-bold text-gray-500 hover:text-gray-700"
//               >
//                 ×
//               </button>
//             </div>
//             <div className="mt-8 text-start pb-8 px-6 shadow-[0_2px_2px_0_#00000026]">
//               <h3 className="text-lg font-semibold mb-1">Delete Item?</h3>
//               <p className="text-sm text-gray-700">
//                 Are you sure you want to delete this item?
//               </p>
//               <p className="text-sm text-red-600 font-medium mt-1">
//                 This action cannot be undone.
//               </p>
//             </div>

//             <div className="flex justify-center gap-2 pb-3 py-4 px-6 shadow-[0_2px_2px_0_#00000026]">
//               <button
//                 onClick={() => setShowDeleteModal(false)}
//                 className="px-5 py-1 rounded-md hover:bg-gray-100 border-none shadow-[inset_0_0_4px_#00000026]"
//               >
//                 Cancel
//               </button>
//               <Button
//                 text="Delete"
//                 icon={<AiOutlineDelete />}
//                 onClick={() => {
//                   if (onDelete && selectedUser) {
//                     onDelete(selectedUser); // ✅ This line was commented out
//                   }
//                   setShowDeleteModal(false);
//                   setDeleteModal(true);
//                 }}
//                 className="!border-none px-5 py-1 bg-[#DC2626] hover:bg-red-700 text-white rounded-md flex items-center gap-1"
//               />
//             </div>
//           </div>
//         </div>
//       )}

//       {isEditing && (
//         <>
//           <div
//             className="fixed inset-0 flex items-center justify-center bg-black/20 z-50"
//             onClick={() => setIsEditing(false)}
//           >
//             <div
//               className="animate-scaleIn bg-white w-[90vw] overflow-hidden sm:w-lg md:w-[80vw] lg:w-4xl h-[70vh] overflow-y-auto rounded-[7px] shadow-lg"
//               onClick={(e) => e.stopPropagation()}
//             >
//               <p className="Source-Sans-Pro-font p-4 text-[#056BB7] font-semibold text-[20px] sm:text-[24px] m-0 sticky top-0 bg-white shadow-sm z-40">
//                 Edit Item
//               </p>

//               <form
//                 className="mt-2 text-[15px] Poppins-font font-medium w-full p-4"
//                 onSubmit={(e) => {
//                   e.preventDefault(); // ✅ Prevents reload
//                   console.log("Form submitted"); // Add your save logic here
//                 }}
//               >
//                 <div className="">
//                   {/* Top Side */}
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-16 xl:gap-16 text-[15px] Poppins-font font-medium">
//                     <div className="flex flex-col">
//                       <label htmlFor="" className="mb-1">
//                         Deal By
//                       </label>
//                       <Dropdown
//                         defaultValue="By Piece"
//                         options={["By Piece", "By Weight"]}
//                         className="w-full"
//                       />
//                     </div>
//                     <div className="flex flex-col">
//                       <label htmlFor="" className="mb-1">
//                         Material
//                       </label>
//                       <Dropdown
//                         defaultValue="Diamond"
//                         options={["Diamond", "Gold"]}
//                         className="w-full"
//                       />
//                     </div>
//                   </div>
//                 </div>

//                 <div className="">
//                   {/* Top Side */}
//                   <p className="mt-8 Source-Sans-Pro-font text-[#056BB7] font-semibold text-[24px] m-0">
//                     Add Item
//                   </p>
//                   <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-16 xl:gap-16 text-[15px] Poppins-font font-medium">
//                     {/* Left Side */}
//                     <div className="space-y-4">
//                       <div className="flex flex-col">
//                         <label htmlFor="" className="mb-1">
//                           SKU
//                         </label>
//                         <div className="flex items-center gap-3 w-full">
//                           <Dropdown
//                             defaultValue="Prefix"
//                             options={["Admin", "Manager", "User"]}
//                             className="w-full"
//                           />
//                           <span>-</span>
//                           <input
//                             type="text"
//                             id="sku"
//                             placeholder="Auto Generate"
//                             className="w-full px-4 py-2 text-sm text-gray-700 placeholder-gray-400 border border-gray-300 outline-none rounded-md"
//                           />
//                         </div>
//                       </div>
//                       <div className="flex flex-col">
//                         <label htmlFor="" className="mb-1">
//                           Supplier Company Name
//                         </label>
//                         <Dropdown
//                           defaultValue="Royal"
//                           options={[
//                             "Golden Aura",
//                             "Pure Aurum",
//                             "Gilded Touch",
//                             "Carat & Co.",
//                             "Whitefire Diamonds",
//                             "Luxe Adamas",
//                           ]}
//                           className="w-full"
//                         />
//                       </div>

//                       <div className="flex flex-col">
//                         <div className="flex gap-2">
//                           <label htmlFor="" className="mb-1">
//                             Category
//                           </label>
//                           <img
//                             src={plusIcon}
//                             alt=""
//                             width={16}
//                             className="mb-1"
//                           />
//                         </div>
//                         <Dropdown
//                           defaultValue="Chain"
//                           options={["Admin", "Manager", "User"]}
//                           className="w-full"
//                         />
//                       </div>
//                       <div className="flex flex-col">
//                         <div className="flex gap-2">
//                           <label htmlFor="" className="mb-1">
//                             Style
//                           </label>
//                           <img
//                             src={plusIcon}
//                             alt=""
//                             width={16}
//                             className="mb-1"
//                           />
//                         </div>
//                         <Dropdown
//                           defaultValue="Cuban"
//                           options={["Admin", "Manager", "User"]}
//                           className="w-full"
//                         />
//                       </div>

//                       <div className="flex flex-col">
//                         <label htmlFor="" className="mb-1">
//                           Diamond Weight
//                         </label>
//                         <Dropdown
//                           defaultValue="4.5 CWT"
//                           options={["Admin", "Manager", "User"]}
//                           className="w-full"
//                         />
//                       </div>
//                       <div className="flex flex-col">
//                         <label htmlFor="" className="mb-1">
//                           Length
//                         </label>
//                         <Input
//                           placeholder="eg: 18"
//                           className="outline-none focus:outline-none w-full"
//                         />
//                       </div>
//                       <div className="flex flex-col">
//                         <label htmlFor="" className="mb-1">
//                           Size
//                         </label>
//                         <Input
//                           placeholder="eg: 7"
//                           className="outline-none focus:outline-none w-full"
//                         />
//                       </div>

//                       <div className="flex flex-col">
//                         <div className="flex gap-2">
//                           <label htmlFor="" className="mb-1">
//                             Search Tag
//                           </label>
//                           <img
//                             src={plusIcon}
//                             alt=""
//                             width={16}
//                             className="mb-1"
//                           />
//                         </div>

//                         <MultiSelectDropdown
//                           options={["Cuban", "Chain"]}
//                           defaultValues={selectedZones}
//                           onSelect={(selected) => setSelectedZones(selected)}
//                         />
//                       </div>

//                       {selectedZones.length > 0 && (
//                         <div className="flex gap-2 flex-wrap">
//                           {selectedZones.map((role, index) => (
//                             <div
//                               key={index}
//                               className="flex items-center gap-2 px-4 py-1 rounded-full bg-[#76767633] text-sm text-[#626262]"
//                             >
//                               <span>{role}</span>
//                               <button
//                                 onClick={() =>
//                                   setSelectedZones(
//                                     selectedZones.filter((r) => r !== role)
//                                   )
//                                 }
//                                 className="flex items-center justify-center w-4 h-4 rounded-full bg-[#626262]"
//                               >
//                                 <RxCross2 size={11} color="white" />
//                               </button>
//                             </div>
//                           ))}
//                         </div>
//                       )}
//                     </div>

//                     {/* Right Side */}
//                     <div className="space-y-4">
//                       <div className="flex flex-col w-full">
//                         <label
//                           htmlFor="password"
//                           className="mb-1 font-semibold text-sm"
//                         >
//                           Barcode
//                         </label>
//                         <div className="flex w-full items-center border border-gray-300 rounded-md overflow-hidden p-1">
//                           <input
//                             type="text"
//                             id="Barcode"
//                             placeholder="ag: 23923"
//                             value={password}
//                             className="w-full px-4 py-2 text-sm text-gray-700 placeholder-gray-400 border-none outline-none"
//                           />
//                           <Button
//                             onClick={generatePassword}
//                             className="bg-[#28A745] text-white text-sm font-semibold px-4 py-2 hover:bg-green-600 transition-colors !border-none"
//                             text="Generate"
//                           />
//                         </div>
//                       </div>

//                       <div className="flex flex-col">
//                         <label htmlFor="" className="mb-1">
//                           Product Name
//                         </label>
//                         <Input
//                           placeholder="Enchanted Locket"
//                           className="outline-none focus:outline-none w-full"
//                         />
//                       </div>

//                       <div className="flex flex-col">
//                         <label htmlFor="" className="mb-1">
//                           Sub Category
//                         </label>
//                         <Dropdown
//                           defaultValue="Men"
//                           options={["Men", "Women", "Child"]}
//                           className="w-full"
//                         />
//                       </div>
//                       <div className="flex flex-col">
//                         <label htmlFor="" className="mb-1">
//                           Gold Category
//                         </label>
//                         <Dropdown
//                           defaultValue="10k"
//                           options={["Men", "Women", "Child"]}
//                           className="w-full"
//                         />
//                       </div>
//                       <div className="flex flex-col">
//                         <label htmlFor="" className="mb-1">
//                           Gold Weight{" "}
//                           <span className="text-[12px] text-gray-500">
//                             (grams)
//                           </span>
//                         </label>
//                         <Input
//                           placeholder="eg: 150gms"
//                           className="outline-none focus:outline-none w-full"
//                         />
//                       </div>

//                       <div className="flex flex-col">
//                         <label htmlFor="" className="mb-1">
//                           MM
//                         </label>
//                         <Dropdown
//                           defaultValue="eg: 8mm"
//                           options={["Men", "Women", "Child"]}
//                           className="w-full"
//                         />
//                       </div>

//                       <div className="w-full max-w-md">
//                         <label className="block mb-2 font-medium text-gray-700 w-full">
//                           Featured image
//                         </label>

//                         <Dragger
//                           {...featuredProps}
//                           className="w-full"
//                           height={40}
//                         >
//                           <div className="rounded-lg flex items-center justify-between cursor-pointe transition !w-full -mt-2">
//                             <span className="text-gray-500">
//                               {image ? image.name : "No file chosen"}
//                             </span>
//                             <CameraOutlined className="text-xl text-gray-400" />
//                           </div>
//                         </Dragger>

//                         {image && (
//                           <div className="mt-4 flex items-start justify-between gap-4">
//                             <Image
//                               width={100}
//                               height={100}
//                               className=" border border-gray-300"
//                               src={
//                                 image.thumbUrl ||
//                                 image.url ||
//                                 (image.originFileObj
//                                   ? URL.createObjectURL(image.originFileObj)
//                                   : "")
//                               }
//                               alt={image.name}
//                               style={{
//                                 objectFit: "cover",
//                                 borderRadius: "8px",
//                               }}
//                             />
//                             <div className="flex items-center gap-2">
//                               <p
//                                 className={`font-medium ${
//                                   status === "success"
//                                     ? "text-green-600"
//                                     : status === "error"
//                                     ? "text-red-600"
//                                     : "text-gray-500"
//                                 }`}
//                               >
//                                 Status: {status}
//                               </p>
//                               <DeleteOutlined
//                                 onClick={handleRemove}
//                                 className="text-red-500 text-lg cursor-pointer hover:text-red-700"
//                               />
//                             </div>
//                           </div>
//                         )}
//                       </div>

//                       <div className="flex flex-col">
//                         <label htmlFor="" className="mb-1">
//                           Upload Multiple Gallery Image
//                         </label>
//                         <Dragger
//                           {...props}
//                           className="mb-1 w-[320px]"
//                           height={170}
//                         >
//                           <p className="ant-upload-drag-icon ">
//                             <InboxOutlined />
//                           </p>
//                           <p className="ant-upload-text ">
//                             Drag and Drop a file here
//                           </p>
//                           <p className="ant-upload-hint !text-[#1A8CE0]">
//                             or Browse a Images
//                           </p>
//                         </Dragger>
//                       </div>

//                       <div className="flex justify-end gap-4  Poppins-font font-medium mt-3">
//                         <Button
//                           text="Back"
//                           className="px-6 !bg-[#F4F4F5] !border-none "
//                         />
//                         <Button
//                           text="Save"
//                           className="px-6 !bg-[#056BB7] border-none text-white"
//                         />
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </form>
//             </div>
//           </div>
//         </>
//       )}

//       {deleteModal && (
//         <div
//           className="fixed inset-0 flex items-center justify-center bg-black/20 z-50"
//           onClick={() => setDeleteModal(false)}
//         >
//           <div
//             className="animate-scaleIn bg-white rounded-xl w-full max-w-md relative shadow-lg border-3 border-gray-300"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <div className="flex justify-between items-center py-4 px-6 shadow-[0_2px_2px_0_#00000026]">
//               <h2 className="text-xl font-medium">Delete Item</h2>
//               <button
//                 onClick={() => setDeleteModal(false)}
//                 className="text-xl font-bold text-gray-500 hover:text-gray-700"
//               >
//                 ×
//               </button>
//             </div>
//             {/* Body */}
//             <div className="mt-8 text-start pb-8 px-6 shadow-[0_2px_2px_0_#00000026]">
//               <h3 className="text-lg font-semibold mb-1">Delete Item?</h3>
//               <p className="text-sm text-gray-700">The item has been removed</p>
//             </div>
//             <div className="flex justify-center gap-2 pb-3 py-4 px-6 shadow-[0_2px_2px_0_#00000026]">
//               <Button
//                 text="Cancel"
//                 onClick={() => setDeleteModal(false)}
//                 className="px-5 py-1 rounded-md hover:bg-gray-100 border-none shadow-[inset_0_0_4px_#00000026]"
//               />
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default ItemCategoryTable;

// import React, { useState } from "react";
// import { AiOutlineDelete } from "react-icons/ai";
// import { RiEditLine } from "react-icons/ri";
// import { GoChevronLeft, GoChevronRight } from "react-icons/go";
// import { LuEye } from "react-icons/lu";
// import plusIcon from "../assets/plus.svg";

// import Input from "./Input";
// import Dropdown from "./Dropdown";
// import Button from "./Button";
// import { useNavigate } from "react-router-dom";
// import MultiSelectDropdown from "./MultiSelectDropdown";
// import { RxCross2 } from "react-icons/rx";
// import type { UploadFile, UploadProps } from "antd";
// import { message, Upload, Image } from "antd";
// import {
//   CameraOutlined,
//   DeleteOutlined,
//   InboxOutlined,
// } from "@ant-design/icons";
// import axios from "axios";
// import { toast } from "react-toastify";

// // Helper function to get auth token
// const getAuthToken = () => {
//   let token = localStorage.getItem("token");
//   if (!token) {
//     token = sessionStorage.getItem("token");
//   }
//   return token;
// };

// type ColumnType = "text" | "image" | "status" | "actions" | "button" | "custom";

// interface Column {
//   header: string;
//   accessor: string;
//   type?: ColumnType;
// }

// export interface User {
//   id: string;
//   name: string;
//   role: string;
//   status: string;
//   userImage?: string;
//   [key: string]: any;
// }

// interface ItemCategoryTableProps {
//   columns: Column[];
//   data: any[];
//   tableTitle?: string;
//   rowsPerPageOptions?: number[];
//   defaultRowsPerPage?: number;
//   searchable?: boolean;
//   filterByStatus?: boolean;
//   onEdit?: (row: any) => void;
//   onDelete?: (row: any) => void;
//   tableDataAlignment?: "zone" | "user" | "center"; // Add more if needed
//   className?: string;
//   onRowClick?: (row: any) => void;
//   dealBy?: boolean;
//   enableRowModal?: boolean;
//   eye?: boolean;
//   allItem?: boolean;
//   canUpdate?: boolean;
//   canDelete?: boolean;
// }

// const ItemCategoryTable: React.FC<ItemCategoryTableProps> = ({
//   allItem,
//   eye,
//   enableRowModal = true,
//   onRowClick,
//   className,
//   columns,
//   data,
//   tableTitle,
//   rowsPerPageOptions = [5, 10, 15],
//   defaultRowsPerPage = 5,
//   searchable = true,
//   filterByStatus = true,
//   onEdit,
//   onDelete,
//   tableDataAlignment = "start", // default
//   dealBy,
//   canUpdate = true,
//   canDelete = true,
// }) => {
//   const [currentPage, setCurrentPage] = useState(1);
//   const [rowsPerPage, setRowsPerPage] = useState(10);
//   const [selectedUser, setSelectedUser] = useState<any>(null); // for modal
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [deleteModal, setDeleteModal] = useState(false);
//   const [search, setSearch] = useState(""); // ✅ Local search state
//   const [statusFilter, setStatusFilter] = useState("All"); // ✅ Status filter state
//   // To these two state variables edit user
//   const [isEditing, setIsEditing] = useState(false);
//   const [editingRow, setEditingRow] = useState<any>(null);
//   const [formData, setFormData] = useState<any>(null);
//   const [selectedZones, setSelectedZones] = useState<string[]>([]);
//   const [password, setPassword] = useState<string>("");
//   const [image, setImage] = useState<UploadFile | null>(null);
//   const [status, setStatus] = useState<"success" | "error" | null>(null);
//   const [showDetailModal, setShowDetailModal] = useState(false);
//   const [selectedItemDetail, setSelectedItemDetail] = useState<any>(null);

//   const navigate = useNavigate();
//   const API_URL = import.meta.env.VITE_BASE_URL || "http://192.168.100.18:9000";

//   // Function to navigate to edit page with item ID
//   const handleEditClick = (row: any) => {
//     if (row._id) {
//       navigate(`/dashboard/core-settings/update-item-category/${row._id}`);
//     } else {
//       toast.error("Item ID not found");
//     }
//   };

//   // Function to generate a random password
//   const generatePassword = () => {
//     const length = 12; // Define password length
//     const charset =
//       "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";
//     let generatedPassword = "";

//     for (let i = 0; i < length; i++) {
//       const randomIndex = Math.floor(Math.random() * charset.length);
//       generatedPassword += charset[randomIndex];
//     }

//     setPassword(generatedPassword);
//   };

//   const featuredProps: UploadProps = {
//     name: "file",
//     action: "https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload", // replace with real API
//     showUploadList: false,
//     maxCount: 1,
//     onChange(info) {
//       const file = info.file;
//       console.log("file", file);

//       if (file.status === "done") {
//         message.success(`${file.name} uploaded successfully`);
//         setImage(file);
//         setStatus("success");
//       } else if (file.status === "error") {
//         message.error(`${file.name} upload failed`);
//         setImage(file);
//         setStatus("error");
//       }
//     },
//   };

//   const handleRemove = () => {
//     setImage(null);
//     setStatus(null);
//   };

//   const { Dragger } = Upload;
//   const props: UploadProps = {
//     name: "file",
//     multiple: true,
//     action: "https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload",
//     onChange(info) {
//       const { status } = info.file;
//       if (status !== "uploading") {
//         console.log(info.file, info.fileList);
//       }
//       if (status === "done") {
//         message.success(`${info.file.name} file uploaded successfully.`);
//       } else if (status === "error") {
//         message.error(`${info.file.name} file upload failed.`);
//       }
//     },
//     onDrop(e) {
//       console.log("Dropped files", e.dataTransfer.files);
//     },
//   };

//   const filteredData = data.filter((item) => {
//     const matchesSearch = Object.values(item)
//       .join(" ")
//       .toLowerCase()
//       .includes(search.toLowerCase());
//     const matchesStatus =
//       statusFilter === "All" || item.status === statusFilter;
//     return matchesSearch && matchesStatus;
//   });

//   const totalPages = Math.ceil(filteredData.length / rowsPerPage);
//   const currentData = filteredData.slice(
//     (currentPage - 1) * rowsPerPage,
//     currentPage * rowsPerPage
//   );

//   const handleChangePage = (page: number) => {
//     if (page >= 1 && page <= totalPages) setCurrentPage(page);
//   };

//   return (
//     <>
//       <div
//         className={`bg-white rounded-xl p-4 flex flex-col gap-5 shadow-md ${className}`}
//       >
//         <div className="flex justify-between w-full">
//           <p className="text-[#056BB7] font-semibold text-[24px]">
//             {tableTitle}
//           </p>
//           {allItem && (
//             <Button
//               text="Add Item (Category)"
//               variant="border"
//               className="bg-[#28A745] text-white px-4 border-none"
//               onClick={() =>
//                 navigate("/dashboard/core-settings/add-item-category")
//               }
//             />
//           )}
//         </div>

//         {/* Search + Filter */}
//         {allItem && (
//           <>
//             <div
//               className={`grid gap-4 items-center justify-between md:grid-cols-2 ${
//                 data.some((item) => item.hasOwnProperty("status"))
//                   ? ""
//                   : "grid-cols-2"
//               }`}
//             >
//               <div className="flex gap-3">
//                 {searchable && (
//                   <Input
//                     placeholder="Search by Name, Category"
//                     value={search}
//                     onChange={(e) => setSearch(e.target.value)}
//                     className="max-w-full sm:max-w-2xl !rounded-3xl outline-none !border text-[12px] sm:text-[13px] w-full md:w-60 sm:w-52"
//                   />
//                 )}

//                 <Dropdown
//                   options={["All", "Active", "Inactive"]}
//                   DropDownName="Category"
//                   defaultValue="All"
//                   onSelect={(val) => {
//                     setStatusFilter(val);
//                     setCurrentPage(1);
//                   }}
//                 />
//               </div>
//               <div
//                 className={`flex md:justify-end ${
//                   data.some((item) => item.hasOwnProperty("status"))
//                     ? "justify-start"
//                     : "justify-end"
//                 }`}
//               >
//                 <Button
//                   text="Export"
//                   variant="border"
//                   className="bg-[#5D6679] text-white w-24"
//                 />
//               </div>
//             </div>
//           </>
//         )}

//         {/* Table */}
//         <div className="bg-white rounded-xl border border-gray-300 ">
//           <div className="overflow-x-auto">
//             <table className="w-full text-sm text-left text-gray-700 ">
//               <thead className="bg-[#F9FAFB] text-black">
//                 <tr className="font-semibold text-[16px] whitespace-nowrap w-full">
//                   {columns.map((col, index) => {
//                     const isFirst = index === 0;
//                     const isLast = index === columns.length - 1;

//                     return (
//                       <th
//                         key={col.accessor}
//                         className="px-6 py-3"
//                         style={{ width: "max-content" }}
//                       >
//                         <div
//                           className={`flex flex-row items-center ${
//                             isFirst
//                               ? "justify-start"
//                               : isLast
//                               ? "justify-end"
//                               : tableDataAlignment === "zone"
//                               ? "justify-center"
//                               : "justify-start"
//                           }`}
//                         >
//                           {col.header}
//                         </div>
//                       </th>
//                     );
//                   })}
//                 </tr>
//               </thead>
//               <tbody className="border-b border-gray-400">
//                 {currentData.map((row: any, idx: any) => (
//                   <tr
//                     key={idx}
//                     className="hover:bg-gray-50 whitespace-nowrap cursor-pointer"
//                   >
//                     {columns.map((col, index) => {
//                       const isFirst = index === 0;
//                       const isLast = index === columns.length - 1;

//                       return (
//                         <td
//                           key={col.accessor}
//                           className="px-6 py-2"
//                           style={{ width: "max-content" }}
//                         >
//                           <div
//                             className={`flex flex-row items-center ${
//                               isFirst
//                                 ? "justify-start"
//                                 : isLast
//                                 ? "justify-end"
//                                 : tableDataAlignment === "zone"
//                                 ? "justify-center"
//                                 : "justify-start"
//                             }`}
//                           >
//                             {(() => {
//                               switch (col.type) {
//                                 case "image":
//                                   return (
//                                     <div className="flex gap-2 items-center">
//                                       {row.categoryImage ? (
//                                         <>
//                                           <img
//                                             src={`${row.categoryImage}`}
//                                             alt="Item"
//                                             className="w-8 h-8 rounded-full"
//                                           />
//                                           {row.name}
//                                         </>
//                                       ) : (
//                                         <>{row.name}</>
//                                       )}
//                                     </div>
//                                   );
//                                 case "status":
//                                   return (
//                                     <span
//                                       className={`inline-block px-2 py-1 text-xs rounded-full ${
//                                         row.status === "Active"
//                                           ? "bg-green-100 text-green-600"
//                                           : "bg-red-100 text-red-600"
//                                       }`}
//                                     >
//                                       {row.status}
//                                     </span>
//                                   );
//                                 case "actions":
//                                   return (
//                                     <div className="flex justify-end gap-2">
//                                       {/* Add Eye Icon for View Details */}
//                                       <LuEye
//                                         className="cursor-pointer text-blue-600 hover:text-blue-800"
//                                         onClick={(e) => {
//                                           e.stopPropagation();
//                                           setSelectedItemDetail(row);
//                                           setShowDetailModal(true);
//                                         }}
//                                         title="View Details"
//                                       />

//                                       {eye && (
//                                         <LuEye
//                                           className="cursor-pointer"
//                                           onClick={(e) => {
//                                             e.stopPropagation();
//                                             navigate("purchase-order-detail");
//                                           }}
//                                         />
//                                       )}

//                                       <RiEditLine
//                                         className="cursor-pointer"
//                                         onClick={(e) => {
//                                           if (!canUpdate) {
//                                             toast.error(
//                                               "You don't have permission to edit item"
//                                             );
//                                             return;
//                                           }
//                                           e.stopPropagation();
//                                           handleEditClick(row);
//                                         }}
//                                       />

//                                       <AiOutlineDelete
//                                         className="cursor-pointer hover:text-red-500"
//                                         onClick={(e) => {
//                                           e.stopPropagation();
//                                           if (!canDelete) {
//                                             toast.error(
//                                               "You don't have permission to delete item"
//                                             );
//                                             return;
//                                           }
//                                           setSelectedUser(row);
//                                           setShowDeleteModal(true);
//                                         }}
//                                       />
//                                     </div>
//                                   );
//                                 default:
//                                   return <>{row[col.accessor]}</>;
//                               }
//                             })()}
//                           </div>
//                         </td>
//                       );
//                     })}
//                   </tr>
//                 ))}
//                 {currentData.length === 0 && (
//                   <tr>
//                     <td
//                       colSpan={columns.length}
//                       className="text-center py-6 text-gray-500"
//                     >
//                       No data found.
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>

//           {/* Pagination */}
//           <div
//             className={`flex flex-col ${
//               dealBy ? "md:flex-col gap-3" : "md:flex-row"
//             } items-center justify-between px-4 py-4`}
//           >
//             <div className="flex items-center justify-center gap-2">
//               <button
//                 onClick={() => handleChangePage(currentPage - 1)}
//                 className="w-10 h-10 rounded-full border border-gray-300 hover:bg-gray-200 flex items-center justify-center"
//                 disabled={currentPage === 1}
//               >
//                 <GoChevronLeft size={18} />
//               </button>

//               {/* Always show page 1 */}
//               <button
//                 onClick={() => handleChangePage(1)}
//                 className={`w-8 h-8 rounded-full text-sm flex items-center justify-center transition ${
//                   currentPage === 1
//                     ? "bg-[#407BFF] text-white"
//                     : "bg-[#E5E7EB] text-black hover:bg-[#407BFF] hover:text-white"
//                 }`}
//               >
//                 1
//               </button>

//               {/* Show dots if current page is far from start */}
//               {currentPage > 3 && (
//                 <div>
//                   <span className="text-gray-500 px-0.5">•</span>
//                   <span className="text-gray-500 px-0.5">•</span>
//                   <span className="text-gray-500 px-0.5">•</span>
//                 </div>
//               )}

//               {/* Show current page and surrounding pages (but not 1 or last page) */}
//               {[currentPage - 1, currentPage, currentPage + 1]
//                 .filter((page) => page > 1 && page < totalPages && page >= 1)
//                 .map((num) => (
//                   <button
//                     key={num}
//                     onClick={() => handleChangePage(num)}
//                     className={`w-8 h-8 rounded-full text-sm flex items-center justify-center transition ${
//                       currentPage === num
//                         ? "bg-[#407BFF] text-white"
//                         : "bg-[#E5E7EB] text-black hover:bg-[#407BFF] hover:text-white"
//                     }`}
//                   >
//                     {num}
//                   </button>
//                 ))}

//               {/* Show dots if current page is far from end */}
//               {currentPage < totalPages - 2 && totalPages > 1 && (
//                 <div>
//                   <span className="text-gray-500 px-0.5">•</span>
//                   <span className="text-gray-500 px-0.5">•</span>
//                   <span className="text-gray-500 px-0.5">•</span>
//                 </div>
//               )}

//               {/* Always show last page (if more than 1 page) */}
//               {totalPages > 1 && (
//                 <button
//                   onClick={() => handleChangePage(totalPages)}
//                   className={`w-8 h-8 rounded-full text-sm flex items-center justify-center transition ${
//                     currentPage === totalPages
//                       ? "bg-[#407BFF] text-white"
//                       : "bg-[#E5E7EB] text-black hover:bg-[#407BFF] hover:text-white"
//                   }`}
//                 >
//                   {totalPages}
//                 </button>
//               )}

//               <button
//                 onClick={() => handleChangePage(currentPage + 1)}
//                 className="w-10 h-10 rounded-full border border-gray-300 hover:bg-gray-200 flex items-center justify-center"
//                 disabled={currentPage === totalPages}
//               >
//                 <GoChevronRight size={18} />
//               </button>
//             </div>

//             <div className="flex items-center gap-2 mt-2 md:mt-0">
//               <span className="text-sm">Show:</span>
//               <Dropdown
//                 options={["10 Row", "15 Row", "20 Row", "25 Row", "All"]}
//                 defaultValue="10 Row"
//                 onSelect={(val) => {
//                   if (val === "All") {
//                     setRowsPerPage(filteredData.length || data.length);
//                   } else {
//                     const selected = Number.parseInt(val.split(" ")[0]);
//                     setRowsPerPage(selected);
//                   }
//                   setCurrentPage(1);
//                 }}
//                 className="bg-black text-white rounded px-2 py-1 min-w-[90px]"
//               />
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Modal */}
//       {/* {selectedUser && (
//         <div
//           className="fixed inset-0 z-50 flex items-center justify-center bg-transparent backdrop-blur-xs bg-opacity-40 transition-opacity duration-300"
//           onClick={() => setSelectedUser(null)}
//         >
//           <div
//             className="animate-scaleIn bg-white rounded-xl p-6 w-full max-w-sm mx-auto relative shadow-md transition-opacity duration-300"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <div className="flex justify-between items-center">
//               <h2 className="text-lg font-semibold">Detail Data</h2>
//               <button
//                 onClick={() => setSelectedUser(null)}
//                 className="text-xl font-bold text-gray-500 hover:text-gray-700"
//               >
//                 ×
//               </button>
//             </div>
//             <div className="text-center">
//               <div className="mt-3 w-full flex">
//                 <span
//                   className={`text-sm px-3 py-1 rounded-md ml-auto ${
//                     selectedUser.status === "Active"
//                       ? "text-[#10A760] bg-[#34C75933]"
//                       : "text-red-600 bg-red-100"
//                   }`}
//                 >
//                   {selectedUser.status}
//                 </span>
//               </div>
//               <img
//                 src={selectedUser.userImage || "/placeholder.svg"}
//                 alt={selectedUser.name}
//                 className="w-36 h-36 mx-auto rounded-full object-cover"
//               />
//               <div className="my-5">
//                 <span className="text-sm text-black bg-[#12121226] px-3 py-2 rounded-full">
//                   {selectedUser.role}
//                 </span>
//               </div>
//               <h3 className="text-xl font-bold mt-1">
//                 {selectedUser.name} ({selectedUser.id})
//               </h3>
//               <div className="mt-2 text-black text-sm font-bold">
//                 290/UKM_IK/XXVII/2025
//               </div>
//               <div className="flex justify-center gap-6 text-[#71717A] mt-2">
//                 <p>John Doe@gmail.com</p>
//                 <p>081312144546 </p>
//               </div>
//               <p className="text-[#71717A] italic">
//                 1234 Maple Street Springfield, IL 62704
//               </p>

//               <div className="flex justify-center gap-6 mt-6 Poppins-font font-medium">
//                 <p className="text-[#4E4FEB]">
//                   Zone: <span className="text-black">Zone 1</span>
//                 </p>
//                 <p className="text-[#4E4FEB]">
//                   Shop: <span className="text-black">Soho S parkle</span>
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>
//       )} */}

//       {showDeleteModal && canDelete && (
//         <div
//           className="fixed inset-0 flex items-center justify-center bg-black/20 z-50"
//           onClick={() => setShowDeleteModal(false)}
//         >
//           <div
//             className="animate-scaleIn bg-white rounded-xl w-full max-w-md relative shadow-lg border-3 border-gray-300"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <div className="flex justify-between items-center py-4 px-6 shadow-[0_2px_2px_0_#00000026]">
//               <h2 className="text-xl font-medium">Delete Item</h2>
//               <button
//                 onClick={() => setShowDeleteModal(false)}
//                 className="text-xl font-bold text-gray-500 hover:text-gray-700"
//               >
//                 ×
//               </button>
//             </div>
//             <div className="mt-8 text-start pb-8 px-6 shadow-[0_2px_2px_0_#00000026]">
//               <h3 className="text-lg font-semibold mb-1">Delete Item?</h3>
//               <p className="text-sm text-gray-700">
//                 Are you sure you want to delete this item?
//               </p>
//               <p className="text-sm text-red-600 font-medium mt-1">
//                 This action cannot be undone.
//               </p>
//             </div>

//             <div className="flex justify-center gap-2 pb-3 py-4 px-6 shadow-[0_2px_2px_0_#00000026]">
//               <button
//                 onClick={() => setShowDeleteModal(false)}
//                 className="px-5 py-1 rounded-md hover:bg-gray-100 border-none shadow-[inset_0_0_4px_#00000026]"
//               >
//                 Cancel
//               </button>
//               <Button
//                 text="Delete"
//                 icon={<AiOutlineDelete />}
//                 onClick={() => {
//                   if (onDelete && selectedUser) {
//                     onDelete(selectedUser); // ✅ This line was commented out
//                   }
//                   setShowDeleteModal(false);
//                   setDeleteModal(true);
//                 }}
//                 className="!border-none px-5 py-1 bg-[#DC2626] hover:bg-red-700 text-white rounded-md flex items-center gap-1"
//               />
//             </div>
//           </div>
//         </div>
//       )}

//       {isEditing && (
//         <>
//           <div
//             className="fixed inset-0 flex items-center justify-center bg-black/20 z-50"
//             onClick={() => setIsEditing(false)}
//           >
//             <div
//               className="animate-scaleIn bg-white w-[90vw] overflow-hidden sm:w-lg md:w-[80vw] lg:w-4xl h-[70vh] overflow-y-auto rounded-[7px] shadow-lg"
//               onClick={(e) => e.stopPropagation()}
//             >
//               <p className="Source-Sans-Pro-font p-4 text-[#056BB7] font-semibold text-[20px] sm:text-[24px] m-0 sticky top-0 bg-white shadow-sm z-40">
//                 Edit Item
//               </p>

//               <form
//                 className="mt-2 text-[15px] Poppins-font font-medium w-full p-4"
//                 onSubmit={(e) => {
//                   e.preventDefault(); // ✅ Prevents reload
//                   console.log("Form submitted"); // Add your save logic here
//                 }}
//               >
//                 <div className="">
//                   {/* Top Side */}
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-16 xl:gap-16 text-[15px] Poppins-font font-medium">
//                     <div className="flex flex-col">
//                       <label htmlFor="" className="mb-1">
//                         Deal By
//                       </label>
//                       <Dropdown
//                         defaultValue="By Piece"
//                         options={["By Piece", "By Weight"]}
//                         className="w-full"
//                       />
//                     </div>
//                     <div className="flex flex-col">
//                       <label htmlFor="" className="mb-1">
//                         Material
//                       </label>
//                       <Dropdown
//                         defaultValue="Diamond"
//                         options={["Diamond", "Gold"]}
//                         className="w-full"
//                       />
//                     </div>
//                   </div>
//                 </div>

//                 <div className="">
//                   {/* Top Side */}
//                   <p className="mt-8 Source-Sans-Pro-font text-[#056BB7] font-semibold text-[24px] m-0">
//                     Add Item
//                   </p>
//                   <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-16 xl:gap-16 text-[15px] Poppins-font font-medium">
//                     {/* Left Side */}
//                     <div className="space-y-4">
//                       <div className="flex flex-col">
//                         <label htmlFor="" className="mb-1">
//                           SKU
//                         </label>
//                         <div className="flex items-center gap-3 w-full">
//                           <Dropdown
//                             defaultValue="Prefix"
//                             options={["Admin", "Manager", "User"]}
//                             className="w-full"
//                           />
//                           <span>-</span>
//                           <input
//                             type="text"
//                             id="sku"
//                             placeholder="Auto Generate"
//                             className="w-full px-4 py-2 text-sm text-gray-700 placeholder-gray-400 border border-gray-300 outline-none rounded-md"
//                           />
//                         </div>
//                       </div>
//                       <div className="flex flex-col">
//                         <label htmlFor="" className="mb-1">
//                           Supplier Company Name
//                         </label>
//                         <Dropdown
//                           defaultValue="Royal"
//                           options={[
//                             "Golden Aura",
//                             "Pure Aurum",
//                             "Gilded Touch",
//                             "Carat & Co.",
//                             "Whitefire Diamonds",
//                             "Luxe Adamas",
//                           ]}
//                           className="w-full"
//                         />
//                       </div>

//                       <div className="flex flex-col">
//                         <div className="flex gap-2">
//                           <label htmlFor="" className="mb-1">
//                             Category
//                           </label>
//                           <img
//                             src={plusIcon || "/placeholder.svg"}
//                             alt=""
//                             width={16}
//                             className="mb-1"
//                           />
//                         </div>
//                         <Dropdown
//                           defaultValue="Chain"
//                           options={["Admin", "Manager", "User"]}
//                           className="w-full"
//                         />
//                       </div>
//                       <div className="flex flex-col">
//                         <div className="flex gap-2">
//                           <label htmlFor="" className="mb-1">
//                             Style
//                           </label>
//                           <img
//                             src={plusIcon || "/placeholder.svg"}
//                             alt=""
//                             width={16}
//                             className="mb-1"
//                           />
//                         </div>
//                         <Dropdown
//                           defaultValue="Cuban"
//                           options={["Admin", "Manager", "User"]}
//                           className="w-full"
//                         />
//                       </div>

//                       <div className="flex flex-col">
//                         <label htmlFor="" className="mb-1">
//                           Diamond Weight
//                         </label>
//                         <Dropdown
//                           defaultValue="4.5 CWT"
//                           options={["Admin", "Manager", "User"]}
//                           className="w-full"
//                         />
//                       </div>
//                       <div className="flex flex-col">
//                         <label htmlFor="" className="mb-1">
//                           Length
//                         </label>
//                         <Input
//                           placeholder="eg: 18"
//                           className="outline-none focus:outline-none w-full"
//                         />
//                       </div>
//                       <div className="flex flex-col">
//                         <label htmlFor="" className="mb-1">
//                           Size
//                         </label>
//                         <Input
//                           placeholder="eg: 7"
//                           className="outline-none focus:outline-none w-full"
//                         />
//                       </div>

//                       <div className="flex flex-col">
//                         <div className="flex gap-2">
//                           <label htmlFor="" className="mb-1">
//                             Search Tag
//                           </label>
//                           <img
//                             src={plusIcon || "/placeholder.svg"}
//                             alt=""
//                             width={16}
//                             className="mb-1"
//                           />
//                         </div>

//                         <MultiSelectDropdown
//                           options={["Cuban", "Chain"]}
//                           defaultValues={selectedZones}
//                           onSelect={(selected) => setSelectedZones(selected)}
//                         />
//                       </div>

//                       {selectedZones.length > 0 && (
//                         <div className="flex gap-2 flex-wrap">
//                           {selectedZones.map((role, index) => (
//                             <div
//                               key={index}
//                               className="flex items-center gap-2 px-4 py-1 rounded-full bg-[#76767633] text-sm text-[#626262]"
//                             >
//                               <span>{role}</span>
//                               <button
//                                 onClick={() =>
//                                   setSelectedZones(
//                                     selectedZones.filter((r) => r !== role)
//                                   )
//                                 }
//                                 className="flex items-center justify-center w-4 h-4 rounded-full bg-[#626262]"
//                               >
//                                 <RxCross2 size={11} color="white" />
//                               </button>
//                             </div>
//                           ))}
//                         </div>
//                       )}
//                     </div>

//                     {/* Right Side */}
//                     <div className="space-y-4">
//                       <div className="flex flex-col w-full">
//                         <label
//                           htmlFor="password"
//                           className="mb-1 font-semibold text-sm"
//                         >
//                           Barcode
//                         </label>
//                         <div className="flex w-full items-center border border-gray-300 rounded-md overflow-hidden p-1">
//                           <input
//                             type="text"
//                             id="Barcode"
//                             placeholder="ag: 23923"
//                             value={password}
//                             className="w-full px-4 py-2 text-sm text-gray-700 placeholder-gray-400 border-none outline-none"
//                           />
//                           <Button
//                             onClick={generatePassword}
//                             className="bg-[#28A745] text-white text-sm font-semibold px-4 py-2 hover:bg-green-600 transition-colors !border-none"
//                             text="Generate"
//                           />
//                         </div>
//                       </div>

//                       <div className="flex flex-col">
//                         <label htmlFor="" className="mb-1">
//                           Product Name
//                         </label>
//                         <Input
//                           placeholder="Enchanted Locket"
//                           className="outline-none focus:outline-none w-full"
//                         />
//                       </div>

//                       <div className="flex flex-col">
//                         <label htmlFor="" className="mb-1">
//                           Sub Category
//                         </label>
//                         <Dropdown
//                           defaultValue="Men"
//                           options={["Men", "Women", "Child"]}
//                           className="w-full"
//                         />
//                       </div>
//                       <div className="flex flex-col">
//                         <label htmlFor="" className="mb-1">
//                           Gold Category
//                         </label>
//                         <Dropdown
//                           defaultValue="10k"
//                           options={["Men", "Women", "Child"]}
//                           className="w-full"
//                         />
//                       </div>
//                       <div className="flex flex-col">
//                         <label htmlFor="" className="mb-1">
//                           Gold Weight{" "}
//                           <span className="text-[12px] text-gray-500">
//                             (grams)
//                           </span>
//                         </label>
//                         <Input
//                           placeholder="eg: 150gms"
//                           className="outline-none focus:outline-none w-full"
//                         />
//                       </div>

//                       <div className="flex flex-col">
//                         <label htmlFor="" className="mb-1">
//                           MM
//                         </label>
//                         <Dropdown
//                           defaultValue="eg: 8mm"
//                           options={["Men", "Women", "Child"]}
//                           className="w-full"
//                         />
//                       </div>

//                       <div className="w-full max-w-md">
//                         <label className="block mb-2 font-medium text-gray-700 w-full">
//                           Featured image
//                         </label>

//                         <Dragger
//                           {...featuredProps}
//                           className="w-full"
//                           height={40}
//                         >
//                           <div className="rounded-lg flex items-center justify-between cursor-pointe transition !w-full -mt-2">
//                             <span className="text-gray-500">
//                               {image ? image.name : "No file chosen"}
//                             </span>
//                             <CameraOutlined className="text-xl text-gray-400" />
//                           </div>
//                         </Dragger>

//                         {image && (
//                           <div className="mt-4 flex items-start justify-between gap-4">
//                             <Image
//                               width={100}
//                               height={100}
//                               className=" border border-gray-300"
//                               src={
//                                 image.thumbUrl ||
//                                 image.url ||
//                                 (image.originFileObj
//                                   ? URL.createObjectURL(image.originFileObj)
//                                   : "")
//                               }
//                               alt={image.name}
//                               style={{
//                                 objectFit: "cover",
//                                 borderRadius: "8px",
//                               }}
//                             />
//                             <div className="flex items-center gap-2">
//                               <p
//                                 className={`font-medium ${
//                                   status === "success"
//                                     ? "text-green-600"
//                                     : status === "error"
//                                     ? "text-red-600"
//                                     : "text-gray-500"
//                                 }`}
//                               >
//                                 Status: {status}
//                               </p>
//                               <DeleteOutlined
//                                 onClick={handleRemove}
//                                 className="text-red-500 text-lg cursor-pointer hover:text-red-700"
//                               />
//                             </div>
//                           </div>
//                         )}
//                       </div>

//                       <div className="flex flex-col">
//                         <label htmlFor="" className="mb-1">
//                           Upload Multiple Gallery Image
//                         </label>
//                         <Dragger
//                           {...props}
//                           className="mb-1 w-[320px]"
//                           height={170}
//                         >
//                           <p className="ant-upload-drag-icon ">
//                             <InboxOutlined />
//                           </p>
//                           <p className="ant-upload-text ">
//                             Drag and Drop a file here
//                           </p>
//                           <p className="ant-upload-hint !text-[#1A8CE0]">
//                             or Browse a Images
//                           </p>
//                         </Dragger>
//                       </div>

//                       <div className="flex justify-end gap-4  Poppins-font font-medium mt-3">
//                         <Button
//                           text="Back"
//                           className="px-6 !bg-[#F4F4F5] !border-none "
//                         />
//                         <Button
//                           text="Save"
//                           className="px-6 !bg-[#056BB7] border-none text-white"
//                         />
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </form>
//             </div>
//           </div>
//         </>
//       )}

//       {deleteModal && (
//         <div
//           className="fixed inset-0 flex items-center justify-center bg-black/20 z-50"
//           onClick={() => setDeleteModal(false)}
//         >
//           <div
//             className="animate-scaleIn bg-white rounded-xl w-full max-w-md relative shadow-lg border-3 border-gray-300"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <div className="flex justify-between items-center py-4 px-6 shadow-[0_2px_2px_0_#00000026]">
//               <h2 className="text-xl font-medium">Delete Item</h2>
//               <button
//                 onClick={() => setDeleteModal(false)}
//                 className="text-xl font-bold text-gray-500 hover:text-gray-700"
//               >
//                 ×
//               </button>
//             </div>
//             {/* Body */}
//             <div className="mt-8 text-start pb-8 px-6 shadow-[0_2px_2px_0_#00000026]">
//               <h3 className="text-lg font-semibold mb-1">Delete Item?</h3>
//               <p className="text-sm text-gray-700">The item has been removed</p>
//             </div>
//             <div className="flex justify-center gap-2 pb-3 py-4 px-6 shadow-[0_2px_2px_0_#00000026]">
//               <Button
//                 text="Cancel"
//                 onClick={() => setDeleteModal(false)}
//                 className="px-5 py-1 rounded-md hover:bg-gray-100 border-none shadow-[inset_0_0_4px_#00000026]"
//               />
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Item Detail Modal */}
//       {showDetailModal && selectedItemDetail && (
//         <div
//           className="fixed inset-0 flex items-center justify-center bg-black/20 z-50"
//           onClick={() => setShowDetailModal(false)}
//         >
//           <div
//             className="animate-scaleIn bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative shadow-lg border-3 border-gray-300"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <div className="flex justify-between items-center py-4 px-6 shadow-[0_2px_2px_0_#00000026] sticky top-0 bg-white z-10">
//               <h2 className="text-xl font-semibold text-[#056BB7]">
//                 Item Details
//               </h2>
//               <button
//                 onClick={() => setShowDetailModal(false)}
//                 className="text-xl font-bold text-gray-500 hover:text-gray-700"
//               >
//                 ×
//               </button>
//             </div>

//             <div className="p-6">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 {/* Left Column */}
//                 <div className="space-y-4">
//                   <div className="flex items-center gap-4">
//                     {selectedItemDetail.categoryImage && (
//                       <img
//                         src={
//                           selectedItemDetail.categoryImage || "/placeholder.svg"
//                         }
//                         alt="Item"
//                         className="w-20 h-20 rounded-lg object-cover border border-gray-400"
//                       />
//                     )}
//                     <div>
//                       <h3 className="text-lg font-semibold">
//                         {selectedItemDetail.sku}
//                       </h3>
//                       <p className="text-sm text-gray-600">SKU</p>
//                     </div>
//                   </div>

//                   <div className="grid grid-cols-2 gap-4">
//                     <div>
//                       <p className="text-sm font-medium text-gray-600">S.No</p>
//                       <p className="text-sm">{selectedItemDetail.sno}</p>
//                     </div>
//                     <div>
//                       <p className="text-sm font-medium text-gray-600">
//                         Barcode
//                       </p>
//                       <p className="text-sm">
//                         {selectedItemDetail.Barcode || "N/A"}
//                       </p>
//                     </div>
//                     <div>
//                       <p className="text-sm font-medium text-gray-600">
//                         Unit Type
//                       </p>
//                       <p className="text-sm">
//                         {selectedItemDetail.unitType || "N/A"}
//                       </p>
//                     </div>
//                     <div>
//                       <p className="text-sm font-medium text-gray-600">
//                         Product For
//                       </p>
//                       <p className="text-sm">
//                         {selectedItemDetail.productFor || "N/A"}
//                       </p>
//                     </div>
//                     <div>
//                       <p className="text-sm font-medium text-gray-600">
//                         Category
//                       </p>
//                       <p className="text-sm">
//                         {selectedItemDetail.category || "N/A"}
//                       </p>
//                     </div>
//                     <div>
//                       <p className="text-sm font-medium text-gray-600">
//                         Sub Category
//                       </p>
//                       <p className="text-sm">
//                         {selectedItemDetail.subCategory || "N/A"}
//                       </p>
//                     </div>
//                     <div>
//                       <p className="text-sm font-medium text-gray-600">Style</p>
//                       <p className="text-sm">
//                         {selectedItemDetail.style || "N/A"}
//                       </p>
//                     </div>
//                     <div>
//                       <p className="text-sm font-medium text-gray-600">
//                         Status
//                       </p>
//                       <span
//                         className={`inline-block px-2 py-1 text-xs rounded-full ${
//                           selectedItemDetail.status === "Active"
//                             ? "bg-green-100 text-green-600"
//                             : "bg-red-100 text-red-600"
//                         }`}
//                       >
//                         {selectedItemDetail.status}
//                       </span>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Right Column */}
//                 <div className="space-y-4">
//                   <h4 className="text-lg font-semibold text-[#056BB7]">
//                     Additional Details
//                   </h4>
//                   <div className="grid grid-cols-2 gap-4">
//                     <div>
//                       <p className="text-sm font-medium text-gray-600">
//                         Gold Category
//                       </p>
//                       <p className="text-sm">
//                         {selectedItemDetail.goldCTG || "N/A"}
//                       </p>
//                     </div>
//                     <div>
//                       <p className="text-sm font-medium text-gray-600">
//                         Diamond Weight
//                       </p>
//                       <p className="text-sm">
//                         {selectedItemDetail.diamondWeight || "N/A"}
//                       </p>
//                     </div>
//                     <div>
//                       <p className="text-sm font-medium text-gray-600">
//                         Gold Weight
//                       </p>
//                       <p className="text-sm">
//                         {selectedItemDetail.goldWeight || "N/A"}
//                       </p>
//                     </div>
//                     <div>
//                       <p className="text-sm font-medium text-gray-600">
//                         Length
//                       </p>
//                       <p className="text-sm">
//                         {selectedItemDetail.length || "N/A"}
//                       </p>
//                     </div>
//                     <div>
//                       <p className="text-sm font-medium text-gray-600">MM</p>
//                       <p className="text-sm">
//                         {selectedItemDetail.mm || "N/A"}
//                       </p>
//                     </div>
//                     <div>
//                       <p className="text-sm font-medium text-gray-600">Size</p>
//                       <p className="text-sm">
//                         {selectedItemDetail.size || "N/A"}
//                       </p>
//                     </div>
//                   </div>

//                   <div>
//                     <p className="text-sm font-medium text-gray-600 mb-2">
//                       Search Tags
//                     </p>
//                     <div className="flex flex-wrap gap-2">
//                       {selectedItemDetail.searchTag ? (
//                         selectedItemDetail.searchTag
//                           .split(", ")
//                           .map((tag: string, index: number) => (
//                             <span
//                               key={index}
//                               className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
//                             >
//                               {tag}
//                             </span>
//                           ))
//                       ) : (
//                         <span className="text-sm text-gray-500">
//                           No tags available
//                         </span>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               <div className="flex justify-end mt-6 pt-4 border-t">
//                 <Button
//                   text="Close"
//                   onClick={() => setShowDetailModal(false)}
//                   className="px-6 !bg-[#056BB7] border-none text-white"
//                 />
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default ItemCategoryTable;

import type React from "react";
import { useState } from "react";
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

// Helper function to get auth token
const getAuthToken = () => {
  let token = localStorage.getItem("token");
  if (!token) {
    token = sessionStorage.getItem("token");
  }
  return token;
};

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
  AddItemCategoryButton?: boolean;
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
  onEdit,
  onDelete,
  tableDataAlignment = "start", // default
  dealBy,
  canUpdate = true,
  canDelete = true,
  AddItemCategoryButton = true, // Add this line with default value
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
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

  // New state variables for eye icon functionality
  const [showItemDetailsModal, setShowItemDetailsModal] = useState(false);
  const [itemDetails, setItemDetails] = useState<any>(null);
  const [loadingItemDetails, setLoadingItemDetails] = useState(false);

  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_BASE_URL || "http://192.168.100.18:9000";

  // Function to navigate to edit page with item ID
  const handleEditClick = (row: any) => {
    if (row._id) {
      navigate(`/dashboard/core-settings/update-item-category/${row._id}`);
    } else {
      toast.error("Item ID not found");
    }
  };

  // Function to fetch and display item details
  const handleViewItemDetails = async (row: any) => {
    if (!row._id) {
      toast.error("Item ID not found");
      return;
    }

    try {
      setLoadingItemDetails(true);
      setShowItemDetailsModal(true);

      const token = getAuthToken();
      if (!token) {
        toast.error("Authentication token not found. Please login again.");
        return;
      }

      const response = await axios.get(
        `${API_URL}/api/abid-jewelry-ms/getOneItem/${row._id}`,
        {
          headers: {
            "x-access-token": token,
          },
        }
      );

      if (response.data.success) {
        setItemDetails(response.data.data);
      } else {
        toast.error("Failed to fetch item details");
        setShowItemDetailsModal(false);
      }
    } catch (error) {
      console.error("Error fetching item details:", error);
      if (axios.isAxiosError(error)) {
        if (!error.response) {
          toast.error("Network error. Please check your internet connection.");
        } else {
          toast.error(
            error.response.data.message || "Failed to fetch item details"
          );
        }
      } else {
        toast.error("An unexpected error occurred while fetching item details");
      }
      setShowItemDetailsModal(false);
    } finally {
      setLoadingItemDetails(false);
    }
  };

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
        className={`bg-white rounded-xl p-4 flex flex-col gap-5 shadow-md ${className}`}
      >
        <div className="flex justify-between w-full">
          <p className="text-[#056BB7] font-semibold text-[24px]">
            {tableTitle}
          </p>
          {allItem && AddItemCategoryButton && (
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
            <table className="w-full text-sm text-left text-gray-700 ">
              <thead className="bg-[#F9FAFB] text-black">
                <tr className="font-semibold text-[16px] whitespace-nowrap w-full">
                  {columns.map((col, index) => {
                    const isFirst = index === 0;
                    const isLast = index === columns.length - 1;

                    return (
                      <th
                        key={col.accessor}
                        className="px-6 py-3"
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
              <tbody className="border-b border-gray-400">
                {currentData.map((row: any, idx: any) => (
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
                          className="px-6 py-2"
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
                            {(() => {
                              switch (col.type) {
                                case "image":
                                  return (
                                    <div className="flex gap-2 items-center">
                                      {row.categoryImage ? (
                                        <>
                                          <img
                                            src={`${row.categoryImage}`}
                                            alt="Item"
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
                                      {/* Eye icon for viewing details */}
                                      <LuEye
                                        className="cursor-pointer text-blue-600 hover:text-blue-800"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleViewItemDetails(row);
                                        }}
                                        title="View Details"
                                      />

                                      {eye && (
                                        <LuEye
                                          className="cursor-pointer"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            navigate("purchase-order-detail");
                                          }}
                                        />
                                      )}

                                      <RiEditLine
                                        className="cursor-pointer"
                                        onClick={(e) => {
                                          if (!canUpdate) {
                                            toast.error(
                                              "You don't have permission to edit item"
                                            );
                                            return;
                                          }
                                          e.stopPropagation();
                                          handleEditClick(row);
                                        }}
                                      />

                                      <AiOutlineDelete
                                        className="cursor-pointer hover:text-red-500"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          if (!canDelete) {
                                            toast.error(
                                              "You don't have permission to delete item"
                                            );
                                            return;
                                          }
                                          setSelectedUser(row); // ✅ Make sure this sets the correct row data
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

      {/* Item Details Modal */}
      {showItemDetailsModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={() => {
            setShowItemDetailsModal(false);
            setItemDetails(null);
          }}
        >
          <div
            className="animate-scaleIn bg-white rounded-xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto relative shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-[#056BB7]">
                Item Details
              </h2>
              <button
                onClick={() => {
                  setShowItemDetailsModal(false);
                  setItemDetails(null);
                }}
                className="text-xl font-bold text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>

            <div className="p-6">
              {loadingItemDetails ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
                  <p className="mt-4 text-gray-600">Loading item details...</p>
                </div>
              ) : itemDetails ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left Column - Basic Info */}
                  <div className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="text-lg font-semibold text-gray-800 mb-3">
                        Basic Information
                      </h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="font-medium text-gray-600">
                            SKU:
                          </span>
                          <span>
                            {itemDetails.prefixId?.prefixName}-
                            {itemDetails.autoGenerated}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium text-gray-600">
                            Barcode:
                          </span>
                          <span>{itemDetails.barcode}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium text-gray-600">
                            Unit Type:
                          </span>
                          <span className="capitalize">
                            {itemDetails.unitType}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium text-gray-600">
                            Product For:
                          </span>
                          <span>
                            {Array.isArray(itemDetails.productFor)
                              ? itemDetails.productFor.join(", ")
                              : itemDetails.productFor}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="text-lg font-semibold text-gray-800 mb-3">
                        Category Information
                      </h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="font-medium text-gray-600">
                            Category:
                          </span>
                          <span>{itemDetails.category?.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium text-gray-600">
                            Sub Category:
                          </span>
                          <span>{itemDetails.subCategory?.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium text-gray-600">
                            Style:
                          </span>
                          <span>{itemDetails.style?.name}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="text-lg font-semibold text-gray-800 mb-3">
                        Specifications
                      </h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="font-medium text-gray-600">
                            Gold Category:
                          </span>
                          <span>{itemDetails.goldCategory?.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium text-gray-600">
                            Gold Weight:
                          </span>
                          <span>{itemDetails.goldWeight} grams</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium text-gray-600">
                            Diamond Weight:
                          </span>
                          <span>{itemDetails.diamondWeight}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium text-gray-600">
                            Length:
                          </span>
                          <span>{itemDetails.length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium text-gray-600">MM:</span>
                          <span>{itemDetails.mm}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium text-gray-600">
                            Size:
                          </span>
                          <span>{itemDetails.size}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column - Images and Tags */}
                  <div className="space-y-4">
                    {/* Featured Image */}
                    {itemDetails.itemImage && (
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="text-lg font-semibold text-gray-800 mb-3">
                          Featured Image
                        </h3>
                        <img
                          src={`${API_URL}${itemDetails.itemImage}`}
                          alt="Item"
                          className="w-full h-48 object-cover rounded-lg border border-gray-300"
                        />
                      </div>
                    )}

                    {/* Gallery Images */}
                    {itemDetails.uploadMultipleItemImages &&
                      itemDetails.uploadMultipleItemImages.length > 0 && (
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h3 className="text-lg font-semibold text-gray-800 mb-3">
                            Gallery Images
                          </h3>
                          <div className="grid grid-cols-2 gap-2">
                            {itemDetails.uploadMultipleItemImages.map(
                              (imagePath: string, index: number) => (
                                <img
                                  key={index}
                                  src={`${API_URL}${imagePath}`}
                                  alt={`Gallery ${index + 1}`}
                                  className="w-full h-24 object-cover rounded border border-gray-300"
                                />
                              )
                            )}
                          </div>
                        </div>
                      )}

                    {/* Search Tags */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="text-lg font-semibold text-gray-800 mb-3">
                        Search Tags
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {(typeof itemDetails.searchTag === "string"
                          ? itemDetails.searchTag
                              .split(",")
                              .map((tag: string) => tag.trim())
                          : Array.isArray(itemDetails.searchTag)
                          ? itemDetails.searchTag
                          : []
                        ).map((tag: string, index: number) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Timestamps */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="text-lg font-semibold text-gray-800 mb-3">
                        Timestamps
                      </h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="font-medium text-gray-600">
                            Created:
                          </span>
                          <span>
                            {new Date(
                              itemDetails.createdAt
                            ).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium text-gray-600">
                            Updated:
                          </span>
                          <span>
                            {new Date(
                              itemDetails.updatedAt
                            ).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-600">Failed to load item details</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && canDelete && (
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
                            src={plusIcon || "/placeholder.svg"}
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
                            src={plusIcon || "/placeholder.svg"}
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
                            src={plusIcon || "/placeholder.svg"}
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
