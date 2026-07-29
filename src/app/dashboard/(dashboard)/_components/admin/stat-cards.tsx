'use client';

import React from 'react';
import {
  Users,
  UserCheck,
  TrendingUp,
  TrendingDown,
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
  // ponytail: backend has no % change baseline yet — placeholder until an endpoint exists
  changePct: number;
}

const STAT_CARDS: StatCard[] = [
  {
    key: 'uniqueClientCount',
    label: 'Unique Clients',
    Icon: Users,
    color: 'text-[#0e76bc]',
    bgColor: 'bg-[#e8f4fd]',
    changePct: 40,
  },
  { key: 'users', label: 'CRM Users', Icon: UserCheck, color: 'text-[#17a2b8]', bgColor: 'bg-[#e3f6f9]', changePct: 60 },
  { key: 'leads', label: 'Leads', Icon: TrendingUp, color: 'text-[#007bff]', bgColor: 'bg-[#e6f0ff]', changePct: 35 },
  {
    key: 'students',
    label: 'Students',
    Icon: GraduationCap,
    color: 'text-[#00b5ad]',
    bgColor: 'bg-[#e0f5f4]',
    changePct: -0.5,
  },
  {
    key: 'visaApplicants',
    label: 'Visa Applicants',
    Icon: Globe,
    color: 'text-[#28a745]',
    bgColor: 'bg-[#e3f5e8]',
    changePct: 15,
  },
  {
    key: 'skillAssessments',
    label: 'Skill Assessments',
    Icon: ClipboardList,
    color: 'text-[#fd7e14]',
    bgColor: 'bg-[#fff3e6]',
    changePct: -4,
  },
  {
    key: 'tribunalReview',
    label: 'Tribunal Reviews',
    Icon: Scale,
    color: 'text-[#dc3545]',
    bgColor: 'bg-[#fde8ea]',
    changePct: -16,
  },
  {
    key: 'insuranceApplicants',
    label: 'Insurance',
    Icon: ShieldCheck,
    color: 'text-[#ffc107]',
    bgColor: 'bg-[#fff9e6]',
    changePct: 23,
  },
];

const AdminStatCards = () => {
  const { data, isLoading } = useGetDashboard();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {isLoading
        ? Array.from({ length: 8 }).map((_, i) => (
            <CardContainer key={i}>
              <div className="animate-pulse space-y-3">
                <div className="h-10 w-10 bg-gray-200 rounded-lg" />
                <div className="h-3 w-20 bg-gray-200 rounded" />
                <div className="h-7 w-14 bg-gray-200 rounded" />
              </div>
            </CardContainer>
          ))
        : STAT_CARDS.map(({ key, label, Icon, color, bgColor, changePct }) => {
            const positive = changePct >= 0;
            const TrendIcon = positive ? TrendingUp : TrendingDown;
            return (
              <CardContainer key={key}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex flex-col">
                    <p className="text-c1 text-content-subtitle">{label}</p>
                    <p className="text-h4 font-bold text-content-heading mt-1">
                      {data?.counts[key]?.toLocaleString() ?? '—'}
                    </p>
                    <p
                      className={cn(
                        'text-c1 flex items-center gap-1 mt-1.5',
                        positive ? 'text-utility-green' : 'text-utility-red',
                      )}
                    >
                      <TrendIcon className="w-3 h-3" strokeWidth={2.5} />
                      {positive ? '+' : ''}
                      {changePct}% vs last year
                    </p>
                  </div>
                  <div className={`${bgColor} rounded-lg p-2.5 shrink-0`}>
                    <Icon className={`${color} w-5 h-5`} />
                  </div>
                </div>
              </CardContainer>
            );
          })}
    </div>
  );
};

export default AdminStatCards;
