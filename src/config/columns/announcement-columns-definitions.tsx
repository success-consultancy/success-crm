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
import { IAnnouncement } from '@/types/response-types/announcement-response';
import { useRouter } from 'next/navigation';
import { Minus } from 'lucide-react';
import { ROUTES } from '@/config/routes';

export const useAnnouncementColumn = (handleDelete: (id: number) => void) => {
  const router = useRouter();

  const AnnouncementColumns: ColumnDef<IAnnouncement>[] = [
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
      id: 'announcement-id',
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
      id: 'announcement-title',
      header: () => <ColumnHeader title="Title" keyParam="title" />,
      cell: function Cell({ row }) {
        const tableCtx = useTableContext();
        if (tableCtx?.isLoading) return <Skeleton className="w-48 h-6" />;
        return <div className="truncate font-medium">{row.original.title}</div>;
      },
      size: 400,
      meta: { isVisible: true },
    },
    {
      id: 'announcement-author',
      header: () => <ColumnHeader title="Author" keyParam="author" />,
      cell: function Cell({ row }) {
        const tableCtx = useTableContext();
        if (tableCtx?.isLoading) return <Skeleton className="w-32 h-6" />;
        const user = (row.original as any).user ?? row.original.User;
        const name = user ? `${user.firstName} ${user.lastName}` : '-';
        return <div>{name}</div>;
      },
      size: 220,
      meta: { isVisible: true },
    },
    {
      id: 'announcement-photo',
      header: () => <span className="font-medium">Image</span>,
      cell: function Cell({ row }) {
        const tableCtx = useTableContext();
        if (tableCtx?.isLoading) return <Skeleton className="w-16 h-10" />;
        const url = row.original.photoURL;
        if (!url) return <div className="text-gray-400 text-sm">No image</div>;
        return <img src={url} alt={row.original.title} className="h-10 w-16 object-cover rounded" />;
      },
      size: 140,
      meta: { isVisible: true },
      enableSorting: false,
    },
    {
      id: 'announcement-created-at',
      header: () => <ColumnHeader title="Published" keyParam="createdAt" />,
      cell: function Cell({ row }) {
        const tableCtx = useTableContext();
        if (tableCtx?.isLoading) return <Skeleton className="w-28 h-6" />;
        const date = row.original.createdAt;
        if (!date) return <div>-</div>;
        try {
          const parsed = parseISO(date);
          if (!isValid(parsed)) return <div>-</div>;
          return <div>{format(parsed, 'MMM dd, yyyy')}</div>;
        } catch {
          return <div>-</div>;
        }
      },
      enableSorting: true,
      size: 160,
      meta: { isVisible: true },
    },
    {
      id: 'announcement-actions',
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
                  onClick={() => router.push(ROUTES.VIEW_ANNOUNCEMENT(row.original.id))}
                >
                  <Eye className="h-4 w-4" />
                  View
                </Button>
                <Button
                  variant="ghost"
                  className="justify-start gap-2"
                  onClick={() => router.push(ROUTES.EDIT_ANNOUNCEMENT(row.original.id))}
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
                  title="Delete Announcement"
                  description="Are you sure you want to delete this announcement? This action cannot be undone."
                  onConfirm={() => handleDelete(row.original.id)}
                />
              </div>
            </PopoverContent>
          </Popover>
        );
      },
      size: 80,
      meta: { isVisible: true, sticky: 'right' },
    },
  ];

  return AnnouncementColumns;
};
