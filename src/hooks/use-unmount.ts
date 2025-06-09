import { useEffect, useRef } from 'react';

/** Custom hook that runs a cleanup function when the component is unmounted. */
function useUnmount(func: () => void) {
  const funcRef = useRef(func);

  funcRef.current = func;

  useEffect(
    () => () => {
      funcRef.current();
    },
    [],
  );
}

export default useUnmount;
