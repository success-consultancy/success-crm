'use client';

import * as React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '@/components/ui/button';
import TextInput from '@/components/common/input';
// import { useRequestResetPassword } from '@/mutations';
import { ForgotPasswordCredentials } from '@/mutations/auth/login';
import { forgotPasswordSchema } from './login.schema';
import Image from 'next/image';
// import { toast } from 'sonner';

const ForgotPasswordForm: React.FC = () => {
  // const { mutate: userResetPassword, isPending } = useRequestResetPassword();
  const isPending = false;


  const defaultValues: ForgotPasswordCredentials = {
    email: '',
  };

  const {
    handleSubmit,
    formState: { errors },
    setValue,
    control,
  } = useForm({
    defaultValues,
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onForgotPasswordFormSubmit = (data: ForgotPasswordCredentials) => {
    // userResetPassword(data, {
    //   onSuccess: (payload) => {
    //     setValue('email', '');
    //     toast.success(payload);
    //   },
    //   onError: (error: any) => {
    //     let errorMessage = error?.response?.data?.message || 'Something went wrong.';
    //     if (error?.response?.status === 401) {
    //       errorMessage = 'Email address not found.';
    //     }
    //     toast.error(errorMessage);
    //   },
    // });
  };

  return (
    <form onSubmit={handleSubmit(onForgotPasswordFormSubmit)} className="max-w-[424px]">
      <div className="flex flex-col mb-8">
        <Image className='mb-10' src={'/success-logo.png'} alt="logo" height={100} width={180} />

        <h2 className="text-h1 mb-3">Forgot Your Password?</h2>
        <p className="text-b1 text-sm text-neutral-darkGrey">
          Please enter the email you used to login with. We will send you a link to reset your password.
        </p>
      </div>

      <div className="flex flex-col gap-4 ">
        <Controller
          control={control}
          name="email"
          render={({ field }) => (
            <TextInput {...field}
              placeholder='example@gmail.com'
              label="Email" autoComplete="off" error={errors.email?.message} />
          )}
        />
      </div>

      <Button loading={isPending} className="w-full mt-10" type="submit">
        Send reset Link
      </Button>
    </form>
  );
};

export default ForgotPasswordForm;
