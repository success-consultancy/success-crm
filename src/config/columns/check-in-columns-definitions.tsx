import ColumnHeader from '@/components/molecules/column-header';
import { useTableContext } from '@/components/molecules/table-context-provider';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ICheckIn } from '@/types/response-types/check-in-response';
import type { ColumnDef } from '@tanstack/react-table';
import { useRouter } from 'next/navigation';

const useWaitTime = (timerStart: string) => {
  const start = new Date(timerStart).getTime();
  const now = Date.now();
  const diffMs = now - start;
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 60) return `${diffMin} min`;
  const hours = Math.floor(diffMin / 60);
  const mins = diffMin % 60;
  return `${hours}h ${mins}m`;
};

export const useActiveCheckInColumns = (onEndSession: (id: number) => void) => {
  const router = useRouter();

  const columns: ColumnDef<ICheckIn>[] = [
    {
      id: 'checkin-id',
      header: () => <ColumnHeader title="ID" keyParam="id" />,
      cell: function Cell({ row }) {
        const ctx = useTableContext();
        if (ctx?.isLoading) return <Skeleton className="w-10 h-5" />;
        return <span>{row.original.id}</span>;
      },
      size: 80,
      meta: { isVisible: true },
    },
    {
      id: 'checkin-first-name',
      header: () => <ColumnHeader title="First name" keyParam="firstName" />,
      cell: function Cell({ row }) {
        const ctx = useTableContext();
        if (ctx?.isLoading) return <Skeleton className="w-24 h-5" />;
        return <span>{row.original.lead?.firstName || '-'}</span>;
      },
      size: 160,
      meta: { isVisible: true },
    },
    {
      id: 'checkin-last-name',
      header: () => <ColumnHeader title="Last name" keyParam="lastName" />,
      cell: function Cell({ row }) {
        const ctx = useTableContext();
        if (ctx?.isLoading) return <Skeleton className="w-24 h-5" />;
        return <span>{row.original.lead?.lastName || '-'}</span>;
      },
      size: 160,
      meta: { isVisible: true },
    },
    {
      id: 'checkin-email',
      header: () => <ColumnHeader title="Email" keyParam="email" />,
      cell: function Cell({ row }) {
        const ctx = useTableContext();
        if (ctx?.isLoading) return <Skeleton className="w-36 h-5" />;
        return <span>{row.original.lead?.email || '-'}</span>;
      },
      size: 216,
      meta: { isVisible: true },
    },
    {
      id: 'checkin-phone',
      header: () => <ColumnHeader title="Phone" keyParam="phone" />,
      cell: function Cell({ row }) {
        const ctx = useTableContext();
        if (ctx?.isLoading) return <Skeleton className="w-24 h-5" />;
        return <span>{row.original.lead?.phone || '-'}</span>;
      },
      size: 152,
      meta: { isVisible: true },
    },
    {
      id: 'checkin-country',
      header: () => <ColumnHeader title="Country of origin" keyParam="country" />,
      cell: function Cell({ row }) {
        const ctx = useTableContext();
        if (ctx?.isLoading) return <Skeleton className="w-24 h-5" />;
        return <span>{row.original.lead?.country || '-'}</span>;
      },
      size: 160,
      meta: { isVisible: true },
    },
    {
      id: 'checkin-actions',
      header: () => null,
      cell: function Cell({ row }) {
        const ctx = useTableContext();
        if (ctx?.isLoading) return <Skeleton className="w-32 h-8" />;
        return (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/leads/${row.original.leadId}/view`);
              }}
            >
              View
            </Button>
            <Button
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onEndSession(row.original.id);
              }}
            >
              End session
            </Button>
          </div>
        );
      },
      size: 200,
      meta: { isVisible: true, sticky: 'right', stickyRight: 0 },
    },
  ];

  return columns;
};

export const useHistoryCheckInColumns = () => {
  const router = useRouter();

  const columns: ColumnDef<ICheckIn>[] = [
    {
      id: 'checkin-id',
      header: () => <ColumnHeader title="ID" keyParam="id" />,
      cell: function Cell({ row }) {
        const ctx = useTableContext();
        if (ctx?.isLoading) return <Skeleton className="w-10 h-5" />;
        return <span>{row.original.id}</span>;
      },
      size: 80,
      meta: { isVisible: true },
    },
    {
      id: 'checkin-first-name',
      header: () => <ColumnHeader title="First name" keyParam="firstName" />,
      cell: function Cell({ row }) {
        const ctx = useTableContext();
        if (ctx?.isLoading) return <Skeleton className="w-24 h-5" />;
        return <span>{row.original.lead?.firstName || '-'}</span>;
      },
      size: 160,
      meta: { isVisible: true },
    },
    {
      id: 'checkin-last-name',
      header: () => <ColumnHeader title="Last name" keyParam="lastName" />,
      cell: function Cell({ row }) {
        const ctx = useTableContext();
        if (ctx?.isLoading) return <Skeleton className="w-24 h-5" />;
        return <span>{row.original.lead?.lastName || '-'}</span>;
      },
      size: 160,
      meta: { isVisible: true },
    },
    {
      id: 'checkin-email',
      header: () => <ColumnHeader title="Email" keyParam="email" />,
      cell: function Cell({ row }) {
        const ctx = useTableContext();
        if (ctx?.isLoading) return <Skeleton className="w-36 h-5" />;
        return <span>{row.original.lead?.email || '-'}</span>;
      },
      size: 216,
      meta: { isVisible: true },
    },
    {
      id: 'checkin-phone',
      header: () => <ColumnHeader title="Phone" keyParam="phone" />,
      cell: function Cell({ row }) {
        const ctx = useTableContext();
        if (ctx?.isLoading) return <Skeleton className="w-24 h-5" />;
        return <span>{row.original.lead?.phone || '-'}</span>;
      },
      size: 152,
      meta: { isVisible: true },
    },
    {
      id: 'checkin-country',
      header: () => <ColumnHeader title="Country of origin" keyParam="country" />,
      cell: function Cell({ row }) {
        const ctx = useTableContext();
        if (ctx?.isLoading) return <Skeleton className="w-24 h-5" />;
        return <span>{row.original.lead?.country || '-'}</span>;
      },
      size: 160,
      meta: { isVisible: true },
    },
    {
      id: 'checkin-status',
      header: () => <ColumnHeader title="Status" keyParam="isNew" />,
      cell: function Cell({ row }) {
        const ctx = useTableContext();
        if (ctx?.isLoading) return <Skeleton className="w-20 h-5" />;
        return row.original.isNew ? (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">New</Badge>
        ) : (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Returning</Badge>
        );
      },
      size: 120,
      meta: { isVisible: true },
    },
    {
      id: 'checkin-actions',
      header: () => null,
      cell: function Cell({ row }) {
        const ctx = useTableContext();
        if (ctx?.isLoading) return <Skeleton className="w-16 h-8" />;
        return (
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/leads/${row.original.leadId}/view`);
            }}
          >
            View
          </Button>
        );
      },
      size: 100,
      meta: { isVisible: true, sticky: 'right', stickyRight: 0 },
    },
  ];

  return columns;
};
