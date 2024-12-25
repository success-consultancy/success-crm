import { QUERY_KEYS } from "@/constants/query-keys";
import { api } from "@/lib/api";
import { LeadsResponseType } from "@/types/response-types/leads-response";
import { useQuery } from "@tanstack/react-query";

const getLeads = async () => {
    const res = await api.get('/lead');
    return res.data as LeadsResponseType;
};

export const useGetLeads = () => {
    return useQuery({
        queryFn: getLeads,
        queryKey: [QUERY_KEYS.GET_LEADS],
        refetchOnWindowFocus: false
    });
};