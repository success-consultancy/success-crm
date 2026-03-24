'use client';

import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useTableContext } from '@/components/molecules/table-context-provider';
import type { ColumnDef } from '@tanstack/react-table';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Edit, EllipsisVertical, Eye, Trash2, FileText } from 'lucide-react';
import { University } from '@/query/get-university';
import { useRouter } from 'next/navigation';
import DeleteDialog from '@/components/organisms/delete.dialog';
import { Minus } from 'lucide-react';
import ColumnHeader from '@/components/molecules/column-header';

export const useUniversityColumns = (handleDelete: (id: number) => void) => {
  const router = useRouter();

  const UniversityColumns: ColumnDef<University>[] = [
    {
      id: 'select',
      header: ({ table }) => (
        <div className="w-full h-full flex items-center justify-center">
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
      id: 'university-name',
      header: () => <ColumnHeader title="University name" keyParam="name" />,
      cell: function Cell({ row }) {
        const tableCtx = useTableContext();
        if (tableCtx?.isLoading) return <Skeleton className="w-40 h-6" />;
        return <span className="font-medium">{row.original.name}</span>;
      },
      size: 250,
      meta: { isVisible: true },
    },
    {
      id: 'university-group',
      header: () => <ColumnHeader title="Group" keyParam="educationLevel" />,
      cell: function Cell({ row }) {
        const tableCtx = useTableContext();
        if (tableCtx?.isLoading) return <Skeleton className="w-32 h-6" />;
        return <div>{row.original.educationLevel || '-'}</div>;
      },
      size: 168,
      meta: { isVisible: true },
    },
    {
      id: 'university-location',
      header: () => <ColumnHeader title="Location" keyParam="location" />,
      cell: function Cell({ row }) {
        const tableCtx = useTableContext();
        if (tableCtx?.isLoading) return <Skeleton className="w-32 h-6" />;
        return <div className="max-w-[200px] truncate">{row.original.location || '-'}</div>;
      },
      size: 216,
      meta: { isVisible: true },
    },
    {
      id: 'university-description',
      header: () => <ColumnHeader title="Description" keyParam="description" />,
      cell: function Cell({ row }) {
        const tableCtx = useTableContext();
        if (tableCtx?.isLoading) return <Skeleton className="w-40 h-6" />;
        const desc = row.original.description;
        if (!desc) return <div>-</div>;
        const stripped = desc.replace(/<[^>]*>/g, '');
        return <div className="max-w-[200px] truncate text-sm text-gray-600">{stripped || '-'}</div>;
      },
      size: 220,
      meta: { isVisible: true },
    },
    {
      id: 'university-track',
      header: () => <ColumnHeader title="Track in report" keyParam="trackInReport" />,
      cell: function Cell({ row }) {
        const tableCtx = useTableContext();
        if (tableCtx?.isLoading) return <Skeleton className="w-16 h-6" />;
        const val = row.original.trackInReport;
        if (val === null || val === undefined) return <div>-</div>;
        return <div>{val ? 'TRUE' : 'FALSE'}</div>;
      },
      size: 152,
      meta: { isVisible: true },
    },
    {
      id: 'university-document',
      header: () => <ColumnHeader title="Document" keyParam="files" />,
      cell: function Cell({ row }) {
        const tableCtx = useTableContext();
        if (tableCtx?.isLoading) return <Skeleton className="w-10 h-6" />;
        const rawFiles = row.original.files;
        const files = Array.isArray(rawFiles) ? rawFiles : [];
        if (!files || files.length === 0) return <div className="text-gray-400">-</div>;
        return (
          <div className="flex items-center gap-1 text-gray-500">
            <FileText className="h-4 w-4" />
            <span className="text-xs">{files.length}</span>
          </div>
        );
      },
      size: 100,
      meta: { isVisible: true },
    },
    {
      id: 'university-actions',
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
                  onClick={() => router.push(`/university/${row.original.id}/view`)}
                >
                  <Eye className="h-4 w-4" />
                  View
                </Button>
                <Button
                  variant="ghost"
                  className="justify-start gap-2"
                  onClick={() => router.push(`/university/${row.original.id}/edit`)}
                >
                  <Edit className="h-4 w-4" />
                  Edit
                </Button>
                <DeleteDialog
                  trigger={
                    <Button variant="ghost" className="justify-start gap-2 text-red-600 hover:text-red-700 w-full">
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </Button>
                  }
                  title="Delete University"
                  description="Are you sure you want to delete this university? This action cannot be undone."
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

  return UniversityColumns;
};
