'use client';

import Image from 'next/image';
import { UserPlus, RotateCcw } from 'lucide-react';

interface Props {
  onNewClient: () => void;
  onReturningClient: () => void;
}

const InitialScreen = ({ onNewClient, onReturningClient }: Props) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 w-full max-w-lg">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <Image src="/success-logo.png" alt="logo" height={60} width={160} unoptimized />
          </div>

          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-semibold text-gray-900 mb-1">Client Check-In</h1>
            <p className="text-sm text-gray-500">Please select an option that describes you</p>
          </div>

          {/* Options */}
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={onNewClient}
              className="flex flex-col items-center gap-3 p-6 rounded-xl border border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition-all cursor-pointer group"
            >
              <div className="w-12 h-12 rounded-full bg-blue-50 group-hover:bg-blue-100 flex items-center justify-center transition-colors">
                <UserPlus className="w-5 h-5 text-blue-600" strokeWidth={1.5} />
              </div>
              <div className="text-center">
                <p className="font-medium text-sm text-gray-900">New Client</p>
                <p className="text-xs text-gray-400 mt-0.5">First time visiting us</p>
              </div>
            </button>

            <button
              onClick={onReturningClient}
              className="flex flex-col items-center gap-3 p-6 rounded-xl border border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition-all cursor-pointer group"
            >
              <div className="w-12 h-12 rounded-full bg-blue-50 group-hover:bg-blue-100 flex items-center justify-center transition-colors">
                <RotateCcw className="w-5 h-5 text-blue-600" strokeWidth={1.5} />
              </div>
              <div className="text-center">
                <p className="font-medium text-sm text-gray-900">Returning Client</p>
                <p className="text-xs text-gray-400 mt-0.5">Find your existing record</p>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center py-4 text-xs text-gray-400">
        © 2025 Success Education and Visa Services
      </footer>
    </div>
  );
};

export default InitialScreen;
