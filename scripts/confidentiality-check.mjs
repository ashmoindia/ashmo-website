// A regression check for the reviewed disclosure patterns, not a legal-compliance test.
import { readdir, readFile } from 'node:fs/promises';
import { join, relative } from 'node:path';

const company = /\bfilli\b|fillicafe|zafran|rafih|limetray|clevertap/iu;
const withdrawn = /(?:href|src)=["'][^"']*(?:\/work\/(?:filli-cafe|the-podcast)|\/thinking\/ai-marketing-70-outlet-chain)/iu;
const sensitive = /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----|gh[pousr]_[A-Za-z0-9]{30,}|sk_live_[A-Za-z0-9]{20,}|AKIA[0-9A-Z]{16}|xox[baprs]-[A-Za-z0-9-]{15,}/u;
const allowedBiography = 'Head of Brand & Growth at FiLLi Cafe. Ashmo.io is an independent personal website. The content here does not represent or imply endorsement by the company.';
let files = 0;
const failures = [];
async function inspect(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) { await inspect(path); continue; }
    if (/\.map$/iu.test(path)) failures.push(`${path}: public source map`);
    if (!/\.(?:html|xml|txt|css|js|json|md|csv|svg)$/iu.test(path)) continue;
    files++;
    const text = await readFile(path, 'utf8');
    const profile = relative('dist', path) === 'ashraf-hassan/index.html';
    const reviewed = profile ? text.replace(allowedBiography.replaceAll('&', '&amp;'), '') : text;
    if (company.test(reviewed)) failures.push(`${path}: unexpected employer reference`);
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
  console.log(`Confidentiality regression check passed: ${files} public text files; only the reviewed profile employment sentence is permitted.`);
}
