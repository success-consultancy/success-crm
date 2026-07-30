'use client';

import React from 'react';
import Link from 'next/link';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { ArrowUpRight } from 'lucide-react';
import CardContainer from '@/components/atoms/card-container';
import { ROUTES } from '@/config/routes';

interface Segment {
  label: string;
  value: number;
  color: string;
}

// ponytail: no /stats endpoint returns visa/student outcome-stage counts yet — placeholder
// until useGetVisaOutcomes / useGetStudentOutcomes-style hooks exist.
const VISA_OUTCOMES: Segment[] = [
  { label: 'In Progress', value: 48, color: '#5A98FE' },
  { label: 'Granted', value: 24, color: '#0FDFAE' },
  { label: 'Refused', value: 16, color: '#FF5B77' },
];

const STUDENT_OUTCOMES: Segment[] = [
  { label: 'Application Submitted', value: 32, color: '#7491ED' },
  { label: 'Offer Received', value: 19, color: '#7EDE7E' },
  { label: 'Fee Paid', value: 11, color: '#FFDE39' },
  { label: 'Withdrawn', value: 21, color: '#F75656' },
];

const OutcomeDonutCard = ({ title, href, segments }: { title: string; href: string; segments: Segment[] }) => {
  const total = segments.reduce((sum, s) => sum + s.value, 0);

  return (
    <CardContainer className="p-5">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-b14-600 text-content-heading">{title}</h4>
        <Link href={href} className="text-c1 text-primary flex items-center gap-1 hover:underline">
          View <ArrowUpRight className="w-3 h-3" />
        </Link>
      </div>
      <div className="flex items-center gap-6">
        <div className="relative w-[160px] h-[160px] shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={segments} dataKey="value" nameKey="label" innerRadius={55} outerRadius={78} strokeWidth={0}>
                {segments.map((s) => (
                  <Cell key={s.label} fill={s.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-h4 font-bold text-content-heading">{total}</span>
          </div>
        </div>
        <ul className="space-y-2 min-w-0">
          {segments.map((s) => (
            <li key={s.label} className="flex items-center gap-2 text-c1">
              <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: s.color }} />
              <span className="text-content-subtitle truncate">{s.label}</span>
              <span className="text-content-heading font-medium ml-auto">{s.value}</span>
            </li>
          ))}
        </ul>
      </div>
    </CardContainer>
  );
};

const OutcomeDonuts = () => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
    <OutcomeDonutCard title="Visa outcomes" href={ROUTES.VISA} segments={VISA_OUTCOMES} />
    <OutcomeDonutCard title="Students outcomes" href={ROUTES.EDUCATION} segments={STUDENT_OUTCOMES} />
  </div>
);

export default OutcomeDonuts;
