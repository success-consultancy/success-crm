'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Notification } from 'iconsax-reactjs';

import NotificationPopover, { NotificationItem } from './notification-popover';
import useAuthStore from '@/store/auth-store';
import useNotificationReadStore from '@/store/notification-read-store';
import { ROLES } from '@/constants/roles-constants';
import { useGetActiveCheckIns } from '@/query/get-active-checkins';
import { useGetAllLeaves } from '@/query/get-all-leaves';
import { useGetUsers } from '@/query/get-user';
import { useTicker } from '@/hooks/use-ticker';
import { formatLeaveDate } from '@/app/dashboard/(dashboard)/timesheet/_lib/leave-helpers';

/**
 * The header notification centre. There is no notifications table in the
 * backend, so the feed is assembled client-side from the activity the current
 * user is allowed to see:
 *
 * - Check-ins  — clients waiting at reception; all roles except accounting (4)
 * - Leave      — pending requests; super admin only, since that is the only
 *   role that can action one and `GET /leave` is not role-filtered server-side
 *
 * Each source is gated by its own role check, so a feed the user cannot see is
 * never fetched. Adding a source means appending to `items`.
 */
const NotificationBell = () => {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const profile = useAuthStore((s) => s.profile);
  const canSeeCheckIns = !!profile?.roleId && profile.roleId !== ROLES.ACCOUNTING;
  const canApproveLeave = profile?.roleId === ROLES.SUPER_ADMIN;

  const readKeys = useNotificationReadStore((s) => s.readKeys);
  const markRead = useNotificationReadStore((s) => s.markRead);

  const { data: checkInData } = useGetActiveCheckIns({ enabled: canSeeCheckIns });
  const { data: leaves = [] } = useGetAllLeaves({ enabled: canApproveLeave, poll: canApproveLeave });
  const { data: users = [] } = useGetUsers(canApproveLeave ? { includeInactive: true } : undefined);

  // Keeps the "4h ago" labels current while the panel is open.
  useTicker(60_000, open);

  const items: NotificationItem[] = useMemo(() => {
    const checkIns: NotificationItem[] = (checkInData?.rows ?? []).map((checkIn) => {
      const name = `${checkIn.lead?.firstName ?? ''} ${checkIn.lead?.lastName ?? ''}`.trim();
      return {
        key: `checkin-${checkIn.id}`,
        actorName: name || 'Unknown client',
        action: 'checked in and is waiting at reception.',
        timestamp: checkIn.timerStart,
        onClick: () => {
          setOpen(false);
          router.push('/dashboard/check-in');
        },
      };
    });

    const pendingLeave: NotificationItem[] = leaves
      .filter((leave) => leave.status === 'pending')
      .map((leave) => {
        const match = users.find((u) => u.id === leave.userId);
        const name = match ? `${match.firstName ?? ''} ${match.lastName ?? ''}`.trim() : '';
        return {
          key: `leave-${leave.id}`,
          actorName: name || 'Unknown user',
          actorAvatarUrl: (match as { profileUrl?: string | null } | undefined)?.profileUrl ?? null,
          action: `requested ${leave.type.toLowerCase()} leave from ${formatLeaveDate(leave.startDate)} to ${formatLeaveDate(leave.endDate)}.`,
          timestamp: leave.createdAt ?? new Date().toISOString(),
          onClick: () => {
            setOpen(false);
            router.push(`/dashboard/employees/${leave.userId}`);
          },
        };
      });

    return [...checkIns, ...pendingLeave];
  }, [checkInData, leaves, users, router]);

  return (
    <NotificationPopover
      open={open}
      onOpenChange={setOpen}
      icon={<Notification className="w-5 h-5" />}
      ariaLabel="Notifications"
      items={items}
      readKeys={readKeys}
      onItemRead={markRead}
      emptyTitle="No notifications yet"
      emptyMessage="Stay tuned! Any new updates will appear here"
    />
  );
};

export default NotificationBell;
