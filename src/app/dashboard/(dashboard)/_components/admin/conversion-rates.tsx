'use client';

import React, { useMemo, useState } from 'react';
import { DateTime } from 'luxon';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useGetConvertedByMonth } from '@/query/get-converted-by-month';
import ChartCard from '../shared/chart-card';

type DatePreset = 'this_month' | 'this_quarter' | 'this_year' | 'all_time';

const SERIES = [
  { key: 'Education', color: '#8142CF' },
  { key: 'Visa', color: '#5FA05B' },
  { key: 'Skill', color: '#E89855' },
  { key: 'Tribunal', color: '#5A6CDF' },
  { key: 'Insurance', color: '#DE689F' },
] as const;

// backend defaults omitted dates to a trailing 12-month window, not all-time —
// "All Time" must pass an explicit early startDate to actually get everything.
function getPresetDateRange(preset: DatePreset): { startDate?: string; endDate?: string } {
  const now = DateTime.now();
  if (preset === 'all_time') return { startDate: DateTime.fromObject({ year: 2000 }).toISO() ?? undefined };
  const start = preset === 'this_month' ? now.startOf('month') : preset === 'this_quarter' ? now.startOf('quarter') : now.startOf('year');
  return { startDate: start.toISO() ?? undefined, endDate: now.toISO() ?? undefined };
}

const ConversionRates = () => {
  const [preset, setPreset] = useState<DatePreset>('this_year');
  const { startDate, endDate } = useMemo(() => getPresetDateRange(preset), [preset]);
  const { data } = useGetConvertedByMonth(startDate, endDate);

  const monthlyData = useMemo(
    () =>
      (data ?? []).map(({ month, Education, Visa, Skill, AAT, Health }) => ({
        month,
        Education,
        Visa,
        Skill,
        Tribunal: AAT,
        Insurance: Health,
      })),
    [data],
  );

  return (
    <ChartCard
      title="Conversion rates"
      headerRight={
        <Select value={preset} onValueChange={(v) => setPreset(v as DatePreset)}>
          <SelectTrigger size="sm" className="w-[130px] text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="this_month">This Month</SelectItem>
            <SelectItem value="this_quarter">This Quarter</SelectItem>
            <SelectItem value="this_year">This Year</SelectItem>
            <SelectItem value="all_time">All Time</SelectItem>
          </SelectContent>
        </Select>
      }
    >
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={monthlyData} margin={{ left: 0, right: 12, top: 4, bottom: 4 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="month" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis
            tickFormatter={(v) => `${v}%`}
            domain={[0, 100]}
            tick={{ fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            formatter={(value) => `${value}%`}
            contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e5e7eb' }}
          />
          <Legend
            content={({ payload }) => (
              <ul className="flex justify-center text-b12-500" style={{ gap: 24, marginTop: 32 }}>
                {payload?.map((entry) => (
                  <li key={entry.value} className="flex items-center gap-1.5">
                    <span className="size-2 rounded-full" style={{ backgroundColor: entry.color }} />
                    {entry.value}
                  </li>
                ))}
              </ul>
            )}
          />

          {SERIES.map(({ key, color }) => (
            <Line
              key={key}
              type="monotone"
              dataKey={key}
              stroke={color}
              strokeWidth={2}
              dot={{ r: 3, fill: color, strokeWidth: 0 }}
              activeDot={{ r: 5 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </ChartCard>
  );
};

export default ConversionRates;
