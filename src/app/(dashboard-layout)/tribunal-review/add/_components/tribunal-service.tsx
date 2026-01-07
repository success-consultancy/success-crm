import { Accordion } from '@/components/ui/accordion';
import {
  newVisaServiceDefaultValues,
  newVisaServiceSchema,
  NewVisaServiceType,
} from '@/schema/visa-service/new-visa.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';
import { format } from 'date-fns';

import { cn } from '@/lib/utils';

import TextInput from '@/components/molecules/text-input';
import { Label } from '@/components/ui/label';
import { DatePicker } from '@/components/organisms/date-picker';
import FormErrorMessage from '@/components/atoms/form-error-message';
import SelectField from '@/components/organisms/select-field';
import Button from '@/components/atoms/button';
import { FormAccordion } from '@/components/organisms/form-accordion';
import { useAddVisaService } from '@/mutations/visa/add-visa';
import toast from 'react-hot-toast';
import { useGetSource } from '@/query/get-source';
import { useEffect, useMemo } from 'react';
import TinyEditor from '@/components/organisms/text-editor';
import { FormField } from '@/components/ui/form';
import SelectWithCommand from '@/components/molecules/select-with-command';
import { useGetUsers } from '@/query/get-user';
import { useGetOccupations } from '@/query/get-occupations';
import tribunalReviewFormSchema, { TribunalReviewSchemaType, updateTribunalReviewFormSchema } from '@/schema/tribunal-review';
import { useAddTribunalReview, useUpdateTribunalReview } from '@/mutations/tribunal-review/add-tribunal-review';
import { FORM_STATE } from '@/types/common';

interface Props {
  userId: number | undefined;
  formState: FORM_STATE;
  defaultValues?: Partial<TribunalReviewSchemaType>;
}

export function TribunalService({ userId, formState, defaultValues }: Props) {
  const {
    register,
    control,
    watch,
    setValue,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<TribunalReviewSchemaType>({
    resolver: zodResolver(formState === FORM_STATE.ADD ? tribunalReviewFormSchema : updateTribunalReviewFormSchema),
    defaultValues: defaultValues,
    mode: 'onChange',
  });

  const { data: sourceData } = useGetSource();
  const { data: users } = useGetUsers();
  const { data: occupations } = useGetOccupations();

  const ANZSCOOccupationOptions = useMemo(() => {
    return occupations?.map((occupation) => {
      const value = occupation.code;
      const label = occupation.title + ' - ' + occupation.code;
      return {
        value,
        label,
      };
    });
  }, [occupations]);

  useEffect(() => {
    if (userId) {
      setValue('userId', userId);
      setValue('updatedBy', userId);
    }
  }, [userId, setValue]);
  const feeNote = watch('accounts.feeNote');
  const remarks = watch('remarks');

  const handleFeeNoteChange = (content: string) => {
    // Store fee note in remarks or a separate field if needed
    setValue('accounts.feeNote', content, { shouldValidate: true });
  };

  const { mutate: addTribunalReview, isPending: addTribunalReviewPending } = useAddTribunalReview();
  const { mutate: updateTribunalReview, isPending: updateTribunalReviewPending } = useUpdateTribunalReview();
  console.log(errors);

  const submitHandler = (data: TribunalReviewSchemaType) => {
    console.log(errors);
    if (formState === FORM_STATE.ADD) {
      addTribunalReview(
        { payload: { ...data, sourceId: data.sourceId } },
        {
          onSuccess: () => {
            toast.success('Tribunal review added successfully');
            reset();
          },
          onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Failed to add tribunal review');
          },
        },
      );
    } else {
      updateTribunalReview(
        { ...data, sourceId: data.sourceId },
        {
          onSuccess: () => {
            toast.success('Tribunal review updated successfully');
            reset();
          },
          onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Failed to update tribunal review');
          },
        },
      );
    }
  };

  const userOptions = useMemo(() => {
    if (users) {
      return users?.map((user) => {
        return {
          label: `${user.firstName} ${user.lastName}`,
          value: user.id.toString(),
        };
      });
    }
    return [];
  }, [users]);

  // Helper to handle date changes and convert to string (ISO format)
  const handleDateChange = (fieldName: keyof TribunalReviewSchemaType) => (date: Date | undefined) => {
    if (date) {
      setValue(fieldName, format(date, 'yyyy-MM-dd') as any, { shouldValidate: true });
    } else {
      setValue(fieldName, '' as any, { shouldValidate: true });
    }
  };

  // Helper to get date value for DatePicker from string
  const getDateValue = (dateString: string | null | undefined): Date | undefined => {
    if (!dateString || dateString === '') return undefined;
    try {
      const date = new Date(dateString);
      return isNaN(date.getTime()) ? undefined : date;
    } catch {
      return undefined;
    }
  };

  return (
    <form className="w-full" onSubmit={handleSubmit(submitHandler)}>
      <Accordion type="multiple" className="w-full space-y-6" defaultValue={['item-1', 'item-2', 'item-4', 'item-6']}>
        {/* Personal Details */}
        <FormAccordion value="item-1" title="Personal details">
          <div className="grid grid-cols-3 gap-6">
            <TextInput label="First name" {...register('firstName')} error={errors.firstName?.message} />
            <TextInput label="Middle name (optional)" {...register('middleName')} error={errors.middleName?.message} />
            <TextInput label="Last name" {...register('lastName')} error={errors.lastName?.message} />
            <div className="space-y-2">
              <Controller
                name="dob"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    error={!!errors.dob?.message}
                    side="top"
                    value={getDateValue(field.value)}
                    onChange={handleDateChange('dob')}
                    placeholder="DD/MM/YYYY"
                    className={cn('h-12 text-b2 w-full')}
                    disableFutureDates={true}
                    label="Date of birth"
                  />
                )}
              />
              <FormErrorMessage message={errors.dob?.message} />
            </div>
            <TextInput type="email" label="Email address" {...register('email')} error={errors.email?.message} />
            <TextInput label="Phone number" {...register('phone')} error={errors.phone?.message} />
            <TextInput label="Nationality" {...register('country')} error={errors.country?.message} />
            <TextInput label="Address" {...register('address')} error={errors.address?.message} />
            <TextInput label="Passport number" {...register('passport')} error={errors.passport?.message} />
            <div className="space-y-2">
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
                    label="Passport issue date"
                  />
                )}
              />
              <FormErrorMessage message={errors.passportIssueDate?.message} />
            </div>
            <div className="space-y-2">
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
                    label="Passport expiry date"
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
        </FormAccordion>

        {/* Visa Information */}
        <FormAccordion value="item-2" title="Visa & service details">
          <div className="grid grid-cols-3 gap-6">
            <SelectField
              control={control}
              name="currentVisa"
              label="Current visa"
              options={[
                { label: 'Student Visa', value: 'Student Visa' },
                { label: 'Work Visa', value: 'Work Visa' },
                { label: 'Tourist Visa', value: 'Tourist Visa' },
                { label: 'Permanent Resident', value: 'Permanent Resident' },
                { label: 'No Visa', value: 'No Visa' },
              ]}
              placeholder="Select current visa type"
            />
            <div className="space-y-2">
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
                    label="Visa expiry date"
                  />
                )}
              />
              <FormErrorMessage message={errors.visaExpiry?.message} />
            </div>
            <div className="space-y-2">
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
                    label="Due date"
                  />
                )}
              />
              <FormErrorMessage message={errors.dueDate?.message} />
            </div>
            <SelectField
              control={control}
              name="proposedVisa"
              label="Proposed visa"
              options={[
                { label: 'Student Visa', value: 'Student Visa' },
                { label: 'Work Visa', value: 'Work Visa' },
                { label: 'Skilled Migration', value: 'Skilled Migration' },
                { label: 'Family Visa', value: 'Family Visa' },
                { label: 'Business Visa', value: 'Business Visa' },
              ]}
              placeholder="Select proposed visa type"
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
              placeholder="Select an visaStream"
            />

            <FormField
              control={control}
              name="anzsco"
              render={({ field }) => (
                <SelectWithCommand
                  options={ANZSCOOccupationOptions || []}
                  value={field.value || undefined}
                  label="ANZSCO / Occupation"
                  onSelect={(val) => {
                    field.onChange(val);
                    const occupation = occupations?.find((occupation) => occupation.code === val);
                    setValue('occupation', occupation?.title, { shouldValidate: false });
                  }}
                  error={errors.anzsco?.message}
                />
              )}
            />
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
              options={[
                { label: 'Approved', value: 'Approved' },
                { label: 'Pending', value: 'Pending' },
                { label: 'Rejected', value: 'Rejected' },
              ]}
              placeholder="Select a status"
            />
            <div className="space-y-2">
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
                    label="Date submitted"
                  />
                )}
              />
              <FormErrorMessage message={errors.sbsSubmissionDate?.message} />
            </div>
            <div className="space-y-2">
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
                    label="Decision date"
                  />
                )}
              />
              <FormErrorMessage message={errors.sbsDecisionDate?.message} />
            </div>
            <SelectField
              control={control}
              name="nominationStatus"
              label="Nomination status"
              options={[
                { label: 'New', value: 'New' },
                { label: 'Collecting docs', value: 'Collecting docs' },
                { label: 'Ready to submit', value: 'Ready to submit' },
                { label: 'Submitted', value: 'Submitted' },
                { label: 'Info requested', value: 'Info requested' },
                { label: 'Approved', value: 'Approved' },
                { label: 'Withdrawn', value: 'Withdrawn' },
                { label: 'Refused', value: 'Refused' },
                { label: 'Discontinued', value: 'Discontinued' },
              ]}
              placeholder="Select a status"
            />
            <div className="space-y-2">
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
                    label="Nomination date submitted"
                  />
                )}
              />
              <FormErrorMessage message={errors.nominationSubmittedDate?.message} />
            </div>
            <div className="space-y-2">
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
                    label="Nomination decision date"
                  />
                )}
              />
              <FormErrorMessage message={errors.nominationDecisionDate?.message} />
            </div>
            <SelectField
              control={control}
              name="visaStatus"
              label="Visa status"
              options={[
                { label: 'Approved', value: 'Approved' },
                { label: 'Pending', value: 'Pending' },
                { label: 'Rejected', value: 'Rejected' },
                { label: 'Under Review', value: 'Under Review' },
              ]}
              placeholder="Select a status"
            />
            <div className="space-y-2">
              <Controller
                name="visaSubmittedDate"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    side="top"
                    label="Visa date submitted"
                    value={getDateValue(field.value)}
                    onChange={handleDateChange('visaSubmittedDate')}
                    placeholder="DD/MM/YYYY"
                    className="h-12 text-b2 w-full"
                    error={!!errors.visaSubmittedDate?.message}
                  />
                )}
              />
              <FormErrorMessage message={errors.visaSubmittedDate?.message} />
            </div>
            <div className="space-y-2">
              <Controller
                name="visaDecisionDate"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    side="top"
                    label="Visa decision date"
                    value={getDateValue(field.value)}
                    onChange={handleDateChange('visaDecisionDate')}
                    placeholder="DD/MM/YYYY"
                    className="h-12 text-b2 w-full"
                    error={!!errors.visaDecisionDate?.message}
                  />
                )}
              />
              <FormErrorMessage message={errors.visaDecisionDate?.message} />
            </div>
          </div>
        </FormAccordion>


        {/* Tribunal */}
        <FormAccordion value="item-3" title="Tribunal review details">
          <div className="grid grid-cols-3 gap-6">
            {/* date submitted, hearing date, tribunal decision date */}

            <TextInput label="Tribunal Status" {...register('tribunalStatus')} error={errors.tribunalStatus?.message} />
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
                  label='Date submitted'
                />
              )}
            />

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
                  label='Hearing date'
                  error={!!errors.hearingDate?.message}
                />
              )}
            />

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
                  label='Tribunal decision date'
                  error={!!errors.tribunalDecisionDate?.message}
                />
              )}
            />
          </div>
        </FormAccordion>

        {/* Accounts */}
        {formState === FORM_STATE.ADD && (
          <FormAccordion value="item-4" title="Accounts">
            <div className="grid grid-cols-3 gap-6">
              <TextInput
                label="Fee payment plan"
                {...register('accounts.planname')}
                error={errors.accounts?.planname?.message}
                placeholder="Select/enter payment plan"
              />
              <TextInput
                label="Service fee"
                {...register('accounts.amount')}
                error={errors.accounts?.amount?.message}
                type="number"
              />
              <TextInput
                disabled
                label="GST"
                {...register('accounts.gst')}
                error={errors.accounts?.gst?.message}
                type="number"
              />
              <TextInput
                label="Discount"
                {...register('accounts.discount')}
                error={errors.accounts?.discount?.message}
                type="number"
              />
              <TextInput
                disabled
                label="Net amount"
                {...register('accounts.netamount')}
                error={errors.accounts?.netamount?.message}
                type="number"
              />
              <TextInput
                label="Invoice number"
                {...register('accounts.invoicenumber')}
                error={errors.accounts?.invoicenumber?.message}
              />
              <div className="space-y-2">
                <Label className="text-b2" htmlFor="courseFee.accounts.duedate">
                  Due Date
                </Label>
                <Controller
                  name="accounts.duedate"
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      side="top"
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Pick a date"
                      className="h-12 text-b2 w-full"
                      disablePastDates={true}
                    />
                  )}
                />
                <FormErrorMessage message={errors.accounts?.duedate?.message} />
              </div>
              <SelectField
                control={control}
                name="accounts.status"
                label="Payment status"
                options={[
                  { label: 'Pending', value: 'Pending' },
                  { label: 'Paid', value: 'Paid' },
                  { label: 'Overdue', value: 'Overdue' },
                  { label: 'Cancelled', value: 'Cancelled' },
                ]}
                placeholder="Select a status"
              />
            </div>

            <div className="w-full space-y-1" suppressHydrationWarning>
              <Label htmlFor="feeNote">Fee note</Label>
              <TinyEditor value={watch('accounts.feeNote') || ''} onChange={handleFeeNoteChange} />
              {errors.accounts?.feeNote?.message && (
                <p className="text-sm text-red-500">{errors.accounts?.feeNote?.message}</p>
              )}
            </div>
          </FormAccordion>
        )}

        {/* Misc */}
        <FormAccordion value="item-6" title="Misc">
          <div className="grid grid-cols-2 gap-6">
            <FormField
              control={control}
              name="sourceId"
              render={({ field }) => (
                <SelectWithCommand
                  options={
                    sourceData?.map((source) => ({
                      label: source.name,
                      value: source.id.toString(),
                    })) || []
                  }
                  value={field.value?.toString()}
                  label="Source"
                  placeholder="Select a source"
                  onSelect={(val) => field.onChange(val)}
                  error={errors.sourceId?.message?.toString()}
                />
              )}
            />
            <FormField
              control={control}
              name="userId"
              render={({ field }) => (
                <SelectWithCommand
                  options={userOptions}
                  value={field.value?.toString()}
                  label="Assigned to"
                  placeholder="Select an assignee"
                  onSelect={(val) => {
                    if (!val) {
                      return;
                    }

                    field.onChange(Number(val))
                  }}
                  error={errors.userId?.message}
                />
              )}
            />
          </div>
          <div>
            <Label>Note</Label>
            <div className="w-full space-y-1 mt-2" suppressHydrationWarning>
              <TinyEditor value={feeNote || ''} onChange={(content) => setValue('remarks', content, { shouldValidate: true })} />
              {errors.remarks?.message && <p className="text-sm text-red-500">{errors.remarks.message}</p>}
            </div>
          </div>
        </FormAccordion>
      </Accordion>

      <div className="flex justify-start mt-6">
        <Button loading={addTribunalReviewPending || updateTribunalReviewPending} loadingText="Processing" type="submit" variant="primary">
          {formState === FORM_STATE.ADD ? 'Add Tribunal Review' : 'Update Tribunal Review'}
        </Button>
        <Button type="button" variant="outline" className="ml-3" onClick={() => reset()}>
          Cancel
        </Button>
      </div>
    </form >
  );
}
