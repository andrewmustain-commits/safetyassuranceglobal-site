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
- `docs/content/README.md` — internal content governance library overview and reading order
- `.github/workflows/pr-build.yml` — PR build validation workflow

For internal governance standards and document hierarchy, see `docs/content/README.md`.

## Local development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Governed Insights publishing

Public Insights routes publish only posts with `status: published`.

Required frontmatter includes:

- `title`
- `slug`
- `description`
- `author`
- `publishedAt`
- `status`
- `category`
- `tags`
- `featured`
- `source`
- `claimsReview`
- `legalReview`
- `executiveApproval`
- `redirectFrom`

Non-public states (`draft`, review states, `approved`, `archived`) remain excluded from public Insights routes.

Governance commands:

- `npm run blog:status`
- `npm run blog:claims`
- `npm run blog:validate`
- `npm run blog:import -- <path>`

## Cloudflare Pages deployment

The production Pages and Pages Functions configuration is versioned in `wrangler.jsonc`. Deployments are gated through GitHub Actions from `main`; preview deployments use the explicit preview environment. Account secrets, custom-domain activation, DNS, WAF, and rate-limiting controls remain managed in Cloudflare.

See `docs/website/CLOUDFLARE-PRODUCTION.md` for the environment contract, required GitHub and Cloudflare secrets, custom-domain/DNS path, security and caching defaults, release checks, and the documented decision not to add the Next.js-only `@opennextjs/cloudflare` adapter to this Astro repository.

## CI validation

Every pull request triggers GitHub Actions workflow `.github/workflows/pr-build.yml` to install dependencies and verify a successful Astro build.
