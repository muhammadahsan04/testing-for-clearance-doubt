import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      // Simulate minimum loading time of 500ms for better UX
      const minLoadingPromise = new Promise((resolve) =>
        setTimeout(resolve, 500)
      );

      // Check if token exists in localStorage or sessionStorage
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");
      const user =
        localStorage.getItem("user") || sessionStorage.getItem("user");

      // Wait for minimum loading time
      await minLoadingPromise;

      setIsAuthenticated(!!token && !!user);
    };

    checkAuth();
  }, []);

  // Show loading state while checking authentication
  if (isAuthenticated === null) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // If authenticated, render the child routes
  return <Outlet />;
};

export default ProtectedRoute;
