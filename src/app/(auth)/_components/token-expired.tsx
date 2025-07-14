'use client';

import React from 'react';
import { cn } from '@/lib/cn';
import { Danger } from 'iconsax-react';

import { TokenExpiredEnum } from '@/constants';
import Button from '@/components/common/button';
import useSearchParams from '@/hooks/use-search-params';
import { useRequestResetPassword } from '@/mutations/auth/login';
import TokenSuccess from '@/app/(auth)/_components/token-success';

type Props = {
  className?: string;
  type?: string;
};

const TokenExpired = (props: Props) => {
  const { searchParams, setParam } = useSearchParams();

  const token = searchParams.get('token') || '';
  const isRequestSuccess = searchParams.get('success') || '';
  const requestReinvitation = useRequestResetPassword();

  const request = requestReinvitation;

  if (request.isSuccess || isRequestSuccess) return <TokenSuccess />;

  return (
    <div className={cn(props.className)}>
      <div className="flex flex-col items-center justify-center">
        <div className="w-[7.1875rem] h-[7.1875rem] bg-state-error-light  flex-center rounded-full">
          <Danger variant="Linear" className="w-11 h-11 text-state-error-dark" />
        </div>

        <h5 className="text-center text-h2 text-[2.1875rem] text-state-error-base mt-11">Token Expired</h5>
        <p className="text-b1 text-center text-content-body mt-4">
          Your token has expired. Please request the new token. It might take some time.
        </p>

        <Button
          // onClick={() =>
          //   request?.mutate(token, {
          //     onSuccess: (payload) => {
          //       // toast.success(payload);
          //       setParam('success', 'true');
          //     },
          //     onError: (error: any) => {
          //       toast.error(error?.response?.data?.message);
          //     },
          //   })
          // }
          variant={'tertiary'}
          className="self-center mt-10 px-4"
        >
          Request New Token
        </Button>
      </div>
    </div>
  );
};

export default TokenExpired;
