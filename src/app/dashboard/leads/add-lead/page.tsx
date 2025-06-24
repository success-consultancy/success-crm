'use client';

import leadFormSchema, { LeadSchemaType, passportDetailsSchema, personalDetailsSchema } from '@/schemas/lead-schema';

import { Form } from '@/components/ui/form';

import Portal from '@/components/common/portal';
import { PortalIds } from '@/app/config/portal';
import Button from '@/components/common/button';

import React, { useEffect, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import Container from '@/components/common/container';
import FormSteps from '@/components/common/form-steps';

import { FormProvider, useForm } from 'react-hook-form';
import useSearchParams from '@/hooks/use-search-params';

import { LeadsFormSteps } from '@/app/config/leads-form-steps';

import { getCompletedSteps } from '@/utils/lead-helper';
import ServiceDetailsStep from './_components/service-details-fields';
import PersonalDetailsStep from './_components/personal-details-fields';
import PassportDetailsStep from './_components/passport-details-fields';
import { useAddLead } from '@/mutations/leads/add-lead';

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
    handleSubmit,
    control,
    formState: { errors },
    getValues,
    trigger,
  } = form;

  const addLead = useAddLead();

  console.log(errors);

  const [currentStep, setCurrentStep] = useState(searchParams.get('step') || LeadsFormSteps.PersonalDetails);

  const [completedSteps, setCompletedSteps] = useState<LeadsFormSteps[]>([]);

  const handleStepChange = async () => {
    let isValid = false;

    // Validate only the fields for the current step
    if (currentStep === LeadsFormSteps.PersonalDetails) {
      // Trigger validation only for personal details fields
      isValid = await trigger(Object.keys(personalDetailsSchema.shape) as any);
    } else if (currentStep === LeadsFormSteps.PassportAndVisa) {
      // Trigger validation only for passport details fields
      isValid = await trigger(Object.keys(passportDetailsSchema.shape) as any);
    } else if (currentStep === LeadsFormSteps.ServiceDetails) {
      // For the last step, we can validate all fields or just service details
      isValid = await trigger();
    }

    // Only proceed if validation passed
    if (isValid) {
      const completed = await getCompletedSteps(getValues());
      setCompletedSteps(completed);

      if (currentStep === LeadsFormSteps.PersonalDetails) {
        setParam('step', LeadsFormSteps.PassportAndVisa);
        setCurrentStep(LeadsFormSteps.PassportAndVisa);
      } else if (currentStep === LeadsFormSteps.PassportAndVisa) {
        setParam('step', LeadsFormSteps.ServiceDetails);
        setCurrentStep(LeadsFormSteps.ServiceDetails);
      }
    }
  };

  const handlePrevStep = () => {
    if (currentStep === LeadsFormSteps.ServiceDetails) {
      setParam('step', LeadsFormSteps.PassportAndVisa);
      setCurrentStep(LeadsFormSteps.PassportAndVisa);
    } else if (currentStep === LeadsFormSteps.PassportAndVisa) {
      setParam('step', LeadsFormSteps.PersonalDetails);
      setCurrentStep(LeadsFormSteps.PersonalDetails);
    }
  };

  const onSubmit = (data: LeadSchemaType) => {
    const serviceType = JSON.stringify(data.serviceType);

    const payload = {
      ...data,
      serviceType,
      sourceId: data.source ? Number(data.source) : undefined,
    } as Omit<LeadSchemaType, "serviceType" | "source"> & {
      serviceType: string;
      sourceId?: number;
    };

    addLead.mutate(payload); // Submit logic goes here
  };

  useEffect(() => {
    if (searchParams.get('step')) {
      setCurrentStep(searchParams.get('step') as string);
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
          completedSteps={completedSteps}
        />
      </div>
      <div className="w-full bg-neutral-white rounded-2xl flex flex-col gap-6 pb-5">
        <div className=" py-3 border-b border-b-stroke-divider flex items-center gap-2 px-6">
          <span className="text-h5 font-bold text-content-heading">{currentStep}</span>
        </div>
        <FormProvider {...form}>
          <form className="flex flex-col gap-5 px-6" onSubmit={form.handleSubmit(onSubmit)}>
            {currentStep === LeadsFormSteps.PersonalDetails && <PersonalDetailsStep />}
            {currentStep === LeadsFormSteps.PassportAndVisa && <PassportDetailsStep />}
            {currentStep === LeadsFormSteps.ServiceDetails && <ServiceDetailsStep />}
            <div className="flex items-center justify-between pt-2">
              {currentStep !== LeadsFormSteps.PersonalDetails && (
                <Button variant={'ghost'} onClick={() => handlePrevStep()}>
                  Back
                </Button>
              )}
              <div></div>
              <div className="flex items-center gap-3">
                <Button variant={'secondary'}>Cancel</Button>
                {currentStep === LeadsFormSteps.ServiceDetails ? (
                  <Button type="submit">Submit</Button>
                ) : (
                  <Button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      handleStepChange();
                    }}
                  >
                    Next
                  </Button>
                )}
              </div>
            </div>
          </form>
        </FormProvider>
      </div>
    </Form>
  );
};

export default page;
