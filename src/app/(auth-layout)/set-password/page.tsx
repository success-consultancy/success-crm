"use client";

// External Packages
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";

// UI Components
import { Button } from "@/components/ui/button";
import PasswordInput from "@/components/molecules/password-input";

// Utilities
import {
  SetPasswordFormValues,
  setPasswordSchema,
} from "@/schema/auth/set-password-schema";
import { useSetPassword } from "@/mutations/auth/set-password";

const SetPasswordPage = () => {
  const form = useForm<SetPasswordFormValues>({
    mode: "onChange",
    resolver: zodResolver(setPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });
  const { handleSubmit, register, formState } = form;
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const setPasswordMutation = useSetPassword();

  const handleSubmitForm = (data: SetPasswordFormValues) => {
    setPasswordMutation.mutate(
      { ...data, token },
      {
        onSuccess: () => {
          router.push("/login");
        },
      }
    );
  };

  return (
    <div className="w-full h-96">
      <h2 className="text-3xl text-center mb-6">Set New Password</h2>
      <form onSubmit={handleSubmit(handleSubmitForm)} className="space-y-5">
        <PasswordInput
          className="rounded-md"
          id="password"
          label="New Password"
          placeholder="Enter your new password"
          {...register("password")}
          error={formState.errors.password?.message}
        />
        <PasswordInput
          className="rounded-md"
          id="confirmPassword"
          label="Confirm Password"
          placeholder="Confirm your new password"
          {...register("confirmPassword")}
          error={formState.errors.confirmPassword?.message}
        />
        <Button
          type="submit"
          className="w-full"
          disabled={setPasswordMutation.isPending}
        >
          {setPasswordMutation.isPending
            ? "Setting Password..."
            : "Set Password"}
        </Button>
      </form>
    </div>
  );
};

export default SetPasswordPage;
