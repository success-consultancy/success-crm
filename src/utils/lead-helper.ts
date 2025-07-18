import { LeadsFormSteps } from '@/app/config/leads-form-steps';
import {
  LeadSchemaType,
  passportDetailsSchema,
  personalDetailsSchema,
  serviceDetailsSchema,
} from '@/schemas/lead-schema';
import { ILead } from '@/types/response-types/leads-response';

export const getCompletedSteps = async (formData: LeadSchemaType) => {
  const completedSteps = [];

  const [personalDetailsResult, passportDetailsResult, serviceDetailsResult] = await Promise.all([
    personalDetailsSchema.safeParse(formData),
    passportDetailsSchema.safeParse(formData),
    serviceDetailsSchema.safeParse(formData),
  ]);

  console.log(personalDetailsResult.error);

  if (personalDetailsResult.success) {
    completedSteps.push(LeadsFormSteps.PersonalDetails);
  }
  if (passportDetailsResult.success) {
    completedSteps.push(LeadsFormSteps.PassportAndVisa);
  }
  if (serviceDetailsResult.success) {
    completedSteps.push(LeadsFormSteps.ServiceDetails);
  }

  return completedSteps;
};

export const transformLeadDates = (lead: ILead) => ({
  ...lead,
  // dob: lead.dob ? new Date(lead.dob) : undefined,
  issueDate: lead.issueDate ? new Date(lead.issueDate) : undefined,
  expiryDate: lead.expiryDate ? new Date(lead.expiryDate) : undefined,
  visaExpiry: lead.visaExpiry ? new Date(lead.visaExpiry) : undefined,
});
