import { describe, expect, it } from 'vitest';
import { assertDiagramParses } from '../lib/mermaid';
import { roadmapDiagram, stages, workflowSource } from './stages';

// A typo in a .mmd file would otherwise only surface as a broken diagram in the browser.
describe('Mermaid sources', () => {
  it('parses the roadmap diagram', async () => {
    await expect(assertDiagramParses(roadmapDiagram)).resolves.toBeUndefined();
  });

  it.each(stages.map(stage => [stage.slug, stage] as const))('parses the %s workflow', async (_slug, stage) => {
    const source = workflowSource(stage);
    expect(source).toBeTruthy();
    await expect(assertDiagramParses(source!)).resolves.toBeUndefined();
  });
});
