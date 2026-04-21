import { cn } from '@/lib/utils';

function Sparkline({ positive }: { positive: boolean }) {
  return (
    <svg width="64" height="32" viewBox="0 0 64 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      {positive ? (
        <path
          d="M2 26 C10 22, 16 16, 24 12 C32 8, 36 14, 44 8 C50 4, 56 6, 62 2"
          stroke="#22c55e"
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ) : (
        <path
          d="M2 6 C8 8, 14 14, 22 18 C30 22, 36 18, 44 22 C50 25, 56 22, 62 28"
          stroke="#ef4444"
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
    </svg>
  );
}

interface KpiCardProps {
  title: string;
  value: string | number;
  change: number;
  changeLabel?: string;
}

export default function KpiCard({ title, value, change, changeLabel = 'vs last year' }: KpiCardProps) {
  const isPositive = change >= 0;
  return (
    <div className="flex-1 min-w-0 bg-white border border-stroke-divider rounded-lg p-5 shadow-[0px_4px_16px_rgba(0,0,0,0.08)]">
      <p className="text-sm text-content-subtitle font-normal">{title}</p>
      <div className="flex items-end justify-between mt-5">
        <div>
          <p className="text-[2rem] font-bold text-content-heading leading-none mb-3">{value}</p>
          <div className="flex items-center gap-1.5">
            <span className={cn('text-[13px] font-semibold', isPositive ? 'text-green-500' : 'text-red-500')}>
              {isPositive ? '+' : ''}
              {change}%
            </span>
            <span className="text-[13px] text-content-subtitle">{changeLabel}</span>
          </div>
        </div>
        <Sparkline positive={isPositive} />
      </div>
    </div>
  );
}
