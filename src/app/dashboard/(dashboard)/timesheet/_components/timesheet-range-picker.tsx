'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { CalendarDays, ChevronDown } from 'lucide-react';
import type { DateRange } from 'react-day-picker';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { QuickRangeKey, QUICK_RANGE_OPTIONS, resolveQuickRange } from '../_lib/quick-ranges';

interface Props {
  range: { from: Date; to: Date };
  onChange: (range: { from: Date; to: Date }) => void;
}

const TimesheetRangePicker = ({ range, onChange }: Props) => {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<DateRange | undefined>({ from: range.from, to: range.to });

  const handleQuick = (key: QuickRangeKey) => {
    const next = resolveQuickRange(key);
    setDraft({ from: next.from, to: next.to });
    onChange(next);
    setOpen(false);
  };

  const handleApply = () => {
    if (draft?.from && draft?.to) {
      onChange({ from: draft.from, to: draft.to });
      setOpen(false);
    }
  };

  const label = `${format(range.from, 'd MMM yyyy')} - ${format(range.to, 'd MMM yyyy')}`;

  return (
    <Popover
      open={open}
      onOpenChange={(o) => {
        setOpen(o);
        if (o) setDraft({ from: range.from, to: range.to });
      }}
    >
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="justify-between min-w-[240px] font-normal">
          <span className="flex items-center gap-2">
            <CalendarDays className="w-4 h-4 text-gray-500" />
            {label}
          </span>
          <ChevronDown className={cn('w-4 h-4 text-gray-500 transition-transform', open && 'rotate-180')} />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-auto p-0">
        <div className="flex">
          <div className="flex flex-col py-2 border-r border-gray-100 min-w-[140px]">
            {QUICK_RANGE_OPTIONS.map((opt) => (
              <button
                key={opt.key}
                type="button"
                onClick={() => handleQuick(opt.key)}
                className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 text-left cursor-pointer"
              >
                {opt.label}
              </button>
            ))}
          </div>
          <div className="p-2">
            <Calendar
              mode="range"
              selected={draft}
              onSelect={setDraft}
              numberOfMonths={2}
              defaultMonth={range.from}
            />
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="ghost" size="sm" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button size="sm" onClick={handleApply} disabled={!draft?.from || !draft?.to}>
                Apply
              </Button>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default TimesheetRangePicker;
