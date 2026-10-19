import { useCallback, useMemo, useSyncExternalStore } from 'react';
import { parseHash, toHash } from '../lib/route';
import type { Route } from '../lib/route';

const subscribe = (notify: () => void) => {
  window.addEventListener('hashchange', notify);
  return () => window.removeEventListener('hashchange', notify);
};
const getSnapshot = () => window.location.hash;
const getServerSnapshot = () => '';

/** The current hash route plus a `navigate` function. Browser back/forward just work. */
export function useRoute(): [Route, (next: Route) => void] {
  const hash = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const route = useMemo(() => parseHash(hash), [hash]);
  const navigate = useCallback((next: Route) => {
    const target = toHash(next);
    if (window.location.hash === target || (target === '#/' && window.location.hash === '')) return;
    window.location.hash = target;
  }, []);
  return [route, navigate];
}
