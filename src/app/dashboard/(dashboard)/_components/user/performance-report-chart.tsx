'use client';

import React, { useMemo } from 'react';
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useGetLeadStats, LeadStats } from '@/query/get-stats-lead';
import { useGetTribunalReviews } from '@/query/get-tribunalreview';
import ChartCard from '../shared/chart-card';

type StatsKey = keyof Omit<LeadStats, 'total'>;

const SERIES: { name: string; color: string; lightColor: string; statsKey: StatsKey | null }[] = [
  { name: 'Education', color: '#8142CF', lightColor: '#EDE1FB', statsKey: 'Education' },
  { name: 'Visa', color: '#5FA05B', lightColor: '#DCEEDC', statsKey: 'Visa' },
  { name: 'Skill', color: '#E89855', lightColor: '#FBE7D3', statsKey: 'Skill Assessment' },
  { name: 'Tribunal', color: '#5A6CDF', lightColor: '#DEE1F9', statsKey: null },
  { name: 'Insurance', color: '#DE689F', lightColor: '#F8DCE9', statsKey: 'Insurance' },
];

const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: { payload: Record<string, unknown> }[] }) => {
  if (!active || !payload?.length) return null;
  const { assigned, converted, hasConverted } = payload[0].payload as {
    assigned: number;
    converted: number;
    hasConverted: boolean;
  };
  return (
    <div className="bg-white border border-neutral-border-light rounded-md shadow-[0px_0px_18px_0px_rgba(18,18,23,0.1)] px-3 py-2.5 text-c1">
      <p className="text-neutral-black">Assigned: {assigned}</p>
      {hasConverted && <p className="text-neutral-black">Converted: {converted}</p>}
    </div>
  );
};

const PerformanceReportChart = () => {
  const { data: leadStats, isLoading } = useGetLeadStats();
  // /stats/lead doesn't break out Tribunal — pull just the total row count for its "Assigned" bar.
  const { data: tribunalData } = useGetTribunalReviews({ limit: '1' });

  const chartData = useMemo(
    () =>
      SERIES.map((s) => {
        if (!s.statsKey) {
          const assigned = tribunalData?.count ?? 0;
          return { name: s.name, converted: 0, remaining: assigned, assigned, hasConverted: false };
        }
        const stats = leadStats?.[s.statsKey];
        const assigned = stats?.totalCount ?? 0;
        const converted = stats?.convertedCount ?? 0;
        return { name: s.name, converted, remaining: Math.max(assigned - converted, 0), assigned, hasConverted: true };
      }),
    [leadStats, tribunalData],
  );

  return (
    <ChartCard title="Performance report" isLoading={isLoading}>
      <ResponsiveContainer width="100%" height={340}>
        <BarChart data={chartData} margin={{ left: 0, right: 12, top: 4, bottom: 4 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
          <XAxis dataKey="name" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 10 }} axisLine={false} tickLine={false} allowDecimals={false} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,0,0,0.03)' }} />
          <Bar dataKey="converted" stackId="a" radius={[0, 0, 4, 4]} barSize={64}>
            {chartData.map((entry, i) => (
              <Cell key={i} fill={SERIES[i].color} />
            ))}
          </Bar>
          <Bar dataKey="remaining" stackId="a" radius={[4, 4, 0, 0]} barSize={64}>
            {chartData.map((entry, i) => (
              <Cell key={i} fill={SERIES[i].lightColor} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <ul className="flex justify-center flex-wrap text-b12-500 gap-6 mt-4">
        {SERIES.map((s) => (
          <li key={s.name} className="flex items-center gap-2">
            <span className="size-2 rounded-full" style={{ backgroundColor: s.color }} />
            <span className="text-neutral-dark-grey">{s.name === 'Education' ? 'Student' : s.name}</span>
          </li>
        ))}
      </ul>
    </ChartCard>
  );
};

export default PerformanceReportChart;
