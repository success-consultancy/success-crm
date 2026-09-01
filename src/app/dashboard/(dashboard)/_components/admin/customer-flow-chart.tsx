'use client';

import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ChevronDown } from '@untitledui/icons';
import { useGetCustomerFlow } from '@/query/get-analytics';
import { EmptyState } from '@/components/common/empty-state';
import ChartCard from '../shared/chart-card';

const SERIES = [
  { key: 'Lead', color: '#01C5DF' },
  { key: 'Education', color: '#8142CF' },
  { key: 'Visa', color: '#5FA05B' },
  { key: 'Skill', color: '#E89855' },
  { key: 'Tribunal', color: '#5A6CDF' },
  { key: 'Insurance', color: '#DE689F' },
] as const;

const CustomerFlowChart = () => {
  const { data, isLoading } = useGetCustomerFlow();
  const monthlyData = data ?? [];

  return (
    <ChartCard
      title="Customer flow"
      isLoading={isLoading}
      headerRight={
        <div className="border border-neutral-border-light flex h-8 items-center gap-2 px-3 rounded">
          <span className="text-b13-500 text-neutral-dark-grey">Last Year</span>
          <ChevronDown className="size-4 text-neutral-dark-grey" />
        </div>
      }
    >
      {monthlyData.length === 0 ? (
        <EmptyState
          size="sm"
          className="h-[300px]"
          title="No customer flow data yet"
          description="Monthly volume will appear here once records are added."
        />
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={monthlyData} margin={{ left: 0, right: 12, top: 4, bottom: 4 }}>
            <CartesianGrid vertical horizontal={false} strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="month" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis domain={[0, 'auto']} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip cursor={false} contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e5e7eb' }} />
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
                activeDot={{ r: 4 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      )}
    </ChartCard>
  );
};

export default CustomerFlowChart;
