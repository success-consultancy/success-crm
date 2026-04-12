'use client';

import React, { useCallback, useMemo, useState } from 'react';
import TabsMenu from './navigation-tabs';
import Container from '@/components/atoms/container';
import { useGetVisaDetailById } from '@/query/get-visa';
import { VisaStages } from './visa-stages';
import PersonalDetails from './personal-details';
import VisaInformation from './visa-information';
import VisaNoteSection from './visa-note';
import MiscSection from './misc-section';
import NoteSection from './note-section';
import VisaHistoryContent from './visa-history-content';
import FollowUp from '@/components/organisms/follow-up';
import Accounts from './accounts';
import SectionLoader from '@/components/molecules/section-loader';

interface VisaPageContentProps {
  studentId: string;
}

const VisaPageContent: React.FC<VisaPageContentProps> = ({ studentId }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const tabs = [
    { label: 'Overview', value: 'overview' },
    { label: 'History', value: 'history' },
    { label: 'Follow-up', value: 'follow-up' },
  ];

  const { data: visa, isLoading, isError } = useGetVisaDetailById(studentId);

  if (isLoading) {
    return <SectionLoader />;
  }

  if (isError || !visa) {
    return <div className="flex justify-center items-center min-h-[300px] text-red-500">Visa Applicant not found.</div>;
  }

  return (
    <Container className="flex flex-col py-10 gap-8 !p-6">
      <div className="bg-white rounded-lg p-4">
        <TabsMenu items={tabs} active={activeTab} onChange={setActiveTab} />

        <div className="mt-6">
          {activeTab === 'overview' && (
            <div className="space-y-4">
              <VisaStages visa={visa} />
              <PersonalDetails visa={visa} />
              <VisaInformation visa={visa} />
              <VisaNoteSection visa={visa} />
              <Accounts accounts={visa.accounts} visaApplicantId={visa.id} />
              <MiscSection visa={visa} />
              <NoteSection initialNote={visa?.remarks} />
            </div>
          )}
          {/* NOTE : Change this ID later */}
          {activeTab === 'history' && <VisaHistoryContent visaId={studentId} />}
          {activeTab === 'follow-up' && <FollowUp followableType="visaApplicant" id={studentId} />}
        </div>
      </div>
    </Container>
  );
};

export default VisaPageContent;
