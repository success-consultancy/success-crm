import { LeadStatusTypes } from '@/types/response-types/leads-response';

export enum Services {
  Visa = 'Visa',
  SkillAssessment = 'Skill Assessment',
  Education = 'Education',
  HealthInsurance = 'Health Insurance',
  Other = 'Other',
}

export enum Location {
  OnShore = 'Onshore',
  OffShore = 'Offshore',
  Unknown = 'Unknown',
}

export const LEAD_STATUS_COLORS: Record<LeadStatusTypes, { background: string; text: string }> = {
  [LeadStatusTypes.New]: { background: '#EDE0FB', text: '#7E3FF2' },
  [LeadStatusTypes.Negotiation]: { background: '#FCE0C4', text: '#B26A1A' },
  [LeadStatusTypes.Converted]: { background: '#C9F2DC', text: '#17804B' },
  [LeadStatusTypes.NotInterested]: { background: '#FBD5D5', text: '#C93B3B' },
  [LeadStatusTypes.NotConverted]: { background: '#FBD5D5', text: '#C93B3B' },
  [LeadStatusTypes.FollowUp]: { background: '#FBD6EF', text: '#B32E93' },
};
