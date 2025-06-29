import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from '../store';
import { toast } from 'react-toastify';


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
 else {
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