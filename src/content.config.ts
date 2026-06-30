import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
<<<<<<< HEAD
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
=======
  loader: glob({ pattern: '**/*.md', base: './content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    status: z.enum(['approved', 'draft']),
  }),
>>>>>>> origin/main
});

export const collections = { blog };
