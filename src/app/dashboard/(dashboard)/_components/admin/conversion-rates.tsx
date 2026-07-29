'use client';

import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ChartCard from '../shared/chart-card';

type DatePreset = 'this_month' | 'this_quarter' | 'this_year' | 'all_time';

const SERIES = [
  { key: 'Education', color: '#7c3aed' },
  { key: 'Visa', color: '#22c55e' },
  { key: 'Skill', color: '#f97316' },
  { key: 'Tribunal', color: '#3b82f6' },
  { key: 'Insurance', color: '#ec4899' },
] as const;

// ponytail: backend only exposes an aggregate conversion % per service (see get-stats-converted.ts),
// not a monthly breakdown — placeholder series until a monthly endpoint exists.
const MONTHLY_DATA = [
  { month: 'Jan', Education: 55, Visa: 25, Skill: 55, Tribunal: 10, Insurance: 30 },
  { month: 'Feb', Education: 58, Visa: 28, Skill: 52, Tribunal: 12, Insurance: 32 },
  { month: 'Mar', Education: 60, Visa: 30, Skill: 58, Tribunal: 15, Insurance: 35 },
  { month: 'Apr', Education: 68, Visa: 35, Skill: 60, Tribunal: 18, Insurance: 40 },
  { month: 'May', Education: 72, Visa: 45, Skill: 65, Tribunal: 20, Insurance: 50 },
  { month: 'Jun', Education: 85, Visa: 55, Skill: 68, Tribunal: 22, Insurance: 58 },
  { month: 'Jul', Education: 80, Visa: 60, Skill: 72, Tribunal: 25, Insurance: 55 },
  { month: 'Aug', Education: 78, Visa: 58, Skill: 62, Tribunal: 20, Insurance: 50 },
  { month: 'Sep', Education: 82, Visa: 62, Skill: 65, Tribunal: 18, Insurance: 52 },
  { month: 'Oct', Education: 88, Visa: 65, Skill: 70, Tribunal: 22, Insurance: 58 },
  { month: 'Nov', Education: 78, Visa: 60, Skill: 75, Tribunal: 25, Insurance: 62 },
  { month: 'Dec', Education: 90, Visa: 70, Skill: 78, Tribunal: 20, Insurance: 65 },
];

const ConversionRates = () => {
  const [preset, setPreset] = useState<DatePreset>('this_year');

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
        <LineChart data={MONTHLY_DATA} margin={{ left: 0, right: 12, top: 4, bottom: 4 }}>
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
          <Legend wrapperStyle={{ fontSize: 12 }} iconType="circle" />
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
