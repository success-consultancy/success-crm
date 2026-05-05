'use client';

import { Button } from '@/components/ui/button';
import { ClockInUser } from '@/mutations/clock-in/clock-login';

interface Props {
  user: ClockInUser;
  onClockIn: () => void;
  loading?: boolean;
}

const WelcomeScreen = ({ user, onClockIn, loading }: Props) => {
  return (
    <div className="w-full max-w-md flex flex-col items-center gap-6 text-center">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Welcome Back, {user.firstName}</h1>
        <p className="text-sm text-gray-500 mt-1">Start your shift by clocking in.</p>
      </div>

      <Button onClick={onClockIn} loading={loading} className="w-full max-w-xs">
        Clock In
      </Button>
    </div>
  );
};

export default WelcomeScreen;
