'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import {
  announcementFormSchema,
  AnnouncementSchemaType,
  getAnnouncementDefaultValues,
  updateAnnouncementFormSchema,
  UpdateAnnouncementSchemaType,
} from '@/schema/announcement-schema';
import { useAddAnnouncement } from '@/mutations/announcement/add-announcement';
import { useEditAnnouncement } from '@/mutations/announcement/edit-announcement';
import Container from '@/components/atoms/container';
import Portal from '@/components/atoms/portal';
import { PortalIds } from '@/config/portal';
import Button from '@/components/atoms/button';
import { ButtonLink } from '@/components/atoms/button-link';
import { ROUTES } from '@/config/routes';
import TextInput from '@/components/molecules/text-input';
import { Label } from '@/components/ui/label';
import TinyEditor from '@/components/organisms/text-editor';
import FormErrorMessage from '@/components/atoms/form-error-message';
import FileUploader from '@/components/organisms/file-uploader';
import { FORM_STATE } from '@/types/common';
import { toast } from 'sonner';

interface Props {
  formState: FORM_STATE;
  id?: number;
  defaultValues?: Partial<AnnouncementSchemaType>;
}

export function AnnouncementForm({ formState, id, defaultValues }: Props) {
  const router = useRouter();
  const isEditMode = formState === FORM_STATE.EDIT;
  const [description, setDescription] = useState<string>(defaultValues?.description || '');

  const form = useForm<AnnouncementSchemaType>({
    resolver: zodResolver(announcementFormSchema),
    defaultValues: getAnnouncementDefaultValues(defaultValues),
    mode: 'onChange',
  });

  const { mutate: addAnnouncement, isPending: isAdding } = useAddAnnouncement();
  const { mutate: editAnnouncement, isPending: isEditing } = useEditAnnouncement();
  const isPending = isAdding || isEditing;

  useEffect(() => {
    if (isEditMode && defaultValues) {
      const values = getAnnouncementDefaultValues(defaultValues);
      form.reset(values);
      setDescription(values.description || '');
    }
  }, [defaultValues, isEditMode, form]);

  const {
    register,
    setValue,
    formState: { errors },
    handleSubmit,
  } = form;

  const handleDescriptionChange = (content: string) => {
    setDescription(content);
    setValue('description', content, { shouldValidate: true });
  };

  const handleImageUpload = (newFiles: { url: string; name: string }[]) => {
    if (newFiles.length > 0) {
      setValue('photoURL', newFiles[0].url, { shouldValidate: true });
    }
  };

  const submitHandler = (data: AnnouncementSchemaType) => {
    if (isEditMode && id) {
      const payload: UpdateAnnouncementSchemaType = { ...data, id };
      editAnnouncement(payload, {
        onSuccess: () => {
          toast.success('Announcement updated successfully');
          router.push(ROUTES.UPDATES_AND_ANNOUNCEMENTS);
        },
        onError: (error: any) => {
          const message = error?.response?.data?.message || 'Failed to update announcement';
          toast.error(message);
        },
      });
    } else {
      addAnnouncement(data, {
        onSuccess: () => {
          toast.success('Announcement published successfully');
          form.reset();
          router.push(ROUTES.UPDATES_AND_ANNOUNCEMENTS);
        },
        onError: (error: any) => {
          const message = error?.response?.data?.message || 'Failed to publish announcement';
          toast.error(message);
        },
      });
    }
  };

  return (
    <Container className="flex flex-col py-10 gap-8">
      <Portal rootId={PortalIds.DashboardHeader}>
        <div className="flex items-center gap-4">
          <ButtonLink href={ROUTES.UPDATES_AND_ANNOUNCEMENTS} variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </ButtonLink>
          <h3 className="text-h5 text-content-heading font-bold">
            {isEditMode ? 'Edit Announcement' : 'Add Announcement'}
          </h3>
        </div>
      </Portal>

      <form className="w-full bg-white rounded-lg p-6 space-y-6" onSubmit={handleSubmit(submitHandler)}>
        {/* Title */}
        <div className="space-y-2">
          <Label className="text-b2">
            Title <span className="text-red-500">*</span>
          </Label>
          <TextInput
            {...register('title')}
            placeholder="Announcement title"
            error={errors.title?.message}
          />
          <FormErrorMessage message={errors.title?.message} />
        </div>

        {/* Description (Rich Text) */}
        <div className="space-y-2">
          <TinyEditor
            label="Description *"
            value={description}
            onChange={handleDescriptionChange}
          />
          <FormErrorMessage message={errors.description?.message} />
        </div>

        {/* Cover Image Upload */}
        <div className="space-y-2">
          <Label className="text-b2">Cover Image</Label>
          <FileUploader
            type="announcement"
            maxFileSize={5}
            acceptedFiles={['.jpg', '.jpeg', '.png', '.webp']}
            onUploadComplete={handleImageUpload}
          />
          <FormErrorMessage message={errors.photoURL?.message} />
        </div>

        {/* Submit */}
        <div className="flex justify-end pt-4">
          <Button type="submit" loading={isPending}>
            {isEditMode ? 'Save Changes' : 'Publish Announcement'}
          </Button>
        </div>
      </form>
    </Container>
  );
}
