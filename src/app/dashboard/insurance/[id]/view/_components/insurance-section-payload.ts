import { InsuranceSchemaType } from '@/schema/insurance';
import { IInsurance } from '@/types/response-types/insurance-response';

export type InsuranceEditPayload = Omit<InsuranceSchemaType, 'accounts'>;

const insuranceFieldList: (keyof Omit<InsuranceSchemaType, 'accounts'>)[] = [
  'files',
  'firstName',
  'lastName',
  'middleName',
  'passport',
  'passportIssueDate',
  'passportExpiryDate',
  'email',
  'phone',
  'dob',
  'currentVisa',
  'currentInsurance',
  'occupation',
  'anzsco',
  'startDate',
  'expiryDate',
  'insuranceTypeId',
  'insuranceProviderId',
  'category',
  'paymentPlan',
  'totalPaid',
  'policyNumber',
  'remarks',
  'country',
  'address',
  'status',
  'statusDate',
  'sourceId',
  'userId',
  'assignedDate',
  'updatedBy',
  'location',
  'visaStream',
  'visaExpiry',
  'dueDate',
];

const pickFromInsurance = (
  insurance: IInsurance,
  key: keyof Omit<InsuranceSchemaType, 'accounts'>,
): unknown => {
  if (key === 'assignedDate') {
    return insurance.assignedDate ? new Date(insurance.assignedDate) : null;
  }
  return (insurance as unknown as Record<string, unknown>)[key as string] ?? null;
};

export const buildInsuranceSectionPayload = (
  insurance: IInsurance,
  overrides: Partial<InsuranceSchemaType>,
): InsuranceEditPayload => {
  const base: Record<string, unknown> = { id: insurance.id };
  for (const key of insuranceFieldList) {
    base[key] = key in overrides ? (overrides as Record<string, unknown>)[key] : pickFromInsurance(insurance, key);
  }
  return base as InsuranceEditPayload;
};
