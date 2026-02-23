'use client';

import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useCallback, useMemo, useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import useSearchParams from '@/hooks/use-search-params';
import { ILead } from '@/types/response-types/leads-response';
import { LEADS_FILTER_PARAMS, useGetLeads, useGetLeads as useLeads } from '@/query/get-leads';
import { useDeleteLead, useDeleteLeadBulk } from '@/mutations/leads/delete-lead';
import { useLeadColumn } from '@/config/columns/leads-columns-definitions';
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
import { useExportLeads } from '@/mutations/leads/export-lead';
import { Separator } from '@/components/ui/separator';

// Tab Config
const TAB_CONFIG = [
  { key: 'all_leads', label: 'All Leads' },
  { key: 'new_leads', label: 'New Leads' },
  { key: 'qualified_leads', label: 'Qualified leads' },
  { key: 'disqualified_leads', label: 'Disqualified leads' },
  { key: 'follow_up', label: 'Follow up' },
];

const Leads = () => {
  const { getSearchParamsObject } = useSearchParams();
  const router = useRouter();

  // Get filter params from URL
  const { ...filterParams } = getSearchParamsObject(LEADS_FILTER_PARAMS);

  // Fetch leads data
  const { data, isLoading } = useGetLeads({
    ...filterParams,
    q: filterParams?.q?.trim() || undefined,
    limit: filterParams.limit || '25',
  });

  // Row click handler
  const handleRowClick = useCallback(
    (lead: ILead) => {
      router.push(`/leads/${lead.id}/view`);
    },
    [router],
  );

  // Mutations
  const { mutateAsync: deleteLead } = useDeleteLead();
  const { mutateAsync: deleteLeadBulk } = useDeleteLeadBulk();
  const { mutateAsync: sendEmail } = useSendEmail();
  const { mutateAsync: exportLeads, isPending: isExporting } = useExportLeads();

  const handleDelete = (id: number) => {
    deleteLead(id);
  };

  const handleDeleteBulk = (ids: number[]) => {
    deleteLeadBulk(ids);
  };

  const handleSendEmail = (payload: SendEmailSchemaType) => {
    sendEmail(payload);
  };

  const LeadColumns = useLeadColumn(handleDelete, handleSendEmail);

  const [visibleColumns, setVisibleColumns] = useState<ColumnDef<ILead>[]>(LeadColumns);

  const { searchParams, setParams } = useSearchParams();

  const currentTab = searchParams.get('tab') || 'all_leads';

  const handleTabChange = (tabKey: string) => {
    setParams([{ name: 'tab', value: tabKey }]);
  };

  const handleDateRangeApply = (range: { from: Date | undefined; to: Date | undefined }) => {
    setParams([
      { name: 'from', value: range.from?.toISOString() || null },
      { name: 'to', value: range.to?.toISOString() || null },
    ]);
  };

  return (
    <Container className="flex flex-col py-4 max-h-full overflow-hidden">
      <Portal rootId={PortalIds.DashboardHeader}>
        <h3 className="text-h5 text-content-heading font-bold">Leads</h3>
      </Portal>
      <TableComponent
        data={data?.rows as ILead[]}
        columns={visibleColumns}
        skeletonColumns={visibleColumns}
        isLoading={isLoading}
        offset={filterParams.limit || 25}
        totalItems={data?.count}
        currentPage={filterParams.page}
        columnPinning={{
          left: ['select', 'lead-createdAt', 'lead-id', 'lead-first-name'],
          right: ['lead-actions'],
        }}
        topRightSection={
          <div className="flex items-center">
            <Separator orientation="vertical" className="h-6 mr-[14px]" />
            <Button variant="outline" className="mr-2" onClick={() => exportLeads(filterParams)} loading={isExporting}>
              Export
            </Button>
            <ButtonLink href={ROUTES.ADD_LEAD} LeftIcon={Plus}>
              Add Lead
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
        bulkDeleteTitle="Delete Leads"
        bulkDeleteDescription="Are you sure you want to delete the selected leads? This action cannot be undone."
      />
    </Container>
  );
};

export default Leads;
