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

const SaleInvoiceStatus: React.FC = () => {
  const [selectedUser, setSelectedUser] = useState(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [saleInvoiceData, setSaleInvoiceData] = useState<SaleInvoice[]>([])
  const [loading, setLoading] = useState(true)
  // getUserRole function
  const getUserRole = () => {
    let role = localStorage.getItem("role");
    if (!role) {
      role = sessionStorage.getItem("role");
    }
    return role;
  };

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
