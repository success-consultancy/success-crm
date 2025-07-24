"use client";

import { isRouteChanged } from "@/lib/navigation/helpers";
import useNavigationBlockerState from "./nav-store";

// eslint-disable-next-line
import { useRouter as useRouterOriginal } from "next/navigation";

export { useRouterOriginal };

export function useRouter(): ReturnType<typeof useRouterOriginal> {
  const router = useRouterOriginal();
  const { isBlocked, setIsAlertShown, setTarget } = useNavigationBlockerState();
  return {
    ...router,
    push: (href, options) => {
      setTarget({
        url: href,
        type: "push",
      });

      if (isBlocked && isRouteChanged(href)) {
        setIsAlertShown(true);
        return;
      }
      router.push(href, options);
    },
    replace: (href, options) => {
      setTarget({
        url: href,
        type: "replace",
      });

      if (isBlocked && isRouteChanged(href)) {
        setIsAlertShown(true);
        return;
      }
      router.replace(href, options);
    },
  };
}
