'use client';

import React, { useMemo, useState } from 'react';
import { RadialBarChart, RadialBar, ResponsiveContainer, PolarAngleAxis } from 'recharts';
import CardContainer from '@/components/atoms/card-container';
import { useGetConvertedStats } from '@/query/get-stats-converted';
import PeriodSelector, { TimePeriod } from '../shared/period-selector';

const SERVICES = [
  { key: 'Education' as const, label: 'Education', color: '#EDA7FE' },
  { key: 'Visa' as const, label: 'Visa', color: '#49B8E9' },
  { key: 'Skill' as const, label: 'Skill', color: '#61C595' },
  { key: 'Health' as const, label: 'Insurance', color: '#989DE9' },
  { key: 'AAT' as const, label: 'Tribunal', color: '#3D88B7' },
];

function getPeriodDates(period: TimePeriod): { startDate?: string; endDate?: string } {
  const now = new Date();
  const endDate = now.toISOString();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  switch (period) {
    case 'weekly': {
      const start = new Date(now);
      start.setDate(now.getDate() - now.getDay());
      return { startDate: start.toISOString(), endDate };
    }
    case 'monthly': {
      return { startDate: new Date(currentYear, currentMonth, 1).toISOString(), endDate };
    }
    case 'quarterly': {
      const qStart = Math.floor(currentMonth / 3) * 3;
      return { startDate: new Date(currentYear, qStart, 1).toISOString(), endDate };
    }
    case 'half_year': {
      const hStart = currentMonth < 6 ? 0 : 6;
      return { startDate: new Date(currentYear, hStart, 1).toISOString(), endDate };
    }
    case 'yearly': {
      return { startDate: new Date(currentYear, 0, 1).toISOString(), endDate };
    }
  }
}

const ConversionRateWidget = () => {
  const [period, setPeriod] = useState<TimePeriod>('yearly');
  const { startDate, endDate } = useMemo(() => getPeriodDates(period), [period]);
  const { data, isLoading } = useGetConvertedStats(startDate, endDate);

  const chartData = useMemo(() => {
    if (!data) return [];
    return SERVICES.map((s) => ({
      name: s.label,
      value: Math.min(parseFloat(String(data[s.key] ?? '0')) || 0, 100),
      fill: s.color,
    })).reverse();
  }, [data]);

  return (
    <CardContainer className="p-5">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-b14-600 text-content-heading">Conversion Rate</h4>
        <PeriodSelector value={period} onChange={setPeriod} />
      </div>

      {isLoading ? (
        <div className="animate-pulse space-y-3">
          <div className="h-[200px] bg-gray-100 rounded" />
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-3 w-full bg-gray-100 rounded" />
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4">
          <ResponsiveContainer width="100%" height={200}>
            <RadialBarChart
              cx="50%"
              cy="50%"
              innerRadius="20%"
              outerRadius="100%"
              data={chartData}
              startAngle={180}
              endAngle={0}
            >
              <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
              <RadialBar
                background={{ fill: '#f3f4f6' }}
                dataKey="value"
                angleAxisId={0}
                cornerRadius={4}
              />
            </RadialBarChart>
          </ResponsiveContainer>

          <div className="w-full space-y-2">
            {SERVICES.map((s) => {
              const rate = parseFloat(String(data?.[s.key] ?? '0')) || 0;
              return (
                <div key={s.key} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }} />
                    <span className="text-c1 text-content-subtitle">{s.label}</span>
                  </div>
                  <span className="text-b14-600 text-content-heading">{rate.toFixed(1)}%</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </CardContainer>
  );
};

export default ConversionRateWidget;
