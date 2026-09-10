'use client';

import React from 'react';
import Container from '@/components/atoms/container';
import { useRouteId } from '@/hooks/use-route-id';
import { useGetSkillAssessmentById } from '@/query/get-skill-assessments';
import PageLoader from '@/components/molecules/page-loader';
import { useGetMe } from '@/query/get-me';
import { FORM_STATE } from '@/types/common';
import { SkillAssessmentService } from '../../add/_components/skill-assessment-service';
import { getSkillAssessmentDefaultValues } from '@/schema/skill-assessment-schema';
import Accounts from '../view/_components/accounts';

const EditSkillAssessmentPage = () => {
  const id = useRouteId();
  const { data: skillAssessment, isLoading: skillAssessmentLoading } = useGetSkillAssessmentById(id);
  const { data: me, isLoading: meLoading } = useGetMe();

  if (!id || skillAssessmentLoading || meLoading) {
    return <PageLoader />;
  }

  return (
    <Container className="flex flex-col py-10 gap-8">
      <SkillAssessmentService
        userId={skillAssessment?.userId || me?.data?.id}
        formState={FORM_STATE.EDIT}
        id={Number(id)}
        defaultValues={getSkillAssessmentDefaultValues(skillAssessment)}
      />
      <Accounts accounts={(skillAssessment?.accounts || []) as any} skillAssessmentId={skillAssessment?.id} />
    </Container>
  );
};

export default EditSkillAssessmentPage;
