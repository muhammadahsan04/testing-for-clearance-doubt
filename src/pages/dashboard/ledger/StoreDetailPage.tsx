import StoreLedgerDetailTable from "../../../components/StoreLedgerDetailTable";
import React, { useEffect, useState } from "react";
import Input from "../../../components/Input";
import Button from "../../../components/Button";
import Dropdown from "../../../components/Dropdown";
import plusIcon from "../../../assets/plus.svg";
import { useLocation, useNavigate } from "react-router-dom";
import SupplierLedgerDetailTable from "../../../components/SupplierLedgerDetailTable";

interface Column {
  header: string;
  accessor: string;
  type?: "select" | "text" | "image" | "status" | "actions" | "refrence";
}

const StoreDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [storeName, setStoreName] = useState("Store");
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [isEditing, setIsEditing] = useState(false);
  const [editingRow, setEditingRow] = useState<any>(null);
  const [formData, setFormData] = useState<any>(null);

  // Add state to track selected rows
  const [selectedRows, setSelectedRows] = useState<{ [key: string]: boolean }>(
    {}
  );

  // Extract store name from URL or state
  useEffect(() => {
    // Check if store name was passed in state
    if (location.state && location.state.store) {
      setStoreName(location.state.store);
    } else {
      // Extract from URL path if it's there
      const pathParts = location.pathname.split("/");
      if (pathParts.length > 0) {
        const lastPart = pathParts[pathParts.length - 1];
        // If the last part is not 'store-ledger', use it as store name
        if (lastPart !== "store-ledger" && lastPart) {
          // Replace hyphens with spaces and decode URI component
          setStoreName(decodeURIComponent(lastPart.replace(/-/g, " ")));
        }
      }
    }
  }, [location]);

  // Function to handle checkbox changes
  //   const handleRowSelect = (rowId: string) => {
  //     setSelectedRows((prev) => {
  //       const newSelectedRows = { ...prev };
  //       newSelectedRows[rowId] = !newSelectedRows[rowId];

  //       // Log the selected row data
  //       const selectedRow = allData.find((row) => row.invoice === rowId);
  //       console.log("Selected/Deselected Row:", selectedRow);

  //       // Log all currently selected rows after update
  //       const allSelectedRowIds = Object.keys(newSelectedRows).filter(
  //         (id) => newSelectedRows[id]
  //       );
  //       const allSelectedRowData = allData.filter((row) =>
  //         allSelectedRowIds.includes(row.invoice)
  //       );
  //       console.log("All Selected Rows:", allSelectedRowData);

  //       return newSelectedRows;
  //     });
  //   };
  // Add state to track selected rows

  const handleRowSelect = (rowId: string) => {
    setSelectedRows((prev) => ({
      ...prev,
      [rowId]: !prev[rowId],
    }));
  };
  const columns: Column[] = [
    { header: "Select", accessor: "select", type: "select" },
    { header: "Invoice", accessor: "invoice" },
    { header: "Invoice Date", accessor: "invoiceDate" },
    { header: "Status", accessor: "status", type: "status" },
    { header: "Debit ($)", accessor: "debit", type: "text" },
    { header: "Credit ($)", accessor: "credit", type: "text" },
    // { header: "Refrence No", accessor: "refrenceNo", type: "text" },
    { header: "Refrence", accessor: "refrence", type: "refrence" },
    { header: "Actions", accessor: "actions", type: "actions" },
  ];

  // All data with month information
  const allData = [
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
    {
      invoice: "#67899",
      invoiceDate: "27/1/2025",
      status: "Partially Paid",
      debit: "300",
      credit: "100",
      refrence: 685643,
      month: "January",
    },
    {
      invoice: "#67900",
      invoiceDate: "30/1/2025",
      status: "Paid",
      debit: "200",
      credit: "200",
      refrence: 678934,
      month: "January",
    },
    {
      invoice: "#78965",
      invoiceDate: "15/2/2025",
      status: "Partially Paid",
      debit: "300",
      credit: "100",
      refrence: 785643,
      month: "February",
    },
    {
      invoice: "#45632",
      invoiceDate: "28/2/2025",
      status: "Paid",
      debit: "200",
      credit: "200",
      refrence: 678934,
      month: "February",
    },
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

  // All data with month information
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
  const filteredData = allData.filter((item) => {
    const searchableText = `${item.invoice || ""} ${
      item.refrence || ""
    }`.toLowerCase();
    const matchesSearch = searchableText.includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === "All" || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Group data by month
  const januaryData = filteredData.filter((item) => item.month === "January");
  const februaryData = filteredData.filter((item) => item.month === "February");

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
        {/* </h2> */}
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
            <Button
              text="Pay"
              className="bg-[#056BB7] text-white border-none font-medium w-auto px-7"
              onClick={(e) => {
                if (e) e.stopPropagation();
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
            Selected Credit: <span className="font-medium">$1,300</span>
          </div>
          <div className="flex gap-6">
            <div>
              Debit: <span className="font-medium">$3,100</span>
            </div>
            <div>
              Credit: <span className="font-medium">$1,100</span>
            </div>
            <div>
              Balance: <span className="font-medium">$2,000</span>
            </div>
          </div>
        </div>

        {/* Single container with both January and February data */}
        {/* January section */}
        <StoreLedgerDetailTable
          eye={true}
          columns={columns}
          data={januaryData}
          tableTitle="January:"
          // enableRowModal={false}
          selectedRows={selectedRows}
          onRowSelect={handleRowSelect}
          onRowClick={(row) => console.log("Row clicked:", row)}
        />
        {/* February section */}
        <StoreLedgerDetailTable
          eye={true}
          columns={columns}
          data={februaryData}
          tableTitle="February:"
          enableRowModal={false}
          selectedRows={selectedRows}
          onRowSelect={handleRowSelect}
          onRowClick={(row) => console.log("Row clicked:", row)}
          marginTop="mt-0"
        />
      </div>

      {isEditing && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black/20 z-50"
          onClick={() => setIsEditing(false)}
        >
          <div
            className="animate-scaleIn bg-white w-[70vw] min-h-[83vh] max-h-[90vh] overflow-y-auto rounded-[7px] shadow-lg px-4 py-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-semibold text-[#056BB7]">Payment</h2>
            <div className="flex flex-col mt-4 text-[15px] Poppins-font font-medium">
              <div className="flex items-center gap-2">
                <label className="mb-1">Payment Mode</label>
                <div
                  className="inline-block cursor-pointer"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    navigate("/dashboard/core-settings/payment");
                  }}
                >
                  <img
                    src={plusIcon}
                    alt="Add payment mode"
                    width={16}
                    height={16}
                    className=""
                  />
                </div>
              </div>
              <Dropdown
                options={["Cash", "Bank", "Paypal"]}
                defaultValue="eg: Cash"
              />
            </div>
            <div className="flex flex-col mt-2 text-[15px] Poppins-font font-medium">
              <label htmlFor="" className="mb-1">
                Refrence Number
              </label>
              <Input
                placeholder="21321412"
                className="w-full outline-none"
                type="number"
              />
            </div>

            <div className="flex flex-col mt-2 text-[15px] Poppins-font font-medium">
              <div className="flex items-center gap-2">
                <label className="mb-1">Bank</label>
                <div
                  className="inline-block cursor-pointer"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    navigate("/dashboard/core-settings/payment");
                  }}
                >
                  <img
                    src={plusIcon}
                    alt="Add payment mode"
                    width={16}
                    height={16}
                    className=""
                  />
                </div>
              </div>
              <Dropdown
                options={["Cash", "Bank", "Paypal"]}
                defaultValue="eg: abc Bank"
              />
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

            <div className="flex justify-end mt-4">
              <Button
                text="Back"
                className="mr-2 bg-gray-200 text-gray-800 border-none px-4"
                onClick={() => setIsEditing(false)}
              />
              <Button
                text="Mark Paid"
                className="bg-[#056BB7] text-white border-none px-4"
                onClick={() => {
                  console.log("Payment submitted");
                  setIsEditing(false);
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StoreDetailPage;
