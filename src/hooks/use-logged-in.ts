import { useGetMe } from '@/query/get-me';

export const useIsLoggedIn = () => {
  const { data, isLoading, isError } = useGetMe();

  return {
    isLoggedIn: Boolean(data),
    isLoading,
    isError,
    user: data,
  };
};
