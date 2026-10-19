import { ArrowRight, Lightbulb, ShieldCheck } from 'lucide-react';
import type { Stage } from '../../data/types';
import { PanelHeading } from './PanelHeading';

type Props = { stage: Stage; onNext: () => void };

export function WhyPanel({ stage, onNext }: Props) {
  return (
    <section className="learning-panel">
      <PanelHeading icon={<Lightbulb size={20} />} overline="Engineering judgment" title="Why it matters" tone="amber" />
      <p className="panel-intro">
        Ask which failure modes this design prevents, where it stops helping, and how you would verify the claim rather than assume it.
      </p>

      <ol className="why-list">
        {stage.why.map((line, index) => (
          <li className="why-point" key={line}>
            <span aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
            <p>{line}</p>
          </li>
        ))}
      </ol>

      <aside className="guardrail" aria-label="Production guardrail">
        <ShieldCheck size={20} aria-hidden="true" />
        <div>
          <b>Production guardrail</b>
          <p>{stage.guardrail}</p>
        </div>
      </aside>

      <button type="button" className="inline-next" onClick={onNext}>
        Next: test your understanding <ArrowRight size={16} aria-hidden="true" />
      </button>
    </section>
  );
}
