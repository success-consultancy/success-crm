'use client';

import * as React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { forgotPasswordSchema } from './login.schema';
import { useRequestResetPassword } from '@/mutations/auth/reset-password';
import { ForgotPasswordFormValues } from '@/schema/auth/forgot-password-schema';
import TextInput from '@/components/molecules/text-input';
import { ROUTES } from '@/config/routes';
import { useToastContext } from '@/context/toast-context';

const ForgotPasswordForm: React.FC = () => {
  const { mutate: userResetPassword, isPending } = useRequestResetPassword();

  const defaultValues: ForgotPasswordFormValues = {
    email: '',
  };
  const toast = useToastContext();
  const {
    handleSubmit,
    formState: { errors },
    setValue,
    control,
  } = useForm({
    defaultValues,
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onForgotPasswordFormSubmit = (data: ForgotPasswordFormValues) => {
    userResetPassword(data, {
      onSuccess: () => {
        setValue('email', '');
        toast.success('Password reset link sent to your email.');
      },
      onError: (error: any) => {
        let errorMessage = error?.response?.data?.message || 'Something went wrong.';
        if (error?.response?.status === 401) {
          errorMessage = 'Email address not found.';
        }
        toast.error(errorMessage);
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center lg:text-left">
        <h2 className="text-h3 font-bold mb-2">Forgot Your Password?</h2>
        <p className="text-neutral-darkGrey text-b1">
          Please enter the email you used to login with. We will send you a link to reset your password.
        </p>
      </div>

      <form onSubmit={handleSubmit(onForgotPasswordFormSubmit)} className="space-y-6">
        <div className="space-y-4">
          <Controller
            control={control}
            name="email"
            render={({ field }) => (
              <TextInput
                {...field}
                placeholder="example@gmail.com"
                label="Email"
                autoComplete="off"
                error={errors.email?.message}
              />
            )}
          />
        </div>

        <Button loading={isPending} className="w-full" type="submit">
          Send Reset Link
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
      </form>
    </div>
  );
};

export default ForgotPasswordForm;
