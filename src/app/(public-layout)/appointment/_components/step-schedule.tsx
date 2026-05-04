'use client';

import { useState } from 'react';
import { ChevronDown, GraduationCap, MapPin, CreditCard } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import StepButtons from './step-buttons';
import AppointmentDatePicker from './appointment-date-picker';
import { useGetUsersForAppointment } from '@/query/get-users-for-appointment';
import type { UserForAppointment } from '@/query/get-users-for-appointment';
import { BRANCH_SLUG } from '@/constants/global';
import { api } from '@/lib/api';

const APPOINTMENT_API_BASE = 'https://api.successedu.com.au';

function getBranchSlug(branch: string): string {
  return branch
    .toLowerCase()
    .replace(/\s*\([^)]*\)/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

function getSlotFromISOStart(start: string): string {
  // If no timezone suffix, treat as Sydney local time and parse directly
  if (!start.endsWith('Z') && !/[+-]\d{2}:\d{2}$/.test(start)) {
    const timePart = start.split('T')[1] ?? '';
    const [h, m] = timePart.split(':').map(Number);
    const period = h >= 12 ? 'PM' : 'AM';
    const displayH = h === 0 ? 12 : h > 12 ? h - 12 : h;
    return `${displayH}:${String(m).padStart(2, '0')} ${period}`;
  }
  return new Date(start).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: 'Australia/Sydney',
  });
}

interface AppointmentSlot {
  start: string;
  end: string;
  timezone: string;
  userId: string[];
  open: boolean;
  isPaid: boolean;
  paidAmount: string | null;
  slotTime: number;
}

const fetchAppointmentSlots = async (date: string, userId: string): Promise<AppointmentSlot[]> => {
  const res = await api.get<AppointmentSlot[]>(
    `/public/appointment`,
    { params: { date, userId } },
  );
  return res.data ?? [];
};

const ALL_SLOTS = [
  '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
  '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM',
  '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM', '5:00 PM',
];

const AVATAR_COLORS = [
  '#007acc', '#9b7fb6', '#5a9a6f', '#d97706', '#dc2626',
  '#0891b2', '#7c3aed', '#db2777', '#059669', '#ea580c',
];

function getInitials(firstName: string, lastName: string) {
  return `${firstName[0] ?? ''}${lastName[0] ?? ''}`.toUpperCase();
}

function parseDetail(detail: string | null): { credentials: string[]; officeAddress: string } {
  if (!detail) return { credentials: [], officeAddress: '' };

  const lines = detail
    .split('\n')
    .map((l) => l.replace(/^-\s*/, '').trim())
    .filter(Boolean);

  let officeAddress = '';
  const credentials: string[] = [];

  for (const line of lines) {
    if (line.toLowerCase().startsWith('address:')) {
      officeAddress = line.replace(/^address:\s*/i, '').trim();
    } else {
      credentials.push(line);
    }
  }

  return { credentials, officeAddress };
}

interface Props {
  branch: string;
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
  branch,
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
  const { data: consultants = [], isLoading } = useGetUsersForAppointment(branch);

  const { data: appointmentSlots = [] } = useQuery({
    queryKey: ['appointmentSlots', date, consultantId],
    queryFn: () => fetchAppointmentSlots(date, consultantId),
    enabled: !!date && !!consultantId,
    staleTime: 30_000,
  });

  const bookedSlots = appointmentSlots
    .filter((slot) => !slot.open)
    .map((slot) => getSlotFromISOStart(slot.start));

  const toggleExpanded = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const canContinue = !!date && !!consultantId && !!time;

  const renderConsultant = (consultant: UserForAppointment, index: number) => {
    const id = String(consultant.id);
    const isSelected = consultantId === id;
    const isExpanded = expandedId === id;
    const name = `${consultant.firstName} ${consultant.lastName}`;
    const initials = getInitials(consultant.firstName, consultant.lastName);
    const color = AVATAR_COLORS[index % AVATAR_COLORS.length];
    const fee = consultant.isPaid && consultant.paidAmount ? `$${consultant.paidAmount}` : 'Free';
    const { credentials, officeAddress } = parseDetail(consultant.detail);

    return (
      <div
        key={id}
        className={`bg-white border rounded-[8px] overflow-hidden transition-colors duration-150 ${isSelected ? 'border-[#007acc]/30' : 'border-[#e3e3e3]'
          }`}
      >
        {/* Main row */}
        <div className="flex gap-6 items-center px-5 py-4">
          <div className="flex flex-1 gap-3.5 items-center min-w-0">
            {/* Avatar */}
            {consultant.profileUrl ? (
              <img
                src={consultant.profileUrl}
                alt={name}
                className="w-12 h-12 rounded-full object-cover shrink-0"
              />
            ) : (
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold text-sm shrink-0"
                style={{ backgroundColor: color }}
              >
                {initials}
              </div>
            )}

            <div className="flex flex-col gap-2.5 flex-1 min-w-0">
              <div className="flex flex-col gap-0.5">
                <p className="font-semibold text-[18px] leading-[26px] text-[#1c1c1c] whitespace-nowrap">
                  {name}
                </p>
                {consultant.appointmentNote && (
                  <p className="text-[14px] leading-[20px] text-[#484848]">{consultant.appointmentNote}</p>
                )}
              </div>
              {(credentials.length > 0 || officeAddress) && (
                <button
                  type="button"
                  onClick={() => toggleExpanded(id)}
                  aria-expanded={isExpanded}
                  aria-controls={`consultant-details-${id}`}
                  className="flex items-center gap-1 w-fit cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#007acc]/50 focus-visible:ring-offset-1 rounded-sm group"
                >
                  <span className="font-medium text-[13px] leading-[18px] text-[#007acc]">
                    {isExpanded ? 'Hide details' : 'View credentials & details'}
                  </span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-[#007acc] transition-transform duration-250 ease-in-out ${isExpanded ? 'rotate-180' : 'rotate-0'
                      }`}
                    strokeWidth={2}
                  />
                </button>
              )}
            </div>

            {consultant.isPaid && (
              <div className="flex flex-col gap-0.5 items-end shrink-0">
                <p className="font-semibold text-[16px] leading-[24px] text-[#1c1c1c]">{fee}</p>
                <p className="text-[12px] leading-[16px] text-[#484848]">Consultation Fee</p>
              </div>
            )}
          </div>

          {/* Radio */}
          <button
            type="button"
            role="radio"
            aria-checked={isSelected}
            aria-label={`Select ${name}`}
            onClick={() => onConsultantChange(id)}
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

        {/* Expanded details */}
        <div
          id={`consultant-details-${id}`}
          className={`grid transition-[grid-template-rows] duration-250 ease-in-out ${isExpanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
            }`}
        >
          <div className="overflow-hidden min-h-0">
            <div className="border-t border-[#e3e3e3] px-5 pt-4 pb-5 flex flex-col gap-4">
              {/* Credentials */}
              {credentials.length > 0 && (
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-[#484848] shrink-0" strokeWidth={1.5} />
                    <p className="font-semibold text-[14px] leading-[20px] text-[#1c1c1c]">
                      Credentials &amp; Qualifications
                    </p>
                  </div>
                  <ul className="flex flex-col gap-1 pl-1">
                    {credentials.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-[14px] leading-[20px] text-[#484848]">
                        <span className="mt-[7px] w-1.5 h-1.5 rounded-full bg-[#007acc] shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Office Address */}
              {officeAddress && (
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#484848] shrink-0" strokeWidth={1.5} />
                    <p className="font-semibold text-[14px] leading-[20px] text-[#1c1c1c]">Office Address</p>
                  </div>
                  <p className="pl-6 text-[14px] leading-[20px] text-[#484848]">{officeAddress}</p>
                </div>
              )}

              {/* Payment Information */}
              {consultant.isPaid && consultant.appointmentNote && (
                <div className="flex gap-2 bg-[#fffbeb] border border-[#f5d77a] rounded-[6px] px-4 py-3">
                  <CreditCard className="w-4 h-4 text-[#b45309] shrink-0 mt-0.5" strokeWidth={1.5} />
                  <div className="flex flex-col gap-0.5">
                    <p className="font-semibold text-[14px] leading-[20px] text-[#92400e]">Payment Information</p>
                    <p className="text-[13px] leading-[18px] text-[#92400e]">{consultant.appointmentNote}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col">
      {/* Headline */}
      <div className="mt-[24px] px-9">
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
      {date && (
        <div className="mt-6 px-9">
          <p className="font-semibold text-[16px] leading-[24px] text-[#1c1c1c] mb-3.5">Choose consultant</p>
          {isLoading ? (
            <div className="flex flex-col gap-3.5">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-20 rounded-[8px] bg-[#f3f4f6] animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-3.5">
              {consultants.map((consultant, index) => renderConsultant(consultant, index))}
            </div>
          )}
        </div>
      )}

      {/* Available time slots */}
      {date && (
        <div className="mt-6 px-9">
          <p
            id="time-slots-label"
            className="font-semibold text-[16px] leading-[24px] text-[#1c1c1c] mb-3.5"
          >
            Available time slots
          </p>
          <div role="radiogroup" aria-labelledby="time-slots-label" className="flex flex-wrap gap-2">
            {ALL_SLOTS.map((slot) => {
              const isSelected = time === slot;
              const isBooked = bookedSlots.includes(slot);
              return (
                <button
                  key={slot}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  aria-label={isBooked ? `${slot} — unavailable` : slot}
                  disabled={isBooked}
                  onClick={() => !isBooked && onTimeChange(slot)}
                  className={`h-10 px-4 rounded-[6px] border text-[14px] font-medium leading-[20px] transition-all duration-150 ${isBooked
                    ? 'border-[#e3e3e3] text-[#b4b4b4] bg-[#f9f9f9] cursor-not-allowed line-through'
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
      )}

      {/* Buttons */}
      <div className="mt-8">
        <StepButtons onBack={onBack} onPrimary={onContinue} primaryDisabled={!canContinue} />
      </div>
    </div>
  );
};

export default StepSchedule;
