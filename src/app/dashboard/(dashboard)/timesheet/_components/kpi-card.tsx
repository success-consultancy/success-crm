'use client';

import { TrendingDown, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
  label: string;
  value: string | number;
  delta: { label: string; positive: boolean };
  comparisonLabel: string;
  spark?: 'up' | 'down';
}

const Sparkline = ({ trend }: { trend: 'up' | 'down' }) => {
  const stroke = trend === 'up' ? '#16a34a' : '#dc2626';
  const path = trend === 'up' ? 'M2 24 L14 18 L26 22 L40 8 L60 14 L78 4' : 'M2 6 L18 14 L32 8 L48 22 L62 18 L78 26';
  return (
    <svg width="80" height="32" viewBox="0 0 80 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d={path} stroke={stroke} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

const KpiCard = ({ label, value, delta, comparisonLabel, spark = 'up' }: Props) => {
  const TrendIcon = delta.positive ? TrendingUp : TrendingDown;
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-4 flex-1 min-w-0">
      <p className="text-xs text-gray-500 font-medium">{label}</p>
      <div className="mt-2 flex items-end justify-between gap-2">
        <div className="min-w-0">
          <h3 className="text-2xl font-semibold text-gray-900 leading-none">{value}</h3>
          <p
            className={cn(
              'mt-1.5 text-xs font-medium flex items-center gap-1',
              delta.positive ? 'text-green-600' : 'text-red-600',
            )}
          >
            <TrendIcon className="w-3 h-3" strokeWidth={2.25} />
            {delta.label}
            <span className="text-gray-400 font-normal ml-1">{comparisonLabel}</span>
          </p>
        </div>
        <Sparkline trend={spark} />
      </div>
    </div>
  );
};

export default KpiCard;
