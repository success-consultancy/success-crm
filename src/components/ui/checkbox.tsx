'use client';

import * as React from 'react';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { CheckIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
interface CheckboxProps extends React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> {
  icon?: React.ElementType;
}

function Checkbox({ className, icon: Icon, ...props }: CheckboxProps) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        '!w-5 !h-5 peer !bg-white border-neutral-border border-2 dark:bg-input/30 data-[state=checked]:bg-background data-[state=checked]:text-primary dark:data-[state=checked]:bg-background data-[state=checked]:border-primary data-[state=checked]:border-2 data-[state=checked]:ring-primary/20 focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive size-4 shrink-0 rounded-[4px] transition-shadow outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50',
        Icon && 'text-primary border-primary',
        className,
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="flex items-center justify-center text-current transition-none"
      >
        {Icon ? <Icon className="size-3.5 stroke-[3]" /> : <CheckIcon className="size-3.5 stroke-[3]" />}
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

export { Checkbox };
