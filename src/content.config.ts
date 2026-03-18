import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const thinking = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/thinking' }),
  schema: z.object({
    title: z.string(),
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

export const collections = { thinking, work };
