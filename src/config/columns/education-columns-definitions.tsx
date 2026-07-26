import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import ColumnHeader from '@/components/molecules/column-header';
import TableRowActionsMenu from '@/components/organisms/table-row-actions-menu';
import { useTableContext } from '@/components/molecules/table-context-provider';

import { useRouter } from 'next/navigation';
import { format, formatDate } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import type { ColumnDef } from '@tanstack/react-table';
import { SendEmailSchemaType } from '@/schema/send-email-schema';
import { Minus, Plus } from 'lucide-react';
import { EducationStatusTypes, IEducation } from '@/types/response-types/education-response';
import { ServiceType } from '@/types/leads/leads-types';
import { DateWithIndicator } from '@/components/molecules/date-with-indicator';

export const useEducationColumn = (
  handleDelete: (id: number) => void,
  handleSendEmail: (payload: SendEmailSchemaType) => void,
  { canUpdate = true, canDelete = true }: { canUpdate?: boolean; canDelete?: boolean } = {},
) => {
  const router = useRouter();

  const EducationColumns: ColumnDef<IEducation>[] = [
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
      meta: { isVisible: true, sticky: 'left', stickyLeft: 0 },
    },
    {
      id: 'education-createdAt',
      header: () => <ColumnHeader title="" keyParam="createdAt" className="h-10" />,
      cell: function Cell({ row }) {
        const tableCtx = useTableContext();
        if (tableCtx?.isLoading) return <Skeleton className="w-5 h-6" />;
        return <DateWithIndicator date={row.original.createdAt} className="text-left" />;
      },
      enableSorting: true,
      size: 120,
      meta: { isVisible: true, sticky: 'left', stickyLeft: 40 },
    },
    {
      id: 'education-id',
      header: () => <ColumnHeader title="ID" keyParam="id" className="h-10" />,
      cell: function Cell({ row }) {
        const tableCtx = useTableContext();
        if (tableCtx?.isLoading) return <Skeleton className="w-5 h-6" />;
        return (
          <span className="max-w-10 cursor-pointer" onClick={() => router.push(`/dashboard/education/${row.original.id}/view`)}>
            {row.original.id}
          </span>
        );
      },
      enableSorting: true,
      size: 80,
      meta: { isVisible: true, sticky: 'left', stickyLeft: 160 },
    },
    {
      id: 'education-first-name',
      header: () => <ColumnHeader title="First name" keyParam="firstName" />,
      cell: function Cell({ row }) {
        const tableCtx = useTableContext();
        if (tableCtx?.isLoading) return <Skeleton className="w-20 h-6" />;
        return <div className="">{row.original.firstName || '-'}</div>;
      },
      size: 160,
      meta: { isVisible: true },
    },
    {
      id: 'education-middle-name',
      header: () => <ColumnHeader title="Middle name" keyParam="middleName" />,
      cell: function Cell({ row }) {
        const tableCtx = useTableContext();
        if (tableCtx?.isLoading) return <Skeleton className="w-20 h-6" />;
        return <div className="">{row.original.middleName || '-'}</div>;
      },
      size: 160,
      meta: { isVisible: true },
    },
    {
      id: 'education-last-name',
      header: () => <ColumnHeader title="Last name" keyParam="lastName" />,
      cell: function Cell({ row }) {
        const tableCtx = useTableContext();
        if (tableCtx?.isLoading) return <Skeleton className="w-20 h-6" />;
        return <div className="">{row.original.lastName || '-'}</div>;
      },
      size: 160,
      meta: { isVisible: true },
    },
    {
      id: 'education-birth-date',
      header: () => <ColumnHeader title="Birth date" keyParam="dob" />,
      cell: function Cell({ row }) {
        const tableCtx = useTableContext();
        if (tableCtx?.isLoading) return <Skeleton className="w-20 h-6" />;
        return <span className="w-full">{row.original.dob || '-'}</span>;
      },
      size: 128,
      meta: { isVisible: true },
    },
    {
      id: 'education-email',
      header: () => <ColumnHeader title="Email" keyParam="email" />,
      cell: function Cell({ row }) {
        const tableCtx = useTableContext();
        if (tableCtx?.isLoading) return <Skeleton className="w-20 h-6" />;
        return <span className="w-full">{row.original.email || '-'}</span>;
      },
      size: 216,
      meta: { isVisible: true },
    },
    {
      id: 'education-phone',
      header: () => <ColumnHeader title="Phone" keyParam="phone" />,
      cell: function Cell({ row }) {
        const tableCtx = useTableContext();
        if (tableCtx?.isLoading) return <Skeleton className="w-20 h-6" />;
        return <span className="w-full">{row.original.phone || '-'}</span>;
      },
      size: 152,
      meta: { isVisible: true },
    },
    {
      id: 'passport-no',
      header: () => <ColumnHeader title="Passport no." keyParam="passportNo" />,
      cell: function Cell({ row }) {
        const tableCtx = useTableContext();
        if (tableCtx?.isLoading) return <Skeleton className="w-20 h-6" />;
        return <span className="w-full">{row.original.passport || '-'}</span>;
      },
      size: 140,
      meta: { isVisible: false },
    },
    {
      id: 'issue-date',
      header: () => <ColumnHeader title="Issue date" keyParam="issueDate" />,
      cell: function Cell({ row }) {
        const tableCtx = useTableContext();
        if (tableCtx?.isLoading) return <Skeleton className="w-20 h-6" />;
        return <span className="w-full">{row.original.issueDate || '-'}</span>;
      },
      size: 128,
      meta: { isVisible: false },
    },
    {
      id: 'expiry-date',
      header: () => <ColumnHeader title="Expiry date" keyParam="expiryDate" />,
      cell: function Cell({ row }) {
        const tableCtx = useTableContext();
        if (tableCtx?.isLoading) return <Skeleton className="w-20 h-6" />;
        return <span className="w-full">{row.original.expiryDate || '-'}</span>;
      },
      size: 132,
      meta: { isVisible: false },
    },

    {
      id: 'location',
      header: () => <ColumnHeader title="Location" keyParam="location" />,
      cell: function Cell({ row }) {
        const tableCtx = useTableContext();
        if (tableCtx?.isLoading) return <Skeleton className="w-20 h-6" />;
        return <span className="w-full">{row.original.location || '-'}</span>;
      },
      size: 120,
      meta: { isVisible: false },
    },
    {
      id: 'country',
      header: () => <ColumnHeader title="Country" keyParam="country" />,
      cell: function Cell({ row }) {
        const tableCtx = useTableContext();
        if (tableCtx?.isLoading) return <Skeleton className="w-20 h-6" />;
        return <span className="w-full">{row.original.country || '-'}</span>;
      },
      size: 136,
      meta: { isVisible: false },
    },

    {
      id: 'source',
      header: () => <ColumnHeader title="Source" keyParam="source" />,
      cell: function Cell({ row }) {
        const tableCtx = useTableContext();
        if (tableCtx?.isLoading) return <Skeleton className="w-20 h-6" />;
        return <span className="w-full">{row.original?.source?.name || '-'}</span>;
      },
      size: 144,
      meta: { isVisible: false },
    },
    {
      id: 'assigned-to',
      header: () => <ColumnHeader title="Assigned to" keyParam="assignedTo" />,
      cell: function Cell({ row }) {
        const tableCtx = useTableContext();
        if (tableCtx?.isLoading) return <Skeleton className="w-20 h-6" />;
        return (
          <div className="flex items-center gap-2">
            <span>
              {row.original?.user?.firstName}
              {row.original?.user?.lastName}
            </span>
          </div>
        );
      },
      size: 160,
      meta: { isVisible: false },
    },
    {
      id: 'follow-up',
      header: () => <ColumnHeader title="Follow up" keyParam="followUp" />,
      cell: function Cell({ row }) {
        const tableCtx = useTableContext();
        if (tableCtx?.isLoading) return <Skeleton className="w-20 h-6" />;

        return <div className="w-full">Show Follow Up</div>;
      },
      size: 140,
      meta: { isVisible: false },
    },
    {
      id: 'status',
      header: () => <ColumnHeader title="Status" keyParam="status" />,
      cell: function Cell({ row }) {
        const tableCtx = useTableContext();
        if (tableCtx?.isLoading) return <Skeleton className="w-20 h-6" />;

        const status = row.original.status;
        const getStatusBadge = () => {
          switch (status) {
            case EducationStatusTypes.New:
              return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">New</Badge>;
            case EducationStatusTypes.CoeReceived:
              return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Completed</Badge>;
            case EducationStatusTypes.Withdrawn:
            case EducationStatusTypes.Discontinued:
              return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Not Converted</Badge>;
            case EducationStatusTypes.Checklist:
              return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Checklist</Badge>;
            default:
              return <span>{status}</span>;
          }
        };

        return <div className="w-full">{getStatusBadge()}</div>;
      },
      size: 152,
      meta: { isVisible: false },
    },
    {
      id: 'education-actions',
      header: () => <Plus className="h-5 w-5 mx-auto" />,
      cell: function Cell({ row }) {
        const tableCtx = useTableContext();
        if (tableCtx?.isLoading) return <Skeleton className="w-8 h-6" />;
        return (
          <TableRowActionsMenu
            canUpdate={canUpdate}
            canDelete={canDelete}
            onEdit={() => router.push(`/dashboard/education/${row.original.id}/edit`)}
            onView={() => router.push(`/dashboard/education/${row.original.id}/view`)}
            onSendEmail={handleSendEmail}
            recipientEmail={row.original.email}
            deleteTitle="Delete this Education"
            deleteDescription="Are you sure you want to delete this education? Deleting this education will remove all associated data, including contacts, interactions and notes."
            deleteLabel="Delete Education"
            onDelete={() => handleDelete(row.original.id)}
          />
        );
      },
      size: 64,
      meta: { isVisible: true, sticky: 'right', stickyRight: 0 },
    },
  ];
  return EducationColumns;
};
