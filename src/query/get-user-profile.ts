import { api } from "@/lib/api";
import { IUser } from "@/types/leads/leads-types";
import { useQuery } from "@tanstack/react-query";

export const GET_USER = "get-user";

const getUser = async (userId: string) => {
  const { data } = await api.get("/user/" + userId);
  return data as IUser;
};

export const useGetUserProfile = () => {
  const userId = "1"; // Replace with the actual user ID you want to fetch inf
  return useQuery({
    queryFn: () => getUser(userId),
    queryKey: [GET_USER, userId],
    refetchOnWindowFocus: false,
  });
};
