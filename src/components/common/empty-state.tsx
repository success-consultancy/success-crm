import { ReactNode } from 'react';
import { Inbox01 } from '@untitledui/icons';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  icon?: ReactNode;
  title?: string;
  description?: string;
  className?: string;
}

export const EmptyState = ({
  icon = <Inbox01 className="h-12 w-12 text-gray-300" />,
  title = 'No data found',
  description = 'There are no records to display.',
  className,
}: EmptyStateProps) => (
  <div className={cn('flex flex-col items-center justify-center py-16 text-center', className)}>
    {icon}
    <h3 className="mt-4 text-base font-semibold text-gray-800">{title}</h3>
    <p className="mt-1 text-sm text-gray-500 max-w-xs">{description}</p>
  </div>
);

export default EmptyState;
