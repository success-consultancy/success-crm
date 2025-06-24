import { z } from "zod";

export const personalDetailsSchema = z.object({
  email: z
    .string({ required_error: "Email is required." })
    .email({ message: "Invalid email address" }),
  phone: z
    .string({ required_error: "Phone number is required." })
    .min(10, { message: "Phone number must be at least 10 characters" }),
  firstName: z
    .string({ required_error: "First name is required." })
    .min(1, { message: "First name is required" }),
  middleName: z.string().optional(),
  lastName: z
    .string({ required_error: "Last name is required." })
    .min(1, { message: "Last name is required" }),
  dob: z.string().optional(),
  address: z.string().optional(),
  qualification: z.string().optional(),
  occupation: z.string().optional(),
  anzsco: z.string().optional(),
});

export const passportDetailsSchema = z.object({
  country: z.string().optional(),
  passportNo: z.string().optional(),
  issueDate: z.date().optional(),
  expiryDate: z.date().optional(),
  visa: z.string().optional(),
  visaExpiry: z.date().optional(),
  hasVisitedStep: z.boolean(),
});

export const serviceDetailsSchema = z.object({
  location: z.string().optional(),
  serviceType: z.array(z.string()),
  source: z.string().optional(),
  assignedTo: z.string().optional(),
  status: z.string().min(1, { message: "Status is required" }),
  note: z.string().optional(),
  files: z.array(z.string()).optional(),
});

const leadFormSchema = personalDetailsSchema
  .and(serviceDetailsSchema)
  .and(passportDetailsSchema);

export type LeadSchemaType = z.infer<typeof leadFormSchema>;

export default leadFormSchema;
