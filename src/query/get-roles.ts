import { api } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';

export const GET_ROLES = 'get-roles';

export type CrudActions = {
  create: boolean;
  read: boolean;
  update: boolean;
  delete: boolean;
};

export type ServiceKey =
  | 'leads'
  | 'education'
  | 'visa'
  | 'skill'
  | 'tribunalReview'
  | 'insurance'
  | 'agreement'
  | 'appointment'
  | 'fiscalReport'
  | 'announcement'
  | 'users'
  | 'university'
  | 'course'
  | 'source'
  | 'settings'
  | 'occupation'
  | 'visaList';

export type RoleCrudPermissions = Record<ServiceKey, CrudActions>;

export interface RolePermissions {
  id: number;
  role: string;
  permissions: RoleCrudPermissions;
}

interface RolesResponse {
  success: boolean;
  data: RolePermissions[];
}

export const useGetRoles = () =>
  useQuery({
    queryKey: [GET_ROLES],
    queryFn: async () => {
      const res = await api.get<RolesResponse>('/role');
      return res.data.data;
    },
    refetchOnWindowFocus: false,
  });
