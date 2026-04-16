'use client';

import Container from '@/components/atoms/container';
import Portal from '@/components/atoms/portal';
import TabSelector from '@/components/atoms/tab-selector';
import TableComponent from '@/components/organisms/table';
import { PortalIds } from '@/config/portal';
import { useActiveCheckInColumns, useHistoryCheckInColumns } from '@/config/columns/check-in-columns-definitions';
import { CHECK_INS_FILTER_PARAMS, useGetCheckIns } from '@/query/get-check-ins';
import { useEndCheckInSession } from '@/mutations/check-in/end-session';
import { useExportCheckIns } from '@/mutations/check-in/export-check-ins';
import useSearchParams from '@/hooks/use-search-params';
import { ICheckIn } from '@/types/response-types/check-in-response';
import { useMemo } from 'react';
import Button from '@/components/atoms/button';
import { Separator } from '@/components/ui/separator';

const CheckInPage = () => {
  const { getSearchParamsObject, searchParams, setParams } = useSearchParams();
  const filterParams = getSearchParamsObject(CHECK_INS_FILTER_PARAMS);
  const currentTab = (searchParams.get('tab') || 'active') as 'active' | 'history';

  // Main data query for current tab
  const { data, isLoading } = useGetCheckIns({
    ...filterParams,
    q: filterParams?.q?.trim() || undefined,
    limit: filterParams.limit || '25',
    tab: currentTab,
  });

  // Lightweight count queries for both tabs (always fetch both for tab badges)
  const { data: activeCountData } = useGetCheckIns({
    q: filterParams?.q?.trim() || undefined,
    q_field: filterParams?.q_field || undefined,
    tab: 'active',
    limit: '1',
    page: '1',
  });
  const { data: historyCountData } = useGetCheckIns({
    q: filterParams?.q?.trim() || undefined,
    q_field: filterParams?.q_field || undefined,
    tab: 'history',
    limit: '1',
    page: '1',
  });

  const { mutate: endSession } = useEndCheckInSession();
  const { mutateAsync: exportCheckIns, isPending: isExporting } = useExportCheckIns();

  const handleEndSession = (id: number) => endSession(id);

  const handleTabChange = (tabKey: string) => {
    setParams([
      { name: 'tab', value: tabKey },
      { name: 'page', value: null },
      { name: 'q', value: null },
      { name: 'q_field', value: null },
    ]);
  };

  const activeColumns = useActiveCheckInColumns(handleEndSession);
  const historyColumns = useHistoryCheckInColumns();

  // Reactive: columns update when tab changes
  const columns = useMemo(
    () => (currentTab === 'active' ? activeColumns : historyColumns),
    [currentTab], // eslint-disable-line react-hooks/exhaustive-deps
  );

  const tabs = [
    { key: 'active', label: 'Active check-in', count: activeCountData?.count },
    { key: 'history', label: 'Check-in history', count: historyCountData?.count },
  ];

  return (
    <Container className="flex flex-col flex-1 min-h-0 overflow-hidden">
      <Portal rootId={PortalIds.DashboardHeader}>
        <h3 className="text-h5 text-content-heading font-bold">Check-in</h3>
      </Portal>
      <TableComponent
        data={(data?.rows as ICheckIn[]) || []}
        columns={columns}
        skeletonColumns={columns}
        isLoading={isLoading}
        offset={filterParams.limit || 25}
        totalItems={data?.count}
        currentPage={filterParams.page}
        searchKey="checkin"
        storageKey={`checkin-${currentTab}-columns`}
        topRightSection={
          <div className="flex items-center">
            <Separator orientation="vertical" className="h-6 mr-[14px]" />
            <Button
              variant="outline"
              onClick={() => exportCheckIns({ ...filterParams, tab: currentTab })}
              loading={isExporting}
            >
              Export
            </Button>
          </div>
        }
        tableHeaderSection={
          <TabSelector
            btnClassName="mb-4"
            activeTab={currentTab}
            onTabChange={handleTabChange}
            tabs={tabs}
          />
        }
        className="bg-neutral-white !text-neutral-darkGrey"
      />
    </Container>
  );
};

export default CheckInPage;
