'use client';

import { ReactNode } from 'react';
import ClockInHeader from './clockin-header';

interface Props {
  children: ReactNode;
  title?: string;
}

const ClockInFrame = ({ children }: Props) => {
  return (
    <div className="min-h-screen bg-gray-200 flex flex-col">
      <div className="flex-1 flex items-start justify-center px-4 py-8">
        <div className="w-full max-w-3xl bg-white rounded-2xl shadow-sm flex flex-col">
          <ClockInHeader />
          <div className="flex-1 flex flex-col items-center justify-center px-6 py-14 min-h-[420px]">
            {children}
          </div>
          <footer className="text-center pb-4 text-xs text-gray-400">
            ©{new Date().getFullYear()} Success Education and Visa Services
          </footer>
        </div>
      </div>
    </div>
  );
};

export default ClockInFrame;
