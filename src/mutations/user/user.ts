import axios from "axios";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { ProfileSchemaType } from "@/schemas/profile-schema";

const updateUser = async (payload: ProfileSchemaType) => {
  const url = "/user/" + payload.id;

  delete payload.id;
  delete payload.role;
  delete payload.bio;

  const res = await api.put(url, payload);
  return res.data;
};

export const useUserUpdate = () => {
  const { toast } = useToast();
  return useMutation({
    mutationFn: updateUser,
    onSuccess: () => {
      toast({
        title: "User updated Successfully!",
      });
    },
    onError: (err) => {
      if (axios.isAxiosError(err)) {
        toast({
          title: "Failed to login!",
          description: err.response?.data.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Failed to login!",
          description: "Something went wrong.",
          variant: "destructive",
        });
      }
    },
  });
};
