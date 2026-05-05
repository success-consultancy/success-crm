import { custom_api } from '@/lib/api';
import { useMutation } from '@tanstack/react-query';
import { clockLogin, ClockInRecord } from './clock-login';

export type ClockActionType = 'in' | 'out' | 'break-start' | 'break-end';

const PATHS: Record<ClockActionType, string> = {
  in: '/clock/clockIn',
  out: '/clock/clockOut',
  'break-start': '/clock/breakStart',
  'break-end': '/clock/breakEnd',
};

interface ActionPayload {
  userId: number;
  action: ClockActionType;
}

interface ActionResult {
  clockIn: ClockInRecord;
  token: string;
}

// The clockLogin JWT (2 min expiry) embeds a snapshot of the user's clockIn row,
// and the action controllers read clockIn from the JWT — not from the DB. So before
// each action we must re-issue clockLogin by id to mint a fresh token with the
// current clockIn snapshot, otherwise breakStart/clockOut etc. read stale state.
const performAction = async ({ userId, action }: ActionPayload): Promise<ActionResult> => {
  const fresh = await clockLogin({ id: userId });
  // Body must be an empty object — body-parser rejects a literal `null` JSON body.
  const res = await custom_api.put(PATHS[action], {}, {
    headers: { Authorization: fresh.token },
  });
  return { clockIn: res.data, token: fresh.token };
};

export const useClockAction = () => {
  return useMutation({ mutationFn: performAction });
};
