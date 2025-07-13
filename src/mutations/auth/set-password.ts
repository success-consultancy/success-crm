"use client";

import { useMutation } from "@tanstack/react-query";
import axios from "axios";

import useToast from "@/hooks/use-toast";
import { api } from "@/lib/api";
import { SetPasswordFormValues } from "@/schema/auth/set-password-schema";
import { ISetPasswordResponse } from "@/types/auth";

const setPassword = async (
  payload: SetPasswordFormValues & { token: string }
): Promise<ISetPasswordResponse> => {
  const res = await api.post("/auth/set-password", payload);
  return res.data;
};

const useSetPassword = () => {
  const { success, error } = useToast();

  return useMutation({
    mutationFn: setPassword,
    onSuccess: (res: ISetPasswordResponse) => {
      success("Password set successfully!");
    },
    onError: (err) => {
      if (axios.isAxiosError(err)) {
        const errorMessage =
          err.response?.data?.message || "Failed to set password";
        error(errorMessage);
      } else {
        error("An unexpected error occurred");
      }
    },
  });
};

export { useSetPassword };
