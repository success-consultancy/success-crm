'use client';

import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import ClockInFrame from './_components/clockin-frame';
import AdminPinScreen from './_components/admin-pin-screen';
import VerifyIdentityScreen from './_components/verify-identity-screen';
import CodeLoginScreen from './_components/code-login-screen';
import WelcomeScreen from './_components/welcome-screen';
import ActionsScreen, { ActionChoice } from './_components/actions-screen';
import StatusScreen from './_components/status-screen';
import ConfirmActionDialog from './_components/confirm-action-dialog';
import { ClockInRecord, ClockInUser, ClockLoginResponse } from '@/mutations/clock-in/clock-login';
import { ClockActionType, useClockAction } from '@/mutations/clock-in/clock-action';
import { extractErrorMessage } from '@/utils/clock-in-errors';

const ADMIN_PIN = process.env.NEXT_PUBLIC_CLOCKIN_ADMIN_PIN || '6789';
const ADMIN_AUTH_KEY = 'clockin_admin_auth';
const SUCCESS_DISMISS_MS = 1800;

type View =
  | 'verify-identity'
  | 'code-login'
  | 'welcome'
  | 'actions'
  | 'clocked-in'
  | 'break-started'
  | 'break-ended'
  | 'clocked-out';

type PendingAction = {
  action: ClockActionType;
  nextView: View;
  title: string;
  description: string;
  confirmLabel: string;
};

const PENDING_ACTION_COPY: Record<ClockActionType, Omit<PendingAction, 'action' | 'nextView'>> = {
  in: {
    title: 'Clock In?',
    description: 'This will start your shift and record the current time as your clock-in.',
    confirmLabel: 'Clock In',
  },
  'break-start': {
    title: 'Start Break?',
    description: 'Your timer will be paused until you end your break.',
    confirmLabel: 'Start Break',
  },
  'break-end': {
    title: 'End Break?',
    description: 'This will resume your shift and record the end of your break.',
    confirmLabel: 'End Break',
  },
  out: {
    title: 'Clock Out?',
    description: 'This will end your shift for today. You won’t be able to clock back in until tomorrow.',
    confirmLabel: 'Clock Out',
  },
};

const formatTime = (iso: string | null) => {
  if (!iso) return '';
  return new Date(iso).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });
};

const ClockInPage = () => {
  const [adminUnlocked, setAdminUnlocked] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [view, setView] = useState<View>('verify-identity');
  const [user, setUser] = useState<ClockInUser | null>(null);
  const [clockIn, setClockIn] = useState<ClockInRecord | null>(null);
  const [pendingAction, setPendingAction] = useState<PendingAction | null>(null);

  const { mutate: clockAction, isPending: actionPending } = useClockAction();

  // Restore admin unlock from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(ADMIN_AUTH_KEY);
      if (stored === ADMIN_PIN) setAdminUnlocked(true);
    }
    setHydrated(true);
  }, []);

  const handleAdminUnlock = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(ADMIN_AUTH_KEY, ADMIN_PIN);
    }
    setAdminUnlocked(true);
  };

  const resetSession = useCallback((target: View = 'verify-identity') => {
    setUser(null);
    setClockIn(null);
    setView(target);
  }, []);

  const handleLoginSuccess = (data: ClockLoginResponse) => {
    setUser(data.user);
    setClockIn(data.clockIn);

    // Decide next view based on clockIn state
    if (!data.clockIn) {
      setView('welcome');
      return;
    }
    if (data.clockIn.clockOutTime) {
      // Already clocked out for today — show status then return
      setView('clocked-out');
      return;
    }
    setView('actions');
  };

  // Auto-dismiss success states — every action returns the kiosk to the code-entry screen
  // so the next person must re-authenticate before doing anything.
  useEffect(() => {
    if (
      view !== 'clocked-in' &&
      view !== 'break-started' &&
      view !== 'break-ended' &&
      view !== 'clocked-out'
    ) {
      return;
    }
    const id = setTimeout(() => {
      resetSession('code-login');
    }, SUCCESS_DISMISS_MS);
    return () => clearTimeout(id);
  }, [view, resetSession]);

  const performAction = (action: ClockActionType, nextView: View) => {
    if (!user) return;
    clockAction(
      { userId: user.id, action },
      {
        onSuccess: (result) => {
          setClockIn(result.clockIn);
          setView(nextView);
          setPendingAction(null);
        },
        onError: (err) => {
          const message = extractErrorMessage(err, 'Could not complete that action. Please try again.');
          toast.error(message);
          setPendingAction(null);
          // 403 means the kiosk JWT was rejected — drop the session so the user re-logs in.
          if (axios.isAxiosError(err) && err.response?.status === 403) {
            resetSession();
          }
        },
      },
    );
  };

  const requestAction = (action: ClockActionType, nextView: View) => {
    setPendingAction({ action, nextView, ...PENDING_ACTION_COPY[action] });
  };

  const handleConfirmPending = () => {
    if (!pendingAction) return;
    performAction(pendingAction.action, pendingAction.nextView);
  };

  const handleCancelPending = () => {
    if (actionPending) return;
    setPendingAction(null);
  };

  const handleClockIn = () => requestAction('in', 'clocked-in');

  const handleActionsSubmit = (choice: ActionChoice, _note: string) => {
    // Backend currently ignores notes — accept the parameter for parity with the form.
    void _note;
    if (choice === 'break-start') requestAction('break-start', 'break-started');
    else if (choice === 'break-end') requestAction('break-end', 'break-ended');
    else if (choice === 'out') requestAction('out', 'clocked-out');
  };

  // Avoid SSR/CSR mismatch on first render — wait until localStorage is read
  if (!hydrated) return <ClockInFrame>{null}</ClockInFrame>;

  if (!adminUnlocked) {
    return (
      <ClockInFrame>
        <AdminPinScreen expectedPin={ADMIN_PIN} onUnlock={handleAdminUnlock} />
      </ClockInFrame>
    );
  }

  return (
    <ClockInFrame>
      {view === 'verify-identity' && (
        <VerifyIdentityScreen onCodeLogin={() => setView('code-login')} />
      )}

      {view === 'code-login' && (
        <CodeLoginScreen onSuccess={handleLoginSuccess} onBack={() => setView('verify-identity')} />
      )}

      {view === 'welcome' && user && (
        <WelcomeScreen user={user} onClockIn={handleClockIn} loading={actionPending} />
      )}

      {view === 'actions' && user && clockIn && (
        <ActionsScreen
          user={user}
          clockIn={clockIn}
          onSubmit={handleActionsSubmit}
          loading={actionPending}
        />
      )}

      {view === 'clocked-in' && clockIn?.clockInTime && (
        <StatusScreen
          title="Clocked In"
          message={
            <>
              You clocked in at <span className="font-medium text-gray-700">{formatTime(clockIn.clockInTime)}</span>.
            </>
          }
        />
      )}

      {view === 'break-started' && clockIn?.breakStartTime && (
        <StatusScreen
          title="Enjoy Your Break"
          message={
            <>
              Your break has been recorded at{' '}
              <span className="font-medium text-gray-700">{formatTime(clockIn.breakStartTime)}</span>.
            </>
          }
        />
      )}

      {view === 'break-ended' && clockIn?.breakEndTime && (
        <StatusScreen
          title="Break Ended"
          message={
            <>
              Your break ended at{' '}
              <span className="font-medium text-gray-700">{formatTime(clockIn.breakEndTime)}</span>.
            </>
          }
        />
      )}

      {view === 'clocked-out' && clockIn?.clockOutTime && (
        <StatusScreen
          title="Clocked Out"
          message={
            <>
              You clocked out at{' '}
              <span className="font-medium text-gray-700">{formatTime(clockIn.clockOutTime)}</span>.
            </>
          }
        />
      )}

      <ConfirmActionDialog
        open={!!pendingAction}
        title={pendingAction?.title ?? ''}
        description={pendingAction?.description ?? ''}
        confirmLabel={pendingAction?.confirmLabel ?? 'Confirm'}
        loading={actionPending}
        onConfirm={handleConfirmPending}
        onCancel={handleCancelPending}
      />
    </ClockInFrame>
  );
};

export default ClockInPage;
