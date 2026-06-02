import { api } from '@/lib/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { GET_ROLES, RoleCrudPermissions } from '@/query/get-roles';
import toast from 'react-hot-toast';

export interface UpdateRolePermissionsPayload {
  id: number;
  permissions: Partial<RoleCrudPermissions>;
}

const updateRolePermissions = async ({ id, permissions }: UpdateRolePermissionsPayload) => {
  const res = await api.put(`/role/${id}`, { permissions });
  return res.data;
};

export const useUpdateRolePermissions = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateRolePermissions,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [GET_ROLES] });
      toast.success('Role permissions updated');
    },
    onError: () => {
      toast.error('Failed to update role permissions');
    },
  });
};
