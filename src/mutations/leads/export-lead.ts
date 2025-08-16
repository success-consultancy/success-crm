import { api } from '@/lib/api';
import { arrayToCSV } from '@/utils/csv';
import { downloadFile } from '@/utils/download';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';

const fetchLeadsForExport = async () => {
  const res = await api.get('/lead/export');
  return res.data as ExportLeads[];
};

export interface UseExportLeadsOptions {
  filename?: string;
  onSuccess?: (data: ExportLeads[]) => void;
  onError?: (error: Error) => void;
}

export const exportLeadsToCSV = async (filename: string = 'leads.csv'): Promise<ExportLeads[]> => {
  try {
    const leads = await fetchLeadsForExport();

    if (leads.length === 0) {
      throw new Error('No leads found to export');
    }

    const csvContent = arrayToCSV(leads);
    downloadFile(csvContent, filename, 'text/csv;charset=utf-8;');

    toast.success('Leads exported successfully!');

    return leads;
  } catch (error) {
    console.error('Failed to export leads:', error);
    toast.error('Failed to export leads!');
    throw error;
  }
};

export const useExportLeads = (options: UseExportLeadsOptions = {}) => {
  const { filename = 'leads.csv', onSuccess, onError } = options;

  return useMutation({
    mutationFn: () => exportLeadsToCSV(filename),
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
