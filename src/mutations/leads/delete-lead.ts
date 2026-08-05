import { QUERY_KEYS } from '@/constants/query-keys';
import { toast } from 'sonner';
import { api, getApiErrorMessage } from '@/lib/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';


const deleteLead = async (id: number) => {
  const res = await api.delete(`/lead/${id}`);
  return res.data;
};

export const useDeleteLead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteLead,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_LEADS],
      });
      toast('Success!', {
        description: 'Lead has been deleted',
      });
    },
    onError: (error: any) => {
      toast("Error!", {
          description: getApiErrorMessage(error),
        })
    },
  });
};

const deleteLeadBulk = async (ids: number[]) => {
  const res = await api.delete(`/lead/bulk-delete`, { data: { ids } });
  return res.data;
};

export const useDeleteLeadBulk = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteLeadBulk,
    onSuccess: (_data, ids) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_LEADS],
      });
      toast('Success!', {
        description: `${ids.length} lead${ids.length > 1 ? 's have' : ' has'} been deleted`,
      });
    },
    onError: (error: any) => {
      toast("Error!", {
          description: getApiErrorMessage(error),
        })
    },
  });
};
