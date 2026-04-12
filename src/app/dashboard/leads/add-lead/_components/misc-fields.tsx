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

const MiscStep = () => {
  const {
    control,
    setValue: setLead,
    watch,
    formState: { errors },
  } = useFormContext<LeadSchemaType>();
  const remarks = watch('remarks');

  const servicesOptions = Object.values(Services).map((service) => {
    return {
      label: service,
      value: service,
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
      <div className="grid grid-cols-2 gap-6">
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
      </div>
      <div className="w-full space-y-1" suppressHydrationWarning>
        <Label className="text-b3-b font-semibold">Note</Label>

        <TinyEditor
          value={remarks || ''}
          onChange={(content) => setLead('remarks', content, { shouldValidate: true })}
        />
        {errors.remarks?.message && <p className="text-sm text-red-500">{errors.remarks.message}</p>}
      </div>

      <div className="space-y-1">
        <Label className="text-b3-b font-semibold">Documents</Label>
        <FileUploader
          onUploadComplete={(urls) => {
            console.log('Uploaded URLs:', urls);

            setLead('files', urls, { shouldValidate: false });
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

export default MiscStep;
