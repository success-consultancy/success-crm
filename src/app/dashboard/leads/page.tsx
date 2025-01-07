"use client";

import React from "react";
import { Plus } from "lucide-react";
import Button from "@/components/common/button";
import Container from "@/components/common/container";
import TableComponent from "@/components/common/table";
import { ILead } from "@/types/response-types/leads-response";
import { LEADS_FILTER_PARAMS, useGetLeads } from "@/query/get-leads";
import { LeadColumns } from "@/app/config/columns/leads-columns-definitions";
import useSearchParams from "@/hooks/use-search-params";

const Leads = () => {
  const { getSearchParamsObject } = useSearchParams();

  const { ...filterParams } = getSearchParamsObject(LEADS_FILTER_PARAMS);
  const { data, isLoading } = useGetLeads({
    ...filterParams,
    limit: filterParams.limit || "25",
  });

  return (
    <Container className="flex flex-col py-10 gap-5">
      <div className="w-full flex items-center justify-between">
        <h3 className="text-h3 text-content-heading">Leads</h3>
        <Button LeftIcon={Plus}>Add Lead</Button>
      </div>
      <TableComponent
        data={data?.rows as ILead[]}
        columns={LeadColumns}
        skeletonColumns={LeadColumns}
        isLoading={isLoading}
        offset={filterParams.limit || 25}
        totalItems={data?.count}
        currentPage={filterParams.page}
      />
    </Container>
  );
};

export default Leads;

