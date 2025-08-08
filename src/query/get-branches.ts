import { api } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';

export const GET_BRANCHES = 'get-branches';

const getBranches = async () => {
  const { data } = await api.get('/branch');
  return data?.data?.rows as Branch[];
};

export const useGetBranches = () => {
  return useQuery({
    queryFn: getBranches,
    queryKey: [GET_BRANCHES],
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
  createdAt: string;
  updatedAt: string;
}
