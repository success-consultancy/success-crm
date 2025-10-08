'use client';

import type React from 'react';
import { createContext, useContext, useState, useCallback } from 'react';
import type { NewStudentType } from '@/schema/education-service/new-student.schema';

interface StepperContextType {
  activeStep: number;
  setActiveStep: (step: number) => void;
  steps: string[];
  nextStep: () => void;
  prevStep: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
  formData: Partial<NewStudentType>;
  updateFormData: (data: Partial<NewStudentType>) => void;
  stepValidation: boolean[];
  setStepValidation: (step: number, isValid: boolean) => void;
  canNavigateToStep: (step: number) => boolean;
}

const StepperContext = createContext<StepperContextType | undefined>(undefined);

export const StepperProvider = ({ children, steps }: { children: React.ReactNode; steps: string[] }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState<Partial<NewStudentType>>({});
  const [stepValidation, setStepValidationState] = useState<boolean[]>(new Array(steps.length).fill(false));

  const updateFormData = useCallback((data: Partial<NewStudentType>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  }, []);

  const setStepValidation = useCallback((step: number, isValid: boolean) => {
    setStepValidationState((prev) => {
      const newValidation = [...prev];
      newValidation[step] = isValid;
      return newValidation;
    });
  }, []);

  const canNavigateToStep = useCallback(
    (step: number) => {
      if (step === 0) return true;
      for (let i = 0; i < step; i++) {
        if (!stepValidation[i]) return false;
      }
      return true;
    },
    [stepValidation],
  );

  const nextStep = useCallback(() => {
    if (activeStep < steps.length - 1 && stepValidation[activeStep]) {
      setActiveStep(activeStep + 1);
    }
  }, [activeStep, steps.length, stepValidation]);

  const prevStep = useCallback(() => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
    }
  }, [activeStep]);

  const handleSetActiveStep = useCallback(
    (step: number) => {
      if (canNavigateToStep(step)) {
        setActiveStep(step);
      }
    },
    [canNavigateToStep],
  );

  const isFirstStep = activeStep === 0;
  const isLastStep = activeStep === steps.length - 1;

  return (
    <StepperContext.Provider
      value={{
        activeStep,
        setActiveStep: handleSetActiveStep,
        steps,
        nextStep,
        prevStep,
        isFirstStep,
        isLastStep,
        formData,
        updateFormData,
        stepValidation,
        setStepValidation,
        canNavigateToStep,
      }}
    >
      {children}
    </StepperContext.Provider>
  );
};

export const useStepper = () => {
  const context = useContext(StepperContext);
  if (!context) {
    throw new Error('useStepper must be used within a StepperProvider');
  }
  return context;
};
