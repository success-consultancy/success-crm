import ColumnHeader from '@/components/molecules/column-header';
import { useTableContext } from '@/components/molecules/table-context-provider';

import { useRouter } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import type { ColumnDef } from '@tanstack/react-table';
import { IAccounts } from '@/types/response-types/education-response';
import { Button } from '@/components/ui/button';

interface ITribunalReviewAccountsColumn {
  onEdit: (accounts: IAccounts) => void;
}

export const useTribunalReviewAccountsColumn = ({ onEdit }: ITribunalReviewAccountsColumn) => {
  const router = useRouter();

  const VisaAccountsColumns: ColumnDef<IAccounts>[] = [
    {
      id: 'accounts-payment-plan',
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
      id: 'accounts-amount',
      header: () => <ColumnHeader title="Service fee" keyParam="amount" />,
      cell: function Cell({ row }) {
        const tableCtx = useTableContext();
        if (tableCtx?.isLoading) return <Skeleton className="w-20 h-6" />;
        return <div className="">{row.original.amount || '-'}</div>;
      },
      size: 160,
      meta: { isVisible: true },
    },
    {
      id: 'accounts-gst',
      header: () => <ColumnHeader title="GST" keyParam="gst" />,
      cell: function Cell({ row }) {
        const tableCtx = useTableContext();
        if (tableCtx?.isLoading) return <Skeleton className="w-20 h-6" />;
        return <div className="">{row.original.gst || '-'}</div>;
      },
      size: 160,
      meta: { isVisible: true },
    },

    {
      id: 'accounts-discount',
      header: () => <ColumnHeader title="Discount" keyParam="discount" />,
      cell: function Cell({ row }) {
        const tableCtx = useTableContext();
        if (tableCtx?.isLoading) return <Skeleton className="w-20 h-6" />;
        return <div className="">{row.original.discount || '-'}</div>;
      },
      size: 160,
      meta: { isVisible: true },
    },

    {
      id: 'accounts-net-amount',
      header: () => <ColumnHeader title="Net amount" keyParam="netAmount" />,
      cell: function Cell({ row }) {
        const tableCtx = useTableContext();
        if (tableCtx?.isLoading) return <Skeleton className="w-20 h-6" />;
        return <div className="">{row.original.netamount || '-'}</div>;
      },
      size: 160,
      meta: { isVisible: true },
    },
    {
      id: 'accounts-invoice-number',
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
      id: 'accounts-due-date',
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
      id: 'accounts-status',
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
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <Button size="sm" variant="ghost" onClick={() => onEdit(row.original)}>
          Edit
        </Button>
      ),
      // size: 216,
      meta: { isVisible: true },
    },
  ];
  return VisaAccountsColumns;
};
