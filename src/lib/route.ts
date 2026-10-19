import { STAGE_COUNT } from '../data/stages';

export type StageTab = 'learn' | 'practice' | 'why' | 'check';
export type Route =
  | { view: 'roadmap' }
  | { view: 'glossary' }
  | { view: 'stage'; id: number; tab: StageTab };

export const stageTabs: StageTab[] = ['learn', 'practice', 'why', 'check'];
const isTab = (value: string | undefined): value is StageTab => stageTabs.includes(value as StageTab);

/**
 * Hash routes keep the app a plain static site (no server rewrites) and give every stage a shareable URL:
 *   #/                      roadmap
 *   #/stage/3               stage 3, Learn tab
 *   #/stage/3/practice      stage 3, Practice tab
 *   #/glossary              glossary
 */
export function parseHash(hash: string): Route {
  const parts = hash.replace(/^#\/?/, '').split('/').filter(Boolean);
  if (parts[0] === 'glossary') return { view: 'glossary' };
  if (parts[0] === 'stage') {
    const id = Number(parts[1]);
    if (Number.isInteger(id) && id >= 1 && id <= STAGE_COUNT) {
      return { view: 'stage', id, tab: isTab(parts[2]) ? parts[2] : 'learn' };
    }
  }
  return { view: 'roadmap' };
}

export function toHash(route: Route): string {
  if (route.view === 'glossary') return '#/glossary';
  if (route.view === 'stage') return route.tab === 'learn' ? `#/stage/${route.id}` : `#/stage/${route.id}/${route.tab}`;
  return '#/';
}

export const sameRoute = (a: Route, b: Route): boolean => toHash(a) === toHash(b);
