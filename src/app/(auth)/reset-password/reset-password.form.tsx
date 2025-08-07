'use client';

import React from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';

import { ROUTES } from '@/config/routes';
import { useUserResetPassword } from '@/mutations/auth/reset-password';
import useSearchParams from '@/hooks/use-search-params';
import { validatePassword } from '@/constants/password-criteria';
import PasswordCriteria from '@/app/(auth)/_components/password-criteria';
import PasswordChangeSuccess from '@/app/(auth)/reset-password/_components/password-change-success';
import { ResetPasswordSchemaType, resetPasswordSchema } from './reset-password.schema';

import { Form } from '@/components/ui/form';
import Button from '@/components/atoms/button';
import PasswordInput from '@/components/molecules/password-input';
import { useToastContext } from '@/context/toast-context';

const ResetPasswordForm = () => {
  const { searchParams } = useSearchParams();
  const router = useRouter();
  const { success, error } = useToastContext();

  const token = searchParams.get('token') || '';

  const { mutate: userResetPassword, isPending, isSuccess } = useUserResetPassword();

  const form = useForm<ResetPasswordSchemaType>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const {
    watch,
    formState: { errors },
  } = form;

  const password = watch('password');
  const confirmPassword = watch('confirmPassword');
  const isValidPassword = validatePassword(password);
  const currentYear = new Date().getFullYear();

  const handleSubmit = (data: ResetPasswordSchemaType) => {
    userResetPassword(
      {
        params: { token },
        payload: { password: data.password },
      },
      {
        onSuccess: () => {
          success('Your password has been updated successfully.');
        },
        onError: (error: any) => {
          const errorMessage =
            error?.response?.status === 401
              ? 'Invalid or expired token.'
              : error?.response?.data?.message || 'Something went wrong.';
          error(errorMessage);
          router.refresh();
        },
      },
    );
  };

  if (isSuccess) {
    return <PasswordChangeSuccess />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center lg:text-left">
        <h3 className="text-h3 font-bold mb-2">Create Your New Password</h3>
        <p className="text-neutral-darkGrey text-b1">Enter a strong password to secure your account</p>
      </div>

      <Form {...form}>
        <form className="space-y-6" onSubmit={form.handleSubmit(handleSubmit)}>
          <div className="space-y-4">
            <PasswordInput
              {...form.register('password')}
              name="password"
              label="New Password"
              placeholder="Enter your new password"
              error={errors.password?.message}
            />

            <PasswordInput
              {...form.register('confirmPassword')}
              name="confirmPassword"
              label="Confirm New Password"
              placeholder="Confirm your new password"
              error={errors.confirmPassword?.message}
            />

            {/* Password Strength Criteria */}
            <PasswordCriteria password={password} />
          </div>

          <Button
            loading={isPending}
            disabled={!isValidPassword || !confirmPassword || password !== confirmPassword}
            className="w-full"
            type="submit"
          >
            Update Password
          </Button>

          {/* Back to login */}
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
      </Form>
    </div>
  );
};

export default ResetPasswordForm;
