'use client';

import { Form } from '@/components/ui/form';

import { useEffect } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, type SubmitHandler } from 'react-hook-form';
import useSearchParams from '@/hooks/use-search-params';

import { useAddLead } from '@/mutations/leads/add-lead';
import { useRouter } from 'next/navigation';

import { useEditLead } from '@/mutations/leads/edit-lead';
import Portal from '@/components/atoms/portal';
import Button from '@/components/atoms/button';
import { PortalIds } from '@/config/portal';
import leadFormSchema, { type LeadSchemaType } from '@/schema/lead-schema';
import toast from 'react-hot-toast';
import { FormAccordion } from '@/components/organisms/form-accordion';
import { Accordion } from '@/components/ui/accordion';
import PersonalDetailsStep from './personal-details-fields';
import MiscStep from './misc-fields';
import VisaAndServiceStep from './visa-and-service-fields';

type Props = {
  mode: 'edit' | 'add';
  defaultValues?: Partial<LeadSchemaType & { id: number }>;
};

const AddLeadForm = ({ mode, defaultValues }: Props) => {
  const form = useForm<LeadSchemaType>({
    resolver: zodResolver(leadFormSchema) as any,
    defaultValues,
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
  });

  const { searchParams, setParam } = useSearchParams();

  const {
    handleSubmit,
    control,
    formState: { errors },
    setError,
  } = form;

  const router = useRouter();

  const addLead = useAddLead();
  const editLead = useEditLead();

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
    if (defaultValues) {
      form.reset(defaultValues);
    }
  }, [defaultValues]);

  return (
    <Form {...form}>
      <Portal rootId={PortalIds.DashboardHeader}>
        <h3 className="text-h4 text-content-heading font-bold">Leads</h3>
      </Portal>
      <div>
        <Accordion type="multiple" className="w-full space-y-4" defaultValue={['item-1', 'item-2', 'item-3']}>
          <FormAccordion value="item-1" title="Personal Details">
            <PersonalDetailsStep />
          </FormAccordion>
          <FormAccordion value="item-2" title="Visa & Service Details">
            <VisaAndServiceStep />
          </FormAccordion>
          <FormAccordion value="item-3" title="Misc">
            <MiscStep />
          </FormAccordion>
        </Accordion>
      </div>
      <div className="flex items-center justify-start gap-4">
        <Button onClick={handleSubmit(onSubmit)}>{mode === 'edit' ? 'Update Lead' : 'Add Lead'}</Button>
        <Button variant="outline" onClick={() => router.push('/leads')}>
          Cancel
        </Button>
      </div>
    </Form>
  );
};

export default AddLeadForm;
