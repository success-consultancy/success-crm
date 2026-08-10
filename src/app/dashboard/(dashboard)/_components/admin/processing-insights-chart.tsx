'use client';

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useGetProcessingInsights } from '@/query/get-analytics';
import ChartCard from '../shared/chart-card';
import { EmptyState } from '@/components/common/empty-state';

const ProcessingInsightsChart = () => {
  const { data, isLoading } = useGetProcessingInsights();

  const chartData = React.useMemo(() => {
    if (!data) return [];

    return [
      {
        name: 'Education',
        min: data.education?.min ?? 0,
        avg: parseFloat(data.education?.average ?? '0'),
        max: data.education?.max ?? 0,
      },
      {
        name: 'Visa (Nomination)',
        min: data.visa?.nomination?.min ?? 0,
        avg: parseFloat(data.visa?.nomination?.average ?? '0'),
        max: data.visa?.nomination?.max ?? 0,
      },
      {
        name: 'Visa (Application)',
        min: data.visa?.visa?.min ?? 0,
        avg: parseFloat(data.visa?.visa?.average ?? '0'),
        max: data.visa?.visa?.max ?? 0,
      },
      {
        name: 'Skill',
        min: data.skill?.min ?? 0,
        avg: parseFloat(data.skill?.average ?? '0'),
        max: data.skill?.max ?? 0,
      },
    ].filter((d) => d.min > 0 || d.avg > 0 || d.max > 0);
  }, [data]);

  return (
    <ChartCard title="Processing Time (Days)" isLoading={isLoading}>
      {chartData.length === 0 ? (
        <EmptyState
          size="sm"
          className="h-[300px]"
          title="No insight data yet"
          description="Processing times will appear here once applications are completed."
        />
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData} margin={{ left: 0, right: 12, top: 4, bottom: 4 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="name" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip
              contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e5e7eb' }}
              cursor={{ fill: 'rgba(0,0,0,0.04)' }}
              formatter={(value) => [`${value} days`]}
            />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Bar dataKey="min" name="Min" fill="#72A98F" radius={[4, 4, 0, 0]} />
            <Bar dataKey="avg" name="Average" fill="#9cadce" radius={[4, 4, 0, 0]} />
            <Bar dataKey="max" name="Max" fill="#FF6663" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </ChartCard>
  );
};

export default ProcessingInsightsChart;
