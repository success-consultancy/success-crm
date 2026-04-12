'use client';

import StepButtons from './step-buttons';
import AppointmentPhoneInput from './appointment-phone-input';

interface Props {
  fullName: string;
  email: string;
  phone: string;
  onChange: (field: 'fullName' | 'email' | 'phone', value: string) => void;
  onBack: () => void;
  onContinue: () => void;
}

const StepContact = ({ fullName, email, phone, onChange, onBack, onContinue }: Props) => {
  const isValid = fullName.trim() && email.trim() && phone.trim();

  return (
    <div className="flex flex-col h-full">
      {/* Headline */}
      <div className="mt-[98px] px-9">
        <h2 className="font-bold text-[24px] leading-[32px] text-[#1c1c1c]">Your contact details</h2>
        <p className="text-[14px] leading-[20px] text-[#484848] mt-1">
          We&apos;ll use this information to confirm your appointment
        </p>
      </div>

      {/* Form */}
      <div className="mt-6 px-9 flex flex-col gap-6">
        {/* Full name */}
        <div className="flex flex-col gap-2">
          <label className="font-semibold text-[14px] leading-[20px] text-[#1c1c1c] tracking-[-0.14px]">
            Full name
          </label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => onChange('fullName', e.target.value)}
            placeholder="e.g. John Doe"
            className="h-11 border border-[#b4b4b4] rounded-[6px] px-3 text-[16px] text-[#1c1c1c] placeholder:text-[#757575] bg-white focus:outline-none focus:border-[#007acc] focus:ring-1 focus:ring-[#007acc]/20 transition-colors tracking-[-0.16px]"
          />
        </div>

        {/* Email */}
        <div className="flex flex-col gap-2">
          <label className="font-semibold text-[14px] leading-[20px] text-[#1c1c1c] tracking-[-0.14px]">
            Email address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => onChange('email', e.target.value)}
            placeholder="e.g. name@example.com"
            className="h-11 border border-[#b4b4b4] rounded-[6px] px-3 text-[16px] text-[#1c1c1c] placeholder:text-[#757575] bg-white focus:outline-none focus:border-[#007acc] focus:ring-1 focus:ring-[#007acc]/20 transition-colors tracking-[-0.16px]"
          />
        </div>

        {/* Phone */}
        <AppointmentPhoneInput
          label="Phone number"
          value={phone}
          onChange={(val) => onChange('phone', val)}
          placeholder="000 000 000"
        />
      </div>

      {/* Buttons */}
      <div className="mt-auto">
        <StepButtons
          onBack={onBack}
          onPrimary={onContinue}
          primaryLabel="Review Booking"
          primaryDisabled={!isValid}
        />
      </div>
    </div>
  );
};

export default StepContact;
