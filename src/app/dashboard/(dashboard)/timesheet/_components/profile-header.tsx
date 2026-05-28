'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { MeUser } from '@/query/get-me';
import { ClockRecord } from '@/query/get-clock-records';

interface Props {
  user: MeUser | undefined;
  todayRecord?: ClockRecord | null;
  onRequestLeave?: () => void;
  onClockAction?: () => void;
}

const formatTime = (iso: string | null | undefined) => {
  if (!iso) return null;
  return new Date(iso).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });
};

const ProfileHeader = ({ user, todayRecord, onRequestLeave, onClockAction }: Props) => {
  if (!user) return null;
  const fullName = `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim();
  const initials = fullName
    .split(' ')
    .map((s) => s.charAt(0).toUpperCase())
    .join('')
    .slice(0, 2);

  const onBreak = !!todayRecord?.breakStartTime && !todayRecord?.breakEndTime;
  const clockedIn = !!todayRecord?.clockInTime && !todayRecord?.clockOutTime;
  const clockedOutTime = formatTime(todayRecord?.clockOutTime);
  const breakLabel = onBreak ? 'End break' : clockedIn ? 'Start break' : 'Not clocked in';

  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-neutral-border-light bg-white-100 px-6 py-5">
      <div className="flex items-center gap-4">
        <Avatar className="w-14 h-14">
          <AvatarImage src={user.profileUrl ?? ''} alt={fullName} />
          <AvatarFallback className="bg-pink-100 text-pink-700 text-h5 font-bold">{initials || 'U'}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col gap-0.5">
          <h2 className="text-h4 font-bold text-neutral-black">{fullName || 'User'}</h2>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onClockAction}
          disabled={!clockedIn}
          className="h-9 px-4 text-b14-600 text-neutral-dark-grey border-neutral-border"
        >
          {breakLabel}
        </Button>
        <div className="flex items-center gap-1.5 rounded-md border border-neutral-border bg-white-100 px-3 h-9">
          <span className="text-b14-600 text-neutral-dark-grey">Clock out</span>
          <span className="text-b14-500 text-neutral-dark-grey">{clockedOutTime ?? '—'}</span>
        </div>
        <Button size="sm" onClick={onRequestLeave} className="h-9 px-4 text-b14-600 text-white">
          Leave request
        </Button>
      </div>
    </div>
  );
};

export default ProfileHeader;
