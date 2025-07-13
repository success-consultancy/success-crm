import * as React from "react";

export function useIsMobile(isMessagesPage: boolean = false) {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(false);
  const MOBILE_BREAKPOINT = isMessagesPage ? 1024 : 768;
  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    mql.addEventListener("change", onChange);
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    return () => mql.removeEventListener("change", onChange);
  }, [MOBILE_BREAKPOINT]);

  return !!isMobile;
}
