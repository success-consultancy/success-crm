"use client";

import React, { useState } from "react";
import TabsMenu from "./navigation-tabs";
import { LeadStages } from "./lead-stages";
import PersonalDetails from "./personal-details";
import PassportVisaInfo from "./passport-visa-info";
import ServiceDetails from "./service-details";
import NoteSection from "./note-section";
import DocumentsSection from "./document-section";
import Container from "@/components/atoms/container";
import { useGetLeadById } from "@/query/get-leads";

interface LeadPageContentProps {
  leadId: string;
}


const LeadPageContent: React.FC<LeadPageContentProps> = ({ leadId }) => {
  const [activeTab, setActiveTab] = useState("overview");
  const tabs = [
    { label: "Overview", value: "overview" },
    { label: "Details", value: "details" },
    { label: "Activity", value: "activity" },
  ];
  const { data: lead, isLoading, isError } = useGetLeadById(leadId);

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-[300px]">Loading...</div>;
  }
  if (isError || !lead) {
    return <div className="flex justify-center items-center min-h-[300px] text-red-500">Lead not found.</div>;
  }

  return (
    <Container className="flex flex-col py-10 gap-8 !p-6">
      <div className="bg-white rounded-lg p-4">
        <TabsMenu items={tabs} active={activeTab} onChange={setActiveTab} />

        <div className="mt-6">
          {activeTab === "overview" && (
            <div className="space-y-4">
              <LeadStages lead={lead} />
              <PersonalDetails lead={lead} />
              <PassportVisaInfo lead={lead} />
              <ServiceDetails lead={lead} />
              <NoteSection lead={lead} />
              <DocumentsSection />
            </div>
          )}
          {activeTab === "details" && <p>Lead {leadId} Details content.</p>}
          {activeTab === "activity" && <p>Lead {leadId} Activity content.</p>}
        </div>
      </div>
    </Container>
  );
};

export default LeadPageContent;
