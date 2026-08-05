'use client';

import { useEffect, useMemo, useState } from 'react';
import { useForm, Controller, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';

import { DatePicker } from '@/components/organisms/date-picker';
import FormErrorMessage from '@/components/atoms/form-error-message';
import SelectField from '@/components/organisms/select-field';
import ComboboxField from '@/components/organisms/combobox-field';

import EditableTitleBox from './editable-title-box';
import { buildEducationSectionPayload } from './education-section-payload';
import { EducationStatusTypes, IEducation } from '@/types/response-types/education-response';
import { useEditEducation } from '@/mutations/education/edit-education';
import { useGetUniversity } from '@/query/get-university';
import { useGetCourse } from '@/query/get-course';
import { EDUCATION_STATUS_COLORS } from '@/constants/status-colors';

const courseSchema = z
  .object({
    universityId: z.string().optional(),
    courseId: z.string().optional(),
    startDate: z.date().optional(),
    endDate: z.date().optional(),
    status: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.startDate && data.endDate && !(data.endDate > data.startDate)) {
      ctx.addIssue({
        code: 'custom',
        message: 'Course end date must be after the start date',
        path: ['endDate'],
      });
    }
  });

type FormValues = z.infer<typeof courseSchema>;

const toDate = (value: string | null | undefined): Date | undefined =>
  value ? new Date(value) : undefined;

const toDefaults = (education: IEducation): FormValues => {
  const raw = education as unknown as Record<string, unknown>;
  return {
    universityId: raw.universityId != null ? String(raw.universityId) : undefined,
    courseId: raw.courseId != null ? String(raw.courseId) : undefined,
    startDate: toDate(education.startDate),
    endDate: toDate(education.endDate),
    status: education.status ?? undefined,
  };
};

const CourseInfo = ({ education }: { education: IEducation }) => {
  const [isEditing, setIsEditing] = useState(false);
  const editEducation = useEditEducation();
  const { data: universities } = useGetUniversity();

  const form = useForm<FormValues>({
    resolver: zodResolver(courseSchema) as any,
    defaultValues: toDefaults(education),
  });
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = form;

  const selectedUniversityId = useWatch({ control, name: 'universityId' });
  const universityIdNumber = useMemo(
    () => (selectedUniversityId ? Number(selectedUniversityId) : undefined),
    [selectedUniversityId],
  );
  const { data: courses } = useGetCourse(universityIdNumber);

  const universityOptions = useMemo(
    () =>
      universities?.map((u) => ({
        label: u.name,
        value: u.id.toString(),
      })) ?? [],
    [universities],
  );

  const courseOptions = useMemo(
    () =>
      courses?.map((c) => ({
        label: c.name,
        value: c.id.toString(),
      })) ?? [],
    [courses],
  );

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
        toast.success('Course information updated');
        setIsEditing(false);
      },
      onError: (error: any) => {
        toast.error(error?.response?.data?.message || 'Failed to update student');
      },
    });
  });

  return (
    <EditableTitleBox
      title="Course Information"
      isEditing={isEditing}
      isSaving={editEducation.isPending}
      onEdit={() => setIsEditing(true)}
      onCancel={handleCancel}
      onSave={handleSave}
    >
      {isEditing ? (
        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <ComboboxField
              control={control}
              name="universityId"
              label="University"
              options={universityOptions}
              placeholder="Select university"
            />
            <ComboboxField
              control={control}
              name="courseId"
              label="Course"
              options={courseOptions}
              placeholder="Select course"
            />
          </div>
          <div className="grid grid-cols-3 gap-6">
            <div className="space-y-2">
              <Controller
                name="startDate"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    label="Start Date"
                    side="top"
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Pick a date"
                    className="h-12 text-b2 w-full"
                    disablePastDates
                    error={!!errors.startDate?.message}
                  />
                )}
              />
              <FormErrorMessage message={errors.startDate?.message} />
            </div>
            <div className="space-y-2">
              <Controller
                name="endDate"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    label="End Date"
                    side="top"
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Pick a date"
                    className="h-12 text-b2 w-full"
                    disablePastDates
                    error={!!errors.endDate?.message}
                  />
                )}
              />
              <FormErrorMessage message={errors.endDate?.message} />
            </div>
            <SelectField
              control={control}
              name="status"
              label="Status"
              options={Object.values(EducationStatusTypes).map((value) => ({
                label: value,
                value,
              }))}
              placeholder="Select status"
            />
          </div>
        </form>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4">
          <ReadField title="University name" value={education?.university?.name || '-'} />
          <ReadField title="Course" value={education?.course?.name || '-'} />
          <ReadField
            title="University start date"
            value={education.startDate ? new Date(education.startDate).toLocaleDateString() : '-'}
          />
          <ReadField
            title="University end date"
            value={education.endDate ? new Date(education.endDate).toLocaleDateString() : '-'}
          />
          <ReadField
            title="Status"
            value={education.status || '-'}
            badgeColors={education.status ? EDUCATION_STATUS_COLORS[education.status] : undefined}
          />
        </div>
      )}
    </EditableTitleBox>
  );
};

const ReadField = ({
  title,
  value,
  badgeColors,
}: {
  title: string;
  value: string | number;
  badgeColors?: { background: string; text: string };
}) => (
  <div className="flex flex-col">
    <span className="text-b3-b">{title}</span>
    {badgeColors ? (
      <div>
        <span
          className="text-base font-medium px-2 py-1 rounded-[2px] inline-flex"
          style={{ backgroundColor: badgeColors.background, color: badgeColors.text }}
        >
          {value}
        </span>
      </div>
    ) : (
      <span className="text-neutral-dark-grey text-base font-medium">{value || '-'}</span>
    )}
  </div>
);

export default CourseInfo;
