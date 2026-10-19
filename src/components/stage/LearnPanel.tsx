import { ArrowRight, BookOpen } from 'lucide-react';
import type { Stage } from '../../data/types';
import { PanelHeading } from './PanelHeading';
import { StageWorkflow } from './StageWorkflow';

type Props = { stage: Stage; onNext: () => void };

export function LearnPanel({ stage, onNext }: Props) {
  return (
    <section className="learning-panel">
      <PanelHeading icon={<BookOpen size={20} />} overline="Build the mental model" title="What to learn" />
      <p className="panel-intro">
        Understand these concepts before you attempt the exercise. Focus on the boundaries, trade-offs and decisions behind each term
        rather than memorising names.
      </p>

      <StageWorkflow stage={stage} />

      <ol className="lesson-list">
        {stage.learn.map((lesson, index) => (
          <li className="lesson" key={lesson.concept}>
            <span className="lesson-number" aria-hidden="true">
              {String(index + 1).padStart(2, '0')}
            </span>
            <div>
              <h3>{lesson.concept}</h3>
              <p>{lesson.detail}</p>
            </div>
          </li>
        ))}
      </ol>

      <button type="button" className="inline-next" onClick={onNext}>
        Next: design the exercise <ArrowRight size={16} aria-hidden="true" />
      </button>
    </section>
  );
}
