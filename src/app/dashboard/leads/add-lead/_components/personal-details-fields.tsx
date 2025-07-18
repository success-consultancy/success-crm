import React, { useEffect, useMemo } from 'react';
import Input from '@/components/common/input';
import { FormField } from '@/components/ui/form';
import { LeadSchemaType } from '@/schemas/lead-schema';
import { useFormContext } from 'react-hook-form';

import { format } from 'date-fns';
import { Label } from '@/components/ui/label';
import DatePicker from '@/components/ui/date-picker';
import SelectCommon, { ISelectOptions } from '@/components/common/select-common';
import { useGetOccupations } from '@/query/get-occupations';
import SelectWithCommand from '@/components/common/select-with-command';

const PersonalDetailsStep = () => {
  const {
    control,
    formState: { errors },
    setValue,
    watch,
    register,
    getValues
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
      setValue('anzsco', selected?.code);
    }
  }, [selectedOccupation]);

  useEffect(() => {
    if (selectedANZSCO) {
      const selected = occupations?.find((occupation) => occupation.code === selectedANZSCO);
      setValue('occupation', selected?.title);
    }
  }, [selectedANZSCO]);

  return (
    <div className="space-y-5">
      <div
        className="flex items-start
       w-full gap-5"
      >
        <FormField
          control={control}
          name="firstName"
          render={({ field }) => <Input label={'First Name*'} {...field} value={field.value ?? undefined} error={errors.firstName?.message} />}
        />
        <FormField
          control={control}
          name="middleName"
          render={({ field }) => (
            <Input label={'Middle Name'} {...field} value={field.value ?? undefined} error={errors.middleName?.message} optionalText />
          )}
        />
        <FormField
          control={control}
          name="lastName"
          render={({ field }) => <Input label={'Last Name*'} {...field} value={field.value ?? undefined} error={errors.lastName?.message} />}
        />
      </div>
      <div className="flex items-center gap-5">
        <FormField
          control={control}
          name="email"
          render={({ field }) => <Input {...field} label="Email*" value={field.value ?? undefined} error={errors.email?.message} />}
        />
        <FormField
          control={control}
          name="phone"
          render={({ field }) => <Input {...field} label="Phone*" value={field.value ?? undefined} error={errors.phone?.message} />}
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
                mode="single"
                selected={!!field.value ? new Date(field.value) : undefined}
                onSelect={(date) => {
                  if (date) field.onChange(format(date, 'MM/dd/yyyy'));
                }}
              />
            </div>
          )}
        />
        <FormField
          control={control}
          name="address"
          render={({ field }) => (
            <Input label={'Address'} className="flex-1" {...field} value={field.value ?? undefined} error={errors.address?.message} optionalText />
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
              value={field.value ?? undefined}
              label="Occupation"
              onSelect={(val) => field.onChange(val)}
            />
          )}
        />
        <FormField
          control={control}
          name="anzsco"
          render={({ field }) => (
            <SelectWithCommand
              options={ANZSCOOptions || []}
              value={field.value ?? undefined}
              label="ANZSCO"
              onSelect={(val) => field.onChange(val)}
            />
          )}
        />
        <FormField
          control={control}
          name="qualification"
          render={({ field }) => (
            <Input {...field} label="Qualification*" value={field.value ?? undefined} error={errors.qualification?.message} className="flex-1" />
          )}
        />
      </div>
    </div>
  );
};

export default PersonalDetailsStep;
