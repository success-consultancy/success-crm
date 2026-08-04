'use client';

import { useState } from 'react';
import type { Table } from '@tanstack/react-table';
import { FolderInput } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { BulkActionIconButton } from './table-bulk-action-button';
import ConfirmationDialog from '@/components/organisms/confirmation-dialog';
import type { RowActionMoveOption } from '@/components/organisms/table-row-actions-menu';

export interface TableBulkMoveProps<TData> {
  options: RowActionMoveOption[];
  onMove: (option: RowActionMoveOption, rows: TData[]) => void | Promise<unknown>;
  label?: string;
  isMoving?: boolean;
  // Noun used in the confirmation copy, e.g. "3 selected leads".
  itemLabel?: string;
}

interface Props<TData> extends TableBulkMoveProps<TData> {
  table: Table<TData>;
}

/**
 * "Move to" action for the table's selection toolbar: picks a target service for every
 * selected row, confirms, then clears the selection once the move resolves.
 */
export function TableBulkMoveMenu<TData>({
  table,
  options,
  onMove,
  label = 'Move to',
  isMoving,
  itemLabel = 'lead',
}: Props<TData>) {
  const [open, setOpen] = useState(false);
  const [confirmOption, setConfirmOption] = useState<RowActionMoveOption | null>(null);

  const selectedRows = table.getSelectedRowModel().rows.map((row) => row.original);

  const handleConfirm = async () => {
    if (!confirmOption) return;
    const option = confirmOption;
    setConfirmOption(null);
    await onMove(option, selectedRows);
    table.toggleAllRowsSelected(false);
  };

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <BulkActionIconButton label={label} active={open} disabled={isMoving}>
            <FolderInput strokeWidth={1.5} />
          </BulkActionIconButton>
        </PopoverTrigger>

        <PopoverContent align="start" className="w-[15.5rem] bg-white-100 p-2">
          <div className="flex flex-col">
            {options.map((option) => (
              <button
                key={option.id}
                type="button"
                className="flex h-9 items-center gap-2 rounded-[4px] px-2 text-b14 text-neutral-black hover:bg-component-hovered-light"
                onClick={() => {
                  setOpen(false);
                  setConfirmOption(option);
                }}
              >
                {option.Icon && <option.Icon className="size-5 shrink-0" />}
                <span className="truncate">{option.title}</span>
              </button>
            ))}
          </div>
        </PopoverContent>
      </Popover>

      <ConfirmationDialog
        isOpen={!!confirmOption}
        setIsOpen={(isOpen) => {
          if (!isOpen) setConfirmOption(null);
        }}
        title="Confirm move"
        message={`Are you sure you want to move ${selectedRows.length} selected ${itemLabel}${
          selectedRows.length === 1 ? '' : 's'
        } to ${confirmOption?.title}?`}
        confirmText="Move"
        cancelText="Cancel"
        loading={isMoving}
        onConfirm={handleConfirm}
        onCancel={() => setConfirmOption(null)}
      />
    </>
  );
}
