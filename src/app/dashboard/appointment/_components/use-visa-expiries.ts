import { useMemo } from 'react';
import { parse, isValid, format } from 'date-fns';
import { useGetVisa } from '@/query/get-visa';
import { useGetLeads } from '@/query/get-leads';
import { useGetInsurance } from '@/query/get-insurance';
import { ROUTES } from '@/config/routes';

export type VisaExpiryCategory = 'Visa applicant' | 'Lead' | 'Insurance';

export interface VisaExpiryEvent {
  id: string;
  entityId: number;
  category: VisaExpiryCategory;
  service: string;
  title: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  visaExpiry: string;
  startTime: string;
  endTime: string;
  date: string;
  detailPath: string;
}

const CATEGORY_COLORS: Record<VisaExpiryCategory, string> = {
  'Visa applicant': '#FDB602',
  Lead: '#22AF6A',
  Insurance: '#3B82F6',
};

export const getCategoryColor = (category: VisaExpiryCategory) => CATEGORY_COLORS[category];

// Backend stores visaExpiry as "DD/MM/YYYY" string (some records may be ISO).
// Returns a JS Date or null if unparseable.
const parseVisaExpiry = (raw: string): Date | null => {
  const trimmed = raw.trim();
  if (!trimmed) return null;

  const formats = ['dd/MM/yyyy', 'd/M/yyyy', 'yyyy-MM-dd', "yyyy-MM-dd'T'HH:mm:ss", "yyyy-MM-dd'T'HH:mm:ss.SSSX"];
  for (const fmt of formats) {
    const parsed = parse(trimmed, fmt, new Date());
    if (isValid(parsed)) return parsed;
  }
  const fallback = new Date(trimmed);
  return isValid(fallback) ? fallback : null;
};

const buildEvent = (
  entity: { id: number; firstName: string; lastName: string; email: string; phone: string; visaExpiry?: string | null },
  category: VisaExpiryCategory,
  service: string,
  detailPath: string,
): VisaExpiryEvent | null => {
  if (!entity.visaExpiry) return null;
  const expiry = parseVisaExpiry(entity.visaExpiry);
  if (!expiry) return null;

  const dateStr = format(expiry, 'yyyy-MM-dd');
  const startTime = `${dateStr}T00:00:00`;
  const endTime = `${dateStr}T23:59:59`;

  return {
    id: `${category}-${entity.id}`,
    entityId: entity.id,
    category,
    service,
    title: `${entity.firstName}'s Visa Expires (${category})`,
    firstName: entity.firstName,
    lastName: entity.lastName,
    email: entity.email,
    phone: entity.phone,
    visaExpiry: dateStr,
    startTime,
    endTime,
    date: dateStr,
    detailPath,
  };
};

const HIGH_LIMIT = '1000';

export function useVisaExpiries(enabled: boolean) {
  const { data: visaData, isLoading: isVisaLoading } = useGetVisa(
    enabled ? { page: '1', limit: HIGH_LIMIT } : undefined,
  );
  const { data: leadData, isLoading: isLeadLoading } = useGetLeads(
    enabled ? { page: '1', limit: HIGH_LIMIT } : ({} as any),
  );
  const { data: insuranceData, isLoading: isInsuranceLoading } = useGetInsurance(
    enabled ? { page: '1', limit: HIGH_LIMIT } : undefined,
  );

  const events: VisaExpiryEvent[] = useMemo(() => {
    if (!enabled) return [];
    const list: VisaExpiryEvent[] = [];

    visaData?.rows?.forEach((v) => {
      const evt = buildEvent(v, 'Visa applicant', 'Visa service', `${ROUTES.VISA}/${v.id}/view`);
      if (evt) list.push(evt);
    });

    leadData?.rows?.forEach((l) => {
      const evt = buildEvent(l as any, 'Lead', 'Lead', `${ROUTES.LEADS}/${l.id}/view`);
      if (evt) list.push(evt);
    });

    insuranceData?.rows?.forEach((i) => {
      const evt = buildEvent(i, 'Insurance', 'Insurance service', `${ROUTES.INSURANCE}/${i.id}/view`);
      if (evt) list.push(evt);
    });

    return list;
  }, [enabled, visaData?.rows, leadData?.rows, insuranceData?.rows]);

  const isLoading = enabled && (isVisaLoading || isLeadLoading || isInsuranceLoading);

  return { events, isLoading };
}
