import type { CSSProperties } from 'react';
import { useMermaid } from './useMermaid';

type Props = {
  source: string;
  /** Accessible description of what the diagram shows. */
  label: string;
  /** Smallest width the diagram may shrink to before the panel scrolls horizontally (px). */
  minWidth?: number;
  /** Draw at the diagram's natural size instead of shrinking it to fit (used by the expanded viewer). */
  natural?: boolean;
};

/** A read-only Mermaid diagram inside a keyboard-scrollable region. */
export function MermaidDiagram({ source, label, minWidth = 520, natural = false }: Props) {
  const state = useMermaid(source);
  return (
    <div className="diagram-scroller" role="region" aria-label={`${label} (scrollable)`} tabIndex={0} style={{ '--diagram-min': `${minWidth}px` } as CSSProperties}>
      {state.status === 'ready' && (
        <div className={`diagram-canvas ${natural ? 'natural' : ''}`} role="img" aria-label={label} dangerouslySetInnerHTML={{ __html: state.svg }} />
      )}
      {state.status === 'loading' && <div className="diagram-message" aria-live="polite">Drawing the diagram…</div>}
      {state.status === 'error' && (
        <div className="diagram-message" role="alert">
          The diagram could not be drawn in this browser. The written lesson below covers the same flow.
        </div>
      )}
    </div>
  );
}
