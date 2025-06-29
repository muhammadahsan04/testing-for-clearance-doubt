import Button from "../../../components/Button";
import React, { useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
interface PurchaseReturnData {
  _id: string;
  supplierId: {
    _id: string;
    supplierId: string;
    companyName: string;
    representativeName: string;
    email: string;
    phone: string;
    status: string;
    walletAmount: number;
    walletHistory: Array<{
      amount: number;
      type: string;
      source: string;
      reference: string;
      date: string;
      note: string;
    }>;
  };
  referenceNumber: string;
  dateOfReturn: string;
  purchaseInvoiceId: {
    _id: string;
    piId: string;
    status: string;
    returnStatus: string;
    totals: {
      debit: number;
      credit: number;
      balance: number;
    };
    items: Array<{
      itemBarcode: string;
      quantity: number;
      costPrice: number;
      sellPrice: number;
      totalPriceOfCostItems: number;
      returnedQuantity: number;
    }>;
    paymentHistory: Array<{
      amount: number;
      paymentDate: string;
      paymentType: string;
      note: string;
      invoiceReferenceNumber: string;
    }>;
  };
  items: Array<{
    itemId: {
      _id: string;
      barcode: string;
      category: string;
      goldWeight: string;
      diamondWeight: string;
    };
    quantity: number;
    cost: number;
  }>;
  totalReturnAmount: number;
  note: string;
  returnDate: string;
  returnHistory: Array<{
    returnInvoiceId: {
      referenceNumber: string;
      dateOfReturn: string;
      totalReturnAmount: number;
      note: string;
    };
    itemId: string;
    quantity: number;
    returnDate: string;
    note: string;
  }>;
}

interface AllOfTheDetailsOfPurchaseReturnProps {
  isOpen: boolean;
  onClose: () => void;
  purchaseReturnData: PurchaseReturnData[] | null;
  loading?: boolean;
  loader?: React.ReactNode;
}

const AllOfTheDetailsOfPurchaseReturn: React.FC<
  AllOfTheDetailsOfPurchaseReturnProps
> = ({ isOpen, onClose, purchaseReturnData, loading = false, loader }) => {
  const [activeTab, setActiveTab] = useState<
    "overview" | "items" | "history" | "payments"
  >("overview");

  if (!isOpen) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatCurrency = (amount: number) => {
    return `$${amount.toLocaleString()}`;
  };

  // Calculate totals from all return data
  const calculateTotals = () => {
    if (!purchaseReturnData || purchaseReturnData.length === 0) {
      return { totalReturned: 0, totalItems: 0, totalTransactions: 0 };
    }

    const totalReturned = purchaseReturnData.reduce(
      (sum, item) => sum + item.totalReturnAmount,
      0
    );
    const totalItems = purchaseReturnData.reduce(
      (sum, item) => sum + item.items.length,
      0
    );
    const totalTransactions = purchaseReturnData.length;

    return { totalReturned, totalItems, totalTransactions };
  };

  const { totalReturned, totalItems, totalTransactions } = calculateTotals();

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
      onClick={onClose}
    >
      <div
        className="animate-scaleIn bg-white rounded-2xl shadow-xl w-[95%] max-w-6xl max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {loading ? (
          <div className="flex justify-center items-center h-96">
            {loader || (
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            )}
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <div>
                <h2 className="text-2xl font-bold text-[#056BB7]">
                  Purchase Return Details
                </h2>
                {purchaseReturnData && purchaseReturnData.length > 0 && (
                  <p className="text-gray-600 mt-1">
                    Supplier: {purchaseReturnData[0].supplierId.companyName}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-3">
                {/* <Button
                  text="Print"
                  className="bg-[#056BB7] text-white font-medium h-10 px-4 border-none"
                  onClick={() => window.print()}
                /> */}
                <button
                  onClick={onClose}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  <AiOutlineClose />
                </button>
              </div>
            </div>

            {/* Summary Cards */}
            <div className="p-6 bg-gray-50 border-b">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h3 className="text-sm font-medium text-gray-600">
                    Total Returned Amount
                  </h3>
                  <p className="text-2xl font-bold text-green-600">
                    {formatCurrency(totalReturned)}
                  </p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h3 className="text-sm font-medium text-gray-600">
                    Total Items Returned
                  </h3>
                  <p className="text-2xl font-bold text-blue-600">
                    {totalItems}
                  </p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h3 className="text-sm font-medium text-gray-600">
                    Total Transactions
                  </h3>
                  <p className="text-2xl font-bold text-purple-600">
                    {totalTransactions}
                  </p>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6">
                {[
                  { key: "overview", label: "Overview" },
                  { key: "items", label: "Returned Items" },
                  { key: "history", label: "Return History" },
                  { key: "payments", label: "Wallet History" },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key as any)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab.key
                        ? "border-[#056BB7] text-[#056BB7]"
                        : "border-transparent text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[50vh]">
              {activeTab === "overview" && (
                <div className="space-y-6">
                  {purchaseReturnData && purchaseReturnData.length > 0 && (
                    <>
                      {/* Supplier Information */}
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="text-lg font-semibold mb-3 text-gray-800">
                          Supplier Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-600">
                              Company Name
                            </p>
                            <p className="font-medium">
                              {purchaseReturnData[0].supplierId.companyName}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">
                              Representative
                            </p>
                            <p className="font-medium">
                              {
                                purchaseReturnData[0].supplierId
                                  .representativeName
                              }
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Email</p>
                            <p className="font-medium">
                              {purchaseReturnData[0].supplierId.email}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Phone</p>
                            <p className="font-medium">
                              {purchaseReturnData[0].supplierId.phone}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">
                              Wallet Amount
                            </p>
                            <p className="font-medium text-green-600">
                              {formatCurrency(
                                purchaseReturnData[0].supplierId.walletAmount
                              )}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Status</p>
                            <span
                              className={`inline-block px-2 py-1 text-xs rounded-full ${
                                purchaseReturnData[0].supplierId.status ===
                                "active"
                                  ? "bg-green-100 text-green-600"
                                  : "bg-red-100 text-red-600"
                              }`}
                            >
                              {purchaseReturnData[0].supplierId.status}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Purchase Invoice Information */}
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="text-lg font-semibold mb-3 text-gray-800">
                          Purchase Invoice Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-600">Invoice ID</p>
                            <p className="font-medium">
                              {purchaseReturnData[0].purchaseInvoiceId.piId}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Status</p>
                            <span
                              className={`inline-block px-2 py-1 text-xs rounded-full ${
                                purchaseReturnData[0].purchaseInvoiceId
                                  .status === "paid"
                                  ? "bg-green-100 text-green-600"
                                  : "bg-yellow-100 text-yellow-600"
                              }`}
                            >
                              {purchaseReturnData[0].purchaseInvoiceId.status}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">
                              Return Status
                            </p>
                            <span
                              className={`inline-block px-2 py-1 text-xs rounded-full ${
                                purchaseReturnData[0].purchaseInvoiceId
                                  .returnStatus === "returned"
                                  ? "bg-blue-100 text-blue-600"
                                  : "bg-gray-100 text-gray-600"
                              }`}
                            >
                              {
                                purchaseReturnData[0].purchaseInvoiceId
                                  .returnStatus
                              }
                            </span>
                          </div>
                        </div>

                        {/* Invoice Totals */}
                        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="bg-white p-3 rounded">
                            <p className="text-sm text-gray-600">Debit</p>
                            <p className="font-bold text-red-600">
                              {formatCurrency(
                                purchaseReturnData[0].purchaseInvoiceId.totals
                                  .debit
                              )}
                            </p>
                          </div>
                          <div className="bg-white p-3 rounded">
                            <p className="text-sm text-gray-600">Credit</p>
                            <p className="font-bold text-green-600">
                              {formatCurrency(
                                purchaseReturnData[0].purchaseInvoiceId.totals
                                  .credit
                              )}
                            </p>
                          </div>
                          <div className="bg-white p-3 rounded">
                            <p className="text-sm text-gray-600">Balance</p>
                            <p className="font-bold text-blue-600">
                              {formatCurrency(
                                purchaseReturnData[0].purchaseInvoiceId.totals
                                  .balance
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}

              {activeTab === "items" && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Returned Items
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full border border-gray-200 rounded-lg">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                            Reference
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                            Barcode
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                            Return Date
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                            Quantity
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                            Cost
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                            Total Amount
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                            Note
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {purchaseReturnData?.map((returnItem, index) =>
                          returnItem.items.map((item, itemIndex) => (
                            <tr
                              key={`${index}-${itemIndex}`}
                              className="hover:bg-gray-50"
                            >
                              <td className="px-4 py-3 text-sm">
                                {returnItem?.referenceNumber || "N/A"}
                              </td>
                              <td className="px-4 py-3 text-sm">
                                {item?.itemId?.barcode || "N/A"}
                              </td>
                              <td className="px-4 py-3 text-sm">
                                {formatDate(returnItem?.returnDate)}
                              </td>
                              <td className="px-4 py-3 text-sm">
                                {item.quantity}
                              </td>
                              <td className="px-4 py-3 text-sm">
                                {formatCurrency(item.cost)}
                              </td>
                              <td className="px-4 py-3 text-sm font-medium">
                                {formatCurrency(item.quantity * item.cost)}
                              </td>
                              <td className="px-4 py-3 text-sm">
                                {returnItem?.note || "N/A"}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeTab === "history" && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Return History
                  </h3>
                  <div className="space-y-4">
                    {purchaseReturnData?.map((returnData, index) => (
                      <div
                        key={index}
                        className="border border-gray-200 rounded-lg p-4"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="font-medium text-gray-800">
                              Return #{returnData.referenceNumber}
                            </h4>
                            <p className="text-sm text-gray-600">
                              Date: {formatDate(returnData.dateOfReturn)}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-green-600">
                              {formatCurrency(returnData.totalReturnAmount)}
                            </p>
                            <p className="text-sm text-gray-600">
                              {returnData.items.length} item(s)
                            </p>
                          </div>
                        </div>

                        {returnData.returnHistory &&
                          returnData.returnHistory.length > 0 && (
                            <div className="mt-4">
                              <h5 className="text-sm font-medium text-gray-700 mb-2">
                                Transaction History:
                              </h5>
                              <div className="space-y-2">
                                {returnData.returnHistory.map(
                                  (history, historyIndex) => (
                                    <div
                                      key={historyIndex}
                                      className="bg-gray-50 p-3 rounded text-sm"
                                    >
                                      <div className="flex justify-between items-center">
                                        <div>
                                          <p className="font-medium">
                                            {
                                              history.returnInvoiceId
                                                .referenceNumber
                                            }
                                          </p>
                                          <p className="text-gray-600">
                                            Qty: {history.quantity} | Date:{" "}
                                            {formatDate(history.returnDate)}
                                          </p>
                                          <p className="text-gray-600">
                                            Note: {history.note}
                                          </p>
                                        </div>
                                        <div className="text-right">
                                          <p className="font-medium text-green-600">
                                            {formatCurrency(
                                              history.returnInvoiceId
                                                .totalReturnAmount
                                            )}
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  )
                                )}
                              </div>
                            </div>
                          )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "payments" && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Supplier Wallet History
                  </h3>
                  {purchaseReturnData && purchaseReturnData.length > 0 && (
                    <div className="space-y-4">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h4 className="font-medium text-blue-800">
                          Current Wallet Balance
                        </h4>
                        <p className="text-2xl font-bold text-blue-600">
                          {formatCurrency(
                            purchaseReturnData[0].supplierId.walletAmount
                          )}
                        </p>
                      </div>

                      <div className="overflow-x-auto">
                        <table className="w-full border border-gray-200 rounded-lg">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                                Date
                              </th>
                              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                                Type
                              </th>
                              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                                Amount
                              </th>
                              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                                Source
                              </th>
                              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                                Reference
                              </th>
                              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                                Note
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            {purchaseReturnData[0].supplierId.walletHistory.map(
                              (wallet, index) => (
                                <tr key={index} className="hover:bg-gray-50">
                                  <td className="px-4 py-3 text-sm">
                                    {formatDate(wallet.date)}
                                  </td>
                                  <td className="px-4 py-3 text-sm">
                                    <span
                                      className={`inline-block px-2 py-1 text-xs rounded-full ${
                                        wallet.type === "credit"
                                          ? "bg-green-100 text-green-600"
                                          : "bg-red-100 text-red-600"
                                      }`}
                                    >
                                      {wallet.type}
                                    </span>
                                  </td>
                                  <td className="px-4 py-3 text-sm font-medium">
                                    <span
                                      className={
                                        wallet.type === "credit"
                                          ? "text-green-600"
                                          : "text-red-600"
                                      }
                                    >
                                      {wallet.type === "credit" ? "+" : "-"}
                                      {formatCurrency(wallet.amount)}
                                    </span>
                                  </td>
                                  <td className="px-4 py-3 text-sm capitalize">
                                    {wallet.source}
                                  </td>
                                  <td className="px-4 py-3 text-sm">
                                    {wallet.reference}
                                  </td>
                                  <td className="px-4 py-3 text-sm">
                                    {wallet.note}
                                  </td>
                                </tr>
                              )
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-600">
                  {purchaseReturnData && purchaseReturnData.length > 0 && (
                    <p>
                      Last updated:{" "}
                      {formatDate(purchaseReturnData[0].returnDate)}
                    </p>
                  )}
                </div>
                <Button
                  text="Close"
                  onClick={onClose}
                  className="bg-gray-500 text-white font-medium h-10 px-6 border-none hover:bg-gray-600"
                />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AllOfTheDetailsOfPurchaseReturn;
