import React, { Dispatch, SetStateAction, useState } from "react";

import {
  ColumnDef,
  PaginationState,
  Row,
  SortingState,
  Table,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { cn } from "@/lib/cn";
import { TableContextProvider } from "../providers/table-context-provider";

interface Props<TData, TValue> {
  className?: string;
  data: TData[];
  columns: ColumnDef<TData, TValue>[];
  isLoading: boolean;
  rowSelectionState?: {};
  setRowSelectionState?: Dispatch<SetStateAction<{}>>;
}

const TableComponent = <TData, TValue>({
  className,
  data,
  columns,
  rowSelectionState,
  isLoading,
  setRowSelectionState,
}: Props<TData, TValue>) => {
  const memoizedColumns = React.useMemo(() => columns, [columns]);

  const memoizedData = React.useMemo(() => data || [], [data]);

  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable<TData>({
    data: memoizedData,
    columns: memoizedColumns,
    getPaginationRowModel: getPaginationRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onRowSelectionChange: setRowSelectionState || setRowSelection,
    manualPagination: true,
    getRowId: (row) => (row as any)?.id,
  });

  return (
    <TableContextProvider
      state={{ rowSelectionState: rowSelection, isLoading: isLoading }}
    >
      <div
        className={cn([
          "p-7 bg-white-100 min-w-[1174px] rounded-3xl border border-stroke-divider",
          className,
        ])}
      >
        <table className="w-full caption-bottom !border-none  ">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr
                className={cn([
                  "after:absolute after:w-full after:bottom-0 after:inset-x-0 after:h-0.5 after:bg-stroke-divider bg-white-100 sticky top-0 z-10",
                  "*:text-[.875rem] *:px-4 *:py-3.5 *:text-content-placeholder *:uppercase *:align-middle",
                  "first:*:pl-2 last:*:pr-2 px-4 py-3",
                  "*:text-left",
                  "*:align-middle *:[&:has([role=checkbox])]:pr-0",
                ])}
                key={headerGroup.id}
              >
                {headerGroup.headers.map((header) => (
                  <th key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row, idx) => (
                <tr
                  className={cn([
                    "group border-b border-stroke-divider transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted text-b1 text-content-body",
                    "*:px-4 *:py-3.5",
                    "first:*:pl-2 last:*:pr-2 px-4 py-3",
                    "*:text-left select-none",
                    "*:align-middle *:[&:has([role=checkbox])]:pr-0",
                  ])}
                  key={idx}
                >
                  {row.getVisibleCells().map((cell, i) => (
                    <td
                      className={cn([
                        "first:pl-2 last:pr-2 py-3 align-middle [&:has([role=checkbox])]:pr-0 last:text-end text-b1",
                      ])}
                      key={cell.id}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  className="h-24 !text-center text-content-placeholder first:pl-2 last:pr-2 px-4 py-3 align-middle [&:has([role=checkbox])]:pr-0 last:text-end "
                  colSpan={columns.length}
                >
                  No items.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </TableContextProvider>
  );
};

export default TableComponent;

