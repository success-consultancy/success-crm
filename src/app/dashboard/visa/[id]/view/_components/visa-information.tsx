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
import { PhoneNumberInput } from '@/components/molecules/phone-number-input';
import { DatePicker } from '@/components/organisms/date-picker';
import FormErrorMessage from '@/components/atoms/form-error-message';
import SelectField from '@/components/organisms/select-field';
import SelectWithCommand from '@/components/molecules/select-with-command';
import { FormField } from '@/components/ui/form';

import EditableTitleBox from './editable-title-box';
import { buildVisaSectionPayload } from './visa-section-payload';
import { newVisaServiceSchema, VISA_DEPENDENT_FIELDS } from '@/schema/visa-service/new-visa.schema';
import { isBlankValue, withDependentFields } from '@/schema/dependent-fields';
import { useDependentFields } from '@/hooks/use-dependent-fields';
import { IVisaDetail, VisaStatusTypes } from '@/types/response-types/visa-response';
import { StatusInfoField } from '@/components/atoms/status-info-field';
import { useEditVisa } from '@/mutations/visa/edit-visa';
import { useGetOccupations } from '@/query/get-occupations';
import { useGetVisaOptions } from '@/query/get-visa';
import { ENTITY, toastMsg } from '@/constants/messages';

const visaInfoSchema = withDependentFields(
  newVisaServiceSchema.pick({
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
    csaStatus: true,
    visaSubmitted: true,
    visaGranted: true,
    nominationStatus: true,
    nominationLodged: true,
    nominationDecision: true,
    status: true,
  }),
  VISA_DEPENDENT_FIELDS,
);

type FormValues = z.infer<typeof visaInfoSchema>;

const toDefaults = (visa: IVisaDetail): FormValues => ({
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
  csaStatus: visa.csaStatus ?? null,
  visaSubmitted: visa.visaSubmitted ?? null,
  visaGranted: visa.visaGranted ?? null,
  nominationStatus: visa.nominationStatus ?? null,
  nominationLodged: visa.nominationLodged ?? null,
  nominationDecision: visa.nominationDecision ?? null,
  status: visa.status ?? null,
});

const getDateValue = (dateString: string | null | undefined): Date | undefined => {
  if (!dateString) return undefined;
  const d = new Date(dateString);
  return isNaN(d.getTime()) ? undefined : d;
};

const fmtDate = (s: string | null | undefined) => (s ? new Date(s).toLocaleDateString() : 'N/A');

const statusOptions = Object.values(VisaStatusTypes).map((value) => ({ label: value, value }));

const VisaInformation = ({ visa }: { visa: IVisaDetail }) => {
  const [isEditing, setIsEditing] = useState(false);
  const editVisa = useEditVisa();
  const { data: occupations } = useGetOccupations();
  const visaOptions = useGetVisaOptions();

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
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = form;

  useDependentFields(form, VISA_DEPENDENT_FIELDS);

  const hasCurrentVisa = !isBlankValue(watch('currentVisa'));
  const hasNominationStatus = !isBlankValue(watch('nominationStatus'));

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
    editVisa.mutate(buildVisaSectionPayload(visa, data), {
      onSuccess: () => {
        toast.success(toastMsg.updateSuccess(ENTITY.visaInfo));
        setIsEditing(false);
      },
      onError: (error: any) => {
        toast.error(error?.response?.data?.message || toastMsg.updateError(ENTITY.visa));
      },
    });
  });

  return (
    <EditableTitleBox
      title="Visa information"
      isEditing={isEditing}
      isSaving={editVisa.isPending}
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
            <TextInput label="Sponsor name" {...form.register('sponsorName')} error={errors.sponsorName?.message} />
            <TextInput
              type="email"
              label="Sponsor email"
              {...form.register('sponsorEmail')}
              error={errors.sponsorEmail?.message}
            />
            <FormField
              control={control}
              name="sponsorPhone"
              render={({ field }) => (
                <PhoneNumberInput
                  label="Sponsor phone"
                  value={field.value ?? ''}
                  onChange={field.onChange}
                  error={errors.sponsorPhone?.message}
                />
              )}
            />
            <SelectField
              control={control}
              name="csaStatus"
              label="SBS/TAS status"
              options={statusOptions}
              placeholder="Select a status"
            />
            <div className="space-y-2">
              <Label className="text-b2">Date submitted</Label>
              <Controller
                name="visaSubmitted"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    side="top"
                    value={getDateValue(field.value)}
                    onChange={handleDateChange('visaSubmitted')}
                    placeholder="DD/MM/YYYY"
                    className="h-12 text-b2 w-full"
                    error={!!errors.visaSubmitted?.message}
                  />
                )}
              />
              <FormErrorMessage message={errors.visaSubmitted?.message} />
            </div>
            <div className="space-y-2">
              <Label className="text-b2">Decision date</Label>
              <Controller
                name="visaGranted"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    side="top"
                    value={getDateValue(field.value)}
                    onChange={handleDateChange('visaGranted')}
                    placeholder="DD/MM/YYYY"
                    className="h-12 text-b2 w-full"
                    error={!!errors.visaGranted?.message}
                  />
                )}
              />
              <FormErrorMessage message={errors.visaGranted?.message} />
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
                name="nominationLodged"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    side="top"
                    value={getDateValue(field.value)}
                    onChange={handleDateChange('nominationLodged')}
                    placeholder="DD/MM/YYYY"
                    className="h-12 text-b2 w-full"
                    error={!!errors.nominationLodged?.message}
                    disabled={!hasNominationStatus}
                  />
                )}
              />
              <FormErrorMessage message={errors.nominationLodged?.message} />
            </div>
            <div className="space-y-2">
              <Label className="text-b2">Nomination decision date</Label>
              <Controller
                name="nominationDecision"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    side="top"
                    value={getDateValue(field.value)}
                    onChange={handleDateChange('nominationDecision')}
                    placeholder="DD/MM/YYYY"
                    className="h-12 text-b2 w-full"
                    error={!!errors.nominationDecision?.message}
                    disabled={!hasNominationStatus}
                  />
                )}
              />
              <FormErrorMessage message={errors.nominationDecision?.message} />
            </div>
            <SelectField
              control={control}
              name="status"
              label="Visa status"
              options={statusOptions}
              placeholder="Select a status"
            />
          </div>
        </form>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <InfoField title="Current visa" value={visa.currentVisa || '-'} />
          <InfoField title="Proposed visa" value={visa.proposedVisa || '-'} />
          <InfoField title="Sponsor name" value={visa.sponsorName || '-'} />
          <StatusInfoField title="SBS/TAS status" status={visa.csaStatus} />
          <StatusInfoField title="Nomination status" status={visa.nominationStatus} />
          <StatusInfoField title="Visa status" status={visa.status} />
          <InfoField title="Visa expiry date" value={fmtDate(visa.visaExpiry)} />
          <InfoField title="Visa stream" value={visa.visaStream || '-'} />
          <InfoField title="Sponsor email" value={visa.sponsorEmail || '-'} />
          <InfoField title="Date submitted" value={fmtDate(visa.visaSubmitted)} />
          <InfoField title="Nomination date submitted" value={fmtDate(visa.nominationLodged)} />
          <InfoField title="Visa date submitted" value={fmtDate(visa.visaSubmitted)} />
          <InfoField title="Due date" value={fmtDate(visa.dueDate)} />
          <InfoField title="Occupation" value={visa.occupation || '-'} />
          <InfoField title="Sponsor phone" value={visa.sponsorPhone || '-'} />
          <InfoField title="Decision date" value={fmtDate(visa.visaGranted)} />
        </div>
      )}
    </EditableTitleBox>
  );
};

export default VisaInformation;
