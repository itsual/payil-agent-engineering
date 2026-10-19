import { useEffect, useState } from 'react';
import { renderDiagram } from '../../lib/mermaid';

export type MermaidState =
  | { status: 'loading' }
  | { status: 'ready'; svg: string }
  | { status: 'error' };

/** Renders Mermaid source to SVG (lazily loading Mermaid) and reports loading / ready / error. */
export function useMermaid(source: string): MermaidState {
  const [state, setState] = useState<MermaidState>({ status: 'loading' });

  useEffect(() => {
    let cancelled = false;
    setState({ status: 'loading' });
    renderDiagram(source).then(
      svg => !cancelled && setState({ status: 'ready', svg }),
      () => !cancelled && setState({ status: 'error' }),
    );
    return () => {
      cancelled = true;
    };
  }, [source]);

  return state;
}
