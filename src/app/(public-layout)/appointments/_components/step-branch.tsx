'use client';

import StepButtons from './step-buttons';

const BRANCHES = [
  'Canberra',
  'CBD-Canberra (Chinese)',
  'Sydney',
  'Brisbane',
  'GoldCoast',
  'Launceston',
  'Kathmandu',
];

interface Props {
  selected: string;
  onSelect: (branch: string) => void;
  onContinue: () => void;
}

const StepBranch = ({ selected, onSelect, onContinue }: Props) => {
  return (
    <div className="flex flex-col h-full">
      {/* Headline */}
      <div className="mt-[98px] px-9">
        <h2 className="font-bold text-[24px] leading-[32px] text-[#1c1c1c]">Choose a branch</h2>
        <p className="text-[14px] leading-[20px] text-[#484848] mt-1">
          Please select the location most convenient for you
        </p>
      </div>

      {/* Options */}
      <div
        role="radiogroup"
        aria-label="Branch locations"
        className="mt-6 px-9 flex flex-wrap gap-3.5"
      >
        {BRANCHES.map((branch) => {
          const isSelected = selected === branch;
          return (
            <button
              key={branch}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => onSelect(branch)}
              className={`flex items-center justify-between gap-4 h-14 px-5 rounded-[8px] w-[365px] border cursor-pointer transition-all duration-150 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#007acc]/50 focus-visible:ring-offset-2 ${isSelected
                  ? 'border-[1.5px] border-[#484848]'
                  : 'border border-[#e3e3e3] hover:border-[#b4b4b4]'
                } bg-white`}
            >
              <span className="font-medium text-[16px] leading-[24px] text-[#1c1c1c] text-left flex-1">
                {branch}
              </span>
              {/* Radio indicator — decorative, semantics handled by role/aria-checked above */}
              <div
                aria-hidden="true"
                className="w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 border-[#b4b4b4] relative"
              >
                {isSelected && (
                  <>
                    <div className="absolute inset-0 rounded-full border-2 border-[#007acc]" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#007acc]" />
                  </>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Buttons */}
      <StepButtons onPrimary={onContinue} primaryDisabled={!selected} />
    </div>
  );
};

export default StepBranch;
