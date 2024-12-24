"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";

import Input from "@/components/common/input";
import { Eye, EyeClosed } from "lucide-react";

import Button from "@/components/common/button";

import { useLoginUser } from "@/mutations/auth/login";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField } from "@/components/ui/form";

import { loginSchema, LoginSchemaType } from "@/schemas/auth/login-schema";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/app/config/routes";

const Login = () => {
  const router = useRouter();

  const form = useForm<LoginSchemaType>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const {
    control,
    formState: { errors },
  } = form;

  const loginUser = useLoginUser();

  const handleLogin = (values: LoginSchemaType) => {
    loginUser.mutate(values, {
      onSuccess: () => {
        router.push(ROUTES.DASHBOARD);
      },
    });
  };

  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex flex-col items-center gap-5  px-5">
      <Image
        src={"/success-logo.png"}
        alt="logo"
        height={100}
        width={180}
        className="block lg:hidden"
      />
      <h3 className="text-h3">Welcome Back!</h3>
      <Form {...form}>
        <form className="space-y-4" onSubmit={form.handleSubmit(handleLogin)}>
          <div className="space-y-2">
            <FormField
              control={control}
              name="email"
              render={({ field }) => (
                <Input {...field} error={errors.email?.message} label="Email" />
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
                    rightIcon: "cursor-pointer",
                  }}
                  RightIcon={
                    !!field.value ? (showPassword ? Eye : EyeClosed) : undefined
                  }
                  onIconClick={() => setShowPassword((prev) => !prev)}
                  label="Password"
                  type={showPassword ? "text" : "password"}
                />
              )}
            />
          </div>
          <Button
            type="submit"
            className="w-full mt-5"
            loading={loginUser.isPending}
            disabled={loginUser.isPending}
          >
            Login
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default Login;

