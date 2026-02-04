'use client';

import { useMemo } from 'react';
import { FormField } from '@/components/ui/form';
import { useFormContext } from 'react-hook-form';
import type { LeadSchemaType } from '@/schema/lead-schema';

import { Label } from '@/components/ui/label';
import countryList from 'react-select-country-list';
import { useGetVisa, useGetVisaConst } from '@/query/get-visa';
import { DatePicker } from '@/components/organisms/date-picker';
import SelectWithCommand from '@/components/molecules/select-with-command';
import MultiSelect from '@/components/molecules/multi-select';
import { Services } from '@/constants/lead-constants';
import Input from '@/components/molecules/input';
import { useGetOccupations } from '@/query/get-occupations';
import SelectCommon from '@/components/molecules/select-common';
const STATUS_OPTIONS = [
  { value: 'New', label: 'New' },
  { value: 'Converted', label: 'Converted' },
  { value: 'Not Converted', label: 'Not Converted' },
  { value: 'Follow Up', label: 'Follow Up' },
];
const VisaAndServiceStep = () => {
  const {
    control,
    formState: { errors },
    setValue,
  } = useFormContext<LeadSchemaType>();
  const { data: occupations } = useGetOccupations();

  const servicesOptions = Object.values(Services).map((service) => {
    return {
      label: service,
      value: service,
    };
  });

  const ANZSCOOccupationOptions = useMemo(() => {
    return occupations?.map((occupation) => {
      const value = occupation.code;
      const label = occupation.title + ' - ' + occupation.code;
      return {
        value,
        label,
      };
    });
  }, [occupations]);

  const { data: visas } = useGetVisaConst();

  const visaOptions = useMemo(() => {
    if (!!visas?.length) {
      return visas.map((visa) => {
        return {
          label: visa.visaType,
          value: visa.visaType,
        };
      });
    }
  }, [visas]);

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-3 gap-6">
        <FormField
          control={control}
          name="visa"
          render={({ field }) => (
            <SelectWithCommand
              options={visaOptions || []}
              value={field.value ?? undefined}
              label="Visa"
              onSelect={(val) => field.onChange(val)}
              error={errors.visa?.message}
            />
          )}
        />
        <FormField
          control={control}
          name="visaExpiry"
          render={({ field }) => (
            <div className=" flex flex-col gap-2 flex-1">
              <Label className="text-b3-b font-semibold">Visa expiry date</Label>
              <DatePicker
                side="top"
                value={field.value || undefined}
                onChange={(date) => setValue('visaExpiry', date)}
                placeholder="DD/MM/YYYY"
                className="h-12 text-b2 w-full"
                error={!!errors.visaExpiry?.message}
                disablePastDates={true}
              />
            </div>
          )}
        />
        <FormField
          control={control}
          name="serviceType"
          render={({ field }) => (
            <MultiSelect
              options={servicesOptions}
              value={field.value}
              label="Service type"
              onSelect={(val) => field.onChange(val)}
              error={errors.serviceType?.message}
            />
          )}
        />
        <FormField
          control={control}
          name="anzsco"
          render={({ field }) => (
            <SelectWithCommand
              options={ANZSCOOccupationOptions || []}
              value={field.value || undefined}
              label="ANZSCO / Occupation"
              onSelect={(val) => {
                field.onChange(val);
                const occupation = occupations?.find((occupation) => occupation.code === val);
                setValue('occupation', occupation?.title, { shouldValidate: false });
              }}
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

        <FormField
          control={control}
          name="status"
          render={({ field }) => (
            <SelectCommon
              options={STATUS_OPTIONS}
              value={field.value}
              label="Status"
              triggerClassName="w-full"
              onSelect={(val) => field.onChange(val)}
              error={errors.status?.message}
            />
          )}
        />
      </div>
    </div>
  );
};

export default VisaAndServiceStep;
