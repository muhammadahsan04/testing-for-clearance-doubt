import React, { useEffect, useState } from "react";
import { GoHome } from "react-icons/go";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import SimpleBar from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css";
import userManage from "../../assets/userManage.svg";
import userManageBlue from "../../assets/userManageBlue.svg";
import coreSetting from "../../assets/coresetting.svg";
import coreSettingBlue from "../../assets/coresettingBlue.svg";
import roleNpolicies from "../../assets/roleNpolicies.svg";
import storemanage from "../../assets/storemanage.svg";
import storemanageBlue from "../../assets/storemanageBlue.svg";
import suppliers from "../../assets/suppliers.svg";
import suppliersBlue from "../../assets/suppliersBlue.svg";
import expense from "../../assets/expense.svg";
import expenseBlue from "../../assets/expenseBlue.svg";
import inventory from "../../assets/inventory.svg";
import inventoryBlue from "../../assets/inventoryBlue.svg";
import liveInventory from "../../assets/liveInventory.svg";
import liveInventoryBlue from "../../assets/liveInventoryBlue.svg";
import reminder from "../../assets/reminder.svg";
import reminderBlue from "../../assets/reminderBlue.svg";
import communicationBlue from "../../assets/communicationBlue.svg";
import communication from "../../assets/communication.svg";
import liveTradeInInventoryBlue from "../../assets/liveTradeInInventoryBlue.svg";
import liveTradeInInventory from "../../assets/liveTradeInInventory.svg";

//   , sales management ka blue chahiye
import reportsNanalytics from "../../assets/reportsNanalytics.svg";
import reportsNanalyticsBlue from "../../assets/reportsNanalyticsBlue.svg";
import { IoClose, IoNotificationsOutline } from "react-icons/io5";
import systemsetting from "../../assets/systemsetting.svg";
import systemsettingBlue from "../../assets/systemsettingBlue.svg";
import ledger from "../../assets/ledger.svg";
import ledgerBlue from "../../assets/ledgerBlue.svg";
import roleNpoliciesBlue from "../../assets/roleNpoliciesBlue.svg";
import customerDetails from "../../assets/customerDetails.svg";
import customerDetailsBlue from "../../assets/customerDetailsBlue.svg";
import taxManage from "../../assets/taxManage.svg";
import taxManageBlue from "../../assets/taxManageBlue.svg";
import cashFlowBlue from "../../assets/cashFlowBlue.svg";
import cashFlow from "../../assets/cashFlow.svg";
import { MdOutlineArrowDropDown, MdOutlineArrowDropUp } from "react-icons/md";

interface DashboardSidebarProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  toggleSidebar: () => void;
}

// Helper function to check if user has permission for a specific module
const hasPermission = (module: string, action: string = "View") => {
  try {
    // Get permissions from localStorage or sessionStorage
    let permissionsStr = localStorage.getItem("permissions");
    if (!permissionsStr) {
      permissionsStr = sessionStorage.getItem("permissions");
    }

    if (!permissionsStr) return false;

    const permissions = JSON.parse(permissionsStr);

    // Check if the user has permission for this module and action
    return (
      permissions &&
      permissions.pages &&
      permissions.pages.some(
        (page: any) =>
          page.name === module &&
          (action === "View"
            ? page.read
            : action === "Add"
            ? page.create
            : action === "Edit"
            ? page.update
            : action === "Delete"
            ? page.delete
            : false)
      )
    );
  } catch (error) {
    console.error("Error checking permissions:", error);
    return false;
  }
};

// Helper function to get user role
const getUserRole = () => {
  let role = localStorage.getItem("role");
  if (!role) {
    role = sessionStorage.getItem("role");
  }
  return role;
};

const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
  isSidebarOpen,
  setIsSidebarOpen,
  toggleSidebar,
}) => {
  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>(
    {}
  );
  const [isHovered, setIsHovered] = useState(false);
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Use useEffect to close the sidebar on large screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(false); // Close sidebar on large screens
      } else {
        setIsSidebarOpen(isSidebarOpen); // Restore state for smaller screens
      }
    };

    // Listen for window resize events
    window.addEventListener("resize", handleResize);

    // Call once on mount to handle initial load
    handleResize();

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [isSidebarOpen, setIsSidebarOpen]); // Dependency on isSidebarOpen state

  // Check if user is authenticated and has permissions
  useEffect(() => {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  const closeSidebar = () => {
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false); // Close the sidebar on mobile/tablet screens
    }
  };

  const toggleSection = (section: string) => {
    setOpenSections((prev) => {
      const isCurrentlyOpen = prev[section];

      // Create a new empty state object (closes all sections)
      const newState: { [key: string]: boolean } = {};

      // Only set the clicked section to open if it was previously closed
      if (!isCurrentlyOpen) {
        newState[section] = true;
      }

      return newState;
    });
  };

  // Get user role
  const userRole = getUserRole();
  const isAdmin = userRole === "Admin" || userRole === "SuperAdmin";

  return (
    <div
      className={`lg:w-[22%] xl:w-[18%] w-[250px] bg-white h-screen overflow-hidden fixed lg:sticky top-0 z-40 transition-all duration-140 ease-in-out ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      } lg:translate-x-0 lg:block`}
    >
      <SimpleBar style={{ maxHeight: "100%" }}>
        <div className="lg:px-3 px-4 lg:py-3 xl:py-2 py-4 flex items-center justify-between">
          <h3 className="Jomhuria-font lg:text-[45px] xl:text-[50px] text-[40px] text-[#056BB7]">
            Jewelry Store
          </h3>
          <div className="lg:hidden px-1 py-1 border-1 rounded-sm cursor-pointer text-[#606777] text-[22px]">
            <IoClose onClick={toggleSidebar} />
          </div>
        </div>
        <ul className="px-4 lg:-space-y-0.5 -space-y-0.5 py-0 sm:py-0 text-[14px] lg:text-[13px] xl:text-[14px] font-medium text-[#5D6679] Inter-font ">
          {/* Dashboard */}
          {(isAdmin || hasPermission("Dashboard")) && (
            <li className="">
              <NavLink
                to="/dashboard"
                onClick={() => {
                  closeSidebar();
                  toggleSection("dashboard");
                }}
                end
                className={({ isActive }) => {
                  const isInactiveDueToOtherOpen =
                    openSections["userManagement"] ||
                    openSections["roleandpolicie"] ||
                    openSections["coreSettings"] ||
                    openSections["storeManagement"] ||
                    openSections["suppliers"] ||
                    openSections["inventory"] ||
                    openSections["customer"] ||
                    openSections["expense"];
                  return `flex items-center px-2 !py-1 rounded
                  ${
                    isActive && !isInactiveDueToOtherOpen
                      ? "bg-gray-200 text-[#056BB7]"
                      : "text-gray-700 hover:text-[#056BB7] hover:bg-gray-200"
                  }`;
                }}
              >
                <GoHome className="text-[19px] mr-1 ml-1.5" />
                Dashboard
              </NavLink>
            </li>
          )}

          {/* Role and Policies */}
          {(isAdmin || hasPermission("Role and Policies")) && (
            <li className="">
              <NavLink
                to="/dashboard/role-and-policies"
                onClick={() => {
                  closeSidebar();
                  toggleSection("roleandpolicie");
                }}
                end
                className={({ isActive }) => {
                  const isInactiveDueToOtherOpen =
                    openSections["userManagement"] ||
                    openSections["coreSettings"] ||
                    openSections["storeManagement"] ||
                    openSections["suppliers"] ||
                    openSections["inventory"] ||
                    openSections["customer"] ||
                    openSections["expense"];
                  return `flex items-center px-2 !py-1 rounded
                  ${
                    isActive && !isInactiveDueToOtherOpen
                      ? "bg-gray-200 text-[#056BB7]"
                      : "text-gray-700 hover:text-[#056BB7] hover:bg-gray-200"
                  }`;
                }}
                onMouseEnter={() => setHoveredSection("roleandpolicie")}
                onMouseLeave={() => setHoveredSection(null)}
              >
                <img
                  src={
                    (location.pathname.startsWith(
                      "/dashboard/role-and-policies"
                    ) &&
                      !openSections["userManagement"] &&
                      !openSections["coreSettings"] &&
                      !openSections["storeManagement"] &&
                      !openSections["suppliers"] &&
                      !openSections["inventory"] &&
                      !openSections["expense"] &&
                      !openSections["customer"]) ||
                    hoveredSection === "roleandpolicie"
                      ? roleNpoliciesBlue
                      : roleNpolicies
                  }
                  alt="Role & Policies"
                  className="pointer-events-none mr-1 ml-2"
                  draggable="false"
                  width={19}
                />
                Role & Policies
              </NavLink>
            </li>
          )}

          {/* User Management */}
          {(isAdmin || hasPermission("User Management")) && (
            <li
              className={`${
                location.pathname.includes("/dashboard/user-management") ||
                openSections.userManagement
                  ? "bg-gray-200 "
                  : "text-gray-700 hover:bg-gray-200"
              } rounded py-1`}
            >
              <button
                className={`w-full flex justify-between items-center px-2 !py-0 rounded transition-colors duration-150 ${
                  location.pathname.includes("/dashboard/user-management") ||
                  openSections.userManagement
                    ? "bg-gray-200 text-[#056BB7]"
                    : "text-gray-700 hover:text-[#056BB7] hover:bg-gray-200"
                }`}
                onClick={() => toggleSection("userManagement")}
                onMouseEnter={() => setHoveredSection("userManagement")}
                onMouseLeave={() => setHoveredSection(null)}
              >
                <div className="flex items-center">
                  <img
                    src={
                      location.pathname.startsWith(
                        "/dashboard/user-management"
                      ) ||
                      openSections.userManagement ||
                      hoveredSection === "userManagement"
                        ? userManageBlue
                        : userManage
                    }
                    alt="User Management"
                    className="pointer-events-none mr-1"
                    draggable="false"
                    width={15}
                  />
                  <span>User Management</span>
                </div>
                {openSections.userManagement ? (
                  <MdOutlineArrowDropUp size={22} />
                ) : (
                  <MdOutlineArrowDropDown size={22} />
                )}
              </button>
              {openSections.userManagement && (
                <ul className="ml-4 px-3">
                  <NavLink
                    to="/dashboard/user-management/overall"
                    onClick={closeSidebar}
                    className={({ isActive }) =>
                      `block py-1 ${
                        isActive
                          ? "text-[#056BB7] font-medium"
                          : "text-gray-700 hover:text-[#056BB7]"
                      }`
                    }
                  >
                    Overall
                  </NavLink>
                  <NavLink
                    to="/dashboard/user-management/add-users"
                    onClick={closeSidebar}
                    className={({ isActive }) =>
                      `block py-1 ${
                        isActive
                          ? "text-[#056BB7] font-medium"
                          : "text-gray-700 hover:text-[#056BB7]"
                      }`
                    }
                  >
                    Add Users
                  </NavLink>
                  <NavLink
                    to="/dashboard/user-management/view-users"
                    onClick={closeSidebar}
                    className={({ isActive }) =>
                      `block py-1 ${
                        isActive
                          ? "text-[#056BB7] font-medium"
                          : "text-gray-700 hover:text-[#056BB7]"
                      }`
                    }
                  >
                    View All Users
                  </NavLink>
                  <NavLink
                    to="/dashboard/user-management/card-generator"
                    onClick={closeSidebar}
                    className={({ isActive }) =>
                      `block py-1 ${
                        isActive
                          ? "text-[#056BB7] font-medium"
                          : "text-gray-700 hover:text-[#056BB7]"
                      }`
                    }
                  >
                    Card Generator
                  </NavLink>
                </ul>
              )}
            </li>
          )}

          {/* Store Management */}
          {(isAdmin || hasPermission("Store Management")) && (
            <li
              className={`${
                location.pathname.includes("/dashboard/store-management") ||
                openSections.storeManagement
                  ? "bg-gray-200 "
                  : "text-gray-700 hover:bg-gray-200"
              } rounded py-1`}
            >
              <button
                className={`w-full flex justify-between items-center px-2 !py-0 rounded transition-colors duration-150 ${
                  location.pathname.includes("/dashboard/store-management") ||
                  openSections.storeManagement
                    ? "bg-gray-200 text-[#056BB7]"
                    : "text-gray-700 hover:text-[#056BB7] hover:bg-gray-200"
                }`}
                onClick={() => toggleSection("storeManagement")}
                onMouseEnter={() => setHoveredSection("storeManagement")}
                onMouseLeave={() => setHoveredSection(null)}
              >
                <div className="flex items-center">
                  <img
                    src={
                      location.pathname.startsWith(
                        "/dashboard/store-management"
                      ) ||
                      openSections.storeManagement ||
                      hoveredSection === "storeManagement"
                        ? storemanageBlue
                        : storemanage
                    }
                    alt="Store Management"
                    className="pointer-events-none mr-1"
                    draggable="false"
                    width={20}
                  />
                  <span>Store Management</span>
                </div>
                {openSections.storeManagement ? (
                  <MdOutlineArrowDropUp size={22} />
                ) : (
                  <MdOutlineArrowDropDown size={22} />
                )}
              </button>
              {openSections.storeManagement && (
                <ul className="ml-4 px-3">
                  <NavLink
                    to="/dashboard/store-management/overall"
                    onClick={closeSidebar}
                    className={({ isActive }) =>
                      `block py-1 ${
                        isActive
                          ? "text-[#056BB7] font-medium"
                          : "text-gray-700 hover:text-[#056BB7]"
                      }`
                    }
                  >
                    Overall
                  </NavLink>
                  <NavLink
                    to="/dashboard/store-management/add-prefix"
                    onClick={closeSidebar}
                    className={({ isActive }) =>
                      `block py-1 ${
                        isActive
                          ? "text-[#056BB7] font-medium"
                          : "text-gray-700 hover:text-[#056BB7]"
                      }`
                    }
                  >
                    Add Prefix
                  </NavLink>
                  <NavLink
                    to="/dashboard/store-management/add-store"
                    onClick={closeSidebar}
                    className={({ isActive }) =>
                      `block py-1 ${
                        isActive
                          ? "text-[#056BB7] font-medium"
                          : "text-gray-700 hover:text-[#056BB7]"
                      }`
                    }
                  >
                    Add Store
                  </NavLink>
                  <NavLink
                    to="/dashboard/store-management/view-all-store"
                    onClick={closeSidebar}
                    className={({ isActive }) =>
                      `block py-1 ${
                        isActive
                          ? "text-[#056BB7] font-medium"
                          : "text-gray-700 hover:text-[#056BB7]"
                      }`
                    }
                  >
                    View All Stores
                  </NavLink>
                </ul>
              )}
            </li>
          )}

          {/* Core Setting */}
          {(isAdmin || hasPermission("Core Setting")) && (
            <li
              className={`${
                location.pathname.includes("/dashboard/core-settings") ||
                openSections.coreSettings
                  ? "bg-gray-200 "
                  : "text-gray-700 hover:bg-gray-200"
              } rounded py-1`}
            >
              <button
                className={`w-full flex justify-between items-center px-2 !py-0 rounded transition-colors duration-150 ${
                  location.pathname.includes("/dashboard/core-settings") ||
                  openSections.coreSettings
                    ? "bg-gray-200 text-[#056BB7]"
                    : "text-gray-700 hover:text-[#056BB7] hover:bg-gray-200"
                }`}
                onClick={() => toggleSection("coreSettings")}
                onMouseEnter={() => setHoveredSection("coreSettings")}
                onMouseLeave={() => setHoveredSection(null)}
              >
                <div className="flex items-center">
                  <img
                    src={
                      location.pathname.startsWith(
                        "/dashboard/core-settings"
                      ) ||
                      openSections.coreSettings ||
                      hoveredSection === "coreSettings"
                        ? coreSettingBlue
                        : coreSetting
                    }
                    alt="Core Setting"
                    className="pointer-events-none mr-1"
                    draggable="false"
                    width={20}
                  />
                  <span>Core Setting</span>
                </div>
                {openSections.coreSettings ? (
                  <MdOutlineArrowDropUp size={22} />
                ) : (
                  <MdOutlineArrowDropDown size={22} />
                )}
              </button>
              {openSections.coreSettings && (
                <ul className="ml-4 px-3">
                  <NavLink
                    to="/dashboard/core-settings/add-zone"
                    onClick={closeSidebar}
                    className={({ isActive }) =>
                      `block py-1 ${
                        isActive
                          ? "text-[#056BB7] font-medium"
                          : "text-gray-700 hover:text-[#056BB7]"
                      }`
                    }
                  >
                    Add Zone
                  </NavLink>
                  <NavLink
                    to="/dashboard/core-settings/add-product-category"
                    onClick={closeSidebar}
                    className={({ isActive }) =>
                      `block py-1 ${
                        isActive
                          ? "text-[#056BB7] font-medium"
                          : "text-gray-700 hover:text-[#056BB7]"
                      }`
                    }
                  >
                    Add Product Category
                  </NavLink>
                  <NavLink
                    to="/dashboard/core-settings/add-product-sub-category"
                    onClick={closeSidebar}
                    className={({ isActive }) =>
                      `block py-1 ${
                        isActive
                          ? "text-[#056BB7] font-medium"
                          : "text-gray-700 hover:text-[#056BB7]"
                      }`
                    }
                  >
                    Add Product Sub-Category
                  </NavLink>
                  <NavLink
                    to="/dashboard/core-settings/add-sku-prefix"
                    onClick={closeSidebar}
                    className={({ isActive }) =>
                      `block py-1 ${
                        isActive
                          ? "text-[#056BB7] font-medium"
                          : "text-gray-700 hover:text-[#056BB7]"
                      }`
                    }
                  >
                    Add SKU Prefix
                  </NavLink>
                  <NavLink
                    to="/dashboard/core-settings/add-item-category"
                    onClick={closeSidebar}
                    className={({ isActive }) =>
                      `block py-1 ${
                        isActive
                          ? "text-[#056BB7] font-medium"
                          : "text-gray-700 hover:text-[#056BB7]"
                      }`
                    }
                  >
                    Add Item (Category)
                  </NavLink>
                  <NavLink
                    to="/dashboard/core-settings/all-item-category"
                    onClick={closeSidebar}
                    className={({ isActive }) =>
                      `block py-1 ${
                        isActive
                          ? "text-[#056BB7] font-medium"
                          : "text-gray-700 hover:text-[#056BB7]"
                      }`
                    }
                  >
                    All Item (Category)
                  </NavLink>
                  <NavLink
                    to="/dashboard/core-settings/current-pricing"
                    onClick={closeSidebar}
                    className={({ isActive }) =>
                      `block py-1 ${
                        isActive
                          ? "text-[#056BB7] font-medium"
                          : "text-gray-700 hover:text-[#056BB7]"
                      }`
                    }
                  >
                    Current Pricing
                  </NavLink>
                  <NavLink
                    to="/dashboard/core-settings/payment-mode"
                    onClick={closeSidebar}
                    className={({ isActive }) =>
                      `block py-1 ${
                        isActive
                          ? "text-[#056BB7] font-medium"
                          : "text-gray-700 hover:text-[#056BB7]"
                      }`
                    }
                  >
                    Payment Mode
                  </NavLink>
                </ul>
              )}
            </li>
          )}

          {/* Suppliers */}
          {(isAdmin || hasPermission("Suppliers")) && (
            <li
              className={`${
                location.pathname.includes("/dashboard/suppliers") ||
                openSections.suppliers
                  ? "bg-gray-200 "
                  : "text-gray-700 hover:bg-gray-200"
              } rounded py-1`}
            >
              <button
                className={`w-full flex justify-between items-center px-2 !py-0 rounded transition-colors duration-150 ${
                  location.pathname.includes("/dashboard/suppliers") ||
                  openSections.suppliers
                    ? "bg-gray-200 text-[#056BB7]"
                    : "text-gray-700 hover:text-[#056BB7] hover:bg-gray-200"
                }`}
                onClick={() => toggleSection("suppliers")}
                onMouseEnter={() => setHoveredSection("suppliers")}
                onMouseLeave={() => setHoveredSection(null)}
              >
                <div className="flex items-center">
                  <img
                    src={
                      location.pathname.startsWith("/dashboard/suppliers") ||
                      openSections.suppliers ||
                      hoveredSection === "suppliers"
                        ? suppliersBlue
                        : suppliers
                    }
                    alt="Suppliers"
                    className="pointer-events-none mr-1"
                    draggable="false"
                    width={20}
                  />
                  <span>Suppliers</span>
                </div>
                {openSections.suppliers ? (
                  <MdOutlineArrowDropUp size={22} />
                ) : (
                  <MdOutlineArrowDropDown size={22} />
                )}
              </button>
              {openSections.suppliers && (
                <ul className="ml-4 px-3">
                  <NavLink
                    to="/dashboard/suppliers/add-suppliers"
                    onClick={closeSidebar}
                    className={({ isActive }) =>
                      `block py-1 ${
                        isActive
                          ? "text-[#056BB7] font-medium"
                          : "text-gray-700 hover:text-[#056BB7]"
                      }`
                    }
                  >
                    Add Suppliers
                  </NavLink>
                  <NavLink
                    to="/dashboard/suppliers/view-all-suppliers"
                    onClick={closeSidebar}
                    className={({ isActive }) =>
                      `block py-1 ${
                        isActive
                          ? "text-[#056BB7] font-medium"
                          : "text-gray-700 hover:text-[#056BB7]"
                      }`
                    }
                  >
                    View All Suppliers
                  </NavLink>
                  <NavLink
                    to="/dashboard/suppliers/add-template"
                    onClick={closeSidebar}
                    className={({ isActive }) =>
                      `block py-1 ${
                        isActive
                          ? "text-[#056BB7] font-medium"
                          : "text-gray-700 hover:text-[#056BB7]"
                      }`
                    }
                  >
                    Add Template
                  </NavLink>
                </ul>
              )}
            </li>
          )}

          {/* Inventory */}
          {(isAdmin || hasPermission("Inventory")) && (
            <li
              className={`${
                location.pathname.includes("/dashboard/inventory") ||
                openSections.inventory
                  ? "bg-gray-200 "
                  : "text-gray-700 hover:bg-gray-200"
              } rounded py-1`}
            >
              <button
                className={`w-full flex justify-between items-center px-2 !py-0 rounded transition-colors duration-150 ${
                  location.pathname.includes("/dashboard/inventory") ||
                  openSections.inventory
                    ? "bg-gray-200 text-[#056BB7]"
                    : "text-gray-700 hover:text-[#056BB7] hover:bg-gray-200"
                }`}
                onClick={() => toggleSection("inventory")}
                onMouseEnter={() => setHoveredSection("inventory")}
                onMouseLeave={() => setHoveredSection(null)}
              >
                <div className="flex items-center">
                  <img
                    src={
                      location.pathname.startsWith("/dashboard/inventory") ||
                      openSections.inventory ||
                      hoveredSection === "inventory"
                        ? inventoryBlue
                        : inventory
                    }
                    alt="Inventory"
                    className="pointer-events-none mr-1"
                    draggable="false"
                    width={20}
                  />
                  <span>Inventory</span>
                </div>
                {openSections.inventory ? (
                  <MdOutlineArrowDropUp size={22} />
                ) : (
                  <MdOutlineArrowDropDown size={22} />
                )}
              </button>
              {openSections.inventory && (
                <ul className="ml-4 px-3">
                  <NavLink
                    to="/dashboard/inventory/purchase-invoice"
                    onClick={closeSidebar}
                    className={({ isActive }) =>
                      `block py-1 ${
                        isActive
                          ? "text-[#056BB7] font-medium"
                          : "text-gray-700 hover:text-[#056BB7]"
                      }`
                    }
                  >
                    Purchase Invoice
                  </NavLink>
                  <NavLink
                    to="/dashboard/inventory/purchase-order"
                    onClick={closeSidebar}
                    className={({ isActive }) =>
                      `block py-1 ${
                        isActive
                          ? "text-[#056BB7] font-medium"
                          : "text-gray-700 hover:text-[#056BB7]"
                      }`
                    }
                  >
                    Purchase Order
                  </NavLink>
                  <NavLink
                    to="/dashboard/inventory/view-all-inventory"
                    onClick={closeSidebar}
                    className={({ isActive }) =>
                      `block py-1 ${
                        isActive
                          ? "text-[#056BB7] font-medium"
                          : "text-gray-700 hover:text-[#056BB7]"
                      }`
                    }
                  >
                    View All Inventory
                  </NavLink>
                  <NavLink
                    to="/dashboard/inventory/sale-invoice"
                    onClick={closeSidebar}
                    className={({ isActive }) =>
                      `block py-1 ${
                        isActive
                          ? "text-[#056BB7] font-medium"
                          : "text-gray-700 hover:text-[#056BB7]"
                      }`
                    }
                  >
                    Sale Invoice
                  </NavLink>
                  <NavLink
                    to="/dashboard/inventory/sale-invoice-status"
                    onClick={closeSidebar}
                    className={({ isActive }) =>
                      `block py-1 ${
                        isActive
                          ? "text-[#056BB7] font-medium"
                          : "text-gray-700 hover:text-[#056BB7]"
                      }`
                    }
                  >
                    Sale Invoice Status
                  </NavLink>
                  <NavLink
                    to="/dashboard/inventory/purchase-return"
                    onClick={closeSidebar}
                    className={({ isActive }) =>
                      `block py-1 ${
                        isActive
                          ? "text-[#056BB7] font-medium"
                          : "text-gray-700 hover:text-[#056BB7]"
                      }`
                    }
                  >
                    Purchase Return
                  </NavLink>
                  <NavLink
                    to="/dashboard/inventory/product-aging"
                    onClick={closeSidebar}
                    className={({ isActive }) =>
                      `block py-1 ${
                        isActive
                          ? "text-[#056BB7] font-medium"
                          : "text-gray-700 hover:text-[#056BB7]"
                      }`
                    }
                  >
                    Product Aging
                  </NavLink>
                </ul>
              )}
            </li>
          )}

          {/* Live Inventory */}
          {(isAdmin || hasPermission("Live Inventory")) && (
            <li className="">
              <NavLink
                to="/dashboard/live-inventory"
                onClick={() => {
                  closeSidebar();
                  // Clear all open sections when clicking on Live Inventory
                  setOpenSections({});
                }}
                end
                className={({ isActive }) => {
                  // Check if any dropdown sections are open
                  const isAnyDropdownOpen = Object.values(openSections).some(
                    (value) => value
                  );

                  return `flex items-center px-2 !py-1 rounded
                  ${
                    isActive && !isAnyDropdownOpen
                      ? "bg-gray-200 text-[#056BB7]"
                      : "text-gray-700 hover:text-[#056BB7] hover:bg-gray-200"
                  }`;
                }}
                onMouseEnter={() => setHoveredSection("liveInventory")}
                onMouseLeave={() => setHoveredSection(null)}
              >
                <img
                  src={
                    (location.pathname.startsWith(
                      "/dashboard/live-inventory"
                    ) &&
                      !Object.values(openSections).some((value) => value)) ||
                    hoveredSection === "liveInventory"
                      ? liveInventoryBlue
                      : liveInventory
                  }
                  alt="Live Inventory"
                  className="pointer-events-none mr-1 ml-2"
                  draggable="false"
                  width={19}
                />
                Live Inventory
              </NavLink>
            </li>
          )}

          {/* Live Trade-In Inventory */}
          {(isAdmin || hasPermission("Live Trade-In Inventory")) && (
            <li className="">
              <NavLink
                to="/dashboard/live-trade-in-inventory"
                onClick={() => {
                  closeSidebar();
                  // Clear all open sections when clicking on Live Inventory
                  setOpenSections({});
                }}
                end
                className={({ isActive }) => {
                  // Check if any dropdown sections are open
                  const isAnyDropdownOpen = Object.values(openSections).some(
                    (value) => value
                  );

                  return `flex items-center px-2 !py-1 rounded
                  ${
                    isActive && !isAnyDropdownOpen
                      ? "bg-gray-200 text-[#056BB7]"
                      : "text-gray-700 hover:text-[#056BB7] hover:bg-gray-200"
                  }`;
                }}
                onMouseEnter={() => setHoveredSection("liveTradeInInventory")}
                onMouseLeave={() => setHoveredSection(null)}
              >
                <img
                  src={
                    (location.pathname.startsWith(
                      "/dashboard/live-trade-in-inventory"
                    ) &&
                      !Object.values(openSections).some((value) => value)) ||
                    hoveredSection === "liveTradeInInventory"
                      ? liveTradeInInventoryBlue
                      : liveTradeInInventory
                  }
                  alt="Live Trade-In Inventory"
                  className="pointer-events-none mr-2 ml-2"
                  draggable="false"
                  width={17}
                />
                Live Trade-In Inventory
              </NavLink>
            </li>
          )}

          {/* Ledger */}
          {(isAdmin || hasPermission("Ledger")) && (
            <li
              className={`${
                location.pathname.includes("/dashboard/ledger") ||
                openSections.ledger
                  ? "bg-gray-200 "
                  : "text-gray-700 hover:bg-gray-200"
              } rounded py-1`}
            >
              <button
                className={`w-full flex justify-between items-center px-2 !py-0 rounded transition-colors duration-150 ${
                  location.pathname.includes("/dashboard/ledger") ||
                  openSections.ledger
                    ? "bg-gray-200 text-[#056BB7]"
                    : "text-gray-700 hover:text-[#056BB7] hover:bg-gray-200"
                }`}
                onClick={() => toggleSection("ledger")}
                onMouseEnter={() => setHoveredSection("ledger")}
                onMouseLeave={() => setHoveredSection(null)}
              >
                <div className="flex items-center">
                  <img
                    src={
                      location.pathname.startsWith("/dashboard/ledger") ||
                      openSections.ledger ||
                      hoveredSection === "ledger"
                        ? ledgerBlue
                        : ledger
                    }
                    alt="Ledger"
                    className="pointer-events-none mr-1"
                    draggable="false"
                    width={20}
                  />
                  <span>Ledger</span>
                </div>
                {openSections.ledger ? (
                  <MdOutlineArrowDropUp size={22} />
                ) : (
                  <MdOutlineArrowDropDown size={22} />
                )}
              </button>
              {openSections.ledger && (
                <ul className="ml-4 px-3">
                  <NavLink
                    to="/dashboard/ledger/supplier-ledger"
                    onClick={closeSidebar}
                    className={({ isActive }) =>
                      `block py-1 ${
                        isActive
                          ? "text-[#056BB7] font-medium"
                          : "text-gray-700 hover:text-[#056BB7]"
                      }`
                    }
                  >
                    Supplier Ledger
                  </NavLink>
                  <NavLink
                    to="/dashboard/ledger/store-ledger"
                    onClick={closeSidebar}
                    className={({ isActive }) =>
                      `block py-1 ${
                        isActive
                          ? "text-[#056BB7] font-medium"
                          : "text-gray-700 hover:text-[#056BB7]"
                      }`
                    }
                  >
                    Store Ledger
                  </NavLink>
                </ul>
              )}
            </li>
          )}

          {/* Tax Management */}
          {(isAdmin || hasPermission("Tax Management")) && (
            <li className="">
              <NavLink
                to="/dashboard/tax-management"
                onClick={() => {
                  closeSidebar();
                  // Clear all open sections when clicking on Live Inventory
                  setOpenSections({});
                }}
                end
                className={({ isActive }) => {
                  // Check if any dropdown sections are open
                  const isAnyDropdownOpen = Object.values(openSections).some(
                    (value) => value
                  );

                  return `flex items-center px-2 !py-1 rounded
                  ${
                    isActive && !isAnyDropdownOpen
                      ? "bg-gray-200 text-[#056BB7]"
                      : "text-gray-700 hover:text-[#056BB7] hover:bg-gray-200"
                  }`;
                }}
                onMouseEnter={() => setHoveredSection("taxManagement")}
                onMouseLeave={() => setHoveredSection(null)}
              >
                <img
                  src={
                    (location.pathname.startsWith(
                      "/dashboard/tax-management"
                    ) &&
                      !Object.values(openSections).some((value) => value)) ||
                    hoveredSection === "taxManagement"
                      ? taxManageBlue
                      : taxManage
                  }
                  alt="Tax Management"
                  className="pointer-events-none mr-1 ml-2.5"
                  draggable="false"
                  width={16}
                />
                Tax Management
              </NavLink>
            </li>
          )}

          {/* Customer */}
          {(isAdmin || hasPermission("Customer")) && (
            <li
              className={`${
                location.pathname.includes("/dashboard/customer") ||
                openSections.customer
                  ? "bg-gray-200 "
                  : "text-gray-700 hover:bg-gray-200"
              } rounded py-1`}
            >
              <button
                className={`w-full flex justify-between items-center px-2 !py-0 rounded transition-colors duration-150 ${
                  location.pathname.includes("/dashboard/customer") ||
                  openSections.customer
                    ? "bg-gray-200 text-[#056BB7]"
                    : "text-gray-700 hover:text-[#056BB7] hover:bg-gray-200"
                }`}
                onClick={() => toggleSection("customer")}
                onMouseEnter={() => setHoveredSection("customer")}
                onMouseLeave={() => setHoveredSection(null)}
              >
                <div className="flex items-center">
                  <img
                    src={
                      location.pathname.startsWith("/dashboard/customer") ||
                      openSections.customer ||
                      hoveredSection === "customer"
                        ? customerDetailsBlue
                        : customerDetails
                    }
                    alt="Customer"
                    className="pointer-events-none mr-1"
                    draggable="false"
                    width={20}
                  />
                  <span>Customer</span>
                </div>
                {openSections.customer ? (
                  <MdOutlineArrowDropUp size={22} />
                ) : (
                  <MdOutlineArrowDropDown size={22} />
                )}
              </button>
              {openSections.customer && (
                <ul className="ml-4 px-3">
                  <NavLink
                    to="/dashboard/customer/add-customer"
                    onClick={closeSidebar}
                    className={({ isActive }) =>
                      `block py-1 ${
                        isActive
                          ? "text-[#056BB7] font-medium"
                          : "text-gray-700 hover:text-[#056BB7]"
                      }`
                    }
                  >
                    Add Customer
                  </NavLink>
                  <NavLink
                    to="/dashboard/customer/view-all-customer"
                    onClick={closeSidebar}
                    className={({ isActive }) =>
                      `block py-1 ${
                        isActive
                          ? "text-[#056BB7] font-medium"
                          : "text-gray-700 hover:text-[#056BB7]"
                      }`
                    }
                  >
                    View All Customer
                  </NavLink>
                </ul>
              )}
            </li>
          )}

          {/* Expense */}
          {(isAdmin || hasPermission("Expense")) && (
            <li
              className={`${
                location.pathname.includes("/dashboard/expense") ||
                openSections.expense
                  ? "bg-gray-200 "
                  : "text-gray-700 hover:bg-gray-200"
              } rounded py-1`}
            >
              <button
                className={`w-full flex justify-between items-center px-1 !py-0 rounded transition-colors duration-150 ${
                  location.pathname.includes("/dashboard/expense") ||
                  openSections.expense
                    ? "bg-gray-200 text-[#056BB7]"
                    : "text-gray-700 hover:text-[#056BB7] hover:bg-gray-200"
                }`}
                onClick={() => toggleSection("expense")}
                onMouseEnter={() => setHoveredSection("expense")}
                onMouseLeave={() => setHoveredSection(null)}
              >
                <div className="flex items-center">
                  <img
                    src={
                      location.pathname.startsWith("/dashboard/expense") ||
                      openSections.expense ||
                      hoveredSection === "expense"
                        ? expenseBlue
                        : expense
                    }
                    alt="expense"
                    className="pointer-events-none mr-1"
                    draggable="false"
                    width={23}
                  />
                  <span>Expense</span>
                </div>
                {openSections.expense ? (
                  <MdOutlineArrowDropUp size={22} />
                ) : (
                  <MdOutlineArrowDropDown size={22} />
                )}
              </button>
              {openSections.expense && (
                <ul className="ml-4 px-3">
                  <NavLink
                    to="/dashboard/expense/add-expense"
                    onClick={closeSidebar}
                    className={({ isActive }) =>
                      `block py-1 ${
                        isActive
                          ? "text-[#056BB7] font-medium"
                          : "text-gray-700 hover:text-[#056BB7]"
                      }`
                    }
                  >
                    Add Expense
                  </NavLink>
                  <NavLink
                    to="/dashboard/expense/all-expenses"
                    onClick={closeSidebar}
                    className={({ isActive }) =>
                      `block py-1 ${
                        isActive
                          ? "text-[#056BB7] font-medium"
                          : "text-gray-700 hover:text-[#056BB7]"
                      }`
                    }
                  >
                    All Expenses
                  </NavLink>
                  <NavLink
                    to="/dashboard/expense/income-statement"
                    onClick={closeSidebar}
                    className={({ isActive }) =>
                      `block py-1 ${
                        isActive
                          ? "text-[#056BB7] font-medium"
                          : "text-gray-700 hover:text-[#056BB7]"
                      }`
                    }
                  >
                    Income Statement
                  </NavLink>
                </ul>
              )}
            </li>
          )}

          {/* Cash Flow */}
          {(isAdmin || hasPermission("Cash Flow")) && (
            <li
              className={`${
                location.pathname.includes("/dashboard/cash-flow") ||
                openSections.cashFlow
                  ? "bg-gray-200 "
                  : "text-gray-700 hover:bg-gray-200"
              } rounded py-1`}
            >
              <button
                className={`w-full flex justify-between items-center px-2 !py-0 rounded transition-colors duration-150 ${
                  location.pathname.includes("/dashboard/cash-flow") ||
                  openSections.cashFlow
                    ? "bg-gray-200 text-[#056BB7]"
                    : "text-gray-700 hover:text-[#056BB7] hover:bg-gray-200"
                }`}
                onClick={() => toggleSection("cashFlow")}
                onMouseEnter={() => setHoveredSection("cashFlow")}
                onMouseLeave={() => setHoveredSection(null)}
              >
                <div className="flex items-center">
                  <img
                    src={
                      location.pathname.startsWith("/dashboard/cash-flow") ||
                      openSections.cashFlow ||
                      hoveredSection === "cashFlow"
                        ? cashFlowBlue
                        : cashFlow
                    }
                    alt="Cash Flow"
                    className="pointer-events-none mr-1"
                    draggable="false"
                    width={19}
                  />
                  <span>Cash Flow</span>
                </div>
                {openSections.cashFlow ? (
                  <MdOutlineArrowDropUp size={22} />
                ) : (
                  <MdOutlineArrowDropDown size={22} />
                )}
              </button>
              {openSections.cashFlow && (
                <ul className="ml-4 px-3">
                  <NavLink
                    to="/dashboard/cash-flow/cash"
                    onClick={closeSidebar}
                    className={({ isActive }) =>
                      `block py-1 ${
                        isActive
                          ? "text-[#056BB7] font-medium"
                          : "text-gray-700 hover:text-[#056BB7]"
                      }`
                    }
                  >
                    Cash
                  </NavLink>
                  <NavLink
                    to="/dashboard/cash-flow/bank-transfer"
                    onClick={closeSidebar}
                    className={({ isActive }) =>
                      `block py-1 ${
                        isActive
                          ? "text-[#056BB7] font-medium"
                          : "text-gray-700 hover:text-[#056BB7]"
                      }`
                    }
                  >
                    Bank Transfer
                  </NavLink>
                  <NavLink
                    to="/dashboard/cash-flow/apple-pay"
                    onClick={closeSidebar}
                    className={({ isActive }) =>
                      `block py-1 ${
                        isActive
                          ? "text-[#056BB7] font-medium"
                          : "text-gray-700 hover:text-[#056BB7]"
                      }`
                    }
                  >
                    Apple Pay
                  </NavLink>
                  <NavLink
                    to="/dashboard/cash-flow/wire-transfer"
                    onClick={closeSidebar}
                    className={({ isActive }) =>
                      `block py-1 ${
                        isActive
                          ? "text-[#056BB7] font-medium"
                          : "text-gray-700 hover:text-[#056BB7]"
                      }`
                    }
                  >
                    Wire Transfer
                  </NavLink>
                </ul>
              )}
            </li>
          )}

          {/* Communication */}
          {(isAdmin || hasPermission("Communication")) && (
            <li className="">
              <NavLink
                to="/dashboard/communication"
                onClick={() => {
                  closeSidebar();
                  setOpenSections({});
                }}
                end
                className={({ isActive }) => {
                  const isAnyDropdownOpen = Object.values(openSections).some(
                    (value) => value
                  );
                  return `flex items-center px-2 !py-1 rounded
                  ${
                    isActive && !isAnyDropdownOpen
                      ? "bg-gray-200 text-[#056BB7]"
                      : "text-gray-700 hover:text-[#056BB7] hover:bg-gray-200"
                  }`;
                }}
                onMouseEnter={() => setHoveredSection("Communication")}
                onMouseLeave={() => setHoveredSection(null)}
              >
                <img
                  src={
                    (location.pathname.startsWith("/dashboard/communication") &&
                      !Object.values(openSections).some((value) => value)) ||
                    hoveredSection === "Communication"
                      ? communicationBlue
                      : communication
                  }
                  alt="Communication"
                  className="pointer-events-none mr-1 ml-1.5"
                  draggable="false"
                  width={19}
                />
                Communication
              </NavLink>
            </li>
          )}

          {/* Reminder */}
          {(isAdmin || hasPermission("Reminders")) && (
            <li className="">
              <NavLink
                to="/dashboard/reminders"
                onClick={() => {
                  closeSidebar();
                  setOpenSections({});
                }}
                end
                className={({ isActive }) => {
                  const isAnyDropdownOpen = Object.values(openSections).some(
                    (value) => value
                  );
                  return `flex items-center px-2 !py-1 rounded
                  ${
                    isActive && !isAnyDropdownOpen
                      ? "bg-gray-200 text-[#056BB7]"
                      : "text-gray-700 hover:text-[#056BB7] hover:bg-gray-200"
                  }`;
                }}
                onMouseEnter={() => setHoveredSection("reminders")}
                onMouseLeave={() => setHoveredSection(null)}
              >
                <img
                  src={
                    (location.pathname.startsWith("/dashboard/reminders") &&
                      !Object.values(openSections).some((value) => value)) ||
                    hoveredSection === "reminders"
                      ? reminderBlue
                      : reminder
                  }
                  alt="Reminders"
                  className="pointer-events-none mr-1 ml-1.5"
                  draggable="false"
                  width={17}
                />
                Reminders
              </NavLink>
            </li>
          )}

          {/* Reports & Analytics */}
          {(isAdmin || hasPermission("Reports & Analytics")) && (
            <li className="">
              <NavLink
                to="/dashboard/reports-and-analytics"
                onClick={() => {
                  closeSidebar();
                  setOpenSections({});
                }}
                end
                className={({ isActive }) => {
                  const isAnyDropdownOpen = Object.values(openSections).some(
                    (value) => value
                  );
                  return `flex items-center px-2 !py-1 rounded
                  ${
                    isActive && !isAnyDropdownOpen
                      ? "bg-gray-200 text-[#056BB7]"
                      : "text-gray-700 hover:text-[#056BB7] hover:bg-gray-200"
                  }`;
                }}
                onMouseEnter={() => setHoveredSection("reportsAndAnalytics")}
                onMouseLeave={() => setHoveredSection(null)}
              >
                <img
                  src={
                    (location.pathname.startsWith(
                      "/dashboard/reports-and-analytics"
                    ) &&
                      !Object.values(openSections).some((value) => value)) ||
                    hoveredSection === "reportsAndAnalytics"
                      ? reportsNanalyticsBlue
                      : reportsNanalytics
                  }
                  alt="Reports and Analytics"
                  className="pointer-events-none mr-1 ml-1.5"
                  draggable="false"
                  width={19}
                />
                Reports & Analytics
              </NavLink>
            </li>
          )}

          {/* System Setting */}
          {(isAdmin || hasPermission("System Setting")) && (
            <li>
              <NavLink
                to="/dashboard/system-settings"
                onClick={() => {
                  closeSidebar();
                  setOpenSections({});
                }}
                className={({ isActive }) => {
                  const isAnyDropdownOpen = Object.values(openSections).some(
                    (value) => value
                  );
                  return `flex items-center px-2 !py-1 rounded
          ${
            isActive && !isAnyDropdownOpen
              ? "bg-gray-200 text-[#056BB7]"
              : "text-gray-700 hover:text-[#056BB7] hover:bg-gray-200"
          }`;
                }}
                onMouseEnter={() => setHoveredSection("systemSettings")}
                onMouseLeave={() => setHoveredSection(null)}
              >
                <img
                  src={
                    (location.pathname.startsWith(
                      "/dashboard/system-settings"
                    ) &&
                      !Object.values(openSections).some((value) => value)) ||
                    hoveredSection === "systemSettings"
                      ? systemsettingBlue
                      : systemsetting
                  }
                  alt="System Settings"
                  className="pointer-events-none mr-1 ml-1.5"
                  draggable="false"
                  width={19}
                />
                System Setting
              </NavLink>
            </li>
          )}
        </ul>
      </SimpleBar>
    </div>
  );
};

export default DashboardSidebar;


// "use client"

// import type React from "react"
// import { useEffect, useState } from "react"
// import { GoHome } from "react-icons/go"
// import { NavLink, useLocation, useNavigate } from "react-router-dom"
// import SimpleBar from "simplebar-react"
// import "simplebar-react/dist/simplebar.min.css"
// import userManage from "../../assets/userManage.svg"
// import userManageBlue from "../../assets/userManageBlue.svg"
// import coreSetting from "../../assets/coresetting.svg"
// import coreSettingBlue from "../../assets/coresettingBlue.svg"
// import roleNpolicies from "../../assets/roleNpolicies.svg"
// import storemanage from "../../assets/storemanage.svg"
// import storemanageBlue from "../../assets/storemanageBlue.svg"
// import suppliers from "../../assets/suppliers.svg"
// import suppliersBlue from "../../assets/suppliersBlue.svg"
// import expense from "../../assets/expense.svg"
// import expenseBlue from "../../assets/expenseBlue.svg"
// import inventory from "../../assets/inventory.svg"
// import inventoryBlue from "../../assets/inventoryBlue.svg"
// import liveInventory from "../../assets/liveInventory.svg"
// import liveInventoryBlue from "../../assets/liveInventoryBlue.svg"
// import reminder from "../../assets/reminder.svg"
// import reminderBlue from "../../assets/reminderBlue.svg"
// import communicationBlue from "../../assets/communicationBlue.svg"
// import communication from "../../assets/communication.svg"
// import liveTradeInInventoryBlue from "../../assets/liveTradeInInventoryBlue.svg"
// import liveTradeInInventory from "../../assets/liveTradeInInventory.svg"
// import reportsNanalytics from "../../assets/reportsNanalytics.svg"
// import reportsNanalyticsBlue from "../../assets/reportsNanalyticsBlue.svg"
// import { IoClose } from "react-icons/io5"
// import systemsetting from "../../assets/systemsetting.svg"
// import systemsettingBlue from "../../assets/systemsettingBlue.svg"
// import ledger from "../../assets/ledger.svg"
// import ledgerBlue from "../../assets/ledgerBlue.svg"
// import roleNpoliciesBlue from "../../assets/roleNpoliciesBlue.svg"
// import customerDetails from "../../assets/customerDetails.svg"
// import customerDetailsBlue from "../../assets/customerDetailsBlue.svg"
// import taxManage from "../../assets/taxManage.svg"
// import taxManageBlue from "../../assets/taxManageBlue.svg"
// import cashFlowBlue from "../../assets/cashFlowBlue.svg"
// import cashFlow from "../../assets/cashFlow.svg"
// import { MdOutlineArrowDropDown, MdOutlineArrowDropUp } from "react-icons/md"

// interface DashboardSidebarProps {
//   isSidebarOpen: boolean
//   setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>
//   toggleSidebar: () => void
// }

// // Helper function to check if user has permission for a specific module
// const hasPermission = (module: string, action = "View") => {
//   try {
//     let permissionsStr = localStorage.getItem("permissions")
//     if (!permissionsStr) {
//       permissionsStr = sessionStorage.getItem("permissions")
//     }

//     if (!permissionsStr) return false

//     const permissions = JSON.parse(permissionsStr)

//     return (
//       permissions &&
//       permissions.pages &&
//       permissions.pages.some(
//         (page: any) =>
//           page.name === module &&
//           (action === "View"
//             ? page.read
//             : action === "Add"
//               ? page.create
//               : action === "Edit"
//                 ? page.update
//                 : action === "Delete"
//                   ? page.delete
//                   : false),
//       )
//     )
//   } catch (error) {
//     console.error("Error checking permissions:", error)
//     return false
//   }
// }

// // Helper function to get user role
// const getUserRole = () => {
//   let role = localStorage.getItem("role")
//   if (!role) {
//     role = sessionStorage.getItem("role")
//   }
//   return role
// }

// const DashboardSidebar: React.FC<DashboardSidebarProps> = ({ isSidebarOpen, setIsSidebarOpen, toggleSidebar }) => {
//   const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({})
//   const [hoveredSection, setHoveredSection] = useState<string | null>(null)
//   const location = useLocation()
//   const navigate = useNavigate()

//   useEffect(() => {
//     const token = localStorage.getItem("token") || sessionStorage.getItem("token")
//     if (!token) {
//       navigate("/login")
//     }
//   }, [navigate])

//   const closeSidebar = () => {
//     if (window.innerWidth < 1024) {
//       setIsSidebarOpen(false)
//     }
//   }

//   const toggleSection = (section: string) => {
//     setOpenSections((prev) => {
//       const isCurrentlyOpen = prev[section]
//       const newState: { [key: string]: boolean } = {}
//       if (!isCurrentlyOpen) {
//         newState[section] = true
//       }
//       return newState
//     })
//   }

//   const userRole = getUserRole()
//   const isAdmin = userRole === "Admin" || userRole === "SuperAdmin"

//   return (
//     <div
//       className={`w-full !fixed lg:sticky !top-0 h-screen bg-white overflow-hidden transition-all duration-300 ease-in-out ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
//         }`}
//     >
//       <SimpleBar style={{ maxHeight: "100%" }}>
//         <div className="lg:px-3 px-4 lg:py-3 xl:py-2 py-4 flex items-center justify-between">
//           <h3 className="Jomhuria-font lg:text-[45px] xl:text-[50px] text-[40px] text-[#056BB7]">Jewelry Store</h3>
//           <div className="lg:hidden px-1 py-1 border-1 rounded-sm cursor-pointer text-[#606777] text-[22px]">
//             <IoClose onClick={toggleSidebar} />
//           </div>
//         </div>

//         <ul className="px-4 lg:-space-y-0.5 -space-y-0.5 py-0 sm:py-0 text-[14px] lg:text-[13px] xl:text-[14px] font-medium text-[#5D6679] Inter-font">
//           {/* Dashboard */}
//           {(isAdmin || hasPermission("Dashboard")) && (
//             <li className="">
//               <NavLink
//                 to="/dashboard"
//                 onClick={() => {
//                   closeSidebar()
//                   toggleSection("dashboard")
//                 }}
//                 end
//                 className={({ isActive }) => {
//                   const isInactiveDueToOtherOpen =
//                     openSections["userManagement"] ||
//                     openSections["roleandpolicie"] ||
//                     openSections["coreSettings"] ||
//                     openSections["storeManagement"] ||
//                     openSections["suppliers"] ||
//                     openSections["inventory"] ||
//                     openSections["customer"] ||
//                     openSections["expense"]
//                   return `flex items-center px-2 !py-1 rounded
//                   ${isActive && !isInactiveDueToOtherOpen
//                       ? "bg-gray-200 text-[#056BB7]"
//                       : "text-gray-700 hover:text-[#056BB7] hover:bg-gray-200"
//                     }`
//                 }}
//               >
//                 <GoHome className="text-[19px] mr-1 ml-1.5" />
//                 Dashboard
//               </NavLink>
//             </li>
//           )}

//           {/* Role and Policies */}
//           {(isAdmin || hasPermission("Role and Policies")) && (
//             <li className="">
//               <NavLink
//                 to="/dashboard/role-and-policies"
//                 onClick={() => {
//                   closeSidebar()
//                   toggleSection("roleandpolicie")
//                 }}
//                 end
//                 className={({ isActive }) => {
//                   const isInactiveDueToOtherOpen =
//                     openSections["userManagement"] ||
//                     openSections["coreSettings"] ||
//                     openSections["storeManagement"] ||
//                     openSections["suppliers"] ||
//                     openSections["inventory"] ||
//                     openSections["customer"] ||
//                     openSections["expense"]
//                   return `flex items-center px-2 !py-1 rounded
//                   ${isActive && !isInactiveDueToOtherOpen
//                       ? "bg-gray-200 text-[#056BB7]"
//                       : "text-gray-700 hover:text-[#056BB7] hover:bg-gray-200"
//                     }`
//                 }}
//                 onMouseEnter={() => setHoveredSection("roleandpolicie")}
//                 onMouseLeave={() => setHoveredSection(null)}
//               >
//                 <img
//                   src={
//                     (location.pathname.startsWith("/dashboard/role-and-policies") &&
//                       !openSections["userManagement"] &&
//                       !openSections["coreSettings"] &&
//                       !openSections["storeManagement"] &&
//                       !openSections["suppliers"] &&
//                       !openSections["inventory"] &&
//                       !openSections["expense"] &&
//                       !openSections["customer"]) ||
//                       hoveredSection === "roleandpolicie"
//                       ? roleNpoliciesBlue
//                       : roleNpolicies
//                   }
//                   alt="Role & Policies"
//                   className="pointer-events-none mr-1 ml-2"
//                   draggable="false"
//                   width={19}
//                 />
//                 Role & Policies
//               </NavLink>
//             </li>
//           )}

//           {/* User Management */}
//           {(isAdmin || hasPermission("User Management")) && (
//             <li
//               className={`${location.pathname.includes("/dashboard/user-management") || openSections.userManagement
//                   ? "bg-gray-200 "
//                   : "text-gray-700 hover:bg-gray-200"
//                 } rounded py-1`}
//             >
//               <button
//                 className={`w-full flex justify-between items-center px-2 !py-0 rounded transition-colors duration-150 ${location.pathname.includes("/dashboard/user-management") || openSections.userManagement
//                     ? "bg-gray-200 text-[#056BB7]"
//                     : "text-gray-700 hover:text-[#056BB7] hover:bg-gray-200"
//                   }`}
//                 onClick={() => toggleSection("userManagement")}
//                 onMouseEnter={() => setHoveredSection("userManagement")}
//                 onMouseLeave={() => setHoveredSection(null)}
//               >
//                 <div className="flex items-center">
//                   <img
//                     src={
//                       location.pathname.startsWith("/dashboard/user-management") ||
//                         openSections.userManagement ||
//                         hoveredSection === "userManagement"
//                         ? userManageBlue
//                         : userManage
//                     }
//                     alt="User Management"
//                     className="pointer-events-none mr-1"
//                     draggable="false"
//                     width={15}
//                   />
//                   <span>User Management</span>
//                 </div>
//                 {openSections.userManagement ? (
//                   <MdOutlineArrowDropUp size={22} />
//                 ) : (
//                   <MdOutlineArrowDropDown size={22} />
//                 )}
//               </button>
//               {openSections.userManagement && (
//                 <ul className="ml-4 px-3">
//                   <NavLink
//                     to="/dashboard/user-management/overall"
//                     onClick={closeSidebar}
//                     className={({ isActive }) =>
//                       `block py-1 ${isActive ? "text-[#056BB7] font-medium" : "text-gray-700 hover:text-[#056BB7]"}`
//                     }
//                   >
//                     Overall
//                   </NavLink>
//                   <NavLink
//                     to="/dashboard/user-management/add-users"
//                     onClick={closeSidebar}
//                     className={({ isActive }) =>
//                       `block py-1 ${isActive ? "text-[#056BB7] font-medium" : "text-gray-700 hover:text-[#056BB7]"}`
//                     }
//                   >
//                     Add Users
//                   </NavLink>
//                   <NavLink
//                     to="/dashboard/user-management/view-users"
//                     onClick={closeSidebar}
//                     className={({ isActive }) =>
//                       `block py-1 ${isActive ? "text-[#056BB7] font-medium" : "text-gray-700 hover:text-[#056BB7]"}`
//                     }
//                   >
//                     View All Users
//                   </NavLink>
//                   <NavLink
//                     to="/dashboard/user-management/card-generator"
//                     onClick={closeSidebar}
//                     className={({ isActive }) =>
//                       `block py-1 ${isActive ? "text-[#056BB7] font-medium" : "text-gray-700 hover:text-[#056BB7]"}`
//                     }
//                   >
//                     Card Generator
//                   </NavLink>
//                 </ul>
//               )}
//             </li>
//           )}

//           {/* Store Management */}
//           {(isAdmin || hasPermission("Store Management")) && (
//             <li
//               className={`${location.pathname.includes("/dashboard/store-management") || openSections.storeManagement
//                   ? "bg-gray-200 "
//                   : "text-gray-700 hover:bg-gray-200"
//                 } rounded py-1`}
//             >
//               <button
//                 className={`w-full flex justify-between items-center px-2 !py-0 rounded transition-colors duration-150 ${location.pathname.includes("/dashboard/store-management") || openSections.storeManagement
//                     ? "bg-gray-200 text-[#056BB7]"
//                     : "text-gray-700 hover:text-[#056BB7] hover:bg-gray-200"
//                   }`}
//                 onClick={() => toggleSection("storeManagement")}
//                 onMouseEnter={() => setHoveredSection("storeManagement")}
//                 onMouseLeave={() => setHoveredSection(null)}
//               >
//                 <div className="flex items-center">
//                   <img
//                     src={
//                       location.pathname.startsWith("/dashboard/store-management") ||
//                         openSections.storeManagement ||
//                         hoveredSection === "storeManagement"
//                         ? storemanageBlue
//                         : storemanage
//                     }
//                     alt="Store Management"
//                     className="pointer-events-none mr-1"
//                     draggable="false"
//                     width={20}
//                   />
//                   <span>Store Management</span>
//                 </div>
//                 {openSections.storeManagement ? (
//                   <MdOutlineArrowDropUp size={22} />
//                 ) : (
//                   <MdOutlineArrowDropDown size={22} />
//                 )}
//               </button>
//               {openSections.storeManagement && (
//                 <ul className="ml-4 px-3">
//                   <NavLink
//                     to="/dashboard/store-management/overall"
//                     onClick={closeSidebar}
//                     className={({ isActive }) =>
//                       `block py-1 ${isActive ? "text-[#056BB7] font-medium" : "text-gray-700 hover:text-[#056BB7]"}`
//                     }
//                   >
//                     Overall
//                   </NavLink>
//                   <NavLink
//                     to="/dashboard/store-management/add-prefix"
//                     onClick={closeSidebar}
//                     className={({ isActive }) =>
//                       `block py-1 ${isActive ? "text-[#056BB7] font-medium" : "text-gray-700 hover:text-[#056BB7]"}`
//                     }
//                   >
//                     Add Prefix
//                   </NavLink>
//                   <NavLink
//                     to="/dashboard/store-management/add-store"
//                     onClick={closeSidebar}
//                     className={({ isActive }) =>
//                       `block py-1 ${isActive ? "text-[#056BB7] font-medium" : "text-gray-700 hover:text-[#056BB7]"}`
//                     }
//                   >
//                     Add Store
//                   </NavLink>
//                   <NavLink
//                     to="/dashboard/store-management/view-all-store"
//                     onClick={closeSidebar}
//                     className={({ isActive }) =>
//                       `block py-1 ${isActive ? "text-[#056BB7] font-medium" : "text-gray-700 hover:text-[#056BB7]"}`
//                     }
//                   >
//                     View All Stores
//                   </NavLink>
//                 </ul>
//               )}
//             </li>
//           )}

//           {/* Core Setting */}
//           {(isAdmin || hasPermission("Core Setting")) && (
//             <li
//               className={`${location.pathname.includes("/dashboard/core-settings") || openSections.coreSettings
//                   ? "bg-gray-200 "
//                   : "text-gray-700 hover:bg-gray-200"
//                 } rounded py-1`}
//             >
//               <button
//                 className={`w-full flex justify-between items-center px-2 !py-0 rounded transition-colors duration-150 ${location.pathname.includes("/dashboard/core-settings") || openSections.coreSettings
//                     ? "bg-gray-200 text-[#056BB7]"
//                     : "text-gray-700 hover:text-[#056BB7] hover:bg-gray-200"
//                   }`}
//                 onClick={() => toggleSection("coreSettings")}
//                 onMouseEnter={() => setHoveredSection("coreSettings")}
//                 onMouseLeave={() => setHoveredSection(null)}
//               >
//                 <div className="flex items-center">
//                   <img
//                     src={
//                       location.pathname.startsWith("/dashboard/core-settings") ||
//                         openSections.coreSettings ||
//                         hoveredSection === "coreSettings"
//                         ? coreSettingBlue
//                         : coreSetting
//                     }
//                     alt="Core Setting"
//                     className="pointer-events-none mr-1"
//                     draggable="false"
//                     width={20}
//                   />
//                   <span>Core Setting</span>
//                 </div>
//                 {openSections.coreSettings ? <MdOutlineArrowDropUp size={22} /> : <MdOutlineArrowDropDown size={22} />}
//               </button>
//               {openSections.coreSettings && (
//                 <ul className="ml-4 px-3">
//                   <NavLink
//                     to="/dashboard/core-settings/add-zone"
//                     onClick={closeSidebar}
//                     className={({ isActive }) =>
//                       `block py-1 ${isActive ? "text-[#056BB7] font-medium" : "text-gray-700 hover:text-[#056BB7]"}`
//                     }
//                   >
//                     Add Zone
//                   </NavLink>
//                   <NavLink
//                     to="/dashboard/core-settings/add-product-category"
//                     onClick={closeSidebar}
//                     className={({ isActive }) =>
//                       `block py-1 ${isActive ? "text-[#056BB7] font-medium" : "text-gray-700 hover:text-[#056BB7]"}`
//                     }
//                   >
//                     Add Product Category
//                   </NavLink>
//                   <NavLink
//                     to="/dashboard/core-settings/add-product-sub-category"
//                     onClick={closeSidebar}
//                     className={({ isActive }) =>
//                       `block py-1 ${isActive ? "text-[#056BB7] font-medium" : "text-gray-700 hover:text-[#056BB7]"}`
//                     }
//                   >
//                     Add Product Sub-Category
//                   </NavLink>
//                   <NavLink
//                     to="/dashboard/core-settings/add-sku-prefix"
//                     onClick={closeSidebar}
//                     className={({ isActive }) =>
//                       `block py-1 ${isActive ? "text-[#056BB7] font-medium" : "text-gray-700 hover:text-[#056BB7]"}`
//                     }
//                   >
//                     Add SKU Prefix
//                   </NavLink>
//                   <NavLink
//                     to="/dashboard/core-settings/add-item-category"
//                     onClick={closeSidebar}
//                     className={({ isActive }) =>
//                       `block py-1 ${isActive ? "text-[#056BB7] font-medium" : "text-gray-700 hover:text-[#056BB7]"}`
//                     }
//                   >
//                     Add Item (Category)
//                   </NavLink>
//                   <NavLink
//                     to="/dashboard/core-settings/all-item-category"
//                     onClick={closeSidebar}
//                     className={({ isActive }) =>
//                       `block py-1 ${isActive ? "text-[#056BB7] font-medium" : "text-gray-700 hover:text-[#056BB7]"}`
//                     }
//                   >
//                     All Item (Category)
//                   </NavLink>
//                   <NavLink
//                     to="/dashboard/core-settings/current-pricing"
//                     onClick={closeSidebar}
//                     className={({ isActive }) =>
//                       `block py-1 ${isActive ? "text-[#056BB7] font-medium" : "text-gray-700 hover:text-[#056BB7]"}`
//                     }
//                   >
//                     Current Pricing
//                   </NavLink>
//                   <NavLink
//                     to="/dashboard/core-settings/payment-mode"
//                     onClick={closeSidebar}
//                     className={({ isActive }) =>
//                       `block py-1 ${isActive ? "text-[#056BB7] font-medium" : "text-gray-700 hover:text-[#056BB7]"}`
//                     }
//                   >
//                     Payment Mode
//                   </NavLink>
//                 </ul>
//               )}
//             </li>
//           )}

//           {/* Suppliers */}
//           {(isAdmin || hasPermission("Suppliers")) && (
//             <li
//               className={`${location.pathname.includes("/dashboard/suppliers") || openSections.suppliers
//                   ? "bg-gray-200 "
//                   : "text-gray-700 hover:bg-gray-200"
//                 } rounded py-1`}
//             >
//               <button
//                 className={`w-full flex justify-between items-center px-2 !py-0 rounded transition-colors duration-150 ${location.pathname.includes("/dashboard/suppliers") || openSections.suppliers
//                     ? "bg-gray-200 text-[#056BB7]"
//                     : "text-gray-700 hover:text-[#056BB7] hover:bg-gray-200"
//                   }`}
//                 onClick={() => toggleSection("suppliers")}
//                 onMouseEnter={() => setHoveredSection("suppliers")}
//                 onMouseLeave={() => setHoveredSection(null)}
//               >
//                 <div className="flex items-center">
//                   <img
//                     src={
//                       location.pathname.startsWith("/dashboard/suppliers") ||
//                         openSections.suppliers ||
//                         hoveredSection === "suppliers"
//                         ? suppliersBlue
//                         : suppliers
//                     }
//                     alt="Suppliers"
//                     className="pointer-events-none mr-1"
//                     draggable="false"
//                     width={20}
//                   />
//                   <span>Suppliers</span>
//                 </div>
//                 {openSections.suppliers ? <MdOutlineArrowDropUp size={22} /> : <MdOutlineArrowDropDown size={22} />}
//               </button>
//               {openSections.suppliers && (
//                 <ul className="ml-4 px-3">
//                   <NavLink
//                     to="/dashboard/suppliers/add-suppliers"
//                     onClick={closeSidebar}
//                     className={({ isActive }) =>
//                       `block py-1 ${isActive ? "text-[#056BB7] font-medium" : "text-gray-700 hover:text-[#056BB7]"}`
//                     }
//                   >
//                     Add Suppliers
//                   </NavLink>
//                   <NavLink
//                     to="/dashboard/suppliers/view-all-suppliers"
//                     onClick={closeSidebar}
//                     className={({ isActive }) =>
//                       `block py-1 ${isActive ? "text-[#056BB7] font-medium" : "text-gray-700 hover:text-[#056BB7]"}`
//                     }
//                   >
//                     View All Suppliers
//                   </NavLink>
//                   <NavLink
//                     to="/dashboard/suppliers/add-template"
//                     onClick={closeSidebar}
//                     className={({ isActive }) =>
//                       `block py-1 ${isActive ? "text-[#056BB7] font-medium" : "text-gray-700 hover:text-[#056BB7]"}`
//                     }
//                   >
//                     Add Template
//                   </NavLink>
//                 </ul>
//               )}
//             </li>
//           )}

//           {/* Inventory */}
//           {(isAdmin || hasPermission("Inventory")) && (
//             <li
//               className={`${location.pathname.includes("/dashboard/inventory") || openSections.inventory
//                   ? "bg-gray-200 "
//                   : "text-gray-700 hover:bg-gray-200"
//                 } rounded py-1`}
//             >
//               <button
//                 className={`w-full flex justify-between items-center px-2 !py-0 rounded transition-colors duration-150 ${location.pathname.includes("/dashboard/inventory") || openSections.inventory
//                     ? "bg-gray-200 text-[#056BB7]"
//                     : "text-gray-700 hover:text-[#056BB7] hover:bg-gray-200"
//                   }`}
//                 onClick={() => toggleSection("inventory")}
//                 onMouseEnter={() => setHoveredSection("inventory")}
//                 onMouseLeave={() => setHoveredSection(null)}
//               >
//                 <div className="flex items-center">
//                   <img
//                     src={
//                       location.pathname.startsWith("/dashboard/inventory") ||
//                         openSections.inventory ||
//                         hoveredSection === "inventory"
//                         ? inventoryBlue
//                         : inventory
//                     }
//                     alt="Inventory"
//                     className="pointer-events-none mr-1"
//                     draggable="false"
//                     width={20}
//                   />
//                   <span>Inventory</span>
//                 </div>
//                 {openSections.inventory ? <MdOutlineArrowDropUp size={22} /> : <MdOutlineArrowDropDown size={22} />}
//               </button>
//               {openSections.inventory && (
//                 <ul className="ml-4 px-3">
//                   <NavLink
//                     to="/dashboard/inventory/purchase-invoice"
//                     onClick={closeSidebar}
//                     className={({ isActive }) =>
//                       `block py-1 ${isActive ? "text-[#056BB7] font-medium" : "text-gray-700 hover:text-[#056BB7]"}`
//                     }
//                   >
//                     Purchase Invoice
//                   </NavLink>
//                   <NavLink
//                     to="/dashboard/inventory/purchase-order"
//                     onClick={closeSidebar}
//                     className={({ isActive }) =>
//                       `block py-1 ${isActive ? "text-[#056BB7] font-medium" : "text-gray-700 hover:text-[#056BB7]"}`
//                     }
//                   >
//                     Purchase Order
//                   </NavLink>
//                   <NavLink
//                     to="/dashboard/inventory/view-all-inventory"
//                     onClick={closeSidebar}
//                     className={({ isActive }) =>
//                       `block py-1 ${isActive ? "text-[#056BB7] font-medium" : "text-gray-700 hover:text-[#056BB7]"}`
//                     }
//                   >
//                     View All Inventory
//                   </NavLink>
//                   <NavLink
//                     to="/dashboard/inventory/sale-invoice"
//                     onClick={closeSidebar}
//                     className={({ isActive }) =>
//                       `block py-1 ${isActive ? "text-[#056BB7] font-medium" : "text-gray-700 hover:text-[#056BB7]"}`
//                     }
//                   >
//                     Sale Invoice
//                   </NavLink>
//                   <NavLink
//                     to="/dashboard/inventory/sale-invoice-status"
//                     onClick={closeSidebar}
//                     className={({ isActive }) =>
//                       `block py-1 ${isActive ? "text-[#056BB7] font-medium" : "text-gray-700 hover:text-[#056BB7]"}`
//                     }
//                   >
//                     Sale Invoice Status
//                   </NavLink>
//                   <NavLink
//                     to="/dashboard/inventory/purchase-return"
//                     onClick={closeSidebar}
//                     className={({ isActive }) =>
//                       `block py-1 ${isActive ? "text-[#056BB7] font-medium" : "text-gray-700 hover:text-[#056BB7]"}`
//                     }
//                   >
//                     Purchase Return
//                   </NavLink>
//                   <NavLink
//                     to="/dashboard/inventory/product-aging"
//                     onClick={closeSidebar}
//                     className={({ isActive }) =>
//                       `block py-1 ${isActive ? "text-[#056BB7] font-medium" : "text-gray-700 hover:text-[#056BB7]"}`
//                     }
//                   >
//                     Product Aging
//                   </NavLink>
//                 </ul>
//               )}
//             </li>
//           )}

//           {/* Live Inventory */}
//           {(isAdmin || hasPermission("Live Inventory")) && (
//             <li className="">
//               <NavLink
//                 to="/dashboard/live-inventory"
//                 onClick={() => {
//                   closeSidebar()
//                   // Clear all open sections when clicking on Live Inventory
//                   setOpenSections({})
//                 }}
//                 end
//                 className={({ isActive }) => {
//                   // Check if any dropdown sections are open
//                   const isAnyDropdownOpen = Object.values(openSections).some((value) => value)

//                   return `flex items-center px-2 !py-1 rounded
//                   ${isActive && !isAnyDropdownOpen
//                       ? "bg-gray-200 text-[#056BB7]"
//                       : "text-gray-700 hover:text-[#056BB7] hover:bg-gray-200"
//                     }`
//                 }}
//                 onMouseEnter={() => setHoveredSection("liveInventory")}
//                 onMouseLeave={() => setHoveredSection(null)}
//               >
//                 <img
//                   src={
//                     (location.pathname.startsWith("/dashboard/live-inventory") &&
//                       !Object.values(openSections).some((value) => value)) ||
//                       hoveredSection === "liveInventory"
//                       ? liveInventoryBlue
//                       : liveInventory
//                   }
//                   alt="Live Inventory"
//                   className="pointer-events-none mr-1 ml-2"
//                   draggable="false"
//                   width={19}
//                 />
//                 Live Inventory
//               </NavLink>
//             </li>
//           )}

//           {/* Live Trade-In Inventory */}
//           {(isAdmin || hasPermission("Live Trade-In Inventory")) && (
//             <li className="">
//               <NavLink
//                 to="/dashboard/live-trade-in-inventory"
//                 onClick={() => {
//                   closeSidebar()
//                   // Clear all open sections when clicking on Live Inventory
//                   setOpenSections({})
//                 }}
//                 end
//                 className={({ isActive }) => {
//                   // Check if any dropdown sections are open
//                   const isAnyDropdownOpen = Object.values(openSections).some((value) => value)

//                   return `flex items-center px-2 !py-1 rounded
//                   ${isActive && !isAnyDropdownOpen
//                       ? "bg-gray-200 text-[#056BB7]"
//                       : "text-gray-700 hover:text-[#056BB7] hover:bg-gray-200"
//                     }`
//                 }}
//                 onMouseEnter={() => setHoveredSection("liveTradeInInventory")}
//                 onMouseLeave={() => setHoveredSection(null)}
//               >
//                 <img
//                   src={
//                     (location.pathname.startsWith("/dashboard/live-trade-in-inventory") &&
//                       !Object.values(openSections).some((value) => value)) ||
//                       hoveredSection === "liveTradeInInventory"
//                       ? liveTradeInInventoryBlue
//                       : liveTradeInInventory
//                   }
//                   alt="Live Trade-In Inventory"
//                   className="pointer-events-none mr-2 ml-2"
//                   draggable="false"
//                   width={17}
//                 />
//                 Live Trade-In Inventory
//               </NavLink>
//             </li>
//           )}

//           {/* Ledger */}
//           {(isAdmin || hasPermission("Ledger")) && (
//             <li
//               className={`${location.pathname.includes("/dashboard/ledger") || openSections.ledger
//                   ? "bg-gray-200 "
//                   : "text-gray-700 hover:bg-gray-200"
//                 } rounded py-1`}
//             >
//               <button
//                 className={`w-full flex justify-between items-center px-2 !py-0 rounded transition-colors duration-150 ${location.pathname.includes("/dashboard/ledger") || openSections.ledger
//                     ? "bg-gray-200 text-[#056BB7]"
//                     : "text-gray-700 hover:text-[#056BB7] hover:bg-gray-200"
//                   }`}
//                 onClick={() => toggleSection("ledger")}
//                 onMouseEnter={() => setHoveredSection("ledger")}
//                 onMouseLeave={() => setHoveredSection(null)}
//               >
//                 <div className="flex items-center">
//                   <img
//                     src={
//                       location.pathname.startsWith("/dashboard/ledger") ||
//                         openSections.ledger ||
//                         hoveredSection === "ledger"
//                         ? ledgerBlue
//                         : ledger
//                     }
//                     alt="Ledger"
//                     className="pointer-events-none mr-1"
//                     draggable="false"
//                     width={20}
//                   />
//                   <span>Ledger</span>
//                 </div>
//                 {openSections.ledger ? <MdOutlineArrowDropUp size={22} /> : <MdOutlineArrowDropDown size={22} />}
//               </button>
//               {openSections.ledger && (
//                 <ul className="ml-4 px-3">
//                   <NavLink
//                     to="/dashboard/ledger/supplier-ledger"
//                     onClick={closeSidebar}
//                     className={({ isActive }) =>
//                       `block py-1 ${isActive ? "text-[#056BB7] font-medium" : "text-gray-700 hover:text-[#056BB7]"}`
//                     }
//                   >
//                     Supplier Ledger
//                   </NavLink>
//                   <NavLink
//                     to="/dashboard/ledger/store-ledger"
//                     onClick={closeSidebar}
//                     className={({ isActive }) =>
//                       `block py-1 ${isActive ? "text-[#056BB7] font-medium" : "text-gray-700 hover:text-[#056BB7]"}`
//                     }
//                   >
//                     Store Ledger
//                   </NavLink>
//                 </ul>
//               )}
//             </li>
//           )}

//           {/* Tax Management */}
//           {(isAdmin || hasPermission("Tax Management")) && (
//             <li className="">
//               <NavLink
//                 to="/dashboard/tax-management"
//                 onClick={() => {
//                   closeSidebar()
//                   // Clear all open sections when clicking on Live Inventory
//                   setOpenSections({})
//                 }}
//                 end
//                 className={({ isActive }) => {
//                   // Check if any dropdown sections are open
//                   const isAnyDropdownOpen = Object.values(openSections).some((value) => value)

//                   return `flex items-center px-2 !py-1 rounded
//                   ${isActive && !isAnyDropdownOpen
//                       ? "bg-gray-200 text-[#056BB7]"
//                       : "text-gray-700 hover:text-[#056BB7] hover:bg-gray-200"
//                     }`
//                 }}
//                 onMouseEnter={() => setHoveredSection("taxManagement")}
//                 onMouseLeave={() => setHoveredSection(null)}
//               >
//                 <img
//                   src={
//                     (location.pathname.startsWith("/dashboard/tax-management") &&
//                       !Object.values(openSections).some((value) => value)) ||
//                       hoveredSection === "taxManagement"
//                       ? taxManageBlue
//                       : taxManage
//                   }
//                   alt="Tax Management"
//                   className="pointer-events-none mr-1 ml-2.5"
//                   draggable="false"
//                   width={16}
//                 />
//                 Tax Management
//               </NavLink>
//             </li>
//           )}

//           {/* Customer */}
//           {(isAdmin || hasPermission("Customer")) && (
//             <li
//               className={`${location.pathname.includes("/dashboard/customer") || openSections.customer
//                   ? "bg-gray-200 "
//                   : "text-gray-700 hover:bg-gray-200"
//                 } rounded py-1`}
//             >
//               <button
//                 className={`w-full flex justify-between items-center px-2 !py-0 rounded transition-colors duration-150 ${location.pathname.includes("/dashboard/customer") || openSections.customer
//                     ? "bg-gray-200 text-[#056BB7]"
//                     : "text-gray-700 hover:text-[#056BB7] hover:bg-gray-200"
//                   }`}
//                 onClick={() => toggleSection("customer")}
//                 onMouseEnter={() => setHoveredSection("customer")}
//                 onMouseLeave={() => setHoveredSection(null)}
//               >
//                 <div className="flex items-center">
//                   <img
//                     src={
//                       location.pathname.startsWith("/dashboard/customer") ||
//                         openSections.customer ||
//                         hoveredSection === "customer"
//                         ? customerDetailsBlue
//                         : customerDetails
//                     }
//                     alt="Customer"
//                     className="pointer-events-none mr-1"
//                     draggable="false"
//                     width={20}
//                   />
//                   <span>Customer</span>
//                 </div>
//                 {openSections.customer ? <MdOutlineArrowDropUp size={22} /> : <MdOutlineArrowDropDown size={22} />}
//               </button>
//               {openSections.customer && (
//                 <ul className="ml-4 px-3">
//                   <NavLink
//                     to="/dashboard/customer/add-customer"
//                     onClick={closeSidebar}
//                     className={({ isActive }) =>
//                       `block py-1 ${isActive ? "text-[#056BB7] font-medium" : "text-gray-700 hover:text-[#056BB7]"}`
//                     }
//                   >
//                     Add Customer
//                   </NavLink>
//                   <NavLink
//                     to="/dashboard/customer/view-all-customer"
//                     onClick={closeSidebar}
//                     className={({ isActive }) =>
//                       `block py-1 ${isActive ? "text-[#056BB7] font-medium" : "text-gray-700 hover:text-[#056BB7]"}`
//                     }
//                   >
//                     View All Customer
//                   </NavLink>
//                 </ul>
//               )}
//             </li>
//           )}

//           {/* Expense */}
//           {(isAdmin || hasPermission("Expense")) && (
//             <li
//               className={`${location.pathname.includes("/dashboard/expense") || openSections.expense
//                   ? "bg-gray-200 "
//                   : "text-gray-700 hover:bg-gray-200"
//                 } rounded py-1`}
//             >
//               <button
//                 className={`w-full flex justify-between items-center px-1 !py-0 rounded transition-colors duration-150 ${location.pathname.includes("/dashboard/expense") || openSections.expense
//                     ? "bg-gray-200 text-[#056BB7]"
//                     : "text-gray-700 hover:text-[#056BB7] hover:bg-gray-200"
//                   }`}
//                 onClick={() => toggleSection("expense")}
//                 onMouseEnter={() => setHoveredSection("expense")}
//                 onMouseLeave={() => setHoveredSection(null)}
//               >
//                 <div className="flex items-center">
//                   <img
//                     src={
//                       location.pathname.startsWith("/dashboard/expense") ||
//                         openSections.expense ||
//                         hoveredSection === "expense"
//                         ? expenseBlue
//                         : expense
//                     }
//                     alt="expense"
//                     className="pointer-events-none mr-1"
//                     draggable="false"
//                     width={23}
//                   />
//                   <span>Expense</span>
//                 </div>
//                 {openSections.expense ? <MdOutlineArrowDropUp size={22} /> : <MdOutlineArrowDropDown size={22} />}
//               </button>
//               {openSections.expense && (
//                 <ul className="ml-4 px-3">
//                   <NavLink
//                     to="/dashboard/expense/add-expense"
//                     onClick={closeSidebar}
//                     className={({ isActive }) =>
//                       `block py-1 ${isActive ? "text-[#056BB7] font-medium" : "text-gray-700 hover:text-[#056BB7]"}`
//                     }
//                   >
//                     Add Expense
//                   </NavLink>
//                   <NavLink
//                     to="/dashboard/expense/all-expenses"
//                     onClick={closeSidebar}
//                     className={({ isActive }) =>
//                       `block py-1 ${isActive ? "text-[#056BB7] font-medium" : "text-gray-700 hover:text-[#056BB7]"}`
//                     }
//                   >
//                     All Expenses
//                   </NavLink>
//                   <NavLink
//                     to="/dashboard/expense/income-statement"
//                     onClick={closeSidebar}
//                     className={({ isActive }) =>
//                       `block py-1 ${isActive ? "text-[#056BB7] font-medium" : "text-gray-700 hover:text-[#056BB7]"}`
//                     }
//                   >
//                     Income Statement
//                   </NavLink>
//                 </ul>
//               )}
//             </li>
//           )}

//           {/* Cash Flow */}
//           {(isAdmin || hasPermission("Cash Flow")) && (
//             <li
//               className={`${location.pathname.includes("/dashboard/cash-flow") || openSections.cashFlow
//                   ? "bg-gray-200 "
//                   : "text-gray-700 hover:bg-gray-200"
//                 } rounded py-1`}
//             >
//               <button
//                 className={`w-full flex justify-between items-center px-2 !py-0 rounded transition-colors duration-150 ${location.pathname.includes("/dashboard/cash-flow") || openSections.cashFlow
//                     ? "bg-gray-200 text-[#056BB7]"
//                     : "text-gray-700 hover:text-[#056BB7] hover:bg-gray-200"
//                   }`}
//                 onClick={() => toggleSection("cashFlow")}
//                 onMouseEnter={() => setHoveredSection("cashFlow")}
//                 onMouseLeave={() => setHoveredSection(null)}
//               >
//                 <div className="flex items-center">
//                   <img
//                     src={
//                       location.pathname.startsWith("/dashboard/cash-flow") ||
//                         openSections.cashFlow ||
//                         hoveredSection === "cashFlow"
//                         ? cashFlowBlue
//                         : cashFlow
//                     }
//                     alt="Cash Flow"
//                     className="pointer-events-none mr-1"
//                     draggable="false"
//                     width={19}
//                   />
//                   <span>Cash Flow</span>
//                 </div>
//                 {openSections.cashFlow ? <MdOutlineArrowDropUp size={22} /> : <MdOutlineArrowDropDown size={22} />}
//               </button>
//               {openSections.cashFlow && (
//                 <ul className="ml-4 px-3">
//                   <NavLink
//                     to="/dashboard/cash-flow/cash"
//                     onClick={closeSidebar}
//                     className={({ isActive }) =>
//                       `block py-1 ${isActive ? "text-[#056BB7] font-medium" : "text-gray-700 hover:text-[#056BB7]"}`
//                     }
//                   >
//                     Cash
//                   </NavLink>
//                   <NavLink
//                     to="/dashboard/cash-flow/bank-transfer"
//                     onClick={closeSidebar}
//                     className={({ isActive }) =>
//                       `block py-1 ${isActive ? "text-[#056BB7] font-medium" : "text-gray-700 hover:text-[#056BB7]"}`
//                     }
//                   >
//                     Bank Transfer
//                   </NavLink>
//                   <NavLink
//                     to="/dashboard/cash-flow/apple-pay"
//                     onClick={closeSidebar}
//                     className={({ isActive }) =>
//                       `block py-1 ${isActive ? "text-[#056BB7] font-medium" : "text-gray-700 hover:text-[#056BB7]"}`
//                     }
//                   >
//                     Apple Pay
//                   </NavLink>
//                   <NavLink
//                     to="/dashboard/cash-flow/wire-transfer"
//                     onClick={closeSidebar}
//                     className={({ isActive }) =>
//                       `block py-1 ${isActive ? "text-[#056BB7] font-medium" : "text-gray-700 hover:text-[#056BB7]"}`
//                     }
//                   >
//                     Wire Transfer
//                   </NavLink>
//                 </ul>
//               )}
//             </li>
//           )}

//           {/* Communication */}
//           {(isAdmin || hasPermission("Communication")) && (
//             <li className="">
//               <NavLink
//                 to="/dashboard/communication"
//                 onClick={() => {
//                   closeSidebar()
//                   setOpenSections({})
//                 }}
//                 end
//                 className={({ isActive }) => {
//                   const isAnyDropdownOpen = Object.values(openSections).some((value) => value)
//                   return `flex items-center px-2 !py-1 rounded
//                   ${isActive && !isAnyDropdownOpen
//                       ? "bg-gray-200 text-[#056BB7]"
//                       : "text-gray-700 hover:text-[#056BB7] hover:bg-gray-200"
//                     }`
//                 }}
//                 onMouseEnter={() => setHoveredSection("Communication")}
//                 onMouseLeave={() => setHoveredSection(null)}
//               >
//                 <img
//                   src={
//                     (location.pathname.startsWith("/dashboard/communication") &&
//                       !Object.values(openSections).some((value) => value)) ||
//                       hoveredSection === "Communication"
//                       ? communicationBlue
//                       : communication
//                   }
//                   alt="Communication"
//                   className="pointer-events-none mr-1 ml-1.5"
//                   draggable="false"
//                   width={19}
//                 />
//                 Communication
//               </NavLink>
//             </li>
//           )}

//           {/* Reminder */}
//           {(isAdmin || hasPermission("Reminders")) && (
//             <li className="">
//               <NavLink
//                 to="/dashboard/reminders"
//                 onClick={() => {
//                   closeSidebar()
//                   setOpenSections({})
//                 }}
//                 end
//                 className={({ isActive }) => {
//                   const isAnyDropdownOpen = Object.values(openSections).some((value) => value)
//                   return `flex items-center px-2 !py-1 rounded
//                   ${isActive && !isAnyDropdownOpen
//                       ? "bg-gray-200 text-[#056BB7]"
//                       : "text-gray-700 hover:text-[#056BB7] hover:bg-gray-200"
//                     }`
//                 }}
//                 onMouseEnter={() => setHoveredSection("reminders")}
//                 onMouseLeave={() => setHoveredSection(null)}
//               >
//                 <img
//                   src={
//                     (location.pathname.startsWith("/dashboard/reminders") &&
//                       !Object.values(openSections).some((value) => value)) ||
//                       hoveredSection === "reminders"
//                       ? reminderBlue
//                       : reminder
//                   }
//                   alt="Reminders"
//                   className="pointer-events-none mr-1 ml-1.5"
//                   draggable="false"
//                   width={17}
//                 />
//                 Reminders
//               </NavLink>
//             </li>
//           )}

//           {/* Reports & Analytics */}
//           {(isAdmin || hasPermission("Reports & Analytics")) && (
//             <li className="">
//               <NavLink
//                 to="/dashboard/reports-and-analytics"
//                 onClick={() => {
//                   closeSidebar()
//                   setOpenSections({})
//                 }}
//                 end
//                 className={({ isActive }) => {
//                   const isAnyDropdownOpen = Object.values(openSections).some((value) => value)
//                   return `flex items-center px-2 !py-1 rounded
//                   ${isActive && !isAnyDropdownOpen
//                       ? "bg-gray-200 text-[#056BB7]"
//                       : "text-gray-700 hover:text-[#056BB7] hover:bg-gray-200"
//                     }`
//                 }}
//                 onMouseEnter={() => setHoveredSection("reportsAndAnalytics")}
//                 onMouseLeave={() => setHoveredSection(null)}
//               >
//                 <img
//                   src={
//                     (location.pathname.startsWith("/dashboard/reports-and-analytics") &&
//                       !Object.values(openSections).some((value) => value)) ||
//                       hoveredSection === "reportsAndAnalytics"
//                       ? reportsNanalyticsBlue
//                       : reportsNanalytics
//                   }
//                   alt="Reports and Analytics"
//                   className="pointer-events-none mr-1 ml-1.5"
//                   draggable="false"
//                   width={19}
//                 />
//                 Reports & Analytics
//               </NavLink>
//             </li>
//           )}

//           {/* System Setting */}
//           {(isAdmin || hasPermission("System Setting")) && (
//             <li>
//               <NavLink
//                 to="/dashboard/system-settings"
//                 onClick={() => {
//                   closeSidebar()
//                   setOpenSections({})
//                 }}
//                 className={({ isActive }) => {
//                   const isAnyDropdownOpen = Object.values(openSections).some((value) => value)
//                   return `flex items-center px-2 !py-1 rounded
//           ${isActive && !isAnyDropdownOpen
//                       ? "bg-gray-200 text-[#056BB7]"
//                       : "text-gray-700 hover:text-[#056BB7] hover:bg-gray-200"
//                     }`
//                 }}
//                 onMouseEnter={() => setHoveredSection("systemSettings")}
//                 onMouseLeave={() => setHoveredSection(null)}
//               >
//                 <img
//                   src={
//                     (location.pathname.startsWith("/dashboard/system-settings") &&
//                       !Object.values(openSections).some((value) => value)) ||
//                       hoveredSection === "systemSettings"
//                       ? systemsettingBlue
//                       : systemsetting
//                   }
//                   alt="System Settings"
//                   className="pointer-events-none mr-1 ml-1.5"
//                   draggable="false"
//                   width={19}
//                 />
//                 System Setting
//               </NavLink>
//             </li>
//           )}
//         </ul>
//       </SimpleBar>
//     </div>
//   )
// }

// export default DashboardSidebar
