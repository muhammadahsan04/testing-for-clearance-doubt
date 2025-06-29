import type React from "react";
import { useState, useEffect } from "react";
import Input from "../../../components/Input";
import Button from "../../../components/Button";
import Dropdown from "../../../components/Dropdown";
import DatePicker from "../../../components/DatePicker";
import type { UploadFile, UploadProps } from "antd";
import { Upload } from "antd";
import { useNavigate } from "react-router-dom";
import PurchaseOrderTable from "../../../components/PurchaseOrderTable";
import axios from "axios";
import { toast } from "react-toastify";
import { hasPermission } from "../sections/CoreSettings";


const API_URL = import.meta.env.VITE_BASE_URL || "http://192.168.100.254:9000";

interface Column {
  header: string;
  accessor: string;
  type?: "text" | "image" | "status" | "actions";
}

interface Supplier {
  _id: string;
  companyName: string;
}

interface Category {
  _id: string;
  name: string;
}

interface SubCategory {
  _id: string;
  name: string;
}

interface PurchaseOrderData {
  _id: string;
  purchaseOrderId: string;
  supplierCompanyName: {
    _id: string;
    companyName: string;
  };
  category: Array<{
    _id: string;
    name: string;
  }>;
  subCategory: Array<{
    _id: string;
    name: string;
  }>;
  productDetails: string;
  goldCategory: string;
  diamondWeight: string;
  diamondPricePerPc: number;
  diamondValue: string;
  goldWeight: string;
  goldPricePerPc: number;
  goldValue: string;
  length: string;
  mm: string;
  size: string;
  dateOfDelivery: string;
  quantity: number;
  costPrice: number;
  totalPrice: number;
  serviceCharge: number;
  grossPrice: number;
  remarks: string;
}

const getUserRole = () => {
  let role = localStorage.getItem("role");
  if (!role) {
    role = sessionStorage.getItem("role");
  }
  return role;
};

const PurchaseOrder: React.FC = () => {
  const [selectedZones, setSelectedZones] = useState<string[]>([]);
  const [password, setPassword] = useState<string>("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [image, setImage] = useState<UploadFile | null>(null);
  const [status, setStatus] = useState<"success" | "error" | null>(null);
  const [goldCategoryDropdownKey, setGoldCategoryDropdownKey] = useState(0);
  const [goldCategories, setGoldCategories] = useState<string[]>([]);
  const [goldCategory, setGoldCategory] = useState("");
  const [selectedGoldCategoryId, setSelectedGoldCategoryId] = useState("");
  const [goldCategoryData, setGoldCategoryData] = useState<any[]>([]);

  const [purchaseOrders, setPurchaseOrders] = useState<any[]>([]);
  const [tableLoading, setTableLoading] = useState(false);

  // API data states
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [loading, setLoading] = useState(false);

  // Modal states
  const [isEditing, setIsEditing] = useState(false);
  const [editingRow, setEditingRow] = useState<any>(null);
  const [showPurchaseOrderDetailModal, setShowPurchaseOrderDetailModal] =
    useState<any>(null);
  const [currentPurchaseOrderData, setCurrentPurchaseOrderData] =
    useState<PurchaseOrderData | null>(null);
  const [modalLoading, setModalLoading] = useState(false);

  // Selected names for display purposes (similar to AddZone.tsx)
  const [selectedCategoryNames, setSelectedCategoryNames] = useState<string[]>(
    []
  );
  const [selectedSubCategoryNames, setSelectedSubCategoryNames] = useState<
    string[]
  >([]);

  const userRole = getUserRole();
  const isAdmin = userRole === "Admin" || userRole === "SuperAdmin";
  const canCreate = isAdmin || hasPermission("Inventory", "create");
  const canUpdate = isAdmin || hasPermission("Inventory", "update");
  const canDelete = isAdmin || hasPermission("Inventory", "delete");

  const [editFormData, setEditFormData] = useState({
    supplierCompanyName: "",
    category: [] as string[],
    subCategory: [] as string[],
    productDetails: "",
    goldCategory: "",
    diamondWeight: "",
    diamondPricePerPc: "",
    diamondValue: "",
    goldWeight: "",
    goldPricePerPc: "",
    goldValue: "",
    length: "",
    mm: "",
    size: "",
    dateOfDelivery: "",
    quantity: "",
    costPrice: "",
    serviceCharge: "",
    grossPrice: "",
    remarks: "",
  });

  // Form states
  const [formData, setFormData] = useState({
    supplierCompanyName: "",
    category: [] as string[],
    subCategory: [] as string[],
    productDetails: "",
    goldCategory: "",
    diamondWeight: "",
    diamondPricePerPc: "",
    diamondValue: "",
    goldWeight: "",
    goldPricePerPc: "",
    goldValue: "",
    length: "",
    mm: "",
    size: "",
    dateOfDelivery: "",
    quantity: "",
    costPrice: "",
    serviceCharge: "",
    grossPrice: "",
    remarks: "",
  });

  const getAuthToken = () => {
    let token = localStorage.getItem("token");
    if (!token) {
      token = sessionStorage.getItem("token");
    }
    return token;
  };

  // Fetch Gold Categories
  const fetchGoldCategories = async () => {
    try {
      const token = getAuthToken();
      if (!token) {
        toast.error("Authentication token not found. Please login again.");
        return;
      }

      const response = await axios.get(
        `${API_URL}/api/abid-jewelry-ms/getAllGoldCategories`,
        {
          headers: {
            "x-access-token": token,
          },
        }
      );

      if (response.data.success) {
        setGoldCategoryData(response.data.data);
        setGoldCategories(
          response.data.data.map((goldCat: any) => goldCat.name)
        );
      }
    } catch (error) {
      console.error("Error fetching gold categories:", error);
      toast.error("Failed to fetch gold categories");
    }
  };

  const handleGoldCategorySelect = (goldCategoryName: string) => {
    const selectedGoldCategoryObj = goldCategoryData.find(
      (goldCat) => goldCat.name === goldCategoryName
    );
    if (selectedGoldCategoryObj) {
      setGoldCategory(goldCategoryName);
      setSelectedGoldCategoryId(selectedGoldCategoryObj._id);
    }
  };

  // Fetch suppliers
  const fetchSuppliers = async () => {
    try {
      const token = getAuthToken();
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
      }
    } catch (error) {
      console.error("Error fetching suppliers:", error);
      toast.error("Failed to fetch suppliers");
    }
  };

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const token = getAuthToken();
      const response = await axios.get(
        `${API_URL}/api/abid-jewelry-ms/getAllCategory`,
        {
          headers: {
            "x-access-token": token,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.data.success) {
        setCategories(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to fetch categories");
    }
  };

  // Fetch subcategories
  const fetchSubCategories = async () => {
    try {
      const token = getAuthToken();
      const response = await axios.get(
        `${API_URL}/api/abid-jewelry-ms/getAllSubCategory`,
        {
          headers: {
            "x-access-token": token,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.data.success) {
        setSubCategories(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching subcategories:", error);
      toast.error("Failed to fetch subcategories");
    }
  };

  // Fetch purchase orders
  const fetchPurchaseOrders = async () => {
    try {
      setTableLoading(true);
      const token = getAuthToken();
      if (!token) {
        toast.error("Authentication token not found. Please login again.");
        return;
      }

      const response = await axios.get(
        `${API_URL}/api/abid-jewelry-ms/getAllpurchaseOrders`,
        {
          headers: {
            "x-access-token": token,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        const transformedData = response.data.data.map(
          (order: any, index: number) => ({
            id: (index + 1).toString().padStart(2, "0"),
            supplier: order.supplierCompanyName?.companyName || "N/A",
            productName: order.productDetails || "N/A",
            category: order.category?.name || "N/A",
            subCategory: order.subCategory?.name || "N/A",
            quantity: order.quantity?.toString() || "0",
            price: order.costPrice?.toString() || "0",
            total: order.totalPrice?.toString() || "0",
            action: "eye",
            _id: order._id,
            purchaseOrderId: order.purchaseOrderId,
          })
        );
        setPurchaseOrders(transformedData);
      }
    } catch (error) {
      console.error("Error fetching purchase orders:", error);
      toast.error("Failed to fetch purchase orders");
    } finally {
      setTableLoading(false);
    }
  };

  // Delete purchase order
  const deletePurchaseOrder = async (purchaseOrderId: string) => {
    try {
      const token = getAuthToken();
      if (!token) {
        toast.error("Authentication token not found. Please login again.");
        return;
      }

      const response = await axios.delete(
        `${API_URL}/api/abid-jewelry-ms/deletePurchaseOrder/${purchaseOrderId}`,
        {
          headers: {
            "x-access-token": token,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        toast.success("Purchase order deleted successfully!");
        fetchPurchaseOrders();
        setShowDeleteModal(false);
        setSelectedUser(null);
      } else {
        toast.error(response.data.message || "Failed to delete purchase order");
      }
    } catch (error) {
      console.error("Error deleting purchase order:", error);
      toast.error("Failed to delete purchase order");
    }
  };

  // Fetch single purchase order
  const fetchSinglePurchaseOrder = async (purchaseOrderId: string) => {
    try {
      setModalLoading(true);
      const token = getAuthToken();
      if (!token) {
        toast.error("Authentication token not found. Please login again.");
        return null;
      }

      const response = await axios.get(
        `${API_URL}/api/abid-jewelry-ms/getOnepurchaseOrder/${purchaseOrderId}`,
        {
          headers: {
            "x-access-token": token,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        return response.data.data;
      } else {
        toast.error(response.data.message || "Failed to fetch purchase order");
        return null;
      }
    } catch (error) {
      console.error("Error fetching purchase order:", error);
      toast.error("Failed to fetch purchase order");
      return null;
    } finally {
      setModalLoading(false);
    }
  };
  const updatePurchaseOrder = async (
    purchaseOrderId: string,
    updateData: any
  ) => {
    try {
      setLoading(true);
      const token = getAuthToken();
      if (!token) {
        toast.error("Authentication token not found. Please login again.");
        return;
      }

      const response = await axios.put(
        `${API_URL}/api/abid-jewelry-ms/updatePurchaseOrder/${purchaseOrderId}`,
        updateData,
        {
          headers: {
            "x-access-token": token,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        toast.success("Purchase order updated successfully!");
        setIsEditing(false);
        setEditingRow(null);
        setCurrentPurchaseOrderData(null);
        // Reset edit form data
        setEditFormData({
          supplierCompanyName: "",
          category: [],
          subCategory: [],
          productDetails: "",
          goldCategory: "",
          diamondWeight: "",
          diamondPricePerPc: "",
          diamondValue: "",
          goldWeight: "",
          goldPricePerPc: "",
          goldValue: "",
          length: "",
          mm: "",
          size: "",
          dateOfDelivery: "",
          quantity: "",
          costPrice: "",
          serviceCharge: "",
          grossPrice: "",
          remarks: "",
        });
        fetchPurchaseOrders();
      } else {
        toast.error(response.data.message || "Failed to update purchase order");
      }
    } catch (error) {
      console.error("Error updating purchase order:", error);
      toast.error("Failed to update purchase order");
    } finally {
      setLoading(false);
    }
  };

  const handleEditInputChange = (field: string, value: any) => {
    setEditFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Auto-calculate values for edit form
    if (field === "diamondWeight" || field === "diamondPricePerPc") {
      const weight =
        field === "diamondWeight"
          ? Number.parseFloat(value) || 0
          : Number.parseFloat(editFormData.diamondWeight) || 0;
      const price =
        field === "diamondPricePerPc"
          ? Number.parseFloat(value) || 0
          : Number.parseFloat(editFormData.diamondPricePerPc) || 0;
      setEditFormData((prev) => ({
        ...prev,
        diamondValue: (weight * price).toString(),
      }));
    }

    // Add this block for gold category handling
    // if (field === "goldCategory") {
    //   const selectedGoldCategoryObj = goldCategoryData.find(
    //     (goldCat) => goldCat.name === value
    //   );
    //   if (selectedGoldCategoryObj) {
    //     setEditFormData((prev) => ({
    //       ...prev,
    //       goldCategory: selectedGoldCategoryObj._id, // Store ID in form data
    //     }));
    //   }
    // }

    if (field === "goldWeight" || field === "goldPricePerPc") {
      const weight =
        field === "goldWeight"
          ? Number.parseFloat(value) || 0
          : Number.parseFloat(editFormData.goldWeight) || 0;
      const price =
        field === "goldPricePerPc"
          ? Number.parseFloat(value) || 0
          : Number.parseFloat(editFormData.goldPricePerPc) || 0;
      setEditFormData((prev) => ({
        ...prev,
        goldValue: (weight * price).toString(),
      }));
    }

    if (field === "costPrice" || field === "serviceCharge") {
      const cost =
        field === "costPrice"
          ? Number.parseFloat(value) || 0
          : Number.parseFloat(editFormData.costPrice) || 0;
      const service =
        field === "serviceCharge"
          ? Number.parseFloat(value) || 0
          : Number.parseFloat(editFormData.serviceCharge) || 0;
      setEditFormData((prev) => ({
        ...prev,
        grossPrice: (cost + service).toString(),
      }));
    }
  };

  // Handle view button click
  const handleViewClick = async (row: any) => {
    const purchaseOrderData = await fetchSinglePurchaseOrder(row._id);
    if (purchaseOrderData) {
      setCurrentPurchaseOrderData(purchaseOrderData);
      setShowPurchaseOrderDetailModal(row);
    }
  };

  useEffect(() => {
    fetchSuppliers();
    fetchCategories();
    fetchSubCategories();
    fetchGoldCategories();
    fetchPurchaseOrders();
  }, []);

  // Handle category selection
  const handleCategorySelect = (categoryId: string, categoryName: string) => {
    if (!formData.category.includes(categoryId)) {
      setFormData((prev) => ({
        ...prev,
        category: [...prev.category, categoryId],
      }));
      setSelectedCategoryNames((prev) => [...prev, categoryName]);
    } else {
      toast.info("This category is already selected");
    }
  };

  // Handle subcategory selection
  const handleSubCategorySelect = (
    subCategoryId: string,
    subCategoryName: string
  ) => {
    if (!formData.subCategory.includes(subCategoryId)) {
      setFormData((prev) => ({
        ...prev,
        subCategory: [...prev.subCategory, subCategoryId],
      }));
      setSelectedSubCategoryNames((prev) => [...prev, subCategoryName]);
    } else {
      toast.info("This subcategory is already selected");
    }
  };

  const featuredProps: UploadProps = {
    name: "file",
    action: "https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload",
    showUploadList: false,
    maxCount: 1,
    onChange(info) {
      const file = info.file;
      console.log("file", file);

      if (file.status === "done") {
        toast.success(`${file.name} uploaded successfully`);
        setImage(file);
        setStatus("success");
      } else if (file.status === "error") {
        toast.error(`${file.name} upload failed`);
        setImage(file);
        setStatus("error");
      }
    },
  };

  const generatePassword = () => {
    const length = 12;
    const charset =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";
    let generatedPassword = "";

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      generatedPassword += charset[randomIndex];
    }

    setPassword(generatedPassword);
  };

  const navigate = useNavigate();

  const columns: Column[] = [
    { header: "ID", accessor: "id", type: "text" },
    { header: "Supplier", accessor: "supplier", type: "text" },
    { header: "Product Name", accessor: "productName", type: "text" },
    { header: "Category", accessor: "category", type: "text" },
    { header: "Sub Category", accessor: "subCategory", type: "text" },
    { header: "Qty", accessor: "quantity", type: "text" },
    { header: "Price ($)", accessor: "price", type: "text" },
    { header: "Total ($)", accessor: "total", type: "text" },
    { header: "Actions", accessor: "actions", type: "actions" },
  ];

  return (
    <div className="w-full mx-auto px-3 py-6 sm:px-4 md:px-6 xl:px-8 xl:py-8">
      <div className="bg-white rounded-lg shadow-md px-4 md:px-10 py-6 mb-8">
        <form
          className=""
          onSubmit={(e) => {
            e.preventDefault();
            createPurchaseOrder();
          }}
        >
          <div className="">
            <p className="Source-Sans-Pro-font text-[#056BB7] font-semibold text-[24px] m-0">
              Purchase Order
            </p>
            <div className="mt-6 mb-4 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-16 xl:gap-32 text-[15px] Poppins-font font-medium">
              {/* Right Side */}
              <div className="space-y-4">
                <div className="flex flex-col">
                  <label htmlFor="" className="mb-1">
                    MM
                  </label>
                  <Input
                    placeholder="eg: 7"
                    value={formData.mm}
                    onChange={(e) => handleInputChange("mm", e.target.value)}
                    className="outline-none focus:outline-none w-full"
                  />
                </div>

                <div className="flex flex-col">
                  <label htmlFor="" className="mb-1">
                    Size
                  </label>
                  <Input
                    placeholder="eg: 7"
                    value={formData.size}
                    onChange={(e) => handleInputChange("size", e.target.value)}
                    className="outline-none focus:outline-none w-full"
                  />
                </div>

                <div className="flex flex-col w-full">
                  <label className="mb-1">Date of Delivery</label>
                  <DatePicker
                    value={formData.dateOfDelivery}
                    onChange={(e) =>
                      handleInputChange("dateOfDelivery", e.target.value)
                    }
                    type="date"
                    className="w-full"
                  />
                </div>

                <div className="flex flex-col">
                  <label htmlFor="" className="mb-1">
                    Quantity
                  </label>
                  <Input
                    placeholder="eg: 5"
                    type="number"
                    value={formData.quantity}
                    onChange={(e) =>
                      handleInputChange("quantity", e.target.value)
                    }
                    className="outline-none focus:outline-none w-full"
                  />
                </div>

                <div className="flex flex-col">
                  <label htmlFor="" className="mb-1">
                    Cost Price
                  </label>
                  <Input
                    placeholder="1000"
                    type="number"
                    value={formData.costPrice}
                    onChange={(e) =>
                      handleInputChange("costPrice", e.target.value)
                    }
                    className="outline-none focus:outline-none w-full"
                  />
                </div>

                <div className="flex flex-col">
                  <label htmlFor="" className="mb-1">
                    Service Charge
                  </label>
                  <Input
                    placeholder="eg: 150"
                    type="number"
                    value={formData.serviceCharge}
                    onChange={(e) =>
                      handleInputChange("serviceCharge", e.target.value)
                    }
                    className="outline-none focus:outline-none w-full"
                  />
                </div>

                <div className="flex flex-col">
                  <label htmlFor="" className="mb-1">
                    Gross Price
                  </label>
                  <Input
                    placeholder="Auto-generate"
                    type="number"
                    value={formData.grossPrice}
                    className="outline-none focus:outline-none w-full bg-gray-100"
                  />
                </div>

                <div className="flex flex-col">
                  <label htmlFor="" className="mb-1">
                    Remarks
                  </label>
                  <textarea
                    placeholder="Add any additional comments.."
                    rows={4}
                    value={formData.remarks}
                    onChange={(e) =>
                      handleInputChange("remarks", e.target.value)
                    }
                    className="Poppins-font font-medium w-full px-4 py-2 border border-gray-300 rounded-md text-sm !focus:outline-none outline-none resize-none"
                  ></textarea>
                </div>

                <div className="flex justify-end gap-4 Poppins-font font-medium !mt-12">
                  <Button
                    text={loading ? "Creating..." : "Submit"}
                    disabled={loading || !canCreate}
                    type="submit"
                    className="
    px-6
    !bg-[#056BB7]
    border-none
    text-white
    disabled:!bg-[#056ab7d2]
    disabled:cursor-not-allowed
  "

                </div>
              </div>
            </div>
          </div>
        </form>
      </div>

      <PurchaseOrderTable
        eye={true}
        className=""
        tableDataAlignment="zone"
        columns={columns}
        data={purchaseOrders}
        onEdit={handleEditClick}
        onView={handleViewClick}
        onDelete={(row) => {
          deletePurchaseOrder(row._id);
        }}
        tableTitle="Purchase Orders"
        searchable={true}
        filterByStatus={false}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        editingRow={editingRow}
        formData={editFormData} // Use editFormData instead of formData
        setFormData={setEditFormData} // Use setEditFormData instead of setFormData
        handleInputChange={handleEditInputChange} // Use handleEditInputChange
        suppliers={suppliers}
        categories={categories}
        subCategories={subCategories}
        goldCategories={goldCategories}
        currentPurchaseOrderData={currentPurchaseOrderData}
        showPurchaseOrderDetailModal={showPurchaseOrderDetailModal}
        setShowPurchaseOrderDetailModal={setShowPurchaseOrderDetailModal}
        modalLoading={modalLoading}
        updatePurchaseOrder={updatePurchaseOrder}
        loading={loading}
        // goldCategories={goldCategories}
        goldCategoryData={goldCategoryData}
      // goldCategoryData={goldCategoryData}
      />
      canUpdate={canUpdate}
      canDelete={canDelete}
      />
    </div>
  );
};

export default PurchaseOrder;
