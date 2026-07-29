'use client';

import React, { useMemo, useState } from 'react';
import CardContainer from '@/components/atoms/card-container';
import { useGetEmployeeRanking } from '@/query/get-employee-ranking';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import TabSelector from '@/components/atoms/tab-selector';
import Pagination from '@/components/molecules/pagination-component';

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

const PAGE_SIZE_OPTIONS = ['10', '25', '50'];

function getMonthDateRange(month: string) {
  if (month === 'all') return { startDate: undefined, endDate: undefined };
  const year = new Date().getFullYear();
  const m = parseInt(month);
  const start = new Date(year, m - 1, 1);
  const end = new Date(year, m, 0, 23, 59, 59);
  return { startDate: start.toISOString(), endDate: end.toISOString() };
}

// ponytail: useGetEmployeeRanking only returns a single clientCount/convertedCount pair,
// not a per-service breakdown — placeholder split until the endpoint returns per-service counts.
const SERVICE_WEIGHTS = [
  { key: 'student', label: 'Student', weight: 0.3 },
  { key: 'visa', label: 'Visa', weight: 0.25 },
  { key: 'skill', label: 'Skill', weight: 0.2 },
  { key: 'tribunal', label: 'Tribunal', weight: 0.15 },
  { key: 'insurance', label: 'Insurance', weight: 0.1 },
] as const;

function deriveServiceBreakdown(total: number) {
  return SERVICE_WEIGHTS.reduce(
    (acc, { key, weight }) => {
      acc[key] = Math.round(total * weight);
      return acc;
    },
    {} as Record<(typeof SERVICE_WEIGHTS)[number]['key'], number>,
  );
}

const EmployeeRankingTable = () => {
  const [tab, setTab] = useState<'clients' | 'performance'>('clients');
  const [month, setMonth] = useState(String(new Date().getMonth() + 1));
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);
  const { startDate, endDate } = useMemo(() => getMonthDateRange(month), [month]);
  const { data, isLoading } = useGetEmployeeRanking(startDate, endDate);

  const rows = useMemo(() => {
    if (!data) return [];
    return data
      .map((emp) => {
        const clientCount = Number(emp.clientCount) || 0;
        const convertedCount = Number(emp.convertedCount) || 0;
        const lostCount = clientCount - convertedCount;
        const conversionRate = clientCount > 0 ? (convertedCount / clientCount) * 100 : 0;
        return { ...emp, clientCount, convertedCount, lostCount, conversionRate, ...deriveServiceBreakdown(clientCount) };
      })
      .filter((emp) => emp.clientCount > 0);
  }, [data]);

  const paged = useMemo(() => rows.slice((page - 1) * pageSize, page * pageSize), [rows, page, pageSize]);

  return (
    <CardContainer className="p-5">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-b14-600 text-content-heading">Employees clients and performance</h4>
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

      <TabSelector
        className="mb-4"
        activeTab={tab}
        onTabChange={(key) => setTab(key as 'clients' | 'performance')}
        tabs={[
          { key: 'clients', label: 'Clients' },
          { key: 'performance', label: 'Performance' },
        ]}
      />

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-c1 text-content-subtitle">
              <th className="pb-3 pr-4 font-medium">S.N</th>
              <th className="pb-3 pr-4 font-medium">Employee</th>
              {tab === 'clients' ? (
                <>
                  {SERVICE_WEIGHTS.map(({ key, label }) => (
                    <th key={key} className="pb-3 pr-4 font-medium text-right">
                      {label}
                    </th>
                  ))}
                  <th className="pb-3 font-medium text-right">Total clients</th>
                </>
              ) : (
                <>
                  <th className="pb-3 pr-4 font-medium text-right">Clients</th>
                  <th className="pb-3 pr-4 font-medium text-right">Converted</th>
                  <th className="pb-3 pr-4 font-medium text-right">Lost</th>
                  <th className="pb-3 font-medium text-right">Rate</th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-b last:border-0">
                  <td colSpan={8} className="py-3">
                    <div className="animate-pulse h-4 bg-gray-100 rounded w-full" />
                  </td>
                </tr>
              ))
            ) : paged.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-8 text-center text-content-subtitle text-sm">
                  No employee data available
                </td>
              </tr>
            ) : (
              paged.map((emp, idx) => (
                <tr key={emp.id} className="border-b last:border-0 hover:bg-gray-50 transition-colors">
                  <td className="py-3 pr-4 text-content-subtitle">{(page - 1) * pageSize + idx + 1}</td>
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
                  {tab === 'clients' ? (
                    <>
                      {SERVICE_WEIGHTS.map(({ key }) => (
                        <td key={key} className="py-3 pr-4 text-right text-b14 text-content-heading">
                          {emp[key]}
                        </td>
                      ))}
                      <td className="py-3 text-right text-b14-600 text-content-heading">{emp.clientCount}</td>
                    </>
                  ) : (
                    <>
                      <td className="py-3 pr-4 text-right text-b14 text-content-heading">{emp.clientCount}</td>
                      <td className="py-3 pr-4 text-right text-b14 text-utility-green font-medium">
                        {emp.convertedCount}
                      </td>
                      <td className="py-3 pr-4 text-right text-b14 text-utility-red font-medium">{emp.lostCount}</td>
                      <td className="py-3 text-right">
                        <span
                          className={`text-b14-600 ${
                            emp.conversionRate >= 50
                              ? 'text-utility-green'
                              : emp.conversionRate >= 25
                                ? 'text-[#fd7e14]'
                                : 'text-utility-red'
                          }`}
                        >
                          {emp.conversionRate.toFixed(1)}%
                        </span>
                      </td>
                    </>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {rows.length > 0 && (
        <div className="flex items-center justify-between mt-4 text-c1 text-content-subtitle">
          <div className="flex items-center gap-2">
            <Select
              value={String(pageSize)}
              onValueChange={(v) => {
                setPageSize(Number(v));
                setPage(1);
              }}
            >
              <SelectTrigger size="sm" className="w-[80px] text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PAGE_SIZE_OPTIONS.map((opt) => (
                  <SelectItem key={opt} value={opt}>
                    {opt}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span>Items per table</span>
          </div>
          <Pagination
            currentPage={page}
            totalItems={rows.length}
            offset={pageSize}
            onNextClick={setPage}
            onPreviousClick={setPage}
          />
        </div>
      )}
    </CardContainer>
  );
};

export default EmployeeRankingTable;
