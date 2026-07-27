import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://safetyassuranceglobal.com',
  output: 'static',
  integrations: [sitemap()]
});
