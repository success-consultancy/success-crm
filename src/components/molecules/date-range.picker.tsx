'use client';

import * as React from 'react';
import { format } from 'date-fns';
import { type DateRange } from 'react-day-picker';

import { Button } from '@/components/ui/button';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import useSearchParams from '@/hooks/use-search-params';
import { Calendar2 } from 'iconsax-react';

export function DateRangePicker({
  onApply,
}: {
  onApply: (range: { from: Date | undefined; to: Date | undefined }) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const { setParams, searchParams } = useSearchParams();

  // Initialize dateRange from URL params
  const fromParam = searchParams.get('from');
  const toParam = searchParams.get('to');

  const initialDateRange = React.useMemo<DateRange | undefined>(() => {
    if (fromParam && toParam) {
      const from = new Date(fromParam);
      const to = new Date(toParam);
      if (!isNaN(from.getTime()) && !isNaN(to.getTime())) {
        return { from, to };
      }
    }
    return undefined;
  }, [fromParam, toParam]);

  const [dateRange, setDateRange] = React.useState<DateRange | undefined>(initialDateRange);

  // Update dateRange when URL params change
  React.useEffect(() => {
    if (fromParam && toParam) {
      const from = new Date(fromParam);
      const to = new Date(toParam);
      if (!isNaN(from.getTime()) && !isNaN(to.getTime())) {
        setDateRange({ from, to });
      }
    } else {
      setDateRange(undefined);
    }
  }, [fromParam, toParam]);

  const handleApply = () => {
    onApply({ from: dateRange?.from, to: dateRange?.to });
    setOpen(false);
  };

  const handleCancel = () => {
    setParams([
      { name: 'from', value: null },
      { name: 'to', value: null },
    ]);
    setDateRange(undefined);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="min-w-[180px] min-h-[44px] justify-between">
          {dateRange?.from && dateRange?.to
            ? `${format(dateRange.from, 'dd/MM/yyyy')} - ${format(dateRange.to, 'dd/MM/yyyy')}`
            : 'Date range'}
          {open ? (
            <Calendar2 className=" ml-2 size-5 stroke-gray-900" />
          ) : (
            <Calendar2 className="ml-2 size-5  stroke-gray-900" />
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-auto p-2" align="start">
        <div className="flex min-w-0 flex-col gap-2">
          <Calendar
            mode="range"
            selected={dateRange}
            onSelect={setDateRange}
            numberOfMonths={2}
            className="rounded-lg"
          />
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="ghost" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleApply} disabled={!dateRange?.from || !dateRange?.to}>
            Apply
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
