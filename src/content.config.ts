import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const thinking = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/thinking' }),
  schema: z.object({
    title: z.string(),
    metaTitle: z.string().optional(),
    description: z.string(),
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    pillar: z.enum([
      'merchant-mindset',
      'brand-growth',
      'ai-selling',
      'habit-philosophy',
      'founder-documentary',
    ]),
    tags: z.array(z.string()).max(3).default([]),
    featured: z.boolean().default(false),
    published: z.boolean().default(true),
    image: z.string().optional(),
    imageAlt: z.string().optional(),
  }),
});

const work = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/work' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    category: z.string(),
    tags: z.array(z.string()).max(3).default([]),
    published: z.boolean().default(true),
    image: z.string().optional(),
    imageAlt: z.string().optional(),
  }),
});

const fnbConcepts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/fnb-concepts' }),
  schema: z.object({
    title: z.string(),
    metaTitle: z.string().optional(),
    metaDescription: z.string(),
    h1: z.string().optional(),
    summary: z.string(),
    category: z.enum([
      'cafe',
      'qsr',
      'beverage',
      'restaurant',
      'cloud-kitchen',
      'dessert',
      'bakery',
      'franchise',
    ]),
    region: z.array(z.string()).default(['UAE']),
    audience: z.array(z.string()).default(['investors', 'operators']),
    risks: z.array(z.string()).default([]),
    checklist: z.array(z.string()).default([]),
    relatedPages: z
      .array(
        z.object({
          title: z.string(),
          href: z.string(),
          eyebrow: z.string().optional(),
        }),
      )
      .default([]),
    faqs: z
      .array(z.object({ q: z.string(), a: z.string() }))
      .default([]),
    ctaType: z.enum(['concept-review', 'growth-system', 'thinking']).default('concept-review'),
    published: z.boolean().default(false),
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    image: z.string().optional(),
    imageAlt: z.string().optional(),
  }),
});

export const collections = { thinking, work, fnbConcepts };
