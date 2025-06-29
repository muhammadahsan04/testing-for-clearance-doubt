import React, { useState, useEffect } from "react";
import Dropdown from "../../../components/Dropdown";
import Input from "../../../components/Input";
import DatePicker from "../../../components/DatePicker";
import CreatePurchaseReturnTable from "../../../components/CreatePurchaseReturnTable";
import { useNavigate } from "react-router-dom";
import Button from "../../../components/Button";
import { toast } from "react-toastify";
import axios from "axios";

interface Column {
  header: string;
  accessor: string;
  type?: "text" | "image" | "status" | "actions" | "input";
}

interface FormData {
  dateOfReturning: string;
  barcode: string;
  termsAndConditions: string;
}

interface Supplier {
  _id: string;
  companyName: string;
  supplierId: string;
}

interface PurchaseReturnItem {
  sno: string;
  barcode: string;
  pInvoice: string;
  productName: string;
  qty: number;
  totalqty: string;
  costPrice: number;
  credit: number;
  status: string;
  action: string;
  itemId?: string;
  purchaseInvoiceId?: string;
  userImage?: string;
  maxQuantity?: number;
  originalCostPrice?: number;
  supplierName?: string;
  goldWeight?: string;
  diamondWeight?: string;
  size?: string;
  unitType?: string;
  sellPrice?: number;
  goldCategory?: string;
  style?: string;
  subCategory?: string;
  searchTag?: string;
  length?: string;
  mm?: string;
}

const CreatePurchaseReturn: React.FC = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<{
    id: string;
    name: string;
  } | null>(null);

  //   const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [formData, setFormData] = useState<FormData>({
    dateOfReturning: "",
    barcode: "",
    termsAndConditions: "",
  });

  const [createPurchaseReturnData, setCreatePurchaseReturnData] = useState<
    PurchaseReturnItem[]
  >([]);

  const CreatePurchaseReturnColumn: Column[] = [
    { header: "S.no", accessor: "sno", type: "text" },
    { header: "Barcode", accessor: "barcode", type: "text" },
    { header: "P . Invoice", accessor: "pInvoice", type: "text" },
    { header: "Product Name", accessor: "productName", type: "image" },
    { header: "Total Qty", accessor: "totalqty", type: "text" },
    { header: "Return Qty", accessor: "qty", type: "input" },
    { header: "Cost Price ($)", accessor: "costPrice", type: "text" },
    {
      header: "Credit ($)",
      accessor: "credit",
      type: "text",
    },
    { header: "Status", accessor: "status", type: "status" },
    { header: "Actions", accessor: "actions", type: "actions" },
  ];

  const navigate = useNavigate();

  // Get auth token from localStorage or wherever you store it
  const getAuthToken = () => {
    let token = localStorage.getItem("token");
    if (!token) {
      token = sessionStorage.getItem("token");
    }
    return token;
  };

  const API_URL = import.meta.env.VITE_BASE_URL || "http://192.168.100.18:9000";

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Validate add item form
  const validateAddItem = () => {
    if (!formData.barcode.trim()) {
      toast.error("Please enter barcode");
      return false;
    }
    return true;
  };

  // Form validation
  //   const validateForm = () => {
  //     if (!formData.supplierCompanyName.trim()) {
  //       toast.error("Supplier company name is required");
  //       return false;
  //     }
  //     if (!formData.dateOfReturning.trim()) {
  //       toast.error("Date of returning is required");
  //       return false;
  //     }
  //     return true;
  //   };

  const validateForm = () => {
    if (!selectedSupplier) {
      toast.error("Please add at least one item to get supplier information");
      return false;
    }
    if (!formData.dateOfReturning.trim()) {
      toast.error("Date of returning is required");
      return false;
    }
    return true;
  };

  // Validate invoice creation
  const validateInvoiceCreation = () => {
    if (!validateForm()) {
      return false;
    }
    if (createPurchaseReturnData.length === 0) {
      toast.error("Please add at least one item to create return invoice");
      return false;
    }
    // Check if all items have required fields
    for (let i = 0; i < createPurchaseReturnData.length; i++) {
      const item = createPurchaseReturnData[i];
      if (item.qty <= 0) {
        toast.error(`Item ${i + 1}: Quantity must be greater than 0`);
        return false;
      }
      //   if (item.qty > (item.maxQuantity || 0)) {
      //     toast.error(
      //       `Item ${i + 1}: Quantity cannot exceed ${item.maxQuantity}`
      //     );
      //     return false;
      //   }
    }
    return true;
  };

  const fetchPurchaseInvoiceByBarcode = async (barcodeValue: string) => {
    try {
      const token = getAuthToken();
      if (!token) {
        toast.error("Authentication token not found. Please login again.");
        return;
      }

      setLoading(true);
      const response = await fetch(
        `${API_URL}/api/abid-jewelry-ms/getPurchaseInvoiceByBarcode`,
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
        const { invoice, matchedItem } = result.data;

        // Set supplier information from the invoice
        if (invoice.supplierCompanyName) {
          setSelectedSupplier({
            id: invoice.supplierCompanyName._id,
            name: invoice.supplierCompanyName.companyName,
          });
        }

        // const newItem: PurchaseReturnItem = {
        //   sno: (createPurchaseReturnData.length + 1)
        //     .toString()
        //     .padStart(2, "0"),
        //   barcode: matchedItem.itemBarcode.barcode,
        //   pInvoice: invoice.piId,
        //   productName:
        //     matchedItem.itemBarcode.category?.name || "Unknown Product",
        //   totalqty: matchedItem?.quantity,
        //   qty: 0,
        //   costPrice: matchedItem.costPrice,
        //   credit: invoice?.totals?.credit,
        //   status: invoice?.status,
        //   action: "eye",
        //   itemId: matchedItem.itemBarcode._id,
        //   purchaseInvoiceId: invoice._id,
        //   userImage: matchedItem.itemBarcode.itemImage
        //     ? `${API_URL}${matchedItem.itemBarcode.itemImage}`
        //     : "",
        //   maxQuantity: matchedItem.quantity - matchedItem.returnedQuantity,
        //   originalCostPrice: matchedItem.costPrice,
        // };

        // Check if item already exists

        const newItem: PurchaseReturnItem = {
          sno: (createPurchaseReturnData.length + 1)
            .toString()
            .padStart(2, "0"),
          barcode: matchedItem?.itemBarcode.barcode,
          pInvoice: invoice.piId,
          productName:
            matchedItem?.itemBarcode?.category?.name || "Unknown Product",
          totalqty: matchedItem?.quantity,
          qty: 0,
          costPrice: matchedItem?.costPrice,
          credit: invoice?.totals?.credit,
          status: invoice?.status,
          action: "eye",
          itemId: matchedItem?.itemBarcode._id,
          purchaseInvoiceId: invoice._id,
          userImage: matchedItem?.itemBarcode.itemImage
            ? `${API_URL}${matchedItem?.itemBarcode.itemImage}`
            : "",
          maxQuantity: matchedItem?.quantity - matchedItem?.returnedQuantity,
          originalCostPrice: matchedItem?.costPrice,
          // Add these new fields from API response
          supplierName: invoice.supplierCompanyName?.companyName,
          goldWeight: matchedItem?.itemBarcode.goldWeight,
          diamondWeight: matchedItem?.itemBarcode.diamondWeight,
          size: matchedItem?.itemBarcode.size,
          unitType: matchedItem?.itemBarcode.unitType,
          sellPrice: matchedItem?.sellPrice,
          goldCategory: matchedItem?.itemBarcode.goldCategory,
          style: matchedItem?.itemBarcode.style,
          subCategory: matchedItem?.itemBarcode.subCategory?.name,
          searchTag: matchedItem?.itemBarcode.searchTag,
          length: matchedItem?.itemBarcode.length,
          mm: matchedItem?.itemBarcode.mm,
        };

        const existingItemIndex = createPurchaseReturnData.findIndex(
          (item) =>
            item.itemId === newItem.itemId &&
            item.purchaseInvoiceId === newItem.purchaseInvoiceId
        );

        if (existingItemIndex !== -1) {
          toast.error("This item is already added to the return list");
          return;
        }

        setCreatePurchaseReturnData((prev) => [...prev, newItem]);
        toast.success(`Item "${newItem.productName}" added successfully`);
      } else {
        toast.error(result.message || "Item not found with this barcode");
      }
    } catch (error) {
      console.error("Error fetching purchase invoice by barcode:", error);
      toast.error(
        "Error fetching item. Please check your connection and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = async () => {
    if (!validateAddItem()) {
      return;
    }

    await fetchPurchaseInvoiceByBarcode(formData.barcode.trim());

    // Clear inputs after adding
    setFormData((prev) => ({
      ...prev,
      barcode: "",
    }));
  };

  const handleItemUpdate = (index: number, field: string, value: any) => {
    setCreatePurchaseReturnData((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };

      // Calculate credit when qty changes
      if (field === "qty") {
        const qty = value === "" ? 0 : parseFloat(value) || 0;
        const costPrice =
          updated[index].originalCostPrice || updated[index].costPrice;
        updated[index].credit = qty * costPrice;
      }

      return updated;
    });
  };

  const handleDeleteItem = (index: number) => {
    setCreatePurchaseReturnData((prev) => {
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

  //   const handleCreateInvoice = async () => {
  //     if (!validateInvoiceCreation()) {
  //       return;
  //     }

  //     try {
  //       setLoading(true);
  //       const token = getAuthToken();
  //       if (!token) {
  //         toast.error("Authentication token not found. Please login again.");
  //         return;
  //       }

  //       // Find supplier ID from suppliers array
  //       const selectedSupplier = suppliers.find(
  //         (supplier) => supplier.companyName === formData.supplierCompanyName
  //       );

  //       if (!selectedSupplier) {
  //         toast.error("Please select a valid supplier");
  //         return;
  //       }

  //       // Get the first item's purchase invoice ID (assuming all items are from the same invoice)
  //       const purchaseInvoiceId = createPurchaseReturnData[0]?.purchaseInvoiceId;
  //       if (!purchaseInvoiceId) {
  //         toast.error("Purchase invoice ID not found");
  //         return;
  //       }

  //       // Prepare items array
  //       const items = createPurchaseReturnData.map((item) => ({
  //         itemId: item.itemId,
  //         quantity: item.qty,
  //         cost: item.originalCostPrice || item.costPrice,
  //       }));

  //       const requestBody = {
  //         purchaseInvoiceId: purchaseInvoiceId,
  //         supplierId: selectedSupplier._id,
  //         dateOfReturn: new Date(formData.dateOfReturning).toISOString(),
  //         items: items,
  //         note: formData.termsAndConditions || "Purchase return",
  //       };

  //       const response = await axios.post(
  //         `${API_URL}/api/abid-jewelry-ms/createPurchaseReturnInvoice`,
  //         requestBody,
  //         {
  //           headers: {
  //             "x-access-token": token,
  //             "Content-Type": "application/json",
  //           },
  //         }
  //       );

  //       if (response.data) {
  //         toast.success("Purchase return invoice created successfully!");
  //         navigate("/dashboard/inventory/purchase-invoice");
  //       }
  //     } catch (error) {
  //       console.error("Error creating return invoice:", error);
  //       toast.error("Failed to create return invoice. Please try again.");
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

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

      if (!selectedSupplier) {
        toast.error("Supplier information not found");
        return;
      }

      // Get the first item's purchase invoice ID
      const purchaseInvoiceId = createPurchaseReturnData[0]?.purchaseInvoiceId;
      if (!purchaseInvoiceId) {
        toast.error("Purchase invoice ID not found");
        return;
      }

      // Prepare items array
      const items = createPurchaseReturnData.map((item) => ({
        itemId: item.itemId,
        quantity: item.qty,
        cost: item.originalCostPrice || item.costPrice,
      }));

      const requestBody = {
        purchaseInvoiceId: purchaseInvoiceId,
        supplierId: selectedSupplier.id,
        dateOfReturn: new Date(formData.dateOfReturning).toISOString(),
        items: items,
        note: formData.termsAndConditions || "Purchase return",
      };

      const response = await axios.post(
        `${API_URL}/api/abid-jewelry-ms/createPurchaseReturnInvoice`,
        requestBody,
        {
          headers: {
            "x-access-token": token,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data) {
        toast.success("Purchase return invoice created successfully!");
        navigate("/dashboard/inventory/purchase-invoice");
      }
    } catch (error) {
      console.error("Error creating return invoice:", error);
      toast.error("Failed to create return invoice. Please try again.");
    } finally {
      setLoading(false);
    }
    // const supplierOptions = suppliers.map((supplier) => supplier.companyName);
  };

  //   const supplierOptions = suppliers.map((supplier) => supplier.companyName);

  return (
    <div className="mx-auto px-3 py-6 sm:px-4 md:px-6 xl:px-8 xl:py-6 w-full rounded-lg shadow-md">
      <h2 className="Source-Sans-Pro-font font-semibold text-[#5D6679] text-[20px] mb-2">
        <span
          onClick={() =>
            navigate("/dashboard/inventory/purchase-return", { replace: true })
          }
          className="cursor-pointer"
        >
          Purchase Return
        </span>{" "}
        / <span className="text-black">Create Purchase Return Invoice</span>
      </h2>

      <div className="bg-white p-6 rounded-md">
        <h2 className="text-2xl font-semibold text-[#056BB7] mb-3">
          Purchase Return
        </h2>
        {/* <p className="font-bold text-gray-300 underline text-[20px] mb-3">
          Invoice #PR-837529
        </p> */}
        {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6 gap-y-6 mb-8 Poppins-font font-medium text-sm">
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
              Date of Returning <span className="text-red-500">*</span>
            </label>
            <DatePicker
              onChange={(e) =>
                handleInputChange("dateOfReturning", e.target.value)
              }
              type="date"
              className="w-full"
              value={formData.dateOfReturning}
            />
          </div>
        </div> */}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 gap-y-6 mb-8 Poppins-font font-medium text-sm">
          <div className="flex flex-col">
            <label htmlFor="" className="mb-1">
              Supplier Company Name
            </label>
            <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700">
              {selectedSupplier
                ? selectedSupplier.name
                : "Add item to see supplier"}
            </div>
          </div>
          <div className="flex flex-col">
            <label htmlFor="" className="mb-1">
              Date of Returning <span className="text-red-500">*</span>
            </label>
            <DatePicker
              onChange={(e) =>
                handleInputChange("dateOfReturning", e.target.value)
              }
              type="date"
              className="w-full"
              value={formData.dateOfReturning}
            />
          </div>
        </div>

        <div className="flex flex-col flex-1 mb-4">
          <label htmlFor="barcode" className="mb-1">
            Barcode <span className="text-red-500">*</span>
          </label>
          <Input
            placeholder="55325084"
            className="w-full outline-none"
            type="text"
            value={formData.barcode}
            onChange={(e) => handleInputChange("barcode", e.target.value)}
          />
        </div>
        <div className="flex items-end justify-end lg:justify-end mb-4">
          <Button
            text={loading ? "Adding..." : "Add Item"}
            className="w-full sm:w-auto bg-blue-600 text-white hover:bg-blue-700 border-none px-4"
            onClick={handleAddItem}
            disabled={loading}
          />
        </div>

        <div className="mb-4">
          <CreatePurchaseReturnTable
            eye={true}
            columns={CreatePurchaseReturnColumn}
            data={createPurchaseReturnData}
            tableTitle="Purchase Return"
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
            disabled={loading || createPurchaseReturnData.length === 0}
          >
            {loading ? "Creating..." : "Create Return Invoice"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatePurchaseReturn;
