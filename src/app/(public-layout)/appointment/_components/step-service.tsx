'use client';

import { Check } from 'lucide-react';
import StepButtons from './step-buttons';

const SERVICES = [
  'Education Service',
  'Visa Service',
  'Skill Assessment Service',
  'Health Insurance Service',
  'Tribunal Service',
];

interface Props {
  selected: string[];
  onToggle: (service: string) => void;
  onBack: () => void;
  onContinue: () => void;
}

const StepService = ({ selected, onToggle, onBack, onContinue }: Props) => {
  return (
    <div className="flex flex-col h-full">
      {/* Headline */}
      <div className="mt-[98px] px-9">
        <h2 className="font-bold text-[24px] leading-[32px] text-[#1c1c1c]">What can we help with?</h2>
        <p className="text-[14px] leading-[20px] text-[#484848] mt-1">
          Please select the service you need assistance with
        </p>
      </div>

      {/* Options */}
      <div
        role="group"
        aria-label="Services"
        className="mt-6 px-9 flex flex-wrap gap-3.5"
      >
        {SERVICES.map((service) => {
          const isSelected = selected.includes(service);
          return (
            <button
              key={service}
              type="button"
              role="checkbox"
              aria-checked={isSelected}
              onClick={() => onToggle(service)}
              className={`flex items-center gap-2.5 h-14 pl-5 pr-3.5 rounded-[8px] w-[364px] border cursor-pointer transition-all duration-150 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#007acc]/50 focus-visible:ring-offset-2 ${
                isSelected
                  ? 'border-[1.5px] border-[#484848]'
                  : 'border border-[#e3e3e3] hover:border-[#b4b4b4]'
              } bg-white`}
            >
              <span className="font-medium text-[16px] leading-[24px] text-[#1c1c1c] text-left flex-1">
                {service}
              </span>
              {/* Checkbox indicator — decorative, semantics handled by role/aria-checked above */}
              <div
                aria-hidden="true"
                className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-all duration-150 ${
                  isSelected ? 'bg-[#007acc] border-[#007acc]' : 'border-[#b4b4b4] bg-white'
                }`}
              >
                {isSelected && <Check className="w-3 h-3 text-white" strokeWidth={2.5} />}
              </div>
            </button>
          );
        })}
      </div>

      {/* Buttons */}
      <div className="mt-auto">
        <StepButtons onBack={onBack} onPrimary={onContinue} primaryDisabled={selected.length === 0} />
      </div>
    </div>
  );
};

export default StepService;
