'use client';

import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format, parse } from 'date-fns';
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
import { buildSkillSectionPayload } from './skill-section-payload';
import skillAssessmentFormSchema from '@/schema/skill-assessment-schema';
import { ISkillAssessment } from '@/types/response-types/skill-assessment-response';
import { useEditSkillAssessment } from '@/mutations/skill-assessment/edit-skill-assessment';

const personalSchema = skillAssessmentFormSchema.pick({
  firstName: true,
  middleName: true,
  lastName: true,
  dob: true,
  email: true,
  phone: true,
  country: true,
  passport: true,
  issueDate: true,
  expiryDate: true,
  location: true,
});

type FormValues = z.infer<typeof personalSchema>;

const formatStored = (value: string | null | undefined): string | null => {
  if (!value) return null;
  if (value.includes('/')) return value;
  const d = new Date(value);
  return isNaN(d.getTime()) ? null : format(d, 'dd/MM/yyyy');
};

const toDefaults = (skill: ISkillAssessment): FormValues => ({
  firstName: skill.firstName,
  middleName: skill.middleName ?? null,
  lastName: skill.lastName,
  dob: formatStored(skill.dob),
  email: skill.email,
  phone: skill.phone,
  country: skill.country ?? null,
  passport: skill.passport ?? null,
  issueDate: formatStored(skill.issueDate),
  expiryDate: formatStored(skill.expiryDate),
  location: skill.location ?? null,
});

const getDateValue = (s: string | null | undefined): Date | undefined => {
  if (!s) return undefined;
  if (s.includes('/')) {
    const d = parse(s, 'dd/MM/yyyy', new Date());
    return isNaN(d.getTime()) ? undefined : d;
  }
  const d = new Date(s);
  return isNaN(d.getTime()) ? undefined : d;
};

const PersonalDetails = ({ skillAssessment }: { skillAssessment: ISkillAssessment }) => {
  const [isEditing, setIsEditing] = useState(false);
  const editSkill = useEditSkillAssessment();

  const form = useForm<FormValues>({
    resolver: zodResolver(personalSchema) as any,
    defaultValues: toDefaults(skillAssessment),
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
    if (!isEditing) reset(toDefaults(skillAssessment));
  }, [skillAssessment, isEditing, reset]);

  const handleDateChange = (fieldName: keyof FormValues) => (date: Date | undefined) => {
    setValue(fieldName, (date ? format(date, 'dd/MM/yyyy') : '') as any, { shouldValidate: true });
  };

  const handleCancel = () => {
    reset(toDefaults(skillAssessment));
    setIsEditing(false);
  };

  const handleSave = handleSubmit((data) => {
    editSkill.mutate(buildSkillSectionPayload(skillAssessment, data), {
      onSuccess: () => {
        toast.success('Personal details updated');
        setIsEditing(false);
      },
      onError: (error: any) => {
        toast.error(error?.response?.data?.message || 'Failed to update skill assessment');
      },
    });
  });

  const formatDateDisplay = (s: string | null | undefined) => {
    if (!s) return '-';
    const d = getDateValue(s);
    return d ? d.toLocaleDateString('en-GB') : '-';
  };

  return (
    <EditableTitleBox
      title="Personal details"
      isEditing={isEditing}
      isSaving={editSkill.isPending}
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
                    placeholder="DD / MM / YYYY"
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
                  <Label className="text-b2">Nationality</Label>
                  <CountryDropdown
                    onChange={(country) => field.onChange(country?.alpha3 || null)}
                    defaultValue={field.value || undefined}
                    placeholder="Select a country"
                  />
                  {errors.country?.message && <FormErrorMessage message={errors.country.message} />}
                </div>
              )}
            />
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
                    placeholder="DD / MM / YYYY"
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
                    placeholder="DD / MM / YYYY"
                    className="h-12 text-b2 w-full"
                    error={!!errors.expiryDate?.message}
                    disablePastDates
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
          <InfoField title="First name" value={skillAssessment.firstName} />
          <InfoField title="Middle name" value={skillAssessment.middleName || 'N/A'} />
          <InfoField title="Last name" value={skillAssessment.lastName} />
          <InfoField title="Date of birth" value={formatDateDisplay(skillAssessment.dob)} />
          <InfoField title="Email address" value={skillAssessment.email} />
          <InfoField title="Phone number" value={skillAssessment.phone || '-'} />
          <InfoField title="Nationality" value={skillAssessment.country || '-'} />
          <InfoField title="Address" value="-" />
          <InfoField title="Passport number" value={skillAssessment.passport || '-'} />
          <InfoField title="Passport issue date" value={formatDateDisplay(skillAssessment.issueDate)} />
          <InfoField title="Passport expiry date" value={formatDateDisplay(skillAssessment.expiryDate)} />
          <InfoField title="Location" value={skillAssessment.location || '-'} />
        </div>
      )}
    </EditableTitleBox>
  );
};

export default PersonalDetails;
