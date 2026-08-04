'use client';

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import React from 'react';

interface DeleteDialogProps {
  trigger?: React.ReactNode;
  title: string;
  description?: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  confirmClassName?: string;
  children?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** When provided, the caller owns closing the dialog (the confirm button stays mounted while the request runs). */
  loading?: boolean;
}

const DeleteDialog: React.FC<DeleteDialogProps> = ({
  trigger,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  confirmClassName = 'bg-utility-red text-white hover:bg-utility-red/90',
  children,
  open,
  onOpenChange,
  loading,
}) => {
  const confirmButton = (
    <Button
      onClick={onConfirm}
      loading={loading}
      className={`h-9 px-5 rounded-md font-semibold ${confirmClassName}`}
    >
      {confirmText}
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent
        showCloseButton={false}
        className="gap-0 p-0 sm:max-w-[27rem] rounded-lg !rounded-t-lg border-[rgba(28,28,28,0.12)] shadow-[0px_26px_80px_0px_rgba(18,18,23,0.1),0px_0px_1px_0px_rgba(18,18,23,0.1)]"
      >
        <DialogHeader className="flex-row items-center justify-between gap-0 space-y-0 pl-[18px] pr-3 border-b border-neutral-border-light">
          {/* Heading/four - 700 = 18px/700. `text-lg` is already 18px; a `text-h4-700` token here
              would collide with the colour class in tailwind-merge and be dropped. */}
          <DialogTitle className="text-neutral-black font-bold leading-6 text-left">{title}</DialogTitle>
          <DialogClose className="group grid size-10 shrink-0 place-items-center cursor-pointer outline-none">
            <span className="grid size-[34px] place-items-center rounded-full transition-colors group-hover:bg-component-hovered-light group-active:bg-component-active">
              <X className="size-5" />
            </span>
            <span className="sr-only">Close</span>
          </DialogClose>
        </DialogHeader>

        <div className="px-[18px] py-4">
          {description && (
            <DialogDescription className="text-sm text-neutral-dark-grey whitespace-pre-line" asChild>
              <div>{description}</div>
            </DialogDescription>
          )}
          {children}
        </div>

        <DialogFooter className="flex-row items-center justify-end gap-2 px-[18px] pt-3 pb-5">
          <DialogClose asChild>
            <Button variant="outline" className="h-9 px-5 rounded-md font-semibold border-neutral-border text-neutral-black">
              {cancelText}
            </Button>
          </DialogClose>
          {loading === undefined ? <DialogClose asChild>{confirmButton}</DialogClose> : confirmButton}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteDialog;
