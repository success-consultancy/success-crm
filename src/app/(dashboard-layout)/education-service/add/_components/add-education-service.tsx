import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import {
  educationServiceDefaultValues,
  newStudentSchema,
  NewStudentType,
} from '@/schema/education-service/new-student.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { cn } from '@/lib/utils';
import { Controller } from 'react-hook-form';

import TextInput from '@/components/molecules/text-input';
import { Label } from '@/components/ui/label';
import { DatePicker } from '@/components/organisms/date-picker';
import FormErrorMessage from '@/components/atoms/form-error-message';
import SelectField from '@/components/organisms/select-field';
import { Editor } from '@tinymce/tinymce-react';
import Button from '@/components/atoms/button';
import { FormAccordion } from '@/components/organisms/form-accordion';

export function AddEducationService() {
  const form = useForm<NewStudentType>({
    resolver: zodResolver(newStudentSchema),
    defaultValues: educationServiceDefaultValues,
    mode: 'onBlur',
  });

  const {
    register,
    control,
    watch,
    setValue,
    formState: { errors },
  } = form;

  const feeNotes = watch('feeNotes');
  const handleEditorChange = (content: string) => {
    setValue('feeNotes', content, { shouldValidate: true });
  };

  const submitHandler = (data: NewStudentType) => {
    console.log(data);
  };
  return (
    <form className="w-full" onSubmit={form.handleSubmit(submitHandler)}>
      <Accordion type="multiple" className="w-full space-y-4" defaultValue={['item-1']}>
        {/* Personal Details */}
        <FormAccordion value="item-1" title="Personal Details">
          <div className="grid grid-cols-3 gap-6">
            <TextInput label="First Name" {...register('firstName')} error={errors.firstName?.message} />
            <TextInput label="Middle Name" {...register('middleName')} error={errors.middleName?.message} />
            <TextInput label="Last Name" {...register('lastName')} error={errors.lastName?.message} />
            <div className="space-y-2">
              <Label className="text-b2" htmlFor="birth-date">
                Birth Date
              </Label>
              <Controller
                name="birthdate"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    error={!!errors.birthdate?.message}
                    side="top"
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Pick a date"
                    className={cn('h-12 text-b2 w-full')}
                    disableFutureDates={true}
                  />
                )}
              />
              <FormErrorMessage message={errors.birthdate?.message} />
            </div>
            <TextInput type="email" label="Email" {...register('email')} error={errors.email?.message} />
            <TextInput label="Phone Number" {...register('phoneNumber')} error={errors.phoneNumber?.message} />
            <TextInput label="Nationality" {...register('nationality')} error={errors.nationality?.message} />
            <SelectField
              control={control}
              name="address"
              label="Address"
              options={[
                { label: 'Address 1', value: 'address-1' },
                { label: 'Address 2', value: 'address-2' },
                { label: 'Address 3', value: 'address-3' },
              ]}
              placeholder="Select option"
            />
            <TextInput label="Passport Number" {...register('passportNumber')} error={errors.passportNumber?.message} />

            <div className="space-y-2">
              <Label className="text-b2" htmlFor="passport-issue-date">
                Passport Issue Date
              </Label>
              <Controller
                name="passportIssueDate"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    side="top"
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Pick a date"
                    className="h-12 text-b2 w-full"
                    error={!!errors.passportIssueDate?.message}
                  />
                )}
              />
              <FormErrorMessage message={errors.passportIssueDate?.message} />
            </div>
            <div className="space-y-2">
              <Label className="text-b2" htmlFor="passport-expiry-date">
                Passport Expiry Date
              </Label>
              <Controller
                name="passportExpiryDate"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    side="top"
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Pick a date"
                    className="h-12 text-b2 w-full"
                    error={!!errors.passportExpiryDate?.message}
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
                { label: 'Location 1', value: 'location-1' },
                { label: 'Location 2', value: 'location-2' },
                { label: 'Location 3', value: 'location-3' },
              ]}
              placeholder="Select option"
            />
          </div>
        </FormAccordion>

        {/* Course Information */}
        <FormAccordion value="item-2" title="Course Information">
          <>
            <div className="grid grid-cols-2 gap-6">
              <TextInput
                label="University Name"
                {...register('universityName')}
                error={errors.universityName?.message}
              />
              <TextInput label="Course" {...register('course')} error={errors.course?.message} />
            </div>
            <div className="grid grid-cols-3 gap-6 mt-6">
              <div className="space-y-2">
                <Label className="text-b2" htmlFor="universityStartDate">
                  University Start Date
                </Label>
                <Controller
                  name="universityStartDate"
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      side="top"
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Pick a date"
                      className="h-12 text-b2 w-full"
                      disablePastDates={true}
                      error={!!errors.universityStartDate?.message}
                    />
                  )}
                />
                <FormErrorMessage message={errors.universityStartDate?.message} />
              </div>
              <div className="space-y-2">
                <Label className="text-b2" htmlFor="universityEndDate">
                  University End Date
                </Label>
                <Controller
                  name="universityEndDate"
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      side="top"
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Pick a date"
                      className="h-12 text-b2 w-full"
                      disablePastDates={true}
                      error={!!errors.universityEndDate?.message}
                    />
                  )}
                />
                <FormErrorMessage message={errors.universityEndDate?.message} />
              </div>
              <SelectField
                control={control}
                name="status"
                label="Status"
                options={[
                  { label: 'Active', value: 'active' },
                  { label: 'Pending', value: 'pending' },
                  { label: 'Completed', value: 'completed' },
                  { label: 'Suspended', value: 'suspended' },
                ]}
                placeholder="Select status"
              />
            </div>
          </>
        </FormAccordion>

        {/* Fee Structure */}
        <FormAccordion value="item-3" title="Fee Structure">
          <>
            <div className="grid grid-cols-3 gap-6">
              <SelectField
                control={control}
                name="feePaymentPlan"
                label="Fee Payment Plan"
                options={[
                  { label: 'Monthly', value: 'monthly' },
                  { label: 'Quarterly', value: 'quarterly' },
                  { label: 'Annually', value: 'annually' },
                  { label: 'One-time', value: 'one-time' },
                ]}
                placeholder="Select payment plan"
              />
              <TextInput
                label="Fee Amount"
                type="number"
                {...register('feeAmount', { valueAsNumber: true })}
                error={errors.feeAmount?.message}
              />

              <div className="space-y-2">
                <Label className="text-b2" htmlFor="dueDate">
                  Payment Due Date
                </Label>
                <Controller
                  name="dueDate"
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      side="top"
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Pick a date"
                      className="h-12 text-b2 w-full"
                      disablePastDates={true}
                      error={!!errors.dueDate?.message}
                    />
                  )}
                />
                <FormErrorMessage message={errors.dueDate?.message} />
              </div>
              <TextInput label="Invoice Number" {...register('invoiceNumber')} error={errors.invoiceNumber?.message} />
              <SelectField
                control={control}
                name="paymentStatus"
                label="Payment Status"
                options={[
                  { label: 'Paid', value: 'paid' },
                  { label: 'Pending', value: 'pending' },
                  { label: 'Overdue', value: 'overdue' },
                  { label: 'Cancelled', value: 'cancelled' },
                ]}
                placeholder="Select payment status"
              />
            </div>
            <div className="mt-6">
              <Label className="text-b2 mb-2" htmlFor="feeNotes">
                Fee Notes
              </Label>
              <Editor
                apiKey={process.env.NEXT_PUBLIC_TINY_EDITOR_KEY}
                value={feeNotes}
                onEditorChange={handleEditorChange}
                init={{
                  height: 300,
                  menubar: false,
                  toolbar:
                    'undo redo | blocks | bold italic forecolor | alignleft aligncenter ' +
                    'alignright alignjustify | bullist numlist outdent indent',
                  promotion: false,
                  branding: false,
                }}
              />
              {errors.feeNotes && <FormErrorMessage message={errors.feeNotes.message} />}
            </div>
          </>
        </FormAccordion>

        {/* Accounts */}
        <FormAccordion value="item-4" title="Accounts">
          <>
            {' '}
            <div className="grid grid-cols-3 gap-6">
              <SelectField
                control={control}
                name="accountPaymentPlan"
                label="Account Payment Plan"
                options={[
                  { label: 'Monthly', value: 'monthly' },
                  { label: 'Quarterly', value: 'quarterly' },
                  { label: 'Annually', value: 'annually' },
                  { label: 'One-time', value: 'one-time' },
                ]}
                placeholder="Select payment plan"
              />
              <TextInput
                label="Commission"
                type="number"
                {...register('commission', { valueAsNumber: true })}
                error={errors.commission?.message}
              />
              <TextInput
                label="Account Amount"
                type="number"
                {...register('accountAmount', { valueAsNumber: true })}
                error={errors.accountAmount?.message}
              />
              <TextInput
                label="Discount (Optional)"
                type="number"
                {...register('discount', { valueAsNumber: true })}
                error={errors.discount?.message}
              />
              <TextInput
                label="Bonus (Optional)"
                type="number"
                {...register('bonus', { valueAsNumber: true })}
                error={errors.bonus?.message}
              />
              <TextInput
                label="Net Amount"
                type="number"
                {...register('netAmount', { valueAsNumber: true })}
                error={errors.netAmount?.message}
              />

              <div className="space-y-2">
                <Label className="text-b2" htmlFor="accountDueDate">
                  Account Due Date
                </Label>
                <Controller
                  name="accountDueDate"
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      side="top"
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Pick a date"
                      className="h-12 text-b2 w-full"
                      disablePastDates={true}
                      error={!!errors.accountDueDate?.message}
                    />
                  )}
                />
                <FormErrorMessage message={errors.accountDueDate?.message} />
              </div>
              <TextInput
                label="Account Invoice Number"
                {...register('accountInvoiceNumber')}
                error={errors.accountInvoiceNumber?.message}
              />
              <SelectField
                control={control}
                name="commissionStatus"
                label="Commission Status"
                options={[
                  { label: 'Paid', value: 'paid' },
                  { label: 'Pending', value: 'pending' },
                  { label: 'Processing', value: 'processing' },
                  { label: 'Cancelled', value: 'cancelled' },
                ]}
                placeholder="Select commission status"
              />
            </div>
            <div className="mt-5">
              <TextInput
                label="Account Notes (Optional)"
                {...register('accountNotes')}
                error={errors.accountNotes?.message}
              />
            </div>
          </>
        </FormAccordion>

        {/* Misc */}
        <FormAccordion value="item-5" title="Misc">
          <div className="grid grid-cols-2 gap-6">
            <SelectField
              control={control}
              name="assignedTo"
              label="Assigned To"
              options={[
                { label: 'John Doe', value: 'john-doe' },
                { label: 'Jane Smith', value: 'jane-smith' },
                { label: 'Mike Johnson', value: 'mike-johnson' },
                { label: 'Sarah Wilson', value: 'sarah-wilson' },
              ]}
              placeholder="Select assignee"
            />
            <SelectField
              control={control}
              name="source"
              label="Source"
              options={[
                { label: 'Website', value: 'website' },
                { label: 'Referral', value: 'referral' },
                { label: 'Social Media', value: 'social-media' },
                { label: 'Advertisement', value: 'advertisement' },
                { label: 'Walk-in', value: 'walk-in' },
              ]}
              placeholder="Select source"
            />
            <div className="col-span-2">
              <TextInput
                label="Additional Notes (Optional)"
                {...register('additionalNotes')}
                error={errors.additionalNotes?.message}
              />
            </div>
          </div>
        </FormAccordion>
      </Accordion>

      <div className="flex justify-start mt-6">
        <Button type="submit" variant="primary">
          Add Student
        </Button>
        <Button type="button" variant="outline" className="ml-3">
          Cancel
        </Button>
      </div>
    </form>
  );
}
