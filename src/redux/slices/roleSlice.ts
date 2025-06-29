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

