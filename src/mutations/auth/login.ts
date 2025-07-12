import axios, { AxiosResponse } from 'axios';
import { api, custom_api } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { saveAccessToken } from '@/lib/utils/auth-token';
import { LoginSchemaType } from '@/schemas/auth/login-schema';
import { ILoginResponse } from '@/types/user-type';
import { useMutation } from '@tanstack/react-query';
import qs from 'qs';
import { ProfileSchemaType } from '@/schemas/profile-schema';

interface LoginCredentials {
  email: string;
  password: string;
}

interface CreateCredentials {
  email: string;
  password: string;
  iAgree: boolean;
}

interface ForgotPasswordCredentials {
  email: string;
}

interface ResetPasswordCredentials {
  password: string;
}

interface ResetPasswordResponse {
  status: string;
  payload: string;
}

interface IResetUserPassword {
  params: { token: string };
  payload: Partial<LoginCredentials>;
}

/*
  ########################################################################################
  #                         Login
  #           This function is used to login user
  ########################################################################################
*/
const loginUser = async (payload: LoginSchemaType) => {
  const res = await api.post('/auth/login', payload);
  return res.data;
};

const useLoginUser = () => {
  const { toast } = useToast();
  return useMutation({
    mutationFn: loginUser,
    onSuccess: (res: ILoginResponse) => {
      if (res.token) {
        saveAccessToken(res.token);
      }
    },
    onError: (err) => {
      if (axios.isAxiosError(err)) {
        toast({
          title: 'Failed to login!',
          description: err.response?.data.message,
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Failed to login!',
          description: 'Something went wrong.',
          variant: 'destructive',
        });
      }
    },
  });
};


/*
  ########################################################################################
  #                         Update user
  #           This function is used to update user profile
  ########################################################################################
*/
const updateUser = async (payload: ProfileSchemaType) => {
  const url = '/user/' + payload.id;

  delete payload.id;
  delete payload.role;
  delete payload.bio;

  const res = await api.put(url, payload);
  return res.data;
};

const useUserUpdate = () => {
  const { toast } = useToast();
  return useMutation({
    mutationFn: updateUser,
    onSuccess: () => {
      toast({
        title: 'User updated Successfully!',
      });
    },
    onError: (err) => {
      if (axios.isAxiosError(err)) {
        toast({
          title: 'Failed to login!',
          description: err.response?.data.message,
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Failed to login!',
          description: 'Something went wrong.',
          variant: 'destructive',
        });
      }
    },
  });
};

/*
  ########################################################################################
  #                         Reset Password
  #           This function is used to reset user password
  ########################################################################################
*/
const resetUserPassword = async (resetPayload: IResetUserPassword) => {
  const { params, payload } = resetPayload;
  console.log(params, resetPayload, "hello")
  const requestPayload = { password: payload.password };

  const { data }: AxiosResponse<ResetPasswordResponse> = await custom_api.post(
    '/auth/resetpassword',
    requestPayload,
    {
      headers: {
        authorization: params.token
      }
    }
  );

  return data.payload;
};

const useUserResetPassword = () => {
  return useMutation({ mutationFn: resetUserPassword });
};

/*
  ########################################################################################
  #                         Request reset password
  #           This function is used to request reset password
  ########################################################################################
*/
const requestResetPassword = async (credentials: ForgotPasswordCredentials) => {

  const { data }: AxiosResponse<ResetPasswordResponse> = await api.post('/auth/passwordreseturl', credentials);

  return data.payload;
};

const useRequestResetPassword = () => {
  return useMutation({ mutationFn: requestResetPassword });
};


export type { LoginCredentials, CreateCredentials, ForgotPasswordCredentials, ResetPasswordCredentials };
export {
  useLoginUser,
  useUserUpdate,
  useUserResetPassword,
  useRequestResetPassword
};
