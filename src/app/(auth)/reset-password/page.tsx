import { Metadata } from "next";

import ResetPasswordForm from "./reset-password.form";
import React from "react";

export const metadata: Metadata = {
  title: "Reset Password",
  description: "Reset your account password",
};

export default async function ResetPasswordPage() {
  // const data = await getVerifyForgotPasswordToken(props.searchParams.token);

  // if (data?.success)
  return (
    <React.Suspense>
      <ResetPasswordForm />
    </React.Suspense>
  );

  // return <TokenExpired type={TokenExpiredEnum.RESET_PASSWORD} />;
}
