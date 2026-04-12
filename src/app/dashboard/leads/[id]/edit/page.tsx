import React from 'react';
import EditLeadClient from './_components/edit-lead';
import Container from '@/components/atoms/container';

const EditLeadPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  return (
    <Container className="flex flex-col py-10 gap-8">
      <EditLeadClient leadId={id} />
    </Container>
  );
};

export default EditLeadPage;
