import { ArrowRight, ChevronRight } from 'lucide-react';
import { BRAND } from '../../config';
import { STAGE_COUNT } from '../../data/stages';
import { phaseInfo } from '../../data/phases';
import { completionOf } from '../../lib/progress';
import type { Progress } from '../../lib/progress';
import { ProgressRing } from '../common/ProgressRing';

type Props = {
  progress: Progress;
  nextStageId: number;
  onStart: () => void;
  onViewPath: () => void;
};

export function Hero({ progress, nextStageId, onStart, onViewPath }: Props) {
  const done = progress.completed.length;
  const fraction = done / STAGE_COUNT;
  const started = done > 0 || Object.keys(progress.checked).length > 0;

  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero-art" aria-hidden="true">
        <span className="orbit o1" />
        <span className="orbit o2" />
        <span className="orbit o3" />
        <span className="node n1" />
        <span className="node n2" />
        <span className="node n3" />
        <span className="hero-glow" />
      </div>

      <div className="hero-copy">
        <p className="eyebrow">
          <span className="eyebrow-line" aria-hidden="true" />
          <span lang="ta">{BRAND.native}</span> · {BRAND.meaning}
        </p>
        <h1 id="hero-title">
          Learn to Engineer <em>Intelligent Agents.</em>
        </h1>
        <p className="lede">
          Twelve practical stages from agent architecture to production readiness: how real AI agents are structured, secured,
          evaluated and operated. Build the engineering judgment first, then the code.
        </p>
        <div className="hero-actions">
          <button type="button" className="btn primary" onClick={onStart}>
            {started ? 'Continue learning' : 'Start learning'}
            <ArrowRight size={17} aria-hidden="true" />
          </button>
          <button type="button" className="btn ghost" onClick={onViewPath}>
            View the learning path
            <ChevronRight size={16} aria-hidden="true" />
          </button>
        </div>
        <p className="hero-meaning">
          <b>
            {BRAND.name} (<span lang="ta">{BRAND.native}</span>)
          </b>{' '}
          is Tamil for “learn and practise”. Every stage pairs ideas with a design exercise.
          {started && <span className="hero-next"> Next up: stage {String(nextStageId).padStart(2, '0')}.</span>}
        </p>
      </div>

      <aside className="hero-card" aria-label="Your progress">
        <ProgressRing value={fraction} size={112} stroke={10}>
          <b>{Math.round(fraction * 100)}%</b>
          <span>complete</span>
        </ProgressRing>
        <div className="hero-card-body">
          <h2>
            {done} of {STAGE_COUNT} stages
          </h2>
          <ul className="phase-meters">
            {phaseInfo.map(phase => {
              const ids = Array.from({ length: phase.to - phase.from + 1 }, (_, i) => phase.from + i);
              const complete = ids.filter(id => progress.completed.includes(id)).length;
              return (
                <li key={phase.key} data-phase={phase.key}>
                  <div>
                    <span>{phase.phase}</span>
                    <b>
                      {complete}/{ids.length}
                    </b>
                  </div>
                  <div className="meter" aria-hidden="true">
                    <span style={{ width: `${completionOf(progress, ids) * 100}%` }} />
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </aside>
    </section>
  );
}
