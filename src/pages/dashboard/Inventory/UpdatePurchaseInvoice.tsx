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
  // console.log("invoiceId", invoiceId);

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

  const fetchInvoiceData = async () => {
    try {
      const token = getAuthToken();
      if (!token) {
        toast.error("Authentication token not found. Please login again.");
        return;
      }

      setInitialLoading(true);
      const response = await axios.get(
        `${API_URL}/api/abid-jewelry-ms/getOnePurchaseInvoice/${invoiceId}`,
        {
          headers: {
            "x-access-token": token,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        const invoiceData = response.data.data;

        // Set form data
        setFormData({
          supplierCompanyName:
            invoiceData.supplierCompanyName?.companyName || "",
          referenceNumber: invoiceData.referenceNumber || "",
          dateOfReceiving: invoiceData.dateReceiving
            ? new Date(invoiceData.dateReceiving).toISOString().split("T")[0]
            : "",
          paymentDueDate: invoiceData.dueDate
            ? new Date(invoiceData.dueDate).toISOString().split("T")[0]
            : "",
          purchaseOrderReference: "",
          barcode: "",
          termsAndConditions: invoiceData.description || "",
        });

        // Transform items data
        const transformedItems: PurchaseInvoiceItem[] = invoiceData.items.map(
          (item: any, index: number) => {
            const previousPrices =
              item.previousCostPrices
                ?.map((history: any) => history.price)
                .join(" / ") || "N/A";

            return {
              _id: item._id,
              userImage: item.itemBarcode?.itemImage
                ? `${API_URL}${item.itemBarcode.itemImage}`
                : "",
              sno: (index + 1).toString().padStart(2, "0"),
              barcode: item.itemBarcode?.barcode || "N/A",
              refrenceNumber:
                item.itemBarcode?.autoGenerated ||
                item.purchaseOrderId?.purchaseOrderId ||
                "N/A",
              productName:
                item.itemBarcode?.category?.name || "Unknown Product",
              qty: item.quantity,
              previousBuying: previousPrices,
              costPrice: item.costPrice,
              total: item.totalPriceOfCostItems,
              salePrice: item.sellPrice,
              action: "eye",
              itemId: item.itemBarcode?._id,
              purchaseOrderId: item.purchaseOrderId?._id,
            };
          }
        );

        setCreatePurchaseInvoiceData(transformedItems);
        toast.success("Invoice data loaded successfully");
      } else {
        toast.error(response.data.message || "Failed to fetch invoice data");
      }
    } catch (error) {
      console.error("Error fetching invoice data:", error);
      toast.error("Error fetching invoice data. Please try again.");
    } finally {
      setInitialLoading(false);
    }
  };

  const fetchSuppliers = async () => {
    try {
      const token = getAuthToken();
      if (!token) {
        toast.error("Authentication token not found. Please login again.");
        return;
      }

      const response = await axios.get(
        `${API_URL}/api/abid-jewelry-ms/getAllSupplier`,
        {
          headers: {
            "x-access-token": token,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        setSuppliers(response.data.data);
      } else {
        toast.error(response.data.message || "Failed to fetch suppliers");
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
      const response = await axios.post(
        `${API_URL}/api/abid-jewelry-ms/getItemByBarcode`,
        { barcode: barcodeValue },
        {
          headers: {
            "x-access-token": token,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        const item = response.data.data;
        const previousPrices =
          response.data.previousCostPricesHistory
            ?.map((history: any) => history.price)
            .join(" / ") || "N/A";

        const newItem: PurchaseInvoiceItem = {
          userImage: item.itemImage ? `${API_URL}${item.itemImage}` : chain,
          sno: (createPurchaseInvoiceData.length + 1)
            .toString()
            .padStart(2, "0"),
          barcode: item.barcode,
          refrenceNumber: item?.refrenceNumber || "N/A",
          productName: item.category?.name || "Unknown Product",
          qty: 0,
          previousBuying: previousPrices,
          costPrice: 0,
          total: 0,
          salePrice: 0,
          action: "eye",
          itemId: item._id,
        };

        setCreatePurchaseInvoiceData((prev) => [...prev, newItem]);
        toast.success(`Item "${newItem.productName}" added successfully`);
      } else {
        toast.error(
          response.data.message || "Item not found with this barcode"
        );
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
      const response = await axios.post(
        `${API_URL}/api/abid-jewelry-ms/getPurchaseOrderByOrderId`,
        { purchaseOrderId: orderId },
        {
          headers: {
            "x-access-token": token,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        const order = response.data.data;
        const previousPrices =
          response.data.previousCostPricesHistory
            ?.map((history: any) => history.price)
            .join(" / ") || "N/A";

        const newItem: PurchaseInvoiceItem = {
          userImage: chain,
          sno: (createPurchaseInvoiceData.length + 1)
            .toString()
            .padStart(2, "0"),
          barcode: "N/A",
          refrenceNumber: order.purchaseOrderId,
          productName: order.category?.[0]?.name || "Purchase Order Item",
          qty: 0,
          previousBuying: previousPrices,
          costPrice: 0,
          total: 0,
          salePrice: 0,
          action: "eye",
          purchaseOrderId: order._id,
        };

        setCreatePurchaseInvoiceData((prev) => [...prev, newItem]);
        toast.success(`Purchase order "${orderId}" added successfully`);
      } else {
        toast.error(response.data.message || "Purchase order not found");
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
    if (!formData.barcode.trim() && !formData.purchaseOrderReference.trim()) {
      toast.error("Please enter either barcode or purchase order reference");
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

  //   const handleItemUpdate = async (index: number, field: string, value: any) => {
  //     if (field === "qty" && (value === 0 || value === "0")) {
  //       toast.error("Quantity cannot be 0");
  //       return;
  //     }

  //     const updatedItems = [...createPurchaseInvoiceData];
  //     const item = updatedItems[index];

  //     // Update the field
  //     updatedItems[index] = { ...item, [field]: value };

  //     // Calculate total when qty or costPrice changes
  //     if (field === "qty" || field === "costPrice") {
  //       const qty =
  //         field === "qty"
  //           ? value === ""
  //             ? 0
  //             : parseFloat(value) || 0
  //           : item.qty;
  //       const costPrice =
  //         field === "costPrice"
  //           ? value === ""
  //             ? 0
  //             : parseFloat(value) || 0
  //           : item.costPrice;
  //       updatedItems[index].total = qty * costPrice;
  //     }

  //     setCreatePurchaseInvoiceData(updatedItems);

  //     // Update item via API if it has an _id (existing item)
  //     if (
  //       item._id &&
  //       (field === "qty" || field === "costPrice" || field === "salePrice")
  //     ) {
  //       try {
  //         const token = getAuthToken();
  //         if (!token) {
  //           toast.error("Authentication token not found. Please login again.");
  //           return;
  //         }

  //         const updateData: any = {};
  //         if (field === "qty") updateData.quantity = value;
  //         if (field === "costPrice") updateData.costPrice = value;
  //         if (field === "salePrice") updateData.sellPrice = value;

  //         await axios.put(
  //           `${API_URL}/api/abid-jewelry-ms/updateInvoiceItem/${invoiceId}/${item._id}`,
  //           updateData,
  //           {
  //             headers: {
  //               "x-access-token": token,
  //               "Content-Type": "application/json",
  //             },
  //           }
  //         );
  //       } catch (error) {
  //         console.error("Error updating item:", error);
  //         // toast.error("Failed to update item");
  //       }
  //     }
  //   };

  // Recent Working Code
  // const handleItemUpdate = async (index: number, field: string, value: any) => {
  //   // Add debugging to see what values are being passed
  //   console.log("handleItemUpdate called:", {
  //     field,
  //     value,
  //     type: typeof value,
  //   });

  //   // Improved quantity validation
  //   if (field === "qty") {
  //     const numValue = parseFloat(value);
  //     console.log("Quantity validation:", {
  //       value,
  //       numValue,
  //       isZero: numValue === 0,
  //     });

  //     if (value === 0 || value === "0" || numValue === 0 || !numValue) {
  //       toast.error("Quantity cannot be 0");
  //       return;
  //     }
  //   }

  //   const updatedItems = [...createPurchaseInvoiceData];
  //   const item = updatedItems[index];

  //   // Update the specific field first
  //   updatedItems[index] = { ...item, [field]: value };

  //   // Calculate total when qty or costPrice changes
  //   if (field === "qty" || field === "costPrice") {
  //     const qty =
  //       field === "qty"
  //         ? value === ""
  //           ? 0
  //           : parseFloat(value) || 0
  //         : updatedItems[index].qty; // Use updated value
  //     const costPrice =
  //       field === "costPrice"
  //         ? value === ""
  //           ? 0
  //           : parseFloat(value) || 0
  //         : updatedItems[index].costPrice; // Use updated value
  //     updatedItems[index].total = qty * costPrice;
  //   }

  //   setCreatePurchaseInvoiceData(updatedItems);

  //   // Update item via API if it has an _id (existing item)
  //   if (
  //     item._id &&
  //     (field === "qty" || field === "costPrice" || field === "salePrice")
  //   ) {
  //     try {
  //       const token = getAuthToken();
  //       if (!token) {
  //         toast.error("Authentication token not found. Please login again.");
  //         return;
  //       }

  //       const updateData: any = {};
  //       if (field === "qty") updateData.quantity = value;
  //       if (field === "costPrice") updateData.costPrice = value;
  //       if (field === "salePrice") updateData.sellPrice = value;

  //       await axios.put(
  //         `${API_URL}/api/abid-jewelry-ms/updateInvoiceItem/${invoiceId}/${item._id}`,
  //         updateData,
  //         {
  //           headers: {
  //             "x-access-token": token,
  //             "Content-Type": "application/json",
  //           },
  //         }
  //       );
  //     } catch (error) {
  //       console.error("Error updating item:", error);
  //       // toast.error("Failed to update item");
  //     }
  //   }
  // };

  const handleItemUpdate = async (index: number, field: string, value: any) => {
    console.log("handleItemUpdate called:", {
      field,
      value,
      type: typeof value,
    });

    if (field === "qty") {
      const numValue = parseFloat(value);
      if (value === 0 || value === "0" || numValue === 0 || !numValue) {
        toast.error("Quantity cannot be 0");
        return;
      }
    }

    const updatedItems = [...createPurchaseInvoiceData];
    const item = updatedItems[index];

    // Update the specific field first
    updatedItems[index] = { ...item, [field]: value };

    // Calculate total when qty or costPrice changes
    if (field === "qty" || field === "costPrice") {
      const qty =
        field === "qty"
          ? value === ""
            ? 0
            : parseFloat(value) || 0
          : updatedItems[index].qty;
      const costPrice =
        field === "costPrice"
          ? value === ""
            ? 0
            : parseFloat(value) || 0
          : updatedItems[index].costPrice;
      updatedItems[index].total = qty * costPrice;
    }

    setCreatePurchaseInvoiceData(updatedItems);

    // Only call API for existing items (items with _id)
    if (
      item._id &&
      (field === "qty" || field === "costPrice" || field === "salePrice")
    ) {
      try {
        const token = getAuthToken();
        if (!token) {
          toast.error("Authentication token not found. Please login again.");
          return;
        }

        const updateData: any = {};
        if (field === "qty") updateData.quantity = value;
        if (field === "costPrice") updateData.costPrice = value;
        if (field === "salePrice") updateData.sellPrice = value;

        await axios.put(
          `${API_URL}/api/abid-jewelry-ms/updateInvoiceItem/${invoiceId}/${item._id}`,
          updateData,
          {
            headers: {
              "x-access-token": token,
              "Content-Type": "application/json",
            },
          }
        );
      } catch (error) {
        console.error("Error updating existing item:", error);
        toast.error("Failed to update item");
      }
    }
    // For new items (without _id), only update local state
    // They will be handled when updatePurchaseInvoice API is called
  };

  // const handleDeleteItem = (index: number) => {
  //   setCreatePurchaseInvoiceData((prev) => {
  //     const updated = prev.filter((_, i) => i !== index);
  //     // Update serial numbers
  //     const reindexed = updated.map((item, i) => ({
  //       ...item,
  //       sno: (i + 1).toString().padStart(2, "0"),
  //     }));
  //     toast.success("Item removed successfully");
  //     return reindexed;
  //   });
  // };

  const handleDeleteItem = async (index: number) => {
    const itemToDelete = createPurchaseInvoiceData[index];

    // If item has _id, it's an existing item - call delete API
    if (itemToDelete._id) {
      try {
        const token = getAuthToken();
        if (!token) {
          toast.error("Authentication token not found. Please login again.");
          return;
        }

        setLoading(true);
        const response = await axios.delete(
          `${API_URL}/api/abid-jewelry-ms/deleteInvoiceItem/${invoiceId}/${itemToDelete._id}`,
          {
            headers: {
              "x-access-token": token,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.data.success) {
          // Remove from local state after successful API call
          setCreatePurchaseInvoiceData((prev) => {
            const updated = prev.filter((_, i) => i !== index);
            // Update serial numbers
            const reindexed = updated.map((item, i) => ({
              ...item,
              sno: (i + 1).toString().padStart(2, "0"),
            }));
            return reindexed;
          });
          toast.success("Item deleted successfully");
        } else {
          toast.error(response.data.message || "Failed to delete item");
        }
      } catch (error) {
        console.error("Error deleting item:", error);
        toast.error("Failed to delete item. Please try again.");
      } finally {
        setLoading(false);
      }
    } else {
      // If item doesn't have _id, it's a new item - just remove from local state
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
    }
  };

  const handleUpdateInvoice = async () => {
    // Form validation
    if (!formData.supplierCompanyName.trim()) {
      toast.error("Supplier company name is required");
      return;
    }
    // if (!formData.referenceNumber.trim()) {
    //   toast.error("Reference number is required");
    //   return;
    // }
    if (!formData.dateOfReceiving.trim()) {
      toast.error("Date of receiving is required");
      return;
    }
    if (!formData.paymentDueDate.trim()) {
      toast.error("Payment due date is required");
      return;
    }
    // if (createPurchaseInvoiceData.length === 0) {
    //   toast.error("Please add at least one item to update invoice");
    //   return;
    // }

    // Check if all items have required fields
    // for (let i = 0; i < createPurchaseInvoiceData.length; i++) {
    //   const item = createPurchaseInvoiceData[i];
    //   if (item.qty <= 0) {
    //     toast.error(`Item ${i + 1}: Quantity must be greater than 0`);
    //     return;
    //   }
    //   if (item.costPrice <= 0) {
    //     toast.error(`Item ${i + 1}: Cost price must be greater than 0`);
    //     return;
    //   }
    // }

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
          itemData.itemBarcode = item.itemId;
        } else if (item.purchaseOrderId) {
          itemData.purchaseOrderId = item.purchaseOrderId;
        }

        // Include item ID if it exists (for existing items)
        if (item._id) {
          itemData._id = item._id;
        }

        return itemData;
      });

      const requestBody = {
        supplierCompanyName: selectedSupplier._id,
        dateReceiving: formData.dateOfReceiving,
        dueDate: formData.paymentDueDate,
        items: items, // This will handle new items
        description: formData.termsAndConditions,
      };

      const response = await axios.put(
        `${API_URL}/api/abid-jewelry-ms/updatePurchaseInvoice/${invoiceId}`,
        requestBody,
        {
          headers: {
            "x-access-token": token,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        toast.success("Purchase invoice updated successfully!");
        navigate("/dashboard/inventory/purchase-invoice");
      } else {
        toast.error(response.data.message || "Failed to update invoice");
      }
    } catch (error) {
      console.error("Error updating invoice:", error);
      toast.error("Failed to update invoice. Please try again.");
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

  if (initialLoading) {
    return (
      <div className="mx-auto px-3 py-6 sm:px-4 md:px-6 xl:px-8 xl:py-6 w-full rounded-lg">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
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
              noResultsMessage="No supplier found"
              searchable={true}
            />
          </div>
          {/* <div className="flex flex-col">
            <label htmlFor="" className="mb-1">
              Reference Number <span className="text-red-500">*</span>
            </label>
            <Input
              placeholder="21321412"
              className="w-full outline-none"
              type="text"
              value={formData.referenceNumber}
              onChange={(e) =>
                handleInputChange("referenceNumber", e.target.value)
              }
            //   disable={true}
            />
          </div> */}
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
