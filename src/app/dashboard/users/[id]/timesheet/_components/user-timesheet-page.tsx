'use client';

import { useEffect, useMemo, useState } from 'react';
import { format } from 'date-fns';
import { Download, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Container from '@/components/atoms/container';
import Portal from '@/components/atoms/portal';
import { PortalIds } from '@/config/portal';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import usePagination from '@/hooks/use-pagination';
import { useGetUserById } from '@/query/get-user';
import { useGetClockRecords } from '@/query/get-clock-records';
import { useGetUserLeaves } from '@/query/get-user-leaves';
import {
  buildTimesheetRows,
  computeKpis,
  formatPercentDelta,
  previousPeriod,
} from '@/app/dashboard/(dashboard)/timesheet/_lib/timesheet-helpers';
import { resolveQuickRange } from '@/app/dashboard/(dashboard)/timesheet/_lib/quick-ranges';
import KpiCard from '@/app/dashboard/(dashboard)/timesheet/_components/kpi-card';
import TimesheetRangePicker from '@/app/dashboard/(dashboard)/timesheet/_components/timesheet-range-picker';
import TimesheetTable from '@/app/dashboard/(dashboard)/timesheet/_components/timesheet-table';
import { downloadFile } from '@/utils/download';

const ROLES: Record<number, string> = {
  1: 'Super Admin',
  2: 'Manager',
  3: 'General user',
  4: 'Accountant',
  5: 'Lead management',
};

interface Props {
  userId: number;
}

const UserTimesheetPage = ({ userId }: Props) => {
  const router = useRouter();

  const { data: user, isLoading: userLoading } = useGetUserById(String(userId));
  const { data: clockRecords = [], isLoading: clockLoading } = useGetClockRecords(userId);
  const { data: leaves = [], isLoading: leavesLoading } = useGetUserLeaves(userId);

  const [range, setRange] = useState(() => resolveQuickRange('this_week'));

  const rows = useMemo(
    () => buildTimesheetRows(range.from, range.to, clockRecords, leaves),
    [range, clockRecords, leaves],
  );
  const kpis = useMemo(() => computeKpis(rows), [rows]);

  const { params: pageParams, setPage, setLimit, removePageParam } = usePagination({ limit: 25 });
  const page = pageParams.page;
  const pageSize = pageParams.limit;
  const totalItems = rows.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safePage = Math.min(page, totalPages);
  const pagedRows = useMemo(
    () => rows.slice((safePage - 1) * pageSize, safePage * pageSize),
    [rows, safePage, pageSize],
  );

  useEffect(() => {
    removePageParam();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [range.from, range.to]);

  const prev = useMemo(() => previousPeriod(range.from, range.to), [range]);
  const prevRows = useMemo(
    () => buildTimesheetRows(prev.from, prev.to, clockRecords, leaves),
    [prev, clockRecords, leaves],
  );
  const prevKpis = useMemo(() => computeKpis(prevRows), [prevRows]);

  const days = Math.round((range.to.getTime() - range.from.getTime()) / 86400000) + 1;
  const comparisonLabel = days > 14 ? 'vs last month' : 'vs last week';

  const fullName = user ? `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() : '';
  const initials = fullName
    .split(' ')
    .map((s) => s.charAt(0).toUpperCase())
    .join('')
    .slice(0, 2);

  const handleExport = () => {
    const csvRows = [
      ['Date', 'Day', 'Day Type', 'Clock In', 'Break Start', 'Break End', 'Clock Out', 'Total Hours', 'Status'],
      ...rows.map((r) => [
        format(r.date, 'd MMM yyyy'),
        format(r.date, 'EEEE'),
        r.dayType,
        r.clockIn?.clockInTime ? new Date(r.clockIn.clockInTime).toLocaleTimeString() : '',
        r.clockIn?.breakStartTime ? new Date(r.clockIn.breakStartTime).toLocaleTimeString() : '',
        r.clockIn?.breakEndTime ? new Date(r.clockIn.breakEndTime).toLocaleTimeString() : '',
        r.clockIn?.clockOutTime ? new Date(r.clockIn.clockOutTime).toLocaleTimeString() : '',
        r.clockIn?.totalHours ?? '',
        r.status,
      ]),
    ];
    const csv = csvRows
      .map((cols) => cols.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(','))
      .join('\n');
    downloadFile(
      csv,
      `timesheet-${fullName.replace(/\s+/g, '-')}-${format(range.from, 'yyyy-MM-dd')}-to-${format(range.to, 'yyyy-MM-dd')}.csv`,
      'text/csv;charset=utf-8;',
    );
  };

  return (
    <Container className="!p-6 m-4">
      <Portal rootId={PortalIds.DashboardHeader}>
        <h3 className="text-h5 text-content-heading font-bold">
          {userLoading ? 'Time sheet' : fullName || 'Time sheet'}
        </h3>
      </Portal>

      <div className="flex flex-col gap-4">
        {/* Back + Profile */}
        <div className="flex items-center gap-4 rounded-xl border border-neutral-border-light bg-white-100 px-6 py-5">
          <button
            onClick={() => router.push('/dashboard/users')}
            className="p-1.5 rounded-lg hover:bg-neutral-border-light text-neutral-dark-grey transition-colors flex-shrink-0"
            aria-label="Back to users"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>

          {userLoading ? (
            <div className="flex items-center gap-4 flex-1">
              <Skeleton className="h-14 w-14 rounded-full" />
              <div className="flex flex-col gap-2">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-4 w-56" />
              </div>
            </div>
          ) : user ? (
            <div className="flex items-center gap-4 flex-1">
              <Avatar className="w-14 h-14 flex-shrink-0">
                <AvatarImage src={(user as any).profileUrl ?? ''} alt={fullName} />
                <AvatarFallback className="bg-blue-100 text-blue-700 text-h5 font-bold">
                  {initials || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col gap-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-h5 font-bold text-neutral-black">{fullName}</h2>
                  <Badge variant="secondary" className="font-normal text-xs">
                    {ROLES[user.roleId] ?? `Role ${user.roleId}`}
                  </Badge>
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                      user.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'
                    }`}
                  >
                    {user.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm text-neutral-dark-grey flex-wrap">
                  <span>{user.email}</span>
                  {user.phone && <span>{user.phone}</span>}
                </div>
              </div>
            </div>
          ) : (
            <p className="text-neutral-dark-grey text-sm">User not found</p>
          )}
        </div>

        {/* KPI cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard
            label="Days Worked"
            value={kpis.daysWorked}
            delta={formatPercentDelta(kpis.daysWorked, prevKpis.daysWorked)}
            comparisonLabel={comparisonLabel}
            spark="up"
          />
          <KpiCard
            label="Total Work Hours"
            value={`${kpis.totalWorkHours} hr`}
            delta={formatPercentDelta(kpis.totalWorkHours, prevKpis.totalWorkHours)}
            comparisonLabel={comparisonLabel}
            spark="up"
          />
          <KpiCard
            label="Average Break"
            value={`${(kpis.averageBreakMinutes / 60).toFixed(1)} hr`}
            delta={formatPercentDelta(kpis.averageBreakMinutes, prevKpis.averageBreakMinutes)}
            comparisonLabel={comparisonLabel}
            spark="down"
          />
          <KpiCard
            label="Total Leave"
            value={kpis.totalLeaveDays}
            delta={formatPercentDelta(kpis.totalLeaveDays, prevKpis.totalLeaveDays)}
            comparisonLabel={comparisonLabel}
            spark="down"
          />
        </div>

        {/* Time records */}
        <div className="rounded-xl border border-neutral-border-light bg-white-100 px-4">
          <div className="py-4 border-b border-neutral-border-light">
            <h4 className="text-b16-600 text-neutral-black">Time records</h4>
          </div>
          <div className="flex items-center justify-between gap-2 py-4">
            <TimesheetRangePicker range={range} onChange={setRange} />
            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
              iconLeft={<Download className="w-4 h-4" />}
              className="h-9 px-4 text-b14-600 text-neutral-black border-neutral-border"
            >
              Export
            </Button>
          </div>
          <div className="pb-4">
            <TimesheetTable
              rows={pagedRows}
              isLoading={clockLoading || leavesLoading}
              page={safePage}
              pageSize={pageSize}
              totalItems={totalItems}
              onPageChange={setPage}
              onPageSizeChange={(n) => {
                setLimit(n);
                setPage(1);
              }}
            />
          </div>
        </div>
      </div>
    </Container>
  );
};

export default UserTimesheetPage;
