import React, { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";

// Lazy loaded components
const SystemSettingRenderPage = lazy(
  () => import("../SystemSetting/SystemSettingRenderPage")
);

const SystemSetting: React.FC = () => {
  return (
    <div className="">
      <Suspense fallback={<div className="py-6 px-8">Loading...</div>}>
        <Routes key={location.pathname}>
          {/* Add this route for the base path */}
          <Route path="" element={<SystemSettingRenderPage />} />
          {/* <Route path="add-expense" element={<CommunicationRenderPage />} /> */}
        </Routes>
      </Suspense>
    </div>
  );
};

export default SystemSetting;
