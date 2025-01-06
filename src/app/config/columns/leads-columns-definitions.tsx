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
import { ILead, LeadStatusTypes } from "@/types/response-types/leads-response";
import { ColumnDef } from "@tanstack/react-table";
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
    ),
    cell: ({ row, table }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
  },
  {
    id: "lead-id",
    header: () => <ColumnHeader title="ID" keyParam="id" />,
    cell: ({ row }) => {
      const tableCtx = useTableContext();
      if (tableCtx?.isLoading) return <Skeleton className="w-5 h-6" />;
      return <span className="w-full">{row.original.id}</span>;
    },
    enableSorting: false,
  },
  {
    id: "lead-name",
    header: () => <ColumnHeader title="FULL NAME" keyParam="firstName" />,
    cell: ({ row }) => {
      const tableCtx = useTableContext();
      if (tableCtx?.isLoading) return <Skeleton className="w-20 h-6" />;
      return (
        <div className="flex items-center gap-1 w-full">
          <div className="flex flex-col gap-0.5">
            <span className="text-b1-b">
              {row.original.firstName} {row.original.middleName}{" "}
              {row.original.lastName}
            </span>
            <span className="text-b2">{row.original.email}</span>
          </div>
          <Badge
            variant={
              row.original.status === LeadStatusTypes.New ? "info" : "success"
            }
          >
            {row.original.status}
          </Badge>
        </div>
      );
    },
  },
  {
    id: "lead-phone",
    header: () => <ColumnHeader title="PHONE" keyParam="phone" />,
    cell: ({ row }) => {
      const tableCtx = useTableContext();
      if (tableCtx?.isLoading) return <Skeleton className="w-20 h-6" />;
      return <span className="w-full">{row.original.phone}</span>;
    },
  },
  {
    id: "lead-occupation",
    header: () => <ColumnHeader title="OCCUPATION" keyParam="occupation" />,
    cell: ({ row }) => {
      const tableCtx = useTableContext();
      if (tableCtx?.isLoading) return <Skeleton className="w-20 h-6" />;
      return <span className="w-full">{row.original.occupation || "-"}</span>;
    },
  },
  {
    id: "lead-qualification",
    header: () => (
      <ColumnHeader title="QUALIFICATION" keyParam="qualification" />
    ),
    cell: ({ row }) => {
      const tableCtx = useTableContext();
      if (tableCtx?.isLoading) return <Skeleton className="w-20 h-6" />;
      return (
        <span className="w-full">{row.original.qualification || "-"}</span>
      );
    },
  },
  {
    id: "lead-service",
    header: () => <ColumnHeader title="SERVICE" keyParam="serviceType" />,
    cell: ({ row }) => {
      const tableCtx = useTableContext();
      if (tableCtx?.isLoading) return <Skeleton className="w-20 h-6" />;
      return (
        <div className="flex items-center flex-wrap gap-1 w-full">
          {JSON.parse(row.original.serviceType)?.map(
            (service: string, idx: number) => {
              return (
                <Badge variant={"info"} key={idx}>
                  {service}
                </Badge>
              );
            }
          )}
        </div>
      );
    },
  },
  {
    id: "lead-actions",
    cell: ({ row }) => {
      const tableCtx = useTableContext();
      if (tableCtx?.isLoading) return <Skeleton className="w-20 h-6" />;
      return (
        <Popover>
          <PopoverTrigger>
            <EllipsisVertical />
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
      );
    },
  },
];

