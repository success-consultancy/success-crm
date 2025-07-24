import axios, { AxiosResponse } from "axios";
import { api, custom_api } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";

interface ResetPasswordCredentials {
  password: string;
}

interface ResetPasswordResponse {
  status: string;
  payload: string;
}

interface IResetUserPassword {
  params: { token: string };
  payload: Partial<ResetPasswordCredentials>;
}

const resetUserPassword = async (resetPayload: IResetUserPassword) => {
  const { params, payload } = resetPayload;
  const requestPayload = { password: payload.password };

  const { data }: AxiosResponse<ResetPasswordResponse> = await custom_api.post(
    "/auth/resetpassword",
    requestPayload,
    {
      headers: {
        authorization: params.token,
      },
    }
  );

  return data.payload;
};

const useUserResetPassword = () => {
  return useMutation({ mutationFn: resetUserPassword });
};

const requestResetPassword = async (credentials: { email: string }) => {
  const { data }: AxiosResponse<ResetPasswordResponse> = await api.post(
    "/auth/passwordreseturl",
    credentials
  );

  return data.payload;
};

const useRequestResetPassword = () => {
  return useMutation({ mutationFn: requestResetPassword });
};

export type {
  ResetPasswordCredentials,
  ResetPasswordResponse,
  IResetUserPassword,
};

export { useUserResetPassword, useRequestResetPassword };
