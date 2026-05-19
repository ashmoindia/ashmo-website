# Notion Setup — AI Challenge Platform

Four databases live in Notion. They're the operational mirror of Supabase — Supabase is the source of truth, Notion is where the team does day-to-day review. The n8n workflows keep them in sync.

**Parent page:** [Ashmo OS v2](https://www.notion.so/Ashmo-OS-v2-32799c0d6e4980b29479d0396dd09509)

---

## 0. Grant the Claude integration access (one-time)

If you want Claude (or any other connected agent) to create / read / write these DBs directly, share `Ashmo OS v2`:

1. Open the page in Notion
2. Top-right `Share` button
3. Search "Claude" (or whichever integration you use)
4. Set permission to `Can edit`
5. Done — child databases inherit access

Until this is done, the databases must be created manually using the schemas below.

---

## 1. Challenges DB

| Property | Type | Notes |
|---|---|---|
| Challenge Name | Title | e.g. "AI World Cup Poster Challenge" |
| Slug | Text | matches `challenges.slug` in Supabase |
| Status | Select | Draft (gray) / Active (green) / Closed (orange) / Archived (brown) |
| Start Date | Date | |
| End Date | Date | |
| Prize | Text | |
| Keyword | Text | e.g. WORLDCUP — matches ManyChat trigger |
| Hashtag | Text | e.g. #AshmoAIChallenge |
| Total Entries | Rollup | count of related Entries |
| Finalists | Rollup | count of Entries where Status = Finalist or Winner |
| Winner | Relation | → Winners DB |
| Supabase ID | Text | UUID from `challenges.id` (used by n8n to upsert) |
| Notes | Text | |

---

## 2. Participants DB

| Property | Type | Notes |
|---|---|---|
| Name | Title | participant's display name |
| Instagram Username | Text | **unique key** — n8n uses this to upsert |
| Email | Email | optional |
| Phone | Phone | optional |
| ManyChat Contact ID | Text | from webhook payload |
| Challenges Joined | Rollup | count of related Entries |
| Wins | Rollup | count of related Winners |
| First Seen | Date | created date |
| Notes | Text | |
| Supabase ID | Text | UUID from `participants.id` |

---

## 3. Entries DB

| Property | Type | Notes |
|---|---|---|
| Entry ID | Title | e.g. "Maya Noor — WorldCup Poster" |
| Challenge | Relation | → Challenges DB |
| Participant | Relation | → Participants DB |
| Entry URL | URL | Instagram post or reel link |
| Submission Type | Select | post (green) / reel (purple) / upload (orange) |
| Status | Select | New (gray) / Approved (blue) / Rejected (red) / Shortlisted (yellow) / Finalist (orange) / Winner (green) |
| Score | Number | 0–100 |
| AI Tools Used | Multi-Select | one chip per tool (Midjourney, ChatGPT, Photoshop, Firefly, Runway, etc.) |
| Caption | Text | |
| Admin Notes | Text | internal moderation notes |
| Submitted Date | Date | from `entries.created_at` |
| Supabase ID | Text | UUID from `entries.id` |

---

## 4. Winners DB

| Property | Type | Notes |
|---|---|---|
| Title | Title | "AI World Cup Poster — Sara V." |
| Challenge | Relation | → Challenges DB |
| Participant | Relation | → Participants DB |
| Winning Entry URL | URL | |
| Score | Number | |
| Announcement Status | Select | Pending / Announced / Featured |
| Announced At | Date | |
| Notes | Text | |

---

## 5. Connecting to n8n

Once the four DBs exist, in n8n credential manager:

1. **Notion → Internal Integration Token**: create an integration at https://www.notion.so/profile/integrations, share each DB with that integration
2. Use the integration token in n8n's "Notion" credential
3. In each workflow node, paste the matching database ID (visible in the URL after the workspace slug)

---

## 6. Once they're created, fill these into `.env.example`

When the DBs exist, copy each one's database ID and replace the placeholders in `.env.example`:

```
NOTION_CHALLENGES_DATABASE_ID=
NOTION_PARTICIPANTS_DATABASE_ID=
NOTION_ENTRIES_DATABASE_ID=
NOTION_WINNERS_DATABASE_ID=
```

> These are only needed if you ever bypass n8n and call Notion directly from Netlify Functions. For the standard architecture (Netlify → n8n → Notion), n8n holds the DB IDs in its own node configs and these env vars stay empty.
