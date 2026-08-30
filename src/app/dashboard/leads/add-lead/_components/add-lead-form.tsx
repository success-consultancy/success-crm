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
import leadFormSchema, { LEAD_DEPENDENT_FIELDS, type LeadSchemaType } from '@/schema/lead-schema';
import { useDependentFields } from '@/hooks/use-dependent-fields';
import toast from 'react-hot-toast';
import { FormAccordion } from '@/components/organisms/form-accordion';
import { Accordion } from '@/components/ui/accordion';
import PersonalDetailsStep from './personal-details-fields';
import MiscStep from './misc-fields';
import VisaAndServiceStep from './visa-and-service-fields';
import { ROUTES } from '@/config/routes';
import { ArrowLeft } from 'lucide-react';
import { FormActions } from '@/components/organisms/form-actions';
import { ENTITY, LOADING_LABEL, toastMsg } from '@/constants/messages';

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

  useDependentFields(form, LEAD_DEPENDENT_FIELDS);

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
  const isSubmitting = addLead.isPending || editLead.isPending;

  const onSubmit: SubmitHandler<LeadSchemaType> = (data) => {
    const serviceType = JSON.stringify(data.serviceType ?? []);

    const payload = {
      ...data,
      serviceType,
    } as Omit<LeadSchemaType, 'serviceType'> & { serviceType: string };

    if (mode === 'edit') {
      editLead.mutate(
        { ...payload, id: defaultValues?.id as number },
        {
          onSuccess: () => {
            toast.success(toastMsg.updateSuccess(ENTITY.lead));
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

            toast.error(message || toastMsg.updateError(ENTITY.lead));
          },
        },
      );
    } else {
      addLead.mutate(payload, {
        onSuccess: () => {
          toast.success(toastMsg.addSuccess(ENTITY.lead));
          router.push(ROUTES.LEADS);
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

          toast.error(message || toastMsg.addError(ENTITY.lead));
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
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            type="button"
            onClick={() => (mode === 'add' ? router.push(ROUTES.LEADS) : router.back())}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h3 className="text-h4 text-content-heading font-bold">{mode === 'edit' ? 'Edit lead' : 'New lead'}</h3>
        </div>
      </Portal>
      {/* Single internal scroll region so the page doesn't double-scroll (CRM-178). */}
      <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar pr-1">
        <Accordion type="multiple" className="w-full space-y-3.5" defaultValue={['item-1', 'item-2', 'item-3']}>
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
      <FormActions className="shrink-0">
        <Button
          type="button"
          loading={isSubmitting}
          loadingText={mode === 'edit' ? LOADING_LABEL.update : LOADING_LABEL.add}
          onClick={handleSubmit(onSubmit)}
        >
          {mode === 'edit' ? 'Update Lead' : 'Add Lead'}
        </Button>
        <Button type="button" variant="outline" disabled={isSubmitting} onClick={() => router.back()}>
          Cancel
        </Button>
      </FormActions>
    </Form>
  );
};

export default AddLeadForm;
