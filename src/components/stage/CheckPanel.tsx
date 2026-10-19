import { CheckCircle2, CircleHelp } from 'lucide-react';
import { MAX_NOTE_LENGTH } from '../../lib/progress';
import type { Progress } from '../../lib/progress';
import type { Stage } from '../../data/types';
import { PanelHeading } from './PanelHeading';
import { Quiz } from './Quiz';

type Props = {
  stage: Stage;
  progress: Progress;
  onQuizResult: (correct: boolean) => void;
  onNote: (value: string) => void;
  onToggleComplete: () => void;
};

export function CheckPanel({ stage, progress, onQuizResult, onNote, onToggleComplete }: Props) {
  const key = String(stage.id);
  const complete = progress.completed.includes(stage.id);
  const note = progress.notes[key] ?? '';

  return (
    <section className="learning-panel">
      <PanelHeading icon={<CircleHelp size={20} />} overline="Knowledge check" title="Check yourself" />
      <p className="panel-intro">
        One scenario question and a place for your own notes. Completing a stage is self-assessed and stored only on this device.
      </p>

      <Quiz key={stage.id} stage={stage} alreadyPassed={progress.quizzes[key] === true} onResult={onQuizResult} />

      <div className="notes-area">
        <label htmlFor={`notes-${stage.id}`}>
          Your learning notes <span>Saved on this device</span>
        </label>
        <textarea
          id={`notes-${stage.id}`}
          rows={5}
          maxLength={MAX_NOTE_LENGTH}
          placeholder="What surprised you? Which decisions would you make differently?"
          value={note}
          onChange={event => onNote(event.target.value)}
        />
        <span className="note-count" aria-hidden="true">{note.length.toLocaleString()} / {MAX_NOTE_LENGTH.toLocaleString()}</span>
      </div>

      <button type="button" aria-pressed={complete} className={`complete-btn ${complete ? 'is-done' : ''}`} onClick={onToggleComplete}>
        <CheckCircle2 size={19} aria-hidden="true" />
        {complete ? 'Stage complete — select to undo' : 'Mark this stage complete'}
      </button>
    </section>
  );
}
