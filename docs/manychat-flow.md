# ManyChat Flow Setup — AI Challenge Platform

ManyChat is intentionally **thin**: it detects an Instagram comment, opens a DM, collects 3–5 fields, sends a webhook, done. Long-term data lives in Supabase + Notion, not in ManyChat.

---

## 1. Trigger

**Comment keyword on the challenge Instagram post:** `worldcup` (case-insensitive).

The webhook auto-uppercases the keyword on receipt, so users typing `WORLDCUP`, `WorldCup`, `worldcup` all match. The challenge row in Supabase has `instagram_keyword = 'WORLDCUP'`.

ManyChat setup:
1. **Automation → Instagram → New Automation → Comment Reply**
2. Source: the announcement post for the AI World Cup Poster Challenge
3. Keyword: `worldcup`
4. Public comment reply: "Sent you a DM — let's get you in." (keep it short, just enough to nudge users to check their DM)
5. Action: trigger DM flow `Challenge / WorldCup / DM Capture`

---

## 2. DM Capture Flow

Build under **Automation → Flows → New Flow → DM Capture**.

```
[Start: triggered from comment]
  → [Send] "Welcome 👋 You're in for the AI World Cup Poster Challenge.
            I just need 3 quick things to register your entry."
  → [User Input: Text]   "What's your name?"            → store as {{name}}
  → [User Input: Text]   "Your Instagram handle?
                           (e.g. @yourhandle)"          → store as {{instagram_username}}
  → [User Input: Text]   "Paste the link to your public
                           Instagram post or reel."     → store as {{submission_url}}
  → [User Input: Text]   "Which AI tools did you use?
                           (e.g. Midjourney, Photoshop, ChatGPT)" → store as {{ai_tools_used}}
  → [Optional Input: Email] "Your email (optional — for finalist
                              notification)"            → store as {{email}}
  → [External Request: POST to webhook] (see below)
  → [Send] "Got it! Your entry is in the dashboard.
            We review every entry and feature shortlisted work
            at https://ashmo.io/challenges/ai-world-cup-poster/
            Keep your post public until winners are announced."
```

---

## 3. External Request (the webhook to our system)

**URL:** `https://ashmo.io/.netlify/functions/manychat-webhook`

**Method:** `POST`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer {{MANYCHAT_WEBHOOK_SECRET}}
```

> `MANYCHAT_WEBHOOK_SECRET` is the same string set in Netlify env vars. Generate a strong random one (e.g. `openssl rand -hex 32`) and paste it into both Netlify and ManyChat.

**Body (JSON):**
```json
{
  "challenge_slug": "ai-world-cup-poster",
  "participant_name": "{{name}}",
  "instagram_username": "{{instagram_username}}",
  "submission_url": "{{submission_url}}",
  "ai_tools_used": "{{ai_tools_used}}",
  "email": "{{email}}",
  "manychat_contact_id": "{{user_id}}"
}
```

> ManyChat's variable for the subscriber's ID is usually `{{user_id}}` or `{{contact_id}}` depending on flow context. Check ManyChat's variable picker.

---

## 4. Error handling in the flow

After the External Request node, add a **Condition** check on the response:

| Response | Reply to user |
|---|---|
| 200 OK | Confirmation message (above) |
| 400 (bad URL) | "That doesn't look like a valid Instagram post URL — make sure it starts with `https://www.instagram.com/p/` or `/reel/`. Send the link again?" → loop back to URL capture |
| 401 (auth) | "Something's broken on our side. We'll fix it and re-run your entry — try again in a few minutes." → flag for manual review |
| 404 (challenge not found) | "Challenge is not open right now. Stay tuned for the next one." |
| 5xx | "Brief blip on our end — retrying." → wait 30s → resend webhook once |

---

## 5. What ManyChat must NOT do

Per plan §6 ("keep ManyChat thin"):

- ❌ Don't use ManyChat as the long-term subscriber store. The cleanup workflow in n8n archives contacts 90 days after last interaction.
- ❌ Don't use ManyChat as the email broadcast system. Listmonk will handle that later.
- ❌ Don't store challenge entries inside ManyChat's CRM panel — everything goes to Supabase via webhook.
- ❌ Don't add manual moderation steps inside ManyChat. Moderation lives in the website admin dashboard.

---

## 6. Testing the flow end-to-end

1. Set ManyChat keyword + flow as above.
2. From a test Instagram account, comment `worldcup` on the announcement post.
3. DM should arrive within a few seconds.
4. Walk through the 4 prompts using a known-good Instagram post URL.
5. After the External Request fires, check:
   - `https://ashmo.io/admin/challenges/ai-world-cup-poster/` → entry should appear in "New" column
   - Supabase Studio → `entries` table has the row
   - If n8n is running: Notion → Entries DB has the row
6. From the admin dashboard, mark the test entry as "Approved" → it should appear on the public challenge page within ~15s (after the next Astro build) or instantly if the page is using runtime fetch.

---

## 7. Future challenges

For each new challenge:

1. Create the challenge row in Supabase (via admin UI or SQL insert) with a unique `instagram_keyword`.
2. Duplicate the DM Capture flow in ManyChat, change the keyword + intro text.
3. Update the Comment Reply automation to point at the new IG post.

The webhook itself doesn't need changes — it resolves the challenge by keyword OR slug OR id, so any new keyword in Supabase will match automatically.
