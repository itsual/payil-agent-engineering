const prefersReducedMotion = () =>
  typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Smooth scrolling unless the visitor asked for reduced motion. */
export const scrollBehavior = (): ScrollBehavior => (prefersReducedMotion() ? 'auto' : 'smooth');

export function scrollToTop(): void {
  window.scrollTo({ top: 0, behavior: scrollBehavior() });
}

export function scrollToId(id: string): void {
  document.getElementById(id)?.scrollIntoView({ behavior: scrollBehavior(), block: 'start' });
}
