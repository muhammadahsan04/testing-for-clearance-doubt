// import React, { useState, useEffect } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import { IoArrowBack } from "react-icons/io5";
// import SupplierLedgerDetailTable from "../../../components/SupplierLedgerDetailTable";
// import axios from "axios";
// import Input from "../../../components/Input";
// import Dropdown from "../../../components/Dropdown";
// import Button from "../../../components/Button";
// import plusIcon from "../../../assets/plus.svg";
// import InvoiceDetailModal from "../Inventory/InvoiceDetailModal";
// import { toast } from "react-toastify";

// interface SupplierInvoice {
//   _id: string;
//   piId: string;
//   supplierCompanyName: any;
//   referenceNumber: string;
//   purchaseOrderReference: string;
//   dateReceiving: string;
//   dueDate: string;
//   status: string;
//   items: any[];
//   totals: {
//     debit: number;
//     credit: number;
//     balance: number;
//   };
//   description: string;
//   paymentHistory: any[];
//   remainingBalance?: number;
//   totalPaid?: number;
//   createdAt: string;
//   updatedAt: string;
// }
// interface Column {
//   header: string;
//   accessor: string;
//   type?: "select" | "text" | "image" | "status" | "actions" | "refrence";
// }
// interface TransformedInvoiceData {
//   invoice: string;
//   invoiceDate: string;
//   status: string;
//   debit: string;
//   credit: string;
//   refrence: string;
//   month: string;
//   remainingBalance: number;
//   totalPaid: number;
// }

// const payColumns: Column[] = [
//   { header: "Invoice", accessor: "invoice" },
//   { header: "Invoice Date", accessor: "invoiceDate" },
//   { header: "Status", accessor: "status", type: "status" },
//   { header: "Debit ($)", accessor: "debit", type: "text" },
//   { header: "Credit ($)", accessor: "credit", type: "text" },
//   { header: "Balance ($)", accessor: "balance", type: "text" },
//   { header: "Actions", accessor: "actions", type: "actions" },
// ];

// const SupplierDetailPage = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const [supplierName, setSupplierName] = useState<string>("");
//   const [supplierInvoices, setSupplierInvoices] = useState<SupplierInvoice[]>(
//     []
//   );
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [supplierId, setSupplierId] = useState<string>("");
//   const [isEditing, setIsEditing] = useState(false);
//   const [search, setSearch] = useState("");
//   const [statusFilter, setStatusFilter] = useState("All");
//   const [selectedInvoiceData, setSelectedInvoiceData] =
//     useState<SupplierInvoice | null>(null);
//   const [selectedInvoicesForPayment, setSelectedInvoicesForPayment] = useState<
//     any[]
//   >([]);
//   const [showPaymentModeModal, setShowPaymentModeModal] = useState(false);
//   const [showBankModal, setShowBankModal] = useState(false);
//   const [paymentModes, setPaymentModes] = useState<any[]>([]);
//   const [banks, setBanks] = useState<any[]>([]);
//   const [paymentModeForm, setPaymentModeForm] = useState({
//     name: "",
//     description: "",
//   });
//   const [bankForm, setBankForm] = useState({ name: "", description: "" });
//   console.log("selectedInvoiceData", selectedInvoiceData);

//   // Add state to track selected rows
//   const [selectedRows, setSelectedRows] = useState<{ [key: string]: boolean }>(
//     {}
//   );
//   const getAuthToken = () => {
//     let token = localStorage.getItem("token");
//     if (!token) {
//       token = sessionStorage.getItem("token");
//     }
//     return token;
//   };

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
//   ];

//   // const handleRowSelect = (rowId: string) => {
//   //   setSelectedRows((prev) => ({
//   //     ...prev,
//   //     [rowId]: !prev[rowId],
//   //   }));
//   // };

//   const handleRowSelect = (rowId: string, allSelectedRows?: any) => {
//     if (allSelectedRows !== undefined) {
//       // If allSelectedRows is provided, use it (for single select from child component)
//       setSelectedRows(allSelectedRows);
//     } else {
//       // Original multi-select logic (keep for backward compatibility)
//       setSelectedRows((prev) => ({
//         ...prev,
//         [rowId]: !prev[rowId],
//       }));
//     }
//   };

//   const fetchSupplierInvoices = async (id: string) => {
//     try {
//       setLoading(true);
//       const API_URL =
//         import.meta.env.VITE_BASE_URL || "http://192.168.100.18:9000";
//       const token = getAuthToken();

//       if (!token) {
//         setError("No authentication token found");
//         return;
//       }

//       const response = await axios.get(
//         `${API_URL}/api/abid-jewelry-ms/getInvoiceBySupplier/${id}`,
//         {
//           headers: {
//             "x-access-token": token,
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       if (response.data.success) {
//         console.log("response.data.data", response.data.data);
//         setSupplierInvoices(response.data.data);
//         if (
//           response.data.data.length > 0 &&
//           response.data.data[0].supplierCompanyName
//         ) {
//           setSupplierName(
//             response.data.data[0].supplierCompanyName.companyName
//           );
//         }
//         setError(null);
//       } else {
//         setError("Failed to fetch supplier invoices");
//       }
//     } catch (error) {
//       console.error("Error fetching supplier invoices:", error);
//       setError("Error fetching supplier invoices");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (location.state && location.state.supplier) {
//       setSupplierName(location.state.supplier);
//       if (location.state.supplierData) {
//         setSupplierId(location.state.supplierData._id);
//       }
//     } else {
//       const pathParts = location.pathname.split("/");
//       if (pathParts.length > 0) {
//         const lastPart = pathParts[pathParts.length - 1];
//         if (lastPart !== "supplier-ledger" && lastPart) {
//           setSupplierId(lastPart);
//         }
//       }
//     }
//   }, [location]);

//   useEffect(() => {
//     if (supplierId) {
//       fetchSupplierInvoices(supplierId);
//     }
//   }, [supplierId]);

//   const fetchPaymentModes = async () => {
//     try {
//       const API_URL =
//         import.meta.env.VITE_BASE_URL || "http://192.168.100.18:9000";
//       const token = getAuthToken();

//       const response = await axios.get(
//         `${API_URL}/api/abid-jewelry-ms/getAllPayments`,
//         {
//           headers: {
//             "x-access-token": token,
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       if (response.data.success) {
//         setPaymentModes(response.data.data);
//       }
//     } catch (error) {
//       console.error("Error fetching payment modes:", error);
//     }
//   };

//   const fetchBanks = async () => {
//     try {
//       const API_URL =
//         import.meta.env.VITE_BASE_URL || "http://192.168.100.18:9000";
//       const token = getAuthToken();

//       const response = await axios.get(
//         `${API_URL}/api/abid-jewelry-ms/getAllBanks`,
//         {
//           headers: {
//             "x-access-token": token,
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       if (response.data.success) {
//         setBanks(response.data.data);
//       }
//     } catch (error) {
//       console.error("Error fetching banks:", error);
//     }
//   };

//   const createPaymentMode = async () => {
//     try {
//       const API_URL =
//         import.meta.env.VITE_BASE_URL || "http://192.168.100.18:9000";
//       const token = getAuthToken();

//       const response = await axios.post(
//         `${API_URL}/api/abid-jewelry-ms/createPayment`,
//         paymentModeForm,
//         {
//           headers: {
//             "x-access-token": token,
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       if (response.data.success) {
//         setShowPaymentModeModal(false);
//         setPaymentModeForm({ name: "", description: "" });
//         fetchPaymentModes();
//       }
//     } catch (error) {
//       console.error("Error creating payment mode:", error);
//     }
//   };

//   const createBank = async () => {
//     try {
//       const API_URL =
//         import.meta.env.VITE_BASE_URL || "http://192.168.100.18:9000";
//       const token = getAuthToken();

//       const response = await axios.post(
//         `${API_URL}/api/abid-jewelry-ms/createBank`,
//         bankForm,
//         {
//           headers: {
//             "x-access-token": token,
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       if (response.data.success) {
//         setShowBankModal(false);
//         setBankForm({ name: "", description: "" });
//         fetchBanks();
//       }
//     } catch (error) {
//       console.error("Error creating bank:", error);
//     }
//   };

//   // Add useEffect to fetch data on component mount
//   useEffect(() => {
//     fetchPaymentModes();
//     fetchBanks();
//   }, []);

//   const getFilteredData = (data: TransformedInvoiceData[]) => {
//     return data.filter((item) => {
//       // Search filter - check invoice and reference
//       const searchableText = `${item.invoice || ""} ${
//         item.refrence || ""
//       }`.toLowerCase();
//       const matchesSearch = searchableText.includes(search.toLowerCase());

//       // Status filter
//       const matchesStatus =
//         statusFilter === "All" || item.status === statusFilter;

//       return matchesSearch && matchesStatus;
//     });
//   };

//   const transformInvoiceData = (
//     invoices: SupplierInvoice[]
//   ): TransformedInvoiceData[] => {
//     return invoices.map((invoice) => ({
//       invoice: invoice.piId,
//       invoiceDate: new Date(invoice.dateReceiving).toLocaleDateString("en-GB", {
//         day: "2-digit",
//         month: "2-digit",
//         year: "numeric",
//       }),
//       status:
//         invoice.status === "paid"
//           ? "Paid"
//           : invoice.status === "partiallyPaid"
//           ? "Partially Paid"
//           : "Unpaid",
//       debit: invoice.totals.debit.toString(),
//       credit: invoice.totals.credit.toString(),
//       refrence:
//         invoice.paymentHistory.length > 0
//           ? invoice.paymentHistory[0].invoiceReferenceNumber
//           : "--",
//       month: new Date(invoice.dateReceiving).toLocaleDateString("en-US", {
//         month: "long",
//       }),
//       remainingBalance: invoice.remainingBalance || invoice.totals.balance,
//       totalPaid: invoice.totalPaid || 0,
//       originalData: invoice, // Add original invoice data
//     }));
//   };

//   const calculateSummary = (data: TransformedInvoiceData[]) => {
//     const totalDebit = data.reduce(
//       (sum, item) => sum + parseFloat(item.debit),
//       0
//     );
//     const totalCredit = data.reduce(
//       (sum, item) => sum + parseFloat(item.credit),
//       0
//     );
//     const totalBalance = data.reduce(
//       (sum, item) => sum + (item.remainingBalance || 0),
//       0
//     );

//     // Calculate selected credit from selected rows
//     const selectedCredit = data
//       .filter((item) => selectedRows[item.invoice])
//       .reduce((sum, item) => sum + parseFloat(item.credit), 0);

//     return { totalDebit, totalCredit, totalBalance, selectedCredit };
//   };

//   const transformedInvoices = transformInvoiceData(supplierInvoices);

//   // Update the summary calculation to use filtered data
//   const allFilteredData = getFilteredData(transformedInvoices);
//   const summary = calculateSummary(allFilteredData);

//   // Group data by month
//   const groupedByMonth = transformedInvoices.reduce((acc, invoice) => {
//     const month = invoice.month;
//     if (!acc[month]) {
//       acc[month] = [];
//     }
//     acc[month].push(invoice);
//     return acc;
//   }, {} as Record<string, TransformedInvoiceData[]>);

//   // Get data for specific months (you can adjust this based on your needs)
//   const januaryData = getFilteredData(groupedByMonth["January"] || []);
//   const februaryData = getFilteredData(groupedByMonth["February"] || []);
//   const marchData = getFilteredData(groupedByMonth["March"] || []);
//   const aprilData = getFilteredData(groupedByMonth["April"] || []);
//   const mayData = getFilteredData(groupedByMonth["May"] || []);
//   const juneData = getFilteredData(groupedByMonth["June"] || []);

//   const julyData = getFilteredData(groupedByMonth["July"] || []);
//   const augustData = getFilteredData(groupedByMonth["August"] || []);
//   const septemberData = getFilteredData(groupedByMonth["September"] || []);
//   const octoberData = getFilteredData(groupedByMonth["October"] || []);
//   const novemberData = getFilteredData(groupedByMonth["November"] || []);
//   const decemberData = getFilteredData(groupedByMonth["December"] || []);

//   const columns: Column[] = [
//     { header: "Select", accessor: "select", type: "select" },
//     { header: "Invoice", accessor: "invoice" },
//     { header: "Invoice Date", accessor: "invoiceDate" },
//     { header: "Status", accessor: "status" },
//     { header: "Debit ($)", accessor: "debit" },
//     { header: "Credit ($)", accessor: "credit" },
//     { header: "Reference", accessor: "refrence" },
//     { header: "Actions", accessor: "actions", type: "actions" },
//   ];

//   if (loading) {
//     return (
//       <div className="mx-auto px-3 py-6 sm:px-4 md:px-6 xl:px-8 xl:py-6 space-y-6 lg:w-[100%] xl:w-full w-full overflow-x-hidden">
//         <div className="rounded-xl px-4 py-7 flex items-center justify-center">
//           <div className="text-lg text-gray-600">
//             <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="mx-auto px-3 py-6 sm:px-4 md:px-6 xl:px-8 xl:py-6 space-y-6 lg:w-[100%] xl:w-full w-full overflow-x-hidden">
//         <div className="bg-white rounded-xl px-4 py-7 flex items-center justify-center shadow-md">
//           <div className="text-lg text-red-600">Error: {error}</div>
//           <button
//             onClick={() => supplierId && fetchSupplierInvoices(supplierId)}
//             className="ml-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
//           >
//             Retry
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="mx-auto px-3 py-6 sm:px-4 md:px-6 xl:px-8 xl:py-6 space-y-6 lg:w-[100%] xl:w-full w-full overflow-x-hidden">
//       <div className="bg-white rounded-xl p-7 flex flex-col gap-4 overflow-hidden shadow-md">
//         {/* Header */}
//         <div className="flex items-center gap-4">
//           <button
//             onClick={() => navigate(-1)}
//             className="p-2 hover:bg-gray-100 rounded-full transition-colors"
//           >
//             <IoArrowBack size={20} className="text-gray-600" />
//           </button>
//           <h1 className="text-2xl font-semibold text-gray-800">
//             {supplierName || "Supplier Details"}
//           </h1>
//         </div>

//         {/* Search + Filter */}
//         <div className="grid gap-4 items-center justify-between md:grid-cols-2 mb-2">
//           <div className="flex gap-3">
//             <Input
//               placeholder="Search Invoice, Reference No"
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//               className="w-sm !rounded-3xl outline-none"
//             />
//             <Dropdown
//               options={["All", "Paid", "Unpaid", "Partially Paid"]}
//               DropDownName="Status"
//               defaultValue="All"
//               onSelect={(val) => {
//                 setStatusFilter(val);
//               }}
//             />
//           </div>
//           <div className="flex md:justify-end gap-3">
//             <Button
//               text="Pay"
//               className="bg-[#056BB7] text-white border-none font-medium w-auto px-7"
//               // onClick={(e) => {
//               //   if (e) e.stopPropagation();
//               //   setIsEditing(true);
//               // }}

//               // onClick={(e) => {
//               //   if (e) e.stopPropagation();

//               //   // Get selected invoices from all months
//               //   const allSelectedInvoices = transformedInvoices.filter(
//               //     (invoice) => selectedRows[invoice.invoice]
//               //   );

//               //   if (allSelectedInvoices.length === 0) {
//               //     toast.error("Please select at least one invoice to pay");
//               //     return;
//               //   }

//               //   setSelectedInvoicesForPayment(allSelectedInvoices);
//               //   setIsEditing(true);
//               // }}

//               onClick={(e) => {
//                 if (e) e.stopPropagation();

//                 // Get selected invoices from all months
//                 const allSelectedInvoices = transformedInvoices.filter(
//                   (invoice) => selectedRows[invoice.invoice]
//                 );

//                 if (allSelectedInvoices.length === 0) {
//                   toast.error("Please select at least one invoice to pay");
//                   return;
//                 }

//                 if (allSelectedInvoices.length > 1) {
//                   toast.error("Please select only one invoice at a time");
//                   return;
//                 }

//                 setSelectedInvoicesForPayment(allSelectedInvoices);
//                 setIsEditing(true);
//               }}
//             />
//             <Button
//               text="Export"
//               variant="border"
//               className="bg-[#5D6679] text-white w-24"
//             />
//           </div>
//         </div>

//         {/* Summary */}
//         <div className="bg-[#FCF3EC] py-3 px-4 rounded-md flex justify-between gap-6 text-md font-semibold">
//           <div>
//             Selected Credit:{" "}
//             <span className="font-medium">${summary.selectedCredit}</span>
//           </div>
//           <div className="flex gap-6">
//             <div>
//               Debit: <span className="font-medium">${summary.totalDebit}</span>
//             </div>
//             <div>
//               Credit:{" "}
//               <span className="font-medium">${summary.totalCredit}</span>
//             </div>
//             <div>
//               Balance:{" "}
//               <span className="font-medium">${summary.totalBalance}</span>
//             </div>
//           </div>
//         </div>

//         {/* Tables for each month */}
//         {januaryData.length > 0 && (
//           <SupplierLedgerDetailTable
//             columns={columns}
//             data={januaryData}
//             tableTitle="January"
//             // eye={true}
//             selectedRows={selectedRows}
//             onRowSelect={handleRowSelect}
//             onEyeClick={(row) => setSelectedInvoiceData(row.originalData)}
//           />
//         )}

//         {februaryData.length > 0 && (
//           <SupplierLedgerDetailTable
//             columns={columns}
//             data={februaryData}
//             tableTitle="February"
//             // eye={true}
//             selectedRows={selectedRows}
//             onRowSelect={handleRowSelect}
//             onEyeClick={(row) => setSelectedInvoiceData(row.originalData)}
//           />
//         )}

//         {marchData.length > 0 && (
//           <SupplierLedgerDetailTable
//             columns={columns}
//             data={marchData}
//             tableTitle="March"
//             // eye={true}
//             selectedRows={selectedRows}
//             onRowSelect={handleRowSelect}
//             onEyeClick={(row) => setSelectedInvoiceData(row.originalData)}
//           />
//         )}

//         {aprilData.length > 0 && (
//           <SupplierLedgerDetailTable
//             columns={columns}
//             data={aprilData}
//             tableTitle="April"
//             // eye={true}
//             selectedRows={selectedRows}
//             onRowSelect={handleRowSelect}
//             onEyeClick={(row) => setSelectedInvoiceData(row.originalData)}
//           />
//         )}

//         {mayData.length > 0 && (
//           <SupplierLedgerDetailTable
//             columns={columns}
//             data={mayData}
//             tableTitle="May"
//             // eye={true}
//             selectedRows={selectedRows}
//             onRowSelect={handleRowSelect}
//             onEyeClick={(row) => setSelectedInvoiceData(row.originalData)}
//           />
//         )}

//         {juneData.length > 0 && (
//           <SupplierLedgerDetailTable
//             columns={columns}
//             data={juneData}
//             tableTitle="June"
//             // eye={true}
//             selectedRows={selectedRows}
//             onRowSelect={handleRowSelect}
//             onEyeClick={(row) => setSelectedInvoiceData(row.originalData)}
//           />
//         )}

//         {/* Show message if no data */}
//         {transformedInvoices.length === 0 && (
//           <div className="bg-white rounded-xl px-4 py-7 flex items-center justify-center shadow-md">
//             <div className="text-lg text-gray-600">
//               No invoices found for this supplier.
//             </div>
//           </div>
//         )}

//         {isEditing && (
//           <div
//             className="fixed inset-0 flex items-center justify-center bg-black/20 z-50"
//             onClick={() => {
//               setIsEditing(false);
//               setSelectedInvoicesForPayment([]);
//               setSelectedRows({}); // Add this line to clear selected rows
//             }}
//           >
//             <div
//               className="animate-scaleIn bg-white w-[70vw] h-auto overflow-y-auto rounded-[7px] shadow-lg px-4 py-6"
//               onClick={(e) => e.stopPropagation()}
//             >
//               <h2 className="text-xl font-semibold text-[#056BB7]">Payment</h2>
//               <div className="flex flex-col mt-4 text-[15px] Poppins-font font-medium">
//                 <div className="flex items-center gap-2">
//                   <label className="mb-1">Payment Mode</label>
//                   <div
//                     className="inline-block cursor-pointer"
//                     onClick={(e) => {
//                       e.preventDefault();
//                       e.stopPropagation();
//                       setShowPaymentModeModal(true);
//                     }}
//                   >
//                     <img
//                       src={plusIcon}
//                       alt="Add payment mode"
//                       width={16}
//                       height={16}
//                       className=""
//                     />
//                   </div>
//                 </div>
//                 <Dropdown
//                   // options={["Cheque", "Bank Transfer", "Cash", "By Wallet"]}
//                   options={paymentModes.map((payment) => payment.name)}
//                   defaultValue="eg: Cash"
//                 />
//               </div>

//               <div className="flex flex-col mt-2 text-[15px] Poppins-font font-medium">
//                 <label htmlFor="" className="mb-1">
//                   Payment Amount
//                 </label>
//                 <Input
//                   placeholder="1200"
//                   className="w-full outline-none"
//                   type="number"
//                 />
//               </div>
//               {/* <div className="flex flex-col mt-2 text-[15px] Poppins-font font-medium">
//                 <label htmlFor="" className="mb-1">
//                   Refrence Number
//                 </label>
//                 <Input
//                   placeholder="21321412"
//                   className="w-full outline-none"
//                   type="number"
//                 />
//               </div> */}

//               <div className="flex flex-col mt-2 mb-2 text-[15px] Poppins-font font-medium">
//                 <div className="flex items-center gap-2">
//                   <label className="mb-1">Bank</label>
//                   <div
//                     className="inline-block cursor-pointer"
//                     onClick={(e) => {
//                       e.preventDefault();
//                       e.stopPropagation();
//                       setShowBankModal(true);
//                     }}
//                   >
//                     <img
//                       src={plusIcon}
//                       alt="Add payment mode"
//                       width={16}
//                       height={16}
//                       className=""
//                     />
//                   </div>
//                 </div>
//                 <Dropdown
//                   options={banks.map((bank) => bank.name)}
//                   defaultValue="eg: abc Bank"
//                 />
//               </div>

//               <div className="mt-0 mb-2">
//                 <p className="Poppins-font font-medium text-sm mb-1">Note</p>
//                 <textarea
//                   placeholder="Enter additional notes here"
//                   rows={2}
//                   className="Poppins-font font-medium w-full px-2 py-2 border border-gray-300 rounded-md text-sm !focus:outline-none outline-none resize-none"
//                 ></textarea>
//               </div>

//               {/* <SupplierLedgerDetailTable
//                 eye={true}
//                 columns={payColumns}
//                 data={payData}
//                 marginTop="mt-4"
//                 selectedRows={selectedRows}
//                 onRowSelect={handleRowSelect}
//                 onRowClick={(row) => console.log("Row clicked:", row)}
//               /> */}

//               <SupplierLedgerDetailTable
//                 eye={true}
//                 columns={payColumns}
//                 data={selectedInvoicesForPayment.map((invoice) => ({
//                   invoice: invoice.invoice,
//                   invoiceDate: invoice.invoiceDate,
//                   status: invoice.status,
//                   debit: invoice.debit,
//                   credit: invoice.credit,
//                   balance: invoice.remainingBalance?.toString() || "0",
//                 }))}
//                 marginTop="mt-4"
//                 selectedRows={selectedRows}
//                 onRowSelect={handleRowSelect}
//                 onRowClick={(row) => console.log("Row clicked:", row)}
//                 showTitle={false}
//               />
//               <div className="flex justify-end mt-4">
//                 <Button
//                   text="Back"
//                   className="mr-2 bg-gray-200 text-gray-800 border-none px-4"
//                   onClick={() => {
//                     setIsEditing(false);
//                     setSelectedInvoicesForPayment([]);
//                     setSelectedRows({});
//                   }}
//                 />
//                 <Button
//                   text="Mark Paid"
//                   className="bg-[#056BB7] text-white border-none px-4"
//                   onClick={() => {
//                     console.log("Paid");
//                     setIsEditing(false);
//                     setSelectedInvoicesForPayment([]);
//                     setSelectedRows({});
//                   }}
//                 />
//               </div>
//             </div>
//           </div>
//         )}

//         {selectedInvoiceData && (
//           <InvoiceDetailModal
//             isOpen={true}
//             onClose={() => setSelectedInvoiceData(null)}
//             invoiceData={selectedInvoiceData}
//             columns={[
//               {
//                 header: "Product Name",
//                 accessor: "productName",
//                 type: "image",
//               },
//               { header: "QTY", accessor: "quantity" },
//               { header: "Cost Price ($)", accessor: "costPrice" },
//               { header: "Total Cost ($)", accessor: "totalPriceOfCostItems" },
//             ]}
//             data={selectedInvoiceData.items.map((item) => ({
//               productName: item?.itemBarcode?.category?.name || "N/A",
//               quantity: item.quantity,
//               costPrice: item.costPrice,
//               totalPriceOfCostItems: item.totalPriceOfCostItems,
//               userImage: item.itemBarcode?.itemImage
//                 ? `${
//                     import.meta.env.VITE_BASE_URL ||
//                     "http://192.168.100.18:9000"
//                   }${item.itemBarcode.itemImage}`
//                 : null,
//             }))}
//           />
//         )}

//         {/* Payment Mode Modal */}
//         {showPaymentModeModal && (
//           <div
//             className="fixed inset-0 flex items-center justify-center bg-black/20 z-50"
//             onClick={() => setShowPaymentModeModal(false)}
//           >
//             <div
//               className="animate-scaleIn bg-white w-[400px] h-auto rounded-[7px] p-6 shadow-lg relative"
//               onClick={(e) => e.stopPropagation()}
//             >
//               <h2 className="text-xl font-semibold text-[#056BB7] mb-4">
//                 Create Payment Mode
//               </h2>

//               <div className="flex flex-col gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-600 mb-1">
//                     Payment Mode Name
//                   </label>
//                   <input
//                     type="text"
//                     value={paymentModeForm.name}
//                     onChange={(e) =>
//                       setPaymentModeForm({
//                         ...paymentModeForm,
//                         name: e.target.value,
//                       })
//                     }
//                     placeholder="Enter payment mode name"
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-600 mb-1">
//                     Description
//                   </label>
//                   <textarea
//                     value={paymentModeForm.description}
//                     onChange={(e) =>
//                       setPaymentModeForm({
//                         ...paymentModeForm,
//                         description: e.target.value,
//                       })
//                     }
//                     placeholder="Enter description"
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     rows={3}
//                   />
//                 </div>
//               </div>

//               <div className="flex justify-end gap-2 mt-6">
//                 <Button
//                   text="Cancel"
//                   className="bg-gray-200 text-gray-800 border-none px-4"
//                   onClick={() => setShowPaymentModeModal(false)}
//                 />
//                 <Button
//                   text="Create"
//                   className="bg-[#056BB7] text-white border-none px-4"
//                   onClick={createPaymentMode}
//                 />
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Bank Modal */}
//         {showBankModal && (
//           <div
//             className="fixed inset-0 flex items-center justify-center bg-black/20 z-50"
//             onClick={() => setShowBankModal(false)}
//           >
//             <div
//               className="animate-scaleIn bg-white w-[400px] h-auto rounded-[7px] p-6 shadow-lg relative"
//               onClick={(e) => e.stopPropagation()}
//             >
//               <h2 className="text-xl font-semibold text-[#056BB7] mb-4">
//                 Create Bank
//               </h2>

//               <div className="flex flex-col gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-600 mb-1">
//                     Bank Name
//                   </label>
//                   <input
//                     type="text"
//                     value={bankForm.name}
//                     onChange={(e) =>
//                       setBankForm({ ...bankForm, name: e.target.value })
//                     }
//                     placeholder="Enter bank name"
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-600 mb-1">
//                     Description
//                   </label>
//                   <textarea
//                     value={bankForm.description}
//                     onChange={(e) =>
//                       setBankForm({ ...bankForm, description: e.target.value })
//                     }
//                     placeholder="Enter description"
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     rows={3}
//                   />
//                 </div>
//               </div>

//               <div className="flex justify-end gap-2 mt-6">
//                 <Button
//                   text="Cancel"
//                   className="bg-gray-200 text-gray-800 border-none px-4"
//                   onClick={() => setShowBankModal(false)}
//                 />
//                 <Button
//                   text="Create"
//                   className="bg-[#056BB7] text-white border-none px-4"
//                   onClick={createBank}
//                 />
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default SupplierDetailPage;

// import React, { useState, useEffect } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import { IoArrowBack } from "react-icons/io5";
// import SupplierLedgerDetailTable from "../../../components/SupplierLedgerDetailTable";
// import axios from "axios";
// import Input from "../../../components/Input";
// import Dropdown from "../../../components/Dropdown";
// import Button from "../../../components/Button";
// import plusIcon from "../../../assets/plus.svg";
// import InvoiceDetailModal from "../Inventory/InvoiceDetailModal";
// import { toast } from "react-toastify";

// interface SupplierInvoice {
//   _id: string;
//   piId: string;
//   supplierCompanyName: any;
//   referenceNumber: string;
//   purchaseOrderReference: string;
//   dateReceiving: string;
//   dueDate: string;
//   status: string;
//   items: any[];
//   totals: {
//     debit: number;
//     credit: number;
//     balance: number;
//   };
//   description: string;
//   paymentHistory: any[];
//   remainingBalance?: number;
//   totalPaid?: number;
//   createdAt: string;
//   updatedAt: string;
// }

// interface Column {
//   header: string;
//   accessor: string;
//   type?: "select" | "text" | "image" | "status" | "actions" | "refrence";
// }

// interface TransformedInvoiceData {
//   invoice: string;
//   invoiceDate: string;
//   status: string;
//   debit: string;
//   credit: string;
//   refrence: string;
//   month: string;
//   remainingBalance: number;
//   totalPaid: number;
//   originalData?: SupplierInvoice;
// }

// interface PaymentMode {
//   _id: string;
//   name: string;
//   description: string;
// }

// interface Bank {
//   _id: string;
//   name: string;
//   description: string;
// }

// interface WalletBalance {
//   balance: number;
// }

// interface PaymentData {
//   type: string;
//   amount: number;
//   bank?: string;
//   mode?: string;
// }

// const payColumns: Column[] = [
//   { header: "Invoice", accessor: "invoice" },
//   { header: "Invoice Date", accessor: "invoiceDate" },
//   { header: "Status", accessor: "status", type: "status" },
//   { header: "Debit ($)", accessor: "debit", type: "text" },
//   { header: "Credit ($)", accessor: "credit", type: "text" },
//   { header: "Balance ($)", accessor: "balance", type: "text" },
//   { header: "Actions", accessor: "actions", type: "actions" },
// ];

// const SupplierDetailPage = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const [supplierName, setSupplierName] = useState<string>("");
//   const [supplierInvoices, setSupplierInvoices] = useState<SupplierInvoice[]>(
//     []
//   );
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [supplierId, setSupplierId] = useState<string>("");
//   const [isEditing, setIsEditing] = useState(false);
//   const [search, setSearch] = useState("");
//   const [statusFilter, setStatusFilter] = useState("All");
//   const [selectedInvoiceData, setSelectedInvoiceData] =
//     useState<SupplierInvoice | null>(null);
//   const [selectedInvoicesForPayment, setSelectedInvoicesForPayment] = useState<
//     any[]
//   >([]);
//   const [showPaymentModeModal, setShowPaymentModeModal] = useState(false);
//   const [showBankModal, setShowBankModal] = useState(false);
//   const [paymentModes, setPaymentModes] = useState<PaymentMode[]>([]);
//   const [banks, setBanks] = useState<Bank[]>([]);
//   const [walletBalance, setWalletBalance] = useState<number>(0);
//   const [paymentModeForm, setPaymentModeForm] = useState({
//     name: "",
//     description: "",
//   });
//   const [bankForm, setBankForm] = useState({ name: "", description: "" });

//   // Payment form states
//   const [selectedPaymentType, setSelectedPaymentType] = useState<string>("");
//   const [paymentNote, setPaymentNote] = useState<string>("");
//   const [payments, setPayments] = useState<PaymentData[]>([]);
//   const [walletAmount, setWalletAmount] = useState<number>(0);
//   const [bankAmount, setBankAmount] = useState<number>(0);
//   const [paymentModeAmount, setPaymentModeAmount] = useState<number>(0);
//   const [selectedBank, setSelectedBank] = useState<string>("");
//   const [selectedPaymentMode, setSelectedPaymentMode] = useState<string>("");

//   // Add state to track selected rows
//   const [selectedRows, setSelectedRows] = useState<{ [key: string]: boolean }>(
//     {}
//   );

//   const getAuthToken = () => {
//     let token = localStorage.getItem("token");
//     if (!token) {
//       token = sessionStorage.getItem("token");
//     }
//     return token;
//   };

//   const handleRowSelect = (rowId: string, allSelectedRows?: any) => {
//     if (allSelectedRows !== undefined) {
//       setSelectedRows(allSelectedRows);
//     } else {
//       setSelectedRows((prev) => ({
//         ...prev,
//         [rowId]: !prev[rowId],
//       }));
//     }
//   };

//   const fetchSupplierInvoices = async (id: string) => {
//     try {
//       setLoading(true);
//       const API_URL =
//         import.meta.env.VITE_BASE_URL || "http://192.168.100.18:9000";
//       const token = getAuthToken();

//       if (!token) {
//         setError("No authentication token found");
//         return;
//       }

//       const response = await axios.get(
//         `${API_URL}/api/abid-jewelry-ms/getInvoiceBySupplier/${id}`,
//         {
//           headers: {
//             "x-access-token": token,
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       if (response.data.success) {
//         setSupplierInvoices(response.data.data);
//         if (
//           response.data.data.length > 0 &&
//           response.data.data[0].supplierCompanyName
//         ) {
//           setSupplierName(
//             response.data.data[0].supplierCompanyName.companyName
//           );
//         }
//         setError(null);
//       } else {
//         setError("Failed to fetch supplier invoices");
//       }
//     } catch (error) {
//       console.error("Error fetching supplier invoices:", error);
//       setError("Error fetching supplier invoices");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchSupplierWalletBalance = async (id: string) => {
//     try {
//       const API_URL =
//         import.meta.env.VITE_BASE_URL || "http://192.168.100.18:9000";
//       const token = getAuthToken();

//       const response = await axios.get(
//         `${API_URL}/api/abid-jewelry-ms/getSupplierWallet/${id}`,
//         {
//           headers: {
//             "x-access-token": token,
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       if (response.data.success) {
//         setWalletBalance(response.data.data.balance || 0);
//       }
//     } catch (error) {
//       console.error("Error fetching wallet balance:", error);
//       setWalletBalance(0);
//     }
//   };

//   useEffect(() => {
//     if (location.state && location.state.supplier) {
//       setSupplierName(location.state.supplier);
//       if (location.state.supplierData) {
//         setSupplierId(location.state.supplierData._id);
//       }
//     } else {
//       const pathParts = location.pathname.split("/");
//       if (pathParts.length > 0) {
//         const lastPart = pathParts[pathParts.length - 1];
//         if (lastPart !== "supplier-ledger" && lastPart) {
//           setSupplierId(lastPart);
//         }
//       }
//     }
//   }, [location]);

//   useEffect(() => {
//     if (supplierId) {
//       fetchSupplierInvoices(supplierId);
//       fetchSupplierWalletBalance(supplierId);
//     }
//   }, [supplierId]);

//   const fetchPaymentModes = async () => {
//     try {
//       const API_URL =
//         import.meta.env.VITE_BASE_URL || "http://192.168.100.18:9000";
//       const token = getAuthToken();

//       const response = await axios.get(
//         `${API_URL}/api/abid-jewelry-ms/getAllPayments`,
//         {
//           headers: {
//             "x-access-token": token,
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       if (response.data.success) {
//         setPaymentModes(response.data.data);
//       }
//     } catch (error) {
//       console.error("Error fetching payment modes:", error);
//     }
//   };

//   const fetchBanks = async () => {
//     try {
//       const API_URL =
//         import.meta.env.VITE_BASE_URL || "http://192.168.100.18:9000";
//       const token = getAuthToken();

//       const response = await axios.get(
//         `${API_URL}/api/abid-jewelry-ms/getAllBanks`,
//         {
//           headers: {
//             "x-access-token": token,
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       if (response.data.success) {
//         setBanks(response.data.data);
//       }
//     } catch (error) {
//       console.error("Error fetching banks:", error);
//     }
//   };

//   const createPaymentMode = async () => {
//     try {
//       const API_URL =
//         import.meta.env.VITE_BASE_URL || "http://192.168.100.18:9000";
//       const token = getAuthToken();

//       const response = await axios.post(
//         `${API_URL}/api/abid-jewelry-ms/createPayment`,
//         paymentModeForm,
//         {
//           headers: {
//             "x-access-token": token,
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       if (response.data.success) {
//         setShowPaymentModeModal(false);
//         setPaymentModeForm({ name: "", description: "" });
//         fetchPaymentModes();
//         toast.success("Payment mode created successfully");
//       }
//     } catch (error) {
//       console.error("Error creating payment mode:", error);
//       toast.error("Failed to create payment mode");
//     }
//   };

//   const createBank = async () => {
//     try {
//       const API_URL =
//         import.meta.env.VITE_BASE_URL || "http://192.168.100.18:9000";
//       const token = getAuthToken();

//       const response = await axios.post(
//         `${API_URL}/api/abid-jewelry-ms/createBank`,
//         bankForm,
//         {
//           headers: {
//             "x-access-token": token,
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       if (response.data.success) {
//         setShowBankModal(false);
//         setBankForm({ name: "", description: "" });
//         fetchBanks();
//         toast.success("Bank created successfully");
//       }
//     } catch (error) {
//       console.error("Error creating bank:", error);
//       toast.error("Failed to create bank");
//     }
//   };

//   const processPayment = async () => {
//     try {
//       if (selectedInvoicesForPayment.length === 0) {
//         toast.error("No invoice selected for payment");
//         return;
//       }

//       const invoice = selectedInvoicesForPayment[0];
//       const remainingBalance = invoice.remainingBalance || 0;

//       // Build payments array based on selected payment types and amounts
//       const paymentsArray: PaymentData[] = [];
//       let totalPaymentAmount = 0;

//       if (selectedPaymentType === "Wallet" && walletAmount > 0) {
//         if (walletAmount > walletBalance) {
//           toast.error("Wallet amount exceeds available balance");
//           return;
//         }
//         paymentsArray.push({
//           type: "wallet",
//           amount: walletAmount,
//         });
//         totalPaymentAmount += walletAmount;
//       }

//       if (selectedPaymentType === "Bank" && bankAmount > 0) {
//         if (!selectedBank) {
//           toast.error("Please select a bank");
//           return;
//         }
//         paymentsArray.push({
//           type: "bank",
//           amount: bankAmount,
//           bank: selectedBank,
//         });
//         totalPaymentAmount += bankAmount;
//       }

//       if (selectedPaymentType === "Bank Transfer" && paymentModeAmount > 0) {
//         if (!selectedPaymentMode) {
//           toast.error("Please select a payment mode");
//           return;
//         }
//         paymentsArray.push({
//           type: "paymentMode",
//           amount: paymentModeAmount,
//           mode: selectedPaymentMode,
//         });
//         totalPaymentAmount += paymentModeAmount;
//       }

//       // For combination payments
//       if (selectedPaymentType === "Wallet + Bank") {
//         if (walletAmount > 0) {
//           if (walletAmount > walletBalance) {
//             toast.error("Wallet amount exceeds available balance");
//             return;
//           }
//           paymentsArray.push({
//             type: "wallet",
//             amount: walletAmount,
//           });
//           totalPaymentAmount += walletAmount;
//         }
//         if (bankAmount > 0) {
//           if (!selectedBank) {
//             toast.error("Please select a bank");
//             return;
//           }
//           paymentsArray.push({
//             type: "bank",
//             amount: bankAmount,
//             bank: selectedBank,
//           });
//           totalPaymentAmount += bankAmount;
//         }
//       }

//       if (selectedPaymentType === "Wallet + Bank Transfer") {
//         if (walletAmount > 0) {
//           if (walletAmount > walletBalance) {
//             toast.error("Wallet amount exceeds available balance");
//             return;
//           }
//           paymentsArray.push({
//             type: "wallet",
//             amount: walletAmount,
//           });
//           totalPaymentAmount += walletAmount;
//         }
//         if (paymentModeAmount > 0) {
//           if (!selectedPaymentMode) {
//             toast.error("Please select a payment mode");
//             return;
//           }
//           paymentsArray.push({
//             type: "paymentMode",
//             amount: paymentModeAmount,
//             mode: selectedPaymentMode,
//           });
//           totalPaymentAmount += paymentModeAmount;
//         }
//       }

//       if (paymentsArray.length === 0) {
//         toast.error("Please enter payment amounts");
//         return;
//       }

//       if (totalPaymentAmount > remainingBalance) {
//         toast.error("Payment amount exceeds remaining balance");
//         return;
//       }

//       const API_URL =
//         import.meta.env.VITE_BASE_URL || "http://192.168.100.18:9000";
//       const token = getAuthToken();

//       const payload = {
//         purchaseInvoiceId: invoice.originalData._id,
//         payments: paymentsArray,
//         note: paymentNote,
//       };

//       const response = await axios.put(
//         `${API_URL}/api/abid-jewelry-ms/updateInvoiceBySupplier`,
//         payload,
//         {
//           headers: {
//             "x-access-token": token,
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       if (response.data.success) {
//         toast.success("Payment processed successfully");
//         setIsEditing(false);
//         setSelectedInvoicesForPayment([]);
//         setSelectedRows({});
//         resetPaymentForm();
//         // Refresh the invoices
//         if (supplierId) {
//           fetchSupplierInvoices(supplierId);
//           fetchSupplierWalletBalance(supplierId);
//         }
//       } else {
//         toast.error("Failed to process payment");
//       }
//     } catch (error) {
//       console.error("Error processing payment:", error);
//       toast.error("Error processing payment");
//     }
//   };

//   const resetPaymentForm = () => {
//     setSelectedPaymentType("");
//     setPaymentNote("");
//     setWalletAmount(0);
//     setBankAmount(0);
//     setPaymentModeAmount(0);
//     setSelectedBank("");
//     setSelectedPaymentMode("");
//   };

//   // Add useEffect to fetch data on component mount
//   useEffect(() => {
//     fetchPaymentModes();
//     fetchBanks();
//   }, []);

//   const getFilteredData = (data: TransformedInvoiceData[]) => {
//     return data.filter((item) => {
//       // Search filter - check invoice and reference
//       const searchableText = `${item.invoice || ""} ${
//         item.refrence || ""
//       }`.toLowerCase();
//       const matchesSearch = searchableText.includes(search.toLowerCase());

//       // Status filter
//       const matchesStatus =
//         statusFilter === "All" || item.status === statusFilter;

//       return matchesSearch && matchesStatus;
//     });
//   };

//   const transformInvoiceData = (
//     invoices: SupplierInvoice[]
//   ): TransformedInvoiceData[] => {
//     return invoices.map((invoice) => ({
//       invoice: invoice.piId,
//       invoiceDate: new Date(invoice.dateReceiving).toLocaleDateString("en-GB", {
//         day: "2-digit",
//         month: "2-digit",
//         year: "numeric",
//       }),
//       status:
//         invoice.status === "paid"
//           ? "Paid"
//           : invoice.status === "partiallyPaid"
//           ? "Partially Paid"
//           : "Unpaid",
//       debit: invoice.totals.debit.toString(),
//       credit: invoice.totals.credit.toString(),
//       refrence:
//         invoice.paymentHistory.length > 0
//           ? invoice.paymentHistory[0].invoiceReferenceNumber
//           : "--",
//       month: new Date(invoice.dateReceiving).toLocaleDateString("en-US", {
//         month: "long",
//       }),
//       remainingBalance: invoice.remainingBalance || invoice.totals.balance,
//       totalPaid: invoice.totalPaid || 0,
//       originalData: invoice, // Add original invoice data
//     }));
//   };

//   const calculateSummary = (data: TransformedInvoiceData[]) => {
//     const totalDebit = data.reduce(
//       (sum, item) => sum + parseFloat(item.debit),
//       0
//     );
//     const totalCredit = data.reduce(
//       (sum, item) => sum + parseFloat(item.credit),
//       0
//     );
//     const totalBalance = data.reduce(
//       (sum, item) => sum + (item.remainingBalance || 0),
//       0
//     );

//     // Calculate selected credit from selected rows
//     const selectedCredit = data
//       .filter((item) => selectedRows[item.invoice])
//       .reduce((sum, item) => sum + parseFloat(item.credit), 0);

//     return { totalDebit, totalCredit, totalBalance, selectedCredit };
//   };

//   const transformedInvoices = transformInvoiceData(supplierInvoices);

//   // Update the summary calculation to use filtered data
//   const allFilteredData = getFilteredData(transformedInvoices);
//   const summary = calculateSummary(allFilteredData);

//   // Group data by month
//   const groupedByMonth = transformedInvoices.reduce((acc, invoice) => {
//     const month = invoice.month;
//     if (!acc[month]) {
//       acc[month] = [];
//     }
//     acc[month].push(invoice);
//     return acc;
//   }, {} as Record<string, TransformedInvoiceData[]>);

//   // Get data for specific months (you can adjust this based on your needs)
//   const januaryData = getFilteredData(groupedByMonth["January"] || []);
//   const februaryData = getFilteredData(groupedByMonth["February"] || []);
//   const marchData = getFilteredData(groupedByMonth["March"] || []);
//   const aprilData = getFilteredData(groupedByMonth["April"] || []);
//   const mayData = getFilteredData(groupedByMonth["May"] || []);
//   const juneData = getFilteredData(groupedByMonth["June"] || []);
//   const julyData = getFilteredData(groupedByMonth["July"] || []);
//   const augustData = getFilteredData(groupedByMonth["August"] || []);
//   const septemberData = getFilteredData(groupedByMonth["September"] || []);
//   const octoberData = getFilteredData(groupedByMonth["October"] || []);
//   const novemberData = getFilteredData(groupedByMonth["November"] || []);
//   const decemberData = getFilteredData(groupedByMonth["December"] || []);

//   const columns: Column[] = [
//     { header: "Select", accessor: "select", type: "select" },
//     { header: "Invoice", accessor: "invoice" },
//     { header: "Invoice Date", accessor: "invoiceDate" },
//     { header: "Status", accessor: "status" },
//     { header: "Debit ($)", accessor: "debit" },
//     { header: "Credit ($)", accessor: "credit" },
//     { header: "Reference", accessor: "refrence" },
//     { header: "Actions", accessor: "actions", type: "actions" },
//   ];

//   const getPaymentTypeOptions = () => {
//     const options = ["Wallet", "Bank", "Bank Transfer"];

//     // Add combination options
//     if (walletBalance > 0) {
//       options.push("Wallet + Bank", "Wallet + Bank Transfer");
//     }

//     return options;
//   };

//   const renderPaymentInputs = () => {
//     const selectedInvoice = selectedInvoicesForPayment[0];
//     const remainingBalance = selectedInvoice?.remainingBalance || 0;

//     return (
//       <div className="space-y-4">
//         {/* Payment Type Selection */}
//         <div className="flex flex-col text-[15px] Poppins-font font-medium">
//           <label className="mb-1">Select Payment Type</label>
//           <Dropdown
//             options={getPaymentTypeOptions()}
//             defaultValue="Select Payment Type"
//             onSelect={(val) => {
//               setSelectedPaymentType(val);
//               // Reset amounts when payment type changes
//               setWalletAmount(0);
//               setBankAmount(0);
//               setPaymentModeAmount(0);
//             }}
//           />
//         </div>

//         {/* Remaining Balance Display */}
//         <div className="bg-blue-50 p-3 rounded-md">
//           <p className="text-sm font-medium text-blue-800">
//             Remaining Balance: ${remainingBalance}
//           </p>
//           {walletBalance > 0 && (
//             <p className="text-sm font-medium text-green-800">
//               Wallet Balance: ${walletBalance}
//             </p>
//           )}
//         </div>

//         {/* Wallet Payment Input */}
//         {(selectedPaymentType === "Wallet" ||
//           selectedPaymentType === "Wallet + Bank" ||
//           selectedPaymentType === "Wallet + Bank Transfer") && (
//           <div className="flex flex-col text-[15px] Poppins-font font-medium">
//             <label className="mb-1">
//               Wallet Payment Amount (Available: ${walletBalance})
//             </label>
//             <Input
//               placeholder="0"
//               className="w-full outline-none"
//               type="number"
//               value={walletAmount.toString()}
//               onChange={(e) => setWalletAmount(parseFloat(e.target.value) || 0)}
//               // max={walletBalance}
//             />
//           </div>
//         )}

//         {/* Bank Payment Input */}
//         {(selectedPaymentType === "Bank" ||
//           selectedPaymentType === "Wallet + Bank") && (
//           <>
//             <div className="flex flex-col text-[15px] Poppins-font font-medium">
//               <div className="flex items-center gap-2">
//                 <label className="mb-1">Select Bank</label>
//                 <div
//                   className="inline-block cursor-pointer"
//                   onClick={(e) => {
//                     e.preventDefault();
//                     e.stopPropagation();
//                     setShowBankModal(true);
//                   }}
//                 >
//                   <img src={plusIcon} alt="Add bank" width={16} height={16} />
//                 </div>
//               </div>
//               <Dropdown
//                 options={banks.map((bank) => bank.name)}
//                 defaultValue="Select Bank"
//                 onSelect={(val) => {
//                   const selectedBankObj = banks.find(
//                     (bank) => bank.name === val
//                   );
//                   setSelectedBank(selectedBankObj?._id || "");
//                 }}
//               />
//             </div>
//             <div className="flex flex-col text-[15px] Poppins-font font-medium">
//               <label className="mb-1">Bank Payment Amount</label>
//               <Input
//                 placeholder="0"
//                 className="w-full outline-none"
//                 type="number"
//                 value={bankAmount.toString()}
//                 onChange={(e) => setBankAmount(parseFloat(e.target.value) || 0)}
//               />
//             </div>
//           </>
//         )}

//         {/* Payment Mode Input */}
//         {(selectedPaymentType === "Bank Transfer" ||
//           selectedPaymentType === "Wallet + Bank Transfer") && (
//           <>
//             <div className="flex flex-col text-[15px] Poppins-font font-medium">
//               <div className="flex items-center gap-2">
//                 <label className="mb-1">Select Payment Mode</label>
//                 <div
//                   className="inline-block cursor-pointer"
//                   onClick={(e) => {
//                     e.preventDefault();
//                     e.stopPropagation();
//                     setShowPaymentModeModal(true);
//                   }}
//                 >
//                   <img
//                     src={plusIcon}
//                     alt="Add payment mode"
//                     width={16}
//                     height={16}
//                   />
//                 </div>
//               </div>
//               <Dropdown
//                 options={paymentModes.map((mode) => mode.name)}
//                 defaultValue="Select Payment Mode"
//                 onSelect={(val) => {
//                   const selectedModeObj = paymentModes.find(
//                     (mode) => mode.name === val
//                   );
//                   setSelectedPaymentMode(selectedModeObj?._id || "");
//                 }}
//               />
//             </div>
//             <div className="flex flex-col text-[15px] Poppins-font font-medium">
//               <label className="mb-1">Payment Mode Amount</label>
//               <Input
//                 placeholder="0"
//                 className="w-full outline-none"
//                 type="number"
//                 value={paymentModeAmount.toString()}
//                 onChange={(e) =>
//                   setPaymentModeAmount(parseFloat(e.target.value) || 0)
//                 }
//               />
//             </div>
//           </>
//         )}

//         {/* Total Payment Display */}
//         {selectedPaymentType && (
//           <div className="bg-green-50 p-3 rounded-md">
//             <p className="text-sm font-medium text-green-800">
//               Total Payment: ${walletAmount + bankAmount + paymentModeAmount}
//             </p>
//           </div>
//         )}
//       </div>
//     );
//   };

//   if (loading) {
//     return (
//       <div className="mx-auto px-3 py-6 sm:px-4 md:px-6 xl:px-8 xl:py-6 space-y-6 lg:w-[100%] xl:w-full w-full overflow-x-hidden">
//         <div className="rounded-xl px-4 py-7 flex items-center justify-center">
//           <div className="text-lg text-gray-600">
//             <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="mx-auto px-3 py-6 sm:px-4 md:px-6 xl:px-8 xl:py-6 space-y-6 lg:w-[100%] xl:w-full w-full overflow-x-hidden">
//         <div className="bg-white rounded-xl px-4 py-7 flex items-center justify-center shadow-md">
//           <div className="text-lg text-red-600">Error: {error}</div>
//           <button
//             onClick={() => supplierId && fetchSupplierInvoices(supplierId)}
//             className="ml-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
//           >
//             Retry
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="mx-auto px-3 py-6 sm:px-4 md:px-6 xl:px-8 xl:py-6 space-y-6 lg:w-[100%] xl:w-full w-full overflow-x-hidden">
//       <div className="bg-white rounded-xl p-7 flex flex-col gap-4 overflow-hidden shadow-md">
//         {/* Header */}
//         <div className="flex items-center gap-4">
//           <button
//             onClick={() => navigate(-1)}
//             className="p-2 hover:bg-gray-100 rounded-full transition-colors"
//           >
//             <IoArrowBack size={20} className="text-gray-600" />
//           </button>
//           <h1 className="text-2xl font-semibold text-gray-800">
//             {supplierName || "Supplier Details"}
//           </h1>
//         </div>

//         {/* Search + Filter */}
//         <div className="grid gap-4 items-center justify-between md:grid-cols-2 mb-2">
//           <div className="flex gap-3">
//             <Input
//               placeholder="Search Invoice, Reference No"
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//               className="w-sm !rounded-3xl outline-none"
//             />
//             <Dropdown
//               options={["All", "Paid", "Unpaid", "Partially Paid"]}
//               DropDownName="Status"
//               defaultValue="All"
//               onSelect={(val) => {
//                 setStatusFilter(val);
//               }}
//             />
//           </div>
//           <div className="flex md:justify-end gap-3">
//             <Button
//               text="Pay"
//               className="bg-[#056BB7] text-white border-none font-medium w-auto px-7"
//               onClick={(e) => {
//                 if (e) e.stopPropagation();

//                 // Get selected invoices from all months
//                 const allSelectedInvoices = transformedInvoices.filter(
//                   (invoice) => selectedRows[invoice.invoice]
//                 );

//                 if (allSelectedInvoices.length === 0) {
//                   toast.error("Please select at least one invoice to pay");
//                   return;
//                 }

//                 if (allSelectedInvoices.length > 1) {
//                   toast.error("Please select only one invoice at a time");
//                   return;
//                 }

//                 setSelectedInvoicesForPayment(allSelectedInvoices);
//                 setIsEditing(true);
//               }}
//             />
//             <Button
//               text="Export"
//               variant="border"
//               className="bg-[#5D6679] text-white w-24"
//             />
//           </div>
//         </div>

//         {/* Summary */}
//         <div className="bg-[#FCF3EC] py-3 px-4 rounded-md flex justify-between gap-6 text-md font-semibold">
//           <div>
//             Selected Credit:{" "}
//             <span className="font-medium">${summary.selectedCredit}</span>
//           </div>
//           <div className="flex gap-6">
//             <div>
//               Debit: <span className="font-medium">${summary.totalDebit}</span>
//             </div>
//             <div>
//               Credit:{" "}
//               <span className="font-medium">${summary.totalCredit}</span>
//             </div>
//             <div>
//               Balance:{" "}
//               <span className="font-medium">${summary.totalBalance}</span>
//             </div>
//           </div>
//         </div>

//         {/* Tables for each month */}
//         {januaryData.length > 0 && (
//           <SupplierLedgerDetailTable
//             columns={columns}
//             data={januaryData}
//             tableTitle="January"
//             selectedRows={selectedRows}
//             onRowSelect={handleRowSelect}
//             onEyeClick={(row) => setSelectedInvoiceData(row.originalData)}
//           />
//         )}

//         {februaryData.length > 0 && (
//           <SupplierLedgerDetailTable
//             columns={columns}
//             data={februaryData}
//             tableTitle="February"
//             selectedRows={selectedRows}
//             onRowSelect={handleRowSelect}
//             onEyeClick={(row) => setSelectedInvoiceData(row.originalData)}
//           />
//         )}

//         {marchData.length > 0 && (
//           <SupplierLedgerDetailTable
//             columns={columns}
//             data={marchData}
//             tableTitle="March"
//             selectedRows={selectedRows}
//             onRowSelect={handleRowSelect}
//             onEyeClick={(row) => setSelectedInvoiceData(row.originalData)}
//           />
//         )}

//         {aprilData.length > 0 && (
//           <SupplierLedgerDetailTable
//             columns={columns}
//             data={aprilData}
//             tableTitle="April"
//             selectedRows={selectedRows}
//             onRowSelect={handleRowSelect}
//             onEyeClick={(row) => setSelectedInvoiceData(row.originalData)}
//           />
//         )}

//         {mayData.length > 0 && (
//           <SupplierLedgerDetailTable
//             columns={columns}
//             data={mayData}
//             tableTitle="May"
//             selectedRows={selectedRows}
//             onRowSelect={handleRowSelect}
//             onEyeClick={(row) => setSelectedInvoiceData(row.originalData)}
//           />
//         )}

//         {juneData.length > 0 && (
//           <SupplierLedgerDetailTable
//             columns={columns}
//             data={juneData}
//             tableTitle="June"
//             selectedRows={selectedRows}
//             onRowSelect={handleRowSelect}
//             onEyeClick={(row) => setSelectedInvoiceData(row.originalData)}
//           />
//         )}

//         {julyData.length > 0 && (
//           <SupplierLedgerDetailTable
//             columns={columns}
//             data={julyData}
//             tableTitle="July"
//             selectedRows={selectedRows}
//             onRowSelect={handleRowSelect}
//             onEyeClick={(row) => setSelectedInvoiceData(row.originalData)}
//           />
//         )}

//         {augustData.length > 0 && (
//           <SupplierLedgerDetailTable
//             columns={columns}
//             data={augustData}
//             tableTitle="August"
//             selectedRows={selectedRows}
//             onRowSelect={handleRowSelect}
//             onEyeClick={(row) => setSelectedInvoiceData(row.originalData)}
//           />
//         )}

//         {septemberData.length > 0 && (
//           <SupplierLedgerDetailTable
//             columns={columns}
//             data={septemberData}
//             tableTitle="September"
//             selectedRows={selectedRows}
//             onRowSelect={handleRowSelect}
//             onEyeClick={(row) => setSelectedInvoiceData(row.originalData)}
//           />
//         )}

//         {octoberData.length > 0 && (
//           <SupplierLedgerDetailTable
//             columns={columns}
//             data={octoberData}
//             tableTitle="October"
//             selectedRows={selectedRows}
//             onRowSelect={handleRowSelect}
//             onEyeClick={(row) => setSelectedInvoiceData(row.originalData)}
//           />
//         )}

//         {novemberData.length > 0 && (
//           <SupplierLedgerDetailTable
//             columns={columns}
//             data={novemberData}
//             tableTitle="November"
//             selectedRows={selectedRows}
//             onRowSelect={handleRowSelect}
//             onEyeClick={(row) => setSelectedInvoiceData(row.originalData)}
//           />
//         )}

//         {decemberData.length > 0 && (
//           <SupplierLedgerDetailTable
//             columns={columns}
//             data={decemberData}
//             tableTitle="December"
//             selectedRows={selectedRows}
//             onRowSelect={handleRowSelect}
//             onEyeClick={(row) => setSelectedInvoiceData(row.originalData)}
//           />
//         )}

//         {/* Show message if no data */}
//         {transformedInvoices.length === 0 && (
//           <div className="bg-white rounded-xl px-4 py-7 flex items-center justify-center shadow-md">
//             <div className="text-lg text-gray-600">
//               No invoices found for this supplier.
//             </div>
//           </div>
//         )}

//         {/* Payment Modal */}
//         {isEditing && (
//           <div
//             className="fixed inset-0 flex items-center justify-center bg-black/20 z-50"
//             onClick={() => {
//               setIsEditing(false);
//               setSelectedInvoicesForPayment([]);
//               setSelectedRows({});
//               resetPaymentForm();
//             }}
//           >
//             <div
//               className="animate-scaleIn bg-white w-[70vw] h-auto max-h-[90vh] overflow-y-auto rounded-[7px] shadow-lg px-4 py-6"
//               onClick={(e) => e.stopPropagation()}
//             >
//               <h2 className="text-xl font-semibold text-[#056BB7]">Payment</h2>

//               {/* Payment Form */}
//               <div className="mt-4 space-y-4">
//                 {renderPaymentInputs()}

//                 {/* Note Section */}
//                 <div className="mt-4 mb-2">
//                   <p className="Poppins-font font-medium text-sm mb-1">Note</p>
//                   <textarea
//                     placeholder="Enter additional notes here"
//                     rows={2}
//                     value={paymentNote}
//                     onChange={(e) => setPaymentNote(e.target.value)}
//                     className="Poppins-font font-medium w-full px-2 py-2 border border-gray-300 rounded-md text-sm !focus:outline-none outline-none resize-none"
//                   />
//                 </div>

//                 {/* Selected Invoice Table */}
//                 <SupplierLedgerDetailTable
//                   eye={true}
//                   columns={payColumns}
//                   data={selectedInvoicesForPayment.map((invoice) => ({
//                     invoice: invoice.invoice,
//                     invoiceDate: invoice.invoiceDate,
//                     status: invoice.status,
//                     debit: invoice.debit,
//                     credit: invoice.credit,
//                     balance: invoice.remainingBalance?.toString() || "0",
//                   }))}
//                   marginTop="mt-4"
//                   selectedRows={selectedRows}
//                   onRowSelect={handleRowSelect}
//                   onRowClick={(row) => console.log("Row clicked:", row)}
//                   showTitle={false}
//                 />

//                 {/* Action Buttons */}
//                 <div className="flex justify-end mt-4 gap-2">
//                   <Button
//                     text="Cancel"
//                     className="bg-gray-200 text-gray-800 border-none px-4"
//                     onClick={() => {
//                       setIsEditing(false);
//                       setSelectedInvoicesForPayment([]);
//                       setSelectedRows({});
//                       resetPaymentForm();
//                     }}
//                   />
//                   <Button
//                     text="Process Payment"
//                     className="bg-[#056BB7] text-white border-none px-4"
//                     onClick={processPayment}
//                   />
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Invoice Detail Modal */}
//         {selectedInvoiceData && (
//           <InvoiceDetailModal
//             isOpen={true}
//             onClose={() => setSelectedInvoiceData(null)}
//             invoiceData={selectedInvoiceData}
//             columns={[
//               {
//                 header: "Product Name",
//                 accessor: "productName",
//                 type: "image",
//               },
//               { header: "QTY", accessor: "quantity" },
//               { header: "Cost Price ($)", accessor: "costPrice" },
//               { header: "Total Cost ($)", accessor: "totalPriceOfCostItems" },
//             ]}
//             data={selectedInvoiceData.items.map((item) => ({
//               productName: item.itemBarcode?.barcode || "N/A",
//               quantity: item.quantity,
//               costPrice: item.costPrice,
//               totalPriceOfCostItems: item.totalPriceOfCostItems,
//               userImage: item.itemBarcode?.itemImage
//                 ? `${
//                     import.meta.env.VITE_BASE_URL ||
//                     "http://192.168.100.18:9000"
//                   }${item.itemBarcode.itemImage}`
//                 : null,
//             }))}
//           />
//         )}

//         {/* Payment Mode Modal */}
//         {showPaymentModeModal && (
//           <div
//             className="fixed inset-0 flex items-center justify-center bg-black/20 z-50"
//             onClick={() => setShowPaymentModeModal(false)}
//           >
//             <div
//               className="animate-scaleIn bg-white w-[400px] h-auto rounded-[7px] p-6 shadow-lg relative"
//               onClick={(e) => e.stopPropagation()}
//             >
//               <h2 className="text-xl font-semibold text-[#056BB7] mb-4">
//                 Create Payment Mode
//               </h2>

//               <div className="flex flex-col gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-600 mb-1">
//                     Payment Mode Name
//                   </label>
//                   <input
//                     type="text"
//                     value={paymentModeForm.name}
//                     onChange={(e) =>
//                       setPaymentModeForm({
//                         ...paymentModeForm,
//                         name: e.target.value,
//                       })
//                     }
//                     placeholder="Enter payment mode name"
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-600 mb-1">
//                     Description
//                   </label>
//                   <textarea
//                     value={paymentModeForm.description}
//                     onChange={(e) =>
//                       setPaymentModeForm({
//                         ...paymentModeForm,
//                         description: e.target.value,
//                       })
//                     }
//                     placeholder="Enter description"
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     rows={3}
//                   />
//                 </div>
//               </div>

//               <div className="flex justify-end gap-2 mt-6">
//                 <Button
//                   text="Cancel"
//                   className="bg-gray-200 text-gray-800 border-none px-4"
//                   onClick={() => setShowPaymentModeModal(false)}
//                 />
//                 <Button
//                   text="Create"
//                   className="bg-[#056BB7] text-white border-none px-4"
//                   onClick={createPaymentMode}
//                 />
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Bank Modal */}
//         {showBankModal && (
//           <div
//             className="fixed inset-0 flex items-center justify-center bg-black/20 z-50"
//             onClick={() => setShowBankModal(false)}
//           >
//             <div
//               className="animate-scaleIn bg-white w-[400px] h-auto rounded-[7px] p-6 shadow-lg relative"
//               onClick={(e) => e.stopPropagation()}
//             >
//               <h2 className="text-xl font-semibold text-[#056BB7] mb-4">
//                 Create Bank
//               </h2>

//               <div className="flex flex-col gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-600 mb-1">
//                     Bank Name
//                   </label>
//                   <input
//                     type="text"
//                     value={bankForm.name}
//                     onChange={(e) =>
//                       setBankForm({ ...bankForm, name: e.target.value })
//                     }
//                     placeholder="Enter bank name"
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-600 mb-1">
//                     Description
//                   </label>
//                   <textarea
//                     value={bankForm.description}
//                     onChange={(e) =>
//                       setBankForm({ ...bankForm, description: e.target.value })
//                     }
//                     placeholder="Enter description"
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     rows={3}
//                   />
//                 </div>
//               </div>

//               <div className="flex justify-end gap-2 mt-6">
//                 <Button
//                   text="Cancel"
//                   className="bg-gray-200 text-gray-800 border-none px-4"
//                   onClick={() => setShowBankModal(false)}
//                 />
//                 <Button
//                   text="Create"
//                   className="bg-[#056BB7] text-white border-none px-4"
//                   onClick={createBank}
//                 />
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default SupplierDetailPage;

// import React, { useState, useEffect } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import { IoArrowBack } from "react-icons/io5";
// import SupplierLedgerDetailTable from "../../../components/SupplierLedgerDetailTable";
// import axios from "axios";
// import Input from "../../../components/Input";
// import Dropdown from "../../../components/Dropdown";
// import Button from "../../../components/Button";
// import plusIcon from "../../../assets/plus.svg";
// import InvoiceDetailModal from "../Inventory/InvoiceDetailModal";
// import { toast } from "react-toastify";

// interface SupplierInvoice {
//   _id: string;
//   piId: string;
//   supplierCompanyName: any;
//   referenceNumber: string;
//   purchaseOrderReference: string;
//   dateReceiving: string;
//   dueDate: string;
//   status: string;
//   items: any[];
//   totals: {
//     debit: number;
//     credit: number;
//     balance: number;
//   };
//   description: string;
//   paymentHistory: any[];
//   remainingBalance?: number;
//   totalPaid?: number;
//   createdAt: string;
//   updatedAt: string;
// }

// interface Column {
//   header: string;
//   accessor: string;
//   type?: "select" | "text" | "image" | "status" | "actions" | "refrence";
// }

// interface TransformedInvoiceData {
//   invoice: string;
//   invoiceDate: string;
//   status: string;
//   debit: string;
//   credit: string;
//   refrence: string;
//   month: string;
//   remainingBalance: number;
//   totalPaid: number;
//   originalData?: SupplierInvoice;
// }

// interface PaymentMode {
//   _id: string;
//   name: string;
//   description: string;
// }

// interface Bank {
//   _id: string;
//   name: string;
//   description: string;
// }

// interface WalletBalance {
//   balance: number;
// }

// interface PaymentData {
//   type: string;
//   amount: number;
//   bank?: string;
//   mode?: string;
// }

// const payColumns: Column[] = [
//   { header: "Invoice", accessor: "invoice" },
//   { header: "Invoice Date", accessor: "invoiceDate" },
//   { header: "Status", accessor: "status", type: "status" },
//   { header: "Debit ($)", accessor: "debit", type: "text" },
//   { header: "Credit ($)", accessor: "credit", type: "text" },
//   { header: "Balance ($)", accessor: "balance", type: "text" },
//   { header: "Actions", accessor: "actions", type: "actions" },
// ];

// const SupplierDetailPage = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const [supplierName, setSupplierName] = useState<string>("");
//   const [supplierInvoices, setSupplierInvoices] = useState<SupplierInvoice[]>(
//     []
//   );
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [supplierId, setSupplierId] = useState<string>("");
//   const [isEditing, setIsEditing] = useState(false);
//   const [search, setSearch] = useState("");
//   const [statusFilter, setStatusFilter] = useState("All");
//   const [selectedInvoiceData, setSelectedInvoiceData] =
//     useState<SupplierInvoice | null>(null);
//   const [selectedInvoicesForPayment, setSelectedInvoicesForPayment] = useState<
//     any[]
//   >([]);
//   const [showPaymentModeModal, setShowPaymentModeModal] = useState(false);
//   const [showBankModal, setShowBankModal] = useState(false);
//   const [paymentModes, setPaymentModes] = useState<PaymentMode[]>([]);
//   const [banks, setBanks] = useState<Bank[]>([]);
//   const [walletBalance, setWalletBalance] = useState<number>(0);
//   const [paymentModeForm, setPaymentModeForm] = useState({
//     name: "",
//     description: "",
//   });
//   const [bankForm, setBankForm] = useState({ name: "", description: "" });

//   // Payment form states
//   const [selectedPaymentTypes, setSelectedPaymentTypes] = useState<string[]>(
//     []
//   );
//   const [paymentNote, setPaymentNote] = useState<string>("");
//   const [payments, setPayments] = useState<PaymentData[]>([]);
//   const [walletAmount, setWalletAmount] = useState<number>(0);
//   const [bankAmount, setBankAmount] = useState<number>(0);
//   const [paymentModeAmount, setPaymentModeAmount] = useState<number>(0);
//   const [selectedBank, setSelectedBank] = useState<string>("");
//   const [selectedPaymentMode, setSelectedPaymentMode] = useState<string>("");

//   // Add state to track selected rows
//   const [selectedRows, setSelectedRows] = useState<{ [key: string]: boolean }>(
//     {}
//   );

//   const getAuthToken = () => {
//     let token = localStorage.getItem("token");
//     if (!token) {
//       token = sessionStorage.getItem("token");
//     }
//     return token;
//   };

//   const handleRowSelect = (rowId: string, allSelectedRows?: any) => {
//     if (allSelectedRows !== undefined) {
//       setSelectedRows(allSelectedRows);
//     } else {
//       setSelectedRows((prev) => ({
//         ...prev,
//         [rowId]: !prev[rowId],
//       }));
//     }
//   };

//   const fetchSupplierInvoices = async (id: string) => {
//     try {
//       setLoading(true);
//       const API_URL =
//         import.meta.env.VITE_BASE_URL || "http://192.168.100.18:9000";
//       const token = getAuthToken();

//       if (!token) {
//         setError("No authentication token found");
//         return;
//       }

//       const response = await axios.get(
//         `${API_URL}/api/abid-jewelry-ms/getInvoiceBySupplier/${id}`,
//         {
//           headers: {
//             "x-access-token": token,
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       if (response.data.success) {
//         setSupplierInvoices(response.data.data);
//         if (
//           response.data.data.length > 0 &&
//           response.data.data[0].supplierCompanyName
//         ) {
//           setSupplierName(
//             response.data.data[0].supplierCompanyName.companyName
//           );
//         }
//         setError(null);
//       } else {
//         setError("Failed to fetch supplier invoices");
//       }
//     } catch (error) {
//       console.error("Error fetching supplier invoices:", error);
//       setError("Error fetching supplier invoices");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchSupplierWalletBalance = async (id: string) => {
//     try {
//       const API_URL =
//         import.meta.env.VITE_BASE_URL || "http://192.168.100.18:9000";
//       const token = getAuthToken();

//       const response = await axios.get(
//         `${API_URL}/api/abid-jewelry-ms/getSupplierWallet/${id}`,
//         {
//           headers: {
//             "x-access-token": token,
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       if (response.data.success) {
//         setWalletBalance(response.data.data.balance || 0);
//       }
//     } catch (error) {
//       console.error("Error fetching wallet balance:", error);
//       setWalletBalance(0);
//     }
//   };

//   useEffect(() => {
//     if (location.state && location.state.supplier) {
//       setSupplierName(location.state.supplier);
//       if (location.state.supplierData) {
//         setSupplierId(location.state.supplierData._id);
//       }
//     } else {
//       const pathParts = location.pathname.split("/");
//       if (pathParts.length > 0) {
//         const lastPart = pathParts[pathParts.length - 1];
//         if (lastPart !== "supplier-ledger" && lastPart) {
//           setSupplierId(lastPart);
//         }
//       }
//     }
//   }, [location]);

//   useEffect(() => {
//     if (supplierId) {
//       fetchSupplierInvoices(supplierId);
//       fetchSupplierWalletBalance(supplierId);
//     }
//   }, [supplierId]);

//   const fetchPaymentModes = async () => {
//     try {
//       const API_URL =
//         import.meta.env.VITE_BASE_URL || "http://192.168.100.18:9000";
//       const token = getAuthToken();

//       const response = await axios.get(
//         `${API_URL}/api/abid-jewelry-ms/getAllPayments`,
//         {
//           headers: {
//             "x-access-token": token,
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       if (response.data.success) {
//         setPaymentModes(response.data.data);
//       }
//     } catch (error) {
//       console.error("Error fetching payment modes:", error);
//     }
//   };

//   const fetchBanks = async () => {
//     try {
//       const API_URL =
//         import.meta.env.VITE_BASE_URL || "http://192.168.100.18:9000";
//       const token = getAuthToken();

//       const response = await axios.get(
//         `${API_URL}/api/abid-jewelry-ms/getAllBanks`,
//         {
//           headers: {
//             "x-access-token": token,
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       if (response.data.success) {
//         setBanks(response.data.data);
//       }
//     } catch (error) {
//       console.error("Error fetching banks:", error);
//     }
//   };

//   const createPaymentMode = async () => {
//     try {
//       const API_URL =
//         import.meta.env.VITE_BASE_URL || "http://192.168.100.18:9000";
//       const token = getAuthToken();

//       const response = await axios.post(
//         `${API_URL}/api/abid-jewelry-ms/createPayment`,
//         paymentModeForm,
//         {
//           headers: {
//             "x-access-token": token,
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       if (response.data.success) {
//         setShowPaymentModeModal(false);
//         setPaymentModeForm({ name: "", description: "" });
//         fetchPaymentModes();
//         toast.success("Payment mode created successfully");
//       }
//     } catch (error) {
//       console.error("Error creating payment mode:", error);
//       toast.error("Failed to create payment mode");
//     }
//   };

//   const createBank = async () => {
//     try {
//       const API_URL =
//         import.meta.env.VITE_BASE_URL || "http://192.168.100.18:9000";
//       const token = getAuthToken();

//       const response = await axios.post(
//         `${API_URL}/api/abid-jewelry-ms/createBank`,
//         bankForm,
//         {
//           headers: {
//             "x-access-token": token,
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       if (response.data.success) {
//         setShowBankModal(false);
//         setBankForm({ name: "", description: "" });
//         fetchBanks();
//         toast.success("Bank created successfully");
//       }
//     } catch (error) {
//       console.error("Error creating bank:", error);
//       toast.error("Failed to create bank");
//     }
//   };

//   const processPayment = async () => {
//     try {
//       if (selectedInvoicesForPayment.length === 0) {
//         toast.error("No invoice selected for payment");
//         return;
//       }

//       const invoice = selectedInvoicesForPayment[0];
//       const remainingBalance = invoice.remainingBalance || 0;

//       // Build payments array based on selected payment types and amounts
//       const paymentsArray: PaymentData[] = [];
//       let totalPaymentAmount = 0;

//       if (selectedPaymentTypes.includes("Wallet") && walletAmount > 0) {
//         if (walletAmount > walletBalance) {
//           toast.error("Wallet amount exceeds available balance");
//           return;
//         }
//         paymentsArray.push({
//           type: "wallet",
//           amount: walletAmount,
//         });
//         totalPaymentAmount += walletAmount;
//       }

//       if (selectedPaymentTypes.includes("Bank") && bankAmount > 0) {
//         if (!selectedBank) {
//           toast.error("Please select a bank");
//           return;
//         }
//         paymentsArray.push({
//           type: "bank",
//           amount: bankAmount,
//           bank: selectedBank,
//         });
//         totalPaymentAmount += bankAmount;
//       }

//       if (
//         selectedPaymentTypes.includes("Payment Mode") &&
//         paymentModeAmount > 0
//       ) {
//         if (!selectedPaymentMode) {
//           toast.error("Please select a payment mode");
//           return;
//         }
//         paymentsArray.push({
//           type: "paymentMode",
//           amount: paymentModeAmount,
//           mode: selectedPaymentMode,
//         });
//         totalPaymentAmount += paymentModeAmount;
//       }

//       if (paymentsArray.length === 0) {
//         toast.error("Please enter payment amounts");
//         return;
//       }

//       if (totalPaymentAmount > remainingBalance) {
//         toast.error("Payment amount exceeds remaining balance");
//         return;
//       }

//       const API_URL =
//         import.meta.env.VITE_BASE_URL || "http://192.168.100.18:9000";
//       const token = getAuthToken();

//       const payload = {
//         purchaseInvoiceId: invoice.originalData._id,
//         payments: paymentsArray,
//         note: paymentNote,
//       };

//       const response = await axios.put(
//         `${API_URL}/api/abid-jewelry-ms/updateInvoiceBySupplier`,
//         payload,
//         {
//           headers: {
//             "x-access-token": token,
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       if (response.data.success) {
//         toast.success("Payment processed successfully");
//         setIsEditing(false);
//         setSelectedInvoicesForPayment([]);
//         setSelectedRows({});
//         resetPaymentForm();
//         // Refresh the invoices
//         if (supplierId) {
//           fetchSupplierInvoices(supplierId);
//           fetchSupplierWalletBalance(supplierId);
//         }
//       } else {
//         toast.error("Failed to process payment");
//       }
//     } catch (error) {
//       console.error("Error processing payment:", error);
//       toast.error("Error processing payment");
//     }
//   };

//   const resetPaymentForm = () => {
//     setSelectedPaymentTypes([]);
//     setPaymentNote("");
//     setWalletAmount(0);
//     setBankAmount(0);
//     setPaymentModeAmount(0);
//     setSelectedBank("");
//     setSelectedPaymentMode("");
//   };

//   // Add useEffect to fetch data on component mount
//   useEffect(() => {
//     fetchPaymentModes();
//     fetchBanks();
//   }, []);

//   const getFilteredData = (data: TransformedInvoiceData[]) => {
//     return data.filter((item) => {
//       // Search filter - check invoice and reference
//       const searchableText = `${item.invoice || ""} ${
//         item.refrence || ""
//       }`.toLowerCase();
//       const matchesSearch = searchableText.includes(search.toLowerCase());

//       // Status filter
//       const matchesStatus =
//         statusFilter === "All" || item.status === statusFilter;

//       return matchesSearch && matchesStatus;
//     });
//   };

//   const transformInvoiceData = (
//     invoices: SupplierInvoice[]
//   ): TransformedInvoiceData[] => {
//     return invoices.map((invoice) => ({
//       invoice: invoice.piId,
//       invoiceDate: new Date(invoice.dateReceiving).toLocaleDateString("en-GB", {
//         day: "2-digit",
//         month: "2-digit",
//         year: "numeric",
//       }),
//       status:
//         invoice.status === "paid"
//           ? "Paid"
//           : invoice.status === "partiallyPaid"
//           ? "Partially Paid"
//           : "Unpaid",
//       debit: invoice.totals.debit.toString(),
//       credit: invoice.totals.credit.toString(),
//       refrence:
//         invoice.paymentHistory.length > 0
//           ? invoice.paymentHistory[0].invoiceReferenceNumber
//           : "--",
//       month: new Date(invoice.dateReceiving).toLocaleDateString("en-US", {
//         month: "long",
//       }),
//       remainingBalance: invoice.remainingBalance || invoice.totals.balance,
//       totalPaid: invoice.totalPaid || 0,
//       originalData: invoice, // Add original invoice data
//     }));
//   };

//   const calculateSummary = (data: TransformedInvoiceData[]) => {
//     const totalDebit = data.reduce(
//       (sum, item) => sum + parseFloat(item.debit),
//       0
//     );
//     const totalCredit = data.reduce(
//       (sum, item) => sum + parseFloat(item.credit),
//       0
//     );
//     const totalBalance = data.reduce(
//       (sum, item) => sum + (item.remainingBalance || 0),
//       0
//     );

//     // Calculate selected credit from selected rows
//     const selectedCredit = data
//       .filter((item) => selectedRows[item.invoice])
//       .reduce((sum, item) => sum + parseFloat(item.credit), 0);

//     return { totalDebit, totalCredit, totalBalance, selectedCredit };
//   };

//   const transformedInvoices = transformInvoiceData(supplierInvoices);

//   // Update the summary calculation to use filtered data
//   const allFilteredData = getFilteredData(transformedInvoices);
//   const summary = calculateSummary(allFilteredData);

//   // Group data by month
//   const groupedByMonth = transformedInvoices.reduce((acc, invoice) => {
//     const month = invoice.month;
//     if (!acc[month]) {
//       acc[month] = [];
//     }
//     acc[month].push(invoice);
//     return acc;
//   }, {} as Record<string, TransformedInvoiceData[]>);

//   // Get data for specific months (you can adjust this based on your needs)
//   const januaryData = getFilteredData(groupedByMonth["January"] || []);
//   const februaryData = getFilteredData(groupedByMonth["February"] || []);
//   const marchData = getFilteredData(groupedByMonth["March"] || []);
//   const aprilData = getFilteredData(groupedByMonth["April"] || []);
//   const mayData = getFilteredData(groupedByMonth["May"] || []);
//   const juneData = getFilteredData(groupedByMonth["June"] || []);
//   const julyData = getFilteredData(groupedByMonth["July"] || []);
//   const augustData = getFilteredData(groupedByMonth["August"] || []);
//   const septemberData = getFilteredData(groupedByMonth["September"] || []);
//   const octoberData = getFilteredData(groupedByMonth["October"] || []);
//   const novemberData = getFilteredData(groupedByMonth["November"] || []);
//   const decemberData = getFilteredData(groupedByMonth["December"] || []);

//   const columns: Column[] = [
//     { header: "Select", accessor: "select", type: "select" },
//     { header: "Invoice", accessor: "invoice" },
//     { header: "Invoice Date", accessor: "invoiceDate" },
//     { header: "Status", accessor: "status" },
//     { header: "Debit ($)", accessor: "debit" },
//     { header: "Credit ($)", accessor: "credit" },
//     { header: "Reference", accessor: "refrence" },
//     { header: "Actions", accessor: "actions", type: "actions" },
//   ];

//   // Helper function to handle payment type selection
//   const handlePaymentTypeToggle = (paymentType: string) => {
//     setSelectedPaymentTypes((prev) => {
//       const newTypes = [...prev];

//       if (newTypes.includes(paymentType)) {
//         // Remove the payment type
//         return newTypes.filter((type) => type !== paymentType);
//       } else {
//         // Add the payment type with validation
//         if (paymentType === "Wallet") {
//           // Wallet can be selected with Bank or Payment Mode, but not both
//           return [...newTypes, paymentType];
//         } else if (paymentType === "Bank") {
//           // Bank can only be selected if Payment Mode is not selected
//           if (newTypes.includes("Payment Mode")) {
//             toast.error(
//               "Cannot select Bank when Payment Mode is already selected"
//             );
//             return newTypes;
//           }
//           return [...newTypes, paymentType];
//         } else if (paymentType === "Payment Mode") {
//           // Payment Mode can only be selected if Bank is not selected
//           if (newTypes.includes("Bank")) {
//             toast.error(
//               "Cannot select Payment Mode when Bank is already selected"
//             );
//             return newTypes;
//           }
//           return [...newTypes, paymentType];
//         }

//         return [...newTypes, paymentType];
//       }
//     });
//   };

//   const renderPaymentInputs = () => {
//     const selectedInvoice = selectedInvoicesForPayment[0];
//     const remainingBalance = selectedInvoice?.remainingBalance || 0;

//     return (
//       <div className="space-y-4">
//         {/* Payment Type Selection */}
//         <div className="flex flex-col text-[15px] Poppins-font font-medium">
//           <label className="mb-2">Select Payment Types</label>
//           <div className="space-y-2">
//             {/* Wallet Option */}
//             <div className="flex items-center">
//               <input
//                 type="checkbox"
//                 id="wallet"
//                 checked={selectedPaymentTypes.includes("Wallet")}
//                 onChange={() => handlePaymentTypeToggle("Wallet")}
//                 className="mr-2"
//               />
//               <label htmlFor="wallet" className="cursor-pointer">
//                 Wallet (Available: ${walletBalance})
//               </label>
//             </div>

//             {/* Bank Option */}
//             <div className="flex items-center">
//               <input
//                 type="checkbox"
//                 id="bank"
//                 checked={selectedPaymentTypes.includes("Bank")}
//                 onChange={() => handlePaymentTypeToggle("Bank")}
//                 disabled={selectedPaymentTypes.includes("Payment Mode")}
//                 className="mr-2"
//               />
//               <label
//                 htmlFor="bank"
//                 className={`cursor-pointer ${
//                   selectedPaymentTypes.includes("Payment Mode")
//                     ? "text-gray-400"
//                     : ""
//                 }`}
//               >
//                 Bank
//               </label>
//             </div>

//             {/* Payment Mode Option */}
//             <div className="flex items-center">
//               <input
//                 type="checkbox"
//                 id="paymentMode"
//                 checked={selectedPaymentTypes.includes("Payment Mode")}
//                 onChange={() => handlePaymentTypeToggle("Payment Mode")}
//                 disabled={selectedPaymentTypes.includes("Bank")}
//                 className="mr-2"
//               />
//               <label
//                 htmlFor="paymentMode"
//                 className={`cursor-pointer ${
//                   selectedPaymentTypes.includes("Bank") ? "text-gray-400" : ""
//                 }`}
//               >
//                 Payment Mode
//               </label>
//             </div>
//           </div>
//         </div>

//         {/* Remaining Balance Display */}
//         <div className="bg-blue-50 p-3 rounded-md">
//           <p className="text-sm font-medium text-blue-800">
//             Remaining Balance: ${remainingBalance}
//           </p>
//           {walletBalance > 0 && (
//             <p className="text-sm font-medium text-green-800">
//               Wallet Balance: ${walletBalance}
//             </p>
//           )}
//         </div>

//         {/* Wallet Payment Input */}
//         {selectedPaymentTypes.includes("Wallet") && (
//           <div className="flex flex-col text-[15px] Poppins-font font-medium">
//             <label className="mb-1">
//               Wallet Payment Amount (Available: ${walletBalance})
//             </label>
//             <Input
//               placeholder="0"
//               className="w-full outline-none"
//               type="number"
//               value={walletAmount.toString()}
//               onChange={(e) => setWalletAmount(parseFloat(e.target.value) || 0)}
//             />
//           </div>
//         )}

//         {/* Bank Payment Input */}
//         {selectedPaymentTypes.includes("Bank") && (
//           <>
//             <div className="flex flex-col text-[15px] Poppins-font font-medium">
//               <div className="flex items-center gap-2">
//                 <label className="mb-1">Select Bank</label>
//                 <div
//                   className="inline-block cursor-pointer"
//                   onClick={(e) => {
//                     e.preventDefault();
//                     e.stopPropagation();
//                     setShowBankModal(true);
//                   }}
//                 >
//                   <img src={plusIcon} alt="Add bank" width={16} height={16} />
//                 </div>
//               </div>
//               <Dropdown
//                 options={banks.map((bank) => bank.name)}
//                 defaultValue="Select Bank"
//                 onSelect={(val) => {
//                   const selectedBankObj = banks.find(
//                     (bank) => bank.name === val
//                   );
//                   setSelectedBank(selectedBankObj?._id || "");
//                 }}
//               />
//             </div>
//             <div className="flex flex-col text-[15px] Poppins-font font-medium">
//               <label className="mb-1">Bank Payment Amount</label>
//               <Input
//                 placeholder="0"
//                 className="w-full outline-none"
//                 type="number"
//                 value={bankAmount.toString()}
//                 onChange={(e) => setBankAmount(parseFloat(e.target.value) || 0)}
//               />
//             </div>
//           </>
//         )}

//         {/* Payment Mode Input */}
//         {selectedPaymentTypes.includes("Payment Mode") && (
//           <>
//             <div className="flex flex-col text-[15px] Poppins-font font-medium">
//               <div className="flex items-center gap-2">
//                 <label className="mb-1">Select Payment Mode</label>
//                 <div
//                   className="inline-block cursor-pointer"
//                   onClick={(e) => {
//                     e.preventDefault();
//                     e.stopPropagation();
//                     setShowPaymentModeModal(true);
//                   }}
//                 >
//                   <img
//                     src={plusIcon}
//                     alt="Add payment mode"
//                     width={16}
//                     height={16}
//                   />
//                 </div>
//               </div>
//               <Dropdown
//                 options={paymentModes.map((mode) => mode.name)}
//                 defaultValue="Select Payment Mode"
//                 onSelect={(val) => {
//                   const selectedModeObj = paymentModes.find(
//                     (mode) => mode.name === val
//                   );
//                   setSelectedPaymentMode(selectedModeObj?._id || "");
//                 }}
//               />
//             </div>
//             <div className="flex flex-col text-[15px] Poppins-font font-medium">
//               <label className="mb-1">Payment Mode Amount</label>
//               <Input
//                 placeholder="0"
//                 className="w-full outline-none"
//                 type="number"
//                 value={paymentModeAmount.toString()}
//                 onChange={(e) =>
//                   setPaymentModeAmount(parseFloat(e.target.value) || 0)
//                 }
//               />
//             </div>
//           </>
//         )}

//         {/* Total Payment Display */}
//         {selectedPaymentTypes.length > 0 && (
//           <div className="bg-green-50 p-3 rounded-md">
//             <p className="text-sm font-medium text-green-800">
//               Total Payment: ${walletAmount + bankAmount + paymentModeAmount}
//             </p>
//           </div>
//         )}
//       </div>
//     );
//   };

//   if (loading) {
//     return (
//       <div className="mx-auto px-3 py-6 sm:px-4 md:px-6 xl:px-8 xl:py-6 space-y-6 lg:w-[100%] xl:w-full w-full overflow-x-hidden">
//         <div className="rounded-xl px-4 py-7 flex items-center justify-center">
//           <div className="text-lg text-gray-600">
//             <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="mx-auto px-3 py-6 sm:px-4 md:px-6 xl:px-8 xl:py-6 space-y-6 lg:w-[100%] xl:w-full w-full overflow-x-hidden">
//         <div className="bg-white rounded-xl px-4 py-7 flex items-center justify-center shadow-md">
//           <div className="text-lg text-red-600">Error: {error}</div>
//           <button
//             onClick={() => supplierId && fetchSupplierInvoices(supplierId)}
//             className="ml-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
//           >
//             Retry
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="mx-auto px-3 py-6 sm:px-4 md:px-6 xl:px-8 xl:py-6 space-y-6 lg:w-[100%] xl:w-full w-full overflow-x-hidden">
//       <div className="bg-white rounded-xl p-7 flex flex-col gap-4 overflow-hidden shadow-md">
//         {/* Header */}
//         <div className="flex items-center gap-4">
//           <button
//             onClick={() => navigate(-1)}
//             className="p-2 hover:bg-gray-100 rounded-full transition-colors"
//           >
//             <IoArrowBack size={20} className="text-gray-600" />
//           </button>
//           <h1 className="text-2xl font-semibold text-gray-800">
//             {supplierName || "Supplier Details"}
//           </h1>
//         </div>

//         {/* Search + Filter */}
//         <div className="grid gap-4 items-center justify-between md:grid-cols-2 mb-2">
//           <div className="flex gap-3">
//             <Input
//               placeholder="Search Invoice, Reference No"
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//               className="w-sm !rounded-3xl outline-none"
//             />
//             <Dropdown
//               options={["All", "Paid", "Unpaid", "Partially Paid"]}
//               DropDownName="Status"
//               defaultValue="All"
//               onSelect={(val) => {
//                 setStatusFilter(val);
//               }}
//             />
//           </div>
//           <div className="flex md:justify-end gap-3">
//             <Button
//               text="Pay"
//               className="bg-[#056BB7] text-white border-none font-medium w-auto px-7"
//               onClick={(e) => {
//                 if (e) e.stopPropagation();

//                 // Get selected invoices from all months
//                 const allSelectedInvoices = transformedInvoices.filter(
//                   (invoice) => selectedRows[invoice.invoice]
//                 );

//                 if (allSelectedInvoices.length === 0) {
//                   toast.error("Please select at least one invoice to pay");
//                   return;
//                 }

//                 if (allSelectedInvoices.length > 1) {
//                   toast.error("Please select only one invoice at a time");
//                   return;
//                 }

//                 setSelectedInvoicesForPayment(allSelectedInvoices);
//                 setIsEditing(true);
//               }}
//             />
//             <Button
//               text="Export"
//               variant="border"
//               className="bg-[#5D6679] text-white w-24"
//             />
//           </div>
//         </div>

//         {/* Summary */}
//         <div className="bg-[#FCF3EC] py-3 px-4 rounded-md flex justify-between gap-6 text-md font-semibold">
//           <div>
//             Selected Credit:{" "}
//             <span className="font-medium">${summary.selectedCredit}</span>
//           </div>
//           <div className="flex gap-6">
//             <div>
//               Debit: <span className="font-medium">${summary.totalDebit}</span>
//             </div>
//             <div>
//               Credit:{" "}
//               <span className="font-medium">${summary.totalCredit}</span>
//             </div>
//             <div>
//               Balance:{" "}
//               <span className="font-medium">${summary.totalBalance}</span>
//             </div>
//           </div>
//         </div>

//         {/* Tables for each month */}
//         {januaryData.length > 0 && (
//           <SupplierLedgerDetailTable
//             columns={columns}
//             data={januaryData}
//             tableTitle="January"
//             selectedRows={selectedRows}
//             onRowSelect={handleRowSelect}
//             onEyeClick={(row) => setSelectedInvoiceData(row.originalData)}
//           />
//         )}

//         {februaryData.length > 0 && (
//           <SupplierLedgerDetailTable
//             columns={columns}
//             data={februaryData}
//             tableTitle="February"
//             selectedRows={selectedRows}
//             onRowSelect={handleRowSelect}
//             onEyeClick={(row) => setSelectedInvoiceData(row.originalData)}
//           />
//         )}

//         {marchData.length > 0 && (
//           <SupplierLedgerDetailTable
//             columns={columns}
//             data={marchData}
//             tableTitle="March"
//             selectedRows={selectedRows}
//             onRowSelect={handleRowSelect}
//             onEyeClick={(row) => setSelectedInvoiceData(row.originalData)}
//           />
//         )}

//         {aprilData.length > 0 && (
//           <SupplierLedgerDetailTable
//             columns={columns}
//             data={aprilData}
//             tableTitle="April"
//             selectedRows={selectedRows}
//             onRowSelect={handleRowSelect}
//             onEyeClick={(row) => setSelectedInvoiceData(row.originalData)}
//           />
//         )}

//         {mayData.length > 0 && (
//           <SupplierLedgerDetailTable
//             columns={columns}
//             data={mayData}
//             tableTitle="May"
//             selectedRows={selectedRows}
//             onRowSelect={handleRowSelect}
//             onEyeClick={(row) => setSelectedInvoiceData(row.originalData)}
//           />
//         )}

//         {juneData.length > 0 && (
//           <SupplierLedgerDetailTable
//             columns={columns}
//             data={juneData}
//             tableTitle="June"
//             selectedRows={selectedRows}
//             onRowSelect={handleRowSelect}
//             onEyeClick={(row) => setSelectedInvoiceData(row.originalData)}
//           />
//         )}

//         {julyData.length > 0 && (
//           <SupplierLedgerDetailTable
//             columns={columns}
//             data={julyData}
//             tableTitle="July"
//             selectedRows={selectedRows}
//             onRowSelect={handleRowSelect}
//             onEyeClick={(row) => setSelectedInvoiceData(row.originalData)}
//           />
//         )}

//         {augustData.length > 0 && (
//           <SupplierLedgerDetailTable
//             columns={columns}
//             data={augustData}
//             tableTitle="August"
//             selectedRows={selectedRows}
//             onRowSelect={handleRowSelect}
//             onEyeClick={(row) => setSelectedInvoiceData(row.originalData)}
//           />
//         )}

//         {septemberData.length > 0 && (
//           <SupplierLedgerDetailTable
//             columns={columns}
//             data={septemberData}
//             tableTitle="September"
//             selectedRows={selectedRows}
//             onRowSelect={handleRowSelect}
//             onEyeClick={(row) => setSelectedInvoiceData(row.originalData)}
//           />
//         )}

//         {octoberData.length > 0 && (
//           <SupplierLedgerDetailTable
//             columns={columns}
//             data={octoberData}
//             tableTitle="October"
//             selectedRows={selectedRows}
//             onRowSelect={handleRowSelect}
//             onEyeClick={(row) => setSelectedInvoiceData(row.originalData)}
//           />
//         )}

//         {novemberData.length > 0 && (
//           <SupplierLedgerDetailTable
//             columns={columns}
//             data={novemberData}
//             tableTitle="November"
//             selectedRows={selectedRows}
//             onRowSelect={handleRowSelect}
//             onEyeClick={(row) => setSelectedInvoiceData(row.originalData)}
//           />
//         )}

//         {decemberData.length > 0 && (
//           <SupplierLedgerDetailTable
//             columns={columns}
//             data={decemberData}
//             tableTitle="December"
//             selectedRows={selectedRows}
//             onRowSelect={handleRowSelect}
//             onEyeClick={(row) => setSelectedInvoiceData(row.originalData)}
//           />
//         )}

//         {/* Show message if no data */}
//         {transformedInvoices.length === 0 && (
//           <div className="bg-white rounded-xl px-4 py-7 flex items-center justify-center shadow-md">
//             <div className="text-lg text-gray-600">
//               No invoices found for this supplier.
//             </div>
//           </div>
//         )}

//         {/* Payment Modal */}
//         {isEditing && (
//           <div
//             className="fixed inset-0 flex items-center justify-center bg-black/20 z-50"
//             onClick={() => {
//               setIsEditing(false);
//               setSelectedInvoicesForPayment([]);
//               setSelectedRows({});
//               resetPaymentForm();
//             }}
//           >
//             <div
//               className="animate-scaleIn bg-white w-[70vw] h-auto max-h-[90vh] overflow-y-auto rounded-[7px] shadow-lg px-4 py-6"
//               onClick={(e) => e.stopPropagation()}
//             >
//               <h2 className="text-xl font-semibold text-[#056BB7]">Payment</h2>

//               {/* Payment Form */}
//               <div className="mt-4 space-y-4">
//                 {renderPaymentInputs()}

//                 {/* Note Section */}
//                 <div className="mt-4 mb-2">
//                   <p className="Poppins-font font-medium text-sm mb-1">Note</p>
//                   <textarea
//                     placeholder="Enter additional notes here"
//                     rows={2}
//                     value={paymentNote}
//                     onChange={(e) => setPaymentNote(e.target.value)}
//                     className="Poppins-font font-medium w-full px-2 py-2 border border-gray-300 rounded-md text-sm !focus:outline-none outline-none resize-none"
//                   />
//                 </div>

//                 {/* Selected Invoice Table */}
//                 <SupplierLedgerDetailTable
//                   eye={true}
//                   columns={payColumns}
//                   data={selectedInvoicesForPayment.map((invoice) => ({
//                     invoice: invoice.invoice,
//                     invoiceDate: invoice.invoiceDate,
//                     status: invoice.status,
//                     debit: invoice.debit,
//                     credit: invoice.credit,
//                     balance: invoice.remainingBalance?.toString() || "0",
//                   }))}
//                   marginTop="mt-4"
//                   selectedRows={selectedRows}
//                   onRowSelect={handleRowSelect}
//                   onRowClick={(row) => console.log("Row clicked:", row)}
//                   showTitle={false}
//                 />

//                 {/* Action Buttons */}
//                 <div className="flex justify-end mt-4 gap-2">
//                   <Button
//                     text="Cancel"
//                     className="bg-gray-200 text-gray-800 border-none px-4"
//                     onClick={() => {
//                       setIsEditing(false);
//                       setSelectedInvoicesForPayment([]);
//                       setSelectedRows({});
//                       resetPaymentForm();
//                     }}
//                   />
//                   <Button
//                     text="Process Payment"
//                     className="bg-[#056BB7] text-white border-none px-4"
//                     onClick={processPayment}
//                   />
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Invoice Detail Modal */}
//         {selectedInvoiceData && (
//           <InvoiceDetailModal
//             isOpen={true}
//             onClose={() => setSelectedInvoiceData(null)}
//             invoiceData={selectedInvoiceData}
//             columns={[
//               {
//                 header: "Product Name",
//                 accessor: "productName",
//                 type: "image",
//               },
//               { header: "QTY", accessor: "quantity" },
//               { header: "Cost Price ($)", accessor: "costPrice" },
//               { header: "Total Cost ($)", accessor: "totalPriceOfCostItems" },
//             ]}
//             data={selectedInvoiceData.items.map((item) => ({
//               productName: item.itemBarcode?.barcode || "N/A",
//               quantity: item.quantity,
//               costPrice: item.costPrice,
//               totalPriceOfCostItems: item.totalPriceOfCostItems,
//               userImage: item.itemBarcode?.itemImage
//                 ? `${
//                     import.meta.env.VITE_BASE_URL ||
//                     "http://192.168.100.18:9000"
//                   }${item.itemBarcode.itemImage}`
//                 : null,
//             }))}
//           />
//         )}

//         {/* Payment Mode Modal */}
//         {showPaymentModeModal && (
//           <div
//             className="fixed inset-0 flex items-center justify-center bg-black/20 z-50"
//             onClick={() => setShowPaymentModeModal(false)}
//           >
//             <div
//               className="animate-scaleIn bg-white w-[400px] h-auto rounded-[7px] p-6 shadow-lg relative"
//               onClick={(e) => e.stopPropagation()}
//             >
//               <h2 className="text-xl font-semibold text-[#056BB7] mb-4">
//                 Create Payment Mode
//               </h2>

//               <div className="flex flex-col gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-600 mb-1">
//                     Payment Mode Name
//                   </label>
//                   <input
//                     type="text"
//                     value={paymentModeForm.name}
//                     onChange={(e) =>
//                       setPaymentModeForm({
//                         ...paymentModeForm,
//                         name: e.target.value,
//                       })
//                     }
//                     placeholder="Enter payment mode name"
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-600 mb-1">
//                     Description
//                   </label>
//                   <textarea
//                     value={paymentModeForm.description}
//                     onChange={(e) =>
//                       setPaymentModeForm({
//                         ...paymentModeForm,
//                         description: e.target.value,
//                       })
//                     }
//                     placeholder="Enter description"
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     rows={3}
//                   />
//                 </div>
//               </div>

//               <div className="flex justify-end gap-2 mt-6">
//                 <Button
//                   text="Cancel"
//                   className="bg-gray-200 text-gray-800 border-none px-4"
//                   onClick={() => setShowPaymentModeModal(false)}
//                 />
//                 <Button
//                   text="Create"
//                   className="bg-[#056BB7] text-white border-none px-4"
//                   onClick={createPaymentMode}
//                 />
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Bank Modal */}
//         {showBankModal && (
//           <div
//             className="fixed inset-0 flex items-center justify-center bg-black/20 z-50"
//             onClick={() => setShowBankModal(false)}
//           >
//             <div
//               className="animate-scaleIn bg-white w-[400px] h-auto rounded-[7px] p-6 shadow-lg relative"
//               onClick={(e) => e.stopPropagation()}
//             >
//               <h2 className="text-xl font-semibold text-[#056BB7] mb-4">
//                 Create Bank
//               </h2>

//               <div className="flex flex-col gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-600 mb-1">
//                     Bank Name
//                   </label>
//                   <input
//                     type="text"
//                     value={bankForm.name}
//                     onChange={(e) =>
//                       setBankForm({ ...bankForm, name: e.target.value })
//                     }
//                     placeholder="Enter bank name"
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-600 mb-1">
//                     Description
//                   </label>
//                   <textarea
//                     value={bankForm.description}
//                     onChange={(e) =>
//                       setBankForm({ ...bankForm, description: e.target.value })
//                     }
//                     placeholder="Enter description"
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     rows={3}
//                   />
//                 </div>
//               </div>

//               <div className="flex justify-end gap-2 mt-6">
//                 <Button
//                   text="Cancel"
//                   className="bg-gray-200 text-gray-800 border-none px-4"
//                   onClick={() => setShowBankModal(false)}
//                 />
//                 <Button
//                   text="Create"
//                   className="bg-[#056BB7] text-white border-none px-4"
//                   onClick={createBank}
//                 />
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default SupplierDetailPage;

import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import SupplierLedgerDetailTable from "../../../components/SupplierLedgerDetailTable";
import axios from "axios";
import Input from "../../../components/Input";
import Dropdown from "../../../components/Dropdown";
import Button from "../../../components/Button";
import plusIcon from "../../../assets/plus.svg";
import InvoiceDetailModal from "../Inventory/InvoiceDetailModal";
import { toast } from "react-toastify";

interface SupplierInvoice {
  _id: string;
  piId: string;
  supplierCompanyName: any;
  referenceNumber: string;
  purchaseOrderReference: string;
  dateReceiving: string;
  dueDate: string;
  status: string;
  items: any[];
  totals: {
    debit: number;
    credit: number;
    balance: number;
  };
  description: string;
  paymentHistory: any[];
  remainingBalance?: number;
  totalPaid?: number;
  createdAt: string;
  updatedAt: string;
}

interface Column {
  header: string;
  accessor: string;
  type?: "select" | "text" | "image" | "status" | "actions" | "refrence";
}

interface TransformedInvoiceData {
  invoice: string;
  invoiceDate: string;
  status: string;
  debit: string;
  credit: string;
  refrence: string;
  month: string;
  remainingBalance: number;
  totalPaid: number;
  originalData?: SupplierInvoice;
}

interface PaymentMode {
  _id: string;
  name: string;
  description: string;
}

interface Bank {
  _id: string;
  name: string;
  description: string;
}

interface WalletBalance {
  balance: number;
}

interface PaymentData {
  type: string;
  amount: number;
  bank?: string;
  mode?: string;
}

const payColumns: Column[] = [
  { header: "Invoice", accessor: "invoice" },
  { header: "Invoice Date", accessor: "invoiceDate" },
  { header: "Status", accessor: "status", type: "status" },
  { header: "Debit ($)", accessor: "debit", type: "text" },
  { header: "Credit ($)", accessor: "credit", type: "text" },
  { header: "Balance ($)", accessor: "balance", type: "text" },
  { header: "Actions", accessor: "actions", type: "actions" },
];

const SupplierDetailPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [supplierName, setSupplierName] = useState<string>("");
  const [supplierInvoices, setSupplierInvoices] = useState<SupplierInvoice[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [supplierId, setSupplierId] = useState<string>("");
  const [isEditing, setIsEditing] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedInvoiceData, setSelectedInvoiceData] =
    useState<SupplierInvoice | null>(null);
  const [selectedInvoicesForPayment, setSelectedInvoicesForPayment] = useState<
    any[]
  >([]);
  const [showPaymentModeModal, setShowPaymentModeModal] = useState(false);
  const [showBankModal, setShowBankModal] = useState(false);
  const [paymentModes, setPaymentModes] = useState<PaymentMode[]>([]);
  const [banks, setBanks] = useState<Bank[]>([]);
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const [paymentModeForm, setPaymentModeForm] = useState({
    name: "",
    description: "",
  });
  const [bankForm, setBankForm] = useState({ name: "", description: "" });

  // Payment form states
  const [selectedPaymentTypes, setSelectedPaymentTypes] = useState<string[]>(
    []
  );
  const [paymentNote, setPaymentNote] = useState<string>("");
  const [payments, setPayments] = useState<PaymentData[]>([]);
  const [walletAmount, setWalletAmount] = useState<number>(0);
  const [bankAmount, setBankAmount] = useState<number>(0);
  const [paymentModeAmount, setPaymentModeAmount] = useState<number>(0);
  const [selectedBank, setSelectedBank] = useState<string>("");
  const [selectedPaymentMode, setSelectedPaymentMode] = useState<string>("");

  // Add state to track selected rows
  const [selectedRows, setSelectedRows] = useState<{ [key: string]: boolean }>(
    {}
  );

  const getAuthToken = () => {
    let token = localStorage.getItem("token");
    if (!token) {
      token = sessionStorage.getItem("token");
    }
    return token;
  };

  // const handleRowSelect = (rowId: string, allSelectedRows?: any) => {
  //   if (allSelectedRows !== undefined) {
  //     setSelectedRows(allSelectedRows);
  //   } else {
  //     setSelectedRows((prev) => ({
  //       ...prev,
  //       [rowId]: !prev[rowId],
  //     }));
  //   }
  // };

  // const handleRowSelect = (rowId: string, allSelectedRows?: any) => {
  //   if (allSelectedRows !== undefined) {
  //     setSelectedRows(allSelectedRows);
  //   } else {
  //     // Find the invoice to check its status
  //     const invoice = transformedInvoices.find((inv) => inv.invoice === rowId);

  //     // Prevent selection if invoice is already paid
  //     if (invoice && invoice.status === "Paid") {
  //       toast.error("Cannot select paid invoices for payment");
  //       return;
  //     }

  //     setSelectedRows((prev) => ({
  //       ...prev,
  //       [rowId]: !prev[rowId],
  //     }));
  //   }
  // };

  const handleRowSelect = (rowId: string, allSelectedRows?: any) => {
    if (allSelectedRows !== undefined) {
      setSelectedRows(allSelectedRows);
    } else {
      // Find the invoice to check its status
      const invoice = transformedInvoices.find((inv) => inv.invoice === rowId);

      // Prevent selection if invoice is already paid
      if (invoice && invoice.status === "Paid") {
        return; // Just return without showing toast
      }

      setSelectedRows((prev) => ({
        ...prev,
        [rowId]: !prev[rowId],
      }));
    }
  };

  // Add this helper function
  const getDisabledRows = (data: TransformedInvoiceData[]) => {
    const disabled: { [key: string]: boolean } = {};
    data.forEach((item) => {
      if (item.status === "Paid") {
        disabled[item.invoice] = true;
      }
    });
    return disabled;
  };

  const fetchSupplierInvoices = async (id: string) => {
    try {
      setLoading(true);
      const API_URL =
        import.meta.env.VITE_BASE_URL || "http://192.168.100.18:9000";
      const token = getAuthToken();

      if (!token) {
        setError("No authentication token found");
        return;
      }

      const response = await axios.get(
        `${API_URL}/api/abid-jewelry-ms/getInvoiceBySupplier/${id}`,
        {
          headers: {
            "x-access-token": token,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        setSupplierInvoices(response.data.data);
        if (
          response.data.data.length > 0 &&
          response.data.data[0].supplierCompanyName
        ) {
          setSupplierName(
            response.data.data[0].supplierCompanyName.companyName
          );
          // Set wallet balance from the supplier data instead of making separate API call
          setWalletBalance(
            response.data.data[0].supplierCompanyName.walletAmount || 0
          );
        }
        setError(null);
      } else {
        setError("Failed to fetch supplier invoices");
      }
    } catch (error) {
      console.error("Error fetching supplier invoices:", error);
      setError("Error fetching supplier invoices");
    } finally {
      setLoading(false);
    }
  };

  // Remove the fetchSupplierWalletBalance function as it's no longer needed
  // const fetchSupplierWalletBalance = async (id: string) => {
  //   // This function is no longer needed as walletAmount is available
  //   // in the getInvoiceBySupplier API response
  // };

  useEffect(() => {
    if (location.state && location.state.supplier) {
      setSupplierName(location.state.supplier);
      if (location.state.supplierData) {
        setSupplierId(location.state.supplierData._id);
      }
    } else {
      const pathParts = location.pathname.split("/");
      if (pathParts.length > 0) {
        const lastPart = pathParts[pathParts.length - 1];
        if (lastPart !== "supplier-ledger" && lastPart) {
          setSupplierId(lastPart);
        }
      }
    }
  }, [location]);

  useEffect(() => {
    if (supplierId) {
      fetchSupplierInvoices(supplierId);
      // Remove the wallet balance API call since it's now included in fetchSupplierInvoices
      // fetchSupplierWalletBalance(supplierId);
    }
  }, [supplierId]);

  const fetchPaymentModes = async () => {
    try {
      const API_URL =
        import.meta.env.VITE_BASE_URL || "http://192.168.100.18:9000";
      const token = getAuthToken();

      const response = await axios.get(
        `${API_URL}/api/abid-jewelry-ms/getAllPayments`,
        {
          headers: {
            "x-access-token": token,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        setPaymentModes(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching payment modes:", error);
    }
  };

  const fetchBanks = async () => {
    try {
      const API_URL =
        import.meta.env.VITE_BASE_URL || "http://192.168.100.18:9000";
      const token = getAuthToken();

      const response = await axios.get(
        `${API_URL}/api/abid-jewelry-ms/getAllBanks`,
        {
          headers: {
            "x-access-token": token,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        setBanks(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching banks:", error);
    }
  };

  const createPaymentMode = async () => {
    try {
      const API_URL =
        import.meta.env.VITE_BASE_URL || "http://192.168.100.18:9000";
      const token = getAuthToken();

      const response = await axios.post(
        `${API_URL}/api/abid-jewelry-ms/createPayment`,
        paymentModeForm,
        {
          headers: {
            "x-access-token": token,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        setShowPaymentModeModal(false);
        setPaymentModeForm({ name: "", description: "" });
        fetchPaymentModes();
        toast.success("Payment mode created successfully");
      }
    } catch (error) {
      console.error("Error creating payment mode:", error);
      toast.error("Failed to create payment mode");
    }
  };

  const createBank = async () => {
    try {
      const API_URL =
        import.meta.env.VITE_BASE_URL || "http://192.168.100.18:9000";
      const token = getAuthToken();

      const response = await axios.post(
        `${API_URL}/api/abid-jewelry-ms/createBank`,
        bankForm,
        {
          headers: {
            "x-access-token": token,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        setShowBankModal(false);
        setBankForm({ name: "", description: "" });
        fetchBanks();
        toast.success("Bank created successfully");
      }
    } catch (error) {
      console.error("Error creating bank:", error);
      toast.error("Failed to create bank");
    }
  };

  const processPayment = async () => {
    try {
      if (selectedInvoicesForPayment.length === 0) {
        toast.error("No invoice selected for payment");
        return;
      }

      const invoice = selectedInvoicesForPayment[0];
      const remainingBalance = invoice.remainingBalance || 0;

      // Build payments array based on selected payment types and amounts
      const paymentsArray: PaymentData[] = [];
      let totalPaymentAmount = 0;

      if (selectedPaymentTypes.includes("Wallet") && walletAmount > 0) {
        if (walletAmount > walletBalance) {
          console.log(walletAmount);
          console.log(walletBalance);

          toast.error(
            "You don't have enough money in your wallet to make this payment"
          );
          return;
        }
        paymentsArray.push({
          type: "wallet",
          amount: walletAmount,
        });
        totalPaymentAmount += walletAmount;
      }

      if (selectedPaymentTypes.includes("Bank") && bankAmount > 0) {
        if (!selectedBank) {
          toast.error("Please select a bank");
          return;
        }
        paymentsArray.push({
          type: "bank",
          amount: bankAmount,
          bank: selectedBank,
        });
        totalPaymentAmount += bankAmount;
      }

      if (
        selectedPaymentTypes.includes("Payment Mode") &&
        paymentModeAmount > 0
      ) {
        if (!selectedPaymentMode) {
          toast.error("Please select a payment mode");
          return;
        }
        paymentsArray.push({
          type: "paymentMode",
          amount: paymentModeAmount,
          mode: selectedPaymentMode,
        });
        totalPaymentAmount += paymentModeAmount;
      }

      if (paymentsArray.length === 0) {
        toast.error("Please enter payment amounts");
        return;
      }

      if (totalPaymentAmount > remainingBalance) {
        // toast.error("Payment amount exceeds remaining balance");
        toast.error(
          "The amount you entered is higher than the remaining payable balance."
        );
        return;
      }

      const API_URL =
        import.meta.env.VITE_BASE_URL || "http://192.168.100.18:9000";
      const token = getAuthToken();

      const payload = {
        purchaseInvoiceId: invoice.originalData._id,
        payments: paymentsArray,
        note: paymentNote,
      };

      const response = await axios.put(
        `${API_URL}/api/abid-jewelry-ms/updateInvoiceBySupplier`,
        payload,
        {
          headers: {
            "x-access-token": token,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        toast.success("Payment processed successfully");
        setIsEditing(false);
        setSelectedInvoicesForPayment([]);
        setSelectedRows({});
        resetPaymentForm();
        // Refresh the invoices (this will also update the wallet balance)
        if (supplierId) {
          fetchSupplierInvoices(supplierId);
        }
      } else {
        toast.error("Failed to process payment");
      }
    } catch (error) {
      console.error("Error processing payment:", error);
      toast.error("Error processing payment");
    }
  };

  const resetPaymentForm = () => {
    setSelectedPaymentTypes([]);
    setPaymentNote("");
    setWalletAmount(0);
    setBankAmount(0);
    setPaymentModeAmount(0);
    setSelectedBank("");
    setSelectedPaymentMode("");
  };

  // Add useEffect to fetch data on component mount
  useEffect(() => {
    fetchPaymentModes();
    fetchBanks();
  }, []);

  const getFilteredData = (data: TransformedInvoiceData[]) => {
    return data.filter((item) => {
      // Search filter - check invoice and reference
      const searchableText = `${item.invoice || ""} ${
        item.refrence || ""
      }`.toLowerCase();
      const matchesSearch = searchableText.includes(search.toLowerCase());

      // Status filter
      const matchesStatus =
        statusFilter === "All" || item.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  };

  const transformInvoiceData = (
    invoices: SupplierInvoice[]
  ): TransformedInvoiceData[] => {
    return invoices.map((invoice) => ({
      invoice: invoice.piId,
      invoiceDate: new Date(invoice.dateReceiving).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }),
      status:
        invoice.status === "paid"
          ? "Paid"
          : invoice.status === "partiallyPaid"
          ? "Partially Paid"
          : "Unpaid",
      debit: invoice.totals.debit.toString(),
      credit: invoice.totals.credit.toString(),
      refrence:
        invoice.paymentHistory.length > 0
          ? invoice.paymentHistory[0].invoiceReferenceNumber
          : "--",
      month: new Date(invoice.dateReceiving).toLocaleDateString("en-US", {
        month: "long",
      }),
      remainingBalance: invoice.remainingBalance || invoice.totals.balance,
      totalPaid: invoice.totalPaid || 0,
      originalData: invoice, // Add original invoice data
    }));
  };

  const calculateSummary = (data: TransformedInvoiceData[]) => {
    const totalDebit = data.reduce(
      (sum, item) => sum + parseFloat(item.debit),
      0
    );
    const totalCredit = data.reduce(
      (sum, item) => sum + parseFloat(item.credit),
      0
    );
    const totalBalance = data.reduce(
      (sum, item) => sum + (item.remainingBalance || 0),
      0
    );

    // Calculate selected credit from selected rows
    const selectedCredit = data
      .filter((item) => selectedRows[item.invoice])
      .reduce((sum, item) => sum + parseFloat(item.credit), 0);

    return { totalDebit, totalCredit, totalBalance, selectedCredit };
  };

  const transformedInvoices = transformInvoiceData(supplierInvoices);

  // Update the summary calculation to use filtered data
  const allFilteredData = getFilteredData(transformedInvoices);
  const summary = calculateSummary(allFilteredData);

  // Group data by month
  const groupedByMonth = transformedInvoices.reduce((acc, invoice) => {
    const month = invoice.month;
    if (!acc[month]) {
      acc[month] = [];
    }
    acc[month].push(invoice);
    return acc;
  }, {} as Record<string, TransformedInvoiceData[]>);

  // Get data for specific months (you can adjust this based on your needs)
  const januaryData = getFilteredData(groupedByMonth["January"] || []);
  const februaryData = getFilteredData(groupedByMonth["February"] || []);
  const marchData = getFilteredData(groupedByMonth["March"] || []);
  const aprilData = getFilteredData(groupedByMonth["April"] || []);
  const mayData = getFilteredData(groupedByMonth["May"] || []);
  const juneData = getFilteredData(groupedByMonth["June"] || []);
  const julyData = getFilteredData(groupedByMonth["July"] || []);
  const augustData = getFilteredData(groupedByMonth["August"] || []);
  const septemberData = getFilteredData(groupedByMonth["September"] || []);
  const octoberData = getFilteredData(groupedByMonth["October"] || []);
  const novemberData = getFilteredData(groupedByMonth["November"] || []);
  const decemberData = getFilteredData(groupedByMonth["December"] || []);

  const columns: Column[] = [
    { header: "Select", accessor: "select", type: "select" },
    { header: "Invoice", accessor: "invoice" },
    { header: "Invoice Date", accessor: "invoiceDate" },
    { header: "Status", accessor: "status" },
    { header: "Debit ($)", accessor: "debit" },
    { header: "Credit ($)", accessor: "credit" },
    { header: "Reference", accessor: "refrence" },
    { header: "Actions", accessor: "actions", type: "actions" },
  ];

  // Helper function to handle payment type selection
  const handlePaymentTypeToggle = (paymentType: string) => {
    setSelectedPaymentTypes((prev) => {
      const newTypes = [...prev];

      if (newTypes.includes(paymentType)) {
        // Remove the payment type
        return newTypes.filter((type) => type !== paymentType);
      } else {
        // Add the payment type with validation
        if (paymentType === "Wallet") {
          // Wallet can be selected with Bank or Payment Mode, but not both
          return [...newTypes, paymentType];
        } else if (paymentType === "Bank") {
          // Bank can only be selected if Payment Mode is not selected
          if (newTypes.includes("Payment Mode")) {
            toast.error(
              "Cannot select Bank when Payment Mode is already selected"
            );
            return newTypes;
          }
          return [...newTypes, paymentType];
        } else if (paymentType === "Payment Mode") {
          // Payment Mode can only be selected if Bank is not selected
          if (newTypes.includes("Bank")) {
            toast.error(
              "Cannot select Payment Mode when Bank is already selected"
            );
            return newTypes;
          }
          return [...newTypes, paymentType];
        }

        return [...newTypes, paymentType];
      }
    });
  };

  const renderPaymentInputs = () => {
    const selectedInvoice = selectedInvoicesForPayment[0];
    const remainingBalance = selectedInvoice?.remainingBalance || 0;

    return (
      <div className="space-y-4">
        {/* Payment Type Selection */}
        <div className="flex flex-col text-[15px] Poppins-font font-medium">
          <label className="mb-2">Select Payment Types</label>
          <div className="space-y-2">
            {/* Wallet Option */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="wallet"
                checked={selectedPaymentTypes.includes("Wallet")}
                onChange={() => handlePaymentTypeToggle("Wallet")}
                className="mr-2"
              />
              <label htmlFor="wallet" className="cursor-pointer">
                Wallet (Available: ${walletBalance})
              </label>
            </div>

            {/* Bank Option */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="bank"
                checked={selectedPaymentTypes.includes("Bank")}
                onChange={() => handlePaymentTypeToggle("Bank")}
                disabled={selectedPaymentTypes.includes("Payment Mode")}
                className="mr-2"
              />
              <label
                htmlFor="bank"
                className={`cursor-pointer ${
                  selectedPaymentTypes.includes("Payment Mode")
                    ? "text-gray-400"
                    : ""
                }`}
              >
                Bank
              </label>
            </div>

            {/* Payment Mode Option */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="paymentMode"
                checked={selectedPaymentTypes.includes("Payment Mode")}
                onChange={() => handlePaymentTypeToggle("Payment Mode")}
                disabled={selectedPaymentTypes.includes("Bank")}
                className="mr-2"
              />
              <label
                htmlFor="paymentMode"
                className={`cursor-pointer ${
                  selectedPaymentTypes.includes("Bank") ? "text-gray-400" : ""
                }`}
              >
                Payment Mode
              </label>
            </div>
          </div>
        </div>

        {/* Remaining Balance Display */}
        <div className="bg-blue-50 p-3 rounded-md">
          <p className="text-sm font-medium text-blue-800">
            Remaining Balance: ${remainingBalance}
          </p>
          {walletBalance > 0 && (
            <p className="text-sm font-medium text-green-800">
              Wallet Balance: ${walletBalance}
            </p>
          )}
        </div>

        {/* Wallet Payment Input */}
        {selectedPaymentTypes.includes("Wallet") && (
          <div className="flex flex-col text-[15px] Poppins-font font-medium">
            <label className="mb-1">
              Wallet Payment Amount (Available: ${walletBalance})
            </label>
            <Input
              placeholder="0"
              className="w-full outline-none"
              type="number"
              value={walletAmount.toString()}
              onChange={(e) => setWalletAmount(parseFloat(e.target.value) || 0)}
            />
          </div>
        )}

        {/* Bank Payment Input */}
        {selectedPaymentTypes.includes("Bank") && (
          <>
            <div className="flex flex-col text-[15px] Poppins-font font-medium">
              <div className="flex items-center gap-2">
                <label className="mb-1">Select Bank</label>
                <div
                  className="inline-block cursor-pointer"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setShowBankModal(true);
                  }}
                >
                  <img src={plusIcon} alt="Add bank" width={16} height={16} />
                </div>
              </div>
              <Dropdown
                options={banks.map((bank) => bank.name)}
                defaultValue="Select Bank"
                onSelect={(val) => {
                  const selectedBankObj = banks.find(
                    (bank) => bank.name === val
                  );
                  setSelectedBank(selectedBankObj?._id || "");
                }}
              />
            </div>
            <div className="flex flex-col text-[15px] Poppins-font font-medium">
              <label className="mb-1">Bank Payment Amount</label>
              <Input
                placeholder="0"
                className="w-full outline-none"
                type="number"
                value={bankAmount.toString()}
                onChange={(e) => setBankAmount(parseFloat(e.target.value) || 0)}
              />
            </div>
          </>
        )}

        {/* Payment Mode Input */}
        {selectedPaymentTypes.includes("Payment Mode") && (
          <>
            <div className="flex flex-col text-[15px] Poppins-font font-medium">
              <div className="flex items-center gap-2">
                <label className="mb-1">Select Payment Mode</label>
                <div
                  className="inline-block cursor-pointer"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setShowPaymentModeModal(true);
                  }}
                >
                  <img
                    src={plusIcon}
                    alt="Add payment mode"
                    width={16}
                    height={16}
                  />
                </div>
              </div>
              <Dropdown
                options={paymentModes.map((mode) => mode.name)}
                defaultValue="Select Payment Mode"
                onSelect={(val) => {
                  const selectedModeObj = paymentModes.find(
                    (mode) => mode.name === val
                  );
                  setSelectedPaymentMode(selectedModeObj?._id || "");
                }}
              />
            </div>
            <div className="flex flex-col text-[15px] Poppins-font font-medium">
              <label className="mb-1">Payment Mode Amount</label>
              <Input
                placeholder="0"
                className="w-full outline-none"
                type="number"
                value={paymentModeAmount.toString()}
                onChange={(e) =>
                  setPaymentModeAmount(parseFloat(e.target.value) || 0)
                }
              />
            </div>
          </>
        )}

        {/* Total Payment Display */}
        {selectedPaymentTypes.length > 0 && (
          <div className="bg-green-50 p-3 rounded-md">
            <p className="text-sm font-medium text-green-800">
              Total Payment: ${walletAmount + bankAmount + paymentModeAmount}
            </p>
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="mx-auto px-3 py-6 sm:px-4 md:px-6 xl:px-8 xl:py-6 space-y-6 lg:w-[100%] xl:w-full w-full overflow-x-hidden">
        <div className="rounded-xl px-4 py-7 flex items-center justify-center">
          <div className="text-lg text-gray-600">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto px-3 py-6 sm:px-4 md:px-6 xl:px-8 xl:py-6 space-y-6 lg:w-[100%] xl:w-full w-full overflow-x-hidden">
        <div className="bg-white rounded-xl px-4 py-7 flex items-center justify-center shadow-md">
          <div className="text-lg text-red-600">Error: {error}</div>
          <button
            onClick={() => supplierId && fetchSupplierInvoices(supplierId)}
            className="ml-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto px-3 py-6 sm:px-4 md:px-6 xl:px-8 xl:py-6 space-y-6 lg:w-[100%] xl:w-full w-full overflow-x-hidden">
      <div className="bg-white rounded-xl p-7 flex flex-col gap-4 overflow-hidden shadow-md">
        {/* Header */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <IoArrowBack size={20} className="text-gray-600" />
          </button>
          <h1 className="text-2xl font-semibold text-gray-800">
            {supplierName || "Supplier Details"}
          </h1>
        </div>

        {/* Search + Filter */}
        <div className="grid gap-4 items-center justify-between md:grid-cols-2 mb-2">
          <div className="flex gap-3">
            <Input
              placeholder="Search Invoice, Reference No"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-sm !rounded-3xl outline-none"
            />
            <Dropdown
              options={["All", "Paid", "Unpaid", "Partially Paid"]}
              DropDownName="Status"
              defaultValue="All"
              onSelect={(val) => {
                setStatusFilter(val);
              }}
            />
          </div>
          <div className="flex md:justify-end gap-3">
            <Button
              text="Pay"
              className="bg-[#056BB7] text-white border-none font-medium w-auto px-7"
              onClick={(e) => {
                if (e) e.stopPropagation();

                // Get selected invoices from all months
                const allSelectedInvoices = transformedInvoices.filter(
                  (invoice) => selectedRows[invoice.invoice]
                );

                if (allSelectedInvoices.length === 0) {
                  toast.error("Please select at least one invoice to pay");
                  return;
                }

                if (allSelectedInvoices.length > 1) {
                  toast.error("Please select only one invoice at a time");
                  return;
                }

                setSelectedInvoicesForPayment(allSelectedInvoices);
                setIsEditing(true);
              }}
            />
            <Button
              text="Export"
              variant="border"
              className="bg-[#5D6679] text-white w-24"
            />
          </div>
        </div>

        {/* Summary */}
        <div className="bg-[#FCF3EC] py-3 px-4 rounded-md flex justify-between gap-6 text-md font-semibold">
          <div>
            Selected Credit:{" "}
            <span className="font-medium">${summary.selectedCredit}</span>
          </div>
          <div className="flex gap-6">
            <div>
              Debit: <span className="font-medium">${summary.totalDebit}</span>
            </div>
            <div>
              Credit:{" "}
              <span className="font-medium">${summary.totalCredit}</span>
            </div>
            <div>
              Balance:{" "}
              <span className="font-medium">${summary.totalBalance}</span>
            </div>
          </div>
        </div>

        {/* Tables for each month */}
        {januaryData.length > 0 && (
          <SupplierLedgerDetailTable
            columns={columns}
            data={januaryData}
            tableTitle="January"
            selectedRows={selectedRows}
            onRowSelect={handleRowSelect}
            onEyeClick={(row) => setSelectedInvoiceData(row.originalData)}
            disabledRows={getDisabledRows(januaryData)}
          />
        )}

        {februaryData.length > 0 && (
          <SupplierLedgerDetailTable
            columns={columns}
            data={februaryData}
            tableTitle="February"
            selectedRows={selectedRows}
            onRowSelect={handleRowSelect}
            onEyeClick={(row) => setSelectedInvoiceData(row.originalData)}
          />
        )}

        {marchData.length > 0 && (
          <SupplierLedgerDetailTable
            columns={columns}
            data={marchData}
            tableTitle="March"
            selectedRows={selectedRows}
            onRowSelect={handleRowSelect}
            onEyeClick={(row) => setSelectedInvoiceData(row.originalData)}
          />
        )}

        {aprilData.length > 0 && (
          <SupplierLedgerDetailTable
            columns={columns}
            data={aprilData}
            tableTitle="April"
            selectedRows={selectedRows}
            onRowSelect={handleRowSelect}
            onEyeClick={(row) => setSelectedInvoiceData(row.originalData)}
          />
        )}

        {mayData.length > 0 && (
          <SupplierLedgerDetailTable
            columns={columns}
            data={mayData}
            tableTitle="May"
            selectedRows={selectedRows}
            onRowSelect={handleRowSelect}
            onEyeClick={(row) => setSelectedInvoiceData(row.originalData)}
          />
        )}

        {juneData.length > 0 && (
          <SupplierLedgerDetailTable
            columns={columns}
            data={juneData}
            tableTitle="June"
            selectedRows={selectedRows}
            onRowSelect={handleRowSelect}
            onEyeClick={(row) => setSelectedInvoiceData(row.originalData)}
            disabledRows={getDisabledRows(juneData)}
          />
        )}

        {julyData.length > 0 && (
          <SupplierLedgerDetailTable
            columns={columns}
            data={julyData}
            tableTitle="July"
            selectedRows={selectedRows}
            onRowSelect={handleRowSelect}
            onEyeClick={(row) => setSelectedInvoiceData(row.originalData)}
          />
        )}

        {augustData.length > 0 && (
          <SupplierLedgerDetailTable
            columns={columns}
            data={augustData}
            tableTitle="August"
            selectedRows={selectedRows}
            onRowSelect={handleRowSelect}
            onEyeClick={(row) => setSelectedInvoiceData(row.originalData)}
          />
        )}

        {septemberData.length > 0 && (
          <SupplierLedgerDetailTable
            columns={columns}
            data={septemberData}
            tableTitle="September"
            selectedRows={selectedRows}
            onRowSelect={handleRowSelect}
            onEyeClick={(row) => setSelectedInvoiceData(row.originalData)}
          />
        )}

        {octoberData.length > 0 && (
          <SupplierLedgerDetailTable
            columns={columns}
            data={octoberData}
            tableTitle="October"
            selectedRows={selectedRows}
            onRowSelect={handleRowSelect}
            onEyeClick={(row) => setSelectedInvoiceData(row.originalData)}
          />
        )}

        {novemberData.length > 0 && (
          <SupplierLedgerDetailTable
            columns={columns}
            data={novemberData}
            tableTitle="November"
            selectedRows={selectedRows}
            onRowSelect={handleRowSelect}
            onEyeClick={(row) => setSelectedInvoiceData(row.originalData)}
          />
        )}

        {decemberData.length > 0 && (
          <SupplierLedgerDetailTable
            columns={columns}
            data={decemberData}
            tableTitle="December"
            selectedRows={selectedRows}
            onRowSelect={handleRowSelect}
            onEyeClick={(row) => setSelectedInvoiceData(row.originalData)}
          />
        )}

        {/* Show message if no data */}
        {transformedInvoices.length === 0 && (
          <div className="bg-white rounded-xl px-4 py-7 flex items-center justify-center shadow-md">
            <div className="text-lg text-gray-600">
              No invoices found for this supplier.
            </div>
          </div>
        )}

        {/* Payment Modal */}
        {isEditing && (
          <div
            className="fixed inset-0 flex items-center justify-center bg-black/20 z-50"
            onClick={() => {
              setIsEditing(false);
              setSelectedInvoicesForPayment([]);
              setSelectedRows({});
              resetPaymentForm();
            }}
          >
            <div
              className="animate-scaleIn bg-white w-[70vw] h-auto max-h-[90vh] overflow-y-auto rounded-[7px] shadow-lg px-4 py-6"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl font-semibold text-[#056BB7]">Payment</h2>

              {/* Payment Form */}
              <div className="mt-4 space-y-4">
                {renderPaymentInputs()}

                {/* Note Section */}
                <div className="mt-4 mb-2">
                  <p className="Poppins-font font-medium text-sm mb-1">Note</p>
                  <textarea
                    placeholder="Enter additional notes here"
                    rows={2}
                    value={paymentNote}
                    onChange={(e) => setPaymentNote(e.target.value)}
                    className="Poppins-font font-medium w-full px-2 py-2 border border-gray-300 rounded-md text-sm !focus:outline-none outline-none resize-none"
                  />
                </div>

                {/* Selected Invoice Table */}
                <SupplierLedgerDetailTable
                  eye={true}
                  columns={payColumns}
                  data={selectedInvoicesForPayment.map((invoice) => ({
                    invoice: invoice.invoice,
                    invoiceDate: invoice.invoiceDate,
                    status: invoice.status,
                    debit: invoice.debit,
                    credit: invoice.credit,
                    balance: invoice.remainingBalance?.toString() || "0",
                  }))}
                  marginTop="mt-4"
                  selectedRows={selectedRows}
                  onRowSelect={handleRowSelect}
                  onRowClick={(row) => console.log("Row clicked:", row)}
                  showTitle={false}
                />

                {/* Action Buttons */}
                <div className="flex justify-end mt-4 gap-2">
                  <Button
                    text="Cancel"
                    className="bg-gray-200 text-gray-800 border-none px-4"
                    onClick={() => {
                      setIsEditing(false);
                      setSelectedInvoicesForPayment([]);
                      setSelectedRows({});
                      resetPaymentForm();
                    }}
                  />
                  <Button
                    text="Process Payment"
                    className="bg-[#056BB7] text-white border-none px-4"
                    onClick={processPayment}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Invoice Detail Modal */}
        {selectedInvoiceData && (
          <InvoiceDetailModal
            isOpen={true}
            onClose={() => setSelectedInvoiceData(null)}
            invoiceData={selectedInvoiceData}
            columns={[
              {
                header: "Product Name",
                accessor: "productName",
                type: "image",
              },
              { header: "QTY", accessor: "quantity" },
              { header: "Cost Price ($)", accessor: "costPrice" },
              { header: "Total Cost ($)", accessor: "totalPriceOfCostItems" },
            ]}
            data={selectedInvoiceData.items.map((item) => ({
              productName: item.itemBarcode?.barcode || "N/A",
              quantity: item.quantity,
              costPrice: item.costPrice,
              totalPriceOfCostItems: item.totalPriceOfCostItems,
              userImage: item.itemBarcode?.itemImage
                ? `${
                    import.meta.env.VITE_BASE_URL ||
                    "http://192.168.100.18:9000"
                  }${item.itemBarcode.itemImage}`
                : null,
            }))}
          />
        )}

        {/* Payment Mode Modal */}
        {showPaymentModeModal && (
          <div
            className="fixed inset-0 flex items-center justify-center bg-black/20 z-50"
            onClick={() => setShowPaymentModeModal(false)}
          >
            <div
              className="animate-scaleIn bg-white w-[400px] h-auto rounded-[7px] p-6 shadow-lg relative"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl font-semibold text-[#056BB7] mb-4">
                Create Payment Mode
              </h2>

              <div className="flex flex-col gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Payment Mode Name
                  </label>
                  <input
                    type="text"
                    value={paymentModeForm.name}
                    onChange={(e) =>
                      setPaymentModeForm({
                        ...paymentModeForm,
                        name: e.target.value,
                      })
                    }
                    placeholder="Enter payment mode name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Description
                  </label>
                  <textarea
                    value={paymentModeForm.description}
                    onChange={(e) =>
                      setPaymentModeForm({
                        ...paymentModeForm,
                        description: e.target.value,
                      })
                    }
                    placeholder="Enter description"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <Button
                  text="Cancel"
                  className="bg-gray-200 text-gray-800 border-none px-4"
                  onClick={() => setShowPaymentModeModal(false)}
                />
                <Button
                  text="Create"
                  className="bg-[#056BB7] text-white border-none px-4"
                  onClick={createPaymentMode}
                />
              </div>
            </div>
          </div>
        )}

        {/* Bank Modal */}
        {showBankModal && (
          <div
            className="fixed inset-0 flex items-center justify-center bg-black/20 z-50"
            onClick={() => setShowBankModal(false)}
          >
            <div
              className="animate-scaleIn bg-white w-[400px] h-auto rounded-[7px] p-6 shadow-lg relative"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl font-semibold text-[#056BB7] mb-4">
                Create Bank
              </h2>

              <div className="flex flex-col gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Bank Name
                  </label>
                  <input
                    type="text"
                    value={bankForm.name}
                    onChange={(e) =>
                      setBankForm({ ...bankForm, name: e.target.value })
                    }
                    placeholder="Enter bank name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Description
                  </label>
                  <textarea
                    value={bankForm.description}
                    onChange={(e) =>
                      setBankForm({ ...bankForm, description: e.target.value })
                    }
                    placeholder="Enter description"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <Button
                  text="Cancel"
                  className="bg-gray-200 text-gray-800 border-none px-4"
                  onClick={() => setShowBankModal(false)}
                />
                <Button
                  text="Create"
                  className="bg-[#056BB7] text-white border-none px-4"
                  onClick={createBank}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SupplierDetailPage;
