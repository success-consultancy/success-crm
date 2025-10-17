'use client';

import { Plus } from 'lucide-react';
import React, { useCallback, useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import useSearchParams from '@/hooks/use-search-params';
import { LEADS_FILTER_PARAMS, useGetLeads } from '@/query/get-leads';
import { useDeleteLead, useDeleteLeadBulk } from '@/mutations/leads/delete-lead';
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
import { useGetEducation } from '@/query/get-education';
import { IEducation } from '@/types/response-types/education-response';
import { useEducationColumn } from '@/config/columns/education-columns-definitions';
import { useRouter } from 'next/navigation';
import { Separator } from '@/components/ui/separator';

// Tab Config
let TAB_CONFIG = [
  { key: 'all_students', label: 'All Students' },
  { key: 'in_progress', label: 'In Progress' }, // New student, Checklist sent, Application Ready, Application Submitted
  { key: 'offer_payment', label: 'Offer and Payment' }, // Offer Received, Waiting Payment, Fee Paid
  { key: 'coe_received', label: 'CoE Received' },
  { key: 'closed', label: 'Closed' }, // Withdrawn, Discontinued
];

const EducationServicePage = () => {
  const { getSearchParamsObject } = useSearchParams();
  const router = useRouter();

  const { ...filterParams } = getSearchParamsObject(LEADS_FILTER_PARAMS);

  const { data, isLoading } = useGetEducation({
    ...filterParams,
    q: filterParams?.q?.trim() || undefined,
    limit: filterParams.limit || '25',
  });
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

  const EducationColumns = useEducationColumn(handleDelete, handleSendEmail);

  const [visibleColumns, setVisibleColumns] = useState<ColumnDef<IEducation>[]>(EducationColumns);

  const { searchParams, setParams } = useSearchParams();

  const currentTab = searchParams.get('tab') || 'all_students';

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
      if (tab.key === currentTab && tab.key === 'all_students') {
        return { ...tab, count: data.count };
      }
      return tab;
    });
  }

  const handleRowClick = useCallback(
    (education: IEducation) => {
      router.push(`/education-service/${education.id}/view`);
    },
    [router],
  );

  return (
    <Container className="flex flex-col max-h-full overflow-hidden">
      <Portal rootId={PortalIds.DashboardHeader}>
        <h3 className="text-h5 text-content-heading font-bold">Education Services</h3>
      </Portal>
      <TableComponent
        data={data?.rows as IEducation[]}
        columns={visibleColumns}
        skeletonColumns={visibleColumns}
        isLoading={isLoading}
        offset={filterParams.limit || 25}
        totalItems={data?.count}
        currentPage={filterParams.page}
        searchKey="email"
        columnPinning={{
          left: ['select', 'lead-createdAt', 'lead-id'],
          right: ['lead-actions'],
        }}
        topRightSection={
          <div className="flex items-center">
            <Separator orientation="vertical" className="h-6 mr-[14px]" />

            <Button variant="outline" className="mr-2" onClick={() => exportLeads(filterParams)} loading={isExporting}>
              Export
            </Button>

            <ButtonLink href={ROUTES.ADD_EDUCATION_SERVICE} LeftIcon={Plus}>
              Add Education Service
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
      />
    </Container>
  );
};

export default EducationServicePage;
