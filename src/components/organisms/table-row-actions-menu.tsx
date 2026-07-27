'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Edit, EllipsisVertical, Eye, Mail, MessageCircle, Trash2 } from 'lucide-react';
import DeleteDialog from './delete.dialog';
import EmailDialog from './email.dialog';
import { SendEmailSchemaType } from '@/schema/send-email-schema';

interface TableRowActionsMenuProps {
  canUpdate?: boolean;
  canDelete?: boolean;
  onEdit?: () => void;
  onView?: () => void;
  onSendSms?: () => void;
  onSendEmail?: (payload: SendEmailSchemaType) => void;
  recipientEmail?: string;
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
  deleteTitle,
  deleteDescription,
  deleteLabel,
  deleteConfirmText,
  onDelete,
  animated = false,
}: TableRowActionsMenuProps) => {
  const menuItemClassName = cn(itemClassName, animated && animatedItemClassName);

  return (
    <div className="flex justify-center">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            aria-label="Open actions menu"
            className={cn('h-5 w-5 rounded-full', animated && animatedTriggerClassName)}
            iconLeft={<EllipsisVertical className="h-5 w-5 text-muted-foreground mx-auto" />}
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
                    <Trash2 strokeWidth={1.5} className="h-5 w-5" />
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
