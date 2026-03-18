'use client';

import { Accordion } from '@/components/ui/accordion';
import { educationServiceDefaultValues } from '@/schema/education-service/new-student.schema';
import { editEducationServiceSchema, EditEducationServiceType } from '@/schema/education-service/edit-student.schema';
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

import { useGetSource } from '@/query/get-source';
import { useGetUniversity } from '@/query/get-university';
import ComboboxField from '@/components/organisms/combobox-field';
import { useGetCourse } from '@/query/get-course';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useEditEducation } from '@/mutations/education/edit-education';
import toast from 'react-hot-toast';
import { useParams, useRouter } from 'next/navigation';
import CourseFeeComponent from '../../../_components/course_fee_component';
import { FormField } from '@/components/ui/form';
import { CountryDropdown } from '@/components/organisms/country-dropdown';
import { useGetUsers } from '@/query/get-user';
import SelectWithCommand from '@/components/molecules/select-with-command';
import TinyEditor from '@/components/organisms/text-editor';
import { useRouterOriginal } from '@/lib/navigation';
import { ROUTES } from '@/config/routes';
import Portal from '@/components/atoms/portal';
import { PortalIds } from '@/config/portal';

interface Props {
  id?: number;
  defaultValues?: EditEducationServiceType;
}

export function EditEducationService({ id: userId, defaultValues }: Props) {
  const router = useRouterOriginal();
  const form = useForm<EditEducationServiceType>({
    resolver: zodResolver(editEducationServiceSchema),
    defaultValues: defaultValues || educationServiceDefaultValues,
    mode: 'onBlur',
  });

  const { data: sourceData, isLoading: sourceLoading } = useGetSource();
  const { data: universityData, isLoading: universityLoading } = useGetUniversity();

  const {
    register,
    control,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = form;

  const remarks = watch('remarks');

  useEffect(() => {
    if (userId) {
      setValue('courseFee.accounts.updatedBy', userId.toString(), { shouldValidate: true });
      setValue('courseFee.updatedBy', userId.toString(), { shouldValidate: true });
    }
  }, [userId, setValue]);

  const universityId = form.watch('universityId');
  const { data: courseData, isLoading: courseLoading } = useGetCourse(Number(universityId));
  const editEducation = useEditEducation();
  const params = useParams<{ id: string }>();

  const handleMiscEditorChange = (content: string) => {
    setValue('remarks', content, { shouldValidate: true });
  };

  const submitHandler = (data: EditEducationServiceType) => {
    //handle update
    editEducation.mutate(
      { ...data, id: Number(params.id) },
      {
        onSuccess: () => {
          toast.success('Education updated successfully');
        },
        onError: (error: any) => {
          const message = error?.response?.data?.message;

          toast.error(message || 'Failed to update education');
        },
      },
    );
  };

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

  return (
    <form className="w-full" onSubmit={form.handleSubmit(submitHandler)}>
      <Portal rootId={PortalIds.DashboardHeader}>
        <h3 className="text-h4 text-content-heading font-bold">Edit Student</h3>
      </Portal>
      <Accordion
        type="multiple"
        className="w-full space-y-6"
        defaultValue={['item-1', 'item-2', 'item-3', 'item-4', 'item-5']}
      >
        {/* Personal Details */}
        <FormAccordion value="item-1" title="Personal Details">
          <div className="grid grid-cols-3 gap-6">
            <TextInput label="First Name" {...register('firstName')} error={errors.firstName?.message} />
            <TextInput label="Middle Name" {...register('middleName')} error={errors.middleName?.message} />
            <TextInput label="Last Name" {...register('lastName')} error={errors.lastName?.message} />
            <div className="space-y-2">
              <Controller
                name="dob"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    label="Birth Date"
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
              <Controller
                name="issueDate"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    label="Passport Issue Date"
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
              <Controller
                name="expiryDate"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    label="Passport Expiry Date"
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
                <Controller
                  name="startDate"
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      label="Start Date"
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
                <Controller
                  name="endDate"
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      label="End Date"
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

        {/* Fee and Accounts Structure */}
        <CourseFeeComponent id={params.id} />

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
              <div className="mt-6">
                <Label className="text-b2 mb-2" htmlFor="courseFee.note">
                  Note
                </Label>
                <TinyEditor value={remarks} onChange={handleMiscEditorChange} />
                {errors.remarks && <FormErrorMessage message={errors.remarks.message} />}
              </div>{' '}
            </div>
          </div>
        </FormAccordion>
      </Accordion>

      <div className="flex justify-end mt-6">
        <Button loadingText="Updating..." type="submit" variant="primary">
          Update Data
        </Button>
        <Button
          onClick={() => {
            reset();
            router.back()
          }}
          type="button"
          variant="outline"
          className="ml-3"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
