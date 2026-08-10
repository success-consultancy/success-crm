'use client';

import React, { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { GraduationHat02, Lightbulb05, ShieldPlus, Scales02, ChevronLeft, ChevronRight, Eye } from '@untitledui/icons';
import FileGlobeIcon from '@/assets/icons/file-globe-icon';
import CardContainer from '@/components/atoms/card-container';
import TableSkeleton from '@/components/organisms/table-skeleton';
import TableEmptyRow from '@/components/common/table-empty-row';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import useAuthStore from '@/store/auth-store';
import { useGetEducation } from '@/query/get-education';
import { useGetVisa } from '@/query/get-visa';
import { useGetSkillAssessments } from '@/query/get-skill-assessments';
import { useGetTribunalReviews } from '@/query/get-tribunalreview';
import { useGetInsurance } from '@/query/get-insurance';
import { EducationStatusTypes } from '@/types/response-types/education-response';
import { VisaStatusTypes } from '@/types/response-types/visa-response';
import { SkillAssessmentStatusTypes } from '@/types/response-types/skill-assessment-response';
import { TribunalStatusTypes } from '@/types/response-types/tribunal-review-response';
import { InsuranceStatusTypes } from '@/types/response-types/insurance-response';

type ServiceKey = 'education' | 'visa' | 'skill' | 'tribunal' | 'insurance';

interface PipelineRow {
  id: number;
  name: string;
  email: string;
  phone: string;
  passport: string;
  source: string;
  userId: number | null;
  status: string;
}

// Figma wording for a few education stages differs from the raw enum value.
const EDUCATION_STATUS_LABELS: Partial<Record<string, string>> = {
  [EducationStatusTypes.New]: 'New Student',
  [EducationStatusTypes.Checklist]: 'Checklist Sent',
  [EducationStatusTypes.CoeReceived]: 'CoE Received',
};

const enumTabs = (source: Record<string, string>, labels: Partial<Record<string, string>> = {}) =>
  Object.values(source).map((value) => ({ value, label: labels[value] ?? value }));

const SERVICE_CONFIG: Record<
  ServiceKey,
  {
    label: string;
    Icon: React.ElementType;
    statuses: { value: string; label: string }[];
    viewPath: (id: number) => string;
  }
> = {
  education: {
    label: 'Education',
    Icon: GraduationHat02,
    statuses: enumTabs(EducationStatusTypes, EDUCATION_STATUS_LABELS),
    viewPath: (id) => `/dashboard/education/${id}/view`,
  },
  visa: {
    label: 'Visa',
    Icon: FileGlobeIcon,
    statuses: enumTabs(VisaStatusTypes),
    viewPath: (id) => `/dashboard/visa/${id}/view`,
  },
  skill: {
    label: 'Skill Assessment',
    Icon: Lightbulb05,
    statuses: enumTabs(SkillAssessmentStatusTypes),
    viewPath: (id) => `/dashboard/skill/${id}/view`,
  },
  tribunal: {
    label: 'Tribunal Review',
    Icon: Scales02,
    statuses: enumTabs(TribunalStatusTypes),
    viewPath: (id) => `/dashboard/tribunal-review/${id}/view`,
  },
  insurance: {
    label: 'Insurance',
    Icon: ShieldPlus,
    statuses: enumTabs(InsuranceStatusTypes),
    viewPath: (id) => `/dashboard/insurance/${id}/view`,
  },
};

const PAGE_SIZE_OPTIONS = [10, 25, 50];
// ponytail: fetch the active service's full list and filter/paginate client-side —
// the backend's `tab` param only understands broad groups, not per-stage status filters.
const FETCH_PARAMS = { limit: '1000' };

const toRows = (raw: any[] | undefined): PipelineRow[] =>
  (raw ?? []).map((item) => ({
    id: item.id,
    name: [item.firstName, item.lastName].filter(Boolean).join(' ') || '-',
    email: item.email || '-',
    phone: item.phone || '-',
    passport: item.passport ? String(item.passport) : '-',
    source: item.source?.name || '-',
    userId: item.userId ?? null,
    status: item.status,
  }));

const ServicePipelineTable = () => {
  const router = useRouter();
  const profile = useAuthStore((s) => s.profile);
  const [service, setService] = useState<ServiceKey>('education');
  const [scope, setScope] = useState<'my' | 'all'>('my');
  const [statusTab, setStatusTab] = useState(SERVICE_CONFIG.education.statuses[0].value);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const education = useGetEducation(FETCH_PARAMS, { enabled: service === 'education' });
  const visa = useGetVisa(FETCH_PARAMS, { enabled: service === 'visa' });
  const skill = useGetSkillAssessments(FETCH_PARAMS, { enabled: service === 'skill' });
  const tribunal = useGetTribunalReviews(FETCH_PARAMS, { enabled: service === 'tribunal' });
  const insurance = useGetInsurance(FETCH_PARAMS, { enabled: service === 'insurance' });

  const { data: activeData, isLoading } = { education, visa, skill, tribunal, insurance }[service];
  const config = SERVICE_CONFIG[service];

  const rows = useMemo(() => toRows((activeData as any)?.rows), [activeData]);

  const scoped = useMemo(
    () => (scope === 'my' ? rows.filter((r) => r.userId === profile?.id) : rows),
    [rows, scope, profile?.id],
  );

  const filtered = useMemo(() => scoped.filter((r) => r.status === statusTab), [scoped, statusTab]);

  const totalItems = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const pageRows = filtered.slice((page - 1) * pageSize, page * pageSize);
  const rangeStart = totalItems === 0 ? 0 : (page - 1) * pageSize + 1;
  const rangeEnd = Math.min(page * pageSize, totalItems);

  const handleServiceChange = (key: ServiceKey) => {
    setService(key);
    setStatusTab(SERVICE_CONFIG[key].statuses[0].value);
    setPage(1);
  };

  return (
    <CardContainer className="p-4 rounded-xl">
      <div className="flex items-center justify-between border-b border-neutral-border-light pb-3.5 mb-4">
        <h4 className="text-h6 text-neutral-black">Service pipeline</h4>
        <div className="bg-white border border-neutral-border-light flex items-center p-1 rounded-lg">
          {(['my', 'all'] as const).map((key) => (
            <button
              key={key}
              onClick={() => {
                setScope(key);
                setPage(1);
              }}
              className={cn(
                'px-3.5 py-1.5 rounded-md text-b14-500 whitespace-nowrap cursor-pointer',
                scope === key ? 'bg-primary-faded text-primary-blue' : 'text-neutral-light-grey',
              )}
            >
              {key === 'my' ? 'My clients' : 'All clients'}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-4">
        {(Object.keys(SERVICE_CONFIG) as ServiceKey[]).map((key) => {
          const { label, Icon } = SERVICE_CONFIG[key];
          const active = service === key;
          return (
            <button
              key={key}
              onClick={() => handleServiceChange(key)}
              className={cn(
                'flex items-center gap-2 h-10 pl-4 pr-5 rounded-md text-b14-500 whitespace-nowrap cursor-pointer',
                active ? 'bg-primary-faded text-primary-blue' : 'border border-[#e3e3e3] text-neutral-black',
              )}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-1 overflow-x-auto border-b border-neutral-border-light">
        {config.statuses.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => {
              setStatusTab(value);
              setPage(1);
            }}
            className={cn(
              'px-2.5 py-2.5 text-b14-500 whitespace-nowrap border-b-2 -mb-px cursor-pointer',
              statusTab === value
                ? 'border-primary-blue text-neutral-black font-semibold'
                : 'border-transparent text-neutral-dark-grey hover:text-neutral-black',
            )}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="border border-neutral-border-light rounded-xl overflow-hidden mt-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#f9fafb]">
              <tr className="text-b14-600 text-neutral-dark-grey">
                <th className="px-4 h-11 w-14">S.N</th>
                <th className="px-4 h-11">Client</th>
                <th className="px-3 h-11">Email</th>
                <th className="px-3 h-11">Phone</th>
                <th className="px-3 h-11">Passport no.</th>
                <th className="px-3 h-11">Source</th>
                <th className="px-3 h-11 w-16" />
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <TableSkeleton columns={7} rows={5} />
              ) : pageRows.length === 0 ? (
                <TableEmptyRow
                  colSpan={7}
                  size="sm"
                  title="No clients in this stage"
                  description="Clients that reach this stage will appear here."
                />
              ) : (
                pageRows.map((row, idx) => (
                  <tr key={row.id} className="border-t border-neutral-border-light text-b14 text-neutral-dark-grey">
                    <td className="px-4 py-3">{(page - 1) * pageSize + idx + 1}</td>
                    <td className="px-4 py-3 text-neutral-black">{row.name}</td>
                    <td className="px-3 py-3">{row.email}</td>
                    <td className="px-3 py-3">{row.phone}</td>
                    <td className="px-3 py-3">{row.passport}</td>
                    <td className="px-3 py-3">{row.source}</td>
                    <td className="px-3 py-3">
                      <button
                        onClick={() => router.push(config.viewPath(row.id))}
                        className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 cursor-pointer"
                        aria-label="View client"
                      >
                        <Eye className="w-4 h-4 text-neutral-dark-grey" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between px-3.5 py-4 border-t border-neutral-border-light">
          <div className="flex items-center gap-2">
            <Select
              value={String(pageSize)}
              onValueChange={(val) => {
                setPageSize(Number(val));
                setPage(1);
              }}
            >
              <SelectTrigger size="sm" className="w-fit">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PAGE_SIZE_OPTIONS.map((n) => (
                  <SelectItem key={n} value={String(n)}>
                    {n}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="text-b14-500 text-neutral-light-grey">Items per table</span>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              aria-label="Previous page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-b14-500 text-neutral-dark-grey px-1.5">
              {rangeStart} - {rangeEnd} of {totalItems}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              aria-label="Next page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </CardContainer>
  );
};

export default ServicePipelineTable;
