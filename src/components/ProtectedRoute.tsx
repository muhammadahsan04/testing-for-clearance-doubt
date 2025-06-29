// import React, { useEffect, useState } from "react";
// import { Navigate, Outlet } from "react-router-dom";

// const ProtectedRoute: React.FC = () => {
//   const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

//   useEffect(() => {
//     const checkAuth = async () => {
//       // Simulate minimum loading time of 500ms for better UX
//       const minLoadingPromise = new Promise((resolve) =>
//         setTimeout(resolve, 500)
//       );

//       // Check if token exists in localStorage or sessionStorage
//       const token =
//         localStorage.getItem("token") || sessionStorage.getItem("token");
//       const user =
//         localStorage.getItem("user") || sessionStorage.getItem("user");

//       // Wait for minimum loading time
//       await minLoadingPromise;

//       setIsAuthenticated(!!token && !!user);
//     };

//     checkAuth();
//   }, []);

//   // Show loading state while checking authentication
//   if (isAuthenticated === null) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-gray-100">
//         <div className="text-center flex justify-center items-center flex-col">
//           <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//           <p className="mt-2">Verifying authentication...</p>
//         </div>
//       </div>
//     );
//   }

//   // If not authenticated, redirect to login
//   if (!isAuthenticated) {
//     return <Navigate to="/" replace />;
//   }

//   // If authenticated, render the child routes
//   return <Outlet />;
// };

// export default ProtectedRoute;

import type React from "react";
import { useEffect, useState } from "react";
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
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center flex justify-center items-center flex-col space-y-6">
          {/* Animated Shield Icon */}
          <div className="relative">
            <div className="w-20 h-20 relative">
              {/* Outer rotating ring */}
              <div className="absolute inset-0 border-4 border-blue-200 rounded-full animate-spin"></div>

              {/* Inner pulsing ring */}
              <div className="absolute inset-2 border-2 border-blue-400 rounded-full animate-pulse"></div>

              {/* Shield icon */}
              <div className="absolute inset-0 flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-blue-600 animate-bounce"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>

            {/* Floating particles */}
            <div className="absolute -top-2 -left-2 w-2 h-2 bg-blue-400 rounded-full animate-ping"></div>
            <div className="absolute -top-1 -right-3 w-1.5 h-1.5 bg-indigo-400 rounded-full animate-ping animation-delay-200"></div>
            <div className="absolute -bottom-2 -right-1 w-2 h-2 bg-purple-400 rounded-full animate-ping animation-delay-500"></div>
            <div className="absolute -bottom-1 -left-3 w-1.5 h-1.5 bg-blue-300 rounded-full animate-ping animation-delay-700"></div>
          </div>

          {/* Animated text */}
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-gray-800 animate-pulse">
              Verifying Authentication
            </h2>
            <div className="flex items-center justify-center space-x-1">
              <span className="text-gray-600">Securing your session</span>
              <div className="flex space-x-1">
                <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce"></div>
                <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce animation-delay-200"></div>
                <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce animation-delay-500"></div>
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-64 h-1 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full animate-pulse"></div>
          </div>
        </div>

        {/* Custom CSS for animation delays */}
        {/* Custom CSS for animation delays */}
        <style>{`
  .animation-delay-200 {
    animation-delay: 200ms;
  }
  .animation-delay-500 {
    animation-delay: 500ms;
  }
  .animation-delay-700 {
    animation-delay: 700ms;
  }
`}</style>
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
