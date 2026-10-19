# Hands-on labs (extension point)

Payil v1 is a **learning-only** platform: its practice tasks are design exercises, and no lab ships yet. This folder is where
future hands-on labs live, so they can be added **one stage at a time without touching the website code**.

## How a lab is added

1. Create a folder named after the stage, for example `content/labs/06-sandbox-escape/`.
2. Add a `lab.json` manifest (below). The site loads it automatically and shows a **Hands-on lab** card at the bottom of that
   stage's *What to practise* tab. Stages without a lab show nothing: there are no placeholder buttons.
3. Put everything else the lab needs next to the manifest: a `README.md` with the instructions, synthetic fixtures, starter
   code, expected outputs. The card links to this folder on GitHub.
4. Run `npm run check:content`. It validates every manifest and fails CI if one is malformed.

## `lab.json`

```json
{
  "stageId": 6,
  "title": "Run untrusted code in a throwaway sandbox",
  "summary": "Execute a synthetic snippet inside an isolated, network-less container and prove the limits hold.",
  "estimatedTime": "2 hours",
  "objectives": [
    "Apply CPU, memory and wall-clock limits",
    "Show that outbound network access is blocked"
  ],
  "prerequisites": ["Docker or Podman installed locally"],
  "safety": [
    "Synthetic data only, no real credentials",
    "The sandbox has no network and no host mounts"
  ],
  "verification": ["The infinite-loop fixture is killed within 5 seconds", "The network probe fails"]
}
```

| Field | Required | Notes |
|---|---|---|
| `stageId` | yes | Integer 1–12. |
| `title`, `summary`, `estimatedTime` | yes | Plain text. |
| `objectives` | yes | At least one. |
| `safety` | **yes** | At least one. Every lab must say how it stays safe: synthetic data, isolation, no secrets. |
| `prerequisites`, `verification` | no | Lists of short strings. |

## Ground rules

- **Never run learner or model-authored code in the website, the browser or a server process.** A lab that executes code must
  run in its own isolated environment that the learner starts themselves, with a written threat model.
- Use synthetic data only. Do not commit credentials, tokens, personal data or progress exports.
- Do not present a lab as more than it is. A conceptual exercise stays a design exercise.
- Prefer small, reproducible fixtures with expected outputs over long narrative instructions.
