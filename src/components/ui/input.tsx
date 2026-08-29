import * as React from 'react';

import { cn } from '@/lib/utils';

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        'file:text-foreground placeholder:text-neutral-light-grey selection:bg-primary selection:text-primary-foreground flex h-10 w-full min-w-0 rounded-[4px] border border-neutral-border bg-transparent px-3 py-1 text-base text-neutral-black transition-colors outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium md:text-b14',
        // States per the design file: hover, focus, error, disabled
        'hover:border-neutral-black focus:border-primary-blue',
        'aria-invalid:border-utility-red hover:aria-invalid:border-utility-red focus:aria-invalid:border-utility-red',
        'disabled:pointer-events-none disabled:cursor-not-allowed disabled:border-neutral-border disabled:bg-gray-50 disabled:text-neutral-black/50 disabled:placeholder:text-neutral-light-grey/50',
        className,
      )}
      {...props}
    />
  );
}

export { Input };
