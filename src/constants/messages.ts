/**
 * Canonical copy for toasts and button loading states.
 *
 * Every user-facing message is built from these helpers so the wording stays
 * identical across services:
 *   success -> `<Entity> added successfully`   (no trailing punctuation)
 *   error   -> `Failed to add <entity>`        (fallback when the API sends no message)
 *   loading -> `Adding...`                     (ASCII ellipsis, never `…`)
 *
 * Add a new service by adding its noun to ENTITY — never by writing a literal
 * at the call site.
 */

/** Sentence-case nouns. The builders lowercase them for mid-sentence errors. */
export const ENTITY = {
  // Services
  lead: 'Lead',
  education: 'Education applicant',
  visa: 'Visa applicant',
  skill: 'Skill assessment applicant',
  tribunalReview: 'Tribunal review applicant',
  insurance: 'Insurance applicant',

  // Records
  account: 'Account',
  agreement: 'Agreement',
  announcement: 'Announcement',
  appointment: 'Appointment',
  branch: 'Branch',
  course: 'Course',
  courseFee: 'Course fee',
  document: 'Document',
  email: 'Email',
  fiscalReport: 'Report',
  fiscalTargets: 'Targets',
  followUp: 'Follow-up',
  leaveRequest: 'Leave request',
  occupation: 'Occupation',
  rolePermissions: 'Role permissions',
  setting: 'Setting',
  source: 'Source',
  university: 'University',
  user: 'User',
  visaType: 'Visa type',

  // Plurals — used by the export toasts, which always cover many records
  agreements: 'Agreements',
  announcements: 'Announcements',
  checkIns: 'Check-ins',
  educationApplicants: 'Education applicants',
  insuranceApplicants: 'Insurance applicants',
  leads: 'Leads',
  skillApplicants: 'Skill assessment applicants',
  tribunalApplicants: 'Tribunal review applicants',
  universities: 'Universities',
  users: 'Users',
  visaApplicants: 'Visa applicants',

  // Sections inside a service's view page
  courseInfo: 'Course information',
  miscInfo: 'Misc info',
  passportVisaInfo: 'Passport & visa info',
  personalDetails: 'Personal details',
  serviceDetails: 'Service details',
  tribunalDetails: 'Tribunal review details',
  visaInfo: 'Visa information',
  visaInsuranceDetails: 'Visa & insurance details',
  visaServiceDetails: 'Visa & service details',
} as const;

export type EntityName = (typeof ENTITY)[keyof typeof ENTITY];

const lower = (entity: string) => entity.charAt(0).toLowerCase() + entity.slice(1);

export const toastMsg = {
  addSuccess: (entity: string) => `${entity} added successfully`,
  updateSuccess: (entity: string) => `${entity} updated successfully`,
  deleteSuccess: (entity: string) => `${entity} deleted successfully`,
  removeSuccess: (entity: string) => `${entity} removed successfully`,
  exportSuccess: (entity: string) => `${entity} exported successfully`,
  sendSuccess: (entity: string) => `${entity} sent successfully`,
  publishSuccess: (entity: string) => `${entity} published successfully`,
  submitSuccess: (entity: string) => `${entity} submitted successfully`,

  addError: (entity: string) => `Failed to add ${lower(entity)}`,
  updateError: (entity: string) => `Failed to update ${lower(entity)}`,
  deleteError: (entity: string) => `Failed to delete ${lower(entity)}`,
  removeError: (entity: string) => `Failed to remove ${lower(entity)}`,
  exportError: (entity: string) => `Failed to export ${lower(entity)}`,
  sendError: (entity: string) => `Failed to send ${lower(entity)}`,
  publishError: (entity: string) => `Failed to publish ${lower(entity)}`,
  submitError: (entity: string) => `Failed to submit ${lower(entity)}`,

  addLoading: (entity: string) => `Adding ${lower(entity)}...`,
  updateLoading: (entity: string) => `Updating ${lower(entity)}...`,
  deleteLoading: (entity: string) => `Deleting ${lower(entity)}...`,
} as const;

/**
 * `<count> <entity>` for bulk actions, e.g. `countOf(3, ENTITY.lead, ENTITY.leads)`
 * -> `3 leads`. Both forms are passed explicitly so no plural is ever guessed.
 */
export const countOf = (count: number, singular: string, plural: string) =>
  `${count} ${lower(count === 1 ? singular : plural)}`;

/** Submit-button text while a mutation is in flight (`<Button loadingText>`). */
export const LOADING_LABEL = {
  add: 'Adding...',
  update: 'Updating...',
  save: 'Saving...',
  delete: 'Deleting...',
  remove: 'Removing...',
  export: 'Exporting...',
  move: 'Moving...',
  send: 'Sending...',
  signIn: 'Signing in...',
  publish: 'Publishing...',
  submit: 'Submitting...',
  verify: 'Verifying...',
  load: 'Loading...',
} as const;
