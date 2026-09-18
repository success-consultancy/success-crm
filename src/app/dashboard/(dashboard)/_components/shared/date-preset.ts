import { DateTime } from 'luxon';

export type DatePreset = 'this_month' | 'this_quarter' | 'this_year' | 'all_time';

// backend defaults omitted dates to a trailing 12-month window, not all-time —
// "All Time" must pass an explicit early startDate to actually get everything.
export function getPresetDateRange(preset: DatePreset): { startDate?: string; endDate?: string } {
  const now = DateTime.now();
  if (preset === 'all_time') return { startDate: DateTime.fromObject({ year: 2000 }).toISO() ?? undefined };
  const start = preset === 'this_month' ? now.startOf('month') : preset === 'this_quarter' ? now.startOf('quarter') : now.startOf('year');
  return { startDate: start.toISO() ?? undefined, endDate: now.toISO() ?? undefined };
}
