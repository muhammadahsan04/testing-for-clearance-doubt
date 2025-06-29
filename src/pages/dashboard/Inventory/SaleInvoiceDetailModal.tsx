"use client"

import type React from "react"
import { IoIosPrint } from "react-icons/io"
import { FaDownload } from "react-icons/fa"

interface Column {
  header: string
  accessor: string
}

interface SaleInvoiceDetailModalProps {
  isOpen: boolean
  onClose: () => void
  columns: Column[]
  data: any[]
  invoiceData: any
}

const SaleInvoiceDetailModal: React.FC<SaleInvoiceDetailModalProps> = ({
  isOpen,
  onClose,
  columns,
  data,
  invoiceData,
}) => {
  if (!isOpen) return null

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
  }

  const formatCurrency = (amount: number) => {
    return `$${amount?.toLocaleString() || "0"}`
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/20 z-50" onClick={onClose}>
      <div
        className="animate-scaleIn bg-white w-[90vw] max-w-4xl max-h-[90vh] overflow-y-auto rounded-lg shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >

        {/* Invoice Information */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Left Column */}
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Invoice Information</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Invoice ID:</span>
                    <span className="font-medium">{invoiceData.siId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date Issued:</span>
                    <span className="font-medium">{formatDate(invoiceData.dateIssued)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Due Date:</span>
                    <span className="font-medium">{formatDate(invoiceData.dueDate)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Reference Number:</span>
                    <span className="font-medium">{invoiceData.referenceNumber || "N/A"}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Store Information</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Store Name:</span>
                    <span className="font-medium">{invoiceData.store?.storeName || "N/A"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Manager:</span>
                    <span className="font-medium">{invoiceData.storeManagerName || "N/A"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Zone:</span>
                    <span className="font-medium">{invoiceData.zone?.name || "N/A"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Location:</span>
                    <span className="font-medium">{invoiceData.store?.location || "N/A"}</span>
                  </div>
                </div>
              </div>
            </div>

          {/* Items Table */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Invoice Items</h3>
            <div className="overflow-x-auto">
              <table className="w-full border border-gray-300 rounded-lg">
                <thead className="bg-gray-50">
                  <tr>
                    {columns.map((col) => (
                      <th key={col.accessor} className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                        {col.header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.map((row, index) => (
                    <tr key={index} className="border-t border-gray-200 hover:bg-gray-50">
                      {columns.map((col) => (
                        <td key={col.accessor} className="px-4 py-3 text-sm text-gray-700">
                          {col.accessor === "costPrice" || col.accessor === "sellPrice" || col.accessor === "amount"
                            ? formatCurrency(row[col.accessor])
                            : row[col.accessor] || "N/A"}
                        </td>
                      ))}
                    </tr>
                  ))}
                  {data.length === 0 && (
                    <tr>
                      <td colSpan={columns.length} className="px-4 py-6 text-center text-gray-500">
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
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Description</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700">{invoiceData.description}</p>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="flex justify-end pt-4 border-t border-gray-200">
            <button onClick={onClose} className="px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SaleInvoiceDetailModal
