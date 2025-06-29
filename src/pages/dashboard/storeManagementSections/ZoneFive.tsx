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

const ZoneFive: React.FC = () => {
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
        / <span className="text-black">Zone 5</span>
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

export default ZoneFive;
