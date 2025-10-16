import { formatDate } from 'date-fns';
import { cn } from '@/lib/utils';
import DotIcon from '@/assets/icons/dot-icon';

interface DateWithIndicatorProps {
  date: string | Date;
  format?: string;
  className?: string;
}

// Color palette for each month (12 distinct colors)
const MONTH_COLORS = [
  'text-red-500', // January
  'text-pink-500', // February
  'text-purple-500', // March
  'text-indigo-500', // April
  'text-blue-500', // May
  'text-cyan-500', // June
  'text-teal-500', // July
  'text-green-500', // August
  'text-lime-500', // September
  'text-yellow-500', // October
  'text-orange-500', // November
  'text-rose-500', // December
];

export const DateWithIndicator = ({ date, format = 'MMM yyyy', className }: DateWithIndicatorProps) => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const month = dateObj.getMonth(); // 0-11
  const dotColor = MONTH_COLORS[month];

  return (
    <span className={cn('inline-flex items-center', className)}>
      <DotIcon className={cn('inline-block mr-2', dotColor)} />
      <span className="ml-0.5">{formatDate(dateObj, format)}</span>
    </span>
  );
};
