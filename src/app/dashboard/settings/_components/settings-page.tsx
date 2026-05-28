'use client';

import { useState, useEffect } from 'react';
import Container from '@/components/atoms/container';
import Portal from '@/components/atoms/portal';
import { PortalIds } from '@/config/portal';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { useGetSetting, ISetting } from '@/query/get-setting';
import { useUpdateSetting } from '@/mutations/setting/update-setting';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

type ExtraType = 'number' | 'date';

interface SettingItem {
  label: string;
  name: keyof ISetting;
  subLabel?: (s: ISetting) => string;
  extra?: { type: ExtraType; name: keyof ISetting };
}

const dynamicLabel = (realValue: string | number | null | undefined, defaultValue: number): string => {
  if (realValue === null || realValue === undefined || realValue === '') {
    if (defaultValue === 0) return 'On same day';
    return `Before ${defaultValue} days`;
  }
  if (Number(realValue) === 0) return 'On same day';
  return `Before ${realValue} days`;
};

const dynamicLabelForDate = (realValue: string | null | undefined, defaultLabel: string): string => {
  if (!realValue) return `Every year on ${defaultLabel}`;
  try {
    const d = new Date(realValue);
    if (Number.isNaN(d.getTime())) return `Every year on ${defaultLabel}`;
    return `Every year on ${format(d, 'MMM dd')}`;
  } catch {
    return `Every year on ${defaultLabel}`;
  }
};

const SMS_ITEMS: SettingItem[] = [
  {
    label: 'Tax notice',
    name: 'smsTaxNotice',
    subLabel: (s) => dynamicLabelForDate(s.smsTaxNoticeNotificationDay, 'June 15'),
    extra: { type: 'date', name: 'smsTaxNoticeNotificationDay' },
  },
  {
    label: 'Birthday',
    name: 'smsBirthday',
    subLabel: () => 'On birth date',
  },
  {
    label: 'Student fee due',
    name: 'smsFeeDue',
    subLabel: (s) => dynamicLabel(s.smsFeeDueNotificationDay, 21),
    extra: { type: 'number', name: 'smsFeeDueNotificationDay' },
  },
  {
    label: 'Visa expiry',
    name: 'smsVisaExpiry',
    subLabel: (s) => dynamicLabel(s.smsVisaExpiryNotificationDay, 60),
    extra: { type: 'number', name: 'smsVisaExpiryNotificationDay' },
  },
];

const EMAIL_ITEMS: SettingItem[] = [
  {
    label: 'Tax notice',
    name: 'emailTaxNotice',
    subLabel: (s) => dynamicLabelForDate(s.emailTaxNoticeNotificationDay, 'June 15'),
    extra: { type: 'date', name: 'emailTaxNoticeNotificationDay' },
  },
  {
    label: 'Birthday',
    name: 'emailBirthday',
    subLabel: () => 'On birth date',
  },
  {
    label: 'Student fee due',
    name: 'emailFeeDue',
    subLabel: (s) => dynamicLabel(s.emailFeeDueNotificationDay, 21),
    extra: { type: 'number', name: 'emailFeeDueNotificationDay' },
  },
  {
    label: 'Visa expiry',
    name: 'emailVisaExpiry',
    subLabel: (s) => dynamicLabel(s.emailVisaExpiryNotificationDay, 60),
    extra: { type: 'number', name: 'emailVisaExpiryNotificationDay' },
  },
  {
    label: 'Visa request due',
    name: 'emailVisaRequestedDue',
    subLabel: (s) => dynamicLabel(s.emailVisaRequestedDueNotificationDay, 3),
    extra: { type: 'number', name: 'emailVisaRequestedDueNotificationDay' },
  },
  {
    label: 'Skill assessment request due',
    name: 'emailSkillRequestedDue',
    subLabel: (s) => dynamicLabel(s.emailSkillRequestedDueNotificationDay, 1),
    extra: { type: 'number', name: 'emailSkillRequestedDueNotificationDay' },
  },
  {
    label: 'Lead follow up',
    name: 'emailLeadFollowUp',
    subLabel: (s) => dynamicLabel(s.emailLeadFollowUpNotificationDay, 0),
    extra: { type: 'number', name: 'emailLeadFollowUpNotificationDay' },
  },
  {
    label: 'Student follow up',
    name: 'emailStudentFollowUp',
    subLabel: (s) => dynamicLabel(s.emailStudentFollowUpNotificationDay, 0),
    extra: { type: 'number', name: 'emailStudentFollowUpNotificationDay' },
  },
  {
    label: 'Student fiscal report',
    name: 'emailStudentFiscalReport',
    subLabel: () => 'Monthly target vs actual student enrollment report',
  },
];

const Toggle = ({ checked, onChange, disabled }: { checked: boolean; onChange: (v: boolean) => void; disabled?: boolean }) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    disabled={disabled}
    onClick={() => onChange(!checked)}
    className={cn(
      'relative inline-flex h-5 w-9 flex-shrink-0 items-center rounded-full transition-colors',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-primary',
      checked ? 'bg-primary' : 'bg-gray-300',
      disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
    )}
  >
    <span
      className={cn(
        'inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow',
        checked ? 'translate-x-[18px]' : 'translate-x-0.5',
      )}
    />
  </button>
);

const SettingsPage = () => {
  const { data: setting, isLoading } = useGetSetting();
  const { mutate: updateSetting } = useUpdateSetting();
  const [local, setLocal] = useState<ISetting | null>(null);

  useEffect(() => {
    if (setting) setLocal(setting);
  }, [setting]);

  const updateField = <K extends keyof ISetting>(name: K, value: ISetting[K]) => {
    if (!local) return;
    const next = { ...local, [name]: value };
    setLocal(next);
    updateSetting({ id: local.id, [name]: value } as any);
  };

  const renderItem = (item: SettingItem, accent: 'sms' | 'email') => {
    if (!local) return null;
    const checked = Boolean(local[item.name]);
    const subLabel = item.subLabel?.(local) ?? '';
    const accentBar = accent === 'sms' ? 'bg-amber-400' : 'bg-blue-400';

    return (
      <div
        key={item.name as string}
        className={cn(
          'flex flex-col gap-3 rounded-lg border bg-white p-4 transition-shadow',
          checked ? 'border-primary/40 shadow-sm' : 'border-neutral-border-light',
        )}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <span className={cn('h-9 w-1 rounded-full', accentBar)} />
            <div>
              <p className="text-sm font-semibold text-neutral-black">{item.label}</p>
              {subLabel && <p className="text-xs text-neutral-dark-grey">{subLabel}</p>}
            </div>
          </div>
          <Toggle checked={checked} onChange={(v) => updateField(item.name, v as any)} />
        </div>

        {item.extra && checked && (
          <div className="flex items-center gap-2 pl-4 border-t border-neutral-border-light pt-3">
            <label className="text-xs text-neutral-dark-grey min-w-fit">
              {item.extra.type === 'number' ? 'Notify before (days)' : 'Notify on'}
            </label>
            {item.extra.type === 'number' ? (
              <Input
                type="number"
                min={0}
                defaultValue={(local[item.extra.name] ?? '') as string}
                onBlur={(e) => {
                  const v = e.target.value;
                  if (v === '') return;
                  updateField(item.extra!.name, v as any);
                }}
                className="h-8 w-24 text-sm"
              />
            ) : (
              <Input
                type="date"
                defaultValue={(local[item.extra.name] ?? '') as string}
                onChange={(e) => {
                  const v = e.target.value;
                  if (!v) return;
                  updateField(item.extra!.name, v as any);
                }}
                className="h-8 w-40 text-sm"
              />
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <Container className="flex flex-col h-full overflow-hidden">
      <Portal rootId={PortalIds.DashboardHeader}>
        <h3 className="text-h5 text-content-heading font-bold">Settings</h3>
      </Portal>

      <div className="flex flex-col gap-5 overflow-auto custom-scrollbar pb-6">
        <section className="bg-white rounded-xl border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-base font-semibold text-neutral-black">SMS notifications</h4>
              <p className="text-xs text-neutral-dark-grey mt-0.5">
                Configure when SMS reminders are sent to clients and staff.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {isLoading || !local
              ? Array(4)
                  .fill(null)
                  .map((_, i) => <Skeleton key={i} className="h-24 w-full rounded-lg" />)
              : SMS_ITEMS.map((item) => renderItem(item, 'sms'))}
          </div>
        </section>

        <section className="bg-white rounded-xl border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-base font-semibold text-neutral-black">Email notifications</h4>
              <p className="text-xs text-neutral-dark-grey mt-0.5">
                Configure when email reminders are sent to clients and staff.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {isLoading || !local
              ? Array(8)
                  .fill(null)
                  .map((_, i) => <Skeleton key={i} className="h-24 w-full rounded-lg" />)
              : EMAIL_ITEMS.map((item) => renderItem(item, 'email'))}
          </div>
        </section>
      </div>
    </Container>
  );
};

export default SettingsPage;
