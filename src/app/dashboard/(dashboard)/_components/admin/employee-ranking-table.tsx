'use client';

import React, { useMemo, useState } from 'react';
import CardContainer from '@/components/atoms/card-container';
import { useGetEmployeeRanking } from '@/query/get-employee-ranking';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ArrowUpDown } from 'lucide-react';

type SortField = 'conversionRate' | 'clientCount' | 'convertedCount';

const MONTH_OPTIONS = [
  { value: 'all', label: 'All Time' },
  { value: '1', label: 'January' },
  { value: '2', label: 'February' },
  { value: '3', label: 'March' },
  { value: '4', label: 'April' },
  { value: '5', label: 'May' },
  { value: '6', label: 'June' },
  { value: '7', label: 'July' },
  { value: '8', label: 'August' },
  { value: '9', label: 'September' },
  { value: '10', label: 'October' },
  { value: '11', label: 'November' },
  { value: '12', label: 'December' },
];

function getMonthDateRange(month: string) {
  if (month === 'all') return { startDate: undefined, endDate: undefined };
  const year = new Date().getFullYear();
  const m = parseInt(month);
  const start = new Date(year, m - 1, 1);
  const end = new Date(year, m, 0, 23, 59, 59);
  return { startDate: start.toISOString(), endDate: end.toISOString() };
}

const EmployeeRankingTable = () => {
  const [month, setMonth] = useState('all');
  const [sortField, setSortField] = useState<SortField>('conversionRate');
  const { startDate, endDate } = useMemo(() => getMonthDateRange(month), [month]);
  const { data, isLoading } = useGetEmployeeRanking(startDate, endDate);

  const sorted = useMemo(() => {
    if (!data) return [];
    return [...data]
      .map((emp) => {
        const clientCount = Number(emp.clientCount) || 0;
        const convertedCount = Number(emp.convertedCount) || 0;
        const lostCount = clientCount - convertedCount;
        const conversionRate = clientCount > 0 ? (convertedCount / clientCount) * 100 : 0;
        return { ...emp, clientCount, convertedCount, lostCount, conversionRate };
      })
      .filter((emp) => emp.clientCount > 0)
      .sort((a, b) => b[sortField] - a[sortField]);
  }, [data, sortField]);

  return (
    <CardContainer className="p-5">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-b14-600 text-content-heading">Employee Performance</h4>
        <div className="flex items-center gap-2">
          <Select value={sortField} onValueChange={(v) => setSortField(v as SortField)}>
            <SelectTrigger size="sm" className="w-[150px] text-xs">
              <ArrowUpDown className="w-3 h-3 mr-1" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="conversionRate">Conversion Rate</SelectItem>
              <SelectItem value="clientCount">Total Clients</SelectItem>
              <SelectItem value="convertedCount">Converted</SelectItem>
            </SelectContent>
          </Select>
          <Select value={month} onValueChange={setMonth}>
            <SelectTrigger size="sm" className="w-[130px] text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {MONTH_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-c1 text-content-subtitle">
              <th className="pb-3 pr-4 font-medium">#</th>
              <th className="pb-3 pr-4 font-medium">Employee</th>
              <th className="pb-3 pr-4 font-medium text-right">Clients</th>
              <th className="pb-3 pr-4 font-medium text-right">Converted</th>
              <th className="pb-3 pr-4 font-medium text-right">Lost</th>
              <th className="pb-3 font-medium text-right">Rate</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-b last:border-0">
                  <td colSpan={6} className="py-3">
                    <div className="animate-pulse h-4 bg-gray-100 rounded w-full" />
                  </td>
                </tr>
              ))
            ) : sorted.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-content-subtitle text-sm">
                  No employee data available
                </td>
              </tr>
            ) : (
              sorted.map((emp, idx) => (
                <tr key={emp.id} className="border-b last:border-0 hover:bg-gray-50 transition-colors">
                  <td className="py-3 pr-4 text-content-subtitle">{idx + 1}</td>
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-2.5">
                      <Avatar className="h-7 w-7">
                        <AvatarFallback className="text-[10px] bg-primary/10 text-primary">
                          {emp.firstName?.[0]}
                          {emp.lastName?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-b14-500 text-content-heading">
                          {emp.firstName} {emp.lastName}
                        </p>
                        <p className="text-c2 text-content-subtitle">{emp.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 pr-4 text-right text-b14 text-content-heading">{emp.clientCount}</td>
                  <td className="py-3 pr-4 text-right text-b14 text-utility-green font-medium">
                    {emp.convertedCount}
                  </td>
                  <td className="py-3 pr-4 text-right text-b14 text-utility-red font-medium">{emp.lostCount}</td>
                  <td className="py-3 text-right">
                    <span
                      className={`text-b14-600 ${
                        emp.conversionRate >= 50 ? 'text-utility-green' : emp.conversionRate >= 25 ? 'text-[#fd7e14]' : 'text-utility-red'
                      }`}
                    >
                      {emp.conversionRate.toFixed(1)}%
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </CardContainer>
  );
};

export default EmployeeRankingTable;
