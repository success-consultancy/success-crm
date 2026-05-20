'use client';

import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';

import { Label } from '@/components/ui/label';
import { FormField } from '@/components/ui/form';
import SelectWithCommand from '@/components/molecules/select-with-command';
import TinyEditor from '@/components/organisms/text-editor';

import EditableTitleBox from './editable-title-box';
import { buildSkillSectionPayload } from './skill-section-payload';
import skillAssessmentFormSchema from '@/schema/skill-assessment-schema';
import { ISkillAssessment } from '@/types/response-types/skill-assessment-response';
import { useEditSkillAssessment } from '@/mutations/skill-assessment/edit-skill-assessment';
import { useGetSource } from '@/query/get-source';
import { useGetUsers } from '@/query/get-user';

const miscSchema = skillAssessmentFormSchema.pick({
  sourceId: true,
  userId: true,
  remarks: true,
});

type FormValues = z.infer<typeof miscSchema>;

const toDefaults = (skill: ISkillAssessment): FormValues => ({
  sourceId: skill.sourceId ?? null,
  userId: skill.userId ?? null,
  remarks: skill.remarks ?? null,
});

const MiscSection = ({ skillAssessment }: { skillAssessment: ISkillAssessment }) => {
  const [isEditing, setIsEditing] = useState(false);
  const editSkill = useEditSkillAssessment();
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
    defaultValues: toDefaults(skillAssessment),
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
    if (!isEditing) reset(toDefaults(skillAssessment));
  }, [skillAssessment, isEditing, reset]);

  const handleCancel = () => {
    reset(toDefaults(skillAssessment));
    setIsEditing(false);
  };

  const handleSave = handleSubmit((data) => {
    editSkill.mutate(buildSkillSectionPayload(skillAssessment, data), {
      onSuccess: () => {
        toast.success('Misc info updated');
        setIsEditing(false);
      },
      onError: (error: any) => {
        toast.error(error?.response?.data?.message || 'Failed to update skill assessment');
      },
    });
  });

  return (
    <EditableTitleBox
      title="Misc"
      isEditing={isEditing}
      isSaving={editSkill.isPending}
      onEdit={() => setIsEditing(true)}
      onCancel={handleCancel}
      onSave={handleSave}
    >
      {isEditing ? (
        <form onSubmit={handleSave} className="space-y-5">
          <div className="grid grid-cols-2 gap-6">
            <FormField
              control={control}
              name="sourceId"
              render={({ field }) => (
                <SelectWithCommand
                  options={sourceOptions}
                  value={field.value?.toString()}
                  label="Source"
                  placeholder="Select a source"
                  onSelect={(val) => field.onChange(val ?? null)}
                  error={errors.sourceId?.message as string | undefined}
                />
              )}
            />
            <FormField
              control={control}
              name="userId"
              render={({ field }) => (
                <SelectWithCommand
                  options={userOptions}
                  value={field.value?.toString()}
                  label="Assigned to"
                  placeholder="Select an assignee"
                  onSelect={(val) => field.onChange(val ? Number(val) : null)}
                  error={errors.userId?.message}
                />
              )}
            />
          </div>
          <div>
            <Label className="font-medium">Note</Label>
            <div className="w-full space-y-1 mt-2" suppressHydrationWarning>
              <TinyEditor
                value={remarks || ''}
                onChange={(content) => setValue('remarks', content, { shouldValidate: true })}
              />
              {errors.remarks?.message && (
                <p className="text-sm text-red-500">{errors.remarks.message}</p>
              )}
            </div>
          </div>
        </form>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4">
            <div className="flex flex-col">
              <span className="text-gray-800 text-sm">Source</span>
              <span className="text-gray-900 text-base font-medium">{skillAssessment?.source?.name || '-'}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-gray-800 text-sm">Assigned To</span>
              <span className="text-gray-900 text-base font-medium">
                {skillAssessment?.user?.firstName
                  ? `${skillAssessment.user.firstName} ${skillAssessment.user.lastName ?? ''}`.trim()
                  : '-'}
              </span>
            </div>
          </div>
          {skillAssessment.remarks && (
            <div>
              <span className="text-gray-800 text-sm block mb-1">Note</span>
              <div
                className="text-gray-900 text-base prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: skillAssessment.remarks }}
              />
            </div>
          )}
        </div>
      )}
    </EditableTitleBox>
  );
};

export default MiscSection;
