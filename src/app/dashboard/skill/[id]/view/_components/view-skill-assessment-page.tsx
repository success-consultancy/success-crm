'use client';

import React, { useState } from 'react';
import TabsMenu from './navigation-tabs';
import Container from '@/components/atoms/container';
import { useGetSkillAssessmentById } from '@/query/get-skill-assessments';
import { SkillAssessmentStages } from './skill-assessment-stages';
import PersonalDetails from './personal-details';
import VisaServiceDetails from './visa-service-details';
import VisaServiceNoteSection from './visa-service-note';
import MiscSection from './misc-section';
import NoteSection from './note-section';
import SkillAssessmentHistoryContent from './skill-assessment-history-content';
import FollowUp from '@/components/organisms/follow-up';
import Accounts from './accounts';
import SectionLoader from '@/components/molecules/section-loader';
import Portal from '@/components/atoms/portal';
import { PortalIds } from '@/config/portal';
import { ButtonLink } from '@/components/atoms/button-link';
import { ArrowLeft } from 'lucide-react';
import { ROUTES } from '@/config/routes';
import { useRouter } from 'next/navigation';
import RecordActions from '@/components/organisms/record-actions';
import { usePermissions } from '@/hooks/use-permissions';
import { useDeleteSkillAssessment } from '@/mutations/skill-assessment/delete-visa';
import { useSendEmail } from '@/mutations/email-sms/email';

interface SkillAssessmentPageContentProps {
  skillAssessmentId: string;
}

const SkillAssessmentPageContent: React.FC<SkillAssessmentPageContentProps> = ({ skillAssessmentId }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const tabs = [
    { label: 'Overview', value: 'overview' },
    { label: 'History', value: 'history' },
    { label: 'Follow-up', value: 'follow-up' },
  ];

  const { data: skillAssessment, isLoading, isError } = useGetSkillAssessmentById(skillAssessmentId);

  const router = useRouter();
  const { update: canUpdate, delete: canDelete } = usePermissions('skill');
  const { mutate: deleteRecord } = useDeleteSkillAssessment();
  const { mutate: sendEmail } = useSendEmail();

  if (isLoading) {
    return <SectionLoader />;
  }

  if (isError || !skillAssessment) {
    return (
      <div className="flex justify-center items-center min-h-[300px] text-red-500">Skill Assessment not found.</div>
    );
  }

  return (
    <Container className="flex flex-col py-10 gap-8 !p-6">
      <Portal rootId={PortalIds.DashboardHeader}>
        <div className="flex items-center gap-4">
          <ButtonLink href={ROUTES.SKILL_ASSESSMENT} variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </ButtonLink>
          <h3 className="text-h5 text-content-heading font-bold">
            {[skillAssessment.firstName, skillAssessment.middleName, skillAssessment.lastName]
              .filter(Boolean)
              .join(' ')}
          </h3>
        </div>
      </Portal>

      <div className="bg-white rounded-lg p-4">
        <TabsMenu
          items={tabs}
          active={activeTab}
          onChange={setActiveTab}
          actions={
            <RecordActions
              canUpdate={canUpdate}
              canDelete={canDelete}
              onEdit={() => router.push(`/dashboard/skill/${skillAssessment.id}/edit`)}
              onSendEmail={(payload) => sendEmail(payload)}
              recipientEmail={skillAssessment.email}
              deleteTitle="Delete this skill assessment applicant"
              deleteDescription={<p>Are you sure you want to delete this skill assessment applicant? This cannot be undone.</p>}
              deleteConfirmText="Yes, delete"
              onDelete={() => deleteRecord(skillAssessment.id, { onSuccess: () => router.push(ROUTES.SKILL_ASSESSMENT) })}
            />
          }
        />

        <div className="mt-6">
          {activeTab === 'overview' && (
            <div className="space-y-4">
              <SkillAssessmentStages skillAssessment={skillAssessment} />
              <PersonalDetails skillAssessment={skillAssessment} />
              <VisaServiceDetails skillAssessment={skillAssessment} />
              <VisaServiceNoteSection skillAssessment={skillAssessment} />
              <Accounts
                accounts={(skillAssessment.accounts || []) as any}
                skillAssessmentId={skillAssessment.id}
              />
              <MiscSection skillAssessment={skillAssessment} />
              <NoteSection />
            </div>
          )}
          {activeTab === 'history' && <SkillAssessmentHistoryContent skillAssessmentId={skillAssessmentId} />}
          {activeTab === 'follow-up' && <FollowUp followableType="skillAssessment" id={skillAssessmentId} />}
        </div>
      </div>
    </Container>
  );
};

export default SkillAssessmentPageContent;
