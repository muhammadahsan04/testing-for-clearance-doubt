import React, { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";

// Lazy loaded components
const LiveTradeInInventoryRenderPage = lazy(
  () => import("../LiveTradeInInventory/LiveTradeInInventoryRenderPage")
);

const LiveTradeInInventory: React.FC = () => {
  return (
    <div className="">
      <Suspense fallback={<div className="py-6 px-8">Loading...</div>}>
        <Routes key={location.pathname}>
          {/* Add this route for the base path */}
          <Route path="" element={<LiveTradeInInventoryRenderPage />} />
          {/* <Route path="add-expense" element={<CommunicationRenderPage />} /> */}
        </Routes>
      </Suspense>
    </div>
  );
};

export default LiveTradeInInventory;
