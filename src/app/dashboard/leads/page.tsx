'use client';

import { Plus } from 'lucide-react';
import React, { useState } from 'react';
import { ROUTES } from '@/app/config/routes';
import Portal from '@/components/common/portal';
import { PortalIds } from '@/app/config/portal';
import { ColumnDef } from '@tanstack/react-table';
import Container from '@/components/common/container';
import TableComponent from '@/components/common/table';
import useSearchParams from '@/hooks/use-search-params';
import { ButtonLink } from '@/components/common/button-link';
import { ILead } from '@/types/response-types/leads-response';
import { LEADS_FILTER_PARAMS, useGetLeads } from '@/query/get-leads';
import { useLeadColumn } from '@/app/config/columns/leads-columns-definitions';
import { cn } from '@/lib/cn';
import TabSelector from '@/components/common/tab-selector';
import { useDeleteLead, useDeleteLeadBulk } from '@/mutations/leads/delete-lead';
import Button from '@/components/common/button';

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

  const { ...filterParams } = getSearchParamsObject(LEADS_FILTER_PARAMS);
  console.log(filterParams);

  const { data, isLoading } = useGetLeads({
    ...filterParams,
    limit: filterParams.limit || '25',
  });
  const { mutateAsync: deleteLead } = useDeleteLead();
  const { mutateAsync: deleteLeadBulk } = useDeleteLeadBulk();

  const handleDelete = (id: number) => {
    deleteLead(id);
  };

  const handleDeleteBulk = (ids: number[]) => {
    deleteLeadBulk(ids);
  };
  const LeadColumns = useLeadColumn(handleDelete);

  const [visibleColumns, setVisibleColumns] = useState<ColumnDef<ILead>[]>(LeadColumns);

  const { searchParams, setParams } = useSearchParams();

  const currentTab = searchParams.get('tab') || 'all_leads';

  const handleTabChange = (tabKey: string) => {
    setParams([{ name: 'tab', value: tabKey }]);
  };

  const handleDateRangeApply = (range: { from: Date | undefined; to: Date | undefined }) => {
    console.log('Date range selected:', range);
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
        searchKey="email"
        topRightSection={
          <div className="flex">
            <Button variant="outline" className="mr-2">
              Export
            </Button>

            <ButtonLink href={ROUTES.ADD_LEAD} LeftIcon={Plus}>
              Add Lead
            </ButtonLink>
          </div>
        }
        tableHeaderSection={<TabSelector activeTab={currentTab} onTabChange={handleTabChange} tabs={TAB_CONFIG} />}
        className="bg-neutral-white !text-neutral-darkGrey"
        onBulkDelete={handleDeleteBulk}
        handleDateRangeApply={handleDateRangeApply}
      />
    </Container>
  );
};

export default Leads;
