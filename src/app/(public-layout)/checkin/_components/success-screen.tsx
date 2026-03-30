'use client';

import { CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  onDone: () => void;
}

const SuccessScreen = ({ onDone }: Props) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 w-full max-w-sm text-center">
        <CheckCircle2 className="w-14 h-14 text-green-500 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Checked-in</h2>
        <p className="text-sm text-gray-500 mb-8">
          Please be seated. Someone will be with you shortly.
        </p>
        <Button onClick={onDone} className="w-full">
          Okay
        </Button>
      </div>
    </div>
  );
};

export default SuccessScreen;
