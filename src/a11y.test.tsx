import axe from 'axe-core';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import App from './App';

// Structural accessibility regression tests (names, roles, headings, landmarks, labels). Colour contrast and layout
// rules need a real browser: those are covered by the palette tests in lib/contrast.test.ts and by the axe-core
// audit described in the README.
vi.mock('./lib/mermaid', () => ({
  renderDiagram: vi.fn(async () =>
    '<svg viewBox="0 0 10 10"><g class="node" id="flowchart-S03-2"><rect width="4" height="4"/><text>03 · Computer use</text></g></svg>',
  ),
  assertDiagramParses: vi.fn(async () => undefined),
  diagramTheme: {},
}));

async function violations(): Promise<string[]> {
  const result = await axe.run(document.body, {
    runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'] },
    rules: {
      'color-contrast': { enabled: false },
      // jsdom has no layout engine, so these cannot be evaluated here.
      'scrollable-region-focusable': { enabled: false },
      'target-size': { enabled: false },
    },
  });
  return result.violations.map(v => `${v.id}: ${v.help} → ${v.nodes.map(n => n.target.join(' ')).slice(0, 3).join(' | ')}`);
}

const routes: [string, string][] = [
  ['roadmap', '#/'],
  ['glossary', '#/glossary'],
  ['a stage (Learn)', '#/stage/3'],
  ['a stage (Practice)', '#/stage/3/practice'],
  ['a stage (Why)', '#/stage/3/why'],
  ['a stage (Check)', '#/stage/3/check'],
];

describe('accessibility (axe-core, structural rules)', () => {
  it.each(routes)('has no violations on the %s', async (_name, hash) => {
    window.location.hash = hash;
    render(<App />);
    await screen.findByRole('main');
    await screen.findAllByRole('heading');
    expect(await violations()).toEqual([]);
  });

  it('has no violations with the reset dialog open', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole('button', { name: 'Reset local progress' }));
    await screen.findByRole('dialog');
    expect(await violations()).toEqual([]);
  });

  it('has no violations after answering the quiz', async () => {
    const user = userEvent.setup();
    window.location.hash = '#/stage/3/check';
    render(<App />);
    await user.click(await screen.findByRole('radio', { name: /fixed screen coordinate/ }));
    await user.click(screen.getByRole('button', { name: /Check answer/ }));
    expect(await violations()).toEqual([]);
  });

  it('has no violations in the light theme with progress recorded', async () => {
    localStorage.setItem('payil:progress:v1', JSON.stringify({ version: 1, completed: [1, 2], bookmarked: [3], checked: { '1': [0] }, notes: { '1': 'x' }, quizzes: { '1': true } }));
    document.documentElement.dataset.theme = 'light';
    render(<App />);
    await screen.findAllByRole('article');
    expect(await violations()).toEqual([]);
  });
});
