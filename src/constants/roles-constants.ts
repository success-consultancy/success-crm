const SUPER_ADMIN = 1;
const MANAGER = 2;
const GENERAL = 3;
const ACCOUNTING = 4;
const LEAD_MANAGEMENT = 5;

export const ROLES = {
  SUPER_ADMIN,
  MANAGER,
  GENERAL,
  ACCOUNTING,
  LEAD_MANAGEMENT,
};

export const ROLE_LABELS: Record<number, string> = {
  [SUPER_ADMIN]: 'Super admin',
  [MANAGER]: 'Manager',
  [GENERAL]: 'General user',
  [ACCOUNTING]: 'Accounting',
  [LEAD_MANAGEMENT]: 'Lead Management',
};
const SUPER_ROLE = [SUPER_ADMIN, MANAGER];
const SUPER_ADMIN_ROLES = [SUPER_ADMIN];
const GENERAL_ROLE = [GENERAL];
const ALL_ROLE = [SUPER_ADMIN, MANAGER, GENERAL];
