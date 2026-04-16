'use client';

import { useState } from 'react';
import AppointmentHeader from './_components/appointment-header';
import AppointmentStepper from './_components/appointment-stepper';
import StepBranch from './_components/step-branch';
import StepService from './_components/step-service';
import StepSchedule from './_components/step-schedule';
import StepContact from './_components/step-contact';
import StepSuccess from './_components/step-success';

interface AppointmentData {
  branch: string;
  services: string[];
  date: string;
  consultantId: string;
  time: string;
  fullName: string;
  email: string;
  phone: string;
  description: string;
}

const INITIAL_DATA: AppointmentData = {
  branch: '',
  services: [],
  date: '',
  consultantId: '',
  time: '',
  fullName: '',
  email: '',
  phone: '',
  description: '',
};

// Steps where the card is shorter and should be vertically centered
const SHORT_STEPS = [1, 2, 4];

const AppointmentPage = () => {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<AppointmentData>(INITIAL_DATA);

  const update = <K extends keyof AppointmentData>(field: K, value: AppointmentData[K]) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleService = (service: string) => {
    setData((prev) => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter((s) => s !== service)
        : [...prev.services, service],
    }));
  };

  const isShortStep = SHORT_STEPS.includes(step);

  return (
    <div className="min-h-screen bg-white">
      <AppointmentHeader onClose={() => window.history.back()} />

      {/* Content area below fixed nav */}
      <div
        className={`flex justify-center algin-start items-start py-18`}
      >
        <div
          className={`w-[916px] bg-white rounded-[16px] ${isShortStep ? 'my-4' : 'mt-4 mb-8'
            }`}
        >
          {/* Stepper — hidden on success step */}
          {step < 5 && (
            <div className="pt-[22px]">
              <AppointmentStepper currentStep={step} />
            </div>
          )}

          {/* Step content — keyed so each transition re-mounts and plays enter animation */}
          <div key={step} className="animate-in fade-in slide-in-from-bottom-2 duration-200 ease-out">
            {step === 1 && (
              <StepBranch
                selected={data.branch}
                onSelect={(branch) => update('branch', branch)}
                onContinue={() => setStep(2)}
              />
            )}

            {step === 2 && (
              <StepService
                selected={data.services}
                onToggle={toggleService}
                onBack={() => setStep(1)}
                onContinue={() => setStep(3)}
              />
            )}

            {step === 3 && (
              <StepSchedule
                branch={data.branch}
                date={data.date}
                consultantId={data.consultantId}
                time={data.time}
                onDateChange={(date) => update('date', date)}
                onConsultantChange={(id) => update('consultantId', id)}
                onTimeChange={(time) => update('time', time)}
                onBack={() => setStep(2)}
                onContinue={() => setStep(4)}
              />
            )}

            {step === 4 && (
              <StepContact
                fullName={data.fullName}
                email={data.email}
                phone={data.phone}
                description={data.description}
                onChange={(field, value) => update(field, value)}
                onBack={() => setStep(3)}
                onContinue={() => setStep(5)}
              />
            )}

            {step === 5 && (
              <>
                <div className="pt-[22px]">
                  <AppointmentStepper currentStep={5} />
                </div>
                <StepSuccess
                  data={data}
                  onGoHome={() => (window.location.href = '/')}
                  onBack={() => setStep(4)}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};


export default AppointmentPage;
