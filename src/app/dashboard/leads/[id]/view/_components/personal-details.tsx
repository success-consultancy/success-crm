'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

import { InfoField } from '@/components/atoms/info-field';
import { Form, FormField } from '@/components/ui/form';
import { Label } from '@/components/ui/label';
import Input from '@/components/molecules/input';
import { DatePicker } from '@/components/organisms/date-picker';
import SelectWithCommand from '@/components/molecules/select-with-command';

import EditableTitleBox from './editable-title-box';
import { buildLeadSectionPayload } from './lead-section-payload';
import { personalDetailsSchema } from '@/schema/lead-schema';
import { ILead } from '@/types/response-types/leads-response';
import { useEditLead } from '@/mutations/leads/edit-lead';
import { useGetOccupations } from '@/query/get-occupations';
import { useMemo } from 'react';

type FormValues = z.infer<typeof personalDetailsSchema>;

const toDefaults = (lead: ILead): FormValues => ({
  firstName: lead.firstName,
  middleName: lead.middleName ?? null,
  lastName: lead.lastName,
  email: lead.email,
  phone: lead.phone,
  dob: lead.dob ?? null,
  address: lead.address ?? null,
  qualification: lead.qualification ?? null,
  occupation: lead.occupation ?? null,
  anzsco: lead.anzsco ?? null,
});

const PersonalDetails = ({ lead }: { lead: ILead }) => {
  const [isEditing, setIsEditing] = useState(false);
  const editLead = useEditLead();
  const { data: occupations } = useGetOccupations();

  const anzscoOptions = useMemo(
    () =>
      occupations?.map((o) => ({
        value: o.code,
        label: `${o.title} - ${o.code}`,
      })) ?? [],
    [occupations],
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(personalDetailsSchema) as any,
    defaultValues: toDefaults(lead),
  });
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = form;

  const occupationValue = watch('occupation');

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
        toast.success('Personal details updated');
        setIsEditing(false);
      },
      onError: (error: any) => {
        toast.error(error?.response?.data?.message || 'Failed to update lead');
      },
    });
  });

  return (
    <EditableTitleBox
      title="Personal details"
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
              name="firstName"
              render={({ field }) => <Input label="First name" {...field} error={errors.firstName?.message} />}
            />
            <FormField
              control={control}
              name="middleName"
              render={({ field }) => (
                <Input
                  label="Middle name"
                  {...field}
                  value={field.value ?? ''}
                  error={errors.middleName?.message}
                  optionalText
                />
              )}
            />
            <FormField
              control={control}
              name="lastName"
              render={({ field }) => <Input label="Last name" {...field} error={errors.lastName?.message} />}
            />
            <FormField
              control={control}
              name="email"
              render={({ field }) => <Input label="Email address" {...field} error={errors.email?.message} />}
            />
            <FormField
              control={control}
              name="phone"
              render={({ field }) => <Input label="Phone number" {...field} error={errors.phone?.message} />}
            />
            <FormField
              control={control}
              name="dob"
              render={({ field }) => (
                <div className="flex flex-col gap-2">
                  <Label className="text-b3-b font-semibold">Date of birth</Label>
                  <DatePicker
                    side="top"
                    value={field.value ? new Date(field.value) : undefined}
                    onChange={(date) => field.onChange(date ? format(date, 'MM/dd/yyyy') : null)}
                    placeholder="MM/DD/YYYY"
                    className="h-12 text-b2 w-full"
                    disableFutureDates
                    error={!!errors.dob?.message}
                  />
                </div>
              )}
            />
            <FormField
              control={control}
              name="address"
              render={({ field }) => (
                <Input
                  label="Address"
                  {...field}
                  value={field.value ?? ''}
                  error={errors.address?.message}
                  optionalText
                />
              )}
            />
            <FormField
              control={control}
              name="anzsco"
              render={({ field }) => (
                <SelectWithCommand
                  options={anzscoOptions}
                  value={field.value || undefined}
                  label="ANZSCO / Occupation"
                  onSelect={(val) => {
                    field.onChange(val);
                    const match = occupations?.find((o) => o.code === val);
                    setValue('occupation', match?.title ?? null, { shouldValidate: false });
                  }}
                  error={errors.anzsco?.message}
                />
              )}
            />
            <div className="flex flex-col gap-1">
              <Label className="text-b3-b font-semibold text-content-disabled">Occupation</Label>
              <div className="h-12 rounded-md border border-input bg-neutral-50 px-3 flex items-center text-b14 text-neutral-dark-grey">
                {occupationValue || 'Auto-filled from ANZSCO'}
              </div>
            </div>
            <FormField
              control={control}
              name="qualification"
              render={({ field }) => (
                <Input
                  label="Qualification"
                  {...field}
                  value={field.value ?? ''}
                  error={errors.qualification?.message}
                  optionalText
                />
              )}
            />
          </div>
        </Form>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4">
          <InfoField title="First name" value={lead.firstName} />
          <InfoField title="Middle name" value={lead.middleName || 'N/A'} />
          <InfoField title="Last name" value={lead.lastName} />
          <InfoField title="Email address" value={lead.email} />
          <InfoField title="Phone number" value={lead.phone || 'N/A'} />
          <InfoField title="Birth date" value={lead.dob ? new Date(lead.dob).toLocaleDateString() : 'N/A'} />
          <InfoField title="Address" value={lead.address || 'N/A'} />
          <InfoField title="Occupation" value={lead.occupation || 'N/A'} />
          <InfoField title="ANZSCO" value={lead.anzsco || 'N/A'} />
          <InfoField title="Qualification" value={lead.qualification || 'N/A'} />
        </div>
      )}
    </EditableTitleBox>
  );
};

export default PersonalDetails;
