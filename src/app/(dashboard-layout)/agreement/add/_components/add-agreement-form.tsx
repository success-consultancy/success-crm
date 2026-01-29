'use client';

import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { agreementFormSchema, AgreementSchemaType, getAgreementDefaultValues, updateAgreementFormSchema, UpdateAgreementSchemaType } from '@/schema/agreement-schema';
import { useAddAgreement } from '@/mutations/agreement/add-agreement';
import { useEditAgreement } from '@/mutations/agreement/edit-agreement';
import { useGetUniversity } from '@/query/get-university';
import { AgreementStatus } from '@/types/response-types/agreement-response';
import Container from '@/components/atoms/container';
import Portal from '@/components/atoms/portal';
import { PortalIds } from '@/config/portal';
import Button from '@/components/atoms/button';
import { ButtonLink } from '@/components/atoms/button-link';
import { ROUTES } from '@/config/routes';
import TextInput from '@/components/molecules/text-input';
import { Label } from '@/components/ui/label';
import { DatePicker } from '@/components/organisms/date-picker';
import FormErrorMessage from '@/components/atoms/form-error-message';
import SelectField from '@/components/organisms/select-field';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import TinyEditor from '@/components/organisms/text-editor';
import FileUploader from '@/components/organisms/file-uploader';
import { cn } from '@/lib/utils';
import { format, isValid } from 'date-fns';
import { FORM_STATE } from '@/types/common';
import { useEffect } from 'react';
import { toast } from 'sonner';

interface Props {
  userId: number | undefined;
  formState: FORM_STATE;
  id?: number;
  defaultValues?: Partial<AgreementSchemaType>;
}

export function AgreementForm({ userId, formState, id, defaultValues }: Props) {
  const router = useRouter();
  const isEditMode = formState === FORM_STATE.EDIT;
  const [note, setNote] = useState<string>(defaultValues?.note || '');
  const [fileUrl, setFileUrl] = useState<string | null>(defaultValues?.file || null);

  const form = useForm<AgreementSchemaType>({
    resolver: zodResolver(agreementFormSchema),
    defaultValues: getAgreementDefaultValues(defaultValues),
    mode: 'onChange',
  });

  const { data: universityData, isLoading: universityLoading } = useGetUniversity();
  const { mutate: addAgreement, isPending: isAdding } = useAddAgreement();
  const { mutate: editAgreement, isPending: isEditing } = useEditAgreement();
  const isPending = isAdding || isEditing;

  // Update form when defaultValues change (for edit mode)
  useEffect(() => {
    if (isEditMode && defaultValues) {
      const values = getAgreementDefaultValues(defaultValues);
      form.reset(values);
      setNote(values.note || '');
      setFileUrl(values.file || null);
    }
  }, [defaultValues, isEditMode, form]);

  const {
    register,
    control,
    setValue,
    formState: { errors },
    handleSubmit,
  } = form;

  const universityOptions = React.useMemo(() => {
    if (!universityData) return [];
    return universityData.map((university) => ({
      label: university.name,
      value: university.id.toString(),
    }));
  }, [universityData]);

  const statusOptions = [
    { label: 'IN EFFECT', value: AgreementStatus.InEffect },
    { label: 'IN PROCESS', value: AgreementStatus.InProcess },
  ];

  const typeOptions = [
    { label: 'Tafe', value: 'Tafe' },
    { label: 'University', value: 'University' },
    { label: 'College', value: 'College' },
  ];

  const groupOptions = [
    { label: 'VET Sector', value: 'VET Sector' },
    { label: 'Higher Education', value: 'Higher Education' },
    { label: 'PY Provider', value: 'PY Provider' },
  ];

  const handleNoteChange = (content: string) => {
    setNote(content);
    setValue('note', content, { shouldValidate: true });
  };

  const handleFileUploadComplete = (fileUrls: string[]) => {
    if (fileUrls.length > 0) {
      setFileUrl(fileUrls[0]);
      setValue('file', fileUrls[0], { shouldValidate: true });
    }
  };

  const submitHandler = (data: AgreementSchemaType) => {
    if (isEditMode && id) {
      editAgreement({ ...data, id }, {
        onSuccess: () => {
          toast.success('Agreement updated successfully');
          router.push(ROUTES.AGENCY_AGREEMENT);
        },
        onError: (error: any) => {
          const message = error?.response?.data?.message || 'Failed to update agreement';
          toast.error(message);
        },
      });
    } else {
      addAgreement(data, {
        onSuccess: () => {
          toast.success('Agreement created successfully');
          router.push(ROUTES.AGENCY_AGREEMENT);
        },
        onError: (error: any) => {
          const message = error?.response?.data?.message || 'Failed to create agreement';
          toast.error(message);
        },
      });
    }
  };

  return (
    <Container className="flex flex-col py-10 gap-8">
      <Portal rootId={PortalIds.DashboardHeader}>
        <div className="flex items-center gap-4">
          <ButtonLink href={ROUTES.AGENCY_AGREEMENT} variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </ButtonLink>
          <h3 className="text-h5 text-content-heading font-bold">{isEditMode ? 'Edit Agreement' : 'Add Agreement'}</h3>
        </div>
      </Portal>

      <form className="w-full bg-white rounded-lg p-6 space-y-6" onSubmit={handleSubmit(submitHandler)}>
        {/* University and Type Row */}
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="text-b2">
              University <span className="text-red-500">*</span>
            </Label>
            <Controller
              name="universityId"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value?.toString() || ''}
                  onValueChange={(value) => field.onChange(parseInt(value, 10))}
                  disabled={universityLoading}
                >
                  <SelectTrigger className={cn('w-full h-12', errors.universityId && 'border-red-500')}>
                    <SelectValue placeholder={universityLoading ? 'Loading...' : 'University *'} />
                  </SelectTrigger>
                  <SelectContent>
                    {universityOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            <FormErrorMessage message={errors.universityId?.message} />
          </div>

          <div className="space-y-2">
            <SelectField
              name="type"
              label="Type"
              control={control}
              options={typeOptions}
              placeholder="Type"
            />
            <FormErrorMessage message={errors.type?.message} />
          </div>
        </div>

        {/* Group Row */}
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <SelectField
              name="group"
              label="Group"
              control={control}
              options={groupOptions}
              placeholder="Group"
            />
            <FormErrorMessage message={errors.group?.message} />
          </div>
        </div>

        {/* Web Link */}
        <div className="space-y-2">
          <Label className="text-b2">Web Link</Label>
          <TextInput {...register('webLink')} placeholder="Web Link" error={errors.webLink?.message} />
        </div>

        {/* Start Date and End Date Row */}
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="text-b2">Start Date</Label>
            <Controller
              name="startDate"
              control={control}
              render={({ field }) => {
                const dateValue = field.value 
                  ? (typeof field.value === 'string' ? new Date(field.value + 'T00:00:00') : field.value)
                  : undefined;
                return (
                  <DatePicker
                    value={dateValue instanceof Date && !isNaN(dateValue.getTime()) ? dateValue : undefined}
                    onChange={(date) => {
                      if (date) {
                        const formattedDate = format(date, 'yyyy-MM-dd');
                        field.onChange(formattedDate);
                      } else {
                        field.onChange(null);
                      }
                    }}
                    placeholder="DD/MM/YYYY"
                    className={cn('h-12 text-b2 w-full')}
                    error={!!errors.startDate?.message}
                  />
                );
              }}
            />
            <FormErrorMessage message={errors.startDate?.message} />
          </div>

          <div className="space-y-2">
            <Label className="text-b2">End Date</Label>
            <Controller
              name="endDate"
              control={control}
              render={({ field }) => {
                const dateValue = field.value 
                  ? (typeof field.value === 'string' ? new Date(field.value + 'T00:00:00') : field.value)
                  : undefined;
                return (
                  <DatePicker
                    value={dateValue instanceof Date && !isNaN(dateValue.getTime()) ? dateValue : undefined}
                    onChange={(date) => {
                      if (date) {
                        const formattedDate = format(date, 'yyyy-MM-dd');
                        field.onChange(formattedDate);
                      } else {
                        field.onChange(null);
                      }
                    }}
                    placeholder="DD/MM/YYYY"
                    className={cn('h-12 text-b2 w-full')}
                    error={!!errors.endDate?.message}
                  />
                );
              }}
            />
            <FormErrorMessage message={errors.endDate?.message} />
          </div>
        </div>

        {/* Commission and Location Row */}
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="text-b2">Commission (%)</Label>
            <TextInput {...register('commission')} placeholder="Commission (%)" error={errors.commission?.message} />
          </div>

          <div className="space-y-2">
            <Label className="text-b2">Location</Label>
            <TextInput {...register('location')} placeholder="Location" error={errors.location?.message} />
          </div>
        </div>

        {/* Status */}
        <div className="space-y-2">
          <SelectField
            name="status"
            label="Status"
            control={control}
            options={statusOptions}
            placeholder="Status *"
            required
          />
          <FormErrorMessage message={errors.status?.message} />
        </div>

        {/* Note */}
        <div className="space-y-2">
          <Label className="text-b2">Note:</Label>
          <TinyEditor value={note} onChange={handleNoteChange} />
          <FormErrorMessage message={errors.note?.message} />
        </div>

        {/* Agreement File Upload */}
        <div className="space-y-2">
          <Label className="text-b2">Agreement File:</Label>
          <FileUploader
            type="agreement"
            maxFileSize={10}
            acceptedFiles={['.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png']}
            onUploadComplete={handleFileUploadComplete}
          />
          {fileUrl && (
            <div className="mt-2">
              <p className="text-sm text-gray-600">Current file: {fileUrl.split('/').pop()}</p>
              {isEditMode && (
                <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">
                  View file
                </a>
              )}
            </div>
          )}
          <FormErrorMessage message={errors.file?.message} />
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-4">
          <Button type="submit" loading={isPending} className="bg-purple-600 hover:bg-purple-700 text-white">
            {isEditMode ? 'UPDATE' : 'ADD'}
          </Button>
        </div>
      </form>
    </Container>
  );
}
