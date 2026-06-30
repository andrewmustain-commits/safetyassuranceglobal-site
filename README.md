# Safety Assurance Global Public Website

Safety Assurance Global (SAG) public website built with Astro + TypeScript as a static site, including a governed Markdown blog workflow.

## Tech stack

- Astro
- TypeScript
- Static Site Generation (SSG)
- Cloudflare Pages compatible output

## Project structure

- `src/pages/` — website pages (Home, About, Services, Industries, Training, Academy, Blog, Contact, Privacy Policy, Terms of Use)
- `src/content/blog/` — governed Markdown blog posts
- `src/content.config.ts` — blog content schema and frontmatter validation
- `docs/blog-publishing-workflow.md` — approval workflow for Marblism/Penny exports
- `.github/workflows/pr-build.yml` — PR build validation workflow

## Local development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Governed blog publishing

The blog only publishes posts with `status: approved`.

Required blog frontmatter:

- `title`
- `date`
- `author`
- `category`
- `tags`
- `summary`
- `status`
- `source`
- `slug`

Draft posts (`status: draft`) remain private and are not listed or generated as public pages.

## Cloudflare Pages deployment

1. Connect this repository in Cloudflare Pages.
2. Configure build settings:
   - **Framework preset:** Astro
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
   - **Node.js version:** 20+
3. Deploy from your production branch (e.g., `main`).
4. Ensure Pull Request previews are enabled in Cloudflare Pages settings.

## CI validation

Every pull request triggers GitHub Actions workflow `.github/workflows/pr-build.yml` to install dependencies and verify a successful Astro build.
