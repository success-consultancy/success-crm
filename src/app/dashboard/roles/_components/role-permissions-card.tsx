'use client';

import { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import Button from '@/components/atoms/button';
import { RolePermissions, RoleCrudPermissions, ServiceKey, CrudActions } from '@/query/get-roles';
import { useUpdateRolePermissions } from '@/mutations/role/update-role-permissions';

const SERVICES: { key: ServiceKey; label: string }[] = [
  { key: 'leads', label: 'Leads' },
  { key: 'education', label: 'Education service' },
  { key: 'visa', label: 'Visa service' },
  { key: 'skill', label: 'Skill assessment service' },
  { key: 'tribunalReview', label: 'Tribunal review' },
  { key: 'insurance', label: 'Insurance service' },
  { key: 'agreement', label: 'Agency agreement' },
  { key: 'appointment', label: 'Appointment calendar' },
  { key: 'fiscalReport', label: 'Fiscal report' },
  { key: 'announcement', label: 'News and updates' },
  { key: 'users', label: 'Users' },
  { key: 'university', label: 'University' },
  { key: 'course', label: 'Course' },
  { key: 'source', label: 'Source' },
  { key: 'settings', label: 'Settings' },
];

const ACTIONS: (keyof CrudActions)[] = ['read', 'create', 'update', 'delete'];

const emptyActions = (): CrudActions => ({ create: false, read: false, update: false, delete: false });

interface Props {
  roles: RolePermissions[];
  readonly?: boolean;
}

export default function RolePermissionsCard({ roles, readonly = false }: Props) {
  const [activeRoleId, setActiveRoleId] = useState(roles[0]?.id || 1);
  const activeRole = roles.find((r) => r.id === activeRoleId)!;

  const [permissions, setPermissions] = useState<RoleCrudPermissions>(() => {
    const base = {} as RoleCrudPermissions;
    SERVICES.forEach(({ key }) => {
      base[key] = activeRole.permissions?.[key] ?? emptyActions();
    });
    return base;
  });

  const [isDirty, setIsDirty] = useState(false);
  const { mutate: updatePermissions, isPending } = useUpdateRolePermissions();

  // Update permissions when role tab changes
  const handleRoleChange = (roleId: number) => {
    if (isDirty) {
      if (!confirm('Unsaved changes. Switch anyway?')) return;
      setIsDirty(false);
    }
    setActiveRoleId(roleId);
    const newRole = roles.find((r) => r.id === roleId)!;
    const base = {} as RoleCrudPermissions;
    SERVICES.forEach(({ key }) => {
      base[key] = newRole.permissions?.[key] ?? emptyActions();
    });
    setPermissions(base);
  };

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
      SERVICES.forEach(({ key }) => {
        next[key] = { ...next[key], [action]: value };
      });
      return next;
    });
    setIsDirty(true);
  };

  const toggleEntireRole = (value: boolean) => {
    const next = {} as RoleCrudPermissions;
    SERVICES.forEach(({ key }) => {
      next[key] = { create: value, read: value, update: value, delete: value };
    });
    setPermissions(next);
    setIsDirty(true);
  };

  const handleSave = () => {
    updatePermissions({ id: activeRole.id, permissions }, { onSuccess: () => setIsDirty(false) });
  };

  const handleReset = () => {
    const base = {} as RoleCrudPermissions;
    SERVICES.forEach(({ key }) => {
      base[key] = activeRole.permissions?.[key] ?? emptyActions();
    });
    setPermissions(base);
    setIsDirty(false);
  };

  const isManaged = (service: ServiceKey) =>
    ACTIONS.every((a) => permissions[service][a.toLowerCase() as keyof CrudActions]);
  const isColumnAll = (action: keyof CrudActions) => SERVICES.every(({ key }) => permissions[key][action]);
  const isAllManaged = SERVICES.every(({ key }) => isManaged(key));
  const grantedCount = SERVICES.reduce(
    (sum, { key }) => sum + ACTIONS.filter((a) => permissions[key][a.toLowerCase() as keyof CrudActions]).length,
    0,
  );
  const totalCount = SERVICES.length * ACTIONS.length;

  const roleLabel: Record<number, string> = {
    1: 'Super admin',
    2: 'Manager',
    3: 'General user',
    4: 'Accounting',
    5: 'Lead Management',
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      {/* Tabs */}
      <div className="flex border-b border-gray-200 bg-gray-50">
        {roles.map((role) => (
          <button
            key={role.id}
            onClick={() => handleRoleChange(role.id)}
            className={`px-5 py-3 text-sm font-medium transition-colors ${
              activeRoleId === role.id
                ? 'border-b-2 border-blue-600 text-blue-600 bg-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {roleLabel[role.id]}
          </button>
        ))}
      </div>

      {/* Header with Save/Cancel */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white">
        <span className="text-xs text-gray-500">
          {grantedCount} / {totalCount} permissions
        </span>
        {!readonly && isDirty && (
          <div className="flex items-center gap-2">
            <button type="button" onClick={handleReset} className="text-xs text-gray-400 hover:text-gray-600 underline">
              Reset
            </button>
            <Button onClick={handleSave} disabled={isPending} className="h-8 text-xs px-3">
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
              <th className="text-left px-6 py-3 font-medium text-gray-700 w-56">Permission</th>
              <th className="px-4 py-3 text-center font-medium text-gray-700 w-20">
                <div className="flex flex-col items-center gap-1.5">
                  <span className="text-xs">Manage</span>
                  <Checkbox
                    checked={isAllManaged}
                    onCheckedChange={(v) => !readonly && toggleEntireRole(!!v)}
                    disabled={readonly}
                  />
                </div>
              </th>
              {ACTIONS.map((action) => (
                <th key={action} className="px-4 py-3 text-center font-medium text-gray-700 w-20">
                  <div className="flex flex-col items-center gap-1.5">
                    <span className="text-xs">{action}</span>
                    <Checkbox
                      checked={isColumnAll(action.toLowerCase() as keyof CrudActions)}
                      onCheckedChange={(v) => !readonly && toggleColumn(action.toLowerCase() as keyof CrudActions, !!v)}
                      disabled={readonly}
                    />
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {SERVICES.map(({ key, label }) => (
              <tr key={key} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-3 font-medium text-gray-700 text-sm">{label}</td>
                <td className="px-4 py-3 text-center">
                  <Checkbox
                    checked={isManaged(key)}
                    onCheckedChange={(v) => !readonly && toggleAll(key, !!v)}
                    disabled={readonly}
                  />
                </td>
                {ACTIONS.map((action) => {
                  const actionKey = action.toLowerCase() as keyof CrudActions;
                  return (
                    <td key={action} className="px-4 py-3 text-center">
                      <Checkbox
                        checked={permissions[key][actionKey]}
                        onCheckedChange={(v) => !readonly && toggle(key, actionKey, !!v)}
                        disabled={readonly}
                      />
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
