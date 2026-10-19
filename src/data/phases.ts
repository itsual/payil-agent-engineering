import type { Phase, PhaseKey } from './types';

export type PhaseInfo = {
  phase: Phase;
  key: PhaseKey;
  /** Inclusive stage-id range covered by the phase. */
  from: number;
  to: number;
  blurb: string;
};

export const phaseInfo: PhaseInfo[] = [
  {
    phase: 'Foundations',
    key: 'foundation',
    from: 1,
    to: 4,
    blurb: 'How an agent is structured, how it acts and how it remembers.',
  },
  {
    phase: 'Systems & control',
    key: 'systems',
    from: 5,
    to: 8,
    blurb: 'Coordination, isolation, security and accountable human approval.',
  },
  {
    phase: 'Production readiness',
    key: 'production',
    from: 9,
    to: 12,
    blurb: 'Recovery, evaluation, resilience and publishing honest evidence.',
  },
];

export const phaseKeyOf = (phase: Phase): PhaseKey => phaseInfo.find(p => p.phase === phase)!.key;
