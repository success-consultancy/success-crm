'use client';

import { useEffect, useMemo, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format, parse } from 'date-fns';
import toast from 'react-hot-toast';

import { InfoField } from '@/components/atoms/info-field';
import { StatusInfoField } from '@/components/atoms/status-info-field';
import { Label } from '@/components/ui/label';
import TextInput from '@/components/molecules/text-input';
import { DatePicker } from '@/components/organisms/date-picker';
import FormErrorMessage from '@/components/atoms/form-error-message';
import SelectField from '@/components/organisms/select-field';
import SelectWithCommand from '@/components/molecules/select-with-command';
import { FormField } from '@/components/ui/form';

import EditableTitleBox from './editable-title-box';
import { buildSkillSectionPayload } from './skill-section-payload';
import skillAssessmentFormSchema, { SKILL_DEPENDENT_FIELDS } from '@/schema/skill-assessment-schema';
import { isBlankValue, withDependentFields } from '@/schema/dependent-fields';
import { useDependentFields } from '@/hooks/use-dependent-fields';
import { ISkillAssessment, SkillAssessmentStatusTypes } from '@/types/response-types/skill-assessment-response';
import { useEditSkillAssessment } from '@/mutations/skill-assessment/edit-skill-assessment';
import { useGetOccupations } from '@/query/get-occupations';
import { useGetVisaOptions } from '@/query/get-visa';

const visaServiceSchema = withDependentFields(
  skillAssessmentFormSchema.pick({
    currentVisa: true,
    visaExpiry: true,
    dueDate: true,
    anzsco: true,
    occupation: true,
    skillAssessmentBody: true,
    otherSkillAssessmentBody: true,
    submittedDate: true,
    decisionDate: true,
    status: true,
    csaStatus: true,
  }),
  SKILL_DEPENDENT_FIELDS,
);

type FormValues = z.infer<typeof visaServiceSchema>;

const formatStored = (value: string | null | undefined): string | null => {
  if (!value) return null;
  if (value.includes('/')) return value;
  const d = new Date(value);
  return isNaN(d.getTime()) ? null : format(d, 'dd/MM/yyyy');
};

const toDefaults = (skill: ISkillAssessment): FormValues => ({
  currentVisa: skill.currentVisa ?? null,
  visaExpiry: formatStored(skill.visaExpiry),
  dueDate: formatStored(skill.dueDate),
  anzsco: skill.anzsco ?? null,
  occupation: skill.occupation ?? null,
  skillAssessmentBody: skill.skillAssessmentBody ?? null,
  otherSkillAssessmentBody: skill.otherSkillAssessmentBody ?? null,
  submittedDate: formatStored(skill.submittedDate),
  decisionDate: formatStored(skill.decisionDate),
  status: skill.status ?? null,
  csaStatus: skill.csaStatus ?? null,
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

const VisaServiceDetails = ({ skillAssessment }: { skillAssessment: ISkillAssessment }) => {
  const [isEditing, setIsEditing] = useState(false);
  const editSkill = useEditSkillAssessment();
  const { data: occupations } = useGetOccupations();
  const visaOptions = useGetVisaOptions();

  const statusOptions = Object.values(SkillAssessmentStatusTypes).map((value) => ({
    label: value,
    value,
  }));

  const anzscoOptions = useMemo(
    () =>
      occupations?.map((o) => ({
        value: o.code,
        label: `${o.title} - ${o.code}`,
      })) ?? [],
    [occupations],
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(visaServiceSchema) as any,
    defaultValues: toDefaults(skillAssessment),
  });
  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = form;

  useDependentFields(form, SKILL_DEPENDENT_FIELDS);

  const hasCurrentVisa = !isBlankValue(watch('currentVisa'));

  const selectedBody = watch('skillAssessmentBody');

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
        toast.success('Visa & service details updated');
        setIsEditing(false);
      },
      onError: (error: any) => {
        toast.error(error?.response?.data?.message || 'Failed to update skill assessment');
      },
    });
  });

  const formatDateDisplay = (s: string | null | undefined) => {
    if (!s) return 'N/A';
    const d = getDateValue(s);
    return d ? d.toLocaleDateString('en-GB') : 'N/A';
  };

  const assessmentBodyDisplay =
    skillAssessment.skillAssessmentBody === 'Other'
      ? skillAssessment.otherSkillAssessmentBody
      : skillAssessment.skillAssessmentBody;

  const occupationDisplay =
    skillAssessment.anzsco && skillAssessment.occupation
      ? `${skillAssessment.anzsco} - ${skillAssessment.occupation}`
      : skillAssessment.occupation || skillAssessment.anzsco || '-';

  return (
    <EditableTitleBox
      title="Visa & service details"
      isEditing={isEditing}
      isSaving={editSkill.isPending}
      onEdit={() => setIsEditing(true)}
      onCancel={handleCancel}
      onSave={handleSave}
    >
      {isEditing ? (
        <form onSubmit={handleSave}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <FormField
              control={control}
              name="currentVisa"
              render={({ field }) => (
                <SelectWithCommand
                  options={visaOptions}
                  value={field.value ?? undefined}
                  label="Current visa"
                  placeholder="Select current visa type"
                  onSelect={(val) => field.onChange(val)}
                  error={errors.currentVisa?.message}
                />
              )}
            />
            <div className="space-y-2">
              <Label className="text-b2">Visa expiry date</Label>
              <Controller
                name="visaExpiry"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    side="top"
                    value={getDateValue(field.value)}
                    onChange={handleDateChange('visaExpiry')}
                    placeholder="DD / MM / YYYY"
                    className="h-12 text-b2 w-full"
                    error={!!errors.visaExpiry?.message}
                    disabled={!hasCurrentVisa}
                    disablePastDates
                  />
                )}
              />
              <FormErrorMessage message={errors.visaExpiry?.message} />
            </div>
            <div className="space-y-2">
              <Label className="text-b2">Due date</Label>
              <Controller
                name="dueDate"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    side="top"
                    value={getDateValue(field.value)}
                    onChange={handleDateChange('dueDate')}
                    placeholder="DD / MM / YYYY"
                    className="h-12 text-b2 w-full"
                    error={!!errors.dueDate?.message}
                    disablePastDates
                  />
                )}
              />
              <FormErrorMessage message={errors.dueDate?.message} />
            </div>
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
            <SelectField
              control={control}
              name="skillAssessmentBody"
              label="Assessment authority"
              options={[
                { label: 'ACS', value: 'ACS' },
                { label: 'AITSL', value: 'AITSL' },
                { label: 'ANMAC', value: 'ANMAC' },
                { label: 'AACA', value: 'AACA' },
                { label: 'AASW', value: 'AASW' },
                { label: 'AIQS', value: 'AIQS' },
                { label: 'APEA', value: 'APEA' },
                { label: 'CPAA', value: 'CPAA' },
                { label: 'CAANZ', value: 'CAANZ' },
                { label: 'Engineers Australia', value: 'Engineers Australia' },
                { label: 'IML', value: 'IML' },
                { label: 'Other', value: 'Other' },
              ]}
              placeholder="Select assessment authority"
            />
            {selectedBody === 'Other' && (
              <TextInput
                label="Other Assessment Authority"
                {...register('otherSkillAssessmentBody')}
                error={errors.otherSkillAssessmentBody?.message}
              />
            )}
            <div className="space-y-2">
              <Label className="text-b2">Date submitted</Label>
              <Controller
                name="submittedDate"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    side="top"
                    value={getDateValue(field.value)}
                    onChange={handleDateChange('submittedDate')}
                    placeholder="DD / MM / YYYY"
                    className="h-12 text-b2 w-full"
                    error={!!errors.submittedDate?.message}
                    disableFutureDates
                  />
                )}
              />
              <FormErrorMessage message={errors.submittedDate?.message} />
            </div>
            <div className="space-y-2">
              <Label className="text-b2">Decision date</Label>
              <Controller
                name="decisionDate"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    side="top"
                    value={getDateValue(field.value)}
                    onChange={handleDateChange('decisionDate')}
                    placeholder="DD / MM / YYYY"
                    className="h-12 text-b2 w-full"
                    error={!!errors.decisionDate?.message}
                    disablePastDates
                  />
                )}
              />
              <FormErrorMessage message={errors.decisionDate?.message} />
            </div>
            <SelectField
              control={control}
              name="status"
              label="Status"
              options={statusOptions}
              placeholder="Select a status"
            />
            <SelectField
              control={control}
              name="csaStatus"
              label="SBS/TAS status"
              options={statusOptions}
              placeholder="Select a status"
            />
          </div>
        </form>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <InfoField title="Current visa" value={skillAssessment.currentVisa || '-'} />
          <InfoField title="Visa expiry date" value={formatDateDisplay(skillAssessment.visaExpiry)} />
          <InfoField title="Due date" value={formatDateDisplay(skillAssessment.dueDate)} />
          <InfoField title="Occupation" value={occupationDisplay} />
          <InfoField title="Assessment authority" value={assessmentBodyDisplay || '-'} />
          <InfoField title="Date submitted" value={formatDateDisplay(skillAssessment.submittedDate)} />
          <InfoField title="Decision date" value={formatDateDisplay(skillAssessment.decisionDate)} />
          <StatusInfoField title="SBS/TAS status" status={skillAssessment.csaStatus} />
          <StatusInfoField title="Status" status={skillAssessment.status} />
        </div>
      )}
    </EditableTitleBox>
  );
};

export default VisaServiceDetails;
