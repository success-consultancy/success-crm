import React from 'react';

import Container from '@/components/atoms/container';
import { EditEducationService } from './_components/edit-educaion-service';

const EditEducationServicePage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const EditEducationServiceAny = EditEducationService as unknown as React.ComponentType<any>;
  return (
    <Container className="flex flex-col py-10 gap-8">
      <EditEducationServiceAny id={Number(id)} />
    </Container>
  );
};

export default EditEducationServicePage;
