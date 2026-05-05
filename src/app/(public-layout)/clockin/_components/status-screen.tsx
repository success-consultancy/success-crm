'use client';

import { CheckCircle2 } from 'lucide-react';

interface Props {
  title: string;
  message: React.ReactNode;
}

const StatusScreen = ({ title, message }: Props) => {
  return (
    <div className="w-full max-w-md flex flex-col items-center text-center gap-3">
      <CheckCircle2 className="w-10 h-10 text-green-500" strokeWidth={1.75} />
      <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
      <p className="text-sm text-gray-500">{message}</p>
    </div>
  );
};

export default StatusScreen;
