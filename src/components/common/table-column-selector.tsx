'use client';

import { useState } from 'react';
import type { Table } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { Command, CommandInput, CommandItem, CommandList } from './command/command';

interface ColumnSelectorProps<TData> {
  table: Table<TData>;
  title?: string;
}

export function ColumnSelector<TData>({ table, title = 'Columns' }: ColumnSelectorProps<TData>) {
  // Track selected columns
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set(table.getVisibleLeafColumns().map((col) => col.id)));

  const allColumns = table.getAllColumns();

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
        {/* Columns List */}
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
                            if (value) {
                              newSet.add(column.id);
                            } else {
                              newSet.delete(column.id);
                            }
                            return newSet;
                          });
                        }}
                        id={`option-${column.id}`}
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
          <Button
            variant="ghost"
            onClick={() => {
              setOpen(false);
            }}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              table.getAllColumns().forEach((col) => {
                col.toggleVisibility(selected.has(col.id));
              });
              setOpen(false);
            }}
          >
            Apply
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
