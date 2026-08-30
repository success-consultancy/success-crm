import ColumnHeader from '@/components/molecules/column-header';
import MoveLeadDialog from '@/components/organisms/move-lead-dialog';
import { useMoveLead, MoveService } from '@/hooks/use-move-lead';
import { DateWithIndicator } from '@/components/molecules/date-with-indicator';
import { useTableContext } from '@/components/molecules/table-context-provider';
import TableRowActionsMenu from '@/components/organisms/table-row-actions-menu';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Skeleton } from '@/components/ui/skeleton';
import { SendEmailSchemaType } from '@/schema/send-email-schema';
import { LEAD_STATUS_COLORS } from '@/constants/lead-constants';
import { ServiceType } from '@/types/leads/leads-types';
import { LeadStatusTypes, type ILead } from '@/types/response-types/leads-response';
import type { ColumnDef } from '@tanstack/react-table';
import { format, formatDate } from 'date-fns';
import { Minus, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export const useLeadColumn = (
  handleDelete: (id: number) => void,
  handleSendEmail: (payload: SendEmailSchemaType) => void | Promise<unknown>,
  { canUpdate = true, canDelete = true }: { canUpdate?: boolean; canDelete?: boolean } = {},
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
          <span
            className="max-w-10 cursor-pointer"
            onClick={() => router.push(`/dashboard/leads/${row.original.id}/view`)}
          >
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
            case 'Tribunal':
              return (
                <Badge key={type} className="bg-purple-100 text-purple-800 hover:bg-purple-100">
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
        const colors = LEAD_STATUS_COLORS[status];

        if (!colors) return <span>{status}</span>;

        return (
          <div className="w-full">
            <Badge className="border-transparent" style={{ backgroundColor: colors.background, color: colors.text }}>
              {status === LeadStatusTypes.Converted ? 'Completed' : status}
            </Badge>
          </div>
        );
      },
      size: 152,
      meta: { isVisible: false },
    },
    {
      id: 'lead-actions',
      header: () => <Plus className="h-5 w-5 mx-auto" />,
      cell: function Cell({ row }) {
        const tableCtx = useTableContext();
        const { services, moveLead, pendingServiceId } = useMoveLead();
        const [confirmService, setConfirmService] = useState<MoveService | null>(null);

        if (tableCtx?.isLoading) return <Skeleton className="w-8 h-6" />;
        return (
          <>
            <TableRowActionsMenu
              canUpdate={canUpdate}
              canDelete={canDelete}
              onEdit={() => router.push(`/dashboard/leads/${row.original.id}/edit`)}
              onView={() => router.push(`/dashboard/leads/${row.original.id}/view`)}
              onSendEmail={handleSendEmail}
              recipientEmail={row.original.email}
              moveTo={{
                options: services,
                onSelect: (opt) => setConfirmService(services.find((s) => s.id === opt.id) ?? null),
              }}
              deleteTitle="Delete this lead"
              deleteDescription={
                <div className="flex flex-col gap-3">
                  <p>Are you sure you want to delete this lead?</p>
                  <p>Deleting this lead will remove all associated data, including contacts, interactions and notes.</p>
                </div>
              }
              deleteLabel="Delete Lead"
              deleteConfirmText="Yes, delete"
              onDelete={() => handleDelete(row.original.id)}
              animated
            />

            <MoveLeadDialog
              isOpen={!!confirmService}
              setIsOpen={(open) => {
                if (!open) setConfirmService(null);
              }}
              serviceTitle={confirmService?.title}
              onConfirm={async () => {
                if (!confirmService) return;
                try {
                  await moveLead(row.original, confirmService.id);
                } catch {
                  // Reported by moveLead's own toast.
                } finally {
                  setConfirmService(null);
                }
              }}
              onCancel={() => setConfirmService(null)}
              loading={pendingServiceId !== null}
            />
          </>
        );
      },
      size: 64,
      meta: { isVisible: true, sticky: 'right', stickyRight: 0 },
    },
  ];
  return LeadColumns;
};
