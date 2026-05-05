'use client';

import { Delete } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
  pin: string;
  setPin: (next: string) => void;
  length?: number;
  error?: boolean;
}

const PinPad = ({ pin, setPin, length = 4, error }: Props) => {
  const handleDigit = (digit: string) => {
    if (pin.length >= length) return;
    setPin(pin + digit);
  };

  const handleDelete = () => {
    if (pin.length === 0) return;
    setPin(pin.slice(0, -1));
  };

  return (
    <div className="flex flex-col items-center gap-6 w-full">
      {/* Display */}
      <div
        className={cn(
          'flex items-center justify-center gap-3 w-full max-w-xs h-12 rounded-md border bg-white px-3 transition-colors',
          error ? 'border-red-400' : 'border-gray-300',
        )}
      >
        {Array.from({ length }).map((_, i) => (
          <span
            key={i}
            className={cn(
              'text-xl font-semibold tabular-nums w-6 text-center',
              pin[i] ? 'text-gray-900' : 'text-gray-300',
            )}
          >
            {pin[i] ?? '·'}
          </span>
        ))}
      </div>

      {/* Keypad */}
      <div className="grid grid-cols-3 gap-3 w-full max-w-xs">
        {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((d) => (
          <KeyButton key={d} onClick={() => handleDigit(d)}>
            {d}
          </KeyButton>
        ))}
        <div />
        <KeyButton onClick={() => handleDigit('0')}>0</KeyButton>
        <KeyButton onClick={handleDelete} ariaLabel="Delete">
          <Delete className="w-5 h-5 text-gray-500" strokeWidth={1.5} />
        </KeyButton>
      </div>
    </div>
  );
};

const KeyButton = ({
  onClick,
  children,
  ariaLabel,
}: {
  onClick: () => void;
  children: React.ReactNode;
  ariaLabel?: string;
}) => (
  <button
    type="button"
    aria-label={ariaLabel}
    onClick={onClick}
    className="h-12 w-full rounded-md border border-gray-200 bg-white text-lg font-medium text-gray-800 shadow-xs hover:bg-gray-50 active:scale-[0.98] transition-all flex items-center justify-center"
  >
    {children}
  </button>
);

export default PinPad;
