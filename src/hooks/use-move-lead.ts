import { useAddEducation } from '@/mutations/education/add-education';
import { useAddInsurance } from '@/mutations/insurance/add-insurance';
import { useAddSkillAssessment } from '@/mutations/skill-assessment/add-skill-assessment';
import { useAddTribunalReview } from '@/mutations/tribunal-review/add-tribunal-review';
import { useAddVisa } from '@/mutations/visas/add-visa';
import { ILead } from '@/types/response-types/leads-response';
import { useToastContext } from '@/context/toast-context';

export type MoveServiceId = 'students' | 'visa' | 'skill' | 'insurance' | 'tribunal';

export interface MoveService {
  id: MoveServiceId;
  title: string;
  path: string;
  clientKey: keyof ILead['clientIds'];
}

export const MOVE_SERVICES: MoveService[] = [
  { id: 'students', title: 'Education service', clientKey: 'students', path: 'education' },
  { id: 'visa', title: 'Visa service', clientKey: 'visaApplicants', path: 'visa' },
  { id: 'skill', title: 'Skill assessment service', clientKey: 'skillAssessments', path: 'skill' },
  { id: 'insurance', title: 'Insurance service', clientKey: 'insuranceApplicants', path: 'insurance' },
  { id: 'tribunal', title: 'Tribunal review service', clientKey: 'tribunalReviews', path: 'tribunal-review' },
];

// Guards against a duplicate toast for the same move within a short window
// (e.g. React StrictMode's double-invoke in dev).
const recentMoveToasts = new Map<string, number>();
const showMoveToastOnce = (key: string, fn: () => void) => {
  const now = Date.now();
  if (now - (recentMoveToasts.get(key) ?? 0) < 800) return;
  recentMoveToasts.set(key, now);
  fn();
};

// Only the fields common to every service application are carried over from the lead.
const createGenericPayload = (lead: ILead) => {
  const payload: Record<string, any> = {};
  const keys = ['firstName', 'lastName', 'email', 'phone', 'country', 'userId', 'sourceId', 'remarks', 'files'] as const;
  keys.forEach((key) => {
    if (Object.prototype.hasOwnProperty.call(lead, key)) payload[key] = (lead as any)[key];
  });
  return payload;
};

/**
 * Encapsulates moving a lead into a service application (the same behavior as the
 * lead-detail "Move here" transition). Shared by the lead detail transition and the
 * leads table "Move to" action.
 */
export const useMoveLead = () => {
  const { success, error } = useToastContext();
  const addVisa = useAddVisa();
  const addSkillAssessment = useAddSkillAssessment();
  const addEducation = useAddEducation();
  const addInsurance = useAddInsurance();
  const addTribunalReview = useAddTribunalReview();

  const moveLead = (lead: ILead, serviceId: MoveServiceId) => {
    const payload = createGenericPayload(lead);
    if (!payload.firstName || !payload.email) {
      error('Cannot move lead: first name and email are required');
      return Promise.reject(new Error('Missing required fields: firstName and email'));
    }
    const leadId = lead.id.toString();
    const service = MOVE_SERVICES.find((s) => s.id === serviceId);

    let request: Promise<unknown>;
    switch (serviceId) {
      case 'visa':
        if (lead.visa) payload.currentVisa = lead.visa;
        if (lead.visaExpiry) payload.visaExpiry = lead.visaExpiry;
        if (lead.occupation) payload.occupation = lead.occupation;
        if (lead.anzsco) payload.anzsco = lead.anzsco;
        request = addVisa.mutateAsync({ payload: payload as any, leadId });
        break;

      case 'students':
        request = addEducation.mutateAsync({ payload: payload as any, leadId });
        break;

      case 'skill':
        if (lead.visa) payload.currentVisa = lead.visa;
        if (lead.visaExpiry) payload.visaExpiry = lead.visaExpiry;
        if (lead.occupation) payload.occupation = lead.occupation;
        if (lead.anzsco) payload.anzsco = lead.anzsco;
        request = addSkillAssessment.mutateAsync({ payload: payload as any, leadId });
        break;

      case 'insurance':
        if (lead.visa) payload.currentVisa = lead.visa;
        if (lead.occupation) payload.occupation = lead.occupation;
        if (lead.anzsco) payload.anzsco = lead.anzsco;
        request = addInsurance.mutateAsync({ payload: payload as any, leadId });
        break;

      case 'tribunal':
        request = addTribunalReview.mutateAsync({ payload: payload as any, leadId });
        break;

      default:
        return Promise.resolve();
    }

    const toastKey = `move-lead-${leadId}-${serviceId}`;
    return request
      .then((res) => {
        showMoveToastOnce(toastKey, () => success(`Lead moved to ${service?.title ?? 'the selected service'}`));
        return res;
      })
      .catch(() => {
        showMoveToastOnce(toastKey, () => error('Failed to move lead. Please try again.'));
      });
  };

  const pendingServiceId: MoveServiceId | null = addVisa.isPending
    ? 'visa'
    : addSkillAssessment.isPending
      ? 'skill'
      : addEducation.isPending
        ? 'students'
        : addInsurance.isPending
          ? 'insurance'
          : addTribunalReview.isPending
            ? 'tribunal'
            : null;

  return { services: MOVE_SERVICES, moveLead, pendingServiceId, isMoving: pendingServiceId !== null };
};
