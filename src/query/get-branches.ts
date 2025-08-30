import { api } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';

import { QUERY_KEYS } from '@/constants/query-keys';

const getBranches = async () => {
  const { data } = await api.get('/branch');
  return data?.data?.rows as Branch[];
};

export const useGetBranches = () => {
  return useQuery({
    queryFn: getBranches,
    queryKey: [QUERY_KEYS.GET_BRANCHES],
    refetchOnWindowFocus: false,
    retry: 1,
  });
};

const getBranchById = async (id: string) => {
  const { data } = await api.get(`/branch/${id}`);
  return data?.data as Branch;
};

export const useGetBranchById = (id: string) => {
  return useQuery({
    queryFn: () => getBranchById(id),
    queryKey: [QUERY_KEYS.GET_BRANCHES, id],
    refetchOnWindowFocus: false,
    retry: 1,
  });
};

interface BranchResponse {
  success: boolean;
  timestamp: string;
  rows: Branch[];
}

export interface Branch {
  id: string;
  name: string;
  country: string;
  city: string;
  timezone: string;
  phone: string;
  createdAt: string;
  updatedAt: string;
}
