import { z } from "zod";

const leadFormSchema = z.object({
    email: z
        .string()
        .email({ message: "Invalid email address" }),
    phone: z
        .string()
        .min(10, { message: "Phone number must be at least 10 characters" }),
    firstName: z
        .string()
        .min(1, { message: "First name is required" }),
    middleName: z.string().optional(),
    lastName: z
        .string()
        .min(1, { message: "Last name is required" }),
    dateOfBirth: z
        .string(),
    address: z.string().optional(),
    country: z.string().optional(),
    passportNo: z.string().optional(),
    issueDate: z
        .string()
        .optional(),
    expiryDate: z
        .string()
        .optional(),
    occupation: z.string().optional(),
    anzsco: z.string().optional(),
    qualification: z.string().optional(),
    visa: z.string().optional(),
    serviceType: z
        .string()
        .min(1, { message: "Service Type is required" }),
    location: z.string().optional(),
    source: z.string().optional(),
    assignedTo: z.string().optional(),
    status: z
        .string()
        .min(1, { message: "Status is required" }),
    note: z.string().optional(),
    files: z.array(z.string())
});

export type LeadSchemaType = z.infer<typeof leadFormSchema>

export default leadFormSchema;
