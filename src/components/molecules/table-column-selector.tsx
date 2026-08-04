'use client';

import { useEffect, useState } from 'react';
import type { Table } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from '../ui/command';
import { useToastContext } from '@/context/toast-context';

const KNOWN_ID_PREFIXES = [
  'lead',
  'visa',
  'education',
  'insurance',
  'tribunal',
  'skill',
  'agreement',
  'announcement',
  'checkin',
  'accounts',
];

// `lead-first-name` -> `First Name`
const getColumnLabel = (columnId: string) => {
  const parts = columnId.split('-');
  const stripped = KNOWN_ID_PREFIXES.includes(parts[0]) ? parts.slice(1) : parts;
  return stripped.map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};

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
  const { success, warning } = useToastContext();

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
    const added = allColumns.filter((col) => selected.has(col.id) && !col.getIsVisible());
    const removedCount = allColumns.filter((col) => !selected.has(col.id) && col.getIsVisible()).length;

    allColumns.forEach((col) => {
      col.toggleVisibility(selected.has(col.id));
    });

    if (added.length === 1) {
      success(`${getColumnLabel(added[0].id)} column added to the table`);
    } else if (added.length > 1) {
      success(`${added.length} columns added to the table`);
    } else if (removedCount === 0) {
      warning('Those columns are already in the table');
    }

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
      <PopoverTrigger className="w-full h-9 px-3 border rounded-md" asChild>
        <div className="flex items-center gap-2 w-full text-b14-500">
          <span className="grow text-left">{`${title}: ${selected.size} selected`}</span>
          <ChevronDown className="size-4 shrink-0" />
        </div>
      </PopoverTrigger>

      <PopoverContent
        className="flex flex-col gap-2 w-[17.1875rem] p-2 rounded-md border-0 shadow-[0px_4px_25px_0px_rgba(18,18,23,0.15)]"
        align="start"
      >
        <Command className="gap-2 [&_[data-slot=command-input-wrapper]]:rounded-md [&_[data-slot=command-input-wrapper]]:border [&_[data-slot=command-input-wrapper]]:border-neutral-border-light [&_[data-slot=command-input-wrapper]]:pr-4">
          <CommandInput placeholder="Search" />
          <CommandList className="h-[13.5rem] overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-[#f0f1f4] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-neutral-in-active-grey">
            <CommandEmpty>No results found.</CommandEmpty>
            {allColumns.map((column) => {
              const columnName = getColumnLabel(column.id);

              return (
                <CommandItem className="p-0 m-0" key={column.id} value={columnName}>
                  <div className="flex h-9 items-center gap-1.5 pl-1 pr-2 min-w-full rounded-[4px] text-b14 text-neutral-black hover:bg-component-hovered-light cursor-pointer">
                    <span className="flex size-6 shrink-0 items-center justify-center">
                      <Checkbox
                        className="!size-4"
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
                    </span>
                    <label htmlFor={`option-${column.id}`} className="cursor-pointer flex-1 truncate">
                      {columnName}
                    </label>
                  </div>
                </CommandItem>
              );
            })}
          </CommandList>
        </Command>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2 py-2">
          <Button variant="ghost" className="h-8 px-4 rounded-md font-semibold" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button variant="primary" className="h-8 px-4 rounded-md font-semibold" onClick={handleApply}>
            Apply
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
