import { useCallback, useEffect, useRef, useState } from 'react';

export type ScrollShadowState = {
  hasScrolledLeft: boolean;
  hasScrolledRight: boolean;
};

export default function useScrollShadows<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);

  const [state, setState] = useState<ScrollShadowState>({
    hasScrolledLeft: false,
    hasScrolledRight: false,
  });

  const updateShadows = useCallback(() => {
    const el = ref.current;
    if (!el) return;

    const { scrollLeft, scrollWidth, clientWidth } = el;

    setState({
      hasScrolledLeft: scrollLeft > 0,
      // -1px buffer absorbs subpixel rounding so the shadow doesn't flicker at the scroll end
      hasScrolledRight: scrollLeft < scrollWidth - clientWidth - 1,
    });
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    updateShadows();

    el.addEventListener('scroll', updateShadows, { passive: true });

    const resizeObserver = new ResizeObserver(updateShadows);
    resizeObserver.observe(el);

    return () => {
      el.removeEventListener('scroll', updateShadows);
      resizeObserver.disconnect();
    };
  }, [updateShadows]);

  return { ref, updateShadows, ...state };
}
