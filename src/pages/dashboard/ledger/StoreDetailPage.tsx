// import StoreLedgerDetailTable from "../../../components/StoreLedgerDetailTable";
// import React, { useEffect, useState } from "react";
// import Input from "../../../components/Input";
// import Button from "../../../components/Button";
// import Dropdown from "../../../components/Dropdown";
// import plusIcon from "../../../assets/plus.svg";
// import { useLocation, useNavigate } from "react-router-dom";
// import SupplierLedgerDetailTable from "../../../components/SupplierLedgerDetailTable";

// interface Column {
//   header: string;
//   accessor: string;
//   type?: "select" | "text" | "image" | "status" | "actions" | "refrence";
// }

// const StoreDetailPage: React.FC = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [storeName, setStoreName] = useState("Store");
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [search, setSearch] = useState("");
//   const [statusFilter, setStatusFilter] = useState("All");
//   const [isEditing, setIsEditing] = useState(false);
//   const [editingRow, setEditingRow] = useState<any>(null);
//   const [formData, setFormData] = useState<any>(null);

//   // Add state to track selected rows
//   const [selectedRows, setSelectedRows] = useState<{ [key: string]: boolean }>(
//     {}
//   );

//   // Extract store name from URL or state
//   useEffect(() => {
//     // Check if store name was passed in state
//     if (location.state && location.state.store) {
//       setStoreName(location.state.store);
//     } else {
//       // Extract from URL path if it's there
//       const pathParts = location.pathname.split("/");
//       if (pathParts.length > 0) {
//         const lastPart = pathParts[pathParts.length - 1];
//         // If the last part is not 'store-ledger', use it as store name
//         if (lastPart !== "store-ledger" && lastPart) {
//           // Replace hyphens with spaces and decode URI component
//           setStoreName(decodeURIComponent(lastPart.replace(/-/g, " ")));
//         }
//       }
//     }
//   }, [location]);

//   const handleRowSelect = (rowId: string) => {
//     setSelectedRows((prev) => ({
//       ...prev,
//       [rowId]: !prev[rowId],
//     }));
//   };
//   const columns: Column[] = [
//     { header: "Select", accessor: "select", type: "select" },
//     { header: "Invoice", accessor: "invoice" },
//     { header: "Invoice Date", accessor: "invoiceDate" },
//     { header: "Status", accessor: "status", type: "status" },
//     { header: "Debit ($)", accessor: "debit", type: "text" },
//     { header: "Credit ($)", accessor: "credit", type: "text" },
//     // { header: "Refrence No", accessor: "refrenceNo", type: "text" },
//     { header: "Refrence", accessor: "refrence", type: "refrence" },
//     { header: "Actions", accessor: "actions", type: "actions" },
//   ];

//   // All data with month information
//   const allData = [
//     {
//       invoice: "#67897",
//       invoiceDate: "23/1/2025",
//       status: "Unpaid",
//       debit: "1500",
//       credit: "0",
//       refrence: "--",
//       month: "January",
//     },
//     {
//       invoice: "#67898",
//       invoiceDate: "25/1/2025",
//       status: "Unpaid",
//       debit: "800",
//       credit: "0",
//       refrence: "--",
//       month: "January",
//     },
//     {
//       invoice: "#67899",
//       invoiceDate: "27/1/2025",
//       status: "Partially Paid",
//       debit: "300",
//       credit: "100",
//       refrence: 685643,
//       month: "January",
//     },
//     {
//       invoice: "#67900",
//       invoiceDate: "30/1/2025",
//       status: "Paid",
//       debit: "200",
//       credit: "200",
//       refrence: 678934,
//       month: "January",
//     },
//     {
//       invoice: "#78965",
//       invoiceDate: "15/2/2025",
//       status: "Partially Paid",
//       debit: "300",
//       credit: "100",
//       refrence: 785643,
//       month: "February",
//     },
//     {
//       invoice: "#45632",
//       invoiceDate: "28/2/2025",
//       status: "Paid",
//       debit: "200",
//       credit: "200",
//       refrence: 678934,
//       month: "February",
//     },
//   ];

//   const payColumns: Column[] = [
//     { header: "Invoice", accessor: "invoice" },
//     { header: "Invoice Date", accessor: "invoiceDate" },
//     { header: "Status", accessor: "status", type: "status" },
//     { header: "Debit ($)", accessor: "debit", type: "text" },
//     { header: "Credit ($)", accessor: "credit", type: "text" },
//     { header: "Balance ($)", accessor: "balance", type: "text" },
//     { header: "Actions", accessor: "actions", type: "actions" },
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
//   ];

//   // Filter data based on search and status
//   const filteredData = allData.filter((item) => {
//     const searchableText = `${item.invoice || ""} ${
//       item.refrence || ""
//     }`.toLowerCase();
//     const matchesSearch = searchableText.includes(search.toLowerCase());
//     const matchesStatus =
//       statusFilter === "All" || item.status === statusFilter;
//     return matchesSearch && matchesStatus;
//   });

//   // Group data by month
//   const januaryData = filteredData.filter((item) => item.month === "January");
//   const februaryData = filteredData.filter((item) => item.month === "February");

//   return (
//     <div className="mx-auto px-3 py-6 sm:px-4 md:px-6 xl:px-8 xl:py-6 space-y-6 lg:w-[100%] xl:w-full w-full overflow-x-hidden">
//       {/* Header */}
//       <h2 className="Source-Sans-Pro-font font-semibold text-[#5D6679] text-[20px] mb-2">
//         <span
//           onClick={() =>
//             navigate("/dashboard/ledger/store-ledger", { replace: true })
//           }
//           className="cursor-pointer"
//         >
//           Store Ledger
//         </span>{" "}
//         / <span className="text-black">{storeName}</span>
//         {/* </h2> */}
//       </h2>

//       {/* Search + Filter */}
//       <div className="bg-white rounded-xl p-7 flex flex-col gap-4 overflow-hidden shadow-md">
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
//             Selected Credit: <span className="font-medium">$1,300</span>
//           </div>
//           <div className="flex gap-6">
//             <div>
//               Debit: <span className="font-medium">$3,100</span>
//             </div>
//             <div>
//               Credit: <span className="font-medium">$1,100</span>
//             </div>
//             <div>
//               Balance: <span className="font-medium">$2,000</span>
//             </div>
//           </div>
//         </div>

//         {/* Single container with both January and February data */}
//         {/* January section */}
//         <StoreLedgerDetailTable
//           eye={true}
//           columns={columns}
//           data={januaryData}
//           tableTitle="January:"
//           // enableRowModal={false}
//           selectedRows={selectedRows}
//           onRowSelect={handleRowSelect}
//           onRowClick={(row) => console.log("Row clicked:", row)}
//         />
//         {/* February section */}
//         <StoreLedgerDetailTable
//           eye={true}
//           columns={columns}
//           data={februaryData}
//           tableTitle="February:"
//           enableRowModal={false}
//           selectedRows={selectedRows}
//           onRowSelect={handleRowSelect}
//           onRowClick={(row) => console.log("Row clicked:", row)}
//           marginTop="mt-0"
//         />
//       </div>

//       {isEditing && (
//         <div
//           className="fixed inset-0 flex items-center justify-center bg-black/20 z-50"
//           onClick={() => setIsEditing(false)}
//         >
//           <div
//             className="animate-scaleIn bg-white w-[70vw] min-h-[83vh] max-h-[90vh] overflow-y-auto rounded-[7px] shadow-lg px-4 py-6"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <h2 className="text-xl font-semibold text-[#056BB7]">Payment</h2>
//             <div className="flex flex-col mt-4 text-[15px] Poppins-font font-medium">
//               <div className="flex items-center gap-2">
//                 <label className="mb-1">Payment Mode</label>
//                 <div
//                   className="inline-block cursor-pointer"
//                   onClick={(e) => {
//                     e.preventDefault();
//                     e.stopPropagation();
//                     navigate("/dashboard/core-settings/payment");
//                   }}
//                 >
//                   <img
//                     src={plusIcon}
//                     alt="Add payment mode"
//                     width={16}
//                     height={16}
//                     className=""
//                   />
//                 </div>
//               </div>
//               <Dropdown
//                 options={["Cash", "Bank", "Paypal"]}
//                 defaultValue="eg: Cash"
//               />
//             </div>
//             <div className="flex flex-col mt-2 text-[15px] Poppins-font font-medium">
//               <label htmlFor="" className="mb-1">
//                 Refrence Number
//               </label>
//               <Input
//                 placeholder="21321412"
//                 className="w-full outline-none"
//                 type="number"
//               />
//             </div>

//             <div className="flex flex-col mt-2 text-[15px] Poppins-font font-medium">
//               <div className="flex items-center gap-2">
//                 <label className="mb-1">Bank</label>
//                 <div
//                   className="inline-block cursor-pointer"
//                   onClick={(e) => {
//                     e.preventDefault();
//                     e.stopPropagation();
//                     navigate("/dashboard/core-settings/payment");
//                   }}
//                 >
//                   <img
//                     src={plusIcon}
//                     alt="Add payment mode"
//                     width={16}
//                     height={16}
//                     className=""
//                   />
//                 </div>
//               </div>
//               <Dropdown
//                 options={["Cash", "Bank", "Paypal"]}
//                 defaultValue="eg: abc Bank"
//               />
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

//             <div className="flex justify-end mt-4">
//               <Button
//                 text="Back"
//                 className="mr-2 bg-gray-200 text-gray-800 border-none px-4"
//                 onClick={() => setIsEditing(false)}
//               />
//               <Button
//                 text="Mark Paid"
//                 className="bg-[#056BB7] text-white border-none px-4"
//                 onClick={() => {
//                   console.log("Payment submitted");
//                   setIsEditing(false);
//                 }}
//               />
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default StoreDetailPage;

import StoreLedgerDetailTable from "../../../components/StoreLedgerDetailTable";
import React, { useEffect, useState } from "react";
import Input from "../../../components/Input";
import Button from "../../../components/Button";
import Dropdown from "../../../components/Dropdown";
import plusIcon from "../../../assets/plus.svg";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import SupplierLedgerDetailTable from "../../../components/SupplierLedgerDetailTable";

// Add API base URL
const API_URL = import.meta.env.VITE_BASE_URL || "http://192.168.100.18:9000";

interface Column {
  header: string;
  accessor: string;
  type?: "select" | "text" | "image" | "status" | "actions" | "refrence";
}

interface InvoiceData {
  _id: string;
  siId: string;
  referenceNumber: string;
  status: string;
  dateIssued: string;
  totals: {
    debit: number;
    credit: number;
  };
  items: Array<{
    item: {
      _id: string;
      barcode: string;
      category: {
        name: string;
      };
      itemImage?: string;
    };
    quantity: number;
    costPrice: number;
    sellPrice: number;
    totalCost: number;
    totalSell: number;
  }>;
  store: {
    storeName: string;
    _id: string;
  };
}

const StoreDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { storeId } = useParams<{ storeId: string }>(); // Get storeId from URL params
  console.log("storeId", storeId);

  const [storeName, setStoreName] = useState("Store");
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [isEditing, setIsEditing] = useState(false);
  const [editingRow, setEditingRow] = useState<any>(null);
  const [formData, setFormData] = useState<any>(null);

  // API related states
  const [invoiceData, setInvoiceData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  // API call to fetch invoice data by store
  const fetchInvoiceByStore = async (storeId: string) => {
    try {
      setLoading(true);
      const token = getAuthToken();

      if (!token) {
        setError("No authentication token found");
        return;
      }

      const response = await fetch(
        `${API_URL}/api/abid-jewelry-ms/getInvoiceByStore/${storeId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "x-access-token": token,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const apiResponse = await response.json();
      console.log("API Response:", apiResponse);

      if (apiResponse.success && apiResponse.data) {
        // Transform API data to match your table structure
        const transformedData = apiResponse.data.map((invoice: InvoiceData) => {
          // Format date
          const invoiceDate = new Date(invoice.dateIssued).toLocaleDateString(
            "en-GB"
          );

          // Determine status display
          let statusDisplay = invoice.status;
          if (invoice.status === "pending") {
            statusDisplay = "Unpaid";
          } else if (invoice.status === "completed") {
            statusDisplay = "Paid";
          } else if (invoice.status === "partial") {
            statusDisplay = "Partially Paid";
          }

          return {
            invoice: invoice.siId || invoice.referenceNumber || invoice._id,
            invoiceDate: invoiceDate,
            status: statusDisplay,
            debit: invoice.totals?.debit?.toString() || "0",
            credit: invoice.totals?.credit?.toString() || "0",
            refrence: invoice.referenceNumber || "--",
            month: new Date(invoice.dateIssued).toLocaleString("default", {
              month: "long",
            }),
            // Store original data for reference
            originalData: invoice,
          };
        });

        setInvoiceData(transformedData);
        console.log("setInvoiceData", invoiceData);

        // Set store name from the first invoice if available
        if (apiResponse.data.length > 0 && apiResponse.data[0].store) {
          setStoreName(apiResponse.data[0].store.storeName);
        }

        setError(null);
      } else {
        throw new Error("Invalid API response structure");
      }
    } catch (error) {
      console.error("Error fetching invoice by store:", error);
      setError("Failed to fetch invoice data");

      // Fallback to static data in case of error
      setInvoiceData([
        {
          invoice: "#67897",
          invoiceDate: "23/1/2025",
          status: "Unpaid",
          debit: "1500",
          credit: "0",
          refrence: "--",
          month: "January",
        },
        {
          invoice: "#67898",
          invoiceDate: "25/1/2025",
          status: "Unpaid",
          debit: "800",
          credit: "0",
          refrence: "--",
          month: "January",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data when component mounts or storeId changes
  useEffect(() => {
    if (storeId) {
      fetchInvoiceByStore(storeId);
    } else {
      setError("No store ID provided");
      setLoading(false);
    }
  }, [storeId]);

  // Extract store name from URL or state (keeping existing logic as fallback)
  useEffect(() => {
    if (location.state && location.state.store) {
      setStoreName(location.state.store);
    } else {
      const pathParts = location.pathname.split("/");
      if (pathParts.length > 0) {
        const lastPart = pathParts[pathParts.length - 1];
        if (lastPart !== "store-ledger" && lastPart) {
          setStoreName(decodeURIComponent(lastPart.replace(/-/g, " ")));
        }
      }
    }
  }, [location]);

  const handleRowSelect = (rowId: string) => {
    setSelectedRows((prev) => ({
      ...prev,
      [rowId]: !prev[rowId],
    }));
  };

  const columns: Column[] = [
    // { header: "Select", accessor: "select", type: "select" },
    { header: "Invoice", accessor: "invoice" },
    { header: "Invoice Date", accessor: "invoiceDate" },
    { header: "Status", accessor: "status", type: "status" },
    { header: "Debit ($)", accessor: "debit", type: "text" },
    { header: "Credit ($)", accessor: "credit", type: "text" },
    { header: "Refrence", accessor: "refrence", type: "refrence" },
    { header: "Actions", accessor: "actions", type: "actions" },
  ];

  const payColumns: Column[] = [
    { header: "Invoice", accessor: "invoice" },
    { header: "Invoice Date", accessor: "invoiceDate" },
    { header: "Status", accessor: "status", type: "status" },
    { header: "Debit ($)", accessor: "debit", type: "text" },
    { header: "Credit ($)", accessor: "credit", type: "text" },
    { header: "Balance ($)", accessor: "balance", type: "text" },
    { header: "Actions", accessor: "actions", type: "actions" },
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
  ];

  // Filter data based on search and status
  const filteredData = invoiceData.filter((item) => {
    const searchableText = `${item.invoice || ""} ${
      item.refrence || ""
    }`.toLowerCase();
    const matchesSearch = searchableText.includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === "All" || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Group data by month
  const groupedData = filteredData.reduce((acc, item) => {
    const month = item.month || "Unknown";
    if (!acc[month]) {
      acc[month] = [];
    }
    acc[month].push(item);
    return acc;
  }, {} as { [key: string]: any[] });

  // Calculate totals
  const calculateTotals = () => {
    const totalDebit = filteredData.reduce(
      (sum, item) => sum + parseFloat(item.debit || "0"),
      0
    );
    const totalCredit = filteredData.reduce(
      (sum, item) => sum + parseFloat(item.credit || "0"),
      0
    );
    const balance = totalDebit - totalCredit;

    const selectedCredit = Object.keys(selectedRows)
      .filter((key) => selectedRows[key])
      .reduce((sum, invoiceId) => {
        const item = filteredData.find((item) => item.invoice === invoiceId);
        return sum + parseFloat(item?.credit || "0");
      }, 0);

    return {
      debit: totalDebit.toFixed(0),
      credit: totalCredit.toFixed(0),
      balance: balance.toFixed(0),
      selectedCredit: selectedCredit.toFixed(0),
    };
  };

  const totals = calculateTotals();

  if (loading) {
    return (
      <div className="mx-auto px-3 py-6 sm:px-4 md:px-6 xl:px-8 xl:py-6 space-y-6 lg:w-[100%] xl:w-full w-full overflow-x-hidden">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto px-3 py-6 sm:px-4 md:px-6 xl:px-8 xl:py-6 space-y-6 lg:w-[100%] xl:w-full w-full overflow-x-hidden">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-red-500">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto px-3 py-6 sm:px-4 md:px-6 xl:px-8 xl:py-6 space-y-6 lg:w-[100%] xl:w-full w-full overflow-x-hidden">
      {/* Header */}
      <h2 className="Source-Sans-Pro-font font-semibold text-[#5D6679] text-[20px] mb-2">
        <span
          onClick={() =>
            navigate("/dashboard/ledger/store-ledger", { replace: true })
          }
          className="cursor-pointer"
        >
          Store Ledger
        </span>{" "}
        / <span className="text-black">{storeName}</span>
      </h2>

      {/* Search + Filter */}
      <div className="bg-white rounded-xl p-7 flex flex-col gap-4 overflow-hidden shadow-md">
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
            {/* <Button
              text="Pay"
              className="bg-[#056BB7] text-white border-none font-medium w-auto px-7"
              onClick={(e) => {
                if (e) e.stopPropagation();
                setIsEditing(true);
              }}
            /> */}
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
            <span className="font-medium">${totals.selectedCredit}</span>
          </div>
          <div className="flex gap-6">
            <div>
              Debit: <span className="font-medium">${totals.debit}</span>
            </div>
            <div>
              Credit: <span className="font-medium">${totals.credit}</span>
            </div>
            <div>
              Balance: <span className="font-medium">${totals.balance}</span>
            </div>
          </div>
        </div>

        {/* Render tables for each month */}
        {Object.keys(groupedData).map((month) => (
          <StoreLedgerDetailTable
            key={month}
            eye={true}
            columns={columns}
            data={groupedData[month]}
            tableTitle={`${month}:`}
            // selectedRows={selectedRows}
            // onRowSelect={handleRowSelect}
            onRowClick={(row) => console.log("Row clicked:", row)}
            marginTop={month === Object.keys(groupedData)[0] ? "" : "mt-0"}
          />
        ))}

        {/* Show message if no data */}
        {Object.keys(groupedData).length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No invoice data found for this store.
          </div>
        )}
      </div>

      {/* Payment Modal */}
      {isEditing && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black/20 z-50"
          onClick={() => setIsEditing(false)}
        >
          <div
            className="animate-scaleIn bg-white overflow-hidden w-[60vw] h-auto overflow-y-auto rounded-[7px] shadow-lg px-4 py-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-xl font-semibold text-[#056BB7]">Payment</h2>
              <div className="flex gap-2">
                <Button
                  text="Print"
                  className="bg-[#056BB7] text-white font-medium h-8 px-6 border-none"
                />
                <button
                  onClick={() => setIsEditing(false)}
                  className="text-xl font-bold text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="flex items-center w-full mb-7 mt-4">
              <div className="w-1/2">
                <div className="flex text-[15px] Poppins-font font-medium">
                  <label htmlFor="" className="mb-1">
                    Reference Number: <span className="font-light">387193</span>
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
              // selectedRows={selectedRows}
              // onRowSelect={handleRowSelect}
              onRowClick={(row) => console.log("Row clicked:", row)}
            />
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black/20 z-50"
          onClick={() => {
            setShowDeleteModal(false);
            setSelectedUser(null);
          }}
        >
          <div
            className="animate-scaleIn bg-white rounded-xl w-full max-w-md relative shadow-lg border-3 border-gray-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center py-4 px-6 shadow-[0_2px_2px_0_#00000026]">
              <h2 className="text-xl font-medium">Delete Invoice</h2>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="text-xl font-bold text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
            <div className="mt-8 text-start pb-8 px-6 shadow-[0_2px_2px_0_#00000026]">
              <h3 className="text-lg font-semibold mb-1">Delete Invoice?</h3>
              <p className="text-sm text-gray-700">
                Are you sure you want to delete this invoice?
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
                onClick={() => {
                  setShowDeleteModal(false);
                  // Add delete logic here
                  console.log("Delete confirmed");
                }}
                className="!border-none px-5 py-1 bg-[#DC2626] hover:bg-red-700 text-white rounded-md flex items-center gap-1"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StoreDetailPage;
