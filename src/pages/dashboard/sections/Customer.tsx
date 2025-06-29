import React, { lazy, Suspense, useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

// Lazy loaded components
const AddCustomer = lazy(() => import("../customer/AddCustomer"));
const ViewAllCustomer = lazy(() => import("../customer/ViewAllCustomer"));
const CustomerDetailPage = lazy(() => import("../customer/CustomerDetailPage"));

export const hasPermission = (module: string, action: string) => {
  try {
    let permissionsStr = localStorage.getItem("permissions");
    if (!permissionsStr) {
      permissionsStr = sessionStorage.getItem("permissions");
    }

    if (!permissionsStr) return false;

    const permissions = JSON.parse(permissionsStr);

    // Check if user has all permissions
    if (permissions.allPermissions || permissions.allPagesAccess) return true;

    const page = permissions.pages?.find((p: any) => p.name === module);
    if (!page) return false;

    switch (action.toLowerCase()) {
      case "create":
        return page.create;
      case "read":
        return page.read;
      case "update":
        return page.update;
      case "delete":
        return page.delete;
      default:
        return false;
    }
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

const Customer: React.FC = () => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const navigate = useNavigate();
  useEffect(() => {
    // Check permissions on component mount
    const userRole = getUserRole();
    const isAdmin = userRole === "Admin" || userRole === "SuperAdmin";

    if (!isAdmin && !hasPermission("Customer", "read")) {
      toast.error("You don't have permission to access customer");
      navigate("/dashboard");
      return;
    }
  }, [navigate]);
  return (
    <div className="">
      <Suspense fallback={<div className="py-6 px-8">Loading...</div>}>
        <Routes key={location.pathname}>
          <Route
            path="add-customer"
            element={
              <AddCustomer
                uploadedFile={uploadedFile}
                setUploadedFile={setUploadedFile}
              />
            }
          />
          <Route path="view-all-customer" element={<ViewAllCustomer />} />
          <Route
            path="view-all-customer/:customerName"
            element={<CustomerDetailPage />}
          />
        </Routes>
      </Suspense>
    </div>
  );
};

export default Customer;
