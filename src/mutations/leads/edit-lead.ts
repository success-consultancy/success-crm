import { api } from '@/lib/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/constants/query-keys';
import { LeadSchemaType } from '@/schema/lead-schema';
import { toast } from 'sonner'

const REQUIRED_FIELDS = new Set(['firstName', 'lastName', 'email', 'phone']);

const editLead = async (
  payload: Omit<LeadSchemaType, 'serviceType'> & {
    serviceType: string;
    id: number;
    branchId?: string;
  },
) => {
  const { hasVisitedStep, branchId, id, ...filteredPayload } = payload;
  const normalizedPayload = Object.fromEntries(
    Object.entries(filteredPayload).map(([key, value]) => [
      key,
      value === '' && !REQUIRED_FIELDS.has(key) ? null : value,
    ]),
  );
  const res = await api.put(`/lead/${id}`, normalizedPayload);
  return res.data;
};

export const useEditLead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: editLead,
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: (query) =>
          query.queryKey[0] === QUERY_KEYS.GET_LEADS || query.queryKey[0] === QUERY_KEYS.GET_LEAD_BY_ID,
      });
      toast("Success!", {
        description: "Lead has been updated",
      })
    },
    onError: () => {
      toast("Error!", {
        description: "Something went wrong",
      })
    },
  });
};


type IPayload = {
  studentId?: string;
  visaApplicantId?: string;
  insuranceApplicantId?: string;
  skillAssessmentId?: string;
  tribunalReviewId?: string;
};

export const updateLeadClient = async (leadId: string, payload: IPayload) => {
  const res = await api.put(`/lead/updateClient/${leadId}`, payload);
};
// export const useUpdateLeadClient = () => {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: updateLeadClient,
//     onSuccess: () => {
//       queryClient.invalidateQueries({
//         predicate: (query) =>
//           query.queryKey[0] === QUERY_KEYS.GET_LEADS || query.queryKey[0] === QUERY_KEYS.GET_LEAD_BY_ID,
//       });
//     },
//     onError: () => {
//       toast({
//         title: 'Error!',
//         description: 'Something went wrong',
//       });
//     },
//   });
// };

type IPayloadStatus = {
  id: string;
  status: string;
};

const updateLeadStatus = async ({ id, status }: IPayloadStatus) => {
  const res = await api.patch(`/lead/${id}/status`, { status });
};

export const useUpdateLeadStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateLeadStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: (query) =>
          query.queryKey[0] === QUERY_KEYS.GET_LEADS || query.queryKey[0] === QUERY_KEYS.GET_LEAD_BY_ID,
      });
      toast("Success!", {
        description: "Lead has been updated",
      })
    },
    onError: () => {
      toast("Error!", {
        description: "Something went wrong",
      })
    },
  });
};

