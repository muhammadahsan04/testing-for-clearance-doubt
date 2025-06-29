//Dashboard.tsx
import React, { useState, lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import DashboardSidebar from "./DashboardSidebar";
import DashboardHeader from "./DashboardHeader";
// import Communication from "./sections/Communication";

// Lazy loaded sections
const DashboardHome = lazy(() => import("./sections/DashboardHome"));
const RoleAndPolicies = lazy(() => import("./sections/RoleAndPolicies"));
const UserManagement = lazy(() => import("./sections/UserManagement"));
const CoreSettings = lazy(() => import("./sections/CoreSettings"));
const StoreManagement = lazy(() => import("./sections/StoreManagement"));
const Suppliers = lazy(() => import("./sections/Suppliers"));
const Inventory = lazy(() => import("./sections/Inventory"));
const LiveInventory = lazy(() => import("./sections/LiveInventory"));
const LiveTradeInInventory = lazy(() => import("./sections/LiveTradeInInventory"));
const ReportsAndAnalytics = lazy(
  () => import("./sections/ReportsAndAnalytics")
);
const SystemSettings = lazy(() => import("./sections/SystemSettings"));
const NotificationCenter = lazy(() => import("./sections/NotificationCenter"));
const Ledger = lazy(() => import("./sections/Ledger"));
const Customer = lazy(() => import("./sections/Customer"));
const Communication = lazy(() => import("./sections/Communication"));
const CashFlow = lazy(() => import("./sections/CashFlow"));
const SalesManagement = lazy(() => import("./sections/SalesManagement"));
const TaxManagement = lazy(() => import("./sections/TaxManagement"));
const NotificationsAndAlerts = lazy(
  () => import("./sections/NotificationsAndAlerts")
);
const Reminder = lazy(() => import("./sections/Reminder"));
const Expense = lazy(() => import("./sections/Expense"));

// const DashboardHome = lazy(() => import("./sections/DashboardHome"));
// const RoleAndPolicies = lazy(() => import("./sections/RoleAndPolicies"));
// ... other imports

const Dashboard: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
    console.log("Sidebar status", isSidebarOpen);
  };

  return (
    <div className="dashboard-container flex bg-[#eeeeee] min-h-screen">
      <DashboardSidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        toggleSidebar={toggleSidebar}
      />
      <div
        className="dashboard-content w-full lg:w-[78%] xl:w-[82%]"
        onClick={() => {
          if (isSidebarOpen) {
            toggleSidebar();
          }
        }}
      >
        <DashboardHeader toggleSidebar={toggleSidebar} />
        <Suspense fallback={<div className="px-8 py-6">Loading...</div>}>
          <Routes>
            <Route path="/" element={<DashboardHome />} />
            <Route path="/role-and-policies" element={<RoleAndPolicies />} />
            <Route path="user-management/*" element={<UserManagement />} />
            <Route path="core-settings/*" element={<CoreSettings />} />
            <Route path="store-management/*" element={<StoreManagement />} />
            <Route path="suppliers/*" element={<Suppliers />} />
            <Route path="inventory/*" element={<Inventory />} />
            <Route path="/live-inventory" element={<LiveInventory />} />
            <Route path="/live-trade-in-inventory" element={<LiveTradeInInventory />} />
            <Route path="ledger/*" element={<Ledger />} />
            <Route path="cash-flow/*" element={<CashFlow />} />
            <Route path="/communication" element={<Communication />} />
            <Route
              path="/reports-and-analytics"
              element={<ReportsAndAnalytics />}
            />
            <Route path="/system-settings" element={<SystemSettings />} />
            <Route
              path="/notification-center"
              element={<NotificationCenter />}
            />
            <Route path="customer/*" element={<Customer />} />
            <Route path="expense/*" element={<Expense />} />
            <Route path="/sales-management" element={<SalesManagement />} />
            <Route path="/tax-management" element={<TaxManagement />} />
            <Route path="/reminders" element={<Reminder />} />
            <Route
              path="/notifications-and-alerts"
              element={<NotificationsAndAlerts />}
            />
          </Routes>
        </Suspense>
      </div>
    </div>
  );
};

export default Dashboard;


// import type React from "react"
// import { useState, lazy, Suspense, useEffect } from "react"
// import { Routes, Route } from "react-router-dom"
// import DashboardSidebar from "./DashboardSidebar"
// import DashboardHeader from "./DashboardHeader"

// // Lazy loaded sections
// const DashboardHome = lazy(() => import("./sections/DashboardHome"))
// const RoleAndPolicies = lazy(() => import("./sections/RoleAndPolicies"))
// const UserManagement = lazy(() => import("./sections/UserManagement"))
// const CoreSettings = lazy(() => import("./sections/CoreSettings"))
// const StoreManagement = lazy(() => import("./sections/StoreManagement"))
// const Suppliers = lazy(() => import("./sections/Suppliers"))
// const Inventory = lazy(() => import("./sections/Inventory"))
// const LiveInventory = lazy(() => import("./sections/LiveInventory"))
// const LiveTradeInInventory = lazy(() => import("./sections/LiveTradeInInventory"))
// const ReportsAndAnalytics = lazy(() => import("./sections/ReportsAndAnalytics"))
// const SystemSettings = lazy(() => import("./sections/SystemSettings"))
// const NotificationCenter = lazy(() => import("./sections/NotificationCenter"))
// const Ledger = lazy(() => import("./sections/Ledger"))
// const Customer = lazy(() => import("./sections/Customer"))
// const Communication = lazy(() => import("./sections/Communication"))
// const CashFlow = lazy(() => import("./sections/CashFlow"))
// const SalesManagement = lazy(() => import("./sections/SalesManagement"))
// const TaxManagement = lazy(() => import("./sections/TaxManagement"))
// const NotificationsAndAlerts = lazy(() => import("./sections/NotificationsAndAlerts"))
// const Reminder = lazy(() => import("./sections/Reminder"))
// const Expense = lazy(() => import("./sections/Expense"))

// const Dashboard: React.FC = () => {
//   const [isSidebarOpen, setIsSidebarOpen] = useState(true)

//   const toggleSidebar = () => {
//     setIsSidebarOpen((prev) => !prev)
//   }

//   useEffect(() => {
//     const handleResize = () => {
//       if (window.innerWidth >= 1280) {
//         setIsSidebarOpen(true) // Open sidebar on XL screens and above
//       } else {
//         setIsSidebarOpen(false) // Close sidebar on screens below XL
//       }
//     }

//     // Listen for window resize events
//     window.addEventListener("resize", handleResize)

//     // Call once on mount to handle initial load
//     handleResize()

//     // Cleanup event listener on component unmount
//     return () => {
//       window.removeEventListener("resize", handleResize)
//     }
//   }, []) // Remove dependencies to prevent infinite loops

//   return (
//     <div className="dashboard-container flex bg-[#eeeeee] min-h-screen relative w-full">
//       {/* Sidebar */}
//       <div
//         className={`fixed xl:relative top-0 left-0 h-full z-40 transition-all duration-300 ease-in-out ${isSidebarOpen ? "w-[250px] xl:w-[22%] 2xl:w-[18%] translate-x-0" : "w-0 -translate-x-full xl:translate-x-0"
//           }`}
//       >
//         <DashboardSidebar
//           isSidebarOpen={isSidebarOpen}
//           setIsSidebarOpen={setIsSidebarOpen}
//           toggleSidebar={toggleSidebar}
//         />
//       </div>

//       {/* Overlay for mobile and below XL */}
//       {isSidebarOpen && <div className="fixed inset-0 bg-opacity-50 z-30 xl:hidden" onClick={toggleSidebar} />}

//       {/* Main Content */}
//       <div className={`w-full transition-all duration-300 ease-in-out ${isSidebarOpen ? "xl:ml-0" : "ml-0"}`}>
//         <DashboardHeader toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />

//         <div className="dashboard-content">
//           <Suspense fallback={<div className="px-8 py-6">Loading...</div>}>
//             <Routes>
//               <Route path="/" element={<DashboardHome />} />
//               <Route path="/role-and-policies" element={<RoleAndPolicies />} />
//               <Route path="user-management/*" element={<UserManagement />} />
//               <Route path="core-settings/*" element={<CoreSettings />} />
//               <Route path="store-management/*" element={<StoreManagement />} />
//               <Route path="suppliers/*" element={<Suppliers />} />
//               <Route path="inventory/*" element={<Inventory />} />
//               <Route path="/live-inventory" element={<LiveInventory />} />
//               <Route path="/live-trade-in-inventory" element={<LiveTradeInInventory />} />
//               <Route path="ledger/*" element={<Ledger />} />
//               <Route path="cash-flow/*" element={<CashFlow />} />
//               <Route path="/communication" element={<Communication />} />
//               <Route path="/reports-and-analytics" element={<ReportsAndAnalytics />} />
//               <Route path="/system-settings" element={<SystemSettings />} />
//               <Route path="/notification-center" element={<NotificationCenter />} />
//               <Route path="customer/*" element={<Customer />} />
//               <Route path="expense/*" element={<Expense />} />
//               <Route path="/sales-management" element={<SalesManagement />} />
//               <Route path="/tax-management" element={<TaxManagement />} />
//               <Route path="/reminders" element={<Reminder />} />
//               <Route path="/notifications-and-alerts" element={<NotificationsAndAlerts />} />
//             </Routes>
//           </Suspense>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default Dashboard
