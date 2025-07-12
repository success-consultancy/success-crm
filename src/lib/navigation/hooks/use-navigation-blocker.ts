'use client';

import React from 'react';

import useNavigationBlockerState from '../nav-store';
import { useNavigationAllow } from '../hooks/use-navigation-allow';

/** info: this hook is used to block navigation when the state is true
 * @param isNavigationBlocked - the state to block navigation
 * @returns a function to allow navigation and state of the blocker
 */
const useNavigationBlocker = (isNavigationBlocked: boolean) => {
  const { setIsBlocked, ...rest } = useNavigationBlockerState();
  const allowNavigation = useNavigationAllow();

  React.useEffect(() => {
    setIsBlocked(isNavigationBlocked);

    // cleanup function to reset the blocker state
    return () => {
      setIsBlocked(false);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isNavigationBlocked]);

  return { setIsBlocked, allowNavigation, ...rest };
};

export { useNavigationBlocker };
