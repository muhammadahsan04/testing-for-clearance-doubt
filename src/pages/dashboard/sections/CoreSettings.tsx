import React, { lazy, Suspense, useEffect, useState } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

// Lazy loaded components
const AddZone = lazy(() => import("../coreSettingSection/AddZone"));
const ProductCategory = lazy(
  () => import("../coreSettingSection/ProductCategory")
);
const AddProductSubCategory = lazy(
  () => import("../coreSettingSection/AddProductSubCategory")
);
const AddSKUPrefix = lazy(() => import("../coreSettingSection/AddSKUPrefix"));
const CurrentPricing = lazy(
  () => import("../coreSettingSection/CurrentPricing")
);
const HistoryPricing = lazy(
  () => import("../coreSettingSection/HistoryPricing")
);
const AddItem = lazy(() => import("../coreSettingSection/AddItem"));
const UpdateItemCategory = lazy(
  () => import("../coreSettingSection/UpdateItemCategory")
);
const AllItemCategory = lazy(
  () => import("../coreSettingSection/AllItemCategory")
);
const Payment = lazy(() => import("../coreSettingSection/Payment"));
const DealBy = lazy(() => import("../coreSettingSection/DealBy"));
const Category = lazy(() => import("../coreSettingSection/Inventory/Category"));
const SubCategory = lazy(
  () => import("../coreSettingSection/Inventory/SubCategory")
);
const Style = lazy(() => import("../coreSettingSection/Inventory/Style"));
const GoldCategory = lazy(
  () => import("../coreSettingSection/Inventory/GoldCategory")
);
const DiamondWeight = lazy(
  () => import("../coreSettingSection/Inventory/DiamondWeight")
);
const PurchaseOrderDetail = lazy(
  () => import("../coreSettingSection/PurchaseOrderDetail")
);

// Core Setting

// Core Setting
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

const CoreSettigns: React.FC = () => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check permissions on component mount
    const userRole = getUserRole();
    const isAdmin = userRole === "Admin" || userRole === "SuperAdmin";

    if (!isAdmin && !hasPermission("Core Setting", "read")) {
      toast.error("You don't have permission to access core setting");
      navigate("/dashboard");
      return;
    }
  }, [navigate]);

  const location = useLocation();
  // const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  return (
    <div className="">
      <Suspense fallback={<div className="py-6 px-8">Loading...</div>}>
        <Routes>
          <Route path="add-zone" element={<AddZone />} />
          <Route path="add-product-category" element={<ProductCategory />} />
          <Route
            path="add-product-sub-category"
            element={<AddProductSubCategory />}
          />
          <Route path="add-sku-prefix" element={<AddSKUPrefix />} />
          <Route path="current-pricing" element={<CurrentPricing />} />
          <Route
            path="current-pricing/:metal/history"
            element={<HistoryPricing />}
          />
          <Route path="add-item-category" element={<AddItem />} />
          <Route
            path="update-item-category/:id"
            element={<UpdateItemCategory />}
          />
          <Route path="all-item-category" element={<AllItemCategory />} />
          <Route path="payment-mode" element={<Payment />} />
          <Route path="deal-by" element={<DealBy />} />
          <Route path="category" element={<Category />} />
          <Route path="sub-category" element={<SubCategory />} />
          <Route path="style" element={<Style />} />
          <Route path="gold-category" element={<GoldCategory />} />
          <Route path="diamond-weight" element={<DiamondWeight />} />
          <Route
            path="add-item/purchase-order-detail"
            element={<PurchaseOrderDetail />}
          />
        </Routes>
      </Suspense>
    </div>
  );
};

export default CoreSettigns;
