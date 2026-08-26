'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';

import { InfoField } from '@/components/atoms/info-field';
import { Form, FormField } from '@/components/ui/form';
import { Label } from '@/components/ui/label';
import Input from '@/components/molecules/input';
import { DatePicker } from '@/components/organisms/date-picker';
import { CountryDropdown } from '@/components/organisms/country-dropdown';
import SelectWithCommand from '@/components/molecules/select-with-command';

import EditableTitleBox from './editable-title-box';
import { buildLeadSectionPayload } from './lead-section-payload';
import { passportDetailsSchema } from '@/schema/lead-schema';
import { ILead } from '@/types/response-types/leads-response';
import { useEditLead } from '@/mutations/leads/edit-lead';
import { useGetVisaOptions } from '@/query/get-visa';

type FormValues = z.infer<typeof passportDetailsSchema>;

const toDate = (value: string | null | undefined) => (value ? new Date(value) : undefined);

const toDefaults = (lead: ILead): FormValues => ({
  country: lead.country ?? null,
  passport: (lead.passport ?? null) as FormValues['passport'],
  issueDate: toDate(lead.issueDate) ?? null,
  expiryDate: toDate(lead.expiryDate) ?? null,
  visa: lead.visa ?? null,
  visaExpiry: toDate(lead.visaExpiry) ?? null,
});

const PassportVisaInfo = ({ lead }: { lead: ILead }) => {
  const [isEditing, setIsEditing] = useState(false);
  const editLead = useEditLead();
  const visaOptions = useGetVisaOptions();

  const form = useForm<FormValues>({
    resolver: zodResolver(passportDetailsSchema) as any,
    defaultValues: toDefaults(lead),
  });
  const {
    control,
    handleSubmit,
    reset,
    setValue,
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
        toast.success('Passport & visa info updated');
        setIsEditing(false);
      },
      onError: (error: any) => {
        toast.error(error?.response?.data?.message || 'Failed to update lead');
      },
    });
  });

  return (
    <EditableTitleBox
      title="Passport & visa info"
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
              name="country"
              render={({ field }) => (
                <CountryDropdown
                  label="Country"
                  onChange={(country) => field.onChange(country?.alpha3 || null)}
                  defaultValue={field.value || undefined}
                  placeholder="Select a country"
                  error={errors.country?.message}
                />
              )}
            />
            <FormField
              control={control}
              name="visa"
              render={({ field }) => (
                <SelectWithCommand
                  options={visaOptions}
                  value={field.value ?? undefined}
                  label="Visa"
                  onSelect={(val) => field.onChange(val)}
                  error={errors.visa?.message}
                />
              )}
            />
            <FormField
              control={control}
              name="visaExpiry"
              render={({ field }) => (
                <div className="flex flex-col gap-2">
                  <Label className="text-b3-b font-semibold">Visa expiry date</Label>
                  <DatePicker
                    side="top"
                    value={field.value || undefined}
                    onChange={(date) => setValue('visaExpiry', date ?? null)}
                    placeholder="DD/MM/YYYY"
                    className="h-12 text-b2 w-full"
                    error={!!errors.visaExpiry?.message}
                    disablePastDates
                  />
                </div>
              )}
            />
            <FormField
              control={control}
              name="passport"
              render={({ field }) => (
                <Input
                  type="text"
                  label="Passport number"
                  {...field}
                  value={field.value ?? ''}
                  error={errors.passport?.message}
                  optionalText
                />
              )}
            />
            <FormField
              control={control}
              name="issueDate"
              render={({ field }) => (
                <div className="flex flex-col gap-2">
                  <Label className="text-b3-b font-semibold">Passport issue date</Label>
                  <DatePicker
                    side="top"
                    value={field.value || undefined}
                    onChange={(date) => setValue('issueDate', date ?? null)}
                    placeholder="DD/MM/YYYY"
                    className="h-12 text-b2 w-full"
                    error={!!errors.issueDate?.message}
                    disableFutureDates
                  />
                </div>
              )}
            />
            <FormField
              control={control}
              name="expiryDate"
              render={({ field }) => (
                <div className="flex flex-col gap-2">
                  <Label className="text-b3-b font-semibold">Passport expiry date</Label>
                  <DatePicker
                    side="top"
                    value={field.value || undefined}
                    onChange={(date) => setValue('expiryDate', date ?? null)}
                    placeholder="DD/MM/YYYY"
                    className="h-12 text-b2 w-full"
                    error={!!errors.expiryDate?.message}
                    disablePastDates
                  />
                </div>
              )}
            />
          </div>
        </Form>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4">
          <InfoField title="Country" value={lead.country || 'N/A'} />
          <InfoField title="Visa" value={lead.visa || 'N/A'} />
          <InfoField
            title="Visa expiry date"
            value={lead.visaExpiry ? new Date(lead.visaExpiry).toLocaleDateString() : '-'}
          />
          <InfoField title="Passport number" value={lead.passport || 'N/A'} />
          <InfoField
            title="Issue date"
            value={lead.issueDate ? new Date(lead.issueDate).toLocaleDateString() : '-'}
          />
          <InfoField
            title="Expiry date"
            value={lead.expiryDate ? new Date(lead.expiryDate).toLocaleDateString() : '-'}
          />
        </div>
      )}
    </EditableTitleBox>
  );
};

export default PassportVisaInfo;
