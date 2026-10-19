import { useRef } from 'react';
import type { ChangeEvent } from 'react';
import { ChevronRight, Download, Menu, Moon, Sun, Upload } from 'lucide-react';
import { BRAND } from '../../config';
import { STAGE_COUNT, getStage } from '../../data/stages';
import type { Theme } from '../../hooks/useTheme';
import type { Route } from '../../lib/route';

type Props = {
  route: Route;
  completedCount: number;
  theme: Theme;
  menuOpen: boolean;
  onOpenMenu: () => void;
  onToggleTheme: () => void;
  onExport: () => void;
  onImportFile: (file: File) => void;
};

const crumbFor = (route: Route): string => {
  if (route.view === 'glossary') return 'Glossary';
  if (route.view === 'stage') return getStage(route.id)?.shortTitle ?? 'Stage';
  return 'Roadmap';
};

export function Topbar({ route, completedCount, theme, menuOpen, onOpenMenu, onToggleTheme, onExport, onImportFile }: Props) {
  const fileInput = useRef<HTMLInputElement>(null);

  const onFileChosen = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = ''; // allow choosing the same file again
    if (file) onImportFile(file);
  };

  return (
    <header className="topbar">
      <div className="topbar-left">
        <button
          type="button"
          className="icon-btn menu-btn"
          aria-label="Open navigation"
          aria-expanded={menuOpen}
          aria-controls="sidebar"
          onClick={onOpenMenu}
        >
          <Menu size={20} aria-hidden="true" />
        </button>
        <nav className="crumbs" aria-label="Breadcrumb">
          <span className="crumb">{BRAND.name}</span>
          <ChevronRight size={13} aria-hidden="true" />
          <span className="crumb current" aria-current="page">{crumbFor(route)}</span>
        </nav>
      </div>

      <div className="topbar-right">
        <span className="status-chip" title="Stages you have marked complete on this device">
          <i aria-hidden="true" />
          {completedCount}/{STAGE_COUNT} complete
        </span>
        <button
          type="button"
          className="icon-btn"
          aria-label={theme === 'dark' ? 'Switch to the light theme' : 'Switch to the dark theme'}
          title={theme === 'dark' ? 'Light theme' : 'Dark theme'}
          onClick={onToggleTheme}
        >
          {theme === 'dark' ? <Sun size={18} aria-hidden="true" /> : <Moon size={18} aria-hidden="true" />}
        </button>
        <button type="button" className="top-action" title="Load a progress file exported from Payil" onClick={() => fileInput.current?.click()}>
          <Upload size={15} aria-hidden="true" />
          <span>Import</span>
        </button>
        <input ref={fileInput} type="file" accept="application/json,.json" className="sr-only" tabIndex={-1} aria-label="Import progress file" onChange={onFileChosen} />
        <button type="button" className="top-action" title="Download your progress as a JSON file" onClick={onExport}>
          <Download size={15} aria-hidden="true" />
          <span>Export</span>
        </button>
      </div>
    </header>
  );
}
