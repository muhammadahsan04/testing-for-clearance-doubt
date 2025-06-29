// import React, { useState } from "react";
// import chain from "../../../assets/tops.png";
// import braclet from "../../../assets/bracelet.png";
// import noseRing from "../../../assets/noseRing.png";
// import earing from "../../../assets/earing.png";
// import ring from "../../../assets/ring.png";
// import locket from "../../../assets/locket.png";
// import { useNavigate } from "react-router-dom";
// import InventoryTable from "../../../components/InventoryTable";
// import { StatCard } from "../userManagementSections/OverAll";
// import ProductAgingTable from "../../../components/ProductAgingTable";

// interface Column {
//   header: string;
//   accessor: string;
//   type?: "text" | "image" | "status" | "actions";
// }
// const ProductAging: React.FC = () => {
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [deleteModal, setDeleteModal] = useState(false);

//   const navigate = useNavigate();

//   const columns: Column[] = [
//     { header: "S.No", accessor: "sno" },
//     { header: "Barcode", accessor: "barcode" },
//     { header: "Product For", accessor: "productFor" },
//     // { header: "Image", accessor: "image", type: "image" },
//     { header: "Category", accessor: "productName", type: "image" },
//     { header: "Stock", accessor: "stock" },
//     { header: "Location", accessor: "location" },
//     { header: "Date Added", accessor: "dateAdded" },
//     { header: "Head Office Aging", accessor: "headOfficeAging" },
//     { header: "Store Office Aging", accessor: "storeAging" },
//     // { header: "Actions", accessor: "actions", type: "actions" },
//   ];

//   const userData = [
//     {
//       sno: "01",
//       //   name: "Matthew Wilson",
//       userImage: chain,
//       barcode: "67643875",
//       productFor: "Male",
//       dateAdded: "07-Jan-2024",
//       storeAging: "23 M",
//       headOfficeAging: "23 M",
//       stock: "05",
//       location: "Store",
//       productName: "1Chain - Men - Cuban - 10k - 4.5CWT",
//     },
//     {
//       sno: "01",
//       //   name: "Emily Thompson",
//       userImage: braclet,
//       barcode: "67643875",
//       productFor: "Female",
//       dateAdded: "20-Jan-2024",
//       headOfficeAging: "0 M",
//       storeAging: "0 M",
//       stock: "100",
//       location: "Head Office",
//       productName: "2Chain - Men - Cuban - 10k - 4.5CWT",
//     },
//     {
//       sno: "01",
//       //   name: "Nicholas Young",
//       userImage: noseRing,
//       barcode: "67643875",
//       productFor: "Unisex",
//       dateAdded: "05-Jan-2024",
//       headOfficeAging: "11 M",
//       storeAging: "11 M",
//       stock: "49",
//       location: "Store",
//       productName: "3Chain - Men - Cuban - 10k - 4.5CWT",
//     },
//     {
//       sno: "01",
//       //   name: "Sarah Martinez",
//       userImage: earing,
//       barcode: "67643875",
//       productFor: "Kids",
//       dateAdded: "26-Jan-2024",
//       headOfficeAging: "31 M",
//       storeAging: "31 M",
//       stock: "53",
//       location: "Head Office",
//       productName: "4Chain - Men - Cuban - 10k - 4.5CWT",
//     },
//     {
//       sno: "01",
//       //   name: "Olivia Bennett",
//       userImage: ring,
//       barcode: "67643875",
//       productFor: "Male",
//       dateAdded: "05-Jan-2024",
//       headOfficeAging: "43 M",
//       storeAging: "43 M",
//       stock: "64",
//       location: "Store",
//       productName: "5Chain - Men - Cuban - 10k - 4.5CWT",
//     },
//     {
//       sno: "01",
//       //   name: "Jason Brown",
//       userImage: locket,
//       barcode: "67643875",
//       productFor: "Unisexs",
//       dateAdded: "20-Jan-2024",
//       headOfficeAging: "6 M",
//       storeAging: "6 M",
//       stock: "53",
//       location: "Store",
//       productName: "6Chain - Men - Cuban - 10k - 4.5CWT",
//     },
//   ];
//   return (
//     <div className="mx-auto px-3 py-6 sm:px-4 md:px-6 xl:px-8 xl:py-6 w-full">
//       {/* Stat Cards */}
//       <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 bg-white shadow rounded-xl p-4 mt-2 mb-10">
//         <StatCard
//           label="Total Inventory"
//           value="600"
//           textColor="text-orange-400"
//         />
//         <StatCard label="Headoffice" value="100" textColor="text-green-400" />
//         <StatCard label="Stores" value="500" textColor="text-purple-500" />
//         {/* <StatCard label="Stores" value="500" textColor="text-purple-500" /> */}
//         <div className="rounded-xl text-center Inter-font w-full flex flex-col justify-center items-center gap-3 md:gap-1">
//           {/* <p className={`text-gray-500 font-semibold text-[14px] text-red-400`}>
//             {label}
//           </p> */}
//           <p className="text-[11px] font-medium text-gray-900 flex items-center gap-1">
//             <span className="inline-block h-3 w-3 rounded-full bg-gradient-to-b from-[#61FF61] to-[#019B01] border border-gray-300"></span>
//             0–30 Months - Fresh Stock
//           </p>

//           <p className="text-[11px] font-medium text-gray-900 flex items-center gap-1">
//             <span className="inline-block h-3 w-3 rounded-full bg-gradient-to-b from-[#FA8884] to-[#C71616] border border-gray-300"></span>
//             30+ Months - Old Stock
//           </p>
//         </div>
//         {/* <StatCard label="Admins" value="5" textColor="text-red-400" /> */}
//       </div>
//       {/* view all inventory table use krna hai yaha */}
//       <ProductAgingTable
//         columns={columns}
//         data={userData}
//         // eye={true}
//         // tableDataAlignment="zone"
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

// export default ProductAging;

// import React, { useEffect, useState } from "react";
// import chain from "../../../assets/tops.png";
// import braclet from "../../../assets/bracelet.png";
// import noseRing from "../../../assets/noseRing.png";
// import earing from "../../../assets/earing.png";
// import ring from "../../../assets/ring.png";
// import locket from "../../../assets/locket.png";
// import { useNavigate } from "react-router-dom";
// import InventoryTable from "../../../components/InventoryTable";
// import { StatCard } from "../userManagementSections/OverAll";
// import ProductAgingTable from "../../../components/ProductAgingTable";

// interface Column {
//   header: string;
//   accessor: string;
//   type?: "text" | "image" | "status" | "actions";
// }

// const getAuthToken = () => {
//   let token = localStorage.getItem("token");
//   if (!token) {
//     token = sessionStorage.getItem("token");
//   }
//   return token;
// };

// const ProductAging: React.FC = () => {
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [deleteModal, setDeleteModal] = useState(false);
//   const [apiData, setApiData] = useState([]);
//   const [totals, setTotals] = useState({
//     totalInventory: 0,
//     totalHeadOffice: 0,
//     totalStore: 0,
//   });
//   const [loading, setLoading] = useState(true);

//   const navigate = useNavigate();
//   const API_URL = import.meta.env.VITE_BASE_URL || "http://localhost:9000";

//   // Move columns definition here, before the API functions
//   const columns: Column[] = [
//     { header: "S.No", accessor: "sno" },
//     { header: "Barcode", accessor: "barcode" },
//     { header: "Product For", accessor: "productFor" },
//     { header: "Category", accessor: "productName", type: "image" },
//     { header: "Stock", accessor: "stock" },
//     { header: "Location", accessor: "location" },
//     { header: "Date Added", accessor: "dateAdded" },
//     { header: "Head Office Aging", accessor: "headOfficeAging" },
//     { header: "Store Office Aging", accessor: "storeAging" },
//   ];

//   // API integration function
//   const fetchProductAgingData = async () => {
//     const token = getAuthToken();
//     if (!token) return;

//     try {
//       setLoading(true);
//       const response = await fetch(`${API_URL}/api/abid-jewelry-ms/inventory`, {
//         headers: {
//           "x-access-token": token,
//           "Content-Type": "application/json",
//         },
//       });

//       const result = await response.json();

//       if (result.success) {
//         const transformedData = result.data.map((item: any, index: number) => ({
//           sno: String(index + 1).padStart(2, "0"),
//           barcode: item.itemId?.barcode || "",
//           productFor: Array.isArray(item.itemId?.productFor)
//             ? item.itemId.productFor.join(", ")
//             : String(item.itemId?.productFor || ""),
//           userImage: item.itemId?.itemImage
//             ? `${API_URL}${item.itemId.itemImage}`
//             : null,
//           productName: `${item.itemId?.category?.name || ""} - ${
//             item.itemId?.subCategory?.name || ""
//           }`,
//           stock: String(item.stock || 0),
//           location:
//             (item.headOffice || 0) > (item.store || 0)
//               ? "Head Office"
//               : "Store",
//           dateAdded: item.dateAdded
//             ? new Date(item.dateAdded).toLocaleDateString("en-GB", {
//                 day: "2-digit",
//                 month: "short",
//                 year: "numeric",
//               })
//             : "",
//           headOfficeAging: String(item.headOfficeAging || ""),
//           storeAging: String(item.storeAging || ""),
//         }));

//         setApiData(transformedData);
//         setTotals({
//           totalInventory: Number(result.totals?.totalInventory || 0),
//           totalHeadOffice: Number(result.totals?.totalHeadOffice || 0),
//           totalStore: Number(result.totals?.totalStore || 0),
//         });
//       }
//     } catch (error) {
//       console.error("Error fetching product aging data:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchProductAgingData();
//   }, []);

//   // ... rest of your component code remains the same

//   return (
//     <div className="mx-auto px-3 py-6 sm:px-4 md:px-6 xl:px-8 xl:py-6 w-full">
//       {/* Update Stat Cards with API data */}
//       <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 bg-white shadow rounded-xl p-4 mt-2 mb-10">
//         <StatCard
//           label="Total Inventory"
//           value={totals.totalInventory.toString()}
//           textColor="text-orange-400"
//         />
//         <StatCard
//           label="Headoffice"
//           value={totals.totalHeadOffice.toString()}
//           textColor="text-green-400"
//         />
//         <StatCard
//           label="Stores"
//           value={totals.totalStore.toString()}
//           textColor="text-purple-500"
//         />
//         {/* ... legend component remains the same */}
//       </div>

//       {/* Use API data instead of hardcoded userData */}
//       <ProductAgingTable
//         columns={columns}
//         data={loading ? [] : apiData} // Use API data
//         onEdit={(row) => setSelectedUser(row)}
//         onDelete={(row) => {
//           setSelectedUser(row);
//           setShowDeleteModal(true);
//         }}
//       />

//       {loading && (
//         <div className="flex justify-center items-center py-8">
//           <div className="text-gray-500">Loading...</div>
//         </div>
//       )}
//     </div>
//   );
// };

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

  const fetchProductAgingData = async () => {
    const token = getAuthToken();
    if (!token) return;

    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/abid-jewelry-ms/inventory`, {
        headers: {
          "x-access-token": token,
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();

      if (result.success) {
        const transformedData = result.data.map((item: any, index: number) => ({
          id: item._id || `item-${index}`,
          sno: String(index + 1).padStart(2, "0"),
          barcode: item.itemId?.barcode || "N/A",
          productFor: Array.isArray(item.itemId?.productFor)
            ? item.itemId.productFor.join(", ")
            : item.itemId?.productFor || "N/A",
          userImage: item.itemId?.itemImage
            ? `${API_URL}${item.itemId.itemImage}`
            : null,
          productName: `${item.itemId?.category?.name || "Unknown"} - ${
            item.itemId?.subCategory?.name || "Unknown"
          }`,
          stock: item.stock || 0,
          location:
            (item.headOffice || 0) > (item.store || 0)
              ? "Head Office"
              : "Store",
          dateAdded: item.dateAdded
            ? new Date(item.dateAdded).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })
            : "N/A",
          headOfficeAging: item.headOfficeAging || "0 D",
          storeAging: item.storeAging || "0 D",
          // Keep original data for reference
          originalData: item,
        }));

        setApiData(transformedData);
        setTotals({
          totalInventory: result.totals?.totalInventory || 0,
          totalHeadOffice: result.totals?.totalHeadOffice || 0,
          totalStore: result.totals?.totalStore || 0,
        });
      }
    } catch (error) {
      console.error("Error fetching product aging data:", error);
    } finally {
      setLoading(false);
    }
  };

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
