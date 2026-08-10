/**
 * Compact "time ago" label for feeds, e.g. "just now", "4h ago", "3d ago".
 * Deliberately short — it sits right-aligned beside notification text.
 */
export const formatRelativeTime = (from: string | Date) => {
  const start = typeof from === 'string' ? new Date(from).getTime() : from.getTime();
  if (Number.isNaN(start)) return '';

  const diffMin = Math.max(0, Math.floor((Date.now() - start) / 60000));
  if (diffMin < 1) return 'just now';
  if (diffMin < 60) return `${diffMin}m ago`;

  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour}h ago`;

  const diffDay = Math.floor(diffHour / 24);
  if (diffDay < 7) return `${diffDay}d ago`;

  const diffWeek = Math.floor(diffDay / 7);
  if (diffWeek < 5) return `${diffWeek}w ago`;

  const diffMonth = Math.floor(diffDay / 30);
  if (diffMonth < 12) return `${diffMonth}mo ago`;

  return `${Math.floor(diffDay / 365)}y ago`;
};

/**
 * Human-readable time elapsed since an ISO timestamp, e.g. "42 min", "2h 05m".
 * Used for live counters such as how long a client has been waiting at reception.
 */
export const formatElapsed = (from: string | Date) => {
  const start = typeof from === 'string' ? new Date(from).getTime() : from.getTime();
  if (Number.isNaN(start)) return '-';
  const diffMin = Math.max(0, Math.floor((Date.now() - start) / 60000));
  if (diffMin < 60) return `${diffMin} min`;
  const hours = Math.floor(diffMin / 60);
  const mins = diffMin % 60;
  return `${hours}h ${String(mins).padStart(2, '0')}m`;
};
