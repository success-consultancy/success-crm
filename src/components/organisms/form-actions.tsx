import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

/**
 * Action bar at the foot of an add/edit form.
 *
 * Figma "Leads > New lead": row, right-aligned, 20px vertical padding, 12px between
 * buttons; each button 48px tall, 24px side padding, 8px radius, Body/14-600.
 *
 * The button sizing is applied here (with `!`) rather than on each call site so every
 * form footer stays in step — the children are `Button`/`ButtonLink`, which carry their
 * own size classes from `buttonVariants`.
 */
export function FormActions({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        'flex items-center justify-end gap-3 py-5',
        '[&>*]:!h-12 [&>*]:!rounded-lg [&>*]:!px-6 [&>*]:!font-semibold',
        className,
      )}
    >
      {children}
    </div>
  );
}
