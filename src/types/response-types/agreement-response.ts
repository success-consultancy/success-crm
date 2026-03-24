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
  files: Array<{ url: string; size: number; name: string; addedDate: string }> | null;
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
