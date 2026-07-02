import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import test from 'node:test';

import {
  tipDisclaimer,
  tipProducts,
  tipStatusLabels,
} from '../src/data/tip.mjs';

const projectRoot = new URL('..', import.meta.url).pathname;
const sourceTypes = new Set([
  'official_product_page',
  'official_label',
  'safety_data_sheet',
  'distributor_page',
  'manufacturer_contact',
  'public_reference',
]);

const publicRoutes = [
  'src/pages/tip/index.astro',
  'src/pages/tip/search.astro',
  'src/pages/tip/products/[slug].astro',
  'src/pages/tip/checklist.astro',
  'src/pages/tip/about.astro',
  'src/pages/tip/disclaimer.astro',
];

test('publishes the Advion trace report with official source records', () => {
  const product = tipProducts.find(({ slug }) => slug === 'advion-cockroach-gel-bait');

  assert.ok(product);
  assert.equal(product.name, 'Advion Cockroach Gel Bait');
  assert.equal(product.activeIngredient, 'Indoxacarb 0.6%');
  assert.equal(product.manufacturer.name, 'Syngenta Crop Protection AG');
  assert.match(product.manufacturer.officialProductUrl, /^https:\/\/www\.syngentappm\.com\//);
  assert.ok(product.sources.length >= 4);

  for (const source of product.sources) {
    assert.ok(sourceTypes.has(source.type), `Unexpected source type: ${source.type}`);
    assert.match(source.url, /^https:\/\//);
    assert.ok(source.publisher);
    assert.ok(source.accessedAt);
    assert.ok(source.confidence);
  }
});

test('keeps the public TIP language neutral and explicit about limits', () => {
  const publicText = JSON.stringify({ tipDisclaimer, tipProducts, tipStatusLabels }).toLowerCase();

  assert.match(tipDisclaimer, /do not certify product authenticity/i);
  assert.match(tipDisclaimer, /do not accuse any seller or marketplace/i);
  assert.doesNotMatch(publicText, /\b(counterfeit seller|fake seller|scam seller|illegal seller)\b/);
});

test('creates every public TIP MVP route', async () => {
  for (const route of publicRoutes) {
    const page = await readFile(join(projectRoot, route), 'utf8');
    assert.match(page, /BaseLayout/);
  }
});

test('keeps TIP product intake private inside the protected admin area', async () => {
  const page = await readFile(join(projectRoot, 'src/pages/admin/tip.astro'), 'utf8');

  assert.match(page, /name="tip-editor-intake"/);
  assert.match(page, /enctype="multipart\/form-data"/);
  assert.match(page, /name="product_image"[^>]*required/);
  assert.match(page, /name="product_name"/);
  assert.match(page, /name="product_link"/);
  assert.match(page, /name="country"/);
  assert.match(page, /name="editor_notes"/);
});

test('skips visitor auto-replies for private TIP editor intake submissions', async () => {
  const handler = await readFile(join(projectRoot, 'netlify/functions/submission-created.mjs'), 'utf8');

  assert.match(handler, /formName === 'tip-editor-intake'/);
  assert.match(handler, /Private TIP intake stored/);
});

test('offers published TIP access from the homepage without public upload', async () => {
  const page = [
    await readFile(join(projectRoot, 'src/pages/index.astro'), 'utf8'),
    await readFile(join(projectRoot, 'src/components/poster/PosterHome.astro'), 'utf8'),
  ].join('\n');

  assert.doesNotMatch(page, /name="tip-product-submission"/);
  assert.doesNotMatch(page, /name="product_image"/);
  assert.match(page, /href="\/tip\/"/);
  assert.match(page, /Trust Intelligence/);
});

test('retires public TIP upload and standalone example routes', async () => {
  const homepage = [
    await readFile(join(projectRoot, 'src/pages/index.astro'), 'utf8'),
    await readFile(join(projectRoot, 'src/components/poster/PosterHome.astro'), 'utf8'),
  ].join('\n');
  const tipIndex = await readFile(join(projectRoot, 'src/pages/tip/index.astro'), 'utf8');
  const tipNav = await readFile(join(projectRoot, 'src/components/tip/TipSectionNav.astro'), 'utf8');
  const tipSearch = await readFile(join(projectRoot, 'src/pages/tip/search.astro'), 'utf8');
  const tipProduct = await readFile(join(projectRoot, 'src/pages/tip/products/[slug].astro'), 'utf8');

  for (const page of [homepage, tipIndex, tipNav, tipSearch, tipProduct]) {
    assert.doesNotMatch(page, /\/tip\/submit\//);
  }

  await assert.rejects(access(join(projectRoot, 'src/pages/tip/submit.astro')));
  await assert.rejects(access(join(projectRoot, 'src/pages/tip/example.astro')));
  await assert.rejects(access(join(projectRoot, 'public/images/tip/advion-cockroach-upload-example.png')));
});
