'use client';

import { AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { cn } from '@/lib/utils';
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
    <AccordionItem value={value} className={cn('bg-white rounded-lg border border-gray-50 overflow-hidden', className)}>
      <AccordionTrigger className={cn('text-[18px] font-semibold px-6 py-4 border-gray-50', triggerClassName)}>
        {title}
      </AccordionTrigger>

      <AccordionContent className={cn('p-6 border-t flex flex-col gap-4', contentClassName)}>
        {children}
      </AccordionContent>
    </AccordionItem>
  );
}
