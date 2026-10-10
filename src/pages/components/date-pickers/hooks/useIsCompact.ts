import { useEffect, useState } from 'react';

const useMedia = (query: string): boolean => {
  const [matches, setMatches] = useState(() => typeof window !== 'undefined' && window.matchMedia(query).matches);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const update = () => setMatches(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, [query]);
  return matches;
};

/** Below 768px popovers open as bottom sheets. */
export const useIsCompact = (): boolean => useMedia('(max-width: 767px)');

/** Coarse pointers get 40px day cells. */
export const useIsTouch = (): boolean => useMedia('(pointer: coarse)');
