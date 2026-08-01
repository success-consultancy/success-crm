'use client';

import {
  Users,
  UserCheck,
  TrendingUp,
  GraduationCap,
  Globe,
  ClipboardList,
  ShieldCheck,
  Scale,
  LucideIcon,
} from 'lucide-react';
import { useGetDashboard, DashboardCounts } from '@/query/get-dashboard';
import CardContainer from '@/components/atoms/card-container';
import { cn } from '@/lib/utils';

interface StatCard {
  key: keyof DashboardCounts;
  label: string;
  Icon: LucideIcon;
  color: string;
  bgColor: string;
}

const STAT_CARDS: StatCard[] = [
  { key: 'uniqueClientCount', label: 'Unique Clients', Icon: Users, color: 'text-[#001aff]', bgColor: 'bg-[#ebedff]' },
  { key: 'users', label: 'CRM Users', Icon: UserCheck, color: 'text-[#007b93]', bgColor: 'bg-[#e4f9fa]' },
  { key: 'leads', label: 'Leads', Icon: TrendingUp, color: 'text-[#016edf]', bgColor: 'bg-[#ebf4ff]' },
  { key: 'students', label: 'Students', Icon: GraduationCap, color: 'text-[#7300ff]', bgColor: 'bg-[#f4ebff]' },
  { key: 'visaApplicants', label: 'Visa Applicants', Icon: Globe, color: 'text-[#0eae02]', bgColor: 'bg-[#e8fbe7]' },
  {
    key: 'skillAssessments',
    label: 'Skill Assessments',
    Icon: ClipboardList,
    color: 'text-[#ff7400]',
    bgColor: 'bg-[#fff5eb]',
  },
  { key: 'tribunalReview', label: 'Tribunal Reviews', Icon: Scale, color: 'text-[#bb00ff]', bgColor: 'bg-[#faebff]' },
  {
    key: 'insuranceApplicants',
    label: 'Insurance',
    Icon: ShieldCheck,
    color: 'text-[#fb0b7b]',
    bgColor: 'bg-[#fceef4]',
  },
];

const AdminStatCards = () => {
  const { data, isLoading } = useGetDashboard();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {isLoading
        ? Array.from({ length: 8 }).map((_, i) => (
            <CardContainer key={i} className="rounded-xl shadow-[0_1px_1px_rgba(10,13,18,0.05)] px-5 pt-4 pb-5">
              <div className="animate-pulse space-y-3">
                <div className="h-10 w-10 bg-gray-200 rounded-lg" />
                <div className="h-3 w-20 bg-gray-200 rounded" />
                <div className="h-7 w-14 bg-gray-200 rounded" />
              </div>
            </CardContainer>
          ))
        : STAT_CARDS.map(({ key, label, Icon, color, bgColor }) => {
            const changePct = data?.changePct[key];
            const isNew = changePct === null;
            const positive = (changePct ?? 0) >= 0;
            return (
              <CardContainer key={key} className="rounded-xl shadow-[0_1px_1px_rgba(10,13,18,0.05)] px-5 pt-4 pb-5">
                <div className="flex items-start justify-between gap-[18px]">
                  <div className="flex flex-col gap-[18px] min-w-0">
                    <p className="text-b14-500 text-neutral-black">{label}</p>
                    <div className="flex flex-col gap-1.5">
                      <p className="text-h4 font-semibold text-neutral-black">
                        {data?.counts[key]?.toLocaleString() ?? '—'}
                      </p>
                      <p className="text-c1 flex items-center gap-1.5">
                        <span
                          className={cn(
                            'font-medium',
                            isNew ? 'text-neutral-light-grey' : positive ? 'text-[#01840c]' : 'text-utility-red',
                          )}
                        >
                          {isNew ? 'New' : `${positive ? '+' : ''}${changePct}%`}
                        </span>
                        <span className="text-neutral-light-grey">vs last year</span>
                      </p>
                    </div>
                  </div>
                  <div className={`${bgColor} rounded-lg p-2 shrink-0`}>
                    <Icon className={`${color} w-4 h-4`} />
                  </div>
                </div>
              </CardContainer>
            );
          })}
    </div>
  );
};

export default AdminStatCards;
