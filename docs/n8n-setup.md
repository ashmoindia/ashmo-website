# n8n Setup — AI Challenge Platform

n8n is the automation layer between Supabase, Notion, and ManyChat. The Netlify Functions in this repo already fire JSON events at two webhook URLs the moment something interesting happens. n8n's job is to receive those events and act on them.

This doc covers: hosting, env wiring, and the three required workflows.

---

## 1. Hosting

Pick one:

| Option | Cost | When to use |
|---|---|---|
| **Hetzner CX11 VPS + n8n Docker** | ~€4.50/month | Production. Recommended. |
| **n8n Cloud Starter** | $20/month (5k executions) | Quick start, no DevOps overhead. |
| **Railway / Render free tier** | $0 | Testing only — workflows sleep when idle. |

### Hetzner Docker setup (one-time)

```bash
# On your Hetzner VPS:
mkdir -p ~/n8n && cd ~/n8n

cat > docker-compose.yml <<'EOF'
version: "3.8"
services:
  n8n:
    image: docker.n8n.io/n8nio/n8n
    restart: always
    ports:
      - "5678:5678"
    environment:
      - N8N_HOST=n8n.ashmo.io
      - WEBHOOK_URL=https://n8n.ashmo.io/
      - N8N_PROTOCOL=https
      - N8N_BASIC_AUTH_ACTIVE=true
      - N8N_BASIC_AUTH_USER=ashmo
      - N8N_BASIC_AUTH_PASSWORD=<set-a-strong-one>
      - GENERIC_TIMEZONE=Asia/Dubai
    volumes:
      - ./data:/home/node/.n8n
EOF

docker compose up -d
```

Point a Cloudflare-proxied subdomain `n8n.ashmo.io` at the VPS, terminate TLS at Cloudflare (Flexible mode is fine for n8n).

---

## 2. Env vars (Netlify)

Once n8n is reachable, set in Netlify:

```
N8N_SUBMISSION_WEBHOOK_URL=https://n8n.ashmo.io/webhook/challenge-submission
N8N_ADMIN_EVENT_WEBHOOK_URL=https://n8n.ashmo.io/webhook/challenge-admin-event
```

The Netlify Functions emit fire-and-forget POST requests to these URLs. If a URL is unset, the event is silently skipped — non-fatal.

Inside n8n you'll also need credentials for:
- **Supabase** (service-role key, project URL)
- **Notion** (integration token)
- **ManyChat** (Public API key — same one as `MANYCHAT_API_KEY` in Netlify)

---

## 3. Workflow 1 — Submission Sync

**Trigger:** Webhook node, path `challenge-submission`, method `POST`.

**Incoming payload shape** (from `netlify/functions/manychat-webhook.mjs`):

```json
{
  "event": "challenge.entry.created",
  "challenge": { "id": "uuid", "slug": "ai-world-cup-poster", "title": "...", "status": "active", "instagram_keyword": "WORLDCUP" },
  "participant": { "id": "uuid", "name": "...", "instagram_username": "...", "email": null, "manychat_contact_id": "..." },
  "entry": { "id": "uuid", "submission_url": "...", "submission_type": "post", "ai_tools_used": [...], "status": "new" },
  "sent_at": "2026-..."
}
```

**Node graph:**

```
[Webhook: challenge-submission]
  → [Set: extract participant + entry fields]
  → [Notion: Search Participants DB by instagram_username]
  → [IF found]
    ├─ true  → [Notion: Update participant page, increment "Challenges Joined"]
    └─ false → [Notion: Create new Participant page]
  → [Notion: Create Entry page in Entries DB, linked to participant + challenge]
  → [Supabase: PATCH participants/<id> SET notion_page_id = {{participant.id}}]
  → [Supabase: PATCH entries/<id> SET notion_page_id = {{entry.id}}]
  → [Slack/Email: optional notification "New entry from @username"]
```

**Notion field mapping (Participants):**
- Name → participant.name (or instagram_username as fallback)
- Instagram Username → participant.instagram_username (unique key)
- Email → participant.email
- ManyChat Contact ID → participant.manychat_contact_id
- Number of Challenges Joined → relation count

**Notion field mapping (Entries):**
- Challenge → relation to Challenges DB (lookup by slug)
- Participant → relation to Participants DB
- Entry URL → entry.submission_url
- Submission Type → entry.submission_type (post / reel / upload)
- Status → entry.status
- AI Tool Used → entry.ai_tools_used.join(', ')
- Submitted Date → sent_at

---

## 4. Workflow 2 — Winner / Status Sync

**Trigger:** Webhook node, path `challenge-admin-event`, method `POST`.

**Incoming payload** (from `netlify/functions/admin-entry.mjs`):

```json
{
  "event": "challenge.entry.winner_selected" | "challenge.entry.finalist_selected" | "challenge.entry.updated",
  "entry": { ...full entry row... },
  "updates": { "status": "winner", "score": 94, ... },
  "sent_at": "2026-..."
}
```

**Node graph:**

```
[Webhook: challenge-admin-event]
  → [Switch on event]
      ├─ winner_selected   → [Notion: Add to Winners DB]
      │                    → [Notion: Update participant 'Wins' counter]
      │                    → [Notion: Update entry status field]
      ├─ finalist_selected → [Notion: Update entry status = Finalist]
      │                    → [Notion: Update challenge 'Finalists' count]
      └─ updated           → [Notion: Sync entry status + score + admin notes]
```

**Notion field mapping (Winners):**
- Challenge → relation to Challenges DB
- Participant → relation to Participants DB
- Winning Entry URL → entry.submission_url
- Score → entry.score
- Announcement Status → static "Pending" on insert
- Notes → entry.admin_notes

---

## 5. Workflow 3 — Monthly ManyChat Cleanup

**Trigger:** Cron node, "0 9 1 * *" (1st of every month, 09:00 Dubai).

**Goal:** prevent ManyChat subscriber count from growing past the cheapest pricing tier.

```
[Cron monthly]
  → [ManyChat API: GET /fb/subscribers/findByCustomField] (or list_all)
  → [Filter: last_interaction > 90 days AND status != 'active_in_challenge']
  → [Supabase: SELECT * FROM participants WHERE manychat_contact_id IN (...)]
  → [Verify each contact already exists in Supabase (data is safe to lose from ManyChat)]
  → [ManyChat API: POST /subscribers/removeSubscriber for each]
  → [Slack: post "Archived N subscribers" summary]
```

ManyChat Public API docs: <https://api.manychat.com/swagger>. Endpoint to delete a subscriber: `POST /fb/subscribers/removeSubscriber` with `subscriber_id` in body.

---

## 6. Testing each workflow

After importing, test each webhook locally before pointing Netlify at it:

```bash
# Test Workflow 1
curl -X POST https://n8n.ashmo.io/webhook/challenge-submission \
  -H "Content-Type: application/json" \
  -d '{
    "event": "challenge.entry.created",
    "challenge": {"id":"00000000-0000-0000-0000-000000000001","slug":"ai-world-cup-poster","title":"AI World Cup Poster Challenge","status":"active"},
    "participant": {"id":"00000000-0000-0000-0000-000000000002","name":"Test","instagram_username":"test.handle"},
    "entry": {"id":"00000000-0000-0000-0000-000000000003","submission_url":"https://www.instagram.com/p/test/","submission_type":"post","ai_tools_used":["Midjourney"],"status":"new"},
    "sent_at":"2026-05-19T12:00:00Z"
  }'

# Test Workflow 2
curl -X POST https://n8n.ashmo.io/webhook/challenge-admin-event \
  -H "Content-Type: application/json" \
  -d '{
    "event": "challenge.entry.winner_selected",
    "entry": {"id":"00000000-0000-0000-0000-000000000003","submission_url":"https://www.instagram.com/p/test/","score":94},
    "updates": {"status":"winner","score":94},
    "sent_at":"2026-05-19T12:00:00Z"
  }'
```

When both return 200 and the Notion DBs reflect the changes, set the Netlify env vars and the live flow is wired.

---

## 7. Failure modes to watch

| Symptom | Cause | Fix |
|---|---|---|
| Webhook returns 200 but Notion row not created | Wrong DB ID in n8n node, or integration not invited to DB | Re-share the Notion DB with the Ashmo integration |
| Duplicate participant rows in Notion | "Search before create" step missing the IF branch | Ensure Workflow 1 always searches by instagram_username first |
| ManyChat cleanup deletes active subscribers | Filter missing | Always verify last_interaction timestamp and Supabase backup before delete |
| Webhook hangs / Netlify Function timeouts | n8n VPS down or DNS broken | Netlify function uses `context.waitUntil()` so submission still succeeds; n8n event is lost. Set up uptime monitor for n8n.ashmo.io. |
