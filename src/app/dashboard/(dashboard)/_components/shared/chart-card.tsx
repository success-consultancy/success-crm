'use client';

import React from 'react';
import CardContainer from '@/components/atoms/card-container';
import { cn } from '@/lib/utils';

interface ChartCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  headerRight?: React.ReactNode;
  isLoading?: boolean;
}

const ChartCardSkeleton = () => (
  <div className="animate-pulse space-y-4">
    <div className="h-4 w-32 bg-gray-200 rounded" />
    <div className="h-[300px] bg-gray-100 rounded" />
  </div>
);

const ChartCard = ({ title, children, className, headerRight, isLoading }: ChartCardProps) => {
  return (
    <CardContainer className={cn('p-5', className)}>
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-b14-600 text-neutral-black">{title}</h4>
        {headerRight}
      </div>
      {isLoading ? <ChartCardSkeleton /> : children}
    </CardContainer>
  );
};

export default ChartCard;
