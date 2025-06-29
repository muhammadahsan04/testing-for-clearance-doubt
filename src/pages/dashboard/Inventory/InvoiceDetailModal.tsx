import React, { useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { RiEditLine } from "react-icons/ri";
import { GoChevronLeft, GoChevronRight } from "react-icons/go";
import { LuEye } from "react-icons/lu";
import Input from "../../../components/Input";
import Dropdown from "../../../components/Dropdown";
import Button from "../../../components/Button";

export type ColumnType =
  | "text"
  | "image"
  | "status"
  | "actions"
  | "button"
  | "custom"
  | "refrence";

export interface Column {
  header: string;
  accessor: string;
  type?: ColumnType;
}

interface InvoiceDetailProps {
  isOpen: boolean;
  onClose: () => void;
  eye?: boolean;
  enableRowModal?: boolean;
  onRowClick?: (row: any) => void;
  className?: string;
  columns: any[];
  data: any[];
  tableTitle?: string;
  rowsPerPageOptions?: number[];
  defaultRowsPerPage?: number;
  searchable?: boolean;
  filterByStatus?: boolean;
  onEdit?: (row: any) => void;
  onDelete?: (row: any) => void;
  tableDataAlignment?: string;
  dealBy?: any;
  invoiceData?: any;
  loading?: boolean;
  loader?: React.ReactNode;
}

const InvoiceDetailModal: React.FC<InvoiceDetailProps> = ({
  isOpen,
  onClose,
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
  invoiceData,
  loading = false,
  loader,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedUser, setSelectedUser] = useState<any>(null); // for modal
  const [deleteZone, setDeleteZone] = useState<any>(null); // for modal
  // const [showZoneDetail, setShowZoneDetail] = useState(null); // for modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [search, setSearch] = useState(""); // ✅ Local search state
  const [statusFilter, setStatusFilter] = useState("All"); // ✅ Status filter state

  // To these two state variables edit user
  const [isEditing, setIsEditing] = useState(false);
  const [editingRow, setEditingRow] = useState<any>(null);
  const [formData, setFormData] = useState<any>(null);

  // For supplier ledger
  // Update the calculateTotals function to properly calculate from items
  // const calculateTotals = () => {
  //   // Calculate subtotal from the sum of all item total costs
  //   const subtotal = data.reduce(
  //     (sum, item) => sum + (item.totalPriceOfCostItems || 0),
  //     0
  //   );

  //   // Calculate 10% tax on subtotal
  //   const taxRate = 0.1;
  //   const tax = subtotal * taxRate;

  //   // Total is subtotal + tax
  //   const total = subtotal + tax;

  //   return {
  //     subtotal: subtotal.toFixed(2),
  //     tax: tax.toFixed(2),
  //     total: total.toFixed(2),
  //   };
  // };

  // For store ledger
  // Update the calculateTotals function to properly calculate from items
  const calculateTotals = () => {
    // Calculate subtotal from the sum of all item total costs
    const subtotal = data.reduce(
      (sum, item) => sum + (item.totalPriceOfCostItems || 0),
      0
    );

    // Calculate 10% tax on subtotal
    const taxRate = 0.1;
    const tax = subtotal * taxRate;

    // Total is subtotal + tax
    const total = subtotal + tax;

    return {
      subtotal: subtotal.toFixed(2),
      tax: tax.toFixed(2),
      total: total.toFixed(2),
    };
  };

  const { subtotal, tax, total } = calculateTotals();

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
  // console.log("DATA", data);

  return (
    <>
      <div
        className="fixed inset-0 flex items-center justify-center bg-black/20 z-50"
        onClick={onClose}
      >
        <div
          className="animate-scaleIn bg-white rounded-2xl shadow-xl p-6 w-4xl Inter-font"
          onClick={(e) => e.stopPropagation()}
        >
          {loading ? (
            loader || <div>Loading...</div>
          ) : (
            // Your existing modal content with data
            <>
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-xl font-semibold text-[#056BB7]">
                  Invoice
                </h2>
                {/* // Update the Button to use window.print() directly */}
                <Button
                  text="Print"
                  className="bg-[#056BB7] text-white font-medium h-8 px-6 border-none"
                  onClick={() => window.print()}
                />
              </div>
              <div className="bg-white rounded-xl border border-gray-300 overflow-x-auto">
                <table className="w-full text-[12px] text-left text-gray-700 ">
                  <thead className="bg-[#F9FAFB] text-black">
                    <tr className="font-semibold text-[16px] whitespace-nowrap w-full">
                      {columns.map((col, index) => {
                        const isFirst = index === 0;
                        const isLast = index === columns.length - 1;

                        return (
                          <th
                            key={col.accessor}
                            className={`px-4 py-3 whitespace-nowrap text-left `}
                            style={{
                              ...(isFirst && {
                                width: "25%",
                                whiteSpace: "nowrap",
                              }),
                              ...(isLast && {
                                width: "9%",
                                whiteSpace: "nowrap",
                              }),
                            }}
                          >
                            <div
                              className={`flex flex-row items-center ${
                                isFirst
                                  ? "justify-start"
                                  : isLast
                                  ? "justify-end"
                                  : tableDataAlignment === "zone"
                                  ? "justify-center"
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
                        key={idx}
                        className="hover:bg-gray-50 whitespace-nowrap cursor-pointer"
                        onClick={() => {
                          //NEW
                          if (onRowClick) {
                            onRowClick(row);
                          } else if (enableRowModal) {
                            setSelectedUser(row);
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
                                className={`flex flex-row items-center ${
                                  isFirst
                                    ? "justify-start"
                                    : isLast
                                    ? "justify-end"
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
                                                src={row.userImage}
                                                alt="User"
                                                className="w-8 h-8 rounded-full"
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
                                              onClick={(e) =>
                                                e.stopPropagation()
                                              }
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
                                              setDeleteZone(row);
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

                <div className="border-b border-gray-400 py-3 gap-4 flex flex-col">
                  <div className="flex justify-between px-4 text-[15px]">
                    <p className="text-gray-600 font-semibold">Subtotal</p>
                    <p>${subtotal}</p>
                  </div>
                  <div className="flex justify-between px-4 ">
                    <p className="text-[12px] text-gray-600">Tax(10%)</p>
                    <p className="text-[15px]">${tax}</p>
                  </div>
                </div>
                <div className={``}>
                  <div className="flex justify-between px-4 text-[13px] py-4 ">
                    <p className="font-bold">
                      Total{" "}
                      <span className="font-medium text-gray-600">(USD)</span>
                    </p>
                    <p className="text-[#ED1B99]">${total}</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default InvoiceDetailModal;

// import type React from "react";
// import { useState } from "react";
// import { AiOutlineDelete } from "react-icons/ai";
// import { RiEditLine } from "react-icons/ri";
// import { LuEye } from "react-icons/lu";
// import Button from "../../../components/Button";

// export type ColumnType =
//   | "text"
//   | "image"
//   | "status"
//   | "actions"
//   | "button"
//   | "custom"
//   | "refrence";

// export interface Column {
//   header: string;
//   accessor: string;
//   type?: ColumnType;
// }

// interface InvoiceDetailProps {
//   isOpen: boolean;
//   onClose: () => void;
//   eye?: boolean;
//   enableRowModal?: boolean;
//   onRowClick?: (row: any) => void;
//   className?: string;
//   columns: any[];
//   data: any[];
//   tableTitle?: string;
//   rowsPerPageOptions?: number[];
//   defaultRowsPerPage?: number;
//   searchable?: boolean;
//   filterByStatus?: boolean;
//   onEdit?: (row: any) => void;
//   onDelete?: (row: any) => void;
//   tableDataAlignment?: string;
//   dealBy?: any;
//   invoiceData?: any;
//   loading?: boolean;
//   loader?: React.ReactNode;
// }

// const InvoiceDetailModal: React.FC<InvoiceDetailProps> = ({
//   isOpen,
//   onClose,
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
//   invoiceData,
//   loading = false,
//   loader,
// }) => {
//   const [currentPage, setCurrentPage] = useState(1);
//   const [rowsPerPage, setRowsPerPage] = useState(5);
//   const [selectedUser, setSelectedUser] = useState<any>(null); // for modal
//   const [deleteZone, setDeleteZone] = useState<any>(null); // for modal
//   // const [showZoneDetail, setShowZoneDetail] = useState(null); // for modal
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [deleteModal, setDeleteModal] = useState(false);
//   const [search, setSearch] = useState(""); // ✅ Local search state
//   const [statusFilter, setStatusFilter] = useState("All"); // ✅ Status filter state

//   // To these two state variables edit user
//   const [isEditing, setIsEditing] = useState(false);
//   const [editingRow, setEditingRow] = useState<any>(null);
//   const [formData, setFormData] = useState<any>(null);

//   // For supplier ledger
//   // Update the calculateTotals function to properly calculate from items
//   // const calculateTotals = () => {
//   //   // Calculate subtotal from the sum of all item total costs
//   //   const subtotal = data.reduce(
//   //     (sum, item) => sum + (item.totalPriceOfCostItems || 0),
//   //     0
//   //   );

//   //   // Calculate 10% tax on subtotal
//   //   const taxRate = 0.1;
//   //   const tax = subtotal * taxRate;

//   //   // Total is subtotal + tax
//   //   const total = subtotal + tax;

//   //   return {
//   //     subtotal: subtotal.toFixed(2),
//   //     tax: tax.toFixed(2),
//   //     total: total.toFixed(2),
//   //   };
//   // };

//   // For store ledger
//   // Update the calculateTotals function to properly calculate from items
//   const calculateTotals = () => {
//     const items = invoiceData?.items || [];

//     const subtotal = items.reduce(
//       (sum: any, item: any) => sum + (item.totalPriceOfCostItems || 0),
//       0
//     );

//     const taxRate = 0.1;
//     const tax = subtotal * taxRate;

//     const total = subtotal + tax;

//     return {
//       subtotal: subtotal.toFixed(2),
//       tax: tax.toFixed(2),
//       total: total.toFixed(2),
//     };
//   };

//   const { subtotal, tax, total } = calculateTotals();

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
//   // console.log("DATA", data);

//   return (
//     <>
//       <div
//         className="fixed inset-0 flex items-center justify-center bg-black/20 z-50"
//         onClick={onClose}
//       >
//         <div
//           className="animate-scaleIn bg-white rounded-2xl shadow-xl p-6 w-4xl Inter-font"
//           onClick={(e) => e.stopPropagation()}
//         >
//           {loading ? (
//             loader || <div>Loading...</div>
//           ) : (
//             // Your existing modal content with data
//             <>
//               <div className="flex justify-between items-center mb-3">
//                 <h2 className="text-xl font-semibold text-[#056BB7]">
//                   Invoice
//                 </h2>
//                 {/* // Update the Button to use window.print() directly */}
//                 <Button
//                   text="Print"
//                   className="bg-[#056BB7] text-white font-medium h-8 px-6 border-none"
//                   onClick={() => window.print()}
//                 />
//               </div>
//               <div className="bg-white rounded-xl border border-gray-300 overflow-x-auto">
//                 <table className="w-full text-[12px] text-left text-gray-700 ">
//                   <thead className="bg-[#F9FAFB] text-black">
//                     <tr className="font-semibold text-[16px] whitespace-nowrap w-full">
//                       {columns.map((col, index) => {
//                         const isFirst = index === 0;
//                         const isLast = index === columns.length - 1;

//                         return (
//                           <th
//                             key={col.accessor}
//                             className={`px-4 py-3 whitespace-nowrap text-left `}
//                             style={{
//                               ...(isFirst && {
//                                 width: "25%",
//                                 whiteSpace: "nowrap",
//                               }),
//                               ...(isLast && {
//                                 width: "9%",
//                                 whiteSpace: "nowrap",
//                               }),
//                             }}
//                           >
//                             <div
//                               className={`flex flex-row items-center ${
//                                 isFirst
//                                   ? "justify-start"
//                                   : isLast
//                                   ? "justify-end"
//                                   : tableDataAlignment === "zone"
//                                   ? "justify-center"
//                                   : "justify-center"
//                               }`}
//                             >
//                               {col.header}
//                             </div>
//                           </th>
//                         );
//                       })}
//                     </tr>
//                   </thead>
//                   <tbody className="border-b border-gray-400">
//                     {invoiceData?.items
//                       ? invoiceData.items.map((row: any, idx: number) => (
//                           <tr
//                             key={idx}
//                             className="hover:bg-gray-50 whitespace-nowrap cursor-pointer"
//                           >
//                             {columns.map((col, index) => {
//                               const isFirst = index === 0;
//                               const isLast = index === columns.length - 1;

//                               return (
//                                 <td
//                                   key={col.accessor}
//                                   className="px-4 py-2"
//                                   style={{ width: "max-content" }}
//                                 >
//                                   <div
//                                     className={`flex flex-row items-center ${
//                                       isFirst
//                                         ? "justify-start"
//                                         : isLast
//                                         ? "justify-end"
//                                         : "justify-center"
//                                     }`}
//                                   >
//                                     {/* @ts-ignore */}
//                                     {row[col.accessor]}
//                                   </div>
//                                 </td>
//                               );
//                             })}
//                           </tr>
//                         ))
//                       : currentData.map((row, idx) => (
//                           <tr
//                             key={idx}
//                             className="hover:bg-gray-50 whitespace-nowrap cursor-pointer"
//                             onClick={() => {
//                               //NEW
//                               if (onRowClick) {
//                                 onRowClick(row);
//                               } else if (enableRowModal) {
//                                 setSelectedUser(row);
//                               }
//                             }}
//                           >
//                             {columns.map((col, index) => {
//                               const isFirst = index === 0;
//                               const isLast = index === columns.length - 1;

//                               return (
//                                 <td
//                                   key={col.accessor}
//                                   className="px-4 py-2"
//                                   style={{ width: "max-content" }}
//                                 >
//                                   <div
//                                     className={`flex flex-row items-center ${
//                                       isFirst
//                                         ? "justify-start"
//                                         : isLast
//                                         ? "justify-end"
//                                         : "justify-center"
//                                     }`}
//                                   >
//                                     {(() => {
//                                       switch (col.type) {
//                                         case "image":
//                                           return (
//                                             <div className="flex gap-2 items-center">
//                                               {row.userImage ? (
//                                                 <>
//                                                   <img
//                                                     src={
//                                                       row.userImage ||
//                                                       "/placeholder.svg"
//                                                     }
//                                                     alt="User"
//                                                     className="w-8 h-8 rounded-full"
//                                                   />
//                                                   {row.productName}
//                                                 </>
//                                               ) : (
//                                                 <>{row.productName}</>
//                                               )}
//                                             </div>
//                                           );
//                                         case "status":
//                                           return (
//                                             <span
//                                               className={`inline-block px-2 py-1 text-xs rounded-full ${
//                                                 row.status === "Active"
//                                                   ? "bg-green-100 text-green-600"
//                                                   : "bg-red-100 text-red-600"
//                                               }`}
//                                             >
//                                               {row.status}
//                                             </span>
//                                           );
//                                         case "actions":
//                                           return (
//                                             <div className="flex justify-end gap-2">
//                                               {eye && (
//                                                 <LuEye
//                                                   className="cursor-pointer"
//                                                   onClick={(e) =>
//                                                     e.stopPropagation()
//                                                   }
//                                                 />
//                                               )}

//                                               <RiEditLine
//                                                 className="cursor-pointer"
//                                                 onClick={(e) => {
//                                                   e.stopPropagation();
//                                                   setIsEditing(true);
//                                                   setEditingRow(row);
//                                                   setFormData({ ...row }); // Initialize form data with the row data
//                                                 }}
//                                               />
//                                               <AiOutlineDelete
//                                                 className="cursor-pointer hover:text-red-500"
//                                                 onClick={(e) => {
//                                                   e.stopPropagation();
//                                                   setShowDeleteModal(true);
//                                                   setDeleteZone(row);
//                                                 }}
//                                               />
//                                             </div>
//                                           );
//                                         default:
//                                           return <>{row[col.accessor]}</>;
//                                       }
//                                     })()}
//                                   </div>
//                                 </td>
//                               );
//                             })}
//                           </tr>
//                         ))}
//                     {currentData.length === 0 && (
//                       <tr>
//                         <td
//                           colSpan={columns.length}
//                           className="text-center py-6 text-gray-500"
//                         >
//                           No data found.
//                         </td>
//                       </tr>
//                     )}
//                   </tbody>
//                 </table>

//                 <div className="border-b border-gray-400 py-3 gap-4 flex flex-col">
//                   <div className="flex justify-between px-4 text-[15px]">
//                     <p className="text-gray-600 font-semibold">Subtotal</p>
//                     <p>${subtotal}</p>
//                   </div>
//                   <div className="flex justify-between px-4 ">
//                     <p className="text-[12px] text-gray-600">Tax(10%)</p>
//                     <p className="text-[15px]">${tax}</p>
//                   </div>
//                 </div>
//                 <div className={``}>
//                   <div className="flex justify-between px-4 text-[13px] py-4 ">
//                     <p className="font-bold">
//                       Total{" "}
//                       <span className="font-medium text-gray-600">(USD)</span>
//                     </p>
//                     <p className="text-[#ED1B99]">${total}</p>
//                   </div>
//                 </div>
//               </div>
//             </>
//           )}
//         </div>
//       </div>
//     </>
//   );
// };

// export default InvoiceDetailModal;

// import type React from "react";
// import { useState } from "react";
// import { AiOutlineDelete } from "react-icons/ai";
// import { RiEditLine } from "react-icons/ri";
// import { LuEye } from "react-icons/lu";
// import Button from "../../../components/Button";

// export type ColumnType =
//   | "text"
//   | "image"
//   | "status"
//   | "actions"
//   | "button"
//   | "custom"
//   | "refrence";

// export interface Column {
//   header: string;
//   accessor: string;
//   type?: ColumnType;
// }

// interface InvoiceDetailProps {
//   isOpen: boolean;
//   onClose: () => void;
//   eye?: boolean;
//   enableRowModal?: boolean;
//   onRowClick?: (row: any) => void;
//   className?: string;
//   columns: any[];
//   data: any[];
//   tableTitle?: string;
//   rowsPerPageOptions?: number[];
//   defaultRowsPerPage?: number;
//   searchable?: boolean;
//   filterByStatus?: boolean;
//   onEdit?: (row: any) => void;
//   onDelete?: (row: any) => void;
//   tableDataAlignment?: string;
//   dealBy?: any;
//   invoiceData?: any;
//   loading?: boolean;
//   loader?: React.ReactNode;
// }

// const InvoiceDetailModal: React.FC<InvoiceDetailProps> = ({
//   isOpen,
//   onClose,
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
//   invoiceData,
//   loading = false,
//   loader,
// }) => {
//   const [currentPage, setCurrentPage] = useState(1);
//   const [rowsPerPage, setRowsPerPage] = useState(5);
//   const [selectedUser, setSelectedUser] = useState<any>(null); // for modal
//   const [deleteZone, setDeleteZone] = useState<any>(null); // for modal
//   // const [showZoneDetail, setShowZoneDetail] = useState(null); // for modal
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [deleteModal, setDeleteModal] = useState(false);
//   const [search, setSearch] = useState(""); // ✅ Local search state
//   const [statusFilter, setStatusFilter] = useState("All"); // ✅ Status filter state

//   // To these two state variables edit user
//   const [isEditing, setIsEditing] = useState(false);
//   const [editingRow, setEditingRow] = useState<any>(null);
//   const [formData, setFormData] = useState<any>(null);

//   // For supplier ledger
//   // Update the calculateTotals function to properly calculate from items
//   // const calculateTotals = () => {
//   //   // Calculate subtotal from the sum of all item total costs
//   //   const subtotal = data.reduce(
//   //     (sum, item) => sum + (item.totalPriceOfCostItems || 0),
//   //     0
//   //   );

//   //   // Calculate 10% tax on subtotal
//   //   const taxRate = 0.1;
//   //   const tax = subtotal * taxRate;

//   //   // Total is subtotal + tax
//   //   const total = subtotal + tax;

//   //   return {
//   //     subtotal: subtotal.toFixed(2),
//   //     tax: tax.toFixed(2),
//   //     total: total.toFixed(2),
//   //   };
//   // };

//   // For store ledger
//   // Update the calculateTotals function to properly calculate from items
//   const calculateTotals = () => {
//     const items = invoiceData?.items || [];
//     const subtotal = items.reduce(
//       (sum: any, item: any) => sum + (item.totalPriceOfCostItems || 0),
//       0
//     );

//     const taxRate = 0.1;
//     const tax = subtotal * taxRate;
//     const total = subtotal + tax;

//     return {
//       subtotal: subtotal.toFixed(2),
//       tax: tax.toFixed(2),
//       total: total.toFixed(2),
//     };
//   };

//   const { subtotal, tax, total } = calculateTotals();

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
//   // console.log("DATA", data);

//   return (
//     <>
//       <div
//         className="fixed inset-0 flex items-center justify-center bg-black/20 z-50"
//         onClick={onClose}
//       >
//         <div
//           className="animate-scaleIn bg-white rounded-2xl shadow-xl p-6 w-4xl Inter-font"
//           onClick={(e) => e.stopPropagation()}
//         >
//           {loading ? (
//             loader || <div>Loading...</div>
//           ) : (
//             // Your existing modal content with data
//             <>
//               <div className="flex justify-between items-center mb-3">
//                 <h2 className="text-xl font-semibold text-[#056BB7]">
//                   Invoice
//                 </h2>
//                 {/* // Update the Button to use window.print() directly */}
//                 <Button
//                   text="Print"
//                   className="bg-[#056BB7] text-white font-medium h-8 px-6 border-none"
//                   onClick={() => window.print()}
//                 />
//               </div>
//               <div className="bg-white rounded-xl border border-gray-300 overflow-x-auto">
//                 <table className="w-full text-[12px] text-left text-gray-700 ">
//                   <thead className="bg-[#F9FAFB] text-black">
//                     <tr className="font-semibold text-[16px] whitespace-nowrap w-full">
//                       {columns.map((col, index) => {
//                         const isFirst = index === 0;
//                         const isLast = index === columns.length - 1;

//                         return (
//                           <th
//                             key={col.accessor}
//                             className={`px-4 py-3 whitespace-nowrap text-left `}
//                             style={{
//                               ...(isFirst && {
//                                 width: "25%",
//                                 whiteSpace: "nowrap",
//                               }),
//                               ...(isLast && {
//                                 width: "9%",
//                                 whiteSpace: "nowrap",
//                               }),
//                             }}
//                           >
//                             <div
//                               className={`flex flex-row items-center ${
//                                 isFirst
//                                   ? "justify-start"
//                                   : isLast
//                                   ? "justify-end"
//                                   : tableDataAlignment === "zone"
//                                   ? "justify-center"
//                                   : "justify-center"
//                               }`}
//                             >
//                               {col.header}
//                             </div>
//                           </th>
//                         );
//                       })}
//                     </tr>
//                   </thead>
//                   <tbody className="border-b border-gray-400">
//                     {invoiceData?.items
//                       ? invoiceData.items.map((row: any, idx: number) => (
//                           <tr
//                             key={idx}
//                             className="hover:bg-gray-50 whitespace-nowrap cursor-pointer"
//                           >
//                             {columns.map((col, index) => {
//                               const isFirst = index === 0;
//                               const isLast = index === columns.length - 1;

//                               return (
//                                 <td
//                                   key={col.accessor}
//                                   className="px-4 py-2"
//                                   style={{ width: "max-content" }}
//                                 >
//                                   <div
//                                     className={`flex flex-row items-center ${
//                                       isFirst
//                                         ? "justify-start"
//                                         : isLast
//                                         ? "justify-end"
//                                         : "justify-center"
//                                     }`}
//                                   >
//                                     {(() => {
//                                       switch (col.type) {
//                                         case "image":
//                                           return (
//                                             <div className="flex gap-2 items-center">
//                                               {row.userImage ? (
//                                                 <>
//                                                   <img
//                                                     src={
//                                                       row.userImage ||
//                                                       "/placeholder.svg"
//                                                     }
//                                                     alt="User"
//                                                     className="w-8 h-8 rounded-full"
//                                                   />
//                                                   {row.productName}
//                                                 </>
//                                               ) : (
//                                                 <>{row.productName}</>
//                                               )}
//                                             </div>
//                                           );
//                                         case "status":
//                                           return (
//                                             <span
//                                               className={`inline-block px-2 py-1 text-xs rounded-full ${
//                                                 row.status === "Active"
//                                                   ? "bg-green-100 text-green-600"
//                                                   : "bg-red-100 text-red-600"
//                                               }`}
//                                             >
//                                               {row.status}
//                                             </span>
//                                           );
//                                         case "actions":
//                                           return (
//                                             <div className="flex justify-end gap-2">
//                                               {eye && (
//                                                 <LuEye
//                                                   className="cursor-pointer"
//                                                   onClick={(e) =>
//                                                     e.stopPropagation()
//                                                   }
//                                                 />
//                                               )}
//                                               <RiEditLine
//                                                 className="cursor-pointer"
//                                                 onClick={(e) => {
//                                                   e.stopPropagation();
//                                                   setIsEditing(true);
//                                                   setEditingRow(row);
//                                                   setFormData({ ...row });
//                                                 }}
//                                               />
//                                               <AiOutlineDelete
//                                                 className="cursor-pointer hover:text-red-500"
//                                                 onClick={(e) => {
//                                                   e.stopPropagation();
//                                                   setShowDeleteModal(true);
//                                                   setDeleteZone(row);
//                                                 }}
//                                               />
//                                             </div>
//                                           );
//                                         default:
//                                           return <>{row[col.accessor]}</>;
//                                       }
//                                     })()}
//                                   </div>
//                                 </td>
//                               );
//                             })}
//                           </tr>
//                         ))
//                       : currentData.map((row, idx) => (
//                           <tr
//                             key={idx}
//                             className="hover:bg-gray-50 whitespace-nowrap cursor-pointer"
//                             onClick={() => {
//                               //NEW
//                               if (onRowClick) {
//                                 onRowClick(row);
//                               } else if (enableRowModal) {
//                                 setSelectedUser(row);
//                               }
//                             }}
//                           >
//                             {columns.map((col, index) => {
//                               const isFirst = index === 0;
//                               const isLast = index === columns.length - 1;

//                               return (
//                                 <td
//                                   key={col.accessor}
//                                   className="px-4 py-2"
//                                   style={{ width: "max-content" }}
//                                 >
//                                   <div
//                                     className={`flex flex-row items-center ${
//                                       isFirst
//                                         ? "justify-start"
//                                         : isLast
//                                         ? "justify-end"
//                                         : "justify-center"
//                                     }`}
//                                   >
//                                     {(() => {
//                                       switch (col.type) {
//                                         case "image":
//                                           return (
//                                             <div className="flex gap-2 items-center">
//                                               {row.userImage ? (
//                                                 <>
//                                                   <img
//                                                     src={
//                                                       row.userImage ||
//                                                       "/placeholder.svg"
//                                                     }
//                                                     alt="User"
//                                                     className="w-8 h-8 rounded-full"
//                                                   />
//                                                   {row.productName}
//                                                 </>
//                                               ) : (
//                                                 <>{row.productName}</>
//                                               )}
//                                             </div>
//                                           );
//                                         case "status":
//                                           return (
//                                             <span
//                                               className={`inline-block px-2 py-1 text-xs rounded-full ${
//                                                 row.status === "Active"
//                                                   ? "bg-green-100 text-green-600"
//                                                   : "bg-red-100 text-red-600"
//                                               }`}
//                                             >
//                                               {row.status}
//                                             </span>
//                                           );
//                                         case "actions":
//                                           return (
//                                             <div className="flex justify-end gap-2">
//                                               {eye && (
//                                                 <LuEye
//                                                   className="cursor-pointer"
//                                                   onClick={(e) =>
//                                                     e.stopPropagation()
//                                                   }
//                                                 />
//                                               )}

//                                               <RiEditLine
//                                                 className="cursor-pointer"
//                                                 onClick={(e) => {
//                                                   e.stopPropagation();
//                                                   setIsEditing(true);
//                                                   setEditingRow(row);
//                                                   setFormData({ ...row }); // Initialize form data with the row data
//                                                 }}
//                                               />
//                                               <AiOutlineDelete
//                                                 className="cursor-pointer hover:text-red-500"
//                                                 onClick={(e) => {
//                                                   e.stopPropagation();
//                                                   setShowDeleteModal(true);
//                                                   setDeleteZone(row);
//                                                 }}
//                                               />
//                                             </div>
//                                           );
//                                         default:
//                                           return <>{row[col.accessor]}</>;
//                                       }
//                                     })()}
//                                   </div>
//                                 </td>
//                               );
//                             })}
//                           </tr>
//                         ))}
//                     {currentData.length === 0 && (
//                       <tr>
//                         <td
//                           colSpan={columns.length}
//                           className="text-center py-6 text-gray-500"
//                         >
//                           No data found.
//                         </td>
//                       </tr>
//                     )}
//                   </tbody>
//                 </table>

//                 <div className="border-b border-gray-400 py-3 gap-4 flex flex-col">
//                   <div className="flex justify-between px-4 text-[15px]">
//                     <p className="text-gray-600 font-semibold">Subtotal</p>
//                     <p>${subtotal}</p>
//                   </div>
//                   <div className="flex justify-between px-4 ">
//                     <p className="text-[12px] text-gray-600">Tax(10%)</p>
//                     <p className="text-[15px]">${tax}</p>
//                   </div>
//                 </div>
//                 <div className={``}>
//                   <div className="flex justify-between px-4 text-[13px] py-4 ">
//                     <p className="font-bold">
//                       Total{" "}
//                       <span className="font-medium text-gray-600">(USD)</span>
//                     </p>
//                     <p className="text-[#ED1B99]">${total}</p>
//                   </div>
//                 </div>
//               </div>
//             </>
//           )}
//         </div>
//       </div>
//     </>
//   );
// };

// export default InvoiceDetailModal;
