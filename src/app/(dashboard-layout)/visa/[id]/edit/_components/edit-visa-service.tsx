import { Accordion } from '@/components/ui/accordion';
import {
  newVisaServiceDefaultValues,
  newVisaServiceSchema,
  NewVisaServiceType,
} from '@/schema/visa-service/new-visa.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';
import { format } from 'date-fns';

import { cn } from '@/lib/utils';

import TextInput from '@/components/molecules/text-input';
import { Label } from '@/components/ui/label';
import { DatePicker } from '@/components/organisms/date-picker';
import FormErrorMessage from '@/components/atoms/form-error-message';
import SelectField from '@/components/organisms/select-field';
import Button from '@/components/atoms/button';
import { FormAccordion } from '@/components/organisms/form-accordion';
import toast from 'react-hot-toast';
import { useGetSource } from '@/query/get-source';
import { useEffect, useMemo } from 'react';
import TinyEditor from '@/components/organisms/text-editor';
import { FormField } from '@/components/ui/form';
import SelectWithCommand from '@/components/molecules/select-with-command';
import { useGetUsers } from '@/query/get-user';
import { useEditVisa } from '@/mutations/visa/edit-visa';
import { useGetOccupations } from '@/query/get-occupations';
import { ROUTES } from '@/config/routes';
import { useRouter } from 'next/navigation';

interface Props {
  visaId: number;
  userId: number | undefined;
  defaultValues: Partial<NewVisaServiceType>;
}

export function EditVisaService({ visaId, userId, defaultValues }: Props) {
  const form = useForm<NewVisaServiceType>({
    resolver: zodResolver(newVisaServiceSchema) as any,
    defaultValues: defaultValues,
    mode: 'onChange',
  });

  const router = useRouter()

  const { data: sourceData } = useGetSource();
  const { data: users } = useGetUsers();

  const { data: occupations } = useGetOccupations();

  const ANZSCOOccupationOptions = useMemo(() => {
    return occupations?.map((occupation) => {
      const value = occupation.code;
      const label = occupation.title + ' - ' + occupation.code;
      return {
        value,
        label,
      };
    });
  }, [occupations]);

  const {
    register,
    control,
    watch,
    setValue,
    formState: { errors },
    handleSubmit,
    reset,
  } = form;

  useEffect(() => {
    if (userId) {
      setValue('userId', userId);
      setValue('updatedBy', userId);
    }
  }, [userId, setValue]);

  const miscNote = watch('miscNote');
  const remarks = watch('remarks');

  const handleRemarksChange = (content: string) => {
    setValue('remarks', content, { shouldValidate: true });
  };

  const handleMiscNoteChange = (content: string) => {
    setValue('miscNote', content, { shouldValidate: true });
  };

  const { mutate, isPending } = useEditVisa();
  const submitHandler = (data: NewVisaServiceType) => {
    mutate(
      {
        id: visaId,
        ...data,
        sourceId: data.sourceId,
      },
      {
        onSuccess: () => {
          toast.success('Visa applicant updated successfully');
        },
        onError: (error: any) => {
          toast.error(error?.response?.data?.message || 'Failed to update visa applicant');
        },
      },
    );
  };

  const userOptions = useMemo(() => {
    if (users) {
      return users?.map((user) => {
        return {
          label: `${user.firstName} ${user.lastName}`,
          value: user.id.toString(),
        };
      });
    }
    return [];
  }, [users]);

  const sourceOptions = useMemo(() => {
    if (sourceData) {
      return sourceData?.map((source) => {
        return {
          label: source.name,
          value: source.id.toString(),
        };
      });
    }
    return [];
  }, [sourceData]);

  // Helper to handle date changes and convert to string (ISO format)
  const handleDateChange = (fieldName: keyof NewVisaServiceType) => (date: Date | undefined) => {
    if (date) {
      setValue(fieldName, format(date, 'yyyy-MM-dd') as any, { shouldValidate: true });
    } else {
      setValue(fieldName, '' as any, { shouldValidate: true });
    }
  };

  // Helper to get date value for DatePicker from string
  const getDateValue = (dateString: string | null | undefined): Date | undefined => {
    if (!dateString || dateString === '') return undefined;
    try {
      const date = new Date(dateString);
      return isNaN(date.getTime()) ? undefined : date;
    } catch {
      return undefined;
    }
  };

  const [selectedOccupation, selectedANZSCO] = watch(['occupation', 'anzsco']);

  useEffect(() => {
    if (selectedOccupation) {
      const selected = occupations?.find((occupation) => occupation.title === selectedOccupation);
      setValue('anzsco', selected?.code, { shouldValidate: false });
    }
  }, [selectedOccupation, occupations, setValue]);

  useEffect(() => {
    if (selectedANZSCO) {
      const selected = occupations?.find((occupation) => occupation.code === selectedANZSCO);
      setValue('occupation', selected?.title, { shouldValidate: false });
    }
  }, [selectedANZSCO, occupations, setValue]);


  return (
    <form className="w-full" onSubmit={handleSubmit(submitHandler)}>
      <Accordion type="multiple" className="w-full space-y-6" defaultValue={['item-1', 'item-2', 'item-4', 'item-6']}>
        {/* Personal Details */}
        <FormAccordion value="item-1" title="Personal details">
          <div className="grid grid-cols-3 gap-6">
            <TextInput label="First name" {...register('firstName')} error={errors.firstName?.message} />
            <TextInput label="Middle name (optional)" {...register('middleName')} error={errors.middleName?.message} />
            <TextInput label="Last name" {...register('lastName')} error={errors.lastName?.message} />
            <div className="space-y-2">
              <Label className="text-b2" htmlFor="dob">
                Date of birth
              </Label>
              <Controller
                name="dob"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    error={!!errors.dob?.message}
                    side="top"
                    value={getDateValue(field.value)}
                    onChange={handleDateChange('dob')}
                    placeholder="DD/MM/YYYY"
                    className={cn('h-12 text-b2 w-full')}
                    disableFutureDates={true}
                  />
                )}
              />
              <FormErrorMessage message={errors.dob?.message} />
            </div>
            <TextInput type="email" label="Email address" {...register('email')} error={errors.email?.message} />
            <TextInput label="Phone number" {...register('phone')} error={errors.phone?.message} />
            <TextInput label="Nationality" {...register('country')} error={errors.country?.message} />
            <TextInput label="Address" {...register('state')} error={errors.state?.message} />
            <TextInput label="Passport number" {...register('passport')} error={errors.passport?.message} />
            <div className="space-y-2">
              <Label className="text-b2" htmlFor="issueDate">
                Passport issue date
              </Label>
              <Controller
                name="issueDate"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    side="top"
                    value={getDateValue(field.value)}
                    onChange={handleDateChange('issueDate')}
                    placeholder="DD/MM/YYYY"
                    className="h-12 text-b2 w-full"
                    error={!!errors.issueDate?.message}
                  />
                )}
              />
              <FormErrorMessage message={errors.issueDate?.message} />
            </div>
            <div className="space-y-2">
              <Label className="text-b2" htmlFor="expiryDate">
                Passport expiry date
              </Label>
              <Controller
                name="expiryDate"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    side="top"
                    value={getDateValue(field.value)}
                    onChange={handleDateChange('expiryDate')}
                    placeholder="DD/MM/YYYY"
                    className="h-12 text-b2 w-full"
                    error={!!errors.expiryDate?.message}
                  />
                )}
              />
              <FormErrorMessage message={errors.expiryDate?.message} />
            </div>
            <SelectField
              control={control}
              name="location"
              label="Location"
              options={[
                { label: 'Onshore', value: 'Onshore' },
                { label: 'Offshore', value: 'Offshore' },
              ]}
              placeholder="Select your location type"
            />
          </div>
        </FormAccordion>

        {/* Visa Information */}
        <FormAccordion value="item-2" title="Visa Information">
          <div className="grid grid-cols-3 gap-6">
            <SelectField
              control={control}
              name="currentVisa"
              label="Current visa"
              options={[
                { label: 'Student Visa', value: 'Student Visa' },
                { label: 'Work Visa', value: 'Work Visa' },
                { label: 'Tourist Visa', value: 'Tourist Visa' },
                { label: 'Permanent Resident', value: 'Permanent Resident' },
                { label: 'No Visa', value: 'No Visa' },
              ]}
              placeholder="Select current visa type"
            />
            <div className="space-y-2">
              <Label className="text-b2" htmlFor="visaExpiry">
                Visa expiry date
              </Label>
              <Controller
                name="visaExpiry"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    side="top"
                    value={getDateValue(field.value)}
                    onChange={handleDateChange('visaExpiry')}
                    placeholder="DD/MM/YYYY"
                    className="h-12 text-b2 w-full"
                    error={!!errors.visaExpiry?.message}
                  />
                )}
              />
              <FormErrorMessage message={errors.visaExpiry?.message} />
            </div>
            <div className="space-y-2">
              <Label className="text-b2" htmlFor="dueDate">
                Due date
              </Label>
              <Controller
                name="dueDate"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    side="top"
                    value={getDateValue(field.value)}
                    onChange={handleDateChange('dueDate')}
                    placeholder="DD/MM/YYYY"
                    className="h-12 text-b2 w-full"
                    error={!!errors.dueDate?.message}
                  />
                )}
              />
              <FormErrorMessage message={errors.dueDate?.message} />
            </div>
            <SelectField
              control={control}
              name="proposedVisa"
              label="Proposed visa"
              options={[
                { label: 'Student Visa', value: 'Student Visa' },
                { label: 'Work Visa', value: 'Work Visa' },
                { label: 'Skilled Migration', value: 'Skilled Migration' },
                { label: 'Family Visa', value: 'Family Visa' },
                { label: 'Business Visa', value: 'Business Visa' },
              ]}
              placeholder="Select proposed visa type"
            />
            <SelectField
              control={control}
              name="visaStream"
              label="Visa Stream"
              options={[
                { label: 'Employer sponsored', value: 'Employer sponsored' },
                { label: 'Skilled migration', value: 'Skilled migration' },
                { label: 'Family sponsored', value: 'Family sponsored' },
                { label: 'Other', value: 'Other' },
              ]}
              placeholder="Select an visaStream"
            />
            <FormField
              control={control}
              name="anzsco"
              render={({ field }) => (
                <SelectWithCommand
                  options={ANZSCOOccupationOptions || []}
                  value={field.value || undefined}
                  label="ANZSCO / Occupation"
                  onSelect={(val) => {
                    field.onChange(val);
                    const occupation = occupations?.find((occupation) => occupation.code === val);
                    setValue('occupation', occupation?.title, { shouldValidate: false });
                  }}
                  error={errors.anzsco?.message}
                />
              )}
            />
            <TextInput label="Sponsor name" {...register('sponsorName')} error={errors.sponsorName?.message} />
            <TextInput
              type="email"
              label="Sponsor email"
              {...register('sponsorEmail')}
              error={errors.sponsorEmail?.message}
            />
            <TextInput label="Sponsor phone" {...register('sponsorPhone')} error={errors.sponsorPhone?.message} />
            <SelectField
              control={control}
              name="csaStatus"
              label="SBS/TAS status"
              options={[
                { label: 'Approved', value: 'Approved' },
                { label: 'Pending', value: 'Pending' },
                { label: 'Rejected', value: 'Rejected' },
              ]}
              placeholder="Select a status"
            />
            <div className="space-y-2">
              <Label className="text-b2" htmlFor="visaSubmitted">
                Date submitted
              </Label>
              <Controller
                name="visaSubmitted"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    side="top"
                    value={getDateValue(field.value)}
                    onChange={handleDateChange('visaSubmitted')}
                    placeholder="DD/MM/YYYY"
                    className="h-12 text-b2 w-full"
                    error={!!errors.visaSubmitted?.message}
                  />
                )}
              />
              <FormErrorMessage message={errors.visaSubmitted?.message} />
            </div>
            <div className="space-y-2">
              <Label className="text-b2" htmlFor="visaGranted">
                Decision date
              </Label>
              <Controller
                name="visaGranted"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    side="top"
                    value={getDateValue(field.value)}
                    onChange={handleDateChange('visaGranted')}
                    placeholder="DD/MM/YYYY"
                    className="h-12 text-b2 w-full"
                    error={!!errors.visaGranted?.message}
                  />
                )}
              />
              <FormErrorMessage message={errors.visaGranted?.message} />
            </div>
            <SelectField
              control={control}
              name="nominationStatus"
              label="Nomination status"
              options={[
                { label: 'New', value: 'New' },
                { label: 'Collecting docs', value: 'Collecting docs' },
                { label: 'Ready to submit', value: 'Ready to submit' },
                { label: 'Submitted', value: 'Submitted' },
                { label: 'Info requested', value: 'Info requested' },
                { label: 'Approved', value: 'Approved' },
                { label: 'Withdrawn', value: 'Withdrawn' },
                { label: 'Refused', value: 'Refused' },
                { label: 'Discontinued', value: 'Discontinued' },
              ]}
              placeholder="Select a status"
            />
            <div className="space-y-2">
              <Label className="text-b2" htmlFor="nominationLodged">
                Nomination date submitted
              </Label>
              <Controller
                name="nominationLodged"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    side="top"
                    value={getDateValue(field.value)}
                    onChange={handleDateChange('nominationLodged')}
                    placeholder="DD/MM/YYYY"
                    className="h-12 text-b2 w-full"
                    error={!!errors.nominationLodged?.message}
                  />
                )}
              />
              <FormErrorMessage message={errors.nominationLodged?.message} />
            </div>
            <div className="space-y-2">
              <Label className="text-b2" htmlFor="nominationDecision">
                Nomination decision date
              </Label>
              <Controller
                name="nominationDecision"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    side="top"
                    value={getDateValue(field.value)}
                    onChange={handleDateChange('nominationDecision')}
                    placeholder="DD/MM/YYYY"
                    className="h-12 text-b2 w-full"
                    error={!!errors.nominationDecision?.message}
                  />
                )}
              />
              <FormErrorMessage message={errors.nominationDecision?.message} />
            </div>
            <SelectField
              control={control}
              name="status"
              label="Visa status"
              options={[
                { label: 'Approved', value: 'Approved' },
                { label: 'Pending', value: 'Pending' },
                { label: 'Rejected', value: 'Rejected' },
                { label: 'Under Review', value: 'Under Review' },
              ]}
              placeholder="Select a status"
            />
            <div className="space-y-2">
              <Label className="text-b2" htmlFor="visaSubmitted">
                Visa date submitted
              </Label>
              <Controller
                name="visaSubmitted"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    side="top"
                    value={getDateValue(field.value)}
                    onChange={handleDateChange('visaSubmitted')}
                    placeholder="DD/MM/YYYY"
                    className="h-12 text-b2 w-full"
                    error={!!errors.visaSubmitted?.message}
                  />
                )}
              />
              <FormErrorMessage message={errors.visaSubmitted?.message} />
            </div>
            <div className="space-y-2">
              <Label className="text-b2" htmlFor="visaGranted">
                Visa decision date
              </Label>
              <Controller
                name="visaGranted"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    side="top"
                    value={getDateValue(field.value)}
                    onChange={handleDateChange('visaGranted')}
                    placeholder="DD/MM/YYYY"
                    className="h-12 text-b2 w-full"
                    error={!!errors.visaGranted?.message}
                  />
                )}
              />
              <FormErrorMessage message={errors.visaGranted?.message} />
            </div>
          </div>

          <div className="w-full space-y-1" suppressHydrationWarning>
            <Label className=" font-medium" htmlFor="remarks">
              Visa note
            </Label>
            <TinyEditor value={remarks || ''} onChange={handleRemarksChange} />
            {errors.remarks?.message && <p className="text-sm text-red-500">{errors.remarks.message}</p>}
          </div>
        </FormAccordion>

        {/* Accounts */}

        {/* Misc */}
        <FormAccordion value="item-6" title="Misc">
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
                  onSelect={(val) => field.onChange(Number(val))}
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
                  onSelect={(val) => field.onChange(Number(val))}
                  error={errors.userId?.message}
                />
              )}
            />
          </div>
          <div>
            <Label>Note</Label>
            <div className="w-full space-y-1 mt-2" suppressHydrationWarning>
              <TinyEditor value={miscNote || ''} onChange={handleMiscNoteChange} />
              {errors.miscNote?.message && <p className="text-sm text-red-500">{errors.miscNote.message}</p>}
            </div>
          </div>
        </FormAccordion>
      </Accordion>

      <div className="flex justify-start mt-6">
        <Button loading={isPending} loadingText="Updating" type="submit" variant="primary">
          Update Visa Applicant
        </Button>
        <Button type="button" variant="outline" className="ml-3" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
