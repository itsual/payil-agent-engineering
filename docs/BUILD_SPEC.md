# Payil (பயில்) — portable GitHub repository build specification

> **Instructions for Codex, Grok Build, Claude Code, Cursor or any coding model.** You are the implementing engineer. Build a complete, responsive, appealing, deployable site from this single Markdown specification. Do not stop at creating a README or a mock-up. This document is self-contained: it defines the content, experience, data contracts, release boundaries and acceptance criteria. If a source repository is supplied alongside this document, treat that repository as the starting implementation and improve it rather than regenerating everything.
>
> **Project status:** Learning guide, v1.0 | **Updated:** 2026-10-19 | **Target repository name:** `payil-agent-engineering`

## 0. Brand

**Payil (பயில்)** is Tamil for *learn and practise*. Tagline: **“Learn to Engineer Intelligent Agents.”** Repository: `payil-agent-engineering`. The brand lives in `src/config.ts`, `index.html` and the README; stage content never needs to mention it.

## 1. Product intention and non-negotiable scope

Build **Payil (பயில்)**, a self-paced interactive visual learning platform about designing, securing and operating real-world AI agents. The core user journey is: **see the twelve-stage high-level learning workflow → choose a stage → understand what to learn → follow a conceptual design exercise → understand why it matters → check understanding → record progress.**

### Include in v1

- Exactly **12 stages** in the original learning order, grouped into three phases of four stages each: **Foundations (01–04)**, **Systems & control (05–08)**, **Production readiness (09–12)**.
- A **Mermaid high-level workflow** showing the twelve stages and their arrows **only**. Never overload this flowchart with detailed lesson cards, checklists or tool-specific architecture. Detailed learning belongs in the stage explorer.
- Beautiful, distinctive, editorial-grade interface: sophisticated dark navy background, mint/cyan primary accent, lilac for phase two, warm amber for phase three, clear typography and microinteractions. Responsive desktop, tablet and mobile; useful even without images.
- Roadmap page, stage explorer with **Learn / Practice / Why / Check yourself** sections, searchable stage catalog, phase filters, concept glossary, bookmarks, learning notes, checklists, one scenario-based quiz per stage, progress indicator and export to JSON.
- Source-linked references, practical outcomes, downloadable source repo and GitHub Pages-ready static deployment.
- Browser-local persistence only (`localStorage`); no authentication, backend, external LLM API, live tool execution or telemetry required. Clearly state progress is device-local.
- Accessibility: semantic headings, visible focus, usable keyboard navigation, labels, contrast, reduced-motion support, responsive horizontal Mermaid scroll, non-color status cues.

### Exclude in v1

- Live agents, model keys, database access, Postgres/MCP servers, Slack approvals, actual computer control, arbitrary code execution, simulated paid financial actions or external secret handling.
- Claims that learning guarantees employment, that most enterprise software has no API, that swarms always beat single agents, or that prompts/sanitization can guarantee security.
- “Coming soon” buttons that do nothing. Hide unimplemented functionality instead of presenting fake interactions.

## 2. Build stack and portable implementation guidance

Preferred stack: **React 19 + TypeScript + Vite 6 + CSS + Lucide + Mermaid 11**. Keep curriculum **data-driven** in `src/data/stages.json`, with a typed `Stage` contract in `src/data/types.ts`; avoid duplicating stage copy in JSX. Use relative Vite base URLs for GitHub Pages project subpaths. A simple static React SPA without routing is sufficient; tabs and selected stages can use in-app state. Build with `npm install && npm run check:content && npm run test && npm run build`. Use Node 22+. Commit a lockfile when registry access is available and migrate CI from `npm install` to `npm ci`.

Recommended project tree:

```text
payil-agent-engineering/
├── README.md
├── BUILD_SPEC.md
├── .github/workflows/ci.yml
├── .github/workflows/pages.yml
├── docs/CONTENT_MODEL.md
├── content/examples/                   # empty placeholder only in v1
├── package.json / tsconfig.json / vite.config.ts / index.html
├── public/favicon.svg
├── scripts/validate-content.mjs
└── src/
    ├── main.tsx
    ├── App.tsx
    ├── styles.css
    ├── components/MermaidRoadmap.tsx
    ├── data/{stages.json,stages.ts,types.ts,roadmap.mmd,glossary.json}
    └── lib/progress.ts
```

Maintain a clean separation of **curriculum content**, **visual components**, and **user progress**. Do not include any private LLM hand-off briefing in the repository or in a distributed archive; keep it as a separate file outside Git.

## 3. Diagram — high-level stages only

Implement the following Mermaid graph (visual colours may be adapted to the brand). It is a **learning sequence**, not a literal runtime architecture or a claim all stages must be present in every agent.

```mermaid
flowchart LR
  S01["01 · Architecture"] --> S02["02 · Tools & MCP"]
  S02 --> S03["03 · Computer use"]
  S03 --> S04["04 · Memory"]
  S04 --> S05["05 · Multi-agent"]
  S05 --> S06["06 · Sandboxing"]
  S06 --> S07["07 · Security"]
  S07 --> S08["08 · Human approval"]
  S08 --> S09["09 · Self-correction"]
  S09 --> S10["10 · Evals & CI"]
  S10 --> S11["11 · Fallbacks"]
  S11 --> S12["12 · Portfolio"]
  classDef foundations fill:#213f44,stroke:#8cf5d2,color:#edfefa,stroke-width:1.5px;
  classDef integration fill:#2d2950,stroke:#c9b6ff,color:#f7f3ff,stroke-width:1.5px;
  classDef production fill:#3c3040,stroke:#f8ca92,color:#fff7eb,stroke-width:1.5px;
  class S01,S02,S03,S04 foundations;
  class S05,S06,S07,S08 integration;
  class S09,S10,S11,S12 production;
  linkStyle default stroke:#97abc3,stroke-width:1.5px;
```

## 4. Interaction and UI specification

| Screen / interaction | Required behaviour |
|---|---|
| Landing hero | Clear title and 12-stage proposition; Start/Continue opens first incomplete stage. Phase summary with visual design elements, not stock photos. |
| Mermaid map | Render from `src/data/roadmap.mmd`; horizontal scroll on compact screens; key for three phase colours. Users select stages via cards/navigation below. |
| Stage catalog | Search stage names, summaries and concepts; phase filters; full cards with stage numbers, titles, summaries, phases, duration suggestions and status. |
| Stage explorer | Four useful tabs: **Learn** (concept explanations), **Practice** (design tasks/checklist and deliverables), **Why** (failure modes, rationale, guardrail), **Check** (scenario quiz, saved notes, self-mark completion). |
| Sidebar / mobile navigation | Overview, explorer, glossary, all twelve stages; visible selected state and completed markers; collapsed/reachable on mobile. |
| Progress | Completed IDs, checklist indices, bookmarks and notes saved to versioned localStorage schema, with safe validation and reset confirmation. Export actual data as JSON. No invented cloud sync. |
| Glossary | 30+ precise technical terms, searchable, each links back to its corresponding stage. |
| References | Curated primary/official links in stage details. Always external-link-safe (`target="_blank" rel="noreferrer"`). |
| Visual system | High-density but comfortable spacing, accent-coloured stage symbols, sophisticated cards, strong typographic hierarchy, light motion with reduced-motion support. |
| Accuracy notes | “Practice” tasks in v1 are design blueprints only, not runnable. The suggested learning hours are estimates, not promises. |

### Content contract

Each stage JSON entry should follow this shape (use equivalent TypeScript types):

```typescript
type Stage = {
  id: number; slug: string; title: string; shortTitle: string;
  phase: 'Foundations' | 'Systems & control' | 'Production readiness';
  duration: string; summary: string; outcome: string;
  learn: Array<{ concept: string; detail: string }>;
  practice: Array<{ title: string; detail: string }>;
  deliverables: string[]; why: string[]; guardrail: string;
  resources: Array<{ title: string; url: string; note: string }>;
  quiz: { question: string; answers: [string,string,string]; correct: number; explanation: string };
};
```

## 5. Full twelve-stage learning curriculum (authoritative content)

Each stage should contain **all** content below in a discoverable way. Preserve technical specificity; improvements to wording are welcome where correctness improves. The list provides the entire learning/practice/rationale structure, not just headlines.

### Stage 01: Agent architecture & state machines

**Phase:** Foundations · **Suggested effort:** 5–8 hours  
**Overview:** Replace opaque chat loops with explicit workflow transitions, durable state and predictable recovery.  
**Learning outcome:** Explain how a request flows through a graph and how execution resumes safely after interruption.

**What to learn**

- **DAGs versus cycles:** A DAG models dependencies without revisiting earlier nodes. Agent workflows may use bounded cycles for planning, tool execution and validation. Learn transition conditions and termination invariants.
- **State as a contract:** Represent messages, intermediate artifacts, tool results, retry budgets, status and human decisions as typed state. Define merge rules and redact secrets before serialization.
- **Durability and replay:** Understand checkpoints, event histories, idempotent side effects, deterministic replay and why persistence frequency changes both reliability and cost.
- **LangGraph versus Temporal:** Compare graph-native checkpoints/interrupts with workflow runtime execution histories and activities. Pick by deployment model, task duration and operational needs.

**What to practise** (design-only in v1)

1. **Model the workflow:** Draw intake → plan → execute → validate with an explicit revision path, a maximum of three attempts and a terminal failure state.
2. **Define the state schema:** Specify fields, types, allowed transitions, persisted artifacts and what is deliberately excluded from storage.
3. **Test crash recovery on paper:** Simulate a crash after an external action but before checkpointing; document how idempotency keys prevent duplicates.
4. **Compare runtimes:** Write a one-page decision record covering LangGraph, Temporal and a simpler deterministic orchestrator.

**Deliverables:** State-transition diagram with bounded loops; Typed state schema and termination policy; Crash/replay and idempotency decision record.

**Why it matters**

- An LLM-generated next step is not a durable workflow state transition.
- Failures, retries and approvals require a reproducible history if outcomes matter.

**Production guardrail:** A state machine does not automatically make external tool actions exactly-once; design idempotency and compensating actions.

**Knowledge check:** A worker crashes after charging a card. What prevents a replay from charging it again?
- A. Add an idempotency key to the charge
- B. Increase model context length
- C. Wrap execution in an unbounded loop
Correct answer: **A**. Persistence alone cannot make external side effects exactly-once; a stable idempotency key or reconciliation is required.

**References:** [LangGraph persistence](https://docs.langchain.com/oss/python/langgraph/persistence) (Checkpointing, state and stores); [Temporal documentation](https://docs.temporal.io/temporal) (Execution history and durability)

### Stage 02: Tool use & Model Context Protocol

**Phase:** Foundations · **Suggested effort:** 5–8 hours  
**Overview:** Give agents a standard, auditable way to discover and call tools without expanding their privileges.  
**Learning outcome:** Trace the complete tool-call lifecycle: discovery → authorization → validation → execution → result.

**What to learn**

- **JSON-RPC and MCP roles:** Study requests, responses, errors, transports and the difference between hosts, clients and servers. Understand tools, resources and prompts.
- **Contracts and Pydantic:** Define strict input/output schemas, reject extra fields where appropriate, validate types and bound values. JSON Schema alone does not authorize an action.
- **Discovery and permissions:** Tool availability should follow the caller’s approved scopes. Learn per-request authorization, audit trails, rate limits and server-side enforcement.
- **Trust boundaries:** Tool metadata and returned content may be attacker-controlled. Do not treat a tool description or database record as a higher-priority instruction.

**What to practise** (design-only in v1)

1. **Design a local MCP service:** Specify a small read-only catalog backed by a disposable PostgreSQL instance using the documented protocol, without depending on a wrapper SDK for protocol behavior.
2. **Threat-model access:** Include scoped allowlisted queries, parameter binding, credential isolation, per-request auth checks, rate limiting and no arbitrary SQL endpoint.
3. **Write protocol test cases:** Define valid and invalid JSON-RPC payloads, untrusted tool text, missing auth, denied scope and malformed inputs.
4. **Explain observability:** Sketch redacted audit events: principal, scope, tool, input hash, decision, latency and outcome.

**Deliverables:** MCP request/response examples (specification only); Read-only service contract and permission matrix; Security and interoperability test checklist.

**Why it matters**

- Standard protocols reduce integration friction but never remove the need for access control.
- Strict, predictable tool contracts reduce ambiguous execution and simplify debugging.

**Production guardrail:** Never use a real production database or publish credentials. Use synthetic data and read-only, least-privilege access for a future lab.

**Knowledge check:** A tool call has valid JSON Schema. Is it authorized?
- A. Yes, schema validation implies authorization
- B. No, enforce authorization separately on the server
- C. Only if the tool description says it is safe
Correct answer: **B**. Schema validity constrains input shape; authorization decides what that principal may do.

**References:** [MCP core specification](https://modelcontextprotocol.io/specification) (JSON-RPC-based protocol reference); [MCP tools](https://modelcontextprotocol.io/specification/2026-07-28/server/tools) (Server-side tool rules and security); [Pydantic docs](https://docs.pydantic.dev/latest/) (Typed data validation)

### Stage 03: Computer use & GUI automation

**Phase:** Foundations · **Suggested effort:** 5–8 hours  
**Overview:** Understand how to interact with authorized browser-based systems when a stable API is unavailable.  
**Learning outcome:** Choose reliably between semantic DOM actions and guarded visual interactions.

**What to learn**

- **DOM-first automation:** Use accessible roles, labels and stable locators before coordinate clicks; understand auto-waiting and fragile selectors.
- **Visual grounding:** Understand screenshots, Set-of-Mark overlays, viewport scaling, coordinate transforms and uncertainty in visual target selection.
- **Session handling:** Learn authenticated sessions, secret stores, MFA boundaries, consent and auditability. Avoid hard-coded credentials or authentication bypasses.
- **Validation and recovery:** Verify the page state after each consequential action. Detect stale screenshots, downloads, navigation changes and bot/permission boundaries.

**What to practise** (design-only in v1)

1. **Map a legacy portal:** Describe an authorized synthetic portal with login, navigation, filters and an export CSV button.
2. **Compare two approaches:** Write a DOM locator strategy and a screenshot-guided strategy; specify the fallback criteria and confidence threshold.
3. **Design evidence capture:** Plan a log of screenshots with sensitive fields masked, selected element, observed state and final CSV verification.
4. **Test failure cases:** Model unexpected modal dialogs, failed downloads, changed layout and account logout.

**Deliverables:** DOM versus vision decision table; Annotated, synthetic portal journey; Recovery and screenshot privacy checklist.

**Why it matters**

- GUI control expands coverage where APIs are absent, but is generally brittle and higher risk.
- An agent must know whether an action actually happened rather than inferring success from its intent.

**Production guardrail:** Use an authorized test portal. Never bypass CAPTCHA/MFA or automate systems without permission; limit downloads to synthetic data.

**Knowledge check:** What is the first choice for clicking a labeled export button in a normal web app?
- A. A fixed screen coordinate
- B. A role/label-based DOM locator
- C. A random CSS selector
Correct answer: **B**. Semantic DOM locators generally survive layout changes better than fixed coordinates.

**References:** [Playwright locators](https://playwright.dev/docs/locators) (Stable semantic selectors); [Playwright screenshots](https://playwright.dev/docs/screenshots) (Visual observation and evidence)

### Stage 04: Advanced memory & context engineering

**Phase:** Foundations · **Suggested effort:** 5–8 hours  
**Overview:** Make context deliberate: retain what is useful, expire what is stale, and protect private information.  
**Learning outcome:** Design a memory lifecycle with explicit retention, retrieval, summarization and deletion rules.

**What to learn**

- **Working, episodic and semantic memory:** Working state contains the active task; episodic records prior interactions and outcomes; semantic memory stores reusable facts and concepts. These are architectural categories, not mandatory products.
- **Compression and retrieval:** Understand extractive versus abstractive summaries, retrieval ranking, citation-to-source, uncertainty and when to rehydrate raw history.
- **Token and quality budgets:** Reserve context for instructions, observations, tool outputs and expected answer length. Track lost constraints and summary drift.
- **Retention, consent and deletion:** Assign TTLs, allow correction and deletion, separate tenants, and avoid embedding secrets or regulated data without controls.

**What to practise** (design-only in v1)

1. **Design a fifty-turn memory case:** Use a fictional conversation with changing preferences and mutually conflicting requirements.
2. **Write compression criteria:** Preserve current goals, binding constraints, decisions, unresolved questions and provenance; exclude repetition and expired trivia.
3. **Specify evaluation metrics:** Define recall-at-k, constraint retention, false-memory rate, token savings and deletion effectiveness.
4. **Create an eviction policy:** Combine recency, relevance, confidence, sensitivity and TTL instead of trusting vector similarity alone.

**Deliverables:** Working/episodic/semantic storage diagram; Summarization rubric and token budget; Memory privacy and retrieval evaluation plan.

**Why it matters**

- Longer contexts raise cost and distract from the relevant evidence; they are not inherently accurate memory.
- Unverified compressed summaries can turn tentative statements into permanent false facts.

**Production guardrail:** Never claim unlimited context or guaranteed hallucination prevention; require source links, confidence and a deletion pathway.

**Knowledge check:** Which item should be hardest to evict from a memory summary?
- A. A repeated greeting
- B. An explicit unresolved requirement with its source
- C. An outdated transient weather detail
Correct answer: **B**. Binding constraints and provenance are more useful than repetitive or expired context.

**References:** [LangGraph memory overview](https://docs.langchain.com/oss/python/langgraph/memory) (Short- and long-term memory patterns); [OpenAI prompting guide](https://platform.openai.com/docs/guides/prompt-engineering) (Context and instruction design)

### Stage 05: Multi-agent coordination & A2A handoffs

**Phase:** Systems & control · **Suggested effort:** 5–8 hours  
**Overview:** Choose explicit delegation only when multiple agent roles improve measurable outcomes.  
**Learning outcome:** Model handoffs as verified contracts with owners, budgets and exit conditions.

**What to learn**

- **Supervisor and peer topologies:** Compare a central supervisor, pipeline, hierarchical delegates and peer collaboration. Distinguish agents from ordinary deterministic services.
- **A2A versus MCP:** MCP connects an application to tools/data; A2A supports communication between separate agentic applications. They solve different interoperability problems.
- **Typed handoff envelopes:** Define task IDs, instructions, artifact links, status, confidence, approvals, schema versions and escalation rules.
- **Consensus limits:** Multiple agents can make the same mistake. Assess correlated failures, voting cost and when a single agent plus validator is superior.

**What to practise** (design-only in v1)

1. **Specify three roles:** Define a Researcher, Coder and Reviewer working on a mock assignment with explicit boundaries and stopping criteria.
2. **Design handoff schemas:** Pass a typed JSON envelope with task ID, evidence refs, artifact refs, acceptance tests and error states; avoid dumping entire conversation history.
3. **Budget the graph:** Create a plan for retries, maximum delegation depth, token cost and cancellation.
4. **Compare baselines:** Propose a test against a simpler one-agent workflow on quality, latency and cost.

**Deliverables:** Supervisor versus peer-to-peer comparison; Versioned JSON handoff envelopes; Baseline and cost evaluation plan.

**Why it matters**

- Delegation can reduce context interference, but adds latency, cost and coordination failure modes.
- Handoff boundaries are natural checkpoints for validating evidence and permissions.

**Production guardrail:** Do not label a multi-agent workflow better by default. Require evidence that role specialization outperforms a simpler design.

**Knowledge check:** When should a three-agent architecture be preferred?
- A. Always, because voting prevents hallucinations
- B. When measured task quality or reliability outweighs added cost and complexity
- C. Whenever there are three steps
Correct answer: **B**. Multi-agent design should be justified against a simpler baseline.

**References:** [A2A protocol](https://a2a-protocol.org/latest/) (Interoperability between agents); [MCP introduction](https://modelcontextprotocol.io/introduction) (Tools versus agents)

### Stage 06: Sandboxed execution environments

**Phase:** Systems & control · **Suggested effort:** 5–8 hours  
**Overview:** Treat generated code as untrusted and execute it only inside constrained isolation boundaries.  
**Learning outcome:** Produce an isolation design that fails safely under malicious or runaway workloads.

**What to learn**

- **Isolation spectrum:** Compare subprocesses, containers, user namespaces, gVisor and microVMs; explain what threats each boundary does and does not contain.
- **Resource and time limits:** Specify CPU, memory, disk, process, file-size, wall-clock and output budgets and the behavior when a limit is hit.
- **Network and data controls:** Default to deny egress, mount only disposable working files, avoid host sockets and scrub secrets from the environment.
- **Execution lifecycle:** Understand image pinning, ephemeral sandboxes, artifact collection, process cleanup and audit traces.

**What to practise** (design-only in v1)

1. **Describe a synthetic code interpreter:** Design a future Python lab that executes trusted test snippets and untrusted model output inside a short-lived isolated environment.
2. **Threat-model escape routes:** Document why host filesystem mounts, privileged containers and open network egress violate the target isolation guarantee.
3. **Plan failure testing:** Include infinite loops, memory spikes, file traversal and attempted network access.
4. **Record operational needs:** Specify cleanup guarantees, costs per execution and retention for safe output artifacts.

**Deliverables:** Sandbox architecture and threat model; Resource/egress policy with kill conditions; Test matrix for escape and exhaustion scenarios.

**Why it matters**

- LLM-supplied code must never execute with the application server’s ordinary privileges.
- Isolation design must account for the host kernel, mounts and environment, not simply “use Docker.”

**Production guardrail:** Containers are not automatically microVMs. Do not claim zero internet access unless egress is explicitly blocked and verified.

**Knowledge check:** Which setting best supports an offline untrusted-code sandbox?
- A. Block outbound network and deny host mounts
- B. Use a longer system prompt
- C. Run as administrator for compatibility
Correct answer: **A**. Explicit network and filesystem isolation is enforceable; a prompt is not a security boundary.

**References:** [gVisor docs](https://gvisor.dev/docs/) (Sandboxed container runtime); [E2B docs](https://e2b.dev/docs) (Cloud sandboxes; validate product-specific isolation)

### Stage 07: Inter-agent security & guardrails

**Phase:** Systems & control · **Suggested effort:** 5–8 hours  
**Overview:** Prevent untrusted content from silently gaining authority over tools, data and downstream agents.  
**Learning outcome:** Trace and constrain a cross-agent prompt-injection attempt with enforceable controls.

**What to learn**

- **Indirect prompt injection:** Recognize instructions embedded in email, search results, repositories, documents or tool outputs. Data content must not be elevated to instructions.
- **Tool poisoning and confused deputy:** Inspect malicious tool descriptions, overbroad delegated credentials, permission escalation and cross-tenant leakage.
- **Defense in depth:** Use structured channels, provenance labels, scoped tool grants, policy decision points, output validation and confirmation on sensitive operations.
- **Detection and testing:** Learn adversarial fixture construction, escalation paths, failure severity and containment. Sanitization and model classifiers are imperfect.

**What to practise** (design-only in v1)

1. **Create a synthetic malicious email:** Draft a benign business message with an embedded instruction trying to make another agent export database rows.
2. **Draw the trust boundary:** Mark email content as untrusted input and name the policy layer that rejects out-of-scope database access.
3. **Specify prevention controls:** Require downstream tool-side authorization, input filtering, provenance-aware routing and human confirmation for sensitive exports.
4. **Define red-team criteria:** Propose allowed and blocked runs, false-positive costs and escalation logging.

**Deliverables:** Threat-boundary diagram; Attack/defense matrix with pass criteria; Agent-to-agent least-privilege policy.

**Why it matters**

- Agents can launder external instructions through trusted internal handoffs.
- The decisive control belongs at the tool and identity boundary, not a natural-language warning alone.

**Production guardrail:** Removing suspicious sentences cannot guarantee safety. Enforce access control even if content filters fail.

**Knowledge check:** An email tells the agent to run an admin-only database export. What blocks it most reliably?
- A. A short “ignore injections” system prompt
- B. Tool-side authorization denying the principal that scope
- C. Removing all punctuation from the email
Correct answer: **B**. Authorization must be enforced at the resource boundary regardless of model behavior.

**References:** [OWASP LLM Top 10](https://genai.owasp.org/llm-top-10/) (Prompt-injection and excessive-agency risks); [MCP security best practices](https://modelcontextprotocol.io/specification/2026-07-28/basic/security_best_practices) (Protocol trust and token issues)

### Stage 08: Human-in-the-loop & durable breakpoints

**Phase:** Systems & control · **Suggested effort:** 5–8 hours  
**Overview:** Introduce accountable approvals for high-impact actions without holding a process open in memory.  
**Learning outcome:** Specify a paused workflow that can safely resume after a long delay or restart.

**What to learn**

- **Approval as a durable state:** Persist request ID, task state, immutable proposed action, approver identity, expiry, version and decision history.
- **Resume semantics:** Learn interrupt/resume checkpoints, webhook identity verification, deduplication and stale-approval invalidation.
- **Policy routing:** Choose who must approve, at what thresholds, and what happens on denial, timeout or changes to the proposed action.
- **External channels:** Understand Slack/Teams interaction patterns without binding the workflow’s correctness to a chat-message lifetime.

**What to practise** (design-only in v1)

1. **Model an invoice review:** Specify a draft $10,000 invoice that requires a named approver before an external financial action.
2. **Design a three-day pause:** Document what must persist, a signed callback, expiry/denial behavior and cancellation after edits.
3. **Test races:** List scenarios for two approvers, duplicate webhooks, changed invoice total and resumed execution after deployment.
4. **Define evidence:** Describe approval ledger fields and what auditors need to reconstruct the decision.

**Deliverables:** Approval state machine with expiry and denial; Webhook identity and replay-protection specification; Audit-ledger event schema.

**Why it matters**

- A process cannot rely on a long-running browser or chat session while waiting days for a decision.
- Human approval is only meaningful when tied to the exact action and evidence reviewed.

**Production guardrail:** Do not authorize financial actions based solely on a Slack display name or a mutable message; verify identity and bind approval to an immutable proposal version.

**Knowledge check:** An approved invoice changes after sign-off. What should happen?
- A. Proceed with the old approval
- B. Invalidate approval and request sign-off on the new version
- C. Silently update the amount
Correct answer: **B**. Approval must bind to exactly the proposed action reviewed by the approver.

**References:** [LangGraph interrupts](https://docs.langchain.com/oss/python/langgraph/interrupts) (Stateful pause and resume); [Slack interactivity](https://api.slack.com/interactivity/handling) (Request signing and callbacks)

### Stage 09: Self-correction & bounded reflection

**Phase:** Production readiness · **Suggested effort:** 5–8 hours  
**Overview:** Use structured failure evidence to recover when safe, and stop before retries become runaway loops.  
**Learning outcome:** Design a bounded diagnose → revise → verify cycle with useful escalation.

**What to learn**

- **Evidence-led reflection:** Collect stack traces, compiler errors, failing tests, tool metadata and previous attempts; distinguish an environmental failure from a code defect.
- **Retry classification:** Separate transient faults, deterministic failures, policy denials and non-retriable side effects.
- **Budgets and backoff:** Set maximum attempts, wall-clock, token spend, exponential backoff and conditions that terminate the loop.
- **Independent verification:** Run tests and checks outside the generating model where possible; preserve diffs and failure histories.

**What to practise** (design-only in v1)

1. **Specify a coding-repair cycle:** Given a failing unit-test fixture, plan up to three repairs with a fixed test command and immutable acceptance criteria.
2. **Design retry state:** Track attempt number, error fingerprint, prior fixes and whether the new attempt truly changed the failure mode.
3. **Define escalation:** After three failed attempts, produce a compact human-readable incident with the stack trace and attempted fixes.
4. **Evaluate efficiency:** Measure resolution rate, average attempts, cost and regressions introduced by the repair.

**Deliverables:** Bounded repair graph and escalation rules; Failure-class taxonomy; Correction outcome evaluation rubric.

**Why it matters**

- A repair agent needs precise feedback to improve; generic “try again” loops often waste tokens.
- Unbounded retries create costs and may repeat unsafe side effects.

**Production guardrail:** Never auto-retry payments, deletes or permission changes without explicit idempotency and risk controls.

**Knowledge check:** After three deterministic test failures, the agent should:
- A. Escalate with the trace and attempted fixes
- B. Continue until context is exhausted
- C. Disable the failing test
Correct answer: **A**. Escalation keeps failure visible rather than hiding it through unlimited retries.

**References:** [OpenAI evals guide](https://platform.openai.com/docs/guides/evals) (Measuring behavioral changes); [Python traceback docs](https://docs.python.org/3/library/traceback.html) (Failure diagnostics)

### Stage 10: Trajectory evaluations & CI quality gates

**Phase:** Production readiness · **Suggested effort:** 5–8 hours  
**Overview:** Measure what the agent actually did, not just whether its final answer sounded plausible.  
**Learning outcome:** Define a reproducible, risk-weighted evaluation suite for tool actions and workflow trajectories.

**What to learn**

- **Outcome versus trajectory:** Measure final correctness and intermediate calls, side effects, refusals, cost and timing. Different valid paths may reach the same outcome.
- **Goldens and invariants:** Use gold traces where order matters and flexible invariants where alternative legitimate routes exist.
- **Rubric and judge calibration:** Compare programmatic assertions, deterministic replay and model-graded outputs. Measure judge agreement and false positives.
- **CI and regression discipline:** Version fixtures, pin test environments, label flaky cases, set statistically meaningful baselines and enforce policy/safety gates.

**What to practise** (design-only in v1)

1. **Design 100 synthetic trajectories:** Specify diverse normal, edge and adversarial fixture categories with expected tool permissions and outcomes.
2. **Write gating rules:** Block a pull request on unauthorized tool calls or skipped approvals, while separately reporting task success, latency and cost.
3. **Avoid overfitting:** Accept equivalent safe paths and maintain holdout examples; do not force literal tool-order matches without cause.
4. **Specify triage:** Create failure buckets and ownership for flaky tests, regression investigations and judge drift.

**Deliverables:** Evaluation taxonomy and fixture inventory; CI gate policy with hard and soft thresholds; Scorecard design for cost, quality and safety.

**Why it matters**

- Only checking final text misses unsafe or incorrect intermediate behavior.
- Rigid exact-sequence matching can reject valid alternatives and reward memorized paths.

**Production guardrail:** Make safety invariants hard gates; do not make every path a rigid golden trace or use an uncalibrated LLM judge as the only arbiter.

**Knowledge check:** Two valid agents call independent read-only tools in opposite order. How should CI treat this?
- A. Fail both unless order matches one golden trace
- B. Evaluate outcome and required invariants; allow harmless reorderings
- C. Ignore all tool traces
Correct answer: **B**. Trajectory evaluation should constrain meaningful safety and process requirements, not incidental ordering.

**References:** [OpenAI evals](https://platform.openai.com/docs/guides/evals) (Dataset and evaluator patterns); [GitHub Actions](https://docs.github.com/en/actions) (CI workflow mechanics)

### Stage 11: Graceful degradation & intelligent fallbacks

**Phase:** Production readiness · **Suggested effort:** 5–8 hours  
**Overview:** Keep services useful during outages without silently changing authority, data quality or risk.  
**Learning outcome:** Define safe fallback routing that makes failure visible and preserves the original permissions.

**What to learn**

- **Circuit breakers and budgets:** Learn failure thresholds, cool-downs, retries, queue backpressure and maximum spend.
- **Fallback selection:** Compare alternative models, cached responses, queued work, reduced functionality and human intervention.
- **API to GUI boundary:** A 404 may mean “not found,” not service failure. Browser automation should never bypass policy or create an unapproved side channel.
- **SLOs and observability:** Define error rates, user-visible status, escalation, latency budgets and fail-open versus fail-closed criteria.

**What to practise** (design-only in v1)

1. **Model a failing integration:** Distinguish 404, 429, 503, permission denied, schema mismatch and timeout; choose an explicit response for each.
2. **Specify a routing matrix:** For eligible read-only tasks choose validated alternate APIs, synthetic browser tests, cache or manual queue based on risk.
3. **Budget cost and latency:** Estimate per-path caps and when a kill switch cancels a task.
4. **Write incident communication:** Design user-facing states such as degraded, queued, failed and requires approval.

**Deliverables:** Failure-code decision matrix; Circuit-breaker state diagram; Fallback security and SLA checklist.

**Why it matters**

- Availability improves when expected failure modes have rehearsed handling.
- Unapproved fallbacks can turn an outage into unauthorized access or incorrect data.

**Production guardrail:** A REST API returning HTTP 404 must not automatically trigger scraping; verify semantics, authorization, policy and data equivalence first.

**Knowledge check:** An API returns 404. What should the agent do first?
- A. Always launch a browser
- B. Determine whether the resource is absent or the endpoint failed
- C. Retry forever using another model
Correct answer: **B**. 404 can be a valid terminal answer; a fallback must respect task semantics and authorization.

**References:** [Google SRE workbook](https://sre.google/workbook/table-of-contents/) (Reliability and incident practices); [Microsoft resilience patterns](https://learn.microsoft.com/en-us/azure/architecture/patterns/circuit-breaker) (Circuit breakers and fallback controls)

### Stage 12: Public teardowns & engineering portfolio

**Phase:** Production readiness · **Suggested effort:** 5–8 hours  
**Overview:** Show engineering judgment with reproducible measurements, architecture decisions and known limitations.  
**Learning outcome:** Publish a credible, security-conscious case study that others can inspect and reproduce.

**What to learn**

- **Architecture decision records:** State context, alternatives, decision, trade-offs, reversibility and operational consequences.
- **Task economics:** Calculate cost per successful task, variance, latency percentiles and timeouts; distinguish model cost from infrastructure and human labor.
- **Benchmark quality:** Publish sample definitions, baselines, success criteria, confidence intervals where appropriate and common failure modes.
- **Communication and reproducibility:** Provide minimal architecture diagrams, redacted traces, fixture data, setup steps and limitations without leaking secrets.

**What to practise** (design-only in v1)

1. **Draft a retrospective:** Outline an engineering teardown of an earlier stage or hypothetical three-agent system.
2. **Create a measurement plan:** Define success rate, tool-side policy violations, latency p50/p95, dollar cost per completed task and reproducibility.
3. **Write two ADRs:** Justify orchestration choice and sandbox/trust boundary choice against alternatives.
4. **Prepare a public release checklist:** Exclude credentials, PII, privileged data and unlicensed assets; include an evidence-backed limitations section.

**Deliverables:** Project teardown outline and KPI scorecard; Two ADR templates; Publishability and security checklist.

**Why it matters**

- Strong portfolios reveal trade-offs and failures rather than only polished demonstrations.
- Verified engineering evidence is more informative than framework name-dropping.

**Production guardrail:** Do not fabricate benchmark results. Mark placeholder figures as hypothetical until measurements are available.

**Knowledge check:** Which portfolio claim is strongest?
- A. “Never fails in production”
- B. “94/100 synthetic tasks succeeded under a published fixture set, with named limitations”
- C. “Built using many agent frameworks”
Correct answer: **B**. Reported denominators, methodology and limitations make claims inspectable.

**References:** [ADR guidance](https://adr.github.io/) (Architecture decision records); [GitHub Pages docs](https://docs.github.com/en/pages) (Static publication); [Google SRE book](https://sre.google/sre-book/table-of-contents/) (Operational measurement principles)

## 6. Future-proofing without feature creep

Version 1 is an educational platform, not a learning management system or a deployed agent product. Preserve IDs 01–12. Future additions should be incremental and stage-local:

- **V2 — content:** `content/stages/01-.../lesson.mdx`, runnable toy examples with synthetic fixtures, downloadable lab handouts and added tests. Migrate from JSON carefully, preserving stable stage IDs and UI behaviours.
- **V3 — exercises:** isolated, explicitly opt-in sandboxes and evaluator-backed practical assignments. Never run LLM-authored code inside the web server process or browser shell without a real threat model.
- **V4 — community:** opt-in identity/sync, contributor workflow, reviewed public teardowns, progress portability, optional assessments with provenance. Add a privacy policy before collecting accounts or analytics.

Do not instantiate live MCP/database/code-interpreter infrastructure in v1 just because it is mentioned as curriculum.

## 7. Definition of done for a coding agent

1. `npm run check:content` validates **exactly 12 ordered stages**, unique stable slugs, links, one valid quiz per stage, and 24+ glossary terms.
2. `npm run test` and `npm run build` pass in an environment with installed dependencies. Provide useful fixes when they do not; do not claim tests passed unless executed.
3. Mermaid renders a single high-level 12-stage workflow; no detailed nested architecture in the diagram.
4. On desktop and mobile, users can move from roadmap to a stage, swap tabs, answer a quiz, check practice items, bookmark, write notes, complete a stage and navigate back. Reload preserves progress.
5. Search filters and glossary work; export downloads an accurate JSON copy; reset requires confirmation.
6. No dead controls, no external secrets, no runtime backend, no fake certificates, no fabricated benchmarks, no claim of guaranteed employment.
7. README contains local setup and GitHub Pages publication steps; GitHub Actions build and deploy static `dist/`.
8. Preserve portable content sources and coherent code structure so another coding model can edit a stage without reading or rewriting the whole UI.
9. **Never add a private LLM hand-off briefing to the repository.** Regenerate it separately whenever the architecture or public functions change.

## 8. Model execution instruction

If given *only this file*: create the complete repo in the current working directory, populate all learning data, implement interactivity, run validations where possible and give exact commands for publishing it to GitHub. If given *this file plus a starter repository*: first inspect its structure, make targeted improvements, preserve working components and edit content in the canonical JSON source. Report unverified operations explicitly. Do not ask for product or design decisions already specified here. Do not publish to an online account without user approval and an authorized connection.


## 9. Implementation addendum (Payil v1.0.0)

The shipped implementation follows this specification. Where it goes further or differs, it does so deliberately:

- **Per-stage Mermaid workflows.** Section 3 requires the *roadmap* diagram to stay high-level. Each stage additionally has its
  own diagram in `src/data/workflows/<slug>.mmd`, shown at the top of the Learn tab with an *Expand* viewer. The roadmap itself is
  unchanged: exactly twelve nodes and their arrows, rendered from `src/data/roadmap.mmd`, with nodes made keyboard-operable links.
- **Hash routing.** A tiny hash router (`#/stage/3/practice`) replaces in-memory state so every stage and tab has a shareable URL
  and browser back/forward work. There is still no routing library and no server rewrite requirement.
- **Progress import** (in addition to export), a persisted "knowledge check passed" flag per stage, and cross-tab sync.
- **Light and dark themes**, dark by default, following the OS preference until the learner chooses.
- **Rebalanced quiz answers.** The correct option is spread evenly across A, B and C so the answer position is not guessable.
- **Self-hosted fonts** (Inter, Manrope, Noto Sans Tamil for the "பயில்" wordmark); no third-party requests.
- **Labs extension point.** `content/labs/<slug>/lab.json` manifests are validated and rendered when present. None ship in v1, so
  no stage shows a lab (consistent with "hide unimplemented functionality").
- **Tests beyond the content check:** unit tests for progress, routing, search and lab parsing; a test that parses every Mermaid
  source with the real Mermaid parser; and component tests for the main user journeys.

Everything in Section 1 "Exclude in v1" still holds: no live agents, no keys, no database, no code execution, no telemetry.
