import fs from 'node:fs';
import { describe, expect, it } from 'vitest';
import { roadmapDiagram, stages, workflowSource } from '../data/stages';
import { contrastRatio, parseHex, tint } from './contrast';
import { diagramTheme } from './mermaid';

/**
 * Accessibility guard for the palette. axe-core cannot judge text drawn inside Mermaid's SVG shapes, and
 * CSS hover tints are not rendered in a static audit, so the numbers are checked here directly (WCAG 2.2 AA).
 */

// Vitest runs from the project root.
const css = fs.readFileSync('src/styles/tokens.css', 'utf8');

function tokensIn(block: string): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [, name, value] of block.matchAll(/--([\w-]+):\s*(#[0-9a-fA-F]{3,6})\s*;/g)) out[name] = value;
  return out;
}
const darkBlock = /:root\s*\{([^}]*)\}/.exec(css)![1];
const lightBlock = /:root\[data-theme='light'\]\s*\{([^}]*)\}/.exec(css)![1];
const themes = { dark: tokensIn(darkBlock), light: { ...tokensIn(darkBlock), ...tokensIn(lightBlock) } };

const AA = 4.5;
const NON_TEXT = 3;

describe('contrast helpers', () => {
  it('matches the WCAG reference values', () => {
    expect(contrastRatio('#000000', '#ffffff')).toBeCloseTo(21, 5);
    expect(contrastRatio('#777777', '#ffffff')).toBeCloseTo(4.48, 1);
    expect(contrastRatio('#123456', '#123456')).toBe(1);
    expect(parseHex('#abc')).toEqual([170, 187, 204]);
  });
});

describe.each(Object.entries(themes))('%s theme tokens', (_name, t) => {
  const surfaces = ['bg', 'surface', 'surface-2'] as const;

  it.each(surfaces)('body and secondary text are readable on %s', surface => {
    expect(contrastRatio(t.text, t[surface])).toBeGreaterThanOrEqual(AA);
    expect(contrastRatio(t['text-2'], t[surface])).toBeGreaterThanOrEqual(AA);
    expect(contrastRatio(t.muted, t[surface])).toBeGreaterThanOrEqual(AA);
  });

  it('keeps text on the sidebar and topbar readable', () => {
    expect(contrastRatio(t.text, t['bg-side'])).toBeGreaterThanOrEqual(AA);
    expect(contrastRatio(t.muted, t['bg-side'])).toBeGreaterThanOrEqual(AA);
  });

  it.each(['accent', 'lilac', 'amber', 'ok', 'danger'])('%s text works on surfaces and on its own 14–22%% tint', colour => {
    for (const surface of surfaces) {
      expect(contrastRatio(t[colour], t[surface]), `${colour} on ${surface}`).toBeGreaterThanOrEqual(AA);
      for (const alpha of [0.14, 0.22]) {
        expect(contrastRatio(t[colour], tint(t[colour], t[surface], alpha)), `${colour} on ${alpha} tint of ${surface}`).toBeGreaterThanOrEqual(AA);
      }
    }
  });

  it('keeps filled-button text readable, including the hover colour', () => {
    expect(contrastRatio(t['accent-ink'], t.accent)).toBeGreaterThanOrEqual(AA);
    expect(contrastRatio(t['accent-ink'], t['accent-strong'])).toBeGreaterThanOrEqual(AA);
  });

  it('keeps danger text readable on its background', () => {
    expect(contrastRatio(t.danger, t['danger-bg'])).toBeGreaterThanOrEqual(AA);
  });

  it('keeps borders that identify controls visible (non-text contrast)', () => {
    expect(contrastRatio(t['line-strong'], t.bg)).toBeGreaterThanOrEqual(1.5); // decorative separators only
    expect(contrastRatio(t.accent, t.bg)).toBeGreaterThanOrEqual(NON_TEXT); // focus ring colour
  });
});

describe('diagram palette (panels are dark in both themes)', () => {
  const t = diagramTheme;
  it.each([
    ['text on the panel', t.textColor, t.background],
    ['edge labels', t.transitionLabelColor, t.edgeLabelBackground],
    ['node text', t.primaryTextColor, t.primaryColor],
    ['actor text', t.actorTextColor, t.actorBkg],
    ['state text', t.stateLabelColor, t.stateBkg],
    ['note text', t.noteTextColor, t.noteBkgColor],
    ['loop and label text', t.labelTextColor, t.labelBoxBkgColor],
    ['cluster titles', t.titleColor, t.clusterBkg],
    ['message text', t.signalTextColor, t.background],
  ])('%s is ≥ 4.5:1', (_label, fg, bg) => {
    expect(contrastRatio(fg, bg)).toBeGreaterThanOrEqual(AA);
  });

  it('draws lines and node outlines at ≥ 3:1 against the panel', () => {
    for (const line of [t.lineColor, t.signalColor, t.primaryBorderColor, t.noteBorderColor, t.actorLineColor]) {
      expect(contrastRatio(line, t.background)).toBeGreaterThanOrEqual(NON_TEXT);
    }
  });

  const sources: [string, string][] = [['roadmap', roadmapDiagram], ...stages.map(s => [s.slug, workflowSource(s) ?? ''] as [string, string])];
  it.each(sources)('every classDef in %s has readable text and a visible outline', (_name, source) => {
    const defs = [...source.matchAll(/classDef\s+(\w+)\s+([^;\n]+);/g)];
    for (const [, className, body] of defs) {
      const fill = /fill:(#[0-9a-fA-F]{6})/.exec(body)?.[1];
      const color = /color:(#[0-9a-fA-F]{6})/.exec(body)?.[1];
      const stroke = /stroke:(#[0-9a-fA-F]{6})/.exec(body)?.[1];
      if (fill && color) expect(contrastRatio(color, fill), `${className} text`).toBeGreaterThanOrEqual(AA);
      if (fill && stroke) expect(contrastRatio(stroke, t.background), `${className} outline`).toBeGreaterThanOrEqual(NON_TEXT);
    }
  });
});
