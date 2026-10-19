# Extending Payil

Payil v1 is intentionally small: a learning platform, not a lab environment or an LMS. This document says how it is meant to grow
without a rewrite, and what must **not** be done along the way.

## Today: add or improve content

| I want to… | Change |
|---|---|
| Improve a lesson, task, quiz or reference | `src/data/stages.json` |
| Change a stage diagram | `src/data/workflows/<slug>.mmd` (+ `workflow.caption` in `stages.json`) |
| Change the roadmap diagram | `src/data/roadmap.mmd` |
| Add glossary terms | `src/data/glossary.json` |
| Re-skin the site | `src/styles/tokens.css`, then the component files in `src/styles` |
| Rename the brand or change URLs | `src/config.ts`, `index.html`, `README.md` |

Always finish with `npm run verify`.

## Next: hands-on labs and worked examples (extension point already in place)

Drop `content/labs/<slug>/lab.json` (schema in [`content/labs/README.md`](../content/labs/README.md)). The Practice tab of that
stage then shows a **Hands-on lab** card (objectives, prerequisites, a mandatory safety note, verification steps and a link to
the lab folder). No code changes are needed, and `npm run check:content` validates the manifest.

Labs are *content and instructions*. If a lab needs to execute code, that code runs in the learner's own isolated environment
(a container or VM they start deliberately), described in the lab's own README with a threat model. **The website never executes
learner- or model-authored code.**

## Later: richer lessons (v2)

Move long-form lessons to `content/stages/<slug>/lesson.mdx` and derive the catalog metadata at build time. Keep the stable stage
ids, keep `stages.json` (or a generated equivalent) as the source of truth for catalog data, and keep the validator in CI. Add MDX
only when lessons genuinely need components; plain Markdown is cheaper to review.

## Later still (v3, v4): guarded exercises, community

- **Evaluator-backed exercises** need a separate service with an explicit threat model, resource limits and no default network
  egress. Never run untrusted code in the browser shell or inside the web server process.
- **Accounts, sync, shared teardowns** need a privacy policy *before* any identity or analytics is collected, an opt-in flow, and
  a data-export and deletion path. The existing JSON export/import is the portable baseline to migrate from.

## Guardrails for contributors

- Do not claim a design-only exercise is runnable. Do not invent benchmark figures, costs or success rates. Mark hypotheticals.
- Do not add live model keys, database access, secret handling or telemetry to the static site.
- Do not commit learner data: progress exports, notes or screenshots of them.
- Keep stage ids stable; progress is keyed by them.
