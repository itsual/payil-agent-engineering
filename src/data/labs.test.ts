import { describe, expect, it } from 'vitest';
import { indexLabs, labsForStage, parseLab } from './labs';

const valid = {
  stageId: 6,
  title: 'Run untrusted code in a throwaway sandbox',
  summary: 'Execute a synthetic snippet inside an isolated, network-less container.',
  estimatedTime: '2 hours',
  objectives: ['Apply CPU, memory and time limits'],
  safety: ['Synthetic data only', 'Network egress disabled'],
};

describe('lab manifests', () => {
  it('accepts a well-formed manifest and fills optional lists', () => {
    expect(parseLab('06-sandbox', valid)).toEqual({ ...valid, slug: '06-sandbox', prerequisites: [], verification: [] });
  });

  it.each([
    ['a missing safety section', { ...valid, safety: [] }],
    ['an out-of-range stage', { ...valid, stageId: 13 }],
    ['a non-integer stage', { ...valid, stageId: 2.5 }],
    ['an empty title', { ...valid, title: '  ' }],
    ['no objectives', { ...valid, objectives: [] }],
    ['a non-string objective', { ...valid, objectives: [42] }],
    ['a non-object', 'nope'],
    ['null', null],
  ])('rejects %s', (_name, input) => {
    expect(parseLab('x', input)).toBeNull();
  });

  it('indexes labs by stage using the folder name as the slug and skips invalid ones', () => {
    const index = indexLabs({
      '../../content/labs/06-sandbox/lab.json': valid,
      '../../content/labs/06-second/lab.json': { ...valid, title: 'Second lab' },
      '../../content/labs/07-broken/lab.json': { ...valid, stageId: 7, safety: [] },
    });
    expect(index.get(6)?.map(lab => lab.slug)).toEqual(['06-sandbox', '06-second']);
    expect(index.has(7)).toBe(false);
  });

  it('ships no labs in v1, so no stage shows a lab card', () => {
    for (let id = 1; id <= 12; id++) expect(labsForStage(id)).toEqual([]);
  });
});
