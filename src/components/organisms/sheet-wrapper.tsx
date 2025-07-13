import React from "react";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

type Props = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  title?: string;
  children?: React.ReactNode;
  className?: string;
};

const SheetWrapper = ({
  isOpen,
  setIsOpen,
  title,
  children,
  className,
}: Props) => {
  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent className={cn("", className)}>
        <SheetHeader className="border-b">
          {title && (
            <SheetTitle className="text-3xl font-medium">{title}</SheetTitle>
          )}
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-5rem)] px-4 pb-3">
          {children}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export default SheetWrapper;
