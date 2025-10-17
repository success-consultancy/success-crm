import { Accordion } from '@/components/ui/accordion';
import {
  educationServiceDefaultValues,
  educationServiceSchema,
  EducationServiceType,
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
import { useAddEducationService } from '@/mutations/education/add-education';
import toast from 'react-hot-toast';
import { useGetSource } from '@/query/get-source';

export function AddEducationService() {
  const form = useForm<EducationServiceType>({
    resolver: zodResolver(educationServiceSchema),
    defaultValues: educationServiceDefaultValues,
    mode: 'onBlur',
  });

  const { data, isLoading } = useGetSource();

  const {
    register,
    control,
    watch,
    setValue,
    formState: { errors },
  } = form;

  const remarks = watch('remarks');
  const handleEditorChange = (content: string) => {
    setValue('remarks', content, { shouldValidate: true });
  };

  const { mutate, isPending } = useAddEducationService();
  const submitHandler = (data: EducationServiceType) => {
    console.log(data);
    mutate(
      { payload: data },
      {
        onSuccess: () => {
          toast.success('Student added successfully');
          form.reset();
        },
      },
    );
  };

  return (
    <form className="w-full" onSubmit={form.handleSubmit(submitHandler)}>
      <Accordion type="multiple" className="w-full space-y-6" defaultValue={['item-1']}>
        {/* Personal Details */}
        <FormAccordion value="item-1" title="Personal Details">
          <div className="grid grid-cols-3 gap-6">
            <TextInput label="First Name" {...register('firstName')} error={errors.firstName?.message} />
            <TextInput label="Middle Name" {...register('middleName')} error={errors.middleName?.message} />
            <TextInput label="Last Name" {...register('lastName')} error={errors.lastName?.message} />
            <div className="space-y-2">
              <Label className="text-b2" htmlFor="dob">
                Birth Date
              </Label>
              <Controller
                name="dob"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    error={!!errors.dob?.message}
                    side="top"
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Pick a date"
                    className={cn('h-12 text-b2 w-full')}
                    disableFutureDates={true}
                  />
                )}
              />
              <FormErrorMessage message={errors.dob?.message} />
            </div>
            <TextInput type="email" label="Email" {...register('email')} error={errors.email?.message} />
            <TextInput label="Phone Number" {...register('phone')} error={errors.phone?.message} />
            <TextInput label="Country" {...register('country')} error={errors.country?.message} />
            <TextInput label="Passport Number" {...register('passport')} error={errors.passport?.message} />

            <div className="space-y-2">
              <Label className="text-b2" htmlFor="issueDate">
                Passport Issue Date
              </Label>
              <Controller
                name="issueDate"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    side="top"
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Pick a date"
                    className="h-12 text-b2 w-full"
                    error={!!errors.issueDate?.message}
                  />
                )}
              />
              <FormErrorMessage message={errors.issueDate?.message} />
            </div>
            <div className="space-y-2">
              <Label className="text-b2" htmlFor="expiryDate">
                Passport Expiry Date
              </Label>
              <Controller
                name="expiryDate"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    side="top"
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Pick a date"
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
              placeholder="Select location"
            />
          </div>
        </FormAccordion>

        {/* Course Information */}
        <FormAccordion value="item-2" title="Course Information">
          <>
            <div className="grid grid-cols-2 gap-6">
              <SelectField
                control={control}
                name="universityId"
                label="University"
                options={[
                  { label: 'University 1', value: '1' },
                  { label: 'University 2', value: '2' },
                  { label: 'University 3', value: '3' },
                ]}
                placeholder="Select university"
              />
              <SelectField
                control={control}
                name="courseId"
                label="Course"
                options={[
                  { label: 'Course 1', value: '1' },
                  { label: 'Course 2', value: '2' },
                  { label: 'Course 3', value: '3' },
                ]}
                placeholder="Select course"
              />
            </div>
            <div className="grid grid-cols-3 gap-6 mt-6">
              <div className="space-y-2">
                <Label className="text-b2" htmlFor="startDate">
                  Start Date
                </Label>
                <Controller
                  name="startDate"
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      side="top"
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Pick a date"
                      className="h-12 text-b2 w-full"
                      disablePastDates={true}
                      error={!!errors.startDate?.message}
                    />
                  )}
                />
                <FormErrorMessage message={errors.startDate?.message} />
              </div>
              <div className="space-y-2">
                <Label className="text-b2" htmlFor="endDate">
                  End Date
                </Label>
                <Controller
                  name="endDate"
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      side="top"
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Pick a date"
                      className="h-12 text-b2 w-full"
                      disablePastDates={true}
                      error={!!errors.endDate?.message}
                    />
                  )}
                />
                <FormErrorMessage message={errors.endDate?.message} />
              </div>
              <SelectField
                control={control}
                name="status"
                label="Status"
                options={[
                  { label: 'Consultation', value: 'Consultation' },
                  { label: 'Application', value: 'Application' },
                  { label: 'Enrolled', value: 'Enrolled' },
                  { label: 'Completed', value: 'Completed' },
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
              <TextInput
                label="Plan Name"
                {...register('courseFee.planname')}
                error={errors.courseFee?.planname?.message}
              />
              <TextInput
                label="Amount"
                type="number"
                {...register('courseFee.amount', { valueAsNumber: true })}
                error={errors.courseFee?.amount?.message}
              />

              <div className="space-y-2">
                <Label className="text-b2" htmlFor="courseFee.duedate">
                  Due Date
                </Label>
                <Controller
                  name="courseFee.duedate"
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      side="top"
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Pick a date"
                      className="h-12 text-b2 w-full"
                      disablePastDates={true}
                      error={!!errors.courseFee?.duedate?.message}
                    />
                  )}
                />
                <FormErrorMessage message={errors.courseFee?.duedate?.message} />
              </div>
              <TextInput
                label="Invoice Number"
                {...register('courseFee.invoicenumber')}
                error={errors.courseFee?.invoicenumber?.message}
              />
              <SelectField
                control={control}
                name="courseFee.status"
                label="Payment Status"
                options={[
                  { label: 'Pending', value: 'Pending' },
                  { label: 'Paid', value: 'Paid' },
                  { label: 'Overdue', value: 'Overdue' },
                  { label: 'Cancelled', value: 'Cancelled' },
                ]}
                placeholder="Select payment status"
              />
              <TextInput
                label="Updated By"
                {...register('courseFee.updatedBy')}
                error={errors.courseFee?.updatedBy?.message}
              />
            </div>
            <div className="mt-6">
              <Label className="text-b2 mb-2" htmlFor="courseFee.note">
                Fee Notes
              </Label>
              <Editor
                apiKey={process.env.NEXT_PUBLIC_TINY_EDITOR_KEY}
                value={remarks}
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
              {errors.remarks && <FormErrorMessage message={errors.remarks.message} />}
            </div>
          </>
        </FormAccordion>

        {/* Accounts */}
        <FormAccordion value="item-4" title="Accounts">
          <>
            <div className="grid grid-cols-3 gap-6">
              <TextInput
                label="Plan Name"
                {...register('courseFee.accounts.planname')}
                error={errors.courseFee?.accounts?.planname?.message}
              />
              <TextInput
                label="Amount"
                {...register('courseFee.accounts.amount')}
                error={errors.courseFee?.accounts?.amount?.message}
              />
              <div className="space-y-2">
                <Label className="text-b2" htmlFor="courseFee.accounts.duedate">
                  Due Date
                </Label>
                <Controller
                  name="courseFee.accounts.duedate"
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      side="top"
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Pick a date"
                      className="h-12 text-b2 w-full"
                      disablePastDates={true}
                      error={!!errors.courseFee?.accounts?.duedate?.message}
                    />
                  )}
                />
                <FormErrorMessage message={errors.courseFee?.accounts?.duedate?.message} />
              </div>
              <TextInput
                label="Invoice Number"
                {...register('courseFee.accounts.invoicenumber')}
                error={errors.courseFee?.accounts?.invoicenumber?.message}
              />
              <SelectField
                control={control}
                name="courseFee.accounts.status"
                label="Status"
                options={[
                  { label: 'Pending', value: 'Pending' },
                  { label: 'Paid', value: 'Paid' },
                  { label: 'Processing', value: 'Processing' },
                  { label: 'Cancelled', value: 'Cancelled' },
                ]}
                placeholder="Select status"
              />
              <TextInput
                label="Commission"
                {...register('courseFee.accounts.comission')}
                error={errors.courseFee?.accounts?.comission?.message}
              />
              <TextInput
                label="Discount (Optional)"
                {...register('courseFee.accounts.discount')}
                error={errors.courseFee?.accounts?.discount?.message}
              />
              <TextInput
                label="Bonus (Optional)"
                {...register('courseFee.accounts.bonus')}
                error={errors.courseFee?.accounts?.bonus?.message}
              />
              <TextInput
                label="Net Amount"
                {...register('courseFee.accounts.netamount')}
                error={errors.courseFee?.accounts?.netamount?.message}
              />
              <TextInput
                label="Updated By"
                {...register('courseFee.accounts.updatedBy')}
                error={errors.courseFee?.accounts?.updatedBy?.message}
              />
            </div>
          </>
        </FormAccordion>

        {/* Misc */}
        <FormAccordion value="item-5" title="Misc">
          <div className="grid grid-cols-2 gap-6">
            <SelectField
              control={control}
              name="userId"
              label="Assigned To"
              options={[
                { label: 'John Doe', value: '1' },
                { label: 'Jane Smith', value: '2' },
                { label: 'Mike Johnson', value: '3' },
                { label: 'Sarah Wilson', value: '4' },
              ]}
              placeholder="Select assignee"
            />
            <SelectField
              control={control}
              name="sourceId"
              label="Source"
              options={[
                { label: 'Website', value: '1' },
                { label: 'Referral', value: '2' },
                { label: 'Social Media', value: '3' },
                { label: 'Advertisement', value: '4' },
                { label: 'Walk-in', value: '5' },
              ]}
              placeholder="Select source"
            />
            <div className="col-span-2">
              <TextInput label="Remarks (Optional)" {...register('remarks')} error={errors.remarks?.message} />
            </div>
          </div>
        </FormAccordion>
      </Accordion>

      <div className="flex justify-start mt-6">
        <Button loading={isPending} loadingText="Processing" type="submit" variant="primary">
          Add Student
        </Button>
        <Button type="button" variant="outline" className="ml-3">
          Cancel
        </Button>
      </div>
    </form>
  );
}
