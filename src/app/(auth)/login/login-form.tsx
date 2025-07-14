'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Link from 'next/link';

import Input from '@/components/common/input';
import { Eye, EyeClosed } from 'lucide-react';

import Button from '@/components/common/button';

import { useLoginUser } from '@/mutations/auth/login';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormField } from '@/components/ui/form';

import { loginSchema, LoginSchemaType } from '@/schemas/auth/login-schema';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/app/config/routes';
import useAuthStore from '@/store/auth-store';

const LoginForm = () => {
  const router = useRouter();
  const { setProfile } = useAuthStore();

  const form = useForm<LoginSchemaType>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const {
    control,
    formState: { errors },
  } = form;

  const loginUser = useLoginUser();

  const handleLogin = (values: LoginSchemaType) => {
    loginUser.mutate(values, {
      onSuccess: (res) => {
        setProfile(res.user);
        router.push(ROUTES.DASHBOARD);
      },
    });
  };

  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center lg:text-left">
        <h3 className="font-bold mb-2">Welcome Back!</h3>
        <p className="text-neutral-darkGrey text-b1">Please sign in to your account</p>
      </div>

      <Form {...form}>
        <form className="space-y-6" onSubmit={form.handleSubmit(handleLogin)}>
          <div className="space-y-4">
            <FormField
              control={control}
              name="email"
              render={({ field }) => (
                <Input {...field} error={errors.email?.message} label="Email" placeholder="Enter your email" />
              )}
            />
            <FormField
              control={control}
              name="password"
              render={({ field }) => (
                <Input
                  {...field}
                  error={errors.password?.message}
                  classNames={{
                    rightIcon: 'cursor-pointer',
                  }}
                  RightIcon={!!field.value ? (showPassword ? Eye : EyeClosed) : undefined}
                  onIconClick={() => setShowPassword((prev) => !prev)}
                  label="Password"
                  placeholder="Enter your password"
                  type={showPassword ? 'text' : 'password'}
                />
              )}
            />
          </div>

          {/* Forgot Password Link */}
          <div className="flex justify-end">
            <Link href={ROUTES.FORGOT_PASSWORD} className="text-sm text-primary-blue hover:underline font-medium">
              Forgot Password?
            </Link>
          </div>

          <Button
            loadingText="Signing In"
            type="submit"
            className="w-full"
            loading={loginUser.isPending}
            disabled={loginUser.isPending}
          >
            Sign In
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default LoginForm;
