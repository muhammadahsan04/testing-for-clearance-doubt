import React, { useEffect, useMemo, useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { RiEditLine } from "react-icons/ri";
import { GoChevronLeft, GoChevronRight } from "react-icons/go";
import { LuEye } from "react-icons/lu";

import Input from "./Input";
import Dropdown from "./Dropdown";
import Button from "./Button";
import { useNavigate } from "react-router-dom";
import dayjs, { Dayjs } from "dayjs";
import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateRange } from "@mui/x-date-pickers-pro/models";
import { DateRangePicker } from "@mui/x-date-pickers-pro/DateRangePicker";
import { DatePicker } from "antd";
import InvoiceDetailModal from "../../src/pages/dashboard/Inventory/InvoiceDetailModal";
import { purchaseInvoiceApi } from "../../src/pages/dashboard/Inventory/PurchaseInvoiceApi";
import { toast } from "react-toastify";
import axios from "axios";

type ColumnType = "text" | "image" | "status" | "actions" | "button" | "custom";

const getAuthToken = () => {
  let token = localStorage.getItem("token");
  if (!token) {
    token = sessionStorage.getItem("token");
  }
  return token;
};

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

interface SummaryData {
  debit: number;
  credit: number;
  balance: number;
}

interface PurchaseInvoiceTableProps {
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
  onRefresh?: () => void;
  canUpdate?: boolean;
  canDelete?: boolean;
  canCreate?: boolean;
}

const PurchaseInvoiceTable: React.FC<PurchaseInvoiceTableProps> = ({
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
  onRefresh,
  canUpdate = true,
  canDelete = true,
  canCreate = true,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [invoiceDetail, setInvoiceDetail] = useState<any>(null);
  const [deleteUser, setDeleteUser] = useState<any>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isEditing, setIsEditing] = useState(false);
  const [editingRow, setEditingRow] = useState<any>(null);
  const [formData, setFormData] = useState<any>(null);
  // const [dateRange, setDateRange] = useState("");
  const [supplier, setSupplier] = useState("");
  const [isOpen, setIsOpen] = React.useState(false);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [supplierFilter, setSupplierFilter] = useState("all");
  const [dateRange, setDateRange] = useState<
    [Dayjs | null, Dayjs | null] | null
  >(null);
  const API_URL = import.meta.env.VITE_BASE_URL || "http://localhost:9000";
  const navigate = useNavigate();

  const filteredData = useMemo(() => {
    if (!data || data.length === 0) return data; // Return original data if empty

    return data.filter((item) => {
      const matchesSearch =
        searchTerm === "" ||
        Object.values(item).some((value) =>
          value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
        );

      const matchesStatus =
        statusFilter === "all" || item.status === statusFilter;
      const matchesSupplier =
        supplierFilter === "all" || item.supplier === supplierFilter;

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

      return (
        matchesSearch && matchesStatus && matchesSupplier && matchesDateRange
      );
    });
  }, [data, searchTerm, statusFilter, supplierFilter, dateRange]);

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

  const handleViewDetails = async (row: any) => {
    try {
      setIsOpen(true); // Open modal immediately
      setLoading(true); // Show loader in modal
      setInvoiceDetail(null); // Clear previous data
      // alert("fsdf");

      const response = await purchaseInvoiceApi.getPurchaseInvoiceById(row._id);

      if (response.success) {
        // Transform items data for the modal
        console.log("dasdasd", response.data);

        // const transformedItems = response.data.items.map((item: any) => ({
        //   itemdescription:
        //     item.itemBarcode?.category?.name ||
        //     item.purchaseOrderId?.category?.name ||
        //     "N/A",
        //   qty: item?.quantity,
        //   costPrice: item?.costPrice,
        //   sellPrice: item?.sellPrice,
        //   amount: item?.totalPriceOfCostItems,
        //   userImage: item?.itemBarcode?.itemImage
        //     ? `${
        //         import.meta.env.VITE_BASE_URL || "http://192.168.100.18:9000"
        //       }${item?.itemBarcode?.itemImage}`
        //     : null,
        // }));

        const transformedItems = response.data.items.map((item: any) => ({
          itemdescription:
            item.itemBarcode?.category?.name ||
            item.purchaseOrderId?.category?.name ||
            "N/A",
          qty: item?.quantity,
          costPrice: item?.costPrice,
          sellPrice: item?.sellPrice,
          amount: item?.totalPriceOfCostItems,
          userImage: item?.itemBarcode?.itemImage
            ? `${import.meta.env.VITE_BASE_URL || "http://192.168.100.18:9000"
            }${item?.itemBarcode?.itemImage}`
            : null,
          productName:
            item?.itemBarcode?.category?.name ||
            item?.purchaseOrderId?.category?.name ||
            "N/A",
        }));

        setInvoiceDetail({
          ...response.data,
          transformedItems,
        });
        setIsOpen(true);
      }
    } catch (error) {
      console.error("Error fetching invoice details:", error);
      setIsOpen(false); // Close modal on error
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (deleteUser && onDelete) {
      try {
        setLoading(true);
        await onDelete(deleteUser);
        setShowDeleteModal(false);
        setDeleteUser(null);
        if (onRefresh) {
          onRefresh();
        }
      } catch (error) {
        console.error("Error deleting invoice:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const PurchaseInvoiceDetail = [
    { header: "ITEM DESCRIPTION", accessor: "itemdescription", type: "image" },
    { header: "QTY", accessor: "qty" },
    { header: "COST PRICE ($)", accessor: "costPrice" },
    { header: "SELL PRICE ($)", accessor: "sellPrice" },
    { header: "AMOUNT ($)", accessor: "amount" },
  ];
  const handleEdit = (row: any) => {
    if (!canUpdate) {
      toast.error("You don't have permission to edit purchase invoice");
      return;
    }
    navigate(
      `/dashboard/inventory/purchase-invoice/update-purchase-invoice/${row._id}`
    );
  };

  return (
    <>
      <div
        className={`bg-white rounded-xl p-4 flex flex-col gap-4 overflow-hidden shadow-md ${className}`}
      >
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-[#056BB7]">
            Purchase Invoice
          </h2>


          <Button
            text="Create Purchase Invoice"
            className={`px-6 !bg-[#28A745] border-none text-white ${!canCreate ? "opacity-70 !cursor-not-allowed" : ""
              }`}
            // type="submit"
            disabled={!canCreate}
            onClick={() =>
              navigate("create-purchase-invoice")}
          />

          {/* <Button
            onClick={() => {
              if (!canCreate) {
                toast.error("You don't have permission to create Purchase Invoice");
                return
              }
              navigate("create-purchase-invoice")
            }}
            text="Create Purchase Invoice"
            className="bg-[#28A745] text-white font-medium h-10 px-4 border-none"
          /> */}
        </div>

        {/* Filters */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 items-center justify-between">
          <Input
            placeholder="Search by  Suppplier Name, Invoice"
            value={searchTerm} // Change from 'search' to 'searchTerm'
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full !rounded-3xl"
          />
          <RangePicker
            className="h-10 !text-gray-400 !border-gray-300"
            value={dateRange}
            onChange={(dates) => setDateRange(dates)}
          />

          <Dropdown
            key={statusFilter}
            className="w-full md:auto"
            options={["all", "paid", "unpaid", "partiallyPaid"]}
            DropDownName="Status"
            defaultValue={statusFilter} // Use statusFilter state instead of hardcoded "all"
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
                setSupplierFilter("all");
                setDateRange(null);
                setCurrentPage(1); // Add this line
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

        <p className="text-[#5D6679] font-semibold text-[24px] pl-6">
          {tableTitle}
        </p>

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
                  key={row._id || idx}
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
                            <div className="flex gap-2">
                              <LuEye
                                size={20}
                                className="cursor-pointer text-blue-600 hover:text-blue-800"
                                onClick={() => handleViewDetails(row)}
                                title="View Details"
                              />
                              {onEdit && (
                                <RiEditLine
                                  size={20}
                                  className="cursor-pointer text-green-600 hover:text-green-800"
                                  onClick={() => handleEdit(row)}
                                  title="Edit"
                                />
                              )}
                              {onDelete && (
                                <AiOutlineDelete
                                  size={20}
                                  className="cursor-pointer text-red-600 hover:text-red-800"
                                  onClick={() => {
                                    if (!canDelete) {
                                      toast.error("You don't have permission to delete purchase invoice");
                                      return;
                                    }
                                    setDeleteUser(row);
                                    setShowDeleteModal(true);
                                  }}
                                  title="Delete"
                                />
                              )}
                            </div>
                          ) : col.accessor === "debit" ||
                            col.accessor === "balance" ? (
                            `${row[col.accessor]?.toLocaleString() || "0"}`
                          ) : col.accessor === "status" ? (
                            <span
                              className={`inline-block px-2 py-1 text-xs rounded-full font-semibold ${row.status === "unpaid"
                                ? "text-black"
                                : row.status === "paid"
                                  ? "text-green-700"
                                  : "text-orange-400"
                                }`}
                            >
                              {row[col.accessor]?.toUpperCase() || "N/A"}
                            </span>
                          ) : (
                            row[col.accessor] || "N/A"
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
                    {loading ? "Loading..." : "No data found."}
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

              {/* Always show page 1 */}
              <button
                onClick={() => handleChangePage(1)}
                className={`w-8 h-8 rounded-full text-sm flex items-center justify-center transition ${currentPage === 1
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
                    className={`w-8 h-8 rounded-full text-sm flex items-center justify-center transition ${currentPage === num
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

      {/* Invoice Detail Modal */}
      {invoiceDetail && (
        <InvoiceDetailModal
          isOpen={true}
          onClose={() => {
            setInvoiceDetail(null);
            setIsOpen(false);
            setLoading(false);
          }}
          columns={PurchaseInvoiceDetail}
          data={invoiceDetail.transformedItems || []}
          invoiceData={invoiceDetail}
          loading={loading}
          loader={
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          }
        />
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
              <h2 className="text-xl font-medium">Delete Purchase Invoice</h2>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="text-xl font-bold text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
            <div className="mt-8 text-start pb-8 px-6 shadow-[0_2px_2px_0_#00000026]">
              <h3 className="text-lg font-semibold mb-1">
                Delete Purchase Invoice?
              </h3>
              <p className="text-sm text-gray-700">
                Are you sure you want to delete invoice "{deleteUser?.invoice}"?
              </p>
              <p className="text-sm text-red-600 font-medium mt-1">
                This action cannot be undone.
              </p>
            </div>

            <div className="flex justify-center gap-2 pb-3 py-4 px-6 shadow-[0_2px_2px_0_#00000026]">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-5 py-1 rounded-md hover:bg-gray-100 border-none shadow-[inset_0_0_4px_#00000026]"
                disabled={loading}
              >
                Cancel
              </button>
              <Button
                text={loading ? "Deleting..." : "Delete"}
                icon={!loading && <AiOutlineDelete />}
                onClick={handleDeleteConfirm}
                disabled={loading}
                className="!border-none px-5 py-1 bg-[#DC2626] hover:bg-red-700 text-white rounded-md flex items-center gap-1 disabled:opacity-50"
              />
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
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
              <h2 className="text-xl font-medium">Purchase Invoice Deleted</h2>
              <button
                onClick={() => setDeleteModal(false)}
                className="text-xl font-bold text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
            <div className="mt-8 text-start pb-8 px-6 shadow-[0_2px_2px_0_#00000026]">
              <h3 className="text-lg font-semibold mb-1">
                Purchase Invoice Deleted Successfully
              </h3>
              <p className="text-sm text-gray-700">
                The purchase invoice has been removed from the system.
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

export default PurchaseInvoiceTable;
