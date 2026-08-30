'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { ChevronRight, Edit, EllipsisVertical, Eye, FolderInput, Mail, MessageCircle, Trash2 } from 'lucide-react';
import DeleteDialog from './delete.dialog';
import EmailDialog from './email.dialog';
import { SendEmailSchemaType } from '@/schema/send-email-schema';
import { Trash01 } from '@untitledui/icons';

export interface RowActionMoveOption {
  id: string;
  title: string;
  Icon?: (props: { className?: string }) => React.ReactElement;
}

interface TableRowActionsMenuProps {
  canUpdate?: boolean;
  canDelete?: boolean;
  onEdit?: () => void;
  onView?: () => void;
  onSendSms?: () => void;
  onSendEmail?: (payload: SendEmailSchemaType) => void | Promise<unknown>;
  recipientEmail?: string;
  // Optional "Move to" submenu: pass the target options and a select handler.
  moveTo?: {
    options: RowActionMoveOption[];
    onSelect: (option: RowActionMoveOption) => void;
    label?: string;
  };
  deleteTitle: string;
  deleteDescription: React.ReactNode;
  deleteLabel: string;
  deleteConfirmText?: string;
  onDelete: () => void;
  // ponytail: trial flag so the press animation ships to the lead table first;
  // once confirmed, drop the flag and bake the classes into the defaults below.
  animated?: boolean;
}

const itemClassName = 'w-full h-auto justify-start gap-2 px-2 py-2 text-b1 font-normal hover:bg-accent-50';
const animatedItemClassName = 'transition-transform duration-150 ease-out active:scale-[0.98]';
const animatedTriggerClassName = 'transition-transform duration-150 ease-out active:scale-90';

// Real <Button> items (keyboard-focusable, proper role) inside a Popover triggered
// by an accessible, asChild-wired ellipsis button — used by every table's row actions menu.
const TableRowActionsMenu = ({
  canUpdate = true,
  canDelete = true,
  onEdit,
  onView,
  onSendSms,
  onSendEmail,
  recipientEmail,
  moveTo,
  deleteTitle,
  deleteDescription,
  deleteLabel,
  deleteConfirmText,
  onDelete,
  animated = false,
}: TableRowActionsMenuProps) => {
  const menuItemClassName = cn(itemClassName, animated && animatedItemClassName);
  const [open, setOpen] = React.useState(false);
  const [showMove, setShowMove] = React.useState(false);

  return (
    <div className="flex justify-center">
      <Popover
        open={open}
        onOpenChange={(o) => {
          setOpen(o);
          if (!o) setShowMove(false);
        }}
      >
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            aria-label="Open actions menu"
            className={cn(
              'h-5 w-5 rounded-full',
              open && 'bg-primary/10 text-primary',
              animated && animatedTriggerClassName,
            )}
            iconLeft={
              <EllipsisVertical className={cn('h-5 w-5 mx-auto', open ? 'text-primary' : 'text-muted-foreground')} />
            }
            iconLeftClassName="mr-0"
          />
        </PopoverTrigger>
        <PopoverContent className="w-[12.5rem] bg-white-100 p-2">
          <div className="flex flex-col">
            {canUpdate && onEdit && (
              <Button variant="ghost" className={menuItemClassName} onClick={onEdit}>
                <Edit strokeWidth={1.5} className="h-5 w-5" />
                Edit
              </Button>
            )}
            {onView && (
              <Button variant="ghost" className={menuItemClassName} onClick={onView}>
                <Eye strokeWidth={1.5} className="h-5 w-5" />
                View
              </Button>
            )}
            {moveTo && moveTo.options.length > 0 && (
              <Popover open={showMove} onOpenChange={setShowMove}>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    className={cn(menuItemClassName, 'justify-between', showMove && 'bg-accent-50')}
                  >
                    <span className="flex items-center gap-2">
                      <FolderInput strokeWidth={1.5} className="h-5 w-5" />
                      {moveTo.label ?? 'Move to'}
                    </span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                {/* Sized to its widest option so long service names don't spill past the panel. */}
                <PopoverContent
                  side="left"
                  align="start"
                  sideOffset={4}
                  collisionPadding={8}
                  className="w-max min-w-[12.5rem] max-w-[min(20rem,calc(100vw-2rem))] bg-white-100 p-2"
                >
                  <div className="flex flex-col">
                    {moveTo.options.map((option) => (
                      <Button
                        key={option.id}
                        variant="ghost"
                        className={menuItemClassName}
                        onClick={() => {
                          moveTo.onSelect(option);
                          setShowMove(false);
                        }}
                      >
                        {option.Icon && <option.Icon className="h-5 w-5 shrink-0" />}
                        <span className="min-w-0 truncate">{option.title}</span>
                      </Button>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            )}
            <Button variant="ghost" className={menuItemClassName} onClick={onSendSms}>
              <MessageCircle strokeWidth={1.5} className="h-5 w-5" />
              Send SMS
            </Button>
            {onSendEmail && (
              <EmailDialog
                trigger={
                  <Button variant="ghost" className={menuItemClassName}>
                    <Mail strokeWidth={1.5} className="h-5 w-5" />
                    Send Email
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
                  <Button variant="ghost" className={cn(menuItemClassName, 'text-red hover:text-red')}>
                    <Trash01 strokeWidth={1.5} className="h-5 w-5" />
                    {deleteLabel}
                  </Button>
                }
                title={deleteTitle}
                description={deleteDescription}
                confirmText={deleteConfirmText}
                onConfirm={onDelete}
              />
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default TableRowActionsMenu;
