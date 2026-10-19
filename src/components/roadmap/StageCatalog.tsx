import { useMemo, useState } from 'react';
import { Filter, Search, X } from 'lucide-react';
import { STAGE_COUNT, glossary, phases, stages } from '../../data/stages';
import type { Phase } from '../../data/types';
import type { Progress } from '../../lib/progress';
import { matchesQuery, stageHaystack } from '../../lib/search';
import { StageCard } from './StageCard';

type PhaseFilter = 'All stages' | Phase;
const filters: PhaseFilter[] = ['All stages', ...phases];

// Built once: the curriculum is static, so there is no reason to re-normalise it on every keystroke.
const haystacks = new Map(stages.map(stage => [stage.id, stageHaystack(stage, glossary)]));

type Props = {
  progress: Progress;
  onOpenStage: (id: number) => void;
};

export function StageCatalog({ progress, onOpenStage }: Props) {
  const [query, setQuery] = useState('');
  const [phase, setPhase] = useState<PhaseFilter>('All stages');

  const visible = useMemo(
    () =>
      stages.filter(
        stage => (phase === 'All stages' || stage.phase === phase) && matchesQuery(haystacks.get(stage.id) ?? '', query),
      ),
    [phase, query],
  );
  const filtered = query.trim() !== '' || phase !== 'All stages';
  const clear = () => {
    setQuery('');
    setPhase('All stages');
  };

  return (
    <section id="curriculum" className="section" aria-labelledby="curriculum-heading">
      <div className="section-head">
        <div>
          <span className="overline">The curriculum</span>
          <h2 id="curriculum-heading">Explore every stage.</h2>
          <p>Each stage explains what to learn, how to practise it, and where the engineering decisions matter.</p>
        </div>
        <span className="chip" aria-live="polite">
          {visible.length} / {STAGE_COUNT} stages
        </span>
      </div>

      <div className="filters">
        <label className="search-box">
          <Search size={18} aria-hidden="true" />
          <span className="sr-only">Search stages</span>
          <input
            type="search"
            placeholder="Search concepts, tools, stages…"
            value={query}
            onChange={event => setQuery(event.target.value)}
          />
        </label>
        <div className="filter-label" aria-hidden="true">
          <Filter size={15} /> Filter
        </div>
        <div className="phase-filters" role="group" aria-label="Filter stages by phase">
          {filters.map(name => (
            <button key={name} type="button" className={`pill ${phase === name ? 'chosen' : ''}`} aria-pressed={phase === name} onClick={() => setPhase(name)}>
              {name}
            </button>
          ))}
        </div>
      </div>

      {visible.length > 0 ? (
        <div className="stage-grid">
          {visible.map(stage => (
            <StageCard key={stage.id} stage={stage} progress={progress} onOpen={onOpenStage} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <p>No stages match that search. Try another topic, or clear the filters.</p>
          <button type="button" className="btn secondary" onClick={clear}>
            <X size={15} aria-hidden="true" /> Clear search and filters
          </button>
        </div>
      )}
      {filtered && visible.length > 0 && (
        <p className="filter-note">
          Showing {visible.length} of {STAGE_COUNT} stages.{' '}
          <button type="button" className="link-btn" onClick={clear}>
            Show all
          </button>
        </p>
      )}
    </section>
  );
}
