import React from 'react';
import { cn } from '@/lib/utils';
import { Icon } from 'iconsax-react';
import { Button as ShadButton, ButtonProps as IButtonProps } from '@/components/ui/button';

interface ButtonProps extends IButtonProps {
  disabled?: boolean;
  loading?: boolean;
  iconClass?: string;
  iconColor?: string;
  LeftIcon?: React.FC<React.ComponentProps<'svg'>> | Icon;
  RightIcon?: React.FC<React.ComponentProps<'svg'>> | Icon;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ RightIcon, LeftIcon, loading, iconClass, iconColor, children, className, ...props }, ref) => {
    return (
      <ShadButton
        ref={ref}
        loading={loading}
        className={cn([
          className,
          // adjust padding based on icon presence
          [!!LeftIcon && ['pl-3.5']],
          [!!RightIcon && ['pr-3.5']],
        ])}
        {...props}
      >
        {LeftIcon && <LeftIcon className={cn('mr-1', iconClass)} color={iconColor} />}

        {children}

        {RightIcon && <RightIcon className={cn('ml-1', iconClass)} color={iconColor} />}
      </ShadButton>
    );
  },
);

Button.displayName = 'Button';

export type { ButtonProps };
export default Button;
