/** Single source of truth for brand and deployment constants. */
export const BRAND = {
  name: 'Payil',
  /** The Tamil word for "learn and practise" (பயில்). */
  native: 'பயில்',
  meaning: 'Learn and Practise',
  tagline: 'Learn to Engineer Intelligent Agents.',
  description:
    'Payil (பயில்) means “learn and practise” in Tamil. A twelve-stage, self-paced learning platform for designing, securing and operating real-world AI agents.',
} as const;

export const LINKS = {
  repo: 'https://github.com/itsual/payil-agent-engineering',
  site: 'https://itsual.github.io/payil-agent-engineering/',
} as const;

export const APP_VERSION: string = typeof __APP_VERSION__ === 'string' ? __APP_VERSION__ : 'dev';
