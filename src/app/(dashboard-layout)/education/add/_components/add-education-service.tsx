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
import { useGetUniversity } from '@/query/get-university';
import ComboboxField from '@/components/organisms/combobox-field';
import { useGetCourse } from '@/query/get-course';
import { useEffect, useMemo } from 'react';
import TinyEditor from '@/components/organisms/text-editor';
import { FormField } from '@/components/ui/form';
import SelectWithCommand from '@/components/molecules/select-with-command';
import { useGetUsers } from '@/query/get-user';
import countryList from 'react-select-country-list';
import { CountryDropdown } from '@/components/organisms/country-dropdown';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/config/routes';

interface Props {
  userId: number | undefined;
}

export function AddEducationService({ userId }: Props) {
  const form = useForm<EducationServiceType>({
    resolver: zodResolver(educationServiceSchema),
    defaultValues: educationServiceDefaultValues,
    mode: 'onChange',
  });
  const router = useRouter()

  const { data: sourceData, isLoading: sourceLoading } = useGetSource();
  const { data: universityData, isLoading: universityLoading } = useGetUniversity();

  const {
    register,
    control,
    watch,
    setValue,
    formState: { errors },
  } = form;

  const remarks = watch('remarks');

  useEffect(() => {
    form.setValue('courseFee.accounts.updatedBy', userId?.toString() || '', { shouldValidate: true });
    form.setValue('courseFee.updatedBy', userId?.toString() || '', { shouldValidate: true });
    return () => {
      form.setValue('courseFee.accounts.updatedBy', '', { shouldValidate: true });
      form.setValue('courseFee.updatedBy', '', { shouldValidate: true });
    };
  }, [userId]);

  const universityId = form.watch('universityId');
  const { data: courseData, isLoading: courseLoading } = useGetCourse(Number(universityId));

  const handleFeeStructureEditorChange = (content: string) => {
    setValue('courseFee.note', content, { shouldValidate: true });
  };

  const handleMiscEditorChange = (content: string) => {
    setValue('remarks', content, { shouldValidate: true });
  };

  const { mutate, isPending } = useAddEducationService();
  const submitHandler = (data: EducationServiceType) => {
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

  const planName = watch('courseFee.planname');
  const amount = watch('courseFee.amount');
  const dueDate = watch('courseFee.duedate');
  const invoiceNumber = watch('courseFee.invoicenumber');
  const paymentStatus = watch('courseFee.status');

  // FOr calculation
  const comissionPercent = watch('courseFee.accounts.comission');
  const discount = watch('courseFee.accounts.discount');
  const bonus = watch('courseFee.accounts.bonus');

  useEffect(() => {
    if (!comissionPercent && !discount && !bonus) {
      setValue('courseFee.accounts.netamount', amount.toString());
      return;
    }
    const comissionAAmount = (Number(amount) * (Number(comissionPercent) || 0)) / 100;
    const netAmount = comissionAAmount - (Number(discount) || 0) + (Number(bonus) || 0);
    setValue('courseFee.accounts.netamount', netAmount.toString());
  }, [amount, comissionPercent, discount, bonus, setValue]);

  useEffect(() => {
    if (userId) {
      setValue('courseFee.accounts.planname', planName);
      setValue('courseFee.accounts.amount', amount.toString());
      setValue('courseFee.accounts.duedate', dueDate);
      setValue('courseFee.accounts.invoicenumber', invoiceNumber);
      setValue('courseFee.accounts.status', paymentStatus);
    }
  }, [planName, amount, dueDate, invoiceNumber, paymentStatus, setValue]);

  const { data: users } = useGetUsers();

  const userOptions = useMemo(() => {
    if (users) {
      return users?.map((user) => {
        return {
          label: user.firstName + '' + user.lastName,
          value: '' + user.id,
        };
      });
    }
  }, [users]);

  const countries = useMemo(
    () =>
      countryList()
        .getData()
        .map((country) => {
          return { label: country.label, value: country.label };
        }),
    [],
  );

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
            <FormField
              control={control}
              name="country"
              render={({ field }) => (
                <div className="space-y-2">
                  <Label className="text-b2">Country</Label>
                  <CountryDropdown
                    onChange={(country) => field.onChange(country?.alpha3 || null)}
                    defaultValue={field.value || undefined}
                    placeholder="Select a country"
                  />
                  {errors.country?.message && <FormErrorMessage message={errors.country?.message} />}
                </div>
              )}
            />
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
                    disableFutureDates={true}
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
                    disablePastDates={true}
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
              <ComboboxField
                control={control}
                name="universityId"
                label="University"
                options={
                  universityData?.map((university) => ({
                    label: university.name,
                    value: university.id.toString(),
                  })) || []
                }
                placeholder="Select university"
              />
              <ComboboxField
                control={control}
                name="courseId"
                label="Course"
                options={
                  courseData?.map((course) => ({
                    label: course.name,
                    value: course.id.toString(),
                  })) || []
                }
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
            </div>
            <div className="mt-6">
              <Label className="text-b2 mb-2" htmlFor="courseFee.note">
                Fee Notes
              </Label>

              <TinyEditor value={watch('courseFee.note')} onChange={handleFeeStructureEditorChange} />

              {errors.remarks && <FormErrorMessage message={errors.remarks.message} />}
            </div>
          </>
        </FormAccordion>

        {/* Accounts */}
        <FormAccordion value="item-4" title="Accounts">
          <>
            <div className="grid grid-cols-3 gap-6">
              <TextInput disabled label="Plan Name" {...register('courseFee.accounts.planname')} />
              <TextInput label="Amount" disabled {...register('courseFee.accounts.amount')} />
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
                      disabled
                    />
                  )}
                />
                <FormErrorMessage message={errors.courseFee?.accounts?.duedate?.message} />
              </div>
              <TextInput label="Invoice Number" {...register('courseFee.accounts.invoicenumber')} disabled />
              <SelectField
                disabled
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
                label="Commission (%)"
                {...register('courseFee.accounts.comission')}
                error={errors.courseFee?.accounts?.comission?.message}
              />
              <TextInput
                label="Discount Amount (Optional)"
                {...register('courseFee.accounts.discount')}
                error={errors.courseFee?.accounts?.discount?.message}
              />
              <TextInput
                label="Bonus Amount (Optional)"
                {...register('courseFee.accounts.bonus')}
                error={errors.courseFee?.accounts?.bonus?.message}
              />
              <TextInput
                disabled
                label="Net Amount"
                {...register('courseFee.accounts.netamount')}
                error={errors.courseFee?.accounts?.netamount?.message}
              />
            </div>
          </>
        </FormAccordion>

        {/* Misc */}
        <FormAccordion value="item-5" title="Misc">
          <div className="grid grid-cols-2 gap-6">
            <FormField
              control={control}
              name="userId"
              render={({ field }) => (
                <SelectWithCommand
                  options={userOptions || []}
                  value={field.value?.toString()}
                  label="Assigned to"
                  placeholder="Select a assignee"
                  onSelect={(val) => field.onChange(val)}
                  error={errors.userId?.message}
                />
              )}
            />
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
              placeholder="Select source"
            />
            <div className="col-span-2">
              <div className="w-full space-y-1" suppressHydrationWarning>
                <Label className="text-b3-b font-semibold">Note</Label>

                <TinyEditor value={remarks} onChange={handleMiscEditorChange} />
                {errors.remarks?.message && <p className="text-sm text-red-500">{errors.remarks.message}</p>}
              </div>
            </div>
          </div>
        </FormAccordion>
      </Accordion>

      <div className="flex justify-start mt-6">
        <Button loading={isPending} loadingText="Processing" type="submit" variant="primary">
          Add Student
        </Button>
        <Button type="button" variant="outline" className="ml-3" onClick={() => router.push(ROUTES.EDUCATION)}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
