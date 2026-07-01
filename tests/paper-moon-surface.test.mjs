import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

const visibleFiles = [
  'src/pages/pm/index.astro',
  'src/pages/pm/[moonSlug].astro',
  'src/pages/pm/offline.astro',
  'public/pm/paper-moon.js',
];

test('provides the required Paper Moon routes and exact product language', () => {
  const content = visibleFiles.map(read).join('\n');
  for (const phrase of [
    'Make a paper moon.',
    'Let someone leave a trace.',
    'Mooncrumb',
    'Unfold',
    'Fold Away',
    'The moon didn’t remember that.',
    'The sky is offline. Try again when the signal returns.',
  ]) {
    assert.match(content, new RegExp(phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  }
});

test('keeps forbidden vocabulary out of visible interface strings', () => {
  const astro = visibleFiles.slice(0, 3).map(read).join('\n')
    .replace(/^---[\s\S]*?---/gm, '')
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<!--[\s\S]*?-->/g, '');
  const textNodes = [...astro.matchAll(/>([^<{]+)</g)].map((match) => match[1]);
  const visibleAttributes = [...astro.matchAll(/(?:placeholder|aria-label|title)="([^"]+)"/g)]
    .map((match) => match[1]);
  const browserStrings = [...read('public/pm/paper-moon.js').matchAll(/(['"`])((?:(?!\1).)*)\1/g)]
    .map((match) => match[2]);
  const content = [...textNodes, ...visibleAttributes, ...browserStrings].join('\n');
  const forbidden = [
    'open', 'enter', 'word', 'password', 'passcode', 'key', 'secret', 'private',
    'encrypted', 'encryption',
    'message', 'chat', 'messenger', 'inbox', 'dm', 'room', 'vault',
    'login', 'sign in', 'authentication',
  ];
  for (const term of forbidden) {
    assert.doesNotMatch(content, new RegExp(`\\b${term}\\b`, 'i'));
  }
});

test('defines a quiet scoped manifest', () => {
  const manifest = JSON.parse(read('public/manifest.webmanifest'));
  assert.equal(manifest.name, 'Paper Moon');
  assert.equal(manifest.start_url, '/pm/');
  assert.equal(manifest.scope, '/pm/');
  assert.equal(manifest.display, 'standalone');
  assert.equal(manifest.icons.length >= 3, true);
});

test('service worker never caches functions or moon documents', () => {
  const worker = read('public/pm/sw.js');
  assert.match(worker, /\/\.netlify\/functions\//);
  assert.match(worker, /request\.method !== 'GET'/);
  assert.match(worker, /networkOnly|fetch\\(request\\)/);
  assert.doesNotMatch(worker, /(?:trace[\s\S]*caches\.put|caches\.put[\s\S]*trace)/i);
});

test('blocks crawling through page metadata, robots, sitemap, and headers', () => {
  const layout = read('src/layouts/PaperMoonLayout.astro');
  assert.match(layout, /noindex,nofollow,noarchive,nosnippet/);
  assert.match(read('public/robots.txt'), /Disallow: \/pm/);
  assert.match(read('astro.config.mjs'), /filter/);
  assert.match(read('netlify.toml'), /X-Robots-Tag = "noindex, nofollow, noarchive, nosnippet"/);
});

test('migration creates private RLS-protected Paper Moon storage', () => {
  const sql = read('supabase/migrations/202606140001_paper_moon.sql');
  for (const table of ['pm_moons', 'pm_traces', 'pm_events']) {
    assert.match(sql, new RegExp(`create table if not exists public\\.${table}`));
    assert.match(sql, new RegExp(`alter table public\\.${table} enable row level security`));
  }
  assert.match(sql, /'pm-pieces',\s*'pm-pieces',\s*false/);
  assert.doesNotMatch(sql, /create policy[\s\S]+pm_(moons|traces|events)/i);
});

test('runs expiry cleanup automatically every day', () => {
  const cleanup = read('netlify/functions/pm-cleanup-scheduled.mjs');
  assert.match(cleanup, /expiredPhotoPaths/);
  assert.match(cleanup, /deleteExpiredRows/);
  assert.match(cleanup, /schedule:\s*'15 3 \* \* \*'/);
});
