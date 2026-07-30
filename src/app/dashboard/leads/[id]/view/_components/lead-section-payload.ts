import { LeadSchemaType } from '@/schema/lead-schema';
import { ILead } from '@/types/response-types/leads-response';

export type LeadEditPayload = Omit<LeadSchemaType, 'serviceType'> & {
  serviceType: string;
  id: number;
};

const parseServiceType = (raw: string | null | undefined): string[] => {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const toDate = (value: unknown): Date | null => {
  if (!value) return null;
  if (value instanceof Date) return value;
  if (typeof value === 'string') {
    const d = new Date(value);
    return isNaN(d.getTime()) ? null : d;
  }
  return null;
};

export const buildLeadSectionPayload = (
  lead: ILead,
  overrides: Partial<LeadSchemaType>,
): LeadEditPayload => {
  const baseServiceType = parseServiceType(lead.serviceType);
  const nextServiceType = (overrides.serviceType ?? baseServiceType) as string[];

  return {
    id: lead.id,
    firstName: overrides.firstName ?? lead.firstName,
    middleName: overrides.middleName ?? lead.middleName ?? null,
    lastName: overrides.lastName ?? lead.lastName,
    email: overrides.email ?? lead.email,
    phone: overrides.phone ?? lead.phone,
    dob: overrides.dob ?? lead.dob ?? '',
    address: overrides.address ?? lead.address ?? null,
    qualification: overrides.qualification ?? lead.qualification ?? null,
    occupation: overrides.occupation ?? lead.occupation ?? null,
    anzsco: overrides.anzsco ?? lead.anzsco ?? null,
    country: overrides.country ?? lead.country ?? null,
    passport: (overrides.passport ?? lead.passport ?? null) as LeadEditPayload['passport'],
    issueDate: (overrides.issueDate ?? toDate(lead.issueDate)) as LeadEditPayload['issueDate'],
    expiryDate: (overrides.expiryDate ?? toDate(lead.expiryDate)) as LeadEditPayload['expiryDate'],
    visa: overrides.visa ?? lead.visa ?? null,
    visaExpiry: (overrides.visaExpiry ?? toDate(lead.visaExpiry)) as LeadEditPayload['visaExpiry'],
    location: overrides.location ?? lead.location ?? null,
    sourceId: overrides.sourceId ?? lead.sourceId ?? null,
    userId: overrides.userId ?? lead.userId ?? null,
    status: overrides.status ?? lead.status ?? null,
    remarks: overrides.remarks ?? lead.remarks ?? null,
    files: (overrides.files ?? lead.files ?? null) as LeadEditPayload['files'],
    serviceType: JSON.stringify(nextServiceType),
  };
};
