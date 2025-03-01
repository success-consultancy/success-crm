"use client";

import Container from "@/components/common/container";
import { Form, FormField } from "@/components/ui/form";
import leadFormSchema, { LeadSchemaType } from "@/schemas/lead-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import Portal from "@/components/common/portal";
import { PortalIds } from "@/app/config/portal";
import Input from "@/components/common/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import TinyEditor from "@/components/common/text-editor";
import { LeadsFormSteps } from "@/app/config/leads-form-steps";
import PersonalDetailsStep from "./_components/personal-details-fields";
import Button from "@/components/common/button";
import FormSteps from "@/components/common/form-steps";
import useSearchParams from "@/hooks/use-search-params";
import PassportDetailsStep from "./_components/passport-details-fields";
import ServiceDetailsStep from "./_components/service-details-fields";

type Props = {};

const page = (props: Props) => {
  return (
    <Container className="flex flex-col py-10 gap-8">
      <AddLeadForm />
    </Container>
  );
};

const AddLeadForm = () => {
  const form = useForm<LeadSchemaType>({
    resolver: zodResolver(leadFormSchema),
  });

  const { searchParams, setParam } = useSearchParams();

  const {
    control,
    formState: { errors },
  } = form;

  const [currentStep, setCurrentStep] = useState(
    searchParams.get("step") || LeadsFormSteps.PersonalDetails
  );

  const handleStepChange = () => {
    if (currentStep === LeadsFormSteps.PersonalDetails) {
      setParam("step", LeadsFormSteps.PassportAndVisa);
      setCurrentStep(LeadsFormSteps.PassportAndVisa);
    }
    if (currentStep === LeadsFormSteps.PassportAndVisa) {
      setParam("step", LeadsFormSteps.ServiceDetails);
      setCurrentStep(LeadsFormSteps.ServiceDetails);
    }
  };

  const handlePrevStep = () => {
    if (currentStep === LeadsFormSteps.ServiceDetails) {
      setParam("step", LeadsFormSteps.PassportAndVisa);
      setCurrentStep(LeadsFormSteps.PassportAndVisa);
    } else if (currentStep === LeadsFormSteps.PassportAndVisa) {
      setParam("step", LeadsFormSteps.PersonalDetails);
      setCurrentStep(LeadsFormSteps.PersonalDetails);
    }
  };

  useEffect(() => {
    if (searchParams.get("step")) {
      setCurrentStep(searchParams.get("step") as string);
    }
  }, [searchParams]);

  return (
    <Form {...form}>
      <Portal rootId={PortalIds.DashboardHeader}>
        <h3 className="text-h4 text-content-heading font-bold">Leads</h3>
      </Portal>
      <div className="flex items-center justify-center">
        <FormSteps
          currentStep={currentStep}
          formSteps={Object.values(LeadsFormSteps)}
        />
      </div>
      <div className="w-full bg-neutral-white rounded-2xl flex flex-col gap-6 pb-5">
        <div className=" py-3 border-b border-b-stroke-divider flex items-center gap-2 px-6">
          <span className="text-h5 font-bold text-content-heading">
            {currentStep}
          </span>
        </div>
        <FormProvider {...form}>
          <form action="" className="flex flex-col gap-5 px-6">
            {currentStep === LeadsFormSteps.PersonalDetails && (
              <PersonalDetailsStep />
            )}
            {currentStep === LeadsFormSteps.PassportAndVisa && (
              <PassportDetailsStep />
            )}
            {currentStep === LeadsFormSteps.ServiceDetails && (
              <ServiceDetailsStep />
            )}
            <div className="flex items-center justify-between pt-2">
              {currentStep !== LeadsFormSteps.PersonalDetails && (
                <Button variant={"ghost"} onClick={() => handlePrevStep()}>
                  Back
                </Button>
              )}
              <div></div>

              <div className="flex items-center  gap-3">
                <Button variant={"secondary"}>Cancel</Button>
                <Button onClick={() => handleStepChange()}>Next</Button>
              </div>
            </div>
          </form>
        </FormProvider>
      </div>
    </Form>
  );
};

export default page;

