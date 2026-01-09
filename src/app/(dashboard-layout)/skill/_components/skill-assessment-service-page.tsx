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
import { useSendEmail } from '@/mutations/email-sms/email';
import { SendEmailSchemaType } from '@/schema/send-email-schema';
import { useRouter } from 'next/navigation';
import { Separator } from '@/components/ui/separator';
import { useGetSkillAssessments, SKILL_ASSESSMENT_FILTER_PARAMS } from '@/query/get-skill-assessments';
import { useDeleteSkillAssessment, useDeleteSkillAssessmentBulk } from '@/mutations/skill-assessment/delete-visa';
import { ISkillAssessment } from '@/types/response-types/skill-assessment-response';
import { useSkillAssessmentColumn } from '@/config/columns/skill-assessment-columns-definitions';
import { useExportSkillAssessments } from '@/mutations/skill-assessment/export-skill-assessments';

// Tab Config
let TAB_CONFIG = [
  { key: 'all_applicants', label: 'All applicants' },
  { key: 'in_progress', label: 'In progress' },
  { key: 'approved', label: 'Approved' },
  { key: 'closed', label: 'Closed' },
  { key: 'follow_up', label: 'Follow-up' },
];

const SkillAssessmentServicePage = () => {
  const { getSearchParamsObject } = useSearchParams();
  const router = useRouter();

  const { ...filterParams } = getSearchParamsObject(SKILL_ASSESSMENT_FILTER_PARAMS);

  const { data, isLoading } = useGetSkillAssessments({
    ...filterParams,
    q: filterParams?.q?.trim() || undefined,
    limit: filterParams.limit || '25',
  });
  const { mutateAsync: deleteSkillAssessment } = useDeleteSkillAssessment();
  const { mutateAsync: deleteSkillAssessmentBulk } = useDeleteSkillAssessmentBulk();
  const { mutateAsync: sendEmail } = useSendEmail();
  const { mutateAsync: exportSkillAssessments, isPending: isExporting } = useExportSkillAssessments();

  const handleDelete = (id: number) => {
    deleteSkillAssessment(id);
  };

  const handleDeleteBulk = (ids: number[]) => {
    deleteSkillAssessmentBulk(ids);
  };

  const handleSendEmail = (payload: SendEmailSchemaType) => {
    sendEmail(payload);
  };

  const SkillAssessmentColumns = useSkillAssessmentColumn(handleDelete, handleSendEmail);

  const [visibleColumns, setVisibleColumns] = useState<ColumnDef<ISkillAssessment>[]>(SkillAssessmentColumns);

  const { searchParams, setParams } = useSearchParams();

  const currentTab = searchParams.get('tab') || 'all_applicants';

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
      if (tab.key === currentTab && tab.key === 'all_applicants') {
        return { ...tab, count: data.count };
      }
      return tab;
    });
  }

  const handleRowClick = useCallback(
    (skillAssessment: ISkillAssessment) => {
      router.push(`/skill/${skillAssessment.id}/view`);
    },
    [router],
  );

  return (
    <Container className="flex flex-col max-h-full overflow-hidden">
      <Portal rootId={PortalIds.DashboardHeader}>
        <h3 className="text-h5 text-content-heading font-bold">Skill assessment service</h3>
      </Portal>
      <TableComponent
        data={data?.rows as ISkillAssessment[]}
        columns={visibleColumns}
        skeletonColumns={visibleColumns}
        isLoading={isLoading}
        offset={filterParams.limit || 25}
        totalItems={data?.count}
        currentPage={filterParams.page}
        searchKey="email"
        columnPinning={{
          left: ['select', 'skill-assessment-createdAt', 'skill-assessment-id', 'skill-assessment-first-name', 'skill-assessment-last-name'],
          right: ['skill-assessment-actions'],
        }}
        topRightSection={
          <div className="flex items-center">
            <Separator orientation="vertical" className="h-6 mr-[14px]" />

            <Button
              variant="outline"
              className="mr-2"
              onClick={() => exportSkillAssessments(filterParams)}
              loading={isExporting}
            >
              Export
            </Button>

            <ButtonLink href={ROUTES.ADD_SKILL_ASSESSMENT} LeftIcon={Plus}>
              Add applicant
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
        bulkDeleteTitle="Delete Skill Assessment Applicants"
        bulkDeleteDescription="Are you sure you want to delete the selected skill assessment applicants? This action cannot be undone."
      />
    </Container>
  );
};

export default SkillAssessmentServicePage;
