'use client';

import React from 'react';
import { cn } from '@/lib/cn';
// import Icons from '@/components/icons';

type Props = {
  className?: string;
  type?: string;
};

const TokenSuccess = (props: Props) => {
  return (
    <div className={cn(props.className)}>
      <div className="flex flex-col items-center justify-center">
        <div className="w-[7.1875rem] h-[7.1875rem] bg-state-success-light flex-center rounded-full">
          {/* <Icons.TickIcon className="w-[3.4375rem] h-[3.4375rem] text-state-success-dark" strokeWidth={2} /> */}
        </div>

        <h5 className="text-center text-h2 text-[2.1875rem] text-state-success-base mt-11">
          New Token Request <br /> Succeed
        </h5>
        <p className="text-b1 text-center text-content-body mt-4">
          You request will be queued for the approval. It may take <br /> some 3-4 business days. You can only request
          one per time.
        </p>
      </div>
    </div>
  );
};

export default TokenSuccess;
