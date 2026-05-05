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
    <div className="flex items-center justify-between gap-4 rounded-xl border border-gray-100 bg-white px-5 py-4">
      <div className="flex items-center gap-3">
        <Avatar className="w-12 h-12">
          <AvatarImage src={user.profileUrl ?? ''} alt={fullName} />
          <AvatarFallback className="bg-pink-100 text-pink-700 font-semibold">{initials || 'U'}</AvatarFallback>
        </Avatar>
        <div>
          <h2 className="text-base font-semibold text-gray-900">{fullName || 'User'}</h2>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={onClockAction} disabled={!clockedIn}>
          {breakLabel}
        </Button>
        <div className="flex items-center gap-1.5 rounded-md border border-gray-200 bg-white px-3 h-9 text-sm">
          <span className="text-gray-500">Clock out</span>
          <span className="font-medium text-gray-900">{clockedOutTime ?? '—'}</span>
        </div>
        <Button size="sm" onClick={onRequestLeave}>
          Leave request
        </Button>
      </div>
    </div>
  );
};

export default ProfileHeader;
