# TIP Trust Intelligence Platform Design

## Release Decision

Ship a static-first public MVP under `/tip/`. The existing ashmo.io stack is Astro, Tailwind CSS, Netlify, and repo-managed content, so the first release should preserve that operating model. TIP records live in a structured repo data module, product pages are statically generated, search filters the published product index in the browser, and submissions go to Netlify Forms for moderation.

Supabase-backed admin CRUD, private file storage, audit logs, and AI-assisted reports remain a second operational phase. The MVP does not expose user-submitted claims or uploaded files publicly.

## Public Routes

- `/tip/` - Trust Intelligence Platform hub
- `/tip/search/` - client-side product search
- `/tip/products/advion-cockroach-gel-bait/` - first OG Trace Report
- `/tip/submit/` - moderated Netlify product research form
- `/tip/checklist/` - educational buyer checklist
- `/tip/about/` - purpose and neutral-language policy
- `/tip/disclaimer/` - independent educational tool disclaimer and correction request

## Source Governance

Every published claim is represented by a source record with URL, publisher, source type, confidence, and access date. The Advion seed page uses official Syngenta Professional Pest Management sources:

- MENAF Advion Cockroach Gel Bait product page
- MENAF Agricultural Materials Company distributor page
- MENAF distributor directory
- Syngenta PPM current label page
- Syngenta PPM product overview

Agricultural Materials Company is presented as the UAE distributor reference for the Advion product because Syngenta's MENAF directory visibly associates it with the Advion cockroach portfolio. Al Mubarak Agro-Chemicals is not shown as an Advion-specific distributor in the MVP.

## Language Safety

TIP never certifies authenticity and never accuses a brand, seller, reseller, or marketplace. Public report states are:

- Official source found
- Distributor source found
- More proof needed
- Unable to verify
- Research pending

Every product page includes the full TIP disclaimer and a neutral OG statement. Risk signals describe missing evidence only.

## User Experience

The section follows ashmo.io's current dark editorial product language while tightening the information hierarchy around source tracing. The memorable element is a trace-led report: product identity, source trail, buyer checklist, and proof-needed signals appear as calm, structured evidence blocks rather than review-site warnings.

## SEO

The product page uses a canonical URL, Open Graph metadata, visual breadcrumbs with `BreadcrumbList`, visible FAQs with `FAQPage`, and a `WebPage` report schema. It intentionally does not add `Product` rich-result markup because TIP does not show an offer, price, or availability.

Schema Eligibility & Impact Index:

- Content-schema alignment: 25/25
- Rich result eligibility: 20/25
- Data completeness and accuracy: 18/20
- Technical correctness: 15/15
- Maintenance and sustainability: 10/10
- Spam and policy risk: 5/5
- Total: 93/100 - Strong Candidate

## Verification

- Run the Node TIP surface tests.
- Run `npm run lint`.
- Run `npm run build`.
- Inspect the hub, search, Advion report, and submission pages in the local browser at desktop and mobile widths.
- Deploy a Netlify draft, verify the draft URLs, then deploy production.

