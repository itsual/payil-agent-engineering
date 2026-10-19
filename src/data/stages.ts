import raw from './stages.json';
import rawGlossary from './glossary.json';
import roadmapSource from './roadmap.mmd?raw';
import { phaseInfo } from './phases';
import type { GlossaryEntry, Phase, Stage } from './types';

/** Canonical curriculum. Edit `stages.json`, never duplicate stage copy in components. */
export const stages = raw as Stage[];
export const glossary = rawGlossary as GlossaryEntry[];
export const phases: Phase[] = phaseInfo.map(p => p.phase);
export const STAGE_COUNT = stages.length;

/** The single high-level 12-stage workflow shown on the roadmap. */
export const roadmapDiagram = roadmapSource;

export const getStage = (id: number): Stage | undefined => stages.find(stage => stage.id === id);

const workflowFiles = import.meta.glob('./workflows/*.mmd', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

/** Mermaid source for a stage's own workflow diagram (`workflows/<slug>.mmd`). */
export const workflowSource = (stage: Stage): string | undefined => workflowFiles[`./workflows/${stage.slug}.mmd`];
