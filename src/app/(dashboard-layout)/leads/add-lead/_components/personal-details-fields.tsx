import React, { useEffect, useMemo } from 'react';
import Input from '@/components/molecules/input';
import { FormField } from '@/components/ui/form';
import { LeadSchemaType } from '@/schema/lead-schema';
import { useFormContext } from 'react-hook-form';

import { format } from 'date-fns';
import { Label } from '@/components/ui/label';
import DatePicker from '@/components/atoms/date-picker';
import { useGetOccupations } from '@/query/get-occupations';
import SelectWithCommand from '@/components/molecules/select-with-command';

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
          render={({ field }) => <Input label={'First Name*'} {...field} error={errors.firstName?.message} />}
        />
        <FormField
          control={control}
          name="middleName"
          render={({ field }) => (
            <Input label={'Middle Name'} {...field} error={errors.middleName?.message} optionalText />
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
                mode="single"
                selected={!!field.value ? new Date(field.value) : undefined}
                onSelect={(date) => {
                  console.log(date);
                  
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
            <Input label={'Address'} className="flex-1" {...field} error={errors.address?.message} optionalText />
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
              value={field.value}
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
              value={field.value}
              label="ANZSCO"
              onSelect={(val) => field.onChange(val)}
            />
          )}
        />
        <FormField
          control={control}
          name="qualification"
          render={({ field }) => (
            <Input {...field} label="Qualification*" error={errors.qualification?.message} className="flex-1" />
          )}
        />
      </div>
    </div>
  );
};

export default PersonalDetailsStep;
