import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import test from 'node:test';

const projectRoot = new URL('..', import.meta.url).pathname;

test('uses the dark poster homepage design shell', async () => {
  const page = await readFile(join(projectRoot, 'src/pages/index.astro'), 'utf8');

  assert.match(page, /import PosterHome from/);
  assert.match(page, /import '\.\.\/styles\/poster-theme\.css'/);
  assert.match(page, /bodyClass="poster-theme"/);
  assert.match(page, /<PosterHome \/>/);
  assert.doesNotMatch(page, /poster-theme--light/);
  assert.doesNotMatch(page, /HeroExchange/);
});
