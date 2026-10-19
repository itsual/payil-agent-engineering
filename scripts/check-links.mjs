// Checks that every reference link in the curriculum still resolves. Needs network access, so it is NOT part of
// `npm run verify`; run it with `npm run check:links` (a scheduled workflow also runs it monthly).
//
//   ok          2xx after following redirects
//   moved       resolves, but the final URL differs from the one in stages.json (consider updating it)
//   unverified  the site refused an automated request (401/403/429/999): needs a manual look, not a failure
//   BROKEN      404/410, other 4xx/5xx, DNS or TLS failure, or a timeout twice in a row  → exit code 1
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const stages = JSON.parse(fs.readFileSync(path.join(root, 'src/data/stages.json'), 'utf8'));

const usedBy = new Map();
for (const stage of stages) for (const r of stage.resources) usedBy.set(r.url, [...(usedBy.get(r.url) ?? []), stage.id]);

const HEADERS = {
  'user-agent': 'Mozilla/5.0 (compatible; PayilLinkCheck/1.0; +https://github.com/itsual/payil-agent-engineering)',
  accept: 'text/html,application/xhtml+xml,*/*;q=0.8',
  'accept-language': 'en',
};

async function probe(url) {
  let lastError = '';
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const response = await fetch(url, { redirect: 'follow', headers: HEADERS, signal: AbortSignal.timeout(25_000) });
      await response.body?.cancel();
      return { status: response.status, finalUrl: response.url };
    } catch (error) {
      lastError = error?.cause?.code ?? error?.name ?? String(error);
    }
  }
  return { status: 0, error: lastError };
}

const normalize = u => u.replace(/\/+$/, '').replace(/#.*$/, '');
const urls = [...usedBy.keys()];
const results = new Array(urls.length);
let next = 0;
await Promise.all(
  Array.from({ length: 4 }, async () => {
    while (next < urls.length) {
      const i = next++;
      const r = await probe(urls[i]);
      let verdict;
      if (r.status >= 200 && r.status < 300) verdict = normalize(r.finalUrl) === normalize(urls[i]) ? 'ok' : 'moved';
      else if ([401, 403, 429, 999].includes(r.status)) verdict = 'unverified';
      else verdict = 'BROKEN';
      results[i] = { url: urls[i], verdict, ...r };
    }
  }),
);

for (const r of results) {
  const detail = r.verdict === 'moved' ? `→ ${r.finalUrl}` : r.status ? `HTTP ${r.status}` : `error ${r.error}`;
  console.log(`${r.verdict.padEnd(10)} ${r.url}  [stage ${usedBy.get(r.url).join(', ')}]  ${r.verdict === 'ok' ? '' : detail}`);
}
const count = v => results.filter(r => r.verdict === v).length;
console.log(`\n${results.length} links: ${count('ok')} ok, ${count('moved')} moved, ${count('unverified')} unverified, ${count('BROKEN')} broken`);
process.exit(count('BROKEN') ? 1 : 0);
