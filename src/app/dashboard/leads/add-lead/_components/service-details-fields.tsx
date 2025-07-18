import React, { useMemo } from 'react';
import { FormField } from '@/components/ui/form';
import { LeadSchemaType } from '@/schemas/lead-schema';
import { useFormContext } from 'react-hook-form';

import { Label } from '@/components/ui/label';
import TinyEditor from '@/components/common/text-editor';
import SelectCommon from '@/components/common/select-common';
import FileUploader from '@/components/common/file-uploader';
import MultiSelect from '@/components/common/multi-select';
import { Location, Services } from '@/constants/lead-constants';
import { useGetSource } from '@/query/get-source';
import { useGetUsers } from '@/query/get-user';
import SelectWithCommand from '@/components/common/select-with-command';

const STATUS_OPTIONS = [
  { value: 'New', label: 'New' },
  { value: 'Converted', label: 'Converted' },
  { value: 'Not Converted', label: 'Not Converted' },
  { value: 'Follow Up', label: 'Follow Up' },
];

const ServiceDetailsStep = () => {
  const {
    control,
    formState: { errors },
  } = useFormContext<LeadSchemaType>();

  const servicesOptions = Object.values(Services).map((service) => {
    return {
      label: service,
      value: service,
    };
  });

  const locationOptions = Object.values(Location).map((location) => {
    return {
      label: location,
      value: location,
    };
  });

  const { data: sources } = useGetSource();

  const sourceOptions = useMemo(() => {
    if (sources) {
      return sources?.map((source) => {
        return {
          label: source.name,
          value: '' + source.id,
        };
      });
    }
  }, [sources]);

  const { data: users } = useGetUsers();

  const userOptions = useMemo(() => {
    if (users) {
      return users?.map((user) => {
        return {
          label: user.firstName + '' + user.lastName,
          value: '' + user.id,
        };
      });
    }
  }, [users]);
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-5">
        <FormField
          control={control}
          name="serviceType"
          render={({ field }) => (
            <MultiSelect
              options={servicesOptions}
              value={field.value}
              label="Service Type"
              onSelect={(val) => field.onChange(val)}
              error={errors.serviceType?.message}
            />
          )}
        />
        <FormField
          control={control}
          name="location"
          render={({ field }) => (
            <SelectCommon
              options={locationOptions}
              value={field.value ?? undefined}
              label="Location"
              onSelect={(val) => field.onChange(val)}
            />
          )}
        />
        <FormField
          control={control}
          name="sourceId"
          render={({ field }) => (
            <SelectCommon
              options={sourceOptions || []}
              value={field.value?.toString()}
              label="Source"
              onSelect={(val) =>field.onChange(Number(val))}
            />
          )}
        />
      </div>
      <div className="flex items-center gap-5">
        <FormField
          control={control}
          name="userId"
          render={({ field }) => (
            <SelectWithCommand
              options={userOptions || []}
              value={field.value?.toString()}
              label="Assigned to"
              placeholder="Select a assignee"
              onSelect={(val) => field.onChange(Number(val))}
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
              onSelect={(val) => field.onChange(val)}
              error={errors.status?.message}
            />
          )}
        />
      </div>
      <div className="w-full space-y-1" suppressHydrationWarning>
        <Label className="text-b3-b font-semibold">Note</Label>

        <TinyEditor />
      </div>

      <div className="space-y-1">
        <Label className="text-b3-b font-semibold">Documents</Label>
        <FileUploader maxFileSize={20} acceptedFiles={['PDF']} />
      </div>
    </div>
  );
};

export default ServiceDetailsStep;
