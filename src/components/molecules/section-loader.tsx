import React from 'react';
import { cn } from '@/lib/utils';

interface SectionLoaderProps {
  label?: string;
  className?: string;
  minHeight?: string;
}

const SectionLoader: React.FC<SectionLoaderProps> = ({
  label = 'Loading...',
  className,
  minHeight = '300px',
}) => {
  return (
    <div
      className={cn('flex flex-col items-center justify-center gap-6', className)}
      style={{ minHeight }}
    >
      <div
        style={{
          width: '48px',
          aspectRatio: '1',
          borderRadius: '50%',
          background: `
            radial-gradient(farthest-side, #0369a1 94%, transparent) top/6px 6px no-repeat,
            conic-gradient(transparent 30%, #0369a1)
          `,
          WebkitMask: 'radial-gradient(farthest-side, transparent calc(100% - 6px), #000 0)',
          mask: 'radial-gradient(farthest-side, transparent calc(100% - 6px), #000 0)',
          animation: 'sectionSpin 0.8s infinite linear',
        }}
      />

      <p className="text-sm text-gray-400 animate-pulse">{label}</p>

      <div className="w-full max-w-md flex flex-col gap-3 px-4">
        <div className="h-4 rounded-md bg-gray-100 animate-pulse" />
        <div className="h-4 rounded-md bg-gray-100 animate-pulse w-3/4" />
        <div className="h-4 rounded-md bg-gray-100 animate-pulse w-1/2" />
      </div>

      <style>{`
        @keyframes sectionSpin {
          100% { transform: rotate(1turn); }
        }
      `}</style>
    </div>
  );
};

export default SectionLoader;
