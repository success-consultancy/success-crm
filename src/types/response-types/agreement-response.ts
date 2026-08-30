import { UploadedFileMeta } from '@/types/common';

/**
 * Records created in the legacy crm-hbg app store `files` as bare URL strings.
 * Records created here store the full `UploadedFileMeta` shape.
 */
export type AgreementFile = UploadedFileMeta | string;

export interface IAgreement {
  id: number;
  universityId: number;
  university?: {
    id: number;
    name: string;
  };
  type: string | null;
  group: string | null;
  webLink: string | null;
  startDate: string | null;
  endDate: string | null;
  commission: string | null;
  location: string | null;
  status: AgreementStatus;
  note: string | null;
  fileUrl: string | null;
  files: AgreementFile[] | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export enum AgreementStatus {
  InEffect = 'IN EFFECT',
  InProcess = 'IN PROCESS',
  Cancelled = 'Cancelled',
  Expired = 'Expired',
}

export const AGREEMENT_STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  [AgreementStatus.InEffect]: { bg: '#d1fae5', text: '#065f46' },
  [AgreementStatus.InProcess]: { bg: '#fff7ed', text: '#c2410c' },
  [AgreementStatus.Cancelled]: { bg: '#f3e8ff', text: '#6b21a8' },
  [AgreementStatus.Expired]: { bg: '#fef9c3', text: '#854d0e' },
};

export const AGREEMENT_STATUS_LABELS: Record<AgreementStatus, string> = {
  [AgreementStatus.InEffect]: 'In Effect',
  [AgreementStatus.InProcess]: 'In Process',
  [AgreementStatus.Cancelled]: 'Cancelled',
  [AgreementStatus.Expired]: 'Expired',
};

const DEFAULT_STATUS_COLORS = { bg: '#f3f4f6', text: '#374151' };

/**
 * Legacy crm-hbg records store title-case statuses ("In Process"), this app
 * stores upper-case ones ("IN PROCESS"). Match on case-insensitive value so
 * both render identically.
 */
export const normalizeAgreementStatus = (status?: string | null): AgreementStatus | null => {
  if (!status) return null;
  const match = Object.values(AgreementStatus).find((s) => s.toLowerCase() === status.trim().toLowerCase());
  return match ?? null;
};

export const getAgreementStatusDisplay = (status?: string | null) => {
  const normalized = normalizeAgreementStatus(status);
  if (!normalized) return { label: status?.trim() || '-', colors: DEFAULT_STATUS_COLORS };
  return { label: AGREEMENT_STATUS_LABELS[normalized], colors: AGREEMENT_STATUS_COLORS[normalized] };
};

/** Legacy file URLs follow a `<timestamp>_<original name>` convention. */
const fileNameFromUrl = (url: string) => {
  const segment = url.split('/').pop() || url;
  let decoded = segment;
  try {
    decoded = decodeURIComponent(segment);
  } catch {
    // malformed escape sequence — keep the raw segment
  }
  const separator = decoded.indexOf('_');
  return separator >= 0 ? decoded.slice(separator + 1) : decoded;
};

/** Widens legacy string entries into the `UploadedFileMeta` shape the UI expects. */
export const normalizeAgreementFiles = (files?: AgreementFile[] | null): UploadedFileMeta[] => {
  if (!files) return [];
  return files.flatMap((file) => {
    if (typeof file === 'string') {
      return file ? [{ url: file, name: fileNameFromUrl(file), size: 0, addedDate: '' }] : [];
    }
    if (!file?.url) return [];
    return [{ ...file, name: file.name || fileNameFromUrl(file.url) }];
  });
};

export interface AgreementsResponseType {
  count: number;
  rows: IAgreement[];
}

export interface AgreementFilterParams {
  page?: string;
  limit?: string;
  order?: string;
  order_by?: string;
  q_field?: string;
  q?: string;
  tab?: string;
  type?: string;
  from?: string;
  to?: string;
}
