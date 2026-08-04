import { useAddEducation } from '@/mutations/education/add-education';
import { useAddInsurance } from '@/mutations/insurance/add-insurance';
import { useAddSkillAssessment } from '@/mutations/skill-assessment/add-skill-assessment';
import { useAddTribunalReview } from '@/mutations/tribunal-review/add-tribunal-review';
import { useAddVisa } from '@/mutations/visas/add-visa';
import { ILead } from '@/types/response-types/leads-response';
import { useToastContext } from '@/context/toast-context';
import { api } from '@/lib/api';
import Icons from '@/assets/icons';
import { ReactElement, useState } from 'react';

export type MoveServiceId = 'students' | 'visa' | 'skill' | 'insurance' | 'tribunal';

// 'invalid' = the lead is missing required fields, 'duplicate' = already in that service.
type MoveOutcome = 'moved' | 'invalid' | 'duplicate' | 'failed';

export interface MoveService {
  id: MoveServiceId;
  title: string;
  path: string;
  clientKey: keyof ILead['clientIds'];
  // Same icon the sidebar uses for the service.
  Icon: (props: { className?: string }) => ReactElement;
}

export const MOVE_SERVICES: MoveService[] = [
  {
    id: 'students',
    title: 'Education service',
    clientKey: 'students',
    path: 'education',
    Icon: Icons.EducationIcon,
  },
  { id: 'visa', title: 'Visa service', clientKey: 'visaApplicants', path: 'visa', Icon: Icons.VisaIcon },
  {
    id: 'skill',
    title: 'Skill assessment service',
    clientKey: 'skillAssessments',
    path: 'skill',
    Icon: Icons.SkillAssessmentIcon,
  },
  {
    id: 'insurance',
    title: 'Insurance service',
    clientKey: 'insuranceApplicants',
    path: 'insurance',
    Icon: Icons.InsuranceIcon,
  },
  {
    id: 'tribunal',
    title: 'Tribunal review service',
    clientKey: 'tribunalReviews',
    path: 'tribunal-review',
    Icon: Icons.TribunalReviewIcon,
  },
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
  const keys = [
    'firstName',
    'lastName',
    'email',
    'phone',
    'country',
    'userId',
    'sourceId',
    'remarks',
    'files',
  ] as const;
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
  const [isBulkMoving, setIsBulkMoving] = useState(false);

  // Performs the move without any toast, so single and bulk callers can report
  // the result their own way.
  const attemptMove = async (lead: ILead, serviceId: MoveServiceId): Promise<MoveOutcome> => {
    const payload = createGenericPayload(lead);
    if (!payload.firstName || !payload.email) return 'invalid';

    const leadId = lead.id.toString();
    const service = MOVE_SERVICES.find((s) => s.id === serviceId);

    let clientIds = lead.clientIds;
    if (!clientIds) {
      try {
        const res = await api.get(`/lead/${leadId}`);
        clientIds = res.data?.clientIds;
      } catch {
        // Ignore — the backend updateClient guard is the safety net.
      }
    }
    if (service) {
      const existing = clientIds?.[service.clientKey] as unknown[] | undefined;
      if (Array.isArray(existing) && existing.length > 0) return 'duplicate';
    }

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
        return 'failed';
    }

    return request.then((): MoveOutcome => 'moved').catch((): MoveOutcome => 'failed');
  };

  const moveLead = async (lead: ILead, serviceId: MoveServiceId) => {
    const service = MOVE_SERVICES.find((s) => s.id === serviceId);
    const outcome = await attemptMove(lead, serviceId);
    const toastKey = `move-lead-${lead.id}-${serviceId}`;

    switch (outcome) {
      case 'moved':
        showMoveToastOnce(toastKey, () => success(`Lead moved to ${service?.title ?? 'the selected service'}`));
        return;
      case 'invalid':
        error('Cannot move lead: first name and email are required');
        return Promise.reject(new Error('Missing required fields: firstName and email'));
      case 'duplicate':
        error(`This lead has already been moved to ${service?.title ?? 'this service'}.`);
        return Promise.reject(new Error('Lead already moved to this service'));
      default:
        showMoveToastOnce(toastKey, () => error('Failed to move lead. Please try again.'));
    }
  };

  /**
   * Bulk variant of `moveLead` for the leads table's selection toolbar. Leads are moved
   * one at a time so the API isn't hit with a burst, and the result is reported as a
   * single summary toast instead of one toast per lead.
   */
  const moveLeads = async (leads: ILead[], serviceId: MoveServiceId) => {
    const service = MOVE_SERVICES.find((s) => s.id === serviceId);
    const serviceTitle = service?.title ?? 'the selected service';
    const outcomes: MoveOutcome[] = [];

    setIsBulkMoving(true);
    try {
      for (const lead of leads) {
        outcomes.push(await attemptMove(lead, serviceId));
      }
    } finally {
      setIsBulkMoving(false);
    }

    const count = (outcome: MoveOutcome) => outcomes.filter((o) => o === outcome).length;
    const moved = count('moved');
    const skipped = count('duplicate');
    const failed = count('failed') + count('invalid');
    const leadWord = (n: number) => `${n} ${n === 1 ? 'lead' : 'leads'}`;

    if (moved === 0) {
      if (skipped > 0 && failed === 0) error(`${leadWord(skipped)} already in ${serviceTitle}.`);
      else error(`Failed to move ${failed > 0 ? leadWord(failed) : 'the selected leads'} to ${serviceTitle}.`);
      return outcomes;
    }

    const notes = [
      skipped > 0 ? `${skipped} already there` : null,
      failed > 0 ? `${failed} failed` : null,
    ].filter(Boolean);
    success(`${leadWord(moved)} moved to ${serviceTitle}${notes.length ? ` (${notes.join(', ')})` : ''}`);
    return outcomes;
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

  return {
    services: MOVE_SERVICES,
    moveLead,
    moveLeads,
    pendingServiceId,
    isBulkMoving,
    isMoving: pendingServiceId !== null || isBulkMoving,
  };
};
