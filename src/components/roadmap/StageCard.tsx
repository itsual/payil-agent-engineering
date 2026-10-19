import { ArrowUpRight, Check, CheckCircle2, Clock3, ListChecks } from 'lucide-react';
import { phaseKeyOf } from '../../data/phases';
import type { Stage } from '../../data/types';
import type { Progress } from '../../lib/progress';
import { toHash } from '../../lib/route';
import { iconFor } from '../stageIcons';

type Props = {
  stage: Stage;
  progress: Progress;
  onOpen: (id: number) => void;
};

/** A catalog card. The title is a real link (stretched over the card), so it works with middle-click and “copy link”. */
export function StageCard({ stage, progress, onOpen }: Props) {
  const Icon = iconFor(stage.id);
  const done = progress.completed.includes(stage.id);
  const tasks = (progress.checked[String(stage.id)] ?? []).length;
  const quizPassed = progress.quizzes[String(stage.id)] === true;

  return (
    <article className={`stage-card ${done ? 'is-done' : ''}`} data-phase={phaseKeyOf(stage.phase)}>
      <div className="card-top">
        <span className="card-index">Stage {String(stage.id).padStart(2, '0')}</span>
        {done ? (
          <span className="card-status">
            <Check size={13} aria-hidden="true" /> Complete
          </span>
        ) : (
          <ArrowUpRight size={19} className="card-arrow" aria-hidden="true" />
        )}
      </div>
      <div className="card-symbol">
        <Icon size={24} strokeWidth={1.8} aria-hidden="true" />
      </div>
      <h3>
        <a
          href={toHash({ view: 'stage', id: stage.id, tab: 'learn' })}
          onClick={event => {
            if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;
            event.preventDefault();
            onOpen(stage.id);
          }}
        >
          {stage.title}
        </a>
      </h3>
      <p>{stage.summary}</p>
      <div className="card-meta">
        <span title="Practice tasks you have checked">
          <ListChecks size={13} aria-hidden="true" /> {tasks}/{stage.practice.length} tasks
        </span>
        {quizPassed && (
          <span title="Knowledge check answered correctly">
            <CheckCircle2 size={13} aria-hidden="true" /> Quiz passed
          </span>
        )}
      </div>
      <div className="card-bottom">
        <span className="phase-name">
          <i aria-hidden="true" /> {stage.phase}
        </span>
        <span className="card-duration">
          <Clock3 size={13} aria-hidden="true" /> {stage.duration}
        </span>
      </div>
    </article>
  );
}
