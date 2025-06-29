import React, { useEffect, useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { RiEditLine } from "react-icons/ri";
import { GoChevronLeft, GoChevronRight } from "react-icons/go";
import { LuEye } from "react-icons/lu";
import chain from "../assets/chain.png";
import braclet from "../assets/bracelet.png";
import noseRing from "../assets/noseRing.png";
import earing from "../assets/earing.png";
import ring from "../assets/ring.png";
import locket from "../assets/locket.png";
import Input from "./Input";
import Dropdown from "./Dropdown";
import DatePicker from "./DatePicker";
import Button from "./Button";
import { Navigate, useNavigate } from "react-router-dom";
import InventoryTable from "./InventoryTable";
import CreateSaleInvoiceTable from "./CreateSaleInvoiceTable";
import { toast } from "react-toastify";
import axios from "axios";
type ColumnType =
  | "select"
  | "text"
  | "image"
  | "status"
  | "actions"
  | "button"
  | "custom";

// Add this interface near the top with the other interfaces
interface PermissionState {
  [key: string]: {
    [key: string]: boolean;
  };
}

interface CreateSaleInvoiceColumn {
  header: string;
  accessor: string;
  type?: "text" | "image" | "status" | "actions";
}
interface Column {
  header: string;
  accessor: string;
  type?: ColumnType;
}

interface ZoneData {
  _id: string;
  zoneId: string;
  name: string;
  status: string;
}

interface StoreData {
  _id: string;
  uniqueStoreId: string;
  storeName: string;
  location: string;
  managerId: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  status: string;
}

export interface User {
  id: string;
  name: string;
  role: string;
  status: string;
  userImage?: string;
  [key: string]: any;
}

interface SalesInvoiceTableProps {
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
  // Add these new props
  selectedRows?: { [key: string]: boolean };
  onRowSelect?: (rowId: string) => void;
  selectedItemsForInvoice?: any[]; // Add this prop
  onClearSelections?: () => void;
  canCreate?: boolean
}

// Helper function to get auth token
const getAuthToken = () => {
  let token = localStorage.getItem("token");
  if (!token) {
    token = sessionStorage.getItem("token");
  }
  return token;
};

const SalesInvoiceTable: React.FC<SalesInvoiceTableProps> = ({
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
  // Add these new props with default values
  selectedRows = {},
  onRowSelect = () => { },
  selectedItemsForInvoice = [], // Add default value
  onClearSelections = () => { }, // Add this prop
  canCreate = true
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedUser, setSelectedUser] = useState<any>(null); // for modal
  const [deleteUser, setDeleteUser] = useState<any>(null); // for modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [search, setSearch] = useState(""); // ✅ Local search state
  const [statusFilter, setStatusFilter] = useState("All"); // ✅ Status filter state
  // To these two state variables edit user
  const [isEditing, setIsEditing] = useState(false);
  const [editingRow, setEditingRow] = useState<any>(null);
  const [formData, setFormData] = useState<any>(null);
  const [permState, setPermState] = useState<PermissionState>({});
  const [zones, setZones] = useState<ZoneData[]>([]);
  const [stores, setStores] = useState<StoreData[]>([]);
  const [selectedZone, setSelectedZone] = useState("");
  const [selectedStore, setSelectedStore] = useState("");
  const [managerName, setManagerName] = useState("");
  const [zoneOptions, setZoneOptions] = useState<string[]>([]);
  const [storeOptions, setStoreOptions] = useState<string[]>([]);
  const [isLoadingStores, setIsLoadingStores] = useState(false);
  const [dueDate, setDueDate] = useState("");
  const [selectedZoneId, setSelectedZoneId] = useState("");
  const [selectedStoreId, setSelectedStoreId] = useState("");

  // console.log("row", row);
  const handleCheckboxChange = (
    perm: string,
    action: "View" | "Add" | "Edit" | "Delete"
  ) => {
    setPermState((prev) => ({
      ...prev,
      [perm]: {
        ...prev[perm],
        [action]: !prev[perm]?.[action],
      },
    }));
  };

  const navigate = useNavigate();
  // Update the filteredData function in SalesInvoiceTable.tsx
  // const filteredData = data.filter((item) => {
  //   // Only search through productName and barcode fields
  //   const searchableText = `${item.productName || ""} ${
  //     item.barcode || ""
  //   }`.toLowerCase();
  //   const matchesSearch = searchableText.includes(search.toLowerCase());

  //   const matchesStatus =
  //     statusFilter === "All" || item.status === statusFilter;

  //   return matchesSearch && matchesStatus;
  // });

  const filteredData = data.filter((item) => {
    // Create a more comprehensive search that handles different data structures
    const searchableFields = [
      item.productName,
      item.barcode,
      item.originalData?.items?.itemBarcode?.barcode,
      item.originalData?.items?.itemBarcode?.productName,
      item.name,
      item.id,
      item.piId,
      item.invoice,
      item.refrence,
    ].filter(Boolean); // Remove undefined/null values

    const searchableText = searchableFields.join(" ").toLowerCase();
    const matchesSearch =
      search === "" || searchableText.includes(search.toLowerCase());

    // Handle status filtering - check for different status field names
    const itemStatus = item.status || item.originalData?.status || "";
    const matchesStatus =
      statusFilter === "All" ||
      itemStatus.toLowerCase() === statusFilter.toLowerCase() ||
      (statusFilter === "Active" && itemStatus === "active") ||
      (statusFilter === "Inactive" && itemStatus === "inactive");

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
  // console.log("DATA", isEditing);

  const createSaleInvoiceColumns: CreateSaleInvoiceColumn[] = [
    { header: "No", accessor: "no" },
    { header: "Product Name", accessor: "productName", type: "image" },

    // { header: "Image", accessor: "image", type: "image" },
    { header: "Stock", accessor: "stock" },
    { header: "QTY", accessor: "qty" },
    { header: "Cost Price ($)", accessor: "costPrice" },
    { header: "Sale Price ($)", accessor: "salePrice" },
    // { header: "Sub Category", accessor: "subCategory" },
    // { header: "Location", accessor: "location" },
    // { header: "Actions", accessor: "actions", type: "actions" },
  ];

  const createSaleInvoiceData = [
    {
      no: "01",
      productName: "1Chain - Men - Cuban - 10k - 4.5CWT",
      userImage: chain,
      qty: "4",
      costPrice: "500",
      salePrice: "500",
      stock: "05",
    },
    {
      no: "02",
      userImage: braclet,
      productName: "1Chain - Men - Cuban - 10k - 4.5CWT",
      qty: "2",
      costPrice: "500",
      salePrice: "800",
      stock: "100",
    },
    {
      no: "03",
      userImage: noseRing,
      productName: "1Chain - Men - Cuban - 10k - 4.5CWT",
      qty: "2",
      costPrice: "500",
      salePrice: "300",
      stock: "49",
    },
  ];

  const handleCreateSaleInvoice = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();

    if (selectedItemsForInvoice.length === 0) {
      toast.error("Please select at least one item to create a sale invoice.");
      return;
    }

    setIsEditing(true);
    setEditingRow(null);
    setFormData({});
  };

  const handleInvoiceCreated = () => {
    setIsEditing(false); // Close the modal
    // Reset form data
    setSelectedZone("");
    setSelectedStore("");
    setManagerName("");
    setDueDate("");
    setSelectedZoneId("");
    setSelectedStoreId("");
    // Call the parent function to clear selections
    onClearSelections();
  };

  // Fetch zones function
  const fetchZones = async () => {
    try {
      const API_URL = import.meta.env.VITE_BASE_URL || "http://localhost:9000";
      const token = getAuthToken();

      if (!token) {
        toast.error("Authentication token not found. Please login again.");
        return;
      }

      const response = await axios.get(
        `${API_URL}/api/abid-jewelry-ms/getAllZones`,
        {
          headers: {
            "x-access-token": token,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        const zonesData = response.data.data;
        setZones(zonesData);

        // Extract zone names for dropdown
        const zoneNames = zonesData.map((zone: ZoneData) => zone.name);
        setZoneOptions(zoneNames);
      } else {
        toast.error(response.data.message || "Failed to fetch zones");
      }
    } catch (error) {
      console.error("Error fetching zones:", error);
      if (axios.isAxiosError(error)) {
        if (!error.response) {
          toast.error("Network error. Please check your internet connection.");
        } else {
          toast.error(error.response.data.message || "Failed to fetch zones");
        }
      } else {
        toast.error("An unexpected error occurred while fetching zones");
      }
    }
  };

  // Fetch stores function
  const fetchStores = async () => {
    setIsLoadingStores(true);
    try {
      const API_URL = import.meta.env.VITE_BASE_URL || "http://localhost:9000";
      const token = getAuthToken();

      if (!token) {
        toast.error("Authentication token not found. Please login again.");
        return;
      }

      const response = await axios.get(
        `${API_URL}/api/abid-jewelry-ms/getAllShops`,
        {
          headers: {
            "x-access-token": token,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success && Array.isArray(response.data.data)) {
        setStores(response.data.data);

        // Extract store names for dropdown
        const storeNames = response.data.data.map(
          (store: StoreData) => store.storeName
        );
        setStoreOptions(storeNames);
      } else {
        toast.warning("No stores found or invalid response format");
      }
    } catch (error) {
      console.error("Error fetching stores:", error);
      toast.error("Failed to fetch stores");
    } finally {
      setIsLoadingStores(false);
    }
  };

  // Fetch zones and stores on component mount
  useEffect(() => {
    fetchZones();
    fetchStores();
  }, []);

  // Handle zone selection
  const handleZoneSelect = (zoneName: string) => {
    setSelectedZone(zoneName);
    const selectedZoneObj = zones.find((zone) => zone.name === zoneName);
    setSelectedZoneId(selectedZoneObj?._id || "");
    setSelectedStore("");
    setManagerName("");
  };

  // const handleStoreSelect = (storeName: string) => {
  //   setSelectedStore(storeName);

  //   // Find the selected store and get manager details
  //   const selectedStoreObj = stores.find(
  //     (store) => store.storeName === storeName
  //   );

  //   if (selectedStoreObj && selectedStoreObj.managerId) {
  //     const fullManagerName = `${selectedStoreObj.managerId.firstName} ${selectedStoreObj.managerId.lastName}`;
  //     setManagerName(fullManagerName);
  //   } else {
  //     setManagerName("No manager assigned");
  //   }
  // };

  const handleStoreSelect = (storeName: string) => {
    setSelectedStore(storeName);
    const selectedStoreObj = stores.find(
      (store) => store.storeName === storeName
    );
    setSelectedStoreId(selectedStoreObj?._id || "");

    if (selectedStoreObj && selectedStoreObj.managerId) {
      const fullManagerName = `${selectedStoreObj.managerId.firstName} ${selectedStoreObj.managerId.lastName}`;
      setManagerName(fullManagerName);
    } else {
      setManagerName("No manager assigned");
    }
  };

  return (
    <>
      <div
        className={`bg-white rounded-xl p-4 flex flex-col gap-5 overflow-hidden shadow-md ${className}`}
      >
        {/* Search + Filter */}
        {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center justify-between"> */}
        <div
          className={`grid gap-4 items-center justify-between md:grid-cols-2 ${data.some((item) => item.hasOwnProperty("status"))
            ? ""
            : "grid-cols-2"
            }`}
        >
          <div className="flex gap-3">
            {searchable && (
              <Input
                placeholder="Search Product Name, Barcode"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-sm !rounded-3xl outline-none"
              />
            )}

            {filterByStatus &&
              data.some((item) => item.hasOwnProperty("status")) && (
                <Dropdown
                  options={["All", "Active", "Inactive"]}
                  DropDownName="Status"
                  defaultValue="All"
                  onSelect={(val) => {
                    setStatusFilter(val);
                    setCurrentPage(1);
                  }}
                />
              )}
          </div>
          <div
            className={`flex md:justify-end ${data.some((item) => item.hasOwnProperty("status"))
              ? "justify-start"
              : "justify-end"
              }`}
          >
            <Button
              text="Export"
              variant="border"
              className="bg-[#5D6679] text-white w-24"
            />
          </div>
        </div>

        <div className="flex justify-between w-full">
          <p className="text-[#056BB7] font-semibold text-[24px]">
            {tableTitle}
          </p>

          {/* if (!canCreate) {
                toast.error("You don't have permission to create product sub-category");
              } */}
          {/* {canCreate && ( */}
          <Button
            text="Create Sale Invoice"
            className={`px-6 !bg-[#056BB7] border-none text-white ${!canCreate ? "opacity-70 !cursor-not-allowed" : ""
              }`}
            // type="submit"
            disabled={!canCreate}
            onClick={handleCreateSaleInvoice}
          />
          {/* )} */}
          {/* <Button
            text="Create Sale Invoice"
            className="bg-[#056BB7] text-white border-none font-medium w-auto px-7"
            onClick={handleCreateSaleInvoice}
          /> */}
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-gray-300 overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-700 ">
            <thead className="bg-[#F9FAFB] text-black">
              {/* <tr className="font-semibold text-[16px] whitespace-nowrap border-2">
                {columns.map((col) => (
                  <th key={col.accessor} className="px-6 py-3">
                    {col.header}
                  </th>
                ))}
              </tr> */}

              <tr className="font-semibold text-[16px] whitespace-nowrap w-full">
                {columns.map((col, index) => {
                  const isSecond = index === 1;
                  const isSecondLast = index === columns.length - 2;
                  const isLast = index === columns.length - 1;

                  return (
                    <th
                      key={col.accessor}
                      className="px-6 py-3"
                      style={{ width: "max-content" }}
                    >
                      <div
                        className={`flex flex-row items-center ${isSecond
                          ? "justify-start"
                          : isSecondLast
                            ? "justify-center"
                            : isLast
                              ? "justify-center"
                              : tableDataAlignment === "zone"
                                ? "justify-center"
                                : "justify-start"
                          // : "justify-center" for zone
                          // "justify-start"
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
                // Update the row click handler in the tr element:
                <tr
                  key={idx}
                  className="hover:bg-gray-50 whitespace-nowrap cursor-pointer"
                  onClick={() => {
                    if (onRowClick) {
                      onRowClick(row);
                    } else if (enableRowModal) {
                      setSelectedUser(row);
                    }
                  }}
                >
                  {columns.map((col, index) => {
                    const isSecond = index === 1;
                    const isSecondLast = index === columns.length - 2;
                    const isLast = index === columns.length - 1;

                    return (
                      <td
                        key={col.accessor}
                        className="px-6 py-2"
                        style={{ width: "max-content" }}
                      >
                        <div
                          className={`flex flex-row items-center ${isSecond
                            ? "justify-start"
                            : isSecondLast
                              ? "justify-center"
                              : isLast
                                ? "justify-center"
                                : tableDataAlignment === "zone"
                                  ? "justify-center"
                                  : "justify-start"
                            // : "justify-center" for zone
                            // "justify-start"
                            }`}
                        >
                          {(() => {
                            switch (col.type) {
                              // In the SalesInvoiceTable component, update the "select" case in the switch statement:

                              case "select":
                                return (
                                  <div
                                    className="flex gap-2 items-center"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <input
                                      type="checkbox"
                                      checked={
                                        selectedRows[
                                        row.originalData?.items?.itemBarcode
                                          ?._id
                                        ] || false
                                      }
                                      onChange={(e) => {
                                        e.stopPropagation();
                                        console.log("row", row);

                                        onRowSelect(
                                          row.originalData?.items?.itemBarcode
                                            ?._id
                                        );
                                      }}
                                      className="form-checkbox h-4 w-4 text-blue-600 cursor-pointer"
                                    />
                                  </div>
                                );

                              // case "image":
                              //   return (
                              //     <div className="flex gap-2 items-center">
                              //       {row.userImage ? (
                              //         <>
                              //           <img
                              //             src={row.userImage}
                              //             alt="User"
                              //             className="w-8 h-8 rounded-full"
                              //           />
                              //           {row.productName}
                              //         </>
                              //       ) : (
                              //         <>{row.productName}</>
                              //       )}
                              //     </div>
                              //   );
                              // case "status":
                              //   return (
                              //     <span
                              //       className={`inline-block px-2 py-1 text-xs rounded-full ${
                              //         row.status === "Active"
                              //           ? "bg-green-100 text-green-600"
                              //           : "bg-red-100 text-red-600"
                              //       }`}
                              //     >
                              //       {row.status}
                              //     </span>
                              //   );

                              // In the switch statement for rendering table cells, update the "image" case:

                              case "image":
                                return (
                                  <div className="flex gap-2 items-center">
                                    {row.userImage ? (
                                      <>
                                        <img
                                          src={row.userImage}
                                          alt="Product"
                                          className="w-8 h-8 rounded-full object-cover"
                                          onError={(e) => {
                                            // Hide image if it fails to load
                                            e.currentTarget.style.display =
                                              "none";
                                          }}
                                        />
                                        <span>{row.productName}</span>
                                      </>
                                    ) : (
                                      // Only show product name if no image
                                      <span>{row.productName}</span>
                                    )}
                                  </div>
                                );

                              case "status":
                                return (
                                  <span
                                    className={`inline-block px-2 py-1 text-xs rounded-full ${row.status === "active"
                                      ? "bg-green-100 text-green-600"
                                      : "bg-red-100 text-red-600"
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
                                        className="cursor-pointer"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          // navigate("purchase-order-detail");
                                        }}
                                      />
                                    )}
                                    {/* <RiEditLine
                                      className="cursor-pointer"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setIsEditing(true); // Set isEditing to true
                                        setEditingRow(row); // Store the row data in editingRow
                                      }}
                                    /> */}

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
                                        setDeleteUser(row);
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

          {/* Pagination */}
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

      {/* Modal */}
      {selectedUser && (
        <div
          // className="fixed inset-0 z-50 flex items-center justify-center bg-transparent backdrop-blur-xs bg-opacity-40 transition-opacity duration-300"
          className="fixed inset-0 flex items-center justify-center bg-black/20 z-50"
          onClick={() => setSelectedUser(null)}
        >
          <div
            className="animate-scaleIn bg-white rounded-xl p-6 w-full max-w-sm mx-auto relative shadow-md transition-opacity duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Detail Data</h2>
              <button
                onClick={() => setSelectedUser(null)}
                className="text-xl font-bold text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
            <div className="text-center">
              <div className="mt-3 w-full flex">
                <span
                  // className="text-sm text-[#10A760] bg-[#34C75933] px-3 py-1 rounded-md ml-auto"
                  className={`text-sm px-3 py-1 rounded-md ml-auto ${selectedUser.status === "Active"
                    ? "text-[#10A760] bg-[#34C75933]"
                    : "text-red-600 bg-red-100"
                    }`}
                >
                  {selectedUser.status}
                </span>
              </div>
              <img
                src={selectedUser.userImage}
                alt={selectedUser.name}
                className="w-36 h-36 mx-auto rounded-full object-cover"
              />
              <div className="my-5">
                <span className="text-sm text-black bg-[#12121226] px-3 py-2 rounded-full">
                  {selectedUser.role}
                </span>
              </div>
              <h3 className="text-xl font-bold mt-1">
                {selectedUser.name} ({selectedUser.id})
              </h3>
              <div className="mt-2 text-black text-sm font-bold">
                290/UKM_IK/XXVII/2025
              </div>
              <div className="flex justify-center gap-6 text-[#71717A] mt-2">
                <p>John Doe@gmail.com</p>
                <p>081312144546 </p>
              </div>
              <p className="text-[#71717A] italic">
                1234 Maple Street Springfield, IL 62704
              </p>

              <div className="flex justify-center gap-6 mt-6 Poppins-font font-medium">
                <p className="text-[#4E4FEB]">
                  Zone: <span className="text-black">Zone 1</span>
                </p>
                <p className="text-[#4E4FEB]">
                  Shop: <span className="text-black">Soho S parkle</span>
                </p>
              </div>
            </div>
          </div>
        </div>
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
        <>
          <div
            className="fixed inset-0 flex items-center justify-center bg-black/20 z-50"
            onClick={() => setIsEditing(false)}
          >
            <div
              className="animate-scaleIn bg-white w-[90vw] overflow-hidden sm:w-lg md:w-[80vw] lg:w-4xl h-auto overflow-y-auto rounded-[7px] shadow-lg p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <form
                className="text-[15px] Poppins-font font-medium w-full"
                onSubmit={(e) => {
                  e.preventDefault();
                  console.log("Form submitted");
                }}
              >
                <div className="">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-8 lg:gap-10 xl:gap-12 text-[15px] Poppins-font font-medium">
                    {/* Left Side */}
                    <div className="space-y-3">
                      <div className="flex flex-col">
                        <label htmlFor="" className="mb-1">
                          Zone <span className="text-red-500">*</span>
                        </label>
                        <Dropdown
                          options={zoneOptions}
                          className="outline-none focus:outline-none"
                          defaultValue={selectedZone || "Select Zone"}
                          onSelect={handleZoneSelect}
                          noResultsMessage="No zones found"
                          searchable={true}
                        />
                      </div>
                      <div className="flex flex-col">
                        <label htmlFor="" className="mb-1">
                          Payment Due Date
                        </label>
                        <DatePicker
                          onChange={(e) => setDueDate(e.target.value)}
                          type="date"
                          className="w-full"
                        />
                      </div>
                    </div>

                    {/* Right Side */}
                    <div className="space-y-3">
                      <div className="flex flex-col">
                        <label htmlFor="" className="mb-1">
                          Store <span className="text-red-500">*</span>
                        </label>
                        <Dropdown
                          options={storeOptions}
                          defaultValue={selectedStore || "Select Store"}
                          onSelect={handleStoreSelect}
                          className="w-full"
                          noResultsMessage={
                            isLoadingStores
                              ? "Loading stores..."
                              : "No stores found"
                          }
                          searchable={true}
                        // disabled={isLoadingStores}
                        />
                      </div>
                      <div className="flex flex-col">
                        <label htmlFor="" className="mb-1">
                          Manager Name
                        </label>
                        <Input
                          value={managerName}
                          placeholder="Manager will be auto-selected"
                          className="w-full bg-gray-100"
                          // disabled={true}
                          readOnly
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </form>

              <CreateSaleInvoiceTable
                bottomBtn={true}
                columns={createSaleInvoiceColumns}
                data={selectedItemsForInvoice}
                eye={true}
                tableDataAlignment="zone"
                selectedZone={selectedZoneId}
                selectedStore={selectedStoreId}
                managerName={managerName}
                dueDate={dueDate}
                onInvoiceCreated={handleInvoiceCreated} // Add this prop
                onEdit={(row) => setSelectedUser(row)}
                onDelete={(row) => {
                  setSelectedUser(row);
                  setShowDeleteModal(true);
                }}
                onClose={() => setIsEditing(false)} // Add this line
              />
            </div>
          </div>
        </>
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

export default SalesInvoiceTable;
