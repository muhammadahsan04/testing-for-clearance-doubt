import React, { useState } from "react";
import { LuChevronDown, LuChevronUp, LuEye } from "react-icons/lu";
import { RiFileList2Line } from "react-icons/ri";
import Button from "./Button";
import noseRing from "../assets/noseRing.png";
import chain from "../assets/chain.png";
import InvoiceDetailModal, {
  Column as InvoiceColumn,
  ColumnType as InvoiceColumnType,
} from "../pages/dashboard/Inventory/InvoiceDetailModal";

interface PurchaseInvoiceDetail {
  itemdescription: string;
  qty: number;
  rate: number;
  amount: number;
  productName: string;
  userImage?: any;
  prInvoiceNumber?: string;
  itemName?: string;
  prTotal?: number;
  date?: string;
}

const SupplierLedgerDetailTable: React.FC<SupplierLedgerDetailTableProps> = ({
  eye = true,
  enableRowModal = true,
  onRowClick,
  className,
  columns,
  data,
  tableTitle,
  tableDataAlignment = "start",
  selectedRows = {},
  onRowSelect = () => {},
  showTitle = true,
  marginTop = "",
  onEyeClick,
}) => {
  // const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [ledgerInvoice, setLedgerInvoice] = useState<any>(null);
  const [paymentDetail, setPaymentDetail] = useState<any>(null);
  const [selectedPaymentRow, setSelectedPaymentRow] = useState<any>(null);
  const [isOpen, setIsOpen] = useState(false);

  // Sample invoice detail data for expanded rows
  const invoiceDetailData: { [key: string]: PurchaseInvoiceDetail[] } = {
    "#78965": [
      {
        date: "13/1/2025",
        prInvoiceNumber: "PR-123",
        itemName: "Enchanted Locket",
        qty: 2,
        prTotal: 1000,
        itemdescription: "PI-1234",
        rate: 500,
        amount: 1000,
        productName: "Enchanted Locket",
      },
    ],
    "#45632": [
      {
        date: "15/1/2025",
        prInvoiceNumber: "PR-124",
        itemName: "Gold Ring",
        qty: 1,
        prTotal: 200,
        itemdescription: "PI-1235",
        rate: 200,
        amount: 200,
        productName: "Gold Ring",
      },
    ],
    "#53455": [
      {
        date: "18/1/2025",
        prInvoiceNumber: "PR-125",
        itemName: "Silver Chain",
        qty: 3,
        prTotal: 456,
        itemdescription: "PI-1236",
        rate: 152,
        amount: 456,
        productName: "Silver Chain",
      },
    ],
    "#31247": [
      {
        date: "05/2/2025",
        prInvoiceNumber: "PR-126",
        itemName: "Diamond Bracelet",
        qty: 1,
        prTotal: 500,
        itemdescription: "PI-1237",
        rate: 500,
        amount: 500,
        productName: "Diamond Bracelet",
      },
    ],
  };

  const payColumns: Column[] = [
    { header: "Invoice", accessor: "invoice" },
    { header: "Invoice Date", accessor: "invoiceDate" },
    { header: "Status", accessor: "status", type: "status" },
    { header: "Debit ($)", accessor: "debit", type: "text" },
    { header: "Credit ($)", accessor: "credit", type: "text" },
    { header: "Balance ($)", accessor: "balance", type: "text" },
  ];


  const purchaseInvoiceData = [
    {
      itemdescription: "PI-1234",
      qty: 1234,
      rate: 200,
      amount: 1100,
      productName: "Ring - Women - Cuban - 10k - 4.5CWT",
      userImage: noseRing,
    },
    {
      itemdescription: "PI-1234",
      qty: 123,
      rate: 200,
      amount: 1100,
      productName: "Bracelet - Men - Cuban - 10k - 4.5CWT",
      userImage: chain,
    },
  ];
  const purchaseInvoiceColumns: InvoiceColumn[] = [
    { header: "Product Name", accessor: "productName", type: "image" },
    { header: "QTY", accessor: "qty" },
    { header: "RATE ($)", accessor: "rate" },
    { header: "AMOUNT ($)", accessor: "amount" },
  ];

  return (
    <>
      {/* Table Title */}
      {showTitle && (
        <div className={`flex justify-between w-full ${marginTop}`}>
          <p className="text-[#5D6679] font-semibold text-[24px] pl-6">
            {tableTitle}
          </p>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-300 overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-700">
          <thead className="bg-[#F9FAFB] text-black">
            <tr className="font-semibold text-[16px] whitespace-nowrap w-full">
              {columns.map((col) => (
                <th
                  key={col.accessor}
                  className="px-6 py-3"
                  style={{ width: "max-content" }}
                >
                  <div className="flex flex-row items-center justify-center">
                    {col.header}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="border-gray-400">
            {data.map((row, idx) => (
              <React.Fragment key={idx}>
                <tr className="hover:bg-gray-50 whitespace-nowrap cursor-pointer">
                  {columns.map((col, index) => (
                    <td
                      key={col.accessor}
                      className="px-6 py-2"
                      style={{ width: "max-content" }}
                    >
                      <div className="flex flex-row items-center justify-center">
                        {(() => {
                          switch (col.type) {
                            case "select":
                              return (
                                <div
                                  className="flex gap-2 items-center"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <input
                                    type="checkbox"
                                    checked={selectedRows[row.invoice] || false}
                                    onChange={(e) => {
                                      e.stopPropagation();
                                      onRowSelect(row.invoice);
                                    }}
                                    className="form-checkbox h-4 w-4 text-blue-600 cursor-pointer"
                                  />
                                </div>
                              );
                            case "image":
                              return (
                                <div className="flex gap-2 items-center">
                                  {row.userImage ? (
                                    <>
                                      <img
                                        src={
                                          row.userImage || "/placeholder.svg"
                                        }
                                        alt="User"
                                        className="w-8 h-8 rounded-full"
                                      />
                                      {row.productName}
                                    </>
                                  ) : (
                                    <>{row.productName}</>
                                  )}
                                </div>
                              );
                           
                                </div>
                              );
                            case "status":
                              return (
                                <span
                                  className={`inline-block px-2 py-1 text-xs rounded-full font-semibold ${
                                    row.status === "Unpaid"
                                      ? "text-black"
                                      : row.status === "Paid"
                                      ? "text-green-700"
                                      : "text-orange-400"
                                  }`}
                                >
                                  {row.status}
                                </span>
                              );
                            
                                  {/* {expandedRow === row.invoice ? (
                                    <LuChevronUp size={20} />
                                  ) : (
                                    <LuChevronDown size={20} />
                                  )} */}
                                </div>
                              );
                            default:
                              return <>{row[col.accessor]}</>;
                          }
                        })()}
                      </div>
                    </td>
                  ))}
                </tr>
              </React.Fragment>
            ))}
            {data.length === 0 && (
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
      </div>

      {paymentDetail && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black/20 z-50"
          onClick={() => setPaymentDetail(false)}
        >
          <div
            className="animate-scaleIn bg-white overflow-hidden w-[60vw] h-auto overflow-y-auto rounded-[7px] shadow-lg px-4 py-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-xl font-semibold text-[#056BB7]">Payment</h2>
              <Button
                text="Print"
                className="bg-[#056BB7] text-white font-medium h-8 px-6 border-none"
              />
            </div>
            <div className="flex items-center w-full mb-7 mt-4">
              <div className="w-1/2">
                <div className="flex text-[15px] Poppins-font font-medium">
                  <label htmlFor="" className="mb-1">
                    Refrence Number: <span className="font-light">387193</span>
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
              selectedRows={selectedRows}
              onRowSelect={handleRowSelect}
              onRowClick={(row) => console.log("Row clicked:", row)}
            />
          </div>
        </div>
      )}

      {isOpen && (
        <InvoiceDetailModal
          isOpen={isOpen}
          onClose={() => {
            setLedgerInvoice(null);
            setIsOpen(false);
          }}
          columns={purchaseInvoiceColumns}
          data={purchaseInvoiceData}
        />
      )}
    </>
  );
};

export default SupplierLedgerDetailTable;
