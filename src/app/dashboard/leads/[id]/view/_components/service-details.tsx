'use client';

import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';

import { InfoField } from '@/components/atoms/info-field';
import { Form, FormField } from '@/components/ui/form';
import SelectCommon from '@/components/molecules/select-common';
import MultiSelect from '@/components/molecules/multi-select';

import EditableTitleBox from './editable-title-box';
import { buildLeadSectionPayload } from './lead-section-payload';
import { serviceDetailsSchema } from '@/schema/lead-schema';
import { ILead, LeadStatusTypes } from '@/types/response-types/leads-response';
import { useEditLead } from '@/mutations/leads/edit-lead';
import { useGetSource } from '@/query/get-source';
import { LEAD_STATUS_COLORS, Location, Services } from '@/constants/lead-constants';
import { ENTITY, toastMsg } from '@/constants/messages';

type FormValues = z.infer<typeof serviceDetailsSchema>;

const STATUS_OPTIONS = Object.values(LeadStatusTypes).map((value) => ({ value, label: value }));

const parseServiceType = (raw: string | null | undefined): string[] => {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const toDefaults = (lead: ILead): FormValues => ({
  location: lead.location ?? null,
  serviceType: parseServiceType(lead.serviceType),
  sourceId: lead.sourceId ?? null,
  userId: lead.userId ?? null,
  status: lead.status ?? null,
  remarks: lead.remarks ?? null,
  files: (lead.files as FormValues['files']) ?? null,
});

const ServiceDetails = ({ lead }: { lead: ILead }) => {
  const [isEditing, setIsEditing] = useState(false);
  const editLead = useEditLead();
  const { data: sources } = useGetSource();

  const sourceOptions = useMemo(() => sources?.map((s) => ({ label: s.name, value: String(s.id) })) ?? [], [sources]);

  const serviceOptions = useMemo(() => Object.values(Services).map((s) => ({ label: s, value: s })), []);

  const locationOptions = useMemo(() => Object.values(Location).map((l) => ({ label: l, value: l })), []);

  const form = useForm<FormValues>({
    resolver: zodResolver(serviceDetailsSchema) as any,
    defaultValues: toDefaults(lead),
  });
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = form;

  useEffect(() => {
    if (!isEditing) reset(toDefaults(lead));
  }, [lead, isEditing, reset]);

  const handleCancel = () => {
    reset(toDefaults(lead));
    setIsEditing(false);
  };

  const handleSave = handleSubmit((data) => {
    editLead.mutate(buildLeadSectionPayload(lead, data), {
      onSuccess: () => {
        toast.success(toastMsg.updateSuccess(ENTITY.serviceDetails));
        setIsEditing(false);
      },
      onError: (error: any) => {
        toast.error(error?.response?.data?.message || toastMsg.updateError(ENTITY.lead));
      },
    });
  });

  const serviceTypeDisplay = parseServiceType(lead.serviceType).join(', ') || 'N/A';

  return (
    <EditableTitleBox
      title="Service details"
      isEditing={isEditing}
      isSaving={editLead.isPending}
      onEdit={() => setIsEditing(true)}
      onCancel={handleCancel}
      onSave={handleSave}
    >
      {isEditing ? (
        <Form {...form}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-5">
            <FormField
              control={control}
              name="serviceType"
              render={({ field }) => (
                <MultiSelect
                  options={serviceOptions}
                  value={field.value || []}
                  label="Service type"
                  onSelect={(val) => field.onChange(val)}
                  error={errors.serviceType?.message}
                />
              )}
            />
            <FormField
              control={control}
              name="location"
              render={({ field }) => (
                <SelectCommon
                  triggerClassName="w-full"
                  options={locationOptions}
                  value={field.value || undefined}
                  label="Location"
                  onSelect={(val) => field.onChange(val)}
                  error={errors.location?.message}
                />
              )}
            />
            <FormField
              control={control}
              name="sourceId"
              render={({ field }) => (
                <SelectCommon
                  triggerClassName="w-full"
                  options={sourceOptions}
                  value={field.value?.toString()}
                  label="Source"
                  onSelect={(val) => field.onChange(Number(val))}
                  error={errors.sourceId?.message}
                />
              )}
            />
            <FormField
              control={control}
              name="status"
              render={({ field }) => (
                <SelectCommon
                  options={STATUS_OPTIONS}
                  value={field.value || undefined}
                  label="Status"
                  triggerClassName="w-full"
                  onSelect={(val) => field.onChange(val)}
                  error={errors.status?.message}
                />
              )}
            />
          </div>
        </Form>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4">
          <InfoField title="Service type" value={serviceTypeDisplay} />
          <InfoField title="Location" value={lead.location || 'N/A'} />
          <InfoField title="Source" value={lead?.source?.name || 'N/A'} />
          <InfoField
            title="Status"
            value={lead.status || 'N/A'}
            type={lead.status ? 'badge' : undefined}
            badgeColor={lead.status ? LEAD_STATUS_COLORS[lead.status]?.background : undefined}
            badgeTextColor={lead.status ? LEAD_STATUS_COLORS[lead.status]?.text : undefined}
          />
        </div>
      )}
    </EditableTitleBox>
  );
};

export default ServiceDetails;
