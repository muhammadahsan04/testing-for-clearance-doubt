import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Dropdown from "../../../components/Dropdown";
import Input from "../../../components/Input";
import DatePicker from "../../../components/DatePicker";
import CreatePurchaseInvoiceTable from "../../../components/CreatePurchaseInvoiceTable";
import { useNavigate } from "react-router-dom";
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

interface Category {
  _id: string;
  name: string;
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

const CreatePurchaseInvoice: React.FC = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<Category[]>([]);
  const [createPurchaseInvoiceData, setCreatePurchaseInvoiceData] = useState<
    PurchaseInvoiceItem[]
  >([]);
  const [loading, setLoading] = useState(false);
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

  // Permission variables add
  const userRole = getUserRole();
  const isAdmin = userRole === "Admin" || userRole === "SuperAdmin";
  const canCreate = isAdmin || hasPermission("Inventory", "create");

  useEffect(() => {
    if (!canCreate) {
      toast.error("You don't have permission to create purchase invoice");
      navigate(-1);
    }
  }, [canCreate]);


  const navigate = useNavigate();

  // Get auth token from localStorage or wherever you store it
  const getAuthToken = () => {
    let token = localStorage.getItem("token");
    if (!token) {
      token = sessionStorage.getItem("token");
    }
    return token;
  };

  // Fetch suppliers on component mount
  useEffect(() => {
    fetchSuppliers();
  }, []);

  const API_URL = import.meta.env.VITE_BASE_URL || "http://localhost:9000";

  // Form validation
  const validateForm = () => {
    if (!formData.supplierCompanyName.trim()) {
      toast.error("Supplier company name is required");
      return false;
    }
    if (!formData.referenceNumber.trim()) {
      toast.error("Reference number is required");
      return false;
    }
    if (!formData.dateOfReceiving.trim()) {
      toast.error("Date of receiving is required");
      return false;
    }
    if (!formData.paymentDueDate.trim()) {
      toast.error("Payment due date is required");
      return false;
    }
    return true;
  };

  // Validate add item form
  const validateAddItem = () => {
    if (!formData.barcode.trim() && !formData.purchaseOrderReference.trim()) {
      toast.error("Please enter either barcode or purchase order reference");
      return false;
    }
    return true;
  };

  // Validate invoice creation
  const validateInvoiceCreation = () => {
    if (!validateForm()) {
      return false;
    }
    if (createPurchaseInvoiceData.length === 0) {
      toast.error("Please add at least one item to create invoice");
      return false;
    }
    // Check if all items have required fields
    for (let i = 0; i < createPurchaseInvoiceData.length; i++) {
      const item = createPurchaseInvoiceData[i];
      if (item.qty <= 0) {
        toast.error(`Item ${i + 1}: Quantity must be greater than 0`);
        return false;
      }
      if (item.costPrice <= 0) {
        toast.error(`Item ${i + 1}: Cost price must be greater than 0`);
        return false;
      }
    }
    return true;
  };

  const fetchSuppliers = async () => {
    try {
      const token = getAuthToken();
      if (!token) {
        toast.error("Authentication token not found. Please login again.");
        return;
      }

      const response = await fetch(
        `${API_URL}/api/abid-jewelry-ms/getAllSupplier`,
        {
          headers: {
            "x-access-token": token,
            "Content-Type": "application/json",
          },
        }
      );

      const result = await response.json();

      if (result.success) {
        setSuppliers(result.data);
        toast.success(`suppliers loaded successfully`);
      } else {
        toast.error(result.message || "Failed to fetch suppliers");
      }
    } catch (error) {
      console.error("Error fetching suppliers:", error);
      toast.error("Error fetching suppliers. Please try again.");
    }
  };

  const fetchItemByBarcode = async (barcodeValue: string) => {
    try {
      const token = getAuthToken();
      if (!token) {
        toast.error("Authentication token not found. Please login again.");
        return;
      }

      setLoading(true);
      const API_URL =
        import.meta.env.VITE_BASE_URL || "http://192.168.100.18:9000";
      const response = await fetch(
        `${API_URL}/api/abid-jewelry-ms/getItemByBarcode`,
        {
          method: "POST",
          headers: {
            "x-access-token": token,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ barcode: barcodeValue }),
        }
      );

      const result = await response.json();

      if (result.success) {
        const item = result.data;
        const previousPrices = result.previousCostPricesHistory
          .slice(-3) // Get last 3
          .reverse() // Show newest first
          .map((history: any) => history.price)
          .join(" / ");

        console.log("item createeeee", item);

        const newItem: PurchaseInvoiceItem = {
          userImage: item.itemImage ? `${API_URL}${item.itemImage}` : "",
          sno: (createPurchaseInvoiceData.length + 1)
            .toString()
            .padStart(2, "0"),
          barcode: item.barcode,
          refrenceNumber: item?.refrenceNumber || "N/A",
          productName: item.category?.name || "Unknown Product",
          qty: 0,
          previousBuying: previousPrices || "N/A",
          costPrice: 0,
          total: 0,
          salePrice: 0,
          action: "eye",
          itemId: item._id,
        };

        setCreatePurchaseInvoiceData((prev) => [...prev, newItem]);
        toast.success(`Item "${newItem.productName}" added successfully`);
      } else {
        toast.error(result.message || "Item not found with this barcode");
      }
    } catch (error) {
      console.error("Error fetching item by barcode:", error);
      toast.error(
        "Error fetching item. Please check your connection and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchPurchaseOrderById = async (orderId: string) => {
    try {
      const token = getAuthToken();
      if (!token) {
        toast.error("Authentication token not found. Please login again.");
        return;
      }

      setLoading(true);
      const response = await fetch(
        `${API_URL}/api/abid-jewelry-ms/getPurchaseOrderByOrderId`,
        {
          method: "POST",
          headers: {
            "x-access-token": token,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ purchaseOrderId: orderId }),
        }
      );

      const result = await response.json();

      if (result.success) {
        const order = result.data;
        const previousPrices = result.previousCostPricesHistory
          .map((history: any) => history.price)
          .join(" / ");

        const newItem: PurchaseInvoiceItem = {
          userImage: chain,
          sno: (createPurchaseInvoiceData.length + 1)
            .toString()
            .padStart(2, "0"),
          barcode: "N/A",
          refrenceNumber: order.purchaseOrderId,
          productName: order.category?.[0]?.name || "Purchase Order Item",
          qty: 0,
          previousBuying: previousPrices || "N/A",
          costPrice: 0,
          total: 0,
          salePrice: 0,
          action: "eye",
          purchaseOrderId: order._id,
        };

        setCreatePurchaseInvoiceData((prev) => [...prev, newItem]);
        toast.success(`Purchase order "${orderId}" added successfully`);

        // Set supplier if available
        if (order.supplierCompanyName) {
          setFormData((prev) => ({
            ...prev,
            supplierCompanyName: order.supplierCompanyName.companyName,
          }));
        }
      } else {
        toast.error(result.message || "Purchase order not found");
      }
    } catch (error) {
      console.error("Error fetching purchase order:", error);
      toast.error(
        "Error fetching purchase order. Please check your connection and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = async () => {
    if (!validateAddItem()) {
      return;
    }

    const promises = [];

    if (formData.barcode.trim()) {
      promises.push(fetchItemByBarcode(formData.barcode.trim()));
    }

    if (formData.purchaseOrderReference.trim()) {
      promises.push(
        fetchPurchaseOrderById(formData.purchaseOrderReference.trim())
      );
    }

    await Promise.all(promises);

    // Clear inputs after adding
    setFormData((prev) => ({
      ...prev,
      barcode: "",
      purchaseOrderReference: "",
    }));
  };

  // const handleItemUpdate = (index: number, field: string, value: any) => {
  //   setCreatePurchaseInvoiceData((prev) => {
  //     const updated = [...prev];
  //     updated[index] = { ...updated[index], [field]: value };

  //     // Calculate total when qty or costPrice changes
  //     if (field === "qty" || field === "costPrice") {
  //       updated[index].total = updated[index].qty * updated[index].costPrice;
  //     }

  //     return updated;
  //   });
  // };

  const handleItemUpdate = (index: number, field: string, value: any) => {
    setCreatePurchaseInvoiceData((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };

      // Calculate total when qty or costPrice changes, but only if both have valid values
      if (field === "qty" || field === "costPrice") {
        const qty =
          field === "qty"
            ? value === ""
              ? 0
              : parseFloat(value) || 0
            : updated[index].qty;
        const costPrice =
          field === "costPrice"
            ? value === ""
              ? 0
              : parseFloat(value) || 0
            : updated[index].costPrice;
        updated[index].total = qty * costPrice;
      }

      return updated;
    });
  };

  const handleDeleteItem = (index: number) => {
    setCreatePurchaseInvoiceData((prev) => {
      const updated = prev.filter((_, i) => i !== index);
      // Update serial numbers
      const reindexed = updated.map((item, i) => ({
        ...item,
        sno: (i + 1).toString().padStart(2, "0"),
      }));
      toast.success("Item removed successfully");
      return reindexed;
    });
  };

  // const handleCreateInvoice = async () => {
  //   if (!validateInvoiceCreation()) {
  //     return;
  //   }

  //   try {
  //     setLoading(true);
  //     // Here you would typically make an API call to create the invoice
  //     // const response = await createPurchaseInvoiceAPI(invoiceData);

  //     // Simulate API call
  //     await new Promise((resolve) => setTimeout(resolve, 2000));

  //     toast.success("Purchase invoice created successfully!");
  //     // Navigate to invoice list or detail page
  //     // navigate("/dashboard/inventory/purchase-invoice");
  //   } catch (error) {
  //     console.error("Error creating invoice:", error);
  //     toast.error("Failed to create invoice. Please try again.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleCreateInvoice = async () => {
    if (!validateInvoiceCreation()) {
      return;
    }

    try {
      setLoading(true);
      const token = getAuthToken();
      if (!token) {
        toast.error("Authentication token not found. Please login again.");
        return;
      }

      // Find supplier ID from suppliers array
      const selectedSupplier = suppliers.find(
        (supplier) => supplier.companyName === formData.supplierCompanyName
      );

      if (!selectedSupplier) {
        toast.error("Please select a valid supplier");
        return;
      }

      // Prepare items array
      const items = createPurchaseInvoiceData.map((item) => {
        const itemData: any = {
          quantity: item.qty,
          costPrice: item.costPrice,
          sellPrice: item.salePrice,
        };

        if (item.itemId) {
          console.log("item.itemId", item);

          itemData.itemBarcode = item.itemId;
        } else if (item.purchaseOrderId) {
          console.log("item.purchaseOrderId", item.purchaseOrderId);
          itemData.purchaseOrderId = item.purchaseOrderId;
        }

        return itemData;
      });

      const requestBody = {
        supplierCompanyName: selectedSupplier._id,
        referenceNumber: formData.referenceNumber,
        dateReceiving: formData.dateOfReceiving,
        dueDate: formData.paymentDueDate,
        items: items,
        description: formData.termsAndConditions,
      };

      const response = await axios.post(
        `${API_URL}/api/abid-jewelry-ms/addPurchaseInvoice`,
        requestBody,
        {
          headers: {
            "x-access-token": token,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        toast.success("Purchase invoice created successfully!");
        navigate("/dashboard/inventory/purchase-invoice");
      } else {
        toast.error(response.data.message || "Failed to create invoice");
      }
    } catch (error) {
      console.error("Error creating invoice:", error);
      toast.error("Failed to create invoice. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const supplierOptions = suppliers.map((supplier) => supplier.companyName);

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
        / <span className="text-black">Create Purchase Invoice</span>
      </h2>

      <div className="bg-white p-6 rounded-md">
        <h2 className="text-2xl font-semibold text-[#056BB7] mb-3">
          Create Purchase Invoice
        </h2>
        {/* <p className="font-bold text-gray-300 underline text-[20px] mb-3">
          Invoice #PI-837529
        </p> */}

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
              noResultsMessage="No supplier found"
              searchable={true}
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="" className="mb-1">
              Reference Number <span className="text-red-500">*</span>
            </label>
            <Input
              placeholder="21321412"
              className="w-full outline-none"
              type="number"
              value={formData.referenceNumber}
              onChange={(e) =>
                handleInputChange("referenceNumber", e.target.value)
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
            eye={false}
            columns={createPurchaseInvoiceColumn}
            data={createPurchaseInvoiceData}
            tableTitle="Purchase Invoice"
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
            onClick={handleCreateInvoice}
            disabled={loading || createPurchaseInvoiceData.length === 0}
          >
            {loading ? "Creating..." : "Create Invoice"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatePurchaseInvoice;
