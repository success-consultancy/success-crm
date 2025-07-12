import { Metadata } from 'next';

// import { getVerifyForgotPasswordToken } from '@/queries/get-user';
// import ResetPasswordForm from '@/app/[locale]/(auth)/reset-password/reset-password.form';
import TokenExpired from '@/app/(auth)/_components/token-expired';

import { TokenExpiredEnum } from '@/constants';
import ResetPasswordForm from './reset-password.form';

export const metadata: Metadata = {
  title: 'Reset-password',
  description: 'Reset-password to your account',
};

type Props = {
  params: {};
  searchParams: {
    token: string;
    email: string;
  };
};
export default async function ForgotPasswordPage(props: Props) {
  // const data = await getVerifyForgotPasswordToken(props.searchParams.token);

  // if (data?.success)
    return (
      <div className="min-h-[100vh] flex">
        <ResetPasswordForm />
      </div>
    );
  // else
    // return (
    //     <TokenExpired className="m-auto" type={TokenExpiredEnum.ForgotPassword} />
    // );
}
