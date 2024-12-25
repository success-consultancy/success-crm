import { useTableContext } from "@/components/providers/table-context-provider";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ILead, LeadStatusTypes } from "@/types/response-types/leads-response";
import { ColumnDef } from "@tanstack/react-table";

export const LeadColumns: ColumnDef<ILead>[] = [
  {
    id: "lead-id",
    header: "ID",
    cell: ({ row }) => {
      const tableCtx = useTableContext();
      if (tableCtx?.isLoading) return <Skeleton className="w-5 h-6" />;
      return <span>{row.original.id}</span>;
    },
    enableSorting: false,
  },
  {
    id: "lead-name",
    header: "FULL NAME",
    cell: ({ row }) => {
      const tableCtx = useTableContext();
      if (tableCtx?.isLoading) return <Skeleton className="w-20 h-6" />;
      return (
        <div className="flex items-center gap-1">
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
    header: "PHONE",
    cell: ({ row }) => {
      const tableCtx = useTableContext();
      if (tableCtx?.isLoading) return <Skeleton className="w-20 h-6" />;
      return <span>{row.original.phone}</span>;
    },
  },
  {
    id: "lead-occupation",
    header: "OCCUPATION",
    cell: ({ row }) => {
      const tableCtx = useTableContext();
      if (tableCtx?.isLoading) return <Skeleton className="w-20 h-6" />;
      return <span>{row.original.occupation || "-"}</span>;
    },
  },
  {
    id: "lead-qualification",
    header: "QUALIFICATION",
    cell: ({ row }) => {
      const tableCtx = useTableContext();
      if (tableCtx?.isLoading) return <Skeleton className="w-20 h-6" />;
      return <span>{row.original.qualification || "-"}</span>;
    },
  },
];

