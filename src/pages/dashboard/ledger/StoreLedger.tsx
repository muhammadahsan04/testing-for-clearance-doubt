import React, { useState, useEffect } from "react";
import { GoChevronLeft, GoChevronRight } from "react-icons/go";
import { LuEye } from "react-icons/lu";
import Dropdown from "../../../components/Dropdown";
import StoreLedgerTable from "../../../components/StoreLedgerTable";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// Add API base URL - adjust this according to your environment
const API_URL = import.meta.env.VITE_BASE_URL || "http://192.168.100.18:9000";

interface Invoice {
  sno: number;
  bank: string;
  date: string;
  store: string;
  storeId: string;
  debit: number;
  credit: number;
  balance: number;
}

const StoreLedger = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [invoiceData, setInvoiceData] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const getAuthToken = () => {
    let token = localStorage.getItem("token");
    if (!token) {
      token = sessionStorage.getItem("token");
    }
    return token;
  };

  // Fetch total invoice data on component mount
  useEffect(() => {
    const fetchTotalInvoiceData = async () => {
      try {
        setLoading(true);

        const token = getAuthToken();

        if (!token) {
          setError("No authentication token found");
          return;
        }

        const response = await axios.post(
          `${API_URL}/api/abid-jewelry-ms/getTotalInvoiceOfStore`,
          {},
          {
            headers: {
              "Content-Type": "application/json",
              "x-access-token": token,
            },
          }
        );

        console.log("API Response:", response.data);

        // Transform API data to match your interface
        const transformedData: Invoice[] =
          response.data?.data?.map((item: any, index: number) => ({
            // storeId:  item.store?._id,
            sno: index + 1,
            bank: "--", // Not provided in API response
            date: item.invoices?.[0]?.dateIssued
              ? new Date(item.invoices[0].dateIssued).toLocaleDateString()
              : new Date().toLocaleDateString(),
            store: item.store?.storeName || "Unknown Store",
            storeId:
              item.store?._id ||
              item.store?.uniqueStoreId ||
              `store_${index + 1}`,
            debit: item.totals?.debit || 0,
            credit: item.totals?.credit || 0,
            balance: (item.totals?.credit || 0) - (item.totals?.debit || 0), // Calculate balance
          })) || [];

        setInvoiceData(transformedData);
        setError(null);
      } catch (err: any) {
        console.error("Error fetching total invoice data:", err);
        setError("Failed to fetch invoice data");

        // Fallback to static data in case of error
        setInvoiceData([
          {
            sno: 1,
            bank: "--",
            date: "10-Mar-2025",
            store: "Samaria",
            storeId: "store_001",
            debit: 1100,
            credit: 1100,
            balance: 20,
          },
          {
            sno: 2,
            bank: "--",
            date: "05-Mar-2025",
            store: "XYZ Suppliers",
            storeId: "store_002",
            debit: 100,
            credit: 100,
            balance: 20,
          },
          {
            sno: 3,
            bank: "--",
            date: "15-Mar-2025",
            store: "Royal Gems",
            storeId: "store_003",
            debit: 700,
            credit: 700,
            balance: 20,
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchTotalInvoiceData();
  }, []);

  const columns = [
    { header: "S No", accessor: "sno" },
    { header: "Date", accessor: "date" },
    { header: "Store Name", accessor: "store" },
    { header: "Bank", accessor: "bank" },
    { header: "Credit ($)", accessor: "credit" },
    { header: "Debit ($)", accessor: "debit" },
    { header: "Balance ($)", accessor: "balance" },
    { header: "Actions", accessor: "actions" },
  ];

  // Updated to use storeId instead of store name
  const handleStoreClick = (store: any) => {
    // Using storeId in URL parameters instead of name
    navigate(`/dashboard/ledger/store-ledger/${store.storeId}`);
  };

  if (loading) {
    return (
      <div className="mx-auto px-3 py-6 sm:px-4 md:px-6 xl:px-6 xl:py-6 w-full">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto px-3 py-6 sm:px-4 md:px-6 xl:px-6 xl:py-6 w-full">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-red-500">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto px-3 py-6 sm:px-4 md:px-6 xl:px-6 xl:py-6 w-full">
      <StoreLedgerTable
        columns={columns}
        data={invoiceData}
        tableTitle="January"
        onEdit={(row) => setSelectedUser(row)}
        onDelete={(row) => {
          setSelectedUser(row);
          setShowDeleteModal(true);
        }}
        onRowClick={handleStoreClick}
      />
    </div>
  );
};

export default StoreLedger;
