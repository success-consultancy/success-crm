'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown, Download, Pencil, Search } from 'lucide-react';
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

const LEFT_SHADOW = '[box-shadow:2px_0_5px_-2px_rgba(0,0,0,0.08)]';
const RIGHT_SHADOW = '[box-shadow:-2px_0_5px_-2px_rgba(0,0,0,0.08)]';

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
  const allMonths = React.useMemo(() => [
    ...MONTHS_INITIAL.map((key) => ({ key, year: initialYear })),
    ...MONTHS_FINAL.map((key) => ({ key, year: finalYear })),
  ], [initialYear, finalYear]);

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

  return (
    <div className="bg-white border border-stroke-divider rounded-lg overflow-hidden shadow-[0px_1px_2px_rgba(0,0,0,0.04)] px-4">
      {/* Card header */}
      <div className={cn('border-b', BD)}>
        <div className={cn('px-4 py-3 border-b', BD)}>
          <h3 className="text-[15px] font-semibold text-content-heading">{title}</h3>
        </div>
        <div className="flex items-center justify-between gap-2 px-4 py-3">
          {/* Left: search + fiscal year */}
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

          {/* Right: actions */}
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

      {/* Scrollable table — all 12 months render; overflow-x-auto drives horizontal scroll */}
      <div className="overflow-x-auto">
        <table className="border-collapse" style={{ width: 'max-content', minWidth: '100%' }}>
          <thead>
            {/* ── Row 1: group headers ── */}
            <tr>
              {/* S.N — sticky left, spans 2 rows */}
              <th
                rowSpan={2}
                className={cn(
                  'sticky left-0 z-20 w-[48px] min-w-[48px] px-3 text-left text-[11px] font-bold text-content-heading border-b border-r align-middle',
                  BD, H_BG,
                )}
              >
                <div className="flex items-center gap-0.5">
                  S.N <ChevronDown className="w-3 h-3 opacity-40 flex-shrink-0" />
                </div>
              </th>

              {/* Name column — sticky left, spans 2 rows */}
              <th
                rowSpan={2}
                className={cn(
                  'sticky left-[48px] z-20 w-[200px] min-w-[200px] px-3 text-left text-[11px] font-bold text-content-heading border-b border-r align-middle',
                  BD, H_BG, LEFT_SHADOW,
                )}
              >
                <div className="flex items-center gap-0.5">
                  {nameColumnHeader} <ChevronDown className="w-3 h-3 opacity-40 flex-shrink-0" />
                </div>
              </th>

              {/* All month group headers — scroll with the table */}
              {allMonths.map((m) => {
                const key = `${m.key}${m.year}`;
                const isCurrent = key === CURRENT_MONTH_KEY;
                return (
                  <th
                    key={`grp-${key}`}
                    colSpan={2}
                    className={cn(
                      'text-center text-[11px] font-bold text-content-heading border-b border-r h-9 px-2 whitespace-nowrap',
                      BD,
                      isCurrent ? 'bg-green-100 text-green-700' : H_BG,
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
                  'sticky z-20 text-center text-[11px] font-bold text-content-heading border-b border-l h-9',
                  BD, H_BG, RIGHT_SHADOW,
                )}
                style={{ right: S_PROGRESS_R, minWidth: `${S_TOTAL_W}px` }}
              >
                Summary
              </th>
            </tr>

            {/* ── Row 2: sub-headers ── */}
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

              {/* Summary sub-headers — individually sticky */}
              <th
                className={cn('sticky z-20 text-center text-[10px] font-semibold text-content-subtitle border-b border-l h-8 w-[62px] px-2', BD, H_BG)}
                style={{ right: `${S_TARGET_R}px` }}
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
                <td className="sticky left-0 z-10 px-3 border-b border-r bg-white border-stroke-divider">
                  <div className="h-3 w-4 bg-gray-100 rounded animate-pulse" />
                </td>
                <td className="sticky left-[48px] z-10 px-3 border-b border-r bg-white border-stroke-divider">
                  <div className="h-3 w-32 bg-gray-100 rounded animate-pulse" />
                </td>
                {allMonths.map((m) => (
                  <React.Fragment key={`skel-${i}-${m.key}`}>
                    <td className="border-b px-2 border-stroke-divider"><div className="h-3 w-8 mx-auto bg-gray-100 rounded animate-pulse" /></td>
                    <td className="border-b border-r px-2 border-stroke-divider"><div className="h-3 w-8 mx-auto bg-gray-100 rounded animate-pulse" /></td>
                  </React.Fragment>
                ))}
                <td className="sticky z-10 border-b border-l px-2 bg-white border-stroke-divider" style={{ right: `${S_TARGET_R}px`, minWidth: '62px' }}><div className="h-3 w-8 mx-auto bg-gray-100 rounded animate-pulse" /></td>
                <td className="sticky z-10 border-b px-2 bg-white border-stroke-divider" style={{ right: `${S_ACTUAL_R}px`, minWidth: '62px' }}><div className="h-3 w-8 mx-auto bg-gray-100 rounded animate-pulse" /></td>
                <td className="sticky z-10 border-b px-2 bg-white border-stroke-divider" style={{ right: S_PROGRESS_R, minWidth: '89px' }}><div className="h-3 w-16 bg-gray-100 rounded animate-pulse" /></td>
              </tr>
            ))}

            {/* Data rows — all white, hover #F4F7FA */}
            {!isLoading && data.map((row, i) => (
              <tr key={row.name} className="group h-[46px] bg-white hover:bg-[#F4F7FA] transition-colors">
                <td className={cn('sticky left-0 z-10 px-3 text-[13px] text-content-subtitle border-b border-r bg-white group-hover:bg-[#F4F7FA] transition-colors', BD)}>
                  {i + 1}
                </td>
                <td className={cn('sticky left-[48px] z-10 px-3 text-[13px] text-content-heading border-b border-r bg-white group-hover:bg-[#F4F7FA] transition-colors', BD, LEFT_SHADOW)}>
                  <span className="block w-[176px] truncate">{row.name}</span>
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
                            value={(row.target[key] ?? 0) || ''}
                            placeholder="0"
                            onChange={(e) => onCellChange?.(row.name, key, Number(e.target.value) || 0)}
                          />
                        ) : (
                          row.target[key] ?? '-'
                        )}
                      </td>
                      <td className={cn('text-center text-[13px] text-content-subtitle border-b border-r px-2', BD, isCurrent && 'bg-green-50/60')}>
                        {row.actual[key] ?? '-'}
                      </td>
                    </React.Fragment>
                  );
                })}

                <td
                  className={cn('sticky z-10 text-center text-[13px] text-content-subtitle border-b border-l px-2 bg-white group-hover:bg-[#F4F7FA] transition-colors', BD, RIGHT_SHADOW)}
                  style={{ right: `${S_TARGET_R}px` }}
                >
                  {row.target.total ?? '-'}
                </td>
                <td
                  className={cn('sticky z-10 text-center text-[13px] text-content-subtitle border-b px-2 bg-white group-hover:bg-[#F4F7FA] transition-colors', BD)}
                  style={{ right: `${S_ACTUAL_R}px` }}
                >
                  {row.actual.total ?? '-'}
                </td>
                <td
                  className={cn('sticky z-10 border-b px-2 bg-white group-hover:bg-[#F4F7FA] transition-colors', BD)}
                  style={{ right: S_PROGRESS_R }}
                >
                  <ProgressBar actual={row.actual.total ?? 0} target={row.target.total ?? 0} />
                </td>
              </tr>
            ))}

            {/* Total row */}
            {!isLoading && totals && data.length > 0 && (
              <tr className={cn('h-[46px]', TOTAL_BG)}>
                <td
                  colSpan={2}
                  className={cn('sticky left-0 z-10 px-3 text-[13px] font-semibold text-content-heading border-b border-r', BD, TOTAL_BG, LEFT_SHADOW)}
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
                        BD,
                        isCurrent && 'bg-green-50/60',
                        a >= t ? 'text-green-600' : 'text-red-500',
                      )}>
                        {a}
                      </td>
                    </React.Fragment>
                  );
                })}
                <td
                  className={cn('sticky z-10 text-center text-[13px] font-semibold text-content-heading border-b border-l px-2', BD, TOTAL_BG, RIGHT_SHADOW)}
                  style={{ right: `${S_TARGET_R}px` }}
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
