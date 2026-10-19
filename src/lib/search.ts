import type { GlossaryEntry, Stage } from '../data/types';

const normalize = (text: string) => text.toLowerCase().replace(/\s+/g, ' ').trim();

/** Every term must appear somewhere in the haystack (order-independent, case-insensitive). */
export function matchesQuery(haystack: string, query: string): boolean {
  const terms = normalize(query).split(' ').filter(Boolean);
  return terms.every(term => haystack.includes(term));
}

/** Searchable text for a stage: its titles, summary, concepts, tasks and the glossary terms taught in it. */
export function stageHaystack(stage: Stage, glossary: GlossaryEntry[]): string {
  return normalize(
    [
      stage.title,
      stage.shortTitle,
      stage.phase,
      stage.summary,
      stage.outcome,
      ...stage.learn.flatMap(item => [item.concept, item.detail]),
      ...stage.practice.map(item => item.title),
      ...glossary.filter(entry => entry.stage === stage.id).map(entry => entry.term),
    ].join(' '),
  );
}

export const glossaryHaystack = (entry: GlossaryEntry): string => normalize(`${entry.term} ${entry.definition}`);
