// import AllExpensesTable from "../../../components/AllExpensesTable";
// import React, { useState } from "react";

// interface Column {
//   header: string;
//   accessor: string;
//   type?: "text" | "image" | "status" | "actions" | "attachReceipt";
// }

// const AllExpense: React.FC = () => {
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const columns: Column[] = [
//     { header: "Refrence #", accessor: "refrence", type: "text" },
//     { header: "Date", accessor: "date", type: "text" },
//     { header: "Category", accessor: "category", type: "text" },
//     { header: "Name/Title", accessor: "nameOrTitle", type: "text" },
//     // { header: "Qty", accessor: "quantity", type: "text" },
//     { header: "Amount", accessor: "amount", type: "text" },
//     {
//       header: "Attach Receipt",
//       accessor: "attachReceipt",
//       type: "attachReceipt",
//     },
//     // { header: "Total ($)", accessor: "total", type: "text" },
//     { header: "Actions", accessor: "actions", type: "actions" }, // Optional: only if you're handling actions
//   ];

//   const addItemData = [
//     {
//       refrence: "01",
//       date: "03-5-2025",
//       supplier: "Royal",
//       nameOrTitle: "Enchanted Locket",
//       category: "Locket",
//       amount: "500",
//       attachReceipt: "View",
//     },
//     {
//       refrence: "02",
//       date: "03-5-2025",
//       supplier: "abc",
//       nameOrTitle: "Office Maintenance",
//       category: "Ring",
//       amount: "200",
//       attachReceipt: "View",
//     },
//     {
//       refrence: "03",
//       date: "03-5-2025",
//       supplier: "xyz",
//       nameOrTitle: "Diamond Bar",
//       category: "Braclet",
//       amount: "100",
//       attachReceipt: "View",
//     },
//   ];
//   return (
//     <div className="w-full mx-auto px-3 py-6 sm:px-4 md:px-6 xl:px-8 xl:py-8">
//       <h2 className="Inter-font font-semibold text-[20px] mb-2">
//         All Expenses
//       </h2>
//       {/* Add your form or content here */}
//       <AllExpensesTable
//         // eye={true}
//         className=""
//         // tableDataAlignment="zone"
//         columns={columns}
//         data={addItemData}
//         tableTitle="Expenses"
//         onEdit={(row) => setSelectedUser(row)} // ✅ This opens the modal
//         onDelete={(row) => {
//           setSelectedUser(row); // ✅ Use the selected user
//           setShowDeleteModal(true); // ✅ Open the delete modal
//         }}
//       />
//     </div>
//   );
// };

// export default AllExpense;

// "use client"

// import AllExpensesTable from "../../../components/AllExpensesTable"
// import type React from "react"
// import { useState, useEffect } from "react"
// import axios from "axios"
// import { toast } from "react-toastify"

// interface Column {
//   header: string
//   accessor: string
//   type?: "text" | "image" | "status" | "actions" | "attachReceipt"
// }

// // Helper function to get auth token
// const getAuthToken = () => {
//   let token = localStorage.getItem("token")
//   if (!token) {
//     token = sessionStorage.getItem("token")
//   }
//   return token
// }

// const AllExpense: React.FC = () => {
//   const [selectedUser, setSelectedUser] = useState(null)
//   const [showDeleteModal, setShowDeleteModal] = useState(false)
//   const [expensesData, setExpensesData] = useState([])
//   const [loading, setLoading] = useState(true)

//   const API_URL = import.meta.env.VITE_BASE_URL || "http://192.168.100.18:9000"

//   const columns: Column[] = [
//     { header: "Reference #", accessor: "refrence", type: "text" },
//     { header: "Date", accessor: "date", type: "text" },
//     { header: "Category", accessor: "category", type: "text" },
//     { header: "Name/Title", accessor: "nameOrTitle", type: "text" },
//     { header: "Amount", accessor: "amount", type: "text" },
//     {
//       header: "Attach Receipt",
//       accessor: "attachReceipt",
//       type: "attachReceipt",
//     },
//     { header: "Actions", accessor: "actions", type: "actions" },
//   ]

//   // Fetch expenses from API
//   const fetchExpenses = async () => {
//     try {
//       setLoading(true)
//       const token = getAuthToken()

//       if (!token) {
//         toast.error("Authentication token not found. Please login again.")
//         return
//       }

//       const response = await axios.get(`${API_URL}/api/abid-jewelry-ms/getAllExpenses`, {
//         headers: {
//           "x-access-token": token,
//         },
//       })

//       if (response.data.success) {
//         setExpensesData(response.data.data)
//       } else {
//         toast.error("Failed to fetch expenses")
//       }
//     } catch (error) {
//       console.error("Error fetching expenses:", error)
//       toast.error("Failed to fetch expenses")
//     } finally {
//       setLoading(false)
//     }
//   }

//   // Delete expense
//   const handleDeleteExpense = async (expense: any) => {
//     try {
//       const token = getAuthToken()

//       if (!token) {
//         toast.error("Authentication token not found. Please login again.")
//         return
//       }

//       const response = await axios.delete(`${API_URL}/api/abid-jewelry-ms/deleteExpense/${expense._id}`, {
//         headers: {
//           "x-access-token": token,
//         },
//       })

//       if (response.data.success) {
//         toast.success("Expense deleted successfully!")
//         // Remove the deleted expense from the state
//         setExpensesData(expensesData.filter((item: any) => item._id !== expense._id))
//       } else {
//         toast.error("Failed to delete expense")
//       }
//     } catch (error) {
//       console.error("Error deleting expense:", error)
//       toast.error("Failed to delete expense")
//     }
//   }

//   useEffect(() => {
//     fetchExpenses()
//   }, [])

//   if (loading) {
//     return (
//       <div className="w-full mx-auto px-3 py-6 sm:px-4 md:px-6 xl:px-8 xl:py-8">
//         <h2 className="Inter-font font-semibold text-[20px] mb-2">All Expenses</h2>
//         <div className="flex justify-center items-center h-64">
//           <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="w-full mx-auto px-3 py-6 sm:px-4 md:px-6 xl:px-8 xl:py-8">
//       <h2 className="Inter-font font-semibold text-[20px] mb-2">All Expenses</h2>
//       <AllExpensesTable
//         className=""
//         columns={columns}
//         data={expensesData}
//         tableTitle="Expenses"
//         onEdit={(row) => {
//           // Edit functionality is handled in AllExpensesTable component
//           console.log("Edit expense:", row)
//         }}
//         onDelete={handleDeleteExpense}
//       />
//     </div>
//   )
// }

// export default AllExpense

"use client";

import AllExpensesTable from "../../../components/AllExpensesTable";
import type React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

interface Column {
  header: string;
  accessor: string;
  type?: "text" | "image" | "status" | "actions" | "attachReceipt";
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

const AllExpense: React.FC = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [expensesData, setExpensesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Permission variables add
  const userRole = getUserRole();
  const isAdmin = userRole === "Admin" || userRole === "SuperAdmin";
  const canUpdate = isAdmin || hasPermission("Expense", "update");
  const canDelete = isAdmin || hasPermission("Expense", "delete");

  const API_URL = import.meta.env.VITE_BASE_URL || "http://192.168.100.18:9000";

  const columns: Column[] = [
    { header: "Reference #", accessor: "refrence", type: "text" },
    { header: "Date", accessor: "date", type: "text" },
    { header: "Category", accessor: "category", type: "text" },
    { header: "Name/Title", accessor: "nameOrTitle", type: "text" },
    { header: "Amount", accessor: "amount", type: "text" },
    {
      header: "Attach Receipt",
      accessor: "attachReceipt",
      type: "attachReceipt",
    },
    { header: "Actions", accessor: "actions", type: "actions" },
  ];

  // Fetch expenses from API
  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const token = getAuthToken();

      if (!token) {
        toast.error("Authentication token not found. Please login again.");
        return;
      }

      const response = await axios.get(
        `${API_URL}/api/abid-jewelry-ms/getAllExpenses`,
        {
          headers: {
            "x-access-token": token,
          },
        }
      );

      if (response.data.success) {
        setExpensesData(response.data.data);
      } else {
        toast.error("Failed to fetch expenses");
      }
    } catch (error) {
      console.error("Error fetching expenses:", error);
      toast.error("Failed to fetch expenses");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchExpenses();
  }, []);

  if (loading) {
    return (
      <div className="w-full mx-auto px-3 py-6 sm:px-4 md:px-6 xl:px-8 xl:py-8">
        <h2 className="Inter-font font-semibold text-[20px] mb-2">
          All Expenses
        </h2>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto px-3 py-6 sm:px-4 md:px-6 xl:px-8 xl:py-8">
      <h2 className="Inter-font font-semibold text-[20px] mb-2">
        All Expenses
      </h2>
      <AllExpensesTable
        className=""
        columns={columns}
        data={expensesData}
        tableTitle="Expenses"
        canUpdate={canUpdate}
        canDelete={canDelete}
        onEdit={handleEditExpense}
        onDelete={handleDeleteExpense}
      />
    </div>
  );
};

export default AllExpense;
