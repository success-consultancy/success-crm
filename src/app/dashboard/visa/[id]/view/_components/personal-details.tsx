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

import EditableTitleBox from './editable-title-box';
import { buildVisaSectionPayload } from './visa-section-payload';
import { newVisaServiceSchema } from '@/schema/visa-service/new-visa.schema';
import { IVisaDetail } from '@/types/response-types/visa-response';
import { useEditVisa } from '@/mutations/visa/edit-visa';

const personalSchema = newVisaServiceSchema.pick({
  firstName: true,
  middleName: true,
  lastName: true,
  dob: true,
  email: true,
  phone: true,
  country: true,
  state: true,
  passport: true,
  issueDate: true,
  expiryDate: true,
  location: true,
});

type FormValues = z.infer<typeof personalSchema>;

const toDefaults = (visa: IVisaDetail): FormValues => ({
  firstName: visa.firstName,
  middleName: visa.middleName ?? null,
  lastName: visa.lastName,
  dob: visa.dob ?? null,
  email: visa.email,
  phone: visa.phone,
  country: visa.country ?? null,
  state: visa.state ?? null,
  passport: visa.passport ?? null,
  issueDate: visa.issueDate ?? null,
  expiryDate: visa.expiryDate ?? null,
  location: visa.location ?? null,
});

const getDateValue = (dateString: string | null | undefined): Date | undefined => {
  if (!dateString) return undefined;
  const d = new Date(dateString);
  return isNaN(d.getTime()) ? undefined : d;
};

const PersonalDetails = ({ visa }: { visa: IVisaDetail }) => {
  const [isEditing, setIsEditing] = useState(false);
  const editVisa = useEditVisa();

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
    editVisa.mutate(buildVisaSectionPayload(visa, data), {
      onSuccess: () => {
        toast.success('Personal details updated');
        setIsEditing(false);
      },
      onError: (error: any) => {
        toast.error(error?.response?.data?.message || 'Failed to update visa applicant');
      },
    });
  });

  return (
    <EditableTitleBox
      title="Personal details"
      isEditing={isEditing}
      isSaving={editVisa.isPending}
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
            <TextInput label="Nationality" {...register('country')} error={errors.country?.message} />
            <TextInput label="Address" {...register('state')} error={errors.state?.message} />
            <TextInput label="Passport number" {...register('passport')} error={errors.passport?.message} />
            <div className="space-y-2">
              <Label className="text-b2">Passport issue date</Label>
              <Controller
                name="issueDate"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    side="top"
                    value={getDateValue(field.value)}
                    onChange={handleDateChange('issueDate')}
                    placeholder="DD/MM/YYYY"
                    className="h-12 text-b2 w-full"
                    error={!!errors.issueDate?.message}
                  />
                )}
              />
              <FormErrorMessage message={errors.issueDate?.message} />
            </div>
            <div className="space-y-2">
              <Label className="text-b2">Passport expiry date</Label>
              <Controller
                name="expiryDate"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    side="top"
                    value={getDateValue(field.value)}
                    onChange={handleDateChange('expiryDate')}
                    placeholder="DD/MM/YYYY"
                    className="h-12 text-b2 w-full"
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
          <InfoField title="Address" value={visa.state || visa?.user?.address || '-'} />
          <InfoField title="Passport number" value={visa.passport || '-'} />
          <InfoField
            title="Passport issue date"
            value={visa.issueDate ? new Date(visa.issueDate).toLocaleDateString() : '-'}
          />
          <InfoField
            title="Passport expiry date"
            value={visa.expiryDate ? new Date(visa.expiryDate).toLocaleDateString() : '-'}
          />
          <InfoField title="Location" value={visa.location || '-'} />
        </div>
      )}
    </EditableTitleBox>
  );
};

export default PersonalDetails;
