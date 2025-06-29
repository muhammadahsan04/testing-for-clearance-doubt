// import React, { useState } from "react";
// import { AiOutlineDelete } from "react-icons/ai";
// import { RiEditLine } from "react-icons/ri";
// import { GoChevronLeft, GoChevronRight } from "react-icons/go";
// import { LuEye } from "react-icons/lu";

// import Input from "./Input";
// import Dropdown from "./Dropdown";
// import Button from "./Button";
// import { Navigate, useNavigate } from "react-router-dom";
// import { IoIosPrint } from "react-icons/io";
// import HorizontalLinearAlternativeLabelStepper from "./HorizontalLinearAlternativeLabelStepper";
// import { FaDownload } from "react-icons/fa";
// type ColumnType = "text" | "image" | "status" | "actions" | "button" | "custom";

// interface Column {
//     header: string;
//     accessor: string;
//     type?: ColumnType;
// }

// export interface User {
//     id: string;
//     name: string;
//     role: string;
//     status: string;
//     userImage?: string;
//     [key: string]: any;
// }

// interface CreatePurchaseReturnTableProps {
//     columns: Column[];
//     data: any[];
//     tableTitle?: string;
//     rowsPerPageOptions?: number[];
//     defaultRowsPerPage?: number;
//     searchable?: boolean;
//     filterByStatus?: boolean;
//     onEdit?: (row: any) => void;
//     onDelete?: (row: any) => void;
//     tableDataAlignment?: "zone" | "user" | "center"; // Add more if needed
//     className?: string;
//     onRowClick?: (row: any) => void;
//     dealBy?: boolean;
//     enableRowModal?: boolean;
//     eye?: boolean;
// }

// const CreatePurchaseReturnTable: React.FC<CreatePurchaseReturnTableProps> = ({
//     eye,
//     enableRowModal = true,
//     onRowClick,
//     className,
//     columns,
//     data,
//     tableTitle,
//     rowsPerPageOptions = [5, 10, 15],
//     defaultRowsPerPage = 5,
//     searchable = true,
//     filterByStatus = true,
//     onEdit,
//     onDelete,
//     tableDataAlignment = "start", // default
//     dealBy,
// }) => {
//     const [currentPage, setCurrentPage] = useState(1);
//     const [rowsPerPage, setRowsPerPage] = useState(5);
//     const [selectedUser, setSelectedUser] = useState<any>(null); // for modal
//     const [showPurchaseOrderDetailModal, setShowPurchaseOrderDetailModal] =
//         useState<any>(null); // for modal
//     const [deleteUser, setDeleteUser] = useState<any>(null); // for modal
//     const [showDeleteModal, setShowDeleteModal] = useState(false);
//     const [deleteModal, setDeleteModal] = useState(false);
//     const [search, setSearch] = useState(""); // ✅ Local search state
//     const [statusFilter, setStatusFilter] = useState("All"); // ✅ Status filter state
//     // To these two state variables edit user
//     const [isEditing, setIsEditing] = useState(false);
//     const [editingRow, setEditingRow] = useState<any>(null);
//     const [formData, setFormData] = useState<any>(null);

//     const navigate = useNavigate();
//     const filteredData = data.filter((item) => {
//         // Create a version of the item without the status field for searching
//         const searchableItem = { ...item };
//         delete searchableItem.status;

//         const matchesSearch = Object.values(searchableItem)
//             .join(" ")
//             .toLowerCase()
//             .includes(search.toLowerCase());

//         const matchesStatus =
//             statusFilter === "All" || item.status === statusFilter;

//         return matchesSearch && matchesStatus;
//     });

//     const totalPages = Math.ceil(filteredData.length / rowsPerPage);
//     const currentData = filteredData.slice(
//         (currentPage - 1) * rowsPerPage,
//         currentPage * rowsPerPage
//     );

//     const handleChangePage = (page: number) => {
//         if (page >= 1 && page <= totalPages) setCurrentPage(page);
//     };
//     // console.log("DATA", isEditing);

//     return (
//         <>
//             {/* <div
//         className={`bg-white rounded-xl p-4 flex flex-col gap-5 overflow-hidden shadow-md ${className}`} */}
//             {/* > */}
//             {/* Search + Filter */}
//             {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center justify-between"> */}

//             {/* Table */}
//             <div className="bg-white rounded-xl border border-gray-300 overflow-x-auto">
//                 <table className="w-full text-sm text-left text-gray-700 ">
//                     <thead className="bg-[#F9FAFB] text-black">
//                         {/* <tr className="font-semibold text-[16px] whitespace-nowrap border-2">
//                 {columns.map((col) => (
//                   <th key={col.accessor} className="px-6 py-3">
//                     {col.header}
//                   </th>
//                 ))}
//               </tr> */}

//                         <tr className="font-semibold text-[16px] whitespace-nowrap w-full">
//                             {columns.map((col, index) => {
//                                 const isFirst = index === 0;
//                                 const isLast = index === columns.length - 1;

//                                 return (
//                                     <th
//                                         key={col.accessor}
//                                         className="px-3 py-3"
//                                         style={{ width: "max-content" }}
//                                     >
//                                         <div
//                                             className={`flex flex-row items-center ${isFirst
//                                                 ? "justify-start"
//                                                 : isLast
//                                                     ? "justify-end"
//                                                     : tableDataAlignment === "zone"
//                                                         ? "justify-center"
//                                                         : "justify-start"
//                                                 // : "justify-center" for zone
//                                                 // "justify-start"
//                                                 }`}
//                                         >
//                                             {col.header}
//                                         </div>
//                                     </th>
//                                 );
//                             })}
//                         </tr>
//                     </thead>
//                     <tbody className="border-gray-400">
//                         {currentData.map((row, idx) => (
//                             <tr
//                                 key={idx}
//                                 className="hover:bg-gray-50 whitespace-nowrap cursor-pointer"
//                                 // onClick={() => {
//                                 //   // Custom behavior per table usage OLD
//                                 //   if (onRowClick) {
//                                 //     onRowClick(row);
//                                 //   } else {
//                                 //     setSelectedUser(row);
//                                 //   }
//                                 // }}
//                                 onClick={() => {
//                                     //NEW
//                                     if (onRowClick) {
//                                         onRowClick(row);
//                                     } else if (enableRowModal) {
//                                         // setSelectedUser(row);
//                                     }
//                                 }}
//                             >
//                                 {columns.map((col, index) => {
//                                     const isFirst = index === 0;
//                                     const isLast = index === columns.length - 1;

//                                     return (
//                                         <td
//                                             key={col.accessor}
//                                             className="px-3 py-2"
//                                             style={{ width: "max-content" }}
//                                         >
//                                             <div
//                                                 className={`flex flex-row items-center ${isFirst
//                                                     ? "justify-start"
//                                                     : isLast
//                                                         ? "justify-end"
//                                                         : tableDataAlignment === "zone"
//                                                             ? "justify-center"
//                                                             : "justify-start"
//                                                     // : "justify-center" for zone
//                                                     // "justify-start"
//                                                     }`}
//                                             >
//                                                 {(() => {
//                                                     switch (col.type) {
//                                                         case "image":
//                                                             return (
//                                                                 <div className="flex gap-2 items-center">
//                                                                     {row.userImage ? (
//                                                                         <>
//                                                                             <img
//                                                                                 src={row.userImage}
//                                                                                 alt="User"
//                                                                                 className="w-8 h-8 rounded-full"
//                                                                             />
//                                                                             {row.name}
//                                                                         </>
//                                                                     ) : (
//                                                                         <>{row.name}</>
//                                                                     )}
//                                                                 </div>
//                                                             );
//                                                         case "status":
//                                                             return (
//                                                                 <span
//                                                                     className={`inline-block px-2 py-1 text-xs rounded-full font-semibold ${row.status === "Unpaid"
//                                                                             ? "text-black"
//                                                                             : row.status === "Paid"
//                                                                                 ? "text-green-700"
//                                                                                 : "text-orange-400"
//                                                                         }`}
//                                                                 >
//                                                                     {row.status}
//                                                                 </span>
//                                                             );
//                                                         case "actions":
//                                                             return (
//                                                                 <div className="flex justify-end gap-2">
//                                                                     {eye && (
//                                                                         <LuEye
//                                                                             className="cursor-pointer"
//                                                                             onClick={(e) => {
//                                                                                 e.stopPropagation();
//                                                                                 setShowPurchaseOrderDetailModal(row);
//                                                                                 // navigate("purchase-order-detail");
//                                                                             }}
//                                                                         />
//                                                                     )}

//                                                                     {/* <RiEditLine
//                                                                         className="cursor-pointer"
//                                                                         onClick={(e) => {
//                                                                             e.stopPropagation();
//                                                                             setIsEditing(true);
//                                                                             setEditingRow(row);
//                                                                             setFormData({ ...row }); // Initialize form data with the row data
//                                                                         }}
//                                                                     /> */}

//                                                                     <AiOutlineDelete
//                                                                         className="cursor-pointer hover:text-red-500"
//                                                                         onClick={(e) => {
//                                                                             e.preventDefault();
//                                                                             e.stopPropagation();
//                                                                             setShowDeleteModal(true);
//                                                                             setDeleteUser(row); // Make sure we're setting the user to delete
//                                                                         }}
//                                                                     />
//                                                                 </div>
//                                                             );
//                                                         default:
//                                                             return <>{row[col.accessor]}</>;
//                                                     }
//                                                 })()}
//                                             </div>
//                                         </td>
//                                     );
//                                 })}
//                             </tr>
//                         ))}
//                         {currentData.length === 0 && (
//                             <tr>
//                                 <td
//                                     colSpan={columns.length}
//                                     className="text-center py-6 text-gray-500"
//                                 >
//                                     No data found.
//                                 </td>
//                             </tr>
//                         )}
//                     </tbody>
//                 </table>
//             </div>
//             <div className="mt-5">
//                 <p className="Poppins-font font-medium text-sm mb-1">
//                     Terms $ Conditions /Notes
//                 </p>
//                 <textarea
//                     placeholder="Enter any terms, conditions, or additional notes here"
//                     rows={5}
//                     className="Poppins-font font-medium w-full px-2 py-2 border border-gray-300 rounded-md text-sm !focus:outline-none outline-none resize-none"
//                 ></textarea>
//             </div>
//             {/* </div> */}

//             {/* Modal */}
//             {showPurchaseOrderDetailModal && (
//                 <div
//                     className="fixed inset-0 flex items-center justify-center bg-black/20 z-50"
//                     onClick={() => setShowPurchaseOrderDetailModal(null)}
//                 >
//                     <div
//                         className="animate-scaleIn bg-white rounded-xl shadow-md p-6 md:p-10 w-4xl"
//                         onClick={(e) => e.stopPropagation()}
//                     >
//                         <div className="flex justify-between items-center mb-6">
//                             <h2 className="text-xl md:text-2xl font-semibold text-[#0873CD] Source-Sans-Pro-font">
//                                 Purchase Order Detail
//                             </h2>
//                             {/* <button className="flex items-center bg-gray-700 hover:bg-gray-600 text-sm px-3 py-3 h-fit leading-none rounded-md Inter-font text-white">

//             <IoIosPrint className="ml-1" color="white" />
//           </button> */}

//                             <Button
//                                 className="select-none bg-gray-700 hover:bg-gray-600"
//                                 variant="border"
//                                 fontFamily="Inter-font"
//                                 text="Print Info"
//                                 icon={<IoIosPrint color="white" />}
//                                 onClick={() => alert("Logout Button Clicked")}
//                             />
//                         </div>

//                         <div className="grid grid-cols-1 md:grid-cols-2 xl:gap-28 lg:gap-16 text-[14px] gap-8 md:gap-20 Poppins-font xl:text-[15px] lg:text-[14px]">
//                             <div className="space-y-3">
//                                 <div className="flex justify-between items-center">
//                                     <p className="font-medium">Supplier Company Name:</p>
//                                     <p className="text-[#5D6679] text-right">Royal Gems</p>
//                                 </div>
//                                 <div className="flex justify-between items-center">
//                                     <p className="font-medium">Catagory:</p>
//                                     <p className="text-[#5D6679]">Chain</p>
//                                 </div>
//                                 <div className="flex justify-between items-center">
//                                     <p className="font-medium">Sub Category:</p>
//                                     <p className="text-[#5D6679]">Man</p>
//                                 </div>
//                                 <div className="flex justify-between items-center">
//                                     <p className="font-medium">Style:</p>
//                                     <p className="text-[#5D6679]">Cuban</p>
//                                 </div>
//                                 <div className="flex justify-between items-center">
//                                     <p className="font-medium">Gold Category</p>
//                                     <p className="text-[#5D6679]">10K</p>
//                                 </div>
//                                 <div className="flex justify-between items-center">
//                                     <p className="font-medium">Diamond Weight</p>
//                                     <p className="text-[#5D6679]">4.5 CWT</p>
//                                 </div>
//                                 <div className="flex justify-between items-center">
//                                     <p className="font-medium">Gold Weight</p>
//                                     <p className="text-[#5D6679]">150 gm</p>
//                                 </div>
//                                 <div className="flex justify-between items-center">
//                                     <p className="font-medium">Length</p>
//                                     <p className="text-[#5D6679]">18"</p>
//                                 </div>
//                                 <div className="flex justify-between items-center">
//                                     <p className="font-medium">MM</p>
//                                     <p className="text-[#5D6679]">8mm</p>
//                                 </div>
//                                 <div className="flex justify-between items-center">
//                                     <p className="font-medium">Size</p>
//                                     <p className="text-[#5D6679]">7</p>
//                                 </div>
//                             </div>
//                             <div className="space-y-3">
//                                 <div className="flex justify-between items-center">
//                                     <p className="font-medium">DateDate of Purchase</p>
//                                     <p className="text-right">23-Mar-2025</p>
//                                 </div>
//                                 <div className="flex justify-between items-center">
//                                     <p className="font-medium">Expected Delivery Date</p>
//                                     <p className="text-right">25-Mar-2025</p>
//                                 </div>
//                                 <div className="flex justify-between items-center">
//                                     <p className="font-medium">Quantity:</p>
//                                     <p>3</p>
//                                 </div>
//                                 <div className="flex justify-between items-center">
//                                     <p className="font-medium">Price Per Unit</p>
//                                     <p>$800</p>
//                                 </div>
//                                 <div className="flex justify-between items-center">
//                                     <p className="font-medium">Total Cost</p>
//                                     <p>$2,400</p>
//                                 </div>
//                                 <div className="flex justify-between items-center">
//                                     <p className="font-medium">Invoice or Reference File</p>
//                                     <FaDownload className="text-gray-700 cursor-pointer" />
//                                 </div>

//                                 <HorizontalLinearAlternativeLabelStepper />

//                                 <div className="mt-6 flex justify-end items-center">
//                                     <button
//                                         className="bg-gray-100 hover:bg-gray-200 text-sm px-4 py-2 rounded-md"
//                                         onClick={() => setShowPurchaseOrderDetailModal(null)}
//                                     >
//                                         Back
//                                     </button>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             )}

//             {showDeleteModal && (
//                 <div
//                     // className="fixed inset-0 z-50 flex items-center justify-center bg-transparent backdrop-blur-xs bg-opacity-40 transition-opacity duration-300"
//                     className="fixed inset-0 flex items-center justify-center bg-black/20 z-50"
//                     onClick={() => {
//                         setShowDeleteModal(false);
//                         setDeleteUser(null);
//                     }}
//                 >
//                     <div
//                         className="animate-scaleIn bg-white rounded-xl w-full max-w-md relative shadow-lg border-3 border-gray-300"
//                         onClick={(e) => e.stopPropagation()}
//                     >
//                         <div className="flex justify-between items-center py-4 px-6 shadow-[0_2px_2px_0_#00000026]">
//                             <h2 className="text-xl font-medium">
//                                 Delete {deleteUser.productName}
//                             </h2>
//                             <button
//                                 onClick={() => setShowDeleteModal(false)}
//                                 className="text-xl font-bold text-gray-500 hover:text-gray-700"
//                             >
//                                 ×
//                             </button>
//                         </div>
//                         <div className="mt-8 text-start pb-8 px-6 shadow-[0_2px_2px_0_#00000026]">
//                             <h3 className="text-lg font-semibold mb-1">
//                                 Delete{" "}
//                                 {tableTitle?.endsWith("s")
//                                     ? tableTitle?.slice(0, -1)
//                                     : tableTitle}
//                                 ?
//                             </h3>
//                             <p className="text-sm text-gray-700">
//                                 Are you sure you want to delete this{" "}
//                                 {tableTitle?.endsWith("s")
//                                     ? tableTitle?.slice(0, -1)
//                                     : tableTitle}
//                                 ?
//                             </p>
//                             <p className="text-sm text-red-600 font-medium mt-1">
//                                 This action cannot be undone.
//                             </p>
//                         </div>

//                         <div className="flex justify-center gap-2 pb-3 py-4 px-6 shadow-[0_2px_2px_0_#00000026]">
//                             <button
//                                 onClick={() => setShowDeleteModal(false)}
//                                 className="px-5 py-1 rounded-md hover:bg-gray-100 border-none shadow-[inset_0_0_4px_#00000026]"
//                             >
//                                 Cancel
//                             </button>
//                             <Button
//                                 text="Delete"
//                                 icon={<AiOutlineDelete />}
//                                 onClick={() => {
//                                     setShowDeleteModal(false);
//                                     setDeleteModal(true);
//                                 }}
//                                 className="!border-none px-5 py-1 bg-[#DC2626] hover:bg-red-700 text-white rounded-md flex items-center gap-1"
//                             />
//                         </div>
//                     </div>
//                 </div>
//             )}

//             {isEditing && (
//                 <div
//                     // className="fixed inset-0 flex items-center justify-center bg-transparent backdrop-blur-xs bg-opacity-40 z-50"
//                     className="fixed inset-0 flex items-center justify-center bg-black/20 z-50"
//                     onClick={() => setIsEditing(false)}
//                 >
//                     <div
//                         className="animate-scaleIn bg-white w-[370px] h-auto rounded-[7px] p-6 shadow-lg relative"
//                         onClick={(e) => e.stopPropagation()}
//                     >
//                         <form
//                             onSubmit={(e) => {
//                                 e.preventDefault();
//                                 // Now this will log the updated data
//                                 console.log("Form Submitted", formData);
//                                 setIsEditing(false);
//                             }}
//                             className="flex flex-col gap-4"
//                         >
//                             <h2 className="text-lg font-semibold text-gray-800 mb-4">
//                                 Edit User
//                             </h2>

//                             {/* Name Input - now controlled */}
//                             <div>
//                                 <label className="block text-sm font-medium text-gray-600 mb-1">
//                                     Name
//                                 </label>
//                                 <input
//                                     type="text"
//                                     name="name"
//                                     value={formData?.name || ""}
//                                     onChange={(e) =>
//                                         setFormData({ ...formData, name: e.target.value })
//                                     }
//                                     placeholder="Enter name"
//                                     className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//                                 />
//                             </div>

//                             {/* Role Input - now controlled */}
//                             <div>
//                                 <label className="block text-sm font-medium text-gray-600 mb-1">
//                                     Role
//                                 </label>
//                                 <input
//                                     type="text"
//                                     name="role"
//                                     value={formData?.role || ""}
//                                     onChange={(e) =>
//                                         setFormData({ ...formData, role: e.target.value })
//                                     }
//                                     placeholder="Enter role"
//                                     className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//                                 />
//                             </div>

//                             {/* Status Dropdown - now controlled */}
//                             <div>
//                                 <label className="block text-sm font-medium text-gray-600 mb-1">
//                                     Status
//                                 </label>
//                                 <select
//                                     name="status"
//                                     value={formData?.status || ""}
//                                     onChange={(e) =>
//                                         setFormData({ ...formData, status: e.target.value })
//                                     }
//                                     className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//                                 >
//                                     <option value="">Select status</option>
//                                     <option value="Active">Active</option>
//                                     <option value="Inactive">Inactive</option>
//                                 </select>
//                             </div>

//                             <button
//                                 type="submit"
//                                 className="mt-4 w-full bg-blue-600 text-white font-semibold py-2 rounded-md hover:bg-blue-700 transition"
//                             >
//                                 Save Changes
//                             </button>
//                         </form>
//                     </div>
//                 </div>
//             )}

//             {deleteModal && (
//                 <div
//                     // className="fixed inset-0 z-50 flex items-center justify-center bg-transparent backdrop-blur-xs bg-opacity-40 transition-opacity duration-300"
//                     className="fixed inset-0 flex items-center justify-center bg-black/20 z-50"
//                     onClick={() => {
//                         setDeleteModal(false);
//                         setDeleteUser(null);
//                     }}
//                 >
//                     <div
//                         className="animate-scaleIn bg-white rounded-xl w-full max-w-md relative shadow-lg border-3 border-gray-300"
//                         onClick={(e) => e.stopPropagation()}
//                     >
//                         <div className="flex justify-between items-center py-4 px-6 shadow-[0_2px_2px_0_#00000026]">
//                             <h2 className="text-xl font-medium">
//                                 Delete {deleteUser.productName}
//                             </h2>
//                             <button
//                                 onClick={() => setDeleteModal(false)}
//                                 className="text-xl font-bold text-gray-500 hover:text-gray-700"
//                             >
//                                 ×
//                             </button>
//                         </div>
//                         {/* Body */}
//                         <div className="mt-8 text-start pb-8 px-6 shadow-[0_2px_2px_0_#00000026]">
//                             <h3 className="text-lg font-semibold mb-1">
//                                 Delete{" "}
//                                 {tableTitle?.endsWith("s")
//                                     ? tableTitle?.slice(0, -1)
//                                     : tableTitle}
//                                 ?
//                             </h3>
//                             <p className="text-sm text-gray-700">
//                                 The{" "}
//                                 {tableTitle?.endsWith("s")
//                                     ? tableTitle?.slice(0, -1)
//                                     : tableTitle}{" "}
//                                 has been remove
//                             </p>
//                         </div>
//                         <div className="flex justify-center gap-2 pb-3 py-4 px-6 shadow-[0_2px_2px_0_#00000026]">
//                             <Button
//                                 text="Cancel"
//                                 onClick={() => setDeleteModal(false)}
//                                 className="px-5 py-1 rounded-md hover:bg-gray-100 border-none shadow-[inset_0_0_4px_#00000026]"
//                             />
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </>
//     );
// };

// export default CreatePurchaseReturnTable;

import React, { useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { RiEditLine } from "react-icons/ri";
import { GoChevronLeft, GoChevronRight } from "react-icons/go";
import { LuEye } from "react-icons/lu";

import Input from "./Input";
import Dropdown from "./Dropdown";
import Button from "./Button";
import { Navigate, useNavigate } from "react-router-dom";
import { IoIosPrint } from "react-icons/io";
import HorizontalLinearAlternativeLabelStepper from "./HorizontalLinearAlternativeLabelStepper";
import { FaDownload } from "react-icons/fa";

type ColumnType =
  | "text"
  | "image"
  | "status"
  | "actions"
  | "button"
  | "custom"
  | "input";

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

interface CreatePurchaseReturnTableProps {
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
  onItemUpdate?: (index: number, field: string, value: any) => void;
  onDeleteItem?: (index: number) => void;
}

const CreatePurchaseReturnTable: React.FC<CreatePurchaseReturnTableProps> = ({
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
  onItemUpdate,
  onDeleteItem,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [showPurchaseOrderDetailModal, setShowPurchaseOrderDetailModal] =
    useState<any>(null);
  const [deleteUser, setDeleteUser] = useState<any>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [isEditing, setIsEditing] = useState(false);
  const [editingRow, setEditingRow] = useState<any>(null);
  const [formData, setFormData] = useState<any>(null);

  const navigate = useNavigate();

  const filteredData = data.filter((item) => {
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

  const handleInputChange = (index: number, field: string, value: any) => {
    if (onItemUpdate) {
      // For numeric fields, only convert to number if value is not empty
      const processedValue =
        field === "qty" ? (value === "" ? "" : parseFloat(value) || "") : value;
      onItemUpdate(index, field, processedValue);
    }
  };

  const handleDeleteRow = (index: number) => {
    if (onDeleteItem) {
      onDeleteItem(index);
    }
    setShowDeleteModal(false);
    setDeleteUser(null);
  };

  return (
    <>
      <div className="bg-white rounded-xl border border-gray-300 overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-700">
          <thead className="bg-[#F9FAFB] text-black">
            <tr className="font-semibold text-[16px] whitespace-nowrap w-full">
              {columns.map((col, index) => {
                const isFirst = index === 0;
                const isLast = index === columns.length - 1;

                return (
                  <th
                    key={col.accessor}
                    className="px-3 py-3"
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
          <tbody className="border-gray-400">
            {currentData.map((row, idx) => (
              <tr
                key={idx}
                className="hover:bg-gray-50 whitespace-nowrap"
                onClick={() => {
                  if (onRowClick) {
                    onRowClick(row);
                  } else if (enableRowModal) {
                    // setSelectedUser(row);
                  }
                }}
              >
                {columns.map((col, index) => {
                  const isFirst = index === 0;
                  const isLast = index === columns.length - 1;

                  return (
                    <td
                      key={col.accessor}
                      className="px-3 py-2"
                      style={{ width: "max-content" }}
                    >
                      <div
                        className={`flex flex-row items-center ${
                          isFirst
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
                                  className={`inline-block px-2 py-1 text-xs rounded-full font-semibold ${
                                    row.status === "Pending"
                                      ? "text-orange-600 bg-orange-100"
                                      : row.status === "Completed"
                                      ? "text-green-700 bg-green-100"
                                      : row.status === "Paid"
                                      ? "text-green-700 bg-green-100"
                                      : row.status === "Partially Paid"
                                      ? "text-orange-400 bg-orange-100"
                                      : "text-black bg-gray-100"
                                  }`}
                                >
                                  {row.status}
                                </span>
                              );
                            case "input":
                              return (
                                <input
                                  type="number"
                                  value={
                                    row[col.accessor] === 0
                                      ? ""
                                      : row[col.accessor]
                                  }
                                  onChange={(e) =>
                                    handleInputChange(
                                      idx,
                                      col.accessor,
                                      e.target.value
                                    )
                                  }
                                  className="w-20 px-2 py-1 border border-gray-300 rounded text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  min="0"
                                  max={row.maxQuantity || undefined}
                                  step="1"
                                  placeholder="0"
                                  onWheel={(e: any) => e.target.blur()}
                                />
                              );
                            case "actions":
                              return (
                                <div className="flex justify-end gap-2">
                                  {eye && (
                                    <LuEye
                                      className="cursor-pointer text-blue-600 hover:text-blue-800"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setShowPurchaseOrderDetailModal(row);
                                      }}
                                    />
                                  )}
                                  <AiOutlineDelete
                                    className="cursor-pointer text-red-600 hover:text-red-800"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      setShowDeleteModal(true);
                                      setDeleteUser({ ...row, index: idx });
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
                  No items added yet. Use the "Add Item" button to add products
                  for return.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Purchase Order Detail Modal */}
      {/* {showPurchaseOrderDetailModal && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black/20 z-50"
          onClick={() => setShowPurchaseOrderDetailModal(null)}
        >
          <div
            className="animate-scaleIn bg-white rounded-xl shadow-md p-6 md:p-10 w-4xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl md:text-2xl font-semibold text-[#0873CD] Source-Sans-Pro-font">
                Purchase Return Item Detail
              </h2>

              <Button
                className="select-none bg-gray-700 hover:bg-gray-600"
                variant="border"
                fontFamily="Inter-font"
                text="Print Info"
                icon={<IoIosPrint color="white" />}
                onClick={() => alert("Print Button Clicked")}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:gap-28 lg:gap-16 text-[14px] gap-8 md:gap-20 Poppins-font xl:text-[15px] lg:text-[14px]">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <p className="font-medium">Product Name:</p>
                  <p className="text-[#5D6679] text-right">
                    {showPurchaseOrderDetailModal.productName}
                  </p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="font-medium">Barcode:</p>
                  <p className="text-[#5D6679]">
                    {showPurchaseOrderDetailModal.barcode}
                  </p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="font-medium">Purchase Invoice:</p>
                  <p className="text-[#5D6679]">
                    {showPurchaseOrderDetailModal.pInvoice}
                  </p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="font-medium">Return Quantity:</p>
                  <p className="text-[#5D6679]">
                    {showPurchaseOrderDetailModal.qty}
                  </p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="font-medium">Max Available Quantity:</p>
                  <p className="text-[#5D6679]">
                    {showPurchaseOrderDetailModal.maxQuantity || "N/A"}
                  </p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <p className="font-medium">Cost Price:</p>
                  <p className="text-right">
                    ${showPurchaseOrderDetailModal.costPrice}
                  </p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="font-medium">Credit Amount:</p>
                  <p className="text-right">
                    ${showPurchaseOrderDetailModal.credit}
                  </p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="font-medium">Status:</p>
                  <p
                    className={`${
                      showPurchaseOrderDetailModal.status === "Pending"
                        ? "text-orange-600"
                        : "text-green-600"
                    }`}
                  >
                    {showPurchaseOrderDetailModal.status}
                  </p>
                </div>

                <div className="mt-6 flex justify-end items-center">
                  <button
                    className="bg-gray-100 hover:bg-gray-200 text-sm px-4 py-2 rounded-md"
                    onClick={() => setShowPurchaseOrderDetailModal(null)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )} */}
      {/* Purchase Order Detail Modal */}
      {showPurchaseOrderDetailModal && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black/20 z-50"
          onClick={() => setShowPurchaseOrderDetailModal(null)}
        >
          <div
            className="animate-scaleIn bg-white rounded-xl shadow-md p-6 md:p-10 w-4xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl md:text-2xl font-semibold text-[#0873CD] Source-Sans-Pro-font">
                Purchase Return Item Detail
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
                  <p className="font-medium">Product Name:</p>
                  <p className="text-[#5D6679] text-right">
                    {showPurchaseOrderDetailModal?.productName}
                  </p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="font-medium">Barcode:</p>
                  <p className="text-[#5D6679]">
                    {showPurchaseOrderDetailModal?.barcode}
                  </p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="font-medium">Purchase Invoice:</p>
                  <p className="text-[#5D6679]">
                    {showPurchaseOrderDetailModal?.pInvoice}
                  </p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="font-medium">Supplier:</p>
                  <p className="text-[#5D6679]">
                    {showPurchaseOrderDetailModal?.supplierName || "N/A"}
                  </p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="font-medium">Sub Category:</p>
                  <p className="text-[#5D6679]">
                    {showPurchaseOrderDetailModal?.subCategory || "N/A"}
                  </p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="font-medium">Unit Type:</p>
                  <p className="text-[#5D6679]">
                    {showPurchaseOrderDetailModal?.unitType || "N/A"}
                  </p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="font-medium">Size:</p>
                  <p className="text-[#5D6679]">
                    {showPurchaseOrderDetailModal?.size || "N/A"}
                  </p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="font-medium">Length:</p>
                  <p className="text-[#5D6679]">
                    {showPurchaseOrderDetailModal?.length || "N/A"}
                  </p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="font-medium">MM:</p>
                  <p className="text-[#5D6679]">
                    {showPurchaseOrderDetailModal?.mm || "N/A"}
                  </p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <p className="font-medium">Total Quantity:</p>
                  <p className="text-[#5D6679]">
                    {showPurchaseOrderDetailModal?.totalqty || "N/A"}
                  </p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="font-medium">Return Quantity:</p>
                  <p className="text-[#5D6679]">
                    {showPurchaseOrderDetailModal?.qty}
                  </p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="font-medium">Max Available Quantity:</p>
                  <p className="text-[#5D6679]">
                    {showPurchaseOrderDetailModal?.maxQuantity || "N/A"}
                  </p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="font-medium">Cost Price:</p>
                  <p className="text-right">
                    ${showPurchaseOrderDetailModal?.costPrice}
                  </p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="font-medium">Sell Price:</p>
                  <p className="text-right">
                    ${showPurchaseOrderDetailModal?.sellPrice || "N/A"}
                  </p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="font-medium">Gold Weight:</p>
                  <p className="text-[#5D6679]">
                    {showPurchaseOrderDetailModal?.goldWeight || "N/A"}
                  </p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="font-medium">Diamond Weight:</p>
                  <p className="text-[#5D6679]">
                    {showPurchaseOrderDetailModal?.diamondWeight || "N/A"}
                  </p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="font-medium">Search Tags:</p>
                  <p className="text-[#5D6679] text-right">
                    {showPurchaseOrderDetailModal?.searchTag || "N/A"}
                  </p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="font-medium">Status:</p>
                  <p
                    className={`${
                      showPurchaseOrderDetailModal?.status === "Pending"
                        ? "text-orange-600"
                        : "text-green-600"
                    }`}
                  >
                    {showPurchaseOrderDetailModal?.status}
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-end items-center">
              <button
                className="bg-gray-100 hover:bg-gray-200 text-sm px-4 py-2 rounded-md"
                onClick={() => setShowPurchaseOrderDetailModal(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
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
              <h2 className="text-xl font-medium">
                Delete {deleteUser?.productName}
              </h2>
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
                Are you sure you want to delete this item from the purchase
                return?
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
                  handleDeleteRow(deleteUser?.index);
                  setDeleteModal(true);
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
            setDeleteUser(null);
          }}
        >
          <div
            className="animate-scaleIn bg-white rounded-xl w-full max-w-md relative shadow-lg border-3 border-gray-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center py-4 px-6 shadow-[0_2px_2px_0_#00000026]">
              <h2 className="text-xl font-medium">Item Deleted</h2>
              <button
                onClick={() => setDeleteModal(false)}
                className="text-xl font-bold text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
            <div className="mt-8 text-start pb-8 px-6 shadow-[0_2px_2px_0_#00000026]">
              <h3 className="text-lg font-semibold mb-1">
                Item Removed Successfully
              </h3>
              <p className="text-sm text-gray-700">
                The item has been removed from the purchase return.
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

export default CreatePurchaseReturnTable;
