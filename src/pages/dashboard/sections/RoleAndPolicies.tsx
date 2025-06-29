import Button from "../../../components/Button";
import type React from "react";
import { useState, useEffect, useRef } from "react";
import { FaSave } from "react-icons/fa";
import { RiEditLine } from "react-icons/ri";
import { PiArrowCounterClockwiseBold } from "react-icons/pi";
import CrownIcon from "../../../assets/crown.svg";
import defaultPicture from "../../../assets/defaultPicture.jpg";
import briefCase from "../../../assets/briefcase.svg";
import deliveryPerson from "../../../assets/deliveryPerson.svg";
import entryPerson from "../../../assets/entryPerson.svg";
import UploadPicture from "../../../components/UploadPicture";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import {
  fetchRoles,
  selectAllRoles,
  selectRolesLoading,
  selectSelectedRoleId,
  selectSelectedRoleName,
  setSelectedRole,
  fetchRoleById,
  deleteRole as deleteRoleAction,
} from "../../../redux/slices/roleSlice";
import {
  fetchPermissions,
  saveOrUpdatePermissions,
  selectPermissionsByRoleId,
  selectPermissionsLoading,
  updatePermissionState,
  resetPermissionState,
} from "../../../redux/slices/permissionSlice";
import { useNavigate } from "react-router-dom";
import { AiOutlineDelete } from "react-icons/ai";
import { MdSelectAll } from "react-icons/md";

// Define the permission actions
const permissionActions = ["View", "Add", "Edit", "Delete"] as const;
type PermissionAction = (typeof permissionActions)[number];

export const hasPermission = (module: string, action: string) => {
  try {
    // Always get fresh permissions from storage
    let permissionsStr = localStorage.getItem("permissions");
    if (!permissionsStr) {
      permissionsStr = sessionStorage.getItem("permissions");
    }

    if (!permissionsStr) return false;

    const permissions = JSON.parse(permissionsStr);

    // Check if user has all permissions
    if (permissions.allPermissions || permissions.allPagesAccess) return true;

    const page = permissions.pages?.find((p: any) => p.name === module);
    if (!page) return false;

    switch (action.toLowerCase()) {
      case "create":
        return page.create;
      case "read":
        return page.read;
      case "update":
        return page.update;
      case "delete":
        return page.delete;
      default:
        return false;
    }
  } catch (error) {
    console.error("Error checking permissions:", error);
    return false;
  }
};

const permissions: string[] = [
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

// Helper function to get user role
const getUserRole = () => {
  let role = localStorage.getItem("role");
  if (!role) {
    role = sessionStorage.getItem("role");
  }
  return role;
};

const RolePermissionUI: React.FC = () => {
  // Redux hooks
  const dispatch = useAppDispatch();
  const roles = useAppSelector(selectAllRoles);
  // console.log("roles", roles);

  const selectedRoleId = useAppSelector(selectSelectedRoleId);
  const selectedRoleName = useAppSelector(selectSelectedRoleName);
  const rolesLoading = useAppSelector(selectRolesLoading);
  const permissionsData = useAppSelector((state) =>
    selectedRoleId
      ? selectPermissionsByRoleId(state, selectedRoleId)
      : undefined
  );
  const permissionsLoading = useAppSelector(selectPermissionsLoading);
  const permissionsByRoleId = useAppSelector(
    (state) => state.permissions.byRoleId
  );

  // Check if user has permission to access this page
  const navigate = useNavigate();
  const [hasAccess, setHasAccess] = useState(false);

  // Local state
  const [showModal, setShowModal] = useState(false);
  const [roleName, setRoleName] = useState("");
  const [roleDescription, setRoleDescription] = useState("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [roleImageUrl, setRoleImageUrl] = useState("");
  const [allSelected, setAllSelected] = useState(false);
  const [editingRoleId, setEditingRoleId] = useState<string>("");

  // Loading states for better UX
  const [isSavingPermissions, setIsSavingPermissions] = useState(false);
  const [isSelectingAll, setIsSelectingAll] = useState(false);

  //For deleting role
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteRole, setDeleteRole] = useState<any>(null);
  const [deleteModal, setDeleteModal] = useState(false);

  // Permission variables add
  const userRole = getUserRole();
  const isAdmin = userRole === "Admin" || userRole === "SuperAdmin";
  const canCreate = isAdmin || hasPermission("Role and Policies", "create");
  const canUpdate = isAdmin || hasPermission("Role and Policies", "update");
  const canDelete = isAdmin || hasPermission("Role and Policies", "delete");

  const API_URL = import.meta.env.VITE_BASE_URL || "http://localhost:9000";

  // Add this ref near the top with other refs
  const fetchingPermissionsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    // Check permissions on component mount
    const userRole = getUserRole();
    const isAdmin = userRole === "Admin" || userRole === "SuperAdmin";

    if (!isAdmin && !hasPermission("Role and Policies", "read")) {
      toast.error("You don't have permission to access role and policies");
      navigate("/dashboard");
      return;
    }
  }, [navigate]);

  // Add this useEffect to store current user's role ID
  useEffect(() => {
    // Store current user's role ID for permission updates
    const storeUserRoleId = async () => {
      try {
        const token = getAuthToken();
        if (!token) return;

        // Get current user's role ID from storage instead of selectedRoleId
        const currentUserRole = getUserRole();

        // Only store if we have a valid role and it's different from what's stored
        if (currentUserRole) {
          const storedRoleId =
            localStorage.getItem("userRoleId") ||
            sessionStorage.getItem("userRoleId");

          // Only update if it's different to prevent infinite loops
          if (storedRoleId !== selectedRoleId && selectedRoleId) {
            if (localStorage.getItem("token")) {
              localStorage.setItem("userRoleId", selectedRoleId);
            }
            if (sessionStorage.getItem("token")) {
              sessionStorage.setItem("userRoleId", selectedRoleId);
            }
          }
        }
      } catch (error) {
        console.error("Error storing user role ID:", error);
      }
    };

    // Only run when component mounts, not on every selectedRoleId change
    storeUserRoleId();
  }, []); // Empty dependency array to run only once

  // console.log("Current location:", location.pathname);

  // Add this useEffect to check if all permissions are selected
  useEffect(() => {
    if (permissionsData && selectedRoleId) {
      const allPermissionsSelected = permissions.every((perm) =>
        permissionActions.every(
          (action) => permissionsData.permState[perm]?.[action] || false
        )
      );
      const token = getAuthToken();
      if (!token) return;
      setAllSelected(allPermissionsSelected);
    }
  }, [permissionsData, selectedRoleId]);

  // Refs to prevent duplicate toast notifications
  const initialRolesLoadedRef = useRef(false);
  // const API_URL = import.meta.env.VITE_BASE_URL || "http://localhost:9000";
  // Helper function to get auth token from localStorage or sessionStorage
  const getAuthToken = () => {
    // Try to get token from localStorage first
    let token = localStorage.getItem("token");

    // If not found in localStorage, try sessionStorage
    if (!token) {
      token = sessionStorage.getItem("token");
    }

    return token;
  };

  // Function to handle role selection
  const handleRoleSelect = (name: string, id: string) => {
    // Only dispatch actions if the selected role has changed
    if (selectedRoleId !== id) {
      dispatch(setSelectedRole({ id, name }));

      // Check if we already have permissions data for this role
      const existingPermissions = permissionsByRoleId[id];

      // Only fetch permissions if we don't already have them and we're not currently fetching them
      if (
        !existingPermissions ||
        !existingPermissions.permState ||
        Object.keys(existingPermissions.permState).length === 0
      ) {
        // Check if we're already fetching permissions for this role
        if (!fetchingPermissionsRef.current.has(id)) {
          fetchingPermissionsRef.current.add(id);
          dispatch(fetchPermissions(id)).finally(() => {
            fetchingPermissionsRef.current.delete(id);
          });
        }
      }
    }
  };

  // Updated handleSavePermissions function with loading state
  const handleSavePermissions = async () => {
    if (!canUpdate) {
      toast.error("You don't have permission to update permission");
      return;
    }
    if (!selectedRoleId || !permissionsData) {
      toast.error("No role selected or permissions data not available");
      return;
    }

    setIsSavingPermissions(true);

    try {
      const result = await dispatch(
        saveOrUpdatePermissions({
          roleId: selectedRoleId,
          permState: permissionsData.permState,
          permissionExists: permissionsData.permissionExists,
          permissionId: permissionsData.permissionId,
        })
      );

      if (result.meta.requestStatus === "fulfilled") {
        // Force a page refresh if current user's permissions were updated
        const currentUserRoleId =
          localStorage.getItem("userRoleId") ||
          sessionStorage.getItem("userRoleId");
        if (currentUserRoleId === selectedRoleId) {
          // Trigger a custom event to notify other components
          window.dispatchEvent(new CustomEvent("permissionsUpdated"));

          // Optional: Show a message that permissions were updated
          toast.info(
            "Your permissions have been updated. Some changes may require a page refresh."
          );
        }

        // Fetch permissions again to ensure we have the latest data
        if (!permissionsData.permissionExists) {
          dispatch(fetchPermissions(selectedRoleId));
        }
      }
    } catch (error) {
      console.error("Error saving permissions:", error);
      toast.error("Failed to save permissions");
    } finally {
      setIsSavingPermissions(false);
    }
  };

  // Function to handle checkbox change
  const handleCheckboxChange = (perm: string, action: PermissionAction) => {
    if (selectedRoleId && permissionsData) {
      const currentValue = permissionsData.permState[perm]?.[action] || false;

      dispatch(
        updatePermissionState({
          roleId: selectedRoleId,
          permission: perm,
          action,
          value: !currentValue,
        })
      );
    }
  };

  // Function to handle resetting permissions
  const handleResetPermissions = () => {
    if (selectedRoleId) {
      dispatch(resetPermissionState(selectedRoleId));
    }
  };

  // Modify the handleDeleteRole function
  const handleDeleteRole = (roleId: string, roleName: string) => {
    if (!canDelete) {
      toast.error("You don't have permission to delete role");
      return;
    }

    setShowDeleteModal(true);
    setDeleteRole({ _id: roleId, name: roleName });
  };

  // Add the delete confirmation function
  const handleDeleteConfirm = (roleId: string) => {
    if (deleteRole) {
      console.log("roleId", roleId);

      dispatch(deleteRoleAction(roleId));
    }
    setShowDeleteModal(false);
    setDeleteModal(true);
  };

  // Function to get icon based on role name
  const getRoleIcon = (roleName: string) => {
    const name = roleName.toLowerCase();

    if (name.includes("admin")) {
      return (
        <img
          src={CrownIcon || "/placeholder.svg"}
          alt="Admin Icon"
          className="w-5 h-5"
        />
      );
    } else if (name.includes("delivery")) {
      return (
        <img
          src={deliveryPerson || "/placeholder.svg"}
          alt="Delivery Icon"
          className="w-5 h-5"
        />
      );
    } else if (name.includes("sales") || name.includes("salesperson")) {
      return (
        <img
          src={briefCase || "/placeholder.svg"}
          alt="Sale Person Icon"
          className="w-5 h-5"
        />
      );
    } else if (name.includes("data") || name.includes("entry")) {
      return (
        <img
          src={entryPerson || "/placeholder.svg"}
          alt="Data Entry Icon"
          className="w-5 h-5"
        />
      );
    }

    return (
      <img
        src={briefCase || "/placeholder.svg"}
        alt="Role Icon"
        className="w-5 h-5"
      />
    );
  };

  // Fetch roles when component mounts
  useEffect(() => {
    dispatch(fetchRoles());
  }, [dispatch]);

  // Select first role and fetch its permissions when roles are loaded
  useEffect(() => {
    if (roles.length > 0 && !initialRolesLoadedRef.current) {
      initialRolesLoadedRef.current = true;

      // If no role is selected yet, select the first one
      if (!selectedRoleId && roles[0]._id) {
        // Just set the selected role, don't fetch permissions here
        // The other useEffect will handle fetching permissions
        dispatch(
          setSelectedRole({
            id: roles[0]._id || "",
            name: roles[0].name,
          })
        );
      }
    }
  }, [roles, selectedRoleId, dispatch]);

  // Fetch permissions when a role is selected if not already in store
  useEffect(() => {
    if (selectedRoleId) {
      // Check if we already have permissions data for this role
      const existingPermissions = permissionsByRoleId[selectedRoleId];

      // Only fetch permissions if we don't already have them and we're not currently fetching them
      if (
        !existingPermissions ||
        !existingPermissions.permState ||
        Object.keys(existingPermissions.permState).length === 0
      ) {
        // Check if we're already fetching permissions for this role
        if (!fetchingPermissionsRef.current.has(selectedRoleId)) {
          fetchingPermissionsRef.current.add(selectedRoleId);
          dispatch(fetchPermissions(selectedRoleId)).finally(() => {
            fetchingPermissionsRef.current.delete(selectedRoleId);
          });
        }
      }
    }
  }, [selectedRoleId, dispatch]);

  useEffect(() => {
    // Check if user has permission to view this page
    const checkPermission = () => {
      try {
        // Get user role from storage
        const role =
          localStorage.getItem("role") || sessionStorage.getItem("role");

        // Admin and SuperAdmin always have access
        if (role === "Admin" || role === "SuperAdmin") {
          setHasAccess(true);
          return;
        }

        // Get permissions from storage
        const permissionsStr =
          localStorage.getItem("permissions") ||
          sessionStorage.getItem("permissions");
        if (!permissionsStr) {
          setHasAccess(false);
          return;
        }

        const permissions = JSON.parse(permissionsStr);

        // Check if user has permission to view Role and Policies
        const hasViewPermission =
          permissions &&
          permissions.pages &&
          permissions.pages.some(
            (page: any) => page.name === "Role and Policies" && page.read
          );

        setHasAccess(hasViewPermission);

        if (!hasViewPermission) {
          toast.error("You don't have permission to access this page");
          navigate("/dashboard");
        }
      } catch (error) {
        console.error("Error checking permissions:", error);
        setHasAccess(false);
        navigate("/dashboard");
      }
    };

    checkPermission();
  }, [navigate]);

  // If user doesn't have access, don't render the component
  if (!hasAccess) {
    return null;
  }

  return (
    <div className="mx-auto px-3 py-6 sm:px-4 md:px-6 xl:px-8 xl:py-6 w-full">
      <h2 className="Inter-font font-semibold text-[20px] mb-2">
        Add Role and Policies
      </h2>
      <div className="flex flex-col md:flex-row gap-4">
        <div className="md:w-1/3 lg:w-1/3 xl:w-1/4 bg-white p-4 rounded ">
          <div className="flex justify-between w-full py-1 mb-4 items-center">
            <h5 className="text-lg font-semibold mb-2 text-[#056BB7]">Role</h5>

            <button
              className="bg-[#384AAB] text-white text-sm px-3 py-2 rounded"
              onClick={() => {
                if (!canCreate) {
                  toast.error("You don't have permission to add role");
                  return;
                }
                setIsEditing(false);
                setRoleName("");
                setRoleDescription("");
                setUploadedFile(null);
                setRoleImageUrl("");
                setShowModal(true);
              }}
            >
              + Add Role
            </button>
          </div>

          {rolesLoading ? (
            <div className="flex justify-center items-center h-40">
              <p className="text-gray-500">Loading roles...</p>
            </div>
          ) : roles.length === 0 ? (
            <div className="flex justify-center items-center h-40">
              <p className="text-gray-500">No roles found</p>
            </div>
          ) : (
            <ul className="space-y-2">
              {roles.map((role: any) => (
                <li
                  key={role._id || role.name}
                  className={`flex justify-between items-center px-3 py-2 rounded cursor-pointer Inter-font font-medium ${
                    selectedRoleName === role.name
                      ? "bg-[#EEEEEE]"
                      : "bg-white hover:bg-gray-200"
                  }`}
                  onClick={() => handleRoleSelect(role.name, role._id || "")}
                >
                  <span className="flex items-center gap-2 md:text-[12px] lg:text-[12px] xl:text-[13px] text-[14px]">
                    <img
                      src={
                        role.roleImage
                          ? `${API_URL}${role.roleImage}`
                          : defaultPicture
                      }
                      alt="User"
                      className="rounded-full w-9 h-9"
                    />

                 =
                    <AiOutlineDelete
                      className="cursor-pointer hover:text-red-500"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteRole(role._id || "", role.name);
                      }}
                    />
                    {/* // )}*/}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="md:w-3/4 bg-white rounded overflow-x-auto">
          {permissionsLoading ? (
            <div className="flex justify-center items-center h-40">
              <p className="text-gray-500">Loading permissions...</p>
            </div>
          ) : !selectedRoleId ? (
            <div className="flex justify-center items-center h-40">
              <p className="text-gray-500">
                Please select a role to view permissions
              </p>
            </div>
          ) : !permissionsData ? (
            <div className="flex justify-center items-center h-40">
              <p className="text-gray-500">No permissions data available</p>
            </div>
          ) : (
            <>
              <table className="w-full text-center border-b">
                <thead className="bg-gray-100">
                  <tr className="bg-[#F6F6F6] Inter-font">
                    <th className="text-left p-2 border-b">Permissions</th>
                    <th className="p-2 border-b">View</th>
                    <th className="p-2 border-b">Add</th>
                    <th className="p-2 border-b">Edit</th>
                    <th className="p-2 border-b">Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {permissions.map((perm) => (
                    <tr key={perm} className="hover:bg-gray-50">
                      <td className="text-left p-2 font-medium">{perm}</td>
                      {permissionActions.map((action) => (
                        <td key={action} className="p-2">
                          <input
                            type="checkbox"
                            checked={
                              permissionsData.permState[perm]?.[action] || false
                            }
                            onChange={() => handleCheckboxChange(perm, action)}
                            className="form-checkbox h-4 w-4 text-blue-600"
                            disabled={isSelectingAll || isSavingPermissions}
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="flex justify-end gap-2 mt-4 mb-4 ">
                {canUpdate && (
                  <Button
                    text={
                      isSelectingAll
                        ? "Processing..."
                        : allSelected
                        ? "Deselect All"
                        : "Select All"
                    }
                    iconFirst={true}
                    fontFamily="Source-Sans-Pro-font"
                    icon={
                      isSelectingAll ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      ) : allSelected ? (
                        <PiArrowCounterClockwiseBold />
                      ) : (
                        <MdSelectAll />
                      )
                    }
                    onClick={handleSelectAll}
                    disabled={isSelectingAll || isSavingPermissions}
                    className={`${
                      isSelectingAll
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-green-600 hover:bg-green-700"
                    } text-white border-none transition-colors`}
                  />
                )}
                <Button
                  icon={
                    isSavingPermissions ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <FaSave />
                    )
                  }
                  iconFirst={true}
                  variant="border"
                  fontFamily="Source-Sans-Pro-font border-2 mr-3 md:mr-6 md:lg:mr-8"
                  text={
                    isSavingPermissions
                      ? "Saving..."
                      : permissionsData.permissionExists
                      ? "Update"
                      : "Save"
                  }
                  className={`${
                    isSavingPermissions
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-black hover:bg-gray-800"
                  } text-white transition-colors`}
                  onClick={handleSavePermissions}
                  disabled={isSavingPermissions || isSelectingAll}
                />
              </div>
            </>
          )}
        </div>
      </div>
      <UploadPicture
        showModal={showModal}
        setShowModal={setShowModal}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        roleName={roleName}
        setRoleName={setRoleName}
        uploadedFile={uploadedFile}
        setUploadedFile={setUploadedFile}
        selectedRoleId={isEditing ? editingRoleId : ""} // Use editingRoleId instead of selectedRoleId
        roleImageUrl={roleImageUrl}
        onRoleSaved={() => {
          // Refresh roles after saving
          dispatch(fetchRoles());
          setEditingRoleId(""); // Clear editing role ID
        }}
      />

      {/* Delete Success Modal */}
      {deleteModal && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black/20 z-50"
          onClick={() => {
            setDeleteModal(false);
            setDeleteRole(null);
          }}
        >
          <div
            className="animate-scaleIn bg-white rounded-xl w-full max-w-md relative shadow-lg border-3 border-gray-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center py-4 px-6 shadow-[0_2px_2px_0_#00000026]">
              <h2 className="text-xl font-medium">Delete {deleteRole?.name}</h2>
              <button
                onClick={() => setDeleteModal(false)}
                className="text-xl font-bold text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
            <div className="mt-8 text-start pb-8 px-6 shadow-[0_2px_2px_0_#00000026]">
              <h3 className="text-lg font-semibold mb-1">Delete Role</h3>
              <p className="text-sm text-gray-700">
                The role has been removed successfully.
              </p>
            </div>
            <div className="flex justify-center gap-2 pb-3 py-4 px-6 shadow-[0_2px_2px_0_#00000026]">
              <Button
                text="Close"
                onClick={() => setDeleteModal(false)}
                className="px-5 py-1 rounded-md hover:bg-gray-100 border-none shadow-[inset_0_0_4px_#00000026]"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RolePermissionUI;