"use client";

import Link from "next/link";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useLoginUser } from "@/mutations/auth/login";
import { Form } from "@/components/ui/form";

import { useRouter } from "next/navigation";
import useAuthStore from "@/store/auth-store";
import { LoginFormValues, loginSchema } from "@/schema/auth/login-schema";
import { ROUTES } from "@/config/routes";
import Button from "@/components/atoms/button";
import TextInput from "@/components/molecules/text-input";
import PasswordInput from "@/components/molecules/password-input";

const LoginForm = () => {
  const router = useRouter();
  const { setProfile } = useAuthStore();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const {
    formState: { errors },
  } = form;

  const loginUser = useLoginUser();

  const handleLogin = (values: LoginFormValues) => {
    loginUser.mutate(values, {
      onSuccess: (res: any) => {
        setProfile(res.user);
        router.push(ROUTES.DASHBOARD);
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center lg:text-left">
        <h3 className="text-h3 font-bold mb-2">Welcome Back!</h3>
        <p className="text-neutral-darkGrey text-b1">
          Please sign in to your account
        </p>
      </div>

      <Form {...form}>
        <form className="space-y-6" onSubmit={form.handleSubmit(handleLogin)}>
          <div className="space-y-4">
            <TextInput
              {...form.register("email")}
              name="email"
              error={errors.email?.message}
              label="Email"
              placeholder="Enter your email"
            />
            <PasswordInput
              {...form.register("password")}
              name="password"
              error={errors.password?.message}
              label="Password"
              placeholder="Enter your password"
            />
          </div>

          {/* Forgot Password Link */}
          <div className="flex justify-end">
            <Link
              href={ROUTES.FORGOT_PASSWORD}
              className="text-sm text-primary-blue hover:underline font-medium"
            >
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
