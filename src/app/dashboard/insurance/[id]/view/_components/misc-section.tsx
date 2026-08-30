'use client';

import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';

import { FormField } from '@/components/ui/form';
import SelectWithCommand from '@/components/molecules/select-with-command';
import TinyEditor from '@/components/organisms/text-editor';

import EditableTitleBox from './editable-title-box';
import { buildInsuranceSectionPayload } from './insurance-section-payload';
import insuranceFormSchema from '@/schema/insurance';
import { IInsurance } from '@/types/response-types/insurance-response';
import { useEditInsurance } from '@/mutations/insurance/edit-insurance';
import { useGetSource } from '@/query/get-source';
import { useGetUsers } from '@/query/get-user';
import { ENTITY, toastMsg } from '@/constants/messages';

const miscSchema = insuranceFormSchema.pick({
  sourceId: true,
  userId: true,
  remarks: true,
});

type FormValues = z.infer<typeof miscSchema>;

const toDefaults = (visa: IInsurance): FormValues => ({
  sourceId: visa.sourceId ?? null,
  userId: visa.userId ?? null,
  remarks: visa.remarks ?? null,
});

const MiscSection = ({ visa }: { visa: IInsurance }) => {
  const [isEditing, setIsEditing] = useState(false);
  const editInsurance = useEditInsurance();
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
    defaultValues: toDefaults(visa),
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
    if (!isEditing) reset(toDefaults(visa));
  }, [visa, isEditing, reset]);

  const handleCancel = () => {
    reset(toDefaults(visa));
    setIsEditing(false);
  };

  const handleSave = handleSubmit((data) => {
    editInsurance.mutate(buildInsuranceSectionPayload(visa, data), {
      onSuccess: () => {
        toast.success(toastMsg.updateSuccess(ENTITY.miscInfo));
        setIsEditing(false);
      },
      onError: (error: any) => {
        toast.error(error?.response?.data?.message || toastMsg.updateError(ENTITY.insurance));
      },
    });
  });

  return (
    <EditableTitleBox
      title="Misc Information"
      isEditing={isEditing}
      isSaving={editInsurance.isPending}
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
                  onSelect={(val) => field.onChange(val ? Number(val) : null)}
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
              <span className="text-gray-800 text-sm">Source</span>
              <span className="text-gray-900 text-base font-medium">{visa?.source?.name || '-'}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-gray-800 text-sm">Assigned To</span>
              <span className="text-gray-900 text-base font-medium">
                {visa?.user?.firstName ? `${visa.user.firstName} ${visa.user.lastName ?? ''}`.trim() : '-'}
              </span>
            </div>
          </div>
          {visa.remarks && (
            <div>
              <span className="text-gray-800 text-sm block mb-1">Note</span>
              <div
                className="text-gray-900 text-base prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: visa.remarks }}
              />
            </div>
          )}
        </div>
      )}
    </EditableTitleBox>
  );
};

export default MiscSection;
