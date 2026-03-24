import { z } from 'zod';
import { AgreementStatus } from '@/types/response-types/agreement-response';
import { format, parseISO, isValid } from 'date-fns';

export const agreementFormSchema = z.object({
  universityId: z.number().min(1, 'University is required'),
  type: z.string().nullable().optional(),
  group: z.string().nullable().optional(),
  webLink: z.string().nullable().optional(),
  startDate: z.string().nullable().optional(),
  endDate: z.string().nullable().optional(),
  commission: z.string().nullable().optional(),
  location: z.string().nullable().optional(),
  status: z.nativeEnum(AgreementStatus),
  note: z.string().nullable().optional(),
  files: z.array(z.any()).nullable().optional(),
});

export type AgreementSchemaType = z.infer<typeof agreementFormSchema>;

export const updateAgreementFormSchema = agreementFormSchema.extend({
  id: z.number(),
});

export type UpdateAgreementSchemaType = z.infer<typeof updateAgreementFormSchema>;

export const getAgreementDefaultValues = (agreement?: any): AgreementSchemaType => {
  // Helper to convert date from API format to yyyy-MM-dd format
  const convertDate = (dateString: string | null | undefined): string | null => {
    if (!dateString) return null;
    try {
      // If already in yyyy-MM-dd format, return as is
      if (dateString.match(/^\d{4}-\d{2}-\d{2}$/)) return dateString;
      // Try to parse ISO format
      const date = parseISO(dateString);
      if (isValid(date)) {
        return format(date, 'yyyy-MM-dd');
      }
      return null;
    } catch {
      return null;
    }
  };

  return {
    universityId: agreement?.universityId || 0,
    type: agreement?.type || null,
    group: agreement?.group || null,
    webLink: agreement?.webLink || null,
    startDate: convertDate(agreement?.startDate),
    endDate: convertDate(agreement?.endDate),
    commission: agreement?.commission || null,
    location: agreement?.location || null,
    status: agreement?.status || AgreementStatus.InProcess,
    note: agreement?.note || null,
    files: agreement?.files || null,
  };
};
