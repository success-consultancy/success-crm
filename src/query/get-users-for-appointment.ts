import { QUERY_KEYS } from '@/constants/query-keys';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

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

const BASE_URL = 'https://x7jchqrlnkwu4lll5p77mmkk7i0obrgv.lambda-url.us-east-1.on.aws';

const getUsersForAppointment = async (branch: string): Promise<UserForAppointment[]> => {
  const branchSlug = branch.toLowerCase().replace(/\s+/g, '-');
  const res = await axios.get<UserForAppointment[]>(
    `${BASE_URL}/${branchSlug}/public/userForAppointment`,
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
