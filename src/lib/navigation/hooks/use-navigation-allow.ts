'use client';

//eslint-disable-next-line
import { useRouter } from 'next/navigation';

import useNavigationBlockerState from '../nav-store';

/**
 * info: this hook is used to allow navigation from the blocked state
 */
const useNavigationAllow = () => {
  const { target, setIsBlocked } = useNavigationBlockerState();

  const router = useRouter();

  const allowNavigation = () => {
    setIsBlocked(false);

    if (!target?.url) return;

    if (target?.type === 'replace') {
      router.replace(target?.url);
    } else {
      router.push(target?.url, {});
    }
  };

  return allowNavigation;
};

export { useNavigationAllow };
