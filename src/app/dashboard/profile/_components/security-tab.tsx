'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { PasswordChangeSchema, type PasswordChangeSchemaType } from '@/schemas/profile-schema';
import { useUserUpdate } from '@/mutations/auth/login';
import Button from '@/components/common/button';
import { Label } from '@/components/ui/label';
import Input from '@/components/common/input';

const PersonalDetailsTab = ({ user }: any) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PasswordChangeSchemaType>({
    resolver: zodResolver(PasswordChangeSchema),
  });

  const { mutate: updateUser } = useUserUpdate();

  const onSubmit = (data: PasswordChangeSchemaType) => {
    //updateUser(data);
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
        <div className="flex flex-col gap-2">
          <Label htmlFor="oldPassword">Old Password</Label>
          <Input {...register('oldPassword')} id="oldPassword" type="password" />
          {errors.oldPassword && <span className="text-red-500 text-sm">{errors.oldPassword.message}</span>}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="newPassword">New Password</Label>
          <Input {...register('newPassword')} id="newPassword" type="password" />
          {errors.newPassword && <span className="text-red-500 text-sm">{errors.newPassword.message}</span>}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input {...register('confirmPassword')} id="confirmPassword" type="password" />
          {errors.confirmPassword && <span className="text-red-500 text-sm">{errors.confirmPassword.message}</span>}
        </div>

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
