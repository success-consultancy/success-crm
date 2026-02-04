export interface IAgreement {
  id: number;
  universityId: number;
  university?: {
    id: number;
    name: string;
  };
  type: string | null;
  group: string | null;
  startDate: string | null;
  endDate: string | null;
  commission: string | null;
  location: string | null;
  status: AgreementStatus;
  file: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export enum AgreementStatus {
  InEffect = 'IN EFFECT',
  InProcess = 'IN PROCESS',
}

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
  from?: string;
  to?: string;
}
