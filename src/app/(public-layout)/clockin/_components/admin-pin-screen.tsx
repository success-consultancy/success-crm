'use client';

import { useEffect, useState } from 'react';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PinPad from './pin-pad';

interface Props {
  expectedPin: string;
  onUnlock: () => void;
}

const AdminPinScreen = ({ expectedPin, onUnlock }: Props) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  useEffect(() => {
    if (error && pin.length < expectedPin.length) setError(false);
  }, [pin, error, expectedPin.length]);

  const handleUnlock = () => {
    if (pin === expectedPin) {
      onUnlock();
    } else {
      setError(true);
    }
  };

  useEffect(() => {
    if (pin.length === expectedPin.length && pin === expectedPin) {
      onUnlock();
    }
  }, [pin, expectedPin, onUnlock]);

  const isComplete = pin.length === expectedPin.length;

  return (
    <div className="w-full max-w-sm flex flex-col items-center gap-6">
      <div className="text-center">
        <h1 className="text-2xl font-semibold text-gray-900">Enable Clock In Mode</h1>
        <p className="text-sm text-gray-500 mt-1">
          Please enter admin PIN to activate the clock in device.
        </p>
      </div>

      <PinPad pin={pin} setPin={setPin} length={expectedPin.length} error={error} />

      {error && (
        <div
          role="alert"
          className="-mt-2 flex items-center gap-2 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-600 w-full"
        >
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>Incorrect PIN. Please try again.</span>
        </div>
      )}

      <Button onClick={handleUnlock} disabled={!isComplete} className="w-full max-w-xs">
        Unlock
      </Button>
    </div>
  );
};

export default AdminPinScreen;
