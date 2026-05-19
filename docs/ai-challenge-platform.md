# AI Challenge Engagement Platform

This implementation keeps the platform intentionally thin:

- Astro renders public challenge pages and lightweight admin review screens.
- Netlify Functions receive ManyChat submissions.
- Supabase is the source of truth for challenges, participants, and entries.
- n8n receives optional downstream events for Notion sync, winner processing, and cleanup.

## Current Routes

- `/challenges/`
- `/challenges/[slug]/`
- `/challenges/[slug]/winners/`
- `/admin/challenges/`
- `/admin/challenges/[slug]/`
- `/admin/entries/`

The pages read from Supabase at build time when `SUPABASE_URL` plus either `SUPABASE_SERVICE_ROLE_KEY` or `SUPABASE_ANON_KEY` are available. If those variables are missing, they fall back to local seed data in `src/data/challenges.ts`.

The admin routes are marked `noindex` and protected on Netlify by `netlify/edge-functions/admin-auth.mjs`. Set `ADMIN_USERNAME` and `ADMIN_PASSWORD` in Netlify before deploying. The default username is `ashmo`.

## Admin Updates

The admin entries table can update entry status, score, and notes through:

```txt
PATCH /admin/api/entries/:id
```

Payload:

```json
{
  "status": "shortlisted",
  "score": 88,
  "admin_notes": "Strong candidate for finalist review."
}
```

The function writes to Supabase with the service role key and requires the same admin credentials used by the protected `/admin/*` routes.

Status changes also emit optional n8n events when `N8N_ADMIN_EVENT_WEBHOOK_URL` is configured:

- `challenge.entry.updated`
- `challenge.entry.finalist_selected`
- `challenge.entry.winner_selected`

## CSV Export

The admin entries board includes a CSV export button powered by:

```txt
GET /admin/api/entries/export
```

Optional filters:

```txt
GET /admin/api/entries/export?status=shortlisted
GET /admin/api/entries/export?challenge_id=<uuid>
```

## Webhook

Endpoint:

```txt
POST /.netlify/functions/manychat-webhook
```

Authentication options:

- `Authorization: Bearer MANYCHAT_WEBHOOK_SECRET`
- `x-manychat-webhook-secret: MANYCHAT_WEBHOOK_SECRET`
- `?secret=MANYCHAT_WEBHOOK_SECRET`

Minimum useful ManyChat payload:

```json
{
  "challenge_slug": "ai-world-cup-poster",
  "instagram_username": "creator.handle",
  "submission_url": "https://www.instagram.com/p/example/",
  "participant_name": "Creator Name",
  "email": "creator@example.com",
  "ai_tools_used": "Midjourney, Photoshop, ChatGPT",
  "caption": "Short entry note",
  "manychat_contact_id": "123456"
}
```

The webhook also accepts field names like `post_url`, `reel_url`, `instagram_post_url`, `keyword`, `challenge_id`, and nested ManyChat-style custom fields.

## ManyChat API

`MANYCHAT_API_KEY` is the outbound ManyChat Public API key. It is different from `MANYCHAT_WEBHOOK_SECRET`, which protects inbound webhook requests.

The admin challenge board includes a ManyChat health check powered by:

```txt
GET /admin/api/manychat/health
```

It calls ManyChat's `/fb/page/getInfo` endpoint using `Authorization: Bearer MANYCHAT_API_KEY`.

Set this value in Netlify as a secret environment variable scoped to Functions/runtime. Do not commit the key to the repository.

## Supabase Setup

Run:

```sh
supabase db push
```

Or paste `supabase/migrations/001_ai_challenge_platform.sql` into the Supabase SQL editor.

Then seed the first active challenge:

```sh
supabase db seed
```

Or paste `supabase/seed.sql` into the Supabase SQL editor.

Required tables:

- `challenges`
- `participants`
- `entries`

Storage buckets:

- `challenge-covers`
- `entry-media`
- `winner-assets`

## Environment Variables

Copy `.env.example` into the Netlify environment settings and local `.env` as needed.

Required for the webhook:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `MANYCHAT_WEBHOOK_SECRET`

Required for ManyChat API checks:

- `MANYCHAT_API_KEY`

Required for admin:

- `ADMIN_PASSWORD`

Optional for admin:

- `ADMIN_USERNAME`

Optional:

- `N8N_SUBMISSION_WEBHOOK_URL`
- `N8N_ADMIN_EVENT_WEBHOOK_URL`
- `NOTION_API_KEY`
- `NOTION_DATABASE_ID`
- `META_PIXEL_ID`

## Next Build Steps

1. Seed the first live challenge into Supabase.
2. Run the ManyChat webhook against the live Netlify endpoint.
3. Add n8n workflows for Notion sync and creator history updates.
4. Add Meta Pixel and analytics once the first live challenge URL is final.
5. Add Listmonk capture once the first creator newsletter flow is ready.
