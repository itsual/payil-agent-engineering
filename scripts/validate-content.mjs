// Dependency-free content validation. Run with `npm run check:content` (also part of CI).
// It collects every problem and reports them together, rather than stopping at the first.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const exists = file => fs.existsSync(path.join(root, file));
const errors = [];
const check = (condition, message) => {
  if (!condition) errors.push(message);
};
const isText = (value, min = 1) => typeof value === 'string' && value.trim().length >= min;

const stages = JSON.parse(read('src/data/stages.json'));
const glossary = JSON.parse(read('src/data/glossary.json'));
const PHASES = ['Foundations', 'Systems & control', 'Production readiness'];
const DIAGRAM_START = /^(flowchart|graph|stateDiagram-v2|sequenceDiagram)\b/;

// ---- Curriculum ---------------------------------------------------------------------------
check(stages.length === 12, `Exactly 12 stages are required (found ${stages.length}).`);
check(stages.every((s, i) => s.id === i + 1), 'Stage ids must be 1…12 in order.');
check(new Set(stages.map(s => s.slug)).size === stages.length, 'Stage slugs must be unique.');

for (const s of stages) {
  const at = `Stage ${s.id}`;
  check(/^\d{2}-[a-z0-9]+(-[a-z0-9]+)*$/.test(s.slug) && s.slug.startsWith(String(s.id).padStart(2, '0')), `${at}: slug "${s.slug}" must look like "${String(s.id).padStart(2, '0')}-name".`);
  for (const field of ['title', 'summary', 'outcome', 'guardrail', 'duration']) check(isText(s[field], 8), `${at}: "${field}" is missing or too short.`);
  check(isText(s.shortTitle), `${at}: "shortTitle" is missing.`);
  check(PHASES.includes(s.phase), `${at}: unknown phase "${s.phase}".`);
  const expectedPhase = PHASES[Math.floor((s.id - 1) / 4)];
  check(s.phase === expectedPhase, `${at}: should be in "${expectedPhase}".`);

  check(Array.isArray(s.learn) && s.learn.length >= 3 && s.learn.every(x => isText(x.concept) && isText(x.detail, 20)), `${at}: needs ≥3 learn items with concept and detail.`);
  check(Array.isArray(s.practice) && s.practice.length >= 3 && s.practice.length <= 12 && s.practice.every(x => isText(x.title) && isText(x.detail, 20)), `${at}: needs 3–12 practice tasks with title and detail.`);
  check(Array.isArray(s.deliverables) && s.deliverables.length >= 2 && s.deliverables.every(x => isText(x)), `${at}: needs ≥2 deliverables.`);
  check(Array.isArray(s.why) && s.why.length >= 2 && s.why.every(x => isText(x, 20)), `${at}: needs ≥2 "why" statements.`);

  check(Array.isArray(s.resources) && s.resources.length >= 2, `${at}: needs ≥2 references.`);
  for (const r of s.resources ?? []) {
    check(isText(r.title) && isText(r.note), `${at}: reference "${r.title}" needs a title and a note.`);
    let ok = false;
    try {
      ok = new URL(r.url).protocol === 'https:';
    } catch {
      ok = false;
    }
    check(ok, `${at}: reference URL "${r.url}" must be a valid https URL.`);
  }

  const q = s.quiz;
  check(q && isText(q.question, 12) && isText(q.explanation, 12), `${at}: quiz needs a question and an explanation.`);
  check(Array.isArray(q?.answers) && q.answers.length === 3 && q.answers.every(a => isText(a)), `${at}: quiz needs exactly 3 non-empty answers.`);
  check(q && new Set(q.answers).size === 3, `${at}: quiz answers must be distinct.`);
  check(q && Number.isInteger(q.correct) && q.correct >= 0 && q.correct < 3, `${at}: quiz.correct must be 0, 1 or 2.`);

  check(s.workflow && isText(s.workflow.title) && isText(s.workflow.caption, 20), `${at}: needs workflow { title, caption }.`);
  const diagram = `src/data/workflows/${s.slug}.mmd`;
  const hasDiagram = exists(diagram);
  check(hasDiagram, `${at}: missing Mermaid diagram ${diagram}.`);
  if (hasDiagram) check(DIAGRAM_START.test(read(diagram).trimStart()), `${at}: ${diagram} must start with a supported Mermaid diagram type.`);
}

const correctPositions = new Set(stages.map(s => s.quiz.correct));
check(correctPositions.size === 3, 'Correct quiz answers should not all sit in the same positions; vary A, B and C.');

const workflowFiles = fs.readdirSync(path.join(root, 'src/data/workflows')).filter(f => f.endsWith('.mmd'));
const knownSlugs = new Set(stages.map(s => `${s.slug}.mmd`));
for (const file of workflowFiles) check(knownSlugs.has(file), `src/data/workflows/${file} does not belong to any stage.`);

// ---- Roadmap diagram ----------------------------------------------------------------------
const roadmap = read('src/data/roadmap.mmd');
check(/^flowchart LR/.test(roadmap.trimStart()), 'roadmap.mmd must be a left-to-right flowchart.');
for (let n = 1; n <= 12; n++) check(new RegExp(`S${String(n).padStart(2, '0')}\\["`).test(roadmap), `roadmap.mmd: node S${String(n).padStart(2, '0')} is missing.`);
check(!/S1[3-9]|S[2-9]\d/.test(roadmap), 'roadmap.mmd must contain only the twelve stage nodes.');

// ---- Glossary -----------------------------------------------------------------------------
check(glossary.length >= 30, `Glossary needs ≥30 terms (found ${glossary.length}).`);
check(new Set(glossary.map(g => g.term.toLowerCase())).size === glossary.length, 'Glossary terms must be unique (case-insensitive).');
check(glossary.every(g => isText(g.term) && isText(g.definition, 12) && Number.isInteger(g.stage) && g.stage >= 1 && g.stage <= 12), 'Every glossary entry needs a term, a definition and a stage 1–12.');
for (const s of stages) check(glossary.some(g => g.stage === s.id), `Stage ${s.id} has no glossary term.`);

// ---- Optional hands-on labs (extension point; none ship in v1) ----------------------------
const labsDir = path.join(root, 'content/labs');
let labCount = 0;
if (fs.existsSync(labsDir)) {
  for (const entry of fs.readdirSync(labsDir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const manifest = path.join('content/labs', entry.name, 'lab.json');
    const at = `Lab "${entry.name}"`;
    const hasManifest = exists(manifest);
    check(hasManifest, `${at}: missing lab.json.`);
    if (!hasManifest) continue;
    let lab;
    try {
      lab = JSON.parse(read(manifest));
    } catch {
      errors.push(`${at}: lab.json is not valid JSON.`);
      continue;
    }
    labCount++;
    const list = value => Array.isArray(value) && value.every(item => isText(item));
    check(Number.isInteger(lab.stageId) && lab.stageId >= 1 && lab.stageId <= 12, `${at}: stageId must be 1–12.`);
    check(isText(lab.title) && isText(lab.summary) && isText(lab.estimatedTime), `${at}: title, summary and estimatedTime are required.`);
    check(list(lab.objectives) && lab.objectives.length > 0, `${at}: at least one objective is required.`);
    check(list(lab.safety) && lab.safety.length > 0, `${at}: at least one safety note is required (synthetic data, isolation, no secrets).`);
    check(lab.prerequisites === undefined || list(lab.prerequisites), `${at}: prerequisites must be a list of strings.`);
    check(lab.verification === undefined || list(lab.verification), `${at}: verification must be a list of strings.`);
  }
}

// ---- Licensing ----------------------------------------------------------------------------
check(exists('LICENSE') && /^MIT License/.test(read('LICENSE')), 'LICENSE must be the MIT license for the code.');
check(exists('LICENSE-CONTENT.txt') && /^Attribution 4\.0 International/.test(read('LICENSE-CONTENT.txt')), 'LICENSE-CONTENT.txt must be the CC BY 4.0 legal code for the lessons.');
check(exists('LICENSING.md'), 'LICENSING.md (scope of each license) is missing.');
check(exists('public/THIRD-PARTY-NOTICES.txt') && /SIL OPEN FONT LICENSE/.test(read('public/THIRD-PARTY-NOTICES.txt')), 'public/THIRD-PARTY-NOTICES.txt must carry the font license notices (they ship with the site).');
check(JSON.parse(read('package.json')).license === 'MIT', 'package.json "license" must be MIT (the code license).');

// ---- Repository hygiene -------------------------------------------------------------------
const SKIP_DIRS = new Set(['node_modules', 'dist', '.git', 'coverage', '.claude']);
const TEXT_EXT = new Set(['.md', '.json', '.ts', '.tsx', '.css', '.html', '.yml', '.yaml', '.mjs', '.mmd', '.svg', '.txt']);
const walk = dir =>
  fs.readdirSync(path.join(root, dir), { withFileTypes: true }).flatMap(entry => {
    const rel = path.join(dir, entry.name);
    if (entry.isDirectory()) return SKIP_DIRS.has(entry.name) ? [] : walk(rel);
    return [rel];
  });
const files = walk('.');
check(!files.some(f => /REPO_CONTEXT/i.test(path.basename(f))), 'The private repo-context briefing must not be inside the repository.');
const oldBrand = /agent[ -]?engineering[ -]?atlas|agent atlas/i;
for (const file of files) {
  if (path.basename(file) === 'package-lock.json' || !TEXT_EXT.has(path.extname(file))) continue;
  if (file === path.join('scripts', 'validate-content.mjs')) continue;
  check(!oldBrand.test(read(file)), `${file}: contains the old product name. Use "Payil".`);
}

if (errors.length) {
  console.error(`Content validation failed with ${errors.length} problem${errors.length === 1 ? '' : 's'}:\n`);
  for (const message of errors) console.error(`  ✗ ${message}`);
  process.exit(1);
}
console.log(`Content validated: ${stages.length} stages, ${workflowFiles.length} stage workflows, ${glossary.length} glossary entries, ${labCount} labs.`);
