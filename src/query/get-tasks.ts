import { QUERY_KEYS } from "@/constants/query-keys";
import { api } from "@/lib/api";
import QueryString from "qs";
import { useQuery } from "@tanstack/react-query";

interface TaskFilterParams {
  userId?: number;
  status?: string;
}

const getTasks = async (params: TaskFilterParams) => {
  const res = await api.get(
    "/todo?" + QueryString.stringify(params, { arrayFormat: "repeat" })
  );

  return res.data as any;
};

export const useGetTasks = (params: TaskFilterParams) => {
  return useQuery({
    queryFn: () => getTasks(params),
    queryKey: [QUERY_KEYS.GET_TASKS, params],
    refetchOnWindowFocus: false,
  });
};
