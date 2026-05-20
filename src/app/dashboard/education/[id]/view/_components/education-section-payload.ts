import { EditEducationServiceType } from '@/schema/education-service/edit-student.schema';
import { IEducation } from '@/types/response-types/education-response';

export type EducationEditPayload = EditEducationServiceType & { id: number };

const toDate = (value: unknown): Date | undefined => {
  if (!value) return undefined;
  if (value instanceof Date) return value;
  if (typeof value === 'string') {
    const d = new Date(value);
    return isNaN(d.getTime()) ? undefined : d;
  }
  return undefined;
};

const baseFromEducation = (education: IEducation): EditEducationServiceType => {
  const raw = education as unknown as Record<string, unknown>;
  return {
    firstName: education.firstName ?? undefined,
    middleName: education.middleName ?? undefined,
    lastName: education.lastName ?? undefined,
    dob: toDate(education.dob),
    email: education.email ?? undefined,
    phone: education.phone ?? undefined,
    country: education.country ?? undefined,
    passport: education.passport != null ? String(education.passport) : undefined,
    issueDate: toDate(education.issueDate),
    expiryDate: toDate(education.expiryDate),
    location: education.location ?? undefined,
    universityId: raw.universityId != null ? String(raw.universityId) : undefined,
    courseId: raw.courseId != null ? String(raw.courseId) : undefined,
    startDate: toDate(education.startDate),
    endDate: toDate(education.endDate),
    status: education.status ?? undefined,
    userId: education.userId != null ? String(education.userId) : undefined,
    sourceId: education.sourceId ?? undefined,
    remarks: education.remarks ?? undefined,
    statusDate: toDate(raw.statusDate),
  };
};

export const buildEducationSectionPayload = (
  education: IEducation,
  overrides: Partial<EditEducationServiceType>,
): EducationEditPayload => {
  const base = baseFromEducation(education);
  return {
    ...base,
    ...overrides,
    id: education.id,
  };
};
