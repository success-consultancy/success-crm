export interface ILoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
  message: string;
}

export interface ISetPasswordResponse {
  message: string;
  success: boolean;
}

export interface IForgotPasswordResponse {
  message: string;
  success: boolean;
}
