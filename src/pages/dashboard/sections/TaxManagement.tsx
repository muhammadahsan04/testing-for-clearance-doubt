import Button from "../../../components/Button";
import Dropdown from "../../../components/Dropdown";
import Input from "../../../components/Input";
import React, { useState, useEffect } from "react";
import TaxManagementTable from "../../../components/TaxManagementTable";
import { DatePicker } from "antd";
import axios from "axios";
import { toast } from "react-toastify";
// import { hasPermission } from "../sections/CoreSettings";
import { useNavigate } from "react-router-dom";

interface Column {
  header: string;
  accessor: string;
  type?: "text" | "image" | "status" | "actions";
}

interface TaxData {
  _id: string;
  taxAmount: string;
  description: string;
  startDate: string;
  endDate: string;
  date?: string;
}

export const hasPermission = (module: string, action: string) => {
  try {
    let permissionsStr = localStorage.getItem("permissions");
    if (!permissionsStr) {
      permissionsStr = sessionStorage.getItem("permissions");
    }

    if (!permissionsStr) return false;

    const permissions = JSON.parse(permissionsStr);

    // Check if user has all permissions
    if (permissions.allPermissions || permissions.allPagesAccess) return true;

    const page = permissions.pages?.find((p: any) => p.name === module);
    if (!page) return false;

    switch (action.toLowerCase()) {
      case "create":
        return page.create;
      case "read":
        return page.read;
      case "update":
        return page.update;
      case "delete":
        return page.delete;
      default:
        return false;
    }
  } catch (error) {
    console.error("Error checking permissions:", error);
    return false;
  }
};

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

// Helper function to format date in DD-MMM-YYYY format
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, "0");
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

const TaxManagement: React.FC = () => {
  const { RangePicker } = DatePicker;
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [taxAmount, setTaxAmount] = useState("");
  const [taxDateRange, setTaxDateRange] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [taxData, setTaxData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const charLimit = 165;

  useEffect(() => {
    // Check permissions on component mount
    const userRole = getUserRole();
    const isAdmin = userRole === "Admin" || userRole === "SuperAdmin";

    if (!isAdmin && !hasPermission("Tax Management", "read")) {
      toast.error("You don't have permission to access tax management");
      navigate("/dashboard");
      return;
    }
  }, [navigate]);
  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length <= charLimit) {
      setMessage(e.target.value);
    }
  };

  const columns: Column[] = [
    {
      header: "Date",
      accessor: "date",
      type: "text",
    },
    {
      header: "Tax Amount",
      accessor: "taxAmount",
      type: "text",
    },
    {
      header: "Tax Description",
      accessor: "description",
      type: "text",
    },
  ];

  // Fetch tax data on component mount
  useEffect(() => {
    fetchTaxData();
  }, []);

  useEffect(() => {
    if (!canCreate) {
      toast.error("You don't have permission to add tax");
    }
  }, [canCreate]);

  // Handle tax submission
  const handleTaxSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!taxAmount) {
      toast.error("Please enter a tax amount");
      return;
    }

    if (!message.trim()) {
      toast.error("Please enter a tax description");
      return;
    }

    if (!taxDateRange || !taxDateRange[0] || !taxDateRange[1]) {
      toast.error("Please select a date range for tax");
      return;
    }

    // Extract the dates properly from dayjs objects
    const startDate = taxDateRange[0].$d;
    const endDate = taxDateRange[1].$d;

    // Format dates as strings in YYYY-MM-DD format for API
    const formattedStartDate =
      startDate.getFullYear() +
      "-" +
      String(startDate.getMonth() + 1).padStart(2, "0") +
      "-" +
      String(startDate.getDate()).padStart(2, "0");

    const formattedEndDate =
      endDate.getFullYear() +
      "-" +
      String(endDate.getMonth() + 1).padStart(2, "0") +
      "-" +
      String(endDate.getDate()).padStart(2, "0");

    // Check if start date is before end date
    if (formattedStartDate >= formattedEndDate) {
      toast.error("End date must be after the start date");
      return;
    }

    setIsSubmitting(true);

    try {
      const API_URL = import.meta.env.VITE_BASE_URL || "http://localhost:9000";
      const token = getAuthToken();

      if (!token) {
        toast.error("Authentication token not found. Please login again.");
        return;
      }

      const payload = {
        taxAmount: taxAmount,
        description: message.trim(),
        startDate: formattedStartDate,
        endDate: formattedEndDate,
      };

      console.log("Tax payload:", payload);

      const response = await axios.post(
        `${API_URL}/api/abid-jewelry-ms/addTax`,
        payload,
        {
          headers: {
            "x-access-token": token,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        toast.success("Tax added successfully!");

        // Reset form
        setTaxAmount("");
        setMessage("");
        setTaxDateRange(null);

        // Refresh tax data
        fetchTaxData();
      } else {
        toast.error(response.data.message || "Failed to add tax");
      }
    } catch (error) {
      console.error("Error adding tax:", error);
      if (axios.isAxiosError(error)) {
        if (!error.response) {
          toast.error("Network error. Please check your internet connection.");
        } else {
          toast.error(error.response.data.message || "Failed to add tax");
        }
      } else {
        toast.error("An unexpected error occurred while adding tax");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full mx-auto px-3 py-6 sm:px-4 md:px-6 xl:px-8 xl:py-6">
      <h2 className="Source-Sans-Pro-font font-semibold text-[20px] mb-2">
        Tax Management
      </h2>

      <div className="bg-white rounded-lg shadow-md px-4 md:px-10 py-6 mb-6">
        <form
          className="mt-6 text-[15px] Poppins-font font-medium"
          onSubmit={handleTaxSubmit}
        >
          {/* Form Fields */}
          <div className="space-y-4 w-full">
            {/* Tax Date and Amount Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-8 xl:gap-12">
              <div className="flex flex-col">
                <label htmlFor="" className="mb-1">
                  Tax Date Range
                </label>
                <RangePicker
                  className="h-10 !text-gray-400 !border-[#D1D5DC]"
                  value={taxDateRange}
                  onChange={(dates) => {
                    console.log("Selected tax dates:", dates);
                    setTaxDateRange(dates);
                  }}
                  format="DD-MMM-YYYY"
                  allowClear={true}
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="" className="mb-1">
                  Tax Amount
                </label>
                <Input
                  type="number"
                  placeholder="3027.20"
                  className="outline-none focus:outline-none w-full"
                  value={taxAmount}
                  onChange={(e) => setTaxAmount(e.target.value)}
                />
              </div>
            </div>

            {/* Tax Description */}
            <div className="flex flex-col mb-5">
              <label htmlFor="" className="mb-1">
                Tax Description
              </label>
              <textarea
                value={message}
                onChange={handleMessageChange}
                placeholder="Description"
                rows={4}
                className="Poppins-font font-medium w-full px-4 py-2 border border-gray-300 rounded-md text-sm !focus:outline-none outline-none resize-none"
              ></textarea>
              <div className="flex justify-end text-[#2C8CD4] mt-0.5">
                {message.length}/{charLimit}
              </div>
            </div>
          </div>
          {canCreate && (
            <div className="flex justify-end gap-4 Poppins-font font-medium">
              <Button
                type="submit"
                text={isSubmitting ? "Saving..." : "Send"}
                disabled={isSubmitting}
                className="px-6 !bg-[#056BB7] border-none text-white"
              />
            </div>
          )}
        </form>
      </div>

      {/* Tax History Table */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <TaxManagementTable
          tableTitle="Tax History"
          columns={columns}
          data={taxData}
          enableRowModal={false}
          filterByStatus={false}
          tableDataAlignment="zone"
          canUpdate={canUpdate}
          canDelete={canDelete}
          onUpdate={fetchTaxData} // Pass refresh function
        />
      )}
    </div>
  );
};

export default TaxManagement;
