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

interface Props {
  userId: number | undefined;
}

export function AddVisaService({ userId }: Props) {
  const form = useForm<NewVisaServiceType>({
    resolver: zodResolver(newVisaServiceSchema),
    defaultValues: newVisaServiceDefaultValues,
    mode: 'onChange',
  });

  const { data: sourceData } = useGetSource();
  const { data: users } = useGetUsers();

  const {
    register,
    control,
    watch,
    setValue,
    formState: { errors },
    handleSubmit,
  } = form;

  const remarks = watch('remarks');

  useEffect(() => {
    if (userId) {
      setValue('userId', userId);
      setValue('updatedBy', userId);
    }
  }, [userId, setValue]);

  const handleVisaNoteChange = (content: string) => {
    // Store visa note in remarks or a separate field if needed
    setValue('remarks', content, { shouldValidate: true });
  };

  const { mutate, isPending } = useAddVisaService();
  const submitHandler = (data: NewVisaServiceType) => {
    // The schema already expects strings for date fields, so we can pass data as-is
    mutate(
      { payload: { ...data, sourceId: Number(data.sourceId) } },
      {
        onSuccess: () => {
          toast.success('Visa applicant added successfully');
          form.reset();
        },
        onError: (error: any) => {
          toast.error(error?.response?.data?.message || 'Failed to add visa applicant');
        },
      },
    );
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
  const handleDateChange = (fieldName: keyof NewVisaServiceType) => (date: Date | undefined) => {
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
              <Label className="text-b2" htmlFor="dob">
                Date of birth
              </Label>
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
                  />
                )}
              />
              <FormErrorMessage message={errors.dob?.message} />
            </div>
            <TextInput type="email" label="Email address" {...register('email')} error={errors.email?.message} />
            <TextInput label="Phone number" {...register('phone')} error={errors.phone?.message} />
            <TextInput label="Nationality" {...register('country')} error={errors.country?.message} />
            <TextInput label="Address" {...register('state')} error={errors.state?.message} />
            <TextInput label="Passport number" {...register('passport')} error={errors.passport?.message} />
            <div className="space-y-2">
              <Label className="text-b2" htmlFor="issueDate">
                Passport issue date
              </Label>
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
              <Label className="text-b2" htmlFor="expiryDate">
                Passport expiry date
              </Label>
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
        </FormAccordion>

        {/* Visa Information */}
        <FormAccordion value="item-2" title="Visa Information">
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
              <Label className="text-b2" htmlFor="visaExpiry">
                Visa expiry date
              </Label>
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
                  />
                )}
              />
              <FormErrorMessage message={errors.visaExpiry?.message} />
            </div>
            <div className="space-y-2">
              <Label className="text-b2" htmlFor="dueDate">
                Due date
              </Label>
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
            <TextInput label="Visa stream" {...register('anzsco')} error={errors.anzsco?.message} />
            <SelectField
              control={control}
              name="occupation"
              label="Occupation"
              options={[
                { label: 'Software Developer', value: 'Software Developer' },
                { label: 'Engineer', value: 'Engineer' },
                { label: 'Accountant', value: 'Accountant' },
                { label: 'Teacher', value: 'Teacher' },
                { label: 'Nurse', value: 'Nurse' },
              ]}
              placeholder="Select an occupation"
            />
            {/* <TextInput label="Sponsor name" {...register('sponsorName')} error={errors.remarks?.message} />
            <TextInput
              type="email"
              label="Sponsor email"
              {...register('sponsorEmail')}
              error={errors.remarks?.message}
            />
            <TextInput label="Sponsor phone" {...register('sponsorPhone')} error={errors.remarks?.message} /> */}
            <SelectField
              control={control}
              name="csaStatus"
              label="SBS/TAS status"
              options={[
                { label: 'Approved', value: 'Approved' },
                { label: 'Pending', value: 'Pending' },
                { label: 'Rejected', value: 'Rejected' },
              ]}
              placeholder="Select a status"
            />
            <div className="space-y-2">
              <Label className="text-b2" htmlFor="visaSubmitted">
                Date submitted
              </Label>
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
              <Label className="text-b2" htmlFor="visaGranted">
                Decision date
              </Label>
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
              options={[
                { label: 'Approved', value: 'Approved' },
                { label: 'Pending', value: 'Pending' },
                { label: 'Rejected', value: 'Rejected' },
              ]}
              placeholder="Select a status"
            />
            <div className="space-y-2">
              <Label className="text-b2" htmlFor="nominationLodged">
                Nomination date submitted
              </Label>
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
                  />
                )}
              />
              <FormErrorMessage message={errors.nominationLodged?.message} />
            </div>
            <div className="space-y-2">
              <Label className="text-b2" htmlFor="nominationDecision">
                Nomination decision date
              </Label>
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
                  />
                )}
              />
              <FormErrorMessage message={errors.nominationDecision?.message} />
            </div>
            <SelectField
              control={control}
              name="status"
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
              <Label className="text-b2" htmlFor="visaSubmitted">
                Visa date submitted
              </Label>
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
              <Label className="text-b2" htmlFor="visaGranted">
                Visa decision date
              </Label>
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
          </div>
        </FormAccordion>

        {/* Visa note */}
        <FormAccordion value="item-3" title="Visa note">
          <div className="w-full space-y-1" suppressHydrationWarning>
            <TinyEditor value={remarks || ''} onChange={handleVisaNoteChange} />
            {errors.remarks?.message && <p className="text-sm text-red-500">{errors.remarks.message}</p>}
          </div>
        </FormAccordion>

        {/* Accounts */}
        <FormAccordion value="item-4" title="Accounts">
          <div className="grid grid-cols-3 gap-6">
            <TextInput
              label="Fee payment plan"
              {...register('payment')}
              error={errors.payment?.message}
              placeholder="Select/enter payment plan"
            />
            <TextInput label="Service fee" {...register('payment')} error={errors.payment?.message} type="number" />
            <TextInput label="GST" {...register('payment')} error={errors.payment?.message} type="number" />
            <TextInput label="Discount" {...register('payment')} error={errors.payment?.message} type="number" />
            <TextInput label="Net amount" {...register('payment')} error={errors.payment?.message} type="number" />
            <TextInput label="Invoice number" {...register('invoiceNumber')} error={errors.invoiceNumber?.message} />
            <div className="space-y-2">
              <Label className="text-b2" htmlFor="dueDate">
                Due date
              </Label>
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
            <SelectField
              control={control}
              name="paymentStatus"
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
        </FormAccordion>

        {/* Fee note */}
        <FormAccordion value="item-5" title="Fee note">
          <div className="w-full space-y-1" suppressHydrationWarning>
            <TinyEditor value={remarks || ''} onChange={handleVisaNoteChange} />
            {errors.remarks?.message && <p className="text-sm text-red-500">{errors.remarks.message}</p>}
          </div>
        </FormAccordion>

        {/* Misc */}
        <FormAccordion value="item-6" title="Misc">
          <div className="grid grid-cols-2 gap-6">
            <SelectField
              control={control}
              name="sourceId"
              label="Source"
              options={
                sourceData?.map((source) => ({
                  label: source.name,
                  value: source.id.toString(),
                })) || []
              }
              placeholder="Select a source"
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
                  onSelect={(val) => field.onChange(Number(val))}
                  error={errors.userId?.message}
                />
              )}
            />
          </div>
        </FormAccordion>

        {/* Note */}
        <FormAccordion value="item-7" title="Note">
          <div className="w-full space-y-1" suppressHydrationWarning>
            <TinyEditor value={remarks || ''} onChange={handleVisaNoteChange} />
            {errors.remarks?.message && <p className="text-sm text-red-500">{errors.remarks.message}</p>}
          </div>
        </FormAccordion>
      </Accordion>

      <div className="flex justify-start mt-6">
        <Button loading={isPending} loadingText="Processing" type="submit" variant="primary">
          Add Visa Applicant
        </Button>
        <Button type="button" variant="outline" className="ml-3" onClick={() => form.reset()}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
