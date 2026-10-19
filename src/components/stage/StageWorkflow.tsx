import { useState } from 'react';
import { Maximize2 } from 'lucide-react';
import { workflowSource } from '../../data/stages';
import type { Stage } from '../../data/types';
import { Modal } from '../common/Modal';
import { MermaidDiagram } from '../diagram/MermaidDiagram';

/** The stage's own Mermaid workflow (`src/data/workflows/<slug>.mmd`), with its caption and an expanded viewer. */
export function StageWorkflow({ stage }: { stage: Stage }) {
  const [expanded, setExpanded] = useState(false);
  const source = workflowSource(stage);
  if (!source) return null;
  const label = `${stage.workflow.title}. ${stage.workflow.caption}`;
  const titleId = `workflow-title-${stage.id}`;

  return (
    <figure className="workflow">
      <figcaption>
        <div>
          <span className="overline">Workflow · see the whole flow first</span>
          <h3>{stage.workflow.title}</h3>
          <p>{stage.workflow.caption}</p>
        </div>
        <button type="button" className="btn secondary compact" onClick={() => setExpanded(true)}>
          <Maximize2 size={14} aria-hidden="true" /> Expand
          <span className="sr-only"> the {stage.workflow.title} diagram</span>
        </button>
      </figcaption>
      <div className="panel diagram-panel">
        <MermaidDiagram source={source} label={label} />
      </div>

      {expanded && (
        <Modal titleId={titleId} size="wide" onClose={() => setExpanded(false)}>
          <h2 id={titleId}>{stage.workflow.title}</h2>
          <p>{stage.workflow.caption}</p>
          <div className="panel diagram-panel modal-diagram">
            <MermaidDiagram source={source} label={label} natural />
          </div>
        </Modal>
      )}
    </figure>
  );
}
