// import React, { useState } from "react";
// import { useNavigate, Outlet } from "react-router-dom";
// import Button from "../../../components/Button";
// import StoreTable from "../../../components/StoreTable";
// import DownTownBranch from "../../../assets/DownTownBranch.svg";
// import VelvetGold from "../../../assets/Velvet&Gold.svg";
// import HeirloomCo from "../../../assets/Heirloom&Co.svg";
// import RoseGoldBlooms from "../../../assets/RoseGoldBlooom.svg";
// import MoonStoneMeadow from "../../../assets/MoonStoneMeadow.svg";
// import SilverIvy from "../../../assets/SilverIvy.svg";
// import HaloGem from "../../../assets/Halo&Gem.svg";
// import { StatCard } from "../userManagementSections/OverAll";
// import AddZoneModal from "../../../components/AddZoneModal";
// interface Column {
//   header: string;
//   accessor: string;
//   type?: "text" | "image" | "status" | "actions";
// }
// const OverAll: React.FC = () => {
//   const [showModal, setShowModal] = useState(false);
//   const [roleName, setRoleName] = useState("");
//   const [uploadedFile, setUploadedFile] = useState<File | null>(null);
//   const [isEditing, setIsEditing] = useState(false); // To track if it's Edit mode
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [deleteModal, setDeleteModal] = useState(false);

//   const navigate = useNavigate();

//   const handleViewAllClick = (role: string) => {
//     if (role === "ZoneOne") {
//       navigate("/dashboard/store-management/zone-one"); // Navigates to /overall/admin
//     }
//     if (role === "ZoneTwo") {
//       navigate("/dashboard/store-management/zone-two"); // Navigates to /overall/admin
//     }
//     if (role === "ZoneThree") {
//       navigate("/dashboard/store-management/zone-three"); // Navigates to /overall/admin
//     }
//     if (role === "ZoneFour") {
//       navigate("/dashboard/store-management/zone-four"); // Navigates to /overall/admin
//     }
//     if (role === "ZoneFive") {
//       navigate("/dashboard/store-management/zone-five"); // Navigates to /overall/admin
//     }
//     // else {
//     //   navigate(`/roles/${role.toLowerCase().replace(" ", "-")}`);
//     // }
//   };

//   const handleAddUser = () => {
//     navigate("/dashboard/store-management/add-store");
//   };
//   const columns: Column[] = [
//     { header: "Store ID", accessor: "id" },
//     { header: "Store Name", accessor: "name", type: "image" },
//     { header: "Status", accessor: "status", type: "status" },
//     { header: "Zone", accessor: "zone" },
//     // { header: "Last Login", accessor: "date" },
//     { header: "Actions", accessor: "actions", type: "actions" },
//   ];

//   const storeData = [
//     {
//       id: "Manag-23",
//       name: "Downtown Branch",
//       userImage: DownTownBranch,
//       zone: "Zone 1",
//       status: "Active",
//       //   date: "11-06-2025",
//     },
//     {
//       id: "Admin-43",
//       name: "Velvet & Goold",
//       userImage: VelvetGold,
//       zone: "Zone 1",
//       status: "Inactive",
//       //   date: "19-03-2025",
//     },
//     {
//       id: "Saleper-27",
//       name: "Heirloom & Co",
//       userImage: HeirloomCo,
//       zone: "Zone 1",
//       status: "Active",
//       //   date: "01-01-2025",
//     },
//     {
//       id: "Deliv-38",
//       name: "Rose Gold Blooms",
//       userImage: RoseGoldBlooms,
//       zone: "Zone 1",
//       status: "Inactive",
//       //   date: "12-04-2025",
//     },
//     {
//       id: "Entry-12",
//       name: "Moonstone Meadow",
//       userImage: MoonStoneMeadow,
//       zone: "Zone 1",
//       status: "Active",
//       //   date: "08-02-2025",
//     },
//     {
//       id: "Entry-13",
//       name: "Silver Ivy",
//       userImage: SilverIvy,
//       zone: "Zone 1",
//       status: "Inactive",
//       //   date: "07-02-2025",
//     },
//     {
//       id: "Entry-14",
//       name: "Halo & Gem",
//       userImage: HaloGem,
//       zone: "Zone 1",
//       status: "Active",
//       //   date: "06-02-2025",
//     },
//   ];
//   return (
//     <div className="mx-auto px-3 py-6 sm:px-4 md:px-6 xl:px-8 xl:py-6 space-y-6 lg:w-[100%] xl:w-full w-full overflow-x-hidden">
//       <h2 className="Inter-font font-semibold text-[20px] mb-2">
//         Store Management
//       </h2>

//       {/* Stat Cards */}
//       <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 bg-white shadow rounded-xl p-4">
//         <StatCard label="Total Zone" value="2500" textColor="text-orange-400" />
//         <StatCard
//           label="Active Store"
//           value="1800"
//           textColor="text-green-400"
//         />
//         <StatCard
//           label="Inactive Users"
//           value="150"
//           textColor="text-purple-500"
//         />
//         <StatCard
//           label="Top Performing Store"
//           value="Downntown Branch"
//           textColor="text-red-400"
//         />
//       </div>

//       {/* Role Cards */}
//       {/* Role Group Header */}
//       <div className="bg-white gap-4 rounded-xl p-6">
//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
//           <h2 className="Inter-font font-bold text-[17px] text-[#48505E] !display-inline w-fit">
//             Zones
//           </h2>
//           <div className="flex flex-wrap justify-start sm:justify-end gap-3 Source-Sans-Pro-font font-semibold text-white w-auto">
//             <button
//               className="bg-[#D03F3F] text-whit w-32 rounded "
//               onClick={() => {
//                 setShowModal(true);
//                 // setIsEditing(true);
//               }}
//             >
//               Add Zone
//             </button>

//             <Button
//               text="Add Store"
//               variant="border"
//               className="!bg-[#4E4FEB] border-blue-600 w-32"
//               onClick={handleAddUser}
//             />
//           </div>
//         </div>
//         <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-3 lg:gap-4 mt-6">
//           <ZoneCard
//             role="Zone 1"
//             count="3"
//             color="text-[#F24F7C]"
//             bg="bg-[#FEEDF2]"
//             btnBg="bg-[#F24F7C]"
//             onViewAllClick={() => handleViewAllClick("ZoneOne")}
//           />
//           <ZoneCard
//             role="Zone 2"
//             count="238"
//             color="text-[#EDC755]"
//             bg="bg-[#FDF9EE]"
//             btnBg="bg-[#EDC755]"
//             onViewAllClick={() => handleViewAllClick("ZoneTwo")}
//           />
//           <ZoneCard
//             role="Zone 3"
//             count="12"
//             color="text-[#33B0E0]"
//             bg="bg-[#EBF7FC]"
//             btnBg="bg-[#33B0E0]"
//             onViewAllClick={() => handleViewAllClick("ZoneThree")}
//           />
//           <ZoneCard
//             role="Zone 4"
//             count="15"
//             color="text-[#D67D53]"
//             bg="bg-[#FBF2EE]"
//             btnBg="bg-[#D67D53]"
//             onViewAllClick={() => handleViewAllClick("ZoneFour")}
//           />
//           <ZoneCard
//             role="Zone 5"
//             count="6"
//             color="text-[#5B9877]"
//             bg="bg-[#EFF5F1]"
//             btnBg="bg-[#5B9877]"
//             onViewAllClick={() => handleViewAllClick("ZoneFive")}
//           />
//         </div>
//       </div>

//       <StoreTable
//         columns={columns}
//         data={storeData}
//         tableTitle="Store"
//         onEdit={(row) => setSelectedUser(row)} // ✅ This opens the modal
//         onDelete={(row) => {
//           setSelectedUser(row); // ✅ Use the selected user
//           setShowDeleteModal(true); // ✅ Open the delete modal
//         }}
//       />

//       <Outlet />

//       {/* Modal */}
//       {showModal && (
//         <AddZoneModal
//           showModal={showModal}
//           setShowModal={setShowModal}
//           isEditing={isEditing}
//           setIsEditing={setIsEditing}
//           roleName={roleName}
//           setRoleName={setRoleName}
//           uploadedFile={uploadedFile}
//           setUploadedFile={setUploadedFile}
//         />
//       )}
//     </div>
//   );
// };

// export default OverAll;

// export const ZoneCard = ({
//   role,
//   count,
//   color = "text-[#F22F46]",
//   bg = "bg-[#FFE8EC]",
//   onViewAllClick,
//   btnBg,
// }: {
//   role: string;
//   count: string;
//   color?: string;
//   bg?: string;
//   btnBg?: string;
//   onViewAllClick?: () => void;
// }) => (
//   // <div
//   //   className={`rounded-2xl p-3 md:p-3 lg:p-4 ${bg} shadow w-full flex gap-2 justify-between items-start border border-gray-300`}
//   // >
//   //   <p
//   //     className={`w-auto sm:w-[40%] text-nowrap text-sm sm:text-base md:text-sm lg:text-md font-semibold h-full flex items-center ${color}`}
//   //   >
//   //     {role}
//   //   </p>
//   //   <div className="flex-grow">
//   //     <div className="flex items-end gap-1 text-[#2B2E36]">
//   //       <p className="text-sm sm:text-md font-semibold">{count}</p>
//   //       <p className="text-xs mb-1 text-gray-500">store</p>
//   //     </div>
//   //     <button
//   //       onClick={onViewAllClick}
//   //       className={`${btnBg} text-white text-xs sm:text-sm px-2 sm:px-4 py-1 rounded-lg font-medium shadow-sm hover:opacity-90 w-full sm:w-auto whitespace-nowrap`}
//   //     >
//   //       View all
//   //     </button>
//   //   </div>
//   // </div>
//   <div
//     className={`rounded-2xl p-3 md:p-3 lg:p-4 ${bg} shadow w-full flex gap-2 items-center justify-between border border-gray-300`}
//   >
//     <p
//       className={`w-auto sm:w-[40%] text-nowrap text-sm sm:text-base md:text-sm lg:text-md font-semibold flex items-center ${color}`}
//     >
//       {role}
//     </p>
//     <div className="flex flex-col items-end">
//       {/* <div className="flex items-end gap-1 text-[#2B2E36]">
//         <p className="text-sm sm:text-md font-semibold">{count}</p> */}
//       {/* <p className="text-xs mb-1 text-gray-500">store</p>
//       </div> */}
//       <div className="flex items-start gap-1 text-[#2B2E36] w-full">
//         <p className="text-sm sm:text-md font-semibold !text-left">{count}</p>
//         <p className="text-xs mb-1 text-gray-500 mt-0.5">store</p>
//       </div>
//       <button
//         onClick={onViewAllClick}
//         className={`${btnBg} text-white text-xs sm:text-sm px-2 sm:px-4 py-1 rounded-lg font-medium shadow-sm hover:opacity-90 w-full sm:w-auto whitespace-nowrap`}
//       >
//         View all
//       </button>
//     </div>
//   </div>
// );

// import React, { useState, useEffect } from "react";
// import { useNavigate, Outlet } from "react-router-dom";
// import Button from "../../../components/Button";
// import StoreTable from "../../../components/StoreTable";
// import { StatCard } from "../userManagementSections/OverAll";
// import AddZoneModal from "../../../components/AddZoneModal";
// import axios from "axios";
// import { toast } from "react-toastify";

// interface Column {
//   header: string;
//   accessor: string;
//   type?: "text" | "image" | "status" | "actions";
// }

// interface Store {
//   id: string;
//   name: string;
//   userImage: string;
//   zone: string;
//   status: string;
//   originalData?: any;
// }

// const OverAll: React.FC = () => {
//   const [showModal, setShowModal] = useState(false);
//   const [roleName, setRoleName] = useState("");
//   const [uploadedFile, setUploadedFile] = useState<File | null>(null);
//   const [isEditing, setIsEditing] = useState(false);
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [deleteModal, setDeleteModal] = useState(false);
//   const [storeData, setStoreData] = useState<Store[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [totalZones, setTotalZones] = useState(0);
//   const [activeStores, setActiveStores] = useState(0);
//   const [inactiveStores, setInactiveStores] = useState(0);
//   const [topPerformingStore, setTopPerformingStore] = useState("--");
//   const [zoneData, setZoneData] = useState<any[]>([]);

//   const navigate = useNavigate();

//   // Helper function to get auth token
//   const getAuthToken = () => {
//     let token = localStorage.getItem("token");
//     if (!token) {
//       token = sessionStorage.getItem("token");
//     }
//     return token;
//   };

//   useEffect(() => {
//     fetchStores();
//     fetchZones();
//   }, []);

//   const fetchStores = async () => {
//     try {
//       setLoading(true);

//       const API_URL = import.meta.env.VITE_BASE_URL || "http://localhost:9000";
//       const token = getAuthToken();

//       if (!token) {
//         toast.error("Authentication token not found. Please login again.");
//         return;
//       }

//       const response = await axios.get(
//         `${API_URL}/api/abid-jewelry-ms/getAllShops`,
//         {
//           headers: {
//             "x-access-token": token,
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       if (response.data && response.data.data) {
//         const formattedData = response.data.data.map((store: any) => ({
//           id: store.autoGenerated,
//           storeId: store._id,
//           name: store.storeName,
//           userImage:
//             `${API_URL}${store.storeLogo}` || "https://via.placeholder.com/50",
//           zone: store?.prefixId?.prefixName || "--",
//           status: store.status,
//           originalData: store,
//           managerId: store.managerId,
//         }));

//         setStoreData(formattedData);
//         setActiveStores(
//           formattedData.filter((store: any) => store?.status === "active")
//             .length
//         );
//         setInactiveStores(
//           formattedData.filter((store: any) => store?.status === "inactive")
//             .length
//         );

//         // Set top performing store (for now just using the first active store)
//         const activeStore = formattedData.find(
//           (store: any) => store?.status === "active"
//         );
//         if (activeStore) {
//           setTopPerformingStore(activeStore.name);
//         }
//       }
//     } catch (error) {
//       console.error("Error fetching stores:", error);
//       toast.error("Failed to fetch stores. Please try again later.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchZones = async () => {
//     try {
//       const API_URL = import.meta.env.VITE_BASE_URL || "http://localhost:9000";
//       const token = getAuthToken();

//       if (!token) {
//         toast.error("Authentication token not found. Please login again.");
//         return;
//       }

//       const response = await axios.get(
//         `${API_URL}/api/abid-jewelry-ms/getAllStorePrefix`,
//         {
//           headers: {
//             "x-access-token": token,
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       if (response.data && response.data.data) {
//         const zones = response.data.data;
//         setZoneData(zones);
//         setTotalZones(zones.length);
//       }
//     } catch (error) {
//       console.error("Error fetching zones:", error);
//       toast.error("Failed to fetch zones. Please try again later.");
//     }
//   };

//   // Function to count stores by zone
//   const getStoreCountByZone = (zoneName: string) => {
//     return storeData.filter((store) => store.zone === zoneName).length;
//   };

//   const handleViewAllClick = (role: string) => {
//     if (role === "ZoneOne") {
//       navigate("/dashboard/store-management/zone-one");
//     }
//     if (role === "ZoneTwo") {
//       navigate("/dashboard/store-management/zone-two");
//     }
//     if (role === "ZoneThree") {
//       navigate("/dashboard/store-management/zone-three");
//     }
//     if (role === "ZoneFour") {
//       navigate("/dashboard/store-management/zone-four");
//     }
//     if (role === "ZoneFive") {
//       navigate("/dashboard/store-management/zone-five");
//     }
//   };

//   const handleAddUser = () => {
//     navigate("/dashboard/store-management/add-store");
//   };

//   const columns: Column[] = [
//     { header: "Store ID", accessor: "id" },
//     { header: "Store Name", accessor: "name", type: "image" },
//     { header: "Status", accessor: "status", type: "status" },
//     { header: "Zone", accessor: "zone" },
//     { header: "Actions", accessor: "actions", type: "actions" },
//   ];

//   // Handle edit and delete callbacks
//   const handleEdit = (row: any) => {
//     if (row === null) {
//       // This is a callback after edit is complete
//       fetchStores();
//     } else {
//       setSelectedUser(row);
//     }
//   };

//   const handleDelete = (row: any) => {
//     if (row === null) {
//       // This is a callback after delete is complete
//       fetchStores();
//     } else {
//       setSelectedUser(row);
//       setShowDeleteModal(true);
//     }
//   };

//   return (
//     <div className="mx-auto px-3 py-6 sm:px-4 md:px-6 xl:px-8 xl:py-6 space-y-6 lg:w-[100%] xl:w-full w-full overflow-x-hidden">
//       <h2 className="Inter-font font-semibold text-[20px] mb-2">
//         Store Management
//       </h2>

//       {/* Stat Cards */}
//       <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 bg-white shadow rounded-xl p-4">
//         <StatCard
//           label="Total Zone"
//           value={totalZones.toString()}
//           textColor="text-orange-400"
//         />
//         <StatCard
//           label="Active Store"
//           value={activeStores.toString()}
//           textColor="text-green-400"
//         />
//         <StatCard
//           label="Inactive Store"
//           value={inactiveStores.toString()}
//           textColor="text-purple-500"
//         />
//         <StatCard
//           label="Top Performing Store"
//           value={topPerformingStore}
//           textColor="text-red-400"
//         />
//       </div>

//       {/* Role Cards */}
//       <div className="bg-white gap-4 rounded-xl p-6 border">
//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
//           <h2 className="Inter-font font-bold text-[17px] text-[#48505E] !display-inline w-fit">
//             Zones
//           </h2>
//           <div className="flex flex-wrap justify-start sm:justify-end gap-3 Source-Sans-Pro-font font-semibold text-white w-auto">
//             <button
//               className="bg-[#D03F3F] text-white w-32 rounded"
//               onClick={() => {
//                 setShowModal(true);
//               }}
//             >
//               Add Zone
//             </button>

//             <Button
//               text="Add Store"
//               variant="border"
//               className="!bg-[#4E4FEB] border-blue-600 w-32"
//               onClick={handleAddUser}
//             />
//           </div>
//         </div>
//         <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-3 lg:gap-4 mt-6">
//           {zoneData.slice(0, 5).map((zone, index) => {
//             const colors = [
//               {
//                 color: "text-[#F24F7C]",
//                 bg: "bg-[#FEEDF2]",
//                 btnBg: "bg-[#F24F7C]",
//               },
//               {
//                 color: "text-[#EDC755]",
//                 bg: "bg-[#FDF9EE]",
//                 btnBg: "bg-[#EDC755]",
//               },
//               {
//                 color: "text-[#33B0E0]",
//                 bg: "bg-[#EBF7FC]",
//                 btnBg: "bg-[#33B0E0]",
//               },
//               {
//                 color: "text-[#D67D53]",
//                 bg: "bg-[#FBF2EE]",
//                 btnBg: "bg-[#D67D53]",
//               },
//               {
//                 color: "text-[#5B9877]",
//                 bg: "bg-[#EFF5F1]",
//                 btnBg: "bg-[#5B9877]",
//               },
//             ];
//             const colorSet = colors[index % colors.length];

//             return (
//               <ZoneCard
//                 key={zone._id}
//                 role={zone.prefixName}
//                 count={getStoreCountByZone(zone.prefixName).toString()}
//                 color={colorSet.color}
//                 bg={colorSet.bg}
//                 btnBg={colorSet.btnBg}
//                 onViewAllClick={() => handleViewAllClick(`Zone${index + 1}`)}
//               />
//             );
//           })}
//         </div>
//       </div>

//       {loading ? (
//         <div className="flex justify-center items-center h-40">
//           <p>Loading stores...</p>
//         </div>
//       ) : (
//         <StoreTable
//           columns={columns}
//           data={storeData}
//           tableTitle="Store"
//           onEdit={handleEdit}
//           onDelete={handleDelete}
//         />
//       )}

//       <Outlet />

//       {/* Modal */}
//       {showModal && (
//         <AddZoneModal
//           showModal={showModal}
//           setShowModal={setShowModal}
//           isEditing={isEditing}
//           setIsEditing={setIsEditing}
//           roleName={roleName}
//           setRoleName={setRoleName}
//           uploadedFile={uploadedFile}
//           setUploadedFile={setUploadedFile}
//         />
//       )}
//     </div>
//   );
// };

// export default OverAll;

// export const ZoneCard = ({
//   role,
//   count,
//   color = "text-[#F22F46]",
//   bg = "bg-[#FFE8EC]",
//   onViewAllClick,
//   btnBg,
// }: {
//   role: string;
//   count: string;
//   color?: string;
//   bg?: string;
//   btnBg?: string;
//   onViewAllClick?: () => void;
// }) => (
//   <div
//     className={`rounded-2xl p-3 md:p-3 lg:p-4 ${bg} shadow w-full flex gap-2 items-center justify-between border border-gray-300`}
//   >
//     <p
//       className={`w-auto sm:w-[40%] text-nowrap text-sm sm:text-base md:text-sm lg:text-md font-semibold flex items-center ${color}`}
//     >
//       {role}
//     </p>
//     <div className="flex flex-col items-end">
//       <div className="flex items-start gap-1 text-[#2B2E36] w-full">
//         <p className="text-sm sm:text-md font-semibold !text-left">{count}</p>
//         <p className="text-xs mb-1 text-gray-500 mt-0.5">store</p>
//       </div>
//       <button
//         onClick={onViewAllClick}
//         className={`${btnBg} text-white text-xs sm:text-sm px-2 sm:px-4 py-1 rounded-lg font-medium shadow-sm hover:opacity-90 w-full sm:w-auto whitespace-nowrap`}
//       >
//         View all
//       </button>
//     </div>
//   </div>
// );

import React, { useState, useEffect } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import Button from "../../../components/Button";
import StoreTable from "../../../components/StoreTable";
import { StatCard } from "../userManagementSections/OverAll";
import AddZoneModal from "../../../components/AddZoneModal";
import axios from "axios";
import { toast } from "react-toastify";

interface Column {
  header: string;
  accessor: string;
  type?: "text" | "image" | "status" | "actions";
}

interface Store {
  id: string;
  name: string;
  userImage: string;
  zone: string;
  status: string;
  originalData?: any;
}

const OverAll: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [roleName, setRoleName] = useState("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [storeData, setStoreData] = useState<Store[]>([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Helper function to get auth token
  const getAuthToken = () => {
    let token = localStorage.getItem("token");
    if (!token) {
      token = sessionStorage.getItem("token");
    }
    return token;
  };

  useEffect(() => {
    fetchStores();
  }, []);

  const fetchStores = async () => {
    try {
      setLoading(true);

      const API_URL = import.meta.env.VITE_BASE_URL || "http://localhost:9000";
      const token = getAuthToken();

      if (!token) {
        toast.error("Authentication token not found. Please login again.");
        return;
      }

      const response = await axios.get(
        `${API_URL}/api/abid-jewelry-ms/getAllShops`,
        {
          headers: {
            "x-access-token": token,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data && response.data.data) {
        const formattedData = response.data.data.map((store: any) => ({
          id: store.autoGenerated,
          storeId: store._id,
          name: store.storeName,
          userImage:
            `${API_URL}${store.storeLogo}` || "https://via.placeholder.com/50",
          zone: store?.prefixId?.prefixName || "--",
          status: store.status,
          originalData: store,
          managerId: store.managerId,
        }));

        setStoreData(formattedData);
      }
    } catch (error) {
      console.error("Error fetching stores:", error);
      toast.error("Failed to fetch stores. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleViewAllClick = (role: string) => {
    if (role === "ZoneOne") {
      navigate("/dashboard/store-management/zone-one");
    }
    if (role === "ZoneTwo") {
      navigate("/dashboard/store-management/zone-two");
    }
    if (role === "ZoneThree") {
      navigate("/dashboard/store-management/zone-three");
    }
    if (role === "ZoneFour") {
      navigate("/dashboard/store-management/zone-four");
    }
    if (role === "ZoneFive") {
      navigate("/dashboard/store-management/zone-five");
    }
  };

  const handleAddUser = () => {
    navigate("/dashboard/store-management/add-store");
  };

  const columns: Column[] = [
    { header: "Store ID", accessor: "id" },
    { header: "Store Name", accessor: "name", type: "image" },
    { header: "Status", accessor: "status", type: "status" },
    { header: "Zone", accessor: "zone" },
    { header: "Actions", accessor: "actions", type: "actions" },
  ];

  // Handle edit and delete callbacks
  const handleEdit = (row: any) => {
    if (row === null) {
      // This is a callback after edit is complete
      fetchStores();
    } else {
      setSelectedUser(row);
    }
  };

  const handleDelete = (row: any) => {
    if (row === null) {
      // This is a callback after delete is complete
      fetchStores();
    } else {
      setSelectedUser(row);
      setShowDeleteModal(true);
    }
  };

  return (
    <div className="mx-auto px-3 py-6 sm:px-4 md:px-6 xl:px-8 xl:py-6 space-y-6 lg:w-[100%] xl:w-full w-full overflow-x-hidden">
      <h2 className="Inter-font font-semibold text-[20px] mb-2">
        Store Management
      </h2>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 bg-white shadow rounded-xl p-4">
        <StatCard label="Total Zone" value="2500" textColor="text-orange-400" />
        <StatCard
          label="Active Store"
          value="1800"
          textColor="text-green-400"
        />
        <StatCard
          label="Inactive Users"
          value="150"
          textColor="text-purple-500"
        />
        <StatCard
          label="Top Performing Store"
          value="Downntown Branch"
          textColor="text-red-400"
        />
      </div>

      {/* Role Cards */}
      <div className="bg-white gap-4 rounded-xl p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
          <h2 className="Inter-font font-bold text-[17px] text-[#48505E] !display-inline w-fit">
            Zones
          </h2>
          <div className="flex flex-wrap justify-start sm:justify-end gap-3 Source-Sans-Pro-font font-semibold text-white w-auto">
            <button
              className="bg-[#D03F3F] text-whit w-32 rounded "
              onClick={() => {
                setShowModal(true);
                // setIsEditing(true);
              }}
            >
              Add Zone
            </button>

            <Button
              text="Add Store"
              variant="border"
              className="!bg-[#4E4FEB] border-blue-600 w-32"
              onClick={handleAddUser}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-3 lg:gap-4 mt-6">
          <ZoneCard
            role="Zone 1"
            count="3"
            color="text-[#F24F7C]"
            bg="bg-[#FEEDF2]"
            btnBg="bg-[#F24F7C]"
            onViewAllClick={() => handleViewAllClick("ZoneOne")}
          />
          <ZoneCard
            role="Zone 2"
            count="238"
            color="text-[#EDC755]"
            bg="bg-[#FDF9EE]"
            btnBg="bg-[#EDC755]"
            onViewAllClick={() => handleViewAllClick("ZoneTwo")}
          />
          <ZoneCard
            role="Zone 3"
            count="12"
            color="text-[#33B0E0]"
            bg="bg-[#EBF7FC]"
            btnBg="bg-[#33B0E0]"
            onViewAllClick={() => handleViewAllClick("ZoneThree")}
          />
          <ZoneCard
            role="Zone 4"
            count="15"
            color="text-[#D67D53]"
            bg="bg-[#FBF2EE]"
            btnBg="bg-[#D67D53]"
            onViewAllClick={() => handleViewAllClick("ZoneFour")}
          />
          <ZoneCard
            role="Zone 5"
            count="6"
            color="text-[#5B9877]"
            bg="bg-[#EFF5F1]"
            btnBg="bg-[#5B9877]"
            onViewAllClick={() => handleViewAllClick("ZoneFive")}
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <p>Loading stores...</p>
        </div>
      ) : (
        <StoreTable
          columns={columns}
          data={storeData}
          tableTitle="Store"
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      <Outlet />

      {/* Modal */}
      {showModal && (
        <AddZoneModal
          showModal={showModal}
          setShowModal={setShowModal}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          roleName={roleName}
          setRoleName={setRoleName}
          uploadedFile={uploadedFile}
          setUploadedFile={setUploadedFile}
        />
      )}
    </div>
  );
};

export default OverAll;

export const ZoneCard = ({
  role,
  count,
  color = "text-[#F22F46]",
  bg = "bg-[#FFE8EC]",
  onViewAllClick,
  btnBg,
}: {
  role: string;
  count: string;
  color?: string;
  bg?: string;
  btnBg?: string;
  onViewAllClick?: () => void;
}) => (
  <div
    className={`rounded-2xl p-3 md:p-3 lg:p-4 ${bg} shadow w-full flex gap-2 items-center justify-between border border-gray-300`}
  >
    <p
      className={`w-auto sm:w-[40%] text-nowrap text-sm sm:text-base md:text-sm lg:text-md font-semibold flex items-center ${color}`}
    >
      {role}
    </p>
    <div className="flex flex-col items-end">
      <div className="flex items-start gap-1 text-[#2B2E36] w-full">
        <p className="text-sm sm:text-md font-semibold !text-left">{count}</p>
        <p className="text-xs mb-1 text-gray-500 mt-0.5">store</p>
      </div>
      <button
        onClick={onViewAllClick}
        className={`${btnBg} text-white text-xs sm:text-sm px-2 sm:px-4 py-1 rounded-lg font-medium shadow-sm hover:opacity-90 w-full sm:w-auto whitespace-nowrap`}
      >
        View all
      </button>
    </div>
  </div>
);
