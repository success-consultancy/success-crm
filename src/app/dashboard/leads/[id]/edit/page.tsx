import React from 'react';
import Container from '@/components/common/container';
import EditLeadClient from './_components/edit-lead';

const EditLeadPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  return (
    <Container className="flex flex-col py-10 gap-8">
      <EditLeadClient leadId={id} />
    </Container>
  );
};

export default EditLeadPage;
