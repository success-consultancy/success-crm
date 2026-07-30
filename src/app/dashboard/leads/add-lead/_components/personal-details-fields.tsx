'use client';

import { useEffect, useMemo } from 'react';
import Input from '@/components/molecules/input';
import { PhoneNumberInput } from '@/components/molecules/phone-number-input';
import { FormField } from '@/components/ui/form';
import type { LeadSchemaType } from '@/schema/lead-schema';
import { useFormContext } from 'react-hook-form';

import { format } from 'date-fns';
import { DatePicker } from '@/components/organisms/date-picker';
import SelectCommon from '@/components/molecules/select-common';
import { Location, Services } from '@/constants/lead-constants';
import { CountryDropdown } from '@/components/organisms/country-dropdown';

const PersonalDetailsStep = () => {
  const {
    control,
    formState: { errors },
    setValue,
  } = useFormContext<LeadSchemaType>();

  const locationOptions = Object.values(Location).map((location) => {
    return {
      label: location,
      value: location,
    };
  });

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-3 gap-6">
        <FormField
          control={control}
          name="firstName"
          render={({ field }) => <Input label={'First name'} {...field} error={errors.firstName?.message} />}
        />
        <FormField
          control={control}
          name="middleName"
          render={({ field }) => (
            <Input
              label={'Middle name'}
              {...field}
              error={errors.middleName?.message}
              optionalText
              value={field.value ?? undefined}
            />
          )}
        />
        <FormField
          control={control}
          name="lastName"
          render={({ field }) => <Input label={'Last name'} {...field} error={errors.lastName?.message} />}
        />
        <FormField
          control={control}
          name="dob"
          render={({ field }) => (
            <DatePicker
              label="Date of birth"
              side="top"
              value={!!field.value ? new Date(field.value) : undefined}
              onChange={(date) => {
                if (date) field.onChange(format(date, 'MM/dd/yyyy'));
              }}
              placeholder="DD/MM/YYYY"
              className="w-full"
              error={errors.dob?.message}
            />
          )}
        />
        <FormField
          control={control}
          name="email"
          render={({ field }) => <Input {...field} label="Email address" error={errors.email?.message} />}
        />
        <FormField
          control={control}
          name="phone"
          render={({ field }) => (
            <PhoneNumberInput label="Phone number" value={field.value} onChange={field.onChange} error={errors.phone?.message} />
          )}
        />
        <FormField
          control={control}
          name="country"
          render={({ field }) => (
            <CountryDropdown
              label="Country"
              onChange={(country) => field.onChange(country?.alpha3 || null)}
              defaultValue={field.value || undefined}
              placeholder="Select a country"
              error={errors.country?.message}
            />
          )}
        />
        <FormField
          control={control}
          name="address"
          render={({ field }) => (
            <Input
              label={'Address'}
              className="flex-1"
              {...field}
              value={field.value ?? undefined}
              error={errors.address?.message}
              optionalText
            />
          )}
        />

        <FormField
          control={control}
          name="passport"
          render={({ field }) => (
            <Input
              type="text"
              label={'Passport number'}
              className="flex-1"
              {...field}
              value={field.value ?? undefined}
              error={errors.passport?.message}
            />
          )}
        />
        <FormField
          control={control}
          name="issueDate"
          render={({ field }) => (
            <DatePicker
              side="top"
              value={field.value || undefined}
              onChange={(date) => setValue('issueDate', date)}
              label="Passport issue date"
              placeholder="DD/MM/YYYY"
              className="w-full"
              error={!!errors.issueDate?.message}
              disableFutureDates={true}
            />
          )}
        />
        <FormField
          control={control}
          name="expiryDate"
          render={({ field }) => (
            <DatePicker
              label="Passport expiry date"
              side="top"
              value={field.value || undefined}
              onChange={(date) => setValue('expiryDate', date)}
              placeholder="DD/MM/YYYY"
              className="w-full"
              error={!!errors.expiryDate?.message}
              disablePastDates={true}
            />
          )}
        />

        <FormField
          control={control}
          name="location"
          render={({ field }) => (
            <SelectCommon
              triggerClassName="w-full"
              options={locationOptions}
              value={field.value || undefined}
              label="Location"
              onSelect={(val) => field.onChange(val)}
              error={errors.location?.message}
            />
          )}
        />
      </div>
    </div>
  );
};

export default PersonalDetailsStep;
