// import React from "react";
// import { Route, RouteProps } from "react-router-dom";

// // Lazy load the Login component
// const Login = React.lazy(() => import("../pages/auth/login")); // Adjust path accordingly

// export interface RoutesProps {
//   path: RouteProps["path"];
//   name?: string;
//   element?: RouteProps["element"];
//   route?: any;
//   exact?: boolean;
//   icon?: string;
//   header?: string;
//   roles?: string[];
//   children?: RoutesProps[];
// }

// // Public Routes
// const authRoutes: RoutesProps[] = [
//   {
//     path: "/auth/login",
//     name: "Login",
//     element: <Login />, // Login component
//     route: Route,
//   },
// ];

// // Function to flatten nested routes (if needed)
// const flattenRoutes = (routes: RoutesProps[]) => {
//   let flatRoutes: RoutesProps[] = [];
//   routes = routes || [];
//   routes.forEach((item: RoutesProps) => {
//     flatRoutes.push(item);
//     if (item.children) {
//       flatRoutes = [...flatRoutes, ...flattenRoutes(item.children)];
//     }
//   });
//   return flatRoutes;
// };

// // All routes
// const publicRoutes = [...authRoutes];

// const publicProtectedFlattenRoutes = flattenRoutes([...publicRoutes]);

// export {
//   publicProtectedFlattenRoutes,
// };
