import CustomerDetailTable from "../../../components/CustomerDetailTable";
import React, { useEffect, useState } from "react";
import Input from "../../../components/Input";
import Button from "../../../components/Button";
import Dropdown from "../../../components/Dropdown";
import plusIcon from "../../../assets/plus.svg";
import { useLocation, useNavigate } from "react-router-dom";

interface Column {
  header: string;
  accessor: string;
  type?: "select" | "text" | "image" | "status" | "actions" | "refrence";
}

const CustomerDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [supplierName, setSupplierName] = useState("Supplier");
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [editingRow, setEditingRow] = useState<any>(null);
  const [formData, setFormData] = useState<any>(null);

  // Add state to track selected rows
  const [selectedRows, setSelectedRows] = useState<{ [key: string]: boolean }>(
    {}
  );

  // Extract supplier name from URL or state
  useEffect(() => {
    // Check if supplier name was passed in state
    if (location.state && location.state.supplier) {
      setSupplierName(location.state.supplier);
    } else {
      // Extract from URL path if it's there
      const pathParts = location.pathname.split("/");
      if (pathParts.length > 0) {
        const lastPart = pathParts[pathParts.length - 1];
        // If the last part is not 'supplier-ledger', use it as supplier name
        if (lastPart !== "supplier-ledger" && lastPart) {
          // Replace hyphens with spaces and decode URI component
          setSupplierName(decodeURIComponent(lastPart.replace(/-/g, " ")));
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
    { header: "Select", accessor: "select", type: "select" },
    { header: "Invoice", accessor: "invoice" },
    { header: "Invoice Date", accessor: "invoiceDate" },
    { header: "Status", accessor: "status", type: "status" },
    { header: "Amount", accessor: "amount", type: "text" },
    { header: "Credit ($)", accessor: "credit", type: "text" },
    { header: "Actions", accessor: "actions", type: "actions" },
  ];

  // All data with month information
  const allData = [
    {
      invoice: "#67897",
      invoiceDate: "23/1/2025",
      status: "Unpaid",
      amount: "1500",
      credit: "0",
      refrence: "--",
      month: "January",
    },
    {
      invoice: "#67898",
      invoiceDate: "25/1/2025",
      status: "Unpaid",
      amount: "800",
      credit: "0",
      refrence: "--",
      month: "January",
    },
    {
      invoice: "#67899",
      invoiceDate: "27/1/2025",
      status: "Partially Paid",
      amount: "300",
      credit: "100",
      refrence: 685643,
      month: "January",
    },
    {
      invoice: "#67900",
      invoiceDate: "30/1/2025",
      status: "Paid",
      amount: "200",
      credit: "200",
      refrence: 678934,
      month: "January",
    },
    {
      invoice: "#78965",
      invoiceDate: "15/2/2025",
      status: "Partially Paid",
      amount: "300",
      credit: "100",
      refrence: 785643,
      month: "February",
    },
    {
      invoice: "#45632",
      invoiceDate: "28/2/2025",
      status: "Paid",
      amount: "200",
      credit: "200",
      refrence: 678934,
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
            navigate("/dashboard/customer/view-all-customer", { replace: true })
          }
          className="cursor-pointer"
        >
          View All Customer
        </span>{" "}
        / <span className="text-black">{supplierName}</span>
        {/* </h2> */}
      </h2>

      {/* Search + Filter */}
      <div className="bg-white rounded-xl p-7 flex flex-col gap-4 overflow-hidden shadow-md">
        <div className="grid gap-4 items-center justify-between md:grid-cols-2 mb-2">
          <div className="flex gap-3">
            <Input
              placeholder="Search Invoice"
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
          <div className="flex md:justify-end">
            <Button
              text="Export"
              variant="border"
              className="bg-[#5D6679] text-white w-24"
            />
          </div>
        </div>

        {/* Summary */}
        <div className="bg-[#FCF3EC] py-3 px-4 rounded-md flex justify-end gap-6 text-md font-semibold">
          <div>
            Total Amount: <span className="font-medium">$2,000</span>
          </div>
        </div>

        {/* Single container with both January and February data */}
        {/* January section */}
        <CustomerDetailTable
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
        <CustomerDetailTable
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
    </div>
  );
};

export default CustomerDetailPage;
