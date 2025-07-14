import React from 'react';
import { cn } from '@/lib/cn';
import { Icon } from 'iconsax-react';
import { Button as ShadButton, ButtonProps as IButtonProps } from '@/components/ui/button';
import { Loader2 } from 'lucide-react'; // Spinner icon

interface ButtonProps extends IButtonProps {
  loading?: boolean;
  loadingText?: string;
  iconClass?: string;
  iconColor?: string;
  LeftIcon?: React.FC<React.ComponentProps<'svg'>> | Icon;
  RightIcon?: React.FC<React.ComponentProps<'svg'>> | Icon;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { RightIcon, LeftIcon, loading, loadingText, iconClass, iconColor, children, className, disabled, ...props },
    ref,
  ) => {
    return (
      <ShadButton
        ref={ref}
        disabled={disabled || loading}
        className={cn([className, !!LeftIcon && 'pl-3.5', !!RightIcon && 'pr-3.5'])}
        {...props}
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <Loader2 className={cn('animate-spin', iconClass)} color={iconColor} size={16} />
            {loadingText || 'Loading...'}
          </span>
        ) : (
          <>
            {LeftIcon && <LeftIcon className={cn('mr-1', iconClass)} color={iconColor} />}
            {children}
            {RightIcon && <RightIcon className={cn('ml-1', iconClass)} color={iconColor} />}
          </>
        )}
      </ShadButton>
    );
  },
);

Button.displayName = 'Button';

export type { ButtonProps };
export default Button;
