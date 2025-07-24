"use client";

import { ROUTES } from "@/config/routes";
import Image from "next/image";
import Link from "next/link";
import React, { ReactNode } from "react";

type Props = {
  children: ReactNode;
  showBackToLogin?: boolean;
  title?: string;
  subtitle?: string;
};

const AuthLayout = ({
  children,
  showBackToLogin = false,
  title,
  subtitle,
}: Props) => {
  return (
    <div className="w-full flex h-screen">
      {/* Left side - Image */}
      <aside className="w-[35%] relative h-full lg:flex hidden">
        <Image
          src="/login-side-image.jpg"
          alt="side-image"
          height={100}
          width={100}
          className="w-full h-full object-cover"
          unoptimized
        />
        <div className="w-full h-full bg-[#000000c2] absolute inset-0 m-auto"></div>
        <div className="absolute top-20 left-20 flex flex-col gap-10 text-white">
          <Image
            src={"/success-logo.png"}
            alt="logo"
            height={100}
            width={180}
          />
          <h1 className="text-h1 text-white font-bold">
            We
            <br />
            Deliver
            <br />
            Your Success
          </h1>
        </div>
      </aside>

      {/* Right side - Form */}
      <div className="h-full w-full lg:w-[65%] flex items-center justify-center px-5">
        <div className="w-full max-w-[424px] space-y-6">
          {/* Mobile Logo */}
          <div className="flex justify-center lg:hidden">
            <Image
              src={"/success-logo.png"}
              alt="logo"
              height={100}
              width={180}
            />
          </div>

          {/* Header */}
          {(title || subtitle) && (
            <div className="text-center lg:text-left">
              {title && <h2 className="text-h2 font-bold mb-2">{title}</h2>}
              {subtitle && (
                <p className="text-neutral-darkGrey text-b1">{subtitle}</p>
              )}
            </div>
          )}

          {/* Content */}
          <div className="w-full">{children}</div>

          {/* Back to Login Link */}
          {showBackToLogin && (
            <div className="text-center">
              <p className="text-neutral-darkGrey text-sm">
                Remember your password?{" "}
                <Link
                  href={ROUTES.LOGIN}
                  className="text-primary-blue font-semibold hover:underline"
                >
                  Back to Login
                </Link>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
