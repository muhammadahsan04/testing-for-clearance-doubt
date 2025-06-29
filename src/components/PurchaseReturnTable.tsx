// import React, { useEffect, useState } from "react";
// import { AiOutlineDelete } from "react-icons/ai";
// import { RiEditLine } from "react-icons/ri";
// import { GoChevronLeft, GoChevronRight } from "react-icons/go";
// import { LuEye } from "react-icons/lu";
// import purchaseReturnIcon from "../assets/purchaseReturnIcon.svg";
// import Input from "./Input";
// import Dropdown from "./Dropdown";
// import Button from "./Button";
// import { useNavigate } from "react-router-dom";
// // import * as React from "react";
// import dayjs, { Dayjs } from "dayjs";
// import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
// import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
// import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// import { DateRange } from "@mui/x-date-pickers-pro/models";
// import { DateRangePicker } from "@mui/x-date-pickers-pro/DateRangePicker";
// import { DatePicker } from "antd";
// import InvoiceDetailModal from "../../src/pages/dashboard/Inventory/InvoiceDetailModal";
// type ColumnType = "text" | "image" | "status" | "actions" | "button" | "custom";

// interface Column {
//   header: string;
//   accessor: string;
//   type?: ColumnType;
// }

// interface PurchaseReturnDetail {
//   itemdescription: string;
//   qty: number;
//   rate: number;
//   amount: number;
// }

// interface SummaryData {
//   debit: number;
//   credit: number;
//   balance: number;
// }

// interface PurchaseReturnTableProps {
//   // isOpen: boolean;
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
//   summaryData?: SummaryData;
// }

// const PurchaseReturnTable: React.FC<PurchaseReturnTableProps> = ({
//   // isOpen,
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
//   summaryData,
// }) => {
//   const [currentPage, setCurrentPage] = useState(1);
//   const [rowsPerPage, setRowsPerPage] = useState(10);
//   const [invoiceDetail, setInvoiceDetail] = useState<any>(null); // for modal
//   const [deleteUser, setDeleteUser] = useState<any>(null); // for modal
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [deleteModal, setDeleteModal] = useState(false);
//   const [search, setSearch] = useState(""); // ✅ Local search state
//   const [statusFilter, setStatusFilter] = useState("All"); // ✅ Status filter state
//   // To these two state variables edit user
//   const [isEditing, setIsEditing] = useState(false);
//   const [editingRow, setEditingRow] = useState<any>(null);
//   const [formData, setFormData] = useState<any>(null);
//   //   const [search, setSearch] = useState("");
//   const [dateRange, setDateRange] = useState("");
//   const [supplier, setSupplier] = useState("");
//   const [isOpen, setIsOpen] = React.useState(false);

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

//   const { RangePicker } = DatePicker;
//   const onClose = () => setIsOpen(false);
//   useEffect(() => {
//     const handleEsc = (event: KeyboardEvent) => {
//       if (event.key === "Escape") {
//         onClose();
//       }
//     };
//     document.addEventListener("keydown", handleEsc);
//     return () => document.removeEventListener("keydown", handleEsc);
//   }, [onClose]);

//   const PurchaseReturnData: PurchaseReturnDetail[] = [
//     {
//       itemdescription: "PI-1234",
//       qty: 1234,
//       rate: 200,
//       amount: 1100,
//     },
//     {
//       itemdescription: "PI-1234",
//       qty: 123,
//       rate: 200,
//       amount: 1100,
//     },
//     {
//       itemdescription: "PI-1234",
//       qty: 1234,
//       rate: 200,
//       amount: 1100,
//     },
//     // Aur bhi rows add kar sakte ho agar chaho
//   ];

//   const PurchaseReturnDetail = [
//     { header: "ITEM DESCRIPTION", accessor: "itemdescription" },
//     { header: "QTY", accessor: "qty" },
//     { header: "RATE ($)", accessor: "rate" },
//     { header: "AMOUNT ($)", accessor: "amount" },
//   ];
//   return (
//     <>
//       <div
//         className={`bg-white rounded-xl p-4 flex flex-col gap-4 overflow-hidden shadow-md ${className}`}
//       >
//         <div className="flex justify-between items-center">
//           <h2 className="text-xl font-semibold text-[#056BB7]">
//             Purchase Return
//           </h2>
//           <Button
//             onClick={() => navigate("create-purchase-return")}
//             text="Create Purchase Invoice"
//             className="bg-[#28A745] text-white font-medium h-10 px-4 border-none"
//           />
//         </div>
//         {/* Search + Filter */}
//         {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center justify-between"> */}
//         {/* Filters */}
//         <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 items-center justify-between">
//           <Input
//             placeholder="Search by Name, Category"
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             className="w-full !rounded-3xl"
//           />
//           <RangePicker className="h-10 !text-gray-400 !border-gray-300" />
//           <Dropdown
//             className="w-full md:auto"
//             options={["All", "Active", "Inactive"]}
//             DropDownName="Status"
//             defaultValue="All"
//             onSelect={(val) => {
//               setStatusFilter(val);
//               setCurrentPage(1);
//             }}
//           />
//           <div className="flex justify-start xl:justify-end md:col-span-4 lg:col-span-1 w-full">
//             <Button
//               onClick={() => {
//                 setSearch("");
//                 setDateRange("");
//                 setSupplier("");
//               }}
//               text="Reset Filters"
//               className="bg-[#056BB7] text-white border-none font-medium w-auto"
//             />
//           </div>
//         </div>

//         {/* <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 items-center justify-between">
//           <Input
//             placeholder="Search by Name, Category"
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             className="w-full sm:w-64 !rounded-3xl"
//           />
//           <RangePicker className="w-full sm:w-auto h-10 !text-gray-400 !border-gray-300" />
//           <Dropdown
//             options={["All", "Active", "Inactive"]}
//             DropDownName="Status"
//             defaultValue="All"
//             onSelect={(val) => {
//               setStatusFilter(val);
//               setCurrentPage(1);
//             }}
//             className="w-full sm:w-auto"
//           />
//           <div className="flex justify-center sm:justify-end col-span-1 md:col-span-4 lg:col-span-1 w-full border">
//             <Button
//               onClick={() => {
//                 setSearch("");
//                 setDateRange("");
//                 setSupplier("");
//               }}
//               text="Reset Filters"
//               className="bg-[#056BB7] text-white border-none font-medium w-full sm:w-auto"
//             />
//           </div>
//         </div> */}

//         {/* Summary */}
//         <div className="bg-[#FCF3EC] py-3 px-4 rounded-md flex justify-end gap-6 text-md font-semibold">
//           <div>
//             Debit:{" "}
//             <span className="font-medium">
//               ${summaryData?.debit?.toLocaleString() || "0"}
//             </span>
//           </div>
//           <div>
//             Credit:{" "}
//             <span className="font-medium">
//               ${summaryData?.credit?.toLocaleString() || "0"}
//             </span>
//           </div>
//           <div>
//             Balance:{" "}
//             <span className="font-medium">
//               ${summaryData?.balance?.toLocaleString() || "0"}
//             </span>
//           </div>
//         </div>

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
//                   key={idx}
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
//                             <>
//                               <LuEye
//                                 size={20}
//                                 className="cursor-pointer mr-1"
//                                 onClick={() => {
//                                   setInvoiceDetail(row);
//                                   setIsOpen(true); // Add this line to open the modal
//                                 }}
//                               />
//                                 <img src={purchaseReturnIcon} alt="" width={17} />
//                             </>
//                           ) : (
//                             // @ts-ignore
//                             row[col.accessor]
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
//                     No data found.
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>

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
//       {invoiceDetail && (
//         <InvoiceDetailModal
//           isOpen={true} // Change this from isOpen to true
//           onClose={() => {
//             setInvoiceDetail(null); // Clear the invoice detail
//             setIsOpen(false); // Close the modal
//           }}
//           columns={PurchaseReturnDetail}
//           data={PurchaseReturnData}
//         />
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
//               <h2 className="text-xl font-medium">Delete {deleteUser.role}</h2>
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
//               <h2 className="text-xl font-medium">Delete {deleteUser.role}</h2>
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
//     </>
//   );
// };

// export default PurchaseReturnTable;

// import React, { useEffect, useState } from "react";
// import { AiOutlineDelete } from "react-icons/ai";
// import { GoChevronLeft, GoChevronRight } from "react-icons/go";
// import { LuEye } from "react-icons/lu";
// import purchaseReturnIcon from "../assets/purchaseReturnIcon.svg";
// import Input from "./Input";
// import Dropdown from "./Dropdown";
// import Button from "./Button";
// import { useNavigate } from "react-router-dom";
// import { DatePicker } from "antd";
// import InvoiceDetailModal from "../../src/pages/dashboard/Inventory/InvoiceDetailModal";
// import PurchaseReturnModal from "./PurchaseReturnModal";
// import toast from "react-hot-toast"; // Declare toast
// import { purchaseInvoiceApi } from "../pages/dashboard/Inventory/PurchaseInvoiceApi";

// type ColumnType = "text" | "image" | "status" | "actions" | "button" | "custom";

// interface Column {
//   header: string;
//   accessor: string;
//   type?: ColumnType;
// }

// interface PurchaseReturnDetail {
//   itemdescription: string;
//   qty: number;
//   rate: number;
//   amount: number;
// }

// interface SummaryData {
//   debit: number;
//   credit: number;
//   balance: number;
// }

// interface PurchaseReturnTableProps {
//   // isOpen: boolean;
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
//   summaryData?: SummaryData;
// }

// const PurchaseReturnTable: React.FC<PurchaseReturnTableProps> = ({
//   // isOpen,
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
//   summaryData,
// }) => {
//   const [currentPage, setCurrentPage] = useState(1);
//   const [rowsPerPage, setRowsPerPage] = useState(10);
//   const [invoiceDetail, setInvoiceDetail] = useState<any>(null); // for modal
//   const [purchaseReturnDetail, setPurchaseReturnDetail] = useState<any>(null); // for modal
//   const [deleteUser, setDeleteUser] = useState<any>(null); // for modal
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [deleteModal, setDeleteModal] = useState(false);
//   const [search, setSearch] = useState(""); // ✅ Local search state
//   const [statusFilter, setStatusFilter] = useState("All"); // ✅ Status filter state
//   // To these two state variables edit user
//   const [isEditing, setIsEditing] = useState(false);
//   const [editingRow, setEditingRow] = useState<any>(null);
//   const [formData, setFormData] = useState<any>(null);
//   //   const [search, setSearch] = useState("");
//   const [dateRange, setDateRange] = useState("");
//   const [supplier, setSupplier] = useState("");
//   const [isOpen, setIsOpen] = React.useState(false);
//   const [isPurchaseReturnOpen, setIsPurchaseReturnOpen] = React.useState(false);
//   const [loadingInvoiceDetail, setLoadingInvoiceDetail] = useState(false);
//   const [loadingPurchaseReturnDetail, setLoadingPurchaseReturnDetail] =
//     useState(false);

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

//   const { RangePicker } = DatePicker;
//   const onClose = () => setIsOpen(false);
//   useEffect(() => {
//     const handleEsc = (event: KeyboardEvent) => {
//       if (event.key === "Escape") {
//         onClose();
//       }
//     };
//     document.addEventListener("keydown", handleEsc);
//     return () => document.removeEventListener("keydown", handleEsc);
//   }, []); // Remove onClose from dependency array

//   const PurchaseReturnData: PurchaseReturnDetail[] = [
//     {
//       itemdescription: "PI-1234",
//       qty: 1234,
//       rate: 200,
//       amount: 1100,
//     },
//     {
//       itemdescription: "PI-1234",
//       qty: 123,
//       rate: 200,
//       amount: 1100,
//     },
//     {
//       itemdescription: "PI-1234",
//       qty: 1234,
//       rate: 200,
//       amount: 1100,
//     },
//     // Aur bhi rows add kar sakte ho agar chaho
//   ];

//   const PurchaseReturnDetail = [
//     { header: "ITEM DESCRIPTION", accessor: "itemdescription" },
//     { header: "QTY", accessor: "qty" },
//     { header: "RATE ($)", accessor: "rate" },
//     { header: "AMOUNT ($)", accessor: "amount" },
//   ];

//   const handleEyeClick = async (row: any) => {
//     setInvoiceDetail(null);
//     setIsOpen(true);
//     setLoadingInvoiceDetail(true);
//     try {
//       const response = await purchaseInvoiceApi.getOnePurchaseInvoice(row._id);
//       if (response.success) {
//         setInvoiceDetail(response.data);
//       } else {
//         toast.error("Failed to load invoice details");
//       }
//     } catch (error) {
//       console.error("Error fetching invoice details:", error);
//       toast.error("Failed to load invoice details");
//     } finally {
//       setLoadingInvoiceDetail(false);
//     }
//   };

//   const handlePurchaseReturnClick = async (row: any) => {
//     setPurchaseReturnDetail(null);
//     setIsPurchaseReturnOpen(true);
//     setLoadingPurchaseReturnDetail(true);
//     try {
//       const response =
//         await purchaseInvoiceApi.getPurchaseReturnInvoicesBySupplier(
//           row.supplierCompanyName._id
//         );
//       if (response.success) {
//         setPurchaseReturnDetail(response.data);
//       } else {
//         toast.error("Failed to load purchase return details");
//       }
//     } catch (error) {
//       console.error("Error fetching purchase return details:", error);
//       toast.error("Failed to load purchase return details");
//     } finally {
//       setLoadingPurchaseReturnDetail(false);
//     }
//   };

//   return (
//     <>
//       <div
//         className={`bg-white rounded-xl p-4 flex flex-col gap-4 overflow-hidden shadow-md ${className}`}
//       >
//         <div className="flex justify-between items-center">
//           <h2 className="text-xl font-semibold text-[#056BB7]">
//             Purchase Return
//           </h2>
//           <Button
//             onClick={() => navigate("create-purchase-return")}
//             text="Create Purchase Invoice"
//             className="bg-[#28A745] text-white font-medium h-10 px-4 border-none"
//           />
//         </div>
//         {/* Search + Filter */}
//         {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center justify-between"> */}
//         {/* Filters */}
//         <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 items-center justify-between">
//           <Input
//             placeholder="Search by Name, Category"
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             className="w-full !rounded-3xl"
//           />
//           <RangePicker className="h-10 !text-gray-400 !border-gray-300" />
//           <Dropdown
//             className="w-full md:auto"
//             options={["All", "Active", "Inactive"]}
//             DropDownName="Status"
//             defaultValue="All"
//             onSelect={(val) => {
//               setStatusFilter(val);
//               setCurrentPage(1);
//             }}
//           />
//           <div className="flex justify-start xl:justify-end md:col-span-4 lg:col-span-1 w-full">
//             <Button
//               onClick={() => {
//                 setSearch("");
//                 setDateRange("");
//                 setSupplier("");
//               }}
//               text="Reset Filters"
//               className="bg-[#056BB7] text-white border-none font-medium w-auto"
//             />
//           </div>
//         </div>

//         {/* <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 items-center justify-between">
//           <Input
//             placeholder="Search by Name, Category"
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             className="w-full sm:w-64 !rounded-3xl"
//           />
//           <RangePicker className="w-full sm:w-auto h-10 !text-gray-400 !border-gray-300" />
//           <Dropdown
//             options={["All", "Active", "Inactive"]}
//             DropDownName="Status"
//             defaultValue="All"
//             onSelect={(val) => {
//               setStatusFilter(val);
//               setCurrentPage(1);
//             }}
//             className="w-full sm:w-auto"
//           />
//           <div className="flex justify-center sm:justify-end col-span-1 md:col-span-4 lg:col-span-1 w-full border">
//             <Button
//               onClick={() => {
//                 setSearch("");
//                 setDateRange("");
//                 setSupplier("");
//               }}
//               text="Reset Filters"
//               className="bg-[#056BB7] text-white border-none font-medium w-full sm:w-auto"
//             />
//           </div>
//         </div> */}

//         {/* Summary */}
//         <div className="bg-[#FCF3EC] py-3 px-4 rounded-md flex justify-end gap-6 text-md font-semibold">
//           <div>
//             Debit:{" "}
//             <span className="font-medium">
//               ${summaryData?.debit?.toLocaleString() || "0"}
//             </span>
//           </div>
//           <div>
//             Credit:{" "}
//             <span className="font-medium">
//               ${summaryData?.credit?.toLocaleString() || "0"}
//             </span>
//           </div>
//           <div>
//             Balance:{" "}
//             <span className="font-medium">
//               ${summaryData?.balance?.toLocaleString() || "0"}
//             </span>
//           </div>
//         </div>

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
//                   key={idx}
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
//                             <>
//                               <LuEye
//                                 size={20}
//                                 className="cursor-pointer mr-1"
//                                 onClick={() => handleEyeClick(row)}
//                               />
//                               <img
//                                 src={purchaseReturnIcon || "/placeholder.svg"}
//                                 alt=""
//                                 width={17}
//                                 className="cursor-pointer"
//                                 onClick={() => handlePurchaseReturnClick(row)}
//                               />
//                             </>
//                           ) : (
//                             // @ts-ignore
//                             row[col.accessor]
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
//                     No data found.
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>

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
//       {invoiceDetail && (
//         <InvoiceDetailModal
//           isOpen={isOpen} // Change this from isOpen to true
//           onClose={() => {
//             setInvoiceDetail(null); // Clear the invoice detail
//             setIsOpen(false); // Close the modal
//           }}
//           columns={PurchaseReturnDetail}
//           data={PurchaseReturnData}
//           invoiceData={invoiceDetail}
//           loading={loadingInvoiceDetail}
//           loader={
//             <div className="flex justify-center items-center h-40">
//               <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//             </div>
//           }
//         />
//       )}

//       {purchaseReturnDetail && (
//         <PurchaseReturnModal
//           isOpen={isPurchaseReturnOpen}
//           onClose={() => {
//             setPurchaseReturnDetail(null);
//             setIsPurchaseReturnOpen(false);
//           }}
//           columns={PurchaseReturnDetail}
//           data={PurchaseReturnData}
//           purchaseReturnData={purchaseReturnDetail}
//           loading={loadingPurchaseReturnDetail}
//           loader={
//             <div className="flex justify-center items-center h-40">
//               <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//             </div>
//           }
//         />
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
//               <h2 className="text-xl font-medium">Delete {deleteUser.role}</h2>
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
//               <h2 className="text-xl font-medium">Delete {deleteUser.role}</h2>
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
//                 has been removed.
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

// export default PurchaseReturnTable;

// import React, { useEffect, useState } from "react";
// import { AiOutlineDelete } from "react-icons/ai";
// import { RiEditLine } from "react-icons/ri";
// import { GoChevronLeft, GoChevronRight } from "react-icons/go";
// import { LuEye } from "react-icons/lu";
// import purchaseReturnIcon from "../assets/purchaseReturnIcon.svg";
// import Input from "./Input";
// import Dropdown from "./Dropdown";
// import Button from "./Button";
// import { useNavigate } from "react-router-dom";
// import { DatePicker } from "antd";
// import InvoiceDetailModal from "../../src/pages/dashboard/Inventory/InvoiceDetailModal";
// import PurchaseReturnInvoiceDetailModal from "../pages/dashboard/Inventory/PurchaseReturnInvoiceDetailModal";
// import AllOfTheDetailsOfPurchaseReturn from "../pages/dashboard/Inventory/AllOfTheDetailsOfPurchaseReturn";
// import { purchaseInvoiceApi } from "../pages/dashboard/Inventory/PurchaseInvoiceApi";
// import { toast } from "react-toastify";

// type ColumnType = "text" | "image" | "status" | "actions" | "button" | "custom";

// interface Column {
//   header: string;
//   accessor: string;
//   type?: ColumnType;
// }

// interface PurchaseReturnDetail {
//   itemdescription: string;
//   qty: number;
//   rate: number;
//   amount: number;
// }

// interface SummaryData {
//   debit: number;
//   credit: number;
//   balance: number;
// }

// interface PurchaseReturnTableProps {
//   columns: Column[];
//   data: any[];
//   tableTitle?: string;
//   rowsPerPageOptions?: number[];
//   defaultRowsPerPage?: number;
//   searchable?: boolean;
//   filterByStatus?: boolean;
//   onEdit?: (row: any) => void;
//   onDelete?: (row: any) => void;
//   tableDataAlignment?: "zone" | "user" | "center";
//   className?: string;
//   onRowClick?: (row: any) => void;
//   dealBy?: boolean;
//   enableRowModal?: boolean;
//   eye?: boolean;
//   summaryData?: SummaryData;
// }

// const PurchaseReturnTable: React.FC<PurchaseReturnTableProps> = ({
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
//   tableDataAlignment = "start",
//   dealBy,
//   summaryData,
// }) => {
//   const [currentPage, setCurrentPage] = useState(1);
//   const [rowsPerPage, setRowsPerPage] = useState(10);
//   const [invoiceDetail, setInvoiceDetail] = useState<any>(null);
//   const [purchaseReturnInvoiceDetail, setPurchaseReturnInvoiceDetail] =
//     useState<any>(null);
//   const [deleteUser, setDeleteUser] = useState<any>(null);
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [deleteModal, setDeleteModal] = useState(false);
//   const [search, setSearch] = useState("");
//   const [statusFilter, setStatusFilter] = useState("All");
//   const [isEditing, setIsEditing] = useState(false);
//   const [editingRow, setEditingRow] = useState<any>(null);
//   const [formData, setFormData] = useState<any>(null);
//   const [dateRange, setDateRange] = useState("");
//   const [supplier, setSupplier] = useState("");
//   const [isOpen, setIsOpen] = React.useState(false);
//   const [isPurchaseReturnInvoiceOpen, setIsPurchaseReturnInvoiceOpen] =
//     React.useState(false);
//   const [loadingInvoiceDetail, setLoadingInvoiceDetail] = useState(false);

//   const [purchaseReturnDetail, setPurchaseReturnDetail] = useState<any>(null);
//   const [isPurchaseReturnDetailOpen, setIsPurchaseReturnDetailOpen] =
//     useState(false);
//   const [loadingPurchaseReturnDetail, setLoadingPurchaseReturnDetail] =
//     useState(false);

//   const handlePurchaseReturnClick = async (row: any) => {
//     console.log("handlePurchaseReturnClick called with:", row);

//     setPurchaseReturnDetail(null);
//     setIsPurchaseReturnDetailOpen(true);
//     setLoadingPurchaseReturnDetail(true);

//     try {
//       // Get supplier ID from the row data
//       const supplierId =
//         row.originalData?.supplierCompanyName?._id ||
//         row.supplierCompanyName?._id;

//       if (!supplierId) {
//         toast.error("Supplier ID not found");
//         return;
//       }

//       const response =
//         await purchaseInvoiceApi.getPurchaseReturnInvoicesBySupplier(
//           supplierId
//         );

//       if (response.success) {
//         setPurchaseReturnDetail(response.data);
//       } else {
//         toast.error("Failed to load purchase return details");
//       }
//     } catch (error) {
//       console.error("Error fetching purchase return details:", error);
//       toast.error("Failed to load purchase return details");
//     } finally {
//       setLoadingPurchaseReturnDetail(false);
//     }
//   };

//   const navigate = useNavigate();

//   const filteredData = data.filter((item) => {
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

//   const { RangePicker } = DatePicker;
//   const onClose = () => setIsOpen(false);

//   useEffect(() => {
//     const handleEsc = (event: KeyboardEvent) => {
//       if (event.key === "Escape") {
//         onClose();
//       }
//     };
//     document.addEventListener("keydown", handleEsc);
//     return () => document.removeEventListener("keydown", handleEsc);
//   }, [onClose]);

//   const PurchaseReturnData: PurchaseReturnDetail[] = [
//     {
//       itemdescription: "PI-1234",
//       qty: 1234,
//       rate: 200,
//       amount: 1100,
//     },
//     {
//       itemdescription: "PI-1234",
//       qty: 123,
//       rate: 200,
//       amount: 1100,
//     },
//     {
//       itemdescription: "PI-1234",
//       qty: 1234,
//       rate: 200,
//       amount: 1100,
//     },
//   ];

//   const PurchaseReturnDetail = [
//     { header: "ITEM DESCRIPTION", accessor: "itemdescription" },
//     { header: "QTY", accessor: "qty" },
//     { header: "RATE ($)", accessor: "rate" },
//     { header: "AMOUNT ($)", accessor: "amount" },
//   ];

//   // Handle Eye Click - Fetch Purchase Invoice Details
//   const handleEyeClick = async (row: any) => {
//     setPurchaseReturnInvoiceDetail(null);
//     setIsPurchaseReturnInvoiceOpen(true);
//     setLoadingInvoiceDetail(true);

//     try {
//       const response = await purchaseInvoiceApi.getOnePurchaseInvoice(row._id);
//       if (response.success) {
//         setPurchaseReturnInvoiceDetail(response.data);
//       } else {
//         toast.error("Failed to load purchase invoice details");
//       }
//     } catch (error) {
//       console.error("Error fetching purchase invoice details:", error);
//       toast.error("Failed to load purchase invoice details");
//     } finally {
//       setLoadingInvoiceDetail(false);
//     }
//   };

//   return (
//     <>
//       <div
//         className={`bg-white rounded-xl p-4 flex flex-col gap-4 overflow-hidden shadow-md ${className}`}
//       >
//         <div className="flex justify-between items-center">
//           <h2 className="text-xl font-semibold text-[#056BB7]">
//             Purchase Return
//           </h2>
//           <Button
//             onClick={() => navigate("create-purchase-return")}
//             text="Create Purchase Invoice"
//             className="bg-[#28A745] text-white font-medium h-10 px-4 border-none"
//           />
//         </div>

//         {/* Filters */}
//         <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 items-center justify-between">
//           <Input
//             placeholder="Search by Supplier Name, Invoice"
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             className="w-full !rounded-3xl"
//           />
//           <RangePicker className="h-10 !text-gray-400 !border-gray-300" />
//           <Dropdown
//             className="w-full md:auto"
//             options={["All", "Active", "Inactive"]}
//             DropDownName="Status"
//             defaultValue="All"
//             onSelect={(val) => {
//               setStatusFilter(val);
//               setCurrentPage(1);
//             }}
//           />
//           <div className="flex justify-start xl:justify-end md:col-span-4 lg:col-span-1 w-full">
//             <Button
//               onClick={() => {
//                 setSearch("");
//                 setDateRange("");
//                 setSupplier("");
//               }}
//               text="Reset Filters"
//               className="bg-[#056BB7] text-white border-none font-medium w-auto"
//             />
//           </div>
//         </div>

//         {/* Summary */}
//         <div className="bg-[#FCF3EC] py-3 px-4 rounded-md flex justify-end gap-6 text-md font-semibold">
//           <div>
//             Debit:{" "}
//             <span className="font-medium">
//               ${summaryData?.debit?.toLocaleString() || "0"}
//             </span>
//           </div>
//           <div>
//             Credit:{" "}
//             <span className="font-medium">
//               ${summaryData?.credit?.toLocaleString() || "0"}
//             </span>
//           </div>
//           <div>
//             Balance:{" "}
//             <span className="font-medium">
//               ${summaryData?.balance?.toLocaleString() || "0"}
//             </span>
//           </div>
//         </div>

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
//                   key={idx}
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
//                             <>
//                               <LuEye
//                                 size={20}
//                                 className="cursor-pointer mr-1"
//                                 onClick={() => handleEyeClick(row)}
//                               />
//                               {/* <img src={purchaseReturnIcon} alt="" width={17} /> */}
//                               {/* <img
//                                 src={purchaseReturnIcon}
//                                 alt="Purchase Return"
//                                 width={17}
//                                 className="cursor-pointer z-20"
//                                 onClick={() => {
//                                   console.log("fasdfsdfsdf");

//                                   handlePurchaseReturnClick(row);
//                                 }}
//                               /> */}

//                               <button
//                                 type="button"
//                                 className="cursor-pointer z-20 bg-transparent border-none p-0"
//                                 onClick={(e) => {
//                                   e.stopPropagation();
//                                   e.preventDefault();
//                                   console.log("Purchase return button clicked");
//                                   handlePurchaseReturnClick(row);
//                                 }}
//                               >
//                                 <img
//                                   src={purchaseReturnIcon}
//                                   alt="Purchase Return"
//                                   width={17}
//                                   className="cursor-pointer"
//                                 />
//                               </button>
//                             </>
//                           ) : (
//                             // @ts-ignore
//                             row[col.accessor]
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
//                     No data found.
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>

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

//       {/* Original Invoice Detail Modal */}
//       {invoiceDetail && (
//         <InvoiceDetailModal
//           isOpen={true}
//           onClose={() => {
//             setInvoiceDetail(null);
//             setIsOpen(false);
//           }}
//           columns={PurchaseReturnDetail}
//           data={PurchaseReturnData}
//         />
//       )}

//       {/* New Purchase Return Invoice Detail Modal */}
//       {isPurchaseReturnInvoiceOpen && (
//         <PurchaseReturnInvoiceDetailModal
//           isOpen={isPurchaseReturnInvoiceOpen}
//           onClose={() => {
//             setPurchaseReturnInvoiceDetail(null);
//             setIsPurchaseReturnInvoiceOpen(false);
//           }}
//           invoiceData={purchaseReturnInvoiceDetail}
//           loading={loadingInvoiceDetail}
//           loader={
//             <div className="flex justify-center items-center h-40">
//               <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//             </div>
//           }
//         />
//       )}

//       {/* Purchase Return Detail Modal */}
//       {isPurchaseReturnDetailOpen && (
//         <AllOfTheDetailsOfPurchaseReturn
//           isOpen={isPurchaseReturnDetailOpen}
//           onClose={() => {
//             setPurchaseReturnDetail(null);
//             setIsPurchaseReturnDetailOpen(false);
//           }}
//           purchaseReturnData={purchaseReturnDetail}
//           loading={loadingPurchaseReturnDetail}
//           loader={
//             <div className="flex justify-center items-center h-40">
//               <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//             </div>
//           }
//         />
//       )}

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
//               <h2 className="text-xl font-medium">Delete {deleteUser?.role}</h2>
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
//                 console.log("Form Submitted", formData);
//                 setIsEditing(false);
//               }}
//               className="flex flex-col gap-4"
//             >
//               <h2 className="text-lg font-semibold text-gray-800 mb-4">
//                 Edit User
//               </h2>

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
//               <h2 className="text-xl font-medium">Delete {deleteUser?.role}</h2>
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
//                 has been removed.
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

// export default PurchaseReturnTable;

import React, { useEffect, useMemo, useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import { AiOutlineDelete } from "react-icons/ai";
import { RiEditLine } from "react-icons/ri";
import { GoChevronLeft, GoChevronRight } from "react-icons/go";
import { LuEye } from "react-icons/lu";
import purchaseReturnIcon from "../assets/purchaseReturnIcon.svg";
import Input from "./Input";
import Dropdown from "./Dropdown";
import Button from "./Button";
import { useNavigate } from "react-router-dom";
import { DatePicker } from "antd";
import InvoiceDetailModal from "../../src/pages/dashboard/Inventory/InvoiceDetailModal";
import PurchaseReturnInvoiceDetailModal from "../pages/dashboard/Inventory/PurchaseReturnInvoiceDetailModal";
import AllOfTheDetailsOfPurchaseReturn from "../pages/dashboard/Inventory/AllOfTheDetailsOfPurchaseReturn";
import { purchaseInvoiceApi } from "../pages/dashboard/Inventory/PurchaseInvoiceApi";
import { toast } from "react-toastify";

type ColumnType = "text" | "image" | "status" | "actions" | "button" | "custom";

interface Column {
  header: string;
  accessor: string;
  type?: ColumnType;
}

interface PurchaseReturnDetail {
  itemdescription: string;
  qty: number;
  rate: number;
  amount: number;
}

interface SummaryData {
  debit: number;
  credit: number;
  balance: number;
}

interface PurchaseReturnTableProps {
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
  summaryData?: SummaryData;
  canUpdate?: boolean;
  canDelete?: boolean;
  canCreate?: boolean;
}

const PurchaseReturnTable: React.FC<PurchaseReturnTableProps> = ({
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
  summaryData,
  canUpdate = true,
  canDelete = true,
  canCreate = true,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [invoiceDetail, setInvoiceDetail] = useState<any>(null);
  const [purchaseReturnInvoiceDetail, setPurchaseReturnInvoiceDetail] =
    useState<any>(null);
  const [deleteUser, setDeleteUser] = useState<any>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dropdownKey, setDropdownKey] = useState(0);

  const [isEditing, setIsEditing] = useState(false);
  const [editingRow, setEditingRow] = useState<any>(null);
  const [formData, setFormData] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState(""); // Change from search
  const [dateRange, setDateRange] = useState<
    [Dayjs | null, Dayjs | null] | null
  >(null); // Update type
  const [supplier, setSupplier] = useState("");
  const [isOpen, setIsOpen] = React.useState(false);
  const [isPurchaseReturnInvoiceOpen, setIsPurchaseReturnInvoiceOpen] =
    React.useState(false);
  const [loadingInvoiceDetail, setLoadingInvoiceDetail] = useState(false);

  const [purchaseReturnDetail, setPurchaseReturnDetail] = useState<any>(null);
  const [isPurchaseReturnDetailOpen, setIsPurchaseReturnDetailOpen] =
    useState(false);
  const [loadingPurchaseReturnDetail, setLoadingPurchaseReturnDetail] =
    useState(false);

  const handlePurchaseReturnClick = async (row: any) => {
    console.log("handlePurchaseReturnClick called with:", row);

    setPurchaseReturnDetail(null);
    setIsPurchaseReturnDetailOpen(true);
    setLoadingPurchaseReturnDetail(true);

    try {
      // Get supplier ID from the row data
      const supplierId =
        row.originalData?.supplierCompanyName?._id ||
        row.supplierCompanyName?._id;

      if (!supplierId) {
        toast.error("Supplier ID not found");
        return;
      }

      const response =
        await purchaseInvoiceApi.getPurchaseReturnInvoicesBySupplier(
          supplierId
        );

      if (response.success) {
        setPurchaseReturnDetail(response.data);
      } else {
        toast.error("Failed to load purchase return details");
      }
    } catch (error) {
      console.error("Error fetching purchase return details:", error);
      toast.error("Failed to load purchase return details");
    } finally {
      setLoadingPurchaseReturnDetail(false);
    }
  };

  const navigate = useNavigate();

  // const filteredData = data.filter((item) => {
  //   const searchableItem = { ...item };
  //   delete searchableItem.status;

  //   const matchesSearch = Object.values(searchableItem)
  //     .join(" ")
  //     .toLowerCase()
  //     .includes(search.toLowerCase());

  //   const matchesStatus =
  //     statusFilter === "All" || item.status === statusFilter;

  //   return matchesSearch && matchesStatus;
  // });

  const filteredData = useMemo(() => {
    if (!data || data.length === 0) return data;

    return data.filter((item) => {
      const matchesSearch =
        searchTerm === "" ||
        Object.values(item).some((value) =>
          value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
        );

      const matchesStatus =
        statusFilter === "all" || item.returnStatus === statusFilter; // Change to "all"

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

  const { RangePicker } = DatePicker;
  const onClose = () => setIsOpen(false);

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  const PurchaseReturnData: PurchaseReturnDetail[] = [
    {
      itemdescription: "PI-1234",
      qty: 1234,
      rate: 200,
      amount: 1100,
    },
    {
      itemdescription: "PI-1234",
      qty: 123,
      rate: 200,
      amount: 1100,
    },
    {
      itemdescription: "PI-1234",
      qty: 1234,
      rate: 200,
      amount: 1100,
    },
  ];

  const PurchaseReturnDetail = [
    { header: "ITEM DESCRIPTION", accessor: "itemdescription" },
    { header: "QTY", accessor: "qty" },
    { header: "RATE ($)", accessor: "rate" },
    { header: "AMOUNT ($)", accessor: "amount" },
  ];

  // Handle Eye Click - Fetch Purchase Invoice Details
  const handleEyeClick = async (row: any) => {
    setPurchaseReturnInvoiceDetail(null);
    setIsPurchaseReturnInvoiceOpen(true);
    setLoadingInvoiceDetail(true);

    try {
      const response = await purchaseInvoiceApi.getOnePurchaseInvoice(row._id);
      if (response.success) {
        setPurchaseReturnInvoiceDetail(response.data);
      } else {
        toast.error("Failed to load purchase invoice details");
      }
    } catch (error) {
      console.error("Error fetching purchase invoice details:", error);
      toast.error("Failed to load purchase invoice details");
    } finally {
      setLoadingInvoiceDetail(false);
    }
  };

  return (
    <>
      <div
        className={`bg-white rounded-xl p-4 flex flex-col gap-4 overflow-hidden shadow-md ${className}`}
      >
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-[#056BB7]">
            Purchase Return
          </h2>

          {/* {!canCreate && (
            <Button
              text="Create Purchase Invoice"
              onClick={() =>
                navigate("create-purchase-return")}
              className={`px-6 !bg-[#056BB7] border-none text-white ${!canCreate ? "opacity-70 !cursor-not-allowed" : ""
                }`}
              // type="submit"
              disabled={canCreate}
            />
          )} */}

          <Button
            text="Create Purchase Invoice"
            className={`px-6 !bg-[#056BB7] border-none text-white ${!canCreate ? "opacity-70 !cursor-not-allowed" : ""
              }`}
            // type="submit"
            disabled={!canCreate}
            onClick={() =>
              navigate("create-purchase-return")}
          />
          {/* <Button
            text="Create Purchase Invoice"
            className="bg-[#28A745] text-white font-medium h-10 px-4 border-none"
          /> */}
        </div>

        {/* Filters */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 items-center justify-between">
          <Input
            placeholder="Search by Supplier Name, Invoice"
            value={searchTerm} // Change from search
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full !rounded-3xl"
          />
          <RangePicker
            className="h-10 !text-gray-400 !border-gray-300"
            value={dateRange}
            onChange={(dates) => setDateRange(dates)}
          />
          <Dropdown
            key={dropdownKey} // Add this line
            className="w-full md:auto"
            options={[
              "all",
              "notReturned",
              "partiallyReturned",
              "fullyReturned",
            ]}
            DropDownName="Status"
            defaultValue="all"
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
                setDropdownKey((prev) => prev + 1); // Add this line to force dropdown reset
              }}
              text="Reset Filters"
              className="bg-[#056BB7] text-white border-none font-medium w-auto"
            />
          </div>
        </div>

        {/* Summary */}
        <div className="bg-[#FCF3EC] py-3 px-4 rounded-md flex justify-end gap-6 text-md font-semibold">
          <div>
            Debit:{" "}
            <span className="font-medium">
              ${summaryData?.debit?.toLocaleString() || "0"}
            </span>
          </div>
          <div>
            Credit:{" "}
            <span className="font-medium">
              ${summaryData?.credit?.toLocaleString() || "0"}
            </span>
          </div>
          <div>
            Balance:{" "}
            <span className="font-medium">
              ${summaryData?.balance?.toLocaleString() || "0"}
            </span>
          </div>
        </div>

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
                  key={idx}
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
                            <>
                              <LuEye
                                size={20}
                                className="cursor-pointer mr-1"
                                onClick={() => handleEyeClick(row)}
                              />
                              {/* <img src={purchaseReturnIcon} alt="" width={17} /> */}
                              {/* <img
                                src={purchaseReturnIcon}
                                alt="Purchase Return"
                                width={17}
                                className="cursor-pointer z-20"
                                onClick={() => {
                                  console.log("fasdfsdfsdf");

                                  handlePurchaseReturnClick(row);
                                }}
                              /> */}

                              <button
                                type="button"
                                className="cursor-pointer z-20 bg-transparent border-none p-0"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  e.preventDefault();
                                  console.log("Purchase return button clicked");
                                  handlePurchaseReturnClick(row);
                                }}
                              >
                                <img
                                  src={purchaseReturnIcon}
                                  alt="Purchase Return"
                                  width={17}
                                  className="cursor-pointer"
                                />
                              </button>
                            </>
                          ) : col.accessor === "returnStatus" ? (
                            <span
                              className={`inline-block px-2 py-1 text-xs rounded-full font-semibold ${row.returnStatus === "notReturned"
                                ? "text-black"
                                : row.returnStatus === "fullyReturned"
                                  ? "text-green-700"
                                  : "text-orange-400"
                                }`}
                            >
                              {row[col.accessor]?.toUpperCase() || "N/A"}
                            </span>
                          ) : (
                            // @ts-ignore
                            row[col.accessor]
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
                    No data found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

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
      </div>

      {/* Original Invoice Detail Modal */}
      {invoiceDetail && (
        <InvoiceDetailModal
          isOpen={true}
          onClose={() => {
            setInvoiceDetail(null);
            setIsOpen(false);
          }}
          columns={PurchaseReturnDetail}
          data={PurchaseReturnData}
        />
      )}

      {/* New Purchase Return Invoice Detail Modal */}
      {isPurchaseReturnInvoiceOpen && (
        <PurchaseReturnInvoiceDetailModal
          isOpen={isPurchaseReturnInvoiceOpen}
          onClose={() => {
            setPurchaseReturnInvoiceDetail(null);
            setIsPurchaseReturnInvoiceOpen(false);
          }}
          invoiceData={purchaseReturnInvoiceDetail}
          loading={loadingInvoiceDetail}
          loader={
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          }
        />
      )}

      {/* Purchase Return Detail Modal */}
      {isPurchaseReturnDetailOpen && (
        <AllOfTheDetailsOfPurchaseReturn
          isOpen={isPurchaseReturnDetailOpen}
          onClose={() => {
            setPurchaseReturnDetail(null);
            setIsPurchaseReturnDetailOpen(false);
          }}
          purchaseReturnData={purchaseReturnDetail}
          loading={loadingPurchaseReturnDetail}
          loader={
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          }
        />
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
              <h2 className="text-xl font-medium">Delete {deleteUser?.role}</h2>
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
                ?
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
                Edit User
              </h2>

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
              <h2 className="text-xl font-medium">Delete {deleteUser?.role}</h2>
              <button
                onClick={() => setDeleteModal(false)}
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
                ?
              </h3>
              <p className="text-sm text-gray-700">
                The{" "}
                {tableTitle?.endsWith("s")
                  ? tableTitle?.slice(0, -1)
                  : tableTitle}{" "}
                has been removed.
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

export default PurchaseReturnTable;
