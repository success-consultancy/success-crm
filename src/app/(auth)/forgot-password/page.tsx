import { Metadata } from "next";

import ForgotPasswordForm from "@/app/(auth)/forgot-password/forgot-password.form";

export const metadata: Metadata = {
  title: "Forgot-password",
  description: "Forgot-password to your account",
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}
