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
      <div className="bg-white rounded-lg p-4">
        <TabsMenu items={tabs} active={activeTab} onChange={setActiveTab} />

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
