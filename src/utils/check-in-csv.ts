import { ICheckIn } from '@/types/response-types/check-in-response';

// Formatting mirrors the check-in table cells (check-in-columns-definitions.tsx)
// so the exported CSV matches what the user sees in each tab.

const formatDateTime = (dateStr: string | null) => {
  if (!dateStr) return '-';
  const date = new Date(dateStr);
  return date.toLocaleString('en-AU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};

const formatWaitTime = (totalMinutes: string) => {
  const mins = parseInt(totalMinutes, 10);
  if (isNaN(mins)) return '-';
  if (mins < 60) return `${mins} minutes`;
  const days = Math.floor(mins / 1440);
  const hours = Math.floor((mins % 1440) / 60);
  const remainingMins = mins % 60;
  const parts: string[] = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (remainingMins > 0) parts.push(`${remainingMins}m`);
  return parts.join(' ') || '0m';
};

// Live elapsed time for active sessions that have no recorded waitTime yet.
const elapsedSince = (timerStart: string) => {
  const diffMin = Math.floor((Date.now() - new Date(timerStart).getTime()) / 60000);
  if (diffMin < 60) return `${diffMin} min`;
  const hours = Math.floor(diffMin / 60);
  const mins = diffMin % 60;
  return `${hours}h ${mins}m`;
};

const escapeCell = (value: unknown) => `"${String(value ?? '').replace(/"/g, '""')}"`;

export type CheckInTab = 'active' | 'history';

/**
 * Builds a CSV whose columns match the Active or History check-in table.
 * The two tabs differ only by the History-only "End time" column (CRM-149).
 */
export const buildCheckInCsv = (rows: ICheckIn[], tab: CheckInTab): string => {
  const isHistory = tab === 'history';

  const headers = [
    'ID',
    'First name',
    'Last name',
    'Email',
    'Phone',
    'Country of origin',
    'Status',
    'Start time',
    ...(isHistory ? ['End time'] : []),
    'Wait time',
  ];

  const dataRows = rows.map((r) => [
    r.id,
    r.lead?.firstName || '-',
    r.lead?.lastName || '-',
    r.lead?.email || '-',
    r.lead?.phone || '-',
    r.lead?.country || '-',
    r.isNew ? 'New' : 'Returning',
    formatDateTime(r.timerStart),
    ...(isHistory ? [formatDateTime(r.timerStop)] : []),
    r.waitTime ? formatWaitTime(r.waitTime) : isHistory ? '-' : elapsedSince(r.timerStart),
  ]);

  return [headers, ...dataRows].map((row) => row.map(escapeCell).join(',')).join('\n');
};
