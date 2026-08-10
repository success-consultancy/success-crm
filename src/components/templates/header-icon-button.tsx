'use client';

import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface Props extends React.ComponentProps<'button'> {
  /** Unread/outstanding count. Hidden at 0, capped at "9+". */
  count?: number;
}

/**
 * Shared header affordance for the notification bells and the tasks drawer.
 * Carries the app's interaction states — hover/active use the same accent pair
 * as the `tertiary` button variant, and `data-[state=open]` keeps the trigger
 * lit while its popover is showing.
 */
const HeaderIconButton = forwardRef<HTMLButtonElement, Props>(function HeaderIconButton(
  { count = 0, className, children, ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      type="button"
      className={cn(
        'relative flex size-9 shrink-0 items-center justify-center rounded-lg cursor-pointer',
        'text-neutral-dark-grey transition-all duration-150',
        'hover:bg-accent-50 hover:text-neutral-black',
        'active:bg-accent-100 motion-safe:active:scale-95',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40',
        'data-[state=open]:bg-accent-100 data-[state=open]:text-neutral-black',
        className,
      )}
      {...props}
    >
      {children}
      {count > 0 && (
        <span className="absolute top-0.5 right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary-red px-1 text-[10px] font-semibold text-white">
          {count > 9 ? '9+' : count}
        </span>
      )}
    </button>
  );
});

export default HeaderIconButton;
