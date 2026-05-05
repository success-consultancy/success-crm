'use client';

import { useMemo, useState } from 'react';
import { format } from 'date-fns';
import { Download } from 'lucide-react';
import Container from '@/components/atoms/container';
import Portal from '@/components/atoms/portal';
import { PortalIds } from '@/config/portal';
import SectionLoader from '@/components/molecules/section-loader';
import { Button } from '@/components/ui/button';
import { useGetMe } from '@/query/get-me';
import { useGetClockRecords } from '@/query/get-clock-records';
import { useGetUserLeaves } from '@/query/get-user-leaves';
import {
  buildTimesheetRows,
  computeKpis,
  formatPercentDelta,
  previousPeriod,
} from '../_lib/timesheet-helpers';
import { resolveQuickRange } from '../_lib/quick-ranges';
import ProfileHeader from './profile-header';
import KpiCard from './kpi-card';
import TimesheetRangePicker from './timesheet-range-picker';
import TimesheetTable from './timesheet-table';

const isSameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

const TimesheetPage = () => {
  const { data: meRes, isLoading: meLoading } = useGetMe();
  const user = meRes?.data;

  const [range, setRange] = useState(() => resolveQuickRange('this_week'));

  const { data: clockRecords = [], isLoading: clockLoading } = useGetClockRecords(user?.id);
  const { data: leaves = [], isLoading: leavesLoading } = useGetUserLeaves(user?.id);

  const rows = useMemo(
    () => buildTimesheetRows(range.from, range.to, clockRecords, leaves),
    [range, clockRecords, leaves],
  );
  const kpis = useMemo(() => computeKpis(rows), [rows]);

  const prev = useMemo(() => previousPeriod(range.from, range.to), [range]);
  const prevRows = useMemo(
    () => buildTimesheetRows(prev.from, prev.to, clockRecords, leaves),
    [prev, clockRecords, leaves],
  );
  const prevKpis = useMemo(() => computeKpis(prevRows), [prevRows]);

  const todayRecord = useMemo(() => {
    const today = new Date();
    return clockRecords.find((c) => c.clockInTime && isSameDay(new Date(c.clockInTime), today)) ?? null;
  }, [clockRecords]);

  // Compare label: weekly periods say "vs last week", monthly (>14 days) say "vs last month".
  const days = Math.round((range.to.getTime() - range.from.getTime()) / 86400000) + 1;
  const comparisonLabel = days > 14 ? 'vs last month' : 'vs last week';

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
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `timesheet-${format(range.from, 'yyyy-MM-dd')}-to-${format(range.to, 'yyyy-MM-dd')}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (meLoading) return <SectionLoader />;

  return (
    <Container className="!p-6 m-4">
      <Portal rootId={PortalIds.DashboardHeader}>
        <h3 className="text-h4 text-content-heading font-bold">Timesheet</h3>
      </Portal>

      <div className="flex flex-col gap-4">
        <ProfileHeader user={user} todayRecord={todayRecord} />

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

        <div className="flex flex-col gap-3">
          <h4 className="text-base font-semibold text-gray-900">Time records</h4>
          <div className="flex items-center justify-between gap-2">
            <TimesheetRangePicker range={range} onChange={setRange} />
            <Button variant="outline" size="sm" onClick={handleExport} iconLeft={<Download className="w-4 h-4" />}>
              Export
            </Button>
          </div>
          <TimesheetTable rows={rows} isLoading={clockLoading || leavesLoading} />
        </div>
      </div>
    </Container>
  );
};

export default TimesheetPage;
