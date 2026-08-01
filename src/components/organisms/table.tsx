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
import useScrollShadows from '@/hooks/use-scroll-shadows';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import useSearchParams from '@/hooks/use-search-params';
import { TableCell, TableRow } from '../ui/table';
import TableSearchInput from '../molecules/table-search';
import { Separator } from '../ui/separator';
import { TableContextProvider, ColumnIdProvider } from '../molecules/table-context-provider';
import { cn } from '@/lib/utils';
import Pagination from '../molecules/pagination-component';
import { ColumnSelector } from '../molecules/table-column-selector';
import DeleteDialog from './delete.dialog';
import EmailDialog from './email.dialog';
import { Inbox, Mail, Trash2 } from 'lucide-react';
import { DateRangePicker } from '../molecules/date-range.picker';
import { SendEmailSchemaType } from '@/schema/send-email-schema';

const DEFAULT_EMPTY_STATE = (
  <div className="flex flex-col items-center justify-center py-16 text-center">
    <Inbox className="h-12 w-12 text-gray-300" />
    <h3 className="mt-4 text-base font-semibold text-gray-800">No data found</h3>
    <p className="mt-1 text-sm text-gray-500">There are no records to display.</p>
  </div>
);

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
  extraFilters?: ReactNode;
  emptyState?: ReactNode;
  tableHeight?: string;
  onBulkDelete?: (ids: number[]) => void;
  onSendEmail?: (payload: SendEmailSchemaType) => void;
  handleDateRangeApply?: (range: { from: Date | undefined; to: Date | undefined }) => void;
  columnPinning?: TableState['columnPinning'];
  onRowClick?: (row: TData) => void;
  showHeaderSection?: boolean;
  showPaginationSection?: boolean;
  bulkDeleteTitle?: string;
  bulkDeleteDescription?: React.ReactNode;
  bulkDeleteConfirmText?: string;
  onCellUpdate?: (row: TData, columnId: string, value: any) => void;
  meta?: any;
  storageKey?: string;
}

declare module '@tanstack/react-table' {
  interface TableMeta<TData> {
    updateData?: (rowIndex: number, columnId: string, value: unknown) => void;
    editingId?: number | null;
    draft?: Record<string, unknown>;
  }
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
  extraFilters,
  emptyState = DEFAULT_EMPTY_STATE,
  tableHeight = 'calc(100vh - 300px)', // Default height, can be overridden via props
  onBulkDelete,
  handleDateRangeApply,
  onSendEmail,
  columnPinning,
  showHeaderSection = true,
  showPaginationSection = true,
  onRowClick,
  bulkDeleteTitle,
  bulkDeleteDescription,
  bulkDeleteConfirmText,
  onCellUpdate,
  meta,
  storageKey = 'column-visibility',
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
      let hiddenColumns = new Set<string>();
      if (typeof window !== 'undefined') {
        try {
          const stored = localStorage.getItem(storageKey);
          if (stored) {
            savedColumns = new Set(JSON.parse(stored) as string[]);
          }
          // Columns explicitly hidden from a column-header menu stay hidden across reloads.
          const storedHidden = localStorage.getItem(`${storageKey}-hidden`);
          if (storedHidden) {
            hiddenColumns = new Set(JSON.parse(storedHidden) as string[]);
          }
        } catch (e) {
          console.error('Error reading column visibility from localStorage:', e);
        }
      }

      // Merge default columns with saved preferences, minus any explicitly hidden ones
      const mergedVisible = new Set([...defaultVisible, ...savedColumns]);

      // Set visibility for all columns
      const initialVisibility: Record<string, boolean> = {};
      columns.forEach((column) => {
        const columnId = (column as any).id;
        initialVisibility[columnId] = mergedVisible.has(columnId) && !hiddenColumns.has(columnId);
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
    meta: {
      ...meta,
      updateData:
        onCellUpdate &&
        ((rowIndex: number, columnId: string, value: unknown) => {
          const row = data[rowIndex];
          if (row != null) onCellUpdate(row, columnId, value);
        }),
    },
  });

  const paginationMethods = usePagination();

  // Hide a single column from its header menu, persisting the new visible set to
  // localStorage so it survives reloads (mirrors the ColumnSelector's behavior).
  const hideColumn = React.useCallback(
    (columnId: string) => {
      const col = table.getColumn(columnId);
      if (!col) return;
      if (typeof window !== 'undefined') {
        try {
          const key = `${storageKey}-hidden`;
          const hidden: string[] = JSON.parse(localStorage.getItem(key) || '[]');
          if (!hidden.includes(columnId)) {
            localStorage.setItem(key, JSON.stringify([...hidden, columnId]));
          }
        } catch (e) {
          console.error('Error persisting hidden column:', e);
        }
      }
      col.toggleVisibility(false);
    },
    [table, storageKey],
  );

  const { ref: scrollContainerRef, hasScrolledLeft, hasScrolledRight, updateShadows } = useScrollShadows<HTMLDivElement>();

  // Re-check scroll shadows whenever the row data changes (widths can shift)
  React.useEffect(() => {
    updateShadows();
  }, [data, updateShadows]);

  // Track the scroll container's inner width so we can spread any leftover space
  // across the data columns when not all columns are shown (CRM-181).
  const [containerWidth, setContainerWidth] = React.useState(0);
  React.useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const measure = () => setContainerWidth(el.clientWidth);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [scrollContainerRef]);

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

  // When the visible columns don't fill the container (some columns hidden),
  // spread the leftover width evenly across the unpinned "data" columns so the
  // table fills the width instead of leaving a trailing gap (CRM-181). Pinned
  // columns keep their fixed size — sticky offsets depend only on those.
  const visibleLeafColumns = table.getVisibleLeafColumns();
  const renderedColumnsWidth = visibleLeafColumns.reduce((acc, c) => acc + c.getSize(), 0);
  const unpinnedVisibleCount = visibleLeafColumns.filter((c) => !c.getIsPinned()).length;
  const flexExtraPerColumn =
    containerWidth > renderedColumnsWidth && unpinnedVisibleCount > 0
      ? (containerWidth - renderedColumnsWidth) / unpinnedVisibleCount
      : 0;
  const getColumnWidth = <T,>(column: Column<T>): number =>
    column.getSize() + (column.getIsPinned() ? 0 : flexExtraPerColumn);

  //important styles to make sticky column pinning
  const getCommonPinningStyles = <T,>(column: Column<T>, isHeaderColumn?: boolean): CSSProperties => {
    if (!column) return {};

    const isPinned = column.getIsPinned();
    const isLastLeftPinnedColumn = isPinned === 'left' && column.getIsLastColumn('left');
    const isFirstRightPinnedColumn = isPinned === 'right' && column.getIsFirstColumn('right');

    const boxShadow = isLastLeftPinnedColumn
      ? hasScrolledLeft
        ? 'inset -4px 0 6px -4px rgba(0,0,0,0.12)'
        : undefined
      : isFirstRightPinnedColumn
        ? hasScrolledRight
          ? 'inset 4px 0 6px -4px rgba(0,0,0,0.12)'
          : undefined
        : undefined;

    const backgroundColor = isPinned && isHeaderColumn ? 'var(--component-hovered-light)' : undefined;

    return {
      boxShadow,
      left: isPinned === 'left' ? `${column.getStart('left')}px` : undefined,
      right: isPinned === 'right' ? `${column.getAfter('right')}px` : undefined,
      position: isPinned ? 'sticky' : 'relative',
      width: getColumnWidth(column),
      zIndex: isPinned ? 10 : 0,
      backgroundColor,
      willChange: isPinned ? 'transform' : undefined,
    };
  };
  // Early return if columns are not properly initialized
  if (!columns || columns.length === 0) {
    return (
      <TableContextProvider state={{ rowSelectionState, isLoading: isLoading }}>
        <div className={cn(['flex flex-col p-4 bg-white-100 rounded-xl border border-gray-50 h-full', className])}>
          <div className="flex items-center justify-center h-32 text-gray-500">No columns available</div>
        </div>
      </TableContextProvider>
    );
  }

  return (
    <TableContextProvider state={{ rowSelectionState, isLoading: isLoading, hideColumn }}>
      <div className={cn(['flex flex-col p-4 bg-white-100 rounded-xl border border-gray-50 h-full', className])}>
        {showHeaderSection && (
          <div className="flex w-full items-center justify-between pb-5 gap-5">
            <div className="flex gap-2">
              <TableSearchInput
                searchParamField={searchKey as string}
                className="max-w-[18rem]"
                placeholder={`Search data here`}
              />
              <DateRangePicker onApply={handleDateRangeApply || (() => { })} />
              {extraFilters}
            </div>
            <div className="flex items-center gap-[14px]">
              <ColumnSelector table={table} storageKey={storageKey} />
              {topRightSection}
            </div>
          </div>
        )}
        {table.getSelectedRowModel().rows.length > 0 && (onSendEmail || onBulkDelete) && (
          <div className="flex items-center gap-3 ml-[9px]">
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
            {onBulkDelete && (
              <DeleteDialog
                trigger={<Trash2 />}
                title={bulkDeleteTitle || 'Delete Leads'}
                description={bulkDeleteDescription || ''}
                confirmText={bulkDeleteConfirmText}
                onConfirm={() => {
                  const ids = table.getSelectedRowModel().rows.map((row: any) => row.original.id);
                  onBulkDelete(ids);
                  table.toggleAllRowsSelected(false);
                }}
              />
            )}
          </div>
        )}

        {tableHeaderSection}

        {/* Single scrollable container for the entire table */}
        <div
          ref={scrollContainerRef}
          className="overflow-auto flex-1 min-h-0 custom-scrollbar"
          style={{ maxHeight: tableHeight }}
        >
          <table
            className="w-full caption-bottom !border-none"
            style={{ minWidth: `${totalTableWidth}px`, width: '100%', tableLayout: 'fixed' }}
            suppressHydrationWarning
          >
            <thead className="sticky top-0 z-[20] bg-component-hovered-light">
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
                        width: `${getColumnWidth(header.column)}px`,
                        minWidth: `${getColumnWidth(header.column)}px`,
                        maxWidth: `${getColumnWidth(header.column)}px`,
                        ...getCommonPinningStyles(header.column, true),
                      }}
                      className="py-0 select-none leading-[150%] overflow-hidden text-ellipsis whitespace-nowrap"
                    >
                      {header.isPlaceholder ? null : (
                        <ColumnIdProvider value={header.column.id}>
                          {flexRender(header.column.columnDef.header, header.getContext())}
                        </ColumnIdProvider>
                      )}
                      {header.column.getCanResize() && idx < headerGroup.headers.length - 1 && (
                        <div
                          onMouseDown={header.getResizeHandler()}
                          onTouchStart={header.getResizeHandler()}
                          className={cn([
                            'absolute right-0 top-0 h-full w-1 flex items-center justify-center cursor-col-resize z-10',
                            header.column.getIsResizing() ? 'bg-primary/50 w-1' : '',
                          ])}
                        >
                          <div className="h-[60%] hover:bg-border-normal w-0.5"></div>
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
                    'group border-b border-gray-50 transition-colors hover:bg-muted data-[state=selected]:bg-muted text-neutral-dark-grey',
                    '*:px-4 *:py-2.5',
                    'px-4 py-2',
                    '*:text-left select-none',
                    '*:align-middle',
                    'last:border-none',
                    onRowClick && !isLoading && 'cursor-pointer',
                  ])}
                  key={idx}
                  onClick={(e) => {
                    // Don't trigger row click if clicking on a button, checkbox, or link
                    const target = e.target as HTMLElement;
                    const isInteractiveElement =
                      target.tagName === 'BUTTON' ||
                      target.tagName === 'INPUT' ||
                      target.tagName === 'A' ||
                      target.closest('button') ||
                      target.closest('input') ||
                      target.closest('a');

                    if (!isInteractiveElement && onRowClick && !isLoading) {
                      onRowClick(row.original);
                    }
                  }}
                >
                  {row.getVisibleCells().map((cell, i) => {
                    const isPinned = cell.column.getIsPinned();
                    return (
                      <td
                        className={cn([
                          'py-2 align-middle text-neutral-darkGrey last:text-end text-b1 overflow-hidden text-ellipsis whitespace-nowrap relative',
                          isPinned && 'bg-white group-hover:bg-muted transition-colors duration-200',
                          isPinned && 'z-10',
                        ])}
                        key={cell.id}
                        style={{
                          width: `${getColumnWidth(cell.column)}px`,
                          minWidth: `${getColumnWidth(cell.column)}px`,
                          maxWidth: `${getColumnWidth(cell.column)}px`,
                          ...getCommonPinningStyles(cell.column),
                        }}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    );
                  })}
                </tr>
              ))}
              {!isLoading && table.getRowModel().rows.length === 0 && emptyState && (
                <tr>
                  <td colSpan={columns.length}>
                    {emptyState}
                  </td>
                </tr>
              )}
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
          <div className="flex w-full items-center justify-between pt-5 gap-5 mt-auto">
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
    </TableContextProvider >
  );
};

export default TableComponent;
