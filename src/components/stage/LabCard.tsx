import { ExternalLink, FlaskConical, ShieldCheck } from 'lucide-react';
import { LINKS } from '../../config';
import type { Lab } from '../../data/types';

/** Rendered only for stages that ship a `content/labs/<slug>/lab.json` manifest. None do in v1. */
export function LabCard({ lab }: { lab: Lab }) {
  return (
    <section className="lab-card" aria-labelledby={`lab-${lab.slug}`}>
      <div className="lab-head">
        <FlaskConical size={18} aria-hidden="true" />
        <div>
          <span className="overline">Hands-on lab · {lab.estimatedTime}</span>
          <h3 id={`lab-${lab.slug}`}>{lab.title}</h3>
        </div>
      </div>
      <p>{lab.summary}</p>
      <div className="lab-columns">
        <div>
          <h4>Objectives</h4>
          <ul>{lab.objectives.map(item => <li key={item}>{item}</li>)}</ul>
        </div>
        {lab.prerequisites.length > 0 && (
          <div>
            <h4>Before you start</h4>
            <ul>{lab.prerequisites.map(item => <li key={item}>{item}</li>)}</ul>
          </div>
        )}
        {lab.verification.length > 0 && (
          <div>
            <h4>How you will know it worked</h4>
            <ul>{lab.verification.map(item => <li key={item}>{item}</li>)}</ul>
          </div>
        )}
      </div>
      <div className="lab-safety">
        <ShieldCheck size={17} aria-hidden="true" />
        <div>
          <b>Safety</b>
          <ul>{lab.safety.map(item => <li key={item}>{item}</li>)}</ul>
        </div>
      </div>
      <a className="btn secondary" href={`${LINKS.repo}/tree/main/content/labs/${lab.slug}`} target="_blank" rel="noreferrer">
        Open the lab files <ExternalLink size={14} aria-hidden="true" />
      </a>
    </section>
  );
}
