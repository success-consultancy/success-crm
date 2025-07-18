import React from "react";
import Container from "@/components/common/container";
import EditLeadClient from "./_components/edit-lead";

type Props = {
  params: { id: string };
};

const EditLeadPage = async ({ params }: Props) => {
  const leadId = await params.id;
  return (
    <Container className="flex flex-col py-10 gap-8">
      <EditLeadClient leadId={leadId} />
    </Container>
  );
};

export default EditLeadPage;
