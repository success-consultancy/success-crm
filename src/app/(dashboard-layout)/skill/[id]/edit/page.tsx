'use client';

import React from 'react';
import Container from '@/components/atoms/container';
import { EditSkillAssessment } from './_components/edit-skill-assessment';
import { useParams } from 'next/navigation';
import { useGetSkillAssessmentById } from '@/query/get-skill-assessments';
import PageLoader from '@/components/molecules/page-loader';
import { useGetMe } from '@/query/get-me';
import { format } from 'date-fns';

const EditSkillAssessmentPage = () => {
  const params = useParams<{ id: string }>();
  const { data: skillAssessment, isLoading: skillAssessmentLoading } = useGetSkillAssessmentById(params.id);
  const { data: me, isLoading: meLoading } = useGetMe();

  if (skillAssessmentLoading || meLoading) {
    return <PageLoader />;
  }

  // Convert dates from API format to DD/MM/YYYY format
  const convertDate = (dateString: string | null | undefined): string | null => {
    if (!dateString) return null;
    try {
      // If already in DD/MM/YYYY format, return as is
      if (dateString.includes('/')) return dateString;
      // Otherwise parse ISO format and convert
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return null;
      return format(date, 'dd/MM/yyyy');
    } catch {
      return null;
    }
  };

  const defaultValues = {
    firstName: skillAssessment?.firstName || '',
    lastName: skillAssessment?.lastName || '',
    middleName: skillAssessment?.middleName || null,
    email: skillAssessment?.email || '',
    phone: skillAssessment?.phone || '',
    dob: convertDate(skillAssessment?.dob),
    country: skillAssessment?.country || null,
    passport: skillAssessment?.passport?.toString() || null,
    issueDate: convertDate(skillAssessment?.issueDate),
    expiryDate: convertDate(skillAssessment?.expiryDate),
    location: skillAssessment?.location || null,
    currentVisa: skillAssessment?.currentVisa || null,
    visaExpiry: convertDate(skillAssessment?.visaExpiry),
    occupation: skillAssessment?.occupation || null,
    anzsco: skillAssessment?.anzsco || null,
    skillAssessmentBody: skillAssessment?.skillAssessmentBody || null,
    otherSkillAssessmentBody: skillAssessment?.otherSkillAssessmentBody || null,
    dueDate: convertDate(skillAssessment?.dueDate),
    submittedDate: convertDate(skillAssessment?.submittedDate),
    decisionDate: convertDate(skillAssessment?.decisionDate),
    status: skillAssessment?.status || null,
    sourceId: skillAssessment?.sourceId?.toString() || null,
    userId: skillAssessment?.userId || null,
    invoiceNumber: skillAssessment?.invoiceNumber || null,
    payment: skillAssessment?.payment || null,
    paymentStatus: skillAssessment?.paymentStatus || null,
    remarks: skillAssessment?.remarks || null,
  };

  return (
    <Container className="flex flex-col py-10 gap-8">
      <EditSkillAssessment
        userId={me?.data?.id}
        id={Number(params.id)}
        defaultValues={defaultValues}
      />
    </Container>
  );
};

export default EditSkillAssessmentPage;
