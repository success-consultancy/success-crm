'use client';

import * as React from 'react';
import { format } from 'date-fns';
import { PopoverAnchor, PopoverArrow } from '@radix-ui/react-popover';

import { cn } from '@/lib/utils';
import Input from '@/components/molecules/input';
import { Popover, PopoverContent } from '@/components/ui/popover';
import { DATE_FORMATS } from '@/config/date-formats';
import { CalendarIcon } from 'lucide-react';
import Button from '@/components/atoms/button';
import { Calendar, CalendarProps } from '../ui/calendar';

export type DateValidationRules = {
  disabledDates?: {
    // Disable all dates before and after this date
    before?: Date;
    after?: Date;
  };
  // The starting and ending month for the calendar view (for limiting the calendar range default 100 year past and future)
  fromMonth?: Date;
  toMonth?: Date;

  // Custom function to validate if a date should be disabled. It will override other rules.
  // The function should return true to disable the date and false to keep it selectable
  customValidation?: (date: Date) => boolean;
};

type DatePickerProps = {
  disabledInput?: boolean;
  inputClassName?: {
    label?: string;
    info?: string;
    container?: string;
    leftIcon?: string;
    rightIcon?: string;
    input?: string;
    error?: string;
    wrapper?: string;
  };
  label?: string;
  placeholder?: string;
  className?: string;
  labelClassName?: string;
  buttonClassName?: string;
  error?: string;
  errorBorder?: boolean;
  optionalText?: boolean;
  disablePicker?: boolean;
  version?: number;
} & CalendarProps & { validationRules?: DateValidationRules };

const DatePicker: React.FC<DatePickerProps> = ({
  inputClassName,
  disabledInput,
  error,
  label,
  placeholder,
  className,
  labelClassName,
  buttonClassName,
  errorBorder,
  optionalText,
  disablePicker,
  version,
  ...calenderProps
}) => {
  const [show, setShow] = React.useState(false);
  const FORMATTED_DATE = !!calenderProps.selected
    ? format(calenderProps.selected as Date, DATE_FORMATS.FULL_DATE_WITH_DAY)
    : undefined;

  return (
    <>
      <div className={cn(['', className])}>
        <Popover modal={true} open={show} onOpenChange={setShow}>
          <PopoverAnchor>
            {/* The click handler lives on the wrapper: Input drops the icon's own
                onClick while readOnly, so the calendar icon would otherwise be dead. */}
            <div onClick={() => !disabledInput && !show && setShow(true)}>
              <Input
                label={label}
                value={FORMATTED_DATE}
                placeholder={placeholder || 'Pick a Date'}
                RightIcon={CalendarIcon}
                readOnly
                errorBorder={!!error}
                optionalText={optionalText}
                classNames={{ ...inputClassName, container: cn('cursor-pointer', inputClassName?.container) }}
                disabled={disabledInput}
              />
            </div>
          </PopoverAnchor>

          <PopoverContent className="p-4 bg-neutral-white w-[21.875rem]" align="start">
            <PopoverArrow className="fill-white-100  stroke-white-100" />
            <Calendar {...calenderProps} />
            <div className="flex justify-end gap-1">
              <Button variant="tertiary" onClick={() => setShow(false)}>
                Cancel
              </Button>
              <Button onClick={() => setShow(false)} disabled={!FORMATTED_DATE}>
                OK
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        {error && <div className="text-b1 mt-1 text-state-error-base">{error}</div>}
      </div>
    </>
  );
};

export default DatePicker;
