"use client";

import { useMutation } from "@tanstack/react-query";

import useToast from "@/hooks/use-toast";
import { api } from "@/lib/api";
import { LoginFormValues } from "@/schema/auth/login-schema";
import { ILoginResponse } from "@/types/auth";
import { saveAccessToken } from "@/utils/auth-token";
import { handleApiError } from "@/utils/error";

const loginUser = async (payload: LoginFormValues): Promise<ILoginResponse> => {
  const res = await api.post("/auth/login", payload);
  return res.data;
};

const useLoginUser = () => {
  const { success, error } = useToast();

  return useMutation({
    mutationFn: loginUser,
    onSuccess: (res: ILoginResponse) => {
      success("Login successful!");
      if (res.token) {
        saveAccessToken(res.token);
      }
    },
    onError: (err) => {
      const msg = handleApiError(err);
      error(msg);
    },
  });
};

export { useLoginUser };
