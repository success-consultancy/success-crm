import React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import TableSkeleton from "@/components/organisms/table-skeleton";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

type Props<T> = {
  columns: ColumnDef<T, unknown>[];
  data: T[];
  isLoading: boolean;
};

const CommonTable = <T,>({ columns, data, isLoading }: Props<T>) => {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div className="w-full">
      <ScrollArea className="w-full whitespace-nowrap">
        <Table className="w-full min-w-max overflow-x-auto">
          {!isLoading && data && data.length === 0 && (
            <TableCaption>
              <div className="mt-10">No items found</div>
            </TableCaption>
          )}
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="h-14">
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className={header.column.id === "select" ? "w-12" : ""}
                  >
                    <span className="text-b2b">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </span>
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableSkeleton count={columns.length} />
            ) : (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  className="h-14"
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
};

export default CommonTable;
