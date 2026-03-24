'use client';

import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { ArrowLeft, X, Plus } from 'lucide-react';
import {
  universityFormSchema,
  UniversitySchemaType,
  getUniversityDefaultValues,
} from '@/schema/university-schema';
import { useAddUniversity } from '@/mutations/university/add-university';
import { useEditUniversity } from '@/mutations/university/edit-university';
import Container from '@/components/atoms/container';
import Portal from '@/components/atoms/portal';
import { PortalIds } from '@/config/portal';
import Button from '@/components/atoms/button';
import { ButtonLink } from '@/components/atoms/button-link';
import { ROUTES } from '@/config/routes';
import TextInput from '@/components/molecules/text-input';
import { Label } from '@/components/ui/label';
import FormErrorMessage from '@/components/atoms/form-error-message';
import SelectField from '@/components/organisms/select-field';
import TinyEditor from '@/components/organisms/text-editor';
import FileUploader from '@/components/organisms/file-uploader';
import { FORM_STATE, UploadedFileMeta } from '@/types/common';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';

const GROUP_OPTIONS = [
  { label: 'Higher Education', value: 'Higher Education' },
  { label: 'VET Sector', value: 'VET Sector' },
  { label: 'PY Provider', value: 'PY Provider' },
  { label: 'Both', value: 'Both' },
];

interface Props {
  formState: FORM_STATE;
  id?: number;
  defaultValues?: Partial<UniversitySchemaType>;
}

export function UniversityForm({ formState, id, defaultValues }: Props) {
  const router = useRouter();
  const isEditMode = formState === FORM_STATE.EDIT;

  const [description, setDescription] = useState<string>(defaultValues?.description || '');
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFileMeta[]>(
    (defaultValues?.files as UploadedFileMeta[]) || [],
  );
  const [courseInput, setCourseInput] = useState('');
  const [courses, setCourses] = useState<string[]>([]);

  const form = useForm<UniversitySchemaType>({
    resolver: zodResolver(universityFormSchema),
    defaultValues: getUniversityDefaultValues(defaultValues),
    mode: 'onChange',
  });

  const { mutate: addUniversity, isPending: isAdding } = useAddUniversity();
  const { mutate: editUniversity, isPending: isEditing } = useEditUniversity();
  const isPending = isAdding || isEditing;

  useEffect(() => {
    if (isEditMode && defaultValues) {
      const values = getUniversityDefaultValues(defaultValues);
      form.reset(values);
      setDescription(values.description || '');
      setUploadedFiles((values.files as UploadedFileMeta[]) || []);
    }
  }, [defaultValues, isEditMode, form]);

  const {
    register,
    control,
    setValue,
    formState: { errors },
    handleSubmit,
  } = form;

  const handleDescriptionChange = (content: string) => {
    setDescription(content);
    setValue('description', content, { shouldValidate: true });
  };

  const handleFileUploadComplete = (newFiles: UploadedFileMeta[]) => {
    const merged = [...uploadedFiles, ...newFiles];
    setUploadedFiles(merged);
    setValue('files', merged, { shouldValidate: true });
  };

  const handleAddCourse = () => {
    const trimmed = courseInput.trim();
    if (trimmed && !courses.includes(trimmed)) {
      setCourses([...courses, trimmed]);
      setCourseInput('');
    }
  };

  const handleRemoveCourse = (course: string) => {
    setCourses(courses.filter((c) => c !== course));
  };

  const handleCourseKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddCourse();
    }
  };

  const submitHandler = (data: UniversitySchemaType) => {
    const { courses: _courses, ...payload } = data;

    if (isEditMode && id) {
      editUniversity(
        { ...payload, id },
        {
          onSuccess: () => {
            toast.success('University updated successfully');
            router.push(ROUTES.UNIVERSITY);
          },
          onError: (error: any) => {
            const message = error?.response?.data?.message || 'Failed to update university';
            toast.error(message);
          },
        },
      );
    } else {
      addUniversity(
        { payload, courses },
        {
          onSuccess: () => {
            toast.success('University created successfully');
            router.push(ROUTES.UNIVERSITY);
          },
          onError: (error: any) => {
            const message = error?.response?.data?.message || 'Failed to create university';
            toast.error(message);
          },
        },
      );
    }
  };

  return (
    <Container className="flex flex-col py-10 gap-8">
      <Portal rootId={PortalIds.DashboardHeader}>
        <div className="flex items-center gap-4">
          <ButtonLink href={ROUTES.UNIVERSITY} variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </ButtonLink>
          <h3 className="text-h5 text-content-heading font-bold">
            {isEditMode ? 'Edit university' : 'New university'}
          </h3>
        </div>
      </Portal>

      <form className="w-full bg-white rounded-lg p-6 space-y-6" onSubmit={handleSubmit(submitHandler)}>
        <p className="text-lg font-bold">University details</p>

        {/* University name and Group */}
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="text-b2">
              University name <span className="text-red-500">*</span>
            </Label>
            <TextInput {...register('name')} placeholder="University name" error={errors.name?.message} />
          </div>
          <div className="space-y-2">
            <SelectField
              name="educationLevel"
              label="Group"
              control={control}
              options={GROUP_OPTIONS}
              placeholder="Select a group"
            />
            <FormErrorMessage message={errors.educationLevel?.message} />
          </div>
        </div>

        {/* Location and Comment */}
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="text-b2">Location</Label>
            <TextInput {...register('location')} placeholder="Location" error={errors.location?.message} />
          </div>
          <div className="space-y-2">
            <Label className="text-b2">Comment (optional)</Label>
            <TextInput {...register('comment')} placeholder="Comment" error={errors.comment?.message} />
          </div>
        </div>

        {/* Available courses */}
        <div className="space-y-2">
          <Label className="text-b2">Available courses</Label>
          <div className="flex gap-2">
            <Input
              value={courseInput}
              onChange={(e) => setCourseInput(e.target.value)}
              onKeyDown={handleCourseKeyDown}
              placeholder="Type a course name and press Enter or Add"
              className="h-12"
            />
            <Button type="button" variant="outline" onClick={handleAddCourse} className="h-12 px-4">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          {courses.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {courses.map((course) => (
                <div
                  key={course}
                  className="flex items-center gap-1 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm border border-blue-200"
                >
                  <span>{course}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveCourse(course)}
                    className="ml-1 hover:text-blue-900"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Track in Report */}
        <div className="flex items-center gap-3">
          <Controller
            name="trackInReport"
            control={control}
            render={({ field }) => (
              <Checkbox
                checked={field.value === true}
                onCheckedChange={(checked) => field.onChange(checked === true)}
              />
            )}
          />
          <Label className="text-b2">Track in report</Label>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label className="text-b2">Description (optional)</Label>
          <TinyEditor value={description} onChange={handleDescriptionChange} />
          <FormErrorMessage message={errors.description?.message} />
        </div>

        {/* Document */}
        <div className="space-y-2">
          <Label className="text-b2">Document (optional)</Label>
          <FileUploader
            type="university"
            maxFileSize={10}
            acceptedFiles={['.pdf', '.jpg', '.jpeg', '.png', '.docx']}
            onUploadComplete={handleFileUploadComplete}
          />
          {uploadedFiles.length > 0 && (
            <div className="mt-2 space-y-1">
              {uploadedFiles.map((f, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-gray-600">
                  <a href={f.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    {f.name}
                  </a>
                </div>
              ))}
            </div>
          )}
          <FormErrorMessage message={errors.files?.message} />
        </div>

        {/* Submit */}
        <div className="flex justify-end gap-3 pt-4">
          <ButtonLink href={ROUTES.UNIVERSITY} variant="outline">
            Cancel
          </ButtonLink>
          <Button type="submit" loading={isPending}>
            {isEditMode ? 'Save changes' : 'Add university'}
          </Button>
        </div>
      </form>
    </Container>
  );
}
