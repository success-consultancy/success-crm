'use client';

import { useEffect, useMemo } from 'react';
import Input from '@/components/molecules/input';
import { FormField } from '@/components/ui/form';
import type { LeadSchemaType } from '@/schema/lead-schema';
import { useFormContext } from 'react-hook-form';

import { format } from 'date-fns';
import { Label } from '@/components/ui/label';
import { useGetOccupations } from '@/query/get-occupations';
import SelectWithCommand from '@/components/molecules/select-with-command';
import { DatePicker } from '@/components/organisms/date-picker';

const PersonalDetailsStep = () => {
  const {
    control,
    formState: { errors },
    setValue,
    watch,
  } = useFormContext<LeadSchemaType>();

  const { data: occupations } = useGetOccupations();

  const occupationsOptions = useMemo(() => {
    return occupations?.map((occupation) => {
      return {
        value: occupation.title as string,
        label: occupation.title as string,
      };
    });
  }, [occupations]);

  const ANZSCOOptions = useMemo(() => {
    return occupations?.map((occupation) => {
      return {
        value: occupation.code as string,
        label: occupation.code as string,
      };
    });
  }, [occupations]);

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
      <div
        className="flex items-start
       w-full gap-5"
      >
        <FormField
          control={control}
          name="firstName"
          render={({ field }) => <Input label={'First Name*'} {...field} error={errors.firstName?.message} />}
        />
        <FormField
          control={control}
          name="middleName"
          render={({ field }) => (
            <Input
              label={'Middle Name'}
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
          render={({ field }) => <Input label={'Last Name*'} {...field} error={errors.lastName?.message} />}
        />
      </div>
      <div className="flex items-center gap-5">
        <FormField
          control={control}
          name="email"
          render={({ field }) => <Input {...field} label="Email*" error={errors.email?.message} />}
        />
        <FormField
          control={control}
          name="phone"
          render={({ field }) => <Input {...field} label="Phone*" error={errors.phone?.message} />}
        />
      </div>
      <div className="flex items-center gap-5 ">
        <FormField
          control={control}
          name="dob"
          render={({ field }) => (
            <div className=" flex flex-col gap-2 flex-1">
              <Label className="text-b3-b font-semibold">Birth Date</Label>
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
      </div>
      <div className="flex items-center gap-5">
        <FormField
          control={control}
          name="occupation"
          render={({ field }) => (
            <SelectWithCommand
              options={occupationsOptions || []}
              value={field.value || undefined}
              label="Occupation"
              onSelect={(val) => field.onChange(val)}
              error={errors.occupation?.message}
            />
          )}
        />
        <FormField
          control={control}
          name="anzsco"
          render={({ field }) => (
            <SelectWithCommand
              options={ANZSCOOptions || []}
              value={field.value || undefined}
              label="ANZSCO"
              onSelect={(val) => field.onChange(val)}
              error={errors.anzsco?.message}
            />
          )}
        />
        <FormField
          control={control}
          name="qualification"
          render={({ field }) => (
            <Input
              {...field}
              label="Qualification"
              error={errors.qualification?.message}
              className="flex-1"
              value={field.value ?? undefined}
            />
          )}
        />
      </div>
    </div>
  );
};

export default PersonalDetailsStep;
