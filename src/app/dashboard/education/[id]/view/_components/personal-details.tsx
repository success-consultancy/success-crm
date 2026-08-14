'use client';

import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';

import { Label } from '@/components/ui/label';
import TextInput from '@/components/molecules/text-input';
import { PhoneNumberInput } from '@/components/molecules/phone-number-input';
import { DatePicker } from '@/components/organisms/date-picker';
import FormErrorMessage from '@/components/atoms/form-error-message';
import SelectField from '@/components/organisms/select-field';
import { FormField } from '@/components/ui/form';
import { CountryDropdown } from '@/components/organisms/country-dropdown';

import EditableTitleBox from './editable-title-box';
import { buildEducationSectionPayload } from './education-section-payload';
import { editEducationServiceSchema } from '@/schema/education-service/edit-student.schema';
import { IEducation } from '@/types/response-types/education-response';
import { useEditEducation } from '@/mutations/education/edit-education';

const personalSchema = z.object({
  firstName: z.string().optional(),
  middleName: z.string().optional(),
  lastName: z.string().optional(),
  dob: z.date().optional(),
  email: z.union([z.string().email(), z.literal('')]).optional(),
  phone: z.string().optional(),
  country: z.string().optional(),
  passport: z.string().optional(),
  issueDate: z.date().optional(),
  expiryDate: z.date().optional(),
  location: z.string().optional(),
});

type FormValues = z.infer<typeof personalSchema>;

const toDate = (value: string | null | undefined): Date | undefined =>
  value ? new Date(value) : undefined;

const toDefaults = (education: IEducation): FormValues => ({
  firstName: education.firstName ?? undefined,
  middleName: education.middleName ?? undefined,
  lastName: education.lastName ?? undefined,
  dob: toDate(education.dob),
  email: education.email ?? undefined,
  phone: education.phone ?? undefined,
  country: education.country ?? undefined,
  passport: education.passport != null ? String(education.passport) : undefined,
  issueDate: toDate(education.issueDate),
  expiryDate: toDate(education.expiryDate),
  location: education.location ?? undefined,
});

const PersonalDetails = ({ education }: { education: IEducation }) => {
  const [isEditing, setIsEditing] = useState(false);
  const editEducation = useEditEducation();

  const form = useForm<FormValues>({
    resolver: zodResolver(personalSchema) as any,
    defaultValues: toDefaults(education),
  });
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = form;

  useEffect(() => {
    if (!isEditing) reset(toDefaults(education));
  }, [education, isEditing, reset]);

  const handleCancel = () => {
    reset(toDefaults(education));
    setIsEditing(false);
  };

  const handleSave = handleSubmit((data) => {
    editEducation.mutate(buildEducationSectionPayload(education, data), {
      onSuccess: () => {
        toast.success('Personal details updated');
        setIsEditing(false);
      },
      onError: (error: any) => {
        toast.error(error?.response?.data?.message || 'Failed to update student');
      },
    });
  });

  return (
    <EditableTitleBox
      title="Personal details"
      isEditing={isEditing}
      isSaving={editEducation.isPending}
      onEdit={() => setIsEditing(true)}
      onCancel={handleCancel}
      onSave={handleSave}
    >
      {isEditing ? (
        <form onSubmit={handleSave}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <TextInput label="First Name" {...register('firstName')} error={errors.firstName?.message} />
            <TextInput label="Middle Name" {...register('middleName')} error={errors.middleName?.message} />
            <TextInput label="Last Name" {...register('lastName')} error={errors.lastName?.message} />
            <div className="space-y-2">
              <Controller
                name="dob"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    label="Date of Birth"
                    side="top"
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Pick a date"
                    className="h-12 text-b2 w-full"
                    disableFutureDates
                    error={!!errors.dob?.message}
                  />
                )}
              />
              <FormErrorMessage message={errors.dob?.message} />
            </div>
            <TextInput type="email" label="Email" {...register('email')} error={errors.email?.message} />
            <FormField
              control={control}
              name="phone"
              render={({ field }) => (
                <PhoneNumberInput
                  label="Phone number"
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.phone?.message}
                />
              )}
            />
            <FormField
              control={control}
              name="country"
              render={({ field }) => (
                <div className="space-y-2">
                  <Label className="text-b2">Country</Label>
                  <CountryDropdown
                    onChange={(country) => field.onChange(country?.alpha3 || undefined)}
                    defaultValue={field.value || undefined}
                    placeholder="Select a country"
                  />
                  {errors.country?.message && <FormErrorMessage message={errors.country.message} />}
                </div>
              )}
            />
            <TextInput
              label="Passport Number"
              {...register('passport')}
              error={errors.passport?.message}
            />
            <div className="space-y-2">
              <Controller
                name="issueDate"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    label="Passport Issue Date"
                    side="top"
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Pick a date"
                    className="h-12 text-b2 w-full"
                    disableFutureDates
                    error={!!errors.issueDate?.message}
                  />
                )}
              />
              <FormErrorMessage message={errors.issueDate?.message} />
            </div>
            <div className="space-y-2">
              <Controller
                name="expiryDate"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    label="Passport Expiry Date"
                    side="top"
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Pick a date"
                    className="h-12 text-b2 w-full"
                    disablePastDates
                    error={!!errors.expiryDate?.message}
                  />
                )}
              />
              <FormErrorMessage message={errors.expiryDate?.message} />
            </div>
            <SelectField
              control={control}
              name="location"
              label="Location"
              options={[
                { label: 'Onshore', value: 'Onshore' },
                { label: 'Offshore', value: 'Offshore' },
              ]}
              placeholder="Select location"
            />
          </div>
        </form>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4">
          <ReadField title="First name" value={education.firstName} />
          <ReadField title="Middle name" value={education.middleName || '-'} />
          <ReadField title="Last name" value={education.lastName} />
          <ReadField title="Email address" value={education.email} />
          <ReadField title="Phone number" value={education.phone || '-'} />
          <ReadField
            title="Birth date"
            value={education.dob ? new Date(education.dob).toLocaleDateString() : '-'}
          />
          <ReadField title="Nationality" value={education.country || '-'} />
          <ReadField title="Address" value={education.address || '-'} />
          <ReadField title="Passport number" value={education.passport?.toString() || '-'} />
          <ReadField
            title="Passport Issue date"
            value={education.issueDate ? new Date(education.issueDate).toLocaleDateString() : '-'}
          />
          <ReadField
            title="Passport Expiry date"
            value={education.expiryDate ? new Date(education.expiryDate).toLocaleDateString() : '-'}
          />
        </div>
      )}
    </EditableTitleBox>
  );
};

const ReadField = ({ title, value }: { title: string; value: string | number }) => (
  <div className="flex flex-col">
    <span className="text-b3-b">{title}</span>
    <span className="text-neutral-dark-grey text-base font-medium">{value || '-'}</span>
  </div>
);

export default PersonalDetails;
