#!/usr/bin/env node

/**
 * ashmo.io SEO Validator
 * Runs after every build. Checks all HTML pages for SEO issues.
 * Like Yoast, but automated and build-integrated.
 */

import { readdir, readFile } from 'node:fs/promises';
import { join, relative } from 'node:path';

const DIST = join(process.cwd(), 'dist');

// --- Config ---
const TITLE_MIN = 10;
const TITLE_MAX = 60;
const DESC_MIN = 50;
const DESC_MAX = 160;
const CONTENT_MIN_WORDS = 300; // minimum words for article pages
const ARTICLE_PATHS = ['/thinking/', '/work/'];

// --- Helpers ---
async function findHtmlFiles(dir) {
  const files = [];
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...await findHtmlFiles(full));
    } else if (entry.name.endsWith('.html')) {
      files.push(full);
    }
  }
  return files;
}

function extract(html, regex) {
  const match = html.match(regex);
  return match ? match[1] : null;
}

function extractAll(html, regex) {
  const matches = [];
  let m;
  while ((m = regex.exec(html)) !== null) {
    matches.push(m[1] || m[0]);
  }
  return matches;
}

function countWords(html) {
  // Strip tags, decode entities, count words
  const text = html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&\w+;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return text.split(' ').filter(w => w.length > 0).length;
}

function getPagePath(file) {
  return '/' + relative(DIST, file).replace(/index\.html$/, '').replace(/\.html$/, '');
}

// --- Checks ---
function checkPage(html, pagePath) {
  const issues = [];
  const warnings = [];
  const passes = [];
  const isArticle = ARTICLE_PATHS.some(p => pagePath.startsWith(p));

  // 1. Title
  const title = extract(html, /<title>([^<]*)<\/title>/i);
  if (!title) {
    issues.push('FAIL: Missing <title> tag');
  } else if (title.length < TITLE_MIN) {
    warnings.push(`WARN: Title too short (${title.length} chars, min ${TITLE_MIN})`);
  } else if (title.length > TITLE_MAX) {
    warnings.push(`WARN: Title too long (${title.length} chars, max ${TITLE_MAX}) — "${title.substring(0, 50)}..."`);
  } else {
    passes.push(`Title OK (${title.length} chars)`);
  }

  // 2. Meta description
  const desc = extract(html, /<meta\s+name="description"\s+content="([^"]*)"/i)
    || extract(html, /<meta\s+content="([^"]*)"\s+name="description"/i);
  if (!desc) {
    issues.push('FAIL: Missing meta description');
  } else if (desc.length < DESC_MIN) {
    warnings.push(`WARN: Description too short (${desc.length} chars, min ${DESC_MIN})`);
  } else if (desc.length > DESC_MAX) {
    warnings.push(`WARN: Description too long (${desc.length} chars, max ${DESC_MAX})`);
  } else {
    passes.push(`Description OK (${desc.length} chars)`);
  }

  // 3. Canonical URL
  const canonical = extract(html, /<link\s+rel="canonical"\s+href="([^"]*)"/i);
  if (!canonical) {
    issues.push('FAIL: Missing canonical URL');
  } else {
    passes.push('Canonical URL present');
  }

  // 4. Open Graph
  const ogTitle = extract(html, /<meta\s+property="og:title"\s+content="([^"]*)"/i);
  const ogDesc = extract(html, /<meta\s+property="og:description"\s+content="([^"]*)"/i);
  const ogImage = extract(html, /<meta\s+property="og:image"\s+content="([^"]*)"/i);
  const ogType = extract(html, /<meta\s+property="og:type"\s+content="([^"]*)"/i);

  if (!ogTitle) issues.push('FAIL: Missing og:title');
  else passes.push('og:title present');

  if (!ogDesc) issues.push('FAIL: Missing og:description');
  else passes.push('og:description present');

  if (!ogImage) warnings.push('WARN: Missing og:image');
  else passes.push('og:image present');

  if (!ogType) warnings.push('WARN: Missing og:type');
  else passes.push(`og:type = ${ogType}`);

  // 5. Twitter Card
  const twitterCard = extract(html, /<meta\s+(name|property)="twitter:card"\s+content="([^"]*)"/i);
  if (!twitterCard) warnings.push('WARN: Missing twitter:card');
  else passes.push('Twitter card present');

  // 6. H1 check
  const h1s = extractAll(html, /<h1[^>]*>([\s\S]*?)<\/h1>/gi);
  if (h1s.length === 0) {
    issues.push('FAIL: No <h1> tag found');
  } else if (h1s.length > 1) {
    warnings.push(`WARN: Multiple <h1> tags (${h1s.length}) — should have exactly 1`);
  } else {
    passes.push('Single H1 present');
  }

  // 7. Heading hierarchy
  const headings = extractAll(html, /<(h[1-6])[^>]*>/gi);
  let lastLevel = 0;
  let hierarchyOk = true;
  for (const h of headings) {
    const level = parseInt(h.replace('h', ''));
    if (level > lastLevel + 1 && lastLevel > 0) {
      warnings.push(`WARN: Heading hierarchy skip: h${lastLevel} → h${level}`);
      hierarchyOk = false;
      break;
    }
    lastLevel = level;
  }
  if (hierarchyOk && headings.length > 0) passes.push('Heading hierarchy OK');

  // 8. Images alt text
  const imgs = html.match(/<img[^>]*>/gi) || [];
  let missingAlts = 0;
  for (const img of imgs) {
    if (!/alt\s*=\s*"[^"]+"/i.test(img) && !/alt\s*=\s*'[^']+'/i.test(img)) {
      missingAlts++;
    }
  }
  if (missingAlts > 0) {
    warnings.push(`WARN: ${missingAlts} image(s) missing alt text`);
  } else if (imgs.length > 0) {
    passes.push(`All ${imgs.length} images have alt text`);
  }

  // 9. JSON-LD Schema
  const schemas = html.match(/<script\s+type="application\/ld\+json">/gi) || [];
  if (schemas.length === 0) {
    warnings.push('WARN: No JSON-LD structured data found');
  } else {
    passes.push(`${schemas.length} JSON-LD schema(s) present`);
  }

  // 10. Internal links check (collect for cross-validation — skip assets)
  const ASSET_PATTERNS = [/\.(css|js|svg|png|jpg|jpeg|webp|gif|ico|woff2?|ttf|eot|xml|txt|json)$/i, /^\/_astro\//];
  const internalLinks = extractAll(html, /href="(\/[^"#]*?)"/gi)
    .filter(link => !ASSET_PATTERNS.some(p => p.test(link)));

  // 11. Content length for articles
  if (isArticle) {
    const wordCount = countWords(html);
    if (wordCount < CONTENT_MIN_WORDS) {
      warnings.push(`WARN: Thin content (${wordCount} words, min ${CONTENT_MIN_WORDS} for articles)`);
    } else {
      passes.push(`Content length OK (${wordCount} words)`);
    }
  }

  // 12. Lang attribute
  if (!/<html[^>]*lang="[^"]+"/i.test(html)) {
    issues.push('FAIL: Missing lang attribute on <html>');
  } else {
    passes.push('lang attribute present');
  }

  return { issues, warnings, passes, internalLinks };
}

// --- Main ---
async function main() {
  console.log('\n🔍 ashmo.io SEO Validator\n' + '═'.repeat(50));

  // Exclude non-page files (Google verification, etc.)
  const SKIP_PATTERNS = [/google[a-z0-9]+\.html$/i];
  const htmlFiles = (await findHtmlFiles(DIST))
    .filter(f => !SKIP_PATTERNS.some(p => p.test(f)));
  console.log(`\nScanning ${htmlFiles.length} pages...\n`);

  let totalIssues = 0;
  let totalWarnings = 0;
  let totalPasses = 0;
  const allPages = {};
  const allInternalLinks = new Set();

  // Collect all valid paths
  const validPaths = new Set();
  for (const file of htmlFiles) {
    validPaths.add(getPagePath(file));
  }

  // Run checks
  for (const file of htmlFiles.sort()) {
    const pagePath = getPagePath(file);
    const html = await readFile(file, 'utf-8');
    const result = checkPage(html, pagePath);
    allPages[pagePath] = result;

    // Collect internal links for cross-validation
    for (const link of result.internalLinks) {
      allInternalLinks.add(JSON.stringify({ from: pagePath, to: link }));
    }

    const icon = result.issues.length > 0 ? '❌' : result.warnings.length > 0 ? '⚠️' : '✅';
    console.log(`${icon} ${pagePath}`);

    for (const issue of result.issues) {
      console.log(`   ❌ ${issue}`);
      totalIssues++;
    }
    for (const warning of result.warnings) {
      console.log(`   ⚠️  ${warning}`);
      totalWarnings++;
    }

    totalPasses += result.passes.length;
  }

  // Cross-validate internal links
  console.log('\n' + '─'.repeat(50));
  console.log('🔗 Internal Link Validation\n');

  let brokenLinks = 0;
  for (const entry of allInternalLinks) {
    const { from, to } = JSON.parse(entry);
    const normalizedTo = to.endsWith('/') ? to : to + '/';
    if (!validPaths.has(normalizedTo) && !validPaths.has(to)) {
      console.log(`   ❌ Broken: ${from} → ${to}`);
      brokenLinks++;
      totalIssues++;
    }
  }
  if (brokenLinks === 0) {
    console.log('   ✅ All internal links valid');
  }

  // Summary
  console.log('\n' + '═'.repeat(50));
  console.log('📊 SEO SCORECARD\n');

  const score = Math.round((totalPasses / (totalPasses + totalIssues + totalWarnings)) * 100);
  const scoreBar = score >= 90 ? '🟢' : score >= 70 ? '🟡' : '🔴';

  console.log(`   ${scoreBar} Score: ${score}/100`);
  console.log(`   ✅ ${totalPasses} checks passed`);
  console.log(`   ⚠️  ${totalWarnings} warnings`);
  console.log(`   ❌ ${totalIssues} critical issues`);
  console.log(`   📄 ${htmlFiles.length} pages scanned`);
  console.log('');

  if (totalIssues > 0) {
    console.log('❌ BUILD BLOCKED — Fix critical issues above before deploying.\n');
    process.exit(1);
  } else if (totalWarnings > 0) {
    console.log('⚠️  Build OK with warnings — review items above.\n');
  } else {
    console.log('✅ Perfect SEO score — all checks passed!\n');
  }
}

main().catch(err => {
  console.error('SEO check failed:', err);
  process.exit(1);
});
