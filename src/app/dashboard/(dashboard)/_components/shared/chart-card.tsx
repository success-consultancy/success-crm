'use client';

import React from 'react';
import CardContainer from '@/components/atoms/card-container';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface ChartCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  headerRight?: React.ReactNode;
  isLoading?: boolean;
}

const ChartCardSkeleton = () => (
  <div className="space-y-4">
    <Skeleton className="h-4 w-32" />
    <Skeleton className="h-[300px] w-full" />
  </div>
);

const ChartCard = ({ title, children, className, headerRight, isLoading }: ChartCardProps) => {
  return (
    <CardContainer className={cn('border-neutral-border-light rounded-2xl p-5', className)}>
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-b16-600 text-neutral-black">{title}</h4>
        {headerRight}
      </div>
      {isLoading ? <ChartCardSkeleton /> : children}
    </CardContainer>
  );
};

export default ChartCard;
