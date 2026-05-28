'use client';

import { format } from 'date-fns';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Pagination from '@/components/molecules/pagination-component';
import { cn } from '@/lib/utils';
import { TimesheetRow, DayStatus } from '../_lib/timesheet-helpers';

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

interface Props {
  rows: TimesheetRow[];
  isLoading?: boolean;
  page?: number;
  pageSize?: number;
  totalItems?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
}

const formatTime = (iso: string | null | undefined) => {
  if (!iso) return '-';
  return new Date(iso).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });
};

const formatTotalHours = (h: string | null | undefined) => {
  if (!h) return '-';
  const num = parseFloat(h);
  if (isNaN(num)) return '-';
  const hours = Math.floor(num);
  const minutes = Math.round((num - hours) * 60);
  if (minutes === 0) return `${hours} hr`;
  return `${hours} hr ${minutes} min`;
};

const STATUS_STYLES: Record<DayStatus, string> = {
  Present: 'bg-green-100 text-green-700 hover:bg-green-100',
  'On Leave': 'bg-red-100 text-red-700 hover:bg-red-100',
  Holiday: 'bg-gray-100 text-gray-700 hover:bg-gray-100',
  Absent: 'bg-amber-100 text-amber-700 hover:bg-amber-100',
  Upcoming: 'bg-[#F9FAFB] text-neutral-light-grey hover:bg-[#F9FAFB]',
};

const TimesheetTable = ({
  rows,
  isLoading,
  page = 1,
  pageSize = 25,
  totalItems = 0,
  onPageChange,
  onPageSizeChange,
}: Props) => {
  const showPagination = totalItems > 0 && !!onPageChange;

  return (
    <div className="rounded-xl border border-neutral-border-light bg-white-100 overflow-hidden flex flex-col max-h-[calc(100vh-460px)] min-h-[280px]">
      {/* Scrollable table area — sticky header stays in view as rows scroll */}
      <div className="flex-1 overflow-auto custom-scrollbar">
        <Table>
          <TableHeader className="bg-[#F9FAFB] sticky top-0 z-10">
            <TableRow className="border-b border-neutral-border-light hover:bg-[#F9FAFB]">
              <Th>Date</Th>
              <Th>Day</Th>
              <Th>Day Type</Th>
              <Th>Clock in</Th>
              <Th>Break start</Th>
              <Th>Break end</Th>
              <Th>Clock out</Th>
              <Th>Total hours</Th>
              <Th>Status</Th>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8 text-b14 text-neutral-light-grey">
                  Loading time records…
                </TableCell>
              </TableRow>
            )}
            {!isLoading && rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8 text-b14 text-neutral-light-grey">
                  No records in this date range.
                </TableCell>
              </TableRow>
            )}
            {!isLoading &&
              rows.map((row) => (
                <TableRow key={row.date.toISOString()} className="border-b border-neutral-border-light last:border-0">
                  <Td>{format(row.date, 'd MMM yyyy')}</Td>
                  <Td>{format(row.date, 'EEEE')}</Td>
                  <Td>{row.dayType}</Td>
                  <Td>{formatTime(row.clockIn?.clockInTime)}</Td>
                  <Td>{formatTime(row.clockIn?.breakStartTime)}</Td>
                  <Td>{formatTime(row.clockIn?.breakEndTime)}</Td>
                  <Td>{formatTime(row.clockIn?.clockOutTime)}</Td>
                  <Td>{formatTotalHours(row.clockIn?.totalHours)}</Td>
                  <Td>
                    <Badge className={cn('font-medium border-0', STATUS_STYLES[row.status])}>{row.status}</Badge>
                  </Td>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>

      {/* Sticky pagination footer — stays pinned while table body scrolls */}
      {showPagination && (
        <div className="flex-shrink-0 flex w-full items-center justify-between gap-5 px-4 py-3 border-t border-neutral-border-light bg-white-100">
          <div className="flex items-center gap-2 text-b14 text-neutral-dark-grey">
            <span>Items per page</span>
            <Select value={String(pageSize)} onValueChange={(val) => onPageSizeChange?.(Number(val))}>
              <SelectTrigger className="w-fit h-8 px-2.5 rounded text-b14-500 text-neutral-dark-grey border-neutral-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PAGE_SIZE_OPTIONS.map((n) => (
                  <SelectItem key={n} value={String(n)}>
                    {n}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Pagination
            totalItems={totalItems}
            offset={pageSize}
            currentPage={page}
            onNextClick={(next) => onPageChange?.(next)}
            onPreviousClick={(prev) => onPageChange?.(prev)}
          />
        </div>
      )}
    </div>
  );
};

const Th = ({ children }: { children: React.ReactNode }) => (
  <TableHead className="text-b14-600 text-neutral-dark-grey px-3 py-3">{children}</TableHead>
);

const Td = ({ children }: { children: React.ReactNode }) => (
  <TableCell className="text-b14 text-neutral-dark-grey px-3 py-3">{children}</TableCell>
);

export default TimesheetTable;
