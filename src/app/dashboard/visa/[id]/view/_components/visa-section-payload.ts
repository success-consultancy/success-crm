import { NewVisaServiceType } from '@/schema/visa-service/new-visa.schema';
import { IVisaDetail } from '@/types/response-types/visa-response';

export type VisaEditPayload = NewVisaServiceType & { id: number };

const visaFieldList: (keyof NewVisaServiceType)[] = [
  'files',
  'firstName',
  'lastName',
  'middleName',
  'passport',
  'issueDate',
  'expiryDate',
  'email',
  'phone',
  'dob',
  'occupation',
  'anzsco',
  'location',
  'visaSubmitted',
  'visaGranted',
  'currentVisa',
  'proposedVisa',
  'visaExpiry',
  'requestedDate',
  'dueDate',
  'status',
  'statusDate',
  'nominationLodged',
  'nominationDecision',
  'nominationStatus',
  'country',
  'state',
  'csaStatus',
  'remarks',
  'sourceId',
  'invoiceNumber',
  'payment',
  'paymentStatus',
  'userId',
  'assignedDate',
  'updatedBy',
  'visaStream',
  'sponsorName',
  'sponsorEmail',
  'sponsorPhone',
  'sbsStatus',
  'sbsSubmissionDate',
  'sbsDecisionDate',
  'miscNote',
];

const pickFromVisa = (visa: IVisaDetail, key: keyof NewVisaServiceType): unknown => {
  if (key === 'assignedDate') {
    return visa.assignedDate ? new Date(visa.assignedDate) : null;
  }
  return (visa as unknown as Record<string, unknown>)[key as string] ?? null;
};

export const buildVisaSectionPayload = (
  visa: IVisaDetail,
  overrides: Partial<NewVisaServiceType>,
): VisaEditPayload => {
  const base: Record<string, unknown> = { id: visa.id };
  for (const key of visaFieldList) {
    base[key] = key in overrides ? overrides[key] : pickFromVisa(visa, key);
  }
  return base as VisaEditPayload;
};
