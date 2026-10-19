import { Github } from 'lucide-react';
import { APP_VERSION, BRAND, LINKS } from '../../config';
import { LogoMark } from '../common/Brand';

export function Footer({ onReset }: { onReset: () => void }) {
  return (
    <footer className="footer">
      <div className="footer-brand">
        <LogoMark size={30} />
        <div>
          <b>
            {BRAND.name} <span lang="ta">{BRAND.native}</span>
          </b>
          <p>{BRAND.tagline}</p>
        </div>
      </div>
      <p className="footer-note">
        A learning-only edition: practice tasks are design exercises, not runnable systems. Progress, notes and bookmarks stay in
        this browser. No account, no tracking, and no promises about jobs or performance.
      </p>
      <div className="footer-actions">
        <a href={LINKS.repo} target="_blank" rel="noreferrer">
          <Github size={15} aria-hidden="true" /> Source on GitHub
        </a>
        <a href={`${LINKS.repo}/blob/main/LICENSING.md`} target="_blank" rel="noreferrer" title="Code is MIT licensed; lessons are CC BY 4.0">
          Code MIT · Lessons CC BY 4.0
        </a>
        <a href={`${import.meta.env.BASE_URL}THIRD-PARTY-NOTICES.txt`} target="_blank" rel="noreferrer">
          Third-party notices
        </a>
        <button type="button" className="link-btn" onClick={onReset}>
          Reset local progress
        </button>
        <span className="footer-version">v{APP_VERSION}</span>
      </div>
    </footer>
  );
}
