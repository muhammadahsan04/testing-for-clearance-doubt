import React, { useState, useEffect } from "react";
import Input from "../../../components/Input";
import Button from "../../../components/Button";
import { RiEditLine } from "react-icons/ri";
import BankTable from "../../../components/BankTable";
import PaymentTable from "../../../components/PaymentTable";
import UploadPicture from "../../../components/UploadPicture";
import axios from "axios";
import { toast } from "react-toastify";
import { hasPermission } from "../sections/CoreSettings";

interface Column {
  header: string;
  accessor: string;
  type?: "text" | "image" | "status" | "actions";
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

const Payment = () => {
  const [bankName, setBankName] = useState("");
  const [paymentName, setPaymentName] = useState("");
  const [activeTab, setActiveTab] = useState<"bank" | "paymentMode">(
    "paymentMode"
  );
  const [bankDescription, setBankDescription] = useState("");
  const [paymentDescription, setPaymentDescription] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false); // To track if it's Edit mod
  const [roleName, setRoleName] = useState("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [banksData, setBanksData] = useState<any[]>([]);
  const [paymentsData, setPaymentsData] = useState<any[]>([]);
  const [isLoadingBanks, setIsLoadingBanks] = useState(false);
  const [isLoadingPayments, setIsLoadingPayments] = useState(false);
  const [isSubmittingBank, setIsSubmittingBank] = useState(false);
  const [isSubmittingPayment, setIsSubmittingPayment] = useState(false);

  // Permission variables add
  const userRole = getUserRole();
  const isAdmin = userRole === "Admin" || userRole === "SuperAdmin";
  const canCreate = isAdmin || hasPermission("Core Setting", "create");
  const canUpdate = isAdmin || hasPermission("Core Setting", "update");
  const canDelete = isAdmin || hasPermission("Core Setting", "delete");

  const columns: Column[] = [
    { header: "S.no", accessor: "id" },
    { header: "Name", accessor: "name", type: "image" },
    { header: "Status", accessor: "status", type: "status" },
    { header: "Actions", accessor: "actions", type: "actions" },
  ];

  const charLimit = 165;

  useEffect(() => {
    if (!canCreate) {
      toast.error("You don't have permission to add payment mode and bank");
    }
  }, [canCreate]);

  // Fetch banks data
  const fetchBanks = async () => {
    setIsLoadingBanks(true);
    try {
      const API_URL = import.meta.env.VITE_BASE_URL || "http://localhost:9000";
      const token = getAuthToken();
      if (!token) {
        toast.error("Authentication token not found. Please login again.");
        return;
      }
      const response = await axios.get(
        `${API_URL}/api/abid-jewelry-ms/getAllBanks`,
        {
          headers: {
            "x-access-token": token,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.data.success) {
        // Transform the data to match the expected format
        const formattedData = response.data.data.map(
          (bank: any, index: number) => ({
            id: index + 1,
            _id: bank._id,
            name: bank.name,
            description: bank.description,
            status: bank.status.charAt(0).toUpperCase() + bank.status.slice(1),
          })
        );
        setBanksData(formattedData);
      } else {
        toast.error(response.data.message || "Failed to fetch banks");
      }
    } catch (error) {
      console.error("Error fetching banks:", error);
      if (axios.isAxiosError(error)) {
        if (!error.response) {
          toast.error("Network error. Please check your internet connection.");
        } else {
          toast.error(error.response.data.message || "Failed to fetch banks");
        }
      } else {
        toast.error("An unexpected error occurred while fetching banks");
      }
    } finally {
      setIsLoadingBanks(false);
    }
  };

  // Fetch payments data
  const fetchPayments = async () => {
    setIsLoadingPayments(true);
    try {
      const API_URL = import.meta.env.VITE_BASE_URL || "http://localhost:9000";
      const token = getAuthToken();
      if (!token) {
        toast.error("Authentication token not found. Please login again.");
        return;
      }
      const response = await axios.get(
        `${API_URL}/api/abid-jewelry-ms/getAllPayments`,
        {
          headers: {
            "x-access-token": token,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.data.success) {
        // Transform the data to match the expected format
        const formattedData = response.data.data.map(
          (payment: any, index: number) => ({
            id: index + 1,
            _id: payment._id,
            name: payment.name,
            description: payment.description,
            status:
              payment.status.charAt(0).toUpperCase() + payment.status.slice(1),
          })
        );
        setPaymentsData(formattedData);
      } else {
        toast.error(response.data.message || "Failed to fetch payments");
      }
    } catch (error) {
      console.error("Error fetching payments:", error);
      if (axios.isAxiosError(error)) {
        if (!error.response) {
          toast.error("Network error. Please check your internet connection.");
        } else {
          toast.error(
            error.response.data.message || "Failed to fetch payments"
          );
        }
      } else {
        toast.error("An unexpected error occurred while fetching payments");
      }
    } finally {
      setIsLoadingPayments(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchBanks();
    fetchPayments();
  }, []);

  const handleBankDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    if (e.target.value.length <= charLimit) {
      setBankDescription(e.target.value);
    }
  };

  const handlePaymentDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    if (e.target.value.length <= charLimit) {
      setPaymentDescription(e.target.value);
    }
  };

  // Handle bank creation
  const handleBankSubmit = async () => {
    if (!canCreate) {
      toast.error("You don't have permission to add sku prefix");
      return;
    }

    if (!bankName.trim()) {
      toast.error("Bank name is required");
      return;
    }
    setIsSubmittingBank(true);
    try {
      const API_URL = import.meta.env.VITE_BASE_URL || "http://localhost:9000";
      const token = getAuthToken();
      if (!token) {
        toast.error("Authentication token not found. Please login again.");
        return;
      }
      const payload = {
        name: bankName,
        description: bankDescription,
        status: "active",
      };
      const response = await axios.post(
        `${API_URL}/api/abid-jewelry-ms/createBank`,
        payload,
        {
          headers: {
            "x-access-token": token,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.data.success) {
        toast.success("Bank added successfully!");
        // Add the new bank to the list without refreshing
        const newBank = {
          id: banksData.length + 1,
          _id: response.data.data._id,
          name: response.data.data.name,
          description: response.data.data.description,
          status:
            response.data.data.status.charAt(0).toUpperCase() +
            response.data.data.status.slice(1),
        };
        setBanksData([...banksData, newBank]);
        // Reset form
        setBankName("");
        setBankDescription("");
      } else {
        toast.error(response.data.message || "Failed to add bank");
      }
    } catch (error) {
      console.error("Error adding bank:", error);
      if (axios.isAxiosError(error)) {
        if (!error.response) {
          toast.error("Network error. Please check your internet connection.");
        } else {
          toast.error(error.response.data.message || "Failed to add bank");
        }
      } else {
        toast.error("An unexpected error occurred while adding bank");
      }
    } finally {
      setIsSubmittingBank(false);
    }
  };

  // Handle payment creation
  const handlePaymentSubmit = async () => {
    if (!paymentName.trim()) {
      toast.error("Payment name is required");
      return;
    }
    setIsSubmittingPayment(true);
    try {
      const API_URL = import.meta.env.VITE_BASE_URL || "http://localhost:9000";
      const token = getAuthToken();
      if (!token) {
        toast.error("Authentication token not found. Please login again.");
        return;
      }
      const payload = {
        name: paymentName,
        description: paymentDescription,
        status: "active",
      };
      const response = await axios.post(
        `${API_URL}/api/abid-jewelry-ms/createPayment`,
        payload,
        {
          headers: {
            "x-access-token": token,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.data.success) {
        toast.success("Payment mode added successfully!");
        // Add the new payment to the list without refreshing
        const newPayment = {
          id: paymentsData.length + 1,
          _id: response.data.data._id,
          name: response.data.data.name,
          description: response.data.data.description,
          status:
            response.data.data.status.charAt(0).toUpperCase() +
            response.data.data.status.slice(1),
        };
        setPaymentsData([...paymentsData, newPayment]);
        // Reset form
        setPaymentName("");
        setPaymentDescription("");
      } else {
        toast.error(response.data.message || "Failed to add payment mode");
      }
    } catch (error) {
      console.error("Error adding payment mode:", error);
      if (axios.isAxiosError(error)) {
        if (!error.response) {
          toast.error("Network error. Please check your internet connection.");
        } else {
          toast.error(
            error.response.data.message || "Failed to add payment mode"
          );
        }
      } else {
        toast.error("An unexpected error occurred while adding payment mode");
      }
    } finally {
      setIsSubmittingPayment(false);
    }
  };

  // Handle bank edit
  const handleEditBank = (bank: any) => {
    // Update the bank in the list without refreshing
    const updatedBanks = banksData.map((item) => {
      if (item._id === bank._id) {
        return {
          ...item,
          name: bank.name,
          description: bank.description,
          status: bank.status,
        };
      }
      return item;
    });
    setBanksData(updatedBanks);
  };

  // Handle payment edit
  const handleEditPayment = (payment: any) => {
    // Update the payment in the list without refreshing
    const updatedPayments = paymentsData.map((item) => {
      if (item._id === payment._id) {
        return {
          ...item,
          name: payment.name,
          description: payment.description,
          status: payment.status,
        };
      }
      return item;
    });
    setPaymentsData(updatedPayments);
  };

  // Handle bank delete
  const handleDeleteBank = async (bank: any) => {
    try {
      if (!canDelete) {
        toast.error("You don't have permission to delete bank mode");
        return;
      }

      const API_URL = import.meta.env.VITE_BASE_URL || "http://localhost:9000";
      const token = getAuthToken();
      if (!token) {
        toast.error("Authentication token not found. Please login again.");
        return;
      }
      const response = await axios.delete(
        `${API_URL}/api/abid-jewelry-ms/deleteBank/${bank._id}`,
        {
          headers: {
            "x-access-token": token,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.data.success) {
        toast.success("Bank deleted successfully!");
        // Remove the bank from the list without refreshing
        const updatedBanks = banksData.filter((item) => item._id !== bank._id);
        setBanksData(updatedBanks);
      } else {
        toast.error(response.data.message || "Failed to delete bank");
      }
    } catch (error) {
      console.error("Error deleting bank:", error);
      if (axios.isAxiosError(error)) {
        if (!error.response) {
          toast.error("Network error. Please check your internet connection.");
        } else {
          toast.error(error.response.data.message || "Failed to delete bank");
        }
      } else {
        toast.error("An unexpected error occurred while deleting bank");
      }
    }
  };

  // Handle payment delete
  const handleDeletePayment = async (payment: any) => {
    try {
      const API_URL = import.meta.env.VITE_BASE_URL || "http://localhost:9000";
      const token = getAuthToken();
      if (!token) {
        toast.error("Authentication token not found. Please login again.");
        return;
      }
      const response = await axios.delete(
        `${API_URL}/api/abid-jewelry-ms/deletePayment/${payment._id}`,
        {
          headers: {
            "x-access-token": token,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.data.success) {
        toast.success("Payment mode deleted successfully!");
        // Remove the payment from the list without refreshing
        const updatedPayments = paymentsData.filter(
          (item) => item._id !== payment._id
        );
        setPaymentsData(updatedPayments);
      } else {
        toast.error(response.data.message || "Failed to delete payment mode");
      }
    } catch (error) {
      console.error("Error deleting payment mode:", error);
      if (axios.isAxiosError(error)) {
        if (!error.response) {
          toast.error("Network error. Please check your internet connection.");
        } else {
          toast.error(
            error.response.data.message || "Failed to delete payment mode"
          );
        }
      } else {
        toast.error("An unexpected error occurred while deleting payment mode");
      }
    }
  };

  return (
    <div className="mx-auto px-3 py-6 sm:px-4 md:px-6 xl:px-8 xl:py-6 grid grid-cols-1 md:grid-cols-[230px_1fr] gap-4 min-h-screen">
      {/* Left Sidebar */}
      <div className="bg-white rounded-xl shadow-md p-4 md:pb-44 h-fit">
        <h2 className="text-[#056BB7] font-semibold text-[24px] mb-4">
          Payment
        </h2>
        <button
          onClick={() => setActiveTab("paymentMode")}
          className={`flex justify-between items-center px-3 py-2 rounded-lg hover:bg-gray-100 w-full cursor-pointer mb-2 ${
            activeTab === "paymentMode" ? "bg-gray-100" : ""
          }`}
        >
          <span className="font-medium xl:text-[16px] text-[14px] Inter-font">
            Payment Mode
          </span>
          {/* <RiEditLine
            size={16}
            className="text-gray-500"
            onClick={() => {
              setShowModal(true);
              setIsEditing(true);
            }}
          /> */}
        </button>
        <button
          onClick={() => setActiveTab("bank")}
          className={`flex justify-between items-center px-3 py-2 rounded-lg hover:bg-gray-100 w-full cursor-pointer ${
            activeTab === "bank" ? "bg-gray-100" : ""
          }`}
        >
          <span className="font-medium xl:text-[16px] text-[14px] Inter-font">
            Bank
          </span>
          {/* <RiEditLine
            onClick={() => {
              setShowModal(true);
              setIsEditing(true);
            }}
            size={16}
            className="text-gray-500"
          /> */}
        </button>
      </div>
      {/* Right Content */}
      <div className="flex flex-col gap-6">
        {/* Add Bank Section */}
        <div className="bg-white rounded-xl shadow-md p-6">
          {activeTab === "bank" && (
            <div>
              <h3 className="text-[#056BB7] font-semibold text-[24px] mb-4">
                Add Bank
              </h3>
              <div className="grid grid-cols-1 items-end gap-4 Poppins-font font-medium">
                <div className="flex flex-col text-[15px]">
                  <label className="mb-1">
                    Bank Payment Method <span className="text-red-500"> *</span>
                  </label>
                  <Input
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    placeholder="Add Bank field"
                    className="outline-none focus:outline-none w-full"
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="" className="mb-1">
                    Category Description
                  </label>
                  <textarea
                    value={bankDescription}
                    onChange={handleBankDescriptionChange}
                    placeholder="Description"
                    rows={3}
                    className="Poppins-font font-medium w-full px-4 py-2 border border-gray-300 rounded-md text-sm !focus:outline-none outline-none resize-none"
                  ></textarea>
                  <div className="flex justify-end text-[#2C8CD4] mt-0.5">
                    {bankDescription.length}/{charLimit}
                  </div>
                </div>
                <div className="flex justify-end">
                  {canCreate && (
                    // <Button
                    //   text={isSubmittingBank ? "Saving..." : "Save"}
                    //   onClick={handleBankSubmit}
                    //   disabled={isSubmittingBank}
                    //   className="px-6 !bg-[#056BB7] border-none text-white !py-2"
                    // />
                    <Button
                      text={isSubmittingBank ? "Saving..." : "Save"}
                      onClick={handleBankSubmit}
                      className={`px-6 !bg-[#056BB7] border-none text-white ${
                        isSubmittingBank ? "opacity-70 cursor-not-allowed" : ""
                      }`}
                      type="submit"
                      disabled={isSubmittingBank}
                    />
                  )}
                </div>
              </div>
            </div>
          )}
          {activeTab === "paymentMode" && (
            <div>
              <h3 className="text-[#056BB7] font-semibold text-[24px] mb-4">
                Add Payment Mode
              </h3>
              <div className="grid grid-cols-1 items-end gap-4 Poppins-font font-medium">
                <div className="flex flex-col text-[15px]">
                  <label className="mb-1">
                    Payment Method <span className="text-red-500"> *</span>
                  </label>
                  <Input
                    value={paymentName}
                    onChange={(e) => setPaymentName(e.target.value)}
                    placeholder="Add Payment Mode field"
                    className="outline-none focus:outline-none w-full"
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="" className="mb-1">
                    Category Description
                  </label>
                  <textarea
                    value={paymentDescription}
                    onChange={handlePaymentDescriptionChange}
                    placeholder="Description"
                    rows={3}
                    className="Poppins-font font-medium w-full px-4 py-2 border border-gray-300 rounded-md text-sm !focus:outline-none outline-none resize-none"
                  ></textarea>
                  <div className="flex justify-end text-[#2C8CD4] mt-0.5">
                    {paymentDescription.length}/{charLimit}
                  </div>
                </div>
                <div className="flex justify-end">
                  {canCreate && (
                    // <Button
                    //   text={isSubmittingPayment ? "Saving..." : "Save"}
                    //   onClick={handlePaymentSubmit}
                    //   disabled={isSubmittingPayment}
                    //   className="px-6 !bg-[#056BB7] border-none text-white !py-2"
                    // />
                    <Button
                      text={isSubmittingPayment ? "Saving..." : "Save"}
                      className={`px-6 !bg-[#056BB7] border-none text-white ${
                        isSubmittingPayment
                          ? "opacity-70 cursor-not-allowed"
                          : ""
                      }`}
                      onClick={handlePaymentSubmit}
                      type="submit"
                      disabled={isSubmittingPayment}
                    />
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
        {activeTab === "bank" ? (
          isLoadingBanks ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <BankTable
              columns={columns}
              data={banksData}
              tableTitle="Bank Mode"
              canUpdate={canUpdate}
              canDelete={canDelete}
              onEdit={handleEditBank}
              onDelete={handleDeleteBank}
            />
          )
        ) : isLoadingPayments ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <PaymentTable
            columns={columns}
            data={paymentsData}
            tableTitle="Payment Mode"
            canUpdate={canUpdate}
            canDelete={canDelete}
            onEdit={handleEditPayment}
            onDelete={handleDeletePayment}
          />
        )}
      </div>
      <UploadPicture
        showModal={showModal}
        setShowModal={setShowModal}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        roleName={roleName}
        setRoleName={setRoleName}
        uploadedFile={uploadedFile}
        setUploadedFile={setUploadedFile}
      >
        {/* <DropImage
          uploadedFile={uploadedFile}
          setUploadedFile={setUploadedFile}
        /> */}
      </UploadPicture>
    </div>
  );
};

export default Payment;
