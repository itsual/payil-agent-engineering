import { Bookmark, ChevronLeft, Clock3, Target } from 'lucide-react';
import { STAGE_COUNT } from '../../data/stages';
import { phaseKeyOf } from '../../data/phases';
import type { Stage } from '../../data/types';
import type { ProgressActions } from '../../hooks/useProgress';
import type { Progress } from '../../lib/progress';
import type { Route, StageTab } from '../../lib/route';
import { CheckPanel } from './CheckPanel';
import { LearnPanel } from './LearnPanel';
import { PracticePanel } from './PracticePanel';
import { StageAside } from './StageAside';
import { StagePager } from './StagePager';
import { StageTabs, panelId, tabId } from './StageTabs';
import { WhyPanel } from './WhyPanel';

type Props = {
  stage: Stage;
  tab: StageTab;
  progress: Progress;
  actions: ProgressActions;
  onNavigate: (route: Route) => void;
};

export function StageView({ stage, tab, progress, actions, onNavigate }: Props) {
  const bookmarked = progress.bookmarked.includes(stage.id);
  const goTab = (next: StageTab) => onNavigate({ view: 'stage', id: stage.id, tab: next });
  const openStage = (id: number) => onNavigate({ view: 'stage', id, tab: 'learn' });
  const number = String(stage.id).padStart(2, '0');

  return (
    <div className="stage-view" data-phase={phaseKeyOf(stage.phase)}>
      <div className="stage-topline">
        <button type="button" className="back-link" onClick={() => onNavigate({ view: 'roadmap' })}>
          <ChevronLeft size={16} aria-hidden="true" /> All stages
        </button>
        <span className="phase-tag">{stage.phase}</span>
      </div>

      <header className="stage-banner">
        <div>
          <p className="eyebrow">
            Stage {number} <span className="eyebrow-sep" aria-hidden="true">/</span> {STAGE_COUNT}
          </p>
          <h1>{stage.title}</h1>
          <p className="stage-summary">{stage.summary}</p>
          <ul className="stage-meta">
            <li>
              <Clock3 size={15} aria-hidden="true" /> {stage.duration} · suggested
            </li>
            <li>
              <Target size={15} aria-hidden="true" /> {stage.practice.length} design exercises
            </li>
          </ul>
        </div>
        <span className="stage-banner-mark" aria-hidden="true">{number}</span>
      </header>

      <div className="stage-actions">
        <div className="learning-outcome">
          <span className="overline">Learning outcome</span>
          <p>{stage.outcome}</p>
        </div>
        <button
          type="button"
          aria-pressed={bookmarked}
          className={`bookmark-btn ${bookmarked ? 'saved' : ''}`}
          onClick={() => actions.toggleBookmark(stage.id)}
        >
          <Bookmark size={16} fill={bookmarked ? 'currentColor' : 'none'} aria-hidden="true" />
          {bookmarked ? 'Bookmarked' : 'Bookmark'}
        </button>
      </div>

      <StageTabs tab={tab} onChange={goTab} />

      <div className="stage-layout">
        <div className="stage-main" role="tabpanel" id={panelId(tab)} aria-labelledby={tabId(tab)} tabIndex={-1}>
          {tab === 'learn' && <LearnPanel stage={stage} onNext={() => goTab('practice')} />}
          {tab === 'practice' && (
            <PracticePanel
              stage={stage}
              progress={progress}
              onToggleTask={index => actions.toggleTask(stage.id, index)}
              onNext={() => goTab('why')}
            />
          )}
          {tab === 'why' && <WhyPanel stage={stage} onNext={() => goTab('check')} />}
          {tab === 'check' && (
            <CheckPanel
              stage={stage}
              progress={progress}
              onQuizResult={correct => actions.recordQuiz(stage.id, correct)}
              onNote={value => actions.setNote(stage.id, value)}
              onToggleComplete={() => actions.toggleComplete(stage.id)}
            />
          )}
        </div>
        <StageAside stage={stage} progress={progress} />
      </div>

      <StagePager stageId={stage.id} onOpen={openStage} />
    </div>
  );
}
