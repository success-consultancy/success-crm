import ColumnHeader from '@/components/molecules/column-header';
import { useTableContext } from '@/components/molecules/table-context-provider';

import { useRouter } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import type { ColumnDef } from '@tanstack/react-table';
import { IFeePlan } from '@/types/response-types/education-response';

export const useFeeStuructureColumn = () => {
  const router = useRouter();

  const EducationColumns: ColumnDef<IFeePlan>[] = [
    {
      id: 'course-payment-plan',
      header: () => <ColumnHeader title="Fee payment plan" keyParam="fee-payment-plan" />,
      cell: function Cell({ row }) {
        const tableCtx = useTableContext();
        if (tableCtx?.isLoading) return <Skeleton className="w-20 h-6" />;
        return <div className="">{row.original.planname || '-'}</div>;
      },
      size: 160,
      meta: { isVisible: true },
    },
    {
      id: 'course-amount',
      header: () => <ColumnHeader title="Fee Amount" keyParam="feeAmount" />,
      cell: function Cell({ row }) {
        const tableCtx = useTableContext();
        if (tableCtx?.isLoading) return <Skeleton className="w-20 h-6" />;
        return <div className="">{row.original.amount || '-'}</div>;
      },
      size: 160,
      meta: { isVisible: true },
    },
    {
      id: 'course-due-date',
      header: () => <ColumnHeader title="Due date" keyParam="dueDate" />,
      cell: function Cell({ row }) {
        const tableCtx = useTableContext();
        if (tableCtx?.isLoading) return <Skeleton className="w-20 h-6" />;
        return <div className="">{row.original.duedate || '-'}</div>;
      },
      size: 160,
      meta: { isVisible: true },
    },
    {
      id: 'course-invoice-number',
      header: () => <ColumnHeader title="Invoice number" keyParam="invoiceNumber" />,
      cell: function Cell({ row }) {
        const tableCtx = useTableContext();
        if (tableCtx?.isLoading) return <Skeleton className="w-20 h-6" />;
        return <span className="w-full">{row.original.invoicenumber || '-'}</span>;
      },
      size: 128,
      meta: { isVisible: true },
    },
    {
      id: 'course-status',
      header: () => <ColumnHeader title="Status" keyParam="status" />,
      cell: function Cell({ row }) {
        const tableCtx = useTableContext();
        if (tableCtx?.isLoading) return <Skeleton className="w-20 h-6" />;
        return <span className="w-full">{row.original.status || '-'}</span>;
      },
      size: 216,
      meta: { isVisible: true },
    },
    {
      id: 'course-note',
      header: () => <ColumnHeader title="Note" keyParam="note" />,
      cell: function Cell({ row }) {
        const tableCtx = useTableContext();
        if (tableCtx?.isLoading) return <Skeleton className="w-20 h-6" />;
        return <span className="w-full">{row.original.note || '-'}</span>;
      },
      size: 152,
      meta: { isVisible: true },
    },
  ];
  return EducationColumns;
};
