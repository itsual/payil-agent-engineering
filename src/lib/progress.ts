import { STAGE_COUNT } from '../data/stages';

/**
 * Browser-local learning progress. Nothing here ever leaves the device unless the learner
 * exports the file themselves. The schema is versioned so a future change can migrate it.
 */
export type Progress = {
  version: 1;
  completed: number[];
  bookmarked: number[];
  /** stage id → indexes of checked practice tasks */
  checked: Record<string, number[]>;
  /** stage id → free-text notes */
  notes: Record<string, string>;
  /** stage id → true once the knowledge check was answered correctly */
  quizzes: Record<string, boolean>;
};

export const STORAGE_KEY = 'payil:progress:v1';
export const EXPORT_FILENAME = 'payil-progress.json';
export const MAX_NOTE_LENGTH = 10_000;
const MAX_PRACTICE_INDEX = 15;

export const blankProgress = (): Progress => ({
  version: 1,
  completed: [],
  bookmarked: [],
  checked: {},
  notes: {},
  quizzes: {},
});

const validId = (id: unknown): id is number => Number.isInteger(id) && Number(id) >= 1 && Number(id) <= STAGE_COUNT;
const validKey = (key: string) => /^\d+$/.test(key) && validId(Number(key));
const uniqueSorted = (values: number[]) => [...new Set(values)].sort((a, b) => a - b);
const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

/**
 * Turns untrusted JSON (localStorage or an imported file) into a valid Progress,
 * silently dropping anything out of range. Returns null if the input is not a Progress at all.
 */
export function sanitizeProgress(input: unknown): Progress | null {
  if (!isRecord(input) || input.version !== 1) return null;
  const ids = (value: unknown) => (Array.isArray(value) ? uniqueSorted(value.filter(validId)) : []);

  const checked: Progress['checked'] = {};
  if (isRecord(input.checked)) {
    for (const [key, value] of Object.entries(input.checked)) {
      if (!validKey(key) || !Array.isArray(value)) continue;
      const steps = value.filter((n): n is number => Number.isInteger(n) && n >= 0 && n <= MAX_PRACTICE_INDEX);
      if (steps.length) checked[key] = uniqueSorted(steps);
    }
  }

  const notes: Progress['notes'] = {};
  if (isRecord(input.notes)) {
    for (const [key, value] of Object.entries(input.notes)) {
      if (validKey(key) && typeof value === 'string' && value.length) notes[key] = value.slice(0, MAX_NOTE_LENGTH);
    }
  }

  const quizzes: Progress['quizzes'] = {};
  if (isRecord(input.quizzes)) {
    for (const [key, value] of Object.entries(input.quizzes)) {
      if (validKey(key) && value === true) quizzes[key] = true;
    }
  }

  return {
    version: 1,
    completed: ids(input.completed),
    bookmarked: ids(input.bookmarked),
    checked,
    notes,
    quizzes,
  };
}

export function loadProgress(storage: Pick<Storage, 'getItem'> | undefined = safeStorage()): Progress {
  try {
    const raw = storage?.getItem(STORAGE_KEY);
    if (!raw) return blankProgress();
    return sanitizeProgress(JSON.parse(raw)) ?? blankProgress();
  } catch {
    return blankProgress();
  }
}

export function saveProgress(progress: Progress, storage: Pick<Storage, 'setItem'> | undefined = safeStorage()): void {
  try {
    storage?.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    /* Storage can be unavailable (private mode, quota). Progress then lasts for the session only. */
  }
}

export function clearStoredProgress(storage: Pick<Storage, 'removeItem'> | undefined = safeStorage()): void {
  try {
    storage?.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
}

/** The exact JSON written to an export file. */
export const serializeProgress = (progress: Progress, exportedAt = new Date()): string =>
  JSON.stringify({ app: 'payil', exportedAt: exportedAt.toISOString(), ...progress }, null, 2);

export type ImportResult = { ok: true; progress: Progress } | { ok: false; error: string };

/** Parses the text of a previously exported progress file. */
export function parseImportedProgress(text: string): ImportResult {
  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch {
    return { ok: false, error: 'That file is not valid JSON.' };
  }
  if (isRecord(data) && typeof data.app === 'string' && data.app !== 'payil') {
    return { ok: false, error: 'That file was not exported from Payil.' };
  }
  const progress = sanitizeProgress(data);
  return progress ? { ok: true, progress } : { ok: false, error: 'That file is not a Payil progress export.' };
}

export function exportProgress(progress: Progress): void {
  const blob = new Blob([serializeProgress(progress)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = EXPORT_FILENAME;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function safeStorage(): Storage | undefined {
  try {
    return typeof localStorage === 'undefined' ? undefined : localStorage;
  } catch {
    return undefined;
  }
}

/** Fraction (0–1) of the stages in `ids` that are complete. */
export const completionOf = (progress: Progress, ids: number[]): number =>
  ids.length ? ids.filter(id => progress.completed.includes(id)).length / ids.length : 0;
