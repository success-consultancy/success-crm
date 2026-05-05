'use client';

import { ScanFace } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  onCodeLogin: () => void;
}

const VerifyIdentityScreen = ({ onCodeLogin }: Props) => {
  return (
    <div className="w-full max-w-sm flex flex-col items-center gap-6">
      <div className="text-center">
        <h1 className="text-2xl font-semibold text-gray-900">Verifying Your Identity</h1>
        <p className="text-sm text-gray-500 mt-1">Align your face within the frame to verify.</p>
      </div>

      <div className="w-32 h-32 rounded-2xl border-2 border-gray-200 flex items-center justify-center bg-gray-50">
        <ScanFace className="w-14 h-14 text-gray-300" strokeWidth={1.25} />
      </div>

      <div className="w-full flex flex-col gap-3">
        <Button disabled className="w-full" title="Face login coming soon">
          Scan your face
        </Button>

        <div className="flex items-center gap-3 text-xs text-gray-400">
          <div className="flex-1 border-t border-gray-200" />
          Or
          <div className="flex-1 border-t border-gray-200" />
        </div>

        <Button variant="outline" onClick={onCodeLogin} className="w-full">
          Login using code
        </Button>
      </div>
    </div>
  );
};

export default VerifyIdentityScreen;
