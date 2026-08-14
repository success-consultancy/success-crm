'use client';

import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

import { InfoField } from '@/components/atoms/info-field';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import TextInput from '@/components/molecules/text-input';
import { PhoneNumberInput } from '@/components/molecules/phone-number-input';
import { DatePicker } from '@/components/organisms/date-picker';
import FormErrorMessage from '@/components/atoms/form-error-message';
import SelectField from '@/components/organisms/select-field';
import { FormField } from '@/components/ui/form';
import { CountryDropdown } from '@/components/organisms/country-dropdown';

import EditableTitleBox from './editable-title-box';
import { buildTribunalSectionPayload } from './tribunal-section-payload';
import tribunalReviewFormSchema from '@/schema/tribunal-review';
import { ITribunalReview } from '@/types/response-types/tribunal-review-response';
import { useUpdateTribunalReview } from '@/mutations/tribunal-review/add-tribunal-review';

const personalSchema = tribunalReviewFormSchema.pick({
  firstName: true,
  middleName: true,
  lastName: true,
  dob: true,
  email: true,
  phone: true,
  country: true,
  address: true,
  passport: true,
  passportIssueDate: true,
  passportExpiryDate: true,
  location: true,
});

type FormValues = z.infer<typeof personalSchema>;

const toDefaults = (visa: ITribunalReview): FormValues => ({
  firstName: visa.firstName,
  middleName: visa.middleName ?? null,
  lastName: visa.lastName,
  dob: visa.dob ?? null,
  email: visa.email,
  phone: visa.phone,
  country: visa.country ?? null,
  address: visa.address ?? null,
  passport: visa.passport ?? null,
  passportIssueDate: visa.passportIssueDate ?? null,
  passportExpiryDate: visa.passportExpiryDate ?? null,
  location: visa.location ?? null,
});

const getDateValue = (dateString: string | null | undefined): Date | undefined => {
  if (!dateString) return undefined;
  const d = new Date(dateString);
  return isNaN(d.getTime()) ? undefined : d;
};

const PersonalDetails = ({ visa }: { visa: ITribunalReview }) => {
  const [isEditing, setIsEditing] = useState(false);
  const editTribunal = useUpdateTribunalReview();

  const form = useForm<FormValues>({
    resolver: zodResolver(personalSchema) as any,
    defaultValues: toDefaults(visa),
  });
  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = form;

  useEffect(() => {
    if (!isEditing) reset(toDefaults(visa));
  }, [visa, isEditing, reset]);

  const handleDateChange = (fieldName: keyof FormValues) => (date: Date | undefined) => {
    setValue(fieldName, (date ? format(date, 'yyyy-MM-dd') : '') as any, { shouldValidate: true });
  };

  const handleCancel = () => {
    reset(toDefaults(visa));
    setIsEditing(false);
  };

  const handleSave = handleSubmit((data) => {
    editTribunal.mutate(buildTribunalSectionPayload(visa, data), {
      onSuccess: () => {
        toast.success('Personal details updated');
        setIsEditing(false);
      },
      onError: (error: any) => {
        toast.error(error?.response?.data?.message || 'Failed to update tribunal review');
      },
    });
  });

  return (
    <EditableTitleBox
      title="Personal details"
      isEditing={isEditing}
      isSaving={editTribunal.isPending}
      onEdit={() => setIsEditing(true)}
      onCancel={handleCancel}
      onSave={handleSave}
    >
      {isEditing ? (
        <form onSubmit={handleSave}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <TextInput label="First name" {...register('firstName')} error={errors.firstName?.message} />
            <TextInput
              label="Middle name (optional)"
              {...register('middleName')}
              error={errors.middleName?.message}
            />
            <TextInput label="Last name" {...register('lastName')} error={errors.lastName?.message} />
            <div className="space-y-2">
              <Label className="text-b2">Date of birth</Label>
              <Controller
                name="dob"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    side="top"
                    value={getDateValue(field.value)}
                    onChange={handleDateChange('dob')}
                    placeholder="DD/MM/YYYY"
                    className={cn('h-12 text-b2 w-full')}
                    error={!!errors.dob?.message}
                    disableFutureDates
                  />
                )}
              />
              <FormErrorMessage message={errors.dob?.message} />
            </div>
            <TextInput type="email" label="Email address" {...register('email')} error={errors.email?.message} />
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
                    onChange={(country) => field.onChange(country?.alpha3 || null)}
                    defaultValue={field.value || undefined}
                    placeholder="Select a country"
                  />
                  {errors.country?.message && <FormErrorMessage message={errors.country.message} />}
                </div>
              )}
            />
            <TextInput label="Address" {...register('address')} error={errors.address?.message} />
            <TextInput label="Passport number" {...register('passport')} error={errors.passport?.message} />
            <div className="space-y-2">
              <Label className="text-b2">Passport issue date</Label>
              <Controller
                name="passportIssueDate"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    side="top"
                    value={getDateValue(field.value)}
                    onChange={handleDateChange('passportIssueDate')}
                    placeholder="DD/MM/YYYY"
                    className="h-12 text-b2 w-full"
                    error={!!errors.passportIssueDate?.message}
                  />
                )}
              />
              <FormErrorMessage message={errors.passportIssueDate?.message} />
            </div>
            <div className="space-y-2">
              <Label className="text-b2">Passport expiry date</Label>
              <Controller
                name="passportExpiryDate"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    side="top"
                    value={getDateValue(field.value)}
                    onChange={handleDateChange('passportExpiryDate')}
                    placeholder="DD/MM/YYYY"
                    className="h-12 text-b2 w-full"
                    error={!!errors.passportExpiryDate?.message}
                    disablePastDates
                  />
                )}
              />
              <FormErrorMessage message={errors.passportExpiryDate?.message} />
            </div>
            <SelectField
              control={control}
              name="location"
              label="Location"
              options={[
                { label: 'Onshore', value: 'Onshore' },
                { label: 'Offshore', value: 'Offshore' },
              ]}
              placeholder="Select your location type"
            />
          </div>
        </form>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <InfoField title="First name" value={visa.firstName} />
          <InfoField title="Middle name" value={visa.middleName || 'N/A'} />
          <InfoField title="Last name" value={visa.lastName} />
          <InfoField title="Date of birth" value={visa.dob ? new Date(visa.dob).toLocaleDateString() : '-'} />
          <InfoField title="Email address" value={visa.email} />
          <InfoField title="Phone number" value={visa.phone || '-'} />
          <InfoField title="Nationality" value={visa.country || '-'} />
          <InfoField title="Address" value={visa.address || visa?.user?.address || '-'} />
          <InfoField title="Passport number" value={visa.passport || '-'} />
          <InfoField
            title="Passport issue date"
            value={visa.passportIssueDate ? new Date(visa.passportIssueDate).toLocaleDateString() : '-'}
          />
          <InfoField
            title="Passport expiry date"
            value={visa.passportExpiryDate ? new Date(visa.passportExpiryDate).toLocaleDateString() : '-'}
          />
          <InfoField title="Location" value={visa.location || '-'} />
        </div>
      )}
    </EditableTitleBox>
  );
};

export default PersonalDetails;
