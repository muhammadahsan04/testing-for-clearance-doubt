import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from '../store';
import { toast } from 'react-toastify';

// Define the role interface
export interface Role {
    name: string;
    icon?: React.ReactNode;
    _id?: string;
    description?: string;
    roleImage?: string;
}

interface RolesState {
    items: Role[];
    selectedRoleId: string;
    selectedRoleName: string;
    loading: {
        fetchAll: boolean;
        fetchOne: boolean;
        save: boolean;
        delete: boolean;
    };
    error: string | null;
}

const initialState: RolesState = {
    items: [],
    selectedRoleId: '',
    selectedRoleName: '',
    loading: {
        fetchAll: false,
        fetchOne: false,
        save: false,
        delete: false,
    },
    error: null,
};

// Helper function to get auth token
const getAuthToken = () => {
    let token = localStorage.getItem("token");
    if (!token) {
        token = sessionStorage.getItem("token");
    }
    return token;
};

// Async thunk for fetching all roles
export const fetchRoles = createAsyncThunk(
    'roles/fetchRoles',
    async (_, { rejectWithValue }) => {
        try {
            const API_URL = import.meta.env.VITE_BASE_URL || "http://localhost:9000";
            const token = getAuthToken();

            if (!token) {
                toast.error("Authentication token not found. Please login again.");
                return rejectWithValue("Authentication token not found");
            }

            const response = await axios.get(`${API_URL}/api/abid-jewelry-ms/roles`, {
                headers: {
                    "x-access-token": token,
                    "Content-Type": "application/json",
                },
            });

            const data = response.data;

            if (data.success && Array.isArray(data.roles)) {
                return data.roles;
            } else {
                toast.warning("No roles found or invalid response format");
                return rejectWithValue("Invalid response format");
            }
        } catch (error) {
            console.error("Error fetching roles:", error);

            if (axios.isAxiosError(error)) {
                if (!error.response) {
                    toast.error("Network error. Please check your internet connection.");
                } else {
                    const status = error.response.status;
                    const errorData = error.response.data;

                    switch (status) {
                        case 400:
                            toast.error(`Bad request: ${errorData.message || "Invalid request"}`);
                            break;
                        case 401:
                            toast.error("Session expired. Please login again.");
                            break;
                        case 403:
                            toast.error("You don't have permission to access this resource.");
                            break;
                        case 404:
                            toast.error("Roles endpoint not found.");
                            break;
                        case 500:
                            toast.error("Server error. Please try again later.");
                            break;
                        default:
                            toast.error(errorData.message || "Failed to fetch roles");
                    }
                }
            } else {
                toast.error("An unexpected error occurred while fetching roles");
            }

            return rejectWithValue("Failed to fetch roles");
        }
    }
);

// Async thunk for fetching a single role by ID
export const fetchRoleById = createAsyncThunk(
    'roles/fetchRoleById',
    async (roleId: string, { rejectWithValue }) => {
        try {
            const API_URL = import.meta.env.VITE_BASE_URL || "http://localhost:9000";
            const token = getAuthToken();

            if (!token) {
                toast.error("Authentication token not found. Please login again.");
                return rejectWithValue("Authentication token not found");
            }

            const response = await axios.get(
                `${API_URL}/api/abid-jewelry-ms/role/${roleId}`,
                {
                    headers: {
                        "x-access-token": token,
                        "Content-Type": "application/json",
                    },
                }
            );

            const data = response.data;

            if (data.success) {
                return data.role;
            } else {
                toast.error(data.message || "Failed to fetch role details");
                return rejectWithValue(data.message || "Failed to fetch role details");
            }
        } catch (error) {
            console.error("Error fetching role details:", error);

            if (axios.isAxiosError(error)) {
                if (!error.response) {
                    toast.error("Network error. Please check your internet connection.");
                } else {
                    const status = error.response.status;
                    const errorData = error.response.data;

                    switch (status) {
                        case 400:
                            toast.error(`Bad request: ${errorData.message || "Invalid role ID"}`);
                            break;
                        case 401:
                            toast.error("Session expired. Please login again.");
                            break;
                        case 403:
                            toast.error("You don't have permission to access this role.");
                            break;
                        case 404:
                            toast.error("Role not found.");
                            break;
                        case 500:
                            toast.error("Server error. Please try again later.");
                            break;
                        default:
                            toast.error(errorData.message || "Failed to fetch role details");
                    }
                }
            } else {
                toast.error("An unexpected error occurred while fetching role details");
            }

            return rejectWithValue("Failed to fetch role details");
        }
    }
);

// Async thunk for creating or updating a role
export const saveRole = createAsyncThunk(
    'roles/saveRole',
    async ({
        formData,
        isEditing,
        roleId
    }: {
        formData: FormData;
        isEditing: boolean;
        roleId?: string;
    }, { rejectWithValue }) => {
        try {
            const API_URL = import.meta.env.VITE_BASE_URL || "http://localhost:9000";
            const token = getAuthToken();

            if (!token) {
                toast.error("Authentication token not found. Please login again.");
                return rejectWithValue("Authentication token not found");
            }

            // Determine if we're creating or updating
            const method = isEditing ? "PUT" : "POST";
            const endpoint = isEditing
                ? `${API_URL}/api/abid-jewelry-ms/role/${roleId}`
                : `${API_URL}/api/abid-jewelry-ms/role`;

            // Using axios with token in headers
            const response = await axios({
                method,
                url: endpoint,
                data: formData,
                headers: {
                    "x-access-token": token,
                    "Content-Type": "multipart/form-data",
                },
            });

            const data = response.data;

            if (data.success) {
                toast.success(
                    data.message ||
                    `Role ${isEditing ? "updated" : "created"} successfully`
                );

                return {
                    role: data.role,
                    isEditing
                };
            } else {
                toast.error(
                    data.message || `Failed to ${isEditing ? "update" : "create"} role`
                );
                return rejectWithValue(data.message || "Failed to save role");
            }
        } catch (error) {
            console.error("Error saving role:", error);

            if (axios.isAxiosError(error)) {
                if (error.response && error.response.data) {
                    toast.error(
                        error.response.data.message ||
                        `Failed to ${isEditing ? "update" : "create"} role`
                    );
                } else {
                    toast.error(`Network error. Please check your internet connection.`);
                }
            } else {
                toast.error(
                    `An unexpected error occurred while ${isEditing ? "updating" : "creating"
                    } the role`
                );
            }

            return rejectWithValue("Failed to save role");
        }
    }
);

// Async thunk for deleting a role
export const deleteRole = createAsyncThunk(
    'roles/deleteRole',
    async (roleId: string, { rejectWithValue }) => {
        try {
            const API_URL = import.meta.env.VITE_BASE_URL || "http://localhost:9000";
            const token = getAuthToken();

            if (!token) {
                toast.error("Authentication token not found. Please login again.");
                return rejectWithValue("Authentication token not found");
            }

            const response = await axios.delete(
                `${API_URL}/api/abid-jewelry-ms/role/${roleId}`,
                {
                    headers: {
                        "x-access-token": token,
                        "Content-Type": "application/json",
                    },
                }
            );

            const data = response.data;

            if (data.success) {
                toast.success(data.message || "Role deleted successfully");
                return roleId;
            } else {
                toast.error(data.message || "Failed to delete role");
                return rejectWithValue(data.message || "Failed to delete role");
            }
        } catch (error) {
            console.error("Error deleting role:", error);

            if (axios.isAxiosError(error)) {
                if (!error.response) {
                    toast.error("Network error. Please check your internet connection.");
                } else {
                    const status = error.response.status;
                    const errorData = error.response.data;

                    switch (status) {
                        case 400:
                            toast.error(`Bad request: ${errorData.message || "Invalid role ID"}`);
                            break;
                        case 401:
                            toast.error("Session expired. Please login again.");
                            break;
                        case 403:
                            toast.error("You don't have permission to delete roles.");
                            break;
                        case 404:
                            toast.error("Role not found or already deleted.");
                            break;
                        case 500:
                            toast.error("Server error. Please try again later.");
                            break;
                        default:
                            toast.error(errorData.message || "Failed to delete role");
                    }
                }
            } else {
                toast.error("An unexpected error occurred while deleting the role");
            }

            return rejectWithValue("Failed to delete role");
        }
    }
);

// Create the roles slice
const roleSlice = createSlice({
    name: 'roles',
    initialState,
    reducers: {
        setSelectedRole: (state, action: PayloadAction<{ id: string; name: string }>) => {
            state.selectedRoleId = action.payload.id;
            state.selectedRoleName = action.payload.name;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchRoles.pending, (state) => {
                state.loading.fetchAll = true;
                state.error = null;
            })
            .addCase(fetchRoles.fulfilled, (state, action) => {
                state.loading.fetchAll = false;
                state.items = action.payload;

                // If we have roles but no selected role, select the first one
                if (state.items.length > 0 && !state.selectedRoleId) {
                    state.selectedRoleId = state.items[0]._id || '';
                    state.selectedRoleName = state.items[0].name;
                }
            })
            .addCase(fetchRoles.rejected, (state, action) => {
                state.loading.fetchAll = false;
                state.error = action.payload as string;
            })
            .addCase(fetchRoleById.pending, (state) => {
                state.loading.fetchOne = true;
                state.error = null;
            })
            .addCase(fetchRoleById.fulfilled, (state, action) => {
                state.loading.fetchOne = false;

                // Update the role in the items array
                const index = state.items.findIndex(role => role._id === action.payload._id);
                if (index !== -1) {
                    state.items[index] = action.payload;
                } else {
                    state.items.push(action.payload);
                }
            })
            .addCase(fetchRoleById.rejected, (state, action) => {
                state.loading.fetchOne = false;
                state.error = action.payload as string;
            })
            .addCase(saveRole.pending, (state) => {
                state.loading.save = true;
                state.error = null;
            })
            .addCase(saveRole.fulfilled, (state, action) => {
                state.loading.save = false;

                if (action.payload.isEditing) {
                    // Update existing role
                    const index = state.items.findIndex(role => role._id === action.payload.role._id);
                    if (index !== -1) {
                        state.items[index] = action.payload.role;
                    }
                } else {
                    // Add new role
                    state.items.push(action.payload.role);

                    // Select the newly created role
                    state.selectedRoleId = action.payload.role._id || '';
                    state.selectedRoleName = action.payload.role.name;
                }
            })
            .addCase(saveRole.rejected, (state, action) => {
                state.loading.save = false;
                state.error = action.payload as string;
            })
            .addCase(deleteRole.pending, (state) => {
                state.loading.delete = true;
                state.error = null;
            })
            .addCase(deleteRole.fulfilled, (state, action) => {
                state.loading.delete = false;

                // Remove the deleted role
                state.items = state.items.filter(role => role._id !== action.payload);

                // If the deleted role was selected, select another role
                if (state.selectedRoleId === action.payload) {
                    if (state.items.length > 0) {
                        state.selectedRoleId = state.items[0]._id || '';
                        state.selectedRoleName = state.items[0].name;
                    } else {
                        state.selectedRoleId = '';
                        state.selectedRoleName = '';
                    }
                }
            })
            .addCase(deleteRole.rejected, (state, action) => {
                state.loading.delete = false;
                state.error = action.payload as string;
            });
    }
});

export const { setSelectedRole } = roleSlice.actions;

// Selectors
export const selectAllRoles = (state: RootState) => state.roles.items;
export const selectSelectedRoleId = (state: RootState) => state.roles.selectedRoleId;
export const selectSelectedRoleName = (state: RootState) => state.roles.selectedRoleName;
export const selectRolesLoading = (state: RootState) => state.roles.loading.fetchAll;
export const selectRolesLoadingAll = (state: RootState) => state.roles.loading.fetchAll;
export const selectRoleLoadingOne = (state: RootState) => state.roles.loading.fetchOne;
export const selectRoleSaving = (state: RootState) => state.roles.loading.save;
export const selectRoleDeleting = (state: RootState) => state.roles.loading.delete;

export default roleSlice.reducer;

