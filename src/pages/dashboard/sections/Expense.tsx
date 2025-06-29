import React, { lazy, Suspense, useEffect, useState } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

// Lazy loaded components
const AddExpense = lazy(() => import("../Expense/AddExpense"));
const UpdateExpensePage = lazy(() => import("../Expense/UpdateExpensePage"));
const AllExpense = lazy(() => import("../Expense/AllExpenses"));
const IncomeStatement = lazy(() => import("../Expense/IncomeStatement"));

// Helper function to get user role
const getUserRole = () => {
  let role = localStorage.getItem("role");
  if (!role) {
    role = sessionStorage.getItem("role");
  }
  return role;
};

const Expense: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  console.log("Current location:", location.pathname);

  return (
    <div className="">
      <Suspense fallback={<div className="py-6 px-8">Loading...</div>}>
        <Routes key={location.pathname}>
          <Route path="/" element={<AllExpense />} />
          <Route path="/all-expenses" element={<AllExpense />} />
          <Route path="/add-expense" element={<AddExpense />} />
          <Route path="/update-expense/:id" element={<UpdateExpensePage />} />
          <Route path="/income-statement" element={<IncomeStatement />} />
        </Routes>
      </Suspense>
    </div>
  );
};

export default Expense;
