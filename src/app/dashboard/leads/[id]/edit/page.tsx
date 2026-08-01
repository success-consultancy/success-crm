import React from 'react';
import EditLeadClient from './_components/edit-lead';
import Container from '@/components/atoms/container';

const EditLeadPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  return (
    <Container className="flex flex-col flex-1 min-h-0 overflow-hidden py-5 gap-4">
      <EditLeadClient leadId={id} />
    </Container>
  );
};

export default EditLeadPage;
