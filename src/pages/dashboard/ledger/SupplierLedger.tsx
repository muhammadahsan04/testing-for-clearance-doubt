import React, { useState, useEffect } from "react";
import { GoChevronLeft, GoChevronRight } from "react-icons/go";
import { LuEye } from "react-icons/lu";
import Dropdown from "../../../components/Dropdown";
import SupplierLedgerTable from "../../../components/SupplierLedgerTable";
import { useNavigate } from "react-router-dom";
import axios from "axios";

interface Invoice {
  sno: number;
  bank: string;
  date: string;
  supplier: string;
  debit: number;
  credit: number;
  balance: number;
}

interface SupplierData {
  supplier: {
    _id: string;
    supplierId: string;
    companyName: string;
    representativeName: string;
    email: string;
    phone: string;
    status: string;
    walletAmount: number;
  };
  totals: {
    debit: number;
    credit: number;
    balance: number;
    totalPaid: number;
  };
  invoices: any[];
}

const SupplierLedger = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [supplierData, setSupplierData] = useState<SupplierData[]>([]);
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

  const fetchSupplierData = async () => {
    try {
      setLoading(true);
      const API_URL =
        import.meta.env.VITE_BASE_URL || "http://192.168.100.18:9000";
      const token = getAuthToken();

      if (!token) {
        setError("No authentication token found");
        return;
      }

      const response = await axios.post(
        `${API_URL}/api/abid-jewelry-ms/getTotalInvoiceOfSupplier`,
        {},
        {
          headers: {
            "x-access-token": token,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        setSupplierData(response.data.data);
        setError(null);
      } else {
        setError("Failed to fetch supplier data");
      }
    } catch (error) {
      console.error("Error fetching supplier data:", error);
      setError("Error fetching supplier data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSupplierData();
  }, []);

  const transformedData = supplierData.map((item, index) => ({
    sno: index + 1,
    date: new Date(
      item.invoices[0]?.createdAt || new Date()
    ).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }),
    supplier: item.supplier.companyName,
    bank: "--",
    credit: item.totals.credit,
    debit: item.totals.debit,
    balance: item.totals.balance,
    supplierId: item.supplier._id,
    supplierDetails: item.supplier,
    totalPaid: item.totals.totalPaid,
    invoiceCount: item.invoices.length,
  }));

  const columns = [
    { header: "S No", accessor: "sno" },
    { header: "Date", accessor: "date" },
    { header: "Supplier", accessor: "supplier" },
    { header: "Bank", accessor: "bank" },
    { header: "Credit ($)", accessor: "credit" },
    { header: "Debit ($)", accessor: "debit" },
    { header: "Balance ($)", accessor: "balance" },
    { header: "Actions", accessor: "actions" },
  ];

  const handleSupplierClick = (supplier: any) => {
    navigate(
      `/dashboard/ledger/supplier-ledger/${supplier.supplierDetails._id}`,
      {
        state: {
          supplier: supplier.supplier,
          supplierData: supplier.supplierDetails,
        },
      }
    );
  };

  if (loading) {
    return (
      <div className="mx-auto px-3 py-6 sm:px-4 md:px-6 xl:px-6 xl:py-6 w-full">
        <div className="rounded-xl px-4 py-7 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto px-3 py-6 sm:px-4 md:px-6 xl:px-6 xl:py-6 w-full">
        <div className="bg-white rounded-xl px-4 py-7 flex items-center justify-center shadow-md">
          <div className="text-lg text-red-600">Error: {error}</div>
          <button
            onClick={fetchSupplierData}
            className="ml-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto px-3 py-6 sm:px-4 md:px-6 xl:px-6 xl:py-6 w-full">
      <SupplierLedgerTable
        columns={columns}
        data={transformedData}
        tableTitle="Supplier Ledger"
        onEdit={(row) => setSelectedUser(row)}
        onDelete={(row) => {
          setSelectedUser(row);
          setShowDeleteModal(true);
        }}
        onRowClick={handleSupplierClick}
      />
    </div>
  );
};

export default SupplierLedger;
