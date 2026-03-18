# GEO Analysis — ashmo.io

**Date:** 2026-03-19
**Site:** https://ashmo.io
**Purpose:** Generative Engine Optimization — optimize for AI Overviews, ChatGPT, Perplexity citations

---

## GEO Readiness Score: 52/100

| Category | Score | Max | Notes |
|----------|-------|-----|-------|
| Citability | 9 | 25 | Narrative-first writing, no definition blocks, no stats |
| Structural Readability | 12 | 20 | Clean hierarchy, but no question headings, no tables, no FAQ |
| Multi-Modal Content | 8 | 15 | YouTube embed on homepage + podcast page, no article images |
| Authority & Brand Signals | 12 | 20 | Schema is strong, but near-zero external brand presence |
| Technical Accessibility | 11 | 20 | SSR perfect, crawlers mostly allowed, llms.txt exists |

---

## Platform Breakdown

| Platform | Score | Reasoning |
|----------|-------|-----------|
| **Google AI Overviews** | 55/100 | Strong technical SEO, schema, SSR. Weak on citability and question-based content. |
| **ChatGPT** | 35/100 | No Wikipedia, no Reddit, no YouTube presence. ChatGPT relies heavily on these. |
| **Perplexity** | 30/100 | No Reddit mentions, no community validation, no discussion threads. |

---

## AI Crawler Access Status

| Crawler | Status | Action Needed |
|---------|--------|---------------|
| GPTBot (OpenAI) | Allowed | None |
| OAI-SearchBot (OpenAI) | Not specified | **Add explicit Allow** |
| ChatGPT-User (OpenAI) | Not specified | **Add explicit Allow** |
| ClaudeBot (Anthropic) | Allowed | None |
| PerplexityBot | Not specified | **Add explicit Allow** |
| Google-Extended | Allowed | None |

---

## llms.txt Status

**Present** — well-structured with about, pillars, pages, social links.

**Improvements needed:**
- Add individual article URLs (not just section pages)
- Add `## Expertise` section with specific citation-worthy topics
- Add `## Contact` section

---

## Brand Mention Analysis

| Platform | Presence | Impact on AI Citations |
|----------|----------|----------------------|
| **Wikipedia** | NONE — no page for Ashmo, Ashraf Hassan, or FiLLi Cafe | Critical gap — Wikipedia is #1 source for ChatGPT (47.9% of citations) |
| **Reddit** | NONE — no mentions found | Critical gap — Reddit is #1 source for Perplexity (46.7%) |
| **YouTube** | Channel exists but minimal — @iamashmo, 1 podcast episode | YouTube mentions are strongest AI citation signal (0.737 correlation) |
| **LinkedIn** | Profile exists at /in/iamashmo/ | Moderate signal |
| **Facebook** | Active at /iamashmo/ | Low signal for AI citations |
| **Instagram** | Active at @iam_ashmo | Low signal for AI citations |

**Brand mention score: 15/100** — This is the single biggest gap.

---

## Passage-Level Citability Audit

### Article: "Why Brand Positioning Is the Hardest Thing"

**Citable passages found: 1**
- Blockquote: "The problem with most brand strategies is not the strategy. It's that nobody follows through past week two."

**Missing for citability:**
- No "What is brand positioning?" definition in first 60 words
- No statistics (e.g., "X% of startups fail due to poor positioning")
- No comparison table
- Zero question-based headings

### Article: "What a Grocery Shop at 19 Taught Me About Pricing"

**Citable passages found: 2**
- Blockquote: "I learned customer behaviour before analytics existed. The shop was my dashboard."
- Bullet list under "What Changes and What Doesn't" (5 clear principles)

**Missing for citability:**
- No "What is pricing psychology?" definition block
- No specific numbers or data points
- No question-based headings

### Article: "Patience Is Not Passive"

**Citable passages found: 1**
- Blockquote: "When opportunity comes, it feels sudden to the world. But to you — it feels inevitable."

**Missing for citability:**
- No definition block
- No data or research references
- No question-based headings

**Overall citability: LOW** — Content is beautifully written but optimized for human readers, not AI extraction. AI needs self-contained answer blocks with facts.

---

## Server-Side Rendering Check

**PASS** — Astro generates fully static HTML at build time. Zero JavaScript dependency for content. All AI crawlers can read 100% of content without JS execution.

---

## Top 10 Highest-Impact Changes (Ranked)

### Quick Wins (do now)

1. **Update robots.txt** — Add explicit Allow for PerplexityBot, OAI-SearchBot, ChatGPT-User
2. **Enhance llms.txt** — Add individual article URLs, expertise section
3. **Add question-based H2 headings** — "What is brand positioning?", "How does pricing psychology work?"
4. **Add definition blocks** — First 60 words of each article should contain a clear definition/answer
5. **Add specific statistics** — Reference real data (FiLLi outlet count, campaign numbers, years of experience)

### Medium Effort (this month)

6. **Start YouTube content** — Publish weekly; YouTube mentions are the #1 AI citation signal
7. **Write on Reddit** — Post founder insights in r/Entrepreneur, r/smallbusiness, r/branding — Reddit is Perplexity's top source
8. **Create comparison/data tables** in articles — AI loves structured data extraction
9. **Add FAQ sections** to key articles — matches query patterns directly
10. **Publish LinkedIn articles** (not just posts) — establishes entity authority

### High Impact (3-6 months)

11. **Get FiLLi Cafe on Wikipedia** — This is the single highest-leverage move for ChatGPT visibility. FiLLi is notable enough (70+ outlets, UAE cultural brand)
12. **Create original research** — "State of Cafe Branding in the UAE" type content = unique citability
13. **Build entity linking** — Get mentioned in industry publications, directories, podcast guest appearances
14. **Implement RSL 1.0 licensing** — Signal to AI crawlers how content can be used

---

## Schema Recommendations

**Already implemented:**
- Person schema (sitewide)
- WebSite schema (sitewide)
- Article schema (thinking + work pages)

**Add:**
- `FAQPage` schema on articles with FAQ sections
- `HowTo` schema on process-oriented articles
- `VideoObject` schema on podcast page (for the YouTube embed)
- Add `alumniOf` and `award` to Person schema when applicable

---

## Content Reformatting: Specific Rewrites

### Brand Positioning Article — Add Definition Block

**Current opening:**
> "Most founders skip positioning because it feels abstract."

**Recommended rewrite (add before current opening):**
> "Brand positioning is the strategic process of defining what a brand stands for in the minds of its customers — and equally, what it does not. It determines messaging, pricing, product decisions, and hiring. Most founders skip it because it feels abstract..."

This creates a 134-word self-contained passage optimized for AI extraction.

### Pricing Psychology Article — Add Question Heading + Stats

**Change:** `## The Customer Tells You the Price`
**To:** `## How Does Pricing Psychology Work in Retail?`

**Add data point:** "During my 3 years running a grocery shop in Dubai's Deira district, I served an average of 200+ customers daily..."

### Patience Article — Add Definition Block

**Add to opening:**
> "Patience in business is the disciplined practice of sustaining effort during periods when results are invisible. It is not waiting — it is working consistently while outcomes compound silently."

---

## Summary

ashmo.io has **excellent technical foundations** (SSR, schema, llms.txt, clean HTML) but is **weak on the signals that actually drive AI citations**: brand mentions, question-based content structure, definition blocks, and data-rich passages.

**The content reads like premium editorial writing** — which is perfect for human readers. But AI citation engines extract differently. They want:
- Direct answers in the first 60 words
- Question-based headings that match search queries
- Self-contained 134-167 word answer blocks
- Specific statistics and data points
- Entity presence across Wikipedia, Reddit, YouTube

**Priority order:**
1. Fix robots.txt + llms.txt (15 minutes)
2. Add question headings + definition blocks to existing articles (1 hour)
3. Start YouTube + Reddit presence (ongoing)
4. Get FiLLi on Wikipedia (high-impact, medium effort)
