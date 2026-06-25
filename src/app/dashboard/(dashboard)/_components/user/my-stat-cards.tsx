'use client';

import React from 'react';
import CardContainer from '@/components/atoms/card-container';
import { useGetLeadStats } from '@/query/get-stats-lead';
import { Users, Loader, CheckCircle, XCircle } from 'lucide-react';

const STAT_CONFIG = [
  {
    key: 'totalCount' as const,
    label: 'Total Leads',
    Icon: Users,
    bgColor: 'bg-[#D3F3FB]',
    textColor: 'text-[#2778C4]',
    iconColor: 'text-[#2778C4]',
  },
  {
    key: 'inProgressCount' as const,
    label: 'In Progress',
    Icon: Loader,
    bgColor: 'bg-[#ECE8FE]',
    textColor: 'text-[#837DF8]',
    iconColor: 'text-[#837DF8]',
  },
  {
    key: 'convertedCount' as const,
    label: 'Converted',
    Icon: CheckCircle,
    bgColor: 'bg-[#DDF5ED]',
    textColor: 'text-[#3f9e60]',
    iconColor: 'text-[#63CA9E]',
  },
  {
    key: 'notConvertedCount' as const,
    label: 'Not Converted',
    Icon: XCircle,
    bgColor: 'bg-[#FDE8EA]',
    textColor: 'text-[#dc3545]',
    iconColor: 'text-[#dc3545]',
  },
];

const MyStatCards = () => {
  const { data, isLoading } = useGetLeadStats();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {isLoading
        ? Array.from({ length: 4 }).map((_, i) => (
            <CardContainer key={i}>
              <div className="animate-pulse space-y-3">
                <div className="h-10 w-10 bg-gray-200 rounded-full" />
                <div className="h-3 w-20 bg-gray-200 rounded" />
                <div className="h-7 w-14 bg-gray-200 rounded" />
              </div>
            </CardContainer>
          ))
        : STAT_CONFIG.map(({ key, label, Icon, bgColor, textColor, iconColor }) => {
            const value = data?.total?.[key] ?? 0;
            return (
              <CardContainer key={key}>
                <div className="flex items-start gap-3">
                  <div className={`${bgColor} rounded-full p-2.5`}>
                    <Icon className={`w-5 h-5 ${iconColor}`} />
                  </div>
                  <div className="flex flex-col">
                    <p className="text-c1 text-content-subtitle">{label}</p>
                    <p className={`text-h4 font-bold ${textColor}`}>{Number(value).toLocaleString()}</p>
                  </div>
                </div>
              </CardContainer>
            );
          })}
    </div>
  );
};

export default MyStatCards;
