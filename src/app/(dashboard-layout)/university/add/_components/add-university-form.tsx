'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { ArrowLeft, X, ChevronDown } from 'lucide-react';
import {
  universityFormSchema,
  UniversitySchemaType,
  getUniversityDefaultValues,
} from '@/schema/university-schema';
import { useAddUniversity } from '@/mutations/university/add-university';
import { useEditUniversity } from '@/mutations/university/edit-university';
import { useGetCourse, useGetAllCourses } from '@/query/get-course';
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
import { Checkbox } from '@/components/ui/checkbox';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

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
  // Courses to add (new course names not yet in DB)
  const [newCourses, setNewCourses] = useState<string[]>([]);
  const [courseOpen, setCourseOpen] = useState(false);
  const [courseSearch, setCourseSearch] = useState('');
  const triggerRef = useRef<HTMLDivElement>(null);
  const [popoverWidth, setPopoverWidth] = useState<number>(0);

  // Fetch all courses from the system for the dropdown
  const { data: allSystemCourses = [] } = useGetAllCourses();
  // Fetch existing linked courses for this university (edit mode)
  const { data: allCoursesForUni = [] } = useGetCourse(isEditMode ? id : undefined);
  const availableCourses = isEditMode
    ? allCoursesForUni.filter((c) => c.universityId === id)
    : [];

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

  useEffect(() => {
    if (courseOpen && triggerRef.current) {
      setPopoverWidth(triggerRef.current.getBoundingClientRect().width);
    }
  }, [courseOpen]);

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

  // Add a course name to the "to-add" list
  const addNewCourse = (name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    const alreadyLinked = availableCourses.some((c) => c.name.toLowerCase() === trimmed.toLowerCase());
    const alreadyAdded = newCourses.some((c) => c.toLowerCase() === trimmed.toLowerCase());
    if (!alreadyLinked && !alreadyAdded) {
      setNewCourses((prev) => [...prev, trimmed]);
    }
    setCourseSearch('');
  };

  const removeNewCourse = (name: string) => {
    setNewCourses((prev) => prev.filter((c) => c !== name));
  };

  const handleCourseKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && courseSearch.trim()) {
      e.preventDefault();
      addNewCourse(courseSearch);
    }
  };

  // Filter system courses: exclude already-linked and already-staged ones, deduplicate by name
  const linkedNames = new Set(availableCourses.map((c) => c.name.toLowerCase()));
  const stagedNames = new Set(newCourses.map((c) => c.toLowerCase()));
  const filteredOptions = Array.from(
    allSystemCourses
      .filter(
        (c) =>
          !linkedNames.has(c.name.toLowerCase()) &&
          !stagedNames.has(c.name.toLowerCase()) &&
          c.name.toLowerCase().includes(courseSearch.toLowerCase()),
      )
      .reduce((map, c) => {
        if (!map.has(c.name.toLowerCase())) map.set(c.name.toLowerCase(), c);
        return map;
      }, new Map<string, typeof allSystemCourses[0]>())
      .values(),
  );

  const submitHandler = (data: UniversitySchemaType) => {
    const { courses: _courses, ...payload } = data;

    if (isEditMode && id) {
      editUniversity(
        { ...payload, id, newCourses },
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
        { payload, courses: newCourses },
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

        {/* University courses and Available courses */}
        <div className="grid grid-cols-2 gap-6">
          {/* University courses — add new ones */}
          <div className="space-y-2">
            <Label className="text-b2">University courses</Label>
            <Popover open={courseOpen} onOpenChange={setCourseOpen} modal>
              <PopoverTrigger asChild>
                <div
                  ref={triggerRef}
                  role="combobox"
                  aria-expanded={courseOpen}
                  className={cn(
                    'w-full min-h-[48px] border rounded-md border-gray-300 flex items-center flex-wrap gap-1 px-3 py-2 cursor-pointer',
                  )}
                  onClick={() => setCourseOpen(true)}
                >
                  {newCourses.length === 0 && (
                    <span className="text-muted-foreground text-sm">Select university courses</span>
                  )}
                  {newCourses.map((name) => (
                    <Badge key={name} variant="secondary" className="gap-1 pr-0.5 pl-2">
                      {name}
                      <button
                        type="button"
                        className="h-5 w-5 rounded-full hover:bg-muted flex items-center justify-center"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeNewCourse(name);
                        }}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                  <ChevronDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
                </div>
              </PopoverTrigger>
              <PopoverContent
                className="p-0"
                align="start"
                style={{ width: popoverWidth || undefined }}
                onCloseAutoFocus={(e) => e.preventDefault()}
              >
                <Command>
                  <CommandInput
                    placeholder="Type to search or add..."
                    value={courseSearch}
                    onValueChange={setCourseSearch}
                    onKeyDown={handleCourseKeyDown}
                  />
                  <CommandList>
                    <CommandEmpty>
                      {courseSearch.trim() ? (
                        <button
                          type="button"
                          className="w-full text-left px-2 py-1.5 text-sm text-primary hover:bg-accent"
                          onClick={() => addNewCourse(courseSearch)}
                        >
                          Add &quot;{courseSearch.trim()}&quot;
                        </button>
                      ) : (
                        'No courses found.'
                      )}
                    </CommandEmpty>
                    <CommandGroup>
                      {filteredOptions.map((course) => (
                        <CommandItem
                          key={course.id}
                          value={course.name}
                          onSelect={() => {
                            addNewCourse(course.name);
                            setCourseOpen(false);
                          }}
                        >
                          {course.name}
                        </CommandItem>
                      ))}
                      {courseSearch.trim() && filteredOptions.some(
                        (c) => c.name.toLowerCase() === courseSearch.trim().toLowerCase(),
                      ) === false && filteredOptions.length > 0 && (
                        <CommandItem
                          value={`__add__${courseSearch}`}
                          onSelect={() => addNewCourse(courseSearch)}
                          className="text-primary"
                        >
                          Add &quot;{courseSearch.trim()}&quot;
                        </CommandItem>
                      )}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          {/* Available courses — existing linked courses (shown in both modes) */}
          <div className="space-y-2">
            <Label className="text-b2">Available courses</Label>
            <div className="w-full min-h-[48px] border rounded-md border-gray-300 flex items-center flex-wrap gap-1 px-3 py-2 bg-gray-50">
              {availableCourses.length === 0 ? (
                <span className="text-muted-foreground text-sm">
                  {isEditMode ? 'No courses linked yet' : 'Courses added above will appear here after saving'}
                </span>
              ) : (
                availableCourses.map((course) => (
                  <Badge key={course.id} variant="secondary" className="pl-2 pr-2">
                    {course.name}
                  </Badge>
                ))
              )}
            </div>
          </div>
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
