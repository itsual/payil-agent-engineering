import type { ReactNode } from 'react';

type Props = {
  icon: ReactNode;
  overline: string;
  title: string;
  /** `tone` colours the icon tile (defaults to the stage's phase colour). */
  tone?: 'phase' | 'lilac' | 'amber';
};

export function PanelHeading({ icon, overline, title, tone = 'phase' }: Props) {
  return (
    <div className="panel-heading">
      <span className={`panel-icon ${tone}`} aria-hidden="true">
        {icon}
      </span>
      <div>
        <span className="overline">{overline}</span>
        <h2>{title}</h2>
      </div>
    </div>
  );
}
