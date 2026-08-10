import React from 'react';

import { Skeleton } from '@/components/ui/skeleton';

interface Props {
  /** Number of cells per row — should match the table's visible column count. */
  columns: number;
  /** Number of placeholder rows — pass the current page size so the table doesn't resize on load. */
  rows?: number;
}

/**
 * Placeholder rows for a loading table. Renders bare `tr`/`td` so it drops into
 * both `ui/table` bodies and hand-rolled `tbody` elements.
 */
const TableSkeleton = ({ columns, rows = 10 }: Props) => (
  <>
    {Array.from({ length: rows }).map((_, rowIndex) => (
      <tr key={rowIndex} className="border-b border-neutral-border-light last:border-0">
        {Array.from({ length: columns }).map((_, cellIndex) => (
          <td key={cellIndex} className="px-3 py-3">
            <Skeleton className="h-4 w-full" />
          </td>
        ))}
      </tr>
    ))}
  </>
);

export default TableSkeleton;
