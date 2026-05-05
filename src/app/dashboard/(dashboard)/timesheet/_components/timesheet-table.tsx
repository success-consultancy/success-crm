'use client';

import { format } from 'date-fns';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { TimesheetRow, DayStatus } from '../_lib/timesheet-helpers';

interface Props {
  rows: TimesheetRow[];
  isLoading?: boolean;
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
  Upcoming: 'bg-gray-50 text-gray-500 hover:bg-gray-50',
};

const TimesheetTable = ({ rows, isLoading }: Props) => {
  return (
    <div className="rounded-xl border border-gray-100 bg-white overflow-hidden">
      <Table>
        <TableHeader className="bg-gray-50">
          <TableRow className="border-b border-gray-100">
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
              <TableCell colSpan={9} className="text-center py-8 text-sm text-gray-500">
                Loading time records…
              </TableCell>
            </TableRow>
          )}
          {!isLoading && rows.length === 0 && (
            <TableRow>
              <TableCell colSpan={9} className="text-center py-8 text-sm text-gray-500">
                No records in this date range.
              </TableCell>
            </TableRow>
          )}
          {!isLoading &&
            rows.map((row) => (
              <TableRow key={row.date.toISOString()} className="border-b border-gray-50 last:border-0">
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
  );
};

const Th = ({ children }: { children: React.ReactNode }) => (
  <TableHead className="text-xs font-medium text-gray-500 uppercase tracking-wide px-4 py-3">{children}</TableHead>
);

const Td = ({ children }: { children: React.ReactNode }) => (
  <TableCell className="text-sm text-gray-700 px-4 py-3">{children}</TableCell>
);

export default TimesheetTable;
