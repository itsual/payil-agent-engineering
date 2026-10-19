import { ArrowRight, Check, FileText, Target } from 'lucide-react';
import { labsForStage } from '../../data/labs';
import type { Stage } from '../../data/types';
import type { Progress } from '../../lib/progress';
import { LabCard } from './LabCard';
import { PanelHeading } from './PanelHeading';

type Props = {
  stage: Stage;
  progress: Progress;
  onToggleTask: (taskIndex: number) => void;
  onNext: () => void;
};

export function PracticePanel({ stage, progress, onToggleTask, onNext }: Props) {
  const checked = progress.checked[String(stage.id)] ?? [];
  const labs = labsForStage(stage.id);

  return (
    <section className="learning-panel">
      <PanelHeading icon={<Target size={20} />} overline="Design before code" title="What to practise" tone="lilac" />
      <p className="panel-intro">
        These are structured design exercises, not executable labs. Work each one through on paper or in a document, then tick it off.
        Nothing here connects to a model, a database or a sandbox.
      </p>

      <ul className="practice-list">
        {stage.practice.map((task, index) => {
          const done = checked.includes(index);
          const inputId = `task-${stage.id}-${index}`;
          return (
            <li key={task.title}>
              <label className={`practice-item ${done ? 'done' : ''}`} htmlFor={inputId}>
                <input id={inputId} type="checkbox" checked={done} onChange={() => onToggleTask(index)} />
                <span className="custom-check" aria-hidden="true">
                  {done && <Check size={14} />}
                </span>
                <span>
                  <b>{task.title}</b>
                  <small>{task.detail}</small>
                </span>
              </label>
            </li>
          );
        })}
      </ul>

      <div className="deliverables">
        <h3>
          <FileText size={17} aria-hidden="true" /> Your design deliverables
        </h3>
        <ul>
          {stage.deliverables.map(item => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>

      {labs.map(lab => (
        <LabCard key={lab.slug} lab={lab} />
      ))}

      <button type="button" className="inline-next" onClick={onNext}>
        Next: understand the trade-offs <ArrowRight size={16} aria-hidden="true" />
      </button>
    </section>
  );
}
