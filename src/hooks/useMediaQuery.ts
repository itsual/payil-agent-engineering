import { useSyncExternalStore } from 'react';

/** Tracks a CSS media query. Always false where `matchMedia` is unavailable (tests, SSR). */
export function useMediaQuery(query: string): boolean {
  const subscribe = (notify: () => void) => {
    if (typeof matchMedia !== 'function') return () => undefined;
    const list = matchMedia(query);
    list.addEventListener('change', notify);
    return () => list.removeEventListener('change', notify);
  };
  const getSnapshot = () => typeof matchMedia === 'function' && matchMedia(query).matches;
  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}
