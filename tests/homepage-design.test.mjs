import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import test from 'node:test';

const projectRoot = new URL('..', import.meta.url).pathname;

test('keeps the pre-poster homepage design shell', async () => {
  const page = await readFile(join(projectRoot, 'src/pages/index.astro'), 'utf8');

  assert.match(page, /import HeroExchange from/);
  assert.match(page, /<HeroExchange \/>/);
  assert.doesNotMatch(page, /PosterHome/);
  assert.doesNotMatch(page, /poster-theme/);
});
