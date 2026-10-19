# Curriculum content model

Payil is **data-driven**. A stage is edited in data files, never in JSX, so someone can improve a lesson without reading any UI code.

| What | Where | Validated by |
|---|---|---|
| The twelve stages (copy, tasks, quiz, references, workflow caption) | `src/data/stages.json` | `npm run check:content`, `stages.test.ts` |
| Type contract for a stage | `src/data/types.ts` | `tsc` |
| Per-stage Mermaid workflow | `src/data/workflows/<slug>.mmd` | `check:content`, `workflows.test.ts` (parses with real Mermaid) |
| High-level 12-node roadmap diagram | `src/data/roadmap.mmd` | `check:content`, `stages.test.ts` |
| Glossary (30+ terms, each linked to a stage) | `src/data/glossary.json` | `check:content` |
| Optional hands-on labs | `content/labs/<slug>/lab.json` | `check:content`, `labs.test.ts` |
| Brand, URLs | `src/config.ts`, `index.html` | `check:content` (old-name guard) |

## A stage

```ts
type Stage = {
  id: number;                 // 1–12, stable. Learner progress is keyed by it, so never renumber.
  slug: string;               // "07-security": two-digit id prefix + kebab-case name. Names the workflow file.
  title: string;              // full title
  shortTitle: string;         // sidebar and breadcrumb label
  phase: 'Foundations' | 'Systems & control' | 'Production readiness';   // 1–4, 5–8, 9–12
  duration: string;           // suggested effort. An estimate, not a promise.
  summary: string;            // one-sentence card text
  outcome: string;            // "Learning outcome"
  learn: { concept: string; detail: string }[];        // ≥3
  practice: { title: string; detail: string }[];       // 3–12 design tasks (checkable)
  deliverables: string[];     // ≥2
  why: string[];              // ≥2 rationale statements
  guardrail: string;          // the production caveat
  workflow: { title: string; caption: string };        // heading and caption for the stage diagram
  resources: { title: string; url: string; note: string }[];   // ≥2, https only
  quiz: { question: string; answers: [string, string, string]; correct: number; explanation: string };
};
```

Rules enforced by the validator:

- Exactly 12 stages, ids `1…12` in order, unique slugs, phases of four.
- Every stage has a workflow diagram file matching its slug, and every diagram file belongs to a stage.
- `quiz.answers` are three distinct strings, `quiz.correct` is `0`, `1` or `2`, and the correct answer is not always in the same position.
- Every glossary term is unique and every stage has at least one term.
- The old working title of the product does not appear anywhere in the repository, and no private hand-off file is committed.

## Editing a stage

1. Change the entry in `src/data/stages.json`.
2. If the title changes, update the short node label in `src/data/roadmap.mmd` too, and keep its twelve node ids `S01…S12`.
3. If the process the stage teaches changes, update `src/data/workflows/<slug>.mmd` and the `workflow.caption`.
4. Run `npm run verify` (content check, type-check, tests, build). Then look at the stage in `npm run dev`.

## Writing a Mermaid workflow

- Start the file with `flowchart TB`, `stateDiagram-v2` or `sequenceDiagram`.
- Aim for **one idea, 8–14 nodes**. The roadmap carries the sequence; the stage diagram carries one mechanism (a loop, a lifecycle, a decision flow).
- Prefer top-to-bottom flowcharts. Wide left-to-right diagrams shrink until the text is unreadable. Learners can also open any diagram full-size with *Expand*.
- Quote every label (`["like this"]`) so punctuation cannot break the parser. Use `<br/>` for line breaks.
- Reuse the shared `classDef` colours: steps (mint), decisions (lilac), terminal success (green), failure or escalation (amber/red), stores (slate).
- Diagrams are teaching aids, not runtime architecture. Do not imply that a design-only exercise is implemented.

## Style guide for lesson text

Explain exact mechanisms, failure modes and evaluation criteria. Flag hypothetical numbers, synthetic exercises and version-sensitive
guidance. Avoid absolute claims about employment, performance or security. Never write that sanitisation, a system prompt or a
container is a complete security boundary, and never invent benchmark figures.

## Labs and examples (future)

See [`content/labs/README.md`](../content/labs/README.md) for the lab manifest and [`EXTENDING.md`](EXTENDING.md) for the roadmap
from JSON content to MDX lessons.
