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
