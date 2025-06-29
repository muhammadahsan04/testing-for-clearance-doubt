import React, { lazy, Suspense } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

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

const StoreManagement: React.FC = () => {
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
          <Route path="add-store" element={<AddStore />} />
          <Route path="view-all-store" element={<ViewAllStores />} />
          <Route path="add-prefix" element={<AddPrefix />} />
          {/* ...other routes */}
        </Routes>
      </Suspense>
    </div>
  );
};

export default StoreManagement;
