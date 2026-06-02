'use client';

import { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import Button from '@/components/atoms/button';
import { RolePermissions, RoleCrudPermissions, ServiceKey, CrudActions } from '@/query/get-roles';
import { useUpdateRolePermissions } from '@/mutations/role/update-role-permissions';

const SERVICES: { key: ServiceKey; label: string }[] = [
  { key: 'leads',          label: 'Leads' },
  { key: 'education',      label: 'Education Service' },
  { key: 'visa',           label: 'Visa Service' },
  { key: 'skill',          label: 'Skill Assessment' },
  { key: 'tribunalReview', label: 'Tribunal Review' },
  { key: 'insurance',      label: 'Insurance' },
  { key: 'agreement',      label: 'Agency Agreement' },
  { key: 'appointment',    label: 'Appointment' },
  { key: 'fiscalReport',   label: 'Fiscal Report' },
  { key: 'announcement',   label: 'Announcements' },
  { key: 'users',          label: 'Users' },
  { key: 'university',     label: 'University' },
  { key: 'course',         label: 'Course' },
  { key: 'source',         label: 'Source' },
  { key: 'settings',       label: 'Settings' },
];

const ACTIONS: (keyof CrudActions)[] = ['create', 'read', 'update', 'delete'];

const ROLE_BADGE_COLORS: Record<number, string> = {
  1: 'bg-purple-100 text-purple-700',
  2: 'bg-blue-100 text-blue-700',
  3: 'bg-green-100 text-green-700',
  4: 'bg-amber-100 text-amber-700',
  5: 'bg-rose-100 text-rose-700',
};

interface Props {
  role: RolePermissions;
  readonly?: boolean;
}

const emptyActions = (): CrudActions => ({ create: false, read: false, update: false, delete: false });

export default function RolePermissionsCard({ role, readonly = false }: Props) {
  const [permissions, setPermissions] = useState<RoleCrudPermissions>(() => {
    const base = {} as RoleCrudPermissions;
    SERVICES.forEach(({ key }) => {
      base[key] = role.permissions?.[key] ?? emptyActions();
    });
    return base;
  });
  const [isDirty, setIsDirty] = useState(false);
  const { mutate: updatePermissions, isPending } = useUpdateRolePermissions();

  const toggle = (service: ServiceKey, action: keyof CrudActions, value: boolean) => {
    setPermissions((prev) => ({
      ...prev,
      [service]: { ...prev[service], [action]: value },
    }));
    setIsDirty(true);
  };

  const toggleAll = (service: ServiceKey, value: boolean) => {
    setPermissions((prev) => ({
      ...prev,
      [service]: { create: value, read: value, update: value, delete: value },
    }));
    setIsDirty(true);
  };

  const toggleColumn = (action: keyof CrudActions, value: boolean) => {
    setPermissions((prev) => {
      const next = { ...prev } as RoleCrudPermissions;
      SERVICES.forEach(({ key }) => { next[key] = { ...next[key], [action]: value }; });
      return next;
    });
    setIsDirty(true);
  };

  const toggleEntireRole = (value: boolean) => {
    const next = {} as RoleCrudPermissions;
    SERVICES.forEach(({ key }) => { next[key] = { create: value, read: value, update: value, delete: value }; });
    setPermissions(next);
    setIsDirty(true);
  };

  const handleSave = () => {
    updatePermissions({ id: role.id, permissions }, { onSuccess: () => setIsDirty(false) });
  };

  const handleReset = () => {
    const base = {} as RoleCrudPermissions;
    SERVICES.forEach(({ key }) => { base[key] = role.permissions?.[key] ?? emptyActions(); });
    setPermissions(base);
    setIsDirty(false);
  };

  // "Manage" = all 4 actions true for that row
  const isManaged = (service: ServiceKey) => ACTIONS.every((a) => permissions[service][a]);
  // Column header = all rows true for that action
  const isColumnAll = (action: keyof CrudActions) => SERVICES.every(({ key }) => permissions[key][action]);
  // Top-left "All" = everything true
  const isAllManaged = SERVICES.every(({ key }) => isManaged(key));

  const grantedCount = SERVICES.reduce(
    (sum, { key }) => sum + ACTIONS.filter((a) => permissions[key][a]).length,
    0
  );
  const totalCount = SERVICES.length * ACTIONS.length;

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-gray-50">
        <div className="flex items-center gap-3">
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${ROLE_BADGE_COLORS[role.id] ?? 'bg-gray-100 text-gray-600'}`}>
            {role.role}
          </span>
          <span className="text-xs text-gray-400">{grantedCount} / {totalCount} permissions</span>
        </div>
        {!readonly && isDirty && (
          <div className="flex items-center gap-2">
            <button type="button" onClick={handleReset} className="text-xs text-gray-400 hover:text-gray-600 underline">
              Reset
            </button>
            <Button onClick={handleSave} disabled={isPending} className="h-7 text-xs px-3">
              {isPending ? 'Saving…' : 'Save'}
            </Button>
          </div>
        )}
      </div>

      {/* Grid */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/50">
              <th className="text-left px-5 py-3 font-medium text-gray-500 w-44">Service</th>
              {/* Manage all column */}
              <th className="px-3 py-3 text-center font-medium text-gray-500 w-20">
                <div className="flex flex-col items-center gap-1.5">
                  <span>Manage</span>
                  <Checkbox
                    checked={isAllManaged}
                    onCheckedChange={(v) => !readonly && toggleEntireRole(!!v)}
                    disabled={readonly}
                  />
                </div>
              </th>
              {ACTIONS.map((action) => (
                <th key={action} className="px-3 py-3 text-center font-medium text-gray-500 w-20 capitalize">
                  <div className="flex flex-col items-center gap-1.5">
                    <span>{action}</span>
                    <Checkbox
                      checked={isColumnAll(action)}
                      onCheckedChange={(v) => !readonly && toggleColumn(action, !!v)}
                      disabled={readonly}
                    />
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {SERVICES.map(({ key, label }) => (
              <tr key={key} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-5 py-3 font-medium text-gray-800">{label}</td>
                {/* Manage (row master) */}
                <td className="px-3 py-3 text-center">
                  <Checkbox
                    checked={isManaged(key)}
                    onCheckedChange={(v) => !readonly && toggleAll(key, !!v)}
                    disabled={readonly}
                  />
                </td>
                {ACTIONS.map((action) => (
                  <td key={action} className="px-3 py-3 text-center">
                    <Checkbox
                      checked={permissions[key][action]}
                      onCheckedChange={(v) => !readonly && toggle(key, action, !!v)}
                      disabled={readonly}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
