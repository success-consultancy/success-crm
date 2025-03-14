import { api } from "@/lib/api"
import { LeadSchemaType } from "@/schemas/lead-schema"
import { useMutation } from "@tanstack/react-query"

const addLead = async (payload: LeadSchemaType) => {
    const { hasVisitedStep, ...filteredPayload } = payload; // Remove 'hasVisitedStep'
    const res = await api.post('/lead', filteredPayload);
    return res.data;
}

export const useAddLead = () => {
    return useMutation({
        mutationFn: addLead
    })
}