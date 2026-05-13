# SEO Implementation Audit · ashmo.io

**Date:** 2026-05-13
**Scope:** Phase B (schema layer) + Phase C (content-collection scaffold + 1 sample concept page).
**Excluded:** The 12 commercial-intent landing pages from the full plan. Reason: GSC URL Inspection (2026-05-13) showed 3 of the existing pillar pages are *unknown to Google* and 4 more are *discovered, not indexed*. Adding 12 new pages would worsen crawl/indexation, not improve it. This batch focuses on infrastructure that strengthens what already exists.

---

## 1. Current-state findings

### Framework + routing
- Astro 6.x with file-based routing
- `trailingSlash: 'always'` in `astro.config.mjs`
- Static-first; Netlify deploy; sitemap auto-generated via `@astrojs/sitemap` integration

### Existing schema (pre-this-batch)
- `Person` schema for Ashraf Hassan — in `src/data/entity.ts`
- `WebSite` schema — in `src/data/entity.ts`
- `WebPage` schema — auto-generated per page in `BaseLayout.astro`
- `Article` schema — in `ArticleLayout.astro` (for /thinking posts)
- One-off `ProfilePage` schema on `/story/`
- One-off `WebPage` schema on intelligence country pages

### Schema gaps identified
- ❌ **No Organization schema** for Ashmo.io (Person + WebSite only — no Organization entity)
- ❌ **No BreadcrumbList** anywhere on the site
- ❌ **No FAQPage** capability — even though FAQ-style content exists in places
- ❌ Person schema missing `address`, `knowsLanguage`, brand-name alternates
- ❌ No ItemList for hub pages

### Sitemap + robots
- ✅ Sitemap-index → sitemap-0 structure, valid XML, all 75 URLs present
- ✅ `robots.txt` allows all major crawlers including AI (GPTBot, ClaudeBot, PerplexityBot, Google-Extended)
- ✅ Sitemap declared in `robots.txt`
- ⚠️ GSC URL Inspection shows partial discovery despite valid sitemap — diagnosis: insufficient crawl signal from internal links, not a sitemap defect

### Content collections (pre-this-batch)
- `thinking` (essays)
- `work` (case studies)
- ❌ No collection for F&B concept pages (commercial-intent operator content)

### Internal linking
- ✅ Header + Footer reasonably linked to main pillars
- ✅ Final CTA on homepage now links to `/ashraf-hassan/` (added earlier today)
- ✅ New GCC Intelligence section on homepage links to /intelligence/countries/uae/, /intelligence/countries/saudi-arabia/, /intelligence/ (added earlier today)
- ⚠️ Country pages didn't carry breadcrumbs back to /intelligence/ — fixed in this batch

### Metadata system
- ✅ Title, description, canonical, OG, Twitter — all handled in `BaseLayout.astro`
- ✅ Title suffix logic in place ("— Ashraf Hassan" appended unless already present)
- ✅ OG image fallback at `/og-default.jpg`
- ✅ Per-page meta description supported

### Performance
- Build clean at 100/100 SEO scorecard (per `npm run build`)
- 2 pre-existing description-length warnings on templates pages (not addressed in this batch — separate fix)

---

## 2. Changes made in this batch (B + C)

### B. Schema layer

**`src/data/entity.ts`**
- Added `organizationSchema` (Organization entity with founder reference, address, contact point, areaServed)
- Added `organizationId` export
- Enriched `personSchema`:
  - Added `mainEntityOfPage` pointing to `/ashraf-hassan/`
  - Added `address` (Dubai, AE)
  - Added `knowsLanguage` (en, ar, hi, ml)
  - Added `worksFor.url` (FiLLi Cafe)
  - Expanded `knowsAbout` (F&B Operations, Franchise Scaling, AI-assisted Marketing, GCC F&B Markets)
- Updated `websiteSchema`:
  - Publisher is now `Organization` (was `Person`)
  - Added `inLanguage: 'en'`
  - Stronger description

**`src/layouts/BaseLayout.astro`**
- Added optional `breadcrumbs?: BreadcrumbItem[]` prop
- Generates `BreadcrumbList` JSON-LD when breadcrumbs prop is passed
- Includes `Organization` schema in the entity graph on every page
- Entity graph now: Person → Organization → WebSite → WebPage → (optional BreadcrumbList)

**`src/layouts/IntelligenceLayout.astro`**
- Threads `breadcrumbs` prop through to BaseLayout

**`src/pages/intelligence/countries/[slug].astro`**
- Passes breadcrumbs: `Home > Intelligence > Countries > {Country}`
- Renders BreadcrumbList JSON-LD via BaseLayout

**`src/components/Breadcrumbs.astro`** (NEW)
- Reusable visual breadcrumbs component
- Mono-style, on-brand
- Pairs with BaseLayout's breadcrumb schema

**`src/components/FAQSection.astro`** (NEW)
- Reusable FAQ block + FAQPage JSON-LD
- Accordion-style with `<details>`/`<summary>` (no JS required)
- Accepts `items: { q, a }[]` array

### C. Content collection scaffold

**`src/content.config.ts`**
- Added `fnbConcepts` collection
- Schema fields:
  - `title`, `metaTitle`, `metaDescription`, `h1`, `summary`
  - `category` (enum: cafe / qsr / beverage / restaurant / cloud-kitchen / dessert / bakery / franchise)
  - `region`, `audience` (string arrays)
  - `risks`, `checklist` (string arrays)
  - `relatedPages` (objects: title, href, eyebrow)
  - `faqs` (objects: q, a)
  - `ctaType` (enum: concept-review / growth-system / thinking)
  - `published`, `date`, `updated`, `image`, `imageAlt`

**`src/pages/concepts/[slug].astro`** (NEW)
- Dynamic route for all concept pages
- Two-column layout: main body + sidebar (risks, checklist, related)
- Breadcrumbs: Home > F&B Concepts > {Concept}
- Article JSON-LD with Person author, Organization publisher
- FAQ block emits FAQPage JSON-LD when faqs present
- Operator-grade CTA at bottom

**`src/pages/concepts/index.astro`** (NEW)
- Hub page listing all published concepts
- ItemList JSON-LD when concepts exist
- Concept review CTA
- Breadcrumbs: Home > F&B Concepts

**`src/content/fnb-concepts/cafe-business-dubai.md`** (NEW sample page)
- ~1,400 words of operator-grade content
- Frontmatter populates all schema fields
- 5 FAQ items, 7 risks, 8 checklist items, 4 related pages
- Body covers: market reality, concept economics, scalability, risks, brand positioning
- Plain-language, no fake stats, no ROI promises
- Linked to existing pillars (restaurant-cafe-growth-systems, intelligence/countries/uae, restaurant-finance, thinking)

**`src/components/Footer.astro`**
- Added `/concepts/` link to Explore column

---

## 3. Schema graph after this batch

Every page now emits this entity graph (via BaseLayout):

```
@graph: [
  Person (Ashraf Hassan)
    @id: https://ashmo.io/#person
    mainEntityOfPage: /ashraf-hassan/
    address: Dubai, AE
    worksFor: FiLLi Cafe
    knowsAbout: [Brand Strategy, Cafe Growth, F&B Operations, ...]

  Organization (Ashmo)
    @id: https://ashmo.io/#organization
    founder: @person
    address: Dubai, AE
    areaServed: [AE, SA, KW, QA, BH, OM]
    contactPoint: ashmoindia@gmail.com

  WebSite (Ashmo)
    @id: https://ashmo.io/#website
    publisher: @organization
    author: @person

  WebPage (current page)
    @id: <pageURL>#webpage
    isPartOf: @website
    about: @person

  [optional] BreadcrumbList
    itemListElement: [...]
]
```

Plus, where applicable:
- Article schema on `/thinking/*`, `/concepts/*`
- ProfilePage on `/story/`
- ItemList on `/concepts/`
- FAQPage anywhere `<FAQSection>` is used

---

## 4. Sitemap status

The new pages will be picked up automatically by `@astrojs/sitemap` on next build:
- `/concepts/`
- `/concepts/cafe-business-dubai/`

Sitemap URL count goes from 75 → 77.

---

## 5. What's deliberately NOT in this batch

- ❌ The 12 commercial landing pages (`/restaurant-investment-uae`, `/fried-chicken-franchise-uae`, etc.) — premature given indexation status of existing pages
- ❌ Top-nav restructure — too disruptive without first validating that the F&B-concept angle ranks
- ❌ Lead capture form on contact page — existing form already handles inquiries
- ❌ Programmatic generation of 50+ concept pages — the scaffold supports this, but adding URLs now would dilute crawl budget on already-unindexed pillars

These can be added later **after** seeing whether `/concepts/cafe-business-dubai/` gets indexed and earns impressions. The scaffold makes adding more concept pages a data-only edit (drop a new `.md` into `src/content/fnb-concepts/`).

---

## 6. How to add the next concept page

```bash
# Create new file
src/content/fnb-concepts/<slug>.md

# Frontmatter must include: title, metaDescription, category, summary, date, published: true
# Plus optional: risks[], checklist[], relatedPages[], faqs[]
# Body markdown = the operator essay
```

Build picks it up. Sitemap auto-updates. Route is `/concepts/<slug>/`. Schema, breadcrumbs, FAQ, related links — all handled.

---

## 7. Validation steps after deploy

1. Open the live URL `https://ashmo.io/concepts/cafe-business-dubai/` and verify rendering
2. Run https://search.google.com/test/rich-results on the URL — should detect Article, BreadcrumbList, FAQPage, Organization, Person, WebSite
3. In GSC → URL Inspection → request indexing for:
   - `/concepts/`
   - `/concepts/cafe-business-dubai/`
4. Re-submit sitemap in GSC
5. Re-run `python3 scripts/gsc-baseline-audit.py` in ~14 days to verify indexation movement

---

## 8. Build + test results

- `npm run build`: **passes**, 100/100 SEO scorecard maintained, 2 pre-existing warnings unrelated to this batch
- 82 pages built (was 80; added `/concepts/` and `/concepts/cafe-business-dubai/`)
- TypeScript: clean (no new type errors)

---

## 9. Files changed

**Modified:**
- `src/data/entity.ts`
- `src/layouts/BaseLayout.astro`
- `src/layouts/IntelligenceLayout.astro`
- `src/pages/intelligence/countries/[slug].astro`
- `src/components/Footer.astro`
- `src/content.config.ts`

**Created:**
- `src/components/Breadcrumbs.astro`
- `src/components/FAQSection.astro`
- `src/pages/concepts/[slug].astro`
- `src/pages/concepts/index.astro`
- `src/content/fnb-concepts/cafe-business-dubai.md`
- `docs/seo-implementation-audit.md`

---

## 10. Next-phase recommendations

In order of leverage:

1. **Validate the concept page indexes** (7-14 days). If yes, add 3-5 more `.md` files in `src/content/fnb-concepts/` — same schema, same scaffolding, no new code. Candidates by intent: `coffee-shop-business-uae`, `qsr-business-dubai`, `matcha-cafe-uae`, `cloud-kitchen-uae`, `dessert-cafe-gcc`.
2. **Add breadcrumbs to ArticleLayout** (thinking posts) — same threading pattern as IntelligenceLayout. Improves E-A-T signals on /thinking/* (which is your second-largest traffic surface).
3. **Add FAQSection to /restaurant-cafe-growth-systems/ pillar** — that page is a pillar but currently has no FAQ schema. Could earn FAQ rich-results.
4. **Beef up `/ashraf-hassan/` Person entity page** — likely thin, which is why GSC reports it as "discovered but not indexed."
5. **Programmatic content collection** for `intelligence/topics/` migration if/when topic library expands.

Skip: the 12-page commercial landing-page sprint. The data doesn't support it yet.
