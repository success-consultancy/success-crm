import { ReactNode } from 'react';

import { EmptyState } from '@/components/common/empty-state';

interface Props {
  /** Must match the table's visible column count so the state spans the full width. */
  colSpan: number;
  icon?: ReactNode;
  title?: string;
  description?: string;
  action?: ReactNode;
  size?: 'sm' | 'md';
}

/**
 * Full-width empty state for a table body. Renders bare `tr`/`td` so it drops into
 * both `ui/table` bodies and hand-rolled `tbody` elements.
 */
export const TableEmptyRow = ({ colSpan, icon, title, description, action, size = 'md' }: Props) => (
  <tr>
    <td colSpan={colSpan}>
      <EmptyState icon={icon} title={title} description={description} action={action} size={size} />
    </td>
  </tr>
);

export default TableEmptyRow;
