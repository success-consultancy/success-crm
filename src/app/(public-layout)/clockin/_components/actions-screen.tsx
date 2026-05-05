'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ClockInUser, ClockInRecord } from '@/mutations/clock-in/clock-login';
import { cn } from '@/lib/utils';

type ActionChoice = 'break-start' | 'break-end' | 'out';

interface Props {
  user: ClockInUser;
  clockIn: ClockInRecord;
  onSubmit: (action: ActionChoice, note: string) => void;
  loading?: boolean;
}

const formatTime = (iso: string | null) => {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });
};

const breakDurationMinutes = (start: string) => {
  const diff = Date.now() - new Date(start).getTime();
  return Math.max(0, Math.round(diff / 60000));
};

const ActionsScreen = ({ user, clockIn, onSubmit, loading }: Props) => {
  const onBreak = !!clockIn.breakStartTime && !clockIn.breakEndTime;
  const breakOption: ActionChoice = onBreak ? 'break-end' : 'break-start';

  const [choice, setChoice] = useState<ActionChoice | null>(null);
  const [note, setNote] = useState('');

  const subtitle = onBreak
    ? `You've been on break for ${breakDurationMinutes(clockIn.breakStartTime as string)} min.`
    : `You're clocked in since ${formatTime(clockIn.clockInTime)}.`;

  const handleSubmit = () => {
    if (!choice) return;
    onSubmit(choice, note.trim());
  };

  return (
    <div className="w-full max-w-lg flex flex-col items-center gap-6">
      <div className="text-center">
        <h1 className="text-2xl font-semibold text-gray-900">Welcome Back, {user.firstName}</h1>
        <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
      </div>

      <div className="grid grid-cols-2 gap-3 w-full">
        <ChoiceCard
          selected={choice === breakOption}
          onClick={() => setChoice(breakOption)}
          title={onBreak ? 'End Break' : 'Start Break'}
          description={onBreak ? 'Resume working' : 'Pause your timer for a break'}
        />
        <ChoiceCard
          selected={choice === 'out'}
          onClick={() => setChoice('out')}
          title="Clock Out"
          description="End your shift for today"
        />
      </div>

      <div className="w-full">
        <label className="text-sm font-medium text-gray-700 block mb-1.5">
          Note <span className="text-gray-400 font-normal">(optional)</span>
        </label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={3}
          className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 resize-none"
        />
      </div>

      <Button onClick={handleSubmit} disabled={!choice || loading} loading={loading} className="w-full max-w-xs">
        Submit
      </Button>
    </div>
  );
};

const ChoiceCard = ({
  selected,
  onClick,
  title,
  description,
}: {
  selected: boolean;
  onClick: () => void;
  title: string;
  description: string;
}) => (
  <button
    type="button"
    onClick={onClick}
    className={cn(
      'flex flex-col items-start text-left gap-1 px-4 py-3 rounded-lg border transition-all cursor-pointer',
      selected
        ? 'border-blue-500 bg-blue-50/50 ring-2 ring-blue-100'
        : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50',
    )}
  >
    <span className="text-sm font-semibold text-gray-900">{title}</span>
    <span className="text-xs text-gray-500">{description}</span>
  </button>
);

export default ActionsScreen;
export type { ActionChoice };
