// import React, { useState } from "react";
// import chain from "../../../assets/tops.png";
// import braclet from "../../../assets/bracelet.png";
// import noseRing from "../../../assets/noseRing.png";
// import earing from "../../../assets/earing.png";
// import ring from "../../../assets/ring.png";
// import locket from "../../../assets/locket.png";
// import { useNavigate } from "react-router-dom";
// import SaleInvoiceStatusTable from "../../../components/SaleInvoiceStatusTable";
// import { StatCard } from "../userManagementSections/OverAll";

// interface Column {
//   header: string;
//   accessor: string;
//   type?: "text" | "image" | "status" | "actions";
// }
// const SaleInvoiceStatus: React.FC = () => {
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [deleteModal, setDeleteModal] = useState(false);

//   const navigate = useNavigate();

//   const columns: Column[] = [
//     // { header: "S.No", accessor: "sno" },
//     { header: "Issued To Store", accessor: "store", type: "image" },
//     { header: "Status", accessor: "status", type: "status" },
//     { header: "Received Time", accessor: "receivedTime" },
//     { header: "Issued By", accessor: "issuedBy" },
//     { header: "Received By", accessor: "receivedBy" },
//     // { header: "Stock", accessor: "stock" },
//     // { header: "Location", accessor: "location" },
//     { header: "Actions", accessor: "actions", type: "actions" },
//   ];

//   const userData = [
//     {
//       // sno: "01",
//       storeName: "Matthew Wilson",
//       userImage: chain,
//       receivedTime: "05:00 PM - Friday, 4 April 2025",
//       productFor: "Male",
//       category: "Necklace",
//       issuedBy: "Metthew Milson",
//       stock: "05",
//       status: "Received",
//       receivedBy: "Nicholas Young",
//     },
//     {
//       // sno: "01",
//       storeName: "Emily Thompson",
//       userImage: braclet,
//       receivedTime: "--",
//       productFor: "Female",
//       category: "Ring",
//       issuedBy: "Christopher Brown",
//       stock: "100",
//       location: "Head Office",
//       status: "Pending",
//       receivedBy: "--",
//     },
//     {
//       // sno: "01",
//       storeName: "Nicholas Young",
//       userImage: noseRing,
//       receivedTime: "--",
//       productFor: "Unisex",
//       category: "Bracelet",
//       issuedBy: "Michael Johnson",
//       stock: "49",
//       status: "Pending",
//       location: "Store",
//       receivedBy: "--",
//     },
//   ];
//   return (
//     <div className="mx-auto px-3 py-6 sm:px-4 md:px-6 xl:px-8 xl:py-6 w-full">
//       {/* Stat Cards */}
//       <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 bg-white shadow rounded-xl p-4 mt-2 mb-10">
//         <StatCard
//           label="Total Issued Inventory"
//           value="600"
//           textColor="text-orange-400"
//         />
//         <StatCard label="Panding" value="100" textColor="text-green-400" />
//         <StatCard label="Received" value="500" textColor="text-purple-500" />
//         {/* <StatCard label="Admins" value="5" textColor="text-red-400" /> */}
//       </div>

//       <SaleInvoiceStatusTable
//         columns={columns}
//         data={userData}
//         eye={true}
//         tableDataAlignment="zone"
//         // tableTitle="Users"
//         onEdit={(row) => setSelectedUser(row)} // ✅ This opens the modal
//         onDelete={(row) => {
//           setSelectedUser(row); // ✅ Use the selected user
//           setShowDeleteModal(true); // ✅ Open the delete modal
//         }}
//       />
//     </div>
//   );
// };

// export default SaleInvoiceStatus;


"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { toast } from "react-toastify"
import SaleInvoiceStatusTable from "../../../components/SaleInvoiceStatusTable"
import { StatCard } from "../userManagementSections/OverAll"
import { hasPermission } from "../sections/CoreSettings";

interface Column {
  header: string
  accessor: string
  type?: "text" | "image" | "status" | "actions"
}

interface SaleInvoice {
  _id: string
  sno: number
  siId: string
  dateIssued: string
  zone: {
    name: string
    _id: string
  }
  store: {
    storeName: string
    _id: string
  }
  storeManagerName: string
  totals: {
    debit: number
    credit: number
  }
  status: string
  issuedBy: {
    firstName: string
    lastName: string
  }
}

// getUserRole function
const getUserRole = () => {
  let role = localStorage.getItem("role");
  if (!role) {
    role = sessionStorage.getItem("role");
  }
  return role;
};

const SaleInvoiceStatus: React.FC = () => {
  const [selectedUser, setSelectedUser] = useState(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [saleInvoiceData, setSaleInvoiceData] = useState<SaleInvoice[]>([])
  const [loading, setLoading] = useState(true)
  const [summaryData, setSummaryData] = useState({
    total: 0,
    pending: 0,
    received: 0,
    totalDebit: 0,
    totalCredit: 0,
  })

  // Permission variables add
  const userRole = getUserRole();
  const isAdmin = userRole === "Admin" || userRole === "SuperAdmin";
  const canCreate = isAdmin || hasPermission("Inventory", "create");
  const canUpdate = isAdmin || hasPermission("Inventory", "update");
  const canDelete = isAdmin || hasPermission("Inventory", "delete");


  const API_URL = import.meta.env.VITE_BASE_URL || "http://localhost:9000"

  const getAuthToken = () => {
    let token = localStorage.getItem("token")
    if (!token) {
      token = sessionStorage.getItem("token")
    }
    return token
  }

  // Fetch sale invoices on component mount
  useEffect(() => {
    fetchSaleInvoices()
  }, [])

  const fetchSaleInvoices = async () => {
    try {
      setLoading(true)
      const token = getAuthToken()
      if (!token) {
        toast.error("Authentication token not found. Please login again.")
        return
      }

      const response = await fetch(`${API_URL}/api/abid-jewelry-ms/getAllSaleInvoice`, {
        headers: {
          "x-access-token": token,
          "Content-Type": "application/json",
        },
      })

      const result = await response.json()

      if (result.success) {
        // Transform API data to match table format
        const transformedData = result.data.map((invoice: any, index: number) => ({
          _id: invoice._id,
          sno: index + 1,
          invoice: invoice.siId,
          invoiceDate: new Date(invoice.dateIssued).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }),
          storeName: invoice.store?.storeName || "N/A",
          storeManagerName: invoice.storeManagerName || "N/A",
          zoneName: invoice.zone?.name || "N/A",
          debit: invoice.totals?.debit || 0,
          credit: invoice.totals?.credit || 0,
          status: invoice?.status, // As requested by user
          issuedBy: `${invoice.issuedBy?.firstName || ""} ${invoice.issuedBy?.lastName || ""}`.trim() || "N/A",
          receivedTime: "--", // Not available in API response
          receivedBy: "--", // Not available in API response
          originalData: invoice, // Keep original data for detailed operations
        }))

        setSaleInvoiceData(transformedData)

        // Set summary data
        setSummaryData({
          total: result.summary?.total || 0,
          pending: result.summary?.pending || 0,
          received: result.summary?.received || 0,
          totalDebit: result.allSaleInvoiceDebit || 0,
          totalCredit: result.allSaleInvoiceCredit || 0,
        })
      } else {
        toast.error(result.message || "Failed to load sale invoices")
      }
    } catch (error) {
      console.error("Error fetching sale invoices:", error)
      toast.error("Failed to load sale invoices")
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = async (row: any) => {
    try {
      // Fetch detailed invoice data for editing
      const token = getAuthToken()
      if (!token) {
        toast.error("Authentication token not found. Please login again.")
        return
      }

      const response = await fetch(`${API_URL}/api/abid-jewelry-ms/getOneSaleInvoice/${row._id}`, {
        headers: {
          "x-access-token": token,
          "Content-Type": "application/json",
        },
      })

      const result = await response.json()
      console.log('das')
      if (result.success) {
        setSelectedUser(result.data)
      } else {
        toast.error("Failed to fetch invoice details")
      }
    } catch (error) {
      console.error("Error fetching invoice details:", error)
      toast.error("Failed to fetch invoice details")
    }
  }

  const handleDelete = async (row: any) => {
    try {
      const token = getAuthToken()
      if (!token) {
        toast.error("Authentication token not found. Please login again.")
        return
      }

      const response = await fetch(`${API_URL}/api/abid-jewelry-ms/deleteSaleInvoice/${row._id}`, {
        method: "DELETE",
        headers: {
          "x-access-token": token,
          "Content-Type": "application/json",
        },
      })

      const result = await response.json()
      if (result.success) {
        toast.success("Sale invoice deleted successfully")
        // Refresh the data after successful deletion
        await fetchSaleInvoices()
      } else {
        toast.error(result.message || "Failed to delete sale invoice")
      }
    } catch (error) {
      console.error("Error deleting invoice:", error)
      toast.error("Failed to delete sale invoice")
    }
  }

  const columns: Column[] = [
    { header: "S No", accessor: "sno" },
    { header: "Invoice", accessor: "invoice" },
    { header: "Invoice Date", accessor: "invoiceDate" },
    { header: "Issued to Store", accessor: "storeName" },
    { header: "Zone", accessor: "zoneName" },
    // { header: "Debit ($)", accessor: "debit" },
    // { header: "Credit ($)", accessor: "credit" },
    { header: "Status", accessor: "status", type: "status" },
    { header: "Issued By", accessor: "issuedBy" },
    { header: "Received By", accessor: "receivedBy" },
    { header: "Actions", accessor: "actions", type: "actions" },
  ]

  if (loading) {
    return (
      <div className="mx-auto px-3 py-6 sm:px-4 md:px-6 xl:px-8 xl:py-6 w-full">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto px-3 py-6 sm:px-4 md:px-6 xl:px-8 xl:py-6 w-full">
      {/* Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-white shadow rounded-xl p-4 mt-2 mb-10">
        <StatCard label="Total Sale Invoices" value={summaryData.total.toString()} textColor="text-blue-500" />
        <StatCard label="Pending" value={summaryData.pending.toString()} textColor="text-orange-400" />
        <StatCard label="Received" value={summaryData.received.toString()} textColor="text-green-400" />
        <StatCard
          label="Total Credit"
          value={`$${summaryData.totalCredit.toLocaleString()}`}
          textColor="text-purple-500"
        />
      </div>

      <SaleInvoiceStatusTable
        columns={columns}
        data={saleInvoiceData}
        summaryData={{
          debit: summaryData.totalDebit,
          credit: summaryData.totalCredit,
          balance: summaryData.totalCredit - summaryData.totalDebit,
        }}
        eye={true}
        tableDataAlignment="zone"
        tableTitle="Sale Invoices"
        onEdit={handleEdit}
        onDelete={handleDelete}
        onRefresh={fetchSaleInvoices}
        selectedUser={selectedUser}
        onCloseEdit={() => setSelectedUser(null)}
        canUpdate={canUpdate}
        canDelete={canDelete}
      />
    </div>
  )
}

export default SaleInvoiceStatus
