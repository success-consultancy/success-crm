'use client';

import { useEffect, useState } from 'react';
import type { Table } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from '../ui/command';

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

    // Always get the default columns that should be visible
    const defaultVisible = new Set(
      allColumns
        .filter((col) => {
          const meta = (col.columnDef as any).meta;
          return meta?.isVisible === true; // Only show columns explicitly marked as visible
        })
        .map((col) => col.id),
    );

    try {
      const stored = localStorage.getItem(storageKey);
      const base = stored ? new Set([...defaultVisible, ...(JSON.parse(stored) as string[])]) : defaultVisible;
      // Columns hidden from a header menu should show as unchecked here.
      const storedHidden = localStorage.getItem(`${storageKey}-hidden`);
      if (storedHidden) {
        (JSON.parse(storedHidden) as string[]).forEach((id) => base.delete(id));
      }
      return base;
    } catch (e) {
      console.error('Error reading from localStorage:', e);
    }

    // If no stored data, return only the default columns
    return defaultVisible;
  };

  const [selected, setSelected] = useState<Set<string>>(getDefaultSelected);

  // Initialize selected state by merging default columns with saved preferences
  useEffect(() => {
    if (typeof window !== 'undefined' && allColumns.length > 0) {
      // Always get the default columns that should be visible
      const defaultVisible = new Set(
        allColumns
          .filter((col) => {
            const meta = (col.columnDef as any).meta;
            return meta?.isVisible === true;
          })
          .map((col) => col.id),
      );

      const stored = localStorage.getItem(storageKey);
      const base = stored ? new Set([...defaultVisible, ...(JSON.parse(stored) as string[])]) : defaultVisible;
      // Columns hidden from a header menu should show as unchecked here.
      const storedHidden = localStorage.getItem(`${storageKey}-hidden`);
      if (storedHidden) {
        (JSON.parse(storedHidden) as string[]).forEach((id) => base.delete(id));
      }
      setSelected(base);
    }
  }, [table, storageKey, allColumns.length]); // Run when table is ready

  // Re-sync checkboxes from the table's live visibility each time the menu opens,
  // so columns hidden elsewhere (e.g. a column-header "Hide column") show as
  // unchecked immediately, not only after a refresh.
  useEffect(() => {
    if (open) {
      setSelected(new Set(allColumns.filter((col) => col.getIsVisible()).map((col) => col.id)));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const handleApply = () => {
    allColumns.forEach((col) => {
      col.toggleVisibility(selected.has(col.id));
    });

    if (typeof window !== 'undefined') {
      localStorage.setItem(storageKey, JSON.stringify(Array.from(selected)));
      // Re-enabling a column here clears any "hidden from header menu" flag so it shows again.
      try {
        const key = `${storageKey}-hidden`;
        const stored = localStorage.getItem(key);
        if (stored) {
          const hidden = (JSON.parse(stored) as string[]).filter((id) => !selected.has(id));
          localStorage.setItem(key, JSON.stringify(hidden));
        }
      } catch (e) {
        console.error('Error updating hidden columns:', e);
      }
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
          <CommandList className="max-h-[400px] h-[13.5rem] overflow-y-auto custom-scrollbar">
            <CommandEmpty>No results found.</CommandEmpty>
            {allColumns.map((column) => {
              const parts = column.id.split('-');
              const knownPrefixes = ['lead', 'visa', 'education', 'insurance', 'tribunal', 'skill', 'agreement', 'announcement', 'checkin', 'accounts'];
              const stripped = knownPrefixes.includes(parts[0]) ? parts.slice(1) : parts;
              const columnName = stripped
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ');

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
                    />
                    <label htmlFor={`option-${column.id}`} className="cursor-pointer flex-1">
                      {columnName}
                    </label>
                  </div>
                </CommandItem>
              );
            })}
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
