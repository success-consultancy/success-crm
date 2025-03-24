import ColumnHeader from "@/components/common/column-header";
import { useTableContext } from "@/components/providers/table-context-provider";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import {
  LeadStatusTypes,
  type ILead,
} from "@/types/response-types/leads-response";
import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import {
  Edit,
  EllipsisVertical,
  Eye,
  Mail,
  MessageCircle,
  Minus,
} from "lucide-react";

export const LeadColumns: ColumnDef<ILead>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <div className="w-full h-full flex items-center justify-center">
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
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
    cell: ({ row, table }) => (
      <div className="w-full h-full flex items-center justify-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      </div>
    ),
    size: 40,
  },
  {
    id: "lead-id",
    header: () => <ColumnHeader title="ID" keyParam="id" className="h-10" />,
    cell: ({ row }) => {
      const tableCtx = useTableContext();
      if (tableCtx?.isLoading) return <Skeleton className="w-5 h-6" />;
      return <span className="max-w-10">{row.original.id}</span>;
    },
    enableSorting: true,
    size: 80,
  },
  {
    id: "lead-first-name",
    header: () => <ColumnHeader title="First name" keyParam="firstName" />,
    cell: ({ row }) => {
      const tableCtx = useTableContext();
      if (tableCtx?.isLoading) return <Skeleton className="w-20 h-6" />;
      return <div className="">{row.original.firstName}</div>;
    },
    size: 120,
  },
  {
    id: "lead-middle-name",
    header: () => <ColumnHeader title="Middle name" keyParam="middleName" />,
    cell: ({ row }) => {
      const tableCtx = useTableContext();
      if (tableCtx?.isLoading) return <Skeleton className="w-20 h-6" />;
      return <div className="">{row.original.middleName}</div>;
    },
    size: 120,
  },
  {
    id: "lead-last-name",
    header: () => <ColumnHeader title="Last name" keyParam="lastName" />,
    cell: ({ row }) => {
      const tableCtx = useTableContext();
      if (tableCtx?.isLoading) return <Skeleton className="w-20 h-6" />;
      return <div className="">{row.original.lastName}</div>;
    },
    size: 120,
  },
  {
    id: "lead-birth-date",
    header: () => <ColumnHeader title="Birth date" keyParam="dob" />,
    cell: ({ row }) => {
      const tableCtx = useTableContext();
      if (tableCtx?.isLoading) return <Skeleton className="w-20 h-6" />;
      return <span className="w-full">{row.original.dob}</span>;
    },
    size: 100,
  },
  {
    id: "lead-email",
    header: () => <ColumnHeader title="Email" keyParam="email" />,
    cell: ({ row }) => {
      const tableCtx = useTableContext();
      if (tableCtx?.isLoading) return <Skeleton className="w-20 h-6" />;
      return <span className="w-full">{row.original.email}</span>;
    },
    size: 200,
  },
  {
    id: "lead-phone",
    header: () => <ColumnHeader title="Phone" keyParam="phone" />,
    cell: ({ row }) => {
      const tableCtx = useTableContext();
      if (tableCtx?.isLoading) return <Skeleton className="w-20 h-6" />;
      return <span className="w-full">{row.original.phone}</span>;
    },
    size: 130,
  },
  {
    id: "passport-no",
    header: () => <ColumnHeader title="Passport no." keyParam="passportNo" />,
    cell: ({ row }) => {
      const tableCtx = useTableContext();
      if (tableCtx?.isLoading) return <Skeleton className="w-20 h-6" />;
      return <span className="w-full">{row.original.passport}</span>;
    },
    size: 120,
  },
  {
    id: "issue-date",
    header: () => <ColumnHeader title="Issue date" keyParam="issueDate" />,
    cell: ({ row }) => {
      const tableCtx = useTableContext();
      if (tableCtx?.isLoading) return <Skeleton className="w-20 h-6" />;
      return <span className="w-full">{row.original.issueDate}</span>;
    },
    size: 100,
  },
  {
    id: "expiry-date",
    header: () => <ColumnHeader title="Expiry date" keyParam="expiryDate" />,
    cell: ({ row }) => {
      const tableCtx = useTableContext();
      if (tableCtx?.isLoading) return <Skeleton className="w-20 h-6" />;
      return <span className="w-full">{row.original.expiryDate}</span>;
    },
    size: 100,
  },
  {
    id: "address",
    header: () => <ColumnHeader title="Address" keyParam="address" />,
    cell: ({ row }) => {
      const tableCtx = useTableContext();
      if (tableCtx?.isLoading) return <Skeleton className="w-20 h-6" />;
      return <span className="w-full">{row.original.address}</span>;
    },
    size: 200,
  },
  {
    id: "location",
    header: () => <ColumnHeader title="Location" keyParam="location" />,
    cell: ({ row }) => {
      const tableCtx = useTableContext();
      if (tableCtx?.isLoading) return <Skeleton className="w-20 h-6" />;
      return <span className="w-full">{row.original.location}</span>;
    },
    size: 120,
  },
  {
    id: "occupation",
    header: () => <ColumnHeader title="Occupation" keyParam="occupation" />,
    cell: ({ row }) => {
      const tableCtx = useTableContext();
      if (tableCtx?.isLoading) return <Skeleton className="w-20 h-6" />;
      return <span className="w-full">{row.original.occupation}</span>;
    },
    size: 150,
  },
  {
    id: "qualification",
    header: () => (
      <ColumnHeader title="Qualification" keyParam="qualification" />
    ),
    cell: ({ row }) => {
      const tableCtx = useTableContext();
      if (tableCtx?.isLoading) return <Skeleton className="w-20 h-6" />;
      return <span className="w-full">{row.original.qualification}</span>;
    },
    size: 150,
  },
  {
    id: "country",
    header: () => <ColumnHeader title="Country" keyParam="country" />,
    cell: ({ row }) => {
      const tableCtx = useTableContext();
      if (tableCtx?.isLoading) return <Skeleton className="w-20 h-6" />;
      return <span className="w-full">{row.original.country}</span>;
    },
    size: 120,
  },
  {
    id: "visa",
    header: () => <ColumnHeader title="Visa" keyParam="visa" />,
    cell: ({ row }) => {
      const tableCtx = useTableContext();
      if (tableCtx?.isLoading) return <Skeleton className="w-20 h-6" />;
      return <span className="w-full">{row.original.visa}</span>;
    },
    size: 120,
  },
  {
    id: "visa-expiry",
    header: () => <ColumnHeader title="Visa expiry" keyParam="visaExpiry" />,
    cell: ({ row }) => {
      const tableCtx = useTableContext();
      if (tableCtx?.isLoading) return <Skeleton className="w-20 h-6" />;
      return (
        <span className="w-full">
          {row.original.visaExpiry
            ? format(new Date(row.original.visaExpiry as string), "dd/MM/yyyy")
            : "-"}
        </span>
      );
    },
    size: 100,
  },
  {
    id: "service-type",
    header: () => <ColumnHeader title="Service type" keyParam="serviceType" />,
    cell: ({ row }) => {
      const tableCtx = useTableContext();
      if (tableCtx?.isLoading) return <Skeleton className="w-20 h-6" />;

      const serviceType = row.original.serviceType;
      const getServiceBadge = () => {
        switch (serviceType) {
          case "Education":
            return (
              <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                Education
              </Badge>
            );
          case "Visa":
            return (
              <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                Visa
              </Badge>
            );
          case "Skill Assessment":
            return (
              <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">
                Skill Assessment
              </Badge>
            );
          default:
            return <span>{serviceType}</span>;
        }
      };

      return <div className="w-full">{getServiceBadge()}</div>;
    },
    size: 130,
  },
  {
    id: "source",
    header: () => <ColumnHeader title="Source" keyParam="source" />,
    cell: ({ row }) => {
      const tableCtx = useTableContext();
      if (tableCtx?.isLoading) return <Skeleton className="w-20 h-6" />;
      return <span className="w-full">{row.original.sourceId}</span>;
    },
    size: 120,
  },
  {
    id: "assigned-to",
    header: () => <ColumnHeader title="Assigned to" keyParam="assignedTo" />,
    cell: ({ row }) => {
      const tableCtx = useTableContext();
      if (tableCtx?.isLoading) return <Skeleton className="w-20 h-6" />;
      return (
        <div className="flex items-center gap-2">
          <span>Assigned To</span>
        </div>
      );
    },
    size: 130,
  },
  {
    id: "follow-up",
    header: () => <ColumnHeader title="Follow up" keyParam="followUp" />,
    cell: ({ row }) => {
      const tableCtx = useTableContext();
      if (tableCtx?.isLoading) return <Skeleton className="w-20 h-6" />;

      return <div className="w-full">Show Follow Up</div>;
    },
    size: 120,
  },
  {
    id: "status",
    header: () => <ColumnHeader title="Status" keyParam="status" />,
    cell: ({ row }) => {
      const tableCtx = useTableContext();
      if (tableCtx?.isLoading) return <Skeleton className="w-20 h-6" />;

      const status = row.original.status;
      const getStatusBadge = () => {
        switch (status) {
          case LeadStatusTypes.New:
            return (
              <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                New
              </Badge>
            );
          case LeadStatusTypes.Converted:
            return (
              <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                Completed
              </Badge>
            );
          case LeadStatusTypes.NotConverted:
            return (
              <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
                Not Converted
              </Badge>
            );
          case LeadStatusTypes.FollowUp:
            return (
              <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
                Follow Up
              </Badge>
            );
          default:
            return <span>{status}</span>;
        }
      };

      return <div className="w-full">{getStatusBadge()}</div>;
    },
    size: 120,
  },
  {
    id: "lead-actions",
    header: () => <span className="sr-only">Actions</span>,
    cell: ({ row }) => {
      const tableCtx = useTableContext();
      if (tableCtx?.isLoading) return <Skeleton className="w-8 h-6" />;
      return (
        <div className="flex justify-end">
          <Popover>
            <PopoverTrigger>
              <EllipsisVertical className="h-5 w-5 text-muted-foreground" />
            </PopoverTrigger>
            <PopoverContent className="w-[12.5rem] bg-white-100 p-2">
              <div className="flex flex-col">
                <div className="flex items-center gap-2 cursor-pointer hover:bg-accent-50 px-2 py-2 text-b1">
                  <Edit strokeWidth={1.5} className="h-5 w-5" />
                  <span>Edit</span>
                </div>
                <div className="flex items-center gap-2 cursor-pointer hover:bg-accent-50 px-2 py-2 text-b1">
                  <Eye strokeWidth={1.5} className="h-5 w-5" />
                  <span>View</span>
                </div>
                <div className="flex items-center gap-2 cursor-pointer hover:bg-accent-50 px-2 py-2 text-b1">
                  <MessageCircle strokeWidth={1.5} className="h-5 w-5" />
                  <span>Send SMS</span>
                </div>
                <div className="flex items-center gap-2 cursor-pointer hover:bg-accent-50 px-2 py-2 text-b1">
                  <Mail strokeWidth={1.5} className="h-5 w-5" />
                  <span>Send Email</span>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      );
    },
    size: 60,
  },
];
