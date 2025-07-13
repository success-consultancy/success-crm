"use client";

// External Packages
import React from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// UI Components
import { Button } from "@/components/ui/button";
import TextInput from "@/components/molecules/text-input";

// Utilities
import { LoginFormValues, loginSchema } from "@/schema/auth/login-schema";

const ForgotPasswordPage = () => {
  const form = useForm<LoginFormValues>({
    mode: "onChange",
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
    },
  });
  const { handleSubmit, register, formState } = form;

  const handleSubmitForm = (data: LoginFormValues) => {
    // Handle form submission logic here
  };
  return (
    <div className="w-full h-96">
      <h2 className="text-3xl text-center mb-2">Forgot Your Password?</h2>
      <p className="text-gray-600 mb-6 text-center">
        Please enter your registered email address, and we will email you a link
        to reset your password. Don&apos;t worry, it&apos;s quick and easy!
      </p>
      <form onSubmit={handleSubmit(handleSubmitForm)} className="space-y-5">
        <TextInput
          className="rounded-md"
          id="email"
          label="Email"
          type="email"
          placeholder="Enter your email"
          {...register("email")}
          error={formState.errors.email?.message}
        />

        <Button type="submit" className="w-full capitalize">
          send me the link
        </Button>
        <div className="flex justify-center">
          <Link href={"/login"} className="text-primary text-center mt-8">
            Go Back to Login
          </Link>
        </div>
      </form>
    </div>
  );
};

export default ForgotPasswordPage;
