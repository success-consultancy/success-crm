'use client';

import React, { useMemo, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useGetServiceStats, ServiceTimePeriodStat } from '@/query/get-stats-services';
import ChartCard from '../shared/chart-card';
import PeriodSelector, { TimePeriod } from '../shared/period-selector';

const COLORS = {
  education: '#EDA7FE',
  visa: '#49B8E9',
  skill: '#61C595',
  insurance: '#989DE9',
};

function aggregateByPeriod(data: ServiceTimePeriodStat[], period: TimePeriod): number {
  if (!data?.length) return 0;
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;
  const currentWeek = Math.ceil((now.getDate() - now.getDay() + 1) / 7);
  const currentQuarter = Math.ceil(currentMonth / 3);
  const currentHalf = currentMonth <= 6 ? 1 : 2;

  return data
    .filter((d) => {
      if (d.year !== currentYear) return false;
      switch (period) {
        case 'weekly':
          return d.week === currentWeek;
        case 'monthly':
          return d.month === currentMonth;
        case 'quarterly':
          return d.quarter === currentQuarter;
        case 'half_year':
          return d.half_year === currentHalf;
        case 'yearly':
          return true;
      }
    })
    .reduce((sum, d) => sum + d.count, 0);
}

const ServicePerformanceChart = () => {
  const [period, setPeriod] = useState<TimePeriod>('monthly');
  const { data, isLoading } = useGetServiceStats();

  const chartData = useMemo(() => {
    if (!data) return [];
    return [
      { name: 'Education', count: aggregateByPeriod(data.education, period), fill: COLORS.education },
      { name: 'Visa', count: aggregateByPeriod(data.visa, period), fill: COLORS.visa },
      { name: 'Skill', count: aggregateByPeriod(data.skill, period), fill: COLORS.skill },
      { name: 'Insurance', count: aggregateByPeriod(data.insurance, period), fill: COLORS.insurance },
    ];
  }, [data, period]);

  return (
    <ChartCard
      title="My Service Performance"
      isLoading={isLoading}
      headerRight={<PeriodSelector value={period} onChange={setPeriod} />}
    >
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={chartData} margin={{ left: 0, right: 12, top: 4, bottom: 4 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
          <Tooltip
            contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e5e7eb' }}
            cursor={{ fill: 'rgba(0,0,0,0.04)' }}
          />
          <Bar dataKey="count" name="Count" radius={[6, 6, 0, 0]} barSize={48}>
            {chartData.map((entry, index) => (
              <rect key={index} fill={entry.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
};

export default ServicePerformanceChart;
