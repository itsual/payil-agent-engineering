import { describe, expect, it } from 'vitest';
import { STAGE_COUNT, glossary, phases, roadmapDiagram, stages, workflowSource } from './stages';
import { phaseInfo, phaseKeyOf } from './phases';

describe('curriculum integrity', () => {
  it('has twelve ordered stages with unique, id-prefixed slugs', () => {
    expect(STAGE_COUNT).toBe(12);
    expect(stages.map(stage => stage.id)).toEqual(Array.from({ length: 12 }, (_, index) => index + 1));
    expect(new Set(stages.map(stage => stage.slug)).size).toBe(12);
    for (const stage of stages) expect(stage.slug.startsWith(String(stage.id).padStart(2, '0'))).toBe(true);
  });

  it('groups the stages into three phases of four', () => {
    for (const phase of phases) expect(stages.filter(stage => stage.phase === phase)).toHaveLength(4);
    for (const info of phaseInfo) {
      const inPhase = stages.filter(stage => stage.id >= info.from && stage.id <= info.to);
      expect(inPhase.every(stage => stage.phase === info.phase)).toBe(true);
      expect(inPhase.every(stage => phaseKeyOf(stage.phase) === info.key)).toBe(true);
    }
  });

  it('provides content, references and an answer key for each stage', () => {
    for (const stage of stages) {
      expect(stage.learn.length).toBeGreaterThanOrEqual(3);
      expect(stage.practice.length).toBeGreaterThanOrEqual(3);
      expect(stage.deliverables.length).toBeGreaterThanOrEqual(2);
      expect(stage.why.length).toBeGreaterThanOrEqual(2);
      expect(stage.resources.length).toBeGreaterThanOrEqual(2);
      expect(stage.resources.every(resource => resource.url.startsWith('https://'))).toBe(true);
      expect(stage.quiz.answers).toHaveLength(3);
      expect(new Set(stage.quiz.answers).size).toBe(3);
      expect(stage.quiz.answers[stage.quiz.correct]).toBeTruthy();
    }
  });

  it('does not always put the correct answer in the same position', () => {
    const positions = stages.map(stage => stage.quiz.correct);
    for (const position of [0, 1, 2]) expect(positions.filter(p => p === position)).toHaveLength(4);
  });

  it('has a Mermaid workflow and caption for every stage', () => {
    for (const stage of stages) {
      expect(stage.workflow.title.length).toBeGreaterThan(5);
      expect(stage.workflow.caption.length).toBeGreaterThan(20);
      expect(workflowSource(stage), `${stage.slug} workflow`).toMatch(/^(flowchart|stateDiagram-v2|sequenceDiagram)/);
    }
  });

  it('keeps the roadmap diagram to exactly the twelve stages', () => {
    const nodes = roadmapDiagram.match(/S\d{2}\["/g) ?? [];
    expect(nodes).toHaveLength(12);
    expect(roadmapDiagram).not.toMatch(/subgraph/);
  });

  it('has a glossary that covers every stage', () => {
    expect(glossary.length).toBeGreaterThanOrEqual(30);
    for (const stage of stages) expect(glossary.some(entry => entry.stage === stage.id)).toBe(true);
    expect(new Set(glossary.map(entry => entry.term.toLowerCase())).size).toBe(glossary.length);
  });
});
