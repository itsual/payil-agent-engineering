/** WCAG 2.x colour-contrast helpers. Used by tests that guard the palette; not shipped to the browser UI. */

export type Rgb = [number, number, number];

export function parseHex(hex: string): Rgb {
  const clean = hex.trim().replace(/^#/, '');
  const full = clean.length === 3 ? clean.split('').map(c => c + c).join('') : clean;
  if (!/^[0-9a-f]{6}$/i.test(full)) throw new Error(`Not a hex colour: ${hex}`);
  return [0, 2, 4].map(i => parseInt(full.slice(i, i + 2), 16)) as Rgb;
}

const channel = (value: number) => {
  const s = value / 255;
  return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
};

export function relativeLuminance([r, g, b]: Rgb): number {
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

export function contrastRatio(a: Rgb | string, b: Rgb | string): number {
  const la = relativeLuminance(typeof a === 'string' ? parseHex(a) : a);
  const lb = relativeLuminance(typeof b === 'string' ? parseHex(b) : b);
  const [hi, lo] = la >= lb ? [la, lb] : [lb, la];
  return (hi + 0.05) / (lo + 0.05);
}

/** `color-mix(in srgb, fg <alpha>, transparent)` painted over `bg`: what the browser actually shows. */
export function tint(fg: string, bg: string, alpha: number): Rgb {
  const f = parseHex(fg);
  const b = parseHex(bg);
  return [0, 1, 2].map(i => Math.round(f[i] * alpha + b[i] * (1 - alpha))) as Rgb;
}
