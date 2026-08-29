'use client';

import { useEffect, useMemo, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
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
import { buildInsuranceSectionPayload } from './insurance-section-payload';
import insuranceFormSchema, { INSURANCE_DEPENDENT_FIELDS } from '@/schema/insurance';
import { isBlankValue, withDependentFields } from '@/schema/dependent-fields';
import { useDependentFields } from '@/hooks/use-dependent-fields';
import { IInsurance, InsuranceStatusTypes } from '@/types/response-types/insurance-response';
import { useEditInsurance } from '@/mutations/insurance/edit-insurance';
import { useGetVisaOptions } from '@/query/get-visa';
import { getInsuranceProviderMapping, getInsuranceTypeMapping } from '@/constants/insurance-constants';

const visaInfoSchema = withDependentFields(
  insuranceFormSchema.pick({
    currentVisa: true,
    visaExpiry: true,
    dueDate: true,
    visaStream: true,
    insuranceProviderId: true,
    policyNumber: true,
    insuranceTypeId: true,
    startDate: true,
    expiryDate: true,
    status: true,
  }),
  INSURANCE_DEPENDENT_FIELDS,
);

type FormValues = z.infer<typeof visaInfoSchema>;

const toDefaults = (insurance: IInsurance): FormValues => {
  const raw = insurance as unknown as Record<string, unknown>;
  return {
    currentVisa: insurance.currentVisa ?? null,
    visaExpiry: insurance.visaExpiry ?? null,
    dueDate: insurance.dueDate ?? null,
    visaStream: insurance.visaStream ?? null,
    insuranceProviderId: (raw.insuranceProviderId as number | null) ?? null,
    policyNumber: insurance.policyNumber ?? null,
    insuranceTypeId: (raw.insuranceTypeId as number | null) ?? null,
    startDate: insurance.startDate ?? null,
    expiryDate: insurance.expiryDate ?? null,
    status: insurance.status ?? null,
  };
};

const getDateValue = (dateString: string | null | undefined): Date | undefined => {
  if (!dateString) return undefined;
  const d = new Date(dateString);
  return isNaN(d.getTime()) ? undefined : d;
};

const fmtDate = (s: string | null | undefined) => (s ? new Date(s).toLocaleDateString() : 'N/A');

const VisaInformation = ({ insurance }: { insurance: IInsurance }) => {
  const [isEditing, setIsEditing] = useState(false);
  const editInsurance = useEditInsurance();

  const visaOptions = useGetVisaOptions();

  const insuranceProviders = useMemo(() => getInsuranceProviderMapping(), []);
  const insuranceTypes = useMemo(() => getInsuranceTypeMapping(), []);

  const form = useForm<FormValues>({
    resolver: zodResolver(visaInfoSchema) as any,
    defaultValues: toDefaults(insurance),
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

  useDependentFields(form, INSURANCE_DEPENDENT_FIELDS);

  const hasCurrentVisa = !isBlankValue(watch('currentVisa'));

  useEffect(() => {
    if (!isEditing) reset(toDefaults(insurance));
  }, [insurance, isEditing, reset]);

  const handleDateChange = (fieldName: keyof FormValues) => (date: Date | undefined) => {
    setValue(fieldName, (date ? format(date, 'yyyy-MM-dd') : '') as any, { shouldValidate: true });
  };

  const handleCancel = () => {
    reset(toDefaults(insurance));
    setIsEditing(false);
  };

  const handleSave = handleSubmit((data) => {
    editInsurance.mutate(buildInsuranceSectionPayload(insurance, data), {
      onSuccess: () => {
        toast.success('Visa & insurance details updated');
        setIsEditing(false);
      },
      onError: (error: any) => {
        toast.error(error?.response?.data?.message || 'Failed to update insurance applicant');
      },
    });
  });

  return (
    <EditableTitleBox
      title="Visa & insurance details"
      isEditing={isEditing}
      isSaving={editInsurance.isPending}
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
            <SelectField
              control={control}
              name="insuranceProviderId"
              label="Current insurance provider"
              options={insuranceProviders}
              placeholder="Select insurance provider"
            />
            <TextInput
              label="Policy number"
              placeholder="000-0000-0000"
              {...register('policyNumber')}
              error={errors.policyNumber?.message}
            />
            <SelectField
              control={control}
              name="insuranceTypeId"
              label="Policy type"
              options={insuranceTypes}
              placeholder="Select policy type"
            />
            <div className="space-y-2">
              <Label className="text-b2">Policy start date</Label>
              <Controller
                name="startDate"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    side="top"
                    value={getDateValue(field.value)}
                    onChange={handleDateChange('startDate')}
                    placeholder="DD/MM/YYYY"
                    className="h-12 text-b2 w-full"
                    error={!!errors.startDate?.message}
                    disablePastDates
                  />
                )}
              />
              <FormErrorMessage message={errors.startDate?.message} />
            </div>
            <div className="space-y-2">
              <Label className="text-b2">Policy end date</Label>
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
                    disablePastDates
                  />
                )}
              />
              <FormErrorMessage message={errors.expiryDate?.message} />
            </div>
            <SelectField
              control={control}
              name="status"
              label="Status"
              options={Object.values(InsuranceStatusTypes).map((value) => ({
                label: value,
                value,
              }))}
              placeholder="Select a status"
            />
          </div>
        </form>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <InfoField title="Current visa" value={insurance.currentVisa || '-'} />
          <InfoField title="Visa expiry date" value={fmtDate(insurance.visaExpiry)} />
          <InfoField title="Due date" value={fmtDate(insurance.dueDate)} />
          <InfoField title="Visa stream" value={insurance.visaStream || '-'} />
          <InfoField title="Current insurance provider" value={insurance.insuranceProvider || '-'} />
          <InfoField title="Policy number" value={insurance.policyNumber || '-'} />
          <InfoField title="Policy type" value={insurance.insuranceType || '-'} />
          <InfoField title="Policy start date" value={fmtDate(insurance.startDate)} />
          <InfoField title="Policy end date" value={fmtDate(insurance.expiryDate)} />
          <StatusInfoField title="Status" status={insurance.status} />
        </div>
      )}
    </EditableTitleBox>
  );
};

export default VisaInformation;
