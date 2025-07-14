import { Metadata } from 'next';

import TokenExpired from '@/app/(auth)/_components/token-expired';
import { TokenExpiredEnum } from '@/constants';
import ResetPasswordForm from './reset-password.form';

export const metadata: Metadata = {
  title: 'Reset Password',
  description: 'Reset your account password',
};

type Props = {
  params: {};
  searchParams: {
    token: string;
    email: string;
  };
};

export default async function ResetPasswordPage(props: Props) {
  // const data = await getVerifyForgotPasswordToken(props.searchParams.token);

  // if (data?.success)
  return <ResetPasswordForm />;

  // return <TokenExpired type={TokenExpiredEnum.RESET_PASSWORD} />;
}
