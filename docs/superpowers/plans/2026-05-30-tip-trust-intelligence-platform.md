# TIP Trust Intelligence Platform Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a premium static-first TIP public MVP under `/tip/` with one sourced Advion OG Trace Report, browser search, moderated research intake, educational pages, and SEO metadata.

**Architecture:** Keep the first release native to the existing Astro static-site stack. Store published TIP records in one structured data module, compose pages from small Astro components, filter the built product index in the browser, and collect submissions through Netlify Forms.

**Tech Stack:** Astro 6, Tailwind CSS 4, Netlify Forms, Node test runner, Netlify deploy CLI

---

### Task 1: Add TIP Surface Contract

**Files:**
- Create: `tests/tip-surface.test.mjs`
- Modify: `package.json`

- [ ] Write a Node test that imports the TIP dataset and checks the Advion seed record, official source fields, disclaimer, route files, and prohibited public accusation language.
- [ ] Run `node --test tests/tip-surface.test.mjs` and confirm it fails because the TIP module does not exist yet.
- [ ] Add `test:tip` to `package.json`.

### Task 2: Create Published TIP Data

**Files:**
- Create: `src/data/tip.mjs`

- [ ] Add the reusable disclaimer, status labels, checklist guide, source records, category summaries, and Advion report data.
- [ ] Keep every claim source-linked and use neutral report language.
- [ ] Run `npm run test:tip` and confirm the data-level assertions pass while route checks still fail.

### Task 3: Build Reusable TIP Components

**Files:**
- Create: `src/components/tip/TipSectionNav.astro`
- Create: `src/components/tip/ConfidenceBadge.astro`
- Create: `src/components/tip/TipDisclaimerBox.astro`
- Create: `src/components/tip/TipSourceCard.astro`
- Create: `src/components/tip/TipChecklist.astro`
- Create: `src/components/tip/TipRiskSignals.astro`
- Create: `src/components/tip/TipProductCard.astro`

- [ ] Create evidence-led cards and section navigation consistent with the current ashmo.io theme.
- [ ] Render source type, publisher, confidence, and external source links visibly.

### Task 4: Build Public TIP Pages

**Files:**
- Create: `src/pages/tip/index.astro`
- Create: `src/pages/tip/search.astro`
- Create: `src/pages/tip/products/[slug].astro`
- Create: `src/pages/tip/submit.astro`
- Create: `src/pages/tip/checklist.astro`
- Create: `src/pages/tip/about.astro`
- Create: `src/pages/tip/disclaimer.astro`

- [ ] Add the hub, browser-filtered search page, full Advion report, Netlify research form, educational checklist, about page, and correction-request disclaimer page.
- [ ] Emit breadcrumbs and visible FAQ schema on the Advion report.
- [ ] Run `npm run test:tip` and confirm the full surface contract passes.

### Task 5: Add Site Entry Points

**Files:**
- Modify: `src/components/Header.astro`
- Modify: `src/components/Footer.astro`

- [ ] Add TIP to the primary navigation and footer exploration links.
- [ ] Run `npm run lint`.
- [ ] Run `npm run build`.

### Task 6: Browser QA and Release

**Files:**
- No code changes expected

- [ ] Start the local Astro server and inspect `/tip/`, `/tip/search/`, `/tip/products/advion-cockroach-gel-bait/`, and `/tip/submit/`.
- [ ] Check desktop and mobile layouts and test search filtering.
- [ ] Run `npx netlify deploy` and inspect the draft deploy.
- [ ] Run `npx netlify deploy --prod`.

