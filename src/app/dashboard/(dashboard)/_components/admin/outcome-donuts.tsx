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

const FALLBACK_COLOR = '#9CA3AF';

// VisaApplicant.status → color, so a status keeps its color regardless of which other statuses appear
const VISA_COLORS: Record<string, string> = {
  New: '#9CA3AF',
  'Collecting Docs': '#5A98FE',
  'Ready To Submit': '#7491ED',
  Submitted: '#0FDFAE',
  'Info Requested': '#FFDE39',
  Approved: '#22C55E',
  Withdrawn: '#F97316',
  Refused: '#FF5B77',
  Discontinued: '#EF4444',
  'Follow Up': '#A855F7',
};

// Student.status → color, so a status keeps its color regardless of which other statuses appear
const STUDENT_COLORS: Record<string, string> = {
  New: '#9CA3AF',
  Checklist: '#5A98FE',
  'Application Ready': '#7491ED',
  'Application Submitted': '#0FDFAE',
  'Offer Received': '#7EDE7E',
  'Waiting Payment': '#FFDE39',
  'Fee Paid': '#22C55E',
  'Coe Received': '#A855F7',
  Withdrawn: '#F97316',
  Discontinued: '#F75656',
};

const withColors = (segments: OutcomeSegment[] | undefined, colors: Record<string, string>): Segment[] =>
  (segments ?? []).map((s) => ({ ...s, color: colors[s.label] ?? FALLBACK_COLOR }));

const OutcomeDonutCard = ({ title, href, segments }: { title: string; href: string; segments: Segment[] }) => {
  const total = segments.reduce((sum, s) => sum + s.value, 0);

  return (
    <CardContainer className="p-5">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-b14-600 text-neutral-black">{title}</h4>
        <Link href={href} className="text-c1 text-primary flex items-center gap-1 hover:underline">
          View <ArrowUpRight className="w-3 h-3" />
        </Link>
      </div>
      <div className="flex items-center gap-6">
        <div className="relative w-[160px] h-[160px] shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={segments} dataKey="value" nameKey="label" innerRadius={46} outerRadius={78} strokeWidth={0}>
                {segments.map((s) => (
                  <Cell key={s.label} fill={s.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-h4 font-semibold text-neutral-black">{total}</span>
          </div>
        </div>
        <ul className="space-y-2 min-w-0">
          {segments.map((s) => (
            <li key={s.label} className="flex items-center gap-2 text-c1">
              <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: s.color }} />
              <span className="text-neutral-light-grey truncate">{s.label}</span>
              <span className="text-neutral-black font-medium ml-auto">{s.value}</span>
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
      <OutcomeDonutCard title="Visa outcomes" href={ROUTES.VISA} segments={withColors(visaOutcomes, VISA_COLORS)} />
      <OutcomeDonutCard
        title="Students outcomes"
        href={ROUTES.EDUCATION}
        segments={withColors(studentOutcomes, STUDENT_COLORS)}
      />
    </div>
  );
};

export default OutcomeDonuts;
