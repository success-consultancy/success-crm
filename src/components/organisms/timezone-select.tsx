'use client';

import { useState, useMemo } from 'react';
import { Search, Check, ChevronsUpDown } from 'lucide-react';
import { useController } from 'react-hook-form';
import type { Control, FieldPath, FieldValues } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { TIMEZONES } from '@/constants/timezones';

interface TimezoneSelectProps<T extends FieldValues> {
  name: FieldPath<T>;
  label?: string;
  control: Control<T>;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  searchPlaceholder?: string;
  notFoundText?: string;
}

const TimezoneSelect = <T extends FieldValues>({
  name,
  label = 'Timezone',
  control,
  placeholder = 'Select timezone',
  disabled = false,
  required = false,
  className,
  searchPlaceholder = 'Search timezone...',
  notFoundText = 'No timezone found.',
}: TimezoneSelectProps<T>) => {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const {
    field,
    fieldState: { error },
  } = useController({
    name,
    control,
    rules: {
      required: required ? 'This field is required' : false,
    },
  });

  const filteredTimezones = useMemo(() => {
    if (!searchQuery) return TIMEZONES;
    
    const query = searchQuery.toLowerCase();
    return TIMEZONES.filter((timezone) => {
      const labelMatch = timezone.label.toLowerCase().includes(query);
      const valueMatch = timezone.value.toLowerCase().includes(query);
      const abbrevMatch = timezone.abbrev?.toLowerCase().includes(query);
      const altNameMatch = timezone.altName?.toLowerCase().includes(query);
      
      return labelMatch || valueMatch || abbrevMatch || altNameMatch;
    });
  }, [searchQuery]);

  const selectedTimezone = TIMEZONES.find((timezone) => timezone.value === field.value);

  return (
    <div className={`flex flex-col gap-1 -mt-1 w-full ${className || ''}`}>
      <Label htmlFor={name} className="font-medium text-sm">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
              'w-full justify-between h-10 font-normal',
              !field.value && 'text-muted-foreground',
              error && 'border-red-500'
            )}
            disabled={disabled}
          >
            {selectedTimezone ? (
              <span className="truncate text-left">{selectedTimezone.label}</span>
            ) : (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[400px] p-0" align="start">
          <Command shouldFilter={false}>
            <div className="flex items-center border-b">
              <CommandInput
                placeholder={searchPlaceholder}
                value={searchQuery}
                onValueChange={setSearchQuery}
                className="h-11"
              />
            </div>
            <CommandEmpty>{notFoundText}</CommandEmpty>
            <CommandGroup className="max-h-[300px] overflow-y-auto">
              {filteredTimezones.map((timezone) => (
                <CommandItem
                  key={timezone.value}
                  value={timezone.value}
                  onSelect={() => {
                    field.onChange(timezone.value);
                    setOpen(false);
                    setSearchQuery('');
                  }}
                  className="cursor-pointer"
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      field.value === timezone.value ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                  <div className="flex flex-col">
                    <span className="text-sm">{timezone.label}</span>
                    {timezone.altName && (
                      <span className="text-xs text-muted-foreground">{timezone.altName}</span>
                    )}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
      {error && <p className="text-sm text-red-500">{error.message}</p>}
    </div>
  );
};

export default TimezoneSelect;
