// import React, { useState } from "react";
// import { LuEye, LuChevronDown, LuChevronUp } from "react-icons/lu";
// import { RiFileList2Line } from "react-icons/ri";
// import Button from "./Button";
// import noseRing from "../assets/noseRing.png";
// import chain from "../assets/chain.png";
// import InvoiceDetailModal, {
//   Column as InvoiceColumn,
//   ColumnType as InvoiceColumnType,
// } from "../pages/dashboard/Inventory/InvoiceDetailModal";
// import SupplierLedgerDetailTable from "./SupplierLedgerDetailTable";

// interface PurchaseInvoiceDetail {
//   itemdescription: string;
//   qty: number;
//   rate: number;
//   amount: number;
//   productName: string;
//   userImage?: any;
//   prInvoiceNumber?: string;
//   itemName?: string;
//   prTotal?: number;
//   date?: string;
// }

// type ColumnType =
//   | "select"
//   | "text"
//   | "image"
//   | "status"
//   | "actions"
//   | "button"
//   | "custom"
//   | "refrence";

// interface Column {
//   header: string;
//   accessor: string;
//   type?: ColumnType;
// }

// interface StoreLedgerDetailTableProps {
//   columns: Column[];
//   data: any[];
//   tableTitle?: string;
//   tableDataAlignment?: "zone" | "user" | "center";
//   className?: string;
//   onRowClick?: (row: any) => void;
//   enableRowModal?: boolean;
//   eye?: boolean;
//   selectedRows?: { [key: string]: boolean };
//   onRowSelect?: (rowId: string) => void;
//   showTitle?: boolean;
//   marginTop?: string;
// }

// const StoreLedgerDetailTable: React.FC<StoreLedgerDetailTableProps> = ({
//   eye = true,
//   enableRowModal = true,
//   onRowClick,
//   className,
//   columns,
//   data,
//   tableTitle,
//   tableDataAlignment = "start",
//   selectedRows = {},
//   onRowSelect = () => {},
//   showTitle = true,
//   marginTop = "",
// }) => {
//   // const [expandedRow, setExpandedRow] = useState<string | null>(null);
//   const [ledgerInvoice, setLedgerInvoice] = useState<any>(null);
//   const [paymentDetail, setPaymentDetail] = useState<any>(null);
//   const [selectedPaymentRow, setSelectedPaymentRow] = useState<any>(null);
//   const [isOpen, setIsOpen] = useState(false);

//   const handleRowSelect = (rowId: string) => {
//     setSelectedPaymentRow((prev: any) => {
//       const newSelectedRows = { ...prev };
//       newSelectedRows[rowId] = !newSelectedRows[rowId];

//       // Log the selected row data
//       const selectedRow = payData.find((row) => row.invoice === rowId);
//       console.log("Selected/Deselected Row:", selectedRow);

//       // Log all currently selected rows after update
//       const allSelectedRowIds = Object.keys(newSelectedRows).filter(
//         (id) => newSelectedRows[id]
//       );
//       const allSelectedRowData = payData.filter((row) =>
//         allSelectedRowIds.includes(row.invoice)
//       );
//       console.log("All Selected Rows:", allSelectedRowData);

//       return newSelectedRows;
//     });
//   };
//   // Sample invoice detail data for expanded rows
//   const invoiceDetailData: { [key: string]: PurchaseInvoiceDetail[] } = {
//     "#78965": [
//       {
//         date: "13/1/2025",
//         prInvoiceNumber: "PR-123",
//         itemName: "Enchanted Locket",
//         qty: 2,
//         prTotal: 1000,
//         itemdescription: "PI-1234",
//         rate: 500,
//         amount: 1000,
//         productName: "Enchanted Locket",
//       },
//     ],
//     "#45632": [
//       {
//         date: "15/1/2025",
//         prInvoiceNumber: "PR-124",
//         itemName: "Gold Ring",
//         qty: 1,
//         prTotal: 200,
//         itemdescription: "PI-1235",
//         rate: 200,
//         amount: 200,
//         productName: "Gold Ring",
//       },
//     ],
//     "#53455": [
//       {
//         date: "18/1/2025",
//         prInvoiceNumber: "PR-125",
//         itemName: "Silver Chain",
//         qty: 3,
//         prTotal: 456,
//         itemdescription: "PI-1236",
//         rate: 152,
//         amount: 456,
//         productName: "Silver Chain",
//       },
//     ],
//     "#31247": [
//       {
//         date: "05/2/2025",
//         prInvoiceNumber: "PR-126",
//         itemName: "Diamond Bracelet",
//         qty: 1,
//         prTotal: 500,
//         itemdescription: "PI-1237",
//         rate: 500,
//         amount: 500,
//         productName: "Diamond Bracelet",
//       },
//     ],
//   };
//   console.log("DATA", data);

//   const payColumns: Column[] = [
//     { header: "Invoice", accessor: "invoice" },
//     { header: "Invoice Date", accessor: "invoiceDate" },
//     { header: "Status", accessor: "status", type: "status" },
//     { header: "Debit ($)", accessor: "debit", type: "text" },
//     { header: "Credit ($)", accessor: "credit", type: "text" },
//     { header: "Balance ($)", accessor: "balance", type: "text" },
//   ];

//   // All data with month information
//   const payData = [
//     {
//       invoice: "#78965",
//       invoiceDate: "15/2/2025",
//       status: "Partially Paid",
//       debit: "300",
//       balance: "100",
//       credit: "0",
//       refrenceNo: 785643,
//       month: "February",
//     },
//     {
//       invoice: "#45632",
//       invoiceDate: "28/2/2025",
//       status: "Paid",
//       debit: "200",
//       balance: "200",
//       credit: "0",
//       refrenceNo: 678934,
//       month: "February",
//     },
//     {
//       invoice: "#53455",
//       invoiceDate: "06/2/2025",
//       status: "Unpaid",
//       debit: "456",
//       balance: "120",
//       credit: "1",
//       refrenceNo: 678934,
//       month: "February",
//     },
//   ];

//   const purchaseInvoiceData = [
//     {
//       itemdescription: "PI-1234",
//       qty: 1234,
//       rate: 200,
//       amount: 1100,
//       productName: "Ring - Women - Cuban - 10k - 4.5CWT",
//       userImage: noseRing,
//     },
//     {
//       itemdescription: "PI-1234",
//       qty: 123,
//       rate: 200,
//       amount: 1100,
//       productName: "Bracelet - Men - Cuban - 10k - 4.5CWT",
//       userImage: chain,
//     },
//   ];
//   const purchaseInvoiceColumns: InvoiceColumn[] = [
//     { header: "Product Name", accessor: "productName", type: "image" },
//     { header: "QTY", accessor: "qty" },
//     { header: "RATE ($)", accessor: "rate" },
//     { header: "AMOUNT ($)", accessor: "amount" },
//   ];
//   // Toggle row expansion
//   // const toggleRowExpansion = (invoiceId: string) => {
//   //   if (expandedRow === invoiceId) {
//   //     setExpandedRow(null);
//   //   } else {
//   //     setExpandedRow(invoiceId);
//   //   }
//   // };

//   return (
//     <>
//       {/* Table Title */}
//       {showTitle && (
//         <div className={`flex justify-between w-full ${marginTop}`}>
//           <p className="text-[#5D6679] font-semibold text-[24px] pl-6">
//             {tableTitle}
//           </p>
//         </div>
//       )}

//       {/* Table */}
//       <div className="bg-white rounded-xl border border-gray-300 overflow-x-auto">
//         <table className="w-full text-sm text-left text-gray-700">
//           <thead className="bg-[#F9FAFB] text-black">
//             <tr className="font-semibold text-[16px] whitespace-nowrap w-full">
//               {columns.map((col) => (
//                 <th
//                   key={col.accessor}
//                   className="px-6 py-3"
//                   style={{ width: "max-content" }}
//                 >
//                   <div className="flex flex-row items-center justify-center">
//                     {col.header}
//                   </div>
//                 </th>
//               ))}
//             </tr>
//           </thead>
//           <tbody className="border-gray-400">
//             {data.map((row, idx) => (
//               <React.Fragment key={idx}>
//                 <tr className="hover:bg-gray-50 whitespace-nowrap cursor-pointer">
//                   {columns.map((col, index) => (
//                     <td
//                       key={col.accessor}
//                       className="px-6 py-2"
//                       style={{ width: "max-content" }}
//                     >
//                       <div className="flex flex-row items-center justify-center">
//                         {(() => {
//                           switch (col.type) {
//                             // case "select":
//                             //   return (
//                             //     <div
//                             //       className="flex gap-2 items-center"
//                             //       onClick={(e) => e.stopPropagation()}
//                             //     >
//                             //       <input
//                             //         type="checkbox"
//                             //         checked={selectedRows[row.invoice] || false}
//                             //         onChange={(e) => {
//                             //           e.stopPropagation();
//                             //           onRowSelect(row.invoice);
//                             //         }}
//                             //         className="form-checkbox h-4 w-4 text-blue-600 cursor-pointer"
//                             //       />
//                             //     </div>
//                             //   );
//                             case "image":
//                               return (
//                                 <div className="flex gap-2 items-center">
//                                   {row.userImage ? (
//                                     <>
//                                       <img
//                                         src={
//                                           row.userImage || "/placeholder.svg"
//                                         }
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
//                             case "refrence":
//                               return (
//                                 <div className="flex justify-center gap-2">
//                                   {typeof row.refrence === "number" ? (
//                                     <>
//                                       {row.refrence}
//                                       <RiFileList2Line
//                                         size={20}
//                                         className="cursor-pointer"
//                                         onClick={(e) => {
//                                           e.stopPropagation();
//                                           setPaymentDetail(row);
//                                         }}
//                                       />
//                                     </>
//                                   ) : (
//                                     <>{row.refrence}</>
//                                   )}
//                                 </div>
//                               );
//                             case "status":
//                               return (
//                                 <span
//                                   className={`inline-block px-2 py-1 text-xs rounded-full font-semibold ${
//                                     row.status === "Unpaid"
//                                       ? "text-black"
//                                       : row.status === "Paid"
//                                       ? "text-green-700"
//                                       : "text-orange-400"
//                                   }`}
//                                 >
//                                   {row.status}
//                                 </span>
//                               );
//                             case "actions":
//                               return (
//                                 <div className="flex justify-center gap-2">
//                                   {eye && (
//                                     <LuEye
//                                       size={20}
//                                       className="cursor-pointer"
//                                       onClick={(e) => {
//                                         e.stopPropagation();
//                                         setLedgerInvoice(row);
//                                         setIsOpen(true);
//                                       }}
//                                     />
//                                   )}
//                                   {/* {expandedRow === row.invoice ? (
//                                     <LuChevronUp size={20} />
//                                   ) : (
//                                     <LuChevronDown size={20} />
//                                   )} */}
//                                 </div>
//                               );
//                             default:
//                               return <>{row[col.accessor]}</>;
//                           }
//                         })()}
//                       </div>
//                     </td>
//                   ))}
//                 </tr>
//                 {/* Expanded Row Content */}
//                 {/* {expandedRow === row.invoice && (
//                   <tr className="Inter-font">
//                     <td
//                       colSpan={columns.length}
//                       className="p-0 border-t border-gray-200"
//                     >
//                       <div className="bg-[#f0f7f3] p-4 transition-all duration-300 ease-in-out">
//                         <table className="w-full text-sm border border-gray-300 rounded-lg overflow-hidden">
//                           <thead className="bg-[#e6f0eb] text-black font-semibold">
//                             <tr>
//                               <th className="px-4 py-2 text-left">Date</th>
//                               <th className="px-4 py-2 text-left">
//                                 PR Invoice Number
//                               </th>
//                               <th className="px-4 py-2 text-left">Item Name</th>
//                               <th className="px-4 py-2 text-center">QTY</th>
//                               <th className="px-4 py-2 text-right">
//                                 PR Total ($)
//                               </th>
//                             </tr>
//                           </thead>
//                           <tbody>
//                             {invoiceDetailData[row.invoice]?.map(
//                               (detail, detailIdx) => (
//                                 <tr key={detailIdx} className="bg-white">
//                                   <td className="px-4 py-2 text-left">
//                                     {detail.date}
//                                   </td>
//                                   <td className="px-4 py-2 text-left">
//                                     {detail.prInvoiceNumber}
//                                   </td>
//                                   <td className="px-4 py-2 text-left">
//                                     <div className="flex items-center gap-2">
//                                       <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
//                                         {detail.itemName?.charAt(0)}
//                                       </div>
//                                       {detail.itemName}
//                                     </div>
//                                   </td>
//                                   <td className="px-4 py-2 text-center">
//                                     {detail.qty}
//                                   </td>
//                                   <td className="px-4 py-2 text-right">
//                                     {detail.prTotal}
//                                   </td>
//                                 </tr>
//                               )
//                             )}
//                           </tbody>
//                         </table>
//                       </div>
//                     </td>
//                   </tr>
//                 )} */}
//               </React.Fragment>
//             ))}
//             {data.length === 0 && (
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
//       </div>

//       {paymentDetail && (
//         <div
//           className="fixed inset-0 flex items-center justify-center bg-black/20 z-50"
//           onClick={() => setPaymentDetail(false)}
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

//             <SupplierLedgerDetailTable
//               eye={true}
//               columns={payColumns}
//               data={payData}
//               marginTop="mt-4"
//               selectedRows={selectedRows}
//               onRowSelect={handleRowSelect}
//               onRowClick={(row) => console.log("Row clicked:", row)}
//             />
//           </div>
//         </div>
//       )}

//       {isOpen && (
//         <InvoiceDetailModal
//           isOpen={isOpen}
//           onClose={() => {
//             setLedgerInvoice(null);
//             setIsOpen(false);
//           }}
//           columns={purchaseInvoiceColumns}
//           data={data}
//         />
//       )}
//     </>
//   );
// };

// export default StoreLedgerDetailTable;

import React, { useState } from "react";
import { LuEye, LuChevronDown, LuChevronUp } from "react-icons/lu";
import { RiFileList2Line } from "react-icons/ri";
import Button from "./Button";
import noseRing from "../assets/noseRing.png";
import chain from "../assets/chain.png";
import InvoiceDetailModal, {
  Column as InvoiceColumn,
  ColumnType as InvoiceColumnType,
} from "../pages/dashboard/Inventory/InvoiceDetailModal";
import SupplierLedgerDetailTable from "./SupplierLedgerDetailTable";

interface PurchaseInvoiceDetail {
  itemdescription: string;
  qty: number;
  rate: number;
  amount: number;
  productName: string;
  userImage?: any;
  prInvoiceNumber?: string;
  itemName?: string;
  prTotal?: number;
  date?: string;
}

type ColumnType =
  | "select"
  | "text"
  | "image"
  | "status"
  | "actions"
  | "button"
  | "custom"
  | "refrence";

interface Column {
  header: string;
  accessor: string;
  type?: ColumnType;
}

interface StoreLedgerDetailTableProps {
  columns: Column[];
  data: any[];
  tableTitle?: string;
  tableDataAlignment?: "zone" | "user" | "center";
  className?: string;
  onRowClick?: (row: any) => void;
  enableRowModal?: boolean;
  eye?: boolean;
  selectedRows?: { [key: string]: boolean };
  onRowSelect?: (rowId: string) => void;
  showTitle?: boolean;
  marginTop?: string;
}

const StoreLedgerDetailTable: React.FC<StoreLedgerDetailTableProps> = ({
  eye = true,
  enableRowModal = true,
  onRowClick,
  className,
  columns,
  data,
  tableTitle,
  tableDataAlignment = "start",
  selectedRows = {},
  onRowSelect = () => {},
  showTitle = true,
  marginTop = "",
}) => {
  const [ledgerInvoice, setLedgerInvoice] = useState<any>(null);
  const [paymentDetail, setPaymentDetail] = useState<any>(null);
  const [selectedPaymentRow, setSelectedPaymentRow] = useState<any>(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleRowSelect = (rowId: string) => {
    setSelectedPaymentRow((prev: any) => {
      const newSelectedRows = { ...prev };
      newSelectedRows[rowId] = !newSelectedRows[rowId];

      const selectedRow = payData.find((row) => row.invoice === rowId);
      console.log("Selected/Deselected Row:", selectedRow);

      const allSelectedRowIds = Object.keys(newSelectedRows).filter(
        (id) => newSelectedRows[id]
      );
      const allSelectedRowData = payData.filter((row) =>
        allSelectedRowIds.includes(row.invoice)
      );
      console.log("All Selected Rows:", allSelectedRowData);

      return newSelectedRows;
    });
  };

  const payColumns: Column[] = [
    { header: "Invoice", accessor: "invoice" },
    { header: "Invoice Date", accessor: "invoiceDate" },
    { header: "Status", accessor: "status", type: "status" },
    { header: "Debit ($)", accessor: "debit", type: "text" },
    { header: "Credit ($)", accessor: "credit", type: "text" },
    { header: "Balance ($)", accessor: "balance", type: "text" },
  ];

  const payData = [
    {
      invoice: "#78965",
      invoiceDate: "15/2/2025",
      status: "Partially Paid",
      debit: "300",
      balance: "100",
      credit: "0",
      refrenceNo: 785643,
      month: "February",
    },
    {
      invoice: "#45632",
      invoiceDate: "28/2/2025",
      status: "Paid",
      debit: "200",
      balance: "200",
      credit: "0",
      refrenceNo: 678934,
      month: "February",
    },
    {
      invoice: "#53455",
      invoiceDate: "06/2/2025",
      status: "Unpaid",
      debit: "456",
      balance: "120",
      credit: "1",
      refrenceNo: 678934,
      month: "February",
    },
  ];

  const purchaseInvoiceColumns: InvoiceColumn[] = [
    { header: "Product Name", accessor: "productName", type: "image" },
    { header: "QTY", accessor: "qty" },
    { header: "RATE ($)", accessor: "rate" },
    { header: "AMOUNT ($)", accessor: "amount" },
  ];

  // Transform items from originalData for InvoiceDetailModal
  // const transformItemsForModal = (row: any) => {
  //   if (row.originalData && row.originalData.items) {
  //     return row.originalData.items.map((item: any) => ({
  //       itemdescription: item.item?.barcode || item._id || "N/A",
  //       qty: item.quantity || 0,
  //       rate: item.sellPrice || item.costPrice || 0,
  //       amount: item.totalSell || item.totalCost || 0,
  //       productName: item.item?.category?.name || "Unknown Product",
  //       userImage: item.item?.itemImage || null,
  //     }));
  //   }
  //   return [];
  // };

  const transformItemsForModal = (row: any) => {
    if (row.originalData && row.originalData.items) {
      return row.originalData.items.map((item: any) => ({
        itemdescription: item.item?.barcode || item._id || "N/A",
        qty: item.quantity || 0,
        rate: item.sellPrice || item.costPrice || 0,
        amount: item.totalSell || item.totalCost || 0,
        productName: item.item?.category?.name || "Unknown Product",
        userImage: item.item.itemImage
          ? `${import.meta.env.VITE_BASE_URL}${item.item.itemImage}`
          : null,
        // Add this for total calculation in modal
        totalPriceOfCostItems: item.totalSell || item.totalCost || 0,
      }));
    }
    return [];
  };

  return (
    <>
      {/* Table Title */}
      {showTitle && (
        <div className={`flex justify-between w-full ${marginTop}`}>
          <p className="text-[#5D6679] font-semibold text-[24px] pl-6">
            {tableTitle}
          </p>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-300 overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-700">
          <thead className="bg-[#F9FAFB] text-black">
            <tr className="font-semibold text-[16px] whitespace-nowrap w-full">
              {columns.map((col) => (
                <th
                  key={col.accessor}
                  className="px-6 py-3"
                  style={{ width: "max-content" }}
                >
                  <div className="flex flex-row items-center justify-center">
                    {col.header}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="border-gray-400">
            {data.map((row, idx) => (
              <React.Fragment key={idx}>
                <tr className="hover:bg-gray-50 whitespace-nowrap cursor-pointer">
                  {columns.map((col, index) => (
                    <td
                      key={col.accessor}
                      className="px-6 py-2"
                      style={{ width: "max-content" }}
                    >
                      <div className="flex flex-row items-center justify-center">
                        {(() => {
                          switch (col.type) {
                            case "select":
                              return (
                                <div
                                  className="flex gap-2 items-center"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <input
                                    type="checkbox"
                                    checked={selectedRows[row.invoice] || false}
                                    onChange={(e) => {
                                      e.stopPropagation();
                                      onRowSelect(row.invoice);
                                    }}
                                    className="form-checkbox h-4 w-4 text-blue-600 cursor-pointer"
                                  />
                                </div>
                              );
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
                                      {row.productName}
                                    </>
                                  ) : (
                                    <>{row.productName}</>
                                  )}
                                </div>
                              );
                            case "refrence":
                              return (
                                <div className="flex justify-center gap-2">
                                  {typeof row.refrence === "number" ? (
                                    <>
                                      {row.refrence}
                                      <RiFileList2Line
                                        size={20}
                                        className="cursor-pointer"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setPaymentDetail(row);
                                        }}
                                      />
                                    </>
                                  ) : (
                                    <>{row.refrence}</>
                                  )}
                                </div>
                              );
                            case "status":
                              return (
                                <span
                                  className={`inline-block px-2 py-1 text-xs rounded-full font-semibold ${
                                    row.status === "Unpaid"
                                      ? "text-black"
                                      : row.status === "Paid"
                                      ? "text-green-700"
                                      : "text-orange-400"
                                  }`}
                                >
                                  {row.status}
                                </span>
                              );
                            case "actions":
                              return (
                                <div className="flex justify-center gap-2">
                                  {eye && (
                                    <LuEye
                                      size={20}
                                      className="cursor-pointer"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setLedgerInvoice(row);
                                        setIsOpen(true);
                                      }}
                                    />
                                  )}
                                </div>
                              );
                            default:
                              return <>{row[col.accessor]}</>;
                          }
                        })()}
                      </div>
                    </td>
                  ))}
                </tr>
              </React.Fragment>
            ))}
            {data.length === 0 && (
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

      {paymentDetail && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black/20 z-50"
          onClick={() => setPaymentDetail(false)}
        >
          <div
            className="animate-scaleIn bg-white overflow-hidden w-[60vw] h-auto overflow-y-auto rounded-[7px] shadow-lg px-4 py-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-xl font-semibold text-[#056BB7]">Payment</h2>
              <Button
                text="Print"
                className="bg-[#056BB7] text-white font-medium h-8 px-6 border-none"
              />
            </div>
            <div className="flex items-center w-full mb-7 mt-4">
              <div className="w-1/2">
                <div className="flex text-[15px] Poppins-font font-medium">
                  <label htmlFor="" className="mb-1">
                    Refrence Number: <span className="font-light">387193</span>
                  </label>
                </div>
                <div className="flex text-[15px] Poppins-font font-medium">
                  <label htmlFor="" className="mb-1">
                    Payment Mode:{" "}
                    <span className="font-light">Bank Transfer</span>
                  </label>
                </div>
              </div>
              <div className="w-1/2">
                <div className="flex text-[15px] Poppins-font font-medium">
                  <label htmlFor="" className="mb-1">
                    Payment Date: <span className="font-light">11/4/2025</span>
                  </label>
                </div>
                <div className="flex text-[15px] Poppins-font font-medium">
                  <label htmlFor="" className="mb-1">
                    Bank: <span className="font-light">abc Bank</span>
                  </label>
                </div>
              </div>
            </div>

            <SupplierLedgerDetailTable
              eye={true}
              columns={payColumns}
              data={payData}
              marginTop="mt-4"
              selectedRows={selectedRows}
              onRowSelect={handleRowSelect}
              onRowClick={(row) => console.log("Row clicked:", row)}
            />
          </div>
        </div>
      )}

      {isOpen && (
        <InvoiceDetailModal
          isOpen={isOpen}
          onClose={() => {
            setLedgerInvoice(null);
            setIsOpen(false);
          }}
          columns={purchaseInvoiceColumns}
          data={transformItemsForModal(ledgerInvoice)}
        />
      )}
    </>
  );
};

export default StoreLedgerDetailTable;
