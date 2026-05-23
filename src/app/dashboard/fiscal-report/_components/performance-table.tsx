'use client';

import React from 'react';
import {
  createColumnHelper,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from '@tanstack/react-table';
import { cn } from '@/lib/utils';
import { ChevronDown, ChevronUp, ChevronsUpDown, Download, Pencil, Search } from 'lucide-react';
import Button from '@/components/atoms/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const MONTHS_INITIAL = ['jul', 'aug', 'sep', 'oct', 'nov', 'dec'] as const;
const MONTHS_FINAL = ['jan', 'feb', 'mar', 'apr', 'may', 'jun'] as const;
const MONTH_LABEL: Record<string, string> = {
  jul: 'Jul', aug: 'Aug', sep: 'Sep', oct: 'Oct', nov: 'Nov', dec: 'Dec',
  jan: 'Jan', feb: 'Feb', mar: 'Mar', apr: 'Apr', may: 'May', jun: 'Jun',
};

const now = new Date();
const CURRENT_MONTH_KEY = `${['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'][now.getMonth()]}${now.getFullYear()}`;

export interface ReportRow {
  name: string;
  target: Record<string, number>;
  actual: Record<string, number>;
}

type TableRow = ReportRow & { _index: number };

interface PerformanceTableProps {
  title: string;
  nameColumnHeader?: string;
  data: ReportRow[];
  initialYear: string;
  finalYear: string;
  isEdit?: boolean;
  isSaving?: boolean;
  isLoading?: boolean;
  onEditToggle?: () => void;
  onSave?: () => void;
  onCancel?: () => void;
  onCellChange?: (name: string, monthKey: string, value: number) => void;
  search?: string;
  onSearchChange?: (value: string) => void;
  fiscalYear?: string;
  onFiscalYearChange?: (value: string) => void;
  fiscalYears?: Array<{ value: string; label: string }>;
  onExport?: () => void;
}

function ProgressBar({ actual, target }: { actual: number; target: number }) {
  const pct = target > 0 ? Math.min(100, Math.round((actual / target) * 100)) : 0;
  const isVeryLow = pct > 0 && pct <= 15;
  return (
    <div className="flex items-center gap-2 min-w-[73px]">
      {isVeryLow ? (
        <div className="w-2 h-2 rounded-full bg-primary-blue flex-shrink-0" />
      ) : (
        <div className="w-10 h-1.5 bg-gray-100 rounded-full overflow-hidden flex-shrink-0">
          <div className="h-full rounded-full bg-primary-blue" style={{ width: `${pct}%` }} />
        </div>
      )}
      <span className="text-[11px] text-content-subtitle whitespace-nowrap">{pct}%</span>
    </div>
  );
}

const H_BG = 'bg-[#F9FAFB]';
const TOTAL_BG = 'bg-[#F9FAFB]';
const BD = 'border-stroke-divider';
const S_TARGET_R = 151;
const S_ACTUAL_R = 89;
const S_PROGRESS_R = 0;
const S_TOTAL_W = 213;
const DIVIDER = '#e5e7eb';
const LEFT_BORDER_ONLY = { boxShadow: `inset -1px 0 0 ${DIVIDER}` };
const LEFT_SHADOW_STYLE = { boxShadow: `4px 0 8px -2px rgba(0,0,0,0.18), inset -1px 0 0 ${DIVIDER}` };
const RIGHT_BORDER_ONLY = { boxShadow: `inset 1px 0 0 ${DIVIDER}` };
const RIGHT_SHADOW_STYLE = { boxShadow: `-4px 0 8px -2px rgba(0,0,0,0.18), inset 1px 0 0 ${DIVIDER}` };

function SortIcon({ sorted }: { sorted: false | 'asc' | 'desc' }) {
  if (!sorted) return <ChevronsUpDown className="w-3 h-3 opacity-40 flex-shrink-0" />;
  return sorted === 'asc'
    ? <ChevronUp className="w-3 h-3 flex-shrink-0" />
    : <ChevronDown className="w-3 h-3 flex-shrink-0" />;
}

const columnHelper = createColumnHelper<TableRow>();

export default function PerformanceTable({
  title,
  nameColumnHeader = 'Visa name',
  data,
  initialYear,
  finalYear,
  isEdit = false,
  isSaving = false,
  isLoading = false,
  onEditToggle,
  onSave,
  onCancel,
  onCellChange,
  search = '',
  onSearchChange,
  fiscalYear,
  onFiscalYearChange,
  fiscalYears,
  onExport,
}: PerformanceTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const scrollRef = React.useRef<HTMLDivElement>(null);
  const [showLeftShadow, setShowLeftShadow] = React.useState(false);
  const [showRightShadow, setShowRightShadow] = React.useState(false);

  React.useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    function update() {
      const { scrollLeft, scrollWidth, clientWidth } = el!;
      setShowLeftShadow(scrollLeft > 0);
      setShowRightShadow(scrollLeft < scrollWidth - clientWidth - 1);
    }
    update();
    el.addEventListener('scroll', update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => { el.removeEventListener('scroll', update); ro.disconnect(); };
  }, []);

  const allMonths = React.useMemo(() => [
    ...MONTHS_INITIAL.map((key) => ({ key, year: initialYear })),
    ...MONTHS_FINAL.map((key) => ({ key, year: finalYear })),
  ], [initialYear, finalYear]);

  const tableData = React.useMemo<TableRow[]>(
    () => data.map((row, i) => ({ ...row, _index: i })),
    [data],
  );

  const columns = React.useMemo<ColumnDef<TableRow, any>[]>(() => [
    columnHelper.accessor('_index', { id: 'sn' }),
    columnHelper.accessor('name', { id: 'name', sortingFn: 'alphanumeric' }),
    ...allMonths.flatMap((m) => {
      const key = `${m.key}${m.year}`;
      return [
        columnHelper.accessor((row) => row.target[key] ?? null, { id: `target-${key}` }),
        columnHelper.accessor((row) => row.actual[key] ?? null, { id: `actual-${key}` }),
      ];
    }),
    columnHelper.accessor((row) => row.target.total ?? null, { id: 'total-target' }),
    columnHelper.accessor((row) => row.actual.total ?? null, { id: 'total-actual' }),
    columnHelper.display({ id: 'progress' }),
  ], [allMonths]);

  const table = useReactTable({
    data: tableData,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    enableSortingRemoval: false,
  });

  const totals = React.useMemo(() => {
    if (!data.length) return null;
    const target: Record<string, number> = {};
    const actual: Record<string, number> = {};
    let totalTarget = 0;
    let totalActual = 0;
    data.forEach((row) => {
      allMonths.forEach((m) => {
        const key = `${m.key}${m.year}`;
        target[key] = (target[key] || 0) + (row.target[key] || 0);
        actual[key] = (actual[key] || 0) + (row.actual[key] || 0);
      });
      totalTarget += row.target.total || 0;
      totalActual += row.actual.total || 0;
    });
    return { target, actual, totalTarget, totalActual };
  }, [data, allMonths]);

  const snCol = table.getColumn('sn');
  const nameCol = table.getColumn('name');

  return (
    <div className="bg-white border border-stroke-divider rounded-lg overflow-hidden shadow-[0px_1px_2px_rgba(0,0,0,0.04)]">
      {/* Card header */}
      <div className={cn('border-b mx-4', BD)}>
        <div className={cn('py-4 border-b', BD)}>
          <h3 className="text-[15px] font-semibold text-content-heading">{title}</h3>
        </div>
        <div className="flex items-center justify-between gap-2 py-3">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-content-subtitle pointer-events-none" />
              <input
                type="text"
                placeholder={`Search by ${nameColumnHeader.toLowerCase()}`}
                value={search}
                onChange={(e) => onSearchChange?.(e.target.value)}
                className="pl-9 pr-3 h-9 w-52 border border-input rounded-md text-sm bg-transparent focus:outline-none focus:ring-1 focus:ring-ring focus:border-ring transition-colors"
              />
            </div>
            {fiscalYears && fiscalYear && onFiscalYearChange && (
              <Select value={fiscalYear} onValueChange={onFiscalYearChange}>
                <SelectTrigger className="w-[140px] h-9">
                  <SelectValue placeholder="Fiscal year" />
                </SelectTrigger>
                <SelectContent>
                  {fiscalYears.map((y) => (
                    <SelectItem key={y.value} value={y.value}>{y.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
          <div className="flex items-center gap-2">
            {!isEdit ? (
              <>
                <Button variant="outline" size="sm" onClick={onEditToggle} disabled={isLoading}>
                  <Pencil className="w-3.5 h-3.5" />
                  Edit targets
                </Button>
                <Button size="sm" onClick={onExport}>
                  <Download className="w-3.5 h-3.5" />
                  Export
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" size="sm" onClick={onCancel} disabled={isSaving}>Cancel</Button>
                <Button size="sm" onClick={onSave} disabled={isSaving}>
                  {isSaving ? 'Saving…' : 'Save'}
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Scrollable table */}
      <div ref={scrollRef} className="overflow-x-auto">
        <table className="border border-spacing-0" style={{ width: 'max-content', minWidth: '100%' }}>
          <thead>
            {/* Row 1: group headers */}
            <tr>
              {/* S.N — sticky left, spans 2 rows */}
              <th
                rowSpan={2}
                onClick={() => snCol?.toggleSorting()}
                style={{ width: 48, minWidth: 48 }}
                className={cn(
                  'sticky left-0 z-20 px-3 text-left text-[11px] font-bold text-content-heading border-b border-r align-middle cursor-pointer select-none',
                  BD, H_BG,
                )}
              >
                <div className="flex items-center justify-between">
                  S.N <SortIcon sorted={snCol?.getIsSorted() ?? false} />
                </div>
              </th>

              {/* Name — sticky left, spans 2 rows */}
              <th
                rowSpan={2}
                onClick={() => nameCol?.toggleSorting()}
                style={{ width: 260, minWidth: 260, ...(showLeftShadow ? LEFT_SHADOW_STYLE : LEFT_BORDER_ONLY) }}
                className={cn(
                  'sticky left-[48px] z-20 px-3 text-left text-[11px] font-bold text-content-heading border-b align-middle cursor-pointer select-none',
                  BD, H_BG,
                )}
              >
                <div className="flex items-center justify-between">
                  {nameColumnHeader} <SortIcon sorted={nameCol?.getIsSorted() ?? false} />
                </div>
              </th>

              {/* Month group headers */}
              {allMonths.map((m) => {
                const key = `${m.key}${m.year}`;
                const isCurrent = key === CURRENT_MONTH_KEY;
                return (
                  <th
                    key={`grp-${key}`}
                    colSpan={2}
                    className={cn(
                      'text-center text-[11px] font-bold text-content-heading border-b border-r h-9 px-2 whitespace-nowrap',
                      BD, isCurrent ? 'bg-green-100 text-green-700' : H_BG,
                    )}
                  >
                    {MONTH_LABEL[m.key]}
                  </th>
                );
              })}

              {/* Summary group header — sticky right */}
              <th
                colSpan={3}
                className={cn(
                  'sticky z-20 text-center text-[11px] font-bold text-content-heading border-b h-9',
                  BD, H_BG,
                )}
                style={{ right: S_PROGRESS_R, minWidth: `${S_TOTAL_W}px`, ...(showRightShadow ? RIGHT_SHADOW_STYLE : RIGHT_BORDER_ONLY) }}
              >
                Summary
              </th>
            </tr>

            {/* Row 2: sub-headers */}
            <tr>
              {allMonths.map((m) => {
                const key = `${m.key}${m.year}`;
                const isCurrent = key === CURRENT_MONTH_KEY;
                return (
                  <React.Fragment key={`sub-${key}`}>
                    <th className={cn('text-center text-[10px] font-semibold text-content-subtitle border-b h-8 w-[62px] px-2', BD, isCurrent ? 'bg-green-50' : H_BG)}>
                      Target
                    </th>
                    <th className={cn('text-center text-[10px] font-semibold text-content-subtitle border-b border-r h-8 w-[62px] px-2', BD, isCurrent ? 'bg-green-50' : H_BG)}>
                      Actual
                    </th>
                  </React.Fragment>
                );
              })}
              <th
                className={cn('sticky z-20 text-center text-[10px] font-semibold text-content-subtitle border-b h-8 w-[62px] px-2', BD, H_BG)}
                style={{ right: `${S_TARGET_R}px`, ...(showRightShadow ? RIGHT_SHADOW_STYLE : RIGHT_BORDER_ONLY) }}
              >
                Target
              </th>
              <th
                className={cn('sticky z-20 text-center text-[10px] font-semibold text-content-subtitle border-b h-8 w-[62px] px-2', BD, H_BG)}
                style={{ right: `${S_ACTUAL_R}px` }}
              >
                Actual
              </th>
              <th
                className={cn('sticky z-20 text-center text-[10px] font-semibold text-content-subtitle border-b h-8 w-[89px] px-2', BD, H_BG)}
                style={{ right: S_PROGRESS_R }}
              >
                Progress
              </th>
            </tr>
          </thead>

          <tbody>
            {/* Loading skeleton */}
            {isLoading && Array.from({ length: 10 }).map((_, i) => (
              <tr key={`skel-${i}`} className="h-[46px] bg-white border-b border-stroke-divider">
                <td style={{ minWidth: 48, width: 48 }} className="sticky left-0 z-10 px-3 border-b border-r bg-white border-stroke-divider">
                  <div className="h-3 w-4 bg-gray-100 rounded animate-pulse" />
                </td>
                <td style={{ minWidth: 260, width: 260, ...(showLeftShadow ? LEFT_SHADOW_STYLE : LEFT_BORDER_ONLY) }} className="sticky left-[48px] z-10 px-3 border-b bg-white border-stroke-divider">
                  <div className="h-3 w-32 bg-gray-100 rounded animate-pulse" />
                </td>
                {allMonths.map((m) => (
                  <React.Fragment key={`skel-${i}-${m.key}`}>
                    <td className="border-b px-2 border-stroke-divider"><div className="h-3 w-8 mx-auto bg-gray-100 rounded animate-pulse" /></td>
                    <td className="border-b border-r px-2 border-stroke-divider"><div className="h-3 w-8 mx-auto bg-gray-100 rounded animate-pulse" /></td>
                  </React.Fragment>
                ))}
                <td className="sticky z-10 border-b px-2 bg-white border-stroke-divider" style={{ right: `${S_TARGET_R}px`, minWidth: '62px', ...(showRightShadow ? RIGHT_SHADOW_STYLE : RIGHT_BORDER_ONLY) }}><div className="h-3 w-8 mx-auto bg-gray-100 rounded animate-pulse" /></td>
                <td className="sticky z-10 border-b px-2 bg-white border-stroke-divider" style={{ right: `${S_ACTUAL_R}px`, minWidth: '62px' }}><div className="h-3 w-8 mx-auto bg-gray-100 rounded animate-pulse" /></td>
                <td className="sticky z-10 border-b px-2 bg-white border-stroke-divider" style={{ right: S_PROGRESS_R, minWidth: '89px' }}><div className="h-3 w-16 bg-gray-100 rounded animate-pulse" /></td>
              </tr>
            ))}

            {/* Data rows */}
            {!isLoading && table.getRowModel().rows.map((row, i) => {
              const original = row.original;
              return (
                <tr key={original.name} className="group h-[46px] bg-white hover:bg-[#F4F7FA] transition-colors">
                  <td style={{ minWidth: 48, width: 48 }} className={cn('sticky left-0 z-10 px-3 text-[13px] text-content-subtitle border-b border-r bg-white group-hover:bg-[#F4F7FA] transition-colors', BD)}>
                    {i + 1}
                  </td>
                  <td style={{ minWidth: 260, width: 260, ...(showLeftShadow ? LEFT_SHADOW_STYLE : LEFT_BORDER_ONLY) }} className={cn('sticky left-[48px] z-10 px-3 text-[13px] text-content-heading border-b bg-white group-hover:bg-[#F4F7FA] transition-colors', BD)}>
                    <span className="block w-[236px] truncate">{original.name}</span>
                  </td>

                  {allMonths.map((m) => {
                    const key = `${m.key}${m.year}`;
                    const isCurrent = key === CURRENT_MONTH_KEY;
                    return (
                      <React.Fragment key={key}>
                        <td className={cn('text-center text-[13px] text-content-subtitle border-b px-2', BD, isCurrent && 'bg-green-50/60')}>
                          {isEdit ? (
                            <input
                              type="number"
                              min={0}
                              className="w-11 h-6 text-center text-xs border border-input rounded"
                              value={(original.target[key] ?? 0) || ''}
                              placeholder="0"
                              onChange={(e) => onCellChange?.(original.name, key, Number(e.target.value) || 0)}
                            />
                          ) : (
                            original.target[key] ?? '-'
                          )}
                        </td>
                        <td className={cn('text-center text-[13px] text-content-subtitle border-b border-r px-2', BD, isCurrent && 'bg-green-50/60')}>
                          {original.actual[key] ?? '-'}
                        </td>
                      </React.Fragment>
                    );
                  })}

                  <td
                    className={cn('sticky z-10 text-center text-[13px] text-content-subtitle border-b px-2 bg-white group-hover:bg-[#F4F7FA] transition-colors', BD)}
                    style={{ right: `${S_TARGET_R}px`, ...(showRightShadow ? RIGHT_SHADOW_STYLE : RIGHT_BORDER_ONLY) }}
                  >
                    {original.target.total ?? '-'}
                  </td>
                  <td
                    className={cn('sticky z-10 text-center text-[13px] text-content-subtitle border-b px-2 bg-white group-hover:bg-[#F4F7FA] transition-colors', BD)}
                    style={{ right: `${S_ACTUAL_R}px` }}
                  >
                    {original.actual.total ?? '-'}
                  </td>
                  <td
                    className={cn('sticky z-10 border-b px-2 bg-white group-hover:bg-[#F4F7FA] transition-colors', BD)}
                    style={{ right: S_PROGRESS_R }}
                  >
                    <ProgressBar actual={original.actual.total ?? 0} target={original.target.total ?? 0} />
                  </td>
                </tr>
              );
            })}

            {/* Total row */}
            {!isLoading && totals && data.length > 0 && (
              <tr className={cn('h-[46px]', TOTAL_BG)}>
                <td
                  colSpan={2}
                  style={{ minWidth: 308, ...(showLeftShadow ? LEFT_SHADOW_STYLE : LEFT_BORDER_ONLY) }}
                  className={cn('sticky left-0 z-10 px-3 text-[13px] font-semibold text-content-heading border-b', BD, TOTAL_BG)}
                >
                  Total
                </td>
                {allMonths.map((m) => {
                  const key = `${m.key}${m.year}`;
                  const t = totals.target[key] || 0;
                  const a = totals.actual[key] || 0;
                  const isCurrent = key === CURRENT_MONTH_KEY;
                  return (
                    <React.Fragment key={`total-${key}`}>
                      <td className={cn('text-center text-[13px] font-semibold text-content-heading border-b px-2', BD, isCurrent && 'bg-green-50/60')}>
                        {t}
                      </td>
                      <td className={cn(
                        'text-center text-[13px] font-semibold border-b border-r px-2',
                        BD, isCurrent && 'bg-green-50/60',
                        a >= t ? 'text-green-600' : 'text-red-500',
                      )}>
                        {a}
                      </td>
                    </React.Fragment>
                  );
                })}
                <td
                  className={cn('sticky z-10 text-center text-[13px] font-semibold text-content-heading border-b px-2', BD, TOTAL_BG)}
                  style={{ right: `${S_TARGET_R}px`, ...(showRightShadow ? RIGHT_SHADOW_STYLE : RIGHT_BORDER_ONLY) }}
                >
                  {totals.totalTarget}
                </td>
                <td
                  className={cn('sticky z-10 text-center text-[13px] font-semibold text-green-600 border-b px-2', BD, TOTAL_BG)}
                  style={{ right: `${S_ACTUAL_R}px` }}
                >
                  {totals.totalActual}
                </td>
                <td
                  className={cn('sticky z-10 border-b px-2', BD, TOTAL_BG)}
                  style={{ right: S_PROGRESS_R }}
                >
                  <ProgressBar actual={totals.totalActual} target={totals.totalTarget} />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
