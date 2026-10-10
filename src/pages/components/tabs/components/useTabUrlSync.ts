import { useCallback, useEffect, useState } from 'react';

/**
 * Keeps the active tab in the URL query (?tab=activity) so a view can be shared and survives refresh.
 * Uses replaceState (no extra history entries) and listens for back/forward. Listener removed on unmount.
 */
export function useTabUrlSync(param: string, ids: string[], fallback: string): [string, (id: string) => void, string] {
  const read = useCallback(() => {
    const v = new URLSearchParams(window.location.search).get(param);
    return v && ids.includes(v) ? v : fallback;
  }, [param, ids, fallback]);

  const [value, setValue] = useState<string>(read);
  const [url, setUrl] = useState(() => window.location.pathname + window.location.search);

  useEffect(() => {
    const onPop = () => setValue(read());
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, [read]);

  const set = useCallback(
    (id: string) => {
      setValue(id);
      const u = new URL(window.location.href);
      u.searchParams.set(param, id);
      window.history.replaceState(window.history.state, '', u);
      setUrl(u.pathname + u.search);
    },
    [param]
  );

  return [value, set, url];
}
