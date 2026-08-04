'use client';

import { AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { cn } from '@/lib/utils';
import { ArrowDown2 } from 'iconsax-reactjs';
import { ReactNode } from 'react';

interface FormAccordionProps {
  value: string;
  title: string;
  children: ReactNode;
  className?: string;
  triggerClassName?: string;
  contentClassName?: string;
}

export function FormAccordion({
  value,
  title,
  children,
  className,
  triggerClassName,
  contentClassName,
}: FormAccordionProps) {
  return (
    <AccordionItem
      value={value}
      className={cn('bg-white rounded-xl border border-neutral-border-light overflow-hidden', className)}
    >
      {/* Card header: 40px tall, 16px side padding, collapse control on the left. The base rotate
          rule targets a direct-child svg, so we re-declare it as a descendant selector here. */}
      <AccordionTrigger
        show={false}
        className={cn(
          'h-10 items-center justify-start gap-0 px-4 py-0 [&[data-state=open]_svg]:rotate-180',
          triggerClassName,
        )}
      >
        <span className="grid size-10 shrink-0 place-items-center">
          <ArrowDown2 className="text-muted-foreground pointer-events-none size-5 transition-transform duration-200" />
        </span>
        <span className="text-base font-semibold text-neutral-black">{title}</span>
      </AccordionTrigger>

      <AccordionContent
        className={cn('flex flex-col gap-5 px-6 py-5 border-t border-neutral-border-light', contentClassName)}
      >
        {children}
      </AccordionContent>
    </AccordionItem>
  );
}
