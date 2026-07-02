import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import test from 'node:test';

const projectRoot = new URL('..', import.meta.url).pathname;

test('uses the poster homepage design shell from the pre-restore version', async () => {
  const page = await readFile(join(projectRoot, 'src/pages/index.astro'), 'utf8');

  assert.match(page, /import PosterHome from/);
  assert.match(page, /import '\.\.\/styles\/poster-theme\.css'/);
  assert.match(page, /bodyClass="poster-theme poster-theme--light"/);
  assert.match(page, /<PosterHome \/>/);
  assert.doesNotMatch(page, /HeroExchange/);
});
