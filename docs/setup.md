# AI Challenge Platform — Setup Guide

Master onboarding doc. Start here.

The platform spans 6 systems:

```
Instagram comment → ManyChat → Netlify Function → Supabase (truth) → n8n → Notion (ops view)
                                                                  ↓
                                                              Website admin
```

Each system has its own setup doc. This page tells you what to do, in what order, and which doc to read next.

---

## Status legend

- ✅ Done — code-side
- ⚙️ Code-side ready, **needs manual config**
- ⏸️ Future scope (not V1)

---

## Step 1 — Supabase ⚙️

**Read:** `docs/ai-challenge-platform.md` (existing) and run the migrations.

```sh
# In Supabase SQL editor, paste each file in order:
1. supabase/migrations/001_ai_challenge_platform.sql
2. supabase/migrations/002_entry_status_logs.sql
3. supabase/migrations/003_show_public_entries.sql
4. supabase/migrations/004_keyword_worldcup.sql
5. supabase/seed.sql
```

After this:
- 4 tables (challenges, participants, entries, entry_status_logs) exist with RLS
- 3 storage buckets exist (challenge-covers, entry-media, winner-assets)
- The seeded WorldCup challenge is live with status `active`

**Verify:** [`docs/testing.md` step 1](./testing.md#1-supabase-connection)

---

## Step 2 — Netlify env vars ⚙️

**Read:** [`docs/netlify-env.md`](./netlify-env.md)

Minimum to launch:
- `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_ANON_KEY`
- `MANYCHAT_WEBHOOK_SECRET` (generate with `openssl rand -hex 32`)
- `ADMIN_USERNAME`, `ADMIN_PASSWORD`
- `PUBLIC_META_PIXEL_ID`

Trigger a "Clear cache and deploy" after setting.

**Verify:** [`docs/testing.md` step 2 + 9](./testing.md)

---

## Step 3 — ManyChat ⚙️

**Read:** [`docs/manychat-flow.md`](./manychat-flow.md)

Configure:
1. Comment-keyword trigger on the IG announcement post (keyword: `worldcup`)
2. DM Capture flow that collects name, IG username, post URL, AI tools used
3. External Request node pointing at `https://ashmo.io/.netlify/functions/manychat-webhook` with the bearer secret

**Verify:** From a test IG account, comment `worldcup` → walk through DM → check entry appears in admin dashboard within 5s.

---

## Step 4 — Notion ⚙️

**Read:** [`docs/notion-setup.md`](./notion-setup.md)

Create 4 databases under `Ashmo OS v2`:
- Challenges
- Participants
- Entries
- Winners

If you grant the Claude integration "Can edit" access to `Ashmo OS v2`, Claude can create these automatically. Otherwise create manually using the schemas in the doc.

This step is **only needed if you want n8n syncing to Notion**. Skip if you're operating purely from the website admin dashboard.

---

## Step 5 — n8n ⚙️

**Read:** [`docs/n8n-setup.md`](./n8n-setup.md)

1. Spin up n8n (Hetzner €4.50/month VPS or n8n Cloud)
2. Build 3 workflows:
   - Workflow 1: Submission Sync → Notion
   - Workflow 2: Winner/Status Sync → Notion
   - Workflow 3: Monthly ManyChat Cleanup
3. Set `N8N_SUBMISSION_WEBHOOK_URL` + `N8N_ADMIN_EVENT_WEBHOOK_URL` in Netlify

**Verify:** [`docs/testing.md` step 10](./testing.md#10-n8n-round-trip-once-n8n-is-live)

---

## Step 6 — Meta Pixel ✅

Already wired (`src/components/MetaPixel.astro`). Fires on `/challenges/*` once `PUBLIC_META_PIXEL_ID` is set.

**Verify:** [`docs/testing.md` step 9](./testing.md#9-meta-pixel-fires)

---

## Step 7 — Listmonk ⏸️

Future scope per plan §17. Not in V1.

Trigger to revisit: when the first creator newsletter or finalist email blast is needed.

---

## Full first-deploy checklist

- [ ] Supabase project created
- [ ] All 4 migrations + seed.sql executed
- [ ] Netlify env vars set (7 required)
- [ ] "Clear cache and deploy" triggered on Netlify
- [ ] Test webhook with curl (returns 200)
- [ ] ManyChat trigger keyword set to `worldcup`
- [ ] ManyChat DM flow built + webhook node configured
- [ ] Test entry walked end-to-end from IG comment → admin dashboard
- [ ] Meta Pixel ID set + verified in browser DevTools
- [ ] Public page renders correctly (Current system card, Event schema, WORLDCUP keyword)
- [ ] Admin dashboard accessible at `/admin/challenges/` with basic auth

Once these are green: announce the challenge on Instagram and go live.

---

## Day-2 follow-ups

- [ ] n8n VPS provisioned, 3 workflows imported, env URLs pointed
- [ ] Notion DBs created + n8n credentials linked
- [ ] Meta Pixel custom audiences built in Meta Ads Manager
- [ ] First weekly stats snapshot from `admin/api/entries/export` saved to Drive
- [ ] Listmonk decision: build now or wait until first email need

---

## Where to ask for help

- **Webhook 401s** — check `MANYCHAT_WEBHOOK_SECRET` matches in both Netlify and ManyChat
- **Empty challenge page** — Supabase migrations may not have run; verify with the curl in `testing.md` step 1
- **Admin pages not protected** — Edge function needs both `ADMIN_USERNAME` and `ADMIN_PASSWORD` env vars set in Netlify
- **Pixel not firing** — env var name must be `PUBLIC_META_PIXEL_ID` (with `PUBLIC_` prefix) to reach the client
- **Notion sync silent** — n8n webhook URL might be wrong; check n8n's executions tab

For deeper docs:
- `docs/ai-challenge-platform.md` — platform overview
- `docs/manychat-flow.md` — ManyChat detailed flow
- `docs/n8n-setup.md` — n8n workflows + hosting
- `docs/notion-setup.md` — Notion schemas
- `docs/netlify-env.md` — env var reference
- `docs/testing.md` — QA scripts
