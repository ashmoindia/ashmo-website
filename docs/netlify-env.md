# Netlify Environment Variables — AI Challenge Platform

All env vars live in **Netlify → Site configuration → Environment variables**. Mark every sensitive value as a "secret" so it's never exposed in build logs.

---

## Required for V1 launch

| Variable | Required by | How to get it |
|---|---|---|
| `SUPABASE_URL` | Webhook + build-time fetch + admin functions | Supabase project → Settings → API → Project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-side only (webhook + admin) | Supabase project → Settings → API → `service_role` key. **NEVER** expose in client code. |
| `SUPABASE_ANON_KEY` | Fallback for public read paths | Same page, `anon` key |
| `MANYCHAT_WEBHOOK_SECRET` | ManyChat webhook auth | Generate: `openssl rand -hex 32`. Set the same string in ManyChat's webhook node. |
| `MANYCHAT_API_KEY` | Optional — health check + cleanup automation | ManyChat → Settings → API → Public API key |
| `ADMIN_USERNAME` | Edge function basic auth gate | Pick one (default: `ashmo`) |
| `ADMIN_PASSWORD` | Edge function basic auth gate | Generate strong: `openssl rand -base64 24` |
| `PUBLIC_META_PIXEL_ID` | Pixel snippet on `/challenges/*` | Meta Events Manager → Data sources → Pixel ID |

---

## Optional but recommended

| Variable | When you need it |
|---|---|
| `META_PIXEL_ID` | Fallback if you forget the `PUBLIC_` prefix; same value as above |
| `N8N_SUBMISSION_WEBHOOK_URL` | Set once n8n is running and Workflow 1 (Submission Sync) is built |
| `N8N_ADMIN_EVENT_WEBHOOK_URL` | Set once n8n Workflow 2 (Winner / Status Sync) is built |
| `NOTION_API_KEY` | Only if a Netlify Function calls Notion directly (not needed for the standard via-n8n flow) |
| `NOTION_CHALLENGES_DATABASE_ID` / `_PARTICIPANTS_` / `_ENTRIES_` / `_WINNERS_` | Same — only if direct |

---

## Existing site env (already set, do not touch)

| Variable | Purpose |
|---|---|
| `RESEND_API_KEY` | Contact + newsletter auto-reply emails |
| `SOCIAL_POSTING_SECRET` | Existing social poster integration |
| `PUBLIC_PLAUSIBLE_DOMAIN` / `PUBLIC_POSTHOG_KEY` / `PUBLIC_POSTHOG_HOST` | Analytics — leave if already in use |

---

## Setup order

1. **First** — Supabase URL + service-role key. Without these, no page can read from the DB at build time.
2. **Second** — `MANYCHAT_WEBHOOK_SECRET`. Without this, the webhook returns 503.
3. **Third** — `ADMIN_USERNAME` + `ADMIN_PASSWORD`. Without these, `/admin/*` is fully open (edge function falls back to deny).
4. **Fourth** — `PUBLIC_META_PIXEL_ID`. Without this, no pixel fires (no error, just no tracking).
5. **Once n8n is live** — both `N8N_*` URLs. Without these, downstream automations are silently skipped (no error).

After setting vars, **trigger a redeploy** (Netlify caches env into the build). One-click in Deploys → Trigger deploy → Clear cache and deploy site.

---

## How env vars are exposed

| Variable prefix | Where it's available |
|---|---|
| `PUBLIC_*` | Build-time **and** client-side (`import.meta.env.PUBLIC_*`) — exposed in browser bundles. Use only for non-secrets (Pixel ID, public domain). |
| No prefix | Build-time + Netlify Functions only. Safe for service-role keys, webhook secrets, admin passwords. |

The Meta Pixel ID is the only "public" env var the challenge platform uses. Everything else is server-side.
