import { useId } from 'react';
import { BRAND } from '../../config';

/** The Payil mark: a bold “P” whose bowl closes on a single lilac node — one learner, one growing graph. */
export function LogoMark({ size = 40 }: { size?: number }) {
  const gradient = useId();
  return (
    <svg className="logo-mark" width={size} height={size} viewBox="0 0 64 64" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={gradient} x1="8" y1="6" x2="56" y2="58" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#8df5cb" />
          <stop offset="1" stopColor="#5fd0f0" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="18" fill="#0d1a2b" />
      <rect x="1.5" y="1.5" width="61" height="61" rx="16.5" fill="none" stroke={`url(#${gradient})`} strokeOpacity=".5" strokeWidth="3" />
      <path d="M22 48V17h12.5a9.5 9.5 0 0 1 0 19H22" fill="none" stroke={`url(#${gradient})`} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="46" cy="47" r="5" fill="#b8a8ff" />
    </svg>
  );
}

export function Brand({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" className="brand" onClick={onClick} aria-label={`${BRAND.name} (${BRAND.native}) — home`}>
      <LogoMark />
      <span className="brand-text">
        <span className="brand-word">
          {BRAND.name}
          <span className="brand-native" lang="ta">{BRAND.native}</span>
        </span>
        <small>Agent engineering</small>
      </span>
    </button>
  );
}
