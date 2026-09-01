import React, { forwardRef } from 'react';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import FormErrorMessage from '../atoms/form-error-message';

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  id?: string;
  label?: string;
  error?: string;
};

const TextInput = forwardRef<HTMLInputElement, Props>(({ label, id, error, required, className, ...rest }, ref) => {
  const inputId = id || 'text-input';

  return (
    <div className="grid w-full items-center gap-2">
      {label && (
        <Label htmlFor={inputId} className="text-b3-b font-semibold">
          {label}
          {required && <span className="text-red-500"> *</span>}
        </Label>
      )}

      <Input id={inputId} ref={ref} required={required} aria-invalid={!!error} {...rest} className={className} />

      <FormErrorMessage message={error} />
    </div>
  );
});

TextInput.displayName = 'TextInput';

export default TextInput;
