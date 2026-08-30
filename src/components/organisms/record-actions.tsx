'use client';

import React from 'react';
import { FolderInput, Mail, SquarePen } from 'lucide-react';
import { Trash01 } from '@untitledui/icons';

import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { SendEmailSchemaType } from '@/schema/send-email-schema';
import { cn } from '@/lib/utils';
import DeleteDialog from './delete.dialog';
import EmailDialog from './email.dialog';

export interface RecordActionMoveOption {
  id: string;
  title: string;
  Icon?: (props: { className?: string }) => React.ReactElement;
}

interface RecordActionsProps {
  canUpdate?: boolean;
  canDelete?: boolean;
  onEdit?: () => void;
  // Optional "Move to" popover: pass the target options and a select handler.
  moveTo?: {
    options: RecordActionMoveOption[];
    onSelect: (option: RecordActionMoveOption) => void;
    label?: string;
  };
  onSendEmail?: (payload: SendEmailSchemaType) => void | Promise<unknown>;
  recipientEmail?: string;
  deleteTitle: string;
  deleteDescription: React.ReactNode;
  deleteConfirmText?: string;
  onDelete: () => void;
  className?: string;
}

const iconButtonClassName = 'size-9 text-neutral-dark-grey hover:text-neutral-black';

/**
 * Row of icon actions for a record's detail page — the flat counterpart of
 * `TableRowActionsMenu`, which packs the same actions into a table row's ellipsis menu.
 * Every action is optional so a page only renders what it actually supports.
 */
const RecordActions = ({
  canUpdate = true,
  canDelete = true,
  onEdit,
  moveTo,
  onSendEmail,
  recipientEmail,
  deleteTitle,
  deleteDescription,
  deleteConfirmText,
  onDelete,
  className,
}: RecordActionsProps) => {
  return (
    <div className={cn('flex items-center gap-1', className)}>
      {canUpdate && onEdit && (
        <Button
          variant="ghost"
          size="icon"
          aria-label="Edit"
          title="Edit"
          className={iconButtonClassName}
          onClick={onEdit}
        >
          <SquarePen strokeWidth={1.5} className="size-5" />
        </Button>
      )}

      {canUpdate && moveTo && moveTo.options.length > 0 && (
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              aria-label={moveTo.label ?? 'Move to'}
              title={moveTo.label ?? 'Move to'}
              className={iconButtonClassName}
            >
              <FolderInput strokeWidth={1.5} className="size-5" />
            </Button>
          </PopoverTrigger>
          {/* Sized to its widest option so long service names don't spill past the panel. */}
          <PopoverContent
            align="end"
            className="w-max min-w-[12.5rem] max-w-[min(20rem,calc(100vw-2rem))] bg-white-100 p-2"
          >
            <div className="flex flex-col">
              {moveTo.options.map((option) => (
                <Button
                  key={option.id}
                  variant="ghost"
                  className="w-full h-auto justify-start gap-2 px-2 py-2 text-b1 font-normal hover:bg-accent-50"
                  onClick={() => moveTo.onSelect(option)}
                >
                  {option.Icon && <option.Icon className="h-5 w-5 shrink-0" />}
                  <span className="min-w-0 truncate">{option.title}</span>
                </Button>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      )}

      {onSendEmail && (
        <EmailDialog
          trigger={
            <Button
              variant="ghost"
              size="icon"
              aria-label="Send email"
              title="Send email"
              className={iconButtonClassName}
            >
              <Mail strokeWidth={1.5} className="size-5" />
            </Button>
          }
          recipientsCount={1}
          onSend={onSendEmail}
          recipients={[{ email: recipientEmail || '' }]}
        />
      )}

      {canDelete && (
        <DeleteDialog
          trigger={
            <Button
              variant="ghost"
              size="icon"
              aria-label="Delete"
              title="Delete"
              className={cn(iconButtonClassName, 'text-utility-red hover:text-utility-red')}
            >
              <Trash01 strokeWidth={1.5} className="size-5" />
            </Button>
          }
          title={deleteTitle}
          description={deleteDescription}
          confirmText={deleteConfirmText}
          onConfirm={onDelete}
        />
      )}
    </div>
  );
};

export default RecordActions;
