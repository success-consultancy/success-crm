import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import EmailDialog from '@/components/organisms/email.dialog';
import ColumnHeader from '@/components/molecules/column-header';
import DeleteDialog from '@/components/organisms/delete.dialog';
import { useTableContext } from '@/components/molecules/table-context-provider';

import { useRouter } from 'next/navigation';
import { format, formatDate } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import type { ColumnDef } from '@tanstack/react-table';
import { SendEmailSchemaType } from '@/schema/send-email-schema';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Edit, EllipsisVertical, Eye, Mail, MessageCircle, Minus, Plus, Trash2 } from 'lucide-react';
import { VisaStatusTypes } from '@/types/response-types/visa-response';
import { DateWithIndicator } from '@/components/molecules/date-with-indicator';
import { IInsurance, InsuranceStatusTypes } from '@/types/response-types/insurance-response';

export const useInsuranceColumn = (
  handleDelete: (id: number) => void,
  handleSendEmail: (payload: SendEmailSchemaType) => void,
) => {
  const router = useRouter();

  const TribunalReviewColumns: ColumnDef<IInsurance>[] = [
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
      id: 'insurance-createdAt',
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
      id: 'insurance-id',
      header: () => <ColumnHeader title="ID" keyParam="id" className="h-10" />,
      cell: function Cell({ row }) {
        const tableCtx = useTableContext();
        if (tableCtx?.isLoading) return <Skeleton className="w-5 h-6" />;
        return (
          <span className="max-w-10 cursor-pointer" onClick={() => router.push(`/dashboard/visa/${row.original.id}/view`)}>
            {row.original.id}
          </span>
        );
      },
      enableSorting: true,
      size: 80,
      meta: { isVisible: true, sticky: 'left', stickyLeft: 160 },
    },
    {
      id: 'insurance-first-name',
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
      id: 'insurance-middle-name',
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
      id: 'insurance-last-name',
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
      id: 'insurance-birth-date',
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
      id: 'insurance-email',
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
      id: 'insurance-phone',
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
      id: 'insurance-passport-no',
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
      id: 'insurance-issue-date',
      header: () => <ColumnHeader title="Issue date" keyParam="issueDate" />,
      cell: function Cell({ row }) {
        const tableCtx = useTableContext();
        if (tableCtx?.isLoading) return <Skeleton className="w-20 h-6" />;
        return <span className="w-full">{row.original.passportIssueDate || '-'}</span>;
      },
      size: 128,
      meta: { isVisible: false },
    },
    {
      id: 'insurance-expiry-date',
      header: () => <ColumnHeader title="Expiry date" keyParam="expiryDate" />,
      cell: function Cell({ row }) {
        const tableCtx = useTableContext();
        if (tableCtx?.isLoading) return <Skeleton className="w-20 h-6" />;
        return <span className="w-full">{row.original.passportExpiryDate || '-'}</span>;
      },
      size: 132,
      meta: { isVisible: false },
    },

    {
      id: 'insurance-location',
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
      id: 'insurance-country',
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
      id: 'current_visa',
      header: () => <ColumnHeader title="Current visa" keyParam="currentVisa" />,
      cell: function Cell({ row }) {
        const tableCtx = useTableContext();
        if (tableCtx?.isLoading) return <Skeleton className="w-20 h-6" />;
        return <span className="w-full">{row.original.currentVisa || '-'}</span>;
      },
      size: 136,
      meta: { isVisible: true },
    },

    {
      id: 'insurance-source',
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
      id: 'insurance-assigned-to',
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
      id: 'insurance-follow-up',
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
      id: 'insurance-status',
      header: () => <ColumnHeader title="Status" keyParam="status" />,
      cell: function Cell({ row }) {
        const tableCtx = useTableContext();
        if (tableCtx?.isLoading) return <Skeleton className="w-20 h-6" />;

        const status = row.original.status;
        const getStatusBadge = () => {
          switch (status) {
            case InsuranceStatusTypes.Completed:
              return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Completed</Badge>;
            case InsuranceStatusTypes.New:
              return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">New</Badge>;
            case InsuranceStatusTypes.Discontinued:
              return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Discontinued</Badge>;
            case InsuranceStatusTypes.Refunded:
              return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Refunded</Badge>;
            case InsuranceStatusTypes.Processing:
              return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Processing</Badge>;
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
      id: 'insurance-actions',
      header: () => <Plus className="h-5 w-5 mx-auto" />,
      cell: function Cell({ row }) {
        const tableCtx = useTableContext();
        if (tableCtx?.isLoading) return <Skeleton className="w-8 h-6" />;
        return (
          <div className="flex justify-center">
            <Popover>
              <PopoverTrigger>
                <Button
                  variant="ghost"
                  className="h-5 w-5 rounded-full"
                  iconLeft={<EllipsisVertical className="h-5 w-5 text-muted-foreground mx-auto" />}
                  iconLeftClassName="mr-0"
                />
              </PopoverTrigger>
              <PopoverContent className="w-[12.5rem] bg-white-100 p-2">
                <div className="flex flex-col">
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/dashboard/insurance/${row.original.id}/edit`);
                    }}
                    className="flex items-center gap-2 cursor-pointer hover:bg-accent-50 px-2 py-2 text-b1"
                  >
                    <Edit strokeWidth={1.5} className="h-5 w-5" />
                    <span>Edit</span>
                  </div>
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/dashboard/insurance/${row.original.id}/view`);
                    }}
                    className="flex items-center gap-2 cursor-pointer hover:bg-accent-50 px-2 py-2 text-b1"
                  >
                    <Eye strokeWidth={1.5} className="h-5 w-5" />
                    <span>View</span>
                  </div>
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                    className="flex items-center gap-2 cursor-pointer hover:bg-accent-50 px-2 py-2 text-b1"
                  >
                    <MessageCircle strokeWidth={1.5} className="h-5 w-5" />
                    <span>Send SMS</span>
                  </div>
                  <EmailDialog
                    trigger={
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                        className="flex items-center gap-2 cursor-pointer hover:bg-accent-50 px-2 py-2 text-b1"
                      >
                        <Mail strokeWidth={1.5} className="h-5 w-5" />
                        <span>Send Email</span>
                      </div>
                    }
                    recipientsCount={1}
                    onSend={handleSendEmail}
                    recipients={[{ email: row.original.email }]}
                  />
                  <DeleteDialog
                    trigger={
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                        className="flex items-center gap-2 cursor-pointer hover:bg-accent-50 px-2 py-2 text-b1 text-red"
                      >
                        <Trash2 strokeWidth={1.5} className="h-5 w-5" />
                        <span>Delete Insurance</span>
                      </div>
                    }
                    title="Delete this insurance"
                    description="Are you sure you want to delete this insurance? Deleting this insurance will remove all associated data, including contacts, interactions and notes."
                    onConfirm={() => handleDelete(row.original.id)}
                  />
                </div>
              </PopoverContent>
            </Popover>
          </div>
        );
      },
      size: 64,
      meta: { isVisible: true, sticky: 'right', stickyRight: 0 },
    },
  ];
  return TribunalReviewColumns;
};
