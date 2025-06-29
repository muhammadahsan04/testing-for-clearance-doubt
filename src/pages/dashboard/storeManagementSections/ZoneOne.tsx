//without use Zone.tsx file
// import React, { useState } from "react";
// import { useNavigate, Outlet } from "react-router-dom";
// import Button from "../../../components/Button";
// import Input from "../../../components/Input";
// import downTownBranch from "../../../assets/downTownBranch.svg";
// import CelestialDiamonds from "../../../assets/CelestialDiamonds.svg";
// import BranchHeirloom from "../../../assets/BranchHeirloom.svg";
// import Dropdown from "../../../components/Dropdown";
// import { StatCard } from "../userManagementSections/OverAll";

// const ZoneOne: React.FC = () => {
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [deleteModal, setDeleteModal] = useState(false);

//   const [search, setSearch] = useState(""); // Search text
//   const [statusFilter, setStatusFilter] = useState("All"); // Default to 'All'
//   const [currentPage, setCurrentPage] = useState(1); // Start from page 1

//   const navigate = useNavigate();

//   const filteredData = [
//     {
//       id: "ST-001",
//       name: "Downtown Branch",
//       image: downTownBranch,
//       address: "123 Main Street, New York",
//       manager: "John Doe",
//       contact: "+1 (123) 456-7890",
//       hours: "10 AM - 9 PM (Mon-Sun)",
//       status: "Active",
//     },
//     {
//       id: "ST-002",
//       name: "Celestial Diamonds",
//       image: CelestialDiamonds,
//       address: "456 Diamond Ave, New York",
//       manager: "Sarah Lane",
//       contact: "+1 (456) 789-1234",
//       hours: "11 AM - 8 PM (Mon-Sun)",
//       status: "Inactive",
//     },
//     {
//       id: "ST-003",
//       name: "Branch Heirloom & Co.",
//       image: BranchHeirloom,
//       address: "789 Luxury Blvd, New York",
//       manager: "Michael Carter",
//       contact: "+1 (987) 654-3210",
//       hours: "10 AM - 9 PM (Mon-Sun)",
//       status: "Active",
//     },
//   ];

//   return (
//     <div className="mx-auto px-3 py-6 sm:px-4 md:px-6 xl:px-8 xl:py-6 space-y-6 lg:w-[100%] xl:w-full w-full overflow-x-hidden">
//       <h2 className="Source-Sans-Pro-font font-semibold text-[#5D6679] text-[20px] mb-2">
//         <span
//           onClick={() =>
//             navigate("/dashboard/store-management/overall", { replace: true })
//           }
//           className="cursor-pointer"
//         >
//           Store Management
//         </span>{" "}
//         / <span className="text-black">Zone 1</span>
//       </h2>

//       {/* Stat Cards */}
//       <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-5 gap-1 md:gap-3 lg:gap-4 bg-white shadow rounded-xl p-4">
//         <StatCard label="Total Store" value="10" textColor="text-orange-400" />
//         <StatCard
//           label="Top Performing Store"
//           value="Downntown Branch"
//           textColor="text-red-400"
//         />
//         <StatCard label="Active Store" value="8" textColor="text-purple-500" />
//         <StatCard
//           label="Inactive Store"
//           value="2"
//           textColor="text-purple-500"
//         />
//         <StatCard
//           label="Total Staff of zone 1"
//           value="150"
//           textColor="text-purple-500"
//         />
//       </div>

//       <div className="w-full bg-white p-4 rounded-lg shadow space-y-4">
//         {/* Top Bar */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
//           {/* Search & Filter */}
//           <div className="flex flex-row sm:items-center gap-3">
//             <Input
//               placeholder="Search Store, Store ID"
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//               className="w-full sm:max-w-xs rounded-full border border-gray-300 px-4 py-2"
//             />
//             <Dropdown
//               options={["All", "Active", "Inactive"]}
//               DropDownName="Status"
//               defaultValue="All"
//               onSelect={(val) => {
//                 setStatusFilter(val);
//                 setCurrentPage(1);
//               }}
//             />
//           </div>

//           {/* Buttons */}
//           <div className="flex justify-end gap-3">
//             <Button
//               text="Export"
//               variant="border"
//               className="bg-[#5D6679] text-white w-24 rounded-md"
//             />
//             <Button
//               text="Add Store"
//               // variant="primary"
//               className="bg-[#4E4FEB] text-white w-28 rounded-md border-none"
//             />
//           </div>
//         </div>

//         {/* Store Cards */}
//         <div className="space-y-4 grid sm:grid-cols-2 lg:grid-cols-1 sm:space-x-4 md:space-x-3 mx-auto lg:space-x-0 md:grid-cols-2">
//           {filteredData.map((store) => (
//             <div
//               key={store.id}
//               className="flex flex-col lg:flex-row bg-white rounded-xl md:m-2 shadow-sm overflow-hidden border border-gray-200"
//             >
//               {/* Store Image */}
//               <div className="md:w-auto lg:w-78 xl:w-80 h-auto  md:h-54 xl:h-auto lg:h-44">
//                 <img
//                   src={store.image}
//                   alt={store.name}
//                   className="object-contain sm:object-cover w-full h-full"
//                 />
//               </div>

//               {/* Store Info */}
//               <div className="flex-1 p-4 flex flex-col justify-between md:ml-0 lg:ml-3 xl:ml-12">
//                 <div className="space-y-1">
//                   <div className="flex items-center gap-2 text-sm">
//                     <span
//                       className={`h-3 w-3 rounded-full ${
//                         store.status === "Active"
//                           ? "bg-green-500"
//                           : "bg-red-500"
//                       }`}
//                     ></span>
//                     <span className="text-[#5D6679]">
//                       Store ID:{" "}
//                       <span className="text-blue-600 font-medium">
//                         {store.id}
//                       </span>
//                     </span>
//                   </div>
//                   <h3 className="text-md md:text-lg lg:text-sm xl:text-[16px] font-medium text-[#5D6679]">
//                     {store.name}
//                   </h3>
//                   <p className="text-[13px] sm:text-[12px] xl:text-sm text-[#858D9D] m-0">
//                     {store.address}
//                   </p>
//                   <p className="text-[13px] sm:text-[12px] xl:text-sm text-[#858D9D] m-0">
//                     Manager Name - {store.manager}
//                   </p>
//                   <p className="text-[13px] sm:text-[12px] xl:text-sm text-[#858D9D] m-0">
//                     Contact Number - {store.contact}
//                   </p>
//                   <p className="text-[13px] sm:text-[12px] xl:text-sm text-[#858D9D]">
//                     Operating Hours - {store.hours}
//                   </p>
//                 </div>
//               </div>

//               {/* Actions */}
//               <div className="flex lg:flex-col justify-center items-center gap-2 px-4 py-2 sm:py-2 md:p-4">
//                 <Button
//                   text="View"
//                   className="!text-[#1366D9] w-24 rounded-md border border-gray-100"
//                 />
//                 <Button
//                   text="Edit"
//                   className="!text-[#E19133] w-24 rounded-md border border-gray-100"
//                 />
//                 <Button
//                   text="Delete"
//                   className="!text-[#DC3545] w-24 rounded-md border border-gray-100"
//                 />
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ZoneOne;

// without cosole current data when click on item
// import React, { useState, useEffect } from "react";
// import { useNavigate, Outlet } from "react-router-dom";
// import downTownBranch from "../../../assets/downTownBranch.svg";
// import CelestialDiamonds from "../../../assets/CelestialDiamonds.svg";
// import BranchHeirloom from "../../../assets/BranchHeirloom.svg";
// import { StatCard } from "../userManagementSections/OverAll";
// import Zone from "../../../components/Zone";

// const ZoneOne: React.FC = () => {
//   const [search, setSearch] = useState(""); // Search text
//   const [statusFilter, setStatusFilter] = useState("All"); // Default to 'All'
//   const [currentPage, setCurrentPage] = useState(1); // Start from page 1
//   const [filteredData, setFilteredData] = useState<any[]>([]);

//   const navigate = useNavigate();

//   const storeData = [
//     {
//       id: "ST-001",
//       name: "Downtown Branch",
//       image: downTownBranch,
//       address: "123 Main Street, New York",
//       manager: "John Doe",
//       contact: "+1 (123) 456-7890",
//       hours: "10 AM - 9 PM (Mon-Sun)",
//       status: "Active",
//     },
//     {
//       id: "ST-002",
//       name: "Celestial Diamonds",
//       image: CelestialDiamonds,
//       address: "456 Diamond Ave, New York",
//       manager: "Sarah Lane",
//       contact: "+1 (456) 789-1234",
//       hours: "11 AM - 8 PM (Mon-Sun)",
//       status: "Inactive",
//     },
//     {
//       id: "ST-003",
//       name: "Branch Heirloom & Co.",
//       image: BranchHeirloom,
//       address: "789 Luxury Blvd, New York",
//       manager: "Michael Carter",
//       contact: "+1 (987) 654-3210",
//       hours: "10 AM - 9 PM (Mon-Sun)",
//       status: "Active",
//     },
//   ];

//   // Filter data based on search and status filter
//   useEffect(() => {
//     let result = [...storeData];

//     // Apply search filter
//     if (search) {
//       const searchLower = search.toLowerCase();
//       result = result.filter(
//         (store) =>
//           store.name.toLowerCase().includes(searchLower) ||
//           store.id.toLowerCase().includes(searchLower)
//       );
//     }

//     // Apply status filter
//     if (statusFilter !== "All") {
//       result = result.filter((store) => store.status === statusFilter);
//     }

//     setFilteredData(result);
//   }, [search, statusFilter, storeData]);

//   return (
//     <div className="mx-auto px-3 py-6 sm:px-4 md:px-6 xl:px-8 xl:py-6 space-y-6 lg:w-[100%] xl:w-full w-full overflow-x-hidden">
//       <h2 className="Source-Sans-Pro-font font-semibold text-[#5D6679] text-[20px] mb-2">
//         <span
//           onClick={() =>
//             navigate("/dashboard/store-management/overall", { replace: true })
//           }
//           className="cursor-pointer"
//         >
//           Store Management
//         </span>{" "}
//         / <span className="text-black">Zone 1</span>
//       </h2>

//       {/* Stat Cards */}
//       <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-5 gap-1 md:gap-3 lg:gap-4 bg-white shadow rounded-xl p-4">
//         <StatCard label="Total Store" value="10" textColor="text-orange-400" />
//         <StatCard
//           label="Top Performing Store"
//           value="Downntown Branch"
//           textColor="text-red-400"
//         />
//         <StatCard label="Active Store" value="8" textColor="text-purple-500" />
//         <StatCard
//           label="Inactive Store"
//           value="2"
//           textColor="text-purple-500"
//         />
//         <StatCard
//           label="Total Staff of zone 1"
//           value="150"
//           textColor="text-purple-500"
//         />
//       </div>

//       {/* Zone Component */}
//       <Zone
//         filteredData={filteredData}
//         search={search}
//         setSearch={setSearch}
//         statusFilter={statusFilter}
//         setStatusFilter={setStatusFilter}
//         currentPage={currentPage}
//         setCurrentPage={setCurrentPage}
//       />

//       {/* <Outlet /> */}
//     </div>
//   );
// };

// export default ZoneOne;

// ye console kara hai hai jis item pr action perform kro to
// import React, { useState, useEffect } from "react";
// import { useNavigate, Outlet , Link } from "react-router-dom";
// import downTownBranch from "../../../assets/downTownBranch.svg";
// import CelestialDiamonds from "../../../assets/CelestialDiamonds.svg";
// import BranchHeirloom from "../../../assets/BranchHeirloom.svg";
// import { StatCard } from "../userManagementSections/OverAll";
// import Zone from "../../../components/Zone";

// const ZoneOne: React.FC = () => {
//   const [search, setSearch] = useState(""); // Search text
//   const [statusFilter, setStatusFilter] = useState("All"); // Default to 'All'
//   const [currentPage, setCurrentPage] = useState(1); // Start from page 1
//   const [filteredData, setFilteredData] = useState<any[]>([]);

//   const navigate = useNavigate();

//   const storeData = [
//     {
//       id: "ST-001",
//       name: "Downtown Branch",
//       image: downTownBranch,
//       address: "123 Main Street, New York",
//       manager: "John Doe",
//       contact: "+1 (123) 456-7890",
//       hours: "10 AM - 9 PM (Mon-Sun)",
//       status: "Active",
//     },
//     {
//       id: "ST-002",
//       name: "Celestial Diamonds",
//       image: CelestialDiamonds,
//       address: "456 Diamond Ave, New York",
//       manager: "Sarah Lane",
//       contact: "+1 (456) 789-1234",
//       hours: "11 AM - 8 PM (Mon-Sun)",
//       status: "Inactive",
//     },
//     {
//       id: "ST-003",
//       name: "Branch Heirloom & Co.",
//       image: BranchHeirloom,
//       address: "789 Luxury Blvd, New York",
//       manager: "Michael Carter",
//       contact: "+1 (987) 654-3210",
//       hours: "10 AM - 9 PM (Mon-Sun)",
//       status: "Active",
//     },
//   ];

//   // Filter data based on search and status filter
//   useEffect(() => {
//     let result = [...storeData];
//     // Apply search filter
//     if (search) {
//       const searchLower = search.toLowerCase();
//       result = result.filter(
//         (store) =>
//           store.name.toLowerCase().includes(searchLower) ||
//           store.id.toLowerCase().includes(searchLower)
//       );
//     }
//     // Apply status filter
//     if (statusFilter !== "All") {
//       result = result.filter((store) => store.status === statusFilter);
//     }
//     setFilteredData(result);
//   }, [search, statusFilter, storeData]);

//   // Use window.location for navigation to ensure full page reload
//   const handleStoreManagementClick = () => {
//     window.location.href = "/dashboard/store-management/overall";
//   };

//   return (
//     <div className="mx-auto px-3 py-6 sm:px-4 md:px-6 xl:px-8 xl:py-6 space-y-6 lg:w-[100%] xl:w-full w-full overflow-x-hidden">
//       <h2 className="Source-Sans-Pro-font font-semibold text-[#5D6679] text-[20px] mb-2">
//       <Link to="/dashboard/store-management/overall" className="cursor-pointer">
//   Store Management
// </Link>
//         / <span className="text-black">Zone 1</span>
//       </h2>

//       {/* Stat Cards */}
//       <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-5 gap-1 md:gap-3 lg:gap-4 bg-white shadow rounded-xl p-4">
//         <StatCard label="Total Store" value="10" textColor="text-orange-400" />
//         <StatCard
//           label="Top Performing Store"
//           value="Downntown Branch"
//           textColor="text-red-400"
//         />
//         <StatCard label="Active Store" value="8" textColor="text-purple-500" />
//         <StatCard
//           label="Inactive Store"
//           value="2"
//           textColor="text-purple-500"
//         />
//         <StatCard
//           label="Total Staff of zone 1"
//           value="150"
//           textColor="text-purple-500"
//         />
//       </div>

//       {/* Zone Component */}
//       <Zone
//         filteredData={filteredData}
//         search={search}
//         setSearch={setSearch}
//         statusFilter={statusFilter}
//         setStatusFilter={setStatusFilter}
//         currentPage={currentPage}
//         setCurrentPage={setCurrentPage}
//         onViewClick={(store) => console.log("View", store)}
//         onEditClick={(store) => console.log("Edit", store)}
//         onDeleteClick={(store) => console.log("Delete", store)}
//       />
//     </div>
//   );
// };

// export default ZoneOne;

import React, { useState } from "react";
import { Link } from "react-router-dom";
import downTownBranch from "../../../assets/downTownBranch.svg";
import CelestialDiamonds from "../../../assets/CelestialDiamonds.svg";
import BranchHeirloom from "../../../assets/BranchHeirloom.svg";
import { StatCard } from "../userManagementSections/OverAll";
import Zone from "../../../components/Zone";

// Define storeData outside the component to prevent recreation on each render
const storeData = [
  {
    id: "ST-001",
    name: "Downtown Branch",
    image: downTownBranch,
    address: "123 Main Street, New York",
    manager: "John Doe",
    contact: "+1 (123) 456-7890",
    hours: "10 AM - 9 PM (Mon-Sun)",
    status: "Active",
  },
  {
    id: "ST-002",
    name: "Celestial Diamonds",
    image: CelestialDiamonds,
    address: "456 Diamond Ave, New York",
    manager: "Sarah Lane",
    contact: "+1 (456) 789-1234",
    hours: "11 AM - 8 PM (Mon-Sun)",
    status: "Inactive",
  },
  {
    id: "ST-003",
    name: "Branch Heirloom & Co.",
    image: BranchHeirloom,
    address: "789 Luxury Blvd, New York",
    manager: "Michael Carter",
    contact: "+1 (987) 654-3210",
    hours: "10 AM - 9 PM (Mon-Sun)",
    status: "Active",
  },
];

const ZoneOne: React.FC = () => {
  const [search, setSearch] = useState(""); // Search text
  const [statusFilter, setStatusFilter] = useState("All"); // Default to 'All'
  const [currentPage, setCurrentPage] = useState(1); // Start from page 1

  // Filter data directly in the render method
  let filteredData = [...storeData];

  // Apply search filter
  if (search) {
    const searchLower = search.toLowerCase();
    filteredData = filteredData.filter(
      (store) =>
        store.name.toLowerCase().includes(searchLower) ||
        store.id.toLowerCase().includes(searchLower)
    );
  }

  // Apply status filter
  if (statusFilter !== "All") {
    filteredData = filteredData.filter(
      (store) => store.status === statusFilter
    );
  }

  return (
    <div className="mx-auto px-3 py-6 sm:px-4 md:px-6 xl:px-8 xl:py-6 space-y-6 lg:w-[100%] xl:w-full w-full overflow-x-hidden">
      <h2 className="Source-Sans-Pro-font font-semibold text-[#5D6679] text-[20px] mb-2">
        <Link
          to="/dashboard/store-management/overall"
          className="cursor-pointer"
        >
          Store Management
        </Link>{" "}
        / <span className="text-black">Zone 1</span>
      </h2>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-5 gap-1 md:gap-3 lg:gap-4 bg-white shadow rounded-xl p-4">
        <StatCard label="Total Store" value="10" textColor="text-orange-400" />
        <StatCard
          label="Top Performing Store"
          value="Downntown Branch"
          textColor="text-red-400"
        />
        <StatCard label="Active Store" value="8" textColor="text-purple-500" />
        <StatCard
          label="Inactive Store"
          value="2"
          textColor="text-purple-500"
        />
        <StatCard
          label="Total Staff of zone 1"
          value="150"
          textColor="text-purple-500"
        />
      </div>

      {/* Zone Component */}
      <Zone
        filteredData={filteredData}
        search={search}
        setSearch={setSearch}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        onViewClick={(store) => console.log("View", store)}
        onEditClick={(store) => console.log("Edit", store)}
        onDeleteClick={(store) => console.log("Delete", store)}
      />
    </div>
  );
};

export default ZoneOne;
