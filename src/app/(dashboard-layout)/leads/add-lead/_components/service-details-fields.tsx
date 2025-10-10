'use client';

import { useMemo } from 'react';
import { FormField } from '@/components/ui/form';
import type { LeadSchemaType } from '@/schema/lead-schema';
import { useFormContext } from 'react-hook-form';

import { Label } from '@/components/ui/label';
import TinyEditor from '@/components/organisms/text-editor';
import SelectCommon from '@/components/molecules/select-common';
import FileUploader from '@/components/organisms/file-uploader';
import MultiSelect from '@/components/molecules/multi-select';
import { Location, Services } from '@/constants/lead-constants';
import { useGetSource } from '@/query/get-source';
import { useGetUsers } from '@/query/get-user';
import SelectWithCommand from '@/components/molecules/select-with-command';

const STATUS_OPTIONS = [
  { value: 'New', label: 'New' },
  { value: 'Converted', label: 'Converted' },
  { value: 'Not Converted', label: 'Not Converted' },
  { value: 'Follow Up', label: 'Follow Up' },
];

const ServiceDetailsStep = () => {
  const {
    control,
    setValue: setLead,

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
    <div className="space-y-5 w-full">
      <div className="flex items-start w-full gap-5">
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
              triggerClassName="w-full"
              options={locationOptions}
              value={field.value || undefined}
              label="Location"
              onSelect={(val) => field.onChange(val)}
              error={errors.location?.message}
            />
          )}
        />
        <FormField
          control={control}
          name="sourceId"
          render={({ field }) => (
            <SelectCommon
              triggerClassName="w-full"
              options={sourceOptions || []}
              value={field.value?.toString()}
              label="Source"
              onSelect={(val) => field.onChange(Number(val))}
              error={errors.sourceId?.message}
            />
          )}
        />
      </div>
      <div className="flex items-start gap-5">
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
              error={errors.userId?.message}
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
      <div className="w-full space-y-1" suppressHydrationWarning>
        <Label className="text-b3-b font-semibold">Note</Label>

        <TinyEditor />
        {errors.note?.message && <p className="text-sm text-red-500">{errors.note.message}</p>}
      </div>

      <div className="space-y-1">
        <Label className="text-b3-b font-semibold">Documents</Label>
        <FileUploader
          onUploadComplete={(urls) => {
            console.log('Uploaded URLs:', urls);

            setLead('files', [urls[0]], { shouldValidate: false });
          }}
          type="lead"
          maxFileSize={20}
          acceptedFiles={['PDF']}
        />
        {errors.files?.message && <p className="text-sm text-red-500">{errors.files.message}</p>}
      </div>
    </div>
  );
};

export default ServiceDetailsStep;
