'use client';

import React, { CSSProperties, type Dispatch, type ReactNode, type SetStateAction, useState } from 'react';

import {
  Column,
  type ColumnDef,
  type PaginationState,
  TableState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import usePagination from '@/hooks/use-pagination';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import useSearchParams from '@/hooks/use-search-params';
import { TableCell, TableRow } from '../ui/table';
import TableSearchInput from '../molecules/table-search';
import { Separator } from '../ui/separator';
import { TableContextProvider } from '../molecules/table-context-provider';
import { cn } from '@/lib/utils';
import Pagination from '../molecules/pagination-component';
import { ColumnSelector } from '../molecules/table-column-selector';
import DeleteDialog from './delete.dialog';
import EmailDialog from './email.dialog';
import { Mail, Trash2 } from 'lucide-react';
import { DateRangePicker } from '../molecules/date-range.picker';
import { SendEmailSchemaType } from '@/schema/send-email-schema';

const ITEMS_PER_PAGE_OPTIONS = [
  {
    value: '25',
    label: '25',
  },
  {
    value: '50',
    label: '50',
  },
  {
    value: '100',
    label: '100',
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
  tableHeaderSection?: ReactNode;
  tableHeight?: string;
  onBulkDelete?: (ids: number[]) => void;
  onSendEmail?: (payload: SendEmailSchemaType) => void;
  handleDateRangeApply?: (range: { from: Date | undefined; to: Date | undefined }) => void;
  columnPinning?: TableState['columnPinning'];
  showHeaderSection?: boolean;
  showPaginationSection?: boolean;
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
  tableHeaderSection,
  tableHeight = 'calc(100vh - 300px)', // Default height, can be overridden via props
  onBulkDelete,
  handleDateRangeApply,
  onSendEmail,
  columnPinning,
  showHeaderSection = true,
  showPaginationSection = true,
}: Props<TData, TValue>) => {
  const { setParam } = useSearchParams();

  const [rowSelection, setRowSelection] = useState({});
  const [columnSizing, setColumnSizing] = useState({});
  const [columnVisibility, setColumnVisibility] = useState({});

  // Initialize column visibility by merging default columns with saved preferences
  React.useEffect(() => {
    if (columns && columns.length > 0) {
      // Always get the default columns that should be visible
      const defaultVisible = new Set(
        columns.filter((column) => (column as any).meta?.isVisible === true).map((column) => (column as any).id),
      );

      // Check for saved preferences in localStorage
      let savedColumns = new Set<string>();
      if (typeof window !== 'undefined') {
        try {
          const stored = localStorage.getItem('column-visibility');
          if (stored) {
            savedColumns = new Set(JSON.parse(stored) as string[]);
          }
        } catch (e) {
          console.error('Error reading column visibility from localStorage:', e);
        }
      }

      // Merge default columns with saved preferences
      const mergedVisible = new Set([...defaultVisible, ...savedColumns]);

      // Set visibility for all columns
      const initialVisibility: Record<string, boolean> = {};
      columns.forEach((column) => {
        const columnId = (column as any).id;
        initialVisibility[columnId] = mergedVisible.has(columnId);
      });
      setColumnVisibility(initialVisibility);
    }
  }, [columns]);

  const _currentPage = currentPage ? Number.parseInt(`${currentPage}`) : 1;

  const _offset = offset || 25;

  const _loadingSkeletonCount = _offset;

  const memoizedColumns = React.useMemo(
    () => (isLoading ? skeletonColumns : columns),
    [columns, isLoading, skeletonColumns],
  );

  const memoizedData = React.useMemo(
    () => (isLoading ? Array(_loadingSkeletonCount).fill('') : data || []),
    [data, _loadingSkeletonCount, isLoading],
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
      columnSizing,
      columnVisibility,
      columnPinning: columnPinning || {},
    },
    onColumnSizingChange: setColumnSizing,
    onColumnVisibilityChange: setColumnVisibility,
    enableColumnResizing: true,
    columnResizeMode: 'onChange',
    defaultColumn: {
      minSize: 40,
      maxSize: 500,
    },
  });

  const paginationMethods = usePagination();

  // Calculate total table width based on column sizes
  const totalTableWidth = React.useMemo(() => {
    return table.getAllColumns().reduce((acc, column) => {
      const meta = column.columnDef?.meta as any;
      if (!meta?.isVisible) {
        return acc;
      }

      return acc + column.getSize();
    }, 0);
  }, [table]);

  //important styles to make sticky column pinning
  const getCommonPinningStyles = <T,>(column: Column<T>, isHeaderColumn?: boolean): CSSProperties => {
    if (!column) return {};

    const isPinned = column.getIsPinned();

    // pinned shadow style
    const isLastLeftPinnedColumn = isPinned === 'left' && column.getIsLastColumn('left');
    const isFirstRightPinnedColumn = isPinned === 'right' && column.getIsFirstColumn('right');

    const boxShadow = isPinned
      ? isLastLeftPinnedColumn
        ? `-2px 0 2px -2px #D9E2E8 inset`
        : isFirstRightPinnedColumn
        ? `2px 0 2px -2px #D9E2E8 inset`
        : undefined
      : undefined;

    const backgroundColor = isPinned ? (isHeaderColumn ? 'var(--component-hovered-light)' : 'white') : undefined;

    return {
      boxShadow,
      left: isPinned === 'left' ? `${column.getStart('left')}px` : undefined,
      right: isPinned === 'right' ? `${column.getAfter('right')}px` : undefined,
      position: isPinned ? 'sticky' : 'relative',
      width: column.getSize(),
      zIndex: isPinned ? 1 : 0,
      backgroundColor,
    };
  };
  // Early return if columns are not properly initialized
  if (!columns || columns.length === 0) {
    return (
      <TableContextProvider state={{ rowSelectionState, isLoading: isLoading }}>
        <div
          className={cn(['flex flex-col p-7 bg-white-100 rounded-xl border border-stroke-divider h-full', className])}
        >
          <div className="flex items-center justify-center h-32 text-gray-500">No columns available</div>
        </div>
      </TableContextProvider>
    );
  }

  return (
    <TableContextProvider state={{ rowSelectionState, isLoading: isLoading }}>
      <div className={cn(['flex flex-col p-7 bg-white-100 rounded-xl border border-stroke-divider h-full', className])}>
        {showHeaderSection && (
          <div className="flex w-full items-center justify-between pb-5 gap-5">
            <div className="flex gap-2">
              <TableSearchInput
                searchParamField={searchKey as string}
                className="max-w-[18rem]"
                placeholder={`Search data here`}
              />
              <DateRangePicker onApply={handleDateRangeApply || (() => {})} />
            </div>

            <div className="flex items-center gap-3.5">
              <ColumnSelector table={table} />
              <Separator orientation="vertical" />
              {topRightSection}
            </div>
          </div>
        )}
        {table.getSelectedRowModel().rows.length > 0 && (
          <div className="flex items-center gap-3">
            {onSendEmail && (
              <EmailDialog
                trigger={<Mail className="cursor-pointer" />}
                recipientsCount={table.getSelectedRowModel().rows.length}
                onSend={onSendEmail}
                recipients={table.getSelectedRowModel().rows.map((row) => ({
                  email: (row as any).original.email,
                }))}
              />
            )}
            <DeleteDialog
              trigger={<Trash2 />}
              title="Delete this Lead"
              description="Are you sure you want to delete this lead? Deleting this lead will remove all associated data, including contacts, interactions and notes."
              onConfirm={async () => {
                const ids = await table.getSelectedRowModel().rows.map((row: any) => row.original.id);
                onBulkDelete?.(ids);
              }}
            />
          </div>
        )}

        {tableHeaderSection}

        {/* Single scrollable container for the entire table */}
        <div className="overflow-auto flex-1 custom-scrollbar" style={{ height: tableHeight }}>
          <table
            className="w-full caption-bottom !border-none"
            style={{ width: `${totalTableWidth}px`, tableLayout: 'fixed' }}
            suppressHydrationWarning
          >
            <thead className="sticky top-0 z-10 bg-component-hovered-light">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr
                  className={cn([
                    'after:absolute after:w-full after:bottom-0 after:inset-x-0 after:h-0.5 after:bg-neutral-border-light',
                    '*:text-[.875rem] *:px-3 *:py-2 *:text-neutral-darkGrey *:align-middle',
                    'first:*:pl-2 last:*:pr-2 px-4 py-2',
                    '*:text-left',
                    '*:align-middle',
                  ])}
                  key={headerGroup.id}
                >
                  {headerGroup.headers.map((header, idx) => (
                    <th
                      key={header.id}
                      style={{
                        position: 'relative',
                        width: `${header.getSize()}px`,
                        minWidth: `${header.getSize()}px`,
                        maxWidth: `${header.getSize()}px`,
                        ...getCommonPinningStyles(header.column, true),
                      }}
                      className="py-0 select-none leading-[150%] overflow-hidden text-ellipsis whitespace-nowrap"
                    >
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                      {header.column.getCanResize() && idx < headerGroup.headers.length - 1 && (
                        <div
                          onMouseDown={header.getResizeHandler()}
                          onTouchStart={header.getResizeHandler()}
                          className={cn([
                            'absolute right-0 top-0 h-full w-1 flex items-center justify-center cursor-col-resize z-10',
                            header.column.getIsResizing() ? 'bg-primary/50 w-1' : '',
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
                    'group border-b border-stroke-divider transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted text-neutral-dark-grey',
                    '*:px-4 *:py-2.5',
                    'px-4 py-2',
                    '*:text-left select-none',
                    '*:align-middle',
                    'last:border-none',
                  ])}
                  key={idx}
                >
                  {row.getVisibleCells().map((cell, i) => (
                    <td
                      className={cn([
                        'py-2 align-middle text-neutral-darkGrey last:text-end text-b1 overflow-hidden text-ellipsis whitespace-nowrap',
                      ])}
                      key={cell.id}
                      style={{
                        width: `${cell.column.getSize()}px`,
                        minWidth: `${cell.column.getSize()}px`,
                        maxWidth: `${cell.column.getSize()}px`,
                        ...getCommonPinningStyles(cell.column),
                      }}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
              {!skeletonColumns && isLoading && (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    Loading...
                  </TableCell>
                </TableRow>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination controls - fixed at bottom */}
        {showPaginationSection && (
          <div className="flex w-full items-center justify-end pt-5 gap-5 mt-auto">
            <div className="text-b1 flex items-center gap-2">
              <span>Items per page</span>
              <Select
                defaultValue={_offset.toString()}
                onValueChange={(val) => {
                  setParam('limit', val);
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
        )}
      </div>
    </TableContextProvider>
  );
};

export default TableComponent;
