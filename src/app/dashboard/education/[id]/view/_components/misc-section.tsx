'use client';

import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';

import { FormField } from '@/components/ui/form';
import SelectWithCommand from '@/components/molecules/select-with-command';
import SelectField from '@/components/organisms/select-field';
import TinyEditor from '@/components/organisms/text-editor';

import EditableTitleBox from './editable-title-box';
import { buildEducationSectionPayload } from './education-section-payload';
import { IEducation } from '@/types/response-types/education-response';
import { useEditEducation } from '@/mutations/education/edit-education';
import { useGetSource } from '@/query/get-source';
import { useGetUsers } from '@/query/get-user';

const miscSchema = z.object({
  userId: z.string().optional(),
  sourceId: z.union([z.string(), z.number()]).nullable().optional(),
  remarks: z.string().optional(),
});

type FormValues = z.infer<typeof miscSchema>;

const toDefaults = (education: IEducation): FormValues => ({
  userId: education.userId != null ? String(education.userId) : undefined,
  sourceId: education.sourceId ?? undefined,
  remarks: education.remarks ?? undefined,
});

const MiscSection = ({ education }: { education: IEducation }) => {
  const [isEditing, setIsEditing] = useState(false);
  const editEducation = useEditEducation();
  const { data: sources } = useGetSource();
  const { data: users } = useGetUsers();

  const sourceOptions = useMemo(
    () => sources?.map((s) => ({ label: s.name, value: s.id.toString() })) ?? [],
    [sources],
  );
  const userOptions = useMemo(
    () => users?.map((u) => ({ label: `${u.firstName} ${u.lastName}`, value: u.id.toString() })) ?? [],
    [users],
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(miscSchema) as any,
    defaultValues: toDefaults(education),
  });
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = form;

  const remarks = watch('remarks');

  useEffect(() => {
    if (!isEditing) reset(toDefaults(education));
  }, [education, isEditing, reset]);

  const handleCancel = () => {
    reset(toDefaults(education));
    setIsEditing(false);
  };

  const handleSave = handleSubmit((data) => {
    editEducation.mutate(buildEducationSectionPayload(education, data), {
      onSuccess: () => {
        toast.success('Misc info updated');
        setIsEditing(false);
      },
      onError: (error: any) => {
        toast.error(error?.response?.data?.message || 'Failed to update student');
      },
    });
  });

  return (
    <EditableTitleBox
      title="Misc Information"
      isEditing={isEditing}
      isSaving={editEducation.isPending}
      onEdit={() => setIsEditing(true)}
      onCancel={handleCancel}
      onSave={handleSave}
    >
      {isEditing ? (
        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <FormField
              control={control}
              name="userId"
              render={({ field }) => (
                <SelectWithCommand
                  options={userOptions}
                  value={field.value?.toString()}
                  label="Assigned to"
                  placeholder="Select a assignee"
                  onSelect={(val) => field.onChange(val)}
                  error={errors.userId?.message}
                />
              )}
            />
            <SelectField
              control={control}
              name="sourceId"
              label="Source"
              options={sourceOptions}
              placeholder="Select source"
            />
          </div>
          <div>
            <TinyEditor
              label="Note"
              value={remarks || ''}
              onChange={(content) => setValue('remarks', content, { shouldValidate: true })}
              error={errors.remarks?.message}
            />
          </div>
        </form>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4">
            <div className="flex flex-col">
              <span className="text-b3-b">Source</span>
              <span className="text-neutral-dark-grey text-base font-medium">
                {education?.source?.name || '-'}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-b3-b">Assigned To</span>
              <span className="text-gray-900 text-base font-medium">
                {education?.user?.firstName
                  ? `${education.user.firstName} ${education.user.lastName ?? ''}`.trim()
                  : '-'}
              </span>
            </div>
          </div>
          {education.remarks && (
            <div>
              <span className="text-b3-b block mb-1">Note</span>
              <div
                className="text-gray-900 text-base prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: education.remarks }}
              />
            </div>
          )}
        </div>
      )}
    </EditableTitleBox>
  );
};

export default MiscSection;
