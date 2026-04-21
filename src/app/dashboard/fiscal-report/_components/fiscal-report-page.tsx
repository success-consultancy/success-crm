'use client';

import React, { useState } from 'react';
import { Search } from 'lucide-react';
import Container from '@/components/atoms/container';
import Portal from '@/components/atoms/portal';
import { PortalIds } from '@/config/portal';
import Button from '@/components/atoms/button';
import TabSelector from '@/components/atoms/tab-selector';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import KpiCard from './kpi-card';
import PerformanceTable, { ReportRow } from './performance-table';
import CreateFiscalReportModal from './create-fiscal-report-modal';
import { useGetFiscalReport } from '@/query/get-fiscal-report';
import { useUpdateFiscalReport } from '@/mutations/fiscal-report/update-fiscal-report';
import { FiscalReportRow } from '@/types/response-types/fiscal-report-response';

// ─── Constants ────────────────────────────────────────────────────────────────

const TABS = [
  { key: 'visa_application', label: 'Visa application' },
  { key: 'student_enrollment', label: 'Student enrollment' },
];

const FISCAL_YEARS = [
  { value: '2025-2026', label: '2025 - 2026' },
  { value: '2024-2025', label: '2024 - 2025' },
  { value: '2023-2024', label: '2023 - 2024' },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function parseYear(fiscalYear: string) {
  const [initial, final] = fiscalYear.split('-');
  return { initialYear: initial, finalYear: final };
}

function toReportRow(row: FiscalReportRow): ReportRow {
  const target = row.target ?? {};
  const actual = row.actual ?? {};
  const targetTotal = Object.entries(target)
    .filter(([k]) => k !== 'total')
    .reduce((s, [, v]) => s + (Number(v) || 0), 0);
  const actualTotal = Object.entries(actual)
    .filter(([k]) => k !== 'total')
    .reduce((s, [, v]) => s + (Number(v) || 0), 0);
  return {
    name: row.name,
    target: { ...target, total: target.total ?? targetTotal },
    actual: { ...actual, total: actual.total ?? actualTotal },
  };
}

function computeKpi(data: ReportRow[]) {
  const totalTarget = data.reduce((sum, r) => sum + (r.target.total ?? 0), 0);
  const totalActual = data.reduce((sum, r) => sum + (r.actual.total ?? 0), 0);
  const achievementRate = totalTarget > 0 ? Number(((totalActual / totalTarget) * 100).toFixed(1)) : 0;
  return { totalTarget, totalActual, achievementRate };
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse bg-gray-100 rounded ${className ?? ''}`} />;
}

function KpiSkeleton() {
  return (
    <div className="flex-1 min-w-0 bg-white border border-stroke-divider rounded-lg p-5">
      <Skeleton className="h-4 w-24 mb-5" />
      <Skeleton className="h-9 w-20 mb-3" />
      <Skeleton className="h-4 w-32" />
    </div>
  );
}

// ─── Page component ────────────────────────────────────────────────────────────

export default function FiscalReportPage() {
  const [activeTab, setActiveTab] = useState('visa_application');
  const [fiscalYear, setFiscalYear] = useState('2025-2026');
  const [search, setSearch] = useState('');
  const [isEdit, setIsEdit] = useState(false);
  const [editData, setEditData] = useState<ReportRow[]>([]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const { initialYear, finalYear } = parseYear(fiscalYear);

  const { data: report, isLoading } = useGetFiscalReport({ year: fiscalYear, type: activeTab });
  const { mutate: updateReport, isPending: isSaving } = useUpdateFiscalReport();

  const serverRows: ReportRow[] = React.useMemo(
    () => (report?.data ?? []).map(toReportRow),
    [report],
  );

  React.useEffect(() => {
    setEditData(serverRows);
  }, [serverRows]);

  const tableData = React.useMemo(() => {
    const base = isEdit ? editData : serverRows;
    const q = search.trim().toLowerCase();
    return q ? base.filter((r) => r.name.toLowerCase().includes(q)) : base;
  }, [search, isEdit, editData, serverRows]);

  const { totalTarget, totalActual, achievementRate } = computeKpi(serverRows);
  const prevYearTarget = Math.round(totalTarget * 0.6);
  const prevYearActual = Math.round(totalActual * 0.4);
  const prevAchievement = prevYearTarget > 0 ? (prevYearActual / prevYearTarget) * 100 : 0;
  const targetChange = prevYearTarget > 0 ? Math.round(((totalTarget - prevYearTarget) / prevYearTarget) * 100) : 0;
  const actualChange = prevYearActual > 0 ? Math.round(((totalActual - prevYearActual) / prevYearActual) * 100) : 0;
  const achievementChange = prevAchievement > 0 ? Number((achievementRate - prevAchievement).toFixed(1)) : 0;

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setIsEdit(false);
    setSearch('');
  };

  const handleFiscalYearChange = (year: string) => {
    setFiscalYear(year);
    setIsEdit(false);
    setSearch('');
  };

  const handleCellChange = (name: string, monthKey: string, value: number) => {
    if (value < 0) return;
    setEditData((prev) =>
      prev.map((row) =>
        row.name === name
          ? {
              ...row,
              target: {
                ...row.target,
                [monthKey]: value,
                total: Object.entries({ ...row.target, [monthKey]: value })
                  .filter(([k]) => k !== 'total')
                  .reduce((s, [, v]) => s + (Number(v) || 0), 0),
              },
            }
          : row,
      ),
    );
  };

  const handleSave = () => {
    if (!report) return;
    const payload = report.data.map((original, i) => ({
      ...original,
      target: editData[i]?.target ?? original.target,
    }));
    updateReport({ id: report.id, data: payload }, { onSuccess: () => setIsEdit(false) });
  };

  const handleCancel = () => {
    setEditData(serverRows);
    setIsEdit(false);
  };

  return (
    <Container className="flex flex-col max-h-full overflow-hidden p-0">
      <Portal rootId={PortalIds.DashboardHeader}>
        <h3 className="text-h5 text-content-heading font-bold">Fiscal report</h3>
      </Portal>

      <div className="flex flex-col flex-1 bg-white rounded-lg border border-stroke-divider overflow-hidden mx-4 my-4">
        {/* ── Toolbar ── */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-stroke-divider flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-content-subtitle pointer-events-none" />
              <input
                type="text"
                placeholder="Search by name"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 pr-3 h-9 w-60 border border-input rounded-md text-sm bg-transparent focus:outline-none focus:ring-1 focus:ring-ring focus:border-ring transition-colors"
              />
            </div>

            <Select value={fiscalYear} onValueChange={handleFiscalYearChange}>
              <SelectTrigger className="w-[140px] h-9">
                <SelectValue placeholder="Fiscal year" />
              </SelectTrigger>
              <SelectContent>
                {FISCAL_YEARS.map((y) => (
                  <SelectItem key={y.value} value={y.value}>
                    {y.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setIsCreateOpen(true)}>New report</Button>
            <Button size="sm">Export</Button>
          </div>
        </div>

        <CreateFiscalReportModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} />

        {/* ── Body ── */}
        <div className="flex flex-col gap-4 p-4 overflow-y-auto flex-1">
          <TabSelector activeTab={activeTab} onTabChange={handleTabChange} tabs={TABS} />

          {/* KPI Cards */}
          <div className="flex gap-4">
            {isLoading ? (
              <>
                <KpiSkeleton />
                <KpiSkeleton />
                <KpiSkeleton />
              </>
            ) : (
              <>
                <KpiCard title="Total Target" value={totalTarget.toLocaleString()} change={targetChange} />
                <KpiCard title="Total Applicants" value={totalActual.toLocaleString()} change={actualChange} />
                <KpiCard title="Achievement Rate" value={`${achievementRate}%`} change={achievementChange} />
              </>
            )}
          </div>

          {/* Performance Table */}
          <PerformanceTable
            title={activeTab === 'visa_application' ? 'Visa application performance' : 'Student enrollment performance'}
            nameColumnHeader={activeTab === 'visa_application' ? 'Visa name' : 'Course name'}
            data={tableData}
            initialYear={initialYear}
            finalYear={finalYear}
            isEdit={isEdit}
            isSaving={isSaving}
            isLoading={isLoading}
            onEditToggle={() => setIsEdit(true)}
            onSave={handleSave}
            onCancel={handleCancel}
            onCellChange={handleCellChange}
          />
        </div>
      </div>
    </Container>
  );
}
