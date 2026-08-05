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
 *
 * `sticky` pins the bar to the bottom of whichever scroll container the form sits in, so
 * the submit action stays reachable on the long service forms instead of only appearing
 * once you scroll to the very end.
 */
export function FormActions({
  children,
  className,
  sticky,
}: {
  children: ReactNode;
  className?: string;
  sticky?: boolean;
}) {
  return (
    <div
      className={cn(
        'flex items-center justify-end gap-3 py-5',
        '[&>*]:!h-12 [&>*]:!rounded-lg [&>*]:!px-6 [&>*]:!font-semibold',
        sticky && 'sticky bottom-0 z-10 bg-blue-extra-light border-t border-neutral-border-light',
        className,
      )}
    >
      {children}
    </div>
  );
}
