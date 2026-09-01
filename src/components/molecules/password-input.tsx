'use client';

// External Packages
import React, { forwardRef, useState } from 'react';
import { Eye, EyeSlash } from 'iconsax-reactjs';

// UI Components
import FormErrorMessage from '../atoms/form-error-message';
import { Label } from '../ui/label';
import { Input } from '../ui/input';

// Utilities
import { cn } from '@/lib/utils';

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  id?: string;
  label?: string;
  error?: string;
};

const PasswordInput = forwardRef<HTMLInputElement, Props>(
  ({ label = 'Password', id, error, required, className, ...rest }, ref) => {
    const inputId = id || 'password-input';
    const [showPassword, setShowPassword] = useState(false);

    return (
      <div className="grid w-full items-center gap-2">
        {label && (
          <Label htmlFor={inputId} className="text-b3-b font-semibold">
            {label}
            {required && <span className="text-red-500"> *</span>}
          </Label>
        )}

        <div className="relative">
          <Input
            id={inputId}
            ref={ref}
            required={required}
            aria-invalid={!!error}
            type={showPassword ? 'text' : 'password'}
            {...rest}
            className={cn('pr-10', className)}
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none cursor-pointer"
            tabIndex={-1}
          >
            {showPassword ? <Eye size={18} /> : <EyeSlash size={18} />}
          </button>
        </div>

        <FormErrorMessage message={error} />
      </div>
    );
  },
);

PasswordInput.displayName = 'PasswordInput';

export default PasswordInput;
