'use client';

import { useState } from 'react';
import { ScanFace } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ClockLoginResponse, useClockLogin } from '@/mutations/clock-in/clock-login';
import { authenticateFace, describeFaceIOError, isFaceIOConfigured } from '@/lib/faceio';
import { extractErrorMessage } from '@/utils/clock-in-errors';

interface Props {
  onCodeLogin: () => void;
  onFaceLoginSuccess: (data: ClockLoginResponse) => void;
}

const VerifyIdentityScreen = ({ onCodeLogin, onFaceLoginSuccess }: Props) => {
  const faceEnabled = isFaceIOConfigured();
  const [error, setError] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const { mutateAsync: clockLogin, isPending: loggingIn } = useClockLogin();

  const handleFaceScan = async () => {
    setError(null);
    setScanning(true);
    try {
      const { facialId } = await authenticateFace();
      const data = await clockLogin({ faceId: facialId });
      onFaceLoginSuccess(data);
    } catch (err) {
      setError(extractErrorMessage(err, describeFaceIOError(err)));
    } finally {
      setScanning(false);
    }
  };

  const busy = scanning || loggingIn;

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
        <Button
          onClick={handleFaceScan}
          disabled={!faceEnabled || busy}
          loading={busy}
          className="w-full"
          title={faceEnabled ? 'Scan your face to clock in' : 'Face login is not configured'}
        >
          Scan your face
        </Button>

        {error && <p className="text-xs text-red-600 text-center">{error}</p>}

        <div className="flex items-center gap-3 text-xs text-gray-400">
          <div className="flex-1 border-t border-gray-200" />
          Or
          <div className="flex-1 border-t border-gray-200" />
        </div>

        <Button variant="outline" onClick={onCodeLogin} disabled={busy} className="w-full">
          Login using code
        </Button>
      </div>
    </div>
  );
};

export default VerifyIdentityScreen;
