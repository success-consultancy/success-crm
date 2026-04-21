import { QUERY_KEYS } from '@/constants/query-keys';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

export interface UserForAppointment {
  id: number;
  firstName: string;
  lastName: string;
  detail: string | null;
  isPaid: boolean;
  paidAmount: string | null;
  slotTime: number | null;
  appointmentNote: string | null;
  profileUrl: string | null;
}

const getUsersForAppointment = async (branch: string): Promise<UserForAppointment[]> => {
  const res = await api.get<UserForAppointment[]>(
    `/public/userForAppointment`,
  );
  return res.data;
};

export const useGetUsersForAppointment = (branch: string) => {
  return useQuery({
    queryFn: () => getUsersForAppointment(branch),
    queryKey: [QUERY_KEYS.GET_USERS_FOR_APPOINTMENT, branch],
    enabled: !!branch,
    staleTime: 60_000,
  });
};
