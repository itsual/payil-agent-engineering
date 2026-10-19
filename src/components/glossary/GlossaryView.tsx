import { useMemo, useState } from 'react';
import { ArrowUpRight, Search, X } from 'lucide-react';
import { glossary, getStage, phases } from '../../data/stages';
import { phaseKeyOf } from '../../data/phases';
import type { Phase } from '../../data/types';
import { glossaryHaystack, matchesQuery } from '../../lib/search';
import { toHash } from '../../lib/route';

type PhaseFilter = 'All phases' | Phase;
const filters: PhaseFilter[] = ['All phases', ...phases];

const haystacks = new Map(glossary.map(entry => [entry.term, glossaryHaystack(entry)]));

export function GlossaryView({ onOpenStage }: { onOpenStage: (id: number) => void }) {
  const [query, setQuery] = useState('');
  const [phase, setPhase] = useState<PhaseFilter>('All phases');

  const entries = useMemo(
    () =>
      glossary.filter(entry => {
        const stage = getStage(entry.stage);
        return (
          (phase === 'All phases' || stage?.phase === phase) && matchesQuery(haystacks.get(entry.term) ?? '', query)
        );
      }),
    [phase, query],
  );

  return (
    <section className="glossary-page" aria-labelledby="glossary-title">
      <div className="glossary-hero">
        <span className="overline">A shared technical language</span>
        <h1 id="glossary-title">
          Concept glossary<span aria-hidden="true">.</span>
        </h1>
        <p>
          Quick definitions for the architecture, protocols, security controls and operating patterns used across the learning path. Each
          term links to the stage that teaches it.
        </p>
      </div>

      <div className="filters">
        <label className="search-box">
          <Search size={18} aria-hidden="true" />
          <span className="sr-only">Search the glossary</span>
          <input
            type="search"
            value={query}
            onChange={event => setQuery(event.target.value)}
            placeholder={`Search ${glossary.length} concepts…`}
          />
        </label>
        <div className="phase-filters" role="group" aria-label="Filter terms by phase">
          {filters.map(name => (
            <button key={name} type="button" className={`pill ${phase === name ? 'chosen' : ''}`} aria-pressed={phase === name} onClick={() => setPhase(name)}>
              {name}
            </button>
          ))}
        </div>
        <span className="chip" aria-live="polite">
          {entries.length} / {glossary.length} terms
        </span>
      </div>

      {entries.length > 0 ? (
        <ul className="glossary-grid">
          {entries.map(entry => {
            const stage = getStage(entry.stage);
            return (
              <li key={entry.term}>
                <a
                  className="glossary-card"
                  data-phase={stage ? phaseKeyOf(stage.phase) : 'foundation'}
                  href={toHash({ view: 'stage', id: entry.stage, tab: 'learn' })}
                  onClick={event => {
                    if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;
                    event.preventDefault();
                    onOpenStage(entry.stage);
                  }}
                >
                  <span className="glossary-stage">
                    Stage {String(entry.stage).padStart(2, '0')}
                    <ArrowUpRight size={16} aria-hidden="true" />
                  </span>
                  <h2>{entry.term}</h2>
                  <p>{entry.definition}</p>
                </a>
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="empty-state">
          <p>No terms match that search.</p>
          <button
            type="button"
            className="btn secondary"
            onClick={() => {
              setQuery('');
              setPhase('All phases');
            }}
          >
            <X size={15} aria-hidden="true" /> Clear search and filters
          </button>
        </div>
      )}
    </section>
  );
}
