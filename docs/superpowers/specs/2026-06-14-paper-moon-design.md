# Paper Moon Production Design

## Release Decision

Ship Paper Moon as a production-ready feature inside the existing Astro and Netlify site at `/pm/`. Netlify Functions are the only browser-facing data boundary. They use the Supabase service role to access private tables and storage, while Row Level Security denies direct anonymous access.

The first release includes text, links, one compressed photo per trace, expiry, deletion, clean URLs, Mooncrumb access, short-lived sessions, safety checks, PWA files, offline handling, and crawl prevention. It does not add accounts, discovery, analytics, installation prompts, contact access, notifications, or a public administration surface.

## Routes

- `/pm/` creates a moon and returns a clean share URL.
- `/pm/[moonSlug]/` renders only the access shell. No trace content appears in generated HTML or metadata.
- `/pm/offline/` is the static offline fallback.
- `/.netlify/functions/pm-*` provides creation, access, trace, upload, session, and removal operations.

## Trust Boundary

The browser never receives Supabase credentials and never talks directly to Supabase. Netlify Functions validate every request, enforce expiry and deletion, apply rate limits, run safety checks, encrypt trace bodies, and issue signed HTTP-only cookies.

Mooncrumbs are normalized by trimming, lowercasing, and collapsing spaces. The server stores a bcrypt hash with a per-moon salt and never logs submitted values. Successful access creates a signed, HTTP-only, secure, same-site cookie valid for 30 minutes. Creator sessions are issued after creation; visitor sessions are issued after Mooncrumb verification. `Fold Away` clears local session cookies.

Trace bodies are encrypted with AES-256-GCM before storage. The encryption key and cookie signing secret live only in Netlify environment variables. Photo objects are stored in the private `pm-pieces` bucket under unguessable paths and are returned through short-lived signed URLs.

## Data Model

The supplied `pm_moons`, `pm_traces`, and `pm_events` schema is retained with targeted additions for encrypted-body metadata and abuse controls. RLS is enabled on every table with no anonymous policies. A private storage bucket is created by migration.

Expired or removed moons are excluded from every read and write. A scheduled cleanup function removes expired photo objects and database rows. The SQL migration also includes a database cleanup function that can be scheduled with Supabase Cron when available.

## API Behavior

- Create validates slug uniqueness, Mooncrumb strength, duration, initial trace, and safety. It creates the moon atomically enough to clean up on failure and sets the creator session.
- Unfold returns the same visible failure for missing moons and incorrect Mooncrumbs. Repeated failures trigger a cooldown.
- Trace reads require a valid moon-scoped session and return decrypted content plus short-lived photo URLs.
- Trace writes require a valid session, pass safety and spam checks, enforce length and upload rules, then store encrypted content.
- Photo upload accepts only JPEG, PNG, or WebP after browser compression, verifies the byte signature server-side, and enforces a final 1 MB limit.
- Removal requires the creator session, marks the moon deleted, and removes associated photos.

## Safety

The initial safety layer is deterministic and self-contained to avoid sending personal content to third parties or adding API cost. It rejects common threat, harassment, hate, exploitation, doxxing, blackmail, harmful-instruction, and spam patterns; caps links and posting frequency; and never stores rejected content. The README makes clear that automated filtering reduces obvious abuse but cannot guarantee perfect moderation.

## Interface

Paper Moon has its own visual system and does not render the Ashmo site header, footer, fonts, analytics, or branding. The direction is a dark folded-paper nocturne: near-black navy, fog blue, restrained pale violet, off-white paper, subtle grain, and a softly animated moon form.

The creation page is a focused single-column object rather than a dashboard. The moon page begins with a centered Mooncrumb card, then becomes an asymmetrical trace field after access. Creator traces sit right and visitor traces sit left, but the composition avoids familiar chat chrome. Controls use the exact whimsical product vocabulary from the brief and exclude all forbidden user-facing terms.

## PWA And Privacy

The manifest, icons, service worker, and offline page are available without any install promotion. The service worker caches only the static Paper Moon shell and assets. API routes, dynamic moon pages, trace content, signed photo URLs, and non-GET requests are always network-only.

Every Paper Moon page emits `noindex,nofollow,noarchive,nosnippet`. Netlify adds the equivalent `X-Robots-Tag`; `robots.txt` disallows `/pm`; sitemap generation filters Paper Moon routes. Existing analytics components are not rendered on these pages.

## Verification

- Node tests cover normalization, slug validation, safety filtering, encryption round trips, signed sessions, expiry rules, and visible-copy restrictions.
- Surface tests verify required routes, manifest fields, service-worker cache exclusions, migration security, robots rules, and Netlify headers.
- `astro check` and the production build must pass.
- Browser QA covers creation, Mooncrumb failure and success, trace posting, photo validation, share and copy actions, Fold Away, removal, offline presentation, mobile layout, and keyboard behavior.
- A Netlify draft deploy is inspected before the production deployment.

