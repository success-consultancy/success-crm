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
import Container from '@/components/atoms/container';
import CardContainer from '@/components/atoms/card-container';
import Portal from '@/components/atoms/portal';
import { PortalIds } from '@/config/portal';

interface StatCard {
  key: keyof DashboardCounts;
  label: string;
  Icon: LucideIcon;
}

const STAT_CARDS: StatCard[] = [
  { key: 'uniqueClientCount', label: 'Unique Clients', Icon: Users },
  { key: 'users', label: 'Users', Icon: UserCheck },
  { key: 'leads', label: 'Leads', Icon: TrendingUp },
  { key: 'students', label: 'Students', Icon: GraduationCap },
  { key: 'visaApplicants', label: 'Visa Applicants', Icon: Globe },
  { key: 'skillAssessments', label: 'Skill Assessments', Icon: ClipboardList },
  { key: 'insuranceApplicants', label: 'Insurance', Icon: ShieldCheck },
  { key: 'tribunalReview', label: 'Tribunal Review', Icon: Scale },
];

const DashboardPage = () => {
  const { data, isLoading } = useGetDashboard();

  return (
    <Container>
      <Portal rootId={PortalIds.DashboardHeader}>
        <h3 className="text-h5 text-content-heading font-bold">Dashboard</h3>
      </Portal>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {isLoading
          ? Array.from({ length: 8 }).map((_, i) => (
              <CardContainer key={i}>
                <div className="animate-pulse space-y-3">
                  <div className="h-8 w-8 bg-gray-200 rounded" />
                  <div className="h-4 w-24 bg-gray-200 rounded" />
                  <div className="h-8 w-16 bg-gray-200 rounded" />
                </div>
              </CardContainer>
            ))
          : STAT_CARDS.map(({ key, label, Icon }) => (
              <CardContainer key={key}>
                <div className="flex flex-col gap-2">
                  <Icon className="text-primary w-8 h-8" />
                  <p className="text-sm text-gray-500">{label}</p>
                  <p className="text-3xl font-bold text-content-heading">
                    {data?.counts[key]?.toLocaleString() ?? '—'}
                  </p>
                </div>
              </CardContainer>
            ))}
      </div>
    </Container>
  );
};

export default DashboardPage;
