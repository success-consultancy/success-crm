import { Loader2 } from 'lucide-react';

import { cn } from '@/lib/utils';

type SpinnerSize = 'sm' | 'md' | 'lg';

interface SpinnerProps {
  size?: SpinnerSize;
  className?: string;
}

const SIZES: Record<SpinnerSize, string> = {
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-10 w-10',
};

/** The one spinner in the app. Use for actions and full-section loads; use skeletons inside tables and cards. */
export const Spinner = ({ size = 'md', className }: SpinnerProps) => (
  <Loader2 aria-hidden className={cn('animate-spin text-primary-blue', SIZES[size], className)} />
);

export default Spinner;
