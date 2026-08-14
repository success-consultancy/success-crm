'use client';

import { FormField } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { PasswordChangeSchema, PasswordChangeSchemaType } from '@/schema/profile-schema';
import { useChangePassword } from '@/mutations/auth/change-password';
import PasswordInput from '@/components/molecules/password-input';
import Button from '@/components/atoms/button';

const SecurityTab = () => {
  const form = useForm<PasswordChangeSchemaType>({
    resolver: zodResolver(PasswordChangeSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
    },
    mode: 'onChange',
  });

  const { mutate, isPending } = useChangePassword();

  const {
    handleSubmit,
    control,
    formState: { errors, isValid },
    reset,
  } = form;

  const onSubmit = (data: PasswordChangeSchemaType) => {
    mutate(data, {
      onSuccess: () => {
        reset();
      },
    });
  };

  return (
    <>
      <h3 className="text-b3-b text-content-heading font-bold mb-[2px]">Change password</h3>
      <p className="text-neutral-dark-grey text-b1 mb-6">
        Your new password must be different from your previous used passwords.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3 max-w-[37.5rem]">
        <FormField
          control={control}
          name="currentPassword"
          render={({ field }) => (
            <PasswordInput {...field} label="Current password" error={errors.currentPassword?.message} />
          )}
        />

        <FormField
          control={control}
          name="newPassword"
          render={({ field }) => (
            <PasswordInput
              {...field}
              label="New password"
              placeholder="Minimum 8 characters"
              error={errors.newPassword?.message}
            />
          )}
        />

        <div className="flex items-center gap-3 mt-4">
          <Button type="submit" className="w-[143px]" disabled={!isValid || isPending} loading={isPending}>
            Save password
          </Button>
          <Button type="button" variant="outline" className="w-[143px]" onClick={() => reset()} disabled={isPending}>
            Cancel
          </Button>
        </div>
      </form>
    </>
  );
};

export default SecurityTab;
