# Paper Moon

Paper Moon is a small, unlisted web object at `/pm/`. A maker chooses a memorable moon name, sets a Mooncrumb, leaves the first trace, and shares the clean moon link personally. Someone with the link and Mooncrumb can unfold it and leave text, links, or a light photo.

It has no feed, discovery, account system, contact upload, analytics, or installation promotion.

## PWA Behavior

The app includes a scoped manifest, home-screen icons, and a service worker. The service worker caches only the static Paper Moon shell and visual assets. It does not cache Netlify Function calls, moon documents, stored traces, or signed photo responses.

The app never displays an installation banner. Someone may add it from their browser menu.

## Sharing

The share controls use the Web Share API when the browser supports it and fall back to copying the clean URL:

```txt
https://ashmo.io/pm/paper-moon/
```

The Mooncrumb is never included in the URL or shown again after creation. Makers should share it separately.

## Protection Model

- The browser communicates only with same-origin Netlify Functions.
- Netlify Functions use the Supabase service role; browsers receive no Supabase credentials.
- Row Level Security is enabled on every Paper Moon table, with no anonymous policies.
- Mooncrumbs are normalized and stored only as bcrypt hashes with a unique salt.
- Successful access creates a signed, HTTP-only, same-site cookie valid for 30 minutes.
- Creation stores a random maker capability locally so the maker can regain maker-only removal after entering the Mooncrumb again. It never appears in the URL and contains no trace content.
- Trace bodies are encrypted with AES-256-GCM before database storage.
- Photos live in the non-public `pm-pieces` bucket and are returned with five-minute signed URLs.
- Expired and removed moons cannot be read or changed.
- Paper Moon routes are excluded from analytics, metadata graphs, the sitemap, and search indexing.

Paper Moon keeps pages unlisted and away from search engines. It protects stored content behind the scenes and automatically removes old moons based on the selected duration. It cannot stop someone who has the link and Mooncrumb from copying, screenshotting, forwarding, or saving what they see.

## What Is Not Guaranteed

The Mooncrumb is a lightweight shared-access control, not proof of identity. Anyone who receives both the clean link and Mooncrumb can view the moon until the cookie or moon expires. Browser screenshots, copying, forwarding, compromised devices, and deliberate photography of a screen cannot be prevented.

The deterministic safety filter blocks common obvious abuse and spam patterns without sending personal content to a third-party moderation service. It reduces risk but cannot perfectly understand every language, euphemism, image, or harmful context.

## Supabase Setup

1. Link the repository to the intended Supabase project.
2. Apply `supabase/migrations/202606140001_paper_moon.sql`.
3. Confirm these tables exist:
   - `pm_moons`
   - `pm_traces`
   - `pm_events`
4. Confirm the private `pm-pieces` Storage bucket has a 1 MB limit and allows JPEG, PNG, and WebP.
5. Confirm RLS is enabled and no anonymous policies exist on the three tables.

The migration adds:

- indexes for slug lookup, expiry cleanup, and trace ordering
- `pm_expired_photo_paths()` for locating old private objects
- `pm_delete_expired_rows()` for deleting old database rows after objects are removed

## Environment Variables

Set these in Netlify:

```txt
SUPABASE_URL
SUPABASE_SERVICE_ROLE_KEY
PM_CONTENT_ENCRYPTION_KEY
PM_SESSION_SECRET
PM_CLEANUP_SECRET
```

Generate values locally:

```sh
openssl rand -base64 32
openssl rand -hex 48
openssl rand -hex 32
```

Use the first output for `PM_CONTENT_ENCRYPTION_KEY`, the second for `PM_SESSION_SECRET`, and the third for `PM_CLEANUP_SECRET`. Do not rotate the content key while live traces still exist because old ciphertext would become unreadable.

## Cleanup

Call the cleanup endpoint daily from a Netlify Scheduled Function, Supabase Cron webhook, or another trusted scheduler:

```txt
POST /api/pm/cleanup
X-PM-Cleanup-Secret: <PM_CLEANUP_SECRET>
```

The cleanup operation deletes expired or removed photo objects first, then deletes the associated moon rows. It does not retain IP addresses or browser identifiers.

## Safety Rules

The server checks every text trace and caption before persistence. It rejects obvious:

- illegal or harmful instructions
- threats and violent targeting
- harassment and hate
- blackmail and exploitation
- sexual exploitation
- doxxing and another person’s identifying details
- repeated abusive posting
- link spam

Rejected content is not saved.

Images are compressed in the browser, capped at 1 MB on the server, checked by byte signature, and limited to JPEG, PNG, or WebP. The first release does not perform semantic image moderation, so the maker remains responsible for removing a moon if an inappropriate image appears.

## Verification And Deployment

```sh
npm run test:pm
npm run lint
npm run build
netlify deploy
netlify deploy --prod
```

After deployment verify:

- `/pm/` returns `X-Robots-Tag: noindex, nofollow, noarchive, nosnippet`
- `/manifest.webmanifest` and `/pm/sw.js` load
- an arbitrary clean slug renders the Mooncrumb shell
- creation sets a creator cookie without redisplaying the Mooncrumb
- a wrong Mooncrumb receives the generic failure
- correct access lasts 30 minutes
- text, links, and a compressed photo can be left
- Fold Away clears access
- only the maker can remove the moon
- expired or removed moons show the correct state
