'use client';
import { useState } from 'react';
import { useController } from 'react-hook-form';
import type { Control, FieldPath, FieldValues } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Check, ChevronDown } from 'lucide-react';

export type ObjType = {
  label: string;
  value: string;
};

export interface ComboboxFieldProps<T extends FieldValues> {
  name: FieldPath<T>;
  label: string;
  control: Control<T>;
  options: ObjType[];
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  searchPlaceholder?: string;
  className?: string;
}

const ComboboxField = <T extends FieldValues>({
  name,
  label,
  control,
  options,
  placeholder = 'Select an option',
  disabled = false,
  required = false,
  searchPlaceholder = 'Search...',
  className,
}: ComboboxFieldProps<T>) => {
  const [open, setOpen] = useState(false);
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

  const selectedOption = options.find((opt) => opt.value === field.value);

  return (
    <div className={`flex flex-col gap-1 -mt-1 w-full ${className || ''}`}>
      <Label htmlFor={name} className="font-medium">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            disabled={disabled}
            className={cn(
              'w-full justify-between h-10',
              error && 'border-red-500',
              !selectedOption && 'text-muted-foreground',
            )}
            id={name}
          >
            {selectedOption ? selectedOption.label : placeholder}
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command>
            <CommandInput placeholder={searchPlaceholder} />
            <CommandEmpty>No option found.</CommandEmpty>
            <CommandList>
              <CommandGroup>
                {options.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    onSelect={(currentValue) => {
                      field.onChange(currentValue === field.value ? '' : currentValue);
                      setOpen(false);
                    }}
                  >
                    <Check className={cn('mr-2 h-4 w-4', field.value === option.value ? 'opacity-100' : 'opacity-0')} />
                    {option.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {error && <p className="text-sm text-red-500">{error.message}</p>}
    </div>
  );
};

export default ComboboxField;
