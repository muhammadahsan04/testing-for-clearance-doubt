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
// import axios from "axios";
// import { toast } from "react-toastify";

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

// interface LiveInventoryTableProps {
//   columns: Column[];
//   data: any[];
//   tableTitle?: string;
//   rowsPerPageOptions?: number[];
//   defaultRowsPerPage?: number;
//   searchable?: boolean;
//   filterByStatus?: boolean;
//   onEdit?: (row: any) => void;
//   onDelete?: (row: any) => void;
//   onDeleteConfirm?: (id: string) => void; // Add this new prop
//   tableDataAlignment?: "zone" | "user" | "center";
//   className?: string;
//   onRowClick?: (row: any) => void;
//   dealBy?: boolean;
//   enableRowModal?: boolean;
//   eye?: boolean;
//   loading?: boolean; // Add loading prop
// }

// // Add these helper functions at the top
// const getAuthToken = () => {
//   let token = localStorage.getItem("token");
//   if (!token) {
//     token = sessionStorage.getItem("token");
//   }
//   return token;
// };

// const LiveInventoryTable: React.FC<LiveInventoryTableProps> = ({
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
//   onDeleteConfirm,
//   tableDataAlignment = "start",
//   dealBy,
//   loading = false,
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
//   const [inventoryDetails, setInventoryDetails] = useState<any>(null);
//   const [loadingDetails, setLoadingDetails] = useState(false);

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

//   const productDetails = {
//     sku: "Chain",
//     barcode: "Eternal Glow",
//     category: "Chain",
//     subCategory: "Eternal Glow",
//     style: "Cuban",
//     goldCategory: "10K",
//     diamondWeight: "4.5 CWT",
//     goldWeight: "150 gms",
//     length: '18"',
//     mm: "8mm",
//     size: "7",
//     costPrice: "15.50",
//   };
//   const fetchInventoryDetails = async (inventoryId: string) => {
//     setLoadingDetails(true);
//     try {
//       const API_URL = import.meta.env.VITE_BASE_URL || "http://localhost:9000";
//       const token = getAuthToken();

//       if (!token) {
//         toast.error("Authentication token not found. Please login again.");
//         return;
//       }

//       const response = await axios.get(
//         `${API_URL}/api/abid-jewelry-ms/getOneInventory/${inventoryId}`,
//         {
//           headers: {
//             "x-access-token": token,
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       if (response.data.success) {
//         setInventoryDetails(response.data.data);
//       } else {
//         toast.error("Failed to fetch inventory details");
//       }
//     } catch (error) {
//       console.error("Error fetching inventory details:", error);
//       toast.error("Failed to fetch inventory details");
//     } finally {
//       setLoadingDetails(false);
//     }
//   };
//   return (
//     <>
//       <div
//         className={`bg-white rounded-xl flex flex-col gap-5 overflow-hidden shadow-md ${className}`}
//       >

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
//                             ? "justify-center"
//                             : isLast
//                             ? "justify-end"
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
//                               ? "justify-center"
//                               : isLast
//                               ? "justify-end"
//                               : tableDataAlignment === "zone"
//                               ? "justify-center"
//                               : "justify-start"
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
//                               case "actions":
//                                 return (
//                                   <div className="flex justify-end gap-2">
//                                     {eye && (
//                                       <LuEye
//                                         className="cursor-pointer"
//                                         onClick={(e) => {
//                                           e.stopPropagation();
//                                           fetchInventoryDetails(row.id);
//                                           setShowPurchaseOrderDetailModal(row);
//                                         }}
//                                       />
//                                     )}
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
//             className="fixed inset-0 flex items-center justify-center bg-black/20 z-50"
//             onClick={() => {
//               setShowPurchaseOrderDetailModal(null);
//               setInventoryDetails(null);
//             }}
//           >
//             <div
//               className="animate-scaleIn bg-white rounded-xl shadow-md p-4 w-[360px]"
//               onClick={(e) => e.stopPropagation()}
//             >
//               <div className="mx-auto">
//                 {loadingDetails ? (
//                   <div className="flex justify-center items-center h-40">
//                     <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//                   </div>
//                 ) : inventoryDetails ? (
//                   <>
//                     {/* Image */}
//                     <div className="flex mb-2 w-full">
//                       <div className="relative w-full">
//                         <span className="bg-blue-600 absolute top-2 left-0 text-white text-xs font-semibold px-2 py-1 rounded">
//                           {inventoryDetails.headOffice > 0 &&
//                           inventoryDetails.store > 0
//                             ? "BOTH"
//                             : inventoryDetails.headOffice > 0
//                             ? "HEADOFFICE"
//                             : "STORE"}
//                         </span>
//                         <img
//                           src={
//                             inventoryDetails.itemId?.itemImage
//                               ? `${
//                                   import.meta.env.VITE_BASE_URL ||
//                                   "http://localhost:9000"
//                                 }${inventoryDetails.itemId.itemImage}`
//                               : chainforModalImage
//                           }
//                           alt="Inventory Item"
//                           className="w-full h-[220px] object-cover"
//                         />
//                       </div>
//                     </div>

//                     {/* SKU and Barcode */}
//                     <div className="flex flex-wrap justify-between items-center pb-2 text-[12px]">
//                       <span className="underline">
//                         <strong>SKU:</strong>{" "}
//                         {inventoryDetails.itemId?.prefixId?.prefixName}-
//                         {inventoryDetails.itemId?.autoGenerated}
//                       </span>
//                       <span className="underline">
//                         <strong>BARCODE:</strong>{" "}
//                         {inventoryDetails.itemId?.barcode}
//                       </span>
//                     </div>

//                     {/* Details Section */}
//                     <div className="flex justify-between">
//                       <div className="w-3/5">
//                         <h3 className="font-bold text-gray-900 mb-2 text-sm">
//                           DETAIL:
//                         </h3>
//                         <div className="space-y-1 text-sm">
//                           <div className="flex justify-between">
//                             <p className="text-gray-600">Category:</p>
//                             <p className="font-medium">
//                               {inventoryDetails.itemId?.category?.name}
//                             </p>
//                           </div>
//                           <div className="flex justify-between">
//                             <p className="text-gray-600">Sub Category:</p>
//                             <p className="font-medium">
//                               {inventoryDetails.itemId?.subCategory?.name}
//                             </p>
//                           </div>
//                           <div className="flex justify-between">
//                             <p className="text-gray-600">Product For:</p>
//                             <p className="font-medium">
//                               {inventoryDetails.itemId?.productFor?.join(", ")}
//                             </p>
//                           </div>
//                           <div className="flex justify-between">
//                             <p className="text-gray-600">Diamond Weight:</p>
//                             <p className="font-medium">
//                               {inventoryDetails.itemId?.diamondWeight}
//                             </p>
//                           </div>
//                           <div className="flex justify-between">
//                             <p className="text-gray-600">Gold Weight:</p>
//                             <p className="font-medium">
//                               {inventoryDetails.itemId?.goldWeight}
//                             </p>
//                           </div>
//                           <div className="flex justify-between">
//                             <p className="text-gray-600">Length:</p>
//                             <p className="font-medium">
//                               {inventoryDetails.itemId?.length}
//                             </p>
//                           </div>
//                           <div className="flex justify-between">
//                             <p className="text-gray-600">MM:</p>
//                             <p className="font-medium">
//                               {inventoryDetails.itemId?.mm}
//                             </p>
//                           </div>
//                           <div className="flex justify-between">
//                             <p className="text-gray-600">Size:</p>
//                             <p className="font-medium">
//                               {inventoryDetails.itemId?.size}
//                             </p>
//                           </div>
//                           <div className="flex justify-between">
//                             <p className="text-gray-600">Stock:</p>
//                             <p className="font-medium">
//                               {inventoryDetails.stock}
//                             </p>
//                           </div>
//                         </div>
//                       </div>

//                       {/* Stock Information */}
//                       <div className="w-2/5 pl-4 mt-8 text-right">
//                         <h3 className="font-bold text-sm text-gray-900 mb-2">
//                           STOCK INFO:
//                         </h3>
//                         <div className="space-y-1 text-sm">
//                           <p className="text-blue-600 font-bold">
//                             Total: {inventoryDetails.stock}
//                           </p>
//                           <p className="text-green-600 font-medium">
//                             Head Office: {inventoryDetails.headOffice}
//                           </p>
//                           <p className="text-purple-600 font-medium">
//                             Store: {inventoryDetails.store}
//                           </p>
//                           {inventoryDetails.headOfficeAging && (
//                             <p className="text-gray-600 text-xs">
//                               HO Aging: {inventoryDetails.headOfficeAging}
//                             </p>
//                           )}
//                           {inventoryDetails.storeAging && (
//                             <p className="text-gray-600 text-xs">
//                               Store Aging: {inventoryDetails.storeAging}
//                             </p>
//                           )}
//                         </div>
//                       </div>
//                     </div>
//                   </>
//                 ) : (
//                   <div className="flex justify-center items-center h-40">
//                     <div className="text-gray-500">No details available</div>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         </>
//       )}

//       {/* Add loading state to the table */}
//       {loading && (
//         <div className="flex justify-center items-center py-8">
//           <div className="text-gray-500">Loading inventory data...</div>
//         </div>
//       )}
//     </>
//   );
// };

// export default LiveInventoryTable;

"use client";

import type React from "react";
import { useState } from "react";
import { GoChevronLeft, GoChevronRight } from "react-icons/go";
import { LuEye } from "react-icons/lu";
import { IoMdClose } from "react-icons/io";
import Button from "../components/Button";
import { toast } from "react-toastify";
import axios from "axios";

type ColumnType = "text" | "image" | "status" | "actions" | "button" | "custom";

interface Column {
  header: string;
  accessor: string;
  type?: ColumnType;
}

interface LiveInventoryTableProps {
  columns: Column[];
  data: any[];
  tableTitle?: string;
  rowsPerPageOptions?: number[];
  defaultRowsPerPage?: number;
  searchable?: boolean;
  filterByStatus?: boolean;
  onEdit?: (row: any) => void;
  onDelete?: (row: any) => void;
  onDeleteConfirm?: (id: string) => void;
  tableDataAlignment?: "zone" | "user" | "center";
  className?: string;
  onRowClick?: (row: any) => void;
  dealBy?: boolean;
  enableRowModal?: boolean;
  eye?: boolean;
  loading?: boolean;
}

const getAuthToken = () => {
  let token = localStorage.getItem("token");
  if (!token) {
    token = sessionStorage.getItem("token");
  }
  return token;
};

const LiveInventoryTable: React.FC<LiveInventoryTableProps> = ({
  eye,
  enableRowModal = true,
  onRowClick,
  className,
  columns,
  data,
  tableTitle,
  rowsPerPageOptions = [5, 10, 15],
  defaultRowsPerPage = 10,
  searchable = true,
  filterByStatus = true,
  onEdit,
  onDelete,
  onDeleteConfirm,
  tableDataAlignment = "center",
  dealBy,
  loading = false,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(defaultRowsPerPage);
  const [showDetailModal, setShowDetailModal] = useState<any>(null);
  const [showTransferModal, setShowTransferModal] = useState<any>(null);
  const [inventoryDetails, setInventoryDetails] = useState<any>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [transferData, setTransferData] = useState({
    fromLocation: "",
    toLocation: "",
    quantity: 0,
  });

  const totalPages = Math.ceil(data.length / rowsPerPage);
  const currentData = data.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handleChangePage = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  // Fetch inventory details for modal
  const fetchInventoryDetails = async (inventoryId: string) => {
    setLoadingDetails(true);
    try {
      const API_URL = import.meta.env.VITE_BASE_URL || "http://localhost:9000";
      const token = getAuthToken();

      if (!token) {
        toast.error("Authentication token not found. Please login again.");
        return;
      }

      const response = await axios.get(
        `${API_URL}/api/abid-jewelry-ms/getOneInventory/${inventoryId}`,
        {
          headers: {
            "x-access-token": token,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        setInventoryDetails(response.data.data);
      } else {
        toast.error("Failed to fetch inventory details");
      }
    } catch (error) {
      console.error("Error fetching inventory details:", error);
      toast.error("Failed to fetch inventory details");
    } finally {
      setLoadingDetails(false);
    }
  };

  // Handle transfer functionality
  const handleTransfer = async () => {
    try {
      const API_URL = import.meta.env.VITE_BASE_URL || "http://localhost:9000";
      const token = getAuthToken();

      if (!token) {
        toast.error("Authentication token not found. Please login again.");
        return;
      }

      // Add your transfer API call here
      toast.success("Transfer initiated successfully!");
      setShowTransferModal(null);
      setTransferData({ fromLocation: "", toLocation: "", quantity: 0 });
    } catch (error) {
      console.error("Error during transfer:", error);
      toast.error("Failed to initiate transfer");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <>
      <div
        className={`bg-white rounded-xl flex flex-col gap-5 overflow-hidden shadow-md ${className}`}
      >
        {tableTitle && (
          <p className="text-[#056BB7] font-semibold text-[24px]">
            {tableTitle}
          </p>
        )}

        {/* Table */}
        <div className="bg-white rounded-xl border border-gray-300 overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-700">
            <thead className="bg-[#F9FAFB] text-black">
              <tr className="font-semibold text-[16px] whitespace-nowrap w-full">
                {columns.map((col, index) => {
                  const isFirst = index === 0;
                  const isLast = index === columns.length - 1;

                  return (
                    <th key={col.accessor} className="px-4 py-3">
                      <div
                        className={`flex flex-row items-center ${
                          isFirst
                            ? "justify-center"
                            : isLast
                            ? "justify-center"
                            : tableDataAlignment === "center"
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
                  className="hover:bg-gray-50 whitespace-nowrap cursor-pointer border-b border-gray-100"
                  onClick={() => {
                    if (onRowClick) {
                      onRowClick(row);
                    }
                  }}
                >
                  {columns.map((col, index) => {
                    const isFirst = index === 0;
                    const isLast = index === columns.length - 1;

                    return (
                      <td key={col.accessor} className="px-4 py-3">
                        <div
                          className={`flex flex-row items-center ${
                            isFirst
                              ? "justify-center"
                              : isLast
                              ? "justify-center"
                              : tableDataAlignment === "center"
                              ? "justify-center"
                              : "justify-start"
                          }`}
                        >
                          {(() => {
                            switch (col.type) {
                              case "image":
                                return (
                                  <img
                                    src={row.image || "/placeholder.svg"}
                                    alt="Product"
                                    className="w-10 h-10 rounded object-cover"
                                  />
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
                                  <div className="flex justify-center gap-3">
                                    {eye && (
                                      <button
                                        className="text-blue-600 hover:text-blue-800 transition-colors"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          fetchInventoryDetails(row.id);
                                          setShowDetailModal(row);
                                        }}
                                        title="View Details"
                                      >
                                        <LuEye size={18} />
                                      </button>
                                    )}
                                    <Button
                                      text="Transfer"
                                      //   size="sm"
                                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 text-xs border-none"
                                      onClick={(e: any) => {
                                        e.stopPropagation();
                                        setShowTransferModal(row);
                                        setTransferData({
                                          fromLocation:
                                            row.headoffice > 0 && row.store > 0
                                              ? ""
                                              : row.headoffice > 0
                                              ? "headoffice"
                                              : "store",
                                          toLocation: "",
                                          quantity: 1,
                                        });
                                      }}
                                    />
                                  </div>
                                );
                              default:
                                return (
                                  <span className="text-center">
                                    {row[col.accessor]}
                                  </span>
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
                className="w-10 h-10 rounded-full border border-gray-300 hover:bg-gray-200 flex items-center justify-center disabled:opacity-50"
                disabled={currentPage === 1}
              >
                <GoChevronLeft size={18} />
              </button>

              {/* Page Numbers */}
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => handleChangePage(pageNum)}
                    className={`w-8 h-8 rounded-full text-sm flex items-center justify-center transition ${
                      currentPage === pageNum
                        ? "bg-[#407BFF] text-white"
                        : "bg-[#E5E7EB] text-black hover:bg-[#407BFF] hover:text-white"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                onClick={() => handleChangePage(currentPage + 1)}
                className="w-10 h-10 rounded-full border border-gray-300 hover:bg-gray-200 flex items-center justify-center disabled:opacity-50"
                disabled={currentPage === totalPages}
              >
                <GoChevronRight size={18} />
              </button>
            </div>

            <div className="flex items-center gap-2 mt-2 md:mt-0">
              <span className="text-sm">Show:</span>
              <select
                value={`${rowsPerPage} Row`}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === "All") {
                    setRowsPerPage(data.length);
                  } else {
                    const selected = Number.parseInt(value.split(" ")[0]);
                    setRowsPerPage(selected);
                  }
                  setCurrentPage(1);
                }}
                className="bg-black text-white rounded px-2 py-1 min-w-[90px]"
              >
                <option value="10 Row">10 Row</option>
                <option value="15 Row">15 Row</option>
                <option value="20 Row">20 Row</option>
                <option value="25 Row">25 Row</option>
                <option value="All">All</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {showDetailModal && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
          onClick={() => {
            setShowDetailModal(null);
            setInventoryDetails(null);
          }}
        >
          <div
            className="animate-scaleIn bg-white rounded-xl shadow-lg p-6 w-[90%] max-w-[500px] max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">
                Inventory Details
              </h2>
              <button
                onClick={() => {
                  setShowDetailModal(null);
                  setInventoryDetails(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <IoMdClose size={24} />
              </button>
            </div>

            {loadingDetails ? (
              <div className="flex justify-center items-center h-40">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : inventoryDetails ? (
              <div>
                {/* Image */}
                <div className="relative mb-4">
                  <span className="bg-blue-600 absolute top-2 left-2 text-white text-xs font-semibold px-2 py-1 rounded z-10">
                    {inventoryDetails.headOffice > 0 &&
                    inventoryDetails.store > 0
                      ? "BOTH"
                      : inventoryDetails.headOffice > 0
                      ? "HEAD OFFICE"
                      : "STORE"}
                  </span>
                  <img
                    src={
                      inventoryDetails?.itemId?.itemImage
                        ? `${
                            import.meta.env.VITE_BASE_URL ||
                            "http://localhost:9000"
                          }${inventoryDetails?.itemId?.itemImage}`
                        : "/placeholder.svg?height=300&width=400"
                    }
                    alt="Inventory Item"
                    className="w-full h-[250px] object-cover rounded-lg"
                  />
                </div>

                {/* SKU and Barcode */}
                <div className="flex justify-between items-center mb-4 text-sm">
                  <span className="font-medium">
                    <strong>SKU:</strong>{" "}
                    {inventoryDetails.itemId?.prefixId?.prefixName}-
                    {inventoryDetails.itemId?.autoGenerated}
                  </span>
                  <span className="font-medium">
                    <strong>BARCODE:</strong> {inventoryDetails.itemId?.barcode}
                  </span>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-bold text-gray-900 mb-3">DETAILS:</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Category:</span>
                        <span className="font-medium">
                          {inventoryDetails.itemId?.category?.name}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Sub Category:</span>
                        <span className="font-medium">
                          {inventoryDetails.itemId?.subCategory?.name}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Product For:</span>
                        <span className="font-medium">
                          {inventoryDetails.itemId?.productFor?.join(", ")}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Diamond Weight:</span>
                        <span className="font-medium">
                          {inventoryDetails.itemId?.diamondWeight}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Gold Weight:</span>
                        <span className="font-medium">
                          {inventoryDetails.itemId?.goldWeight}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Length:</span>
                        <span className="font-medium">
                          {inventoryDetails.itemId?.length}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Size:</span>
                        <span className="font-medium">
                          {inventoryDetails.itemId?.size}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-bold text-gray-900 mb-3">
                      STOCK INFO:
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="text-blue-600 font-bold text-lg">
                        Total: {inventoryDetails.stock}
                      </div>
                      <div className="text-green-600 font-medium">
                        Head Office: {inventoryDetails.headOffice}
                      </div>
                      <div className="text-purple-600 font-medium">
                        Store: {inventoryDetails.store}
                      </div>
                      {inventoryDetails.headOfficeAging && (
                        <div className="text-gray-600 text-xs">
                          HO Aging: {inventoryDetails.headOfficeAging}
                        </div>
                      )}
                      {inventoryDetails.storeAging && (
                        <div className="text-gray-600 text-xs">
                          Store Aging: {inventoryDetails.storeAging}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex justify-center items-center h-40">
                <div className="text-gray-500">No details available</div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Transfer Modal */}
      {showTransferModal && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
          onClick={() => setShowTransferModal(null)}
        >
          <div
            className="bg-white rounded-xl shadow-lg p-6 w-[90%] max-w-[400px]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">
                Transfer Inventory
              </h2>
              <button
                onClick={() => setShowTransferModal(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <IoMdClose size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  From Location
                </label>
                <select
                  value={transferData.fromLocation}
                  onChange={(e) =>
                    setTransferData((prev) => ({
                      ...prev,
                      fromLocation: e.target.value,
                    }))
                  }
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Location</option>
                  {showTransferModal.headoffice > 0 && (
                    <option value="headoffice">Head Office</option>
                  )}
                  {showTransferModal.store > 0 && (
                    <option value="store">Store</option>
                  )}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  To Location
                </label>
                <select
                  value={transferData.toLocation}
                  onChange={(e) =>
                    setTransferData((prev) => ({
                      ...prev,
                      toLocation: e.target.value,
                    }))
                  }
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Location</option>
                  {transferData.fromLocation !== "headoffice" && (
                    <option value="headoffice">Head Office</option>
                  )}
                  {transferData.fromLocation !== "store" && (
                    <option value="store">Store</option>
                  )}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quantity
                </label>
                <input
                  type="number"
                  min="1"
                  max={
                    transferData.fromLocation === "headoffice"
                      ? showTransferModal.headoffice
                      : showTransferModal.store
                  }
                  value={transferData.quantity}
                  onChange={(e) =>
                    setTransferData((prev) => ({
                      ...prev,
                      quantity: Number.parseInt(e.target.value) || 0,
                    }))
                  }
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Available:{" "}
                  {transferData.fromLocation === "headoffice"
                    ? showTransferModal.headoffice
                    : showTransferModal.store}
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  text="back"
                  onClick={() => setShowTransferModal(null)}
                  //   variant="outline"
                  className="flex-1"
                />
                <Button
                  text="Transfer"
                  onClick={handleTransfer}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                  disabled={
                    !transferData.fromLocation ||
                    !transferData.toLocation ||
                    transferData.quantity <= 0
                  }
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LiveInventoryTable;
