import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { StatCard } from "../userManagementSections/OverAll";
import ProductAgingTable from "../../../components/ProductAgingTable";

interface Column {
  header: string;
  accessor: string;
  type?: "text" | "image" | "status";
}

const getAuthToken = () => {
  let token = localStorage.getItem("token");
  if (!token) {
    token = sessionStorage.getItem("token");
  }
  return token;
};

const ProductAging: React.FC = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [apiData, setApiData] = useState([]);
  const [totals, setTotals] = useState({
    totalInventory: 0,
    totalHeadOffice: 0,
    totalStore: 0,
  });
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_BASE_URL || "http://localhost:9000";

  const columns: Column[] = [
    { header: "S.No", accessor: "sno" },
    { header: "Barcode", accessor: "barcode" },
    { header: "Product For", accessor: "productFor" },
    { header: "Category", accessor: "productName", type: "image" },
    { header: "Stock", accessor: "stock" },
    { header: "Location", accessor: "location" },
    { header: "Date Added", accessor: "dateAdded" },
    { header: "Head Office Aging", accessor: "headOfficeAging" },
    { header: "Store Office Aging", accessor: "storeAging" },
  ];


  useEffect(() => {
    fetchProductAgingData();
  }, []);

  return (
    <div className="mx-auto px-3 py-6 sm:px-4 md:px-6 xl:px-8 xl:py-6 w-full">
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 bg-white shadow rounded-xl p-4 mt-2 mb-10">
        <StatCard
          label="Total Inventory"
          value={totals.totalInventory.toString()}
          textColor="text-orange-400"
        />
        <StatCard
          label="Headoffice"
          value={totals.totalHeadOffice.toString()}
          textColor="text-green-400"
        />
        <StatCard
          label="Stores"
          value={totals.totalStore.toString()}
          textColor="text-purple-500"
        />
        <div className="rounded-xl text-center Inter-font w-full flex flex-col justify-center items-center gap-3 md:gap-1">
          {/* <p className={`text-gray-500 font-semibold text-[14px] text-red-400`}>
            {label}
          </p> */}
          <p className="text-[11px] font-medium text-gray-900 flex items-center gap-1">
            <span className="inline-block h-3 w-3 rounded-full bg-gradient-to-b from-[#61FF61] to-[#019B01] border border-gray-300"></span>
            0–30 Months - Fresh Stock
          </p>

          <p className="text-[11px] font-medium text-gray-900 flex items-center gap-1">
            <span className="inline-block h-3 w-3 rounded-full bg-gradient-to-b from-[#FA8884] to-[#C71616] border border-gray-300"></span>
            30+ Months - Old Stock
          </p>
        </div>
      </div>
      {loading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <ProductAgingTable
          columns={columns}
          data={loading ? [] : apiData}
          onEdit={(row) => setSelectedUser(row)}
          onDelete={(row) => {
            setSelectedUser(row);
            setShowDeleteModal(true);
          }}
        />
      )}
    </div>
  );
};

export default ProductAging;
