import type React from "react";
import { useState, useEffect } from "react";
import Input from "../../../components/Input";
import Button from "../../../components/Button";
import plusIcon from "../../../assets/plus.svg";
import { useNavigate } from "react-router-dom";
import Dropdown from "../../../components/Dropdown";
import { CloudUploadOutlined } from "@ant-design/icons";
import type { UploadFile, UploadProps } from "antd";
import { Upload } from "antd";
const { RangePicker } = DatePicker;
import { DatePicker } from "antd";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import axios from "axios";
import { toast } from "react-toastify";
import { hasPermission } from "../sections/Expense";

//Date Format
dayjs.extend(customParseFormat);
const dateFormat = "YYYY-MM-DD";

interface ExpenseCategory {
  _id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

interface Currency {
  _id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

interface Tax {
  _id: string;
  taxId: string;
  taxAmount: number;
  description: string;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
}

interface Duration {
  _id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

interface PaymentMode {
  _id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

interface AddExpenseProps {
  initialData?: any;
  isEditing?: boolean;
  expenseId?: string;
}

// Helper function to get auth token
const getAuthToken = () => {
  let token = localStorage.getItem("token");
  if (!token) {
    token = sessionStorage.getItem("token");
  }
  return token;
};
// getUserRole function add
const getUserRole = () => {
  let role = localStorage.getItem("role");
  if (!role) {
    role = sessionStorage.getItem("role");
  }
  return role;
};

const AddExpense: React.FC<AddExpenseProps> = ({
  initialData,
  isEditing = false,
  expenseId,
}) => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [image, setImage] = useState<UploadFile | null>(null);
  const [status, setStatus] = useState<"success" | "error" | null>(null);
  const [paymentTerm, setPaymentTerm] = useState(false);
  const [addCurrency, setAddCurrency] = useState(false);
  const [amount, setAmount] = useState("");
  const [expenseCategoryDescription, setExpenseCategoryDescription] =
    useState("");
  const [expenseCategory, setExpenseCategory] = useState("");
  const [expenseName, setExpenseName] = useState("");
  const [description, setDescription] = useState("");
  const [expenseDate, setExpenseDate] = useState<dayjs.Dayjs | null>(null);
  const [selectedCurrency, setSelectedCurrency] = useState("");
  const [selectedTax, setSelectedTax] = useState("");
  const [selectedPaymentMode, setSelectedPaymentMode] = useState("");
  const [selectedRepeatEvery, setSelectedRepeatEvery] = useState("");
  const [referenceNumber, setReferenceNumber] = useState("");
  const [currencyName, setCurrencyName] = useState("");
  const [currencyDescription, setCurrencyDescription] = useState("");

  // API Data States
  const [expenseCategories, setExpenseCategories] = useState<ExpenseCategory[]>(
    []
  );
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [taxes, setTaxes] = useState<Tax[]>([]);
  const [durations, setDurations] = useState<Duration[]>([]);
  const [paymentModes, setPaymentModes] = useState<PaymentMode[]>([]);

  // Update the state variables - add a separate state for expense category
  const [selectedExpenseCategory, setSelectedExpenseCategory] = useState("");

  // Loading States
  const [loadingExpenseCategoryDetails, setLoadingExpenseCategoryDetails] =
    useState(false);
  const [loadingCurrencyDetails, setLoadingCurrencyDetails] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmittingCurrency, setIsSubmittingCurrency] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);

  // Permission variables add
  const userRole = getUserRole();
  const isAdmin = userRole === "Admin" || userRole === "SuperAdmin";
  const canCreate = isAdmin || hasPermission("Expense", "create");

  const charLimit = 165;
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_BASE_URL || "http://192.168.100.18:9000";

  // Populate form with initial data if editing
  useEffect(() => {
    if (initialData && isEditing) {
      setSelectedExpenseCategory(initialData.expenseCategory?._id || "");
      setExpenseName(initialData.expenseName || "");
      setAmount(initialData.amount?.toString() || "");
      setDescription(initialData.description || "");
      setReferenceNumber(initialData.referenceNumber?.toString() || "");
      setSelectedCurrency(initialData.currency?._id || "");
      setSelectedTax(initialData.tax?._id || "");
      setSelectedPaymentMode(initialData.paymentMode?._id || "");
      setSelectedRepeatEvery(initialData.repeatEvery?._id || "");

      // Handle date
      if (initialData.date) {
        setExpenseDate(dayjs(initialData.date));
      }

      // Handle existing image
      if (initialData.expenseImage) {
        const existingFile = {
          uid: "existing-1",
          name: "Existing Receipt",
          status: "done" as const,
          url: `${API_URL}${initialData.expenseImage}`,
          thumbUrl: `${API_URL}${initialData.expenseImage}`,
        };
        setUploadedFiles([existingFile]);
      }
    }
  }, [initialData, isEditing, API_URL]);

  useEffect(() => {
    if (!canCreate) {
      toast.error("You don't have permission to add expense");
    }
  }, [canCreate]);

  // Fetch all data on component mount
  useEffect(() => {
    fetchExpenseCategories();
    fetchCurrencies();
    fetchTaxes();
    fetchDurations();
    fetchPaymentModes();
  }, []);

  const fetchExpenseCategories = async () => {
    try {
      const token = getAuthToken();
      const response = await axios.get(
        `${API_URL}/api/abid-jewelry-ms/getAllExpenseCategories`,
        {
          headers: {
            "x-access-token": token,
          },
        }
      );
      if (response.data.success) {
        setExpenseCategories(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching expense categories:", error);
      toast.error("Failed to fetch expense categories");
    }
  };

  const fetchCurrencies = async () => {
    try {
      const token = getAuthToken();
      const response = await axios.get(
        `${API_URL}/api/abid-jewelry-ms/getAllCurrencies`,
        {
          headers: {
            "x-access-token": token,
          },
        }
      );
      if (response.data.success) {
        setCurrencies(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching currencies:", error);
      toast.error("Failed to fetch currencies");
    }
  };

  const fetchTaxes = async () => {
    try {
      const token = getAuthToken();
      const response = await axios.get(
        `${API_URL}/api/abid-jewelry-ms/getAllTaxes`,
        {
          headers: {
            "x-access-token": token,
          },
        }
      );
      if (response.data.success) {
        setTaxes(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching taxes:", error);
      toast.error("Failed to fetch taxes");
    }
  };

  const fetchDurations = async () => {
    try {
      const token = getAuthToken();
      const response = await axios.get(
        `${API_URL}/api/abid-jewelry-ms/getAllDurations`,
        {
          headers: {
            "x-access-token": token,
          },
        }
      );
      if (response.data.success) {
        setDurations(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching durations:", error);
      toast.error("Failed to fetch durations");
    }
  };

  const fetchPaymentModes = async () => {
    try {
      const token = getAuthToken();
      const response = await axios.get(
        `${API_URL}/api/abid-jewelry-ms/getAllPayments`,
        {
          headers: {
            "x-access-token": token,
          },
        }
      );
      if (response.data.success) {
        setPaymentModes(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching payment modes:", error);
      toast.error("Failed to fetch payment modes");
    }
  };

  const handleAddExpenseCategory = (e: React.MouseEvent) => {
    setPaymentTerm(true);
    e.stopPropagation();
  };

  const handleAddCurrency = (e: React.MouseEvent) => {
    setAddCurrency(true);
    e.stopPropagation();
  };

  const { Dragger } = Upload;
  const props: UploadProps = {
    name: "file",
    multiple: false,
    beforeUpload: (file) => {
      // Validate file type and size
      const isValidType =
        file.type.startsWith("image/") || file.type === "application/pdf";
      if (!isValidType) {
        toast.error("You can only upload image files or PDF!");
        return false;
      }

      const isLt10M = file.size / 1024 / 1024 < 10;
      if (!isLt10M) {
        toast.error("File must be smaller than 10MB!");
        return false;
      }

      // Add file to uploaded files state
      const fileWithPreview = {
        ...file,
        status: "done" as const,
        url: URL.createObjectURL(file),
        thumbUrl: URL.createObjectURL(file),
        originFileObj: file,
        uid: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      };

      setUploadedFiles([fileWithPreview]); // Replace existing file
      return false;
    },
    onRemove: (file) => {
      setUploadedFiles((prev) => prev.filter((item) => item.uid !== file.uid));
      return true;
    },
    fileList: uploadedFiles,
    showUploadList: true,
  };

  const handleExpenseDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    if (e.target.value.length <= charLimit) {
      setExpenseCategoryDescription(e.target.value);
    }
  };

  const handleSubmitExpensecategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const token = getAuthToken();
      if (!token) {
        toast.error("Authentication token not found. Please login again.");
        return;
      }

      const response = await axios.post(
        `${API_URL}/api/abid-jewelry-ms/createExpenseCategory`,
        {
          name: expenseCategory,
          description: expenseCategoryDescription,
        },
        {
          headers: {
            "x-access-token": token,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        toast.success("Expense category created successfully!");
        setPaymentTerm(false);
        setExpenseCategory("");
        setExpenseCategoryDescription("");
        fetchExpenseCategories(); // Refresh the list
      }
    } catch (error) {
      console.error("Error creating expense category:", error);
      toast.error("Failed to create expense category");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitCurrency = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingCurrency(true);

    try {
      const token = getAuthToken();
      if (!token) {
        toast.error("Authentication token not found. Please login again.");
        return;
      }

      const response = await axios.post(
        `${API_URL}/api/abid-jewelry-ms/createCurrency`,
        {
          name: currencyName,
          description: currencyDescription,
        },
        {
          headers: {
            "x-access-token": token,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        toast.success("Currency created successfully!");
        setAddCurrency(false);
        setCurrencyName("");
        setCurrencyDescription("");
        fetchCurrencies(); // Refresh the list
      }
    } catch (error) {
      console.error("Error creating currency:", error);
      toast.error("Failed to create currency");
    } finally {
      setIsSubmittingCurrency(false);
    }
  };

  const handleCreateOrUpdateExpense = async () => {
    try {
      const token = getAuthToken();
      if (!token) {
        toast.error("Authentication token not found. Please login again.");
        return;
      }

      const formData = new FormData();
      formData.append("expenseCategory", selectedExpenseCategory);
      formData.append("expenseName", expenseName);
      formData.append("description", description);
      formData.append(
        "date",
        expenseDate ? expenseDate.format("M-D-YYYY") : ""
      );
      formData.append("currency", selectedCurrency);
      formData.append("tax", selectedTax);
      formData.append("repeatEvery", selectedRepeatEvery);
      formData.append("paymentMode", selectedPaymentMode);
      formData.append("amount", amount);
      formData.append("referenceNumber", referenceNumber);

      // Add uploaded files (only new files with originFileObj)
      uploadedFiles.forEach((file) => {
        if (file.originFileObj) {
          formData.append(`expenseImage`, file.originFileObj);
        }
      });

      const url = isEditing
        ? `${API_URL}/api/abid-jewelry-ms/updateExpense/${expenseId}`
        : `${API_URL}/api/abid-jewelry-ms/createExpense`;

      const method = isEditing ? "PUT" : "POST";

      const response = await axios({
        method,
        url,
        data: formData,
        headers: {
          "x-access-token": token,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        toast.success(
          `Expense ${isEditing ? "updated" : "created"} successfully!`
        );

        if (isEditing) {
          navigate("/dashboard/expense/all-expenses");
        } else {
          // Reset form for new expense
          setExpenseName("");
          setDescription("");
          setAmount("");
          setReferenceNumber("");
          setSelectedExpenseCategory("");
          setSelectedCurrency("");
          setSelectedTax("");
          setSelectedPaymentMode("");
          setSelectedRepeatEvery("");
          setUploadedFiles([]);
          setExpenseDate(null);
        }
      }
    } catch (error) {
      console.error(
        `Error ${isEditing ? "updating" : "creating"} expense:`,
        error
      );
      toast.error(`Failed to ${isEditing ? "update" : "create"} expense`);
    }
  };

  return (
    <div className="min-h-scree w-full mx-auto px-3 py-6 sm:px-4 md:px-6 xl:px-8 xl:py-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* By Weight */}
        <div className="bg-white rounded-2xl  shadow">
          <div className="p-4">
            <p className="Source-Sans-Pro-font text-[#056BB7] font-semibold text-[20px] mb-2">
              {isEditing ? "Update Expense" : "Add New Expense"}
            </p>
            <div className="flex flex-col text-[15px] Poppins-font font-medium mt-3">
              <div className="flex items-center gap-1 mb-1">
                <label className="text-sm font-medium text-gray-800">
                  Expense category <span className="text-red-500">*</span>
                </label>
                {/* Replace the img with a button */}
                <button
                  type="button"
                  onClick={handleAddExpenseCategory}
                  className="w-4 h-4 flex items-center justify-center cursor-pointer bg-transparent border-0 p-0"
                >
                  <img
                    src={plusIcon || "/placeholder.svg"}
                    alt="Add"
                    className="w-4 h-4"
                  />
                </button>
              </div>
              <Dropdown
                options={expenseCategories.map((category) => category.name)}
                defaultValue={
                  isEditing && initialData?.expenseCategory?.name
                    ? initialData.expenseCategory.name
                    : "Select Category"
                }
                className=""
                onSelect={(value) => {
                  const selectedCategory = expenseCategories.find(
                    (cat) => cat.name === value
                  );
                  if (selectedCategory) {
                    setSelectedExpenseCategory(selectedCategory._id);
                  }
                }}
              />
              <div className="flex flex-col mb-3 mt-3">
                <label htmlFor="" className="mb-1">
                  Attach Receipt 
                  {/* <span className="text-[11px]">(Upload)</span>{" "} */}
                  <span className="text-[11px]">(optional)</span>
                </label>
                <Dragger {...props} className="mb-1 w-full" height={170}>
                  <p className="ant-upload-drag-icon ">
                    <CloudUploadOutlined className="!text-[#000000e0]" />
                  </p>
                  <p className="ant-upload-text !mb-3 !font-medium">
                    Upload or drag receipt image/file here
                  </p>
                  <p className="ant-upload-hint !bg-[#1A8CE0] !text-white rounded-md px-6 py-1 inline">
                    Upload
                  </p>
                </Dragger>
              </div>
              <div className="flex flex-col mb-3">
                <label htmlFor="" className="mb-1">
                  Expense Name <span className="text-red-500">*</span>
                </label>
                <Input
                  placeholder="Expense Name"
                  className="outline-none focus:outline-none w-full"
                  value={expenseName}
                  onChange={(e) => setExpenseName(e.target.value)}
                />
              </div>
              <div className="flex flex-col mb-3">
                <label htmlFor="" className="mb-1">
                  Amount ($) <span className="text-red-500">*</span>
                </label>
                <Input
                  type="number"
                  placeholder="3027.20"
                  className="outline-none focus:outline-none w-full"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
              <div className="flex flex-col mb-3">
                <label htmlFor="" className="mb-1">
                  Note <span className="text-[11px]">(optional)</span>
                </label>
                <textarea
                  placeholder="Add any additional comments.."
                  rows={4}
                  className="Poppins-font font-medium w-full px-4 py-2 border border-gray-300 rounded-md text-sm !focus:outline-none outline-none resize-none"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                ></textarea>
              </div>
              <div className="flex flex-col mb-3">
                <label htmlFor="" className="mb-1">
                  Expense Date <span className="text-red-500">*</span>
                </label>
                <DatePicker
                  value={expenseDate}
                  onChange={(date) => setExpenseDate(date)}
                  className="w-full h-10"
                  format={dateFormat}
                  placeholder="Select expense date"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Advanced Options */}
        <div className="!h-fit">
          <div className="p-4 bg-white rounded-2xl shadow">
            <p className="Source-Sans-Pro-font text-[#056BB7] font-semibold text-[20px] mb-2">
              Advanced Options
            </p>
            <div className="flex flex-col text-[15px] Poppins-font font-medium mt-3">
              <div className="flex items-center gap-1 mb-1">
                <label className="text-sm font-medium text-gray-800">
                  Currency <span className="text-red-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={handleAddCurrency}
                  className="w-4 h-4 flex items-center justify-center cursor-pointer bg-transparent border-0 p-0"
                >
                  <img
                    src={plusIcon || "/placeholder.svg"}
                    alt="Add"
                    className="w-4 h-4"
                  />
                </button>
              </div>
              <Dropdown
                options={currencies.map((currency) => currency.name)}
                defaultValue={
                  isEditing && initialData?.currency?.name
                    ? initialData.currency.name
                    : "Select Currency"
                }
                className=""
                onSelect={(value) => {
                  const selectedCurrencyObj = currencies.find(
                    (curr) => curr.name === value
                  );
                  if (selectedCurrencyObj) {
                    setSelectedCurrency(selectedCurrencyObj._id);
                  }
                }}
              />

              <div className="flex xl:flex-row flex-col xl:gap-4 gap-0">
                {/* LEFT SIDE */}
                <div className="w-full xl:w-1/2 mt-4.5">
                  <div className="flex flex-col mb-3">
                    <label className="text-sm font-medium text-gray-800">
                      Tax <span className="text-red-500">*</span>
                    </label>
                    <Dropdown
                      options={taxes.map((tax) => `${tax.taxAmount}% `)}
                      defaultValue={
                        isEditing && initialData?.tax?.taxAmount
                          ? `${initialData.tax.taxAmount}%`
                          : "Select Tax"
                      }
                      className="w-full"
                      onSelect={(value) => {
                        const selectedTaxObj = taxes.find(
                          (tax) => `${tax.taxAmount}% ` === value
                        );
                        if (selectedTaxObj) {
                          setSelectedTax(selectedTaxObj._id);
                        }
                      }}
                    />
                  </div>
                  <div className="flex flex-col mb-3">
                    <label htmlFor="" className="mb-1">
                      Payment Mode <span className="text-red-500">*</span>
                    </label>
                    <Dropdown
                      options={paymentModes.map((mode) => mode.name)}
                      defaultValue={
                        isEditing && initialData?.paymentMode?.name
                          ? initialData.paymentMode.name
                          : "Select Payment Mode"
                      }
                      className=""
                      onSelect={(value) => {
                        const selectedModeObj = paymentModes.find(
                          (mode) => mode.name === value
                        );
                        if (selectedModeObj) {
                          setSelectedPaymentMode(selectedModeObj._id);
                        }
                      }}
                    />
                  </div>
                </div>
                {/* RIGHT SIDE */}
                <div className="w-full xl:w-1/2 mt-3">
                  <div className="flex flex-col mb-3">
                    <label htmlFor="" className="mb-1">
                      Repeat Every <span className="text-red-500">*</span>
                    </label>
                    <Dropdown
                      options={durations.map((duration) => duration.name)}
                      defaultValue={
                        isEditing && initialData?.repeatEvery?.name
                          ? initialData.repeatEvery.name
                          : "Select Duration"
                      }
                      className=""
                      onSelect={(value) => {
                        const selectedDurationObj = durations.find(
                          (duration) => duration.name === value
                        );
                        if (selectedDurationObj) {
                          setSelectedRepeatEvery(selectedDurationObj._id);
                        }
                      }}
                    />
                  </div>
                  <div className="flex flex-col mb-3">
                    <label htmlFor="" className="mb-1">
                      Reference # <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="text"
                      placeholder="Reference Number"
                      className="outline-none focus:outline-none w-full"
                      value={referenceNumber}
                      onChange={(e) => setReferenceNumber(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          {canCreate && (
            <div className="flex justify-end font-medium pt-2 mt-4">
              <Button
                text={isEditing ? "Update" : "Save"}
                className="px-6 !bg-[#056BB7] text-white !border-none"
                onClick={handleCreateOrUpdateExpense}
              />
            </div>
          )}
        </div>
      </div>

      {/* Add Expense Category Modal */}
      {paymentTerm && (
        <>
          <div
            className="fixed inset-0 flex items-center justify-center bg-black/20 z-50"
            onClick={() => setPaymentTerm(false)}
          >
            <div
              className="animate-scaleIn bg-white w-[90vw] overflow-hidden !md:h-[30vh] sm:w-lg md:w-[80vw] lg:w-3xl h-[57vh] overflow-y-auto rounded-[7px] shadow-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <p className="Source-Sans-Pro-font p-4 text-[#056BB7] font-semibold text-[20px] sm:text-[24px] m-0 sticky top-0 bg-white shadow-sm z-40">
                Add Expense Category
              </p>

              {loadingExpenseCategoryDetails ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : (
                <form
                  className="text-[15px] Poppins-font font-medium w-full p-4"
                  onSubmit={handleSubmitExpensecategory}
                >
                  <div className="flex flex-col mb-2">
                    <label className="mb-1 text-black">Category</label>
                    <Input
                      placeholder="Product Category Name"
                      value={expenseCategory}
                      onChange={(e) => setExpenseCategory(e.target.value)}
                      className="outline-none focus:outline-none w-full"
                    />
                  </div>
                  <div className="flex flex-col mb-5">
                    <label htmlFor="" className="mb-1">
                      Expense Category Description
                    </label>
                    <textarea
                      value={expenseCategoryDescription}
                      onChange={handleExpenseDescriptionChange}
                      placeholder="Description"
                      rows={4}
                      className="Poppins-font font-medium w-full px-4 py-2 border border-gray-300 rounded-md text-sm !focus:outline-none outline-none resize-none"
                    ></textarea>
                    <div className="flex justify-end text-[#2C8CD4] mt-0.5">
                      {expenseCategoryDescription.length}/{charLimit}
                    </div>
                  </div>
                  <div className="flex justify-end items-end font-medium gap-4">
                    <Button
                      text="Cancel"
                      type="button"
                      onClick={() => setPaymentTerm(false)}
                      className="px-6 !bg-[#F4F4F5] !border-none"
                    />
                    <Button
                      text={isSubmitting ? "Saving..." : "Save"}
                      type="submit"
                      disabled={isSubmitting}
                      className="px-6 !bg-[#056BB7] border-none text-white"
                    />
                  </div>
                </form>
              )}
            </div>
          </div>
        </>
      )}

      {/* Add Currency Modal */}
      {addCurrency && (
        <>
          <div
            className="fixed inset-0 flex items-center justify-center bg-black/20 z-50"
            onClick={() => setAddCurrency(false)}
          >
            <div
              className="animate-scaleIn bg-white w-[90vw] overflow-hidden md:h-auto sm:w-lg md:w-[80vw] lg:w-3xl h-[70vh] overflow-y-auto rounded-[7px] shadow-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <p className="Source-Sans-Pro-font p-4 text-[#056BB7] font-semibold text-[20px] sm:text-[24px] m-0 sticky top-0 bg-white shadow-sm z-40">
                Add Currency
              </p>

              {loadingCurrencyDetails ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmitCurrency}
                  className="text-[15px] Poppins-font font-medium w-full p-4"
                >
                  <div className="flex flex-col mb-3">
                    <label className="mb-1 text-black">Currency Name</label>
                    <Input
                      placeholder="Currency name (e.g., USD, EUR)"
                      value={currencyName}
                      onChange={(e) => setCurrencyName(e.target.value)}
                      className="outline-none focus:outline-none w-full"
                    />
                  </div>

                  <div className="flex flex-col mb-5">
                    <label htmlFor="" className="mb-1">
                      Currency Description
                    </label>
                    <textarea
                      value={currencyDescription}
                      onChange={(e) => setCurrencyDescription(e.target.value)}
                      placeholder="Currency description"
                      rows={4}
                      className="Poppins-font font-medium w-full px-4 py-2 border border-gray-300 rounded-md text-sm !focus:outline-none outline-none resize-none"
                    ></textarea>
                  </div>

                  <div className="flex justify-end font-medium gap-4">
                    <Button
                      text="Cancel"
                      type="button"
                      onClick={() => setAddCurrency(false)}
                      className="px-6 !bg-[#F4F4F5] !border-none"
                    />
                    <Button
                      text={isSubmittingCurrency ? "Saving..." : "Save"}
                      type="submit"
                      disabled={isSubmittingCurrency}
                      className="px-6 !bg-[#056BB7] text-white !border-none"
                    />
                  </div>
                </form>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AddExpense;
