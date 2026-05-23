import React, { forwardRef } from 'react';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import FormErrorMessage from '../atoms/form-error-message';
import { cn } from '@/lib/utils';

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  id?: string;
  label?: string;
  error?: string;
};

const TextInput = forwardRef<HTMLInputElement, Props>(({ label, id, error, required, className, ...rest }, ref) => {
  const inputId = id || 'text-input';

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <Label htmlFor={inputId} className="text-b3-b font-semibold">
          {label}
          {required && <span className="text-red-500"> *</span>}
        </Label>
      )}

      <Input
        id={inputId}
        ref={ref}
        required={required}
        {...rest}
        className={cn(
          'w-full rounded-md border px-3 py-2 focus:border-primary',
          error ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-primary',
          className,
        )}
      />

      <FormErrorMessage message={error} />
    </div>
  );
});

TextInput.displayName = 'TextInput';

export default TextInput;
