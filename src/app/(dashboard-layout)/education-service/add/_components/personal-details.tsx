'use client';

import { Controller, useFormContext } from 'react-hook-form';
import TextInput from '@/components/molecules/text-input';
import { Label } from '@/components/ui/label';
import { DatePicker } from '@/components/organisms/date-picker';
import FormErrorMessage from '@/components/atoms/form-error-message';
import SelectField from '@/components/organisms/select-field';
import { cn } from '@/lib/utils';
import type { NewStudentType } from '@/schema/education-service/new-student.schema';

const PersonalDetails = () => {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<NewStudentType>();

  return (
    <div>
      <div className="px-6 py-4 font-bold text-xl border-b">Personal Details</div>
      <div className="px-6 py-6">
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
                  disablePastDates={false}
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
                  disablePastDates={true}
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
                  disablePastDates={true}
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
      </div>
    </div>
  );
};

export default PersonalDetails;
