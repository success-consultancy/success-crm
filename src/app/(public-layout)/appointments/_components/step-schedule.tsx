'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, GraduationCap, MapPin, CreditCard } from 'lucide-react';
import StepButtons from './step-buttons';
import AppointmentDatePicker from './appointment-date-picker';

export interface Consultant {
  id: string;
  name: string;
  role: string;
  fee: string;
  initials: string;
  color: string;
  credentials: string[];
  officeAddress: string;
}

export const CONSULTANTS: Consultant[] = [
  {
    id: '1',
    name: 'Man Tamang',
    role: 'Registered Migration Agent (MARN: 2519138)',
    fee: '$100',
    initials: 'MT',
    color: '#007acc',
    credentials: [
      'Ground Floor, Unit G06, 8 Gribble St, Gungahlin, ACT 2912',
      'Qualified Education Counsellor (QEAC No: M093)',
      'Graduate Diploma in Australian Migration Law and Practice - ACU',
      'BIT - CQU',
    ],
    officeAddress: 'Ground Floor, Unit G06, 8 Gribble St, Gungahlin, ACT 2912',
  },
  {
    id: '2',
    name: 'Adarsha Jung Pandey',
    role: 'Registered Migration Agent (MARN: 2217915)',
    fee: '$100',
    initials: 'AJ',
    color: '#9b7fb6',
    credentials: [
      'Level 1, 1 Moore St, Canberra City, ACT 2601',
      'Registered Migration Agent (MARN: 2217915)',
      'Bachelor of Laws - ANU',
    ],
    officeAddress: 'Level 1, 1 Moore St, Canberra City, ACT 2601',
  },
  {
    id: '3',
    name: 'Juliya Shrestha',
    role: 'Education Consultant Expert',
    fee: '$100',
    initials: 'JS',
    color: '#5a9a6f',
    credentials: [
      'Qualified Education Counsellor (QEAC No: J042)',
      'Master of Education - University of Canberra',
    ],
    officeAddress: 'Ground Floor, Unit G06, 8 Gribble St, Gungahlin, ACT 2912',
  },
];

const ALL_SLOTS = [
  '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
  '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM',
  '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM', '5:00 PM',
];

const UNAVAILABLE_SLOTS = new Set(['9:30 AM', '10:30 AM', '1:30 PM', '2:30 PM', '4:00 PM']);

interface Props {
  date: string;
  consultantId: string;
  time: string;
  onDateChange: (date: string) => void;
  onConsultantChange: (id: string) => void;
  onTimeChange: (time: string) => void;
  onBack: () => void;
  onContinue: () => void;
}

const StepSchedule = ({
  date,
  consultantId,
  time,
  onDateChange,
  onConsultantChange,
  onTimeChange,
  onBack,
  onContinue,
}: Props) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpanded = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const canContinue = !!date && !!consultantId && !!time;

  return (
    <div className="flex flex-col">
      {/* Headline */}
      <div className="mt-[98px] px-9">
        <h2 className="font-bold text-[24px] leading-[32px] text-[#1c1c1c]">Pick a date and time</h2>
        <p className="text-[14px] leading-[20px] text-[#484848] mt-1">
          Choose when you&apos;d like to meet with us
        </p>
      </div>

      {/* Date field */}
      <div className="mt-6 px-9">
        <AppointmentDatePicker
          label="Date"
          value={date}
          onChange={onDateChange}
          placeholder="Select a date"
        />
      </div>

      {/* Choose consultant */}
      <div className="mt-6 px-9">
        <p className="font-semibold text-[16px] leading-[24px] text-[#1c1c1c] mb-3.5">Choose consultant</p>
        <div className="flex flex-col gap-3.5">
          {CONSULTANTS.map((consultant) => {
            const isSelected = consultantId === consultant.id;
            const isExpanded = expandedId === consultant.id;

            return (
              <div
                key={consultant.id}
                className={`bg-white border rounded-[8px] overflow-hidden transition-colors duration-150 ${
                  isSelected ? 'border-[#007acc]/30' : 'border-[#e3e3e3]'
                }`}
              >
                {/* Main row */}
                <div className="flex gap-6 items-center px-5 py-4">
                  <div className="flex flex-1 gap-3.5 items-center min-w-0">
                    {/* Avatar */}
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold text-sm shrink-0"
                      style={{ backgroundColor: consultant.color }}
                    >
                      {consultant.initials}
                    </div>

                    <div className="flex flex-col gap-2.5 flex-1 min-w-0">
                      <div className="flex flex-col gap-0.5">
                        <p className="font-semibold text-[18px] leading-[26px] text-[#1c1c1c] whitespace-nowrap">
                          {consultant.name}
                        </p>
                        <p className="text-[14px] leading-[20px] text-[#484848]">{consultant.role}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => toggleExpanded(consultant.id)}
                        aria-expanded={isExpanded}
                        aria-controls={`consultant-details-${consultant.id}`}
                        className="flex items-center gap-1 w-fit cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#007acc]/50 focus-visible:ring-offset-1 rounded-sm group"
                      >
                        <span className="font-medium text-[13px] leading-[18px] text-[#007acc]">
                          {isExpanded ? 'Hide details' : 'View credentials & details'}
                        </span>
                        <ChevronDown
                          className={`w-3.5 h-3.5 text-[#007acc] transition-transform duration-250 ease-in-out ${
                            isExpanded ? 'rotate-180' : 'rotate-0'
                          }`}
                          strokeWidth={2}
                        />
                      </button>
                    </div>

                    <div className="flex flex-col gap-0.5 items-end shrink-0">
                      <p className="font-semibold text-[16px] leading-[24px] text-[#1c1c1c]">{consultant.fee}</p>
                      <p className="text-[12px] leading-[16px] text-[#484848]">Consultation Fee</p>
                    </div>
                  </div>

                  {/* Radio */}
                  <button
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    aria-label={`Select ${consultant.name}`}
                    onClick={() => onConsultantChange(consultant.id)}
                    className="shrink-0 cursor-pointer active:scale-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#007acc]/50 focus-visible:ring-offset-2 focus-visible:rounded-full transition-transform duration-100"
                  >
                    <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center relative transition-colors duration-150 border-[#b4b4b4]">
                      {isSelected && (
                        <>
                          <div className="absolute inset-0 rounded-full border-2 border-[#007acc] animate-in zoom-in-75 duration-150" />
                          <div className="w-2.5 h-2.5 rounded-full bg-[#007acc] animate-in zoom-in-50 duration-150" />
                        </>
                      )}
                    </div>
                  </button>
                </div>

                {/* Expanded details — CSS grid accordion for smooth height animation */}
                <div
                  id={`consultant-details-${consultant.id}`}
                  className={`grid transition-[grid-template-rows] duration-250 ease-in-out ${
                    isExpanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                  }`}
                >
                  <div className="overflow-hidden min-h-0">
                    <div className="border-t border-[#e3e3e3] px-5 pt-4 pb-5 flex flex-col gap-4">
                      {/* Credentials & Qualifications */}
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                          <GraduationCap className="w-4 h-4 text-[#484848] shrink-0" strokeWidth={1.5} />
                          <p className="font-semibold text-[14px] leading-[20px] text-[#1c1c1c]">
                            Credentials &amp; Qualifications
                          </p>
                        </div>
                        <ul className="flex flex-col gap-1 pl-1">
                          {consultant.credentials.map((item, i) => (
                            <li key={i} className="flex items-start gap-2 text-[14px] leading-[20px] text-[#484848]">
                              <span className="mt-[7px] w-1.5 h-1.5 rounded-full bg-[#007acc] shrink-0" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Office Address */}
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-[#484848] shrink-0" strokeWidth={1.5} />
                          <p className="font-semibold text-[14px] leading-[20px] text-[#1c1c1c]">Office Address</p>
                        </div>
                        <p className="pl-6 text-[14px] leading-[20px] text-[#484848]">{consultant.officeAddress}</p>
                      </div>

                      {/* Payment Information */}
                      <div className="flex gap-2 bg-[#fffbeb] border border-[#f5d77a] rounded-[6px] px-4 py-3">
                        <CreditCard className="w-4 h-4 text-[#b45309] shrink-0 mt-0.5" strokeWidth={1.5} />
                        <div className="flex flex-col gap-0.5">
                          <p className="font-semibold text-[14px] leading-[20px] text-[#92400e]">Payment Information</p>
                          <p className="text-[13px] leading-[18px] text-[#92400e]">
                            (On card payments, 1.40% surcharge applies). Our office will be in touch with you for the
                            consultation fee once booked online. Paid consultation fee will be reduced from our service
                            fee paid for any future application.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Available time slots */}
      <div className="mt-6 px-9">
        <p
          id="time-slots-label"
          className="font-semibold text-[16px] leading-[24px] text-[#1c1c1c] mb-3.5"
        >
          Available time slots
        </p>
        <div role="radiogroup" aria-labelledby="time-slots-label" className="flex flex-wrap gap-2">
          {ALL_SLOTS.map((slot) => {
            const isUnavailable = UNAVAILABLE_SLOTS.has(slot);
            const isSelected = time === slot;
            return (
              <button
                key={slot}
                type="button"
                role="radio"
                aria-checked={isSelected}
                aria-label={isUnavailable ? `${slot} — unavailable` : slot}
                disabled={isUnavailable}
                onClick={() => !isUnavailable && onTimeChange(slot)}
                className={`h-10 px-4 rounded-[6px] border text-[14px] font-medium leading-[20px] transition-all duration-150 ${
                  isUnavailable
                    ? 'border-[#e3e3e3] text-[#aaa] bg-[#f9f9f9] cursor-not-allowed'
                    : isSelected
                      ? 'border-[#007acc] text-[#007acc] bg-white cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#007acc]/50 focus-visible:ring-offset-2'
                      : 'border-[#e3e3e3] text-[#1c1c1c] bg-white cursor-pointer hover:border-[#007acc] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#007acc]/50 focus-visible:ring-offset-2'
                }`}
              >
                {slot}
              </button>
            );
          })}
        </div>
      </div>

      {/* Buttons */}
      <div className="mt-8">
        <StepButtons onBack={onBack} onPrimary={onContinue} primaryDisabled={!canContinue} />
      </div>
    </div>
  );
};

export default StepSchedule;
