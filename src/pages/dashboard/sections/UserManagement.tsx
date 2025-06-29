// import React, { lazy, Suspense, useState } from "react";
// import { Routes, Route } from "react-router-dom";

// // Lazy loaded components
// const OverAll = lazy(() => import("../userManagementSections/OverAll"));
// const AddUser = lazy(() => import("../userManagementSections/AddUser"));
// const ViewUsers = lazy(() => import("../userManagementSections/ViewUsers"));
// const CardGenerator = lazy(
//   () => import("../userManagementSections/CardGenerator")
// );
// const Admin = lazy(() => import("../userManagementSections/Admin"));
// const SalesPerson = lazy(() => import("../userManagementSections/SalesPerson"));
// const DeliveryPerson = lazy(
//   () => import("../userManagementSections/DeliveryPerson")
// );
// const EntryPerson = lazy(() => import("../userManagementSections/EntryPerson"));

// const UserManagement: React.FC = () => {
//   const [uploadedFile, setUploadedFile] = useState<File | null>(null);
//   return (
//     <div className="">
//       <Suspense fallback={<div className="px-8 py-6">Loading...</div>}>
//         <Routes>
//           <Route path="overall" element={<OverAll />} />
//           {/* <Route path="add-users" element={<AddUser />} /> */}
//           <Route
//             path="add-users"
//             element={
//               <AddUser
//                 uploadedFile={uploadedFile}
//                 setUploadedFile={setUploadedFile}
//               />
//             }
//           />

//           <Route path="view-users" element={<ViewUsers />} />
//           <Route path="card-generator" element={<CardGenerator />} />
//           <Route path="admin" element={<Admin />} />
//           <Route path="sales-person" element={<SalesPerson />} />
//           <Route path="delivery-person" element={<DeliveryPerson />} />
//           <Route path="entry-person" element={<EntryPerson />} />
//         </Routes>
//       </Suspense>
//     </div>
//   );
// };

// export default UserManagement;



import React, { lazy, Suspense, useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

// Lazy loaded components
const OverAll = lazy(() => import("../userManagementSections/OverAll"));
const AddUser = lazy(() => import("../userManagementSections/AddUser"));
const ViewUsers = lazy(() => import("../userManagementSections/ViewUsers"));
const CardGenerator = lazy(
  () => import("../userManagementSections/CardGenerator")
);
const Admin = lazy(() => import("../userManagementSections/Admin"));
const SalesPerson = lazy(() => import("../userManagementSections/SalesPerson"));
const DeliveryPerson = lazy(
  () => import("../userManagementSections/DeliveryPerson")
);
const EntryPerson = lazy(() => import("../userManagementSections/EntryPerson"));

// Helper function to check permissions
const hasPermission = (module: string, action: string) => {
  try {
    let permissionsStr = localStorage.getItem("permissions")
    if (!permissionsStr) {
      permissionsStr = sessionStorage.getItem("permissions")
    }

    if (!permissionsStr) return false

    const permissions = JSON.parse(permissionsStr)

    // Check if user has all permissions
    if (permissions.allPermissions || permissions.allPagesAccess) return true

    const page = permissions.pages?.find((p: any) => p.name === module)
    if (!page) return false

    switch (action.toLowerCase()) {
      case 'create':
        return page.create
      case 'read':
        return page.read
      case 'update':
        return page.update
      case 'delete':
        return page.delete
      default:
        return false
    }
  } catch (error) {
    console.error("Error checking permissions:", error)
    return false
  }
}

// Helper function to get user role
const getUserRole = () => {
  let role = localStorage.getItem("role")
  if (!role) {
    role = sessionStorage.getItem("role")
  }
  return role
}

const UserManagement: React.FC = () => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check permissions on component mount
    const userRole = getUserRole()
    const isAdmin = userRole === "Admin" || userRole === "SuperAdmin"

    if (!isAdmin && !hasPermission("User Management", "read")) {
      toast.error("You don't have permission to access user management")
      navigate("/dashboard")
      return
    }
  }, [navigate]);

  return (
    <div className="">
      <Suspense fallback={<div className="px-8 py-6">Loading...</div>}>
        <Routes>
          <Route path="overall" element={<OverAll />} />
          <Route
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
          <Route path="entry-person" element={<EntryPerson />} />
        </Routes>
      </Suspense>
    </div>
  );
};

export default UserManagement;
