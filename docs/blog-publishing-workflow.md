# Blog Publishing Workflow

Safety Assurance Global uses a governed markdown workflow in `content/blog`.

## Required frontmatter

Each post must include:

- `title`
- `description`
- `pubDate`
- `status` (`draft` or `approved`)

## Publishing governance

- `status: draft` keeps a post out of public routes.
- `status: approved` allows a post to appear on `/blog` and `/blog/[slug]`.
- Promotion from draft to approved requires review and merge approval.

## Validation

CI runs:

1. `npm run blog:validate` for frontmatter status compliance.
2. `npm run build` to ensure the approved-only route generation succeeds.
