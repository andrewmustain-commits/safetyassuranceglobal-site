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
  integrations: [
    sitemap({
      filter: (page) => !sitemapExcludedPaths.has(new URL(page).pathname)
    })
  ]
});
