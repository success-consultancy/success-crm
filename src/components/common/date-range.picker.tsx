'use client';

import * as React from 'react';
import { format } from 'date-fns';
import { ChevronDown, ChevronUp } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import DatePicker from '../ui/date-picker';
import useSearchParams from '@/hooks/use-search-params';

export function DateRangePicker({
  onApply,
}: {
  onApply: (range: { from: Date | undefined; to: Date | undefined }) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const [from, setFrom] = React.useState<Date | undefined>();
  const [to, setTo] = React.useState<Date | undefined>();

  const { setParams } = useSearchParams();

  const handleApply = () => {
    onApply({ from, to });
    setOpen(false);
  };

  const handleCancel = () => {
    setParams([
      { name: 'from', value: null },
      { name: 'to', value: null },
    ]);
    setFrom(undefined);
    setTo(undefined);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="min-w-[180px] min-h-[44px] justify-between">
          {from && to ? `${format(from, 'dd/MM/yyyy')} - ${format(to, 'dd/MM/yyyy')}` : 'Date range'}
          {open ? <ChevronUp className="ml-2 h-4 w-4" /> : <ChevronDown className="ml-2 h-4 w-4" />}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[300px] space-y-4 p-4" align="start">
        <div className="flex  space-x-2">
          <div>
            <label className="text-sm text-muted-foreground">From</label>
            <DatePicker
              mode="single"
              selected={from}
              onSelect={(date) => {
                setFrom(date);
              }}
            />
          </div>
          <div>
            <label className="text-sm text-muted-foreground pt-2">To</label>
            <DatePicker
              mode="single"
              selected={to}
              onSelect={(date) => {
                setTo(date);
              }}
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="ghost" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleApply} disabled={!from || !to}>
            Apply
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
