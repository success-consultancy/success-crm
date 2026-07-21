import { api, getApiErrorMessage } from '@/lib/api';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import QueryString from 'qs';
import { downloadFile } from '@/utils/download';
import { CheckInResponseType, ICheckIn } from '@/types/response-types/check-in-response';
import { buildCheckInCsv, CheckInTab } from '@/utils/check-in-csv';

const exportCheckIns = async (params: Record<string, any>) => {
  const tab: CheckInTab = params.tab === 'history' ? 'history' : 'active';

  // Fetch all rows matching the current tab/filters and build the CSV client-side
  // so its columns match the tab's table. The server /checkin/export endpoint
  // returned the same (History) columns regardless of tab (CRM-149). Pagination is
  // bypassed with a high limit so the export covers every matching record.
  const query = QueryString.stringify(
    { ...params, tab, limit: '100000', page: '1' },
    { arrayFormat: 'repeat' },
  );
  const res = await api.get('/checkin?' + query);
  const rows = ((res.data as CheckInResponseType)?.rows ?? []) as ICheckIn[];

  const csv = buildCheckInCsv(rows, tab);
  const filename = tab === 'history' ? 'check-in-history.csv' : 'active-check-ins.csv';
  downloadFile(csv, filename, 'text/csv;charset=utf-8;');
};

export const useExportCheckIns = () => {
  return useMutation({
    mutationFn: exportCheckIns,
    onError: (error: any) => {
      toast.error('Failed to export check-ins');
    },
  });
};
