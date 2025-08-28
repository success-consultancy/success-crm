import { api } from '@/lib/api';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';

export interface Branch {
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
  return useMutation({
    mutationFn: addBranch,
    onSuccess: () => {
      toast.success('Branch added successfully!');
    },
    onError: () => {
      toast.error('Failed to add branch!');
    },
  });
};
