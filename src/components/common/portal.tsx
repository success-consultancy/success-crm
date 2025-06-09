'use client';

import { createPortal } from 'react-dom';
import { useEffect, useState, ReactNode } from 'react';
import { PortalIds } from '@/app/config/portal';

interface PortalProps {
  rootId: PortalIds;
  children: ReactNode;
  rootClassName?: string;
}

const Portal = ({ children, rootId, rootClassName }: PortalProps) => {
  const [mounted, setMounted] = useState(false);
  const node = typeof window !== 'undefined' ? document.getElementById(rootId) : null;

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (rootClassName) node?.classList.add(rootClassName);

    return () => {
      if (rootClassName) node?.classList.remove(rootClassName);
    };
  }, [rootClassName, node]);

  return mounted ? createPortal(children, node!) : null;
};

export default Portal;
