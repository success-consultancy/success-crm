export interface FiscalReportRow {
  id: number;
  name: string;
  target: Record<string, number>;
  actual: Record<string, number>;
}

export interface FiscalReport {
  id: number;
  year: string;
  name: string;
  type: string;
  data: FiscalReportRow[];
}

export type FiscalReportListResponse = FiscalReport[];
