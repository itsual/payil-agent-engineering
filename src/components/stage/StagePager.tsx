import { ChevronLeft, ChevronRight } from 'lucide-react';
import { STAGE_COUNT, getStage } from '../../data/stages';

type Props = {
  stageId: number;
  onOpen: (id: number) => void;
};

export function StagePager({ stageId, onOpen }: Props) {
  const previous = getStage(stageId - 1);
  const next = getStage(stageId + 1);
  return (
    <nav className="stage-pager" aria-label="Stage navigation">
      {previous ? (
        <button type="button" className="pager-btn" onClick={() => onOpen(previous.id)}>
          <ChevronLeft size={18} aria-hidden="true" />
          <span>
            <small>Previous stage</small>
            {previous.shortTitle}
          </span>
        </button>
      ) : (
        <span />
      )}
      <span className="pager-count">
        {stageId} of {STAGE_COUNT}
      </span>
      {next ? (
        <button type="button" className="pager-btn next" onClick={() => onOpen(next.id)}>
          <span>
            <small>Next stage</small>
            {next.shortTitle}
          </span>
          <ChevronRight size={18} aria-hidden="true" />
        </button>
      ) : (
        <span />
      )}
    </nav>
  );
}
