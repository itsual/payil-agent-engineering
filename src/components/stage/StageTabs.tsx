import { useRef } from 'react';
import type { KeyboardEvent } from 'react';
import { stageTabs } from '../../lib/route';
import type { StageTab } from '../../lib/route';

const labels: Record<StageTab, { n: string; label: string }> = {
  learn: { n: '01', label: 'What to learn' },
  practice: { n: '02', label: 'What to practise' },
  why: { n: '03', label: 'Why it matters' },
  check: { n: '04', label: 'Check yourself' },
};

export const tabId = (tab: StageTab) => `tab-${tab}`;
export const panelId = (tab: StageTab) => `panel-${tab}`;

type Props = {
  tab: StageTab;
  onChange: (tab: StageTab) => void;
};

/** WAI-ARIA tabs: one tab stop, arrow keys / Home / End move between tabs. */
export function StageTabs({ tab, onChange }: Props) {
  const refs = useRef<Partial<Record<StageTab, HTMLButtonElement | null>>>({});

  const onKeyDown = (event: KeyboardEvent) => {
    // Start from the tab that actually has focus: the route (and so `tab`) updates asynchronously, so a quick second
    // key press would otherwise be computed from a stale selection and appear to do nothing.
    const focused = (event.target as HTMLElement).closest<HTMLElement>('[role="tab"]')?.dataset.tab as StageTab | undefined;
    const index = stageTabs.indexOf(focused ?? tab);
    let next = index;
    if (event.key === 'ArrowRight') next = (index + 1) % stageTabs.length;
    else if (event.key === 'ArrowLeft') next = (index - 1 + stageTabs.length) % stageTabs.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = stageTabs.length - 1;
    else return;
    event.preventDefault();
    onChange(stageTabs[next]);
    refs.current[stageTabs[next]]?.focus();
  };

  return (
    <div id="stage-tabs" className="stage-tabs" role="tablist" aria-label="Stage content" onKeyDown={onKeyDown}>
      {stageTabs.map(value => (
        <button
          key={value}
          ref={node => {
            refs.current[value] = node;
          }}
          type="button"
          role="tab"
          data-tab={value}
          id={tabId(value)}
          aria-selected={tab === value}
          aria-controls={panelId(value)}
          tabIndex={tab === value ? 0 : -1}
          className={`stage-tab ${tab === value ? 'active' : ''}`}
          onClick={() => onChange(value)}
        >
          <span className="tab-n">{labels[value].n}</span>
          {labels[value].label}
        </button>
      ))}
    </div>
  );
}
