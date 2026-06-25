'use client';

import React, { useMemo, useState } from 'react';
import CardContainer from '@/components/atoms/card-container';
import { useGetConvertedStats } from '@/query/get-stats-converted';
import { GraduationCap, Globe, ClipboardList, ShieldCheck, Scale } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type DatePreset = 'this_month' | 'this_quarter' | 'this_year' | 'all_time';

function getDateRange(preset: DatePreset): { startDate?: string; endDate?: string } {
  const now = new Date();
  const endDate = now.toISOString();

  switch (preset) {
    case 'this_month': {
      const start = new Date(now.getFullYear(), now.getMonth(), 1);
      return { startDate: start.toISOString(), endDate };
    }
    case 'this_quarter': {
      const quarterStart = Math.floor(now.getMonth() / 3) * 3;
      const start = new Date(now.getFullYear(), quarterStart, 1);
      return { startDate: start.toISOString(), endDate };
    }
    case 'this_year': {
      const start = new Date(now.getFullYear(), 0, 1);
      return { startDate: start.toISOString(), endDate };
    }
    case 'all_time':
      return {};
  }
}

const SERVICES = [
  { key: 'Education' as const, label: 'Education', Icon: GraduationCap, color: '#0e76bc' },
  { key: 'Visa' as const, label: 'Visa', Icon: Globe, color: '#28a745' },
  { key: 'Skill' as const, label: 'Skill', Icon: ClipboardList, color: '#fd7e14' },
  { key: 'Health' as const, label: 'Insurance', Icon: ShieldCheck, color: '#ffc107' },
  { key: 'AAT' as const, label: 'Tribunal', Icon: Scale, color: '#dc3545' },
];

const ConversionRates = () => {
  const [preset, setPreset] = useState<DatePreset>('this_year');
  const { startDate, endDate } = useMemo(() => getDateRange(preset), [preset]);
  const { data, isLoading } = useGetConvertedStats(startDate, endDate);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-b14-600 text-content-heading">Conversion Rates</h4>
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
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {isLoading
          ? Array.from({ length: 5 }).map((_, i) => (
              <CardContainer key={i}>
                <div className="animate-pulse space-y-2">
                  <div className="h-3 w-16 bg-gray-200 rounded" />
                  <div className="h-6 w-12 bg-gray-200 rounded" />
                </div>
              </CardContainer>
            ))
          : SERVICES.map(({ key, label, Icon, color }) => {
              const rate = data?.[key] ?? '0';
              const rateNum = parseFloat(String(rate));
              return (
                <CardContainer key={key} className="relative overflow-hidden">
                  <div
                    className="absolute top-0 left-0 h-1 rounded-t-lg"
                    style={{ backgroundColor: color, width: `${Math.min(rateNum, 100)}%` }}
                  />
                  <div className="flex items-center gap-2 mt-1">
                    <Icon className="w-4 h-4" style={{ color }} />
                    <span className="text-c1 text-content-subtitle">{label}</span>
                  </div>
                  <p className="text-h5 font-bold text-content-heading mt-1">
                    {isNaN(rateNum) ? '0' : rateNum.toFixed(1)}%
                  </p>
                </CardContainer>
              );
            })}
      </div>
    </div>
  );
};

export default ConversionRates;
