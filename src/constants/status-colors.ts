import { EducationStatusTypes } from '@/types/response-types/education-response';
import { VisaStatusTypes } from '@/types/response-types/visa-response';

type StatusColor = { background: string; text: string };

/** Payment status shown on the accounts / fee-structure tables. */
export const PAYMENT_STATUS_COLORS: Record<string, StatusColor> = {
  Pending: { background: '#FCE0C4', text: '#B26A1A' },
  Paid: { background: '#C9F2DC', text: '#17804B' },
  Overdue: { background: '#FBD5DC', text: '#C93B4E' },
  Other: { background: '#D6E4FA', text: '#3A6FD8' },
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
};
