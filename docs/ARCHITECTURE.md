# Architecture

Payil is a static React single-page app. There is **no backend, no database, no account system and no telemetry**: everything a
learner does is computed in the browser and stored in `localStorage`.

```text
index.html → src/main.tsx → App.tsx
                              ├─ hooks/useRoute      hash router (#/, #/stage/3/practice, #/glossary)
                              ├─ hooks/useProgress   load → mutate → persist → cross-tab sync
                              ├─ hooks/useTheme      dark / light, remembered
                              └─ components/
                                   layout/    Sidebar · Topbar · Footer
                                   roadmap/   Hero · MapSection · StageCatalog · StageCard · RoadmapView
                                   stage/     StageView · StageTabs · Learn/Practice/Why/Check panels · Quiz · StageAside · StagePager · LabCard
                                   glossary/  GlossaryView
                                   diagram/   useMermaid · MermaidDiagram · RoadmapDiagram
                                   dialogs/   ResetDialog · ImportDialog        common/ Modal · Toast · Brand · ProgressRing

data/    stages.json · glossary.json · workflows/*.mmd · roadmap.mmd · types · phases · labs      ← content
lib/     progress · route · search · mermaid · dom                                               ← pure logic
styles/  tokens · base · layout · roadmap · stage · glossary · fonts                             ← design system
```

## Principles

- **Content is data.** `src/data` holds every word a learner reads. Components render it; they never contain curriculum copy.
- **Logic is pure and tested.** Progress validation, routing, search and lab parsing live in `src/lib` and `src/data` as plain
  functions with unit tests. React hooks are thin wrappers.
- **One component tree, small files.** Each file has one job. `App.tsx` only wires routing, state and dialogs together.
- **No fake controls.** If a feature is not implemented (labs, accounts, sync), the UI does not show it.

## Routing

Hash routes keep the app a plain static site (no server rewrites on GitHub Pages) and give every stage and tab a shareable URL.
`lib/route.ts` parses and prints routes; `hooks/useRoute.ts` subscribes to `hashchange` with `useSyncExternalStore`. Unknown or
out-of-range routes fall back to the roadmap. Browser back/forward work, and stage cards and glossary entries are real
anchors, so they can be opened in a new tab.

## Progress storage

`lib/progress.ts` owns the `Progress` shape:

```ts
{ version: 1, completed: number[], bookmarked: number[],
  checked: Record<stageId, number[]>,   // practice task indexes
  notes: Record<stageId, string>,       // max 10,000 chars
  quizzes: Record<stageId, true> }      // knowledge check answered correctly
```

Everything coming from `localStorage` or an imported file passes through `sanitizeProgress`, which drops out-of-range ids,
duplicates and wrong types, so corrupt data can never crash the UI. Key: `payil:progress:v1`. Export writes
`payil-progress.json`; import validates, shows a summary and asks before replacing. Changes in another tab are picked up through
the `storage` event. If storage is unavailable (private mode, quota), the app still works for the session.

## Diagrams

`lib/mermaid.ts` lazy-loads Mermaid on first use (it is large and never blocks first paint), initialises it once with the Payil
theme and `securityLevel: 'strict'`, and serialises renders. `useMermaid` turns a source string into `loading | ready | error`.

- **Roadmap** (`RoadmapDiagram`): the twelve-node chain from `roadmap.mmd`. After rendering, each `g.node` gets
  `role="link"`, `tabindex="0"` and a label, so nodes are keyboard-operable links into stages, and completed stages are marked.
  On phones the same source is drawn top-to-bottom.
- **Stage workflows** (`StageWorkflow` → `MermaidDiagram`): one `.mmd` per stage, with an *Expand* viewer that shows the diagram
  at natural size.
- Diagram sources are repository-owned. Never render untrusted, user-authored Mermaid without a fresh security review.

## Styling

Plain CSS with design tokens (`styles/tokens.css`). Dark is the default; `data-theme="light"` on `<html>` switches palettes, set
before first paint by an inline script in `index.html`. Phase colours come from one variable, `--phase`, set by
`[data-phase]`, so a component needs no per-phase CSS. Diagram panels stay dark in both themes. Fonts (Inter, Manrope, Noto Sans
Tamil) are bundled from npm; there are no third-party requests.

## Accessibility

Skip link; semantic landmarks and headings; WAI-ARIA tabs with arrow-key, Home and End support; focus-trapped dialogs that close
on Escape and restore focus; `aria-live` for quiz feedback and notices; visible focus rings; touch-sized primary controls;
`prefers-reduced-motion` support; status is never conveyed by colour alone (icons and text accompany it); roadmap diagram nodes
are links whose accessible name starts with their visible label (WCAG 2.5.3).

How it is checked: `a11y.test.tsx` runs axe-core's structural rules over every view and dialog in the component tests;
`lib/contrast.test.ts` holds every text/background pair, including hover tints and the Mermaid palette (which axe cannot read),
to WCAG AA; and `App.test.tsx` covers keyboard behaviour. The README records the real-browser axe audit and what is *not* covered
(no screen-reader testing).

## Build and deploy

`vite.config.ts` uses `base: './'`, so the same build works at a domain root or under `/<repo>/`. `.github/workflows/pages.yml`
runs the content check, type-check, tests and build, then publishes `dist/` with the official Pages actions.
