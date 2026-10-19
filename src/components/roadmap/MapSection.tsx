import { ArrowRight, Map as MapIcon } from 'lucide-react';
import { STAGE_COUNT } from '../../data/stages';
import type { Progress } from '../../lib/progress';
import { RoadmapDiagram } from '../diagram/RoadmapDiagram';

type Props = {
  progress: Progress;
  onOpenStage: (id: number) => void;
};

export function MapSection({ progress, onOpenStage }: Props) {
  return (
    <section id="journey-map" className="section" aria-labelledby="map-heading">
      <div className="section-head">
        <div>
          <span className="overline">The big picture</span>
          <h2 id="map-heading">A workflow, not a checklist.</h2>
          <p>
            Follow the twelve stages in order. The diagram stays high-level on purpose: select any stage, or open it from the cards
            below, for the concepts, exercises, per-stage workflow and reasoning.
          </p>
        </div>
        <span className="chip">
          <MapIcon size={14} aria-hidden="true" /> Mermaid · high level
        </span>
      </div>

      <div className="panel diagram-panel">
        <div className="diagram-top">
          <span>
            <i className="dot" aria-hidden="true" /> Engineering learning path
          </span>
          <span className="diagram-hint">
            Select a stage · scroll sideways on small screens <ArrowRight size={12} aria-hidden="true" />
          </span>
        </div>
        <RoadmapDiagram completed={progress.completed} onOpenStage={onOpenStage} />
        <div className="diagram-legend">
          <span data-phase="foundation"><i aria-hidden="true" /> Foundations · 01–04</span>
          <span data-phase="systems"><i aria-hidden="true" /> Systems &amp; control · 05–08</span>
          <span data-phase="production"><i aria-hidden="true" /> Production readiness · 09–12</span>
          <span className="legend-count">
            {progress.completed.length}/{STAGE_COUNT} complete
          </span>
        </div>
      </div>
    </section>
  );
}
