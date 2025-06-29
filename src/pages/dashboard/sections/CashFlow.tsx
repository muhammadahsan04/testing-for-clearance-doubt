import React, { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";

// Lazy loaded components
const Cash = lazy(() => import("../CashFlow/Cash"));
const BankTransfer = lazy(() => import("../CashFlow/BankTransfer"));
const ApplePay = lazy(() => import("../CashFlow/ApplePay"));
const WireTransfer = lazy(() => import("../CashFlow/WireTransfer"));

const CashFlow: React.FC = () => {
  return (
    <div className="">
      <Suspense fallback={<div className="px-8 py-6">Loading...</div>}>
        <Routes>
          <Route path="cash" element={<Cash />} />
          <Route path="bank-transfer" element={<BankTransfer />} />
          <Route path="apple-pay" element={<ApplePay />} />
          <Route path="wire-transfer" element={<WireTransfer />} />
          {/* <Route path="add-users" element={<AddUser />} /> */}
          {/* <Route
            path="add-users"
            element={
              <AddUser
                uploadedFile={uploadedFile}
                setUploadedFile={setUploadedFile}
              />
            }
          />

          <Route path="view-users" element={<ViewUsers />} />
          <Route path="card-generator" element={<CardGenerator />} />
          <Route path="admin" element={<Admin />} />
          <Route path="sales-person" element={<SalesPerson />} />
          <Route path="delivery-person" element={<DeliveryPerson />} />
          <Route path="entry-person" element={<EntryPerson />} /> */}
        </Routes>
      </Suspense>
    </div>
  );
};

export default CashFlow;
