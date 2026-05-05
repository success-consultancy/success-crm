'use client';

import { useEffect, useState } from 'react';
import { AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { useClockLogin, ClockLoginResponse } from '@/mutations/clock-in/clock-login';
import { extractErrorMessage } from '@/utils/clock-in-errors';
import PinPad from './pin-pad';

interface Props {
  onSuccess: (data: ClockLoginResponse) => void;
  onBack: () => void;
}

const CODE_LENGTH = 4;

const CodeLoginScreen = ({ onSuccess, onBack }: Props) => {
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);

  const { mutate: clockLogin, isPending } = useClockLogin();

  useEffect(() => {
    if (error) setError(null);
  }, [code]);

  const handleLogin = () => {
    clockLogin(
      { clockInCode: code },
      {
        onSuccess: (data) => onSuccess(data),
        onError: (err) => {
          const message = extractErrorMessage(err, 'Invalid PIN. Please try again.');
          setError(message);
          setCode('');
          toast.error(message);
        },
      },
    );
  };

  const isComplete = code.length === CODE_LENGTH;

  return (
    <div className="w-full max-w-sm flex flex-col items-center gap-6">
      <div className="text-center">
        <h1 className="text-2xl font-semibold text-gray-900">Employee Clock In</h1>
        <p className="text-sm text-gray-500 mt-1">Please enter your PIN to continue.</p>
      </div>

      <PinPad pin={code} setPin={setCode} length={CODE_LENGTH} error={!!error} />

      {error && (
        <div
          role="alert"
          className="-mt-2 flex items-center gap-2 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-600 w-full"
        >
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="w-full flex flex-col gap-2">
        <Button onClick={handleLogin} disabled={!isComplete || isPending} loading={isPending} className="w-full">
          Login
        </Button>
        <Button variant="ghost" onClick={onBack} className="w-full">
          Back
        </Button>
      </div>
    </div>
  );
};

export default CodeLoginScreen;
