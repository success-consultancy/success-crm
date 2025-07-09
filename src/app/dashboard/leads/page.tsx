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
import { LeadColumns } from '@/app/config/columns/leads-columns-definitions';

const Leads = () => {
  const { getSearchParamsObject } = useSearchParams();

  const { ...filterParams } = getSearchParamsObject(LEADS_FILTER_PARAMS);
  const { data, isLoading } = useGetLeads({
    ...filterParams,
    limit: filterParams.limit || '25',
  });

  const [visibleColumns, setVisibleColumns] = useState<ColumnDef<ILead>[]>(LeadColumns);

  return (
    <Container className="flex flex-col py-4 max-h-full overflow-hidden">
      <Portal rootId={PortalIds.DashboardHeader}>
        <h3 className="text-h4 text-content-heading font-bold">Leads</h3>
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
        className="bg-neutral-white text-neutral-darkGrey"
      />
    </Container>
  );
};

export default Leads;
