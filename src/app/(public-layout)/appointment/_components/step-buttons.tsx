'use client';

import { Spinner } from '@/components/common/spinner';

interface StepButtonsProps {
  onPrimary: () => void;
  primaryLabel?: string;
  primaryDisabled?: boolean;
  primaryLoading?: boolean;
  onBack?: () => void;
  onSecondary?: () => void;
  secondaryLabel?: string;
  centered?: boolean;
}

const StepButtons = ({
  onPrimary,
  primaryLabel = 'Continue',
  primaryDisabled = false,
  primaryLoading = false,
  onBack,
  onSecondary,
  secondaryLabel,
  centered = false,
}: StepButtonsProps) => {
  return (
    <div className={`px-9 pt-9 pb-9 flex items-center ${centered ? 'justify-center gap-3' : 'justify-between'}`}>
      {/* Left side: Back */}
      {!centered && (
        <div>
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="h-12 px-6 border border-[#b4b4b4] text-[#1c1c1c] text-[14px] font-semibold leading-[20px] rounded-[6px] cursor-pointer hover:bg-gray-50 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#007acc]/50 focus-visible:ring-offset-2 transition-all duration-150"
            >
              Back
            </button>
          )}
        </div>
      )}

      {/* Centered layout: secondary action (e.g. Download PDF) */}
      {centered && onSecondary && (
        <button
          type="button"
          onClick={onSecondary}
          className="h-12 px-10 border border-[#b4b4b4] text-[#1c1c1c] text-[14px] font-semibold leading-[20px] rounded-[6px] cursor-pointer hover:bg-gray-50 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#007acc]/50 focus-visible:ring-offset-2 transition-all duration-150"
        >
          {secondaryLabel}
        </button>
      )}

      {/* Primary action */}
      <button
        type="button"
        onClick={onPrimary}
        disabled={primaryDisabled || primaryLoading}
        aria-disabled={primaryDisabled || primaryLoading}
        className="h-12 px-10 bg-[#007acc] text-white text-[14px] font-semibold leading-[20px] rounded-[6px] cursor-pointer hover:bg-[#0069b3] active:scale-[0.97] disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#007acc]/50 focus-visible:ring-offset-2 transition-all duration-150 flex items-center gap-2"
      >
        {primaryLoading && <Spinner size="sm" className="shrink-0 text-current" />}
        {primaryLabel}
      </button>
    </div>
  );
};

export default StepButtons;
