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

  useEffect(() => {
    fetchSupplierData();
  }, []);

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


  return (
    <div className="mx-auto px-3 py-6 sm:px-4 md:px-6 xl:px-6 xl:py-6 w-full">
      <SupplierLedgerTable
        columns={columns}
        data={transformedData}
        tableTitle="Supplier Ledger"
        onEdit={(row) => setSelectedUser(row)}
        onRowClick={handleSupplierClick}
      />
    </div>
  );
};

export default SupplierLedger;
