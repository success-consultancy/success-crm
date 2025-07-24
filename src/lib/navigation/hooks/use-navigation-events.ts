'use client';
import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

interface NavigationEvents {
  onComplete?: () => void;
}

function useNavigationEvents({ onComplete }: NavigationEvents) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  //   navigation complete
  useEffect(() => onComplete?.(), [pathname, searchParams, onComplete]);
  return null;
}

export { useNavigationEvents };
