'use client';

import { format, isPast } from 'date-fns';
import { Calendar as CalendarIcon } from 'iconsax-reactjs';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface DatePickerProps {
  value?: Date;
  onChange: (date: Date | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  disablePastDates?: boolean;
  disableFutureDates?: boolean;
  minDate?: Date;
  maxDate?: Date;
  side?: 'top' | 'bottom';
  isCalendarOpen?: boolean;
  setIsCalendarOpen?: (open: boolean) => void;
  needTime?: boolean;
  timeValue?: string;
  onTimeChange?: (time: string) => void;
  timeLabel?: string;
  timeId?: string;
}

export function DatePicker({
  value,
  onChange,
  placeholder = 'Pick a date',
  disabled = false,
  className,
  side = 'bottom',
  needTime = false,
  timeValue = '10:30:00',
  onTimeChange,
  disablePastDates = false,
  timeId = 'time-picker',
}: DatePickerProps) {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  return (
    <div className={cn('flex gap-4 w-full', !needTime && 'w-full')}>
      <div className={cn('flex w-full flex-col gap-3', needTime ? 'flex-1' : 'w-full')}>
        <Popover modal={true} open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
          <PopoverTrigger asChild className="!w-[100%] text-sm !h-10" disabled={disabled}>
            <div
              className={cn(
                'w-full border border-gray-300 rounded-md flex items-center justify-between px-3 py-2 text-b2 cursor-pointer',
                !value && 'text-muted-foreground',
                disabled && 'opacity-50 cursor-not-allowed',
                className,
              )}
              role="button"
              tabIndex={disabled ? -1 : 0}
              aria-label={value ? `Selected date: ${format(value, 'PPP')}` : placeholder}
              onKeyDown={(e) => {
                if (!disabled && (e.key === 'Enter' || e.key === ' ')) {
                  e.preventDefault();
                  setIsCalendarOpen(true);
                }
              }}
            >
              {value ? format(value, needTime ? 'MMM dd, yyyy' : 'PPP') : <span>{placeholder}</span>}
              <CalendarIcon className="size-5 text-dark/50" />
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start" side={side}>
            <Calendar
              mode="single"
              selected={value}
              onSelect={(date) => {
                onChange(date);
                if (date) {
                  setIsCalendarOpen(false);
                }
              }}
              // disabled={(date) => isPast(date)}
            />
          </PopoverContent>
        </Popover>
      </div>

      {needTime && (
        <div className="flex !w-[100px] flex-col gap-3 flex-1">
          <Input
            type="time"
            id={timeId}
            step="1"
            value={timeValue}
            onChange={(e) => onTimeChange?.(e.target.value)}
            className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none h-10"
            disabled={disabled}
          />
        </div>
      )}
    </div>
  );
}
