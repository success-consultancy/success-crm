'use client';

import { Controller, useFormContext } from 'react-hook-form';
import TextInput from '@/components/molecules/text-input';
import SelectField from '@/components/organisms/select-field';
import type { NewStudentType } from '@/schema/education-service/new-student.schema';
import { Label } from '@/components/ui/label';
import { DatePicker } from '@/components/organisms/date-picker';
import FormErrorMessage from '@/components/atoms/form-error-message';

const CourseInfo = () => {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<NewStudentType>();

  return (
    <div>
      <div className="px-6 py-4 font-bold text-xl border-b">Course Information</div>
      <div className="px-6 py-6">
        <div className="grid grid-cols-2 gap-6">
          <TextInput label="University Name" {...register('universityName')} error={errors.universityName?.message} />
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
      </div>
    </div>
  );
};

export default CourseInfo;
