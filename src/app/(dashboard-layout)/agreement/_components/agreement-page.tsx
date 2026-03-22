'use client';

import { Plus } from 'lucide-react';
import React, { useCallback, useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import useSearchParams from '@/hooks/use-search-params';
import Container from '@/components/atoms/container';
import Portal from '@/components/atoms/portal';
import TableComponent from '@/components/organisms/table';
import { PortalIds } from '@/config/portal';
import Button from '@/components/atoms/button';
import { ButtonLink } from '@/components/atoms/button-link';
import { ROUTES } from '@/config/routes';
import TabSelector from '@/components/atoms/tab-selector';
import { useRouter } from 'next/navigation';
import { Separator } from '@/components/ui/separator';
import { useGetAgreements, AGREEMENT_FILTER_PARAMS } from '@/query/get-agreements';
import { useDeleteAgreement, useDeleteAgreementBulk } from '@/mutations/agreement/delete-agreement';
import { IAgreement } from '@/types/response-types/agreement-response';
import { useAgreementColumn } from '@/config/columns/agreement-columns-definitions';
import { useExportAgreements } from '@/mutations/agreement/export-agreements';

// Tab Config
const BASE_TAB_CONFIG = [
  { key: 'all', label: 'All agreements' },
  { key: 'in_process', label: 'In Progress' },
  { key: 'in_effect', label: 'In Effect' },
  { key: 'cancelled', label: 'Cancelled' },
  { key: 'expired', label: 'Expired' },
];

const AgreementPage = () => {
  const { getSearchParamsObject, searchParams, setParams } = useSearchParams();
  const router = useRouter();

  const { ...filterParams } = getSearchParamsObject(AGREEMENT_FILTER_PARAMS);

  const currentTab = searchParams.get('tab') || 'all';

  const { data, isLoading } = useGetAgreements({
    ...filterParams,
    q: filterParams?.q?.trim() || undefined,
    limit: filterParams.limit || '25',
    tab: currentTab !== 'all' ? currentTab : undefined,
  });

  const { mutateAsync: deleteAgreement } = useDeleteAgreement();
  const { mutateAsync: deleteAgreementBulk } = useDeleteAgreementBulk();
  const { mutateAsync: exportAgreements, isPending: isExporting } = useExportAgreements();

  const handleDelete = (id: number) => {
    deleteAgreement(id);
  };

  const handleDeleteBulk = (ids: number[]) => {
    deleteAgreementBulk(ids);
  };

  const AgreementColumns = useAgreementColumn(handleDelete);

  const [visibleColumns, setVisibleColumns] = useState<ColumnDef<IAgreement>[]>(AgreementColumns);

  const handleTabChange = (tabKey: string) => {
    setParams([{ name: 'tab', value: tabKey }]);
  };

  const handleDateRangeApply = (range: { from: Date | undefined; to: Date | undefined }) => {
    setParams([
      { name: 'from', value: range.from?.toISOString() || null },
      { name: 'to', value: range.to?.toISOString() || null },
    ]);
  };

  const TAB_CONFIG = BASE_TAB_CONFIG.map((tab) => {
    if (tab.key === 'all' && data?.count) {
      return { ...tab, count: data.count };
    }
    return tab;
  });

  const handleRowClick = useCallback(
    (agreement: IAgreement) => {
      router.push(`/agreement/${agreement.id}/view`);
    },
    [router],
  );

  return (
    <Container className="flex flex-col h-full overflow-hidden">
      <Portal rootId={PortalIds.DashboardHeader}>
        <h3 className="text-h5 text-content-heading font-bold">Agreements</h3>
      </Portal>
      <TableComponent
        data={data?.rows as IAgreement[]}
        columns={visibleColumns}
        skeletonColumns={visibleColumns}
        isLoading={isLoading}
        offset={filterParams.limit || 25}
        totalItems={data?.count}
        currentPage={filterParams.page}
        searchKey="university"
        columnPinning={{
          left: ['select', 'agreement-id', 'agreement-university'],
          right: ['agreement-actions'],
        }}
        topRightSection={
          <div className="flex items-center">
            <Separator orientation="vertical" className="h-6 mr-[14px]" />

            <Button
              variant="outline"
              className="mr-2"
              onClick={() => exportAgreements(filterParams)}
              loading={isExporting}
            >
              Export
            </Button>

            <ButtonLink href={ROUTES.ADD_AGREEMENT} LeftIcon={Plus}>
              Add agreement
            </ButtonLink>
          </div>
        }
        tableHeaderSection={
          <TabSelector btnClassName="mb-4" activeTab={currentTab} onTabChange={handleTabChange} tabs={TAB_CONFIG} />
        }
        className="bg-neutral-white !text-neutral-darkGrey"
        onBulkDelete={handleDeleteBulk}
        handleDateRangeApply={handleDateRangeApply}
        onRowClick={handleRowClick}
        bulkDeleteTitle="Delete Agreements"
        bulkDeleteDescription="Are you sure you want to delete the selected agreements? This action cannot be undone."
      />
    </Container>
  );
};

export default AgreementPage;
