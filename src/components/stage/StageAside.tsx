import { CheckCircle2, CircleDashed, Clock3, ExternalLink, GraduationCap, ShieldCheck } from 'lucide-react';
import type { Stage } from '../../data/types';
import type { Progress } from '../../lib/progress';

export function StageAside({ stage, progress }: { stage: Stage; progress: Progress }) {
  const key = String(stage.id);
  const tasks = (progress.checked[key] ?? []).length;
  const total = stage.practice.length;
  const complete = progress.completed.includes(stage.id);
  const quizPassed = progress.quizzes[key] === true;

  return (
    <aside className="stage-aside" aria-label="Stage progress and references">
      <section className="aside-card">
        <div className="aside-icon" aria-hidden="true">
          <GraduationCap size={20} />
        </div>
        <h2>Your stage progress</h2>
        <div className="big-stat">
          {tasks}
          <span> / {total}</span>
        </div>
        <div className="meter" role="progressbar" aria-label="Design tasks checked" aria-valuemin={0} aria-valuemax={total} aria-valuenow={tasks}>
          <span style={{ width: `${(tasks / total) * 100}%` }} />
        </div>
        <p>Design tasks checked</p>
        <ul className="status-list">
          <li className={quizPassed ? 'ok' : ''}>
            {quizPassed ? <CheckCircle2 size={15} aria-hidden="true" /> : <CircleDashed size={15} aria-hidden="true" />}
            {quizPassed ? 'Knowledge check passed' : 'Knowledge check not passed yet'}
          </li>
          <li className={complete ? 'ok' : ''}>
            {complete ? <CheckCircle2 size={15} aria-hidden="true" /> : <Clock3 size={15} aria-hidden="true" />}
            {complete ? 'Marked complete' : 'In progress'}
          </li>
        </ul>
      </section>

      <section className="aside-card resource-card">
        <h2>Primary references</h2>
        <p>Learn from the official sources. Documentation changes, so check the version you are using.</p>
        {stage.resources.map(resource => (
          <a key={resource.url} href={resource.url} target="_blank" rel="noreferrer">
            <span>
              <b>{resource.title}</b>
              <small>{resource.note}</small>
            </span>
            <ExternalLink size={15} aria-hidden="true" />
            <span className="sr-only">(opens in a new tab)</span>
          </a>
        ))}
      </section>

      <p className="aside-note">
        <ShieldCheck size={17} aria-hidden="true" />
        All practice here is conceptual. No APIs, servers, databases or execution environments are connected.
      </p>
    </aside>
  );
}
