'use client';

import Image from 'next/image';
import { X } from 'lucide-react';

interface Props {
  onClose?: () => void;
}

const AppointmentHeader = ({ onClose }: Props) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-[#ebebeb] h-[72px] flex items-center justify-between pl-16 pr-12">
      <div className="h-10 w-[132px] relative shrink-0">
        <Image src="/success-logo.png" alt="Success Education and Visa Services" fill className="object-contain object-left" unoptimized />
      </div>
      <p className="font-medium text-[#1c1c1c] text-base text-center" aria-live="polite">
        Schedule an appointment
      </p>
      <button
        type="button"
        onClick={onClose}
        aria-label="Close and go back"
        className="w-12 h-12 flex items-center justify-center rounded-full cursor-pointer hover:bg-gray-100 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#007acc]/50 focus-visible:ring-offset-2 transition-all duration-150"
      >
        <X className="w-6 h-6 text-[#1c1c1c]" strokeWidth={1.5} />
      </button>
    </header>
  );
};

export default AppointmentHeader;
