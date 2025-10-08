'use client';

import { Form } from '@/components/ui/form';

import { useEffect, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm, type SubmitHandler } from 'react-hook-form';
import useSearchParams from '@/hooks/use-search-params';

import { useAddLead } from '@/mutations/leads/add-lead';
import { useRouter } from 'next/navigation';
import PersonalDetailsStep from './personal-details-fields';
import PassportDetailsStep from './passport-details-fields';
import ServiceDetailsStep from './service-details-fields';
import { useEditLead } from '@/mutations/leads/edit-lead';
import { LeadsFormSteps } from '@/config/leads-form-steps';
import Portal from '@/components/atoms/portal';
import FormSteps from '@/components/molecules/form-steps';
import Button from '@/components/atoms/button';
import { PortalIds } from '@/config/portal';
import leadFormSchema, {
  type LeadSchemaType,
  passportDetailsSchema,
  personalDetailsSchema,
} from '@/schema/lead-schema';
import { getCompletedSteps } from '@/utils/lead-helper';
import toast from 'react-hot-toast';

type Props = {
  mode: 'edit' | 'add';
  defaultValues?: Partial<LeadSchemaType & { id: number }>;
};

const AddLeadForm = ({ mode, defaultValues }: Props) => {
  const form = useForm<LeadSchemaType>({
    resolver: zodResolver(leadFormSchema) as any,
    defaultValues,
  });

  const { searchParams, setParam } = useSearchParams();

  const {
    handleSubmit,
    control,
    formState: { errors },
    getValues,
    trigger,
    setError,
  } = form;

  const router = useRouter();

  const addLead = useAddLead();
  const editLead = useEditLead();

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

  const onSubmit: SubmitHandler<LeadSchemaType> = (data) => {
    const serviceType = JSON.stringify(data.serviceType);

    const payload = {
      ...data,
      serviceType,
    } as Omit<LeadSchemaType, 'serviceType'> & { serviceType: string };

    if (mode === 'edit') {
      editLead.mutate(
        { ...payload, id: defaultValues?.id as number },
        {
          onSuccess: () => {
            toast.success('Lead updated successfully');
            router.push('/leads');
          },
          onError: (error: any) => {
            const message = error?.response?.data?.message;

            if (error?.response?.data?.errors) {
              Object.entries(error?.response?.data?.errors).forEach(([key, value]) => {
                setError(key as any, {
                  type: 'manual',
                  message: value as string,
                });
              });
            }

            toast.error(message || 'Failed to update lead');
          },
        },
      );
    } else {
      addLead.mutate(payload, {
        onSuccess: () => {
          toast.success('Lead added successfully');
          router.push('/leads');
        },
        onError: (error: any) => {
          const message = error?.response?.data?.message;
          console.log({
            errors: error?.response?.data?.errors,
          });
          if (error?.response?.data?.errors) {
            Object.entries(error?.response?.data?.errors).forEach(([key, value]) => {
              setError(key as any, {
                type: 'manual',
                message: value as string,
              });
            });
          }

          toast.error(message || 'Failed to add lead');
        },
      });
    }
  };

  useEffect(() => {
    if (searchParams.get('step')) {
      setCurrentStep(searchParams.get('step') as string);
    }
  }, [searchParams]);

  useEffect(() => {
    if (defaultValues) {
      form.reset(defaultValues);
    }
  }, [defaultValues]);

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
                <Button onClick={() => router.push('/leads')} variant={'secondary'}>
                  Cancel
                </Button>
                {currentStep === LeadsFormSteps.ServiceDetails ? (
                  <Button type="submit">{mode === 'edit' ? 'Update' : 'Submit'}</Button>
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

export default AddLeadForm;
