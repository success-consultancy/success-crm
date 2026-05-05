import { custom_api } from '@/lib/api';
import { useMutation } from '@tanstack/react-query';

export interface ClockInUser {
  id: number;
  firstName: string;
  lastName: string;
  profileUrl?: string | null;
}

export interface ClockInRecord {
  id: number;
  userId: number;
  date: string;
  clockInTime: string | null;
  clockOutTime: string | null;
  breakStartTime: string | null;
  breakEndTime: string | null;
  totalHours?: string | null;
}

export interface ClockLoginResponse {
  token: string;
  user: ClockInUser;
  clockIn: ClockInRecord | null;
}

export interface ClockLoginPayload {
  clockInCode?: string;
  id?: number;
}

const clockLogin = async (payload: ClockLoginPayload): Promise<ClockLoginResponse> => {
  const res = await custom_api.post('/auth/clockLogin', payload);
  return res.data;
};

export const useClockLogin = () => {
  return useMutation({ mutationFn: clockLogin });
};

export { clockLogin };
