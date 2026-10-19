import { useEffect, useMemo, useState } from 'react';
import {
  MAX_NOTE_LENGTH,
  STORAGE_KEY,
  blankProgress,
  clearStoredProgress,
  loadProgress,
  saveProgress,
} from '../lib/progress';
import type { Progress } from '../lib/progress';

const toggleIn = (list: number[], value: number) =>
  list.includes(value) ? list.filter(item => item !== value) : [...list, value].sort((a, b) => a - b);

export type ProgressActions = {
  toggleComplete: (id: number) => void;
  toggleBookmark: (id: number) => void;
  toggleTask: (id: number, taskIndex: number) => void;
  setNote: (id: number, value: string) => void;
  recordQuiz: (id: number, correct: boolean) => void;
  replace: (next: Progress) => void;
  reset: () => void;
};

/** Owns the learner's progress: loads it once, persists every change, and stays in sync across tabs. */
export function useProgress(): [Progress, ProgressActions] {
  const [progress, setProgress] = useState<Progress>(() => loadProgress());

  useEffect(() => saveProgress(progress), [progress]);

  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY || event.key === null) setProgress(loadProgress());
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const actions = useMemo<ProgressActions>(
    () => ({
      toggleComplete: id => setProgress(prev => ({ ...prev, completed: toggleIn(prev.completed, id) })),
      toggleBookmark: id => setProgress(prev => ({ ...prev, bookmarked: toggleIn(prev.bookmarked, id) })),
      toggleTask: (id, taskIndex) =>
        setProgress(prev => ({
          ...prev,
          checked: { ...prev.checked, [String(id)]: toggleIn(prev.checked[String(id)] ?? [], taskIndex) },
        })),
      setNote: (id, value) =>
        setProgress(prev => ({ ...prev, notes: { ...prev.notes, [String(id)]: value.slice(0, MAX_NOTE_LENGTH) } })),
      recordQuiz: (id, correct) =>
        setProgress(prev => (correct && !prev.quizzes[String(id)] ? { ...prev, quizzes: { ...prev.quizzes, [String(id)]: true } } : prev)),
      replace: next => setProgress(next),
      reset: () => {
        clearStoredProgress();
        setProgress(blankProgress());
      },
    }),
    [],
  );

  return [progress, actions];
}
