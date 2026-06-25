'use client';

import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export type TimePeriod = 'weekly' | 'monthly' | 'quarterly' | 'half_year' | 'yearly';

interface PeriodSelectorProps {
  value: TimePeriod;
  onChange: (value: TimePeriod) => void;
}

const PERIOD_OPTIONS: { value: TimePeriod; label: string }[] = [
  { value: 'monthly', label: 'Monthly' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'quarterly', label: 'Quarterly' },
  { value: 'half_year', label: 'Half Year' },
  { value: 'yearly', label: 'Yearly' },
];

const PeriodSelector = ({ value, onChange }: PeriodSelectorProps) => {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger size="sm" className="w-[120px] text-xs">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {PERIOD_OPTIONS.map((opt) => (
          <SelectItem key={opt.value} value={opt.value}>
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default PeriodSelector;
