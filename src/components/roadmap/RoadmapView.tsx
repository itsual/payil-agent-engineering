import { ArrowRight, BookOpen, CheckCircle2, ShieldCheck, Target } from 'lucide-react';
import type { Progress } from '../../lib/progress';
import { scrollToId } from '../../lib/dom';
import { Hero } from './Hero';
import { MapSection } from './MapSection';
import { StageCatalog } from './StageCatalog';

type Props = {
  progress: Progress;
  nextStageId: number;
  onOpenStage: (id: number) => void;
};

const principles = [
  { Icon: ShieldCheck, label: 'Security by design' },
  { Icon: Target, label: 'Practice-led learning' },
  { Icon: BookOpen, label: 'No backend, no login' },
  { Icon: CheckCircle2, label: 'Private, local progress' },
];

export function RoadmapView({ progress, nextStageId, onOpenStage }: Props) {
  return (
    <>
      <Hero
        progress={progress}
        nextStageId={nextStageId}
        onStart={() => onOpenStage(nextStageId)}
        onViewPath={() => scrollToId('journey-map')}
      />

      <ul className="info-strip" aria-label="Principles">
        {principles.map(({ Icon, label }) => (
          <li key={label}>
            <Icon size={15} aria-hidden="true" /> {label}
          </li>
        ))}
      </ul>

      <MapSection progress={progress} onOpenStage={onOpenStage} />
      <StageCatalog progress={progress} onOpenStage={onOpenStage} />

      <section className="next-banner" aria-labelledby="next-heading">
        <div>
          <span className="overline">Your next move</span>
          <h2 id="next-heading">Understand the system. Then build one.</h2>
          <p>
            This edition is deliberately learning-only. Hands-on labs and worked examples can be added stage by stage, without
            rewriting the platform, through the content contract documented in the repository.
          </p>
        </div>
        <button type="button" className="btn primary" onClick={() => onOpenStage(nextStageId)}>
          Open stage {String(nextStageId).padStart(2, '0')}
          <ArrowRight size={16} aria-hidden="true" />
        </button>
      </section>
    </>
  );
}
