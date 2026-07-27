import type { CollectionEntry } from 'astro:content';

export const INSIGHT_STATUSES = [
  'draft',
  'internal-review',
  'claims-review',
  'legal-review',
  'executive-review',
  'approved',
  'published',
  'archived'
] as const;

export type InsightStatus = (typeof INSIGHT_STATUSES)[number];
export type InsightEntry = CollectionEntry<'blog'>;

export const isPublishedInsight = (entry: InsightEntry): boolean => entry.data.status === 'published';

export const sortByPublishedDateDesc = (entries: InsightEntry[]): InsightEntry[] =>
  [...entries].sort((a, b) => b.data.publishedAt.getTime() - a.data.publishedAt.getTime());

export const normalizeTaxonomySlug = (value: string): string =>
  value
    .toLowerCase()
    .trim()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

export const getEntryCanonicalPath = (entry: InsightEntry): string => {
  const canonical = entry.data.canonical?.trim();
  if (canonical) {
    try {
      const url = new URL(canonical);
      return url.pathname.endsWith('/') ? url.pathname : `${url.pathname}/`;
    } catch {
      // If canonical is not parseable, fall back to managed route path.
    }
  }

  return `/insights/${entry.data.slug}/`;
};

export const estimateReadingMinutes = (markdownBody: string | undefined): number => {
  const plain = (markdownBody ?? '')
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`]*`/g, ' ')
    .replace(/\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/[#>*_~\-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  if (!plain) {
    return 1;
  }

  const words = plain.split(' ').length;
  return Math.max(1, Math.ceil(words / 200));
};
