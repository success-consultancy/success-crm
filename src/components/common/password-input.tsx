import React from 'react';
import { Eye, EyeSlash } from 'iconsax-react';

import Input, { InputProps } from '@/components/common/input';

type PasswordInput = Omit<InputProps, 'type'>;

const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInput>(({ ...props }, ref) => {
  const [showPassword, setShowPassword] = React.useState<boolean>(false);

  const ToggleEye = () => {
    return (
      <button
        type="button"
        className="h-inherit flex cursor-pointer items-center justify-center px-2"
        onClick={() => setShowPassword((prevValue) => !prevValue)}
      >
        {!showPassword ? (
          <EyeSlash className="text-icon-default h-5 w-5" />
        ) : (
          <Eye className="text-icon-default h-5 w-5" />
        )}
      </button>
    );
  };

  return (
    <Input
      ref={ref}
      type={showPassword ? 'text' : 'password'}
      RightIcon={props.value ? ToggleEye : undefined}
      {...props}
    />
  );
});

export default PasswordInput;
