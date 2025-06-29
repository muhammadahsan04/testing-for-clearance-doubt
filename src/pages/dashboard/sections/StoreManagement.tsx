import React, { lazy, Suspense, useEffect, useState } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

// Lazy loaded components
const OverAll = lazy(() => import("../storeManagementSections/OverAll"));
const ZoneOne = lazy(() => import("../storeManagementSections/ZoneOne"));
const ZoneTwo = lazy(() => import("../storeManagementSections/ZoneTwo"));
const ZoneThree = lazy(() => import("../storeManagementSections/ZoneThree"));
const ZoneFour = lazy(() => import("../storeManagementSections/ZoneFour"));
const ZoneFive = lazy(() => import("../storeManagementSections/ZoneFive"));
const AddStore = lazy(() => import("../storeManagementSections/AddStore"));
const ViewAllStores = lazy(
  () => import("../storeManagementSections/ViewAllStores")
);
const AddPrefix = lazy(() => import("../storeManagementSections/AddPrefix"));
// const ZoneTwo = lazy(() => import("../storeManagementSections/ZoneTwo"));
// ...other imports

// Store Management
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

const StoreManagement: React.FC = () => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const navigate = useNavigate();
  useEffect(() => {
    // Check permissions on component mount
    const userRole = getUserRole();
    const isAdmin = userRole === "Admin" || userRole === "SuperAdmin";

    if (!isAdmin && !hasPermission("Store Management", "read")) {
      toast.error("You don't have permission to access store management");
      navigate("/dashboard");
      return;
    }
  }, [navigate]);

  const location = useLocation();
  return (
    <div className="">
      <Suspense fallback={<div className="py-6 px-8">Loading...</div>}>
        <Routes key={location.pathname}>
          <Route path="overall" element={<OverAll />} />
          <Route path="zone-one" element={<ZoneOne />} />
          <Route path="zone-two" element={<ZoneTwo />} />
          <Route path="zone-three" element={<ZoneThree />} />
          <Route path="zone-four" element={<ZoneFour />} />
          <Route path="zone-five" element={<ZoneFive />} />
          <Route
            path="add-store"
            element={
              <AddStore
                uploadedFile={uploadedFile}
                setUploadedFile={setUploadedFile}
              />
            }
          />
          <Route path="view-all-store" element={<ViewAllStores />} />
          <Route path="add-prefix" element={<AddPrefix />} />
          {/* ...other routes */}
        </Routes>
      </Suspense>
    </div>
  );
};

export default StoreManagement;
