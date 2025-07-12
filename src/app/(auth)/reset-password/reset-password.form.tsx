'use client';
import * as React from 'react';
import { toast } from 'sonner';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '@/components/ui/button';
import { useUserResetPassword } from '@/mutations/auth/login';
import useSearchParams from '@/hooks/use-search-params';
import { resetPasswordSchema } from './reset-password.schema';
import PasswordInput from '@/components/common/password-input';
import { validatePassword } from '@/constants/password-criteria';
import PasswordCriteria from '@/app/(auth)/_components/password-criteria';
import { ResetPasswordCredentials } from '@/mutations/auth/login';
import PasswordChangeSuccess from '@/app/(auth)/reset-password/_components/password-change-success';
import { useRouter } from '@/lib/navigation';

const ResetPasswordForm: React.FC = () => {
  const { searchParams } = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token') || '';

  const { mutate: userResetPassword, isPending, isSuccess, error } = useUserResetPassword();

  const defaultValues: ResetPasswordCredentials = {
    password: '',
  };

  const {
    handleSubmit,
    formState: { errors },
    control,
    watch,
  } = useForm({
    defaultValues,
    resolver: zodResolver(resetPasswordSchema),
  });

  const password = watch('password');
  const currentYear = new Date().getFullYear();
  const onResetPasswordFormSubmit = (data: ResetPasswordCredentials) => {
    userResetPassword(
      {
        params: { token },
        payload: {
          password: data.password,
        },
      },
      {
        onError: (error: any) => {
          let errorMessage = error?.response?.data?.message || 'Something went wrong.';
          if (error?.response?.status === 401) {
            errorMessage = 'Email or Password is not correct.';
          }
          toast.error(errorMessage);
          // When user is in forget password page and the token is expired error is thrown refresh the page so the it is redirected token expire page
          router.refresh();
        },
      },
    );
  };
  const isValidPassword = validatePassword(password);

  if (isSuccess) {
    return <PasswordChangeSuccess />;
  }

  return (
    <form onSubmit={handleSubmit(onResetPasswordFormSubmit)} className="w-[400px] m-auto">
      <div className="flex flex-col mb-10 items-center">
        {/* <BrandLogoNav logo="one-accord" /> */}

        <h2 className="text-h2 text-center text-content-heading mt-20">Create Your New Password</h2>
      </div>

      <div className="flex flex-col gap-4 ">
        <Controller
          control={control}
          name="password"
          render={({ field }) => (
            <PasswordInput {...field} label="Password" autoComplete="off" error={errors.password?.message} />
          )}
        />

        <PasswordCriteria password={password} />
      </div>

      <Button loading={isPending || isSuccess} disabled={!isValidPassword} className="w-full mt-10" type="submit">
        Update Password
      </Button>

      <div className="text-content-body text-center text-[13px] mt-20 font-normal">© Success {currentYear}</div>
    </form>
  );
};

export default ResetPasswordForm;
