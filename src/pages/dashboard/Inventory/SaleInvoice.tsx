// import SalesInvoiceTable from "../../../components/SalesInvoiceTable";
// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { toast } from "react-toastify"; // Make sure you have react-toastify installed

// interface Column {
//   header: string;
//   accessor: string;
//   type?: "select" | "text" | "image" | "status" | "actions";
// }

// interface ApiItem {
//   _id: string;
//   piId: string;
//   supplierCompanyName: {
//     _id: string;
//     companyName: string;
//     status: string;
//   };
//   items: {
//     itemBarcode: {
//       _id?: string;
//       barcode?: string;
//       itemImage?: string;
//       category?: {
//         name: string;
//       };
//       subCategory?: {
//         name: string;
//       };
//       productFor?: string[];
//       goldCategory?: {
//         // Remove the string union type
//         _id: string;
//         name: string;
//         description: string;
//       };
//     };
//     quantity: number;
//     costPrice: number;
//     sellPrice: number;
//   };
//   status: string;
// }

// const SaleInvoice: React.FC = () => {
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [userData, setUserData] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);

//   // Add state to track selected rows
//   const [selectedRows, setSelectedRows] = useState<{ [key: string]: boolean }>(
//     {}
//   );

//   // API functions
//   const getAuthToken = () => {
//     let token = localStorage.getItem("token");
//     if (!token) {
//       token = sessionStorage.getItem("token");
//     }
//     return token;
//   };

//   const API_URL = import.meta.env.VITE_BASE_URL || "http://localhost:9000";

//   // Fetch data from API
//   const fetchAvailableItems = async () => {
//     try {
//       setLoading(true);
//       const token = getAuthToken();

//       if (!token) {
//         toast.error("Authentication token not found. Please login again.");
//         return;
//       }

//       const response = await axios.get(
//         `${API_URL}/api/abid-jewelry-ms/getAvailableItems`,
//         {
//           headers: {
//             "x-access-token": token,
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       if (response.data.success) {
//         console.log("response.data.data", response.data.data);

//         const transformedData = response.data.data.map((item: ApiItem) => {
//           // console.log(
//           //   "goldCategory object:",
//           //   item.items.itemBarcode?.goldCategory
//           // );
//           // console.log("goldCategory name:", item.items.itemBarcode);

//           // Build product name with additional info
//           const categoryName =
//             item.items.itemBarcode?.category?.name ||
//             item.items.itemBarcode?.subCategory?.name ||
//             "Unknown Product";

//           // Get productFor array and join with commas
//           const productFor =
//             item.items.itemBarcode?.productFor &&
//             item.items.itemBarcode.productFor.length > 0
//               ? item.items.itemBarcode.productFor.join(", ")
//               : "N/A";

//           // Get goldCategory name (handle both object and string cases)
//           // With this simpler approach:
//           const goldCategory =
//             item.items.itemBarcode?.goldCategory?.name || "N/A";

//           // Combine all information for product name
//           let fullProductName = categoryName;
//           if (productFor !== "N/A") {
//             fullProductName += ` - ${productFor}`;
//           }
//           if (goldCategory !== "N/A") {
//             fullProductName += ` - ${goldCategory}`;
//           }

//           return {
//             productName: fullProductName,
//             userImage: item.items.itemBarcode?.itemImage
//               ? `${API_URL}${item.items.itemBarcode.itemImage}`
//               : null,
//             barcode: item.items.itemBarcode?.barcode || "N/A",
//             pid: item.piId || "N/A",
//             status: item.supplierCompanyName.status,
//             stock: item.items.quantity.toString(),
//             // Store individual fields for reference
//             categoryName,
//             productFor: item.items.itemBarcode?.productFor?.join(", ") || "N/A",
//             goldCategory,
//             // Keep original data for reference
//             originalData: item,
//             _id: item._id,
//           };
//         });

//         setUserData(transformedData);
//       } else {
//         toast.error("Failed to fetch items");
//       }
//     } catch (error) {
//       console.error("Error fetching items:", error);
//       toast.error("Error fetching items. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Fetch data on component mount
//   useEffect(() => {
//     fetchAvailableItems();
//   }, []);
//   // Function to handle checkbox changes
//   // const handleRowSelect = (rowId: string) => {
//   //   setSelectedRows((prev) => {
//   //     const newSelectedRows = { ...prev };
//   //     newSelectedRows[rowId] = !newSelectedRows[rowId];

//   //     // Log the selected row data using _id instead of barcode
//   //     const selectedRow = userData.find(
//   //       (row) => row.originalData?.items?.itemBarcode?._id === rowId
//   //     );
//   //     console.log("Selected/Deselected Row:", selectedRow.originalData?.items?.itemBarcode);

//   //     // Log all currently selected rows after update
//   //     const allSelectedRowIds = Object.keys(newSelectedRows).filter(
//   //       (id) => newSelectedRows[id]
//   //     );
//   //     const allSelectedRowData = userData.filter(
//   //       (row) => allSelectedRowIds.includes(row.originalData?.items?.itemBarcode?._id) // Use _id instead of barcode
//   //     );
//   //     console.log("All Selected Rows:", allSelectedRowData);

//   //     return newSelectedRows;
//   //   });
//   // };

//   const handleRowSelect = (rowId: string) => {
//     setSelectedRows((prev) => {
//       const newSelectedRows = { ...prev };
//       newSelectedRows[rowId] = !newSelectedRows[rowId];

//       // Log the selected row data using _id instead of barcode
//       const selectedRow = userData.find(
//         (row) => row.originalData?.items?.itemBarcode?._id === rowId
//       );
//       console.log(
//         "Selected/Deselected Row:",
//         selectedRow?.originalData?.items
//       );

//       // Log all currently selected rows after update
//       const allSelectedRowIds = Object.keys(newSelectedRows).filter(
//         (id) => newSelectedRows[id]
//       );
//       const allSelectedRowData = userData
//         .filter((row) =>
//           allSelectedRowIds.includes(row.originalData?.items?.itemBarcode?._id)
//         )
//         .map((row) => row.originalData?.items); // Extract the itemBarcode data

//       console.log("All Selected Rows:", allSelectedRowData);

//       return newSelectedRows;
//     });
//   };

//   const columns: Column[] = [
//     { header: "Select", accessor: "select", type: "select" },
//     { header: "Barcode", accessor: "barcode" },
//     { header: "PID", accessor: "pid" },
//     { header: "Product Name", accessor: "productName", type: "image" },
//     { header: "Stock", accessor: "stock", type: "text" },
//     { header: "Status", accessor: "status", type: "status" },
//   ];

//   if (loading) {
//     return (
//       <div className="mx-auto px-3 py-6 sm:px-4 md:px-6 xl:px-8 xl:py-6 space-y-6 lg:w-[100%] xl:w-full w-full overflow-x-hidden">
//         <div className="flex justify-center items-center h-64">
//           <div className="text-lg">Loading...</div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="mx-auto px-3 py-6 sm:px-4 md:px-6 xl:px-8 xl:py-6 space-y-6 lg:w-[100%] xl:w-full w-full overflow-x-hidden">
//       <SalesInvoiceTable
//         columns={columns}
//         data={userData}
//         tableTitle="Issue Inventory:"
//         enableRowModal={false}
//         selectedRows={selectedRows}
//         onRowSelect={handleRowSelect}
//         onEdit={(row) => setSelectedUser(row)}
//         onDelete={(row) => {
//           setSelectedUser(row);
//           setShowDeleteModal(true);
//         }}
//       />
//     </div>
//   );
// };

// export default SaleInvoice;

import SalesInvoiceTable from "../../../components/SalesInvoiceTable";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify"; // Make sure you have react-toastify installed
import { hasPermission } from "../sections/CoreSettings";


interface Column {
  header: string;
  accessor: string;
  type?: "select" | "text" | "image" | "status" | "actions";
}

interface ApiItem {
  _id: string;
  piId: string;
  supplierCompanyName: {
    _id: string;
    companyName: string;
    status: string;
  };
  items: {
    itemBarcode: {
      _id?: string;
      barcode?: string;
      itemImage?: string;
      category?: {
        name: string;
      };
      subCategory?: {
        name: string;
      };
      productFor?: string[];
      goldCategory?: {
        // Remove the string union type
        _id: string;
        name: string;
        description: string;
      };
    };
    quantity: number;
    costPrice: number;
    sellPrice: number;
  };
  status: string;
}

// getUserRole function
const getUserRole = () => {
  let role = localStorage.getItem("role");
  if (!role) {
    role = sessionStorage.getItem("role");
  }
  return role;
};

const SaleInvoice: React.FC = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userData, setUserData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItemsForInvoice, setSelectedItemsForInvoice] = useState<any[]>(
    []
  );

   // Permission variables add
  const userRole = getUserRole();
  const isAdmin = userRole === "Admin" || userRole === "SuperAdmin";
  const canCreate = isAdmin || hasPermission("Inventory", "create");
  const canUpdate = isAdmin || hasPermission("Inventory", "update");
  const canDelete = isAdmin || hasPermission("Inventory", "delete");

  // Add state to track selected rows
  const [selectedRows, setSelectedRows] = useState<{ [key: string]: boolean }>(
    {}
  );

  // API functions
  const getAuthToken = () => {
    let token = localStorage.getItem("token");
    if (!token) {
      token = sessionStorage.getItem("token");
    }
    return token;
  };

  const API_URL = import.meta.env.VITE_BASE_URL || "http://localhost:9000";

  // Fetch data from API
  const fetchAvailableItems = async () => {
    try {
      setLoading(true);
      const token = getAuthToken();

      if (!token) {
        toast.error("Authentication token not found. Please login again.");
        return;
      }

      const response = await axios.get(
        `${API_URL}/api/abid-jewelry-ms/getAvailableItems`,
        {
          headers: {
            "x-access-token": token,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        console.log("response.data.data", response.data.data);

        const transformedData = response.data.data.map((item: ApiItem) => {
          // console.log(
          //   "goldCategory object:",
          //   item.items.itemBarcode?.goldCategory
          // );
          // console.log("goldCategory name:", item.items.itemBarcode);

          // Build product name with additional info
          const categoryName =
            item.items.itemBarcode?.category?.name ||
            item.items.itemBarcode?.subCategory?.name ||
            "Unknown Product";

          // Get productFor array and join with commas
          const productFor =
            item.items.itemBarcode?.productFor &&
              item.items.itemBarcode.productFor.length > 0
              ? item.items.itemBarcode.productFor.join(", ")
              : "N/A";

          // Get goldCategory name (handle both object and string cases)
          // With this simpler approach:
          const goldCategory =
            item.items.itemBarcode?.goldCategory?.name || "N/A";

          // Combine all information for product name
          let fullProductName = categoryName;
          if (productFor !== "N/A") {
            fullProductName += ` - ${productFor}`;
          }
          if (goldCategory !== "N/A") {
            fullProductName += ` - ${goldCategory}`;
          }

          return {
            productName: fullProductName,
            userImage: item.items.itemBarcode?.itemImage
              ? `${API_URL}${item.items.itemBarcode.itemImage}`
              : null,
            barcode: item.items.itemBarcode?.barcode || "N/A",
            pid: item.piId || "N/A",
            status: item.supplierCompanyName.status,
            stock: item.items.quantity.toString(),
            // Store individual fields for reference
            categoryName,
            productFor: item.items.itemBarcode?.productFor?.join(", ") || "N/A",
            goldCategory,
            // Keep original data for reference
            originalData: item,
            _id: item._id,
          };
        });

        setUserData(transformedData);
      } else {
        toast.error("Failed to fetch items");
      }
    } catch (error) {
      console.error("Error fetching items:", error);
      toast.error("Error fetching items. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchAvailableItems();
  }, []);

  const handleClearSelections = () => {
    setSelectedRows({});
    setSelectedItemsForInvoice([]);
  };

  // const handleRowSelect = (rowId: string) => {
  //   setSelectedRows((prev) => {
  //     const newSelectedRows = { ...prev };
  //     newSelectedRows[rowId] = !newSelectedRows[rowId];

  //     // Log the selected row data using _id instead of barcode
  //     const selectedRow = userData.find(
  //       (row) => row.originalData?.items?.itemBarcode?._id === rowId
  //     );
  //     console.log(
  //       "Selected/Deselected Row:",
  //       selectedRow?.originalData?.items
  //     );

  //     // Log all currently selected rows after update
  //     const allSelectedRowIds = Object.keys(newSelectedRows).filter(
  //       (id) => newSelectedRows[id]
  //     );
  //     const allSelectedRowData = userData
  //       .filter((row) =>
  //         allSelectedRowIds.includes(row.originalData?.items?.itemBarcode?._id)
  //       )
  //       .map((row) => row.originalData?.items); // Extract the itemBarcode data

  //     console.log("All Selected Rows:", allSelectedRowData);

  //     return newSelectedRows;
  //   });
  // };

  const handleRowSelect = (rowId: string) => {
    setSelectedRows((prev) => {
      const newSelectedRows = { ...prev };
      newSelectedRows[rowId] = !newSelectedRows[rowId];

      // Update selected items for invoice
      const allSelectedRowIds = Object.keys(newSelectedRows).filter(
        (id) => newSelectedRows[id]
      );

      // const selectedItemsData = userData
      //   .filter((row) =>
      //     allSelectedRowIds.includes(row.originalData?.items?.itemBarcode?._id)
      //   )
      //   .map((row, index) => ({
      //     no: (index + 1).toString().padStart(2, "0"),
      //     productName: row.productName,
      //     userImage: row.userImage,
      //     stock: row.stock,
      //     qty: "", // Empty for user input
      //     costPrice: row.originalData?.items?.costPrice?.toString() || "0",
      //     salePrice: "", // Empty for user input
      //     // Keep original data for reference
      //     originalData: row.originalData,
      //     _id: row._id,
      //     barcode: row.barcode,
      //   }));

      const selectedItemsData = userData
        .filter((row) =>
          allSelectedRowIds.includes(row.originalData?.items?.itemBarcode?._id)
        )
        .map((row, index) => ({
          no: (index + 1).toString().padStart(2, "0"),
          productName: row.productName,
          userImage: row.userImage,
          stock: row.stock,
          qty: "", // Empty for user input
          costPrice: row.originalData?.items?.costPrice?.toString() || "0",
          salePrice: "", // Empty for user input
          // Use unique ID for each item
          _id:
            row.originalData?.items?.itemBarcode?._id || `${row._id}-${index}`,
          originalData: row.originalData,
          barcode: row.barcode,
        }));

      setSelectedItemsForInvoice(selectedItemsData);

      console.log("All Selected Items for Invoice:", selectedItemsData);

      return newSelectedRows;
    });
  };

  const columns: Column[] = [
    { header: "Select", accessor: "select", type: "select" },
    { header: "Barcode", accessor: "barcode" },
    { header: "PID", accessor: "pid" },
    { header: "Product Name", accessor: "productName", type: "image" },
    { header: "Stock", accessor: "stock", type: "text" },
    { header: "Status", accessor: "status", type: "status" },
  ];

  if (loading) {
    return (
      <div className="mx-auto px-3 py-6 sm:px-4 md:px-6 xl:px-8 xl:py-6 space-y-6 lg:w-[100%] xl:w-full w-full overflow-x-hidden">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto px-3 py-6 sm:px-4 md:px-6 xl:px-8 xl:py-6 space-y-6 lg:w-[100%] xl:w-full w-full overflow-x-hidden">
      <SalesInvoiceTable
        columns={columns}
        data={userData}
        tableTitle="Issue Inventory:"
        enableRowModal={false}
        selectedRows={selectedRows}
        onRowSelect={handleRowSelect}
        selectedItemsForInvoice={selectedItemsForInvoice} // Pass selected items
        onClearSelections={handleClearSelections} // Add this prop
        onEdit={(row) => setSelectedUser(row)}
        onDelete={(row) => {
          setSelectedUser(row);
          setShowDeleteModal(true);
        }}
        canCreate={canCreate}
      />
    </div>
  );
};

export default SaleInvoice;
