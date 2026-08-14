'use client';

import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

import { InfoField } from '@/components/atoms/info-field';
import { StatusInfoField } from '@/components/atoms/status-info-field';
import { Label } from '@/components/ui/label';
import { DatePicker } from '@/components/organisms/date-picker';
import FormErrorMessage from '@/components/atoms/form-error-message';
import SelectField from '@/components/organisms/select-field';

import EditableTitleBox from './editable-title-box';
import { buildTribunalSectionPayload } from './tribunal-section-payload';
import tribunalReviewFormSchema from '@/schema/tribunal-review';
import { ITribunalReview, TribunalStatusTypes } from '@/types/response-types/tribunal-review-response';
import { useUpdateTribunalReview } from '@/mutations/tribunal-review/add-tribunal-review';

const tribunalDetailsSchema = tribunalReviewFormSchema.pick({
  tribunalStatus: true,
  tribunalSubmittedDate: true,
  hearingDate: true,
  tribunalDecisionDate: true,
});

type FormValues = z.infer<typeof tribunalDetailsSchema>;

const toDefaults = (visa: ITribunalReview): FormValues => ({
  tribunalStatus: visa.tribunalStatus ?? null,
  tribunalSubmittedDate: visa.tribunalSubmittedDate ?? null,
  hearingDate: visa.hearingDate ?? null,
  tribunalDecisionDate: visa.tribunalDecisionDate ?? null,
});

const getDateValue = (dateString: string | null | undefined): Date | undefined => {
  if (!dateString) return undefined;
  const d = new Date(dateString);
  return isNaN(d.getTime()) ? undefined : d;
};

const fmtDate = (s: string | null | undefined) => (s ? new Date(s).toLocaleDateString() : 'N/A');

const TribunalDetails = ({ visa }: { visa: ITribunalReview }) => {
  const [isEditing, setIsEditing] = useState(false);
  const editTribunal = useUpdateTribunalReview();

  const statusOptions = Object.values(TribunalStatusTypes).map((value) => ({ label: value, value }));

  const form = useForm<FormValues>({
    resolver: zodResolver(tribunalDetailsSchema) as any,
    defaultValues: toDefaults(visa),
  });
  const {
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
        toast.success('Tribunal review details updated');
        setIsEditing(false);
      },
      onError: (error: any) => {
        toast.error(error?.response?.data?.message || 'Failed to update tribunal review');
      },
    });
  });

  return (
    <EditableTitleBox
      title="Tribunal review details"
      isEditing={isEditing}
      isSaving={editTribunal.isPending}
      onEdit={() => setIsEditing(true)}
      onCancel={handleCancel}
      onSave={handleSave}
    >
      {isEditing ? (
        <form onSubmit={handleSave}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <SelectField
              control={control}
              name="tribunalStatus"
              label="Tribunal status"
              options={statusOptions}
              placeholder="Select a status"
            />
            <div className="space-y-2">
              <Label className="text-b2">Tribunal date submitted</Label>
              <Controller
                name="tribunalSubmittedDate"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    side="top"
                    value={getDateValue(field.value)}
                    onChange={handleDateChange('tribunalSubmittedDate')}
                    placeholder="DD/MM/YYYY"
                    className="h-12 text-b2 w-full"
                    error={!!errors.tribunalSubmittedDate?.message}
                  />
                )}
              />
              <FormErrorMessage message={errors.tribunalSubmittedDate?.message} />
            </div>
            <div className="space-y-2">
              <Label className="text-b2">Hearing date</Label>
              <Controller
                name="hearingDate"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    side="top"
                    value={getDateValue(field.value)}
                    onChange={handleDateChange('hearingDate')}
                    placeholder="DD/MM/YYYY"
                    className="h-12 text-b2 w-full"
                    error={!!errors.hearingDate?.message}
                    disablePastDates
                  />
                )}
              />
              <FormErrorMessage message={errors.hearingDate?.message} />
            </div>
            <div className="space-y-2">
              <Label className="text-b2">Tribunal decision date</Label>
              <Controller
                name="tribunalDecisionDate"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    side="top"
                    value={getDateValue(field.value)}
                    onChange={handleDateChange('tribunalDecisionDate')}
                    placeholder="DD/MM/YYYY"
                    className="h-12 text-b2 w-full"
                    error={!!errors.tribunalDecisionDate?.message}
                    disablePastDates
                  />
                )}
              />
              <FormErrorMessage message={errors.tribunalDecisionDate?.message} />
            </div>
          </div>
        </form>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatusInfoField title="Tribunal status" status={visa.tribunalStatus} />
          <InfoField title="Tribunal date submitted" value={fmtDate(visa.tribunalSubmittedDate)} />
          <InfoField title="Hearing date" value={fmtDate(visa.hearingDate)} />
          <InfoField title="Tribunal decision date" value={fmtDate(visa.tribunalDecisionDate)} />
        </div>
      )}
    </EditableTitleBox>
  );
};

export default TribunalDetails;
