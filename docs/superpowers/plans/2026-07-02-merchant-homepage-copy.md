# Merchant Homepage Copy Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rewrite the restored dark Ashmo homepage so merchants, shopkeepers, SMB owners, and F&B operators can understand the value quickly.

**Architecture:** Keep the existing Astro page/component structure. Change copy in `src/pages/index.astro`, `src/components/HeroExchange.astro`, `src/components/Footer.astro`, `src/layouts/BaseLayout.astro`, and `src/data/entity.ts`; update `tests/homepage-design.test.mjs` to lock the plain-language direction.

**Tech Stack:** Astro, Node test runner, existing static build and SEO validator.

## Global Constraints

- Preserve the restored dark `HeroExchange` homepage structure.
- Preserve the dark-era navbar labels and route from commit `9db5285`.
- Avoid fabricated claims, testimonials, or guarantees.
- Avoid technical phrases in major visible homepage copy: `AI Marketing OS`, `operator signal`, `framework layers`.
- Keep F&B as the strongest industry focus while opening broadly to merchants, shopkeepers, and SMB owners.

---

### Task 1: Lock Plain-Language Homepage Copy

**Files:**
- Modify: `tests/homepage-design.test.mjs`
- Modify: `src/pages/index.astro`
- Modify: `src/components/HeroExchange.astro`
- Modify: `src/components/Footer.astro`
- Modify: `src/layouts/BaseLayout.astro`
- Modify: `src/data/entity.ts`

**Interfaces:**
- Consumes: Existing Astro components and page data arrays.
- Produces: A homepage whose visible copy uses plain business language.

- [ ] **Step 1: Write the failing test**

Add assertions to `tests/homepage-design.test.mjs` that require merchant-facing phrases and reject the technical hero phrase:

```js
assert.match(page, /Practical growth ideas for restaurants, cafes, shops, and small businesses/);
assert.match(page, /more customers, better sales, clearer pricing, and marketing that people understand/);
assert.doesNotMatch(page, /AI Marketing OS/);
assert.doesNotMatch(page, /operator signal/i);
```

- [ ] **Step 2: Run test to verify it fails**

Run: `PATH=/Users/brandmanager/.nvm/versions/node/v24.14.0/bin:$PATH node --test tests/homepage-design.test.mjs`

Expected: FAIL because the current homepage still contains `AI Marketing OS` and does not contain the approved plain-language headline.

- [ ] **Step 3: Rewrite homepage copy**

Update `src/pages/index.astro`, `src/components/HeroExchange.astro`, `src/components/Footer.astro`, `src/layouts/BaseLayout.astro`, and `src/data/entity.ts` with plain business terms. Keep routes, layout, and component names stable.

- [ ] **Step 4: Run focused test**

Run: `PATH=/Users/brandmanager/.nvm/versions/node/v24.14.0/bin:$PATH node --test tests/homepage-design.test.mjs`

Expected: PASS with 0 failures.

- [ ] **Step 5: Run build**

Run: `PATH=/Users/brandmanager/.nvm/versions/node/v24.14.0/bin:$PATH npm run build`

Expected: Astro build succeeds, SEO validator reports 0 critical issues.

- [ ] **Step 6: Commit**

```bash
git add docs/superpowers/specs/2026-07-02-merchant-homepage-copy-design.md docs/superpowers/plans/2026-07-02-merchant-homepage-copy.md tests/homepage-design.test.mjs src/pages/index.astro src/components/HeroExchange.astro src/components/Footer.astro src/layouts/BaseLayout.astro src/data/entity.ts
git commit -m "Rewrite homepage for merchant readers"
```
