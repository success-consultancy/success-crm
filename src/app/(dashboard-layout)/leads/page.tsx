'use client';

import useSearchParams from '@/hooks/use-search-params';
import { LEADS_FILTER_PARAMS, useGetLeads } from '@/query/get-leads';
import { Plus } from 'lucide-react';
import React, { useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { ILead } from '@/types/response-types/leads-response';
import { LeadColumns } from '@/config/columns/leads-columns-definitions';
import Container from '@/components/atoms/container';
import Portal from '@/components/atoms/portal';
import TableComponent from '@/components/organisms/table';
import { PortalIds } from '@/config/portal';
import { ButtonLink } from '@/components/atoms/button-link';
import TabSelector from '@/components/atoms/tab-selector';
import { ROUTES } from '@/config/routes';


// Tab Config
const TAB_CONFIG = [
  { key: 'all_leads', label: 'All Leads' },
  { key: 'new_leads', label: 'New Leads' },
  { key: 'qualified_leads', label: 'Qualified leads' },
  { key: 'disqualified_leads', label: 'Disqualified leads' },
  { key: 'follow_up', label: 'Follow up' }
];

const Leads = () => {
  const { getSearchParamsObject } = useSearchParams();

  const { ...filterParams } = getSearchParamsObject(LEADS_FILTER_PARAMS);
  const { data, isLoading } = useGetLeads({
    ...filterParams,
    limit: filterParams.limit || '25',
  });

  const [visibleColumns, setVisibleColumns] = useState<ColumnDef<ILead>[]>(LeadColumns);

  const { searchParams, setParams } = useSearchParams();

  const currentTab = searchParams.get('tab') || 'all_leads';

  const handleTabChange = (tabKey: string) => {
    setParams([{ name: 'tab', value: tabKey }]);
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
          <ButtonLink href={ROUTES.ADD_LEAD} LeftIcon={Plus}>
            Add Lead
          </ButtonLink>
        }
        tableHeaderSection={
          <TabSelector activeTab={currentTab} onTabChange={handleTabChange} tabs={TAB_CONFIG} />
        }
        className="bg-neutral-white !text-neutral-darkGrey"
      />
    </Container>
  );
};

export default Leads;
