'use client';

import { useState } from 'react';
import { ScanFace } from 'lucide-react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import FaceCaptureModal from '@/components/face-capture-modal';
import { ClockLoginResponse, useClockLogin } from '@/mutations/clock-in/clock-login';
import { extractErrorMessage } from '@/utils/clock-in-errors';

interface Props {
  onCodeLogin: () => void;
  onFaceLoginSuccess: (data: ClockLoginResponse) => void;
}

const VerifyIdentityScreen = ({ onCodeLogin, onFaceLoginSuccess }: Props) => {
  const [modalOpen, setModalOpen] = useState(false);
  const { mutateAsync: clockLogin, isPending: loggingIn } = useClockLogin();

  // FaceCaptureModal swallows any thrown error and shows it inline; we rethrow
  // a friendly message so the user can retry without re-opening the modal.
  const handleCapture = async (descriptor: number[]) => {
    try {
      const data = await clockLogin({ descriptor });
      onFaceLoginSuccess(data);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 400) {
        throw new Error("We couldn't recognise you. Try again or sign in with your code.");
      }
      throw new Error(extractErrorMessage(err, 'Sign-in failed. Please try again.'));
    }
  };

  return (
    <div className="w-full max-w-sm flex flex-col items-center gap-6">
      <div className="text-center">
        <h1 className="text-2xl font-semibold text-gray-900">Verifying Your Identity</h1>
        <p className="text-sm text-gray-500 mt-1">
          Scan your face to clock in, or sign in using your code.
        </p>
      </div>

      <div className="w-32 h-32 rounded-2xl border-2 border-gray-200 flex items-center justify-center bg-gray-50">
        <ScanFace className="w-14 h-14 text-gray-300" strokeWidth={1.25} />
      </div>

      <div className="w-full flex flex-col gap-3">
        <Button
          onClick={() => setModalOpen(true)}
          disabled={loggingIn}
          loading={loggingIn}
          className="w-full"
        >
          Scan your face
        </Button>

        <div className="flex items-center gap-3 text-xs text-gray-400">
          <div className="flex-1 border-t border-gray-200" />
          Or
          <div className="flex-1 border-t border-gray-200" />
        </div>

        <Button variant="outline" onClick={onCodeLogin} disabled={loggingIn} className="w-full">
          Login using code
        </Button>
      </div>

      <FaceCaptureModal
        mode="auth"
        open={modalOpen}
        onOpenChange={setModalOpen}
        onCapture={handleCapture}
      />
    </div>
  );
};

export default VerifyIdentityScreen;
