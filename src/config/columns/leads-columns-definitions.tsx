import ColumnHeader from '@/components/molecules/column-header';
import { DateWithIndicator } from '@/components/molecules/date-with-indicator';
import { useTableContext } from '@/components/molecules/table-context-provider';
import DeleteDialog from '@/components/organisms/delete.dialog';
import EmailDialog from '@/components/organisms/email.dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Skeleton } from '@/components/ui/skeleton';
import { SendEmailSchemaType } from '@/schema/send-email-schema';
import { ServiceType } from '@/types/leads/leads-types';
import { LeadStatusTypes, type ILead } from '@/types/response-types/leads-response';
import type { ColumnDef } from '@tanstack/react-table';
import { format, formatDate } from 'date-fns';
import { Edit, EllipsisVertical, Eye, Mail, MessageCircle, Minus, Plus, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export const useLeadColumn = (
  handleDelete: (id: number) => void,
  handleSendEmail: (payload: SendEmailSchemaType) => void,
) => {
  const router = useRouter();

  const LeadColumns: ColumnDef<ILead>[] = [
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
      id: 'lead-createdAt',
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
      id: 'lead-id',
      header: () => <ColumnHeader title="ID" keyParam="id" className="h-10" />,
      cell: function Cell({ row }) {
        const tableCtx = useTableContext();
        if (tableCtx?.isLoading) return <Skeleton className="w-5 h-6" />;
        return (
          <span className="max-w-10 cursor-pointer" onClick={() => router.push(`/leads/${row.original.id}/view`)}>
            {row.original.id}
          </span>
        );
      },
      enableSorting: true,
      size: 80,
      meta: { isVisible: true, sticky: 'left', stickyLeft: 160 },
    },
    {
      id: 'lead-first-name',
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
      id: 'lead-middle-name',
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
      id: 'lead-last-name',
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
      id: 'lead-birth-date',
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
      id: 'lead-email',
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
      id: 'lead-phone',
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
      id: 'address',
      header: () => <ColumnHeader title="Address" keyParam="address" />,
      cell: function Cell({ row }) {
        const tableCtx = useTableContext();
        if (tableCtx?.isLoading) return <Skeleton className="w-20 h-6" />;
        return <span className="w-full">{row.original.address || '-'}</span>;
      },
      size: 216,
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
      id: 'occupation',
      header: () => <ColumnHeader title="Occupation" keyParam="occupation" />,
      cell: function Cell({ row }) {
        const tableCtx = useTableContext();
        if (tableCtx?.isLoading) return <Skeleton className="w-20 h-6" />;
        return <span className="w-full">{row.original.occupation || '-'}</span>;
      },
      size: 280,
      meta: { isVisible: false },
    },
    {
      id: 'qualification',
      header: () => <ColumnHeader title="Qualification" keyParam="qualification" />,
      cell: function Cell({ row }) {
        const tableCtx = useTableContext();
        if (tableCtx?.isLoading) return <Skeleton className="w-20 h-6" />;
        return <span className="w-full">{row.original.qualification || '-'}</span>;
      },
      size: 160,
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
      id: 'visa',
      header: () => <ColumnHeader title="Visa" keyParam="visa" />,
      cell: function Cell({ row }) {
        const tableCtx = useTableContext();
        if (tableCtx?.isLoading) return <Skeleton className="w-20 h-6" />;
        return <span className="w-full">{row.original.visa || '-'}</span>;
      },
      size: 216,
      meta: { isVisible: false },
    },
    {
      id: 'visa-expiry',
      header: () => <ColumnHeader title="Visa expiry" keyParam="visaExpiry" />,
      cell: function Cell({ row }) {
        const tableCtx = useTableContext();
        if (tableCtx?.isLoading) return <Skeleton className="w-20 h-6" />;
        return (
          <span className="w-full">
            {row.original.visaExpiry ? format(new Date(row.original.visaExpiry as string), 'dd/MM/yyyy') : '-'}
          </span>
        );
      },
      size: 132,
      meta: { isVisible: false },
    },
    {
      id: 'service-type',
      header: () => <ColumnHeader title="Service type" keyParam="serviceType" />,
      cell: function Cell({ row }) {
        const tableCtx = useTableContext();
        if (tableCtx?.isLoading) return <Skeleton className="w-20 h-6" />;

        let serviceType: string | string[] = row.original.serviceType;

        try {
          if (typeof serviceType === 'string') {
            serviceType = JSON.parse(serviceType);
          }
        } catch (e) {
          serviceType = [];
        }

        const getServiceBadge = (type: ServiceType) => {
          switch (type) {
            case 'Education':
              return (
                <Badge key={type} className="bg-green-100 text-green-800 hover:bg-green-100">
                  {type}
                </Badge>
              );
            case 'Visa':
              return (
                <Badge key={type} className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                  {type}
                </Badge>
              );
            case 'Skill Assessment':
              return (
                <Badge key={type} className="bg-orange-100 text-orange-800 hover:bg-orange-100">
                  {type}
                </Badge>
              );
            case 'Health Insurance':
              return (
                <Badge key={type} className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
                  {type}
                </Badge>
              );
            default:
              return <span key={type}>{type}</span>;
          }
        };

        return (
          <div className="flex gap-1 flex-wrap">
            {Array.isArray(serviceType) && serviceType.map((type) => getServiceBadge(type as ServiceType))}
          </div>
        );
      },
      size: 176,
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
            case LeadStatusTypes.New:
              return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">New</Badge>;
            case LeadStatusTypes.Converted:
              return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Completed</Badge>;
            case LeadStatusTypes.NotConverted:
              return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Not Converted</Badge>;
            case LeadStatusTypes.FollowUp:
              return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Follow Up</Badge>;
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
      id: 'lead-actions',
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
                      router.push(`/leads/${row.original.id}/edit`);
                    }}
                    className="flex items-center gap-2 cursor-pointer hover:bg-accent-50 px-2 py-2 text-b1"
                  >
                    <Edit strokeWidth={1.5} className="h-5 w-5" />
                    <span>Edit</span>
                  </div>
                  <div
                    onClick={() => router.push(`/leads/${row.original.id}/view`)}
                    className="flex items-center gap-2 cursor-pointer hover:bg-accent-50 px-2 py-2 text-b1"
                  >
                    <Eye strokeWidth={1.5} className="h-5 w-5" />
                    <span>View</span>
                  </div>
                  <div className="flex items-center gap-2 cursor-pointer hover:bg-accent-50 px-2 py-2 text-b1">
                    <MessageCircle strokeWidth={1.5} className="h-5 w-5" />
                    <span>Send SMS</span>
                  </div>
                  <EmailDialog
                    trigger={
                      <div className="flex items-center gap-2 cursor-pointer hover:bg-accent-50 px-2 py-2 text-b1">
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
                      <div className="flex items-center gap-2 cursor-pointer hover:bg-accent-50 px-2 py-2 text-b1 text-red">
                        <Trash2 strokeWidth={1.5} className="h-5 w-5" />
                        <span>Delete Lead</span>
                      </div>
                    }
                    title="Delete this Lead"
                    description="Are you sure you want to delete this lead? Deleting this lead will remove all associated data, including contacts, interactions and notes."
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
  return LeadColumns;
};
