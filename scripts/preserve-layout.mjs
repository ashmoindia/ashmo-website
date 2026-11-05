// Preserve the current published design while the editable upstream source is reconciled.
import { readFile, writeFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { parse, parseFragment, serialize } from 'parse5';

const shell = JSON.parse(await readFile('src/preserved-publications/shell.json', 'utf8'));
const attr = (node, name) => node.attrs?.find(item => item.name === name)?.value;
function find(node, predicate, results = []) {
  if (predicate(node)) results.push(node);
  for (const child of node.childNodes || []) find(child, predicate, results);
  return results;
}
const content = node => node.nodeName === '#text' ? node.value : (node.childNodes || []).map(content).join('');
function replace(node, html) {
  const parent = node.parentNode;
  const replacement = parseFragment(html).childNodes[0];
  replacement.parentNode = parent;
  parent.childNodes[parent.childNodes.indexOf(node)] = replacement;
}
async function update(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const file = join(directory, entry.name);
    if (entry.isDirectory()) { await update(file); continue; }
    if (!file.endsWith('.html') || /google[a-z0-9]+\.html$/i.test(file) || file.includes('/pm/')) continue;
    const doc = parse(await readFile(file, 'utf8'));
    const header = find(doc, node => node.tagName === 'header')[0];
    const footer = find(doc, node => node.tagName === 'footer')[0];
    if (header) replace(header, shell.header);
    if (footer) replace(footer, shell.footer);
    if (header) {
      for (const script of find(doc, node => node.tagName === 'script' && content(node).includes('mobile-menu-btn'))) {
        script.parentNode.childNodes = script.parentNode.childNodes.filter(node => node !== script);
      }
      const body = find(doc, node => node.tagName === 'body')[0];
      for (const html of shell.navigationScripts) {
        const script = parseFragment(html).childNodes[0];
        script.parentNode = body;
        body.childNodes.push(script);
      }
      const head = find(doc, node => node.tagName === 'head')[0];
      for (const href of shell.styles.filter(href => href.includes('BaseLayout.'))) {
        if (find(head, node => node.tagName === 'link' && attr(node, 'href') === href).length) continue;
        const link = parseFragment(`<link rel="stylesheet" href="${href}">`).childNodes[0];
        link.parentNode = head;
        head.childNodes.push(link);
      }
    }
    await writeFile(file, serialize(doc));
  }
}
await update('dist');
console.log('Preserved current published navigation, footer and design styles.');

// This review surface is generated only for Netlify previews and never for production.
if (process.env.CONTEXT === 'deploy-preview') {
  const routes = ['/', '/ashraf-hassan/', '/story/', '/work/', '/work/ashmo-platform/', '/work/early-hustle/', '/podcast/', '/employment-disclaimer/', '/legal/', '/concepts/', '/concepts/uae-specialty-karak-kiosk-business-plan/', '/410/'];
  for (const name of await readdir('src/content/thinking')) {
    if (!name.endsWith('.md')) continue;
    const article = await readFile(join('src/content/thinking', name), 'utf8');
    if (!/published:\s*false/.test(article)) routes.push(`/thinking/${name.slice(0, -3)}/`);
  }
  const options = routes.map(path => `<option value="${path}">${path}</option>`).join('');
  await writeFile('dist/__review.html', `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>Mobile layout review</title><style>body{margin:0;background:#e9e9ed;color:#16161c;font:16px system-ui}header{padding:16px;display:flex;align-items:center;gap:14px;flex-wrap:wrap;background:white}select{max-width:700px;padding:8px;font:inherit}main{padding:20px;display:flex;justify-content:center}iframe{display:block;width:390px;height:844px;border:1px solid #aaa;background:#070711;box-shadow:0 8px 30px #0002}</style></head><body><header><strong>Mobile review · 390 px</strong><label>Page <select id="page">${options}</select></label><a id="desktop" href="/" target="_blank">Open full page</a></header><main><iframe title="Mobile page preview" src="/"></iframe></main><script>const select=document.getElementById('page');select.addEventListener('change',()=>{document.querySelector('iframe').src=select.value;document.getElementById('desktop').href=select.value;});</script></body></html>`);
}
