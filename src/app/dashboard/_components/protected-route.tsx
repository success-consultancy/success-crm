'use client';
import React, { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/app/config/routes';
import Image from 'next/image';
import { useGetMe } from '@/query/get-me';

type Props = {
  children: ReactNode;
};

const ProtectedRoute: React.FC<Props> = ({ children }) => {
  const router = useRouter();
  const { data, isLoading, isError } = useGetMe();

  useEffect(() => {
    if (isError) {
      router.replace(ROUTES.LOGIN);
    }
  }, [isError, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-neutral-white">
        <div className="flex flex-col items-center space-y-4">
          <div className="mb-8">
            <Image src="/success-logo.png" alt="Success Education Logo" width={200} height={100} priority />
          </div>
          <div className="relative">
            <div className="w-16 h-16 border-4 border-neutral-border border-t-primary-blue rounded-full animate-spin"></div>
          </div>
          <div className="text-center">
            <h2 className="text-xl font-semibold text-neutral-black mb-2">Loading Dashboard</h2>
            <p className="text-neutral-darkGrey">Please wait while we verify your session...</p>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
