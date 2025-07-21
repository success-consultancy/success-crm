'use client';

import { useState } from 'react';
import { Label } from '../ui/label';
import type { ISelectOptions } from './select-common';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Checkbox } from '../ui/checkbox';
import { ChevronDown, X } from 'lucide-react';
import { cn } from '@/lib/utils';

type Props = {
  options: ISelectOptions[];
  label: string;
  value: string[];
  onSelect?: (val: string[]) => void; // Changed to string[] to match the component's behavior
  placeholder?: string;
  error?: string;
};

const MultiSelect = ({ value = [], ...props }: Props) => {
  const [selected, setSelected] = useState(value);

  const handleSelectionChange = (newSelection: string[]) => {
    setSelected(newSelection);
    props.onSelect?.(newSelection);
  };

  return (
    <div className="flex flex-col gap-1 flex-1 ">
      <Label className="text-b3-b font-semibold">{props.label}</Label>
      <Popover>
        <PopoverTrigger className="w-full text-sm h-10 px-3 py-2 border rounded-md" asChild>
          <div className={cn("flex items-center gap-3 w-full", props?.error && "border border-red-400")}>
            <span className="grow text-left">
              {selected?.length > 0 ? `${selected.length} items selected` : props.placeholder || 'Select items'}
            </span>
            {selected.length > 0 && (
              <X
                className="size-4 cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelectionChange([]);
                }}
              />
            )}
            <ChevronDown className="size-4" />
          </div>
        </PopoverTrigger>
        <PopoverContent className=" p-0 flex flex-col w-[--radix-popover-trigger-width]" align="start">
          {props.options.map((option, idx) => (
            <div
              className="flex items-center gap-1.5 px-2 py-2.5 min-w-full text-sm hover:bg-component-hoveredLight cursor-pointer"
              key={idx + option.label}
            >
              <Checkbox
                checked={selected?.includes(option.value)}
                onCheckedChange={(val) => {
                  if (val) {
                    const newSelection = [...selected, option.value];
                    handleSelectionChange(newSelection);
                  } else {
                    const newSelection = selected.filter((selection) => selection !== option.value);
                    handleSelectionChange(newSelection);
                  }
                }}
                id={`option-${option.value}`}
              />
              <label htmlFor={`option-${option.value}`} className="cursor-pointer flex-1">
                {option.label}
              </label>
            </div>
          ))}
        </PopoverContent>
      </Popover>
      {props.error && <span className="text-primary-red">{props.error}</span>}
    </div >
  );
};

export default MultiSelect;
