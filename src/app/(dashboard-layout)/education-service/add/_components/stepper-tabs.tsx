'use client';
import { Check } from 'lucide-react';

interface StepperTabsProps {
  currentStep: number;
}

const StepperTabs = ({ currentStep }: StepperTabsProps) => {
  const steps = ['Personal details', 'Course info', 'Fee structure', 'Accounts', 'Misc'];

  return (
    <div className="flex items-center justify-center">
      {steps.map((step, index) => {
        const stepNumber = index + 1;
        const isCompleted = stepNumber < currentStep;
        const isActive = stepNumber === currentStep;

        return (
          <div key={index} className="flex items-center">
            {/* Step */}
            <div className="flex items-center">
              <div
                className={`flex items-center justify-center w-6 h-6 rounded-full text-sm font-medium border
                  ${
                    isCompleted
                      ? 'bg-blue-600 border-blue-600 text-white'
                      : isActive
                      ? 'border-blue-600 text-blue-600'
                      : 'border-gray-400 text-gray-400'
                  }`}
              >
                {isCompleted ? <Check className="w-4 h-4 stroke-[3]" /> : stepNumber}
              </div>
              <span
                className={`ml-2 text-sm font-medium 
                  ${isActive || isCompleted ? 'text-blue-600' : 'text-gray-400'}`}
              >
                {step}
              </span>
            </div>

            {/* Connector line */}
            {index !== steps.length - 1 && (
              <div
                className={`w-12 h-[1px] mx-4 
                  ${isCompleted ? 'bg-blue-600' : 'bg-gray-300'}`}
              ></div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default StepperTabs;
