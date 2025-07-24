"use client";
import React from "react";
// import Icons from '@/components/icons';
import { ROUTES } from "@/config/routes";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const Congratulations = ({ className }: { className?: string }) => {
  const router = useRouter();

  return (
    <div>
      <div
        className={`flex flex-col items-center justify-center ${
          className || ""
        }`}
      >
        <div className="w-[7.1875rem] h-[7.1875rem] bg-state-success-light  flex-center rounded-full">
          {/* <Icons.TickIcon className="w-14 h-14" /> */}
        </div>

        <h5 className="text-center text-h2 text-[2.1875rem] text-state-success-base mt-11">
          Congratulations
        </h5>
        <p className="text-b1 text-center text-content-body mt-4">
          Your account has been successfully created. Please login into your
          account.
        </p>

        <Button
          className="self-center mt-10"
          onClick={() => router.push(ROUTES.LOGIN)}
        >
          Login
        </Button>
      </div>
    </div>
  );
};

export default Congratulations;
