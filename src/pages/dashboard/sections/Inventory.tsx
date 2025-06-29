// import React from "react";

// const Inventory: React.FC = () => {
//   return (
//     <div className="role-and-policies">
//       <h2>Inventory</h2>
//       {/* Add your form or content here */}
//     </div>
//   );
// };

// export default Inventory;

import React, { lazy, Suspense } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

// Lazy loaded components
const PurchaseInvoice = lazy(() => import("../Inventory/PurchaseInvoice"));
const PurchaseOrder = lazy(() => import("../Inventory/PurchaseOrder"));
const CreatePurchaseInvoice = lazy(
  () => import("../Inventory/CreatePurchaseInvoice")
);
const CreatePurchaseReturn = lazy(
  () => import("../Inventory/CreatePurchaseReturn")
);
const ViewAllInventory = lazy(() => import("../Inventory/ViewAllInventory"));
const SaleInvoice = lazy(() => import("../Inventory/SaleInvoice"));
const SaleInvoiceStatus = lazy(() => import("../Inventory/SaleInvoiceStatus"));
const PurchaseReturn = lazy(() => import("../Inventory/PurchaseReturn"));
const ProductAging = lazy(() => import("../Inventory/ProductAging"));

const Inventory: React.FC = () => {
  const location = useLocation();

  return (
    <div className="">
      <Suspense fallback={<div className="py-6 px-8">Loading...</div>}>
        <Routes key={location.pathname}>
          <Route path="purchase-invoice" element={<PurchaseInvoice />} />
          <Route path="purchase-order" element={<PurchaseOrder />} />
          <Route
            path="purchase-invoice/create-purchase-invoice"
            element={<CreatePurchaseInvoice />}
          />
          <Route
            path="purchase-return/create-purchase-return"
            element={<CreatePurchaseReturn />}
          />
          <Route path="view-all-inventory" element={<ViewAllInventory />} />
          <Route path="sale-invoice" element={<SaleInvoice />} />
          <Route path="sale-invoice-status" element={<SaleInvoiceStatus />} />
          <Route path="purchase-return" element={<PurchaseReturn />} />
          <Route path="product-aging" element={<ProductAging />} />
          {/* <Route path="view-all-suppliers" element={<ViewAllSuppliers />} />
          <Route path="add-template" element={<AddTemplate />} /> */}
        </Routes>
      </Suspense>
    </div>
  );
};

export default Inventory;
