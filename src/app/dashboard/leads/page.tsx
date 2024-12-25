"use client";

import React from "react";
import { useGetLeads } from "@/query/get-leads";
import Container from "@/components/common/container";
import TableComponent from "@/components/common/table";
import { ILead } from "@/types/response-types/leads-response";
import { LeadColumns } from "@/app/config/columns/leads-columns-definitions";

const Leads = () => {
  const { data, isLoading } = useGetLeads();

  return (
    <Container className="flex flex-col py-10 gap-5">
      <h3 className="text-h3 text-content-heading">Leads</h3>
      <TableComponent
        data={data?.rows as ILead[]}
        columns={LeadColumns}
        isLoading={isLoading}
      />
    </Container>
  );
};

export default Leads;

