import { custom_api } from '@/lib/api';
import { useMutation } from '@tanstack/react-query';

interface ReturningCheckInPayload {
  phone?: string;
  email?: string;
}

// Step 1: search lead by phone or email
const searchLead = async (payload: ReturningCheckInPayload) => {
  const res = await custom_api.post('/public/searchLead', payload);
  return res.data as { count: number; rows: { id: number; firstName: string; lastName: string }[] };
};

// Step 2: create old check-in with leadId
const createOldCheckIn = async (leadId: number) => {
  const res = await custom_api.post('/public/oldcheckin', { leadId });
  return res.data;
};

// Combined: search → check-in
const verifyAndCheckIn = async (payload: ReturningCheckInPayload) => {
  const result = await searchLead(payload);
  if (!result.count || result.rows.length === 0) {
    const error: any = new Error('No accounts match the provided details');
    error.response = { status: 404, data: { message: 'No accounts match the provided details' } };
    throw error;
  }
  const leadId = result.rows[0].id;
  return createOldCheckIn(leadId);
};

export const useVerifyAndCheckIn = () => {
  return useMutation({
    mutationFn: verifyAndCheckIn,
  });
};
