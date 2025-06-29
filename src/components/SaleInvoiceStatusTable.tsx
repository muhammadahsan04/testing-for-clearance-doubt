// import React, { useState } from "react";
// import { AiOutlineDelete } from "react-icons/ai";
// import { RiEditLine } from "react-icons/ri";
// import { GoChevronLeft, GoChevronRight } from "react-icons/go";
// import { LuEye } from "react-icons/lu";
// import chain from "../assets/chain.png";
// import braclet from "../assets/bracelet.png";
// import noseRing from "../assets/noseRing.png";
// import chainforModalImage from "../assets/chainforModalImage.png";
// import Input from "./Input";
// import Dropdown from "./Dropdown";
// import Button from "./Button";
// import { Navigate, useNavigate } from "react-router-dom";
// import { IoIosPrint } from "react-icons/io";
// import HorizontalLinearAlternativeLabelStepper from "./HorizontalLinearAlternativeLabelStepper";
// import { FaDownload } from "react-icons/fa";
// import CreateSaleInvoiceTable from "./CreateSaleInvoiceTable";

// type ColumnType = "text" | "image" | "status" | "actions" | "button" | "custom";
// interface CreateSaleInvoiceColumn {
//   header: string;
//   accessor: string;
//   type?: "text" | "image" | "status" | "actions";
// }
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

// interface SaleInvoiceStatusTableProps {
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

// const SaleInvoiceStatusTable: React.FC<SaleInvoiceStatusTableProps> = ({
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

//   const createSaleInvoiceColumns: CreateSaleInvoiceColumn[] = [
//     { header: "No", accessor: "no" },
//     { header: "Product Name", accessor: "productName", type: "image" },
//     { header: "Stock", accessor: "stock" },
//     { header: "QTY", accessor: "qty" },
//     { header: "Cost Price ($)", accessor: "costPrice" },
//     { header: "Sale Price ($)", accessor: "salePrice" },
//     // { header: "Sub Category", accessor: "subCategory" },
//     // { header: "Location", accessor: "location" },
//     // { header: "Actions", accessor: "actions", type: "actions" },
//   ];

//   const createSaleInvoiceData = [
//     {
//       no: "01",
//       productName: "1Chain - Men - Cuban - 10k - 4.5CWT",
//       userImage: chain,
//       qty: "4",
//       costPrice: "500",
//       salePrice: "500",
//       stock: "05",
//     },
//     {
//       no: "02",
//       userImage: braclet,
//       productName: "1Chain - Men - Cuban - 10k - 4.5CWT",
//       qty: "2",
//       costPrice: "500",
//       salePrice: "800",
//       stock: "100",
//     },
//     {
//       no: "03",
//       userImage: noseRing,
//       productName: "1Chain - Men - Cuban - 10k - 4.5CWT",
//       qty: "2",
//       costPrice: "500",
//       salePrice: "300",
//       stock: "49",
//     },
//   ];

//   return (
//     <>
//       <div
//         className={`bg-white rounded-xl p-4 flex flex-col gap-5 overflow-hidden shadow-md ${className}`}
//       >
//         <div
//           className={`grid gap-4 items-center justify-between md:grid-cols-2 ${
//             data.some((item) => item.hasOwnProperty("status"))
//               ? ""
//               : "grid-cols-2"
//           }`}
//         >
//           <div className="flex gap-3">
//             {searchable && (
//               <Input
//                 placeholder="Search Name, ID"
//                 value={search}
//                 onChange={(e) => setSearch(e.target.value)}
//                 className="w-auto !rounded-3xl outline-none "
//               />
//             )}

//             {/* {filterByStatus &&
//               data.some((item) => item.hasOwnProperty("status")) && ( */}
//             <Dropdown
//               options={["All", "Pending", "Received"]}
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
//             <Button
//               onClick={() => navigate("/dashboard/inventory/sale-invoice")}
//               text="Issue Inventory"
//               className="bg-[#056BB7] text-white border-none font-medium w-auto px-7 ml-2"
//             />
//           </div>
//         </div>

//         <p className="text-[#056BB7] font-semibold text-[24px]">{tableTitle}</p>

//         {/* Table */}
//         <div className="bg-white rounded-xl border border-gray-300 overflow-x-auto">
//           <table className="w-full text-sm text-left text-gray-700 ">
//             <thead className="bg-[#F9FAFB] text-black">

//               <tr className="font-semibold text-[16px] whitespace-nowrap w-full">
//                 {columns.map((col, index) => {
//                   const isFirst = index === 0;
//                   const isLast = index === columns.length - 1;

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
//                             ? "justify-center"
//                             : tableDataAlignment === "zone"
//                             ? "justify-center"
//                             : "justify-start"
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
//                                         {row.storeName}
//                                       </>
//                                     ) : (
//                                       <>{row.storeName}</>
//                                     )}
//                                   </div>
//                                 );
//                               case "status":
//                                 return (
//                                   <span
//                                     className={`inline-block px-2 py-1 text-xs rounded-full font-semibold ${
//                                       row.status === "Received"
//                                         ? " text-green-700"
//                                         : "text-orange-400"
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
//                                     {/*
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
//                                     /> */}
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
//             onClick={() => setShowPurchaseOrderDetailModal(false)}
//           >
//             <div
//               className="animate-scaleIn bg-white w-[90vw] overflow-hidden sm:w-lg md:w-[80vw] lg:w-4xl h-auto overflow-y-auto rounded-[7px] shadow-lg p-6"
//               onClick={(e) => e.stopPropagation()}
//             >
//               <CreateSaleInvoiceTable
//                 bottomBtn={false}
//                 columns={createSaleInvoiceColumns}
//                 data={createSaleInvoiceData}
//                 eye={true}
//                 tableDataAlignment="zone"
//                 // tableTitle="Users"
//                 onEdit={(row) => setSelectedUser(row)} // ✅ This opens the modal
//                 onDelete={(row) => {
//                   setSelectedUser(row); // ✅ Use the selected user
//                   setShowDeleteModal(true); // ✅ Open the delete modal
//                 }}
//               />
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

// export default SaleInvoiceStatusTable;

// "use client";

// import type React from "react";
// import { useState, useEffect, useMemo } from "react";
// import { AiOutlineDelete } from "react-icons/ai";
// import { RiEditLine } from "react-icons/ri";
// import { GoChevronLeft, GoChevronRight } from "react-icons/go";
// import { LuEye } from "react-icons/lu";
// import { toast } from "react-toastify";
// import Input from "./Input";
// import Dropdown from "./Dropdown";
// import Button from "./Button";
// import { DatePicker } from "antd";
// import dayjs, { type Dayjs } from "dayjs";

// type ColumnType = "text" | "image" | "status" | "actions" | "button" | "custom";

// interface Column {
//   header: string;
//   accessor: string;
//   type?: ColumnType;
// }

// interface SummaryData {
//   debit: number;
//   credit: number;
//   balance: number;
// }

// interface Zone {
//   _id: string;
//   name: string;
// }

// interface Store {
//   _id: string;
//   storeName: string;
// }

// interface SaleInvoiceStatusTableProps {
//   columns: Column[];
//   data: any[];
//   tableTitle?: string;
//   summaryData?: SummaryData;
//   eye?: boolean;
//   tableDataAlignment?: "zone" | "user" | "center";
//   onEdit?: (row: any) => void;
//   onDelete?: (row: any) => void;
//   onRefresh?: () => void;
//   selectedUser?: any;
//   onCloseEdit?: () => void;
// }

// const SaleInvoiceStatusTable: React.FC<SaleInvoiceStatusTableProps> = ({
//   columns,
//   data,
//   tableTitle,
//   summaryData,
//   eye,
//   tableDataAlignment = "start",
//   onEdit,
//   onDelete,
//   onRefresh,
//   selectedUser,
//   onCloseEdit,
// }) => {
//   const [currentPage, setCurrentPage] = useState(1);
//   const [rowsPerPage, setRowsPerPage] = useState(10);
//   const [deleteUser, setDeleteUser] = useState<any>(null);
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [statusFilter, setStatusFilter] = useState("all");
//   const [dateRange, setDateRange] = useState<
//     [Dayjs | null, Dayjs | null] | null
//   >(null);

//   // Edit modal states
//   const [showEditModal, setShowEditModal] = useState(false);
//   const [editFormData, setEditFormData] = useState<any>({});
//   const [zones, setZones] = useState<Zone[]>([]);
//   const [stores, setStores] = useState<Store[]>([]);
//   const [editingItems, setEditingItems] = useState<any[]>([]);

//   const API_URL = import.meta.env.VITE_BASE_URL || "http://localhost:9000";
//   const { RangePicker } = DatePicker;

//   const getAuthToken = () => {
//     let token = localStorage.getItem("token");
//     if (!token) {
//       token = sessionStorage.getItem("token");
//     }
//     return token;
//   };

//   // Open edit modal when selectedUser changes
//   useEffect(() => {
//     if (selectedUser) {
//       setEditFormData({
//         zone: selectedUser.zone?._id || "",
//         store: selectedUser.store?._id || "",
//         storeManagerName: selectedUser.storeManagerName || "",
//         dueDate: selectedUser.dueDate
//           ? new Date(selectedUser.dueDate).toISOString().split("T")[0]
//           : "",
//         description: selectedUser.description || "",
//       });
//       setEditingItems(selectedUser.items || []);
//       setShowEditModal(true);
//       fetchZones();
//       fetchStores();
//     }
//   }, [selectedUser]);

//   const fetchZones = async () => {
//     try {
//       const token = getAuthToken();
//       if (!token) return;

//       const response = await fetch(
//         `${API_URL}/api/abid-jewelry-ms/getAllZone`,
//         {
//           headers: {
//             "x-access-token": token,
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       const result = await response.json();
//       if (result.success) {
//         setZones(result.data);
//       }
//     } catch (error) {
//       console.error("Error fetching zones:", error);
//     }
//   };

//   const fetchStores = async () => {
//     try {
//       const token = getAuthToken();
//       if (!token) return;

//       const response = await fetch(
//         `${API_URL}/api/abid-jewelry-ms/getAllStore`,
//         {
//           headers: {
//             "x-access-token": token,
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       const result = await response.json();
//       if (result.success) {
//         setStores(result.data);
//       }
//     } catch (error) {
//       console.error("Error fetching stores:", error);
//     }
//   };

//   const filteredData = useMemo(() => {
//     if (!data || data.length === 0) return data;

//     return data.filter((item) => {
//       const matchesSearch =
//         searchTerm === "" ||
//         Object.values(item).some((value) =>
//           value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
//         );

//       const matchesStatus =
//         statusFilter === "all" || item.status === statusFilter;

//       const matchesDateRange =
//         !dateRange ||
//         !dateRange[0] ||
//         !dateRange[1] ||
//         (dayjs(item.invoiceDate, "DD MMM YYYY").isAfter(
//           dateRange[0].startOf("day")
//         ) &&
//           dayjs(item.invoiceDate, "DD MMM YYYY").isBefore(
//             dateRange[1].endOf("day")
//           ));

//       return matchesSearch && matchesStatus && matchesDateRange;
//     });
//   }, [data, searchTerm, statusFilter, dateRange]);

//   const totalPages = Math.ceil(filteredData.length / rowsPerPage);
//   const currentData = filteredData.slice(
//     (currentPage - 1) * rowsPerPage,
//     currentPage * rowsPerPage
//   );

//   const handleChangePage = (page: number) => {
//     if (page >= 1 && page <= totalPages) setCurrentPage(page);
//   };

//   const handleDeleteConfirm = async () => {
//     if (deleteUser && onDelete) {
//       try {
//         setLoading(true);
//         await onDelete(deleteUser);
//         setShowDeleteModal(false);
//         setDeleteUser(null);
//         if (onRefresh) {
//           onRefresh();
//         }
//       } catch (error) {
//         console.error("Error deleting invoice:", error);
//       } finally {
//         setLoading(false);
//       }
//     }
//   };

//   const handleEditSubmit = async () => {
//     try {
//       setLoading(true);
//       const token = getAuthToken();
//       if (!token) {
//         toast.error("Authentication token not found. Please login again.");
//         return;
//       }

//       // Prepare items array
//       const items = editingItems.map((item) => ({
//         item: item.item._id,
//         quantity: item.quantity,
//         costPrice: item.costPrice,
//         sellPrice: item.sellPrice,
//       }));

//       const requestBody = {
//         zone: editFormData.zone,
//         store: editFormData.store,
//         storeManagerName: editFormData.storeManagerName,
//         dueDate: editFormData.dueDate,
//         description: editFormData.description,
//         items: items,
//       };

//       const response = await fetch(
//         `${API_URL}/api/abid-jewelry-ms/updateSaleInvoice/${selectedUser._id}`,
//         {
//           method: "PUT",
//           headers: {
//             "x-access-token": token,
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify(requestBody),
//         }
//       );

//       const result = await response.json();
//       if (result.success) {
//         toast.success("Sale invoice updated successfully");
//         setShowEditModal(false);
//         if (onCloseEdit) onCloseEdit();
//         if (onRefresh) onRefresh();
//       } else {
//         toast.error(result.message || "Failed to update sale invoice");
//       }
//     } catch (error) {
//       console.error("Error updating invoice:", error);
//       toast.error("Failed to update sale invoice");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleInputChange = (field: string, value: string) => {
//     setEditFormData((prev: any) => ({
//       ...prev,
//       [field]: value,
//     }));
//   };

//   const handleItemUpdate = (index: number, field: string, value: any) => {
//     const updatedItems = [...editingItems];
//     updatedItems[index] = { ...updatedItems[index], [field]: value };
//     setEditingItems(updatedItems);
//   };

//   const handleDeleteItem = (index: number) => {
//     const updatedItems = editingItems.filter((_, i) => i !== index);
//     setEditingItems(updatedItems);
//     toast.success("Item removed successfully");
//   };

//   return (
//     <>
//       <div className="bg-white rounded-xl p-4 flex flex-col gap-4 overflow-hidden shadow-md">
//         <div className="flex justify-between items-center">
//           <h2 className="text-xl font-semibold text-[#056BB7]">Sale Invoice</h2>
//         </div>

//         {/* Filters */}
//         <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 items-center justify-between">
//           <Input
//             placeholder="Search by Name, Invoice"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="w-full !rounded-3xl"
//           />

//           <RangePicker
//             className="h-10 !text-gray-400 !border-gray-300"
//             value={dateRange}
//             onChange={(dates) => setDateRange(dates)}
//           />

//           <Dropdown
//             className="w-full md:auto"
//             options={["all", "pending", "received"]}
//             DropDownName="Status"
//             defaultValue="all"
//             onSelect={(val) => {
//               setStatusFilter(val);
//               setCurrentPage(1);
//             }}
//           />

//           <div className="flex justify-start xl:justify-end md:col-span-4 lg:col-span-1 w-full">
//             <Button
//               onClick={() => {
//                 setSearchTerm("");
//                 setStatusFilter("all");
//                 setDateRange(null);
//               }}
//               text="Reset Filters"
//               className="bg-[#056BB7] text-white border-none font-medium w-auto"
//             />
//           </div>
//         </div>

//         {/* Summary */}
//         {summaryData && (
//           <div className="bg-[#FCF3EC] py-3 px-4 rounded-md flex justify-end gap-6 text-md font-semibold">
//             <div>
//               Debit:{" "}
//               <span className="font-medium">
//                 ${summaryData.debit?.toLocaleString() || "0"}
//               </span>
//             </div>
//             <div>
//               Credit:{" "}
//               <span className="font-medium">
//                 ${summaryData.credit?.toLocaleString() || "0"}
//               </span>
//             </div>
//             <div>
//               Balance:{" "}
//               <span className="font-medium">
//                 ${summaryData.balance?.toLocaleString() || "0"}
//               </span>
//             </div>
//           </div>
//         )}

//         <p className="text-[#5D6679] font-semibold text-[24px] pl-6">
//           {tableTitle}
//         </p>

//         <div className="bg-white rounded-xl border border-gray-300 overflow-x-auto">
//           <table className="w-full text-sm text-left text-gray-700">
//             <thead className="bg-[#F9FAFB] text-black">
//               <tr className="font-semibold text-[16px] whitespace-nowrap w-full">
//                 {columns.map((col, index) => (
//                   <th
//                     key={col.accessor}
//                     className="px-8 py-3"
//                     style={{ width: "max-content" }}
//                   >
//                     <div className="flex flex-row items-center justify-center">
//                       {col.header}
//                     </div>
//                   </th>
//                 ))}
//               </tr>
//             </thead>
//             <tbody className="border-b border-gray-400">
//               {currentData.map((row, idx) => (
//                 <tr
//                   key={row._id || idx}
//                   className="hover:bg-gray-50 whitespace-nowrap cursor-pointer"
//                 >
//                   {columns.map((col, index) => {
//                     const isFirst = index === 0;
//                     const isLast = index === columns.length - 1;
//                     return (
//                       <td
//                         key={col.accessor}
//                         className="px-8 py-2"
//                         style={{ width: "max-content" }}
//                       >
//                         <div
//                           className={`flex flex-row items-center ${
//                             isFirst
//                               ? "justify-center"
//                               : isLast
//                               ? "justify-center"
//                               : "justify-center"
//                           }`}
//                         >
//                           {col.accessor === "actions" ? (
//                             <div className="flex gap-2">
//                               {eye && (
//                                 <LuEye
//                                   size={20}
//                                   className="cursor-pointer text-blue-600 hover:text-blue-800"
//                                   title="View Details"
//                                 />
//                               )}
//                               {onEdit && (
//                                 <RiEditLine
//                                   size={20}
//                                   className="cursor-pointer text-green-600 hover:text-green-800"
//                                   onClick={() => onEdit(row)}
//                                   title="Edit"
//                                 />
//                               )}
//                               {onDelete && (
//                                 <AiOutlineDelete
//                                   size={20}
//                                   className="cursor-pointer text-red-600 hover:text-red-800"
//                                   onClick={() => {
//                                     setDeleteUser(row);
//                                     setShowDeleteModal(true);
//                                   }}
//                                   title="Delete"
//                                 />
//                               )}
//                             </div>
//                           ) : col.accessor === "debit" ||
//                             col.accessor === "credit" ? (
//                             `${row[col.accessor]?.toLocaleString() || "0"}`
//                           ) : col.accessor === "status" ? (
//                             <span className="inline-block px-2 py-1 text-xs rounded-full font-semibold text-gray-500">
//                               {row[col.accessor] || "N/A"}
//                             </span>
//                           ) : (
//                             row[col.accessor] || "N/A"
//                           )}
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
//                     {loading ? "Loading..." : "No data found."}
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>

//           {/* Pagination */}
//           <div className="flex flex-col md:flex-row items-center justify-between px-4 py-4">
//             <div className="flex items-center justify-center gap-2">
//               <button
//                 onClick={() => handleChangePage(currentPage - 1)}
//                 className="w-10 h-10 rounded-full border border-gray-300 hover:bg-gray-200 flex items-center justify-center"
//                 disabled={currentPage === 1}
//               >
//                 <GoChevronLeft size={18} />
//               </button>

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

//               {currentPage > 3 && (
//                 <div>
//                   <span className="text-gray-500 px-0.5">•</span>
//                   <span className="text-gray-500 px-0.5">•</span>
//                   <span className="text-gray-500 px-0.5">•</span>
//                 </div>
//               )}

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

//               {currentPage < totalPages - 2 && totalPages > 1 && (
//                 <div>
//                   <span className="text-gray-500 px-0.5">•</span>
//                   <span className="text-gray-500 px-0.5">•</span>
//                   <span className="text-gray-500 px-0.5">•</span>
//                 </div>
//               )}

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

//       {/* Edit Modal */}
//       {showEditModal && selectedUser && (
//         <div
//           className="fixed inset-0 flex items-center justify-center bg-black/20 z-50"
//           onClick={() => {
//             setShowEditModal(false);
//             if (onCloseEdit) onCloseEdit();
//           }}
//         >
//           <div
//             className="animate-scaleIn bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative shadow-lg border-3 border-gray-300"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <div className="flex justify-between items-center py-4 px-6 shadow-[0_2px_2px_0_#00000026] sticky top-0 bg-white">
//               <h2 className="text-xl font-medium">Edit Sale Invoice</h2>
//               <button
//                 onClick={() => {
//                   setShowEditModal(false);
//                   if (onCloseEdit) onCloseEdit();
//                 }}
//                 className="text-xl font-bold text-gray-500 hover:text-gray-700"
//               >
//                 ×
//               </button>
//             </div>

//             <div className="p-6 space-y-4">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div className="flex flex-col">
//                   <label className="mb-1">
//                     Zone <span className="text-red-500">*</span>
//                   </label>
//                   <Dropdown
//                     options={zones.map((zone) => zone.name)}
//                     defaultValue={
//                       zones.find((z) => z._id === editFormData.zone)?.name ||
//                       "Select Zone"
//                     }
//                     className="w-full"
//                     onSelect={(value) => {
//                       const selectedZone = zones.find((z) => z.name === value);
//                       handleInputChange("zone", selectedZone?._id || "");
//                     }}
//                   />
//                 </div>

//                 <div className="flex flex-col">
//                   <label className="mb-1">
//                     Store <span className="text-red-500">*</span>
//                   </label>
//                   <Dropdown
//                     options={stores.map((store) => store.storeName)}
//                     defaultValue={
//                       stores.find((s) => s._id === editFormData.store)
//                         ?.storeName || "Select Store"
//                     }
//                     className="w-full"
//                     onSelect={(value) => {
//                       const selectedStore = stores.find(
//                         (s) => s.storeName === value
//                       );
//                       handleInputChange("store", selectedStore?._id || "");
//                     }}
//                   />
//                 </div>

//                 <div className="flex flex-col">
//                   <label className="mb-1">
//                     Store Manager Name <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     type="text"
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md"
//                     value={editFormData.storeManagerName}
//                     onChange={(e) =>
//                       handleInputChange("storeManagerName", e.target.value)
//                     }
//                   />
//                 </div>

//                 <div className="flex flex-col">
//                   <label className="mb-1">
//                     Due Date <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     type="date"
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md"
//                     value={editFormData.dueDate}
//                     onChange={(e) =>
//                       handleInputChange("dueDate", e.target.value)
//                     }
//                   />
//                 </div>
//               </div>

//               <div className="flex flex-col">
//                 <label className="mb-1">Description</label>
//                 <textarea
//                   rows={3}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md resize-none"
//                   value={editFormData.description}
//                   onChange={(e) =>
//                     handleInputChange("description", e.target.value)
//                   }
//                 />
//               </div>

//               {/* Items Table */}
//               <div className="mt-6">
//                 <h3 className="text-lg font-semibold mb-3">Invoice Items</h3>
//                 <div className="overflow-x-auto">
//                   <table className="w-full text-sm border border-gray-300">
//                     <thead className="bg-gray-50">
//                       <tr>
//                         <th className="px-4 py-2 text-left">Item</th>
//                         <th className="px-4 py-2 text-left">Quantity</th>
//                         <th className="px-4 py-2 text-left">Cost Price</th>
//                         <th className="px-4 py-2 text-left">Sell Price</th>
//                         <th className="px-4 py-2 text-left">Actions</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {editingItems.map((item, index) => (
//                         <tr key={index} className="border-t">
//                           <td className="px-4 py-2">
//                             {item.item?.category?.name || "Unknown Item"}
//                           </td>
//                           <td className="px-4 py-2">
//                             <input
//                               type="number"
//                               className="w-20 px-2 py-1 border border-gray-300 rounded"
//                               value={item.quantity}
//                               onChange={(e) =>
//                                 handleItemUpdate(
//                                   index,
//                                   "quantity",
//                                   Number.parseInt(e.target.value) || 0
//                                 )
//                               }
//                             />
//                           </td>
//                           <td className="px-4 py-2">
//                             <input
//                               type="number"
//                               className="w-24 px-2 py-1 border border-gray-300 rounded"
//                               value={item.costPrice}
//                               onChange={(e) =>
//                                 handleItemUpdate(
//                                   index,
//                                   "costPrice",
//                                   Number.parseFloat(e.target.value) || 0
//                                 )
//                               }
//                             />
//                           </td>
//                           <td className="px-4 py-2">
//                             <input
//                               type="number"
//                               className="w-24 px-2 py-1 border border-gray-300 rounded"
//                               value={item.sellPrice}
//                               onChange={(e) =>
//                                 handleItemUpdate(
//                                   index,
//                                   "sellPrice",
//                                   Number.parseFloat(e.target.value) || 0
//                                 )
//                               }
//                             />
//                           </td>
//                           <td className="px-4 py-2">
//                             <AiOutlineDelete
//                               className="cursor-pointer text-red-600 hover:text-red-800"
//                               onClick={() => handleDeleteItem(index)}
//                             />
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               </div>
//             </div>

//             <div className="flex justify-center gap-2 pb-3 py-4 px-6 shadow-[0_2px_2px_0_#00000026] sticky bottom-0 bg-white">
//               <button
//                 onClick={() => {
//                   setShowEditModal(false);
//                   if (onCloseEdit) onCloseEdit();
//                 }}
//                 className="px-5 py-2 rounded-md hover:bg-gray-100 border border-gray-300"
//                 disabled={loading}
//               >
//                 Cancel
//               </button>
//               <Button
//                 text={loading ? "Updating..." : "Update"}
//                 onClick={handleEditSubmit}
//                 disabled={loading}
//                 className="px-5 py-2 bg-[#056BB7] text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
//               />
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Delete Confirmation Modal */}
//       {showDeleteModal && (
//         <div
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
//               <h2 className="text-xl font-medium">Delete Sale Invoice</h2>
//               <button
//                 onClick={() => setShowDeleteModal(false)}
//                 className="text-xl font-bold text-gray-500 hover:text-gray-700"
//               >
//                 ×
//               </button>
//             </div>
//             <div className="mt-8 text-start pb-8 px-6 shadow-[0_2px_2px_0_#00000026]">
//               <h3 className="text-lg font-semibold mb-1">
//                 Delete Sale Invoice?
//               </h3>
//               <p className="text-sm text-gray-700">
//                 Are you sure you want to delete invoice "{deleteUser?.invoice}"?
//               </p>
//               <p className="text-sm text-red-600 font-medium mt-1">
//                 This action cannot be undone.
//               </p>
//             </div>

//             <div className="flex justify-center gap-2 pb-3 py-4 px-6 shadow-[0_2px_2px_0_#00000026]">
//               <button
//                 onClick={() => setShowDeleteModal(false)}
//                 className="px-5 py-1 rounded-md hover:bg-gray-100 border-none shadow-[inset_0_0_4px_#00000026]"
//                 disabled={loading}
//               >
//                 Cancel
//               </button>
//               <Button
//                 text={loading ? "Deleting..." : "Delete"}
//                 icon={!loading && <AiOutlineDelete />}
//                 onClick={handleDeleteConfirm}
//                 disabled={loading}
//                 className="!border-none px-5 py-1 bg-[#DC2626] hover:bg-red-700 text-white rounded-md flex items-center gap-1 disabled:opacity-50"
//               />
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default SaleInvoiceStatusTable;

"use client";

import type React from "react";
import { useState, useEffect, useMemo } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { RiEditLine } from "react-icons/ri";
import { GoChevronLeft, GoChevronRight } from "react-icons/go";
import { LuEye } from "react-icons/lu";
import { toast } from "react-toastify";
import Input from "./Input";
import Dropdown from "./Dropdown";
import Button from "./Button";
import { DatePicker } from "antd";
import dayjs, { type Dayjs } from "dayjs";
import SaleInvoiceDetailModal from "../pages/dashboard/Inventory/SaleInvoiceDetailModal";

type ColumnType = "text" | "image" | "status" | "actions" | "button" | "custom";

interface Column {
  header: string;
  accessor: string;
  type?: ColumnType;
}

interface SummaryData {
  debit: number;
  credit: number;
  balance: number;
}

interface Zone {
  _id: string;
  name: string;
}

interface Store {
  _id: string;
  storeName: string;
}

interface SaleInvoiceStatusTableProps {
  columns: Column[];
  data: any[];
  tableTitle?: string;
  summaryData?: SummaryData;
  eye?: boolean;
  tableDataAlignment?: "zone" | "user" | "center";
  onEdit?: (row: any) => void;
  onDelete?: (row: any) => void;
  onRefresh?: () => void;
  selectedUser?: any;
  onCloseEdit?: () => void;
  canUpdate?: boolean;
  canDelete?: boolean
}

const SaleInvoiceStatusTable: React.FC<SaleInvoiceStatusTableProps> = ({
  columns,
  data,
  tableTitle,
  summaryData,
  eye,
  tableDataAlignment = "start",
  onEdit,
  onDelete,
  onRefresh,
  selectedUser,
  onCloseEdit,
  canUpdate = true,
  canDelete = true,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [deleteUser, setDeleteUser] = useState<any>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateRange, setDateRange] = useState<
    [Dayjs | null, Dayjs | null] | null
  >(null);

  // Edit modal states
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState<any>({});
  const [zones, setZones] = useState<Zone[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [editingItems, setEditingItems] = useState<any[]>([]);

  const API_URL = import.meta.env.VITE_BASE_URL || "http://localhost:9000";
  const { RangePicker } = DatePicker;

  console.log("DATA PREVIEW", data[1]);
  // Update the SaleInvoiceDetail columns to include Actions
  const SaleInvoiceDetail = [
    { header: "Product Name", accessor: "itemdescription" },
    { header: "QTY", accessor: "qty" },
    { header: "COST PRICE ($)", accessor: "costPrice" },
    { header: "SELL PRICE ($)", accessor: "sellPrice" },
    { header: "AMOUNT ($)", accessor: "amount" },
    // { header: "Actions", accessor: "actions" },
  ];

  const [invoiceDetail, setInvoiceDetail] = useState<any>(null);
  const [isOpen, setIsOpen] = useState(false);

  const getAuthToken = () => {
    let token = localStorage.getItem("token");
    if (!token) {
      token = sessionStorage.getItem("token");
    }
    return token;
  };

  // Open edit modal when selectedUser changes
  // useEffect(() => {
  //   if (selectedUser) {
  //     setEditFormData({
  //       InvoiceId: selectedUser?._id,
  //       zone: selectedUser.zone?._id || "",
  //       store: selectedUser.store?._id || "",
  //       storeManagerName: selectedUser.storeManagerName || "",
  //       dueDate: selectedUser.dueDate
  //         ? new Date(selectedUser.dueDate).toISOString().split("T")[0]
  //         : "",
  //       description: selectedUser.description || "",
  //     });
  //     console.log("editFormData", editFormData.InvoiceId);

  //     setEditingItems(selectedUser.items || []);
  //     setShowEditModal(true);
  //     fetchZones();
  //     fetchStores();
  //   }
  // }, [selectedUser]);

  useEffect(() => {
    if (selectedUser) {
      // First fetch zones and stores
      const initializeEditModal = async () => {
        await Promise.all([fetchZones(), fetchStores()]);

        // Then set the form data after zones and stores are loaded
        setEditFormData({
          InvoiceId: selectedUser?._id,
          zone: selectedUser.zone?._id || "",
          store: selectedUser.store?._id || "",
          storeManagerName: selectedUser.storeManagerName || "",
          dueDate: selectedUser.dueDate
            ? new Date(selectedUser.dueDate).toISOString().split("T")[0]
            : "",
          description: selectedUser.description || "",
        });

        setEditingItems(selectedUser.items || []);
        setShowEditModal(true);
      };

      initializeEditModal();
    }
  }, [selectedUser]);

  const fetchZones = async () => {
    try {
      const token = getAuthToken();
      if (!token) return;

      const response = await fetch(
        `${API_URL}/api/abid-jewelry-ms/getAllZones`,
        {
          headers: {
            "x-access-token": token,
            "Content-Type": "application/json",
          },
        }
      );

      const result = await response.json();
      if (result.success) {
        setZones(result.data);
      }
    } catch (error) {
      console.error("Error fetching zones:", error);
    }
  };

  const fetchStores = async () => {
    try {
      const token = getAuthToken();
      if (!token) return;

      const response = await fetch(
        `${API_URL}/api/abid-jewelry-ms/getAllShops`,
        {
          headers: {
            "x-access-token": token,
            "Content-Type": "application/json",
          },
        }
      );

      const result = await response.json();
      if (result.success) {
        setStores(result.data);
      }
    } catch (error) {
      console.error("Error fetching stores:", error);
    }
  };

  const filteredData = useMemo(() => {
    if (!data || data.length === 0) return data;

    return data.filter((item) => {
      const matchesSearch =
        searchTerm === "" ||
        Object.values(item).some((value) =>
          value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
        );

      const matchesStatus =
        statusFilter === "all" ||
        item.status?.toLowerCase() === statusFilter.toLowerCase();

      const matchesDateRange =
        !dateRange ||
        !dateRange[0] ||
        !dateRange[1] ||
        (dayjs(item.invoiceDate, "DD MMM YYYY").isAfter(
          dateRange[0].startOf("day")
        ) &&
          dayjs(item.invoiceDate, "DD MMM YYYY").isBefore(
            dateRange[1].endOf("day")
          ));

      return matchesSearch && matchesStatus && matchesDateRange;
    });
  }, [data, searchTerm, statusFilter, dateRange]);

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const currentData = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handleChangePage = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const handleDeleteConfirm = async () => {
    if (deleteUser && onDelete) {
      try {
        setLoading(true);
        await onDelete(deleteUser);
        setShowDeleteModal(false);
        setDeleteUser(null);
        if (onRefresh) {
          onRefresh();
        }
      } catch (error) {
        console.error("Error deleting invoice:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleEditSubmit = async () => {
    try {
      setLoading(true);
      const token = getAuthToken();
      if (!token) {
        toast.error("Authentication token not found. Please login again.");
        return;
      }

      // Prepare items array
      const items = editingItems.map((item) => ({
        item: item.item._id,
        quantity: item.quantity,
        costPrice: item.costPrice,
        sellPrice: item.sellPrice,
      }));
      // console.log("ITEM ID", items?.item);

      const requestBody = {
        zone: editFormData.zone,
        store: editFormData.store,
        storeManagerName: editFormData.storeManagerName,
        dueDate: editFormData.dueDate,
        description: editFormData.description,
        items: items,
      };

      const response = await fetch(
        `${API_URL}/api/abid-jewelry-ms/updateSaleInvoice/${selectedUser._id}`,
        {
          method: "PUT",
          headers: {
            "x-access-token": token,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );

      const result = await response.json();
      if (result.success) {
        toast.success("Sale invoice updated successfully");
        setShowEditModal(false);
        if (onCloseEdit) onCloseEdit();
        if (onRefresh) onRefresh();
      } else {
        toast.error(result.message || "Failed to update sale invoice");
      }
    } catch (error) {
      console.error("Error updating invoice:", error);
      toast.error("Failed to update sale invoice");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setEditFormData((prev: any) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleItemUpdate = (index: number, field: string, value: any) => {
    const updatedItems = [...editingItems];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    setEditingItems(updatedItems);
  };

  // const handleDeleteInvoiceItem = async (itemId: string) => {
  //   try {
  //     const token = getAuthToken();
  //     if (!token) {
  //       toast.error("Authentication token not found. Please login again.");
  //       return;
  //     }

  //     const response = await fetch(
  //       `${API_URL}/api/abid-jewelry-ms/deleteSaleInvoiceItem/${invoiceData._id}/${itemId}`,
  //       {
  //         method: "DELETE",
  //         headers: {
  //           "x-access-token": token,
  //           "Content-Type": "application/json",
  //         },
  //       }
  //     );

  //     const result = await response.json();
  //     if (result.success) {
  //       toast.success("Invoice item deleted successfully");
  //       // You might want to refresh the data or close the modal
  //       // onClose(); // or call a refresh function if available
  //     } else {
  //       toast.error(result.message || "Failed to delete invoice item");
  //     }
  //   } catch (error) {
  //     console.error("Error deleting invoice item:", error);
  //     toast.error("Failed to delete invoice item");
  //   }
  // };

  // Update the handleDeleteInvoiceItem function to use invoiceDetail
  // const handleDeleteInvoiceItem = async (itemId: string) => {
  //   try {
  //     const token = getAuthToken();
  //     if (!token) {
  //       toast.error("Authentication token not found. Please login again.");
  //       return;
  //     }

  //     const response = await fetch(
  //       `${API_URL}/api/abid-jewelry-ms/deleteSaleInvoiceItem/${invoiceDetail._id}/${itemId}`, // Change invoiceData to invoiceDetail
  //       {
  //         method: "DELETE",
  //         headers: {
  //           "x-access-token": token,
  //           "Content-Type": "application/json",
  //         },
  //       }
  //     );

  //     const result = await response.json();
  //     if (result.success) {
  //       toast.success("Invoice item deleted successfully");
  //       // Refresh the invoice details
  //       setInvoiceDetail(null);
  //       setIsOpen(false);
  //     } else {
  //       toast.error(result.message || "Failed to delete invoice item");
  //     }
  //   } catch (error) {
  //     console.log("invoiceDetail._id", itemId);
  //     console.error("Error deleting invoice item:", error);
  //     toast.error("Failed to delete invoice item");
  //   }
  // };

  // Add this function inside the SaleInvoiceStatusTable component
  const handleDeleteEditingItem = async (itemId: string) => {
    try {
      const token = getAuthToken();
      if (!token) {
        toast.error("Authentication token not found. Please login again.");
        return;
      }

      const response = await fetch(
        `${API_URL}/api/abid-jewelry-ms/deleteSaleInvoiceItem/${selectedUser._id}/${itemId}`,
        {
          method: "DELETE",
          headers: {
            "x-access-token": token,
            "Content-Type": "application/json",
          },
        }
      );

      const result = await response.json();
      if (result.success) {
        toast.success("Invoice item deleted successfully");
        // Remove the item from editingItems array
        const updatedItems = editingItems.filter((item) => item._id !== itemId);
        setEditingItems(updatedItems);
      } else {
        toast.error(result.message || "Failed to delete invoice item");
      }
    } catch (error) {
      console.error("Error deleting invoice item:", error);
      toast.error("Failed to delete invoice item");
    }
  };

  const handleViewDetails = async (row: any) => {
    try {
      setLoading(true);
      const token = getAuthToken();
      if (!token) {
        toast.error("Authentication token not found. Please login again.");
        return;
      }

      const response = await fetch(
        `${API_URL}/api/abid-jewelry-ms/getOneSaleInvoice/${row._id}`,
        {
          headers: {
            "x-access-token": token,
            "Content-Type": "application/json",
          },
        }
      );

      const result = await response.json();
      if (result.success) {
        // Transform items data for the modal
        console.log("result.data.items", result.data.items);

        const transformedItems = result.data.items.map((item: any) => ({
          itemId: item._id, // Add this line to include the item ID
          itemdescription:
            item.item?.category?.name || item.item?.barcode || "N/A",
          qty: item.quantity,
          costPrice: item.costPrice,
          sellPrice: item.sellPrice,
          amount: item.totalSell || item.quantity * item.sellPrice,
          productImage: item.item.itemImage
            ? `${API_URL}${item.item.itemImage}`
            : null,
        }));

        setInvoiceDetail({
          ...result.data,
          transformedItems,
        });
        setIsOpen(true);
      } else {
        toast.error("Failed to fetch invoice details");
      }
    } catch (error) {
      console.error("Error fetching invoice details:", error);
      toast.error("Failed to fetch invoice details");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="bg-white rounded-xl p-4 flex flex-col gap-4 overflow-hidden shadow-md">
        {/* <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-[#056BB7]">Sale Invoice</h2>
        </div> */}

        {/* Filters */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 items-center justify-between">
          <Input
            placeholder="Search by Name, Invoice"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full !rounded-3xl"
          />

          <RangePicker
            className="h-10 !text-gray-400 !border-gray-300"
            value={dateRange}
            onChange={(dates) => setDateRange(dates)}
          />

          <Dropdown
            key={statusFilter} // Add this key to force re-render
            className="w-full md:auto"
            options={["all", "pending", "received"]}
            DropDownName="Status"
            defaultValue={statusFilter} // Use statusFilter state instead of hardcoded "all"
            onSelect={(val) => {
              setStatusFilter(val);
              setCurrentPage(1);
            }}
          />



          <div className="flex justify-start xl:justify-end md:col-span-4 lg:col-span-1 w-full">
            <Button
              onClick={() => {
                setSearchTerm("");
                setStatusFilter("all");
                setDateRange(null);
                setCurrentPage(1); // Add this line
              }}
              text="Reset Filters"
              className="bg-[#056BB7] text-white border-none font-medium w-auto"
            />
          </div>
        </div>

        {/* Summary */}
        {/* {summaryData && (
          <div className="bg-[#FCF3EC] py-3 px-4 rounded-md flex justify-end gap-6 text-md font-semibold">
            <div>
              Debit: <span className="font-medium">${summaryData.debit?.toLocaleString() || "0"}</span>
            </div>
            <div>
              Credit: <span className="font-medium">${summaryData.credit?.toLocaleString() || "0"}</span>
            </div>
            <div>
              Balance: <span className="font-medium">${summaryData.balance?.toLocaleString() || "0"}</span>
            </div>
          </div>
        )} */}

        <p className="text-[#056BB7] font-semibold text-[24px]">
          {tableTitle}
        </p>

        <div className="bg-white rounded-xl border border-gray-300 overflow-x-auto">
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
            <tbody className="border-b border-gray-400">
              {currentData.map((row, idx) => (
                <tr
                  key={row._id || idx}
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
                          className={`flex flex-row items-center ${isFirst
                            ? "justify-center"
                            : isLast
                              ? "justify-center"
                              : "justify-center"
                            }`}
                        >
                          {col.accessor === "actions" ? (
                            <div className="flex gap-2">
                              {eye && (
                                <LuEye
                                  size={20}
                                  className="cursor-pointer text-blue-600 hover:text-blue-800"
                                  onClick={() => handleViewDetails(row)}
                                  title="View Details"
                                />
                              )}
                              {onEdit && (
                                <RiEditLine
                                  size={20}
                                  className="cursor-pointer text-green-600 hover:text-green-800"
                                  onClick={() => {
                                    if (!canUpdate) {
                                      toast.error("You don't have permission to edit sale invoice status");
                                      return
                                    }
                                    onEdit(row)
                                  }
                                  }
                                  title="Edit"
                                />
                              )}
                              {onDelete && (
                                <AiOutlineDelete
                                  size={20}
                                  className="cursor-pointer text-red-600 hover:text-red-800"
                                  onClick={() => {
                                    if (!canDelete) {
                                      toast.error("You don't have permission to delete  sale invoice status");
                                      return
                                    }
                                    setDeleteUser(row);
                                    setShowDeleteModal(true);
                                  }}
                                  title="Delete"
                                />
                              )}
                            </div>
                          ) : col.accessor === "debit" ||
                            col.accessor === "credit" ? (
                            `${row[col.accessor]?.toLocaleString() || "0"}`
                          ) : col.accessor === "status" ? (
                            <span className="inline-block px-2 py-1 text-xs rounded-full font-semibold text-gray-500">
                              {row[col.accessor] || "N/A"}
                            </span>
                          ) : (
                            row[col.accessor] || "N/A"
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
                    {loading ? "Loading..." : "No data found."}
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
      </div>

      {/* Edit Modal */}
      {showEditModal && selectedUser && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black/20 z-50"
          onClick={() => {
            setShowEditModal(false);
            if (onCloseEdit) onCloseEdit();
          }}
        >
          <div
            className="animate-scaleIn bg-white w-[90vw] max-w-4xl max-h-[90vh] overflow-y-auto rounded-lg shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center py-4 px-6 shadow-[0_2px_2px_0_#00000026] sticky top-0 bg-white z-20">
              <h2 className="text-xl font-medium">Edit Sale Invoice</h2>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  if (onCloseEdit) onCloseEdit();
                }}
                className="text-xl font-bold text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label className="mb-1">
                    Zone <span className="text-red-500">*</span>
                  </label>
                  <Dropdown
                    options={zones.map((zone) => zone.name)}
                    defaultValue={
                      zones.find((z) => z._id === editFormData.zone)?.name ||
                      "Select Zone"
                    }
                    className="w-full"
                    onSelect={(value) => {
                      const selectedZone = zones.find((z) => z.name === value);
                      handleInputChange("zone", selectedZone?._id || "");
                    }}
                  />
                </div>

                <div className="flex flex-col">
                  <label className="mb-1">
                    Store <span className="text-red-500">*</span>
                  </label>
                  <Dropdown
                    options={stores.map((store) => store.storeName)}
                    defaultValue={
                      stores.find((s) => s._id === editFormData.store)
                        ?.storeName || "Select Store"
                    }
                    className="w-full"
                    onSelect={(value) => {
                      const selectedStore = stores.find(
                        (s) => s.storeName === value
                      );
                      handleInputChange("store", selectedStore?._id || "");
                    }}
                  />
                </div>

                <div className="flex flex-col">
                  <label className="mb-1">
                    Store Manager Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    value={editFormData.storeManagerName}
                    onChange={(e) =>
                      handleInputChange("storeManagerName", e.target.value)
                    }
                  />
                </div>

                <div className="flex flex-col">
                  <label className="mb-1">
                    Due Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    value={editFormData.dueDate}
                    onChange={(e) =>
                      handleInputChange("dueDate", e.target.value)
                    }
                  />
                </div>
              </div>

              <div className="flex flex-col">
                <label className="mb-1">Description</label>
                <textarea
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md resize-none"
                  value={editFormData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                />
              </div>

              {/* Items Table */}
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-3">Invoice Items</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border border-gray-300">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left">Item</th>
                        <th className="px-4 py-2 text-left">Stock</th>
                        <th className="px-4 py-2 text-left">Quantity</th>
                        <th className="px-4 py-2 text-left">Cost Price</th>
                        <th className="px-4 py-2 text-left">Sell Price</th>
                        <th className="px-4 py-2 text-left">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {editingItems.map((item, index) => (
                        <tr key={index} className="border-t">
                          <td className="px-4 py-2">
                            {item.item?.category?.name || "Unknown Item"}
                          </td>
                          <td className="px-4 py-2">
                            {item.item?.category?.name || "Unknown Item"}
                          </td>
                          <td className="px-4 py-2">
                            <input
                              type="number"
                              className="w-20 px-2 py-1 border border-gray-300 rounded"
                              value={item.quantity}
                              onChange={(e) =>
                                handleItemUpdate(
                                  index,
                                  "quantity",
                                  Number.parseInt(e.target.value) || 0
                                )
                              }
                            />
                          </td>
                          <td className="px-4 py-2">
                            <input
                              type="number"
                              className="w-24 px-2 py-1 border border-gray-300 rounded"
                              value={item.costPrice}
                              onChange={(e) =>
                                handleItemUpdate(
                                  index,
                                  "costPrice",
                                  Number.parseFloat(e.target.value) || 0
                                )
                              }
                            />
                          </td>
                          <td className="px-4 py-2">
                            <input
                              type="number"
                              className="w-24 px-2 py-1 border border-gray-300 rounded"
                              value={item.sellPrice}
                              onChange={(e) =>
                                handleItemUpdate(
                                  index,
                                  "sellPrice",
                                  Number.parseFloat(e.target.value) || 0
                                )
                              }
                            />
                          </td>
                          <td className="px-4 py-2">
                            <AiOutlineDelete
                              className="cursor-pointer text-red-600 hover:text-red-800"
                              onClick={() => handleDeleteEditingItem(item._id)} // Change this line
                              title="Delete Item"
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="flex justify-center gap-2 pb-3 py-4 px-6 shadow-[0_2px_2px_0_#00000026] sticky bottom-0 bg-white">
              <button
                onClick={() => {
                  setShowEditModal(false);
                  if (onCloseEdit) onCloseEdit();
                }}
                className="px-5 py-2 rounded-md hover:bg-gray-100 border border-gray-300"
                disabled={loading}
              >
                Cancel
              </button>
              <Button
                text={loading ? "Updating..." : "Update"}
                onClick={handleEditSubmit}
                disabled={loading}
                className="px-5 py-2 bg-[#056BB7] text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              />
            </div>
          </div>
        </div>
      )}

      {/* Invoice Detail Modal */}
      {invoiceDetail && (
        <SaleInvoiceDetailModal
          isOpen={true}
          onClose={() => {
            setInvoiceDetail(null);
            setIsOpen(false);
          }}
          columns={SaleInvoiceDetail}
          data={invoiceDetail.transformedItems || []}
          invoiceData={invoiceDetail}
        // onDeleteItem={handleDeleteInvoiceItem}
        />
      )}

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
              <h2 className="text-xl font-medium">Delete Sale Invoice</h2>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="text-xl font-bold text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
            <div className="mt-8 text-start pb-8 px-6 shadow-[0_2px_2px_0_#00000026]">
              <h3 className="text-lg font-semibold mb-1">
                Delete Sale Invoice?
              </h3>
              <p className="text-sm text-gray-700">
                Are you sure you want to delete invoice "{deleteUser?.invoice}"?
              </p>
              <p className="text-sm text-red-600 font-medium mt-1">
                This action cannot be undone.
              </p>
            </div>

            <div className="flex justify-center gap-2 pb-3 py-4 px-6 shadow-[0_2px_2px_0_#00000026]">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-5 py-1 rounded-md hover:bg-gray-100 border-none shadow-[inset_0_0_4px_#00000026]"
                disabled={loading}
              >
                Cancel
              </button>
              <Button
                text={loading ? "Deleting..." : "Delete"}
                icon={!loading && <AiOutlineDelete />}
                onClick={handleDeleteConfirm}
                disabled={loading}
                className="!border-none px-5 py-1 bg-[#DC2626] hover:bg-red-700 text-white rounded-md flex items-center gap-1 disabled:opacity-50"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SaleInvoiceStatusTable;
