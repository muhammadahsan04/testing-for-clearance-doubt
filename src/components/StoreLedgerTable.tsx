import React, { useEffect, useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { GoChevronLeft, GoChevronRight } from "react-icons/go";
import { LuEye } from "react-icons/lu";
import Input from "./Input";
import Dropdown from "./Dropdown";
import Button from "./Button";
import { useNavigate } from "react-router-dom";
import { DatePicker } from "antd";
import InvoiceDetailModal from "../../src/pages/dashboard/Inventory/InvoiceDetailModal";
type ColumnType = "text" | "image" | "status" | "actions" | "button" | "custom";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";

// Enable the isBetween plugin
dayjs.extend(isBetween);

interface Column {
  header: string;
  accessor: string;
  type?: ColumnType;
}

interface PurchaseInvoiceDetail {
  itemdescription: string;
  qty: number;
  rate: number;
  amount: number;
}

interface StoreLedgerTableProps {
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
}

const StoreLedgerTable: React.FC<StoreLedgerTableProps> = ({
  // isOpen,
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
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [invoiceDetail, setInvoiceDetail] = useState<any>(null); // for modal
  const [deleteUser, setDeleteUser] = useState<any>(null); // for modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [search, setSearch] = useState(""); // ✅ Local search state
  const [statusFilter, setStatusFilter] = useState("All"); // ✅ Status filter state
  // To these two state variables edit user
  const [isEditing, setIsEditing] = useState(false);
  const [editingRow, setEditingRow] = useState<any>(null);
  const [formData, setFormData] = useState<any>(null);
  // const [dateRange, setDateRange] = useState("");
  const [supplier, setSupplier] = useState("");
  const [isOpen, setIsOpen] = React.useState(false);
  const [dateRange, setDateRange] = useState<
    [dayjs.Dayjs | null, dayjs.Dayjs | null] | null
  >(null);

  const navigate = useNavigate();
  // const filteredData = data.filter((item) => {
  //   // Create a version of the item without the status field for searching
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

    // Date filtering
    let matchesDate = true;
    if (dateRange && dateRange[0] && dateRange[1]) {
      const itemDate = dayjs(item.date, "M/D/YYYY");
      const startDate = dateRange[0].startOf("day");
      const endDate = dateRange[1].endOf("day");
      matchesDate = itemDate.isBetween(startDate, endDate, null, "[]");
    }

    return matchesSearch && matchesStatus && matchesDate;
  });

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const currentData = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );
  console.log("current data", currentData);

  const handleChangePage = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };
  // console.log("DATA", data);
  // data?.date?.forEach((dateItem: any, index: number) => {
  //   console.log(`Date ${index + 1}:`, dateItem);
  // });
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

  const PurchaseInvoiceData: PurchaseInvoiceDetail[] = [
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
    // Aur bhi rows add kar sakte ho agar chaho
  ];

  const PurchaseInvoiceDetail = [
    { header: "ITEM DESCRIPTION", accessor: "itemdescription" },
    { header: "QTY", accessor: "qty" },
    { header: "RATE ($)", accessor: "rate" },
    { header: "AMOUNT ($)", accessor: "amount" },
  ];
  // console.log("PurchaseInvoiceData", PurchaseInvoiceData);
  return (
    <>
      <div
        className={`bg-white rounded-xl px-4 py-7 flex flex-col gap-4 overflow-hidden shadow-md ${className}`}
      >
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-[#056BB7]">Store Ledger</h2>
          <Button
            text="Export"
            variant="border"
            className="bg-[#5D6679] text-white w-24"
          />
        </div>
        {/* Filters */}
        <div className="flex justify-between gap-4 items-center">
          {/* <RangePicker className="h-10 !text-gray-400 !border-gray-300" /> */}

          <RangePicker
            className="h-10 !text-gray-400 !border-gray-300"
            value={dateRange}
            onChange={(dates) => {
              setDateRange(dates);
              setCurrentPage(1);
            }}
            format="M/D/YYYY"
          />

          <div className="flex justify-start xl:justify-end md:col-span-4 gap-4 lg:col-span-1 w-full">
            <Input
              placeholder="Search by store name"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-sm !rounded-3xl"
            />
            <Dropdown
              className="w-full md:auto"
              options={["All", "Active", "Inactive"]}
              DropDownName="Status"
              defaultValue="All"
              onSelect={(val) => {
                setStatusFilter(val);
                setCurrentPage(1);
              }}
            />
          </div>
        </div>

        {/* Summary */}

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
                          className={`flex flex-row items-center ${
                            isFirst
                              ? "justify-center"
                              : isLast
                              ? "justify-center"
                              : "justify-center"
                          }`}
                        >
                          {/* {col.accessor === "actions" ? (
                            <LuEye
                              className="cursor-pointer"
                              onClick={(e) => {
                                e.stopPropagation();
                                console.log("gfgdgfd");

                                navigate(`${row?.storeId}`);
                              }}
                            />
                          ) : (
                            // @ts-ignore
                            row[col.accessor]
                          )} */}

                          {col.accessor === "actions" ? (
                            <LuEye
                              className="cursor-pointer"
                              onClick={(e) => {
                                e.stopPropagation();
                                // Use onRowClick if available, otherwise fallback to storeId
                                if (onRowClick) {
                                  onRowClick(row);
                                } else {
                                  navigate(`${row?.storeId}`);
                                }
                              }}
                            />
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
            className={`flex flex-col ${
              dealBy ? "md:flex-col gap-3" : "md:flex-row"
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

              {/* Always show page 1 */}
              <button
                onClick={() => handleChangePage(1)}
                className={`w-8 h-8 rounded-full text-sm flex items-center justify-center transition ${
                  currentPage === 1
                    ? "bg-[#407BFF] text-white"
                    : "bg-[#E5E7EB] text-black hover:bg-[#407BFF] hover:text-white"
                }`}
              >
                1
              </button>

              {/* Show dots if current page is far from start */}
              {currentPage > 3 && (
                <div>
                  <span className="text-gray-500 px-0.5">•</span>
                  <span className="text-gray-500 px-0.5">•</span>
                  <span className="text-gray-500 px-0.5">•</span>
                </div>
              )}

              {/* Show current page and surrounding pages (but not 1 or last page) */}
              {[currentPage - 1, currentPage, currentPage + 1]
                .filter((page) => page > 1 && page < totalPages && page >= 1)
                .map((num) => (
                  <button
                    key={num}
                    onClick={() => handleChangePage(num)}
                    className={`w-8 h-8 rounded-full text-sm flex items-center justify-center transition ${
                      currentPage === num
                        ? "bg-[#407BFF] text-white"
                        : "bg-[#E5E7EB] text-black hover:bg-[#407BFF] hover:text-white"
                    }`}
                  >
                    {num}
                  </button>
                ))}

              {/* Show dots if current page is far from end */}
              {currentPage < totalPages - 2 && totalPages > 1 && (
                <div>
                  <span className="text-gray-500 px-0.5">•</span>
                  <span className="text-gray-500 px-0.5">•</span>
                  <span className="text-gray-500 px-0.5">•</span>
                </div>
              )}

              {/* Always show last page (if more than 1 page) */}
              {totalPages > 1 && (
                <button
                  onClick={() => handleChangePage(totalPages)}
                  className={`w-8 h-8 rounded-full text-sm flex items-center justify-center transition ${
                    currentPage === totalPages
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

      {/* Modal */}
      {invoiceDetail && (
        <InvoiceDetailModal
          isOpen={true} // Change this from isOpen to true
          onClose={() => {
            setInvoiceDetail(null); // Clear the invoice detail
            setIsOpen(false); // Close the modal
          }}
          columns={PurchaseInvoiceDetail}
          data={PurchaseInvoiceData}

          //  data={PurchaseInvoiceDetail?.map((item) => ({
          //     productName: item.itemBarcode?.barcode || "N/A",
          //     quantity: item.quantity,
          //     costPrice: item.costPrice,
          //     totalPriceOfCostItems: item.totalPriceOfCostItems,
          //     userImage: item.itemBarcode?.itemImage
          //       ? `${
          //           import.meta.env.VITE_BASE_URL ||
          //           "http://192.168.100.18:9000"
          //         }${item.itemBarcode.itemImage}`
          //       : null,
          //   }))}
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
              <h2 className="text-xl font-medium">Delete {deleteUser.role}</h2>
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
          // className="fixed inset-0 z-50 flex items-center justify-center bg-transparent backdrop-blur-xs bg-opacity-40 transition-opacity duration-300"
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
              <h2 className="text-xl font-medium">Delete {deleteUser.role}</h2>
              <button
                onClick={() => setDeleteModal(false)}
                className="text-xl font-bold text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
            {/* Body */}
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
                has been remove
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

export default StoreLedgerTable;
