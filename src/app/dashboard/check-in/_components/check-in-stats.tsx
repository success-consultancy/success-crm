'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { useGetCheckInStats } from '@/query/get-check-in-stats';

const formatWaitTime = (minutes?: number) => {
  if (minutes === undefined || minutes === null || isNaN(minutes)) return '—';
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
};

const StatCard = ({
  title,
  value,
  isLoading,
}: {
  title: string;
  value: string | number;
  isLoading: boolean;
}) => (
  <div className="flex-1 min-w-0 bg-white border border-stroke-divider rounded-lg p-5">
    <p className="text-sm text-content-subtitle font-normal">{title}</p>
    {isLoading ? (
      <Skeleton className="h-9 w-20 mt-3" />
    ) : (
      <p className="text-[2rem] font-bold text-content-heading leading-none mt-3">{value}</p>
    )}
  </div>
);

const CheckInStats = () => {
  const { data, isLoading } = useGetCheckInStats();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
      <StatCard
        title="Total Check-ins"
        value={data?.totalCheckIns?.toLocaleString() ?? '—'}
        isLoading={isLoading}
      />
      <StatCard
        title="Total Waiting"
        value={data?.totalWaiting?.toLocaleString() ?? '—'}
        isLoading={isLoading}
      />
      <StatCard
        title="Total Completed"
        value={data?.totalCompleted?.toLocaleString() ?? '—'}
        isLoading={isLoading}
      />
      <StatCard
        title="Average Wait Time"
        value={formatWaitTime(data?.averageWaitTime)}
        isLoading={isLoading}
      />
    </div>
  );
};

export default CheckInStats;
