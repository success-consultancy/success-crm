'use client';

import React, { useState } from 'react';
import TabsMenu from './navigation-tabs';
import Container from '@/components/atoms/container';
import { VisaStages } from './visa-stages';
import PersonalDetails from './personal-details';
import VisaInformation from './visa-information';
import MiscSection from './misc-section';
import NoteSection from './note-section';
import VisaHistoryContent from './visa-history-content';
import FollowUp from '@/components/organisms/follow-up';
import { useGetTribunalReviewById } from '@/query/get-tribunalreview';
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
import { useDeleteTribunal } from '@/mutations/tribunal-review/delete-tribunal-review';
import { useSendEmail } from '@/mutations/email-sms/email';

interface TribunalPageContentProps {
  studentId: string;
}

const TribunalPageContent: React.FC<TribunalPageContentProps> = ({ studentId }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const tabs = [
    { label: 'Overview', value: 'overview' },
    { label: 'History', value: 'history' },
    { label: 'Follow-up', value: 'follow-up' },
  ];

  const { data: visa, isLoading, isError } = useGetTribunalReviewById(studentId);

  const router = useRouter();
  const { update: canUpdate, delete: canDelete } = usePermissions('tribunalReview');
  const { mutate: deleteRecord } = useDeleteTribunal();
  const { mutate: sendEmail } = useSendEmail();

  if (isLoading) {
    return <SectionLoader />;
  }

  if (isError || !visa) {
    return (
      <div className="flex justify-center items-center min-h-[300px] text-red-500">Tribunal Review not found.</div>
    );
  }

  return (
    <Container className="flex flex-col py-10 gap-8 !p-6">
      <Portal rootId={PortalIds.DashboardHeader}>
        <div className="flex items-center gap-4">
          <ButtonLink href={ROUTES.TRIBUNAL_REVIEW} variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </ButtonLink>
          <h3 className="text-h5 text-content-heading font-bold">
            {[visa.firstName, visa.middleName, visa.lastName].filter(Boolean).join(' ')}
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
              onEdit={() => router.push(`/dashboard/tribunal-review/${visa.id}/edit`)}
              onSendEmail={(payload) => sendEmail(payload)}
              recipientEmail={visa.email}
              deleteTitle="Delete this tribunal review"
              deleteDescription={<p>Are you sure you want to delete this tribunal review? This cannot be undone.</p>}
              deleteConfirmText="Yes, delete"
              onDelete={() => deleteRecord(visa.id, { onSuccess: () => router.push(ROUTES.TRIBUNAL_REVIEW) })}
            />
          }
        />

        <div className="mt-6">
          {activeTab === 'overview' && (
            <div className="space-y-4">
              <VisaStages visa={visa} />
              <PersonalDetails visa={visa} />
              <VisaInformation visa={visa} />
              <Accounts accounts={visa.accounts} id={visa.id} />
              <MiscSection visa={visa} />
              <NoteSection initialNote={visa?.remarks} />
            </div>
          )}
          {/* NOTE : Change this ID later */}
          {activeTab === 'history' && <VisaHistoryContent visaId={studentId} />}
          {activeTab === 'follow-up' && <FollowUp followableType="tribunalReview" id={studentId} />}
        </div>
      </div>
    </Container>
  );
};

export default TribunalPageContent;
