import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Dropdown from "../../../components/Dropdown";
import Input from "../../../components/Input";
import DatePicker from "../../../components/DatePicker";
import CreatePurchaseInvoiceTable from "../../../components/CreatePurchaseInvoiceTable";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../../../components/Button";
import chain from "../../../assets/tops.png";
import axios from "axios";
import { hasPermission } from "../sections/CoreSettings";


interface Column {
  header: string;
  accessor: string;
  type?: "text" | "image" | "status" | "actions" | "input";
}

interface Supplier {
  _id: string;
  companyName: string;
  supplierId: string;
}

interface PurchaseInvoiceItem {
  userImage?: string;
  sno: string;
  barcode: string;
  refrenceNumber: string;
  productName: string;
  qty: number;
  previousBuying: string;
  costPrice: number;
  total: number;
  salePrice: number;
  action: string;
  itemId?: string;
  purchaseOrderId?: string;
  _id?: string;
}

interface FormData {
  supplierCompanyName: string;
  referenceNumber: string;
  dateOfReceiving: string;
  paymentDueDate: string;
  purchaseOrderReference: string;
  barcode: string;
  termsAndConditions: string;
}

const getUserRole = () => {
  let role = localStorage.getItem("role");
  if (!role) {
    role = sessionStorage.getItem("role");
  }
  return role;
};
const UpdatePurchaseInvoice: React.FC = () => {
  const { invoiceId } = useParams<{ invoiceId: string }>();
  console.log("invoiceId", invoiceId);

  const [selectedUser, setSelectedUser] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [createPurchaseInvoiceData, setCreatePurchaseInvoiceData] = useState<
    PurchaseInvoiceItem[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [formData, setFormData] = useState<FormData>({
    supplierCompanyName: "",
    referenceNumber: "",
    dateOfReceiving: "",
    paymentDueDate: "",
    purchaseOrderReference: "",
    barcode: "",
    termsAndConditions: "",
  });

  const createPurchaseInvoiceColumn: Column[] = [
    { header: "S.no", accessor: "sno", type: "text" },
    { header: "Barcode", accessor: "barcode", type: "text" },
    { header: "Reference Number", accessor: "refrenceNumber", type: "text" },
    { header: "Product Name", accessor: "productName", type: "image" },
    { header: "Qty", accessor: "qty", type: "input" },
    {
      header: "Previous Buying ($)",
      accessor: "previousBuying",
      type: "text",
    },
    { header: "Cost Price ($)", accessor: "costPrice", type: "input" },
    { header: "Total ($)", accessor: "total", type: "text" },
    { header: "Sale Price", accessor: "salePrice", type: "input" },
    { header: "Actions", accessor: "actions", type: "actions" },
  ];

  const navigate = useNavigate();

  // Permission variables add
  const userRole = getUserRole();
  const isAdmin = userRole === "Admin" || userRole === "SuperAdmin";
  const canUpdate = isAdmin || hasPermission("Inventory", "update");
  useEffect(() => {
    if (!canUpdate) {
      toast.error("You don't have permission to edit purchase invoice");
      navigate(-1);
    }
  }, [canUpdate]);

  const getAuthToken = () => {
    let token = localStorage.getItem("token");
    if (!token) {
      token = sessionStorage.getItem("token");
    }
    return token;
  };

  const API_URL = import.meta.env.VITE_BASE_URL || "http://localhost:9000";

  // Fetch invoice data on component mount
  useEffect(() => {
    if (invoiceId) {
      fetchInvoiceData();
      fetchSuppliers();
    }
  }, [invoiceId]);


  const supplierOptions = suppliers.map((supplier) => supplier.companyName);

  if (initialLoading) {
    return (
      <div className="mx-auto px-3 py-6 sm:px-4 md:px-6 xl:px-8 xl:py-6 w-full rounded-lg shadow-md">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading invoice data...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto px-3 py-6 sm:px-4 md:px-6 xl:px-8 xl:py-6 w-full rounded-lg shadow-md">
      <h2 className="Source-Sans-Pro-font font-semibold text-[#5D6679] text-[20px] mb-2">
        <span
          onClick={() =>
            navigate("/dashboard/inventory/purchase-invoice", { replace: true })
          }
          className="cursor-pointer"
        >
          Purchase Invoice
        </span>{" "}
        / <span className="text-black">Update Purchase Invoice</span>
      </h2>

      <div className="bg-white p-6 rounded-md">
        <h2 className="text-2xl font-semibold text-[#056BB7] mb-3">
          Update Purchase Invoice
        </h2>
        <p className="font-bold text-gray-300 underline text-[20px] mb-3">
          Invoice #{formData.referenceNumber || "Loading..."}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 gap-y-6 mb-8 Poppins-font font-medium text-sm">
          <div className="flex flex-col">
            <label htmlFor="" className="mb-1">
              Supplier Company Name <span className="text-red-500">*</span>
            </label>
            <Dropdown
              options={supplierOptions}
              defaultValue={formData.supplierCompanyName || "Select Supplier"}
              className="w-full"
              onSelect={(value) =>
                handleInputChange("supplierCompanyName", value)
              }
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="" className="mb-1">
              Date of Receiving <span className="text-red-500">*</span>
            </label>
            <DatePicker
              onChange={(e) =>
                handleInputChange("dateOfReceiving", e.target.value)
              }
              type="date"
              className="w-full"
              value={formData.dateOfReceiving}
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="" className="mb-1">
              Payment due date <span className="text-red-500">*</span>
            </label>
            <DatePicker
              onChange={(e) =>
                handleInputChange("paymentDueDate", e.target.value)
              }
              type="date"
              className="w-full"
              value={formData.paymentDueDate}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-1 xl:grid-cols-2 gap-4 justify-between mb-4 Poppins-font font-medium text-sm">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex flex-col flex-1">
              <label htmlFor="purchase-order" className="mb-1">
                Purchase Order Reference
              </label>
              <Input
                placeholder="WDyCc-4SYU"
                className="w-full outline-none"
                type="text"
                value={formData.purchaseOrderReference}
                onChange={(e) =>
                  handleInputChange("purchaseOrderReference", e.target.value)
                }
              />
            </div>
            <div className="flex flex-col flex-1">
              <label htmlFor="barcode" className="mb-1">
                Barcode
              </label>
              <Input
                placeholder="55325084"
                className="w-full outline-none"
                type="text"
                value={formData.barcode}
                onChange={(e) => handleInputChange("barcode", e.target.value)}
              />
            </div>
          </div>
          <div className="flex items-end justify-end lg:justify-end">
            <Button
              text={loading ? "Adding..." : "Add Item"}
              className="w-full sm:w-auto bg-blue-600 text-white hover:bg-blue-700 border-none px-4"
              onClick={handleAddItem}
              disabled={loading}
            />
          </div>
        </div>

        <div className="mb-4">
          <CreatePurchaseInvoiceTable
            eye={true}
            columns={createPurchaseInvoiceColumn}
            data={createPurchaseInvoiceData}
            tableTitle="Purchase Invoice Items"
            tableDataAlignment="zone"
            onEdit={(row) => setSelectedUser(row)}
            onDelete={(row) => {
              setSelectedUser(row);
              setShowDeleteModal(true);
            }}
            onItemUpdate={handleItemUpdate}
            onDeleteItem={handleDeleteItem}
          />
        </div>

        {/* Terms and Conditions */}
        <div className="mt-5 mb-6">
          <p className="Poppins-font font-medium text-sm mb-1">
            Terms & Conditions / Notes
          </p>
          <textarea
            placeholder="Enter any terms, conditions, or additional notes here"
            rows={5}
            className="Poppins-font font-medium w-full px-2 py-2 border border-gray-300 rounded-md text-sm !focus:outline-none outline-none resize-none"
            value={formData.termsAndConditions}
            onChange={(e) =>
              handleInputChange("termsAndConditions", e.target.value)
            }
          ></textarea>
        </div>

        <div className="flex justify-end gap-3">
          <button
            className="bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600 transition"
            onClick={() =>
              navigate("/dashboard/inventory/purchase-invoice", {
                replace: true,
              })
            }
          >
            Cancel
          </button>
          <button
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleUpdateInvoice}
            disabled={loading || createPurchaseInvoiceData.length === 0}
          >
            {loading ? "Updating..." : "Update Invoice"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdatePurchaseInvoice;
