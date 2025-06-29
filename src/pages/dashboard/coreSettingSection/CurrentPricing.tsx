import React, { useState, useEffect } from "react";
import Input from "../../../components/Input";
import Button from "../../../components/Button";
import { useNavigate } from "react-router-dom";
import { DatePicker } from "antd";
import axios from "axios";
import { toast } from "react-toastify";
import moment from "moment";
import { hasPermission } from "../sections/CoreSettings";

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

const CurrentPricing: React.FC = () => {
  const navigate = useNavigate();
  const { RangePicker } = DatePicker;

  // State for Gold pricing
  const [goldPrice, setGoldPrice] = useState<string>("");
  const [goldDateRange, setGoldDateRange] = useState<any>(null);
  const [isSubmittingGold, setIsSubmittingGold] = useState<boolean>(false);

  // State for Diamond pricing
  const [diamondPrice, setDiamondPrice] = useState<string>("");
  const [diamondDateRange, setDiamondDateRange] = useState<any>(null);
  const [isSubmittingDiamond, setIsSubmittingDiamond] =
    useState<boolean>(false);

  // Permission variables add
  const userRole = getUserRole();
  const isAdmin = userRole === "Admin" || userRole === "SuperAdmin";
  const canCreate = isAdmin || hasPermission("Core Setting", "create");
  const canUpdate = isAdmin || hasPermission("Core Setting", "update");
  const canDelete = isAdmin || hasPermission("Core Setting", "delete");

  useEffect(() => {
    if (!canCreate) {
      toast.error("You don't have permission to add Current Pricing");
    }
  }, [canCreate]);
  // Handle Gold price submission
  const handleGoldSubmit = async () => {
    if (!canCreate) {
      toast.error("You don't have permission to add  Pricing");
      return;
    }

    if (!goldPrice) {
      toast.error("Please enter a gold price");
      return;
    }

    if (!goldDateRange || !goldDateRange[0] || !goldDateRange[1]) {
      toast.error("Please select a date range for gold pricing");
      return;
    }

    // Extract the dates properly from dayjs objects
    const startDate = goldDateRange[0].$d; // Get the native Date object
    const endDate = goldDateRange[1].$d; // Get the native Date object

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

    setIsSubmittingGold(true);

    try {
      const API_URL = import.meta.env.VITE_BASE_URL || "http://localhost:9000";
      const token = getAuthToken();

      if (!token) {
        toast.error("Authentication token not found. Please login again.");
        return;
      }

      const payload = {
        name: `$${goldPrice}`,
        startDate: formattedStartDate,
        endDate: formattedEndDate,
      };

      console.log("Gold pricing payload:", payload); // Log the payload for debugging

      const response = await axios.post(
        `${API_URL}/api/abid-jewelry-ms/addGoldPricing`,
        payload,
        {
          headers: {
            "x-access-token": token,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        toast.success("Gold pricing added successfully!");
        // Reset form
        setGoldPrice("");
        setGoldDateRange(null);
      } else {
        toast.error(response.data.message || "Failed to add gold pricing");
      }
    } catch (error) {
      console.error("Error adding gold pricing:", error);
      if (axios.isAxiosError(error)) {
        if (!error.response) {
          toast.error("Network error. Please check your internet connection.");
        } else {
          toast.error(
            error.response.data.message || "Failed to add gold pricing"
          );
        }
      } else {
        toast.error("An unexpected error occurred while adding gold pricing");
      }
    } finally {
      setIsSubmittingGold(false);
    }
  };

  // Handle Diamond price submission
  const handleDiamondSubmit = async () => {
    if (!canCreate) {
      toast.error("You don't have permission to add Diamond Pricing");
      return;
    }

    if (!diamondPrice) {
      toast.error("Please enter a diamond price");
      return;
    }

    if (!diamondDateRange || !diamondDateRange[0] || !diamondDateRange[1]) {
      toast.error("Please select a date range for diamond pricing");
      return;
    }

    // Extract the dates properly from dayjs objects
    const startDate = diamondDateRange[0].$d; // Get the native Date object
    const endDate = diamondDateRange[1].$d; // Get the native Date object

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

    setIsSubmittingDiamond(true);

    try {
      const API_URL = import.meta.env.VITE_BASE_URL || "http://localhost:9000";
      const token = getAuthToken();

      if (!token) {
        toast.error("Authentication token not found. Please login again.");
        return;
      }

      const payload = {
        name: `$${diamondPrice}`,
        startDate: formattedStartDate,
        endDate: formattedEndDate,
      };

      console.log("Diamond pricing payload:", payload); // Log the payload for debugging

      const response = await axios.post(
        `${API_URL}/api/abid-jewelry-ms/addDiamondPricing`,
        payload,
        {
          headers: {
            "x-access-token": token,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        toast.success("Diamond pricing added successfully!");
        // Reset form
        setDiamondPrice("");
        setDiamondDateRange(null);
      } else {
        toast.error(response.data.message || "Failed to add diamond pricing");
      }
    } catch (error) {
      console.error("Error adding diamond pricing:", error);
      if (axios.isAxiosError(error)) {
        if (!error.response) {
          toast.error("Network error. Please check your internet connection.");
        } else {
          toast.error(
            error.response.data.message || "Failed to add diamond pricing"
          );
        }
      } else {
        toast.error(
          "An unexpected error occurred while adding diamond pricing"
        );
      }
    } finally {
      setIsSubmittingDiamond(false);
    }
  };

  return (
    <div className="w-full mx-auto px-3 py-6 sm:px-4 md:px-6 xl:px-8 xl:py-6 min-h-screen">
      <h2 className="Inter-font font-semibold text-[20px] mb-2">
        Current Pricing
      </h2>
      {/* Gold Row */}
      <div className="bg-white flex flex-col gap-5 overflow-hidden shadow-md rounded-lg px-5 md:px-10 py-7 md:py-10">
        <div className="flex flex-col md:flex-row items-center gap-4 mb-6 ">
          <div className="flex flex-col w-full md:w-[45%]">
            <label className="font-semibold mb-1">
              Gold ( $ )<span className="text-red-500"> *</span>
              <span
                className="text-[12px] text-[#007AFF] cursor-pointer ml-2 underline"
                onClick={() => navigate("gold/history")}
              >
                View History
              </span>
            </label>
            <Input
              placeholder="$ 3027.20"
              className="w-full outline-none "
              type="number"
              value={goldPrice}
              onChange={(e) => setGoldPrice(e.target.value)}
            />
          </div>

          <div className="flex flex-col w-full md:w-[40%]">
            <label className="font-semibold mb-1">
              Date Range <span className="text-red-500"> *</span>
            </label>
            <RangePicker
              className="h-10 !text-gray-400 !border-[#D1D5DC]"
              value={goldDateRange}
              onChange={(dates) => {
                console.log("Selected gold dates:", dates); // Log the selected dates
                setGoldDateRange(dates);
              }}
              format="DD-MMM-YYYY" // Format to display as 23-Mar-2025
              allowClear={true}
            />
          </div>

          <div className="mt-2 md:mt-7 w-full md:w-[15%]">
            <Button
              text={isSubmittingGold ? "Saving..." : "Save"}
              className={`px-6 !bg-[#056BB7] border-none w-full text-white ${
                isSubmittingGold ? "opacity-70 cursor-not-allowed" : ""
              }`}
              onClick={handleGoldSubmit}
              disabled={isSubmittingGold}
            />
          </div>
        </div>

        {/* Diamond Row */}
        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="flex flex-col w-full md:w-[45%]">
            <label className="font-semibold mb-1">
              Diamond ( $ ) <span className="text-red-500"> *</span>
              <span
                className="text-[12px] text-[#007AFF] cursor-pointer ml-2 underline"
                onClick={() => navigate("diamond/history")}
              >
                View History
              </span>
            </label>
            <Input
              placeholder="$ 3027.20"
              className="w-full outline-none"
              type="number"
              value={diamondPrice}
              onChange={(e) => setDiamondPrice(e.target.value)}
            />
          </div>

          <div className="flex flex-col w-full md:w-[40%]">
            <label className="font-semibold mb-1">
              Date Range <span className="text-red-500"> *</span>
            </label>
            <RangePicker
              className="h-10 !text-gray-400 !border-[#D1D5DC]"
              value={diamondDateRange}
              onChange={(dates) => {
                console.log("Selected diamond dates:", dates); // Log the selected dates
                setDiamondDateRange(dates);
              }}
              format="DD-MMM-YYYY" // Format to display as 23-Mar-2025
              allowClear={true}
            />
          </div>

          <div className="mt-2 md:mt-7 w-full md:w-[15%]">
            {/* <Button
              text={isSubmittingDiamond ? "Saving..." : "Save"}
              className="bg-[#007AFF] text-white w-full border-none"
              onClick={handleDiamondSubmit}
              disabled={isSubmittingDiamond}
            /> */}
            <Button
              text={isSubmittingDiamond ? "Saving..." : "Save"}
              className={`px-6 !bg-[#056BB7] border-none w-full text-white ${
                isSubmittingDiamond ? "opacity-70 cursor-not-allowed" : ""
              }`}
              onClick={handleDiamondSubmit}
              disabled={isSubmittingDiamond}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrentPricing;
