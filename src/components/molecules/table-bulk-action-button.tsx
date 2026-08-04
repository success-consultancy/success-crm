'use client';

import React from 'react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

// Shared look for the selection-toolbar icons (email / move / delete) so all three share
// one resting, hover and pressed state. Icons render at 20px in #484848.
const iconButtonClass =
  'flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-md text-neutral-dark-grey transition-colors hover:bg-component-hovered-light active:bg-primary-faded active:text-primary disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:size-5';

// Held while the action's menu is open (the pressed look, kept on).
const iconButtonActiveClass = 'bg-primary-faded text-primary';

type Props = React.ComponentProps<'button'> & {
  label: string;
  active?: boolean;
};

/**
 * Icon button for the table's selection toolbar, with a dark hover tooltip.
 * Forwards ref/props so it can be used directly as a Radix `asChild` trigger.
 */
export const BulkActionIconButton = React.forwardRef<HTMLButtonElement, Props>(
  ({ label, active, className, children, ...props }, ref) => (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          ref={ref}
          type="button"
          aria-label={label}
          className={cn(iconButtonClass, active && iconButtonActiveClass, className)}
          {...props}
        >
          {children}
        </button>
      </TooltipTrigger>
      <TooltipContent
        side="bottom"
        className="bg-neutral-black text-white-100 [&_svg]:bg-neutral-black [&_svg]:fill-neutral-black"
      >
        {label}
      </TooltipContent>
    </Tooltip>
  ),
);

BulkActionIconButton.displayName = 'BulkActionIconButton';
