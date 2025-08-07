import { useEffect } from 'react';
import { useHeaderStore } from '@/store/header-store';

export const usePageTitle = (title: string) => {
  const { setTitle } = useHeaderStore();

  useEffect(() => {
    setTitle(title);
  }, [title, setTitle]);
};
