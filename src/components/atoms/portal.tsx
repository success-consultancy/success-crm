'use client';

import { createPortal } from 'react-dom';
import { useEffect, useState, ReactNode } from 'react';
import { PortalIds } from '@/config/portal';

interface PortalProps {
  rootId: PortalIds;
  children: ReactNode;
  rootClassName?: string;
}

const Portal = ({ children, rootId, rootClassName }: PortalProps) => {
  const [mounted, setMounted] = useState(false);
  const [node, setNode] = useState<HTMLElement | null>(null);

  useEffect(() => {
    const target = document.getElementById(rootId);
    if (target) {
      setNode(target);
      if (rootClassName) {
        target.classList.add(rootClassName);
      }
    }

    setMounted(true);

    return () => {
      if (target && rootClassName) {
        target.classList.remove(rootClassName);
      }
    };
  }, [rootId, rootClassName]);

  if (!mounted || !node) return null;

  return createPortal(children, node);
};

export default Portal;
