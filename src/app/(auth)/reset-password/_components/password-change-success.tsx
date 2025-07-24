"use client";
import React from "react";
// import { useRouterOriginal } from '@/lib/navigation';

import { ROUTES } from "@/config/routes";
import Button from "@/components/atoms/button";
import { useRouterOriginal } from "@/lib/navigation";
// import Button from '@/components/common/button';
// import { BrandLogoNav } from './brand-logo-nav';
// import { SuccessIllustration } from '@/assets/illustrations';
type Props = {};

const PasswordChangeSuccess = (props: Props) => {
  const currentYear = new Date().getFullYear();
  const router = useRouterOriginal();

  return (
    <div className="flex flex-col items-center justify-center m-auto">
      {/* <BrandLogoNav /> */}

      {/* <SuccessIllustration className="mt-20" /> */}

      <h5 className="text-center text-h2 text-[2.1875rem] text-state-success-base mt-11">
        Success
      </h5>
      <p className="text-b1 text-center text-content-body mt-4">
        You have successfully changed your password.
      </p>

      <Button
        className="self-center mt-10"
        onClick={() => router.push(ROUTES.LOGIN)}
      >
        Login
      </Button>

      <div className="text-content-body text-center text-[13px] mt-20 font-normal">
        © Success {currentYear}
      </div>
    </div>
  );
};

export default PasswordChangeSuccess;
