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

// interface CreateSaleInvoiceTableProps {
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
//   bottomBtn?: boolean;
// }

// const CreateSaleInvoiceTable: React.FC<CreateSaleInvoiceTableProps> = ({
//   bottomBtn,
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

//   return (
//     <>
//       <div
//         className={`my-4 bg-white rounded-xl flex flex-col gap-5 overflow-hidden shadow-md ${className}`}
//       >
//         {/* Search + Filter */}
//         {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center justify-between"> */}

//         {/* Table */}
//         {/* <div className="bg-white rounded-xl border border-gray-300 overflow-x-auto"> */}
//         <table className="w-full text-sm text-left text-gray-700 ">
//           <thead className="bg-[#F9FAFB] text-black">
//             {/* <tr className="font-semibold text-[16px] whitespace-nowrap border-2">
//                 {columns.map((col) => (
//                   <th key={col.accessor} className="px-6 py-3">
//                     {col.header}
//                   </th>
//                 ))}
//               </tr> */}

//             <tr className="font-semibold text-[16px] whitespace-nowrap w-full">
//               {columns.map((col, index) => {
//                 const isFirst = index === 0;
//                 const isSecond = index === 1;
//                 const isLast = index === columns.length - 1;

//                 return (
//                   <th
//                     key={col.accessor}
//                     className="px-4 py-3"
//                     style={{ width: "max-content" }}
//                   >
//                     <div
//                       className={`flex flex-row items-center ${
//                         isFirst
//                           ? "justify-center"
//                           : isSecond
//                           ? "justify-start"
//                           : isLast
//                           ? "justify-end"
//                           : tableDataAlignment === "zone"
//                           ? "justify-center"
//                           : "justify-start"
//                         // : "justify-center" for zone
//                         // "justify-start"
//                       }`}
//                     >
//                       {col.header}
//                     </div>
//                   </th>
//                 );
//               })}
//             </tr>
//           </thead>
//           <tbody className="border-gray-400">
//             {currentData.map((row, idx) => (
//               <tr
//                 key={idx}
//                 className="hover:bg-gray-50 whitespace-nowrap cursor-pointer"
//                 // onClick={() => {
//                 //   // Custom behavior per table usage OLD
//                 //   if (onRowClick) {
//                 //     onRowClick(row);
//                 //   } else {
//                 //     setSelectedUser(row);
//                 //   }
//                 // }}
//                 onClick={() => {
//                   //NEW
//                   if (onRowClick) {
//                     onRowClick(row);
//                   } else if (enableRowModal) {
//                     //   setSelectedUser(row);
//                   }
//                 }}
//               >
//                 {columns.map((col, index) => {
//                   const isFirst = index === 0;
//                   const isSecond = index === 1;
//                   const isLast = index === columns.length - 1;

//                   return (
//                     <td
//                       key={col.accessor}
//                       className="px-4 py-2"
//                       style={{ width: "max-content" }}
//                     >
//                       <div
//                         className={`flex flex-row items-center ${
//                           isFirst
//                             ? "justify-center"
//                             : isSecond
//                             ? "justify-start"
//                             : isLast
//                             ? "justify-center"
//                             : tableDataAlignment === "zone"
//                             ? "justify-center"
//                             : "justify-start"
//                           // : "justify-center" for zone
//                           // "justify-start"
//                         }`}
//                       >
//                         {(() => {
//                           switch (col.type) {
//                             case "image":
//                               return (
//                                 <div className="flex gap-2 items-center">
//                                   {row.userImage ? (
//                                     <>
//                                       <img
//                                         src={row.userImage}
//                                         alt="User"
//                                         className="w-8 h-8 rounded-full"
//                                       />
//                                       {row.productName}
//                                     </>
//                                   ) : (
//                                     <>{row.productName}</>
//                                   )}
//                                 </div>
//                               );
//                             case "status":
//                               return (
//                                 <span
//                                   className={`inline-block px-2 py-1 text-xs rounded-full ${
//                                     row.status === "Active"
//                                       ? "bg-green-100 text-green-600"
//                                       : "bg-red-100 text-red-600"
//                                   }`}
//                                 >
//                                   {row.status}
//                                 </span>
//                               );
//                             case "actions":
//                               return (
//                                 <div className="flex justify-end gap-2">
//                                   {eye && (
//                                     <LuEye
//                                       className="cursor-pointer"
//                                       onClick={(e) => {
//                                         e.stopPropagation();
//                                         console.log("row", row);

//                                         setShowPurchaseOrderDetailModal(row);
//                                         //   console.log(showPurchaseOrderDetailModal.category , 'showPurchaseOrderDetailModal');

//                                         // navigate("purchase-order-detail");
//                                       }}
//                                     />
//                                   )}
//                                   {/* <RiEditLine
//                                       className="cursor-pointer"
//                                       onClick={(e) => {
//                                         e.stopPropagation();
//                                         setIsEditing(true); // Set isEditing to true
//                                         setEditingRow(row); // Store the row data in editingRow
//                                       }}
//                                     /> */}

//                                   <RiEditLine
//                                     className="cursor-pointer"
//                                     onClick={(e) => {
//                                       e.stopPropagation();
//                                       setIsEditing(true);
//                                       setEditingRow(row);
//                                       setFormData({ ...row }); // Initialize form data with the row data
//                                     }}
//                                   />

//                                   <AiOutlineDelete
//                                     className="cursor-pointer hover:text-red-500"
//                                     onClick={(e) => {
//                                       e.stopPropagation();
//                                       setShowDeleteModal(true);
//                                       setDeleteUser(row);
//                                     }}
//                                   />
//                                 </div>
//                               );
//                             default:
//                               return <>{row[col.accessor]}</>;
//                           }
//                         })()}
//                       </div>
//                     </td>
//                   );
//                 })}
//               </tr>
//             ))}
//             {currentData.length === 0 && (
//               <tr>
//                 <td
//                   colSpan={columns.length}
//                   className="text-center py-6 text-gray-500"
//                 >
//                   No data found.
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//         {/* </div> */}
//       </div>
//       {bottomBtn && (
//         <div className="flex justify-end gap-4  Poppins-font font-medium mt-3">
//           <Button text="Back" className="px-6 !bg-[#F4F4F5] !border-none " />
//           <Button
//             text="Sale Invoice"
//             className="px-6 !bg-[#056BB7] border-none text-white"
//           />
//         </div>
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

// export default CreateSaleInvoiceTable;

import React, { useEffect, useState } from "react";
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
import { toast } from "react-toastify";
import axios from "axios";

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
  selectedZone?: string;
  selectedStore?: string;
  managerName?: string;
  dueDate?: string;
  onInvoiceCreated?: () => void; // Add this new prop
  onClose?: () => void;
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
  selectedZone,
  selectedStore,
  managerName,
  dueDate,
  onInvoiceCreated, // Add this prop
  onClose,
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
  const [invoiceData, setInvoiceData] = useState<{
    [key: string]: { qty: string; salePrice: string };
  }>({});

  const navigate = useNavigate();

  useEffect(() => {
    const initialData: { [key: string]: { qty: string; salePrice: string } } =
      {};
    data.forEach((item, index) => {
      const key = item._id || index.toString();
      initialData[key] = {
        qty: item.qty || "",
        salePrice: item.salePrice || "",
      };
    });
    setInvoiceData(initialData);
  }, [data]);

  // Initialize invoice data when data changes
  useEffect(() => {
    const initialData: { [key: string]: { qty: string; salePrice: string } } =
      {};
    data.forEach((item, index) => {
      const key = item._id || index.toString();
      initialData[key] = {
        qty: item.qty || "",
        salePrice: item.salePrice || "",
      };
    });
    setInvoiceData(initialData);
  }, [data]);

  const handleInputChange = (
    rowKey: string,
    field: "qty" | "salePrice",
    value: string
  ) => {
    setInvoiceData((prev) => ({
      ...prev,
      [rowKey]: {
        ...prev[rowKey],
        [field]: value,
      },
    }));
  };

  // const createSaleInvoice = async (invoiceData: any) => {
  //   try {
  //     const API_URL = import.meta.env.VITE_BASE_URL || "http://localhost:9000";
  //     const token =
  //       localStorage.getItem("token") || sessionStorage.getItem("token");

  //     if (!token) {
  //       toast.error("Authentication token not found. Please login again.");
  //       return;
  //     }

  //     const response = await axios.post(
  //       `${API_URL}/api/abid-jewelry-ms/addSaleInvoice`,
  //       invoiceData,
  //       {
  //         headers: {
  //           "x-access-token": token,
  //           "Content-Type": "application/json",
  //         },
  //       }
  //     );

  //     if (response.data.success) {
  //       toast.success("Sale invoice created successfully!");
  //       return response.data;
  //     } else {
  //       toast.error(response.data.message || "Failed to create sale invoice1");
  //     }
  //   } catch (error) {
  //     console.error("Error creating sale invoice:", error);
  //     toast.error("Failed to create sale invoice2");
  //   }
  // };

  const createSaleInvoice = async (invoiceData: any) => {
    try {
      const API_URL = import.meta.env.VITE_BASE_URL || "http://localhost:9000";
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");

      if (!token) {
        toast.error("Authentication token not found. Please login again.");
        return;
      }

      console.log("Sending payload to API:", invoiceData);

      const response = await axios.post(
        `${API_URL}/api/abid-jewelry-ms/addSaleInvoice`,
        invoiceData,
        {
          headers: {
            "x-access-token": token,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        toast.success("Sale invoice created successfully!");
        // Close the modal after successful creation
        if (onInvoiceCreated) {
          onInvoiceCreated();
        }

        return response.data;
      } else {
        toast.error(response.data.message || "Failed to create sale invoice");
        console.error("API Error Response:", response.data);
      }
    } catch (error) {
      console.error("Error creating sale invoice:", error);

      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || error.message;
        const errorDetails =
          error.response?.data?.details || error.response?.data;

        console.error("API Error Details:", errorDetails);
        toast.error(`Failed to create sale invoice: ${errorMessage}`);
      } else {
        toast.error("Failed to create sale invoice");
      }
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
  // console.log("DATA", isEditing);

  return (
    <>
      <div
        className={`my-4 bg-white rounded-xl flex flex-col gap-5 overflow-hidden shadow-md ${className}`}
      >
        <table className="w-full text-sm text-left text-gray-700 ">
          <thead className="bg-[#F9FAFB] text-black">
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
            {currentData.map((row, idx) => {
              const rowKey = row._id || idx.toString();

              return (
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
                                          alt="Product"
                                          className="w-8 h-8 rounded-full object-cover"
                                          onError={(e) => {
                                            e.currentTarget.style.display =
                                              "none";
                                          }}
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
                                          setShowPurchaseOrderDetailModal(row);
                                        }}
                                      />
                                    )}
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
                                if (col.accessor === "qty") {
                                  return (
                                    <input
                                      type="number"
                                      min="1"
                                      max={parseInt(row.stock) || 999}
                                      value={invoiceData[rowKey]?.qty || ""}
                                      onChange={(e) => {
                                        e.stopPropagation();
                                        handleInputChange(
                                          rowKey,
                                          "qty",
                                          e.target.value
                                        );
                                      }}
                                      onClick={(e) => e.stopPropagation()}
                                      placeholder="Enter qty"
                                      className="w-16 px-2 py-1 border border-gray-300 rounded text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                  );
                                } else if (col.accessor === "salePrice") {
                                  return (
                                    <input
                                      type="number"
                                      min="0"
                                      step="0.01"
                                      value={
                                        invoiceData[rowKey]?.salePrice || ""
                                      }
                                      onChange={(e) => {
                                        e.stopPropagation();
                                        handleInputChange(
                                          rowKey,
                                          "salePrice",
                                          e.target.value
                                        );
                                      }}
                                      onClick={(e) => e.stopPropagation()}
                                      placeholder="Enter price"
                                      className="w-20 px-2 py-1 border border-gray-300 rounded text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                  );
                                } else if (col.accessor === "costPrice") {
                                  // Make cost price read-only and show actual cost price
                                  return (
                                    <span className="text-gray-700">
                                      {row.originalData?.items?.costPrice ||
                                        row.costPrice ||
                                        "0"}
                                    </span>
                                  );
                                }
                                return <>{row[col.accessor]}</>;
                            }
                          })()}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
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

      {bottomBtn && (
        <div className="flex justify-end gap-4 Poppins-font font-medium mt-3">
          <Button
            text="Back"
            className="px-6 !bg-[#F4F4F5] !border-none "
            onClick={() => {
              if (onClose) {
                onClose();
              }
            }}
          />
          {/* <Button
            text="Sale Invoice"
            className="px-6 !bg-[#056BB7] border-none text-white"
            onClick={() => {
              // Collect all invoice data with quantities and sale prices
              const invoiceItems = data.map((item, index) => {
                const rowKey = item._id || index.toString();
                return {
                  ...item,
                  qty: invoiceData[rowKey]?.qty || "",
                  salePrice: invoiceData[rowKey]?.salePrice || "",
                };
              });

              // Validate that all items have qty and salePrice
              const invalidItems = invoiceItems.filter(
                (item) => !item.qty || !item.salePrice
              );
              if (invalidItems.length > 0) {
                toast.error(
                  "Please enter quantity and sale price for all items."
                );
                return;
              }

              console.log("Sale Invoice Data:", invoiceItems);
              // Here you can process the invoice data (send to API, etc.)
            }}
          /> */}

          <Button
            text="Sale Invoice"
            className="px-6 !bg-[#056BB7] border-none text-white"
            // onClick={async () => {
            //   // Collect all invoice data with quantities and sale prices
            //   const invoiceItems = data.map((item, index) => {
            //     const rowKey = item._id || index.toString();
            //     return {
            //       ...item,
            //       qty: invoiceData[rowKey]?.qty || "",
            //       salePrice: invoiceData[rowKey]?.salePrice || "",
            //     };
            //   });

            //   // Validate that all items have qty and salePrice
            //   const invalidItems = invoiceItems.filter(
            //     (item) => !item.qty || !item.salePrice
            //   );
            //   if (invalidItems.length > 0) {
            //     toast.error(
            //       "Please enter quantity and sale price for all items."
            //     );
            //     return;
            //   }

            //   // Validate required fields
            //   if (!selectedZone || !selectedStore || !managerName) {
            //     toast.error(
            //       "Please select zone and store before creating invoice."
            //     );
            //     return;
            //   }

            //   // Debug: Log the item structure to see the correct path
            //   console.log("First item structure:", invoiceItems[0]);
            //   console.log(
            //     "Original data structure:",
            //     invoiceItems[0]?.originalData
            //   );

            //   // Prepare API payload with corrected item ID extraction
            //   const apiPayload = {
            //     zone: selectedZone,
            //     store: selectedStore,
            //     storeManagerName: managerName,
            //     referenceNumber: `REF-${Date.now()}`,
            //     dueDate: dueDate || new Date().toISOString().split("T")[0],
            //     items: invoiceItems.map((item) => {
            //       // Try multiple possible paths for the item ID
            //       const itemId =
            //         item.originalData?.items?.itemBarcode?._id ||
            //         item.originalData?._id ||
            //         item._id ||
            //         item.originalData?.items?._id;

            //       console.log(
            //         "Item ID found:",
            //         itemId,
            //         "for item:",
            //         item.productName
            //       );

            //       return {
            //         item: itemId,
            //         quantity: parseInt(item.qty),
            //         costPrice: parseFloat(
            //           item.originalData?.items?.costPrice ||
            //             item.costPrice ||
            //             "0"
            //         ),
            //         sellPrice: parseFloat(item.salePrice),
            //       };
            //     }),
            //     description: "Sale invoice created from inventory",
            //   };

            //   console.log("Final API Payload:", apiPayload);

            //   // Validate that all items have valid IDs
            //   const itemsWithoutId = apiPayload.items.filter(
            //     (item) => !item.item
            //   );
            //   if (itemsWithoutId.length > 0) {
            //     toast.error(
            //       "Some items are missing valid IDs. Please try again."
            //     );
            //     console.error("Items without ID:", itemsWithoutId);
            //     return;
            //   }

            //   await createSaleInvoice(apiPayload);
            // }}
            onClick={async () => {
              // Only collect data for currently displayed items (currentData)
              const invoiceItems = currentData.map((item, index) => {
                const rowKey = item._id || index.toString();
                return {
                  ...item,
                  qty: invoiceData[rowKey]?.qty || "",
                  salePrice: invoiceData[rowKey]?.salePrice || "",
                };
              });

              // Validate that all displayed items have qty and salePrice
              const invalidItems = invoiceItems.filter(
                (item) =>
                  !item.qty ||
                  !item.salePrice ||
                  item.qty === "" ||
                  item.salePrice === ""
              );

              if (invalidItems.length > 0) {
                toast.error(
                  "Please enter quantity and sale price for all visible items."
                );
                console.log("Invalid items:", invalidItems); // Debug log
                return;
              }

              // Rest of your code remains the same...
              if (!selectedZone || !selectedStore || !managerName) {
                toast.error(
                  "Please select zone and store before creating invoice."
                );
                return;
              }

              // Debug: Log the item structure to see the correct path
              console.log("First item structure:", invoiceItems[0]);
              console.log(
                "Original data structure:",
                invoiceItems[0]?.originalData
              );

              // Prepare API payload with corrected item ID extraction
              const apiPayload = {
                zone: selectedZone,
                store: selectedStore,
                storeManagerName: managerName,
                referenceNumber: `REF-${Date.now()}`,
                dueDate: dueDate || new Date().toISOString().split("T")[0],
                items: invoiceItems.map((item) => {
                  // Try multiple possible paths for the item ID
                  const itemId =
                    item.originalData?.items?.itemBarcode?._id ||
                    item.originalData?._id ||
                    item._id ||
                    item.originalData?.items?._id;

                  console.log(
                    "Item ID found:",
                    itemId,
                    "for item:",
                    item.productName
                  );

                  return {
                    item: itemId,
                    quantity: parseInt(item.qty),
                    costPrice: parseFloat(
                      item.originalData?.items?.costPrice ||
                        item.costPrice ||
                        "0"
                    ),
                    sellPrice: parseFloat(item.salePrice),
                  };
                }),
                description: "Sale invoice created from inventory",
              };

              console.log("Final API Payload:", apiPayload);

              // Validate that all items have valid IDs
              const itemsWithoutId = apiPayload.items.filter(
                (item) => !item.item
              );
              if (itemsWithoutId.length > 0) {
                toast.error(
                  "Some items are missing valid IDs. Please try again."
                );
                console.error("Items without ID:", itemsWithoutId);
                return;
              }

              await createSaleInvoice(apiPayload);
            }}
          />
        </div>
      )}

      {showPurchaseOrderDetailModal && (
        <>
          <div
            className="fixed inset-0 flex items-center justify-center bg-black/20 z-50"
            onClick={() => setShowPurchaseOrderDetailModal(null)}
          >
            <div
              className="animate-scaleIn bg-white rounded-xl shadow-md p-4 w-[320px]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mx-auto">
                {/* Image */}
                <div className="flex justify-center my-2">
                  <div className="relative">
                    <span className="bg-blue-600 absolute top-2 left-0 text-white text-xs font-semibold px-2 py-1 rounded">
                      HEADOFFICE
                    </span>
                    <img
                      src={chainforModalImage}
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
              <h3 className="text-lg font-semibold mb-1">Delete Inventory</h3>
              <p className="text-sm text-gray-700">
                Are you sure you want to delete this Inventory
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
              <h3 className="text-lg font-semibold mb-1">Delete Inventory</h3>
              <p className="text-sm text-gray-700">
                The Inventory has been remove
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
