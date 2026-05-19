# Testing — AI Challenge Platform

Sanity tests for each layer of the stack. Run these after any env var change or migration.

---

## 1. Supabase connection

```bash
curl -sS "$SUPABASE_URL/rest/v1/challenges?select=slug,instagram_keyword,status&limit=5" \
  -H "apikey: $SUPABASE_ANON_KEY" \
  -H "Authorization: Bearer $SUPABASE_ANON_KEY"
```

**Expected:** JSON array with at least the AI World Cup Poster Challenge row, status `active`, keyword `WORLDCUP`.

**If empty:** seed.sql hasn't been run. Open Supabase SQL Editor → paste `supabase/seed.sql` → Run.

**If 401:** anon key is wrong or RLS is blocking. Check policies in `001_ai_challenge_platform.sql`.

---

## 2. Webhook secret validation

Webhook without the secret should return 401:

```bash
curl -X POST https://ashmo.io/.netlify/functions/manychat-webhook \
  -H "Content-Type: application/json" \
  -d '{"challenge_slug":"ai-world-cup-poster"}' \
  -w "\nHTTP %{http_code}\n"
```

**Expected:** `HTTP 401` + `{"ok":false,"error":"Unauthorized webhook request."}`

Webhook without the env var set returns 503:

```bash
# Same call after temporarily unsetting MANYCHAT_WEBHOOK_SECRET in Netlify
```

**Expected:** `HTTP 503` + `{"ok":false,"error":"Missing MANYCHAT_WEBHOOK_SECRET environment variable."}`

---

## 3. Sample ManyChat payload (happy path)

```bash
curl -X POST https://ashmo.io/.netlify/functions/manychat-webhook \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $MANYCHAT_WEBHOOK_SECRET" \
  -d '{
    "challenge_slug": "ai-world-cup-poster",
    "participant_name": "Test User",
    "instagram_username": "testuser.qa",
    "submission_url": "https://www.instagram.com/p/AAAAAAAAAAA/",
    "ai_tools_used": "Midjourney, Photoshop",
    "caption": "Test entry from QA",
    "manychat_contact_id": "mc_test_001"
  }' \
  -w "\nHTTP %{http_code}\n"
```

**Expected:** `HTTP 200` + JSON with `ok: true`, `challenge.slug: "ai-world-cup-poster"`, `entry_id`, `participant_id`, `status: "new"`.

---

## 4. Duplicate prevention

Run step 3 a second time with the same payload. The entries table has `unique (challenge_id, participant_id)` so this should NOT create a duplicate row — it merges via `Prefer: resolution=merge-duplicates`.

**Expected:** `HTTP 200` and the same `entry_id` returned.

Now change `submission_url` to a different URL:

```bash
# Same as step 3 but with submission_url=https://www.instagram.com/p/BBBBBBBBBBB/
```

**Expected:** `HTTP 200`, same `participant_id` (existing creator), entry updated to new URL.

---

## 5. Bad submission URL rejected

```bash
curl -X POST https://ashmo.io/.netlify/functions/manychat-webhook \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $MANYCHAT_WEBHOOK_SECRET" \
  -d '{
    "challenge_slug": "ai-world-cup-poster",
    "instagram_username": "testuser.qa",
    "submission_url": "https://example.com/not-instagram"
  }' \
  -w "\nHTTP %{http_code}\n"
```

**Expected:** `HTTP 400` + `{"ok":false,"error":"A valid public Instagram post or reel URL is required."}`

---

## 6. Admin status update

```bash
# Replace <entry-uuid> with one returned from step 3
curl -X PATCH https://ashmo.io/admin/api/entries/<entry-uuid> \
  -u "$ADMIN_USERNAME:$ADMIN_PASSWORD" \
  -H "Content-Type: application/json" \
  -d '{"status":"shortlisted","score":78,"admin_notes":"QA test promotion"}' \
  -w "\nHTTP %{http_code}\n"
```

**Expected:** `HTTP 200`, response includes the updated row with new status.

Verify in Supabase:
```sql
select status, score, admin_notes from public.entries
  where id = '<entry-uuid>';

select * from public.entry_status_logs
  where entry_id = '<entry-uuid>'
  order by created_at desc;
```

The status log table should now contain at least two rows: `null → new` (from insert) and `new → shortlisted` (from update).

---

## 7. CSV export

```bash
curl -sS https://ashmo.io/admin/api/entries/export \
  -u "$ADMIN_USERNAME:$ADMIN_PASSWORD" \
  -o entries.csv

head -3 entries.csv
```

**Expected:** CSV with header row, at least one entry row.

Filtered:
```bash
curl -sS "https://ashmo.io/admin/api/entries/export?status=shortlisted" \
  -u "$ADMIN_USERNAME:$ADMIN_PASSWORD" \
  -o entries-shortlisted.csv
```

---

## 8. Public challenge page renders

```bash
curl -sS https://ashmo.io/challenges/ai-world-cup-poster/ | grep -oE '<title>[^<]+|Current system|WORLDCUP|@type":"Event"'
```

**Expected:**
- `<title>AI World Cup Poster Challenge — Ashraf Hassan`
- `Current system` (flow strip card present)
- `WORLDCUP` (instructions reference the correct keyword)
- `@type":"Event"` (Event schema present in JSON-LD)

---

## 9. Meta Pixel fires

After setting `PUBLIC_META_PIXEL_ID`:

1. Visit `https://ashmo.io/challenges/ai-world-cup-poster/`
2. Open browser DevTools → Network tab → filter `facebook.net` or `tr?id=`
3. Should see a request to `connect.facebook.net/en_US/fbevents.js`
4. Should see a request to `facebook.com/tr?id=<YOUR_PIXEL_ID>&ev=PageView`

Verify in Meta Events Manager: real-time test events should show the PageView within ~1 minute.

---

## 10. n8n round-trip (once n8n is live)

After Workflow 1 is built and the env var is pointed at it, repeat step 3. Then check:

1. **n8n executions tab** → most recent execution should be "Success"
2. **Notion → Entries DB** → row exists for `testuser.qa`
3. **Notion → Participants DB** → row exists, "Challenges Joined" rollup = 1

If n8n is unreachable, the Netlify webhook should still return 200 — the n8n call is fire-and-forget via `context.waitUntil()`. Check Netlify function logs for any "n8n notification failed" entries.

---

## Quick health-check script

Save as `scripts/qa-challenge.sh`:

```bash
#!/usr/bin/env bash
set -euo pipefail

DOMAIN=${DOMAIN:-https://ashmo.io}

echo "==> 1. Public page loads"
curl -sS -o /dev/null -w "  %{http_code} %{url_effective}\n" $DOMAIN/challenges/ai-world-cup-poster/

echo "==> 2. Webhook auth gate"
curl -sS -o /dev/null -w "  %{http_code} expects 401\n" -X POST $DOMAIN/.netlify/functions/manychat-webhook -H "Content-Type: application/json" -d '{}'

echo "==> 3. Admin gate"
curl -sS -o /dev/null -w "  %{http_code} expects 401\n" $DOMAIN/admin/challenges/

echo "==> 4. Sitemap includes challenge"
curl -sS $DOMAIN/sitemap.xml | grep -c "challenges/ai-world-cup-poster"
```

Run before every deploy.
