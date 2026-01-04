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
    // Personal Details
    firstName: data?.firstName || '', // "Noelani"
    middleName: data?.middleName || '', // "Grace"
    lastName: data?.lastName || '', // "Melissa"
    dob: data?.dob || '', // ""
    email: data?.email || '', // "dociqonuz@mailinator.com"
    phone: data?.phone || '', // "Emma"
    country: data?.country || '', // "Abel"
    state: data?.state || '', // "Barry"
    passport: data?.passport || '', // 1111
    issueDate: data?.issueDate || '', // ""
    expiryDate: data?.expiryDate || '', // ""
    location: data?.location || '', // "Onshore"

    // Visa Information
    currentVisa: data?.currentVisa || '', // "No Visa"
    visaExpiry: data?.visaExpiry || '', // ""
    dueDate: data?.dueDate || '', // ""
    proposedVisa: data?.proposedVisa || '', // "Family Visa"
    visaStream: data?.visaStream || '', // Missing in API - empty
    occupation: data?.occupation || '', // "Engineer"
    anzsco: data?.anzsco || '', // ""
    sponsorName: data?.sponsorName || '', // Missing in API - empty
    sponsorEmail: data?.sponsorEmail || '', // Missing in API - empty
    sponsorPhone: data?.sponsorPhone || '', // Missing in API - empty
    csaStatus: data?.csaStatus || '', // "Rejected"
    visaSubmitted: data?.visaSubmitted || '', // ""
    visaGranted: data?.visaGranted || '', // ""
    nominationStatus: data?.nominationStatus || '', // "Refused"
    nominationLodged: data?.nominationLodged || '', // ""
    nominationDecision: data?.nominationDecision || '', // ""
    status: data?.status || '', // "Under Review"
    statusDate: data?.statusDate || '', // ""
    requestedDate: data?.requestedDate || '', // ""
    sbsStatus: data?.sbsStatus || null, // ""
    sbsSubmissionDate: data?.sbsSubmissionDate || '', // ""
    sbsDecisionDate: data?.sbsDecisionDate || '', // ""

    // Accounts
    payment: data?.payment || '', // "14"
    invoiceNumber: data?.invoiceNumber || '', // "Autumn"
    paymentStatus: data?.paymentStatus || '', // "Overdue"

    // Misc
    userId: Number(data?.userId) || '', // 3
    sourceId: data?.sourceId || '', // 3
    updatedBy: data?.updatedBy || '', // 1
    remarks: data?.remarks || '', // "<p>Hello World</p>"
    assignedDate: new Date(data?.assignedDate as string) || new Date(), // "2025-11-20"
    files: data?.files || null, // null
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
