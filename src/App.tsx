import React from "react";
import { BrowserRouter as Router, Route, Routes, HashRouter } from "react-router-dom";
import LoginComponent from "./pages/auth/login/index";
import ForgotPassword from "./pages/auth/forgotPassword/index";
import ResetPassword from "./pages/auth/resetPassword/index";
import Dashboard from "./pages/dashboard/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import { ToastContainer } from "react-toastify";

const App: React.FC = () => {
  return (
    <HashRouter>
      <>
        <ToastContainer />
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LoginComponent />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:id" element={<ResetPassword />} />

          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard/*" element={<Dashboard />} />
          </Route>
        </Routes>
      </>
    </HashRouter>
  );
};

export default App;
