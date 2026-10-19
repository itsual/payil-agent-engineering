import { useState } from 'react';
import { ArrowRight, RotateCcw } from 'lucide-react';
import type { Stage } from '../../data/types';

type Props = {
  stage: Stage;
  /** True once this stage's question has been answered correctly (persisted by the parent). */
  alreadyPassed: boolean;
  onResult: (correct: boolean) => void;
};

/**
 * One scenario question per stage. The selection and the revealed feedback are intentionally transient;
 * only a correct answer is remembered (as a “passed” badge). Mount with `key={stage.id}` to reset between stages.
 */
export function Quiz({ stage, alreadyPassed, onResult }: Props) {
  const { question, answers, correct, explanation } = stage.quiz;
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const isCorrect = selected === correct;

  const check = () => {
    if (selected === null) return;
    setRevealed(true);
    onResult(selected === correct);
  };
  const retry = () => {
    setSelected(null);
    setRevealed(false);
  };

  return (
    <fieldset className="quiz">
      <legend className="quiz-eyebrow">
        Scenario · single answer{alreadyPassed && !revealed && <span className="quiz-passed"> · answered correctly before</span>}
      </legend>
      <h3 id={`quiz-q-${stage.id}`}>{question}</h3>

      <div className="answer-list" role="radiogroup" aria-labelledby={`quiz-q-${stage.id}`}>
        {answers.map((answer, index) => {
          const state = !revealed ? '' : index === correct ? 'is-correct' : index === selected ? 'is-wrong' : '';
          return (
            <label key={answer} className={`answer ${selected === index ? 'selected' : ''} ${state}`}>
              <input
                type="radio"
                name={`quiz-${stage.id}`}
                checked={selected === index}
                disabled={revealed && isCorrect}
                onChange={() => {
                  setSelected(index);
                  setRevealed(false);
                }}
              />
              <span className="answer-letter" aria-hidden="true">{String.fromCharCode(65 + index)}</span>
              <span>{answer}</span>
              {revealed && index === correct && <span className="sr-only"> (correct answer)</span>}
            </label>
          );
        })}
      </div>

      <div className="quiz-actions">
        <button type="button" className="btn secondary" disabled={selected === null || revealed} onClick={check}>
          Check answer <ArrowRight size={15} aria-hidden="true" />
        </button>
        {revealed && !isCorrect && (
          <button type="button" className="btn ghost" onClick={retry}>
            <RotateCcw size={14} aria-hidden="true" /> Try again
          </button>
        )}
      </div>

      <div role="status" aria-live="polite">
        {revealed && (
          <p className={`answer-feedback ${isCorrect ? 'correct' : 'incorrect'}`}>
            <b>{isCorrect ? 'Correct.' : 'Not quite.'}</b> {explanation}
          </p>
        )}
      </div>
    </fieldset>
  );
}
