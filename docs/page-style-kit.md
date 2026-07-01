# Ashmo Page Style Kit

Use this kit for new public pages so they follow the homepage style: dark grid background, oversized display headline, gradient emphasis, mono labels, pill buttons, stat tiles, and glass feature cards.

## Components

- `PageHero.astro` — first viewport hero, buttons, stats, and optional right-side context panel.
- `PageSection.astro` — reusable section heading wrapper.
- `FeatureGrid.astro` — reusable glass-card grid for features, links, offers, resources, and proof blocks.
- `PageActionPanel.astro` — final CTA panel.

## New Page Starter

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import PageHero from '../components/PageHero.astro';
import PageSection from '../components/PageSection.astro';
import FeatureGrid from '../components/FeatureGrid.astro';
import PageActionPanel from '../components/PageActionPanel.astro';

const features = [
  {
    eyebrow: 'Layer 01',
    title: 'Clear positioning before activity.',
    description: 'Use this card for one concrete feature, proof point, or operating idea.',
    href: '/thinking/',
    metadata: 'Read more',
  },
  {
    eyebrow: 'Layer 02',
    title: 'Systems that survive repetition.',
    description: 'Cards should stay concise, scannable, and decision-oriented.',
  },
];
---

<BaseLayout
  title="Page Title"
  description="Short SEO description for the new page."
>
  <PageHero
    eyebrow="Ashmo / Page category"
    title="Main promise before the"
    highlight="gradient phrase."
    suffix="Optional ending."
    description="One clear paragraph that explains who this page is for and why it matters."
    primary={{ href: '#start', label: 'Start here' }}
    secondary={{ href: '/contact/', label: 'Contact' }}
    stats={[
      { value: '3', label: 'layers' },
      { value: '90', label: 'days' },
      { value: '2026', label: 'updated' },
    ]}
    sideEyebrow="Context"
    sideTitle="The right-side panel gives the page a second anchor."
    sideDescription="Use it for framing, proof, constraints, or a short summary of the page logic."
    sideCards={[
      { eyebrow: 'Best fit', description: 'Use side cards for compact supporting points.' },
    ]}
  />

  <PageSection
    id="start"
    eyebrow="Section label"
    title="Section headline with"
    highlight="emphasis."
    description="Short section description."
  >
    <FeatureGrid items={features} columns="3" />
  </PageSection>

  <PageActionPanel
    eyebrow="Next step"
    title="End with one clear"
    highlight="action."
    description="Keep the CTA specific and practical."
    primary={{ href: '/contact/', label: 'Contact Ashmo' }}
    secondary={{ href: '/thinking/', label: 'Read thinking' }}
  />
</BaseLayout>
```

## Rules

- Use `PageHero` on new public pages unless the page is a dense admin/tool page.
- Put one gradient phrase in the main headline, not every heading.
- Use `FeatureGrid` for repeated cards instead of custom card markup.
- Use `PageActionPanel` for final CTAs instead of one-off CTA sections.
- Keep labels short and in the `mono-label` style.
