import { EducationStatusTypes } from '@/types/response-types/education-response';
import { VisaStatusTypes } from '@/types/response-types/visa-response';
import { TribunalStatusTypes } from '@/types/response-types/tribunal-review-response';
import { InsuranceStatusTypes } from '@/types/response-types/insurance-response';

type StatusColor = { background: string; text: string };

/** Payment status shown on the accounts / fee-structure tables. */
export const PAYMENT_STATUS_COLORS: Record<string, StatusColor> = {
  Pending: { background: '#FCE3A8', text: '#A87A12' },
  Paid: { background: '#C9F2DC', text: '#17804B' },
  Overdue: { background: '#FBD9C4', text: '#C2691C' },
  Unpaid: { background: '#FBD5D5', text: '#C93B3B' },
  Other: { background: '#DDE4FB', text: '#3A5BB8' },
};

export const EDUCATION_STATUS_COLORS: Record<EducationStatusTypes, StatusColor> = {
  [EducationStatusTypes.New]: { background: '#E6DEFB', text: '#7E3FF2' },
  [EducationStatusTypes.Checklist]: { background: '#F7F0A8', text: '#8A7A16' },
  [EducationStatusTypes.ApplicationReady]: { background: '#CFE6FA', text: '#2C6FA8' },
  [EducationStatusTypes.ApplicationSubmitted]: { background: '#C7EDF5', text: '#17788F' },
  [EducationStatusTypes.OfferReceived]: { background: '#DFF3B8', text: '#5C8A22' },
  [EducationStatusTypes.WaitingPayment]: { background: '#FAEBA0', text: '#957A13' },
  [EducationStatusTypes.FeePaid]: { background: '#FBD6EF', text: '#B32E93' },
  [EducationStatusTypes.CoeReceived]: { background: '#C9F2DC', text: '#17804B' },
  [EducationStatusTypes.Withdrawn]: { background: '#FCE0C4', text: '#B26A1A' },
  [EducationStatusTypes.Discontinued]: { background: '#FBD5D5', text: '#C93B3B' },
};

/**
 * Application-pipeline statuses. Visa and skill assessment share the same status
 * strings (VisaStatusTypes / SkillAssessmentStatusTypes), so both services — their
 * status, SBS/TAS status and nomination status fields — read from this one map.
 */
export const SERVICE_STATUS_COLORS: Record<string, StatusColor> = {
  [VisaStatusTypes.New]: { background: '#EDE0FB', text: '#7E3FF2' },
  [VisaStatusTypes.CollectingDocs]: { background: '#F3DEF9', text: '#9B3FC4' },
  [VisaStatusTypes.ReadyToSubmit]: { background: '#DDE4FB', text: '#3A5BB8' },
  [VisaStatusTypes.Submitted]: { background: '#C7EDF5', text: '#17788F' },
  [VisaStatusTypes.InfoRequested]: { background: '#FAF0A8', text: '#8A7A16' },
  [VisaStatusTypes.Approved]: { background: '#C9F2DC', text: '#17804B' },
  [VisaStatusTypes.Withdrawn]: { background: '#FCE0C4', text: '#B26A1A' },
  [VisaStatusTypes.Refused]: { background: '#D6E4FA', text: '#2C6FA8' },
  [VisaStatusTypes.Discontinued]: { background: '#FBD5DC', text: '#C93B4E' },
  [VisaStatusTypes.FollowUp]: { background: '#FDE2EC', text: '#C2407A' },

  // Tribunal review adds these outcomes on top of the shared pipeline statuses.
  [TribunalStatusTypes.Remitted]: { background: '#DFF3B8', text: '#5C8A22' },
  [TribunalStatusTypes.MinisterialApproved]: { background: '#C9F2DC', text: '#17804B' },
  [TribunalStatusTypes.MinisterialRefused]: { background: '#FBD5D5', text: '#C93B3B' },
  [TribunalStatusTypes.MinisterialIntervention]: { background: '#EAF5A8', text: '#6E8A16' },
  [TribunalStatusTypes.Other]: { background: '#F0F0F0', text: '#5C5C5C' },

  // Insurance adds these on top of the shared pipeline statuses.
  [InsuranceStatusTypes.InProgress]: { background: '#DDE4FB', text: '#3A5BB8' },
  [InsuranceStatusTypes.Completed]: { background: '#C9F2DC', text: '#17804B' },
  [InsuranceStatusTypes.RefundInProgress]: { background: '#FAF0A8', text: '#8A7A16' },
  [InsuranceStatusTypes.Refunded]: { background: '#EAF5A8', text: '#6E8A16' },
};
