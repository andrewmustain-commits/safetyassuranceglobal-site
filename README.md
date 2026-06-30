# Safety Assurance Global Site

Astro public website for Safety Assurance Global, optimized for Cloudflare Pages.

## Pages

- Home
- About
- Services
- Industries
- Training
- Academy
- Blog
- Contact
- Privacy Policy
- Terms

## Governed blog publishing

Blog content lives in `content/blog` and is governed by frontmatter `status`:

- `approved`: publicly visible in blog listings and routes
- `draft`: not publicly routable

See `/docs/blog-publishing-workflow.md` for publishing governance.

## Local development

```bash
npm install
npm run dev
```

## Validation

```bash
npm run blog:validate
npm run build
```
