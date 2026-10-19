# Contributing to Payil

Thanks for helping people learn to build safer, more reliable agents. Corrections to the lessons are the most valuable
contributions.

## Set up

```bash
npm install
npm run dev        # http://localhost:5173
npm run verify     # content check + type-check + tests + production build
npm run check:links  # after editing references: does every link still resolve? (needs network)
```

Node 22 or newer is required (see `.nvmrc`).

## What to change

- **A lesson, task, quiz or reference** → `src/data/stages.json`. Please cite an official source for technical claims and keep the
  tone precise and cautious. See [`docs/CONTENT_MODEL.md`](docs/CONTENT_MODEL.md).
- **A diagram** → `src/data/workflows/*.mmd`. `npm test` parses every diagram, and the browser shows whether it is legible.
- **The UI** → `src/components` and `src/styles`. Keep files small and single-purpose. Architecture notes are in
  [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).
- **A lab or example** → [`content/labs/README.md`](content/labs/README.md).

## Before opening a pull request

1. `npm run verify` passes.
2. You looked at the change in the browser at desktop and phone width, in light and dark themes, using only the keyboard too.
3. New logic has a test. New content passes `npm run check:content`.
4. You did not add: secrets, learner data, unlicensed assets, benchmark numbers without a method, or claims that a design exercise
   is a working system.

## Licensing of contributions

Code is MIT and lessons are CC BY 4.0 (see [`LICENSING.md`](LICENSING.md)). By contributing you agree your contribution is
licensed the same way as the file you change. Only submit material you have the right to license.

## Content principles

The curriculum corrects common overstatements on purpose: state checkpoints do not make external side effects exactly-once; schema
validation is not authorization; MCP and A2A solve different problems; a multi-agent design needs evidence that it beats a simpler
one; containers are not automatically microVMs; text sanitisation is not a security boundary; approvals must bind to an immutable
action version; retries must be bounded and risk-classified. Please keep that standard.
