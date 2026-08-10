import { format } from 'date-fns';
import { LeaveRecord } from '@/query/get-user-leaves';
import { parseLegacyDate } from './timesheet-helpers';

export const LEAVE_STATUS_STYLES: Record<string, string> = {
  approved: 'bg-green-100 text-green-700 hover:bg-green-100',
  rejected: 'bg-red-100 text-red-700 hover:bg-red-100',
  pending: 'bg-amber-100 text-amber-700 hover:bg-amber-100',
};

export const formatLeaveDate = (s: string | null | undefined) => {
  if (!s) return '-';
  const parsed = parseLegacyDate(s);
  return parsed ? format(parsed, 'd MMM yyyy') : s;
};

/**
 * Notes written in the legacy CRM come back as TinyMCE HTML. Render them as
 * plain text rather than injecting markup — the value is user-supplied.
 */
export const stripHtml = (html: string | null | undefined) => {
  if (!html) return '';
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
};

/** Inclusive day span of a leave request; falls back to 0 when dates are unparseable. */
export const leaveDayCount = (leave: LeaveRecord) => {
  const start = parseLegacyDate(leave.startDate);
  const end = parseLegacyDate(leave.endDate);
  if (!start || !end) return 0;
  return Math.round((end.getTime() - start.getTime()) / 86400000) + 1;
};

export const leaveTotalHours = (leave: LeaveRecord) => {
  const perDay = Number(leave.hoursPerDay);
  if (Number.isNaN(perDay)) return 0;
  return Math.round(leaveDayCount(leave) * perDay * 100) / 100;
};

/** Newest first, mirroring the backend's GET /leave ordering. */
export const sortLeavesByNewest = (leaves: LeaveRecord[]) =>
  [...leaves].sort((a, b) => new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime());
