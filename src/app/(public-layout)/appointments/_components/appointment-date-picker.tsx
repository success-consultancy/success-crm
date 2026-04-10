'use client';

import { useState } from 'react';
import { format, parseISO } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface AppointmentDatePickerProps {
  label?: string;
  value: string; // ISO "yyyy-MM-dd"
  onChange: (iso: string) => void;
  placeholder?: string;
}

const AppointmentDatePicker = ({
  label,
  value,
  onChange,
  placeholder = 'Select a date',
}: AppointmentDatePickerProps) => {
  const [open, setOpen] = useState(false);

  const selected = value ? parseISO(value) : undefined;
  const formatted = selected ? format(selected, 'd MMM yyyy') : '';

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label className="font-semibold text-[14px] leading-[20px] text-[#1c1c1c]">{label}</label>
      )}

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            className={`w-full h-11 border rounded-[6px] px-3 flex items-center justify-between bg-white transition-colors ${
              open
                ? 'border-[#007acc] ring-1 ring-[#007acc]/20'
                : 'border-[#b4b4b4] hover:border-[#007acc]'
            }`}
          >
            <span
              className={`text-[16px] tracking-[-0.16px] ${
                formatted ? 'text-[#1c1c1c]' : 'text-[#757575]'
              }`}
            >
              {formatted || placeholder}
            </span>
            <CalendarIcon className="w-5 h-5 text-[#484848] shrink-0" strokeWidth={1.5} />
          </button>
        </PopoverTrigger>

        <PopoverContent
          className="w-auto p-0 border-[#e3e3e3] shadow-lg rounded-[10px] overflow-hidden"
          align="start"
          sideOffset={6}
          // Override the CSS primary token so the selected day uses brand blue
          style={
            { '--primary': '#007acc', '--primary-foreground': '#ffffff' } as React.CSSProperties
          }
        >
          <Calendar
            mode="single"
            selected={selected}
            onSelect={(date) => {
              if (date) {
                onChange(format(date, 'yyyy-MM-dd'));
                setOpen(false);
              }
            }}
            disabled={{ before: new Date() }}
            captionLayout="dropdown"
            autoFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default AppointmentDatePicker;
