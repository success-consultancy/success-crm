import ColumnHeader from '@/components/molecules/column-header';
import { useTableContext } from '@/components/molecules/table-context-provider';
import { Skeleton } from '@/components/ui/skeleton';
import type { ColumnDef } from '@tanstack/react-table';
import { Input } from '@/components/ui/input';
import { CreateAccountPayload, IAccount } from '@/schema/account-schema';
import { cn } from '@/lib/utils';
import { PAYMENT_STATUS_COLORS } from '@/constants/status-colors';
import { Pencil, Trash2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePicker } from '@/components/organisms/date-picker';
import DeleteDialog from '@/components/organisms/delete.dialog';

/** Read-only cell when row is in edit mode (disabled field). */
const ReadOnlyCell = ({ value, isEditing, className }: { value: string; isEditing: boolean; className?: string }) => (
  <div className={cn(isEditing && 'bg-muted/40 text-muted-foreground rounded px-1 py-0.5', className)}>
    {value || '-'}
  </div>
);

const StatusBadge = ({ status }: { status: string }) => {
  const colors = PAYMENT_STATUS_COLORS[status] ?? PAYMENT_STATUS_COLORS.Other;
  return (
    <span
      className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium"
      style={{ backgroundColor: colors.background, color: colors.text }}
    >
      {status || '-'}
    </span>
  );
};

interface IVisaAccountsColumn {
  onEdit: (accounts: IAccount) => void;
  onDelete?: (accounts: IAccount) => void;
}

function isEditingRow(
  row: { original: IAccount },
  editingId: number | null | undefined,
  draftRow: CreateAccountPayload | undefined,
) {
  if (editingId == null || !draftRow) return false;
  const rowId = row.original?.id;
  return rowId != null && Number(rowId) === Number(editingId);
}

export const useVisaAccountsColumn = ({ onEdit, onDelete }: IVisaAccountsColumn) => {
  const VisaAccountsColumns: ColumnDef<IAccount>[] = [
    {
      id: 'accounts-payment-plan',
      header: () => <ColumnHeader title="Fee payment plan" keyParam="fee-payment-plan" />,
      cell: function Cell({ row, column, table }) {
        const tableCtx = useTableContext();
        if (tableCtx?.isLoading) return <Skeleton className="w-20 h-6" />;
        const editingId = table.options.meta?.editingId as number | null | undefined;
        const draftRow = table.options.meta?.draft as CreateAccountPayload | undefined;
        const isEditingThisRow = isEditingRow(row, editingId, draftRow);
        const value = isEditingThisRow && draftRow ? (draftRow.planname ?? '') : row.original.planname || '-';
        if (isEditingThisRow && draftRow) {
          return (
            <Input
              key={`account-${row.original.id}-${column.id}`}
              placeholder="Fee payment plan"
              value={value}
              onChange={(e) => table.options.meta?.updateData?.(row.index, column.id, e.target.value)}
              className="h-8 text-b2"
            />
          );
        }
        return <ReadOnlyCell value={value} isEditing={!!isEditingThisRow} />;
      },
      size: 160,
      meta: { isVisible: true },
    },

    {
      id: 'accounts-amount',
      header: () => <ColumnHeader title="Service fee" keyParam="amount" />,
      cell: function Cell({ row, column, table }) {
        const tableCtx = useTableContext();
        if (tableCtx?.isLoading) return <Skeleton className="w-20 h-6" />;
        const editingId = table.options.meta?.editingId as number | null | undefined;
        const draftRow = table.options.meta?.draft as CreateAccountPayload | undefined;
        const isEditingThisRow = isEditingRow(row, editingId, draftRow);
        const value = isEditingThisRow && draftRow ? (draftRow.amount ?? '') : row.original.amount || '-';
        if (isEditingThisRow && draftRow) {
          return (
            <Input
              key={`account-${row.original.id}-${column.id}`}
              placeholder="Service fee"
              type="number"
              value={value}
              onChange={(e) => table.options.meta?.updateData?.(row.index, column.id, e.target.value)}
              className="h-8 text-b2"
            />
          );
        }
        return <ReadOnlyCell value={value} isEditing={!!isEditingThisRow} />;
      },
      size: 128,
      meta: { isVisible: true },
    },
    {
      id: 'accounts-gst',
      header: () => <ColumnHeader title="GST" keyParam="gst" />,
      cell: function Cell({ row, table }) {
        const tableCtx = useTableContext();
        if (tableCtx?.isLoading) return <Skeleton className="w-20 h-6" />;
        const editingId = table.options.meta?.editingId as number | null | undefined;
        const draftRow = table.options.meta?.draft as CreateAccountPayload | undefined;
        const showDraft = isEditingRow(row, editingId, draftRow);
        const value = showDraft && draftRow ? (draftRow.gst ?? '') : row.original.gst || '-';
        return <ReadOnlyCell value={value} isEditing={!!showDraft} />;
      },
      size: 128,
      meta: { isVisible: true },
    },

    {
      id: 'accounts-discount',
      header: () => <ColumnHeader title="Discount" keyParam="discount" />,
      cell: function Cell({ row, column, table }) {
        const tableCtx = useTableContext();
        if (tableCtx?.isLoading) return <Skeleton className="w-20 h-6" />;
        const editingId = table.options.meta?.editingId as number | null | undefined;
        const draftRow = table.options.meta?.draft as CreateAccountPayload | undefined;
        const isEditingThisRow = isEditingRow(row, editingId, draftRow);
        const value = isEditingThisRow && draftRow ? (draftRow.discount ?? '') : row.original.discount || '-';
        if (isEditingThisRow && draftRow) {
          return (
            <Input
              key={`account-${row.original.id}-${column.id}`}
              placeholder="Discount"
              type="number"
              value={value}
              onChange={(e) => table.options.meta?.updateData?.(row.index, column.id, e.target.value)}
              className="h-8 text-b2"
            />
          );
        }
        return <ReadOnlyCell value={value} isEditing={!!isEditingThisRow} />;
      },
      size: 128,
      meta: { isVisible: true },
    },

    {
      id: 'accounts-net-amount',
      header: () => <ColumnHeader title="Net amount" keyParam="netAmount" />,
      cell: function Cell({ row, table }) {
        const tableCtx = useTableContext();
        if (tableCtx?.isLoading) return <Skeleton className="w-20 h-6" />;
        const editingId = table.options.meta?.editingId as number | null | undefined;
        const draftRow = table.options.meta?.draft as CreateAccountPayload | undefined;
        const showDraft = isEditingRow(row, editingId, draftRow);
        const value = showDraft && draftRow ? (draftRow.netamount ?? '') : row.original.netamount || '-';
        return <ReadOnlyCell value={value} isEditing={!!showDraft} />;
      },
      size: 128,
      meta: { isVisible: true },
    },
    {
      id: 'accounts-invoice-number',
      header: () => <ColumnHeader title="Invoice number" keyParam="invoiceNumber" />,
      cell: function Cell({ row, column, table }) {
        const tableCtx = useTableContext();
        if (tableCtx?.isLoading) return <Skeleton className="w-20 h-6" />;
        const editingId = table.options.meta?.editingId as number | null | undefined;
        const draftRow = table.options.meta?.draft as CreateAccountPayload | undefined;
        const isEditingThisRow = isEditingRow(row, editingId, draftRow);
        const value = isEditingThisRow && draftRow ? (draftRow.invoicenumber ?? '') : row.original.invoicenumber || '-';
        if (isEditingThisRow && draftRow) {
          return (
            <Input
              key={`account-${row.original.id}-${column.id}`}
              placeholder="Invoice number"
              value={value}
              onChange={(e) => table.options.meta?.updateData?.(row.index, column.id, e.target.value)}
              className="h-8 text-b2"
            />
          );
        }
        return <ReadOnlyCell value={value} isEditing={!!isEditingThisRow} className="w-full" />;
      },
      size: 128,
      meta: { isVisible: true },
    },
    {
      id: 'accounts-due-date',
      header: () => <ColumnHeader title="Due date" keyParam="dueDate" />,
      cell: function Cell({ row, column, table }) {
        const tableCtx = useTableContext();
        if (tableCtx?.isLoading) return <Skeleton className="w-20 h-6" />;
        const editingId = table.options.meta?.editingId as number | null | undefined;
        const draftRow = table.options.meta?.draft as CreateAccountPayload | undefined;
        const isEditingThisRow = isEditingRow(row, editingId, draftRow);
        const rawValue = isEditingThisRow && draftRow ? (draftRow.duedate ?? '') : row.original.duedate || '-';
        if (isEditingThisRow && draftRow) {
          return (
            <DatePicker
              key={`account-${row.original.id}-${column.id}`}
              value={rawValue ? new Date(rawValue) : undefined}
              onChange={(date) => table.options.meta?.updateData?.(row.index, column.id, date?.toISOString?.() ?? '')}
              placeholder="Due date"
              className="h-8 text-b2 w-full min-w-0"
              side="bottom"
              disablePastDates={true}
            />
          );
        }
        return <ReadOnlyCell value={rawValue} isEditing={!!isEditingThisRow} />;
      },
      size: 160,
      meta: { isVisible: true },
    },

    {
      id: 'accounts-status',
      header: () => <ColumnHeader title="Status" keyParam="status" />,
      cell: function Cell({ row, column, table }) {
        const tableCtx = useTableContext();
        if (tableCtx?.isLoading) return <Skeleton className="w-20 h-6" />;
        const editingId = table.options.meta?.editingId as number | null | undefined;
        const draftRow = table.options.meta?.draft as CreateAccountPayload | undefined;
        const isEditingThisRow = isEditingRow(row, editingId, draftRow);
        const value = isEditingThisRow && draftRow ? (draftRow.status ?? 'Pending') : row.original.status || '-';
        if (isEditingThisRow && draftRow) {
          return (
            <Select
              key={`account-${row.original.id}-${column.id}`}
              value={value}
              onValueChange={(val) => table.options.meta?.updateData?.(row.index, column.id, val)}
            >
              <SelectTrigger className="h-8 text-b2">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Paid">Paid</SelectItem>
                <SelectItem value="Overdue">Overdue</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          );
        }
        return <StatusBadge status={row.original.status || '-'} />;
      },
      size: 216,
      meta: { isVisible: true },
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex gap-4">
          <Pencil
            onClick={() => onEdit(row.original)}
            strokeWidth={1.5}
            className="h-5 w-5 cursor-pointer"
          />
          <DeleteDialog
            trigger={
              <div className="cursor-pointer text-red-400">
                <Trash2 strokeWidth={1.5} className="h-5 w-5" />
              </div>
            }
            title="Delete this account"
            description="Are you sure you want to delete this account?"
            onConfirm={() => onDelete?.(row.original)}
          />
        </div>
      ),
      meta: { isVisible: true },
    },
  ];
  return VisaAccountsColumns;
};
