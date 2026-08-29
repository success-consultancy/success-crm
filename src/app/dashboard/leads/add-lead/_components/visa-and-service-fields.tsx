'use client';

import { useMemo } from 'react';
import { FormField } from '@/components/ui/form';
import { useFormContext } from 'react-hook-form';
import type { LeadSchemaType } from '@/schema/lead-schema';
import { isBlankValue } from '@/schema/dependent-fields';

import countryList from 'react-select-country-list';
import { useGetVisaOptions } from '@/query/get-visa';
import { DatePicker } from '@/components/organisms/date-picker';
import SelectWithCommand from '@/components/molecules/select-with-command';
import MultiSelect from '@/components/molecules/multi-select';
import { Services } from '@/constants/lead-constants';
import Input from '@/components/molecules/input';
import { useGetOccupations } from '@/query/get-occupations';
import SelectCommon from '@/components/molecules/select-common';
import { LeadStatusTypes } from '@/types/response-types/leads-response';

const STATUS_OPTIONS = Object.values(LeadStatusTypes).map((value) => ({ value, label: value }));
const VisaAndServiceStep = () => {
  const {
    control,
    formState: { errors },
    setValue,
    watch,
  } = useFormContext<LeadSchemaType>();

  // A visa expiry only means something once a visa has been picked.
  const hasVisa = !isBlankValue(watch('visa'));
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

  const visaOptions = useGetVisaOptions();

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <FormField
          control={control}
          name="visa"
          render={({ field }) => (
            <SelectWithCommand
              options={visaOptions}
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
            <DatePicker
              label="Visa expiry date"
              side="top"
              value={field.value || undefined}
              onChange={(date) => setValue('visaExpiry', date)}
              placeholder="DD/MM/YYYY"
              className="w-full"
              error={errors.visaExpiry?.message}
              disabled={!hasVisa}
              disablePastDates={true}
            />
          )}
        />
        <FormField
          control={control}
          name="serviceType"
          render={({ field }) => (
            <MultiSelect
              options={servicesOptions}
              value={field.value ?? []}
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
              value={field.value as any}
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
