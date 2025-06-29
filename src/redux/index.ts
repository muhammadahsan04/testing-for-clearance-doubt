// Re-export hooks
export { useAppDispatch, useAppSelector } from './hooks';

// Re-export store
export { store } from './store';
export type { RootState, AppDispatch } from './store';

// Re-export slices
export {
  fetchPermissions,
  saveOrUpdatePermissions,
  updatePermissionState,
  resetPermissionState,
  selectPermissionsByRoleId,
  selectPermissionsLoading,
} from './slices/permissionSlice';

export {
  fetchRoles,
  fetchRoleById,
  saveRole,
  deleteRole,
  setSelectedRole,
  selectAllRoles,
  selectSelectedRoleId,
  selectSelectedRoleName,
  selectRolesLoadingAll,
  selectRoleLoadingOne,
  selectRoleSaving,
  selectRoleDeleting,
} from './slices/roleSlice';

