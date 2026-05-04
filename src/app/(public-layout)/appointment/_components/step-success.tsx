'use client';

import { useState, useCallback } from 'react';
import axios from 'axios';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import { CheckCircle2, Calendar, Clock, Briefcase, MapPin, User, Mail, Phone, MessageSquare } from 'lucide-react';
import StepButtons from './step-buttons';
import { useGetUsersForAppointment } from '@/query/get-users-for-appointment';
import { custom_api } from '@/lib/api';
import { BRANCH_SLUG } from '@/constants/global';

const AVATAR_COLORS = [
  '#007acc', '#9b7fb6', '#5a9a6f', '#d97706', '#dc2626',
  '#0891b2', '#7c3aed', '#db2777', '#059669', '#ea580c',
];

function getInitials(firstName: string, lastName: string) {
  return `${firstName[0] ?? ''}${lastName[0] ?? ''}`.toUpperCase();
}

const BRANCH_ADDRESSES: Record<string, string> = {
  Canberra: 'Ground Floor, Unit G06, 8 Gribble St, Gungahlin, ACT 2912',
  'CBD-Canberra (Chinese)': 'Level 1, 1 Moore St, Canberra City, ACT 2601',
  Sydney: 'Suite 302, 80 Clarence St, Sydney NSW 2000',
  Brisbane: 'Level 2, 144 Edward St, Brisbane QLD 4000',
  GoldCoast: '3/15 Bay St, Southport QLD 4215',
  Launceston: '187 Brisbane St, Launceston TAS 7250',
  Kathmandu: 'Putalisadak, Kathmandu 44600, Nepal',
};

const APPOINTMENT_API_BASE = 'https://api.successedu.com.au';

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

interface Props {
  data: AppointmentData;
  onGoHome?: () => void;
  onBack?: () => void;
}

function getBranchSlug(branch: string): string {
  return branch
    .toLowerCase()
    .replace(/\s*\([^)]*\)/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

function time12to24(time: string): string {
  const [timePart, period] = time.split(' ');
  const [hours, minutes] = timePart.split(':').map(Number);
  let h = hours;
  if (period === 'PM' && h !== 12) h += 12;
  if (period === 'AM' && h === 12) h = 0;
  return `${String(h).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}

function addThirtyMinutes(time24: string): string {
  const [h, m] = time24.split(':').map(Number);
  const total = h * 60 + m + 30;
  return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;
}

function getOrdinalSuffix(day: number): string {
  const j = day % 10, k = day % 100;
  if (j === 1 && k !== 11) return 'st';
  if (j === 2 && k !== 12) return 'nd';
  if (j === 3 && k !== 13) return 'rd';
  return 'th';
}

function formatSlotInfo(dateStr: string, time: string): string {
  const date = new Date(dateStr + 'T00:00:00');
  const weekday = date.toLocaleDateString('en-US', { weekday: 'long' });
  const month = date.toLocaleDateString('en-US', { month: 'long' });
  const day = date.getDate();
  const year = date.getFullYear();
  return `${weekday}, ${month} ${day}${getOrdinalSuffix(day)}, ${year} at ${time}`;
}

function formatSlotInfoShort(dateStr: string, time: string): string {
  const date = new Date(dateStr + 'T00:00:00');
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year} at ${time}`;
}

// Returns UTC datetime string like "20260422T230000Z"
function getUTCDatetimeStr(dateStr: string, time24: string): string {
  const utcDate = new Date(`${dateStr}T${time24}:00${
    new Intl.DateTimeFormat('en', { timeZone: 'Australia/Sydney', timeZoneName: 'longOffset' })
      .formatToParts(new Date(`${dateStr}T${time24}:00`))
      .find((p) => p.type === 'timeZoneName')!.value.replace('GMT', '')
  }`);
  const pad = (n: number) => String(n).padStart(2, '0');
  return (
    `${utcDate.getUTCFullYear()}${pad(utcDate.getUTCMonth() + 1)}${pad(utcDate.getUTCDate())}` +
    `T${pad(utcDate.getUTCHours())}${pad(utcDate.getUTCMinutes())}${pad(utcDate.getUTCSeconds())}Z`
  );
}

function buildGoogleLink(
  data: AppointmentData,
  paidAmount: string | null,
  address: string,
): string {
  const time24 = time12to24(data.time);
  const endTime24 = addThirtyMinutes(time24);
  const dtStart = getUTCDatetimeStr(data.date, time24);
  const dtEnd = getUTCDatetimeStr(data.date, endTime24);
  const fee = paidAmount ? ` (Fee: $${paidAmount})` : '';
  const title = `${data.fullName} - Online Appointment${fee}`;
  const description = `Name: ${data.fullName}\nEmail: ${data.email}\nPhone: ${data.phone}\nSelected Services: ${data.services.join(', ')}`;
  const location = `Success Education and Visa Services, ${address}`;
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    dates: `${dtStart}/${dtEnd}`,
    details: description,
    location,
    text: title,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

function buildICalLink(
  data: AppointmentData,
  paidAmount: string | null,
  address: string,
  uid: string,
): string {
  const time24 = time12to24(data.time);
  const endTime24 = addThirtyMinutes(time24);
  const dtStart = getUTCDatetimeStr(data.date, time24);
  const dtEnd = getUTCDatetimeStr(data.date, endTime24);
  const dtStamp = new Date().toISOString().replace(/[-:.]/g, '').slice(0, 15) + 'Z';
  const fee = paidAmount ? ` (Fee: $${paidAmount})` : '';
  const title = `${data.fullName} - Online Appointment${fee}`;
  const description = `Name: ${data.fullName}\\nEmail: ${data.email}\\nPhone: ${data.phone}\\nSelected Services: ${data.services.join(', ')}`;
  const location = `Success Education and Visa Services, ${address}`;
  const ical = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    `PRODID:${title}`,
    'BEGIN:VEVENT',
    `DTSTART:${dtStart}`,
    `DTEND:${dtEnd}`,
    `DTSTAMP:${dtStamp}`,
    `SUMMARY:${title}`,
    `DESCRIPTION:${description}`,
    `LOCATION:${location}`,
    `UID:${uid}`,
    'END:VEVENT',
    'END:VCALENDAR',
    '',
  ].join('\r\n');
  return `data:text/calendar;charset=utf8,${encodeURIComponent(ical)}`;
}

const formatDate = (dateStr: string) => {
  if (!dateStr) return '';
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('en-AU', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

const StepSuccess = ({ data, onGoHome, onBack }: Props) => {
  const [isBooked, setIsBooked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { executeRecaptcha } = useGoogleReCaptcha();

  const { data: consultants = [] } = useGetUsersForAppointment(data.branch);
  const consultantIndex = consultants.findIndex((c) => String(c.id) === data.consultantId);
  const consultant = consultants[consultantIndex] ?? null;
  const address = BRANCH_ADDRESSES[data.branch] || data.branch;

  const handleConfirm = useCallback(async () => {
    if (!executeRecaptcha) return;
    setIsLoading(true);
    setError(null);

    let captchaToken: string;
    try {
      captchaToken = await executeRecaptcha('appointment_confirm');
    } catch {
      setError('reCAPTCHA verification failed. Please try again.');
      setIsLoading(false);
      return;
    }

    try {
      const time24 = time12to24(data.time);
      const endTime24 = addThirtyMinutes(time24);
      const tzOffset = new Intl.DateTimeFormat('en', { timeZone: 'Australia/Sydney', timeZoneName: 'longOffset' })
        .formatToParts(new Date(`${data.date}T${time24}:00`))
        .find((p) => p.type === 'timeZoneName')!.value.replace('GMT', '');
      const [firstName, ...lastParts] = data.fullName.trim().split(' ');
      const lastName = lastParts.join(' ');
      const paidAmount = consultant?.isPaid ? (consultant.paidAmount ?? null) : null;
      const fee = paidAmount ? ` (Fee: $${paidAmount})` : '';
      const title = `${data.fullName} - Online Appointment${fee}`;
      const description = `Name: ${data.fullName}\nEmail: ${data.email}\nPhone: ${data.phone}\nSelected Services: ${data.services.join(', ')}${data.description ? `\nMessage: ${data.description}` : ''}`;

      // Book the appointment
      const appointmentRes = await custom_api.post(
        `/public/appointment`,
        {
          title,
          start: `${data.date}T${time24}:00${tzOffset}`,
          end: `${data.date}T${endTime24}:00${tzOffset}`,
          timezone: 'Australia/Sydney',
          userId: [data.consultantId],
          description,
          raw: {
            firstName,
            lastName,
            email: data.email,
            phone: data.phone,
            serviceType: JSON.stringify(data.services),
            status: 'New',
            note: '<i>Lead auto created from Online Appointment</i>',
          },
        },
        { headers: { captcha: captchaToken } },
      );

      const appointmentId = String(appointmentRes.data?.id ?? Date.now());
      const googleLink = buildGoogleLink(data, paidAmount, address);
      const iCalLink = buildICalLink(data, paidAmount, address, appointmentId);

      // Send confirmation email
      await axios.post(
        `${APPOINTMENT_API_BASE}/${BRANCH_SLUG}-email-sms/appointmentConfirmation`,
        {
          email: data.email,
          data: {
            isPaid: consultant?.isPaid ?? false,
            paidAmount: paidAmount ?? '0',
            slotInfo: formatSlotInfo(data.date, data.time),
            slotInfoShort: formatSlotInfoShort(data.date, data.time),
            name: data.fullName,
            phone: data.phone,
            country: '',
            googleLink,
            iCalLink,
            message: data.description,
          },
        },
      );

      setIsBooked(true);
    } catch {
      setError('Failed to book the appointment. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [executeRecaptcha, data, consultant, address]);

  if (isBooked) {
    return (
      <div className="mt-[145px] flex flex-col items-center gap-[18px] px-[18px] pt-10 pb-5">
        <CheckCircle2
          className="w-8 h-8 text-[#22af6a] animate-in zoom-in-75 fade-in duration-500 ease-out"
          strokeWidth={1.5}
        />
        <div className="flex flex-col gap-1.5 items-center text-center animate-in fade-in slide-in-from-bottom-2 duration-400 ease-out delay-100">
          <h2 className="font-bold text-[24px] leading-[32px] text-[#1c1c1c]">
            Your appointment is scheduled
          </h2>
          <p className="text-[14px] leading-[20px] text-[#484848] max-w-[428px]">
            A confirmation email has been sent to {data.email}. Please arrive 5 minutes early.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col">

      <div className="mt-[90px] px-9 pt-10 pb-5">
        <h2 className="font-bold text-[24px] leading-[32px] text-[#1c1c1c]">
          Review your appointment
        </h2>
        <p className="text-[14px] leading-[20px] text-[#484848] mt-1">
          Please review the details below before confirming
        </p>
      </div>


      {/* Details card */}
      <div className="mx-9 border border-[#ebebeb] rounded-[8px] overflow-hidden mb-6 animate-in fade-in slide-in-from-bottom-3 duration-400 ease-out delay-200">
        {/* Consultant row */}
        {consultant && (
          <div className="bg-white px-5 pt-4 pb-5 flex items-center">
            <div className="flex flex-1 gap-3.5 items-center">
              {consultant.profileUrl ? (
                <img
                  src={consultant.profileUrl}
                  alt={`${consultant.firstName} ${consultant.lastName}`}
                  className="w-12 h-12 rounded-full object-cover shrink-0"
                />
              ) : (
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold text-sm shrink-0"
                  style={{ backgroundColor: AVATAR_COLORS[consultantIndex % AVATAR_COLORS.length] }}
                >
                  {getInitials(consultant.firstName, consultant.lastName)}
                </div>
              )}
              <div className="flex flex-col gap-0.5">
                <p className="font-semibold text-[18px] leading-[26px] text-[#1c1c1c] whitespace-nowrap">
                  {consultant.firstName} {consultant.lastName}
                </p>
                {consultant.appointmentNote && (
                  <p className="text-[14px] leading-[20px] text-[#484848]">{consultant.appointmentNote}</p>
                )}
              </div>
            </div>
            {consultant.isPaid && consultant.paidAmount && (
              <div className="flex flex-col gap-0.5 items-end shrink-0">
                <p className="font-semibold text-[16px] leading-[24px] text-[#1c1c1c]">${consultant.paidAmount}</p>
                <p className="text-[12px] leading-[16px] text-[#1c1c1c]">Consultation Fee</p>
              </div>
            )}
          </div>
        )}

        {/* Appointment details */}
        <div className="bg-white border-t border-[#e3e3e3] px-5 pt-4 pb-5 flex flex-col gap-4">
          <p className="font-semibold text-[16px] leading-[24px] text-[#1c1c1c]">Appointment details</p>
          <div className="flex flex-wrap gap-y-6 gap-x-[18px]">
            <div className="flex gap-2 items-start w-[343px]">
              <Calendar className="w-4 h-4 text-[#484848] mt-0.5 shrink-0" strokeWidth={1.5} />
              <div className="flex flex-col gap-1">
                <p className="font-semibold text-[14px] leading-[20px] text-[#1c1c1c]">Date</p>
                <p className="text-[14px] leading-[20px] text-[#484848]">{formatDate(data.date)}</p>
              </div>
            </div>
            <div className="flex gap-2 items-start w-[343px]">
              <Clock className="w-4 h-4 text-[#484848] mt-0.5 shrink-0" strokeWidth={1.5} />
              <div className="flex flex-col gap-1">
                <p className="font-semibold text-[14px] leading-[20px] text-[#1c1c1c]">Time</p>
                <p className="text-[14px] leading-[20px] text-[#484848]">{data.time}, 30 minutes</p>
              </div>
            </div>
            <div className="flex gap-2 items-start w-[343px]">
              <Briefcase className="w-4 h-4 text-[#484848] mt-0.5 shrink-0" strokeWidth={1.5} />
              <div className="flex flex-col gap-1">
                <p className="font-semibold text-[14px] leading-[20px] text-[#1c1c1c]">Services</p>
                <p className="text-[14px] leading-[20px] text-[#484848]">{data.services.join(', ')}</p>
              </div>
            </div>
            <div className="flex gap-2 items-start w-[343px]">
              <MapPin className="w-4 h-4 text-[#484848] mt-0.5 shrink-0" strokeWidth={1.5} />
              <div className="flex flex-col gap-1">
                <p className="font-semibold text-[14px] leading-[20px] text-[#1c1c1c]">Address</p>
                <p className="text-[14px] leading-[20px] text-[#484848]">{address}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Personal details */}
        <div className="bg-white border-t border-[#e3e3e3] px-5 pt-4 pb-5 flex flex-col gap-4">
          <p className="font-semibold text-[16px] leading-[24px] text-[#1c1c1c]">Personal details</p>
          <div className="flex flex-wrap gap-y-6 gap-x-[18px]">
            <div className="flex gap-2 items-start w-[343px]">
              <User className="w-4 h-4 text-[#484848] mt-0.5 shrink-0" strokeWidth={1.5} />
              <div className="flex flex-col gap-1">
                <p className="font-semibold text-[14px] leading-[20px] text-[#1c1c1c]">Full name</p>
                <p className="text-[14px] leading-[20px] text-[#484848]">{data.fullName}</p>
              </div>
            </div>
            <div className="flex gap-2 items-start w-[343px]">
              <Mail className="w-4 h-4 text-[#484848] mt-0.5 shrink-0" strokeWidth={1.5} />
              <div className="flex flex-col gap-1">
                <p className="font-semibold text-[14px] leading-[20px] text-[#1c1c1c]">Email</p>
                <p className="text-[14px] leading-[20px] text-[#484848]">{data.email}</p>
              </div>
            </div>
            <div className="flex gap-2 items-start w-[343px]">
              <Phone className="w-4 h-4 text-[#484848] mt-0.5 shrink-0" strokeWidth={1.5} />
              <div className="flex flex-col gap-1">
                <p className="font-semibold text-[14px] leading-[20px] text-[#1c1c1c]">Phone</p>
                <p className="text-[14px] leading-[20px] text-[#484848]">+61 {data.phone}</p>
              </div>
            </div>
            {data.description && (
              <div className="flex gap-2 items-start w-full">
                <MessageSquare className="w-4 h-4 text-[#484848] mt-0.5 shrink-0" strokeWidth={1.5} />
                <div className="flex flex-col gap-1">
                  <p className="font-semibold text-[14px] leading-[20px] text-[#1c1c1c]">Message</p>
                  <p className="text-[14px] leading-[20px] text-[#484848] whitespace-pre-wrap">{data.description}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Error message — only shown before booking is confirmed */}
      {!isBooked && error && (
        <p className="mx-9 mb-2 text-[14px] text-red-600">{error}</p>
      )}

      {/* Buttons */}
      {isBooked ? (
        <StepButtons
          onPrimary={onGoHome ?? (() => { })}
          primaryLabel="Go Back to Homepage"
          centered
        />
      ) : (
        <StepButtons
          onBack={onBack}
          onPrimary={handleConfirm}
          primaryLabel="Confirm Booking"
          primaryLoading={isLoading}
          primaryDisabled={isLoading || !executeRecaptcha}
        />
      )}
    </div>
  );
};

export default StepSuccess;
