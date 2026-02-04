'use client';

import React, { Dispatch, ReactNode, SetStateAction } from 'react';

import { cn } from '@/lib/utils';
import useCombinedRefs from '@/hooks/use-combined-refs';
import { Input as ShadInput } from '@/components/ui/input';
import Tooltip from '../atoms/tooltip';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  disabledTooltip?: string | React.ReactNode;
  label?: React.ReactNode;
  info?: string;
  error?: string;
  LeftIcon?: React.FC<React.ComponentProps<'svg'>> | React.FC<React.ComponentProps<'button'>>;
  RightIcon?: React.FC<React.ComponentProps<'svg'>> | React.FC<React.ComponentProps<'button'>>;
  conatinerClassName?: string;
  className?: string;
  leftSection?: React.ReactNode;
  rightSection?: React.ReactNode;
  errorBorder?: boolean;
  optionalText?: boolean;
  classNames?: {
    label?: string;
    info?: string;
    container?: string;
    leftIcon?: string;
    rightIcon?: string;
    input?: string;
    error?: string;
    wrapper?: string;
  };
  children?: ReactNode;
  onIconClick?: Dispatch<SetStateAction<boolean>>;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      disabledTooltip,
      label,
      error,
      info,
      LeftIcon,
      RightIcon,
      leftSection,
      rightSection,
      className,
      classNames,
      optionalText,
      onFocus,
      onBlur,
      errorBorder,
      children,
      onIconClick,
      ...props
    },
    forwardedRef,
  ) => {
    const [isInputFocused, setIsInputFocused] = React.useState(false);

    const inputRef = React.useRef<HTMLInputElement>(null);

    const combinedRef = useCombinedRefs(inputRef, forwardedRef as React.MutableRefObject<HTMLInputElement>);

    // handlers
    const handleinputFocus: React.FocusEventHandler<HTMLInputElement> = (e) => {
      onFocus?.(e);
      setIsInputFocused(true);
    };

    const handleinputBlur: React.FocusEventHandler<HTMLInputElement> = (e) => {
      onBlur?.(e);
      setIsInputFocused(false);
    };

    return (
      <div className={cn(['inline-grid w-full items-center gap-1', className, classNames?.wrapper])}>
        {label && (
          <label
            className={cn(['text-b3-b font-semibold', props.disabled && 'text-content-disabled', classNames?.label])}
          >
            {label} {optionalText && <span className="text-content-placeholder font-normal">(Optional)</span>}
          </label>
        )}

        <Tooltip
          hidden={!disabledTooltip || !props.disabled}
          side="bottom"
          trigger={
            <div
              className={cn([
                'flex-between group rounded-md border border-input',
                props.disabled && '',
                // ? focused class
                isInputFocused ? ['border-black-40'] : 'hover:border-black-20',
                (error || errorBorder) && ['border-primary-red'],
                // ? rest classes
                classNames?.container,
              ])}
            >
              {LeftIcon && (
                <LeftIcon
                  className={cn(['mx-2 w-5 h-5 text-icon-default', classNames?.leftIcon])}
                  onClick={
                    props.disabled || props.readOnly
                      ? undefined
                      : onIconClick
                        ? (onIconClick as unknown as React.MouseEventHandler<SVGSVGElement> &
                          React.MouseEventHandler<HTMLButtonElement>)
                        : (props?.onClick as React.MouseEventHandler<SVGSVGElement> &
                          React.MouseEventHandler<HTMLButtonElement>)
                  }
                />
              )}
              {!!leftSection && leftSection}

              <ShadInput
                onFocus={handleinputFocus}
                onBlur={handleinputBlur}
                ref={combinedRef}
                className={cn([
                  'border-none px-2 focus:outline-none !bg-transparent',
                  classNames?.input,
                  !!LeftIcon && 'pl-0',
                  !!RightIcon && 'pr-0',
                ])}
                {...props}
              />

              {!!rightSection && rightSection}

              {RightIcon && (
                <RightIcon
                  className={cn(['mx-2 w-5 h-5  text-icon-default', classNames?.rightIcon])}
                  onClick={
                    props.disabled || props.readOnly
                      ? undefined
                      : onIconClick
                        ? (onIconClick as unknown as React.MouseEventHandler<SVGSVGElement> &
                          React.MouseEventHandler<HTMLButtonElement>)
                        : (props?.onClick as React.MouseEventHandler<SVGSVGElement> &
                          React.MouseEventHandler<HTMLButtonElement>)
                  }
                />
              )}
            </div>
          }
        >
          {disabledTooltip}
        </Tooltip>

        {info && !error && (
          <div className={cn(['text-b2 text-content-placeholder mt-1', classNames?.info])}>{info}</div>
        )}
        {error && <div className={cn(['text-sm text-primary-red mt-1', classNames?.error])}>{error}</div>}
        {children}
      </div>
    );
  },
);

Input.displayName = 'Input';

export type { InputProps };
export default Input;
