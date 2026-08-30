'use client';

import { useMemo, useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import Button from '@/components/atoms/button';
import { RolePermissions, RoleCrudPermissions, ServiceKey, CrudActions } from '@/query/get-roles';
import { useUpdateRolePermissions } from '@/mutations/role/update-role-permissions';
import { LOADING_LABEL } from '@/constants/messages';

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
  { key: 'course', label: 'Courses' },
  { key: 'occupation', label: 'Occupation' },
  { key: 'visaList', label: 'Visa list' },
  { key: 'source', label: 'Source' },
  { key: 'settings', label: 'Settings' },
];

const ACTIONS: { key: keyof CrudActions; label: string }[] = [
  { key: 'read', label: 'View' },
  { key: 'create', label: 'Create' },
  { key: 'update', label: 'Edit' },
  { key: 'delete', label: 'Delete' },
];

const ROLE_LABEL: Record<number, string> = {
  1: 'Super admin',
  2: 'Manager',
  3: 'General user',
  4: 'Accounting',
  5: 'Lead Management',
};

const SUPER_ADMIN_ID = 1;
const ALL_ACTIONS: CrudActions = { create: true, read: true, update: true, delete: true };

const emptyActions = (): CrudActions => ({ create: false, read: false, update: false, delete: false });

// Build the permissions map for a role, filling in empty defaults for any missing service.
const buildPermissions = (role: RolePermissions): RoleCrudPermissions => {
  const base = {} as RoleCrudPermissions;
  SERVICES.forEach(({ key }) => {
    // Super admin always has full access — lock it regardless of DB value.
    base[key] = role.id === SUPER_ADMIN_ID ? ALL_ACTIONS : (role.permissions?.[key] ?? emptyActions());
  });
  return base;
};

interface Props {
  roles: RolePermissions[];
  readonly?: boolean;
}

export default function RolePermissionsCard({ roles, readonly = false }: Props) {
  const [activeRoleId, setActiveRoleId] = useState(roles[0]?.id || 1);
  const activeRole = roles.find((r) => r.id === activeRoleId)!;
  // Super admin permissions are always locked — no editing regardless of viewer role.
  const isActiveRoleLocked = activeRole?.id === SUPER_ADMIN_ID;

  const [permissions, setPermissions] = useState<RoleCrudPermissions>(() => buildPermissions(activeRole));

  // Derive dirtiness by comparing against the role's saved permissions, so reverting
  // a change back to its original value clears the Reset/Save buttons (CRM-159).
  const isDirty = useMemo(
    () =>
      !isActiveRoleLocked &&
      SERVICES.some(({ key }) =>
        ACTIONS.some(
          ({ key: action }) =>
            (permissions[key]?.[action] ?? false) !== (activeRole.permissions?.[key]?.[action] ?? false),
        ),
      ),
    [permissions, activeRole, isActiveRoleLocked],
  );

  const { mutate: updatePermissions, isPending } = useUpdateRolePermissions();

  const handleRoleChange = (roleId: number) => {
    if (isDirty && !confirm('Unsaved changes. Switch anyway?')) return;
    setActiveRoleId(roleId);
    const newRole = roles.find((r) => r.id === roleId)!;
    setPermissions(buildPermissions(newRole));
  };

  const toggle = (service: ServiceKey, action: keyof CrudActions, value: boolean) => {
    setPermissions((prev) => ({
      ...prev,
      [service]: { ...prev[service], [action]: value },
    }));
  };

  const handleSave = () => {
    updatePermissions({ id: activeRole.id, permissions });
  };

  const handleReset = () => {
    setPermissions(buildPermissions(activeRole));
  };

  return (
    <div className="bg-white rounded-xl border border-[#EBEBEB]">
      {/* Role tabs */}
      <div className="flex border-b border-[#EBEBEB] gap-1 px-2">
        {roles.map((role) => (
          <button
            key={role.id}
            onClick={() => handleRoleChange(role.id)}
            className={`relative flex items-center px-3 h-11 text-sm transition-colors ${
              activeRoleId === role.id
                ? 'font-semibold text-[#1C1C1C]'
                : 'font-medium text-[#484848] hover:text-[#1C1C1C]'
            }`}
          >
            {ROLE_LABEL[role.id] ?? role.role}
            {activeRoleId === role.id && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#007ACC] rounded-full" />
            )}
          </button>
        ))}
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col gap-4">
        {/* Save / Reset — admin only, shown when dirty (hidden for super admin — always locked) */}
        {!readonly && !isActiveRoleLocked && isDirty && (
          <div className="flex items-center justify-end gap-2">
            <button type="button" onClick={handleReset} className="text-xs text-gray-400 hover:text-gray-600 underline">
              Reset
            </button>
            <Button
              onClick={handleSave}
              loading={isPending}
              loadingText={LOADING_LABEL.save}
              className="h-8 text-xs px-3"
            >
              Save
            </Button>
          </div>
        )}

        {/* Permissions table */}
        <div className="border border-[#EBEBEB] rounded-[10px] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr>
                  <th className="sticky left-0 z-10 bg-[#F9FAFB] text-left px-3 py-3.5 text-sm font-semibold text-[#484848] border-b border-[#EBEBEB] min-w-[220px]">
                    Permission
                  </th>
                  {ACTIONS.map(({ key, label }) => (
                    <th
                      key={key}
                      className="bg-[#F9FAFB] text-center px-3 py-3.5 text-sm font-semibold text-[#484848] border-b border-[#EBEBEB] w-[136px] min-w-[136px]"
                    >
                      {label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {SERVICES.map(({ key, label }, idx) => (
                  <tr key={key} className={idx < SERVICES.length - 1 ? 'border-b border-[#EBEBEB]' : ''}>
                    <td className="sticky left-0 bg-white px-3 py-3.5 text-sm text-[#1C1C1C]">{label}</td>
                    {ACTIONS.map(({ key: actionKey }) => (
                      <td key={actionKey} className="px-3 py-3.5 text-center">
                        <div className="flex items-center justify-center">
                          <Checkbox
                            checked={permissions[key]?.[actionKey] ?? false}
                            onCheckedChange={(v) => !readonly && !isActiveRoleLocked && toggle(key, actionKey, !!v)}
                            disabled={readonly || isActiveRoleLocked}
                          />
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
