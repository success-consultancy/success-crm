'use client';

import { Accordion } from '@/components/ui/accordion';
import {
  newVisaServiceDefaultValues,
  newVisaServiceSchema,
  NewVisaServiceType,
} from '@/schema/visa-service/new-visa.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';
import { format } from 'date-fns';
import { useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';

import { cn } from '@/lib/utils';

import TextInput from '@/components/molecules/text-input';
import { Label } from '@/components/ui/label';
import { DatePicker } from '@/components/organisms/date-picker';
import FormErrorMessage from '@/components/atoms/form-error-message';
import SelectField from '@/components/organisms/select-field';
import Button from '@/components/atoms/button';
import { FormAccordion } from '@/components/organisms/form-accordion';
import { useAddVisaService } from '@/mutations/visa/add-visa';
import { useEditVisa } from '@/mutations/visa/edit-visa';
import toast from 'react-hot-toast';
import { useGetSource } from '@/query/get-source';
import TinyEditor from '@/components/organisms/text-editor';
import { FormField } from '@/components/ui/form';
import SelectWithCommand from '@/components/molecules/select-with-command';
import { useGetUsers } from '@/query/get-user';
import { useGetOccupations } from '@/query/get-occupations';
import { useGetVisaConst } from '@/query/get-visa';
import Portal from '@/components/atoms/portal';
import { PortalIds } from '@/config/portal';
import { FORM_STATE } from '@/types/common';
import { IAccount } from '@/schema/account-schema';
import Accounts from '../../[id]/view/_components/accounts';
import { VisaStatusTypes } from '@/types/response-types/visa-response';
import { ArrowLeft } from 'lucide-react';
import { ROUTES } from '@/config/routes';
import { FormActions } from '@/components/organisms/form-actions';

interface Props {
  userId: number | undefined;
  formState: FORM_STATE;
  id?: number;
  defaultValues?: Partial<NewVisaServiceType>;
  accounts?: IAccount[];
}

export function VisaService({ userId, formState, id, defaultValues, accounts = [] }: Props) {
  const router = useRouter();
  const isAdd = formState === FORM_STATE.ADD;

  const {
    register,
    control,
    watch,
    setValue,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<NewVisaServiceType>({
    resolver: zodResolver(newVisaServiceSchema) as any,
    defaultValues: isAdd ? newVisaServiceDefaultValues : defaultValues,
    mode: 'onChange',
  });

  const { data: sourceData } = useGetSource();
  const { data: users } = useGetUsers();
  const { data: occupations } = useGetOccupations();
  const { data: visas } = useGetVisaConst();

  const discount = watch('accounts.discount');
  const amount = watch('accounts.amount');
  const remarks = watch('remarks');
  const feeNote = watch('accounts.feeNote');
  const miscNote = watch('miscNote');

  const ANZSCOOccupationOptions = useMemo(() => {
    return occupations?.map((occupation) => ({
      value: occupation.code,
      label: occupation.title + ' - ' + occupation.code,
    }));
  }, [occupations]);

  const visaOptions = useMemo(() => {
    return visas?.map((visa) => ({ label: visa.visaType, value: visa.visaType })) ?? [];
  }, [visas]);

  useEffect(() => {
    if (userId) {
      setValue('userId', userId);
      setValue('updatedBy', userId);
      if (isAdd) setValue('accounts.updatedBy', userId);
    }
  }, [userId, setValue, isAdd]);

  useEffect(() => {
    if (isAdd) {
      const amountValue = Number(amount) || 0;
      const discountValue = Number(discount) || 0;
      const gstValue = (amountValue * 0.1).toFixed(2);
      const netAmountValue = (amountValue + Number(gstValue) - discountValue).toFixed(2);
      setValue('accounts.gst', gstValue, { shouldValidate: false });
      setValue('accounts.netamount', netAmountValue, { shouldValidate: false });
    }
  }, [amount, discount, setValue, isAdd]);

  const [selectedOccupation, selectedANZSCO] = watch(['occupation', 'anzsco']);

  useEffect(() => {
    if (selectedOccupation) {
      const selected = occupations?.find((o) => o.title === selectedOccupation);
      setValue('anzsco', selected?.code, { shouldValidate: false });
    }
  }, [selectedOccupation, occupations, setValue]);

  useEffect(() => {
    if (selectedANZSCO) {
      const selected = occupations?.find((o) => o.code === selectedANZSCO);
      setValue('occupation', selected?.title, { shouldValidate: false });
    }
  }, [selectedANZSCO, occupations, setValue]);

  const { mutate: addVisa, isPending: addPending } = useAddVisaService();
  const { mutate: editVisa, isPending: editPending } = useEditVisa();
  const isPending = isAdd ? addPending : editPending;

  const submitHandler = (data: NewVisaServiceType) => {
    if (isAdd) {
      addVisa(
        { payload: { ...data, sourceId: data.sourceId } },
        {
          onSuccess: () => {
            toast.success('Visa applicant added successfully');
            reset();
          },
          onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Failed to add visa applicant');
          },
        },
      );
    } else {
      editVisa(
        { id: id!, ...data, sourceId: data.sourceId },
        {
          onSuccess: () => {
            toast.success('Visa applicant updated successfully');
          },
          onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Failed to update visa applicant');
          },
        },
      );
    }
  };

  const userOptions = useMemo(() => {
    return (
      users?.map((user) => ({
        label: `${user.firstName} ${user.lastName}`,
        value: user.id.toString(),
      })) || []
    );
  }, [users]);

  const sourceOptions = useMemo(() => {
    return (
      sourceData?.map((source) => ({
        label: source.name,
        value: source.id.toString(),
      })) || []
    );
  }, [sourceData]);

  const handleDateChange = (fieldName: keyof NewVisaServiceType) => (date: Date | undefined) => {
    if (date) {
      setValue(fieldName, format(date, 'yyyy-MM-dd') as any, { shouldValidate: true });
    } else {
      setValue(fieldName, '' as any, { shouldValidate: true });
    }
  };

  const getDateValue = (dateString: string | null | undefined): Date | undefined => {
    if (!dateString || dateString === '') return undefined;
    try {
      const date = new Date(dateString);
      return isNaN(date.getTime()) ? undefined : date;
    } catch {
      return undefined;
    }
  };

  return (
    <form className="w-full" onSubmit={handleSubmit(submitHandler)}>
      <Portal rootId={PortalIds.DashboardHeader}>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" type="button" onClick={() => isAdd ? router.push(ROUTES.VISA) : router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h3 className="text-h4 text-content-heading font-bold">
            {isAdd ? 'New Visa Applicant' : 'Edit Visa Applicant'}
          </h3>
        </div>
      </Portal>
      <Accordion type="multiple" className="w-full space-y-3.5" defaultValue={['item-1', 'item-2', 'item-4', 'item-6']}>
        {/* Personal Details */}
        <FormAccordion value="item-1" title="Personal details">
          <div className="grid grid-cols-3 gap-5">
            <TextInput label="First name" {...register('firstName')} error={errors.firstName?.message} />
            <TextInput label="Middle name (optional)" {...register('middleName')} error={errors.middleName?.message} />
            <TextInput label="Last name" {...register('lastName')} error={errors.lastName?.message} />
            <div className="space-y-2">
              <Controller
                name="dob"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    label="Date of birth"
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
              <Controller
                name="issueDate"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    label="Passport issue date"
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
              <Controller
                name="expiryDate"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    label="Passport expiry date"
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
          <div className="grid grid-cols-3 gap-5">
            <FormField
              control={control}
              name="currentVisa"
              render={({ field }) => (
                <SelectWithCommand
                  options={visaOptions}
                  value={field.value ?? undefined}
                  label="Current visa"
                  placeholder="Select current visa type"
                  onSelect={(val) => field.onChange(val)}
                  error={errors.currentVisa?.message}
                />
              )}
            />
            <div className="space-y-2">
              <Controller
                name="visaExpiry"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    label="Visa expiry date"
                    side="top"
                    value={getDateValue(field.value)}
                    onChange={handleDateChange('visaExpiry')}
                    placeholder="DD/MM/YYYY"
                    className="h-12 text-b2 w-full"
                    error={!!errors.visaExpiry?.message}
                    disablePastDates={true}
                  />
                )}
              />
              <FormErrorMessage message={errors.visaExpiry?.message} />
            </div>
            <div className="space-y-2">
              <Controller
                name="dueDate"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    label="Due date"
                    side="top"
                    value={getDateValue(field.value)}
                    onChange={handleDateChange('dueDate')}
                    placeholder="DD/MM/YYYY"
                    className="h-12 text-b2 w-full"
                    error={!!errors.dueDate?.message}
                    disablePastDates={true}
                  />
                )}
              />
              <FormErrorMessage message={errors.dueDate?.message} />
            </div>
            <FormField
              control={control}
              name="proposedVisa"
              render={({ field }) => (
                <SelectWithCommand
                  options={visaOptions}
                  value={field.value ?? undefined}
                  label="Proposed visa"
                  placeholder="Select proposed visa type"
                  onSelect={(val) => field.onChange(val)}
                  error={errors.proposedVisa?.message}
                />
              )}
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
                    const occupation = occupations?.find((o) => o.code === val);
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
                { label: VisaStatusTypes.New, value: VisaStatusTypes.New },
                { label: VisaStatusTypes.CollectingDocs, value: VisaStatusTypes.CollectingDocs },
                { label: VisaStatusTypes.ReadyToSubmit, value: VisaStatusTypes.ReadyToSubmit },
                { label: VisaStatusTypes.Submitted, value: VisaStatusTypes.Submitted },
                { label: VisaStatusTypes.InfoRequested, value: VisaStatusTypes.InfoRequested },
                { label: VisaStatusTypes.Approved, value: VisaStatusTypes.Approved },
                { label: VisaStatusTypes.Withdrawn, value: VisaStatusTypes.Withdrawn },
                { label: VisaStatusTypes.Refused, value: VisaStatusTypes.Refused },
                { label: VisaStatusTypes.Discontinued, value: VisaStatusTypes.Discontinued },
              ]}
              placeholder="Select a status"
            />
            <div className="space-y-2">
              <Controller
                name="visaSubmitted"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    label="Date submitted"
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
              <Controller
                name="visaGranted"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    label="Decision date"
                    side="top"
                    value={getDateValue(field.value)}
                    onChange={handleDateChange('visaGranted')}
                    placeholder="DD/MM/YYYY"
                    className="h-12 text-b2 w-full"
                    error={!!errors.visaGranted?.message}
                    disablePastDates={true}
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
                { label: VisaStatusTypes.New, value: VisaStatusTypes.New },
                { label: VisaStatusTypes.CollectingDocs, value: VisaStatusTypes.CollectingDocs },
                { label: VisaStatusTypes.ReadyToSubmit, value: VisaStatusTypes.ReadyToSubmit },
                { label: VisaStatusTypes.Submitted, value: VisaStatusTypes.Submitted },
                { label: VisaStatusTypes.InfoRequested, value: VisaStatusTypes.InfoRequested },
                { label: VisaStatusTypes.Approved, value: VisaStatusTypes.Approved },
                { label: VisaStatusTypes.Withdrawn, value: VisaStatusTypes.Withdrawn },
                { label: VisaStatusTypes.Refused, value: VisaStatusTypes.Refused },
                { label: VisaStatusTypes.Discontinued, value: VisaStatusTypes.Discontinued },
              ]}
              placeholder="Select a status"
            />
            <div className="space-y-2">
              <Controller
                name="nominationLodged"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    label="Nomination date submitted"
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
              <Controller
                name="nominationDecision"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    label="Nomination decision date"
                    side="top"
                    value={getDateValue(field.value)}
                    onChange={handleDateChange('nominationDecision')}
                    placeholder="DD/MM/YYYY"
                    className="h-12 text-b2 w-full"
                    error={!!errors.nominationDecision?.message}
                    disablePastDates={true}
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
                { label: VisaStatusTypes.New, value: VisaStatusTypes.New },
                { label: VisaStatusTypes.CollectingDocs, value: VisaStatusTypes.CollectingDocs },
                { label: VisaStatusTypes.ReadyToSubmit, value: VisaStatusTypes.ReadyToSubmit },
                { label: VisaStatusTypes.Submitted, value: VisaStatusTypes.Submitted },
                { label: VisaStatusTypes.InfoRequested, value: VisaStatusTypes.InfoRequested },
                { label: VisaStatusTypes.Approved, value: VisaStatusTypes.Approved },
                { label: VisaStatusTypes.Withdrawn, value: VisaStatusTypes.Withdrawn },
                { label: VisaStatusTypes.Refused, value: VisaStatusTypes.Refused },
                { label: VisaStatusTypes.Discontinued, value: VisaStatusTypes.Discontinued },
              ]}
              placeholder="Select a status"
            />
            <div className="space-y-2">
              <Controller
                name="visaSubmitted"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    label="Visa date submitted"
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
              <Controller
                name="visaGranted"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    label="Visa decision date"
                    side="top"
                    value={getDateValue(field.value)}
                    onChange={handleDateChange('visaGranted')}
                    placeholder="DD/MM/YYYY"
                    className="h-12 text-b2 w-full"
                    error={!!errors.visaGranted?.message}
                    disablePastDates={true}
                  />
                )}
              />
              <FormErrorMessage message={errors.visaGranted?.message} />
            </div>
          </div>

          <div className="w-full space-y-1" suppressHydrationWarning>
            <Label htmlFor="remarks">Visa note</Label>
            <TinyEditor
              value={remarks || ''}
              onChange={(content) => setValue('remarks', content, { shouldValidate: true })}
            />
            {errors.remarks?.message && <p className="text-sm text-red-500">{errors.remarks.message}</p>}
          </div>
        </FormAccordion>

        {/* Accounts — inline form on add, existing accounts panel on edit */}
        {isAdd ? (
          <FormAccordion value="item-4" title="Accounts">
            <div className="grid grid-cols-3 gap-5">
              <TextInput
                label="Fee payment plan"
                {...register('accounts.planname')}
                error={errors.payment?.message}
                placeholder="Select/enter payment plan"
              />
              <TextInput
                label="Service fee"
                {...register('accounts.amount')}
                error={errors.payment?.message}
                type="number"
              />
              <TextInput
                disabled
                label="GST"
                {...register('accounts.gst')}
                error={errors.payment?.message}
                type="number"
              />
              <TextInput
                label="Discount"
                {...register('accounts.discount')}
                error={errors.payment?.message}
                type="number"
              />
              <TextInput
                disabled
                label="Net amount"
                {...register('accounts.netamount')}
                error={errors.payment?.message}
                type="number"
              />
              <TextInput
                label="Invoice number"
                {...register('accounts.invoicenumber')}
                error={errors.invoiceNumber?.message}
              />
              <div className="space-y-2">
                <Controller
                  name="accounts.duedate"
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      label="Due Date"
                      side="top"
                      value={field.value ? new Date(field.value) : undefined}
                      onChange={(date) => field.onChange(date ? format(date, 'yyyy-MM-dd') : null)}
                      placeholder="Pick a date"
                      className="w-full"
                      disablePastDates={true}
                    />
                  )}
                />
                <FormErrorMessage message={errors.accounts?.duedate?.message} />
              </div>
              <SelectField
                control={control}
                name="accounts.status"
                label="Payment status"
                options={[
                  { label: 'Pending', value: 'Pending' },
                  { label: 'Paid', value: 'Paid' },
                  { label: 'Overdue', value: 'Overdue' },
                  { label: 'Cancelled', value: 'Cancelled' },
                ]}
                placeholder="Select a status"
              />
            </div>
            <div className="w-full space-y-1" suppressHydrationWarning>
              <Label htmlFor="feeNote">Fee note</Label>
              <TinyEditor
                value={feeNote || ''}
                onChange={(content) => setValue('accounts.feeNote', content, { shouldValidate: true })}
              />
              {errors.accounts?.feeNote?.message && (
                <p className="text-sm text-red-500">{errors.accounts?.feeNote?.message}</p>
              )}
            </div>
          </FormAccordion>
        ) : (
          <Accounts accounts={accounts} visaApplicantId={id!} />
        )}

        {/* Misc */}
        <FormAccordion value="item-6" title="Misc">
          <div className="grid grid-cols-2 gap-5">
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
            <Label>Note</Label>
            <div className="w-full space-y-1 mt-2" suppressHydrationWarning>
              <TinyEditor
                value={miscNote || ''}
                onChange={(content) => setValue('miscNote', content, { shouldValidate: true })}
              />
              {errors.miscNote?.message && <p className="text-sm text-red-500">{errors.miscNote.message}</p>}
            </div>
          </div>
        </FormAccordion>
      </Accordion>

      <FormActions>
        <Button loading={isPending} loadingText={isAdd ? 'Processing' : 'Updating'} type="submit" variant="primary">
          {isAdd ? 'Add Visa Applicant' : 'Update Visa Applicant'}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
      </FormActions>
    </form>
  );
}
