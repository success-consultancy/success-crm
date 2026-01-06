import { z } from 'zod';
import { parse } from 'date-fns';

const skillAssessmentFormSchema = z.object({
  files: z.array(z.any()).nullable().optional(),

  firstName: z.string(),
  lastName: z.string().nullable().optional(),
  middleName: z.string().nullable().optional(),

  passport: z.union([z.number(), z.string()]).nullable().optional(),
  issueDate: z.string().nullable().optional(),
  expiryDate: z.string().nullable().optional(),

  email: z.string().email(),
  phone: z.string().nullable().optional(),
  dob: z.string().nullable().optional(),

  occupation: z.string().nullable().optional(),
  anzsco: z.string().nullable().optional(),
  location: z.string().nullable().optional(),

  skillAssessmentBody: z.string().nullable().optional(),
  otherSkillAssessmentBody: z.string().nullable().optional(),
  currentVisa: z.string().nullable().optional(),
  visaExpiry: z.string().nullable().optional(),

  requestedDate: z.string().nullable().optional(),
  dueDate: z.string().nullable().optional(),
  status: z.string().nullable().optional(),
  statusDate: z.string().nullable().optional(),
  submittedDate: z.string().nullable().optional(),
  decisionDate: z.string().nullable().optional(),

  country: z.string().nullable().optional(),
  csaStatus: z.string().nullable().optional(),
  remarks: z.string().nullable().optional(),

  sourceId: z.string().min(1, 'Please select a source').max(50, 'Source selection is invalid'),

  invoiceNumber: z.string().nullable().optional(),
  payment: z.string().nullable().optional(),
  paymentStatus: z.string().nullable().optional(),

  userId: z.number().int().nullable().optional(),
  assignedDate: z.date().nullable().optional(),
  updatedBy: z.number().int().nullable().optional(),
})
  .superRefine((data, ctx) => {
    // Validate passport expiry date must be at least 10 years from current year
    if (data.expiryDate) {
      try {
        // Parse DD/MM/YYYY format
        const expiryDate = parse(data.expiryDate, 'dd/MM/yyyy', new Date());

        if (!isNaN(expiryDate.getTime())) {
          const currentYear = new Date().getFullYear();
          const expiryYear = expiryDate.getFullYear();
          const minRequiredYear = currentYear + 10;

          if (expiryYear < minRequiredYear) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: `Passport expiry date must be at least 10 years from the current year (minimum year: ${minRequiredYear})`,
              path: ['expiryDate'],
            });
          }
        }
      } catch (error) {
        // If parsing fails, the date format validation will catch it elsewhere
        // We don't need to add an issue here as the format validation will handle it
      }
    }
  });

export type SkillAssessmentSchemaType = z.infer<typeof skillAssessmentFormSchema>;

export default skillAssessmentFormSchema;
