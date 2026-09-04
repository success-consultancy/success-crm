'use client';

import React, { useState } from 'react';
import TabsMenu from './navigation-tabs';
import { LeadStages } from './lead-stages';
import PersonalDetails from './personal-details';
import PassportVisaInfo from './passport-visa-info';
import ServiceDetails from './service-details';
import NoteSection from './note-section';
import DocumentsSection from './document-section';
import Container from '@/components/atoms/container';
import { useGetLeadById } from '@/query/get-leads';
import Transition from './transition';
import { History } from './history';
import FollowUp from '@/components/organisms/follow-up';
import ViewPageSkeleton from '@/components/molecules/view-page-skeleton';
import Portal from '@/components/atoms/portal';
import { PortalIds } from '@/config/portal';
import { ButtonLink } from '@/components/atoms/button-link';
import { ArrowLeft } from 'lucide-react';
import { ROUTES } from '@/config/routes';
import { useRouter } from 'next/navigation';
import RecordActions from '@/components/organisms/record-actions';
import ConfirmationDialog from '@/components/organisms/confirmation-dialog';
import { usePermissions } from '@/hooks/use-permissions';
import { useDeleteLead } from '@/mutations/leads/delete-lead';
import { useSendEmail } from '@/mutations/email-sms/email';
import { useMoveLead, MoveService } from '@/hooks/use-move-lead';

interface LeadPageContentProps {
  leadId: string;
}

const LeadPageContent: React.FC<LeadPageContentProps> = ({ leadId }) => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const tabs = [
    { label: 'Overview', value: 'overview' },
    { label: 'Transition', value: 'transition' },
    { label: 'History', value: 'history' },
    { label: 'Follow-up', value: 'follow-up' },
  ];
  const { data: lead, isLoading, isError } = useGetLeadById(leadId);

  const { update: canUpdate, delete: canDelete } = usePermissions('leads');
  const { mutate: deleteLead } = useDeleteLead();
  const { mutateAsync: sendEmail } = useSendEmail();
  const { services: moveServices, moveLead } = useMoveLead();
  const [confirmService, setConfirmService] = useState<MoveService | null>(null);

  if (isLoading) {
    return (
      <ViewPageSkeleton
        tabs={4}
        stageCount={4}
        infoSections={[
          { titleWidth: 'w-32', fields: 10 },
          { titleWidth: 'w-36', fields: 6 },
          { titleWidth: 'w-36', fields: 6 },
        ]}
        showTable
      />
    );
  }
  if (isError || !lead) {
    return <div className="flex justify-center items-center min-h-[300px] text-red-500">Lead not found.</div>;
  }

  return (
    <Container className="flex flex-col py-10 gap-8 !p-6">
      <Portal rootId={PortalIds.DashboardHeader}>
        <div className="flex items-center gap-4">
          <ButtonLink href={ROUTES.LEADS} variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </ButtonLink>
          <h3 className="text-h5 text-content-heading font-bold">
            {[lead.firstName, lead.middleName, lead.lastName].filter(Boolean).join(' ')}
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
              onEdit={() => router.push(`/dashboard/leads/${lead.id}/edit`)}
              moveTo={{
                options: moveServices,
                onSelect: (opt) => setConfirmService(moveServices.find((s) => s.id === opt.id) ?? null),
              }}
              onSendEmail={(payload) => sendEmail(payload)}
              recipientEmail={lead.email}
              deleteTitle="Delete this lead"
              deleteDescription={
                <div className="flex flex-col gap-3">
                  <p>Are you sure you want to delete this lead?</p>
                  <p>Deleting this lead will remove all associated data, including contacts, interactions and notes.</p>
                </div>
              }
              deleteConfirmText="Yes, delete"
              onDelete={() => deleteLead(lead.id, { onSuccess: () => router.push(ROUTES.LEADS) })}
            />
          }
        />

        <ConfirmationDialog
          isOpen={!!confirmService}
          setIsOpen={(open) => {
            if (!open) setConfirmService(null);
          }}
          title="Confirm move"
          message={`Are you sure you want to move this lead to ${confirmService?.title}?`}
          confirmText="Move"
          cancelText="Cancel"
          onConfirm={() => {
            if (confirmService) moveLead(lead, confirmService.id);
            setConfirmService(null);
          }}
          onCancel={() => setConfirmService(null)}
        />

        <div className="mt-6">
          {activeTab === 'overview' && (
            <div className="space-y-4">
              <LeadStages lead={lead} onFollowUpClick={() => setActiveTab('follow-up')} />
              <PersonalDetails lead={lead} />
              <PassportVisaInfo lead={lead} />
              <ServiceDetails lead={lead} />
              <NoteSection lead={lead} />
              <DocumentsSection lead={lead} />
            </div>
          )}
          {activeTab === 'transition' && <Transition lead={lead} />}
          {activeTab === 'history' && <History lead={lead} />}
          {activeTab === 'follow-up' && <FollowUp id={lead.id.toString()} followableType="lead" />}
        </div>
      </div>
    </Container>
  );
};

export default LeadPageContent;
