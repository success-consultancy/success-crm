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
  '#EF7722', // January
  '#DF2E38', // February
  '#A56C47', // March
  '#3674B5', // April
  '#A459D1', // May
  '#2CD3E1', // June
  '#F266AB', // July
  '#57564F', // August
  '#FCC61D', // September
  '#03A791', // October
  '#87A922', // November
  '#2192FF', // December
];

export const DateWithIndicator = ({ date, format = 'MMM yyyy', className }: DateWithIndicatorProps) => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const month = dateObj.getMonth(); // 0-11
  const dotColor = MONTH_COLORS[month];

  return (
    <span className={cn('inline-flex items-center', className)}>
      <DotIcon className={cn('inline-block mr-2')} style={{color: dotColor}} />
      <span className="ml-0.5">{formatDate(dateObj, format)}</span>
    </span>
  );
};
