import { Metadata } from 'next';

import ResetPasswordForm from './reset-password.form';

export const metadata: Metadata = {
  title: 'Reset Password',
  description: 'Reset your account password',
};

// type Props = {
//   params: {};
//   searchParams: {
//     token: string;
//     email: string;
//   };
// };

export default async function ResetPasswordPage() {
  // const data = await getVerifyForgotPasswordToken(props.searchParams.token);

  // if (data?.success)
  return <ResetPasswordForm />;

  // return <TokenExpired type={TokenExpiredEnum.RESET_PASSWORD} />;
}
