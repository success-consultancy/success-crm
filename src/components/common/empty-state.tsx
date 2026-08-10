import { ReactNode } from 'react';
import EmptyAgreementIcon from '@/assets/icons/empty-agreement-icon';
import { cn } from '@/lib/utils';

type EmptyStateSize = 'sm' | 'md';

interface EmptyStateProps {
  /** Defaults to the shared illustration. Pass a feature illustration to override. */
  icon?: ReactNode;
  title?: string;
  description?: string;
  /** Optional call to action rendered below the description. */
  action?: ReactNode;
  /** `sm` for cards, drawers and inline panels; `md` (default) for full page tables. */
  size?: EmptyStateSize;
  className?: string;
}

const SIZES: Record<EmptyStateSize, { wrapper: string; illustration: string }> = {
  sm: { wrapper: 'py-10', illustration: 'scale-75' },
  md: { wrapper: 'py-16', illustration: '' },
};

export const EmptyState = ({
  icon = <EmptyAgreementIcon />,
  title = 'No data found',
  description,
  action,
  size = 'md',
  className,
}: EmptyStateProps) => {
  const styles = SIZES[size];

  return (
    <div className={cn('flex flex-col items-center justify-center text-center', styles.wrapper, className)}>
      <div className={styles.illustration}>{icon}</div>
      <h3 className="mt-4 text-b16-600 text-neutral-black">{title}</h3>
      {description && <p className="mt-1 max-w-xs text-b14 text-neutral-light-grey">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
};

export default EmptyState;
