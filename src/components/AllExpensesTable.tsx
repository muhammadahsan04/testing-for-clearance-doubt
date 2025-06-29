// import React, { useState } from "react";
// import { AiOutlineDelete } from "react-icons/ai";
// import { RiEditLine, RiFileList2Line } from "react-icons/ri";
// import { GoChevronLeft, GoChevronRight } from "react-icons/go";
// import { LuEye } from "react-icons/lu";
// import plusIcon from "../assets/plus.svg";

// import Input from "./Input";
// import Dropdown from "./Dropdown";
// import DatePicker from "./DatePicker";
// // import DatePicker from "../../../components/DatePicker";
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
// import HorizontalLinearAlternativeLabelStepper from "./HorizontalLinearAlternativeLabelStepper";
// import { DatePicker as AntDatePicker } from "antd";
// import { FaDownload } from "react-icons/fa";
// import { IoIosPrint } from "react-icons/io";

// type ColumnType =
//   | "text"
//   | "image"
//   | "status"
//   | "actions"
//   | "button"
//   | "custom"
//   | "attachReceipt";

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

// interface AllExpensesTableProps {
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
// }

// const AllExpensesTable: React.FC<AllExpensesTableProps> = ({
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
// }) => {
//   const [currentPage, setCurrentPage] = useState(1);
//   const [rowsPerPage, setRowsPerPage] = useState(5);
//   const [selectedUser, setSelectedUser] = useState<any>(null); // for modal
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [deleteModal, setDeleteModal] = useState(false);
//   const [deleteUser, setDeleteUser] = useState<any>(null); // for modal
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
//   const [showPurchaseOrderDetailModal, setShowPurchaseOrderDetailModal] =
//     useState<any>(null); // for modal
//   const [dateRange, setDateRange] = useState("");
//   const [supplier, setSupplier] = useState("");
//   const [receiptDetail, setReceiptDetail] = useState<any>(null);
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

//   const { RangePicker } = AntDatePicker;
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

//   const navigate = useNavigate();
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
//   // console.log("DATA", isEditing);

//   return (
//     <>
//       <div
//         className={`bg-white rounded-xl p-4 flex flex-col gap-2 overflow-hidden shadow-md ${className}`}
//       >
//         {/* Search + Filter */}
//         {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center justify-between"> */}
//         <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 items-center justify-between">
//           <Input
//             placeholder="Search by Name, Category"
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             className="w-full !rounded-3xl"
//           />
//           <Dropdown
//             className="w-full md:auto"
//             options={["All", "Active", "Inactive"]}
//             DropDownName="Category"
//             // defaultValue="All"
//             onSelect={(val) => {
//               setStatusFilter(val);
//               setCurrentPage(1);
//             }}
//           />
//           <RangePicker className="h-10 !text-gray-400 !border-gray-300" />
//           <div className="flex justify-start xl:justify-end md:col-span-4 lg:col-span-1 w-full">
//             <Button
//               text="Export"
//               variant="border"
//               className="bg-[#5D6679] text-white w-24"
//             />
//           </div>
//         </div>
//         <div
//           className={`grid gap-4 items-center justify-between md:grid-cols-2 ${
//             data.some((item) => item.hasOwnProperty("status"))
//               ? ""
//               : "grid-cols-2"
//           }`}
//         >
//           {/* <div
//             className={`flex md:justify-end ${
//               data.some((item) => item.hasOwnProperty("status"))
//                 ? "justify-start"
//                 : "justify-end"
//             }`}
//           >
//             <Button
//               text="Export"
//               variant="border"
//               className="bg-[#5D6679] text-white w-24"
//             />
//           </div> */}
//         </div>

//         <p className="text-[#056BB7] font-semibold text-[24px]">{tableTitle}</p>

//         {/* Table */}
//         <div className="bg-white rounded-xl border border-gray-300 overflow-x-auto">
//           <table className="w-full text-sm text-left text-gray-700 ">
//             <thead className="bg-[#F9FAFB] text-black">
//               {/* <tr className="font-semibold text-[16px] whitespace-nowrap border-2">
//                 {columns.map((col) => (
//                   <th key={col.accessor} className="px-6 py-3">
//                     {col.header}
//                   </th>
//                 ))}
//               </tr> */}

//               <tr className="font-semibold text-[16px] whitespace-nowrap w-full">
//                 {columns.map((col, index) => {
//                   const isFirst = index === 0;
//                   const isLast = index === columns.length - 1;
//                   const isSecondLast = index === columns.length - 2;

//                   return (
//                     <th
//                       key={col.accessor}
//                       className="px-4 py-3"
//                       style={{ width: "max-content" }}
//                     >
//                       <div
//                         className={`flex flex-row items-center ${
//                           isFirst
//                             ? "justify-start"
//                             : isLast
//                             ? "justify-end"
//                             : isSecondLast
//                             ? "justify-center"
//                             : tableDataAlignment === "zone"
//                             ? "justify-center"
//                             : "justify-start"
//                           // : "justify-center" for zone
//                           // "justify-start"
//                         }`}
//                       >
//                         {col.header}
//                       </div>
//                     </th>
//                   );
//                 })}
//               </tr>
//             </thead>
//             <tbody className="border-b border-gray-400">
//               {currentData.map((row, idx) => (
//                 <tr
//                   key={idx}
//                   className="hover:bg-gray-50 whitespace-nowrap cursor-pointer"
//                   // onClick={() => {
//                   //   // Custom behavior per table usage OLD
//                   //   if (onRowClick) {
//                   //     onRowClick(row);
//                   //   } else {
//                   //     setSelectedUser(row);
//                   //   }
//                   // }}
//                   onClick={() => {
//                     //NEW
//                     if (onRowClick) {
//                       onRowClick(row);
//                     } else if (enableRowModal) {
//                       //   setSelectedUser(row);
//                     }
//                   }}
//                 >
//                   {columns.map((col, index) => {
//                     const isFirst = index === 0;
//                     const isLast = index === columns.length - 1;
//                     const isSecondLast = index === columns.length - 2;

//                     return (
//                       <td
//                         key={col.accessor}
//                         className="px-4 py-2"
//                         style={{ width: "max-content" }}
//                       >
//                         <div
//                           className={`flex flex-row items-center ${
//                             isFirst
//                               ? "justify-start"
//                               : isLast
//                               ? "justify-end"
//                               : isSecondLast
//                               ? "justify-center"
//                               : tableDataAlignment === "zone"
//                               ? "justify-center"
//                               : "justify-start"
//                             // : "justify-center" for zone
//                             // "justify-start"
//                           }`}
//                         >
//                           {(() => {
//                             switch (col.type) {
//                               case "image":
//                                 return (
//                                   <div className="flex gap-2 items-center">
//                                     {row.userImage ? (
//                                       <>
//                                         <img
//                                           src={row.userImage}
//                                           alt="User"
//                                           className="w-8 h-8 rounded-full"
//                                         />
//                                         {row.name}
//                                       </>
//                                     ) : (
//                                       <>{row.name}</>
//                                     )}
//                                   </div>
//                                 );
//                               case "status":
//                                 return (
//                                   <span
//                                     className={`inline-block px-2 py-1 text-xs rounded-full ${
//                                       row.status === "Active"
//                                         ? "bg-green-100 text-green-600"
//                                         : "bg-red-100 text-red-600"
//                                     }`}
//                                   >
//                                     {row.status}
//                                   </span>
//                                 );
//                               case "attachReceipt":
//                                 return (
//                                   <div className="flex justify-center gap-2">
//                                     <>
//                                       <span className="underline text-blue-600">
//                                         {row.attachReceipt}
//                                       </span>
//                                       <RiFileList2Line
//                                         size={20}
//                                         className="cursor-pointer"
//                                         onClick={(e) => {
//                                           e.stopPropagation();
//                                           setReceiptDetail(row);
//                                         }}
//                                       />
//                                     </>
//                                   </div>
//                                 );
//                               case "actions":
//                                 return (
//                                   <div className="flex justify-end gap-2">
//                                     {eye && (
//                                       <LuEye
//                                         className="cursor-pointer"
//                                         onClick={(e) => {
//                                           e.stopPropagation();
//                                           setShowPurchaseOrderDetailModal(row);
//                                           // navigate("purchase-order-detail");
//                                         }}
//                                       />
//                                     )}
//                                     {/* <RiEditLine
//                                       className="cursor-pointer"
//                                       onClick={(e) => {
//                                         e.stopPropagation();
//                                         setIsEditing(true); // Set isEditing to true
//                                         setEditingRow(row); // Store the row data in editingRow
//                                       }}
//                                     /> */}

//                                     <RiEditLine
//                                       className="cursor-pointer"
//                                       onClick={(e) => {
//                                         e.stopPropagation();
//                                         setIsEditing(true);
//                                         setEditingRow(row);
//                                         setFormData({ ...row }); // Initialize form data with the row data
//                                       }}
//                                     />

//                                     <AiOutlineDelete
//                                       className="cursor-pointer hover:text-red-500"
//                                       onClick={(e) => {
//                                         e.stopPropagation();
//                                         setShowDeleteModal(true);
//                                         setDeleteUser(row); // Add this line to set the delete user
//                                       }}
//                                     />
//                                   </div>
//                                 );
//                               default:
//                                 return <>{row[col.accessor]}</>;
//                             }
//                           })()}
//                         </div>
//                       </td>
//                     );
//                   })}
//                 </tr>
//               ))}
//               {currentData.length === 0 && (
//                 <tr>
//                   <td
//                     colSpan={columns.length}
//                     className="text-center py-6 text-gray-500"
//                   >
//                     No data found.
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>

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
//               >
//                 <GoChevronLeft size={18} />
//               </button>

//               {[1, 2, 3, 10].map((num, idx) => (
//                 <React.Fragment key={num}>
//                   {idx === 3 && (
//                     <div>
//                       <span className="text-gray-500 px-0.5">•</span>
//                       <span className="text-gray-500 px-0.5">•</span>
//                       <span className="text-gray-500 px-0.5">•</span>
//                     </div>
//                   )}
//                   <button
//                     onClick={() => handleChangePage(num)}
//                     className={`w-8 h-8 rounded-full text-sm flex items-center justify-center transition ${
//                       currentPage === num
//                         ? "bg-[#407BFF] text-white"
//                         : "bg-[#E5E7EB] text-black hover:bg-[#407BFF] hover:text-white"
//                     }`}
//                   >
//                     {num}
//                   </button>
//                 </React.Fragment>
//               ))}

//               <button
//                 onClick={() => handleChangePage(currentPage + 1)}
//                 className="w-10 h-10 rounded-full border border-gray-300 hover:bg-gray-200 flex items-center justify-center"
//               >
//                 <GoChevronRight size={18} />
//               </button>
//             </div>

//             <div className="flex items-center gap-2 mt-2 md:mt-0">
//               <span className="text-sm">Show:</span>
//               <Dropdown
//                 options={["5 Row", "10 Row", "15 Row", "20 Row"]}
//                 onSelect={(val) => {
//                   const selected = parseInt(val.split(" ")[0]);
//                   setRowsPerPage(selected);
//                   setCurrentPage(1);
//                 }}
//                 className="bg-black text-white rounded px-2 py-1 min-w-[90px]"
//               />
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Modal */}
//       {selectedUser && (
//         <div
//           className="fixed inset-0 z-50 flex items-center justify-center bg-transparent bg-opacity-40 transition-opacity duration-300"
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
//                   // className="text-sm text-[#10A760] bg-[#34C75933] px-3 py-1 rounded-md ml-auto"
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
//       )}

//       {showDeleteModal && (
//         <div
//           // className="fixed inset-0 z-50 flex items-center justify-center bg-transparent backdrop-blur-xs bg-opacity-40 transition-opacity duration-300"
//           className="fixed inset-0 flex items-center justify-center bg-black/20 z-50"
//           onClick={() => {
//             setShowDeleteModal(false);
//             setDeleteUser(null);
//           }}
//         >
//           <div
//             className="animate-scaleIn bg-white rounded-xl w-full max-w-md relative shadow-lg border-3 border-gray-300"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <div className="flex justify-between items-center py-4 px-6 shadow-[0_2px_2px_0_#00000026]">
//               <h2 className="text-xl font-medium">
//                 Delete {deleteUser.nameOrTitle}
//               </h2>
//               <button
//                 onClick={() => setShowDeleteModal(false)}
//                 className="text-xl font-bold text-gray-500 hover:text-gray-700"
//               >
//                 ×
//               </button>
//             </div>
//             <div className="mt-8 text-start pb-8 px-6 shadow-[0_2px_2px_0_#00000026]">
//               <h3 className="text-lg font-semibold mb-1">
//                 Delete{" "}
//                 {tableTitle?.endsWith("s")
//                   ? tableTitle?.slice(0, -1)
//                   : tableTitle}
//                 ?
//               </h3>
//               <p className="text-sm text-gray-700">
//                 Are you sure you want to delete this{" "}
//                 {tableTitle?.endsWith("s")
//                   ? tableTitle?.slice(0, -1)
//                   : tableTitle}
//                 ?
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
//               className="animate-scaleIn bg-white w-[90vw] overflow-hidden sm:w-lg md:w-[80vw] lg:w-3xl h-[70vh] overflow-y-auto rounded-[7px] shadow-lg"
//               onClick={(e) => e.stopPropagation()}
//             >
//               <p className="Source-Sans-Pro-font p-4 text-[#056BB7] font-semibold text-[20px] sm:text-[24px] m-0 sticky top-0 bg-white shadow-sm z-40">
//                 Edit Purchase Order
//               </p>

//               <form
//                 className="text-[15px] Poppins-font font-medium w-full px-4"
//                 onSubmit={(e) => {
//                   e.preventDefault();
//                   console.log("Form submitted");
//                 }}
//               >
//                 <div className="">
//                   <div className="mt-6 mb-4 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-16 xl:gap-16 text-[15px] Poppins-font font-medium">
//                     <div className="space-y-4">
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
//                         <label htmlFor="" className="mb-1">
//                           Product Details
//                         </label>
//                         <Input
//                           placeholder="Diamond Chains"
//                           className="outline-none focus:outline-none w-full"
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
//                           Diamond Price/PC
//                         </label>
//                         <Input
//                           placeholder="150"
//                           type="number"
//                           className="outline-none focus:outline-none w-full"
//                         />
//                       </div>
//                       <div className="flex flex-col">
//                         <label htmlFor="" className="mb-1">
//                           Diamond Value
//                         </label>
//                         <Input
//                           placeholder="Auto-generate"
//                           type="number"
//                           className="outline-none focus:outline-none w-full"
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
//                           placeholder="eg: 50gms"
//                           className="outline-none focus:outline-none w-full"
//                         />
//                       </div>
//                       <div className="flex flex-col">
//                         <label htmlFor="" className="mb-1">
//                           Gold Price/PC
//                         </label>
//                         <Input
//                           placeholder="150"
//                           type="number"
//                           className="outline-none focus:outline-none w-full"
//                         />
//                       </div>
//                       <div className="flex flex-col">
//                         <label htmlFor="" className="mb-1">
//                           Gold Value
//                         </label>
//                         <Input
//                           placeholder="Auto-generate"
//                           type="number"
//                           className="outline-none focus:outline-none w-full"
//                         />
//                       </div>
//                       <div className="flex flex-col">
//                         <label htmlFor="" className="mb-1">
//                           Length
//                         </label>
//                         <Input
//                           placeholder='eg: 18"'
//                           className="outline-none focus:outline-none w-full"
//                         />
//                       </div>
//                     </div>

//                     <div className="space-y-4">
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
//                       <div className="flex flex-col">
//                         <label htmlFor="" className="mb-1">
//                           Size
//                         </label>
//                         <Input
//                           placeholder="eg: 7"
//                           className="outline-none focus:outline-none w-full"
//                         />
//                       </div>

//                       <div className="flex flex-col w-full">
//                         <label className="mb-1">Date of Purchase</label>
//                         <DatePicker
//                           onChange={(e) => console.log(e.target.value)}
//                           type={"calendar" === "calendar" ? "date" : "text"}
//                           className="w-full"
//                         />
//                       </div>

//                       <div className="flex flex-col">
//                         <label htmlFor="" className="mb-1">
//                           Quantity
//                         </label>
//                         <Input
//                           placeholder="eg: 5"
//                           className="outline-none focus:outline-none w-full"
//                         />
//                       </div>
//                       <div className="flex flex-col">
//                         <label htmlFor="" className="mb-1">
//                           Cost Price
//                         </label>
//                         <Input
//                           placeholder="Auto-generate"
//                           type="number"
//                           className="outline-none focus:outline-none w-full"
//                         />
//                       </div>
//                       <div className="flex flex-col">
//                         <label htmlFor="" className="mb-1">
//                           Service Charge
//                         </label>
//                         <Input
//                           placeholder="eg: 150"
//                           className="outline-none focus:outline-none w-full"
//                         />
//                       </div>

//                       <div className="flex flex-col">
//                         <label htmlFor="" className="mb-1">
//                           Gross Price
//                         </label>
//                         <Input
//                           placeholder="Auto-generate"
//                           type="number"
//                           className="outline-none focus:outline-none w-full"
//                         />
//                       </div>
//                       <div className="flex flex-col">
//                         <label htmlFor="" className="mb-1">
//                           Gross Price
//                         </label>
//                         <textarea
//                           placeholder="Add any additional comments.."
//                           rows={4}
//                           className="Poppins-font font-medium w-full px-4 py-2 border border-gray-300 rounded-md text-sm !focus:outline-none outline-none resize-none"
//                         ></textarea>
//                       </div>

//                       <div className="flex justify-end gap-4  Poppins-font font-medium !mt-12">
//                         <Button
//                           onClick={() => setIsEditing(false)}
//                           text="Submit"
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
//       {showPurchaseOrderDetailModal && (
//         <>
//           <div
//             // className="fixed inset-0 flex items-center justify-center bg-transparent backdrop-blur-[1px] bg-opacity-40 z-50"
//             className="fixed inset-0 flex items-center justify-center bg-black/20 z-50"
//             // className="fixed inset-0 flex items-center justify-center bg-black/30 z-50"
//             onClick={() => setShowPurchaseOrderDetailModal(null)}
//           >
//             <div
//               className="animate-scaleIn bg-white rounded-xl shadow-md p-6 md:p-10 w-4xl"
//               onClick={(e) => e.stopPropagation()}
//             >
//               <div className="flex justify-between items-center mb-6">
//                 <h2 className="text-xl md:text-2xl font-semibold text-[#0873CD] Source-Sans-Pro-font">
//                   Purchase Order Detail
//                 </h2>
//                 {/* <button className="flex items-center bg-gray-700 hover:bg-gray-600 text-sm px-3 py-3 h-fit leading-none rounded-md Inter-font text-white">

//             <IoIosPrint className="ml-1" color="white" />
//           </button> */}

//                 <Button
//                   className="select-none bg-gray-700 hover:bg-gray-600"
//                   variant="border"
//                   fontFamily="Inter-font"
//                   text="Print Info"
//                   icon={<IoIosPrint color="white" />}
//                   onClick={() => alert("Logout Button Clicked")}
//                 />
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 xl:gap-28 lg:gap-16 text-[14px] gap-8 md:gap-20 Poppins-font xl:text-[15px] lg:text-[14px]">
//                 <div className="space-y-3">
//                   <div className="flex justify-between items-center">
//                     <p className="font-medium">Supplier Company Name:</p>
//                     <p className="text-[#5D6679] text-right">Royal Gems</p>
//                   </div>
//                   <div className="flex justify-between items-center">
//                     <p className="font-medium">Catagory:</p>
//                     <p className="text-[#5D6679]">Chain</p>
//                   </div>
//                   <div className="flex justify-between items-center">
//                     <p className="font-medium">Sub Category:</p>
//                     <p className="text-[#5D6679]">Man</p>
//                   </div>
//                   <div className="flex justify-between items-center">
//                     <p className="font-medium">Style:</p>
//                     <p className="text-[#5D6679]">Cuban</p>
//                   </div>
//                   <div className="flex justify-between items-center">
//                     <p className="font-medium">Gold Category</p>
//                     <p className="text-[#5D6679]">10K</p>
//                   </div>
//                   <div className="flex justify-between items-center">
//                     <p className="font-medium">Diamond Weight</p>
//                     <p className="text-[#5D6679]">4.5 CWT</p>
//                   </div>
//                   <div className="flex justify-between items-center">
//                     <p className="font-medium">Gold Weight</p>
//                     <p className="text-[#5D6679]">150 gm</p>
//                   </div>
//                   <div className="flex justify-between items-center">
//                     <p className="font-medium">Length</p>
//                     <p className="text-[#5D6679]">18"</p>
//                   </div>
//                   <div className="flex justify-between items-center">
//                     <p className="font-medium">MM</p>
//                     <p className="text-[#5D6679]">8mm</p>
//                   </div>
//                   <div className="flex justify-between items-center">
//                     <p className="font-medium">Size</p>
//                     <p className="text-[#5D6679]">7</p>
//                   </div>
//                 </div>
//                 <div className="space-y-3">
//                   <div className="flex justify-between items-center">
//                     <p className="font-medium">DateDate of Purchase</p>
//                     <p className="text-right">23-Mar-2025</p>
//                   </div>
//                   <div className="flex justify-between items-center">
//                     <p className="font-medium">Expected Delivery Date</p>
//                     <p className="text-right">25-Mar-2025</p>
//                   </div>
//                   <div className="flex justify-between items-center">
//                     <p className="font-medium">Quantity:</p>
//                     <p>3</p>
//                   </div>
//                   <div className="flex justify-between items-center">
//                     <p className="font-medium">Price Per Unit</p>
//                     <p>$800</p>
//                   </div>
//                   <div className="flex justify-between items-center">
//                     <p className="font-medium">Total Cost</p>
//                     <p>$2,400</p>
//                   </div>
//                   <div className="flex justify-between items-center">
//                     <p className="font-medium">Invoice or Reference File</p>
//                     <FaDownload className="text-gray-700 cursor-pointer" />
//                   </div>

//                   <HorizontalLinearAlternativeLabelStepper />

//                   <div className="mt-6 flex justify-end items-center">
//                     <button
//                       className="bg-gray-100 hover:bg-gray-200 text-sm px-4 py-2 rounded-md"
//                       onClick={() => setShowPurchaseOrderDetailModal(null)}
//                     >
//                       Back
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </>
//       )}
//       {deleteModal && (
//         <div
//           className="fixed inset-0 flex items-center justify-center bg-black/20 z-50"
//           onClick={() => {
//             setDeleteModal(false);
//             setDeleteUser(null);
//           }}
//         >
//           <div
//             className="animate-scaleIn bg-white rounded-xl w-full max-w-md relative shadow-lg border-3 border-gray-300"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <div className="flex justify-between items-center py-4 px-6 shadow-[0_2px_2px_0_#00000026]">
//               <h2 className="text-xl font-medium">
//                 Delete {deleteUser?.nameOrTitle}
//               </h2>
//               <button
//                 onClick={() => setDeleteModal(false)}
//                 className="text-xl font-bold text-gray-500 hover:text-gray-700"
//               >
//                 ×
//               </button>
//             </div>
//             <div className="mt-8 text-start pb-8 px-6 shadow-[0_2px_2px_0_#00000026]">
//               <h3 className="text-lg font-semibold mb-1">
//                 Delete{" "}
//                 {tableTitle?.endsWith("s")
//                   ? tableTitle?.slice(0, -1)
//                   : tableTitle}
//                 ?
//               </h3>
//               <p className="text-sm text-gray-700">
//                 The{" "}
//                 {tableTitle?.endsWith("s")
//                   ? tableTitle?.slice(0, -1)
//                   : tableTitle}{" "}
//                 has been remove
//               </p>
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

//       {receiptDetail && (
//         <div
//           className="fixed inset-0 flex items-center justify-center bg-black/20 z-50"
//           onClick={() => setReceiptDetail(false)}
//         >
//           <div
//             className="animate-scaleIn bg-white overflow-hidden w-[60vw] h-auto overflow-y-auto rounded-[7px] shadow-lg px-4 py-6"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <div className="flex justify-between items-center mb-3">
//               <h2 className="text-xl font-semibold text-[#056BB7]">Payment</h2>
//               <Button
//                 text="Print"
//                 className="bg-[#056BB7] text-white font-medium h-8 px-6 border-none"
//               />
//             </div>
//             <div className="flex items-center w-full mb-7 mt-4">
//               <div className="w-1/2">
//                 <div className="flex text-[15px] Poppins-font font-medium">
//                   <label htmlFor="" className="mb-1">
//                     Refrence Number: <span className="font-light">387193</span>
//                   </label>
//                 </div>
//                 <div className="flex text-[15px] Poppins-font font-medium">
//                   <label htmlFor="" className="mb-1">
//                     Payment Mode:{" "}
//                     <span className="font-light">Bank Transfer</span>
//                   </label>
//                 </div>
//               </div>
//               <div className="w-1/2">
//                 <div className="flex text-[15px] Poppins-font font-medium">
//                   <label htmlFor="" className="mb-1">
//                     Payment Date: <span className="font-light">11/4/2025</span>
//                   </label>
//                 </div>
//                 <div className="flex text-[15px] Poppins-font font-medium">
//                   <label htmlFor="" className="mb-1">
//                     Bank: <span className="font-light">abc Bank</span>
//                   </label>
//                 </div>
//               </div>
//             </div>

//             {/* <SupplierLedgerDetailTable
//               eye={true}
//               columns={payColumns}
//               data={payData}
//               marginTop="mt-4"
//               selectedRows={selectedRows}
//               onRowSelect={handleRowSelect}
//               onRowClick={(row) => console.log("Row clicked:", row)}
//             /> */}
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default AllExpensesTable;

"use client";

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
  const [rowsPerPage, setRowsPerPage] = useState(10);
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

  // Handle edit click - navigate to update page
  const handleEditClick = (row: any) => {
    if (!canUpdate) {
      toast.error("You don't have permission to edit expense");
      return;
    }

    if (row._id) {
      navigate(`/dashboard/expense/update-expense/${row._id}`);
    } else {
      console.error("Expense ID not found");
    }
  };

  return (
    <>
      <h2 className="Inter-font font-semibold text-[20px] mb-2">
        All Expenses
      </h2>

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
          <table className="w-full text-sm text-left text-gray-700 ">
            <thead className="bg-[#F9FAFB] text-black">
              <tr className="font-semibold text-[16px] whitespace-nowrap w-full">
                {columns.map((col, index) => {
                  const isFirst = index === 0;
                  const isLast = index === columns.length - 1;
                  const isSecondLast = index === columns.length - 2;

                  return (
                    <th
                      key={col.accessor}
                      className="px-4 py-3"
                      style={{ width: "max-content" }}
                    >
                      <div
                        className={`flex flex-row items-center ${
                          isFirst
                            ? "justify-start"
                            : isLast
                            ? "justify-end"
                            : isSecondLast
                            ? "justify-center"
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
                    const isSecondLast = index === columns.length - 2;

                    return (
                      <td
                        key={col.accessor}
                        className="px-4 py-2"
                        style={{ width: "max-content" }}
                      >
                        <div
                          className={`flex flex-row items-center ${
                            isFirst
                              ? "justify-start"
                              : isLast
                              ? "justify-end"
                              : isSecondLast
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
                                    className={`inline-block px-2 py-1 text-xs rounded-full ${
                                      row.status === "Active"
                                        ? "bg-green-100 text-green-600"
                                        : "bg-red-100 text-red-600"
                                    }`}
                                  >
                                    {row.status}
                                  </span>
                                );
                              case "attachReceipt":
                                return (
                                  <div className="flex justify-center gap-2">
                                    <>
                                      <span className="underline text-blue-600">
                                        {row.attachReceipt || "View"}
                                      </span>
                                      <RiFileList2Line
                                        size={20}
                                        className="cursor-pointer"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setReceiptDetail(row);
                                        }}
                                      />
                                    </>
                                  </div>
                                );
                              case "actions":
                                return (
                                  <div className="flex justify-end gap-2">
                                    {/* {eye && (
                                      <LuEye
                                        className="cursor-pointer"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setShowPurchaseOrderDetailModal(row);
                                          // navigate("purchase-order-detail");
                                        }}
                                      />
                                    )} */}

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
                                        if (!canDelete) {
                                          toast.error(
                                            "You don't have permission to delete expense"
                                          );
                                          return;
                                        }
                                        setShowDeleteModal(true);
                                        setDeleteUser(row);
                                      }}
                                    />
                                  </div>
                                );
                              default:
                                // Handle different data types
                                if (col.accessor === "date") {
                                  // Format date if needed
                                  const date = new Date(row[col.accessor]);
                                  return date.toLocaleDateString();
                                }
                                if (col.accessor === "category") {
                                  // Handle nested category object
                                  return (
                                    row.expenseCategory?.name ||
                                    row[col.accessor]
                                  );
                                }
                                if (col.accessor === "nameOrTitle") {
                                  // Map to expenseName
                                  return row.expenseName || row[col.accessor];
                                }
                                if (col.accessor === "refrence") {
                                  // Map to referenceNumber
                                  return (
                                    row.referenceNumber || row[col.accessor]
                                  );
                                }
                                if (col.accessor === "amount") {
                                  // Format amount with currency
                                  return `$${Number.parseFloat(
                                    row[col.accessor] || 0
                                  ).toFixed(2)}`;
                                }
                                return row[col.accessor];
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
