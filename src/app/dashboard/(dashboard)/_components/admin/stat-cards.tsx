'use client';

import React from 'react';
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

interface StatCard {
  key: keyof DashboardCounts;
  label: string;
  Icon: LucideIcon;
  color: string;
  bgColor: string;
}

const STAT_CARDS: StatCard[] = [
  { key: 'uniqueClientCount', label: 'Unique Clients', Icon: Users, color: 'text-[#0e76bc]', bgColor: 'bg-[#e8f4fd]' },
  { key: 'users', label: 'Users', Icon: UserCheck, color: 'text-[#17a2b8]', bgColor: 'bg-[#e3f6f9]' },
  { key: 'leads', label: 'Leads', Icon: TrendingUp, color: 'text-[#007bff]', bgColor: 'bg-[#e6f0ff]' },
  { key: 'students', label: 'Students', Icon: GraduationCap, color: 'text-[#00b5ad]', bgColor: 'bg-[#e0f5f4]' },
  { key: 'visaApplicants', label: 'Visa Applicants', Icon: Globe, color: 'text-[#28a745]', bgColor: 'bg-[#e3f5e8]' },
  { key: 'skillAssessments', label: 'Skill Assessments', Icon: ClipboardList, color: 'text-[#fd7e14]', bgColor: 'bg-[#fff3e6]' },
  { key: 'insuranceApplicants', label: 'Insurance', Icon: ShieldCheck, color: 'text-[#ffc107]', bgColor: 'bg-[#fff9e6]' },
  { key: 'tribunalReview', label: 'Tribunal Review', Icon: Scale, color: 'text-[#dc3545]', bgColor: 'bg-[#fde8ea]' },
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
        : STAT_CARDS.map(({ key, label, Icon, color, bgColor }) => (
            <CardContainer key={key}>
              <div className="flex items-start gap-3">
                <div className={`${bgColor} rounded-lg p-2.5`}>
                  <Icon className={`${color} w-5 h-5`} />
                </div>
                <div className="flex flex-col">
                  <p className="text-c1 text-content-subtitle">{label}</p>
                  <p className="text-h4 font-bold text-content-heading">
                    {data?.counts[key]?.toLocaleString() ?? '—'}
                  </p>
                </div>
              </div>
            </CardContainer>
          ))}
    </div>
  );
};

export default AdminStatCards;
