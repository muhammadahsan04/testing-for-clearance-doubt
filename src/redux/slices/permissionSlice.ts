// import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
// import axios from 'axios';
// import { RootState } from '../store';
// import { toast } from 'react-toastify';

// // Define types for permission state
// export interface PermissionState {
//     [permission: string]: {
//         View?: boolean;
//         Add?: boolean;
//         Edit?: boolean;
//         Delete?: boolean;
//     };
// }

// interface PermissionsData {
//     permState: PermissionState;
//     permissionExists: boolean;
//     permissionId: string;
//     loading: boolean;
//     error: string | null;
// }

// interface PermissionsState {
//     byRoleId: Record<string, PermissionsData>;
//     loading: boolean;
//     error: string | null;
// }

// // Helper function to load persisted permissions from localStorage
// const loadPersistedPermissions = (): Record<string, PermissionsData> => {
//     try {
//         const persistedPermissions = localStorage.getItem('persistedPermissions');
//         return persistedPermissions ? JSON.parse(persistedPermissions) : {};
//     } catch (error) {
//         console.error('Failed to load persisted permissions:', error);
//         return {};
//     }
// };

// const initialState: PermissionsState = {
//     byRoleId: loadPersistedPermissions(),
//     loading: false,
//     error: null
// };

// // Helper function to persist permissions to localStorage
// const persistPermissions = (byRoleId: Record<string, PermissionsData>) => {
//     try {
//         localStorage.setItem('persistedPermissions', JSON.stringify(byRoleId));
//     } catch (error) {
//         console.error('Failed to persist permissions:', error);
//     }
// };

// // Helper function to get auth token
// const getAuthToken = () => {
//     let token = localStorage.getItem("token");
//     if (!token) {
//         token = sessionStorage.getItem("token");
//     }
//     return token;
// };

// // Helper function to get permissions
// const getPermissions = () => {
//     let permissions = localStorage.getItem("permissions");
//     if (!permissions) {
//         permissions = sessionStorage.getItem("permissions");
//     }
//     return permissions;
// };

// const updateUserPermissions = (roleId: string, permState: PermissionState) => {
//     try {
//         // Get current user's role ID from storage
//         const currentUserRoleId = localStorage.getItem("userRoleId") || sessionStorage.getItem("userRoleId");

//         // If the updated role matches current user's role, update their permissions in storage
//         if (currentUserRoleId === roleId) {
//             // Convert permState to the format stored in localStorage/sessionStorage
//             const pages = Object.keys(permState).map((perm) => ({
//                 name: perm,
//                 create: permState[perm]?.Add || false,
//                 read: permState[perm]?.View || false,
//                 update: permState[perm]?.Edit || false,
//                 delete: permState[perm]?.Delete || false,
//             }));

//             const updatedPermissions = {
//                 allPagesAccess: false,
//                 allPermissions: false,
//                 pages: pages,
//             };

//             // Update both localStorage and sessionStorage
//             const permissionsStr = JSON.stringify(updatedPermissions);
//             if (localStorage.getItem("permissions")) {
//                 localStorage.setItem("permissions", permissionsStr);
//             }
//             if (sessionStorage.getItem("permissions")) {
//                 sessionStorage.setItem("permissions", permissionsStr);
//             }
//         }
//     } catch (error) {
//         console.error("Error updating user permissions in storage:", error);
//     }
// };

// // Async thunk for fetching permissions for a role
// export const fetchPermissions = createAsyncThunk(
//     'permissions/fetchPermissions',
//     async (roleId: string, { getState, rejectWithValue }) => {
//         try {
//             // Check if we already have permissions data for this role in the store
//             const state = getState() as RootState;
//             const existingPermissions = state?.permissions?.byRoleId[roleId];

//             // If we already have valid permissions data, return it without making an API call
//             if (existingPermissions &&
//                 existingPermissions.permState &&
//                 Object.keys(existingPermissions.permState).length > 0) {
//                 return {
//                     roleId,
//                     permState: existingPermissions.permState,
//                     permissionExists: existingPermissions.permissionExists,
//                     permissionId: existingPermissions.permissionId,
//                 };
//             }

//             const API_URL = import.meta.env.VITE_BASE_URL || "http://localhost:9000";
//             const token = getAuthToken();

//             if (!token) {
//                 // toast.error("Authentication token not found. Please login again.");
//                 return rejectWithValue("Authentication token not found");
//             }

//             const response = await axios.get(
//                 `${API_URL}/api/abid-jewelry-ms/permission?roleId=${roleId}`,
//                 {
//                     headers: {
//                         "x-access-token": token,
//                         "Content-Type": "application/json",
//                     },
//                 }
//             );

//             const data = response.data;

//             if (data.success && data.data && Array.isArray(data.data)) {
//                 // Find the permission object for this role
//                 const rolePermission = data.data.find(
//                     (perm: any) =>
//                         perm.roleId &&
//                         (typeof perm.roleId === "string"
//                             ? perm.roleId === roleId
//                             : perm.roleId._id === roleId)
//                 );

//                 // if (rolePermission && Array.isArray(rolePermission.pages)) {
//                 //     // Convert API response to our PermissionState format
//                 //     const permState: PermissionState = {};

//                 //     rolePermission.pages.forEach((page: any) => {
//                 //         permState[page.name] = {
//                 //             View: page.read,
//                 //             Add: page.create,
//                 //             Edit: page.update,
//                 //             Delete: page.delete,
//                 //         };
//                 //     });

//                 //     toast.success("Permissions loaded successfully");

//                 //     return {
//                 //         roleId,
//                 //         permState,
//                 //         permissionExists: true,
//                 //         permissionId: rolePermission._id || "",
//                 //     };
//                 // } else {
//                 //     // No permissions found for this role
//                 //     // Initialize with default permissions (all unchecked)
//                 //     const permState: PermissionState = {};
//                 //     const permissions = [
//                 //         "Dashboard",
//                 //         "Role and Policies",
//                 //         "User Management",
//                 //         "Core Setting",
//                 //         "Store Management",
//                 //         "Suppliers",
//                 //         "Inventory",
//                 //         "Live Inventory",
//                 //         "Live Trade-In Inventory",
//                 //         "Ledger",
//                 //         "Tax Management",
//                 //         "Customer",
//                 //         "Expense",
//                 //         "Cash Flow",
//                 //         "Communication",
//                 //         "Reminders",
//                 //         "Report & Ananlytics",
//                 //         "System Setting",
//                 //     ];

//                 //     permissions.forEach((perm) => {
//                 //         permState[perm] = {
//                 //             View: false,
//                 //             Add: false,
//                 //             Edit: false,
//                 //             Delete: false,
//                 //         };
//                 //     });

//                 //     toast.info("No permissions found for this role. You can create new ones.");

//                 //     return {
//                 //         roleId,
//                 //         permState,
//                 //         permissionExists: false,
//                 //         permissionId: "",
//                 //     };
//                 // }

//                 // In the fetchPermissions async thunk, remove these lines:
//                 // toast.success("Permissions loaded successfully");
//                 // toast.info("No permissions found for this role. You can create new ones.");

//                 // Replace the success case with:
//                 if (rolePermission && Array.isArray(rolePermission.pages)) {
//                     // Convert API response to our PermissionState format
//                     const permState: PermissionState = {};

//                     rolePermission.pages.forEach((page: any) => {
//                         permState[page.name] = {
//                             View: page.read,
//                             Add: page.create,
//                             Edit: page.update,
//                             Delete: page.delete,
//                         };
//                     });

//                     // Remove this line: toast.success("Permissions loaded successfully");

//                     return {
//                         roleId,
//                         permState,
//                         permissionExists: true,
//                         permissionId: rolePermission._id || "",
//                     };
//                 } else {
//                     // No permissions found for this role
//                     // Initialize with default permissions (all unchecked)
//                     const permState: PermissionState = {};
//                     const permissions = [
//                         "Dashboard",
//                         "Role and Policies",
//                         "User Management",
//                         "Core Setting",
//                         "Store Management",
//                         "Suppliers",
//                         "Inventory",
//                         "Live Inventory",
//                         "Live Trade-In Inventory",
//                         "Ledger",
//                         "Tax Management",
//                         "Customer",
//                         "Expense",
//                         "Cash Flow",
//                         "Communication",
//                         "Reminders",
//                         "Report & Ananlytics",
//                         "System Setting",
//                     ];

//                     permissions.forEach((perm) => {
//                         permState[perm] = {
//                             View: false,
//                             Add: false,
//                             Edit: false,
//                             Delete: false,
//                         };
//                     });

//                     // Remove this line: toast.info("No permissions found for this role. You can create new ones.");

//                     return {
//                         roleId,
//                         permState,
//                         permissionExists: false,
//                         permissionId: "",
//                     };
//                 }


//             } else {
//                 toast.warning("Invalid permission data format");
//                 return rejectWithValue("Invalid permission data format");
//             }
//         } catch (error) {
//             console.error("Error fetching permissions:", error);

//             if (axios.isAxiosError(error)) {
//                 if (error.response) {
//                     const status = error.response.status;
//                     const errorData = error.response.data;

//                     switch (status) {
//                         case 401:
//                             toast.error("Session expired. Please login again.");
//                             break;
//                         case 403:
//                             toast.error("You don't have permission to access these permissions.");
//                             break;
//                         case 404:
//                             toast.error("Permissions not found for this role.");
//                             break;
//                         default:
//                             toast.error(errorData.message || "Failed to fetch permissions");
//                     }
//                 } else {
//                     toast.error("Network error. Please check your internet connection.");
//                 }
//             } else {
//                 toast.error("An unexpected error occurred while fetching permissions");
//             }

//             return rejectWithValue("Failed to fetch permissions");
//         }
//     }
// );

// // Async thunk for saving or updating permissions
// export const saveOrUpdatePermissions = createAsyncThunk(
//     'permissions/saveOrUpdatePermissions',
//     async ({
//         roleId,
//         permState,
//         permissionExists,
//         permissionId
//     }: {
//         roleId: string;
//         permState: PermissionState;
//         permissionExists: boolean;
//         permissionId: string;
//     }, { dispatch, rejectWithValue }) => {
//         try {
//             const API_URL = import.meta.env.VITE_BASE_URL || "http://localhost:9000";
//             const token = getAuthToken();

//             if (!token) {
//                 toast.error("Authentication token not found. Please login again.");
//                 return rejectWithValue("Authentication token not found");
//             }

//             // Convert our PermissionState to the API expected format
//             const pages = Object.keys(permState).map((perm) => ({
//                 name: perm,
//                 create: permState[perm]?.Add || false,
//                 read: permState[perm]?.View || false,
//                 update: permState[perm]?.Edit || false,
//                 delete: permState[perm]?.Delete || false,
//             }));

//             // Prepare request payload
//             const payload = {
//                 allPagesAccess: false,
//                 allPermissions: false,
//                 pages: pages,
//             };

//             let response;

//             if (permissionExists && permissionId) {
//                 // Update existing permissions using PUT
//                 response = await axios.put(
//                     `${API_URL}/api/abid-jewelry-ms/permission/${permissionId}`,
//                     payload,
//                     {
//                         headers: {
//                             "x-access-token": token,
//                             "Content-Type": "application/json",
//                         },
//                     }
//                 );
//             } else {
//                 // Create new permissions using POST
//                 response = await axios.post(
//                     `${API_URL}/api/abid-jewelry-ms/permission`,
//                     {
//                         roleId: roleId,
//                         ...payload,
//                     },
//                     {
//                         headers: {
//                             "x-access-token": token,
//                             "Content-Type": "application/json",
//                         },
//                     }
//                 );
//             }

//             const data = response.data;

//             if (data.success) {
//                 toast.success(
//                     permissionExists
//                         ? "Permissions updated successfully"
//                         : "Permissions created successfully"
//                 );

//                 // Return the updated data
//                 return {
//                     roleId,
//                     permState,
//                     permissionExists: true,
//                     permissionId: data.permission?._id || permissionId,
//                 };
//             } else {
//                 toast.error(
//                     data.message ||
//                     `Failed to ${permissionExists ? "update" : "create"} permissions`
//                 );
//                 return rejectWithValue(data.message || "Failed to save permissions");
//             }
//         } catch (error) {
//             console.error("Error saving permissions:", error);

//             if (axios.isAxiosError(error)) {
//                 if (error.response) {
//                     const status = error.response.status;
//                     const errorData = error.response.data;

//                     // Handle the "permissions already exist" error
//                     if (status === 400 && errorData.message && errorData.message.includes("already exist")) {
//                         toast.info("Permissions already exist for this role. Fetching existing permissions...");

//                         // Fetch the existing permissions to get the permission ID
//                         dispatch(fetchPermissions(roleId));

//                         return rejectWithValue("PERMISSIONS_ALREADY_EXIST");
//                     }

//                     toast.error(errorData.message || "Failed to save permissions");
//                     return rejectWithValue(errorData.message || "Failed to save permissions");
//                 } else {
//                     toast.error("Network error. Please check your internet connection.");
//                     return rejectWithValue("Network error");
//                 }
//             }

//             toast.error("An unexpected error occurred while saving permissions");
//             return rejectWithValue("An unexpected error occurred");
//         }
//     }
// );

// // Create the permissions slice
// const permissionSlice = createSlice({
//     name: 'permissions',
//     initialState,
//     reducers: {
//         updatePermissionState: (state, action: PayloadAction<{
//             roleId: string;
//             permission: string;
//             action: "View" | "Add" | "Edit" | "Delete";
//             value: boolean;
//         }>) => {
//             const { roleId, permission, action: actionType, value } = action.payload;

//             // Ensure the role exists in the state
//             if (!state.byRoleId[roleId]) {
//                 state.byRoleId[roleId] = {
//                     permState: {},
//                     permissionExists: false,
//                     permissionId: "",
//                     loading: false,
//                     error: null
//                 };
//             }

//             // Ensure the permission exists in the state
//             if (!state.byRoleId[roleId].permState[permission]) {
//                 state.byRoleId[roleId].permState[permission] = {};
//             }

//             // Update the permission value
//             state.byRoleId[roleId].permState[permission][actionType] = value;

//             // Persist the updated permissions
//             persistPermissions(state.byRoleId);
//         },
//         resetPermissionState: (state, action: PayloadAction<string>) => {
//             const roleId = action.payload;

//             if (state.byRoleId[roleId]) {
//                 const permissions = [
//                     "Dashboard",
//                     "Role and Policies",
//                     "User Management",
//                     "Core Setting",
//                     "Store Management",
//                     "Suppliers",
//                     "Inventory",
//                     "Live Inventory",
//                     "Live Trade-In Inventory",
//                     "Ledger",
//                     "Tax Management",
//                     "Customer",
//                     "Expense",
//                     "Cash Flow",
//                     "Communication",
//                     "Reminders",
//                     "Reports & Analytics",
//                     "System Setting",
//                 ];

//                 const resetState: PermissionState = {};

//                 permissions.forEach(perm => {
//                     resetState[perm] = {
//                         View: false,
//                         Add: false,
//                         Edit: false,
//                         Delete: false
//                     };
//                 });

//                 state.byRoleId[roleId].permState = resetState;

//                 // Persist the updated permissions
//                 persistPermissions(state.byRoleId);
//             }
//         },
//         clearPersistedPermissions: (state) => {
//             localStorage.removeItem('persistedPermissions');
//             state.byRoleId = {};
//         }
//     },
//     extraReducers: (builder) => {
//         builder
//             .addCase(fetchPermissions.pending, (state) => {
//                 state.loading = true;
//                 state.error = null;
//             })
//             .addCase(fetchPermissions.fulfilled, (state, action) => {
//                 state.loading = false;
//                 const { roleId, permState, permissionExists, permissionId } = action.payload;

//                 state.byRoleId[roleId] = {
//                     permState,
//                     permissionExists,
//                     permissionId,
//                     loading: false,
//                     error: null
//                 };

//                 // Persist the updated permissions
//                 persistPermissions(state.byRoleId);
//             })
//             .addCase(fetchPermissions.rejected, (state, action) => {
//                 state.loading = false;
//                 state.error = action.payload as string;
//             })
//             .addCase(saveOrUpdatePermissions.pending, (state, action) => {
//                 const { roleId } = action.meta.arg;

//                 if (!state.byRoleId[roleId]) {
//                     state.byRoleId[roleId] = {
//                         permState: {},
//                         permissionExists: false,
//                         permissionId: "",
//                         loading: true,
//                         error: null
//                     };
//                 } else {
//                     state.byRoleId[roleId].loading = true;
//                     state.byRoleId[roleId].error = null;
//                 }
//             })
//             .addCase(saveOrUpdatePermissions.fulfilled, (state, action) => {
//                 const { roleId, permState, permissionExists, permissionId } = action.payload;

//                 state.byRoleId[roleId] = {
//                     permState,
//                     permissionExists,
//                     permissionId,
//                     loading: false,
//                     error: null
//                 };

//                 // Persist the updated permissions
//                 persistPermissions(state.byRoleId);
//             })

//             // .addCase(saveOrUpdatePermissions.fulfilled, (state, action) => {
//             //     const { roleId, permState, permissionExists, permissionId } = action.payload;

//             //     state.byRoleId[roleId] = {
//             //         permState,
//             //         permissionExists,
//             //         permissionId,
//             //         loading: false,
//             //         error: null
//             //     };

//             //     // Update user permissions in browser storage if it's their role
//             //     updateUserPermissions(roleId, permState);

//             //     // Persist the updated permissions
//             //     persistPermissions(state.byRoleId);
//             // })


//             .addCase(saveOrUpdatePermissions.rejected, (state, action) => {
//                 const { roleId } = action.meta.arg;

//                 // Don't update state for "permissions already exist" error since we'll fetch the existing permissions
//                 if (action.payload !== "PERMISSIONS_ALREADY_EXIST" && state.byRoleId[roleId]) {
//                     state.byRoleId[roleId].loading = false;
//                     state.byRoleId[roleId].error = action.payload as string;
//                 }
//             });
//     }
// });

// export const { updatePermissionState, resetPermissionState, clearPersistedPermissions } = permissionSlice.actions;

// // Selectors
// export const selectPermissionsByRoleId = (state: RootState, roleId: string) =>
//     state.permissions.byRoleId[roleId] || {
//         permState: {},
//         permissionExists: false,
//         permissionId: "",
//         loading: false,
//         error: null
//     };


// export const selectPermissionsLoading = (state: RootState) => state.permissions.loading;

// export default permissionSlice.reducer;


//PREVIOUS CODE
// import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
// import axios from 'axios';
// import { RootState } from '../store';
// import { toast } from 'react-toastify';

// // Define types for permission state
// export interface PermissionState {
//     [permission: string]: {
//         View?: boolean;
//         Add?: boolean;
//         Edit?: boolean;
//         Delete?: boolean;
//     };
// }

// interface PermissionsData {
//     permState: PermissionState;
//     permissionExists: boolean;
//     permissionId: string;
//     loading: boolean;
//     error: string | null;
// }

// interface PermissionsState {
//     byRoleId: Record<string, PermissionsData>;
//     loading: boolean;
//     error: string | null;
// }

// // Helper function to load persisted permissions from localStorage
// const loadPersistedPermissions = (): Record<string, PermissionsData> => {
//     try {
//         const persistedPermissions = localStorage.getItem('persistedPermissions');
//         return persistedPermissions ? JSON.parse(persistedPermissions) : {};
//     } catch (error) {
//         console.error('Failed to load persisted permissions:', error);
//         return {};
//     }
// };

// const initialState: PermissionsState = {
//     byRoleId: loadPersistedPermissions(),
//     loading: false,
//     error: null
// };

// // Helper function to persist permissions to localStorage
// const persistPermissions = (byRoleId: Record<string, PermissionsData>) => {
//     try {
//         localStorage.setItem('persistedPermissions', JSON.stringify(byRoleId));
//     } catch (error) {
//         console.error('Failed to persist permissions:', error);
//     }
// };

// // Helper function to get auth token
// const getAuthToken = () => {
//     let token = localStorage.getItem("token");
//     if (!token) {
//         token = sessionStorage.getItem("token");
//     }
//     return token;
// };

// // Helper function to get permissions
// const getPermissions = () => {
//     let permissions = localStorage.getItem("permissions");
//     if (!permissions) {
//         permissions = sessionStorage.getItem("permissions");
//     }
//     return permissions;
// };

// const updateUserPermissions = (roleId: string, permState: PermissionState) => {
//     try {
//         // Get current user's role ID from storage
//         const currentUserRoleId = localStorage.getItem("userRoleId") || sessionStorage.getItem("userRoleId");

//         // If the updated role matches current user's role, update their permissions in storage
//         if (currentUserRoleId === roleId) {
//             // Convert permState to the format stored in localStorage/sessionStorage
//             const pages = Object.keys(permState).map((perm) => ({
//                 name: perm,
//                 create: permState[perm]?.Add || false,
//                 read: permState[perm]?.View || false,
//                 update: permState[perm]?.Edit || false,
//                 delete: permState[perm]?.Delete || false,
//             }));

//             const updatedPermissions = {
//                 allPagesAccess: false,
//                 allPermissions: false,
//                 pages: pages,
//             };

//             // Update both localStorage and sessionStorage
//             const permissionsStr = JSON.stringify(updatedPermissions);
//             if (localStorage.getItem("permissions")) {
//                 localStorage.setItem("permissions", permissionsStr);
//             }
//             if (sessionStorage.getItem("permissions")) {
//                 sessionStorage.setItem("permissions", permissionsStr);
//             }
//         }
//     } catch (error) {
//         console.error("Error updating user permissions in storage:", error);
//     }
// };

// // Async thunk for fetching permissions for a role
// export const fetchPermissions = createAsyncThunk(
//     'permissions/fetchPermissions',
//     async (roleId: string, { getState, rejectWithValue }) => {
//         try {
//             // Check if we already have permissions data for this role in the store
//             const state = getState() as RootState;
//             const existingPermissions = state?.permissions?.byRoleId[roleId];

//             // If we already have valid permissions data, return it without making an API call
//             if (existingPermissions &&
//                 existingPermissions.permState &&
//                 Object.keys(existingPermissions.permState).length > 0) {
//                 return {
//                     roleId,
//                     permState: existingPermissions.permState,
//                     permissionExists: existingPermissions.permissionExists,
//                     permissionId: existingPermissions.permissionId,
//                 };
//             }

//             const API_URL = import.meta.env.VITE_BASE_URL || "http://localhost:9000";
//             const token = getAuthToken();

//             if (!token) {
//                 // toast.error("Authentication token not found. Please login again.");
//                 return rejectWithValue("Authentication token not found");
//             }

//             const response = await axios.get(
//                 `${API_URL}/api/abid-jewelry-ms/permission?roleId=${roleId}`,
//                 {
//                     headers: {
//                         "x-access-token": token,
//                         "Content-Type": "application/json",
//                     },
//                 }
//             );

//             const data = response.data;

//             if (data.success && data.data && Array.isArray(data.data)) {
//                 // Find the permission object for this role
//                 const rolePermission = data.data.find(
//                     (perm: any) =>
//                         perm.roleId &&
//                         (typeof perm.roleId === "string"
//                             ? perm.roleId === roleId
//                             : perm.roleId._id === roleId)
//                 );

//                 if (rolePermission && Array.isArray(rolePermission.pages)) {
//                     // Convert API response to our PermissionState format
//                     const permState: PermissionState = {};

//                     rolePermission.pages.forEach((page: any) => {
//                         permState[page.name] = {
//                             View: page.read,
//                             Add: page.create,
//                             Edit: page.update,
//                             Delete: page.delete,
//                         };
//                     });

//                     toast.success("Permissions loaded successfully");

//                     return {
//                         roleId,
//                         permState,
//                         permissionExists: true,
//                         permissionId: rolePermission._id || "",
//                     };
//                 } else {
//                     // No permissions found for this role
//                     // Initialize with default permissions (all unchecked)
//                     const permState: PermissionState = {};
//                     const permissions = [
//                         "Dashboard",
//                         "Role and Policies",
//                         "User Management",
//                         "Core Setting",
//                         "Store Management",
//                         "Suppliers",
//                         "Inventory",
//                         "Live Inventory",
//                         "Live Trade-In Inventory",
//                         "Ledger",
//                         "Tax Management",
//                         "Customer",
//                         "Expense",
//                         "Cash Flow",
//                         "Communication",
//                         "Reminders",
//                         "Report & Ananlytics",
//                         "System Setting",
//                     ];

//                     permissions.forEach((perm) => {
//                         permState[perm] = {
//                             View: false,
//                             Add: false,
//                             Edit: false,
//                             Delete: false,
//                         };
//                     });

//                     toast.info("No permissions found for this role. You can create new ones.");

//                     return {
//                         roleId,
//                         permState,
//                         permissionExists: false,
//                         permissionId: "",
//                     };
//                 }
//             } else {
//                 toast.warning("Invalid permission data format");
//                 return rejectWithValue("Invalid permission data format");
//             }
//         } catch (error) {
//             console.error("Error fetching permissions:", error);

//             if (axios.isAxiosError(error)) {
//                 if (error.response) {
//                     const status = error.response.status;
//                     const errorData = error.response.data;

//                     switch (status) {
//                         case 401:
//                             toast.error("Session expired. Please login again.");
//                             break;
//                         case 403:
//                             toast.error("You don't have permission to access these permissions.");
//                             break;
//                         case 404:
//                             toast.error("Permissions not found for this role.");
//                             break;
//                         default:
//                             toast.error(errorData.message || "Failed to fetch permissions");
//                     }
//                 } else {
//                     toast.error("Network error. Please check your internet connection.");
//                 }
//             } else {
//                 toast.error("An unexpected error occurred while fetching permissions");
//             }

//             return rejectWithValue("Failed to fetch permissions");
//         }
//     }
// );

// // Async thunk for saving or updating permissions
// export const saveOrUpdatePermissions = createAsyncThunk(
//     'permissions/saveOrUpdatePermissions',
//     async ({
//         roleId,
//         permState,
//         permissionExists,
//         permissionId
//     }: {
//         roleId: string;
//         permState: PermissionState;
//         permissionExists: boolean;
//         permissionId: string;
//     }, { dispatch, rejectWithValue }) => {
//         try {
//             const API_URL = import.meta.env.VITE_BASE_URL || "http://localhost:9000";
//             const token = getAuthToken();

//             if (!token) {
//                 toast.error("Authentication token not found. Please login again.");
//                 return rejectWithValue("Authentication token not found");
//             }

//             // Convert our PermissionState to the API expected format
//             const pages = Object.keys(permState).map((perm) => ({
//                 name: perm,
//                 create: permState[perm]?.Add || false,
//                 read: permState[perm]?.View || false,
//                 update: permState[perm]?.Edit || false,
//                 delete: permState[perm]?.Delete || false,
//             }));

//             // Prepare request payload
//             const payload = {
//                 allPagesAccess: false,
//                 allPermissions: false,
//                 pages: pages,
//             };

//             let response;

//             if (permissionExists && permissionId) {
//                 // Update existing permissions using PUT
//                 response = await axios.put(
//                     `${API_URL}/api/abid-jewelry-ms/permission/${permissionId}`,
//                     payload,
//                     {
//                         headers: {
//                             "x-access-token": token,
//                             "Content-Type": "application/json",
//                         },
//                     }
//                 );
//             } else {
//                 // Create new permissions using POST
//                 response = await axios.post(
//                     `${API_URL}/api/abid-jewelry-ms/permission`,
//                     {
//                         roleId: roleId,
//                         ...payload,
//                     },
//                     {
//                         headers: {
//                             "x-access-token": token,
//                             "Content-Type": "application/json",
//                         },
//                     }
//                 );
//             }

//             const data = response.data;

//             if (data.success) {
//                 toast.success(
//                     permissionExists
//                         ? "Permissions updated successfully"
//                         : "Permissions created successfully"
//                 );

//                 // Return the updated data
//                 return {
//                     roleId,
//                     permState,
//                     permissionExists: true,
//                     permissionId: data.permission?._id || permissionId,
//                 };
//             } else {
//                 toast.error(
//                     data.message ||
//                     `Failed to ${permissionExists ? "update" : "create"} permissions`
//                 );
//                 return rejectWithValue(data.message || "Failed to save permissions");
//             }
//         } catch (error) {
//             console.error("Error saving permissions:", error);

//             if (axios.isAxiosError(error)) {
//                 if (error.response) {
//                     const status = error.response.status;
//                     const errorData = error.response.data;

//                     // Handle the "permissions already exist" error
//                     if (status === 400 && errorData.message && errorData.message.includes("already exist")) {
//                         toast.info("Permissions already exist for this role. Fetching existing permissions...");

//                         // Fetch the existing permissions to get the permission ID
//                         dispatch(fetchPermissions(roleId));

//                         return rejectWithValue("PERMISSIONS_ALREADY_EXIST");
//                     }

//                     toast.error(errorData.message || "Failed to save permissions");
//                     return rejectWithValue(errorData.message || "Failed to save permissions");
//                 } else {
//                     toast.error("Network error. Please check your internet connection.");
//                     return rejectWithValue("Network error");
//                 }
//             }

//             toast.error("An unexpected error occurred while saving permissions");
//             return rejectWithValue("An unexpected error occurred");
//         }
//     }
// );

// // Create the permissions slice
// const permissionSlice = createSlice({
//     name: 'permissions',
//     initialState,
//     reducers: {
//         updatePermissionState: (state, action: PayloadAction<{
//             roleId: string;
//             permission: string;
//             action: "View" | "Add" | "Edit" | "Delete";
//             value: boolean;
//         }>) => {
//             const { roleId, permission, action: actionType, value } = action.payload;

//             // Ensure the role exists in the state
//             if (!state.byRoleId[roleId]) {
//                 state.byRoleId[roleId] = {
//                     permState: {},
//                     permissionExists: false,
//                     permissionId: "",
//                     loading: false,
//                     error: null
//                 };
//             }

//             // Ensure the permission exists in the state
//             if (!state.byRoleId[roleId].permState[permission]) {
//                 state.byRoleId[roleId].permState[permission] = {};
//             }

//             // Update the permission value
//             state.byRoleId[roleId].permState[permission][actionType] = value;

//             // Persist the updated permissions
//             persistPermissions(state.byRoleId);
//         },
//         resetPermissionState: (state, action: PayloadAction<string>) => {
//             const roleId = action.payload;

//             if (state.byRoleId[roleId]) {
//                 const permissions = [
//                     "Dashboard",
//                     "Role and Policies",
//                     "User Management",
//                     "Core Setting",
//                     "Store Management",
//                     "Suppliers",
//                     "Inventory",
//                     "Live Inventory",
//                     "Live Trade-In Inventory",
//                     "Ledger",
//                     "Tax Management",
//                     "Customer",
//                     "Expense",
//                     "Cash Flow",
//                     "Communication",
//                     "Reminders",
//                     "Reports & Analytics",
//                     "System Setting",
//                 ];

//                 const resetState: PermissionState = {};

//                 permissions.forEach(perm => {
//                     resetState[perm] = {
//                         View: false,
//                         Add: false,
//                         Edit: false,
//                         Delete: false
//                     };
//                 });

//                 state.byRoleId[roleId].permState = resetState;

//                 // Persist the updated permissions
//                 persistPermissions(state.byRoleId);
//             }
//         },
//         clearPersistedPermissions: (state) => {
//             localStorage.removeItem('persistedPermissions');
//             state.byRoleId = {};
//         }
//     },
//     extraReducers: (builder) => {
//         builder
//             .addCase(fetchPermissions.pending, (state) => {
//                 state.loading = true;
//                 state.error = null;
//             })
//             .addCase(fetchPermissions.fulfilled, (state, action) => {
//                 state.loading = false;
//                 const { roleId, permState, permissionExists, permissionId } = action.payload;

//                 state.byRoleId[roleId] = {
//                     permState,
//                     permissionExists,
//                     permissionId,
//                     loading: false,
//                     error: null
//                 };

//                 // Persist the updated permissions
//                 persistPermissions(state.byRoleId);
//             })
//             .addCase(fetchPermissions.rejected, (state, action) => {
//                 state.loading = false;
//                 state.error = action.payload as string;
//             })
//             .addCase(saveOrUpdatePermissions.pending, (state, action) => {
//                 const { roleId } = action.meta.arg;

//                 if (!state.byRoleId[roleId]) {
//                     state.byRoleId[roleId] = {
//                         permState: {},
//                         permissionExists: false,
//                         permissionId: "",
//                         loading: true,
//                         error: null
//                     };
//                 } else {
//                     state.byRoleId[roleId].loading = true;
//                     state.byRoleId[roleId].error = null;
//                 }
//             })
//             .addCase(saveOrUpdatePermissions.fulfilled, (state, action) => {
//                 const { roleId, permState, permissionExists, permissionId } = action.payload;

//                 state.byRoleId[roleId] = {
//                     permState,
//                     permissionExists,
//                     permissionId,
//                     loading: false,
//                     error: null
//                 };

//                 // Persist the updated permissions
//                 persistPermissions(state.byRoleId);
//             })

//             // .addCase(saveOrUpdatePermissions.fulfilled, (state, action) => {
//             //     const { roleId, permState, permissionExists, permissionId } = action.payload;

//             //     state.byRoleId[roleId] = {
//             //         permState,
//             //         permissionExists,
//             //         permissionId,
//             //         loading: false,
//             //         error: null
//             //     };

//             //     // Update user permissions in browser storage if it's their role
//             //     updateUserPermissions(roleId, permState);

//             //     // Persist the updated permissions
//             //     persistPermissions(state.byRoleId);
//             // })


//             .addCase(saveOrUpdatePermissions.rejected, (state, action) => {
//                 const { roleId } = action.meta.arg;

//                 // Don't update state for "permissions already exist" error since we'll fetch the existing permissions
//                 if (action.payload !== "PERMISSIONS_ALREADY_EXIST" && state.byRoleId[roleId]) {
//                     state.byRoleId[roleId].loading = false;
//                     state.byRoleId[roleId].error = action.payload as string;
//                 }
//             });
//     }
// });

// export const { updatePermissionState, resetPermissionState, clearPersistedPermissions } = permissionSlice.actions;

// // Selectors
// export const selectPermissionsByRoleId = (state: RootState, roleId: string) =>
//     state.permissions.byRoleId[roleId] || {
//         permState: {},
//         permissionExists: false,
//         permissionId: "",
//         loading: false,
//         error: null
//     };


// export const selectPermissionsLoading = (state: RootState) => state.permissions.loading;

// export default permissionSlice.reducer;



import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from '../store';
import { toast } from 'react-toastify';

// Define types for permission state
export interface PermissionState {
    [permission: string]: {
        View?: boolean;
        Add?: boolean;
        Edit?: boolean;
        Delete?: boolean;
    };
}

interface PermissionsData {
    permState: PermissionState;
    permissionExists: boolean;
    permissionId: string;
    loading: boolean;
    error: string | null;
}

interface PermissionsState {
    byRoleId: Record<string, PermissionsData>;
    loading: boolean;
    error: string | null;
}

// Helper function to load persisted permissions from localStorage
const loadPersistedPermissions = (): Record<string, PermissionsData> => {
    try {
        const persistedPermissions = localStorage.getItem('persistedPermissions');
        return persistedPermissions ? JSON.parse(persistedPermissions) : {};
    } catch (error) {
        console.error('Failed to load persisted permissions:', error);
        return {};
    }
};

const initialState: PermissionsState = {
    byRoleId: loadPersistedPermissions(),
    loading: false,
    error: null
};

// Helper function to persist permissions to localStorage
const persistPermissions = (byRoleId: Record<string, PermissionsData>) => {
    try {
        localStorage.setItem('persistedPermissions', JSON.stringify(byRoleId));
    } catch (error) {
        console.error('Failed to persist permissions:', error);
    }
};

// Helper function to get auth token
const getAuthToken = () => {
    let token = localStorage.getItem("token");
    if (!token) {
        token = sessionStorage.getItem("token");
    }
    return token;
};

// Helper function to get permissions
const getPermissions = () => {
    let permissions = localStorage.getItem("permissions");
    if (!permissions) {
        permissions = sessionStorage.getItem("permissions");
    }
    return permissions;
};

const updateUserPermissions = (roleId: string, permState: PermissionState) => {
    try {
        // Get current user's role ID from storage
        const currentUserRoleId = localStorage.getItem("userRoleId") || sessionStorage.getItem("userRoleId");

        // If the updated role matches current user's role, update their permissions in storage
        if (currentUserRoleId === roleId) {
            // Convert permState to the format stored in localStorage/sessionStorage
            const pages = Object.keys(permState).map((perm) => ({
                name: perm,
                create: permState[perm]?.Add || false,
                read: permState[perm]?.View || false,
                update: permState[perm]?.Edit || false,
                delete: permState[perm]?.Delete || false,
            }));

            const updatedPermissions = {
                allPagesAccess: false,
                allPermissions: false,
                pages: pages,
            };

            // Update both localStorage and sessionStorage
            const permissionsStr = JSON.stringify(updatedPermissions);
            if (localStorage.getItem("permissions")) {
                localStorage.setItem("permissions", permissionsStr);
            }
            if (sessionStorage.getItem("permissions")) {
                sessionStorage.setItem("permissions", permissionsStr);
            }
        }
    } catch (error) {
        console.error("Error updating user permissions in storage:", error);
    }
};

// Async thunk for fetching permissions for a role
export const fetchPermissions = createAsyncThunk(
    'permissions/fetchPermissions',
    async (roleId: string, { getState, rejectWithValue }) => {
        try {
            // Check if we already have permissions data for this role in the store
            const state = getState() as RootState;
            const existingPermissions = state?.permissions?.byRoleId[roleId];

            // If we already have valid permissions data, return it without making an API call
            if (existingPermissions &&
                existingPermissions.permState &&
                Object.keys(existingPermissions.permState).length > 0 &&
                !existingPermissions.loading) { // Add loading check
                return {
                    roleId,
                    permState: existingPermissions.permState,
                    permissionExists: existingPermissions.permissionExists,
                    permissionId: existingPermissions.permissionId,
                };
            }

            // If already loading for this role, reject to prevent duplicate calls
            if (existingPermissions?.loading) {
                return rejectWithValue("Already fetching permissions for this role");
            }

            const API_URL = import.meta.env.VITE_BASE_URL || "http://localhost:9000";
            const token = getAuthToken();

            if (!token) {
                // toast.error("Authentication token not found. Please login again.");
                return rejectWithValue("Authentication token not found");
            }

            const response = await axios.get(
                `${API_URL}/api/abid-jewelry-ms/permission?roleId=${roleId}`,
                {
                    headers: {
                        "x-access-token": token,
                        "Content-Type": "application/json",
                    },
                }
            );

            const data = response.data;

            if (data.success && data.data && Array.isArray(data.data)) {
                // Find the permission object for this role
                const rolePermission = data.data.find(
                    (perm: any) =>
                        perm.roleId &&
                        (typeof perm.roleId === "string"
                            ? perm.roleId === roleId
                            : perm.roleId._id === roleId)
                );

                if (rolePermission && Array.isArray(rolePermission.pages)) {
                    // Convert API response to our PermissionState format
                    const permState: PermissionState = {};

                    rolePermission.pages.forEach((page: any) => {
                        permState[page.name] = {
                            View: page.read,
                            Add: page.create,
                            Edit: page.update,
                            Delete: page.delete,
                        };
                    });

                    toast.success("Permissions loaded successfully");

                    return {
                        roleId,
                        permState,
                        permissionExists: true,
                        permissionId: rolePermission._id || "",
                    };
                } else {
                    // No permissions found for this role
                    // Initialize with default permissions (all unchecked)
                    const permState: PermissionState = {};
                    const permissions = [
                        "Dashboard",
                        "Role and Policies",
                        "User Management",
                        "Core Setting",
                        "Store Management",
                        "Suppliers",
                        "Inventory",
                        "Live Inventory",
                        "Live Trade-In Inventory",
                        "Ledger",
                        "Tax Management",
                        "Customer",
                        "Expense",
                        "Cash Flow",
                        "Communication",
                        "Reminders",
                        "Report & Ananlytics",
                        "System Setting",
                    ];

                    permissions.forEach((perm) => {
                        permState[perm] = {
                            View: false,
                            Add: false,
                            Edit: false,
                            Delete: false,
                        };
                    });

                    toast.info("No permissions found for this role. You can create new ones.");

                    return {
                        roleId,
                        permState,
                        permissionExists: false,
                        permissionId: "",
                    };
                }
            } else {
                toast.warning("Invalid permission data format");
                return rejectWithValue("Invalid permission data format");
            }
        } catch (error) {
            console.error("Error fetching permissions:", error);

            if (axios.isAxiosError(error)) {
                if (error.response) {
                    const status = error.response.status;
                    const errorData = error.response.data;

                    switch (status) {
                        case 401:
                            toast.error("Session expired. Please login again.");
                            break;
                        case 403:
                            toast.error("You don't have permission to access these permissions.");
                            break;
                        case 404:
                            toast.error("Permissions not found for this role.");
                            break;
                        default:
                            toast.error(errorData.message || "Failed to fetch permissions");
                    }
                } else {
                    toast.error("Network error. Please check your internet connection.");
                }
            } else {
                toast.error("An unexpected error occurred while fetching permissions");
            }

            return rejectWithValue("Failed to fetch permissions");
        }
    }
);

// Async thunk for saving or updating permissions
export const saveOrUpdatePermissions = createAsyncThunk(
    'permissions/saveOrUpdatePermissions',
    async ({
        roleId,
        permState,
        permissionExists,
        permissionId
    }: {
        roleId: string;
        permState: PermissionState;
        permissionExists: boolean;
        permissionId: string;
    }, { dispatch, rejectWithValue }) => {
        try {
            const API_URL = import.meta.env.VITE_BASE_URL || "http://localhost:9000";
            const token = getAuthToken();

            if (!token) {
                toast.error("Authentication token not found. Please login again.");
                return rejectWithValue("Authentication token not found");
            }

            // Convert our PermissionState to the API expected format
            const pages = Object.keys(permState).map((perm) => ({
                name: perm,
                create: permState[perm]?.Add || false,
                read: permState[perm]?.View || false,
                update: permState[perm]?.Edit || false,
                delete: permState[perm]?.Delete || false,
            }));

            // Prepare request payload
            const payload = {
                allPagesAccess: false,
                allPermissions: false,
                pages: pages,
            };

            let response;

            if (permissionExists && permissionId) {
                // Update existing permissions using PUT
                response = await axios.put(
                    `${API_URL}/api/abid-jewelry-ms/permission/${permissionId}`,
                    payload,
                    {
                        headers: {
                            "x-access-token": token,
                            "Content-Type": "application/json",
                        },
                    }
                );
            } else {
                // Create new permissions using POST
                response = await axios.post(
                    `${API_URL}/api/abid-jewelry-ms/permission`,
                    {
                        roleId: roleId,
                        ...payload,
                    },
                    {
                        headers: {
                            "x-access-token": token,
                            "Content-Type": "application/json",
                        },
                    }
                );
            }

            const data = response.data;

            if (data.success) {
                toast.success(
                    permissionExists
                        ? "Permissions updated successfully"
                        : "Permissions created successfully"
                );

                // Return the updated data
                return {
                    roleId,
                    permState,
                    permissionExists: true,
                    permissionId: data.permission?._id || permissionId,
                };
            } else {
                toast.error(
                    data.message ||
                    `Failed to ${permissionExists ? "update" : "create"} permissions`
                );
                return rejectWithValue(data.message || "Failed to save permissions");
            }
        } catch (error) {
            console.error("Error saving permissions:", error);

            if (axios.isAxiosError(error)) {
                if (error.response) {
                    const status = error.response.status;
                    const errorData = error.response.data;

                    // Handle the "permissions already exist" error
                    if (status === 400 && errorData.message && errorData.message.includes("already exist")) {
                        toast.info("Permissions already exist for this role. Fetching existing permissions...");

                        // Fetch the existing permissions to get the permission ID
                        dispatch(fetchPermissions(roleId));

                        return rejectWithValue("PERMISSIONS_ALREADY_EXIST");
                    }

                    toast.error(errorData.message || "Failed to save permissions");
                    return rejectWithValue(errorData.message || "Failed to save permissions");
                } else {
                    toast.error("Network error. Please check your internet connection.");
                    return rejectWithValue("Network error");
                }
            }

            toast.error("An unexpected error occurred while saving permissions");
            return rejectWithValue("An unexpected error occurred");
        }
    }
);

// Create the permissions slice
const permissionSlice = createSlice({
    name: 'permissions',
    initialState,
    reducers: {
        updatePermissionState: (state, action: PayloadAction<{
            roleId: string;
            permission: string;
            action: "View" | "Add" | "Edit" | "Delete";
            value: boolean;
        }>) => {
            const { roleId, permission, action: actionType, value } = action.payload;

            // Ensure the role exists in the state
            if (!state.byRoleId[roleId]) {
                state.byRoleId[roleId] = {
                    permState: {},
                    permissionExists: false,
                    permissionId: "",
                    loading: false,
                    error: null
                };
            }

            // Ensure the permission exists in the state
            if (!state.byRoleId[roleId].permState[permission]) {
                state.byRoleId[roleId].permState[permission] = {};
            }

            // Update the permission value
            state.byRoleId[roleId].permState[permission][actionType] = value;

            // Persist the updated permissions
            persistPermissions(state.byRoleId);
        },
        resetPermissionState: (state, action: PayloadAction<string>) => {
            const roleId = action.payload;

            if (state.byRoleId[roleId]) {
                const permissions = [
                    "Dashboard",
                    "Role and Policies",
                    "User Management",
                    "Core Setting",
                    "Store Management",
                    "Suppliers",
                    "Inventory",
                    "Live Inventory",
                    "Live Trade-In Inventory",
                    "Ledger",
                    "Tax Management",
                    "Customer",
                    "Expense",
                    "Cash Flow",
                    "Communication",
                    "Reminders",
                    "Reports & Analytics",
                    "System Setting",
                ];

                const resetState: PermissionState = {};

                permissions.forEach(perm => {
                    resetState[perm] = {
                        View: false,
                        Add: false,
                        Edit: false,
                        Delete: false
                    };
                });

                state.byRoleId[roleId].permState = resetState;

                // Persist the updated permissions
                persistPermissions(state.byRoleId);
            }
        },
        clearPersistedPermissions: (state) => {
            localStorage.removeItem('persistedPermissions');
            state.byRoleId = {};
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchPermissions.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPermissions.fulfilled, (state, action) => {
                state.loading = false;
                const { roleId, permState, permissionExists, permissionId } = action.payload;

                state.byRoleId[roleId] = {
                    permState,
                    permissionExists,
                    permissionId,
                    loading: false,
                    error: null
                };

                // Persist the updated permissions
                persistPermissions(state.byRoleId);
            })
            .addCase(fetchPermissions.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(saveOrUpdatePermissions.pending, (state, action) => {
                const { roleId } = action.meta.arg;

                if (!state.byRoleId[roleId]) {
                    state.byRoleId[roleId] = {
                        permState: {},
                        permissionExists: false,
                        permissionId: "",
                        loading: true,
                        error: null
                    };
                } else {
                    state.byRoleId[roleId].loading = true;
                    state.byRoleId[roleId].error = null;
                }
            })
            .addCase(saveOrUpdatePermissions.fulfilled, (state, action) => {
                const { roleId, permState, permissionExists, permissionId } = action.payload;

                state.byRoleId[roleId] = {
                    permState,
                    permissionExists,
                    permissionId,
                    loading: false,
                    error: null
                };

                // Persist the updated permissions
                persistPermissions(state.byRoleId);
            })

            // .addCase(saveOrUpdatePermissions.fulfilled, (state, action) => {
            //     const { roleId, permState, permissionExists, permissionId } = action.payload;

            //     state.byRoleId[roleId] = {
            //         permState,
            //         permissionExists,
            //         permissionId,
            //         loading: false,
            //         error: null
            //     };

            //     // Update user permissions in browser storage if it's their role
            //     updateUserPermissions(roleId, permState);

            //     // Persist the updated permissions
            //     persistPermissions(state.byRoleId);
            // })


            .addCase(saveOrUpdatePermissions.rejected, (state, action) => {
                const { roleId } = action.meta.arg;

                // Don't update state for "permissions already exist" error since we'll fetch the existing permissions
                if (action.payload !== "PERMISSIONS_ALREADY_EXIST" && state.byRoleId[roleId]) {
                    state.byRoleId[roleId].loading = false;
                    state.byRoleId[roleId].error = action.payload as string;
                }
            });
    }
});

export const { updatePermissionState, resetPermissionState, clearPersistedPermissions } = permissionSlice.actions;

// Selectors
export const selectPermissionsByRoleId = (state: RootState, roleId: string) =>
    state.permissions.byRoleId[roleId] || {
        permState: {},
        permissionExists: false,
        permissionId: "",
        loading: false,
        error: null
    };


export const selectPermissionsLoading = (state: RootState) => state.permissions.loading;

export default permissionSlice.reducer;