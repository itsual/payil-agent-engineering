import { describe, expect, it } from 'vitest';
import { parseHash, sameRoute, toHash } from './route';
import type { Route } from './route';

describe('hash routing', () => {
  it.each([
    ['', { view: 'roadmap' }],
    ['#', { view: 'roadmap' }],
    ['#/', { view: 'roadmap' }],
    ['#/glossary', { view: 'glossary' }],
    ['#/stage/3', { view: 'stage', id: 3, tab: 'learn' }],
    ['#/stage/12/check', { view: 'stage', id: 12, tab: 'check' }],
    ['#/stage/5/practice', { view: 'stage', id: 5, tab: 'practice' }],
    ['#/stage/5/unknown', { view: 'stage', id: 5, tab: 'learn' }],
    ['#/stage/0', { view: 'roadmap' }],
    ['#/stage/13', { view: 'roadmap' }],
    ['#/stage/abc', { view: 'roadmap' }],
    ['#/stage/2.5', { view: 'roadmap' }],
    ['#/nonsense', { view: 'roadmap' }],
    ['#main', { view: 'roadmap' }],
  ] as [string, Route][])('parses %j', (hash, expected) => {
    expect(parseHash(hash)).toEqual(expected);
  });

  it('round-trips every stage and tab', () => {
    for (let id = 1; id <= 12; id++) {
      for (const tab of ['learn', 'practice', 'why', 'check'] as const) {
        const route: Route = { view: 'stage', id, tab };
        expect(parseHash(toHash(route))).toEqual(route);
      }
    }
    expect(parseHash(toHash({ view: 'glossary' }))).toEqual({ view: 'glossary' });
    expect(parseHash(toHash({ view: 'roadmap' }))).toEqual({ view: 'roadmap' });
  });

  it('writes the Learn tab without a suffix and compares routes by URL', () => {
    expect(toHash({ view: 'stage', id: 4, tab: 'learn' })).toBe('#/stage/4');
    expect(toHash({ view: 'stage', id: 4, tab: 'why' })).toBe('#/stage/4/why');
    expect(sameRoute({ view: 'stage', id: 4, tab: 'learn' }, parseHash('#/stage/4'))).toBe(true);
  });
});
