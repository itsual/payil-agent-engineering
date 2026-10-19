import { describe, expect, it } from 'vitest';
import {
  MAX_NOTE_LENGTH,
  STORAGE_KEY,
  blankProgress,
  completionOf,
  loadProgress,
  parseImportedProgress,
  sanitizeProgress,
  saveProgress,
  serializeProgress,
} from './progress';

const memoryStorage = (initial?: string) => {
  const store = new Map<string, string>();
  if (initial !== undefined) store.set(STORAGE_KEY, initial);
  return {
    getItem: (key: string) => store.get(key) ?? null,
    setItem: (key: string, value: string) => void store.set(key, value),
  };
};

describe('sanitizeProgress', () => {
  it('rejects anything that is not a version-1 object', () => {
    for (const input of [null, undefined, 'x', 7, [], {}, { version: 2 }]) expect(sanitizeProgress(input)).toBeNull();
  });

  it('drops out-of-range ids, duplicates and malformed entries, and sorts the rest', () => {
    const result = sanitizeProgress({
      version: 1,
      completed: [3, 1, 3, 0, 13, 2.5, '4', 12],
      bookmarked: [12, 2, 'x'],
      checked: { '1': [2, 0, 0, 99, -1], '13': [1], abc: [1], '2': 'nope', '3': [] },
      notes: { '1': 'hello', '99': 'x', '2': 42, '3': '' },
      quizzes: { '1': true, '2': false, '14': true, '3': 'yes' },
    });
    expect(result).toEqual({
      version: 1,
      completed: [1, 3, 12],
      bookmarked: [2, 12],
      checked: { '1': [0, 2] },
      notes: { '1': 'hello' },
      quizzes: { '1': true },
    });
  });

  it('caps note length', () => {
    const result = sanitizeProgress({ version: 1, notes: { '1': 'x'.repeat(MAX_NOTE_LENGTH + 500) } });
    expect(result?.notes['1']).toHaveLength(MAX_NOTE_LENGTH);
  });

  it('tolerates a missing quizzes field from older data', () => {
    expect(sanitizeProgress({ version: 1, completed: [1] })?.quizzes).toEqual({});
  });
});

describe('load / save', () => {
  it('round-trips through storage', () => {
    const storage = memoryStorage();
    const progress = { ...blankProgress(), completed: [2, 5], notes: { '2': 'note' }, quizzes: { '2': true } };
    saveProgress(progress, storage);
    expect(loadProgress(storage)).toEqual(progress);
  });

  it.each([
    ['nothing stored', undefined],
    ['invalid JSON', '{not json'],
    ['the wrong shape', '{"version":9}'],
  ])('falls back to a blank state for %s', (_name, stored) => {
    expect(loadProgress(memoryStorage(stored))).toEqual(blankProgress());
  });

  it('does not throw when storage is unavailable or full', () => {
    const throwing = { setItem: () => { throw new Error('quota'); } };
    expect(() => saveProgress(blankProgress(), throwing)).not.toThrow();
    expect(loadProgress({ getItem: () => { throw new Error('denied'); } })).toEqual(blankProgress());
    expect(loadProgress(undefined)).toBeDefined();
  });
});

describe('export / import', () => {
  it('imports exactly what it exported', () => {
    const progress = { ...blankProgress(), completed: [1, 2], bookmarked: [7], checked: { '1': [0, 3] }, notes: { '7': 'later' }, quizzes: { '1': true } };
    const text = serializeProgress(progress, new Date('2026-10-19T10:00:00Z'));
    expect(JSON.parse(text)).toMatchObject({ app: 'payil', exportedAt: '2026-10-19T10:00:00.000Z', version: 1 });
    expect(parseImportedProgress(text)).toEqual({ ok: true, progress });
  });

  it('gives a specific reason for each kind of bad file', () => {
    expect(parseImportedProgress('{oops')).toEqual({ ok: false, error: 'That file is not valid JSON.' });
    expect(parseImportedProgress('{"app":"other","version":1}')).toEqual({ ok: false, error: 'That file was not exported from Payil.' });
    expect(parseImportedProgress('{"version":3}')).toEqual({ ok: false, error: 'That file is not a Payil progress export.' });
    expect(parseImportedProgress('[]')).toEqual({ ok: false, error: 'That file is not a Payil progress export.' });
  });

  it('accepts a progress object without the app marker (hand-edited backups)', () => {
    expect(parseImportedProgress(JSON.stringify(blankProgress())).ok).toBe(true);
  });
});

describe('completionOf', () => {
  it('returns the completed fraction of a set of stages', () => {
    const progress = { ...blankProgress(), completed: [1, 2, 9] };
    expect(completionOf(progress, [1, 2, 3, 4])).toBe(0.5);
    expect(completionOf(progress, [5, 6])).toBe(0);
    expect(completionOf(progress, [])).toBe(0);
  });
});
