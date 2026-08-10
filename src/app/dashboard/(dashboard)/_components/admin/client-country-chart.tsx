'use client';

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useGetClientCountry } from '@/query/get-analytics';
import ChartCard from '../shared/chart-card';
import { EmptyState } from '@/components/common/empty-state';

const COLORS = {
  lead: '#007bff',
  student: '#00b5ad',
  visa: '#28a745',
  skill: '#fd7e14',
  insurance: '#ffc107',
};

const ClientCountryChart = () => {
  const { data, isLoading } = useGetClientCountry();

  const chartData = React.useMemo(() => {
    if (!data) return [];

    interface CountryRow {
      country: string;
      lead: number;
      student: number;
      visa: number;
      skill: number;
      insurance: number;
      [key: string]: string | number;
    }

    const countryMap = new Map<string, CountryRow>();

    const processEntries = (entries: { country: string; total: number }[], key: string) => {
      entries?.forEach(({ country, total }) => {
        if (!country) return;
        const existing = countryMap.get(country) || { country, lead: 0, student: 0, visa: 0, skill: 0, insurance: 0 };
        existing[key] = Number(total);
        countryMap.set(country, existing);
      });
    };

    processEntries(data.lead, 'lead');
    processEntries(data.student, 'student');
    processEntries(data.visa, 'visa');
    processEntries(data.skill, 'skill');
    processEntries(data.insurance, 'insurance');

    return Array.from(countryMap.values())
      .sort((a, b) => {
        const totalA = a.lead + a.student + a.visa + a.skill + a.insurance;
        const totalB = b.lead + b.student + b.visa + b.skill + b.insurance;
        return totalB - totalA;
      })
      .slice(0, 15);
  }, [data]);

  return (
    <ChartCard title="Clients by Country" isLoading={isLoading}>
      {chartData.length === 0 ? (
        <EmptyState
          size="sm"
          className="h-[300px]"
          title="No client data yet"
          description="Clients will appear here once they are added."
        />
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData} layout="vertical" margin={{ left: 20, right: 12, top: 4, bottom: 4 }}>
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
            <XAxis type="number" tick={{ fontSize: 11 }} />
            <YAxis dataKey="country" type="category" width={80} tick={{ fontSize: 11 }} />
            <Tooltip
              contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e5e7eb' }}
              cursor={{ fill: 'rgba(0,0,0,0.04)' }}
            />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Bar dataKey="lead" name="Leads" stackId="a" fill={COLORS.lead} radius={[0, 0, 0, 0]} />
            <Bar dataKey="student" name="Students" stackId="a" fill={COLORS.student} />
            <Bar dataKey="visa" name="Visa" stackId="a" fill={COLORS.visa} />
            <Bar dataKey="skill" name="Skill" stackId="a" fill={COLORS.skill} />
            <Bar dataKey="insurance" name="Insurance" stackId="a" fill={COLORS.insurance} radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </ChartCard>
  );
};

export default ClientCountryChart;
