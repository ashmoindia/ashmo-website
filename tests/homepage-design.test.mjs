import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import test from 'node:test';

const projectRoot = new URL('..', import.meta.url).pathname;

test('uses the restored dark editorial homepage shell with merchant-friendly copy', async () => {
  const page = await readFile(join(projectRoot, 'src/pages/index.astro'), 'utf8');
  const theme = await readFile(join(projectRoot, 'src/styles/theme.css'), 'utf8');

  assert.match(page, /import HeroExchange from/);
  assert.match(page, /<HeroExchange \/>/);
  assert.match(page, /Practical growth ideas for restaurants, cafes, shops, and small businesses/);
  assert.match(page, /more customers, better sales, clearer pricing, and marketing that people understand/);
  assert.match(page, /merchants, shopkeepers, and F&amp;B owners/);
  assert.doesNotMatch(page, /PosterHome/);
  assert.doesNotMatch(page, /poster-theme/);
  assert.doesNotMatch(page, /AI Marketing OS/);
  assert.doesNotMatch(page, /operator signal/i);
  assert.doesNotMatch(page, /framework layers/i);
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

test('uses plain business language in homepage metadata', async () => {
  const layout = await readFile(join(projectRoot, 'src/layouts/BaseLayout.astro'), 'utf8');
  const entity = await readFile(join(projectRoot, 'src/data/entity.ts'), 'utf8');

  assert.match(layout, /Ashmo\.io — Practical Business Growth for Owners/);
  assert.match(layout, /Practical business lessons for merchants, shopkeepers, restaurants, cafes, and growing brands/);
  assert.match(entity, /practical business lessons for merchants, shopkeepers, restaurant leaders, cafe owners, and growing brands/);
  assert.doesNotMatch(layout, /Commercial Intelligence for AI-Age Brands/);
  assert.doesNotMatch(entity, /Commercial intelligence platform/);
  assert.doesNotMatch(entity, /AI-age marketing systems/);
});
