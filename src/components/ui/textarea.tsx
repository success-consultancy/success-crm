import * as React from 'react';

import { cn } from '@/lib/utils';
import FormErrorMessage from '../atoms/form-error-message';
import { Label } from './label';

function Textarea({
  className,
  error,
  label,
  ...props
}: React.ComponentProps<'textarea'> & {
  error?: string;
  label?: string;
  className?: string;
}) {
  return (
    <div className="flex flex-col space-y-1">
      <Label
        data-slot="label"
        className={cn('text-b14-600 text-neutral-black', props.disabled && 'text-neutral-black/40')}
      >
        {label}
      </Label>
      <textarea
        data-slot="textarea"
        className={cn(
          'placeholder:text-neutral-light-grey flex field-sizing-content min-h-32 w-full rounded-[4px] border border-neutral-border bg-transparent px-3 py-2 text-base text-neutral-black transition-colors outline-none md:text-b14',
          // States per the design file: hover, focus, error, disabled
          'hover:border-neutral-black focus:border-primary-blue',
          error && 'border-utility-red hover:border-utility-red focus:border-utility-red',
          'disabled:cursor-not-allowed disabled:border-neutral-border disabled:bg-gray-50 disabled:text-neutral-black/50 disabled:placeholder:text-neutral-light-grey/50',
          className,
        )}
        {...props}
      />
      <FormErrorMessage message={error} />
    </div>
  );
}

export { Textarea };
