import { api } from '@/lib/api';
import { downloadFile } from '@/utils/download';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';

const exportLeads = async () => {
  const res = await api.get('/lead/export');
  downloadFile(res.data, 'leads.csv', 'text/csv;charset=utf-8;');
  toast.success('Leads exported successfully!');
};

export interface UseExportLeadsOptions {
  filename?: string;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export const useExportLeads = (options: UseExportLeadsOptions = {}) => {
  const { onSuccess, onError } = options;

  return useMutation({
    mutationFn: () => exportLeads(),
    onSuccess,
    onError,
  });
};

type ExportLeads = {
  id: number;
  firstName: string;
  middleName: string | null;
  lastName: string;
  dob: string | null;
  passport: string | null;
  issueDate: string | null;
  expiryDate: string | null;
  email: string;
  isConsent: boolean;
  phone: string;
  note: string;
  status: string;
  followUpDate: string | null;
  visa: string | null;
  visaExpiry: string | null;
  serviceType: string;
  studentId: number;
  skillAssessmentId: number | null;
  sourceId: number | null;
  visaApplicantId: number | null;
  insuranceApplicantId: number | null;
  tribunalReviewId: number | null;
  country: string;
  address: string | null;
  location: string | null;
  occupation: string | null;
  anzsco: string | null;
  qualification: string | null;
  files: string | null;
  userId: number | null;
  assignedDate: string | null;
  branchId: number | null;
  updatedBy: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};
