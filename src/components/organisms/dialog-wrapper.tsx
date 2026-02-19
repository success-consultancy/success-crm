'use client';

import type React from 'react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

type Props = {
  title: string;
  trigger?: React.ReactNode;
  isOpen?: boolean;
  setIsOpen?: (isOpen: boolean) => void;
  children: React.ReactNode;
  className?: string;
  canClose?: boolean;
};

const DialogWrapper = (props: Props) => {
  return (
    <Dialog open={props.isOpen} onOpenChange={props.setIsOpen}>
      <DialogTrigger asChild>{props.trigger}</DialogTrigger>
      <DialogContent
        onOpenAutoFocus={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
        onCloseAutoFocus={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => {
          if (props.canClose) {
            e.preventDefault();
          } else {
            e.stopPropagation();
          }
        }}
        className={cn('w-[calc(100vw-10px)] xl:min-w-[650px] !rounded-3xl p-2 z-50', props.className)}
      >
        <DialogHeader className="px-4 md:px-6 pt-4 md:pt-6">
          <DialogTitle className="text-2xl md:!text-h4 text-left font-medium pr-5">
            {props.title.length > 100 ? props.title.slice(0, 100) + '...' : props.title}
          </DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[calc(100vh-15rem)]">
          <div className="px-4 pb-4 md:px-6 md:pb-6">{props.children}</div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default DialogWrapper;
