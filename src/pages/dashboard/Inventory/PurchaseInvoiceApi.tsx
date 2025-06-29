import axios from "axios";
import { toast } from "react-toastify";

const API_URL = import.meta.env.VITE_BASE_URL || "http://localhost:9000";

const getAuthToken = () => {
  let token = localStorage.getItem("token");
  if (!token) {
    token = sessionStorage.getItem("token");
  }
  return token;
};

const getAuthHeaders = () => {
  const token = getAuthToken();
  if (!token) {
    toast.error("Authentication token not found. Please login again.");
    throw new Error("No authentication token");
  }
  return {
    "x-access-token": token,
    "Content-Type": "application/json",
  };
};

export const purchaseInvoiceApi = {
  // Get all purchase invoices
  getAllPurchaseInvoices: async () => {
    try {
      const response = await axios.get(
        `${API_URL}/api/abid-jewelry-ms/getAllPurchaseInvoices`,
        { headers: getAuthHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching purchase invoices:", error);
      toast.error("Failed to fetch purchase invoices");
      throw error;
    }
  },

  // Get purchase invoice by ID
  getPurchaseInvoiceById: async (purchaseInvoiceId: string) => {
    try {
      const response = await axios.get(
        `${API_URL}/api/abid-jewelry-ms/getOnePurchaseInvoice/${purchaseInvoiceId}`,
        { headers: getAuthHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching purchase invoice:", error);
      toast.error("Failed to fetch purchase invoice details");
      throw error;
    }
  },

  // Update purchase invoice
  updatePurchaseInvoice: async (purchaseInvoiceId: string, updateData: any) => {
    try {
      const response = await axios.put(
        `${API_URL}/api/abid-jewelry-ms/updatePurchaseInvoice/${purchaseInvoiceId}`,
        updateData,
        { headers: getAuthHeaders() }
      );
      toast.success("Purchase invoice updated successfully");
      return response.data;
    } catch (error) {
      console.error("Error updating purchase invoice:", error);
      toast.error("Failed to update purchase invoice");
      throw error;
    }
  },

  // Delete purchase invoice
  deletePurchaseInvoice: async (purchaseInvoiceId: string) => {
    try {
      const response = await axios.delete(
        `${API_URL}/api/abid-jewelry-ms/deletePurchaseInvoice/${purchaseInvoiceId}`,
        { headers: getAuthHeaders() }
      );
      toast.success("Purchase invoice deleted successfully");
      return response.data;
    } catch (error) {
      console.error("Error deleting purchase invoice:", error);
      toast.error("Failed to delete purchase invoice");
      throw error;
    }
  },
  // Add this method to your existing purchaseInvoiceApi object
  getOnePurchaseInvoice: async (purchaseInvoiceId: string) => {
    try {
      const response = await fetch(
        `${API_URL}/api/abid-jewelry-ms/getOnePurchaseInvoice/${purchaseInvoiceId}`,
        {
          method: "GET",
          headers: getAuthHeaders(), // Reuse the same auth header method
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching purchase invoice:", error);
      toast.error("Failed to fetch purchase invoice");
      throw error;
    }
  },

  getPurchaseReturnInvoicesBySupplier: async (supplierId: string) => {
    try {
      const response = await axios.get(
        `${API_URL}/api/abid-jewelry-ms/getPurchaseReturnInvoicesBySupplier/${supplierId}`,
        { headers: getAuthHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching purchase return invoices:", error);
      toast.error("Failed to fetch purchase return invoices");
      throw error;
    }
  },
};

// import axios from 'axios';
// import { toast } from 'react-toastify';

// const API_URL = import.meta.env.VITE_BASE_URL || "http://localhost:9000";

// const getAuthToken = () => {
//   let token = localStorage.getItem("token");
//   if (!token) {
//     token = sessionStorage.getItem("token");
//   }
//   return token;
// };

// const getAuthHeaders = () => {
//   const token = getAuthToken();
//   if (!token) {
//     toast.error("Authentication token not found. Please login again.");
//     throw new Error("No authentication token");
//   }
//   return {
//     "x-access-token": token,
//     "Content-Type": "application/json",
//   };
// };

// export const purchaseInvoiceApi = {
//   // Get all purchase invoices
//   getAllPurchaseInvoices: async () => {
//     try {
//       const response = await axios.get(
//         `${API_URL}/api/abid-jewelry-ms/getAllPurchaseInvoices`,
//         { headers: getAuthHeaders() }
//       );
//       return response.data;
//     } catch (error) {
//       console.error("Error fetching purchase invoices:", error);
//       toast.error("Failed to fetch purchase invoices");
//       throw error;
//     }
//   },

//   // Get purchase invoice by ID
//   getPurchaseInvoiceById: async (purchaseInvoiceId: string) => {
//     try {
//       const response = await axios.get(
//         `${API_URL}/api/abid-jewelry-ms/getOnePurchaseInvoice/${purchaseInvoiceId}`,
//         { headers: getAuthHeaders() }
//       );
//       return response.data;
//     } catch (error) {
//       console.error("Error fetching purchase invoice:", error);
//       toast.error("Failed to fetch purchase invoice details");
//       throw error;
//     }
//   },

//   // Get one purchase invoice (alias for getPurchaseInvoiceById)
//   getOnePurchaseInvoice: async (purchaseInvoiceId: string) => {
//     try {
//       const response = await axios.get(
//         `${API_URL}/api/abid-jewelry-ms/getOnePurchaseInvoice/${purchaseInvoiceId}`,
//         { headers: getAuthHeaders() }
//       );
//       return response.data;
//     } catch (error) {
//       console.error("Error fetching purchase invoice:", error);
//       toast.error("Failed to fetch purchase invoice details");
//       throw error;
//     }
//   },

//   // Get purchase return invoices by supplier
//   getPurchaseReturnInvoicesBySupplier: async (supplierId: string) => {
//     try {
//       const response = await axios.get(
//         `${API_URL}/api/abid-jewelry-ms/getPurchaseReturnInvoicesBySupplier/${supplierId}`,
//         { headers: getAuthHeaders() }
//       );
//       return response.data;
//     } catch (error) {
//       console.error("Error fetching purchase return invoices:", error);
//       toast.error("Failed to fetch purchase return invoices");
//       throw error;
//     }
//   },

//   // Update purchase invoice
//   updatePurchaseInvoice: async (purchaseInvoiceId: string, updateData: any) => {
//     try {
//       const response = await axios.put(
//         `${API_URL}/api/abid-jewelry-ms/updatePurchaseInvoice/${purchaseInvoiceId}`,
//         updateData,
//         { headers: getAuthHeaders() }
//       );
//       toast.success("Purchase invoice updated successfully");
//       return response.data;
//     } catch (error) {
//       console.error("Error updating purchase invoice:", error);
//       toast.error("Failed to update purchase invoice");
//       throw error;
//     }
//   },

//   // Delete purchase invoice
//   deletePurchaseInvoice: async (purchaseInvoiceId: string) => {
//     try {
//       const response = await axios.delete(
//         `${API_URL}/api/abid-jewelry-ms/deletePurchaseInvoice/${purchaseInvoiceId}`,
//         { headers: getAuthHeaders() }
//       );
//       toast.success("Purchase invoice deleted successfully");
//       return response.data;
//     } catch (error) {
//       console.error("Error deleting purchase invoice:", error);
//       toast.error("Failed to delete purchase invoice");
//       throw error;
//     }
//   },
// };
