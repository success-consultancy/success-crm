'use client';

import React from 'react';
import CardContainer from '@/components/atoms/card-container';
import { useGetLeadStats } from '@/query/get-stats-lead';
import { UserPlus02, UserCheck02, ClockFastForward, UserMinus02 } from '@untitledui/icons';

const STAT_CONFIG = [
  {
    key: 'totalCount' as const,
    label: 'Assigned Clients',
    Icon: UserPlus02,
    bgColor: 'bg-[#ebedff]',
    iconColor: 'text-[#001aff]',
  },
  {
    key: 'convertedCount' as const,
    label: 'Converted',
    Icon: UserCheck02,
    bgColor: 'bg-[#e4f9fa]',
    iconColor: 'text-[#007b93]',
  },
  {
    key: 'inProgressCount' as const,
    label: 'In Progress',
    Icon: ClockFastForward,
    bgColor: 'bg-[#fff5eb]',
    iconColor: 'text-[#ff7400]',
  },
  {
    key: 'notConvertedCount' as const,
    label: 'Not Converted',
    Icon: UserMinus02,
    bgColor: 'bg-[#fceef4]',
    iconColor: 'text-[#fb0b7b]',
  },
];

const MyStatCards = () => {
  const { data, isLoading } = useGetLeadStats();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {isLoading
        ? Array.from({ length: 4 }).map((_, i) => (
            <CardContainer key={i} className="rounded-xl shadow-[0_1px_1px_rgba(10,13,18,0.05)] px-5 pt-4 pb-5">
              <div className="animate-pulse space-y-3">
                <div className="h-8 w-8 bg-gray-200 rounded-lg" />
                <div className="h-3 w-20 bg-gray-200 rounded" />
                <div className="h-7 w-14 bg-gray-200 rounded" />
              </div>
            </CardContainer>
          ))
        : STAT_CONFIG.map(({ key, label, Icon, bgColor, iconColor }) => (
            <CardContainer key={key} className="rounded-xl shadow-[0_1px_1px_rgba(10,13,18,0.05)] px-5 pt-4 pb-5">
              <div className="flex items-start justify-between gap-[18px]">
                <div className="flex flex-col gap-[18px] min-w-0">
                  <p className="text-b13-500 text-neutral-black">{label}</p>
                  <p className="text-h4 font-semibold text-neutral-black">
                    {(data?.total?.[key] ?? 0).toLocaleString()}
                  </p>
                </div>
                <div className={`${bgColor} rounded-lg p-2 shrink-0`}>
                  <Icon className={`${iconColor} w-4 h-4`} />
                </div>
              </div>
            </CardContainer>
          ))}
    </div>
  );
};

export default MyStatCards;
