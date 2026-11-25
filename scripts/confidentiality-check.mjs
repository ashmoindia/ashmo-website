// A regression check for the reviewed disclosure patterns, not a legal-compliance test.
import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';

const company = /\bf[\s._-]*i[\s._-]*l[\s._-]*l[\s._-]*[ií]\b|fillicafe|\bphilly\s+caf[eé]\b|\bzafran\b|\brafih\b|limetray|clevertap|\bpulse[\s._-]+os\b|\bchembot\b/iu;
const withdrawn = /(?:href|src)=["'][^"']*(?:\/work\/(?:filli-cafe|the-podcast)|\/thinking\/ai-marketing-70-outlet-chain)/iu;
const sensitive = /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----|gh[pousr]_[A-Za-z0-9]{30,}|sk_live_[A-Za-z0-9]{20,}|AKIA[0-9A-Z]{16}|xox[baprs]-[A-Za-z0-9-]{15,}/u;
let files = 0;
const failures = [];
async function inspect(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) { await inspect(path); continue; }
    if (/\.map$/iu.test(path)) failures.push(`${path}: public source map`);
    if (company.test(entry.name)) failures.push(`${path}: unexpected employer reference in asset name`);
    if (!/\.(?:html?|xml|txt|css|[cm]?js|json|jsonld|md|csv|svg|webmanifest)$/iu.test(path)) continue;
    files++;
    const text = await readFile(path, 'utf8');
    if (company.test(text)) failures.push(`${path}: unexpected employer reference`);
    if (withdrawn.test(text)) failures.push(`${path}: link to a withdrawn publication`);
    if (sensitive.test(text)) failures.push(`${path}: credential pattern; review privately`);
    if (/worksFor/u.test(text)) failures.push(`${path}: employer attribution in structured data`);
  }
}
await inspect('dist');
for (const path of ['dist/work/filli-cafe/index.html', 'dist/work/the-podcast/index.html', 'dist/thinking/ai-marketing-70-outlet-chain/index.html']) {
  try { await readFile(path); failures.push(`${path}: withdrawn output still present`); }
  catch (error) { if (error.code !== 'ENOENT') throw error; }
}
if (failures.length) {
  console.error(failures.join('\n'));
  process.exitCode = 1;
} else {
  console.log(`Confidentiality regression check passed: ${files} public text files.`);
}
