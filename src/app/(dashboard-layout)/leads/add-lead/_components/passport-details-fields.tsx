'use client';

import { useMemo } from 'react';
import Input from '@/components/molecules/input';
import { FormField } from '@/components/ui/form';
import type { LeadSchemaType } from '@/schema/lead-schema';
import { useFormContext } from 'react-hook-form';

import { Label } from '@/components/ui/label';
import { DatePicker } from '@/components/organisms/date-picker';
import countryList from 'react-select-country-list';
import SelectWithCommand from '@/components/molecules/select-with-command';
import { useGetVisa } from '@/query/get-visa';
import { format } from 'date-fns';

const PassportDetailsStep = () => {
  const {
    control,
    formState: { errors },
    setValue,
  } = useFormContext<LeadSchemaType>();

  const countries = useMemo(
    () =>
      countryList()
        .getData()
        .map((country) => {
          return { label: country.label, value: country.label };
        }),
    [],
  );

  const { data: visas } = useGetVisa();

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
      <div className="flex items-center gap-5">
        <FormField
          control={control}
          name="country"
          render={({ field }) => (
            <SelectWithCommand
              options={countries || []}
              value={field.value ?? undefined}
              label="Country"
              onSelect={(val) => field.onChange(val)}
              error={errors.country?.message}
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
      </div>
      <div className="flex items-center gap-5">
        <FormField
          control={control}
          name="issueDate"
          render={({ field }) => (
            <div className=" flex flex-col gap-2 flex-1">
              <Label className="text-b3-b font-semibold">Issue Date</Label>
              <DatePicker
                side="top"
                value={field.value || undefined}
                onChange={(date) => setValue('issueDate', date)}
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
              <Label className="text-b3-b font-semibold">Expiry Date</Label>
              <DatePicker
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
      </div>
      <div className="flex items-center gap-5">
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
              <Label className="text-b3-b font-semibold">Visa Expiry Date</Label>
              <DatePicker
                side="top"
                value={field.value || undefined}
                onChange={(date) => setValue('visaExpiry', date)}
                placeholder="DD/MM/YYYY"
                className="h-12 text-b2 w-full"
                error={!!errors.visaExpiry?.message}
              />
            </div>
          )}
        />
      </div>
    </div>
  );
};

export default PassportDetailsStep;
