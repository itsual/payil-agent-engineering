import { BookOpen, Check, Compass, Map as MapIcon, Bookmark } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { phaseInfo } from '../../data/phases';
import { STAGE_COUNT, stages } from '../../data/stages';
import { Brand } from '../common/Brand';
import type { Progress } from '../../lib/progress';
import type { Route } from '../../lib/route';

type Props = {
  route: Route;
  progress: Progress;
  open: boolean;
  nextStageId: number;
  onNavigate: (route: Route) => void;
};

const pad = (id: number) => String(id).padStart(2, '0');

export function Sidebar({ route, progress, open, nextStageId, onNavigate }: Props) {
  const percent = Math.round((progress.completed.length / STAGE_COUNT) * 100);

  const navItem = (active: boolean, label: string, Icon: LucideIcon, target: Route) => (
    <button
      type="button"
      className={`nav-link ${active ? 'active' : ''}`}
      aria-current={active ? 'page' : undefined}
      onClick={() => onNavigate(target)}
    >
      <Icon size={18} aria-hidden="true" />
      <span>{label}</span>
    </button>
  );

  return (
    <aside id="sidebar" className={`sidebar ${open ? 'open' : ''}`} aria-label="Primary">
      <Brand onClick={() => onNavigate({ view: 'roadmap' })} />

      <div className="side-label">Workspace</div>
      <nav className="side-nav" aria-label="Sections">
        {navItem(route.view === 'roadmap', 'Learning roadmap', MapIcon, { view: 'roadmap' })}
        {navItem(route.view === 'stage', 'Stage explorer', Compass, {
          view: 'stage',
          id: route.view === 'stage' ? route.id : nextStageId,
          tab: 'learn',
        })}
        {navItem(route.view === 'glossary', 'Concept glossary', BookOpen, { view: 'glossary' })}
      </nav>

      <div className="side-label">Your learning path</div>
      <nav className="side-stages" aria-label="Stages">
        {phaseInfo.map(phase => (
          <div className="side-group" data-phase={phase.key} key={phase.key}>
            <div className="side-group-label">
              <i aria-hidden="true" />
              {phase.phase}
            </div>
            {stages
              .filter(stage => stage.phase === phase.phase)
              .map(stage => {
                const selected = route.view === 'stage' && route.id === stage.id;
                const done = progress.completed.includes(stage.id);
                return (
                  <button
                    key={stage.id}
                    type="button"
                    className={`side-stage ${selected ? 'selected' : ''}`}
                    aria-current={selected ? 'page' : undefined}
                    onClick={() => onNavigate({ view: 'stage', id: stage.id, tab: 'learn' })}
                  >
                    <span className={`stage-dot ${done ? 'is-complete' : ''}`}>
                      {done ? <Check size={12} aria-hidden="true" /> : pad(stage.id)}
                    </span>
                    <span className="side-stage-title">{stage.shortTitle}</span>
                    {done && <span className="sr-only">(complete)</span>}
                    {progress.bookmarked.includes(stage.id) && (
                      <Bookmark size={12} className="bookmarked-icon" fill="currentColor" aria-label="Bookmarked" />
                    )}
                  </button>
                );
              })}
          </div>
        ))}
      </nav>

      <div className="side-progress" role="group" aria-label="Journey progress">
        <div className="side-progress-head">
          <span>Journey progress</span>
          <b>{percent}%</b>
        </div>
        <div className="meter" aria-hidden="true">
          <span style={{ width: `${percent}%` }} />
        </div>
        <span className="side-progress-note">
          {progress.completed.length} of {STAGE_COUNT} stages complete
        </span>
      </div>
    </aside>
  );
}
