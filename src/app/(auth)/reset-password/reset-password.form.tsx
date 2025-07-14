'use client';
import * as React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useState } from 'react';
import { Eye, EyeClosed } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useUserResetPassword } from '@/mutations/auth/login';
import useSearchParams from '@/hooks/use-search-params';
import { resetPasswordSchema, ResetPasswordSchemaType } from './reset-password.schema';
import Input from '@/components/common/input';
import { validatePassword } from '@/constants/password-criteria';
import PasswordCriteria from '@/app/(auth)/_components/password-criteria';
import PasswordChangeSuccess from '@/app/(auth)/reset-password/_components/password-change-success';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { ROUTES } from '@/app/config/routes';

const ResetPasswordForm: React.FC = () => {
  const { searchParams } = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();
  const token = searchParams.get('token') || '';

  const { mutate: userResetPassword, isPending, isSuccess } = useUserResetPassword();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    handleSubmit,
    formState: { errors },
    control,
    watch,
  } = useForm<ResetPasswordSchemaType>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const password = watch('password');
  const confirmPassword = watch('confirmPassword');
  const currentYear = new Date().getFullYear();

  const onResetPasswordFormSubmit = (data: ResetPasswordSchemaType) => {
    userResetPassword(
      {
        params: { token },
        payload: {
          password: data.password,
        },
      },
      {
        onSuccess: () => {
          toast({
            title: 'Success!',
            description: 'Your password has been updated successfully.',
          });
        },
        onError: (error: any) => {
          let errorMessage = error?.response?.data?.message || 'Something went wrong.';
          if (error?.response?.status === 401) {
            errorMessage = 'Invalid or expired token.';
          }
          toast({
            title: 'Error',
            description: errorMessage,
            variant: 'destructive',
          });
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
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center lg:text-left">
        <h3 className="font-bold mb-2">Create Your New Password</h3>
        <p className="text-neutral-darkGrey text-b1">Enter a strong password to secure your account</p>
      </div>

      <form onSubmit={handleSubmit(onResetPasswordFormSubmit)} className="space-y-6">
        <div className="space-y-4">
          <Controller
            control={control}
            name="password"
            render={({ field }) => (
              <Input
                {...field}
                label="New Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your new password"
                autoComplete="new-password"
                error={errors.password?.message}
                classNames={{
                  rightIcon: 'cursor-pointer',
                }}
                RightIcon={!!field.value ? (showPassword ? Eye : EyeClosed) : undefined}
                onIconClick={() => setShowPassword((prev) => !prev)}
              />
            )}
          />

          <Controller
            control={control}
            name="confirmPassword"
            render={({ field }) => (
              <Input
                {...field}
                label="Confirm New Password"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm your new password"
                autoComplete="new-password"
                error={errors.confirmPassword?.message}
                classNames={{
                  rightIcon: 'cursor-pointer',
                }}
                RightIcon={!!field.value ? (showConfirmPassword ? Eye : EyeClosed) : undefined}
                onIconClick={() => setShowConfirmPassword((prev) => !prev)}
              />
            )}
          />

          {/* Password Criteria */}
          <PasswordCriteria password={password} />
        </div>

        <Button
          loading={isPending || isSuccess}
          disabled={!isValidPassword || !confirmPassword || password !== confirmPassword}
          className="w-full"
          type="submit"
        >
          Update Password
        </Button>

        {/* Back to Login Link */}
        <div className="text-center">
          <p className="text-neutral-darkGrey text-sm">
            Remember your password?{' '}
            <Link href={ROUTES.LOGIN} className="text-primary-blue font-semibold hover:underline">
              Back to Login
            </Link>
          </p>
        </div>

        <div className="text-center text-sm text-neutral-darkGrey">© Success {currentYear}</div>
      </form>
    </div>
  );
};

export default ResetPasswordForm;
