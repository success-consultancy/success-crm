'use client';

import React from 'react';

import Container from '@/components/atoms/container';
import { EditEducationService } from './_components/edit-educaion-service';
import { useParams } from 'next/navigation';
import { useGetEducationById, useGetEducationDetailById } from '@/query/get-education';
import PageLoader from '@/components/molecules/page-loader';

const EditEducationServicePage = () => {
  const params = useParams<{ id: string }>();
  const EditEducationServiceAny = EditEducationService as unknown as React.ComponentType<any>;
  const { data, isLoading: educationLoading } = useGetEducationDetailById(params.id);

  if (educationLoading) {
    return <PageLoader />;
  }

  const defaultValues = {
    firstName: data?.firstName || undefined,
    middleName: data?.middleName || undefined,
    lastName: data?.lastName || undefined,
    dob: data?.dob ? new Date(data.dob) : undefined,
    email: data?.email || undefined,
    phone: data?.phone || undefined,
    country: data?.country || undefined,
    passport: data?.passport?.toString() || undefined,
    issueDate: data?.issueDate ? new Date(data.issueDate) : undefined,
    expiryDate: data?.expiryDate ? new Date(data.expiryDate) : undefined,
    location: data?.location || undefined,
    universityId: data?.universityId?.toString() || undefined,
    courseId: data?.courseId?.toString() || undefined,
    startDate: data?.startDate ? new Date(data.startDate) : undefined,
    endDate: data?.endDate ? new Date(data.endDate) : undefined,
    status: data?.status || undefined,
    courseFee: {
      planname: undefined,
      amount: 0,
      duedate: undefined,
      invoicenumber: undefined,
      status: undefined,
      note: undefined,
      updatedBy: undefined,
      accounts: {
        planname: undefined,
        amount: undefined,
        duedate: undefined,
        invoicenumber: undefined,
        status: undefined,
        comission: undefined,
        discount: undefined,
        bonus: undefined,
        netamount: undefined,
        updatedBy: undefined,
      },
    },
    userId: data?.userId?.toString() || undefined,
    sourceId: data?.sourceId?.toString() || undefined,
    remarks: data?.remarks || undefined,
    statusDate: data?.statusDate ? new Date(data.statusDate) : undefined,
  };

  return (
    <Container className="flex flex-col py-10 gap-8">
      <EditEducationServiceAny defaultValues={defaultValues} id={Number(params.id)} />
    </Container>
  );
};

export default EditEducationServicePage;
