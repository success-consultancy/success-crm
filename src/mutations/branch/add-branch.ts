import { QUERY_KEYS } from '@/constants/query-keys';
import { api } from '@/lib/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

export interface Branch {
  id?: string;
  name: string;
  country: string;
  city: string;
  timezone: string;
  phone: string;
}

const addBranch = async (payload: Branch) => {
  const res = await api.post('/branch', payload);
  return res.data;
};

export const useAddBranch = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addBranch,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_BRANCHES],
      });
      toast.success('Branch added successfully!');
    },
    onError: () => {
      toast.error('Failed to add branch!');
    },
  });
};

const updateBranch = async (payload: Branch) => {
  const res = await api.patch(`/branch/${payload.id}`, {
    name: payload.name,
    country: payload.country,
    city: payload.city,
    timezone: payload.timezone,
    phone: payload.phone,
  });
  return res.data;
};

export const useUpdateBranch = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateBranch,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_BRANCHES],
      });
      toast.success('Branch updated successfully!');
    },
    onError: () => {
      toast.error('Failed to update branch!');
    },
  });
};
