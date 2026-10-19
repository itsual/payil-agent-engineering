import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { KeyboardEvent, MouseEvent } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getStage, roadmapDiagram, stages } from '../../data/stages';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { scrollBehavior } from '../../lib/dom';
import { useMermaid } from './useMermaid';

type Props = {
  completed: number[];
  onOpenStage: (id: number) => void;
};

/** Mermaid assigns node ids like `payil-diagram-2-flowchart-S07-6`; the roadmap source names nodes S01…S12. */
const NODE_STAGE = /flowchart-S(\d{2})-/;

/** The roadmap is the hero diagram, so its nodes are drawn larger than the per-stage diagrams (Mermaid frontmatter). */
const ROADMAP_STYLE = `---
config:
  flowchart:
    padding: 24
    nodeSpacing: 36
    rankSpacing: 52
---
`;

const stageOf = (target: EventTarget | null): number | null => {
  const node = target instanceof Element ? target.closest<SVGElement>('[data-stage]') : null;
  return node ? Number(node.dataset.stage) : null;
};

/**
 * The single high-level 12-stage workflow. Mermaid draws it; afterwards each node is made a real
 * keyboard-focusable link into its stage and marked when complete. Mermaid stays in strict security mode.
 *
 * Twelve nodes in one row are wider than any screen, so the diagram keeps its natural, readable size inside a
 * scroller (with edge fades, arrow buttons and auto-centring on your next stage). On phones the same source
 * is drawn top-to-bottom instead, so no sideways scrolling is needed.
 */
export function RoadmapDiagram({ completed, onOpenStage }: Props) {
  const vertical = useMediaQuery('(max-width: 690px)');
  const source = useMemo(
    () => ROADMAP_STYLE + (vertical ? roadmapDiagram.replace(/^flowchart LR/, 'flowchart TB') : roadmapDiagram),
    [vertical],
  );
  const state = useMermaid(source);
  const scroller = useRef<HTMLDivElement>(null);
  const host = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ start: true, end: false });

  // Make nodes interactive and mark completed ones.
  useEffect(() => {
    const root = host.current;
    if (!root || state.status !== 'ready') return;
    root.querySelectorAll<SVGGElement>('g.node').forEach(node => {
      const match = NODE_STAGE.exec(node.id);
      const stage = match ? getStage(Number(match[1])) : undefined;
      if (!stage) return;
      const done = completed.includes(stage.id);
      node.dataset.stage = String(stage.id);
      node.setAttribute('role', 'link');
      node.setAttribute('tabindex', '0');
      node.setAttribute('aria-label', `Stage ${stage.id}: ${stage.title}${done ? ' (complete)' : ''}`);
      node.classList.toggle('is-complete', done);
    });
  }, [state, completed]);

  const updateEdges = useCallback(() => {
    const el = scroller.current;
    if (!el) return;
    setEdges({ start: el.scrollLeft <= 4, end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 4 });
  }, []);

  // Once drawn, bring the learner's next stage to the middle of the strip (horizontal layout only).
  const nextStage = stages.find(stage => !completed.includes(stage.id))?.id ?? 1;
  const nextRef = useRef(nextStage);
  nextRef.current = nextStage;
  useEffect(() => {
    const el = scroller.current;
    if (!el || state.status !== 'ready') return;
    const node = host.current?.querySelector<SVGGElement>(`g.node[data-stage="${nextRef.current}"]`);
    if (node && !vertical) {
      const box = node.getBoundingClientRect();
      const view = el.getBoundingClientRect();
      el.scrollLeft += box.left - view.left - (view.width - box.width) / 2;
    }
    updateEdges();
    if (typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(updateEdges);
    observer.observe(el);
    return () => observer.disconnect();
  }, [state, vertical, updateEdges]);

  const nudge = (direction: 1 | -1) =>
    scroller.current?.scrollBy({ left: direction * Math.round(scroller.current.clientWidth * 0.7), behavior: scrollBehavior() });

  const onClick = (event: MouseEvent) => {
    const id = stageOf(event.target);
    if (id !== null) onOpenStage(id);
  };
  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    const id = stageOf(event.target);
    if (id === null) return;
    event.preventDefault();
    onOpenStage(id);
  };

  return (
    <div className="diagram-frame" data-orientation={vertical ? 'vertical' : 'horizontal'} data-at-start={edges.start} data-at-end={edges.end}>
      {!vertical && state.status === 'ready' && (
        <>
          <button type="button" className="scroll-btn left" aria-label="Scroll the roadmap left" disabled={edges.start} onClick={() => nudge(-1)}>
            <ChevronLeft size={18} aria-hidden="true" />
          </button>
          <button type="button" className="scroll-btn right" aria-label="Scroll the roadmap right" disabled={edges.end} onClick={() => nudge(1)}>
            <ChevronRight size={18} aria-hidden="true" />
          </button>
        </>
      )}
      <div ref={scroller} className="diagram-scroller" role="region" aria-label="Twelve-stage learning workflow (scrollable)" onScroll={updateEdges}>
        {state.status === 'ready' && (
          <div
            ref={host}
            className="diagram-canvas interactive"
            role="group"
            aria-label="Stages in order. Activate a stage to open it."
            onClick={onClick}
            onKeyDown={onKeyDown}
            dangerouslySetInnerHTML={{ __html: state.svg }}
          />
        )}
        {state.status === 'loading' && <div className="diagram-message" aria-live="polite">Drawing your learning path…</div>}
        {state.status === 'error' && (
          <div className="diagram-message" role="alert">
            The diagram could not be drawn in this browser. The twelve numbered cards below give the same sequence.
          </div>
        )}
      </div>
    </div>
  );
}
