import type { Lab } from './types';

const isStringList = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every(item => typeof item === 'string' && item.trim().length > 0);

const isText = (value: unknown): value is string => typeof value === 'string' && value.trim().length > 0;

/**
 * Validates one `content/labs/<slug>/lab.json` manifest. Returns null for anything malformed
 * so a bad manifest can never break the site; `npm run check:content` reports the same problems loudly.
 */
export function parseLab(slug: string, input: unknown): Lab | null {
  if (!input || typeof input !== 'object') return null;
  const data = input as Record<string, unknown>;
  const { stageId, title, summary, estimatedTime, objectives, safety } = data;
  const prerequisites = data.prerequisites ?? [];
  const verification = data.verification ?? [];
  if (typeof stageId !== 'number' || !Number.isInteger(stageId) || stageId < 1 || stageId > 12) return null;
  if (!isText(title) || !isText(summary) || !isText(estimatedTime)) return null;
  if (!isStringList(objectives) || objectives.length === 0) return null;
  if (!isStringList(safety) || safety.length === 0) return null;
  if (!isStringList(prerequisites) || !isStringList(verification)) return null;
  return { slug, stageId, title, summary, estimatedTime, objectives, prerequisites, safety, verification };
}

/** Builds the stage → labs lookup from a path → manifest map (the shape `import.meta.glob` returns). */
export function indexLabs(files: Record<string, unknown>): Map<number, Lab[]> {
  const index = new Map<number, Lab[]>();
  for (const [path, manifest] of Object.entries(files)) {
    const slug = path.split('/').slice(-2, -1)[0] ?? '';
    const lab = parseLab(slug, manifest);
    if (!lab) continue;
    index.set(lab.stageId, [...(index.get(lab.stageId) ?? []), lab]);
  }
  return index;
}

const labFiles = import.meta.glob('../../content/labs/*/lab.json', { eager: true, import: 'default' });

const labIndex = indexLabs(labFiles);

export const labsForStage = (stageId: number): Lab[] => labIndex.get(stageId) ?? [];
