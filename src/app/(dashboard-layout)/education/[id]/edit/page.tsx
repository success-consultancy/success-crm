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
    firstName: data?.firstName || '',
    middleName: data?.middleName || '',
    lastName: data?.lastName || '',
    dob: data?.dob ? new Date(data.dob) : new Date(),
    email: data?.email || '',
    phone: data?.phone || '',
    country: data?.country || '',
    passport: data?.passport || '',
    issueDate: data?.issueDate ? new Date(data.issueDate) : new Date(),
    expiryDate: data?.expiryDate ? new Date(data.expiryDate) : new Date(),
    location: data?.location || '',
    universityId: data?.universityId.toString() || '',
    courseId: data?.courseId.toString() || '',
    startDate: data?.startDate ? new Date(data.startDate) : new Date(),
    endDate: data?.endDate ? new Date(data.endDate) : new Date(),
    status: data?.status || '',
    courseFee: {
      planname: '',
      amount: 0,
      duedate: new Date(),
      invoicenumber: '',
      status: '',
      note: '',
      updatedBy: '',
      accounts: {
        planname: '',
        amount: '',
        duedate: new Date(),
        invoicenumber: '',
        status: '',
        comission: '',
        discount: '',
        bonus: '',
        netamount: '',
        updatedBy: '',
      },
    },
    userId: data?.userId.toString() || '',
    sourceId: data?.sourceId.toString() || '',
    remarks: data?.remarks || '',
    statusDate: data?.statusDate ? new Date(data.statusDate) : new Date(),
  };

  return (
    <Container className="flex flex-col py-10 gap-8">
      <EditEducationServiceAny defaultValues={defaultValues} id={Number(params.id)} />
    </Container>
  );
};

export default EditEducationServicePage;
