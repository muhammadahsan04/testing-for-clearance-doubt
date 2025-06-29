import Button from "../../../components/Button";
import React, { useState } from "react";
// import Button from "./Button";
// Button
interface PurchaseReturnInvoiceDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoiceData?: any;
  loading?: boolean;
  loader?: React.ReactNode;
}

const PurchaseReturnInvoiceDetailModal: React.FC<
  PurchaseReturnInvoiceDetailModalProps
> = ({ isOpen, onClose, invoiceData, loading = false, loader }) => {
  if (!isOpen) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatCurrency = (amount: number) => {
    return `$${amount?.toLocaleString() || "0"}`;
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/20 z-50"
      onClick={onClose}
    >
      <div
        className="animate-scaleIn bg-white rounded-2xl shadow-xl p-6 w-full max-w-6xl max-h-[90vh] overflow-y-auto Inter-font"
        onClick={(e) => e.stopPropagation()}
      >
        {loading ? (
          loader || (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          )
        ) : (
          <>
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-semibold text-[#056BB7]">
                  Purchase Invoice Details
                </h2>
                <p className="text-gray-600 mt-1">
                  Invoice ID: {invoiceData?.piId}
                </p>
              </div>
              <div className="flex gap-3">
                <Button
                  text="Print"
                  className="bg-[#056BB7] text-white font-medium h-10 px-6 border-none"
                  onClick={() => window.print()}
                />
                <button
                  onClick={onClose}
                  className="text-2xl font-bold text-gray-500 hover:text-gray-700 px-2"
                >
                  ×
                </button>
              </div>
            </div>

            {/* Invoice Basic Info */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Supplier</p>
                  <p className="font-semibold">
                    {invoiceData?.supplierCompanyName?.companyName || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Reference Number</p>
                  <p className="font-semibold">
                    {invoiceData?.referenceNumber || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Date Receiving</p>
                  <p className="font-semibold">
                    {invoiceData?.dateReceiving
                      ? formatDate(invoiceData.dateReceiving)
                      : "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Due Date</p>
                  <p className="font-semibold">
                    {invoiceData?.dueDate
                      ? formatDate(invoiceData.dueDate)
                      : "N/A"}
                  </p>
                </div>
              </div>
            </div>

            {/* Return Status */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Return Status
              </h3>
              <div className="bg-white border border-gray-300 rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Payment Status</p>
                    <span
                      className={`inline-block px-3 py-1 text-sm rounded-full font-medium ${
                        invoiceData?.status === "paid"
                          ? "bg-green-100 text-green-700"
                          : invoiceData?.status === "pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {invoiceData?.status || "N/A"}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Return Status</p>
                    <span
                      className={`inline-block px-3 py-1 text-sm rounded-full font-medium ${
                        invoiceData?.returnStatus === "partiallyReturned"
                          ? "bg-orange-100 text-orange-700"
                          : invoiceData?.returnStatus === "fullyReturned"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {invoiceData?.returnStatus || "N/A"}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">State Description</p>
                    <p className="font-medium">
                      {invoiceData?.stateDescription || "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment History */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Payment History
              </h3>
              <div className="bg-white border border-gray-300 rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold">
                        Amount
                      </th>
                      <th className="px-4 py-3 text-left font-semibold">
                        Payment Date
                      </th>
                      <th className="px-4 py-3 text-left font-semibold">
                        Payment Type
                      </th>
                      <th className="px-4 py-3 text-left font-semibold">
                        Bank/Mode
                      </th>
                      <th className="px-4 py-3 text-left font-semibold">
                        Reference
                      </th>
                      <th className="px-4 py-3 text-left font-semibold">
                        Note
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoiceData?.paymentHistory?.length > 0 ? (
                      invoiceData.paymentHistory.map(
                        (payment: any, index: number) => (
                          <tr key={index} className="border-t border-gray-200">
                            <td className="px-4 py-3 font-medium">
                              {formatCurrency(payment.amount)}
                            </td>
                            <td className="px-4 py-3">
                              {formatDate(payment.paymentDate)}
                            </td>
                            <td className="px-4 py-3 capitalize">
                              {payment.paymentType || "N/A"}
                            </td>
                            <td className="px-4 py-3">
                              {payment.bankMode?.name ||
                                payment.paymentMode ||
                                "N/A"}
                            </td>
                            <td className="px-4 py-3">
                              {payment.invoiceReferenceNumber || "N/A"}
                            </td>
                            <td className="px-4 py-3">
                              {payment.note || "N/A"}
                            </td>
                          </tr>
                        )
                      )
                    ) : (
                      <tr>
                        <td
                          colSpan={6}
                          className="px-4 py-6 text-center text-gray-500"
                        >
                          No payment history found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Returned Items */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Returned Items
              </h3>
              <div className="bg-white border border-gray-300 rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold">
                        Return Reference
                      </th>
                      <th className="px-4 py-3 text-left font-semibold">
                        Item Barcode
                      </th>
                      <th className="px-4 py-3 text-left font-semibold">
                        Return Date
                      </th>
                      <th className="px-4 py-3 text-left font-semibold">
                        Quantity
                      </th>
                      <th className="px-4 py-3 text-left font-semibold">
                        Return Amount
                      </th>
                      <th className="px-4 py-3 text-left font-semibold">
                        Note
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoiceData?.returnedItems?.length > 0 ? (
                      invoiceData.returnedItems.map(
                        (returnItem: any, index: number) => (
                          <tr key={index} className="border-t border-gray-200">
                            <td className="px-4 py-3 font-medium">
                              {returnItem.returnInvoiceId?.referenceNumber ||
                                "N/A"}
                            </td>
                            <td className="px-4 py-3">
                              {returnItem.returnInvoiceId?.items?.[0]?.itemId
                                ?.barcode || "N/A"}
                            </td>
                            <td className="px-4 py-3">
                              {formatDate(returnItem.returnDate)}
                            </td>
                            <td className="px-4 py-3">
                              {returnItem.returnedQuantity || 0}
                            </td>
                            <td className="px-4 py-3 font-medium">
                              {formatCurrency(
                                returnItem.returnInvoiceId?.totalReturnAmount ||
                                  0
                              )}
                            </td>
                            <td className="px-4 py-3">
                              {returnItem.note || "N/A"}
                            </td>
                          </tr>
                        )
                      )
                    ) : (
                      <tr>
                        <td
                          colSpan={6}
                          className="px-4 py-6 text-center text-gray-500"
                        >
                          No returned items found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Return Summary */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Return Summary
              </h3>
              <div className="bg-white border border-gray-300 rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold">
                        Item Barcode
                      </th>
                      <th className="px-4 py-3 text-left font-semibold">
                        Category
                      </th>
                      <th className="px-4 py-3 text-left font-semibold">
                        Original Quantity
                      </th>
                      <th className="px-4 py-3 text-left font-semibold">
                        Returned Quantity
                      </th>
                      <th className="px-4 py-3 text-left font-semibold">
                        Remaining Quantity
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoiceData?.returnSummary?.length > 0 ? (
                      invoiceData.returnSummary.map(
                        (summary: any, index: number) => (
                          <tr key={index} className="border-t border-gray-200">
                            <td className="px-4 py-3 font-medium">
                              {summary.itemId?.barcode || "N/A"}
                            </td>
                            <td className="px-4 py-3">
                              {summary.itemId?.category?.name || "N/A"}
                            </td>
                            <td className="px-4 py-3">
                              {summary.originalQuantity || 0}
                            </td>
                            <td className="px-4 py-3 text-orange-600 font-medium">
                              {summary.returnedQuantity || 0}
                            </td>
                            <td className="px-4 py-3 text-green-600 font-medium">
                              {summary.remainingQuantity || 0}
                            </td>
                          </tr>
                        )
                      )
                    ) : (
                      <tr>
                        <td
                          colSpan={5}
                          className="px-4 py-6 text-center text-gray-500"
                        >
                          No return summary found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Totals Summary */}
            <div className="bg-[#FCF3EC] rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-sm text-gray-600">Total Debit</p>
                  <p className="text-xl font-semibold text-red-600">
                    {formatCurrency(invoiceData?.totals?.debit || 0)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Credit</p>
                  <p className="text-xl font-semibold text-green-600">
                    {formatCurrency(invoiceData?.totals?.credit || 0)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Balance</p>
                  <p className="text-xl font-semibold text-blue-600">
                    {formatCurrency(invoiceData?.totals?.balance || 0)}
                  </p>
                </div>
              </div>
            </div>

            {/* Description */}
            {invoiceData?.description && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  Description
                </h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-700">{invoiceData.description}</p>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default PurchaseReturnInvoiceDetailModal;