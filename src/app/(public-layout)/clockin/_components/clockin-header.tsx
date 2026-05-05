'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';

const formatTime = (d: Date) =>
  d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });

const formatDate = (d: Date) =>
  d.toLocaleDateString([], { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' });

const ClockInHeader = () => {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <header className="border-b border-gray-200 bg-white px-8 py-4 flex items-center justify-between rounded-t-2xl">
      <div className="h-8 w-[120px] relative">
        <Image src="/success-logo.png" alt="Success" fill className="object-contain object-left" unoptimized />
      </div>
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <Clock className="w-4 h-4" strokeWidth={1.75} />
        <span className="font-semibold text-gray-900">{now ? formatTime(now) : '—'}</span>
        <span className="text-gray-500">{now ? formatDate(now) : ''}</span>
      </div>
    </header>
  );
};

export default ClockInHeader;
