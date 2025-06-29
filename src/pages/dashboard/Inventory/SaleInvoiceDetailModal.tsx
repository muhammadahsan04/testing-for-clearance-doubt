"use client";

import type React from "react";
import { IoIosPrint } from "react-icons/io";
import { FaDownload } from "react-icons/fa";

interface Column {
  header: string;
  accessor: string;
}

interface SaleInvoiceDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  columns: Column[];
  data: any[];
  invoiceData: any;
}
const API_URL = import.meta.env.VITE_BASE_URL || "http://localhost:9000";

const SaleInvoiceDetailModal: React.FC<SaleInvoiceDetailModalProps> = ({
  isOpen,
  onClose,
  columns,
  data,
  invoiceData
}) => {
  if (!isOpen) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };
  console.log("fdsghfhsdgf", data);

  const formatCurrency = (amount: number) => {
    return `$${amount?.toLocaleString() || "0"}`;
  };
  const getAuthToken = () => {
    let token = localStorage.getItem("token");
    if (!token) {
      token = sessionStorage.getItem("token");
    }
    return token;
  };


  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/20 z-50"
      onClick={onClose}
    >
      <div
        className="animate-scaleIn bg-white w-[90vw] max-w-4xl max-h-[90vh] overflow-y-auto rounded-lg shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200 sticky top-0 bg-white">
          <div>
            <h2 className="text-2xl font-bold text-[#056BB7]">
              Sale Invoice Details
            </h2>
            <p className="text-gray-600">Invoice #{invoiceData.siId}</p>
          </div>
          <div className="flex gap-2">
            {/* <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              <IoIosPrint size={16} />
              Print
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
              <FaDownload size={16} />
              Download
            </button> */}
            <button
              onClick={onClose}
              className="text-xl font-bold text-gray-500 hover:text-gray-700 px-2"
            >
              ×
            </button>
          </div>
        </div>

        {/* Invoice Information */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Left Column */}
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  Invoice Information
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Invoice ID:</span>
                    <span className="font-medium">{invoiceData.siId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date Issued:</span>
                    <span className="font-medium">
                      {formatDate(invoiceData.dateIssued)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Due Date:</span>
                    <span className="font-medium">
                      {formatDate(invoiceData.dueDate)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Reference Number:</span>
                    <span className="font-medium">
                      {invoiceData.referenceNumber || "N/A"}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  Store Information
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Store Name:</span>
                    <span className="font-medium">
                      {invoiceData.store?.storeName || "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Manager:</span>
                    <span className="font-medium">
                      {invoiceData.storeManagerName || "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Zone:</span>
                    <span className="font-medium">
                      {invoiceData.zone?.name || "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Location:</span>
                    <span className="font-medium">
                      {invoiceData.store?.location || "N/A"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  Issued By
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Name:</span>
                    <span className="font-medium">
                      {`${invoiceData.issuedBy?.firstName || ""} ${
                        invoiceData.issuedBy?.lastName || ""
                      }`.trim() || "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Email:</span>
                    <span className="font-medium">
                      {invoiceData.issuedBy?.email || "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Phone:</span>
                    <span className="font-medium">
                      {invoiceData.issuedBy?.phone || "N/A"}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  Invoice Summary
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Debit:</span>
                    <span className="font-medium">
                      {formatCurrency(invoiceData.totals?.debit)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Credit:</span>
                    <span className="font-medium">
                      {formatCurrency(invoiceData.totals?.credit)}
                    </span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span className="text-gray-800 font-semibold">
                      Balance:
                    </span>
                    <span className="font-bold text-lg">
                      {formatCurrency(
                        (invoiceData.totals?.credit || 0) -
                          (invoiceData.totals?.debit || 0)
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Invoice Items
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full border border-gray-300 rounded-lg">
                <thead className="bg-gray-50">
                  <tr>
                    {columns.map((col) => (
                      <th
                        key={col.accessor}
                        className="px-4 py-3 text-left text-sm font-semibold text-gray-700"
                      >
                        {col.header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.map((row, index) => (
                    <tr
                      key={index}
                      className="border-t border-gray-200 hover:bg-gray-50"
                    >
                      {columns.map((col) => (
                        <td
                          key={col.accessor}
                          className="px-4 py-3 text-sm text-gray-700"
                        >
                          {col.accessor === "itemdescription" ? (
                            <div className="flex items-center gap-2">
                              {row["productImage"] && (
                                <img
                                  src={row["productImage"]}
                                  alt="Product"
                                  className="w-8 h-8 object-cover rounded"
                                />
                              )}
                              <span>{row[col.accessor] || "N/A"}</span>
                            </div>
                          ) : col.accessor === "costPrice" ||
                            col.accessor === "sellPrice" ||
                            col.accessor === "amount" ? (
                            formatCurrency(row[col.accessor])
                          ) : (
                            row[col.accessor] || "N/A"
                          )}
                        </td>
                      ))}
                      {/* // Update the table cell rendering to include delete
                      button */}
                      {/* {columns.map((col) => (
                        <td
                          key={col.accessor}
                          className="px-4 py-3 text-sm text-gray-700 border-2"
                        >
                          {col.accessor === "actions" ? (
                            <AiOutlineDelete
                              size={18}
                              className="cursor-pointer text-red-600 hover:text-red-800"
                              onClick={() =>
                                onDeleteItem && onDeleteItem(row.itemId)
                              }
                              title="Delete Item"
                            />
                          ) : col.accessor === "itemdescription" ? (
                            <div className="flex items-center gap-2">
                              {row["productImage"] && (
                                <img
                                  src={row["productImage"]}
                                  alt="Product"
                                  className="w-8 h-8 object-cover rounded"
                                />
                              )}
                              <span>{row[col.accessor] || "N/A"}</span>
                            </div>
                          ) : col.accessor === "costPrice" ||
                            col.accessor === "sellPrice" ||
                            col.accessor === "amount" ? (
                            formatCurrency(row[col.accessor])
                          ) : (
                            row[col.accessor] || "N/A"
                          )}
                        </td>
                      ))} */}
                    </tr>
                  ))}
                  {data.length === 0 && (
                    <tr>
                      <td
                        colSpan={columns.length}
                        className="px-4 py-6 text-center text-gray-500"
                      >
                        No items found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Description */}
          {invoiceData.description && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Description
              </h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700">{invoiceData.description}</p>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="flex justify-end pt-4 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SaleInvoiceDetailModal;
