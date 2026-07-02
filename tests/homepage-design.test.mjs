import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import test from 'node:test';

const projectRoot = new URL('..', import.meta.url).pathname;

test('uses the long-running dark editorial homepage shell from before the first light theme', async () => {
  const page = await readFile(join(projectRoot, 'src/pages/index.astro'), 'utf8');
  const theme = await readFile(join(projectRoot, 'src/styles/theme.css'), 'utf8');

  assert.match(page, /import HeroExchange from/);
  assert.match(page, /<HeroExchange \/>/);
  assert.match(page, /AI Marketing OS/);
  assert.doesNotMatch(page, /PosterHome/);
  assert.doesNotMatch(page, /poster-theme/);
  assert.match(theme, /--color-bg: #070711/);
  assert.match(theme, /linear-gradient\(180deg, #070711 0%, #090914 42%, #05050b 100%\)/);
  assert.doesNotMatch(theme, /LIGHT EDITORIAL THEME/);
});

test('uses the dark-era navbar labels and growth route', async () => {
  const header = await readFile(join(projectRoot, 'src/components/Header.astro'), 'utf8');

  assert.match(header, /label: "Thinking"/);
  assert.match(header, /label: "Intelligence"/);
  assert.match(header, /href: "\/restaurant-cafe-growth-systems\/", label: "Growth"/);
  assert.match(header, /label: "Principles"/);
  assert.match(header, /label: "Work"/);
  assert.match(header, /label: "Podcast"/);
  assert.match(header, /label: "Story"/);
  assert.doesNotMatch(header, /Market Intelligence/);
  assert.doesNotMatch(header, /href: "\/tip\/"/);
  assert.doesNotMatch(header, /Growth Systems/);
  assert.doesNotMatch(header, /Case Studies/);
  assert.doesNotMatch(header, /Conversations/);
});
