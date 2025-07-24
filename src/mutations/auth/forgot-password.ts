"use client";

import { useMutation } from "@tanstack/react-query";
import axios from "axios";

import { api } from "@/lib/api";
import { ForgotPasswordFormValues } from "@/schema/auth/forgot-password-schema";
import { IForgotPasswordResponse } from "@/types/auth";
import { useToastContext } from "@/context/toast-context";

const forgotPassword = async (
  payload: ForgotPasswordFormValues
): Promise<IForgotPasswordResponse> => {
  const res = await api.post("/auth/forgot-password", payload);
  return res.data;
};

const useForgotPassword = () => {
  const { success, error } = useToastContext();

  return useMutation({
    mutationFn: forgotPassword,
    onSuccess: (res: IForgotPasswordResponse) => {
      success("Password reset email sent successfully!");
    },
    onError: (err) => {
      if (axios.isAxiosError(err)) {
        const errorMessage =
          err.response?.data?.message || "Failed to send reset email";
        error(errorMessage);
      } else {
        error("An unexpected error occurred");
      }
    },
  });
};

export { useForgotPassword };
