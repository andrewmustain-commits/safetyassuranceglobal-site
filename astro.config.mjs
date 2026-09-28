import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

const sitemapExcludedPaths = new Set([
  '/academy/',
  '/command/',
  '/terms/'
]);

export default defineConfig({
  site: 'https://safetyassuranceglobal.com',
  output: 'static',
  trailingSlash: 'always',
  integrations: [
    sitemap({
      filter: (page) => {
        const pathname = new URL(page).pathname;
        if (sitemapExcludedPaths.has(pathname)) return false;
        if (pathname.startsWith('/insights/category/') || pathname.startsWith('/insights/tag/')) return false;
        return true;
      }
    })
  ]
});
