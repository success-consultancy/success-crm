'use client';

import { FormField } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { PasswordChangeSchema, PasswordChangeSchemaType } from '@/schema/profile-schema';
import { useChangePassword } from '@/mutations/auth/change-password';
import Input from '@/components/molecules/input';
import Button from '@/components/atoms/button';


const SecurityTab = () => {
  const form = useForm<PasswordChangeSchemaType>({
    resolver: zodResolver(PasswordChangeSchema),
    defaultValues: {
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
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
    console.log('Submitting password change:', data);
    mutate(data, {
      onSuccess: () => {
        reset();
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
      <FormField
        control={control}
        name="oldPassword"
        render={({ field }) => (
          <Input {...field} label="Old Password" type="password" error={errors.oldPassword?.message} />
        )}
      />

      <FormField
        control={control}
        name="newPassword"
        render={({ field }) => (
          <Input {...field} label="New Password" type="password" error={errors.newPassword?.message} />
        )}
      />

      <FormField
        control={control}
        name="confirmPassword"
        render={({ field }) => (
          <Input {...field} label="Confirm Password" type="password" error={errors.confirmPassword?.message} />
        )}
      />

      <Button
        type="submit"
        className="w-[143px] ml-auto btn btn-primary mt-4"
        disabled={!isValid || isPending}
        loading={isPending}
      >
        Save Changes
      </Button>
    </form>
  );
};

export default SecurityTab;
