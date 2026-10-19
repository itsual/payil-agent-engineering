import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import App from './App';
import { STORAGE_KEY, blankProgress, serializeProgress } from './lib/progress';

// Mermaid needs a real SVG layout engine, so tests substitute a tiny stand-in diagram. The real
// diagram sources are parsed for validity in src/data/workflows.test.ts.
vi.mock('./lib/mermaid', () => ({
  renderDiagram: vi.fn(async () =>
    '<svg viewBox="0 0 10 10"><g class="node" id="flowchart-S03-2"><rect width="4" height="4"/><text>03 · Computer use</text></g></svg>',
  ),
  assertDiagramParses: vi.fn(async () => undefined),
}));

const saved = () => JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}');
const sidebar = () => screen.getByRole('complementary', { name: 'Primary' });
const topbar = () => within(document.querySelector('.topbar') as HTMLElement);
const quizStatus = () => within(screen.getByRole('group', { name: /Scenario/ })).getByRole('status');

beforeEach(() => {
  window.location.hash = '';
});

describe('roadmap', () => {
  it('shows the Payil brand, the tagline and all twelve stages', async () => {
    render(<App />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Learn to Engineer Intelligent Agents.');
    expect(within(sidebar()).getByRole('button', { name: /Payil/ })).toBeInTheDocument();
    expect(screen.getAllByRole('article')).toHaveLength(12);
    expect(document.title).toContain('Payil');
    // The platform was renamed during development; make sure no trace of the working title survives in the UI.
    expect(document.body.textContent).not.toMatch(new RegExp(['agent', 'engineering', 'atlas'].join(' '), 'i'));
  });

  it('filters stages by search and by phase, and can clear the filters', async () => {
    const user = userEvent.setup();
    render(<App />);
    const search = screen.getByRole('searchbox', { name: 'Search stages' });

    await user.type(search, 'sandboxed');
    expect(screen.getAllByRole('article')).toHaveLength(1);
    expect(screen.getByRole('link', { name: /Sandboxed execution environments/ })).toBeInTheDocument();

    await user.clear(search);
    await user.type(search, 'zzzzqqq');
    expect(screen.queryAllByRole('article')).toHaveLength(0);
    await user.click(screen.getByRole('button', { name: /Clear search and filters/ }));
    expect(screen.getAllByRole('article')).toHaveLength(12);

    await user.click(screen.getByRole('button', { name: 'Production readiness' }));
    expect(screen.getAllByRole('article')).toHaveLength(4);
    expect(screen.getByRole('button', { name: 'Production readiness' })).toHaveAttribute('aria-pressed', 'true');
  });

  it('opens a stage from the "Start learning" button', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole('button', { name: /Start learning/ }));
    expect(await screen.findByRole('heading', { level: 1, name: 'Agent architecture & state machines' })).toBeInTheDocument();
    expect(window.location.hash).toBe('#/stage/1');
  });

  it('makes diagram nodes real links into their stage', async () => {
    const user = userEvent.setup();
    render(<App />);
    // The accessible name starts with the visible label (WCAG 2.5.3 “Label in Name”) and then adds the full title.
    const node = await screen.findByRole('link', { name: /^03 · Computer use\. Computer use & GUI automation/ });
    expect(node).toHaveAttribute('tabindex', '0');
    await user.click(node);
    expect(await screen.findByRole('heading', { level: 1, name: /Computer use/ })).toBeInTheDocument();
  });
});

describe('stage explorer', () => {
  it('opens a deep-linked stage and tab', async () => {
    window.location.hash = '#/stage/7/why';
    render(<App />);
    expect(await screen.findByRole('heading', { level: 1, name: /Inter-agent security/ })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /Why it matters/ })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByText('Production guardrail')).toBeInTheDocument();
  });

  it('moves between tabs with the arrow keys and exposes the matching tabpanel', async () => {
    const user = userEvent.setup();
    window.location.hash = '#/stage/2';
    render(<App />);
    const learn = await screen.findByRole('tab', { name: /What to learn/ });
    learn.focus();
    await user.keyboard('{ArrowRight}');
    const practice = await screen.findByRole('tab', { name: /What to practise/ });
    expect(practice).toHaveAttribute('aria-selected', 'true');
    expect(practice).toHaveFocus();
    expect(screen.getByRole('tabpanel')).toHaveAttribute('aria-labelledby', practice.id);
    await user.keyboard('{End}');
    expect(await screen.findByRole('tab', { name: /Check yourself/ })).toHaveAttribute('aria-selected', 'true');
  });

  it('keeps up with fast repeated arrow presses on the tabs', async () => {
    const user = userEvent.setup();
    window.location.hash = '#/stage/2';
    render(<App />);
    (await screen.findByRole('tab', { name: /What to learn/ })).focus();
    await user.keyboard('{ArrowRight}{ArrowRight}{ArrowRight}');
    expect(await screen.findByRole('tab', { name: /Check yourself/ })).toHaveAttribute('aria-selected', 'true');
    await user.keyboard('{ArrowRight}');
    expect(await screen.findByRole('tab', { name: /What to learn/ })).toHaveAttribute('aria-selected', 'true');
  });

  it('shows the stage workflow diagram on the Learn tab', async () => {
    window.location.hash = '#/stage/4';
    render(<App />);
    expect(await screen.findByRole('heading', { level: 3, name: 'The memory lifecycle' })).toBeInTheDocument();
    expect(await screen.findByRole('img', { name: /The memory lifecycle/ })).toBeInTheDocument();
  });

  it('persists checked practice tasks across a reload', async () => {
    const user = userEvent.setup();
    window.location.hash = '#/stage/1/practice';
    const first = render(<App />);
    const task = await screen.findByRole('checkbox', { name: /Model the workflow/ });
    await user.click(task);
    expect(task).toBeChecked();
    expect(saved().checked).toEqual({ '1': [0] });

    first.unmount();
    render(<App />);
    expect(await screen.findByRole('checkbox', { name: /Model the workflow/ })).toBeChecked();
  });

  it('gives feedback on the quiz, allows a retry, and remembers a correct answer', async () => {
    const user = userEvent.setup();
    window.location.hash = '#/stage/1/check';
    render(<App />);
    // Stage 1: the idempotency-key answer is correct.
    await user.click(await screen.findByRole('radio', { name: /Increase model context length/ }));
    await user.click(screen.getByRole('button', { name: /Check answer/ }));
    expect(quizStatus()).toHaveTextContent('Not quite.');
    expect(saved().quizzes ?? {}).toEqual({});

    await user.click(screen.getByRole('button', { name: /Try again/ }));
    await user.click(screen.getByRole('radio', { name: /Add an idempotency key/ }));
    await user.click(screen.getByRole('button', { name: /Check answer/ }));
    expect(quizStatus()).toHaveTextContent('Correct.');
    expect(saved().quizzes).toEqual({ '1': true });
  });

  it('saves notes, bookmarks and completion, and reflects them in the navigation', async () => {
    const user = userEvent.setup();
    window.location.hash = '#/stage/5/check';
    render(<App />);
    await user.type(await screen.findByLabelText(/Your learning notes/), 'Compare against a one-agent baseline');
    await user.click(screen.getByRole('button', { name: 'Bookmark' }));
    await user.click(screen.getByRole('button', { name: /Mark this stage complete/ }));

    expect(saved().notes['5']).toBe('Compare against a one-agent baseline');
    expect(saved().bookmarked).toEqual([5]);
    expect(saved().completed).toEqual([5]);
    expect(screen.getByRole('button', { name: /Stage complete/ })).toHaveAttribute('aria-pressed', 'true');
    expect(within(sidebar()).getByText('(complete)')).toBeInTheDocument();
    expect(topbar().getByText('1/12 complete')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /Stage complete/ }));
    expect(saved().completed).toEqual([]);
  });

  it('pages between stages', async () => {
    const user = userEvent.setup();
    window.location.hash = '#/stage/12';
    render(<App />);
    const pager = await screen.findByRole('navigation', { name: 'Stage navigation' });
    expect(within(pager).queryByText('Next stage')).not.toBeInTheDocument();
    await user.click(within(pager).getByRole('button', { name: /Previous stage/ }));
    expect(await screen.findByRole('heading', { level: 1, name: /Graceful degradation/ })).toBeInTheDocument();
  });

  it('opens external references safely in a new tab', async () => {
    window.location.hash = '#/stage/2';
    render(<App />);
    const links = within(await screen.findByRole('complementary', { name: /Stage progress and references/ })).getAllByRole('link');
    expect(links.length).toBeGreaterThanOrEqual(2);
    for (const link of links) {
      expect(link).toHaveAttribute('target', '_blank');
      expect(link.getAttribute('rel')).toContain('noreferrer');
    }
  });
});

describe('glossary', () => {
  it('searches terms and links each one back to its stage', async () => {
    const user = userEvent.setup();
    window.location.hash = '#/glossary';
    render(<App />);
    expect(await screen.findByRole('heading', { level: 1, name: /Concept glossary/ })).toBeInTheDocument();
    await user.type(screen.getByRole('searchbox', { name: 'Search the glossary' }), 'circuit breaker');
    const card = screen.getAllByRole('link').find(link => link.textContent?.includes('Circuit breaker'));
    expect(card).toBeDefined();
    await user.click(card!);
    expect(await screen.findByRole('heading', { level: 1, name: /Graceful degradation/ })).toBeInTheDocument();
  });
});

describe('progress management', () => {
  it('asks for confirmation before resetting, and cancelling keeps the data', async () => {
    const user = userEvent.setup();
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...blankProgress(), completed: [1, 2] }));
    render(<App />);
    expect(topbar().getByText('2/12 complete')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Reset local progress' }));
    const dialog = await screen.findByRole('dialog', { name: 'Reset your progress?' });
    await user.click(within(dialog).getByRole('button', { name: 'Cancel' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(topbar().getByText('2/12 complete')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Reset local progress' }));
    await user.click(within(await screen.findByRole('dialog')).getByRole('button', { name: 'Clear progress' }));
    expect(topbar().getByText('0/12 complete')).toBeInTheDocument();
    expect(localStorage.getItem(STORAGE_KEY)).toContain('"completed":[]');
  });

  it('imports an exported file after confirmation, and rejects a bad file', async () => {
    const user = userEvent.setup();
    render(<App />);
    const input = screen.getByLabelText('Import progress file') as HTMLInputElement;

    const bad = new File(['{"hello":"world"}'], 'bad.json', { type: 'application/json' });
    await user.upload(input, bad);
    expect(await screen.findByText('That file is not a Payil progress export.')).toBeInTheDocument();

    const good = new File([serializeProgress({ ...blankProgress(), completed: [1, 2, 3], bookmarked: [4] })], 'ok.json', { type: 'application/json' });
    await user.upload(input, good);
    const dialog = await screen.findByRole('dialog', { name: /Replace your progress/ });
    expect(dialog).toHaveTextContent('3 of 12 stages complete');
    await user.click(within(dialog).getByRole('button', { name: 'Replace my progress' }));
    expect(await topbar().findByText('3/12 complete')).toBeInTheDocument();
    expect(saved().completed).toEqual([1, 2, 3]);
  });

  it('closes a dialog with Escape', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole('button', { name: 'Reset local progress' }));
    expect(await screen.findByRole('dialog')).toBeInTheDocument();
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});

describe('theme', () => {
  it('toggles between dark and light and remembers the choice', async () => {
    const user = userEvent.setup();
    render(<App />);
    expect(document.documentElement.dataset.theme).toBe('dark');
    await user.click(screen.getByRole('button', { name: 'Switch to the light theme' }));
    expect(document.documentElement.dataset.theme).toBe('light');
    expect(localStorage.getItem('payil:theme')).toBe('light');
    expect(screen.getByRole('button', { name: 'Switch to the dark theme' })).toBeInTheDocument();
  });
});
