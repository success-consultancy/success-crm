'use client';

import React from 'react';
import Container from '@/components/atoms/container';
import { useParams } from 'next/navigation';
import { useGetVisaDetailById } from '@/query/get-visa';
import PageLoader from '@/components/molecules/page-loader';
import { EditVisaService } from './_components/edit-visa-service';
import { NewVisaServiceType } from '@/schema/visa-service/new-visa.schema';

const EditVisaServicePage = () => {
  const params = useParams<{ id: string }>();
  const { data, isLoading: visaLoading } = useGetVisaDetailById(params.id);

  if (visaLoading) {
    return <PageLoader />;
  }

  const defaultValues = {
    // Required fields
    firstName: data?.firstName || '',
    lastName: data?.lastName || '',
    email: data?.email || '',
    phone: data?.phone || '',
    // Optional fields — preserve null to avoid spurious change logs
    middleName: data?.middleName ?? null,
    dob: data?.dob ?? null,
    country: data?.country ?? null,
    state: data?.state ?? null,
    passport: data?.passport ?? null,
    issueDate: data?.issueDate ?? null,
    expiryDate: data?.expiryDate ?? null,
    location: data?.location ?? null,
    currentVisa: data?.currentVisa ?? null,
    visaExpiry: data?.visaExpiry ?? null,
    dueDate: data?.dueDate ?? null,
    proposedVisa: data?.proposedVisa ?? null,
    visaStream: data?.visaStream ?? null,
    occupation: data?.occupation ?? null,
    anzsco: data?.anzsco ?? null,
    sponsorName: data?.sponsorName ?? null,
    sponsorEmail: data?.sponsorEmail ?? null,
    sponsorPhone: data?.sponsorPhone ?? null,
    csaStatus: data?.csaStatus ?? null,
    visaSubmitted: data?.visaSubmitted ?? null,
    visaGranted: data?.visaGranted ?? null,
    nominationStatus: data?.nominationStatus ?? null,
    nominationLodged: data?.nominationLodged ?? null,
    nominationDecision: data?.nominationDecision ?? null,
    status: data?.status ?? null,
    statusDate: data?.statusDate ?? null,
    requestedDate: data?.requestedDate ?? null,
    sbsStatus: data?.sbsStatus ?? null,
    sbsSubmissionDate: data?.sbsSubmissionDate ?? null,
    sbsDecisionDate: data?.sbsDecisionDate ?? null,
    payment: data?.payment ?? null,
    invoiceNumber: data?.invoiceNumber ?? null,
    paymentStatus: data?.paymentStatus ?? null,
    userId: data?.userId ?? null,
    sourceId: data?.sourceId ?? null,
    updatedBy: data?.updatedBy ?? null,
    remarks: data?.remarks ?? null,
    assignedDate: data?.assignedDate ? new Date(data.assignedDate as string) : null,
    files: data?.files ?? null,
  };

  return (
    <Container className="flex flex-col py-10 gap-8">
      <EditVisaService
        userId={data?.userId}
        visaId={Number(params.id)}
        defaultValues={defaultValues as Partial<NewVisaServiceType>}
      />
    </Container>
  );
};

export default EditVisaServicePage;
