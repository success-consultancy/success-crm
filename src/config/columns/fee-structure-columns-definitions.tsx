import ColumnHeader from '@/components/molecules/column-header';
import { useTableContext } from '@/components/molecules/table-context-provider';
import { Skeleton } from '@/components/ui/skeleton';
import type { ColumnDef } from '@tanstack/react-table';
import { CreateCourseFeePayload, IFeePlan } from '@/schema/education-schema';
import { Pencil, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePicker } from '@/components/organisms/date-picker';
import { cn } from '@/lib/utils';

const STATUS_COLORS: Record<string, string> = {
  Pending: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
  Paid: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
  Overdue: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  Other: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400',
};

const StatusBadge = ({ status }: { status: string }) => {
  const colorClass = STATUS_COLORS[status] ?? STATUS_COLORS.Other;
  return (
    <span className={cn('inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium', colorClass)}>
      {status || '-'}
    </span>
  );
};

interface IEducationFeeColumn {
  onEdit: (fee: IFeePlan) => void;
  editingId?: number | null;
}

export const useFeeStuructureColumn = ({ onEdit, editingId: _editingId }: IEducationFeeColumn) => {
  const EducationColumns: ColumnDef<IFeePlan>[] = [
    {
      id: 'planname',
      header: () => <ColumnHeader title="Fee payment plan" keyParam="fee-payment-plan" />,
      cell: function Cell({ row, column, table, getValue }) {
        const tableCtx = useTableContext();
        if (tableCtx?.isLoading) return <Skeleton className="w-20 h-6" />;
        const editingId = table.options.meta?.editingId as number | null | undefined;
        const draft = table.options.meta?.draft as CreateCourseFeePayload | undefined;
        const isEditingThisRow = editingId != null && row.original.id === editingId;
        const value =
          isEditingThisRow && draft ? (draft.planname ?? '') : (getValue<string>() ?? row.original.planname ?? '-');
        if (isEditingThisRow && draft) {
          return (
            <Input
              key={`fee-${row.original.id}-${column.id}`}
              placeholder="Plan name"
              value={value}
              onChange={(e) => table.options.meta?.updateData?.(row.index, column.id, e.target.value)}
              className="h-8 text-b2"
            />
          );
        }
        return <div className="">{row.original.planname || '-'}</div>;
      },
      size: 160,
      meta: { isVisible: true },
    },
    {
      id: 'course-amount',
      header: () => <ColumnHeader title="Fee Amount" keyParam="feeAmount" />,
      cell: function Cell({ row, column, table }) {
        const tableCtx = useTableContext();
        if (tableCtx?.isLoading) return <Skeleton className="w-20 h-6" />;
        const editingId = table.options.meta?.editingId as number | null | undefined;
        const draft = table.options.meta?.draft as CreateCourseFeePayload | undefined;
        const isEditingThisRow = editingId != null && row.original.id === editingId;
        const value = isEditingThisRow && draft ? String(draft.amount ?? '') : row.original.amount || '-';
        if (isEditingThisRow && draft) {
          return (
            <Input
              key={`fee-${row.original.id}-${column.id}`}
              placeholder="Amount"
              type="number"
              value={value}
              onChange={(e) => table.options.meta?.updateData?.(row.index, column.id, e.target.value)}
              className="h-8 text-b2"
            />
          );
        }
        return <div className="">{row.original.amount || '-'}</div>;
      },
      size: 140,
      meta: { isVisible: true },
    },
    {
      id: 'course-due-date',
      header: () => <ColumnHeader title="Due date" keyParam="dueDate" />,
      cell: function Cell({ row, column, table }) {
        const tableCtx = useTableContext();
        if (tableCtx?.isLoading) return <Skeleton className="w-20 h-6" />;
        const editingId = table.options.meta?.editingId as number | null | undefined;
        const draft = table.options.meta?.draft as CreateCourseFeePayload | undefined;
        const isEditingThisRow = editingId != null && row.original.id === editingId;
        const rawValue = isEditingThisRow && draft ? draft.duedate : row.original.duedate;
        const displayValue = rawValue || '-';
        if (isEditingThisRow && draft) {
          return (
            <DatePicker
              key={`fee-${row.original.id}-${column.id}`}
              value={rawValue ? new Date(rawValue) : undefined}
              onChange={(date) => table.options.meta?.updateData?.(row.index, column.id, date?.toISOString?.() ?? '')}
              placeholder="Due date"
              className="h-8 text-b2 w-full min-w-0"
              side="bottom"
              disablePastDates={true}
            />
          );
        }
        return <div className="">{displayValue}</div>;
      },
      size: 160,
      meta: { isVisible: true },
    },
    {
      id: 'course-invoice-number',
      header: () => <ColumnHeader title="Invoice number" keyParam="invoiceNumber" />,
      cell: function Cell({ row, column, table }) {
        const tableCtx = useTableContext();
        if (tableCtx?.isLoading) return <Skeleton className="w-20 h-6" />;
        const editingId = table.options.meta?.editingId as number | null | undefined;
        const draft = table.options.meta?.draft as CreateCourseFeePayload | undefined;
        const isEditingThisRow = editingId != null && row.original.id === editingId;
        const value = isEditingThisRow && draft ? (draft.invoicenumber ?? '') : row.original.invoicenumber || '-';
        if (isEditingThisRow && draft) {
          return (
            <Input
              key={`fee-${row.original.id}-${column.id}`}
              placeholder="Invoice number"
              value={value}
              onChange={(e) => table.options.meta?.updateData?.(row.index, column.id, e.target.value)}
              className="h-8 text-b2"
            />
          );
        }
        return <span className="w-full">{row.original.invoicenumber || '-'}</span>;
      },
      size: 138,
      meta: { isVisible: true },
    },
    {
      id: 'course-status',
      header: () => <ColumnHeader title="Status" keyParam="status" />,
      cell: function Cell({ row, column, table }) {
        const tableCtx = useTableContext();
        if (tableCtx?.isLoading) return <Skeleton className="w-20 h-6" />;
        const editingId = table.options.meta?.editingId as number | null | undefined;
        const draft = table.options.meta?.draft as CreateCourseFeePayload | undefined;
        const isEditingThisRow = editingId != null && row.original.id === editingId;
        const value = isEditingThisRow && draft ? (draft.status ?? 'Pending') : row.original.status || '-';
        if (isEditingThisRow && draft) {
          return (
            <Select
              key={`fee-${row.original.id}-${column.id}`}
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
      size: 146,
      meta: { isVisible: true },
    },
    {
      id: 'course-note',
      header: () => <ColumnHeader title="Note" keyParam="note" />,
      cell: function Cell({ row, column, table }) {
        const tableCtx = useTableContext();
        if (tableCtx?.isLoading) return <Skeleton className="w-20 h-6" />;
        const editingId = table.options.meta?.editingId as number | null | undefined;
        const draft = table.options.meta?.draft as CreateCourseFeePayload | undefined;
        const isEditingThisRow = editingId != null && row.original.id === editingId;
        const value = isEditingThisRow && draft ? (draft.note ?? '') : row.original.note || '-';
        if (isEditingThisRow && draft) {
          return (
            <Input
              key={`fee-${row.original.id}-${column.id}`}
              placeholder="Note"
              value={value}
              onChange={(e) => table.options.meta?.updateData?.(row.index, column.id, e.target.value)}
              className="h-8 text-b2"
            />
          );
        }
        return <span className="w-full">{row.original.note || '-'}</span>;
      },
      size: 152,
      meta: { isVisible: true },
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex gap-4">
          <Pencil onClick={() => onEdit(row.original)} strokeWidth={1.5} className="h-5 w-5 cursor-pointer" />
          <Trash2 className="text-red-400" />
        </div>
      ),
      meta: { isVisible: true },
    },
  ];
  return EducationColumns;
};
