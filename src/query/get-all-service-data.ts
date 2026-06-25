import { QUERY_KEYS } from '@/constants/query-keys';
import { api } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';

export interface ServiceDataItem {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  status: string;
  serviceName: 'lead' | 'student' | 'visa' | 'insurance' | 'skill';
  assignedDate?: string;
  createdAt: string;
  updatedAt: string;
}

const getAllServiceData = async (): Promise<ServiceDataItem[]> => {
  const res = await api.get('/user/all-service-data');
  return res.data;
};

export const useGetAllServiceData = () => {
  return useQuery({
    queryFn: getAllServiceData,
    queryKey: [QUERY_KEYS.GET_ALL_SERVICE_DATA],
  });
};
