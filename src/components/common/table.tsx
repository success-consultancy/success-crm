import React, { Dispatch, ReactNode, SetStateAction, useState } from "react";

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
}: Props<TData, TValue>) => {
  const { setParam } = useSearchParams();

  const [rowSelection, setRowSelection] = useState({});

  const _currentPage = currentPage ? parseInt(`${currentPage}`) : 1;

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
    pageSize: parseInt(_offset.toString()),
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
    pageCount: parseInt(`${(totalItems || 0) / pagination.pageSize}`),
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
          "p-7 bg-white-100 min-w-[1174px] rounded-xl border border-stroke-divider",
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
        <table
          className="w-full caption-bottom !border-none  "
          suppressHydrationWarning
        >
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr
                className={cn([
                  "after:absolute after:w-full after:bottom-0 after:inset-x-0 after:h-0.5 after:bg-stroke-divider bg-white-100 ",
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
            {table.getRowModel().rows.map((row, idx) => (
              <tr
                className={cn([
                  "group border-b border-stroke-divider transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted text-b1 text-content-body",
                  "*:px-4 *:py-3.5",
                  "first:*:pl-2 last:*:pr-2 px-4 py-3",
                  "*:text-left select-none",
                  "*:align-middle *:[&:has([role=checkbox])]:pr-0",
                  "last:border-none",
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
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
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
        <div className="flex w-full items-center justify-end pt-5 gap-5">
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
            offset={parseInt(offset?.toString() as string)}
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

