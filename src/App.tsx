import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { MouseEvent } from 'react';
import { BRAND } from './config';
import { getStage, stages } from './data/stages';
import { useProgress } from './hooks/useProgress';
import { useRoute } from './hooks/useRoute';
import { useTheme } from './hooks/useTheme';
import { scrollToId, scrollToTop } from './lib/dom';
import { exportProgress, parseImportedProgress } from './lib/progress';
import type { Progress } from './lib/progress';
import type { Route } from './lib/route';
import { Toast } from './components/common/Toast';
import type { Notice } from './components/common/Toast';
import { ImportDialog } from './components/dialogs/ImportDialog';
import { ResetDialog } from './components/dialogs/ResetDialog';
import { GlossaryView } from './components/glossary/GlossaryView';
import { Footer } from './components/layout/Footer';
import { Sidebar } from './components/layout/Sidebar';
import { Topbar } from './components/layout/Topbar';
import { RoadmapView } from './components/roadmap/RoadmapView';
import { StageView } from './components/stage/StageView';

const MAX_IMPORT_BYTES = 1_000_000;

type Dialog = { kind: 'reset' } | { kind: 'import'; incoming: Progress } | null;

function titleFor(route: Route): string {
  if (route.view === 'glossary') return `Glossary · ${BRAND.name}`;
  if (route.view === 'stage') return `${getStage(route.id)?.title ?? 'Stage'} · ${BRAND.name}`;
  return `${BRAND.name} (${BRAND.native}) — ${BRAND.tagline}`;
}

export default function App() {
  const [route, navigate] = useRoute();
  const [progress, actions] = useProgress();
  const [theme, toggleTheme] = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dialog, setDialog] = useState<Dialog>(null);
  const [notice, setNotice] = useState<Notice | null>(null);
  const main = useRef<HTMLElement>(null);

  const nextStageId = useMemo(() => stages.find(stage => !progress.completed.includes(stage.id))?.id ?? 1, [progress.completed]);
  const stageId = route.view === 'stage' ? route.id : null;
  const tab = route.view === 'stage' ? route.tab : null;
  const pageKey = `${route.view}:${stageId ?? ''}`;

  // Reacting to navigation. Comparing against the previous page (rather than a "first run" flag) keeps this correct
  // under React StrictMode, which runs effects twice on mount, so nothing steals focus on the initial load.
  //  - new page:  update the title, close the drawer, return to the top, and move keyboard focus to <main>
  //  - same stage, new tab (e.g. "Next: design the exercise"): bring the tab bar back into view
  const previous = useRef<{ page: string; tab: string | null } | null>(null);
  useEffect(() => {
    document.title = titleFor(route);
    const before = previous.current;
    previous.current = { page: pageKey, tab };
    if (!before) return;
    if (before.page !== pageKey) {
      setMenuOpen(false);
      scrollToTop();
      main.current?.focus({ preventScroll: true });
    } else if (tab && before.tab !== tab) {
      scrollToId('stage-tabs');
    }
    // `route` only feeds the title, which is fully determined by pageKey.
  }, [pageKey, tab]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (event: KeyboardEvent) => event.key === 'Escape' && setMenuOpen(false);
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  const announce = useCallback((tone: Notice['tone'], text: string) => setNotice({ id: Date.now(), tone, text }), []);
  const dismissNotice = useCallback(() => setNotice(null), []);

  const openStage = useCallback((id: number) => navigate({ view: 'stage', id, tab: 'learn' }), [navigate]);

  const onExport = () => {
    exportProgress(progress);
    announce('success', 'Progress exported as payil-progress.json.');
  };

  const onImportFile = async (file: File) => {
    if (file.size > MAX_IMPORT_BYTES) {
      announce('error', 'That file is too large to be a Payil progress export.');
      return;
    }
    const result = parseImportedProgress(await file.text());
    if (result.ok) setDialog({ kind: 'import', incoming: result.progress });
    else announce('error', result.error);
  };

  const skipToMain = (event: MouseEvent) => {
    event.preventDefault();
    main.current?.focus();
  };

  return (
    <div className="app">
      <a href="#main" className="skip-link" onClick={skipToMain}>
        Skip to main content
      </a>

      <Sidebar route={route} progress={progress} open={menuOpen} nextStageId={nextStageId} onNavigate={navigate} />
      {menuOpen && <button type="button" className="drawer-overlay" aria-label="Close navigation" onClick={() => setMenuOpen(false)} />}

      <div className="shell">
        <Topbar
          route={route}
          completedCount={progress.completed.length}
          theme={theme}
          menuOpen={menuOpen}
          onOpenMenu={() => setMenuOpen(true)}
          onToggleTheme={toggleTheme}
          onExport={onExport}
          onImportFile={file => void onImportFile(file)}
        />

        <main id="main" ref={main} tabIndex={-1} className="main">
          {route.view === 'roadmap' && <RoadmapView progress={progress} nextStageId={nextStageId} onOpenStage={openStage} />}
          {route.view === 'glossary' && <GlossaryView onOpenStage={openStage} />}
          {route.view === 'stage' && getStage(route.id) && (
            <StageView stage={getStage(route.id)!} tab={route.tab} progress={progress} actions={actions} onNavigate={navigate} />
          )}
          <Footer onReset={() => setDialog({ kind: 'reset' })} />
        </main>
      </div>

      {dialog?.kind === 'reset' && (
        <ResetDialog
          onCancel={() => setDialog(null)}
          onConfirm={() => {
            actions.reset();
            setDialog(null);
            announce('success', 'Local progress cleared.');
          }}
        />
      )}
      {dialog?.kind === 'import' && (
        <ImportDialog
          incoming={dialog.incoming}
          onCancel={() => setDialog(null)}
          onConfirm={() => {
            actions.replace(dialog.incoming);
            setDialog(null);
            announce('success', 'Progress imported.');
          }}
        />
      )}

      <Toast notice={notice} onDismiss={dismissNotice} />
    </div>
  );
}
