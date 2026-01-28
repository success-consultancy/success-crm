'use client';

import { useEffect, useMemo } from 'react';
import Input from '@/components/molecules/input';
import { FormField } from '@/components/ui/form';
import type { LeadSchemaType } from '@/schema/lead-schema';
import { useFormContext } from 'react-hook-form';

import { format } from 'date-fns';
import { Label } from '@/components/ui/label';
import { useGetOccupations } from '@/query/get-occupations';
import { DatePicker } from '@/components/organisms/date-picker';
import SelectCommon from '@/components/molecules/select-common';
import { Location, Services } from '@/constants/lead-constants';
import { CountryDropdown } from '@/components/organisms/country-dropdown';

const PersonalDetailsStep = () => {
  const {
    control,
    formState: { errors },
    setValue,
    watch,
  } = useFormContext<LeadSchemaType>();

  const { data: occupations } = useGetOccupations();
  const locationOptions = Object.values(Location).map((location) => {
    return {
      label: location,
      value: location,
    };
  });

  const [selectedOccupation, selectedANZSCO] = watch(['occupation', 'anzsco']);

  useEffect(() => {
    if (selectedOccupation) {
      const selected = occupations?.find((occupation) => occupation.title === selectedOccupation);
      setValue('anzsco', selected?.code, { shouldValidate: false });
    }
  }, [selectedOccupation, occupations, setValue]);

  useEffect(() => {
    if (selectedANZSCO) {
      const selected = occupations?.find((occupation) => occupation.code === selectedANZSCO);
      setValue('occupation', selected?.title, { shouldValidate: false });
    }
  }, [selectedANZSCO, occupations, setValue]);

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
            <div className=" flex flex-col gap-2 flex-1">
              <Label className="text-b3-b font-semibold">Date of birth</Label>
              <DatePicker
                side="top"
                value={!!field.value ? new Date(field.value) : undefined}
                onChange={(date) => {
                  if (date) field.onChange(format(date, 'MM/dd/yyyy'));
                }}
                placeholder="DD/MM/YYYY"
                className="h-12 text-b2 w-full"
                error={!!errors.dob?.message}
              />
            </div>
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
          render={({ field }) => <Input {...field} label="Phone number" error={errors.phone?.message} />}
        />
        <FormField
          control={control}
          name="country"
          render={({ field }) => (
            <div className="space-y-2">
              <CountryDropdown
                label="Country"
                onChange={(country) => field.onChange(country?.alpha3 || null)}
                defaultValue={field.value || undefined}
                placeholder="Select a country"
                error={errors.country?.message}
              />
            </div>
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
              type="number"
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
            <div className=" flex flex-col gap-2 flex-1">
              <DatePicker
                side="top"
                value={field.value || undefined}
                onChange={(date) => setValue('issueDate', date)}
                label='Passport issue date'
                placeholder="DD/MM/YYYY"
                className="h-12 text-b2 w-full"
                error={!!errors.issueDate?.message}
              />
            </div>
          )}
        />
        <FormField
          control={control}
          name="expiryDate"
          render={({ field }) => (
            <div className=" flex flex-col gap-2 flex-1">
              <DatePicker
                label='Passport expiry date'
                side="top"
                value={field.value || undefined}
                onChange={(date) => setValue('expiryDate', date)}
                placeholder="DD/MM/YYYY"
                className="h-12 text-b2 w-full"
                error={!!errors.expiryDate?.message}
              />
            </div>
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
