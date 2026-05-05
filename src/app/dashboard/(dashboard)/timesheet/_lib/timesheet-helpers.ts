import { ClockRecord } from '@/query/get-clock-records';
import { LeaveRecord } from '@/query/get-user-leaves';

export type DayType = 'Working day' | 'Weekly holiday' | 'On Leave';
export type DayStatus = 'Present' | 'On Leave' | 'Holiday' | 'Absent' | 'Upcoming';

export interface TimesheetRow {
  date: Date;
  dayType: DayType;
  status: DayStatus;
  clockIn?: ClockRecord | null;
  leave?: LeaveRecord | null;
}

const isSameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

const toDateOnly = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());

export const enumerateDates = (from: Date, to: Date): Date[] => {
  const start = toDateOnly(from);
  const end = toDateOnly(to);
  const out: Date[] = [];
  const cursor = new Date(start);
  while (cursor.getTime() <= end.getTime()) {
    out.push(new Date(cursor));
    cursor.setDate(cursor.getDate() + 1);
  }
  return out;
};

// Backend stores Leave dates as DD/MM/YYYY strings.
const parseLegacyDate = (s: string): Date | null => {
  if (!s) return null;
  const [d, m, y] = s.split('/').map(Number);
  if (!d || !m || !y) return null;
  return new Date(y, m - 1, d);
};

const isInLeaveRange = (date: Date, leave: LeaveRecord) => {
  const start = parseLegacyDate(leave.startDate);
  const end = parseLegacyDate(leave.endDate);
  if (!start || !end) return false;
  const t = toDateOnly(date).getTime();
  return t >= toDateOnly(start).getTime() && t <= toDateOnly(end).getTime();
};

export const buildTimesheetRows = (
  from: Date,
  to: Date,
  clockRecords: ClockRecord[],
  leaves: LeaveRecord[],
): TimesheetRow[] => {
  const today = toDateOnly(new Date()).getTime();
  return enumerateDates(from, to).map((date) => {
    const clock = clockRecords.find((c) => c.clockInTime && isSameDay(new Date(c.clockInTime), date)) ?? null;
    const leave = leaves.find((l) => l.status === 'approved' && isInLeaveRange(date, l)) ?? null;
    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
    const isFuture = toDateOnly(date).getTime() > today;

    let dayType: DayType;
    let status: DayStatus;

    if (leave) {
      dayType = 'On Leave';
      status = 'On Leave';
    } else if (isWeekend) {
      dayType = 'Weekly holiday';
      status = 'Holiday';
    } else {
      dayType = 'Working day';
      if (clock?.clockInTime) status = 'Present';
      else if (isFuture) status = 'Upcoming';
      else status = 'Absent';
    }

    return { date, dayType, status, clockIn: clock, leave };
  });
};

export interface TimesheetKpis {
  daysWorked: number;
  totalWorkHours: number;
  averageBreakMinutes: number;
  totalLeaveDays: number;
}

const breakMinutes = (c: ClockRecord) => {
  if (!c.breakStartTime || !c.breakEndTime) return null;
  const diff = new Date(c.breakEndTime).getTime() - new Date(c.breakStartTime).getTime();
  return Math.max(0, diff / 60000);
};

export const computeKpis = (rows: TimesheetRow[]): TimesheetKpis => {
  let daysWorked = 0;
  let totalWorkHours = 0;
  const breaks: number[] = [];
  let totalLeaveDays = 0;

  for (const r of rows) {
    if (r.clockIn?.clockInTime) {
      daysWorked += 1;
      const hours = parseFloat(r.clockIn.totalHours ?? '0');
      if (!isNaN(hours)) totalWorkHours += hours;
      const b = breakMinutes(r.clockIn);
      if (b !== null) breaks.push(b);
    }
    if (r.status === 'On Leave') totalLeaveDays += 1;
  }

  const averageBreakMinutes = breaks.length ? breaks.reduce((a, b) => a + b, 0) / breaks.length : 0;

  return {
    daysWorked,
    totalWorkHours: Math.round(totalWorkHours * 10) / 10,
    averageBreakMinutes: Math.round(averageBreakMinutes * 10) / 10,
    totalLeaveDays,
  };
};

export const formatPercentDelta = (current: number, previous: number): { label: string; positive: boolean } => {
  if (previous === 0) {
    if (current === 0) return { label: '0%', positive: true };
    return { label: '+100%', positive: true };
  }
  const delta = ((current - previous) / previous) * 100;
  const rounded = Math.round(delta);
  return { label: `${rounded > 0 ? '+' : ''}${rounded}%`, positive: rounded >= 0 };
};

export const previousPeriod = (from: Date, to: Date): { from: Date; to: Date } => {
  const days = Math.round((toDateOnly(to).getTime() - toDateOnly(from).getTime()) / 86400000) + 1;
  const prevTo = new Date(from);
  prevTo.setDate(prevTo.getDate() - 1);
  const prevFrom = new Date(prevTo);
  prevFrom.setDate(prevFrom.getDate() - (days - 1));
  return { from: prevFrom, to: prevTo };
};
