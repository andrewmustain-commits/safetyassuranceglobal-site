import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'zod/v4';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    author: z.string(),
    category: z.string(),
    tags: z.array(z.string()),
    summary: z.string(),
    status: z.enum(['approved', 'draft']),
    source: z.string(),
    slug: z.string()
  })
});

export const collections = { blog };
