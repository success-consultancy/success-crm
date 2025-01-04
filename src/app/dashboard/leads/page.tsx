"use client";

import React from "react";
import { LEADS_FILTER_PARAMS, useGetLeads } from "@/query/get-leads";
import Container from "@/components/common/container";
import TableComponent from "@/components/common/table";
import { ILead } from "@/types/response-types/leads-response";
import { LeadColumns } from "@/app/config/columns/leads-columns-definitions";
import useSearchParams from "@/hooks/use-search-params";
import Button from "@/components/common/button";
import { Plus } from "lucide-react";

const Leads = () => {
  const { getSearchParamsObject } = useSearchParams();

  const { ...filterParams } = getSearchParamsObject(LEADS_FILTER_PARAMS);
  const { data, isLoading } = useGetLeads(filterParams);

  return (
    <Container className="flex flex-col py-10 gap-5">
      <div className="w-full flex items-center justify-between">
        <h3 className="text-h3 text-content-heading">Leads</h3>
        <Button LeftIcon={Plus}>Add Lead</Button>
      </div>
      <TableComponent
        data={data?.rows as ILead[]}
        columns={LeadColumns}
        isLoading={isLoading}
      />
    </Container>
  );
};

export default Leads;

