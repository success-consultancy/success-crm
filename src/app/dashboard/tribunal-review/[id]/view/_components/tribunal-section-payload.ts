import { TribunalReviewSchemaType } from '@/schema/tribunal-review';
import { ITribunalReview } from '@/types/response-types/tribunal-review-response';

export type TribunalEditPayload = Omit<TribunalReviewSchemaType, 'accounts'>;

const fieldList: (keyof Omit<TribunalReviewSchemaType, 'accounts'>)[] = [
  'files',
  'firstName',
  'middleName',
  'lastName',
  'dob',
  'email',
  'phone',
  'country',
  'address',
  'passport',
  'passportIssueDate',
  'passportExpiryDate',
  'location',
  'currentVisa',
  'visaExpiry',
  'dueDate',
  'proposedVisa',
  'visaStream',
  'anzsco',
  'occupation',
  'sponsorName',
  'sponsorEmail',
  'sponsorPhone',
  'sbsStatus',
  'sbsSubmissionDate',
  'sbsDecisionDate',
  'nominationStatus',
  'nominationSubmittedDate',
  'nominationDecisionDate',
  'visaStatus',
  'visaSubmittedDate',
  'visaDecisionDate',
  'tribunalStatus',
  'tribunalSubmittedDate',
  'hearingDate',
  'tribunalDecisionDate',
  'remarks',
  'sourceId',
  'userId',
  'assignedDate',
  'updatedBy',
];

const pickFromTribunal = (
  tribunal: ITribunalReview,
  key: keyof Omit<TribunalReviewSchemaType, 'accounts'>,
): unknown => {
  if (key === 'assignedDate') {
    return tribunal.assignedDate ? new Date(tribunal.assignedDate) : null;
  }
  return (tribunal as unknown as Record<string, unknown>)[key as string] ?? null;
};

export const buildTribunalSectionPayload = (
  tribunal: ITribunalReview,
  overrides: Partial<TribunalReviewSchemaType>,
): TribunalEditPayload => {
  const base: Record<string, unknown> = { id: tribunal.id };
  for (const key of fieldList) {
    base[key] = key in overrides ? (overrides as Record<string, unknown>)[key] : pickFromTribunal(tribunal, key);
  }
  return base as TribunalEditPayload;
};
