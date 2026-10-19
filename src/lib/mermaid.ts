/**
 * Thin, lazy wrapper around Mermaid. The library is large, so it is imported on first use and
 * never blocks the initial page. Rendering is serialised because Mermaid uses shared DOM scratch space.
 */
type MermaidApi = (typeof import('mermaid'))['default'];

let loader: Promise<MermaidApi> | undefined;
let queue: Promise<unknown> = Promise.resolve();
let counter = 0;

function load(): Promise<MermaidApi> {
  loader ??= import('mermaid').then(module => {
    const mermaid = module.default;
    mermaid.initialize({
      startOnLoad: false,
      // Diagram sources are repository-owned, but keep Mermaid's strict sanitiser on regardless.
      securityLevel: 'strict',
      theme: 'base',
      themeVariables: {
        fontFamily: "'Inter Variable', Inter, ui-sans-serif, system-ui, sans-serif",
        fontSize: '15px',
        background: '#0d1626',
        primaryColor: '#213f44',
        primaryBorderColor: '#8cf5d2',
        primaryTextColor: '#edf4ff',
        secondaryColor: '#2d2950',
        tertiaryColor: '#18253b',
        textColor: '#dbe6f5',
        lineColor: '#97abc3',
        noteBkgColor: '#18253b',
        noteTextColor: '#dbe6f5',
        noteBorderColor: '#5c7690',
        actorBkg: '#213f44',
        actorBorder: '#8cf5d2',
        actorTextColor: '#edfefa',
        actorLineColor: '#5c7690',
        signalColor: '#97abc3',
        signalTextColor: '#dbe6f5',
        labelBoxBkgColor: '#18253b',
        labelBoxBorderColor: '#5c7690',
        labelTextColor: '#dbe6f5',
        loopTextColor: '#dbe6f5',
        sequenceNumberColor: '#06140f',
        activationBkgColor: '#2d2950',
        edgeLabelBackground: '#0d1626',
        clusterBkg: '#111d33',
        clusterBorder: '#34506b',
        titleColor: '#dbe6f5',
        stateBkg: '#213f44',
        stateLabelColor: '#edfefa',
        transitionColor: '#97abc3',
        transitionLabelColor: '#dbe6f5',
        specialStateColor: '#8cf5d2',
        compositeBackground: '#111d33',
        compositeBorder: '#34506b',
        compositeTitleBackground: '#18253b',
      },
      flowchart: { curve: 'basis', htmlLabels: false, nodeSpacing: 32, rankSpacing: 38, padding: 14, useMaxWidth: false },
      sequence: { useMaxWidth: false, mirrorActors: false, actorMargin: 36, messageMargin: 30, wrap: true, width: 150 },
      state: { useMaxWidth: false },
    });
    return mermaid;
  });
  return loader;
}

/** Renders Mermaid source to an SVG string. Rejects if the source does not parse. */
export function renderDiagram(source: string): Promise<string> {
  const run = async () => {
    const mermaid = await load();
    const { svg } = await mermaid.render(`payil-diagram-${++counter}`, source);
    return svg;
  };
  const result = queue.then(run, run);
  queue = result.catch(() => undefined);
  return result;
}

/** Throws if `source` is not valid Mermaid. Used by the test-suite to guard every diagram. */
export async function assertDiagramParses(source: string): Promise<void> {
  const mermaid = await load();
  await mermaid.parse(source);
}
