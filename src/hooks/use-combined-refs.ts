import React from 'react';

//? USE:  this hook is used to available using of refs inside a component having forwarded ref

function useCombinedRefs<T>(
  ...refs: Array<((instance: T | null) => void) | React.MutableRefObject<T | null>>
): React.MutableRefObject<T | null> {
  const targetRef = React.useRef<T | null>(null);

  React.useEffect(() => {
    refs.forEach((ref) => {
      if (!ref) return;

      if (typeof ref === 'function') {
        ref(targetRef.current);
      } else {
        ref.current = targetRef.current;
      }
    });
  }, [refs]);

  return targetRef;
}

export default useCombinedRefs;
