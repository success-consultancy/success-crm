'use client';

import { useEffect, useState } from 'react';
import type { Table } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { Command, CommandInput, CommandItem, CommandList } from '../ui/command';

interface ColumnSelectorProps<TData> {
  table: Table<TData>;
  title?: string;
  storageKey?: string; // Optional: allow customization
}

export function ColumnSelector<TData>({
  table,
  title = 'Columns',
  storageKey = 'column-visibility',
}: ColumnSelectorProps<TData>) {
  const [open, setOpen] = useState(false);
  const allColumns = table.getAllColumns();

  const getDefaultSelected = (): Set<string> => {
    if (typeof window === 'undefined') return new Set<string>();

    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        return new Set(JSON.parse(stored) as string[]);
      }
    } catch (e) {
      console.error('Error reading from localStorage:', e);
    }

    return new Set(allColumns.filter((col) => col.getIsVisible()).map((col) => col.id));
  };

  const [selected, setSelected] = useState<Set<string>>(getDefaultSelected);

  // Apply stored visibility to the table on mount
  useEffect(() => {
    allColumns.forEach((col) => {
      col.toggleVisibility(selected.has(col.id));
    });
  }, [table]); // Run once after table is initialized

  const handleApply = () => {
    allColumns.forEach((col) => {
      col.toggleVisibility(selected.has(col.id));
    });

    if (typeof window !== 'undefined') {
      localStorage.setItem(storageKey, JSON.stringify(Array.from(selected)));
    }

    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger className="w-full text-sm h-10 px-3 py-2 border rounded-md" asChild>
        <div className="flex items-center gap-3 w-full">
          <span className="grow text-left">
            {selected.size > 0 ? `${selected.size} items selected` : 'Select items'}
          </span>
          <ChevronDown className="size-4" />
        </div>
      </PopoverTrigger>

      <PopoverContent className="p-0 flex flex-col w-[17.1875rem]" align="start">
        <Command className="p-2">
          <CommandInput placeholder="Search" />
          <CommandList>
            <div className="max-h-[400px] h-[13.5rem] overflow-y-auto custom-scrollbar">
              {allColumns.map((column) => {
                const columnName = column.id
                  .split('-')
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(' ')
                  .replace('Lead ', '');

                return (
                  <CommandItem className="p-0 m-0" key={column.id} value={columnName}>
                    <div
                      className="flex items-center gap-1.5 px-2 py-2.5 min-w-full text-sm hover:bg-component-hoveredLight cursor-pointer"
                      key={column.id}
                    >
                      <Checkbox
                        checked={selected.has(column.id)}
                        onCheckedChange={(value) => {
                          setSelected((prev) => {
                            const newSet = new Set(prev);
                            if (value) newSet.add(column.id);
                            else newSet.delete(column.id);
                            return newSet;
                          });
                        }}
                        id={`option-${column.id}`}
                        className="data-[state=checked]:text-white"
                      />
                      <label htmlFor={`option-${column.id}`} className="cursor-pointer flex-1">
                        {columnName}
                      </label>
                    </div>
                  </CommandItem>
                );
              })}
            </div>
          </CommandList>
        </Command>

        {/* Actions */}
        <div className="flex items-center gap-2 p-2 self-end">
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleApply}>
            Apply
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
