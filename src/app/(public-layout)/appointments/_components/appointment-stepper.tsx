'use client';

import { Check } from 'lucide-react';

const STEPS = [
  { number: 1, label: 'Branch' },
  { number: 2, label: 'Service' },
  { number: 3, label: 'Schedule' },
  { number: 4, label: 'Contact info' },
  { number: 5, label: 'Confirm' },
] as const;

interface Props {
  currentStep: number;
}

const AppointmentStepper = ({ currentStep }: Props) => {
  return (
    <nav aria-label="Booking progress" className="flex items-center justify-center">
      <ol className="flex items-center" role="list">
        {STEPS.map((step, idx) => {
          const isCompleted = currentStep > step.number;
          const isActive = currentStep === step.number;
          const status = isCompleted ? 'completed' : isActive ? 'current' : 'upcoming';

          return (
            <li key={step.number} className="flex items-center">
              <div
                className="flex items-center gap-2.5 px-6 py-4"
                aria-current={isActive ? 'step' : undefined}
              >
                {/* Step indicator */}
                {isCompleted ? (
                  <div
                    className="w-5 h-5 rounded-full bg-[#007acc] flex items-center justify-center shrink-0"
                    aria-hidden="true"
                  >
                    <Check className="w-3 h-3 text-white" strokeWidth={2.5} />
                  </div>
                ) : (
                  <div
                    className={`w-5 h-5 rounded-[10px] border flex items-center justify-center shrink-0 ${
                      isActive ? 'border-[#007acc]' : 'border-[#aaa]'
                    }`}
                    aria-hidden="true"
                  >
                    <span
                      className={`text-[14px] leading-[20px] ${
                        isActive ? 'font-semibold text-[#007acc]' : 'font-medium text-[#aaa]'
                      }`}
                    >
                      {step.number}
                    </span>
                  </div>
                )}

                {/* Step label */}
                <span
                  className={`text-[14px] leading-[20px] whitespace-nowrap ${
                    isCompleted
                      ? 'font-medium text-[#1c1c1c]'
                      : isActive
                        ? 'font-semibold text-[#007acc]'
                        : 'font-medium text-[#aaa]'
                  }`}
                >
                  {step.label}
                  <span className="sr-only"> — {status}</span>
                </span>
              </div>

              {/* Connector line */}
              {idx < STEPS.length - 1 && (
                <div className="w-12 h-px bg-[#b4b4b4] shrink-0" aria-hidden="true" />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default AppointmentStepper;
