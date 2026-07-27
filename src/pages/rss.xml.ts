import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';
import { isPublishedInsight, sortByPublishedDateDesc, getEntryCanonicalPath } from '../lib/insights';

const escapeXml = (value: string): string =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\"/g, '&quot;')
    .replace(/'/g, '&apos;');

export async function GET(context: APIContext): Promise<Response> {
  const site = context.site ?? new URL('https://safetyassuranceglobal.com');
  const publishedPosts = sortByPublishedDateDesc((await getCollection('blog')).filter(isPublishedInsight));

  const items = publishedPosts
    .map((post) => {
      const link = new URL(getEntryCanonicalPath(post), site).href;

      return `
      <item>
        <title>${escapeXml(post.data.title)}</title>
        <description>${escapeXml(post.data.description)}</description>
        <link>${escapeXml(link)}</link>
        <guid isPermaLink="true">${escapeXml(link)}</guid>
        <pubDate>${post.data.publishedAt.toUTCString()}</pubDate>
        <author>${escapeXml(post.data.author)}</author>
        <category>${escapeXml(post.data.category)}</category>
      </item>`;
    })
    .join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Safety Assurance Global Insights</title>
    <description>Published insights from Safety Assurance Global.</description>
    <link>${new URL('/insights/', site).href}</link>
    <language>en-us</language>
    ${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      'content-type': 'application/rss+xml; charset=UTF-8'
    }
  });
}
