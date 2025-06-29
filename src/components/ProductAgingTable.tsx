// import React, { useState } from "react";
// import { AiOutlineDelete } from "react-icons/ai";
// import { RiEditLine } from "react-icons/ri";
// import { GoChevronLeft, GoChevronRight } from "react-icons/go";
// import { LuEye } from "react-icons/lu";

// import chainforModalImage from "../assets/chainforModalImage.png";
// import Input from "./Input";
// import Dropdown from "./Dropdown";
// import Button from "./Button";
// import { Navigate, useNavigate } from "react-router-dom";
// import { IoIosPrint } from "react-icons/io";
// import HorizontalLinearAlternativeLabelStepper from "./HorizontalLinearAlternativeLabelStepper";
// import { FaDownload } from "react-icons/fa";
// import { DatePicker } from "antd";

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

// interface ProductAgingTableProps {
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

// const ProductAgingTable: React.FC<ProductAgingTableProps> = ({
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
//   const [rowsPerPage, setRowsPerPage] = useState(10);
//   const [selectedUser, setSelectedUser] = useState<any>(null); // for modal
//   const [deleteUser, setDeleteUser] = useState<any>(null); // for modal
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [deleteModal, setDeleteModal] = useState(false);
//   const [search, setSearch] = useState(""); // ✅ Local search state
//   const [statusFilter, setStatusFilter] = useState("All"); // ✅ Status filter state
//   // To these two state variables edit user
//   const [isEditing, setIsEditing] = useState(false);
//   const [editingRow, setEditingRow] = useState<any>(null);
//   const [formData, setFormData] = useState<any>(null);
//   const [showPurchaseOrderDetailModal, setShowPurchaseOrderDetailModal] =
//     useState<any>(null); // for modal

//   const { RangePicker } = DatePicker;

//   const navigate = useNavigate();
//   const filteredData = data.filter((item) => {
//     // Create a version of the item without the status field for searching
//     const searchableItem = { ...item };
//     delete searchableItem.status;

//     const matchesSearch = Object.values(searchableItem)
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
//         className={`bg-white rounded-xl p-4 flex flex-col gap-5 overflow-hidden shadow-md ${className}`}
//       >
//         {/* Search + Filter */}
//         {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center justify-between"> */}
//         <div
//           className={`flex justify-between items-start gap-5 ${
//             data.some((item) => item.hasOwnProperty("status")) ? "" : ""
//           }`}
//         >
//           <div className="flex gap-3 flex-wrap">
//             {searchable && (
//               <Input
//                 placeholder="Search Barcode, Category"
//                 value={search}
//                 onChange={(e) => setSearch(e.target.value)}
//                 className="!rounded-3xl outline-none !w-[250px]"
//               />
//             )}
//             <RangePicker className="h-10 !text-gray-400 !border-gray-300 !w-[270px]" />
//             {/* {filterByStatus &&
//               data.some((item) => item.hasOwnProperty("status")) && ( */}
//             <Dropdown
//               // className="!w-[120px]"
//               // className="!w-[120px]"
//               options={["All", "Active", "Inactive"]}
//               // DropDownName=""
//               defaultValue="31 - 60 M"
//               onSelect={(val) => {
//                 setStatusFilter(val);
//                 setCurrentPage(1);
//               }}
//             />
//             <Dropdown
//               options={["All", "Active", "Inactive"]}
//               DropDownName="Status"
//               defaultValue="All"
//               onSelect={(val) => {
//                 setStatusFilter(val);
//                 setCurrentPage(1);
//               }}
//             />
//             {/* )} */}
//           </div>
//           <div
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
//           </div>
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
//                   const isThird = index === 3;

//                   return (
//                     <th
//                       key={col.accessor}
//                       className="px-4 py-3"
//                       style={{ width: "max-content" }}
//                     >
//                       <div
//                         className={`flex flex-row items-center ${
//                           isFirst
//                             ? "justify-center"
//                             : isLast
//                             ? "justify-end"
//                             : isThird
//                             ? "justify-start"
//                             : tableDataAlignment === "zone"
//                             ? "justify-start"
//                             : "justify-center"
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
//                     const isThird = index === 3;

//                     return (
//                       <td
//                         key={col.accessor}
//                         className="px-4 py-2"
//                         style={{ width: "max-content" }}
//                       >
//                         <div
//                           className={`flex flex-row items-center ${
//                             isFirst
//                               ? "justify-center"
//                               : isLast
//                               ? "justify-end"
//                               : isThird
//                               ? "justify-start"
//                               : tableDataAlignment === "zone"
//                               ? "justify-start"
//                               : "justify-center"
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
//                                         {row.productName}
//                                       </>
//                                     ) : (
//                                       <>{row.productName}</>
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
//                               case "actions":
//                                 return (
//                                   <div className="flex justify-end gap-2">
//                                     {eye && (
//                                       <LuEye
//                                         className="cursor-pointer"
//                                         onClick={(e) => {
//                                           e.stopPropagation();
//                                           console.log("row", row);

//                                           setShowPurchaseOrderDetailModal(row);
//                                           //   console.log(showPurchaseOrderDetailModal.category , 'showPurchaseOrderDetailModal');

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
//                                         setDeleteUser(row);
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

//       {showPurchaseOrderDetailModal && (
//         <>
//           <div
//             // className="fixed inset-0 flex items-center justify-center bg-transparent backdrop-blur-[1px] bg-opacity-40 z-50"
//             className="fixed inset-0 flex items-center justify-center bg-black/20 z-50"
//             // className="fixed inset-0 flex items-center justify-center bg-black/30 z-50"
//             onClick={() => setShowPurchaseOrderDetailModal(null)}
//           >
//             <div
//               className="animate-scaleIn bg-white rounded-xl shadow-md p-4 w-[320px]"
//               onClick={(e) => e.stopPropagation()}
//             >
//               <div className="mx-auto">
//                 {/* Head Office Badge */}
//                 {/* <div className="flex justify-end border"></div> */}

//                 {/* Image */}
//                 <div className="flex justify-center my-2">
//                   <div className="relative">
//                     <span className="bg-blue-600 absolute top-2 left-0 text-white text-xs font-semibold px-2 py-1 rounded">
//                       HEADOFFICE
//                     </span>
//                     <img
//                       src={chainforModalImage} // Replace with your actual image path or prop
//                       alt="Gold Chain"
//                       className="w-full object-contain"
//                     />
//                   </div>
//                 </div>

//                 {/* SKU and Barcode */}
//                 <div className="flex flex-wrap justify-between items-center pb-2 mb-2 px-1 text-[12px]">
//                   <span>
//                     <strong>SKU:</strong> RC9748
//                   </span>
//                   <span>
//                     <strong>BARCODE:</strong> RC9748
//                   </span>
//                 </div>

//                 {/* Details Section */}
//                 <div className="flex justify-between gap-4 text-[12px] px-1 w-full">
//                   <div className="space-y-1">
//                     <h3 className="font-bold text-gray-900">DETAIL:</h3>
//                     <div className="flex justify-between gap-4">
//                       <p>Category:</p>
//                       <p>Chain</p>
//                     </div>
//                     <div className="flex justify-between gap-4">
//                       <p>Sub Category:</p>
//                       <p>Eternal Glow</p>
//                     </div>
//                     <div className="flex justify-between gap-4">
//                       <p>Style:</p>
//                       <p>Cuban</p>
//                     </div>
//                     <div className="flex justify-between gap-4">
//                       <p>Gold Category:</p>
//                       <p>10K</p>
//                     </div>
//                     <div className="flex justify-between gap-4">
//                       <p>Diamond Weight:</p>
//                       <p>4.5 CWT</p>
//                     </div>
//                     <div className="flex justify-between gap-4">
//                       <p>Gold Weight:</p>
//                       <p>150 gms</p>
//                     </div>
//                     <div className="flex justify-between gap-4">
//                       <p>Length:</p>
//                       <p>18"</p>
//                     </div>
//                     <div className="flex justify-between gap-4">
//                       <p>MM:</p>
//                       <p>8mm</p>
//                     </div>
//                     <div className="flex justify-between gap-4">
//                       <p>Size:</p>
//                       <p>7</p>
//                     </div>
//                   </div>

//                   {/* <div className="space-y-1">

//                   </div> */}

//                   {/* Cost Price */}
//                   <div className="text-left">
//                     <h3 className="font-bold text-gray-900">COST PRICE:</h3>
//                     <p className="text-red-600 text-lg font-bold">$15.50</p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </>
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
//                 Delete {deleteUser.category}
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
//                 Delete Inventory
//                 {/* {tableTitle?.endsWith("s")
//                   ? tableTitle?.slice(0, -1)
//                   : tableTitle}
//                 ? */}
//               </h3>
//               <p className="text-sm text-gray-700">
//                 Are you sure you want to delete this{" "}
//                 {/* {tableTitle?.endsWith("s")
//                   ? tableTitle?.slice(0, -1)
//                   : tableTitle}
//                 ? */}
//                 Inventory
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
//         <div
//           // className="fixed inset-0 flex items-center justify-center bg-transparent backdrop-blur-xs bg-opacity-40 z-50"
//           className="fixed inset-0 flex items-center justify-center bg-black/20 z-50"
//           onClick={() => setIsEditing(false)}
//         >
//           <div
//             className="animate-scaleIn bg-white w-[370px] h-auto rounded-[7px] p-6 shadow-lg relative"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <form
//               onSubmit={(e) => {
//                 e.preventDefault();
//                 // Now this will log the updated data
//                 console.log("Form Submitted", formData);
//                 setIsEditing(false);
//               }}
//               className="flex flex-col gap-4"
//             >
//               <h2 className="text-lg font-semibold text-gray-800 mb-4">
//                 Edit User
//               </h2>

//               {/* Name Input - now controlled */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-600 mb-1">
//                   Name
//                 </label>
//                 <input
//                   type="text"
//                   name="name"
//                   value={formData?.name || ""}
//                   onChange={(e) =>
//                     setFormData({ ...formData, name: e.target.value })
//                   }
//                   placeholder="Enter name"
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//               </div>

//               {/* Role Input - now controlled */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-600 mb-1">
//                   Role
//                 </label>
//                 <input
//                   type="text"
//                   name="role"
//                   value={formData?.role || ""}
//                   onChange={(e) =>
//                     setFormData({ ...formData, role: e.target.value })
//                   }
//                   placeholder="Enter role"
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//               </div>

//               {/* Status Dropdown - now controlled */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-600 mb-1">
//                   Status
//                 </label>
//                 <select
//                   name="status"
//                   value={formData?.status || ""}
//                   onChange={(e) =>
//                     setFormData({ ...formData, status: e.target.value })
//                   }
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 >
//                   <option value="">Select status</option>
//                   <option value="Active">Active</option>
//                   <option value="Inactive">Inactive</option>
//                 </select>
//               </div>

//               <button
//                 type="submit"
//                 className="mt-4 w-full bg-blue-600 text-white font-semibold py-2 rounded-md hover:bg-blue-700 transition"
//               >
//                 Save Changes
//               </button>
//             </form>
//           </div>
//         </div>
//       )}

//       {deleteModal && (
//         <div
//           // className="fixed inset-0 z-50 flex items-center justify-center bg-transparent backdrop-blur-xs bg-opacity-40 transition-opacity duration-300"
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
//                 Delete {deleteUser.category}
//               </h2>
//               <button
//                 onClick={() => setDeleteModal(false)}
//                 className="text-xl font-bold text-gray-500 hover:text-gray-700"
//               >
//                 ×
//               </button>
//             </div>
//             {/* Body */}
//             <div className="mt-8 text-start pb-8 px-6 shadow-[0_2px_2px_0_#00000026]">
//               <h3 className="text-lg font-semibold mb-1">
//                 Delete Inventory
//                 {/* {tableTitle?.endsWith("s")
//                   ? tableTitle?.slice(0, -1)
//                   : tableTitle}
//                 ? */}
//               </h3>
//               <p className="text-sm text-gray-700">
//                 The Inventory{" "}
//                 {/* {tableTitle?.endsWith("s")
//                   ? tableTitle?.slice(0, -1)
//                   : tableTitle}{" "} */}
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
//     </>
//   );
// };

// export default ProductAgingTable;

// import React, { useState } from "react";
// import { AiOutlineDelete } from "react-icons/ai";
// import { RiEditLine } from "react-icons/ri";
// import { GoChevronLeft, GoChevronRight } from "react-icons/go";
// import { LuEye } from "react-icons/lu";

// import chainforModalImage from "../assets/chainforModalImage.png";
// import Input from "./Input";
// import Dropdown from "./Dropdown";
// import Button from "./Button";
// import { Navigate, useNavigate } from "react-router-dom";
// import { IoIosPrint } from "react-icons/io";
// import HorizontalLinearAlternativeLabelStepper from "./HorizontalLinearAlternativeLabelStepper";
// import { FaDownload } from "react-icons/fa";
// import { DatePicker } from "antd";

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

// interface ProductAgingTableProps {
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

// const ProductAgingTable: React.FC<ProductAgingTableProps> = ({
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
//   const [rowsPerPage, setRowsPerPage] = useState(10);
//   const [selectedUser, setSelectedUser] = useState<any>(null); // for modal
//   const [deleteUser, setDeleteUser] = useState<any>(null); // for modal
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [deleteModal, setDeleteModal] = useState(false);
//   const [search, setSearch] = useState(""); // ✅ Local search state
//   const [statusFilter, setStatusFilter] = useState("All"); // ✅ Status filter state
//   // To these two state variables edit user
//   const [isEditing, setIsEditing] = useState(false);
//   const [editingRow, setEditingRow] = useState<any>(null);
//   const [formData, setFormData] = useState<any>(null);
//   const [showPurchaseOrderDetailModal, setShowPurchaseOrderDetailModal] =
//     useState<any>(null); // for modal

//   const { RangePicker } = DatePicker;

//   const navigate = useNavigate();
//   const filteredData = data.filter((item) => {
//     // Create a version of the item without the status field for searching
//     const searchableItem = { ...item };
//     delete searchableItem.status;

//     const matchesSearch = Object.values(searchableItem)
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
//         className={`bg-white rounded-xl p-4 flex flex-col gap-5 overflow-hidden shadow-md ${className}`}
//       >
//         {/* Search + Filter */}
//         {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center justify-between"> */}
//         <div
//           className={`flex justify-between items-start gap-5 ${
//             data.some((item) => item.hasOwnProperty("status")) ? "" : ""
//           }`}
//         >
//           <div className="flex gap-3 flex-wrap">
//             {searchable && (
//               <Input
//                 placeholder="Search Barcode, Location"
//                 value={search}
//                 onChange={(e) => setSearch(e.target.value)}
//                 className="!rounded-3xl outline-none !w-[250px]"
//               />
//             )}
//             <RangePicker className="h-10 !text-gray-400 !border-gray-300 !w-[270px]" />
//             {/* {filterByStatus &&
//               data.some((item) => item.hasOwnProperty("status")) && ( */}
//             <Dropdown
//               // className="!w-[120px]"
//               // className="!w-[120px]"
//               options={["All", "Active", "Inactive"]}
//               // DropDownName=""
//               defaultValue="31 - 60 M"
//               onSelect={(val) => {
//                 setStatusFilter(val);
//                 setCurrentPage(1);
//               }}
//             />
//             <Dropdown
//               options={["All", "Active", "Inactive"]}
//               DropDownName="Status"
//               defaultValue="All"
//               onSelect={(val) => {
//                 setStatusFilter(val);
//                 setCurrentPage(1);
//               }}
//             />
//             {/* )} */}
//           </div>
//           <div
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
//           </div>
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
//                   const isThird = index === 3;

//                   return (
//                     <th
//                       key={col.accessor}
//                       className="px-4 py-3"
//                       style={{ width: "max-content" }}
//                     >
//                       <div
//                         className={`flex flex-row items-center ${
//                           isFirst
//                             ? "justify-center"
//                             : isLast
//                             ? "justify-center"
//                             : isThird
//                             ? "justify-start"
//                             : tableDataAlignment === "zone"
//                             ? "justify-start"
//                             : "justify-center"
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
//                     const isThird = index === 3;

//                     return (
//                       <td
//                         key={col.accessor}
//                         className="px-4 py-2"
//                         style={{ width: "max-content" }}
//                       >
//                         <div
//                           className={`flex flex-row items-center ${
//                             isFirst
//                               ? "justify-center"
//                               : isLast
//                               ? "justify-center"
//                               : isThird
//                               ? "justify-start"
//                               : tableDataAlignment === "zone"
//                               ? "justify-start"
//                               : "justify-center"
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
//                                         {row.productName}
//                                       </>
//                                     ) : (
//                                       <>{row.productName}</>
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
//                               case "actions":
//                                 return (
//                                   <div className="flex justify-end gap-2">
//                                     {eye && (
//                                       <LuEye
//                                         className="cursor-pointer"
//                                         onClick={(e) => {
//                                           e.stopPropagation();
//                                           console.log("row", row);

//                                           setShowPurchaseOrderDetailModal(row);
//                                           //   console.log(showPurchaseOrderDetailModal.category , 'showPurchaseOrderDetailModal');

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
//                                         setDeleteUser(row);
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

//       {showPurchaseOrderDetailModal && (
//         <>
//           <div
//             // className="fixed inset-0 flex items-center justify-center bg-transparent backdrop-blur-[1px] bg-opacity-40 z-50"
//             className="fixed inset-0 flex items-center justify-center bg-black/20 z-50"
//             // className="fixed inset-0 flex items-center justify-center bg-black/30 z-50"
//             onClick={() => setShowPurchaseOrderDetailModal(null)}
//           >
//             <div
//               className="animate-scaleIn bg-white rounded-xl shadow-md p-4 w-[320px]"
//               onClick={(e) => e.stopPropagation()}
//             >
//               <div className="mx-auto">
//                 {/* Head Office Badge */}
//                 {/* <div className="flex justify-end border"></div> */}

//                 {/* Image */}
//                 <div className="flex justify-center my-2">
//                   <div className="relative">
//                     <span className="bg-blue-600 absolute top-2 left-0 text-white text-xs font-semibold px-2 py-1 rounded">
//                       HEADOFFICE
//                     </span>
//                     <img
//                       src={chainforModalImage} // Replace with your actual image path or prop
//                       alt="Gold Chain"
//                       className="w-full object-contain"
//                     />
//                   </div>
//                 </div>

//                 {/* SKU and Barcode */}
//                 <div className="flex flex-wrap justify-between items-center pb-2 mb-2 px-1 text-[12px]">
//                   <span>
//                     <strong>SKU:</strong> RC9748
//                   </span>
//                   <span>
//                     <strong>BARCODE:</strong> RC9748
//                   </span>
//                 </div>

//                 {/* Details Section */}
//                 <div className="flex justify-between gap-4 text-[12px] px-1 w-full">
//                   <div className="space-y-1">
//                     <h3 className="font-bold text-gray-900">DETAIL:</h3>
//                     <div className="flex justify-between gap-4">
//                       <p>Category:</p>
//                       <p>Chain</p>
//                     </div>
//                     <div className="flex justify-between gap-4">
//                       <p>Sub Category:</p>
//                       <p>Eternal Glow</p>
//                     </div>
//                     <div className="flex justify-between gap-4">
//                       <p>Style:</p>
//                       <p>Cuban</p>
//                     </div>
//                     <div className="flex justify-between gap-4">
//                       <p>Gold Category:</p>
//                       <p>10K</p>
//                     </div>
//                     <div className="flex justify-between gap-4">
//                       <p>Diamond Weight:</p>
//                       <p>4.5 CWT</p>
//                     </div>
//                     <div className="flex justify-between gap-4">
//                       <p>Gold Weight:</p>
//                       <p>150 gms</p>
//                     </div>
//                     <div className="flex justify-between gap-4">
//                       <p>Length:</p>
//                       <p>18"</p>
//                     </div>
//                     <div className="flex justify-between gap-4">
//                       <p>MM:</p>
//                       <p>8mm</p>
//                     </div>
//                     <div className="flex justify-between gap-4">
//                       <p>Size:</p>
//                       <p>7</p>
//                     </div>
//                   </div>

//                   {/* <div className="space-y-1">

//                   </div> */}

//                   {/* Cost Price */}
//                   <div className="text-left">
//                     <h3 className="font-bold text-gray-900">COST PRICE:</h3>
//                     <p className="text-red-600 text-lg font-bold">$15.50</p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </>
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
//                 Delete {deleteUser.category}
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
//                 Delete Inventory
//                 {/* {tableTitle?.endsWith("s")
//                   ? tableTitle?.slice(0, -1)
//                   : tableTitle}
//                 ? */}
//               </h3>
//               <p className="text-sm text-gray-700">
//                 Are you sure you want to delete this{" "}
//                 {/* {tableTitle?.endsWith("s")
//                   ? tableTitle?.slice(0, -1)
//                   : tableTitle}
//                 ? */}
//                 Inventory
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
//         <div
//           // className="fixed inset-0 flex items-center justify-center bg-transparent backdrop-blur-xs bg-opacity-40 z-50"
//           className="fixed inset-0 flex items-center justify-center bg-black/20 z-50"
//           onClick={() => setIsEditing(false)}
//         >
//           <div
//             className="animate-scaleIn bg-white w-[370px] h-auto rounded-[7px] p-6 shadow-lg relative"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <form
//               onSubmit={(e) => {
//                 e.preventDefault();
//                 // Now this will log the updated data
//                 console.log("Form Submitted", formData);
//                 setIsEditing(false);
//               }}
//               className="flex flex-col gap-4"
//             >
//               <h2 className="text-lg font-semibold text-gray-800 mb-4">
//                 Edit User
//               </h2>

//               {/* Name Input - now controlled */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-600 mb-1">
//                   Name
//                 </label>
//                 <input
//                   type="text"
//                   name="name"
//                   value={formData?.name || ""}
//                   onChange={(e) =>
//                     setFormData({ ...formData, name: e.target.value })
//                   }
//                   placeholder="Enter name"
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//               </div>

//               {/* Role Input - now controlled */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-600 mb-1">
//                   Role
//                 </label>
//                 <input
//                   type="text"
//                   name="role"
//                   value={formData?.role || ""}
//                   onChange={(e) =>
//                     setFormData({ ...formData, role: e.target.value })
//                   }
//                   placeholder="Enter role"
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//               </div>

//               {/* Status Dropdown - now controlled */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-600 mb-1">
//                   Status
//                 </label>
//                 <select
//                   name="status"
//                   value={formData?.status || ""}
//                   onChange={(e) =>
//                     setFormData({ ...formData, status: e.target.value })
//                   }
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 >
//                   <option value="">Select status</option>
//                   <option value="Active">Active</option>
//                   <option value="Inactive">Inactive</option>
//                 </select>
//               </div>

//               <button
//                 type="submit"
//                 className="mt-4 w-full bg-blue-600 text-white font-semibold py-2 rounded-md hover:bg-blue-700 transition"
//               >
//                 Save Changes
//               </button>
//             </form>
//           </div>
//         </div>
//       )}

//       {deleteModal && (
//         <div
//           // className="fixed inset-0 z-50 flex items-center justify-center bg-transparent backdrop-blur-xs bg-opacity-40 transition-opacity duration-300"
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
//                 Delete {deleteUser.category}
//               </h2>
//               <button
//                 onClick={() => setDeleteModal(false)}
//                 className="text-xl font-bold text-gray-500 hover:text-gray-700"
//               >
//                 ×
//               </button>
//             </div>
//             {/* Body */}
//             <div className="mt-8 text-start pb-8 px-6 shadow-[0_2px_2px_0_#00000026]">
//               <h3 className="text-lg font-semibold mb-1">
//                 Delete Inventory
//                 {/* {tableTitle?.endsWith("s")
//                   ? tableTitle?.slice(0, -1)
//                   : tableTitle}
//                 ? */}
//               </h3>
//               <p className="text-sm text-gray-700">
//                 The Inventory{" "}
//                 {/* {tableTitle?.endsWith("s")
//                   ? tableTitle?.slice(0, -1)
//                   : tableTitle}{" "} */}
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
//     </>
//   );
// };

// export default ProductAgingTable;

"use client";

import type React from "react";
import { useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { RiEditLine } from "react-icons/ri";
import { GoChevronLeft, GoChevronRight } from "react-icons/go";
import { LuEye } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import { DatePicker } from "antd";

import chainforModalImage from "../assets/chainforModalImage.png";
import Input from "./Input";
import Dropdown from "./Dropdown";
import Button from "./Button";

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

interface ProductAgingTableProps {
  // eye: boolean;
  enableRowModal?: boolean;
  onRowClick?: (row: any) => void;
  className?: string;
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
  dealBy?: boolean;
}

const ProductAgingTable: React.FC<ProductAgingTableProps> = ({
  // eye,
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
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [deleteUser, setDeleteUser] = useState<any>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [isEditing, setIsEditing] = useState(false);
  const [editingRow, setEditingRow] = useState<any>(null);
  const [formData, setFormData] = useState<any>(null);
  const [showPurchaseOrderDetailModal, setShowPurchaseOrderDetailModal] =
    useState<any>(null);
  const [loading, setLoading] = useState(false); // Declare loading variable
  const [agingFilter, setAgingFilter] = useState("All");
  const [dateRange, setDateRange] = useState<[any, any] | null>(null);

  const { RangePicker } = DatePicker;
  const navigate = useNavigate();
  console.log("data", data);
  data?.map((item, index) => {
    const date = new Date(item.dateAdded);
    const formattedDate = date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

    console.log(`Item ${index + 1} - Date Added:`, formattedDate);
  });

  // Fixed filtering logic to handle objects properly
  // const filteredData = data.filter((item) => {
  //   // Create searchable string from specific fields only
  //   const searchableFields = [
  //     item.barcode,
  //     item.productFor,
  //     item.productName,
  //     item.location,
  //     item.dateAdded,
  //     item.headOfficeAging,
  //     item.storeAging,
  //     item.sno,
  //   ].filter((field) => field != null); // Remove null/undefined values

  //   const searchableText = searchableFields
  //     .map((field) => String(field).toLowerCase())
  //     .join(" ");

  //   const matchesSearch =
  //     search === "" || searchableText.includes(search.toLowerCase());

  //   const matchesStatus =
  //     statusFilter === "All" || (item.status && item.status === statusFilter);

  //   return matchesSearch && matchesStatus;
  // });

  // const filteredData = data.filter((item) => {
  //   // Create searchable string from specific fields only
  //   const searchableFields = [
  //     item.barcode,
  //     item.productFor,
  //     item.productName,
  //     item.location,
  //     item.dateAdded,
  //     item.headOfficeAging,
  //     item.storeAging,
  //     item.sno,
  //   ].filter((field) => field != null); // Remove null/undefined values

  //   const searchableText = searchableFields
  //     .map((field) => String(field).toLowerCase())
  //     .join(" ");

  //   const matchesSearch =
  //     search === "" || searchableText.includes(search.toLowerCase());

  //   const matchesStatus =
  //     statusFilter === "All" || (item.status && item.status === statusFilter);

  //   // Add aging filter logic
  //   const matchesAging = (() => {
  //     if (agingFilter === "All") return true;

  //     // Helper function to extract days from aging string (e.g., "10 D" -> 10)
  //     const extractDays = (agingStr: any) => {
  //       if (!agingStr) return 0;
  //       const match = agingStr.match(/(\d+)\s*D/i);
  //       return match ? parseInt(match[1]) : 0;
  //     };

  //     // Use headOfficeAging for filtering (you can change this logic as needed)
  //     const agingDays = extractDays(item.headOfficeAging);

  //     switch (agingFilter) {
  //       case "31 - 60 M":
  //         return agingDays >= 31 && agingDays <= 60;
  //       case "61 - 90 M":
  //         return agingDays >= 61 && agingDays <= 90;
  //       case "90+ M":
  //         return agingDays > 90;
  //       default:
  //         return true;
  //     }
  //   })();

  //   return matchesSearch && matchesStatus && matchesAging;
  // });

  const filteredData = data.filter((item) => {
    // Create searchable string from specific fields only
    const searchableFields = [
      item.barcode,
      item.productFor,
      item.productName,
      item.location,
      item.dateAdded,
      item.headOfficeAging,
      item.storeAging,
      item.sno,
    ].filter((field) => field != null);

    const searchableText = searchableFields
      .map((field) => String(field).toLowerCase())
      .join(" ");

    const matchesSearch =
      search === "" || searchableText.includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "All" || (item.status && item.status === statusFilter);

    // Add date range filter logic
    const matchesDateRange = (() => {
      if (!dateRange || !dateRange[0] || !dateRange[1]) return true;

      const itemDate = new Date(item.dateAdded);
      const startDate = new Date(dateRange[0]);
      const endDate = new Date(dateRange[1]);

      // Set time to start and end of day for proper comparison
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(23, 59, 59, 999);

      return itemDate >= startDate && itemDate <= endDate;
    })();

    // Add aging filter logic
    const matchesAging = (() => {
      if (agingFilter === "All") return true;

      // Helper function to extract days from aging string (e.g., "10 D" -> 10)
      const extractDays = (agingStr: any) => {
        if (!agingStr) return 0;
        const match = agingStr.match(/(\d+)\s*D/i);
        return match ? parseInt(match[1]) : 0;
      };

      // Use headOfficeAging for filtering (you can change this logic as needed)
      const agingDays = extractDays(item.headOfficeAging);

      switch (agingFilter) {
        case "31 - 60 M":
          return agingDays >= 31 && agingDays <= 60;
        case "61 - 90 M":
          return agingDays >= 61 && agingDays <= 90;
        case "90+ M":
          return agingDays > 90;
        default:
          return true;
      }
    })();

    return matchesSearch && matchesStatus && matchesDateRange && matchesAging;
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
        <div className={`flex justify-between items-start gap-5`}>
          <div className="flex gap-3 flex-wrap">
            {searchable && (
              <Input
                placeholder="Search Barcode, Location"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="!rounded-3xl outline-none !w-[250px]"
              />
            )}
            {/* <RangePicker className="h-10 !text-gray-400 !border-gray-300 !w-[270px]" /> */}
            <RangePicker
              className="h-10 !text-gray-400 !border-gray-300 !w-[270px]"
              onChange={(dates) => {
                setDateRange(dates);
                setCurrentPage(1);
              }}
              value={dateRange}
            />
            <Dropdown
              options={["All", "31 - 60 M", "61 - 90 M", "90+ M"]}
              defaultValue="All"
              onSelect={(val) => {
                setAgingFilter(val);
                setCurrentPage(1);
              }}
            />
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
          <div className="flex md:justify-end justify-end">
            <Button
              text="Export"
              variant="border"
              className="bg-[#5D6679] text-white w-24"
            />
          </div>
        </div>

        <p className="text-[#056BB7] font-semibold text-[24px]">{tableTitle}</p>

        <div className="bg-white rounded-xl border border-gray-300 overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-700">
            <thead className="bg-[#F9FAFB] text-black">
              <tr className="font-semibold text-[16px] whitespace-nowrap w-full">
                {columns.map((col, index) => {
                  const isFirst = index === 0;
                  const isLast = index === columns.length - 1;
                  const isThird = index === 3;

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
                            : isLast
                            ? "justify-center"
                            : isThird
                            ? "justify-start"
                            : tableDataAlignment === "zone"
                            ? "justify-start"
                            : "justify-center"
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
                  key={row.id || idx}
                  className="hover:bg-gray-50 whitespace-nowrap cursor-pointer"
                  onClick={() => {
                    if (onRowClick) {
                      onRowClick(row);
                    } else if (enableRowModal) {
                      // Handle row click
                    }
                  }}
                >
                  {columns.map((col, index) => {
                    const isFirst = index === 0;
                    const isLast = index === columns.length - 1;
                    const isThird = index === 3;

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
                              : isLast
                              ? "justify-center"
                              : isThird
                              ? "justify-start"
                              : tableDataAlignment === "zone"
                              ? "justify-start"
                              : "justify-center"
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
                                          alt="Product"
                                          className="w-8 h-8 rounded-full object-cover"
                                          onError={(e) => {
                                            e.currentTarget.style.display =
                                              "none";
                                          }}
                                        />
                                        <span>{row.productName}</span>
                                      </>
                                    ) : (
                                      <span>{row.productName}</span>
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
                                    {row.status || "N/A"}
                                  </span>
                                );
                              case "actions":
                                return (
                                  <div className="flex justify-end gap-2">
                                    <RiEditLine
                                      className="cursor-pointer"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setIsEditing(true);
                                        setEditingRow(row);
                                        setFormData({ ...row });
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
                                return (
                                  <span>{row[col.accessor] || "N/A"}</span>
                                );
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
                    {loading ? "Loading..." : "No data found."}
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
                    className={`w-8 h-8 rounded-full text-sm flex items-center justify-center transition ${
                      currentPage === num
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

      {/* Modals remain the same */}
      {showPurchaseOrderDetailModal && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black/20 z-50"
          onClick={() => setShowPurchaseOrderDetailModal(null)}
        >
          <div
            className="animate-scaleIn bg-white rounded-xl shadow-md p-4 w-[320px]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mx-auto">
              <div className="flex justify-center my-2">
                <div className="relative">
                  <span className="bg-blue-600 absolute top-2 left-0 text-white text-xs font-semibold px-2 py-1 rounded">
                    {showPurchaseOrderDetailModal.location?.toUpperCase() ||
                      "HEADOFFICE"}
                  </span>
                  <img
                    src={
                      showPurchaseOrderDetailModal.userImage ||
                      chainforModalImage
                    }
                    alt="Product"
                    className="w-full object-contain"
                    onError={(e) => {
                      e.currentTarget.src = chainforModalImage;
                    }}
                  />
                </div>
              </div>

              <div className="flex flex-wrap justify-between items-center pb-2 mb-2 px-1 text-[12px]">
                <span>
                  <strong>SKU:</strong>{" "}
                  {showPurchaseOrderDetailModal.sno || "N/A"}
                </span>
                <span>
                  <strong>BARCODE:</strong>{" "}
                  {showPurchaseOrderDetailModal.barcode || "N/A"}
                </span>
              </div>

              <div className="flex justify-between gap-4 text-[12px] px-1 w-full">
                <div className="space-y-1">
                  <h3 className="font-bold text-gray-900">DETAIL:</h3>
                  <div className="flex justify-between gap-4">
                    <p>Category:</p>
                    <p>
                      {showPurchaseOrderDetailModal.productName?.split(
                        " - "
                      )[0] || "N/A"}
                    </p>
                  </div>
                  <div className="flex justify-between gap-4">
                    <p>Sub Category:</p>
                    <p>
                      {showPurchaseOrderDetailModal.productName?.split(
                        " - "
                      )[1] || "N/A"}
                    </p>
                  </div>
                  <div className="flex justify-between gap-4">
                    <p>Stock:</p>
                    <p>{showPurchaseOrderDetailModal.stock || "0"}</p>
                  </div>
                  <div className="flex justify-between gap-4">
                    <p>Location:</p>
                    <p>{showPurchaseOrderDetailModal.location || "N/A"}</p>
                  </div>
                  <div className="flex justify-between gap-4">
                    <p>Date Added:</p>
                    <p>{showPurchaseOrderDetailModal.dateAdded || "N/A"}</p>
                  </div>
                  <div className="flex justify-between gap-4">
                    <p>Head Office Aging:</p>
                    <p>
                      {showPurchaseOrderDetailModal.headOfficeAging || "N/A"}
                    </p>
                  </div>
                  <div className="flex justify-between gap-4">
                    <p>Store Aging:</p>
                    <p>{showPurchaseOrderDetailModal.storeAging || "N/A"}</p>
                  </div>
                </div>

                <div className="text-left">
                  <h3 className="font-bold text-gray-900">COST PRICE:</h3>
                  <p className="text-red-600 text-lg font-bold">$15.50</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
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
                Delete {deleteUser?.productName?.split(" - ")[0] || "Item"}
              </h2>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="text-xl font-bold text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
            <div className="mt-8 text-start pb-8 px-6 shadow-[0_2px_2px_0_#00000026]">
              <h3 className="text-lg font-semibold mb-1">Delete Inventory</h3>
              <p className="text-sm text-gray-700">
                Are you sure you want to delete this Inventory?
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

      {/* Edit Modal */}
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
                console.log("Form Submitted", formData);
                setIsEditing(false);
              }}
              className="flex flex-col gap-4"
            >
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Edit Product
              </h2>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Product Name
                </label>
                <input
                  type="text"
                  name="productName"
                  value={formData?.productName || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, productName: e.target.value })
                  }
                  placeholder="Enter product name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Stock
                </label>
                <input
                  type="number"
                  name="stock"
                  value={formData?.stock || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, stock: e.target.value })
                  }
                  placeholder="Enter stock"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Location
                </label>
                <select
                  name="location"
                  value={formData?.location || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select location</option>
                  <option value="Head Office">Head Office</option>
                  <option value="Store">Store</option>
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
                Delete {deleteUser?.productName?.split(" - ")[0] || "Item"}
              </h2>
              <button
                onClick={() => setDeleteModal(false)}
                className="text-xl font-bold text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
            <div className="mt-8 text-start pb-8 px-6 shadow-[0_2px_2px_0_#00000026]">
              <h3 className="text-lg font-semibold mb-1">Delete Inventory</h3>
              <p className="text-sm text-gray-700">
                The Inventory has been removed
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
    </>
  );
};

export default ProductAgingTable;
