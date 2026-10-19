export type Phase = 'Foundations' | 'Systems & control' | 'Production readiness';

/** Short key used for CSS hooks (`data-phase`) and routing-free lookups. */
export type PhaseKey = 'foundation' | 'systems' | 'production';

export type Resource = { title: string; url: string; note: string };

/** Metadata for the per-stage Mermaid diagram. The diagram source lives in `workflows/<slug>.mmd`. */
export type WorkflowMeta = { title: string; caption: string };

export type Stage = {
  id: number;
  slug: string;
  title: string;
  shortTitle: string;
  phase: Phase;
  duration: string;
  summary: string;
  outcome: string;
  learn: { concept: string; detail: string }[];
  practice: { title: string; detail: string }[];
  deliverables: string[];
  why: string[];
  guardrail: string;
  workflow: WorkflowMeta;
  resources: Resource[];
  quiz: { question: string; answers: [string, string, string]; correct: number; explanation: string };
};

export type GlossaryEntry = { term: string; definition: string; stage: number };

/**
 * Manifest of an optional hands-on lab, stored at `content/labs/<slug>/lab.json`.
 * Labs are an extension point: none ship in v1, and the UI shows nothing for a stage without one.
 */
export type Lab = {
  /** Folder name under `content/labs/`. Derived from the path, not stored in the manifest. */
  slug: string;
  stageId: number;
  title: string;
  summary: string;
  estimatedTime: string;
  objectives: string[];
  prerequisites: string[];
  /** Mandatory: every lab must say how it stays safe (synthetic data, isolation, no secrets). */
  safety: string[];
  verification: string[];
};
