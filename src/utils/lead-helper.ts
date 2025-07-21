import { LeadsFormSteps } from "@/config/leads-form-steps";
import { LeadSchemaType, passportDetailsSchema, personalDetailsSchema, serviceDetailsSchema } from "@/schema/lead-schema";


export const getCompletedSteps = async (formData: LeadSchemaType) => {
  let completedSteps = [];

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
