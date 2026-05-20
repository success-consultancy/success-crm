import { SkillAssessmentSchemaType } from '@/schema/skill-assessment-schema';
import { ISkillAssessment } from '@/types/response-types/skill-assessment-response';
import { format } from 'date-fns';

export type SkillEditPayload = SkillAssessmentSchemaType & { id: number };

const formatDate = (value: string | null | undefined): string | null => {
  if (!value) return null;
  if (value.includes('/')) return value;
  const d = new Date(value);
  return isNaN(d.getTime()) ? null : format(d, 'dd/MM/yyyy');
};

const baseFromSkill = (skill: ISkillAssessment): SkillAssessmentSchemaType => ({
  files: skill.files ?? null,
  firstName: skill.firstName,
  lastName: skill.lastName,
  middleName: skill.middleName ?? null,
  passport: (skill.passport as SkillAssessmentSchemaType['passport']) ?? null,
  issueDate: formatDate(skill.issueDate),
  expiryDate: formatDate(skill.expiryDate),
  email: skill.email,
  phone: skill.phone,
  dob: formatDate(skill.dob),
  occupation: skill.occupation ?? null,
  anzsco: skill.anzsco ?? null,
  location: skill.location ?? null,
  skillAssessmentBody: skill.skillAssessmentBody ?? null,
  otherSkillAssessmentBody: skill.otherSkillAssessmentBody ?? null,
  currentVisa: skill.currentVisa ?? null,
  visaExpiry: formatDate(skill.visaExpiry),
  requestedDate: formatDate(skill.requestedDate),
  dueDate: formatDate(skill.dueDate),
  status: skill.status ?? null,
  statusDate: formatDate(skill.statusDate),
  submittedDate: formatDate(skill.submittedDate),
  decisionDate: formatDate(skill.decisionDate),
  country: skill.country ?? null,
  csaStatus: skill.csaStatus ?? null,
  remarks: skill.remarks ?? null,
  sourceId: skill.sourceId ?? null,
  invoiceNumber: skill.invoiceNumber ?? null,
  payment: skill.payment ?? null,
  paymentStatus: skill.paymentStatus ?? null,
  userId: skill.userId ?? null,
  assignedDate: skill.assignedDate ? new Date(skill.assignedDate) : null,
  updatedBy: skill.updatedBy ?? null,
});

export const buildSkillSectionPayload = (
  skill: ISkillAssessment,
  overrides: Partial<SkillAssessmentSchemaType>,
): SkillEditPayload => {
  const base = baseFromSkill(skill);
  return {
    ...base,
    ...overrides,
    id: skill.id,
  };
};
