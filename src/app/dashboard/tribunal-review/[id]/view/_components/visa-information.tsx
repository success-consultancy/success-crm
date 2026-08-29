'use client';

import { useEffect, useMemo, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

import { InfoField } from '@/components/atoms/info-field';
import { Label } from '@/components/ui/label';
import TextInput from '@/components/molecules/text-input';
import { DatePicker } from '@/components/organisms/date-picker';
import FormErrorMessage from '@/components/atoms/form-error-message';
import SelectField from '@/components/organisms/select-field';
import SelectWithCommand from '@/components/molecules/select-with-command';
import { FormField } from '@/components/ui/form';

import EditableTitleBox from './editable-title-box';
import { buildTribunalSectionPayload } from './tribunal-section-payload';
import tribunalReviewFormSchema, { TRIBUNAL_DEPENDENT_FIELDS } from '@/schema/tribunal-review';
import { isBlankValue, withDependentFields } from '@/schema/dependent-fields';
import { useDependentFields } from '@/hooks/use-dependent-fields';
import { ITribunalReview, TribunalStatusTypes } from '@/types/response-types/tribunal-review-response';
import { useUpdateTribunalReview } from '@/mutations/tribunal-review/add-tribunal-review';
import { useGetOccupations } from '@/query/get-occupations';
import { useGetVisaOptions } from '@/query/get-visa';

const visaInfoSchema = withDependentFields(
  tribunalReviewFormSchema.pick({
    currentVisa: true,
    visaExpiry: true,
    dueDate: true,
    proposedVisa: true,
    visaStream: true,
    anzsco: true,
    occupation: true,
    sponsorName: true,
    sponsorEmail: true,
    sponsorPhone: true,
    sbsStatus: true,
    sbsSubmissionDate: true,
    sbsDecisionDate: true,
    nominationStatus: true,
    nominationSubmittedDate: true,
    nominationDecisionDate: true,
    visaStatus: true,
    visaSubmittedDate: true,
    visaDecisionDate: true,
  }),
  TRIBUNAL_DEPENDENT_FIELDS,
);

type FormValues = z.infer<typeof visaInfoSchema>;

const toDefaults = (visa: ITribunalReview): FormValues => ({
  currentVisa: visa.currentVisa ?? null,
  visaExpiry: visa.visaExpiry ?? null,
  dueDate: visa.dueDate ?? null,
  proposedVisa: visa.proposedVisa ?? null,
  visaStream: visa.visaStream ?? null,
  anzsco: visa.anzsco ?? null,
  occupation: visa.occupation ?? null,
  sponsorName: visa.sponsorName ?? null,
  sponsorEmail: visa.sponsorEmail ?? '',
  sponsorPhone: visa.sponsorPhone ?? '',
  sbsStatus: visa.sbsStatus ?? null,
  sbsSubmissionDate: visa.sbsSubmissionDate ?? null,
  sbsDecisionDate: visa.sbsDecisionDate ?? null,
  nominationStatus: visa.nominationStatus ?? null,
  nominationSubmittedDate: visa.nominationSubmittedDate ?? null,
  nominationDecisionDate: visa.nominationDecisionDate ?? null,
  visaStatus: visa.visaStatus ?? null,
  visaSubmittedDate: visa.visaSubmittedDate ?? null,
  visaDecisionDate: visa.visaDecisionDate ?? null,
});

const getDateValue = (dateString: string | null | undefined): Date | undefined => {
  if (!dateString) return undefined;
  const d = new Date(dateString);
  return isNaN(d.getTime()) ? undefined : d;
};

const fmtDate = (s: string | null | undefined) => (s ? new Date(s).toLocaleDateString() : 'N/A');

const VisaInformation = ({ visa }: { visa: ITribunalReview }) => {
  const [isEditing, setIsEditing] = useState(false);
  const editTribunal = useUpdateTribunalReview();
  const { data: occupations } = useGetOccupations();
  const visaOptions = useGetVisaOptions();

  const statusOptions = Object.values(TribunalStatusTypes).map((value) => ({ label: value, value }));

  const anzscoOptions = useMemo(
    () =>
      occupations?.map((o) => ({
        value: o.code,
        label: `${o.title} - ${o.code}`,
      })) ?? [],
    [occupations],
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(visaInfoSchema) as any,
    defaultValues: toDefaults(visa),
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

  useDependentFields(form, TRIBUNAL_DEPENDENT_FIELDS);

  const hasCurrentVisa = !isBlankValue(watch('currentVisa'));
  const hasSbsStatus = !isBlankValue(watch('sbsStatus'));
  const hasNominationStatus = !isBlankValue(watch('nominationStatus'));
  const hasVisaStatus = !isBlankValue(watch('visaStatus'));

  const occupationValue = watch('occupation');

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
        toast.success('Visa information updated');
        setIsEditing(false);
      },
      onError: (error: any) => {
        toast.error(error?.response?.data?.message || 'Failed to update tribunal review');
      },
    });
  });

  return (
    <EditableTitleBox
      title="Visa information"
      isEditing={isEditing}
      isSaving={editTribunal.isPending}
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
                    placeholder="DD/MM/YYYY"
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
                    placeholder="DD/MM/YYYY"
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
              name="proposedVisa"
              render={({ field }) => (
                <SelectWithCommand
                  options={visaOptions}
                  value={field.value ?? undefined}
                  label="Proposed visa"
                  placeholder="Select proposed visa type"
                  onSelect={(val) => field.onChange(val)}
                  error={errors.proposedVisa?.message}
                />
              )}
            />
            <SelectField
              control={control}
              name="visaStream"
              label="Visa Stream"
              options={[
                { label: 'Employer sponsored', value: 'Employer sponsored' },
                { label: 'Skilled migration', value: 'Skilled migration' },
                { label: 'Family sponsored', value: 'Family sponsored' },
                { label: 'Other', value: 'Other' },
              ]}
              placeholder="Select a stream"
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
              <Label className="font-medium text-content-disabled">Occupation</Label>
              <div className="h-10 rounded-md border border-input bg-neutral-50 px-3 flex items-center text-b14 text-neutral-dark-grey mt-1">
                {occupationValue || 'Auto-filled from ANZSCO'}
              </div>
            </div>
            <TextInput label="Sponsor name" {...register('sponsorName')} error={errors.sponsorName?.message} />
            <TextInput
              type="email"
              label="Sponsor email"
              {...register('sponsorEmail')}
              error={errors.sponsorEmail?.message}
            />
            <TextInput label="Sponsor phone" {...register('sponsorPhone')} error={errors.sponsorPhone?.message} />
            <SelectField
              control={control}
              name="sbsStatus"
              label="SBS/TAS status"
              options={statusOptions}
              placeholder="Select a status"
            />
            <div className="space-y-2">
              <Label className="text-b2">Date submitted</Label>
              <Controller
                name="sbsSubmissionDate"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    side="top"
                    value={getDateValue(field.value)}
                    onChange={handleDateChange('sbsSubmissionDate')}
                    placeholder="DD/MM/YYYY"
                    className="h-12 text-b2 w-full"
                    error={!!errors.sbsSubmissionDate?.message}
                    disabled={!hasSbsStatus}
                    disableFutureDates
                  />
                )}
              />
              <FormErrorMessage message={errors.sbsSubmissionDate?.message} />
            </div>
            <div className="space-y-2">
              <Label className="text-b2">Decision date</Label>
              <Controller
                name="sbsDecisionDate"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    side="top"
                    value={getDateValue(field.value)}
                    onChange={handleDateChange('sbsDecisionDate')}
                    placeholder="DD/MM/YYYY"
                    className="h-12 text-b2 w-full"
                    error={!!errors.sbsDecisionDate?.message}
                    disabled={!hasSbsStatus}
                    disablePastDates
                  />
                )}
              />
              <FormErrorMessage message={errors.sbsDecisionDate?.message} />
            </div>
            <SelectField
              control={control}
              name="nominationStatus"
              label="Nomination status"
              options={statusOptions}
              placeholder="Select a status"
            />
            <div className="space-y-2">
              <Label className="text-b2">Nomination date submitted</Label>
              <Controller
                name="nominationSubmittedDate"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    side="top"
                    value={getDateValue(field.value)}
                    onChange={handleDateChange('nominationSubmittedDate')}
                    placeholder="DD/MM/YYYY"
                    className="h-12 text-b2 w-full"
                    error={!!errors.nominationSubmittedDate?.message}
                    disabled={!hasNominationStatus}
                    disableFutureDates
                  />
                )}
              />
              <FormErrorMessage message={errors.nominationSubmittedDate?.message} />
            </div>
            <div className="space-y-2">
              <Label className="text-b2">Nomination decision date</Label>
              <Controller
                name="nominationDecisionDate"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    side="top"
                    value={getDateValue(field.value)}
                    onChange={handleDateChange('nominationDecisionDate')}
                    placeholder="DD/MM/YYYY"
                    className="h-12 text-b2 w-full"
                    error={!!errors.nominationDecisionDate?.message}
                    disabled={!hasNominationStatus}
                    disablePastDates
                  />
                )}
              />
              <FormErrorMessage message={errors.nominationDecisionDate?.message} />
            </div>
            <SelectField
              control={control}
              name="visaStatus"
              label="Visa status"
              options={statusOptions}
              placeholder="Select a status"
            />
            <div className="space-y-2">
              <Label className="text-b2">Visa date submitted</Label>
              <Controller
                name="visaSubmittedDate"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    side="top"
                    value={getDateValue(field.value)}
                    onChange={handleDateChange('visaSubmittedDate')}
                    placeholder="DD/MM/YYYY"
                    className="h-12 text-b2 w-full"
                    error={!!errors.visaSubmittedDate?.message}
                    disabled={!hasVisaStatus}
                    disableFutureDates
                  />
                )}
              />
              <FormErrorMessage message={errors.visaSubmittedDate?.message} />
            </div>
            <div className="space-y-2">
              <Label className="text-b2">Visa decision date</Label>
              <Controller
                name="visaDecisionDate"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    side="top"
                    value={getDateValue(field.value)}
                    onChange={handleDateChange('visaDecisionDate')}
                    placeholder="DD/MM/YYYY"
                    className="h-12 text-b2 w-full"
                    error={!!errors.visaDecisionDate?.message}
                    disabled={!hasVisaStatus}
                    disablePastDates
                  />
                )}
              />
              <FormErrorMessage message={errors.visaDecisionDate?.message} />
            </div>
          </div>
        </form>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <InfoField title="Current visa" value={visa.currentVisa || '-'} />
          <InfoField title="Visa expiry date" value={fmtDate(visa.visaExpiry)} />
          <InfoField title="Visa due date" value={fmtDate(visa.dueDate)} />
          <InfoField title="Proposed visa" value={visa.proposedVisa || '-'} />
          <InfoField title="Visa stream" value={visa.visaStream || '-'} />
          <InfoField title="Occupation" value={visa.occupation || '-'} />
          <InfoField title="Sponsor name" value={visa.sponsorName || '-'} />
          <InfoField title="Sponsor email" value={visa.sponsorEmail || '-'} />
          <InfoField title="Sponsor phone" value={visa.sponsorPhone || '-'} />
          <InfoField title="SBS/TAS status" value={visa.sbsStatus || '-'} type="badge" badgeColor="#C3F8FE" />
          <InfoField title="Date submitted" value={fmtDate(visa.sbsSubmissionDate)} />
          <InfoField title="Date decision" value={fmtDate(visa.sbsDecisionDate)} />
          <InfoField title="Nomination status" value={visa.nominationStatus || '-'} type="badge" badgeColor="#CCE0FF" />
          <InfoField title="Nomination date submitted" value={fmtDate(visa.nominationSubmittedDate)} />
          <InfoField title="Nomination decision date" value={fmtDate(visa.nominationDecisionDate)} />
          <InfoField title="Visa status" value={visa.visaStatus || '-'} type="badge" badgeColor="#BAF3" />
          <InfoField title="Visa date submitted" value={fmtDate(visa.visaSubmittedDate)} />
          <InfoField title="Visa decision date" value={fmtDate(visa.visaDecisionDate)} />
        </div>
      )}
    </EditableTitleBox>
  );
};

export default VisaInformation;
