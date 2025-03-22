import { api } from "@/lib/api"
import { useQuery } from "@tanstack/react-query";
export interface IOccupation {
    id: number;
    code: string;
    title: string;
    updatedBy: null;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: null;
}

export const GET_OCCUPATIONS = 'get-occupations'

const getOccupations = async () => {
    const res = await api.get('/occupation');
    return res.data as IOccupation[]
}

export const useGetOccupations = () => {
    return useQuery({
        queryKey: [GET_OCCUPATIONS],
        queryFn: getOccupations,
        refetchOnWindowFocus: false
    })
}