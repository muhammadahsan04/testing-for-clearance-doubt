// import React from "react";

// const Ledger: React.FC = () => {
//   return (
//     <div className="role-and-policies">
//       <h2>Ledger</h2>
//       {/* Add your form or content here */}
//     </div>
//   );
// };

// export default Ledger;
// supplier-ledger

// import React, { lazy, Suspense } from "react";
// import { Routes, Route, useLocation } from "react-router-dom";

// // Lazy loaded components
// const SupplierLedger = lazy(() => import("../ledger/SupplierLedger"));
// const SupplierDetailPage = lazy(() => import("../ledger/SupplierDetailPage"));
// const StoreLedger = lazy(() => import("../ledger/StoreLedger"));
// const StoreDetailPage = lazy(() => import("../ledger/StoreDetailPage"));

// const Ledger: React.FC = () => {
//   const location = useLocation();

//   return (
//     <div className="">
//       <Suspense fallback={<div className="py-6 px-8">Loading...</div>}>
//         <Routes key={location.pathname}>
//           <Route path="supplier-ledger" element={<SupplierLedger />} />
//           <Route path="supplier-ledger/*" element={<SupplierDetailPage />} />
//           <Route path="store-ledger" element={<StoreLedger />} />
//           <Route path="store-ledger/*" element={<StoreDetailPage />} />
//         </Routes>
//       </Suspense>
//     </div>
//   );
// };

// export default Ledger;

import React, { lazy, Suspense } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

// Lazy loaded components
const SupplierLedger = lazy(() => import("../ledger/SupplierLedger"));
const SupplierDetailPage = lazy(() => import("../ledger/SupplierDetailPage"));
const StoreLedger = lazy(() => import("../ledger/StoreLedger"));
const StoreDetailPage = lazy(() => import("../ledger/StoreDetailPage"));

const Ledger: React.FC = () => {
  const location = useLocation();
  return (
    <div className="">
      <Suspense fallback={<div className="py-6 px-8">Loading...</div>}>
        <Routes key={location.pathname}>
          <Route path="supplier-ledger" element={<SupplierLedger />} />
          <Route
            path="supplier-ledger/details"
            element={<SupplierDetailPage />}
          />
          <Route
            path="supplier-ledger/:supplierName"
            element={<SupplierDetailPage />}
          />
          <Route path="store-ledger" element={<StoreLedger />} />
          <Route path="store-ledger/details" element={<StoreDetailPage />} />
          <Route  path="store-ledger/:storeName" element={<StoreDetailPage />} />
        </Routes>
      </Suspense>
    </div>
  );
};

export default Ledger;
