'use client';
import { FormField } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { PasswordChangeSchema, type PasswordChangeSchemaType } from '@/schemas/profile-schema';
import Input from '@/components/common/input';
import { useUserUpdate } from '@/mutations/auth/login';
import Button from '@/components/common/button';

const PersonalDetailsTab = ({ user }: any) => {
  const form = useForm<PasswordChangeSchemaType>({
    resolver: zodResolver(PasswordChangeSchema),
    defaultValues: {
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
    mode: 'onChange',
  });

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = form;

  const { mutate: updateUser } = useUserUpdate();

  const onSubmit = (data: PasswordChangeSchemaType) => {
    //updateUser(data);
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
        <FormField
          control={control}
          name="oldPassword"
          render={({ field }) => <Input {...field} label="Old Password" error={errors.oldPassword?.message} />}
        />

        <FormField
          control={control}
          name="newPassword"
          render={({ field }) => (
            <Input
              {...field}
              label="New Password"
              type="password"
              error={errors.newPassword?.message}
              value={field.value || ''}
              onChange={field.onChange}
            />
          )}
        />

        <FormField
          control={control}
          name="confirmPassword"
          render={({ field }) => (
            <Input
              {...field}
              type="password"
              label="Confirm Password"
              error={errors.confirmPassword?.message}
              value={field.value || ''}
              onChange={field.onChange}
            />
          )}
        />

        <Button
          type="submit"
          className="w-[143px] ml-auto btn btn-primary mt-4"
          disabled={Object.keys(errors).length > 0}
        >
          Save Changes
        </Button>
      </form>
    </>
  );
};

export default PersonalDetailsTab;
