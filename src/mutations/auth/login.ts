import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";
import { saveAccessToken } from "@/lib/utils/auth-token";
import { LoginSchemaType } from "@/schemas/auth/login-schema";
import { ILoginResponse } from "@/types/user-type";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

const loginUser = async (payload: LoginSchemaType) => {
    const res = await api.post('/auth/login', payload);
    return res.data;
};


export const useLoginUser = () => {
    const { toast } = useToast();
    return useMutation({
        mutationFn: loginUser,
        onSuccess: (res: ILoginResponse) => {
            if (res.token) {
                saveAccessToken(res.token);
            }
        },
        onError: (err) => {
            if (axios.isAxiosError(err)) {
                toast({
                    title: 'Failed to login!',
                    description: err.response?.data.message,
                    variant: 'destructive'
                });
            }
            else {
                toast({
                    title: 'Failed to login!',
                    description: 'Something went wrong.',
                    variant: 'destructive'
                });
            }

        }
    });
};