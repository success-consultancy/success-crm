'use client';

import { useForm, SubmitHandler, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Form, FormField } from '@/components/ui/form';
import { Accordion } from '@/components/ui/accordion';
import { FormAccordion } from '@/components/organisms/form-accordion';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import Portal from '@/components/atoms/portal';
import Button from '@/components/atoms/button';
import Input from '@/components/molecules/input';
import SelectCommon from '@/components/molecules/select-common';
import { PortalIds } from '@/config/portal';
import userFormSchema, { UserFormType } from '@/schema/user-schema';
import { useAddUser } from '@/mutations/user/add-user';
import { useUpdateUser } from '@/mutations/user/update-user';
import useAuthStore from '@/store/auth-store';
import { getAppointColorBasedOnUserName } from '@/utils/color';
import toast from 'react-hot-toast';

const ROLE_OPTIONS = [
  { label: 'Admin', value: '1' },
  { label: 'Manager', value: '2' },
  { label: 'Consultant', value: '3' },
];

const STATUS_OPTIONS = [
  { label: 'Active', value: 'true' },
  { label: 'Inactive', value: 'false' },
];

const COLOR_OPTIONS = [
  { label: 'Red', value: '#ef4444' },
  { label: 'Orange', value: '#f97316' },
  { label: 'Amber', value: '#f59e0b' },
  { label: 'Yellow', value: '#eab308' },
  { label: 'Lime', value: '#84cc16' },
  { label: 'Green', value: '#22c55e' },
  { label: 'Teal', value: '#14b8a6' },
  { label: 'Cyan', value: '#06b6d4' },
  { label: 'Blue', value: '#3b82f6' },
  { label: 'Indigo', value: '#6366f1' },
  { label: 'Violet', value: '#8b5cf6' },
  { label: 'Pink', value: '#ec4899' },
  { label: 'Rose', value: '#f43f5e' },
  { label: 'Gray', value: '#6b7280' },
];

const PERMISSIONS: { key: keyof UserFormType; label: string }[] = [
  { key: 'dashboardManagement', label: 'Dashboard Management' },
  { key: 'agencyAgreementManagement', label: 'Agency Agreement Management' },
  { key: 'userManagement', label: 'User Management' },
  { key: 'universityManagement', label: 'University Management' },
  { key: 'courseManagement', label: 'Course Management' },
  { key: 'sourceManagement', label: 'Source Management' },
  { key: 'settingManagement', label: 'Setting Management' },
];

type Props = {
  mode: 'add' | 'edit';
  defaultValues?: Partial<UserFormType & { id: number }>;
};

const applyServerErrors = (
  errors: Record<string, string>,
  setError: (field: any, error: { message: string }) => void,
) => {
  Object.entries(errors).forEach(([field, message]) => {
    setError(field, { message: String(message).replace(/^"[^"]*"\s*/, '') });
  });
};

const AddUserForm = ({ mode, defaultValues }: Props) => {
  const router = useRouter();
  const profile = useAuthStore((s) => s.profile);
  const { mutate: addUser, isPending: isAdding } = useAddUser();
  const { mutate: updateUser, isPending: isUpdating } = useUpdateUser();

  const form = useForm<UserFormType>({
    resolver: zodResolver(userFormSchema) as any,
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      password: '',
      address: '',
      color: '',
      roleId: 3,
      isActive: true,
      onlineAppointment: false,
      isPaid: false,
      dashboardManagement: false,
      agencyAgreementManagement: false,
      userManagement: false,
      universityManagement: false,
      courseManagement: false,
      sourceManagement: false,
      settingManagement: false,
      ...defaultValues,
    },
  });

  useEffect(() => {
    if (defaultValues) form.reset({ ...form.getValues(), ...defaultValues });
  }, [defaultValues]);

  const { control, handleSubmit, setError, formState: { errors } } = form;

  const firstName = useWatch({ control, name: 'firstName' });
  const lastName = useWatch({ control, name: 'lastName' });
  const selectedColor = useWatch({ control, name: 'color' });

  const activeColor = selectedColor ||
    (firstName || lastName
      ? getAppointColorBasedOnUserName(firstName || '', lastName || '', 'raw') as string
      : '');

  const onSubmit: SubmitHandler<UserFormType> = (data) => {
    if (mode === 'edit') {
      updateUser(
        {
          id: defaultValues?.id as number,
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone,
          address: data.address,
          color: data.color,
          roleId: data.roleId,
          isActive: data.isActive,
          onlineAppointment: data.onlineAppointment,
          isPaid: data.isPaid,
          paidAmount: null,
          appointmentNote: null,
          slotTime: null,
          dashboardManagement: data.dashboardManagement,
          agencyAgreementManagement: data.agencyAgreementManagement,
          userManagement: data.userManagement,
          universityManagement: data.universityManagement,
          courseManagement: data.courseManagement,
          sourceManagement: data.sourceManagement,
          settingManagement: data.settingManagement,
          updatedBy: profile?.id ?? 1,
        },
        {
          onSuccess: () => {
            toast.success('User updated successfully');
            router.push('/dashboard/users');
          },
          onError: (err: any) => {
            const serverErrors = err?.response?.data?.errors;
            if (serverErrors) {
              applyServerErrors(serverErrors, setError);
            }
            toast.error(err?.response?.data?.message || 'Failed to update user');
          },
        },
      );
    } else {
      if (!data.password) {
        setError('password', { message: 'Password is required' });
        return;
      }
      addUser(
        {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone,
          password: data.password,
          address: data.address,
          color: data.color,
          roleId: data.roleId,
          isActive: data.isActive,
          onlineAppointment: data.onlineAppointment,
          isPaid: data.isPaid,
          paidAmount: null,
          appointmentNote: null,
          slotTime: null,
          dashboardManagement: data.dashboardManagement,
          agencyAgreementManagement: data.agencyAgreementManagement,
          userManagement: data.userManagement,
          universityManagement: data.universityManagement,
          courseManagement: data.courseManagement,
          sourceManagement: data.sourceManagement,
          settingManagement: data.settingManagement,
        },
        {
          onSuccess: () => {
            toast.success('User added successfully');
            router.push('/dashboard/users');
          },
          onError: (err: any) => {
            const serverErrors = err?.response?.data?.errors;
            if (serverErrors) {
              applyServerErrors(serverErrors, setError);
            }
            toast.error(err?.response?.data?.message || 'Failed to add user');
          },
        },
      );
    }
  };

  const isPending = isAdding || isUpdating;

  return (
    <Form {...form}>
      <Portal rootId={PortalIds.DashboardHeader}>
        <h3 className="text-h4 text-content-heading font-bold">
          {mode === 'edit' ? 'Edit user' : 'New user'}
        </h3>
      </Portal>

      <Accordion type="multiple" className="w-full space-y-4" defaultValue={['basic', 'permissions']}>
        <FormAccordion value="basic" title="Basic Information">
          <div className="grid grid-cols-3 gap-6">
            <FormField
              control={control}
              name="firstName"
              render={({ field }) => (
                <Input label="First name" {...field} error={errors.firstName?.message} />
              )}
            />
            <FormField
              control={control}
              name="lastName"
              render={({ field }) => (
                <Input label="Last name" {...field} error={errors.lastName?.message} />
              )}
            />
            <FormField
              control={control}
              name="email"
              render={({ field }) => (
                <Input label="Email address" type="email" {...field} error={errors.email?.message} />
              )}
            />
            <FormField
              control={control}
              name="phone"
              render={({ field }) => (
                <Input label="Phone number" {...field} error={errors.phone?.message} />
              )}
            />
            {mode === 'add' && (
              <FormField
                control={control}
                name="password"
                render={({ field }) => (
                  <Input
                    label="Password"
                    type="password"
                    {...field}
                    value={field.value ?? ''}
                    error={errors.password?.message}
                  />
                )}
              />
            )}
            <FormField
              control={control}
              name="address"
              render={({ field }) => (
                <Input
                  label="Address"
                  {...field}
                  value={field.value ?? ''}
                  error={errors.address?.message}
                />
              )}
            />
            <FormField
              control={control}
              name="roleId"
              render={({ field }) => (
                <SelectCommon
                  label="Role"
                  options={ROLE_OPTIONS}
                  value={field.value ? String(field.value) : undefined}
                  onSelect={(val) => field.onChange(Number(val))}
                  error={errors.roleId?.message}
                />
              )}
            />
            <FormField
              control={control}
              name="isActive"
              render={({ field }) => (
                <SelectCommon
                  label="Status"
                  options={STATUS_OPTIONS}
                  value={field.value ? 'true' : 'false'}
                  onSelect={(val) => field.onChange(val === 'true')}
                />
              )}
            />
            <FormField
              control={control}
              name="color"
              render={({ field }) => (
                <div className="flex flex-col gap-2 flex-1 col-span-3">
                  <Label className="text-b3-b font-semibold">Color</Label>
                  {/* Current assigned color */}
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 border border-gray-200">
                    <span
                      className="w-8 h-8 rounded-full border-2 border-white shadow flex-shrink-0"
                      style={{ backgroundColor: activeColor || '#d1d5db' }}
                    />
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-700">
                        {field.value
                          ? COLOR_OPTIONS.find((c) => c.value === field.value)?.label ?? field.value
                          : activeColor
                          ? `Auto (${COLOR_OPTIONS.find((c) => c.value === activeColor)?.label ?? 'based on name'})`
                          : 'No color assigned'}
                      </span>
                      <span className="text-xs text-gray-400">
                        {field.value ? 'Manually set' : 'Automatically assigned from name'}
                      </span>
                    </div>
                    {field.value && (
                      <button
                        type="button"
                        className="ml-auto text-xs text-gray-400 hover:text-gray-600 underline"
                        onClick={() => field.onChange('')}
                      >
                        Reset to auto
                      </button>
                    )}
                  </div>
                  {/* Swatches to change */}
                  <div className="flex flex-wrap gap-2 pt-1">
                    {COLOR_OPTIONS.map((c) => (
                      <button
                        key={c.value}
                        type="button"
                        title={c.label}
                        onClick={() => field.onChange(c.value)}
                        className={`w-7 h-7 rounded-full border-2 transition-all ${
                          field.value === c.value
                            ? 'border-gray-800 scale-110 shadow'
                            : 'border-transparent hover:border-gray-400'
                        }`}
                        style={{ backgroundColor: c.value }}
                      />
                    ))}
                  </div>
                  {errors.color?.message && (
                    <span className="text-primary-red text-sm">{errors.color.message}</span>
                  )}
                </div>
              )}
            />
          </div>
        </FormAccordion>

        <FormAccordion value="permissions" title="Permissions">
          <div className="grid grid-cols-2 gap-4">
            {PERMISSIONS.map(({ key, label }) => (
              <FormField
                key={key}
                control={control}
                name={key}
                render={({ field }) => (
                  <div className="flex items-center gap-3">
                    <Checkbox
                      id={key}
                      checked={!!field.value}
                      onCheckedChange={(checked) => field.onChange(!!checked)}
                    />
                    <Label htmlFor={key} className="text-sm font-normal cursor-pointer">
                      {label}
                    </Label>
                  </div>
                )}
              />
            ))}
          </div>
        </FormAccordion>
      </Accordion>

      <div className="flex items-center justify-end gap-4 mt-6">
        <Button onClick={handleSubmit(onSubmit)} disabled={isPending}>
          {mode === 'edit'
            ? isPending ? 'Saving...' : 'Save Changes'
            : isPending ? 'Adding...' : 'Add User'}
        </Button>
        <Button variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </Form>
  );
};

export default AddUserForm;
