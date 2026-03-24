import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import ColumnHeader from '@/components/molecules/column-header';
import DeleteDialog from '@/components/organisms/delete.dialog';
import { useTableContext } from '@/components/molecules/table-context-provider';
import { format, parseISO, isValid } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import type { ColumnDef } from '@tanstack/react-table';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Edit, EllipsisVertical, Eye, Trash2 } from 'lucide-react';
import { AGREEMENT_STATUS_COLORS, IAgreement } from '@/types/response-types/agreement-response';
import { useRouter } from 'next/navigation';
import { Minus } from 'lucide-react';

export const useAgreementColumn = (handleDelete: (id: number) => void) => {
  const router = useRouter();

  const AgreementColumns: ColumnDef<IAgreement>[] = [
    {
      id: 'select',
      header: ({ table }) => (
        <div className="w-full h-full flex items-center justify-center">
          <div className="relative">
            <Checkbox
              checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
              onCheckedChange={(value: boolean) => {
                if (table.getIsSomePageRowsSelected()) {
                  table.toggleAllPageRowsSelected(false);
                } else table.toggleAllPageRowsSelected(!!value);
              }}
              aria-label="Select all"
              icon={table.getIsSomePageRowsSelected() ? Minus : undefined}
            />
          </div>
        </div>
      ),
      cell: ({ row }) => (
        <div className="w-full h-full flex items-center justify-center">
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        </div>
      ),
      size: 52,
      meta: { isVisible: true },
    },
    {
      id: 'agreement-id',
      header: () => <ColumnHeader title="ID" keyParam="id" className="h-10" />,
      cell: function Cell({ row }) {
        const tableCtx = useTableContext();
        if (tableCtx?.isLoading) return <Skeleton className="w-10 h-6" />;
        return <span className="cursor-pointer">{row.original.id}</span>;
      },
      enableSorting: true,
      size: 80,
      meta: { isVisible: true },
    },
    {
      id: 'agreement-university',
      header: () => <ColumnHeader title="University" keyParam="university" />,
      cell: function Cell({ row }) {
        const tableCtx = useTableContext();
        if (tableCtx?.isLoading) return <Skeleton className="w-40 h-6" />;
        return <div>{row.original.university?.name || '-'}</div>;
      },
      size: 250,
      meta: { isVisible: true },
    },
    {
      id: 'agreement-type',
      header: () => <ColumnHeader title="Type" keyParam="type" />,
      cell: function Cell({ row }) {
        const tableCtx = useTableContext();
        if (tableCtx?.isLoading) return <Skeleton className="w-20 h-6" />;
        return <div>{row.original.type || '-'}</div>;
      },
      size: 120,
      meta: { isVisible: true },
    },
    {
      id: 'agreement-group',
      header: () => <ColumnHeader title="Group" keyParam="group" />,
      cell: function Cell({ row }) {
        const tableCtx = useTableContext();
        if (tableCtx?.isLoading) return <Skeleton className="w-30 h-6" />;
        return <div>{row.original.group || '-'}</div>;
      },
      size: 150,
      meta: { isVisible: true },
    },
    {
      id: 'agreement-start-date',
      header: () => <ColumnHeader title="Start Date" keyParam="startDate" />,
      cell: function Cell({ row }) {
        const tableCtx = useTableContext();
        if (tableCtx?.isLoading) return <Skeleton className="w-24 h-6" />;
        const startDate = row.original.startDate;
        if (!startDate) return <div>-</div>;
        try {
          const parsedDate = parseISO(startDate);
          if (!isValid(parsedDate)) return <div>-</div>;
          return <div>{format(parsedDate, 'dd/MMM/yyyy')}</div>;
        } catch {
          return <div>-</div>;
        }
      },
      enableSorting: true,
      size: 130,
      meta: { isVisible: true },
    },
    {
      id: 'agreement-end-date',
      header: () => <ColumnHeader title="End Date" keyParam="endDate" />,
      cell: function Cell({ row }) {
        const tableCtx = useTableContext();
        if (tableCtx?.isLoading) return <Skeleton className="w-24 h-6" />;
        const endDate = row.original.endDate;
        if (!endDate) return <div>-</div>;
        try {
          const parsedDate = parseISO(endDate);
          if (!isValid(parsedDate)) return <div>-</div>;
          return <div>{format(parsedDate, 'dd/MMM/yyyy')}</div>;
        } catch {
          return <div>-</div>;
        }
      },
      enableSorting: true,
      size: 130,
      meta: { isVisible: true },
    },
    {
      id: 'agreement-commission',
      header: () => <ColumnHeader title="Commission" keyParam="commission" />,
      cell: function Cell({ row }) {
        const tableCtx = useTableContext();
        if (tableCtx?.isLoading) return <Skeleton className="w-16 h-6" />;
        return (
          <Badge variant="secondary" className="bg-gray-100 text-gray-700">
            {row.original.commission ? `${row.original.commission}%` : '-'}
          </Badge>
        );
      },
      size: 120,
      meta: { isVisible: true },
    },
    {
      id: 'agreement-location',
      header: () => <ColumnHeader title="Location" keyParam="location" />,
      cell: function Cell({ row }) {
        const tableCtx = useTableContext();
        if (tableCtx?.isLoading) return <Skeleton className="w-32 h-6" />;
        return <div className="max-w-[200px] truncate">{row.original.location || '-'}</div>;
      },
      size: 200,
      meta: { isVisible: true },
    },
    {
      id: 'agreement-status',
      header: () => <ColumnHeader title="Status" keyParam="status" />,
      cell: function Cell({ row }) {
        const tableCtx = useTableContext();
        if (tableCtx?.isLoading) return <Skeleton className="w-20 h-6" />;
        const status = row.original.status;
        const colors = AGREEMENT_STATUS_COLORS[status] ?? { bg: '#f3f4f6', text: '#374151' };
        return (
          <span
            className="px-2 py-1 rounded text-xs font-medium whitespace-nowrap"
            style={{ backgroundColor: colors.bg, color: colors.text }}
          >
            {status}
          </span>
        );
      },
      size: 120,
      meta: { isVisible: true },
    },
    {
      id: 'agreement-file',
      header: () => <ColumnHeader title="File" keyParam="file" />,
      cell: function Cell({ row }) {
        const tableCtx = useTableContext();
        if (tableCtx?.isLoading) return <Skeleton className="w-24 h-6" />;
        const files = row.original.files;
        const fileUrl = row.original.fileUrl;
        if (files && files.length > 0) {
          return (
            <div className="flex flex-col gap-1">
              {files.map((f, i) => (
                <a key={i} href={f.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline cursor-pointer truncate max-w-[150px]">
                  {f.name}
                </a>
              ))}
            </div>
          );
        }
        if (!fileUrl) return <div>-</div>;
        return (
          <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline cursor-pointer">
            {fileUrl.split('/').pop() || fileUrl}
          </a>
        );
      },
      size: 150,
      meta: { isVisible: true },
    },
    {
      id: 'agreement-actions',
      header: '',
      cell: function Cell({ row }) {
        const tableCtx = useTableContext();
        if (tableCtx?.isLoading) return <Skeleton className="w-10 h-6" />;
        return (
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <EllipsisVertical className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-40 p-1" align="end">
              <div className="flex flex-col">
                <Button
                  variant="ghost"
                  className="justify-start gap-2"
                  onClick={() => router.push(`/agreement/${row.original.id}/view`)}
                >
                  <Eye className="h-4 w-4" />
                  View
                </Button>
                <Button
                  variant="ghost"
                  className="justify-start gap-2"
                  onClick={() => router.push(`/agreement/${row.original.id}/edit`)}
                >
                  <Edit className="h-4 w-4" />
                  Edit
                </Button>
                <DeleteDialog
                  trigger={
                    <Button variant="ghost" className="justify-start gap-2 text-red-600 hover:text-red-700">
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </Button>
                  }
                  title="Delete Agreement"
                  description="Are you sure you want to delete this agreement? This action cannot be undone."
                  onConfirm={() => handleDelete(row.original.id)}
                />
              </div>
            </PopoverContent>
          </Popover>
        );
      },
      size: 60,
      meta: { isVisible: true, sticky: 'right' },
    },
  ];

  return AgreementColumns;
};
