"use client";

import React, {
  type Dispatch,
  type ReactNode,
  type SetStateAction,
  useState,
} from "react";

import {
  type ColumnDef,
  type PaginationState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { cn } from "@/lib/cn";
import { TableContextProvider } from "../providers/table-context-provider";
import Pagination from "./pagination";
import usePagination from "@/hooks/use-pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import useSearchParams from "@/hooks/use-search-params";
import { TableCell, TableRow } from "../ui/table";
import TableSearchInput from "./table-search";
import { Separator } from "../ui/separator";

const ITEMS_PER_PAGE_OPTIONS = [
  {
    value: "25",
    label: "25",
  },
  {
    value: "50",
    label: "50",
  },
  {
    value: "100",
    label: "100",
  },
];

interface Props<TData, TValue> {
  className?: string;
  data: TData[];
  columns: ColumnDef<TData, TValue>[];
  isLoading: boolean;
  rowSelectionState?: {};
  setRowSelectionState?: Dispatch<SetStateAction<{}>>;
  currentPage?: number | string;
  offset?: number | string;
  totalItems?: number;
  skeletonColumns?: ColumnDef<TData, TValue>[];
  searchKey?: string;
  topRightSection?: ReactNode;
  tableHeight?: string;
}

const TableComponent = <TData, TValue>({
  className,
  data,
  columns,
  rowSelectionState,
  isLoading,
  setRowSelectionState,
  currentPage,
  offset,
  totalItems,
  skeletonColumns,
  searchKey,
  topRightSection,
  tableHeight = "calc(100vh - 300px)", // Default height, can be overridden via props
}: Props<TData, TValue>) => {
  const { setParam } = useSearchParams();

  const [rowSelection, setRowSelection] = useState({});

  const _currentPage = currentPage ? Number.parseInt(`${currentPage}`) : 1;

  const _offset = offset || 25;

  const _loadingSkeletonCount = _offset;

  const memoizedColumns = React.useMemo(
    () => (isLoading ? skeletonColumns : columns),
    [columns, isLoading, skeletonColumns]
  );

  const memoizedData = React.useMemo(
    () => (isLoading ? Array(_loadingSkeletonCount).fill("") : data || []),
    [data, _loadingSkeletonCount, isLoading]
  );

  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: _currentPage,
    pageSize: Number.parseInt(_offset.toString()),
  });

  const table = useReactTable<TData>({
    data: memoizedData as TData[],
    columns: memoizedColumns as ColumnDef<TData, any>[],
    getPaginationRowModel: getPaginationRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onRowSelectionChange: setRowSelectionState || setRowSelection,
    manualPagination: true,
    onPaginationChange: setPagination,
    pageCount: Number.parseInt(`${(totalItems || 0) / pagination.pageSize}`),
    getRowId: (row) => (row as any)?.id,
    state: {
      rowSelection,
    },
    enableColumnResizing: true,
    columnResizeMode: "onChange",
  });

  const paginationMethods = usePagination();

  return (
    <TableContextProvider state={{ rowSelectionState, isLoading: isLoading }}>
      <div
        className={cn([
          "flex flex-col p-7 bg-white-100 rounded-xl border border-stroke-divider h-full",
          className,
        ])}
      >
        <div className="flex w-full items-center justify-between pb-5 gap-5">
          <TableSearchInput
            searchParamField={searchKey as string}
            className="max-w-[18rem]"
            placeholder={`Search by ${searchKey}...`}
          />

          {topRightSection && <Separator orientation="vertical" />}
          {topRightSection}
        </div>

        {/* Single scrollable container for the entire table */}
        <div
          className="overflow-auto flex-1 custom-scrollbar"
          style={{ height: tableHeight }}
        >
          <table
            className="w-full caption-bottom !border-none"
            suppressHydrationWarning
          >
            <thead className="sticky top-0 z-10 bg-component-hoveredLight">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr
                  className={cn([
                    "after:absolute after:w-full after:bottom-0 after:inset-x-0 after:h-0.5 after:bg-neutral-borderLight",
                    "*:text-[.875rem] *:px-3 *:py-2 *:text-neutral-darkGrey *:uppercase *:align-middle",
                    "first:*:pl-2 last:*:pr-2 px-4 py-2",
                    "*:text-left",
                    "*:align-middle *:[&:has([role=checkbox])]:pr-0",
                  ])}
                  key={headerGroup.id}
                >
                  {headerGroup.headers.map((header, idx) => (
                    <th
                      key={header.id}
                      style={{
                        position: "relative",
                        width: header.getSize(),
                      }}
                      className="py-0 leading-[150%]"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                      {header.column.getCanResize() &&
                        idx < headerGroup.headers.length - 1 && (
                          <div
                            onMouseDown={header.getResizeHandler()}
                            onTouchStart={header.getResizeHandler()}
                            className={cn([
                              "absolute right-0 inset-y-0 m-auto h-full w-1 flex items-center justify-center cursor-col-resize",
                              header.column.getIsResizing()
                                ? "cursor-col-resize"
                                : "",
                            ])}
                          >
                            <div className="h-[60%] bg-border-normal w-0.5"></div>
                          </div>
                        )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row, idx) => (
                <tr
                  className={cn([
                    "group border-b border-stroke-divider transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted text-b1 text-content-body",
                    "*:px-4 *:py-2.5",
                    "first:*:pl-2 last:*:pr-2 px-4 py-2",
                    "*:text-left select-none",
                    "*:align-middle *:[&:has([role=checkbox])]:pr-0",
                    "last:border-none",
                  ])}
                  key={idx}
                >
                  {row.getVisibleCells().map((cell, i) => (
                    <td
                      className={cn([
                        "first:pl-2 last:pr-2 py-2 align-middle text-neutral-darkGrey [&:has([role=checkbox])]:pr-0 last:text-end text-b1",
                      ])}
                      key={cell.id}
                      style={{
                        width: cell.column.getSize(),
                      }}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))}
              {!skeletonColumns && isLoading && (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    Loading...
                  </TableCell>
                </TableRow>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination controls - fixed at bottom */}
        <div className="flex w-full items-center justify-end pt-5 gap-5 mt-auto">
          <div className="text-b1 flex items-center gap-2">
            <span>Items per page</span>
            <Select
              defaultValue={_offset.toString()}
              onValueChange={(val) => {
                setParam("limit", val);
              }}
            >
              <SelectTrigger className="w-fit">
                <SelectValue placeholder="25" />
              </SelectTrigger>
              <SelectContent className="max-w-fit">
                {ITEMS_PER_PAGE_OPTIONS.map((option, idx) => (
                  <SelectItem value={option.value} key={option.value + idx}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Pagination
            totalItems={totalItems || 0}
            offset={Number.parseInt(offset?.toString() as string)}
            // since tanstack table uses 0 index for 1st page, we need to add 1 to the current page
            currentPage={+_currentPage}
            onNextClick={paginationMethods.goToNextPage}
            onPreviousClick={paginationMethods.gotToPrevPage}
          />
        </div>
      </div>
    </TableContextProvider>
  );
};

export default TableComponent;

