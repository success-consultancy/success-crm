'use client';

import { CheckCircle2, Calendar, Clock, Briefcase, MapPin, User, Mail, Phone } from 'lucide-react';
import StepButtons from './step-buttons';
import { CONSULTANTS } from './step-schedule';

const BRANCH_ADDRESSES: Record<string, string> = {
  Canberra: 'Ground Floor, Unit G06, 8 Gribble St, Gungahlin, ACT 2912',
  'CBD-Canberra (Chinese)': 'Level 1, 1 Moore St, Canberra City, ACT 2601',
  Sydney: 'Suite 302, 80 Clarence St, Sydney NSW 2000',
  Brisbane: 'Level 2, 144 Edward St, Brisbane QLD 4000',
  GoldCoast: '3/15 Bay St, Southport QLD 4215',
  Launceston: '187 Brisbane St, Launceston TAS 7250',
  Kathmandu: 'Putalisadak, Kathmandu 44600, Nepal',
};

interface AppointmentData {
  branch: string;
  services: string[];
  date: string;
  consultantId: string;
  time: string;
  fullName: string;
  email: string;
  phone: string;
}

interface Props {
  data: AppointmentData;
  onGoHome?: () => void;
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

const StepSuccess = ({ data, onGoHome }: Props) => {
  const consultant = CONSULTANTS.find((c) => c.id === data.consultantId);
  const address = BRANCH_ADDRESSES[data.branch] || data.branch;

  return (
    <div className="flex flex-col">
      {/* Success header */}
      <div className="mt-[90px] flex flex-col items-center gap-[18px] px-[18px] pt-10 pb-5">
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

      {/* Details card */}
      <div className="mx-9 border border-[#ebebeb] rounded-[8px] overflow-hidden mb-6 animate-in fade-in slide-in-from-bottom-3 duration-400 ease-out delay-200">
        {/* Consultant row */}
        {consultant && (
          <div className="bg-white px-5 pt-4 pb-5 flex items-center">
            <div className="flex flex-1 gap-3.5 items-center">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold text-sm shrink-0"
                style={{ backgroundColor: consultant.color }}
              >
                {consultant.initials}
              </div>
              <div className="flex flex-col gap-0.5">
                <p className="font-semibold text-[18px] leading-[26px] text-[#1c1c1c] whitespace-nowrap">
                  {consultant.name}
                </p>
                <p className="text-[14px] leading-[20px] text-[#484848]">{consultant.role}</p>
              </div>
            </div>
            <div className="flex flex-col gap-0.5 items-end shrink-0">
              <p className="font-semibold text-[16px] leading-[24px] text-[#1c1c1c]">{consultant.fee}</p>
              <p className="text-[12px] leading-[16px] text-[#1c1c1c]">Consultation Fee</p>
            </div>
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
          </div>
        </div>
      </div>

      {/* Buttons */}
      <StepButtons
        onPrimary={onGoHome ?? (() => { })}
        primaryLabel="Go Back to Homepage"
        onSecondary={() => { }}
        secondaryLabel="Download PDF"
        centered
      />
    </div>
  );
};

export default StepSuccess;
