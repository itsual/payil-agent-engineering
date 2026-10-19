import { describe, expect, it } from 'vitest';
import { glossary, stages } from '../data/stages';
import { glossaryHaystack, matchesQuery, stageHaystack } from './search';

const idsFor = (query: string) => stages.filter(stage => matchesQuery(stageHaystack(stage, glossary), query)).map(stage => stage.id);

describe('search', () => {
  it('matches every stage for an empty query', () => {
    expect(idsFor('')).toHaveLength(12);
    expect(idsFor('   ')).toHaveLength(12);
  });

  it('is case-insensitive and requires every term, in any order', () => {
    expect(matchesQuery('model context protocol tools', 'TOOLS protocol')).toBe(true);
    expect(matchesQuery('model context protocol tools', 'tools sandbox')).toBe(false);
  });

  it('finds stages by title, concept detail, task title and glossary term', () => {
    expect(idsFor('sandboxed')).toContain(6);
    expect(idsFor('idempotency')).toContain(1);
    expect(idsFor('circuit breaker')).toContain(11);
    expect(idsFor('Set-of-Mark')).toContain(3);
  });

  it('returns nothing for gibberish', () => {
    expect(idsFor('zzzzqqq')).toEqual([]);
  });

  it('searches glossary terms and definitions', () => {
    const hits = glossary.filter(entry => matchesQuery(glossaryHaystack(entry), 'dag'));
    expect(hits.some(entry => entry.term === 'DAG')).toBe(true);
  });
});
