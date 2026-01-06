'use client';

import { Plus } from 'lucide-react';
import React, { useCallback, useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import useSearchParams from '@/hooks/use-search-params';
import { LEADS_FILTER_PARAMS, useGetLeads } from '@/query/get-leads';
import Container from '@/components/atoms/container';
import Portal from '@/components/atoms/portal';
import TableComponent from '@/components/organisms/table';
import { PortalIds } from '@/config/portal';
import Button from '@/components/atoms/button';
import { ButtonLink } from '@/components/atoms/button-link';
import { ROUTES } from '@/config/routes';
import TabSelector from '@/components/atoms/tab-selector';
import { useSendEmail } from '@/mutations/email-sms/email';
import { SendEmailSchemaType } from '@/schema/send-email-schema';
import { useRouter } from 'next/navigation';
import { Separator } from '@/components/ui/separator';
import { IVisa } from '@/types/response-types/visa-response';
import { useGetTribunalReviews } from '@/query/get-tribunalreview';
import { useDeleteTribunal, useDeleteTribunalBulk } from '@/mutations/tribunal-review/delete-tribunal-review';
import { useTribunalReviewColumn } from '@/config/columns/tribunal-columns-definations';
import { useExportTribunalReviews } from '@/mutations/tribunal-review/export-tribunal-review';

const DEFAULT_TAB = 'all_tribunal';
// Tab Config
let TAB_CONFIG = [
  { key: 'all_tribunal', label: 'All Tribunal' },
  { key: 'in_progress', label: 'In Progress' }, // New, Collecting Docs, Ready to Submit, Submitted, Info Requested
  { key: 'decision', label: 'Decisions' },
  { key: 'closed', label: 'Closed' }, // Withdrawn,  Refused, Discontinued
  { key: 'follow_up', label: 'Follow Up' },
];

const ServicePage = () => {
  const { getSearchParamsObject } = useSearchParams();
  const router = useRouter();

  const { ...filterParams } = getSearchParamsObject(LEADS_FILTER_PARAMS);

  const { data, isLoading } = useGetTribunalReviews({
    ...filterParams,
    q: filterParams?.q?.trim() || undefined,
    limit: filterParams.limit || '25',
  });
  const { mutateAsync: deleteTribunal } = useDeleteTribunal();
  const { mutateAsync: deleteTribunalBulk } = useDeleteTribunalBulk();
  const { mutateAsync: sendEmail } = useSendEmail();
  const { mutateAsync: exportDateToCSV, isPending: isExporting } = useExportTribunalReviews();

  const handleDelete = (id: number) => {
    deleteTribunal(id);
  };

  const handleDeleteBulk = (ids: number[]) => {
    deleteTribunalBulk(ids);
  }; 111

  const handleSendEmail = (payload: SendEmailSchemaType) => {
    sendEmail(payload);
  };

  const VisaColumns = useTribunalReviewColumn(handleDelete, handleSendEmail);

  const [visibleColumns, setVisibleColumns] = useState<ColumnDef<IVisa>[]>(VisaColumns);

  const { searchParams, setParams } = useSearchParams();

  const currentTab = searchParams.get('tab') || DEFAULT_TAB;

  const handleTabChange = (tabKey: string) => {
    setParams([{ name: 'tab', value: tabKey }]);
  };

  const handleDateRangeApply = (range: { from: Date | undefined; to: Date | undefined }) => {
    setParams([
      { name: 'from', value: range.from?.toISOString() || null },
      { name: 'to', value: range.to?.toISOString() || null },
    ]);
  };

  if (data?.count) {
    TAB_CONFIG = TAB_CONFIG.map((tab) => {
      if (tab.key === currentTab && tab.key === DEFAULT_TAB) {
        return { ...tab, count: data.count };
      }
      return tab;
    });
  }

  const handleRowClick = useCallback(
    (visa: IVisa) => {
      router.push(`/tribunal-review/${visa.id}/view`);
    },
    [router],
  );

  return (
    <Container className="flex flex-col max-h-full overflow-hidden">
      <Portal rootId={PortalIds.DashboardHeader}>
        <h3 className="text-h5 text-content-heading font-bold">Tribunal Review</h3>
      </Portal>
      <TableComponent
        data={data?.rows as IVisa[]}
        columns={visibleColumns}
        skeletonColumns={visibleColumns}
        isLoading={isLoading}
        offset={filterParams.limit || 25}
        totalItems={data?.count}
        currentPage={filterParams.page}
        searchKey="email"
        columnPinning={{
          left: ['select', 'visa-createdAt', 'visa-id', 'visa-first-name', 'visa-last-name'],
          right: ['visa-actions'],
        }}
        topRightSection={
          <div className="flex items-center">
            <Separator orientation="vertical" className="h-6 mr-[14px]" />

            <Button
              variant="outline"
              className="mr-2"
              onClick={() => exportDateToCSV(filterParams)}
              loading={isExporting}
            >
              Export
            </Button>

            <ButtonLink href={ROUTES.ADD_TRIBUNAL_SERVICE} LeftIcon={Plus}>
              Add Tribunal Review
            </ButtonLink>
          </div>
        }
        tableHeaderSection={
          <TabSelector btnClassName="mb-4" activeTab={currentTab} onTabChange={handleTabChange} tabs={TAB_CONFIG} />
        }
        className="bg-neutral-white !text-neutral-darkGrey"
        onBulkDelete={handleDeleteBulk}
        handleDateRangeApply={handleDateRangeApply}
        onSendEmail={handleSendEmail}
        onRowClick={handleRowClick}
        bulkDeleteTitle="Delete tribunal review"
        bulkDeleteDescription="Are you sure you want to delete the selected tribunal review? This action cannot be undone."
      />
    </Container>
  );
};

export default ServicePage;
