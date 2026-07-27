import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro:schema';

const publicationStatuses = [
  'draft',
  'internal-review',
  'claims-review',
  'legal-review',
  'executive-review',
  'approved',
  'published',
  'archived'
] as const;

const reviewSchema = z.object({
  required: z.boolean(),
  reviewer: z.string().optional(),
  reviewedAt: z.coerce.date().optional(),
  disposition: z.enum(['pending', 'approved', 'rejected', 'not-required']),
  notes: z.string().optional()
});

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    description: z.string(),
    author: z.string(),
    publishedAt: z.coerce.date(),
    updatedAt: z.coerce.date().optional(),
    status: z.enum(publicationStatuses),
    category: z.string(),
    tags: z.array(z.string()),
    featured: z.boolean().default(false),
    image: z.string().optional(),
    imageAlt: z.string().optional(),
    canonical: z.string().url().optional(),
    source: z.string(),
    claimsReview: reviewSchema,
    legalReview: reviewSchema,
    executiveApproval: reviewSchema,
    draftReason: z.string().optional(),
    redirectFrom: z.array(z.string()).default([])
  })
});

export const collections = { blog };
