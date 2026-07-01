# Paper Moon Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a secure, production-ready Paper Moon PWA at `https://ashmo.io/pm/`.

**Architecture:** Astro serves isolated static app shells. Netlify Functions own all protected behavior and access Supabase through the service role; shared pure modules handle validation, safety, encryption, and signed sessions. The browser keeps only ephemeral UI state, while a network-safe service worker caches static Paper Moon assets and never API or trace data.

**Tech Stack:** Astro 6, browser JavaScript, Netlify Functions, Node crypto, bcryptjs, Supabase Postgres and Storage, Node test runner

---

### Task 1: Define The Security Contract

**Files:**
- Create: `tests/paper-moon-core.test.mjs`
- Create: `tests/paper-moon-surface.test.mjs`
- Modify: `package.json`

- [ ] Write failing Node tests for Mooncrumb normalization, slug validation, duration expiry, safety rejection, AES-GCM round trips, tamper rejection, signed session validation, expired sessions, required route files, forbidden visible copy, manifest fields, service-worker API exclusions, robots rules, migration RLS, and Netlify noindex headers.
- [ ] Run `node --test tests/paper-moon-core.test.mjs tests/paper-moon-surface.test.mjs`.
- [ ] Confirm failure because the Paper Moon modules and routes do not exist.
- [ ] Add `"test:pm": "node --test tests/paper-moon-core.test.mjs tests/paper-moon-surface.test.mjs"` to `package.json`.

### Task 2: Build Pure Security And Validation Modules

**Files:**
- Create: `netlify/functions/_pm/config.mjs`
- Create: `netlify/functions/_pm/validation.mjs`
- Create: `netlify/functions/_pm/safety.mjs`
- Create: `netlify/functions/_pm/crypto.mjs`
- Create: `netlify/functions/_pm/session.mjs`
- Modify: `package.json`
- Modify: `package-lock.json`

- [ ] Install `bcryptjs`.
- [ ] Implement `normalizeMooncrumb`, `normalizeSlug`, `isValidSlug`, `expiryForDuration`, input length limits, URL sanitation, and upload signature validation.
- [ ] Implement deterministic safety checks for threats, hate, harassment, exploitation, doxxing, blackmail, harmful instructions, and link spam.
- [ ] Implement AES-256-GCM trace encryption using `PM_CONTENT_ENCRYPTION_KEY`.
- [ ] Implement HMAC-signed, 30-minute HTTP-only cookies using `PM_SESSION_SECRET`.
- [ ] Run `npm run test:pm` and confirm all core tests pass while surface tests remain red.

### Task 3: Add Supabase Persistence And Migration

**Files:**
- Create: `supabase/migrations/202606140001_paper_moon.sql`
- Create: `netlify/functions/_pm/supabase.mjs`
- Create: `netlify/functions/_pm/repository.mjs`

- [ ] Create `pm_moons`, `pm_traces`, and `pm_events`, indexes, constraints, cleanup SQL, and the private `pm-pieces` bucket.
- [ ] Enable RLS on all tables and provide no anonymous table policies.
- [ ] Add service-role REST and Storage helpers with `cache-control: no-store`.
- [ ] Add repository functions for moon creation, slug lookup, failed-attempt cooldown, encrypted trace reads/writes, signed photo URLs, soft deletion, photo cleanup, and expiry cleanup.
- [ ] Run `npm run test:pm` and confirm migration assertions pass.

### Task 4: Create Netlify Function Endpoints

**Files:**
- Create: `netlify/functions/_pm/http.mjs`
- Create: `netlify/functions/pm-create.mjs`
- Create: `netlify/functions/pm-unfold.mjs`
- Create: `netlify/functions/pm-traces.mjs`
- Create: `netlify/functions/pm-photo.mjs`
- Create: `netlify/functions/pm-fold.mjs`
- Create: `netlify/functions/pm-remove.mjs`
- Create: `netlify/functions/pm-cleanup.mjs`

- [ ] Add JSON parsing, no-store responses, origin checks, request size limits, generic visible failures, and method validation.
- [ ] Create moons with bcrypt-hashed Mooncrumbs, encrypted first traces, and creator cookies.
- [ ] Verify Mooncrumbs with cooldown behavior and issue visitor cookies without revealing moon existence.
- [ ] Read and add traces only with a valid moon-scoped session and enforce expiry, safety, and posting frequency.
- [ ] Validate and upload final JPEG, PNG, or WebP files no larger than 1 MB.
- [ ] Clear sessions with Fold Away, restrict removal to creators, and schedule daily cleanup.
- [ ] Add focused endpoint tests using injected repository operations where practical.

### Task 5: Build The Isolated Paper Moon Interface

**Files:**
- Create: `src/layouts/PaperMoonLayout.astro`
- Create: `src/styles/paper-moon.css`
- Create: `src/pages/pm/index.astro`
- Create: `src/pages/pm/[moonSlug].astro`
- Create: `src/pages/pm/offline.astro`
- Create: `public/pm/paper-moon.js`

- [ ] Build the creation flow with exact whimsical language, slug suggestions, durations, first trace, validation, share card, and safety card.
- [ ] Build the Mooncrumb state, expired/deleted states, trace field, composer, photo compression, upload progress, polling, share controls, Fold Away, and creator-only removal.
- [ ] Keep all trace content client-fetched after successful access.
- [ ] Use a standalone folded-paper nocturne design with accessible contrast, reduced-motion support, safe areas, mobile keyboard handling, and no Ashmo components or analytics.
- [ ] Run visible-copy tests and fix every forbidden user-facing term.

### Task 6: Add Quiet PWA And Crawl Protection

**Files:**
- Create: `public/manifest.webmanifest`
- Create: `public/pm/sw.js`
- Create: `public/pm/icons/icon-192.svg`
- Create: `public/pm/icons/icon-512.svg`
- Create: `public/pm/icons/icon-maskable-512.svg`
- Modify: `astro.config.mjs`
- Modify: `public/robots.txt`
- Modify: `netlify.toml`

- [ ] Add the manifest without any installation UI.
- [ ] Cache only the static app shell and Paper Moon assets; bypass functions, moon documents, signed URLs, and all non-GET requests.
- [ ] Register the service worker quietly from the Paper Moon layout.
- [ ] Filter `/pm/` from the sitemap, disallow it in robots, and emit `X-Robots-Tag` for `/pm/*`.
- [ ] Run `npm run test:pm` and confirm the complete surface contract passes.

### Task 7: Document Operations

**Files:**
- Create: `docs/paper-moon/README.md`
- Modify: `.env.example`

- [ ] Document product behavior, privacy boundaries, Mooncrumb limitations, Supabase migration and bucket setup, encryption key generation, Netlify variables, cleanup scheduling, safety limits, and deployment.
- [ ] Include the required screenshot/copying warning from the brief.
- [ ] Document `PM_CONTENT_ENCRYPTION_KEY`, `PM_SESSION_SECRET`, `PM_CLEANUP_SECRET`, and existing Supabase variables.

### Task 8: Verify And Ship

**Files:**
- Modify only files required by discovered Paper Moon defects.

- [ ] Run `npm run test:pm`.
- [ ] Run `npm run lint`.
- [ ] Run `npm run build`.
- [ ] Start Astro locally and use the in-app browser to inspect `/pm/`, a moon route, and `/pm/offline/` at desktop and mobile widths.
- [ ] Apply the Supabase migration to the linked production project.
- [ ] Generate and set missing production secrets without exposing them in output.
- [ ] Deploy a Netlify draft and smoke-test the functions.
- [ ] Deploy production and verify `https://ashmo.io/pm/`, noindex headers, manifest, service worker, creation, Unfold, trace posting, Fold Away, and removal.

