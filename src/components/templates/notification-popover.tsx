'use client';

import { ReactNode, useMemo, useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import HeaderIconButton from './header-icon-button';
import EmptyNotificationIcon from '@/assets/icons/empty-notification-icon';
import { EmptyState } from '@/components/common/empty-state';
import { formatRelativeTime } from '@/utils/elapsed';
import { getAppointColorBasedOnUserName } from '@/utils/color';
import { cn } from '@/lib/utils';

export interface NotificationItem {
  key: string;
  /** Bold lead-in — the person the notification is about. */
  actorName: string;
  actorAvatarUrl?: string | null;
  /** Sentence following the name, e.g. "requested 3 days of sick leave." */
  action: string;
  /** ISO timestamp driving both the "4h ago" label and the date grouping. */
  timestamp: string;
  onClick?: () => void;
}

interface Props {
  icon: ReactNode;
  ariaLabel: string;
  items: NotificationItem[];
  emptyTitle: string;
  emptyMessage: string;
  /** Copy shown when everything has been read but the All tab has items. */
  emptyUnreadTitle?: string;
  emptyUnreadMessage?: string;
  readKeys: string[];
  onOpen?: () => void;
  onItemRead?: (key: string) => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

type Tab = 'all' | 'unread';

const DAY_MS = 86_400_000;

const initialsOf = (name: string) =>
  name
    .split(' ')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase())
    .join('')
    .slice(0, 2) || '?';

/** Today / Last 7 days / Older, matching the design's section headings. */
const bucketOf = (timestamp: string) => {
  const then = new Date(timestamp).getTime();
  if (Number.isNaN(then)) return 'Older';

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  if (then >= startOfToday.getTime()) return 'Today';
  if (then >= startOfToday.getTime() - 7 * DAY_MS) return 'Last 7 days';
  return 'Older';
};

const BUCKET_ORDER = ['Today', 'Last 7 days', 'Older'] as const;

/**
 * The header notification centre. One feed, newest first, split into date
 * buckets with an All/Unread filter.
 *
 * Read state is client-side only — see `notification-read-store`.
 */
const NotificationPopover = ({
  icon,
  ariaLabel,
  items,
  emptyTitle,
  emptyMessage,
  emptyUnreadTitle = 'No unread notifications',
  emptyUnreadMessage = 'Stay tuned! Any new updates will appear here',
  readKeys,
  onOpen,
  onItemRead,
  open,
  onOpenChange,
}: Props) => {
  const [tab, setTab] = useState<Tab>('all');

  const readSet = useMemo(() => new Set(readKeys), [readKeys]);
  const unreadCount = useMemo(() => items.filter((item) => !readSet.has(item.key)).length, [items, readSet]);

  const visible = useMemo(() => {
    const filtered = tab === 'unread' ? items.filter((item) => !readSet.has(item.key)) : items;
    return [...filtered].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [items, tab, readSet]);

  const buckets = useMemo(
    () =>
      BUCKET_ORDER.map((label) => ({
        label,
        items: visible.filter((item) => bucketOf(item.timestamp) === label),
      })).filter((bucket) => bucket.items.length > 0),
    [visible],
  );

  const handleOpenChange = (next: boolean) => {
    if (next) onOpen?.();
    onOpenChange?.(next);
  };

  const isUnreadTabEmpty = tab === 'unread' && items.length > 0;

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <HeaderIconButton
          count={unreadCount}
          aria-label={unreadCount > 0 ? `${ariaLabel} (${unreadCount})` : ariaLabel}
        >
          {icon}
        </HeaderIconButton>
      </PopoverTrigger>

      {/* 460px matches the Figma notification frame; clamped so it can't overflow narrow viewports. */}
      <PopoverContent align="end" className="w-[min(460px,calc(100vw-2rem))] p-0">
        {/* Tabs */}
        <div role="tablist" className="flex h-12 items-end gap-1 px-4 border-b border-neutral-border-light">
          {/* Badge counts unread, not total — red is an attention colour, so it
              must clear once everything has been read. */}
          <TabButton active={tab === 'all'} onClick={() => setTab('all')} count={unreadCount}>
            All
          </TabButton>
          <TabButton active={tab === 'unread'} onClick={() => setTab('unread')}>
            Unread
          </TabButton>
        </div>

        {buckets.length === 0 ? (
          <EmptyState
            size="sm"
            icon={<EmptyNotificationIcon />}
            title={isUnreadTabEmpty ? emptyUnreadTitle : emptyTitle}
            description={isUnreadTabEmpty ? emptyUnreadMessage : emptyMessage}
          />
        ) : (
          <div className="max-h-[414px] overflow-y-auto custom-scrollbar">
            {buckets.map((bucket) => (
              <section key={bucket.label}>
                <h5 className="px-4 pt-4 pb-1 text-c1 text-neutral-light-grey">{bucket.label}</h5>
                <ul>
                  {bucket.items.map((item) => (
                    <li key={item.key}>
                      <Row item={item} isRead={readSet.has(item.key)} onItemRead={onItemRead} />
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};

const TabButton = ({
  active,
  count,
  onClick,
  children,
}: {
  active: boolean;
  count?: number;
  onClick: () => void;
  children: ReactNode;
}) => (
  <button
    type="button"
    role="tab"
    aria-selected={active}
    onClick={onClick}
    className={cn(
      'relative flex h-11 items-center gap-1 rounded-t-lg px-2.5 cursor-pointer transition-colors duration-150',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary/40',
      active ? 'text-b14-600 text-neutral-black' : 'text-b14-500 text-neutral-dark-grey hover:bg-accent-50',
    )}
  >
    <span className="px-1">{children}</span>
    {typeof count === 'number' && count > 0 && (
      <span className="rounded-full bg-primary-red px-1.5 py-0.5 text-[10px] font-semibold leading-none text-white">
        {count > 99 ? '99+' : count}
      </span>
    )}
    {active && <span className="absolute inset-x-0 bottom-0 h-0.5 rounded-3xl bg-primary-blue" />}
  </button>
);

const Row = ({
  item,
  isRead,
  onItemRead,
}: {
  item: NotificationItem;
  isRead: boolean;
  onItemRead?: (key: string) => void;
}) => {
  const fallbackColor = getAppointColorBasedOnUserName({ firstName: item.actorName }, 'style') as {
    backgroundColor: string;
  };

  return (
    <button
      type="button"
      onClick={() => {
        onItemRead?.(item.key);
        item.onClick?.();
      }}
      disabled={!item.onClick && !onItemRead}
      className={cn(
        'flex w-full items-start gap-3 px-4 py-3 text-left transition-colors duration-150',
        'focus-visible:outline-none focus-visible:bg-accent-50 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary/40',
        item.onClick || onItemRead
          ? 'cursor-pointer hover:bg-accent-50 active:bg-accent-100'
          : 'cursor-default disabled:opacity-100',
      )}
    >
      <Avatar className="h-10 w-10 shrink-0">
        <AvatarImage src={item.actorAvatarUrl ?? ''} alt="" />
        <AvatarFallback className="text-b14-600 text-white" style={fallbackColor}>
          {initialsOf(item.actorName)}
        </AvatarFallback>
      </Avatar>

      <p className="min-w-0 flex-1 text-b14 text-neutral-dark-grey">
        <span className="text-b14-600 text-neutral-black">{item.actorName}</span> {item.action}
      </p>

      <span className="shrink-0 whitespace-nowrap pt-0.5 text-c1 text-neutral-light-grey">
        {formatRelativeTime(item.timestamp)}
      </span>

      {!isRead && <span aria-label="Unread" className="mt-2 h-2 w-2 shrink-0 rounded-full bg-primary-blue" />}
    </button>
  );
};

export default NotificationPopover;
