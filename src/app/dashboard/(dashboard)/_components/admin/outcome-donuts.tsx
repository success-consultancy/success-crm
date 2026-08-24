'use client';

import React from 'react';
import Link from 'next/link';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { ArrowUpRight } from 'lucide-react';
import CardContainer from '@/components/atoms/card-container';
import { ROUTES } from '@/config/routes';
import { useGetVisaOutcomes, useGetStudentOutcomes, OutcomeSegment } from '@/query/get-outcome-stats';

interface Segment extends OutcomeSegment {
  color: string;
}

// Visa outcomes only show these 3 statuses, renamed for display.
const VISA_STATUS_MAP: Record<string, { label: string; color: string }> = {
  Pending: { label: 'Inprogress', color: '#5A98FE' },
  'visa granted': { label: 'Granted', color: '#0FDFAE' },
  Rejected: { label: 'Refused', color: '#FF5B77' },
};

const visaSegments = (segments: OutcomeSegment[] | undefined): Segment[] =>
  (segments ?? [])
    .filter((s) => s.label in VISA_STATUS_MAP)
    .map((s) => ({ ...s, label: VISA_STATUS_MAP[s.label].label, color: VISA_STATUS_MAP[s.label].color }));

// Student outcomes only show these 4 statuses, renamed for display.
const STUDENT_STATUS_MAP: Record<string, { label: string; color: string }> = {
  'Application Submitted': { label: 'Application Submitted', color: '#7491ED' },
  'Offer Received': { label: 'Offer Received', color: '#7EDE7E' },
  'Fee Paid': { label: 'Fee Paid', color: '#FFDE39' },
  'Canceled': { label: 'Withdrawn', color: '#F75656' },
};

const studentSegments = (segments: OutcomeSegment[] | undefined): Segment[] =>
  Object.entries(STUDENT_STATUS_MAP).map(([apiLabel, { label, color }]) => ({
    label,
    color,
    value: segments?.find((s) => s.label === apiLabel)?.value ?? 0,
  }));

const OutcomeDonutCard = ({ title, href, segments }: { title: string; href: string; segments: Segment[] }) => {
  const total = segments.reduce((sum, s) => sum + s.value, 0);

  return (
    <CardContainer className="border-neutral-border-light rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-b16-600 text-content-heading">{title}</h4>
        <Link href={href} className="text-b14-600 text-primary flex items-center gap-1 hover:underline">
          View <ArrowUpRight className="w-4 h-4" />
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

const OutcomeDonuts = () => {
  const { data: visaOutcomes } = useGetVisaOutcomes();
  const { data: studentOutcomes } = useGetStudentOutcomes();
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <OutcomeDonutCard title="Visa outcomes" href={ROUTES.VISA} segments={visaSegments(visaOutcomes)} />
      <OutcomeDonutCard
        title="Students outcomes"
        href={ROUTES.EDUCATION}
        segments={studentSegments(studentOutcomes)}
      />
    </div>
  );
};

export default OutcomeDonuts;
