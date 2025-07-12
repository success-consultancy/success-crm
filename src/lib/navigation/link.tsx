'use client';

import React from 'react';
//eslint-disable-next-line
import NextLink, { LinkProps as ILinkProps } from 'next/link';

import { isRouteChanged } from './helpers';
import useNavigationBlockerState from './nav-store';

interface LinkProps extends ILinkProps {
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  target?: React.HTMLAttributeAnchorTarget;
  rel?: string;
  disabled?: boolean;
}

const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(({ onClick, ...props }, ref) => {
  const { isBlocked, setIsAlertShown, setTarget } = useNavigationBlockerState();

  return (
    <NextLink
      ref={ref}
      onClick={(e) => {
        if (props.disabled) {
          e.preventDefault();
        }
        onClick?.(e);
        setTarget({
          url: props.href as string,
          type: props.replace ? 'replace' : 'push',
        });

        // if navigation is blocked and the route is changed
        if (isBlocked && isRouteChanged(props.href as string, e)) {
          e.preventDefault();
          setIsAlertShown(true);
        }
      }}
      {...props}
    />
  );
});

export { Link };
export type { LinkProps };
