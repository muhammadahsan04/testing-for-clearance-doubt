import ZoneTable from "../../../components/ZoneTable";
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import moment from "moment";

interface Column {
  header: string;
  accessor: string;
  type?: "text" | "image" | "status" | "actions";
}

interface PricingData {
  _id: string;
  name: string;
  startDate: string;
  endDate: string;
  date?: string;
  rate?: string;
}

// Helper function to get auth token
const getAuthToken = () => {
  let token = localStorage.getItem("token");
  if (!token) {
    token = sessionStorage.getItem("token");
  }
  return token;
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

const HistoryPricing: React.FC = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [pricingData, setPricingData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { metal } = useParams();
  const navigate = useNavigate();

  const capitalizeFirstLetter = (str: string | undefined) => {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const formattedMetal = capitalizeFirstLetter(metal);
  const metalTableTitle = ["Gold", "Diamond"].includes(formattedMetal)
    ? formattedMetal
    : null;

  const columns: Column[] = [
    {
      header: "Date Range",
      accessor: "date",
      type: "text",
    },
    {
      header: "Rate",
      accessor: "rate",
      type: "text",
    },
  ];

  // Fetch pricing history on component mount
  useEffect(() => {
    if (metal) {
      fetchPricingHistory();
    }
  }, [metal]);

  // Fetch pricing history based on metal type
  const fetchPricingHistory = async () => {
    setLoading(true);
    try {
      const API_URL = import.meta.env.VITE_BASE_URL || "http://localhost:9000";
      const token = getAuthToken();

      if (!token) {
        toast.error("Authentication token not found. Please login again.");
        return;
      }

      const endpoint =
        metal === "gold"
          ? `${API_URL}/api/abid-jewelry-ms/getAllGoldPricings`
          : `${API_URL}/api/abid-jewelry-ms/getAllDiamondPricings`;

      const response = await axios.get(endpoint, {
        headers: {
          "x-access-token": token,
          "Content-Type": "application/json",
        },
      });

      if (response.data.success) {
        // Transform the data to match the expected format for the table
        const formattedData = response.data.data.map((item: PricingData) => ({
          _id: item._id,
          date: `${formatDate(item.startDate)} to ${formatDate(item.endDate)}`,
          rate: item.name,
        }));

        setPricingData(formattedData);
      } else {
        toast.error(
          response.data.message || `Failed to fetch ${metal} pricing history`
        );
      }
    } catch (error) {
      console.error(`Error fetching ${metal} pricing history:`, error);
      if (axios.isAxiosError(error)) {
        if (!error.response) {
          toast.error("Network error. Please check your internet connection.");
        } else {
          toast.error(
            error.response.data.message ||
              `Failed to fetch ${metal} pricing history`
          );
        }
      } else {
        toast.error(
          `An unexpected error occurred while fetching ${metal} pricing history`
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="w-full mx-auto px-3 py-6 sm:px-4 md:px-6 xl:px-8 xl:py-6 min-h-screen">
        <h2 className="Source-Sans-Pro-font font-semibold text-[#5D6679] text-[20px] mb-2">
          <span
            onClick={() =>
              navigate("/dashboard/core-settings/current-pricing", {
                replace: true,
              })
            }
            className="cursor-pointer"
          >
            {formattedMetal}
          </span>{" "}
          / <span className="text-black">Price History</span>
        </h2>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <ZoneTable
            tableTitle={`${formattedMetal} Price History`}
            columns={columns}
            data={pricingData}
            enableRowModal={false}
            filterByStatus={false}
            tableDataAlignment="zone"
          />
        )}
      </div>
    </>
  );
};

export default HistoryPricing;